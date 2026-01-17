import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Card, Button, InputGroup } from 'react-bootstrap';
import Header from './Header';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://waterrefillingsystem.onrender.com/api/orders');
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // --- HELPER FUNCTIONS ---
  
  // This fixes the 'getCount' is not defined error
  const getCount = (status) => orders.filter(o => o.status === status).length;

  const updateStatus = async (id, status) => {
    try {
      await fetch(`https://waterrefillingsystem.onrender.com/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      alert("Error updating status.");
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Delete this order permanently?")) {
      try {
        await fetch(`https://waterrefillingsystem.onrender.com/api/orders/${id}`, { method: 'DELETE' });
        fetchOrders();
      } catch (error) {
        alert("Error deleting order.");
      }
    }
  };

  // Logic for Searching and Filtering
  const filteredOrders = orders.filter(o => 
    o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toString().includes(searchTerm)
  );

  const totalSales = orders
    .filter(o => o.status === 'Delivered')
    .reduce((s, o) => s + parseFloat(o.total_amount), 0);

 const exportPDF = () => {
  const doc = new jsPDF();
  
  // Header section
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 153); // Professional Blue
  doc.text("AQUAFLOW STATION", 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("Master Order Sales Report", 14, 28);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 34);

  // Prepare table data
  const tableColumn = ["ID", "Customer", "Product", "Qty", "Amount", "Status"];
  const tableRows = filteredOrders.map(o => [
    `#${o.id}`, 
    o.customer_name, 
    o.product_name, 
    o.quantity, 
    `P${o.total_amount}.00`, 
    o.status
  ]);

  // Generate Table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [13, 110, 253] }, // Primary Blue
    styles: { fontSize: 9 },
  });

  // Calculate total for the specific orders in this PDF
  const pdfTotal = filteredOrders
    .filter(o => o.status === 'Delivered')
    .reduce((s, o) => s + parseFloat(o.total_amount), 0);

  // Add the Total Sales at the bottom of the table
  const finalY = doc.lastAutoTable.finalY + 10; // 10 units below the table
  
  doc.setFontSize(14);
  doc.setTextColor(0); // Back to black
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL DELIVERED SALES: P${pdfTotal.toLocaleString()}.00`, 14, finalY);

  // Optional: Add a small footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150);
  doc.text("--- End of Report ---", 105, finalY + 15, { align: "center" });

  doc.save(`AquaFlow_Sales_Report_${new Date().toLocaleDateString()}.pdf`);
};

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Header isAdmin={true} />
      <Container>
        {/* Statistics Cards */}
        <div className="row mb-3 mt-4">
          <div className="col-md-8 mb-3">
            <Card className="bg-success text-white p-4 border-0 shadow-sm rounded-4 h-100 d-flex flex-row align-items-center justify-content-between">
              <div>
                <small className="text-uppercase fw-bold opacity-75">Total Successful Sales</small>
                <h1 className="fw-bold mb-0">₱{totalSales.toLocaleString()}.00</h1>
              </div>
              <i className="bi bi-wallet2 display-4 opacity-25"></i>
            </Card>
          </div>
          <div className="col-md-4 mb-3">
            <Card className="bg-dark text-white p-4 border-0 shadow-sm rounded-4 h-100 d-flex flex-row align-items-center justify-content-between">
              <div>
                <small className="text-uppercase fw-bold opacity-75">Grand Total Orders</small>
                <h1 className="fw-bold mb-0">{orders.length}</h1>
              </div>
              <i className="bi bi-box-seam display-4 opacity-25"></i>
            </Card>
          </div>
        </div>

        {/* Status Counters Row */}
        <div className="row g-3 mb-4">
          <div className="col-md-2 col-6">
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 border-bottom border-warning border-4">
              <small className="fw-bold text-muted text-uppercase" style={{fontSize: '0.7rem'}}>Pending</small>
              <h3 className="fw-bold text-warning mb-0">{getCount('Pending')}</h3>
            </Card>
          </div>
          <div className="col-md-2 col-6">
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 border-bottom border-info border-4">
              <small className="fw-bold text-muted text-uppercase" style={{fontSize: '0.7rem'}}>Processing</small>
              <h3 className="fw-bold text-info mb-0">{getCount('Process')}</h3>
            </Card>
          </div>
          <div className="col-md-2 col-6">
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 border-bottom border-primary border-4">
              <small className="fw-bold text-muted text-uppercase" style={{fontSize: '0.7rem'}}>On the Way</small>
              <h3 className="fw-bold text-primary mb-0">{getCount('On the Way')}</h3>
            </Card>
          </div>
          <div className="col-md-3 col-6">
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 border-bottom border-success border-4">
              <small className="fw-bold text-muted text-uppercase" style={{fontSize: '0.7rem'}}>Delivered (Done)</small>
              <h3 className="fw-bold text-success mb-0">{getCount('Delivered')}</h3>
            </Card>
          </div>
          <div className="col-md-3 col-12">
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 border-bottom border-danger border-4">
              <small className="fw-bold text-muted text-uppercase" style={{fontSize: '0.7rem'}}>Cancelled</small>
              <h3 className="fw-bold text-danger mb-0">{getCount('Cancelled')}</h3>
            </Card>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-0">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
            <div className="d-flex align-items-center">
              <span className="me-2 fw-bold small text-muted">Show</span>
              <Form.Select 
                size="sm" 
                style={{ width: '85px' }} 
                value={rowsPerPage} 
                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                className="rounded-3 shadow-sm border-primary border-opacity-25"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={99999}>All</option>
              </Form.Select>
              <span className="ms-2 fw-bold small text-muted">Entries</span>
            </div>

            <div className="d-flex gap-2">
              <InputGroup style={{ maxWidth: '280px' }}>
                <InputGroup.Text className="bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search name or ID..." 
                  className="border-start-0 ps-0 shadow-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Button variant="danger" className="fw-bold px-3 rounded-3" onClick={exportPDF}>
                <i className="bi bi-file-earmark-pdf-fill me-1"></i> PDF
              </Button>
            </div>
          </div>

          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-light border-bottom">
                <tr className="text-muted small">
                  <th className="py-3">ID</th>
                  <th className="py-3">CUSTOMER DETAILS</th>
                  <th className="py-3">PRODUCT</th>
                  <th className="py-3">AMOUNT</th>
                  <th className="py-3 text-center">STATUS</th>
                  <th className="py-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.slice(0, rowsPerPage).map(o => (
                    <tr key={o.id}>
                      <td className="text-muted fw-bold">#{o.id}</td>
                      <td>
                        <div className="fw-bold text-dark">{o.customer_name}</div>
                        <small className="text-muted">{o.phone}</small>
                      </td>
                      <td>
                        <div className="small fw-bold">{o.product_name}</div>
                        <div className="small text-muted">Qty: {o.quantity}</div>
                      </td>
                      <td className="fw-bold text-primary">₱{o.total_amount}.00</td>
                      <td>
                        <Form.Select 
                          size="sm" 
                          className="fw-bold text-center border-0 shadow-sm"
                          value={o.status} 
                          onChange={e => updateStatus(o.id, e.target.value)} 
                          disabled={o.status === 'Delivered' || o.status === 'Cancelled'}
                          style={{
                            backgroundColor: o.status === 'Delivered' ? '#d1e7dd' : 
                                            o.status === 'Cancelled' ? '#f8d7da' : '#fff3cd'
                          }}
                        >
                          {(() => {
                            const statuses = ["Pending", "Process", "On the Way", "Delivered"];
                            const currentIdx = statuses.indexOf(o.status);
                            return (
                              <>
                                {statuses.slice(currentIdx).map(st => <option key={st} value={st}>{st}</option>)}
                                {o.status !== 'Delivered' && <option value="Cancelled">Cancelled</option>}
                              </>
                            );
                          })()}
                        </Form.Select>
                      </td>
                      <td className="text-center">
                        <Button variant="link" className="text-danger p-0 shadow-none" onClick={() => deleteOrder(o.id)}>
                          <i className="bi bi-trash3-fill fs-5"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No orders matching your search.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          
          <div className="mt-3 p-2 bg-light rounded-3 d-flex justify-content-between align-items-center">
            <small className="text-muted ms-2">
              Showing <strong>{Math.min(rowsPerPage, filteredOrders.length)}</strong> of {filteredOrders.length} entries
            </small>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Admin;