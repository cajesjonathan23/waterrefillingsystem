import React, { useState } from 'react';
import { Modal, Button, Form, Container, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import html2canvas from 'html2canvas';

const Store = () => {
  const navigate = useNavigate();
  
  // Modal States
  const [show, setShow] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  
  // Loading & Data States
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  
  // Form States
  const [selectedProduct, setSelectedProduct] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Open Checkout Modal
  const handleShow = (name, p) => { 
    setSelectedProduct(name); 
    setPrice(p); 
    setQuantity(1); // Reset quantity for new selection
    setShow(true); 
  };

  const handleConfirmOrder = async () => {
    const deliveryFee = 10;
    const finalTotal = (quantity * price) + deliveryFee;

    const orderData = { 
      customer_name: customerName, 
      phone, 
      address, 
      product_name: selectedProduct, 
      quantity, 
      total_amount: finalTotal, 
      payment_method: paymentMethod 
    };

    setLoading(true); // START LOADING SPINNER

    try {
      const res = await fetch('https://waterrefillingsystem.onrender.com/api/orders', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await res.json();

      if (res.ok) {
        // Save to Local History
        const history = JSON.parse(localStorage.getItem('myOrderHistory') || "[]");
        localStorage.setItem('myOrderHistory', JSON.stringify([
          { id: result.orderId, date: result.date }, 
          ...history
        ]));

        // Setup Receipt Data
        setOrderSummary({ ...orderData, id: result.orderId, date: result.date });
        
        // Switch Modals
        setShow(false); 
        setShowReceipt(true);
      } else {
        alert("Failed to save order: " + (result.error || "Unknown error"));
      }
    } catch (e) { 
      console.error(e);
      alert("Server is currently waking up or connection is lost. Please try again in a few seconds."); 
    } finally {
      setLoading(false); // STOP LOADING SPINNER
    }
  };

  const downloadReceipt = () => {
    const input = document.getElementById('receipt-area');
    html2canvas(input).then(canvas => {
      const link = document.createElement('a');
      link.download = `Receipt_Order_${orderSummary?.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const isFormValid = customerName && address && phone.length === 11 && isConfirmed;

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Header isAdmin={false} />
      
      <Container>
        {/* Ordering Process Steps */}
        <div className="row justify-content-center mb-5 mt-2 animate__animated animate__fadeIn">
          <div className="col-12 text-center mb-4">
            <h4 className="fw-bold text-secondary text-uppercase" style={{ letterSpacing: '2px' }}>
              How to Order
            </h4>
            <hr className="mx-auto" style={{ width: '50px', height: '3px', backgroundColor: '#0d6efd' }} />
          </div>

          <div className="col-md-3 mb-3">
            <Card className="border-0 shadow-sm text-center h-100 rounded-4 py-3 border-top border-info border-4">
              <Card.Body>
                <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-droplet-fill fs-4"></i>
                </div>
                <h6 className="fw-bold">1. Order</h6>
                <p className="small text-muted mb-0">Select your preferred gallon type.</p>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-1 d-none d-md-flex align-items-center justify-content-center mb-3">
            <i className="bi bi-chevron-right fs-3 text-muted opacity-25"></i>
          </div>

          <div className="col-md-3 mb-3">
            <Card className="border-0 shadow-sm text-center h-100 rounded-4 py-3 border-top border-warning border-4">
              <Card.Body>
                <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-pencil-square fs-4"></i>
                </div>
                <h6 className="fw-bold">2. Information</h6>
                <p className="small text-muted mb-0">Type your delivery details.</p>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-1 d-none d-md-flex align-items-center justify-content-center mb-3">
            <i className="bi bi-chevron-right fs-3 text-muted opacity-25"></i>
          </div>

          <div className="col-md-3 mb-3">
            <Card className="border-0 shadow-sm text-center h-100 rounded-4 py-3 border-top border-success border-4">
              <Card.Body>
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-radar fs-4"></i>
                </div>
                <h6 className="fw-bold">3. Track</h6>
                <p className="small text-muted mb-0">Monitor your delivery status.</p>
              </Card.Body>
            </Card>
          </div>

          <div className="col-12 mt-4">
            <div className="bg-white border-start border-4 border-primary rounded shadow-sm p-3 text-center">
              <p className="mb-0 text-dark fw-semibold">
                <i className="bi bi-telephone-outbound-fill text-primary me-2"></i>
                Questions? Contact us: <span className="ms-2 fw-bold text-primary fs-5">0912-345-6789</span>
              </p>
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div className="row justify-content-center">
          {[{ name: "Round Gallon", price: 30, img: "/images/round.png" }, { name: "Slim Gallon", price: 35, img: "/images/slim.jpg" }].map((p, i) => (
            <div key={i} className="col-md-5 mb-4">
              <Card className="text-center shadow-sm border-0 p-3 rounded-4 overflow-hidden h-100">
                <Card.Img variant="top" src={p.img} style={{ height: '180px', objectFit: 'contain' }} className="mt-2" />
                <Card.Body>
                  <Card.Title className="fw-bold">{p.name}</Card.Title>
                  <h3 className="text-primary fw-bold">₱{p.price}.00</h3>
                  <Button onClick={() => handleShow(p.name, p.price)} className="w-100 rounded-pill fw-bold py-2 mt-2 shadow-sm">
                    Order Refill Now
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </Container>

      {/* Checkout Modal */}
      <Modal show={show} onHide={() => !loading && setShow(false)} centered backdrop="static">
        <Modal.Header closeButton={!loading} className="bg-primary text-white">
          <Modal.Title className="fw-bold small text-uppercase">
            <i className="bi bi-cart-check me-2"></i>Order Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-muted">FULL NAME</Form.Label>
              <Form.Control type="text" placeholder="e.g. Juan Dela Cruz" className="rounded-3 border-primary-subtle" onChange={(e) => setCustomerName(e.target.value)} disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-muted">PHONE NUMBER (11 Digits)</Form.Label>
              <Form.Control type="text" placeholder="09123456789" maxLength="11" value={phone} className="rounded-3 border-primary-subtle" 
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-muted">DELIVERY ADDRESS</Form.Label>
              <Form.Control as="textarea" rows={2} placeholder="House No., Street, Brgy, City" className="rounded-3 border-primary-subtle" onChange={(e) => setAddress(e.target.value)} disabled={loading} />
            </Form.Group>

            <div className="text-center mb-4 bg-light p-3 rounded-4 border border-primary-subtle border-dashed">
              <Form.Label className="fw-bold small d-block mb-2">Quantity</Form.Label>
              <div className="d-flex justify-content-center align-items-center">
                <Button variant="outline-primary" className="rounded-circle p-1" style={{width:'35px', height:'35px'}} onClick={() => setQuantity(Math.max(1, quantity-1))} disabled={loading}>
                  <i className="bi bi-dash-lg"></i>
                </Button>
                <span className="mx-4 fw-bold fs-4">{quantity}</span>
                <Button variant="outline-primary" className="rounded-circle p-1" style={{width:'35px', height:'35px'}} onClick={() => setQuantity(quantity+1)} disabled={loading}>
                  <i className="bi bi-plus-lg"></i>
                </Button>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-muted">PAYMENT METHOD</Form.Label>
              <Form.Select className="rounded-3 border-primary-subtle" onChange={(e) => setPaymentMethod(e.target.value)} disabled={loading}>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="GCash">GCash</option>
              </Form.Select>
            </Form.Group>

            <div className="p-2 border rounded-3 bg-light mb-3">
              <Form.Check type="checkbox" id="confirm-check" label={<span style={{ fontSize: '0.85rem' }}>I confirm all details are correct.</span>} checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} disabled={loading} />
              <small className="text-danger d-block mt-1 ms-4" style={{ fontSize: '0.7rem' }}>
                <i className="bi bi-exclamation-triangle-fill me-1"></i> No refunds once water is refilled.
              </small>
            </div>

            <div className="bg-primary text-white p-3 rounded-4 shadow-sm mt-3">
              <div className="d-flex justify-content-between small opacity-75 mb-1"><span>Subtotal ({quantity}x)</span><span>₱{quantity * price}.00</span></div>
              <div className="d-flex justify-content-between small opacity-75 mb-2"><span>Delivery Fee</span><span>₱10.00</span></div>
              <hr className="my-2 border-white opacity-25" />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total to Pay</span>
                <h3 className="fw-bold mb-0">₱{(quantity * price) + 10}.00</h3>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button 
            variant="success" 
            className="w-100 py-3 fw-bold rounded-pill d-flex align-items-center justify-content-center shadow" 
            disabled={!isFormValid || loading} 
            onClick={handleConfirmOrder}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing Order...
              </>
            ) : (
              <>Place Order <i className="bi bi-arrow-right-short ms-1 fs-5"></i></>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Receipt Modal */}
      <Modal show={showReceipt} onHide={() => setShowReceipt(false)} centered backdrop="static">
        <Modal.Body className="p-4 text-center">
          <div id="receipt-area" className="p-4 border border-2 rounded-4 bg-white text-start shadow-sm mb-4">
            <div className="text-center mb-3">
               <h4 className="fw-bold text-primary mb-0">AQUAFLOW STATION</h4>
               <small className="text-muted text-uppercase">Payment Receipt</small>
            </div>
            <div className="d-flex justify-content-between small opacity-75 mb-2">
              <span>Order ID: <strong>#{orderSummary?.id}</strong></span>
              <span>{orderSummary?.date}</span>
            </div>
            <hr style={{ borderStyle: 'dashed' }}/>
            <p className="mb-1 small"><strong>NAME:</strong> {orderSummary?.customer_name}</p>
            <p className="mb-1 small"><strong>ADDR:</strong> {orderSummary?.address}</p>
            <p className="mb-1 small"><strong>ITEM:</strong> {orderSummary?.product_name} (x{orderSummary?.quantity})</p>
            <p className="mb-1 small"><strong>PAY:</strong> {orderSummary?.payment_method}</p>
            <hr style={{ borderStyle: 'dashed' }}/>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="fw-bold">TOTAL PAID:</span>
              <h3 className="fw-bold text-primary mb-0">₱{orderSummary?.total_amount}.00</h3>
            </div>
          </div>

          {orderSummary?.payment_method === "GCash" && (
            <div className="mb-4 p-3 rounded-4" style={{ backgroundColor: '#eff6ff', border: '2px dashed #007bff' }}>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/GCash_logo.svg/1200px-GCash_logo.svg.png" alt="GCash" style={{ height: '20px' }} />
                <span className="ms-2 fw-bold text-primary">SCAN TO PAY</span>
              </div>
              <div className="bg-white p-2 d-inline-block rounded-3 shadow-sm mb-2">
                 <img src="/images/your-gcash-qr.png" alt="GCash QR" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
              </div>
              <p className="small mb-1 fw-bold">JUAN DELA CRUZ</p>
              <p className="h5 fw-bold text-dark mb-0">0912 345 6789</p>
            </div>
          )}

          <div className="d-grid gap-2">
            <Button variant="success" className="fw-bold rounded-pill py-2" onClick={downloadReceipt}>
              <i className="bi bi-download me-2"></i>Download Image
            </Button>
            <Button variant="primary" className="fw-bold rounded-pill py-2" onClick={() => navigate(`/track?id=${orderSummary.id}`)}>
              Track Delivery <i className="bi bi-geo-alt-fill ms-1"></i>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Store;