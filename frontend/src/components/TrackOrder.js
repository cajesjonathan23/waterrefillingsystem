import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, ListGroup, Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import html2canvas from 'html2canvas';

const TrackOrder = () => {
  const [id, setId] = useState("");
  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myOrderHistory') || "[]");
    setHistory(saved);
    const params = new URLSearchParams(location.search);
    const urlId = params.get('id');
    if (urlId) { setId(urlId); fetchOrder(urlId); }
  }, [location]);

  const fetchOrder = async (searchId) => {
    const res = await fetch(`https://waterrefillingsystem.onrender.com/api/orders/${searchId}`);
    if (res.ok) setOrder(await res.json());
  };

  const downloadReceipt = () => {
    const input = document.getElementById('receipt-view');
    html2canvas(input).then(canvas => {
      const link = document.createElement('a');
      link.download = `Receipt_${order.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="bg-light min-vh-100">
      <Header isAdmin={false} />
      <Container className="py-4">
        <div className="row">
          {/* Sidebar History */}
          <div className="col-md-4 mb-4">
            <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
              <Card.Header className="bg-dark text-white fw-bold py-3">
                <i className="bi bi-clock-history me-2"></i> Recent Orders
              </Card.Header>
              <ListGroup variant="flush">
                {history.map(h => (
                  <ListGroup.Item 
                    key={h.id} 
                    action 
                    onClick={() => { setId(h.id); fetchOrder(h.id); }} 
                    // CUSTOM STYLE: Replaces blue with Dark Grey when active
                    style={id == h.id ? { backgroundColor: '#343a40', color: 'white', borderColor: '#343a40' } : {}}
                    className="py-3 border-bottom"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className={`bi ${id == h.id ? 'bi-box-seam-fill' : 'bi-box-seam'} me-2`}></i>
                        <strong>Order #{h.id}</strong>
                      </div>
                      <i className="bi bi-chevron-right small"></i>
                    </div>
                    <small className={id == h.id ? "text-light" : "text-muted"}>
                      <i className="bi bi-calendar3 me-1"></i> {h.date}
                    </small>
                  </ListGroup.Item>
                ))}
                {history.length === 0 && (
                  <ListGroup.Item className="text-center py-4 text-muted small">No history found</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </div>

          {/* Tracking Main View */}
          <div className="col-md-8">
            <Card className="shadow-sm border-0 p-4 rounded-4">
              <h4 className="fw-bold mb-4 d-flex align-items-center">
                <i className="bi bi-geo-alt-fill text-primary me-2"></i> Tracking Status
              </h4>
              <Form onSubmit={e => { e.preventDefault(); fetchOrder(id); }} className="d-flex mb-4">
                <Form.Control 
                  type="text" 
                  placeholder="Enter Order ID"
                  value={id} 
                  onChange={e => setId(e.target.value)} 
                  className="me-2 rounded-pill px-3" 
                />
                <Button type="submit" className="rounded-pill px-4 fw-bold">
                  <i className="bi bi-search me-1"></i> Track
                </Button>
              </Form>

              {order ? (
                <div className="text-center py-4 animate__animated animate__fadeIn">
                  {/* Icon changes based on status */}
                  <div className="mb-3">
                     {order.status === 'Pending' && <i className="bi bi-hourglass-split display-1 text-warning"></i>}
                     {order.status === 'Process' && <i className="bi bi-gear-wide-connected display-1 text-info rotate-icon"></i>}
                     {order.status === 'On the Way' && <i className="bi bi-bicycle display-1 text-primary"></i>}
                     {order.status === 'Delivered' && <i className="bi bi-check-all display-1 text-success"></i>}
                     {order.status === 'Cancelled' && <i className="bi bi-x-circle display-1 text-danger"></i>}
                  </div>

                  <h2 className="text-dark fw-bold text-uppercase mb-1">{order.status}</h2>
                  <p className="text-muted mb-4">Thank you for trusting!</p>

                  <div className="progress mt-3 mb-4" style={{ height: '12px', borderRadius: '10px' }}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                      style={{ width: order.status === 'Pending' ? '20%' : order.status === 'Process' ? '40%' : order.status === 'On the Way' ? '70%' : '100%' }}></div>
                  </div>
                  
                  <Button variant="outline-dark" className="rounded-pill fw-bold px-4" onClick={() => setShowReceipt(true)}>
                    <i className="bi bi-file-earmark-text me-2"></i> View Full Receipt
                  </Button>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                   <i className="bi bi-search display-4 d-block mb-3 opacity-25"></i>
                   Enter an Order ID above to see the delivery status.
                </div>
              )}
            </Card>
          </div>
        </div>
      </Container>

      {/* Receipt Modal */}
      <Modal show={showReceipt} onHide={() => setShowReceipt(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
        <Modal.Body className="p-4 pt-0">
          <div id="receipt-view" className="p-4 border bg-white rounded shadow-sm">
            <div className="text-center mb-4">
               <h4 className="fw-bold text-primary mb-0">AQUAFLOW STATION</h4>
               <small className="text-muted">Quality Purified Water</small>
            </div>
            <hr className="dashed"/>
            <div className="d-flex justify-content-between mb-2"><span>Order ID:</span><strong>#{order?.id}</strong></div>
            <div className="d-flex justify-content-between mb-2"><span>Date:</span><strong>{order?.order_date}</strong></div>
            <div className="d-flex justify-content-between mb-2"><span>Customer:</span><strong>{order?.customer_name}</strong></div>
            <hr className="dashed"/>
            <div className="d-flex justify-content-between mb-2"><span>Items:</span><strong>{order?.product_name} (x{order?.quantity})</strong></div>
            <div className="d-flex justify-content-between mb-2"><span>Payment:</span><strong>{order?.payment_method}</strong></div>
            <div className="bg-light p-3 mt-3 rounded text-center">
               <span className="small d-block text-muted text-uppercase">Total Paid</span>
               <h3 className="fw-bold mb-0">₱{order?.total_amount}.00</h3>
            </div>
          </div>
          <Button variant="success" className="w-100 mt-3 py-2 fw-bold rounded-pill" onClick={downloadReceipt}>
            <i className="bi bi-download me-2"></i> Download as Image
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TrackOrder;