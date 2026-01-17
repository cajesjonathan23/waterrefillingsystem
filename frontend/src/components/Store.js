import React, { useState } from 'react';
import { Modal, Button, Form, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import html2canvas from 'html2canvas';

const Store = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  
  const [selectedProduct, setSelectedProduct] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleShow = (name, p) => { setSelectedProduct(name); setPrice(p); setShow(true); };

const handleConfirmOrder = async () => {
    // 1. Define the delivery fee constant
    const deliveryFee = 10;
    const finalTotal = (quantity * price) + deliveryFee;

    // 2. Include the updated total in the orderData object
    const orderData = { 
      customer_name: customerName, 
      phone, 
      address, 
      product_name: selectedProduct, 
      quantity, 
      total_amount: finalTotal, // Updated calculation
      payment_method: paymentMethod 
    };

    try {
      const res = await fetch('https://waterrefillingsystem.onrender.com/api/orders', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await res.json();

      if (res.ok) {
        // Update local storage history
        const history = JSON.parse(localStorage.getItem('myOrderHistory') || "[]");
        localStorage.setItem('myOrderHistory', JSON.stringify([
          { id: result.orderId, date: result.date }, 
          ...history
        ]));

        // Set order summary for the receipt modal
        setOrderSummary({ ...orderData, id: result.orderId, date: result.date });
        
        // Close order modal and open receipt
        setShow(false); 
        setShowReceipt(true);
      }
    } catch (e) { 
      console.error(e);
      alert("Error saving order. Please check your connection."); 
    }
  };

  const downloadReceipt = () => {
    const input = document.getElementById('receipt-area');
    html2canvas(input).then(canvas => {
      const link = document.createElement('a');
      link.download = `Receipt_${orderSummary.id}.png`;
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
{/* Ordering Process Steps */}
{/* Ordering Process Steps with Diverse Colors */}
<div className="row justify-content-center mb-5 mt-2 animate__animated animate__fadeIn">
  <div className="col-12 text-center mb-4">
    <h4 className="fw-bold text-secondary text-uppercase" style={{ letterSpacing: '2px' }}>
      How to Order
    </h4>
    <hr className="mx-auto" style={{ width: '50px', height: '3px', backgroundColor: '#0d6efd' }} />
  </div>

  {/* Step 1: Cyan/Water Blue */}
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

  {/* Step 2: Warning/Orange-Gold */}
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

  {/* Step 3: Success/Green */}
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

  {/* Contact Section - Using Purple for contrast */}
  <div className="col-12 mt-4">
    <div className="bg-light border border-start-0 border-end-0 rounded-0 p-3 text-center" style={{ borderLeft: '5px solid #6f42c1', backgroundColor: '#f8f9fa' }}>
      <p className="mb-0 text-dark fw-semibold">
        <i className="bi bi-telephone-outbound-fill text-purple me-2" style={{ color: '#6f42c1' }}></i>
        Questions and clarifications? Contact us at: 
        <span className="ms-2 fw-bold fs-5" style={{ color: '#6f42c1' }}>0912-345-6789</span>
      </p>
    </div>
  </div>
</div>

{/* Products section follows below... */}

        <div className="row justify-content-center">
          {[{ name: "Round Gallon", price: 30, img: "/images/round.png" }, { name: "Slim Gallon", price: 35, img: "/images/slim.jpg" }].map((p, i) => (
            <div key={i} className="col-md-5 mb-4">
              <Card className="text-center shadow-sm border-0 p-3 rounded-4">
                <Card.Img variant="top" src={p.img} style={{ height: '180px', objectFit: 'contain' }} />
                <Card.Body>
                  <Card.Title className="fw-bold">{p.name}</Card.Title>
                  <h3 className="text-primary fw-bold">₱{p.price}.00</h3>
                  <Button onClick={() => handleShow(p.name, p.price)} className="w-100 rounded-pill fw-bold">Order Refill Now</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </Container>

      {/* Checkout Modal */}
      {/* Checkout Modal */}
<Modal show={show} onHide={() => setShow(false)} centered backdrop="static">
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title className="fw-bold">
      <i className="bi bi-cart-check me-2"></i>Order Details
    </Modal.Title>
  </Modal.Header>
  <Modal.Body className="p-4">
    <Form>
      {/* Name Field */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold small">
          <i className="bi bi-person-circle me-1 text-primary"></i> Full Name
        </Form.Label>
        <Form.Control 
          type="text" 
          placeholder="e.g. Juan Dela Cruz" 
          className="rounded-3"
          onChange={(e) => setCustomerName(e.target.value)} 
        />
      </Form.Group>

      {/* Phone Field with numeric-only filter */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold small">
          <i className="bi bi-telephone-fill me-1 text-primary"></i> Phone Number
        </Form.Label>
        <Form.Control 
          type="text" 
          placeholder="09123456789" 
          maxLength="11"
          value={phone}
          className="rounded-3"
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/g, ''); // Removes all non-characters
            setPhone(onlyNums);
          }} 
        />
        <Form.Text className="text-muted" style={{ fontSize: '0.7rem' }}>
          Must be exactly 11 digits.
        </Form.Text>
      </Form.Group>

      {/* Address Field */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold small">
          <i className="bi bi-geo-alt-fill me-1 text-primary"></i> Delivery Address
        </Form.Label>
        <Form.Control 
          as="textarea" 
          rows={2} 
          placeholder="House No., Street, Brgy, City" 
          className="rounded-3"
          onChange={(e) => setAddress(e.target.value)} 
        />
      </Form.Group>

      {/* Quantity Selector */}
      <div className="text-center mb-4 bg-light p-2 rounded-3">
        <Form.Label className="fw-bold small d-block">Quantity</Form.Label>
        <div className="d-flex justify-content-center align-items-center">
          <Button variant="outline-primary" size="sm" onClick={() => setQuantity(Math.max(1, quantity-1))}>
            <i className="bi bi-dash-lg"></i>
          </Button>
          <span className="mx-4 fw-bold fs-4">{quantity}</span>
          <Button variant="outline-primary" size="sm" onClick={() => setQuantity(quantity+1)}>
            <i className="bi bi-plus-lg"></i>
          </Button>
        </div>
      </div>

      {/* Payment Method */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold small">
          <i className="bi bi-credit-card-2-front-fill me-1 text-primary"></i> Payment Method
        </Form.Label>
        <Form.Select className="rounded-3" onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="GCash">GCash</option>
        </Form.Select>
      </Form.Group>

      {/* Policy Checkbox */}
      <div className="p-2 border rounded bg-light mb-3">
        <Form.Check 
          type="checkbox" 
          id="confirm-check"
          label={<span style={{ fontSize: '0.85rem' }}>I confirm all details are correct.</span>}
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
        />
        <small className="text-danger d-block mt-1 ms-4" style={{ fontSize: '0.7rem' }}>
          <i className="bi bi-exclamation-triangle-fill me-1"></i> No refunds once water is refilled.
        </small>
      </div>

      {/* Total Display */}
     {/* Total Display with Breakdown */}
<div className="bg-primary text-white p-3 rounded-4 shadow-sm mt-3">
  <div className="d-flex justify-content-between small opacity-75 mb-1">
    <span>Subtotal ({quantity}x)</span>
    <span>₱{quantity * price}.00</span>
  </div>
  <div className="d-flex justify-content-between small opacity-75 mb-2">
    <span>Delivery Fee</span>
    <span>₱10.00</span>
  </div>
  <hr className="my-2 border-white opacity-25" />
  <div className="d-flex justify-content-between align-items-center">
    <span className="fw-bold">Total to Pay</span>
    {/* This matches your new handleConfirmOrder logic */}
    <h3 className="fw-bold mb-0">₱{(quantity * price) + 10}.00</h3>
  </div>
</div>
    </Form>
  </Modal.Body>
  <Modal.Footer className="border-0 pt-0">
    <Button 
      variant="success" 
      className="w-100 py-2 fw-bold rounded-pill" 
      disabled={!isFormValid} 
      onClick={handleConfirmOrder}
    >
      Place Order <i className="bi bi-arrow-right-short ms-1"></i>
    </Button>
  </Modal.Footer>
</Modal>

      {/* Receipt Modal */}
      {/* Receipt Modal */}
<Modal show={showReceipt} onHide={() => setShowReceipt(false)} centered backdrop="static">
  <Modal.Body className="p-4 text-center">
    <div id="receipt-area" className="p-3 border rounded-4 bg-white text-start shadow-sm">
      <h4 className="text-center fw-bold text-primary">AQUAFLOW RECEIPT</h4>
      <div className="d-flex justify-content-between small px-2">
        <span>Order #{orderSummary?.id}</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
      <hr className="my-2"/>
      <p className="mb-1"><strong>Customer:</strong> {orderSummary?.customer_name}</p>
      <p className="mb-1"><strong>Product:</strong> {orderSummary?.product_name} (x{orderSummary?.quantity})</p>
      <p className="mb-1"><strong>Payment:</strong> {orderSummary?.payment_method}</p>
      <hr className="my-2 border-dashed"/>
      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-bold">Total Amount:</span>
        <h4 className="fw-bold text-primary mb-0">₱{orderSummary?.total_amount}.00</h4>
      </div>
    </div>

    {/* --- CONDITIONAL GCASH SECTION --- */}
    {orderSummary?.payment_method === "GCash" && (
      <div className="mt-3 p-3 rounded-4" style={{ backgroundColor: '#eff6ff', border: '2px dashed #007bff' }}>
        <div className="d-flex align-items-center justify-content-center mb-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/GCash_logo.svg/1200px-GCash_logo.svg.png" alt="GCash" style={{ height: '20px' }} />
          <span className="ms-2 fw-bold text-primary">Payment Instructions</span>
        </div>
        
        {/* Replace this URL with your actual QR code image path */}
        <div className="bg-white p-2 d-inline-block rounded-3 shadow-sm mb-2">
           <img 
            src="/images/your-gcash-qr.png" 
            alt="GCash QR Code" 
            style={{ width: '160px', height: '160px', objectFit: 'contain' }} 
          />
        </div>
        
        <p className="small mb-1 fw-bold">Juan Dela Cruz</p>
        <p className="h5 fw-bold text-dark mb-2">0912 345 6789</p>
        <div className="alert alert-warning py-1 px-2 mb-0" style={{ fontSize: '0.75rem' }}>
          <i className="bi bi-info-circle-fill me-1"></i>
          Please screenshot your <strong>Receipt</strong> and <strong>GCash Confirmation</strong> for our rider's verification.
        </div>
      </div>
    )}

    <div className="d-grid gap-2 mt-4">
      <Button variant="success" className="fw-bold rounded-pill" onClick={downloadReceipt}>
        <i className="bi bi-download me-2"></i>Download Receipt
      </Button>
      <Button variant="primary" className="fw-bold rounded-pill" onClick={() => navigate(`/track?id=${orderSummary.id}`)}>
        Track My Order <i className="bi bi-geo-alt-fill ms-1"></i>
      </Button>
    </div>
  </Modal.Body>
</Modal>
    </div>
  );
};
export default Store;