"use client"

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoiceGenerator() {
  const [formData, setFormData] = useState({
    sellerDetails: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      pan: "",
      gst: "",
    },
    billingDetails: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      stateCode: "",
    },
    shippingDetails: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      stateCode: "",
    },
    orderDetails: {
      orderNo: "",
      orderDate: "",
    },
    invoiceDetails: {
      invoiceNo: "",
      invoiceDate: "",
    },
    reverseCharge: false,
    items: [
      {
        description: "",
        unitPrice: 0,
        quantity: 0,
        discount: 0,
        taxRate: 18,
        netAmount: 0,
      },
    ],
  });

  const handleInputChange = (e, key, section) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          unitPrice: 0,
          quantity: 0,
          discount: 0,
          taxRate: 18,
          netAmount: 0,
        },
      ],
    }));
  };

  const generatePDF = async () => {
    const input = document.getElementById("invoice");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0);
    pdf.save("invoice.pdf");
  };

  return (
    <div>
      <h1>Create Invoice</h1>

      {/* Seller Details Form */}
      <div>
        <h2>Seller Details</h2>
        <input
          type="text"
          placeholder="Seller Name"
          onChange={(e) => handleInputChange(e, "name", "sellerDetails")}
        />
        <input
          type="text"
          placeholder="Address"
          onChange={(e) => handleInputChange(e, "address", "sellerDetails")}
        />
        {/* Add more inputs as necessary for other fields */}
      </div>

      {/* Items */}
      <div>
        <h2>Items</h2>
        {formData.items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Description"
              onChange={(e) => handleInputChange(e, "description", "items")}
            />
            <input
              type="number"
              placeholder="Unit Price"
              onChange={(e) => handleInputChange(e, "unitPrice", "items")}
            />
            <input
              type="number"
              placeholder="Quantity"
              onChange={(e) => handleInputChange(e, "quantity", "items")}
            />
            {/* More fields for each item */}
          </div>
        ))}
        <button onClick={addItem}>Add Item</button>
      </div>

      {/* Preview and Generate PDF */}
      <div id="invoice">
        <h3>Invoice Preview</h3>
        {/* Display formData here, formatted like an invoice */}
      </div>
      <button onClick={generatePDF}>Download PDF</button>
    </div>
  );
}
