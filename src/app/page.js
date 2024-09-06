"use client";

import { useState } from "react";
import jsPDF from "jspdf";

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
    placeOfSupply: "",
    placeOfDelivery: "",
    orderDetails: {
      orderNo: "",
      orderDate: "",
    },
    invoiceDetails: {
      invoiceNo: "",
      invoiceDate: "",
    },
    reverseCharge: "No",
    items: [
      {
        description: "",
        unitPrice: 0,
        quantity: 0,
        discount: 0,
        netAmount: 0,
        taxRate: 18,
        taxAmount: 0,
      },
    ],
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [signature, setSignature] = useState(null);

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

  const handleItemChange = (index, key, value) => {
    const items = [...formData.items];
    items[index][key] = value;
    items[index].netAmount =
      items[index].unitPrice * items[index].quantity - items[index].discount;
    items[index].taxAmount =
      items[index].netAmount * (items[index].taxRate / 100);
    setFormData((prev) => ({
      ...prev,
      items: items,
    }));
    updateTotal();
  };

  const updateTotal = () => {
    let total = 0;
    formData.items.forEach((item) => {
      total += item.netAmount + item.taxAmount;
    });
    setTotalAmount(total);
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
          netAmount: 0,
          taxRate: 18,
          taxAmount: 0,
        },
      ],
    }));
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignature(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = async () => {
    const pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text("Invoice", 10, 10);

    pdf.setFontSize(12);
    pdf.text("Seller Details:", 10, 20);
    pdf.text(`Name: ${formData.sellerDetails.name}`, 10, 30);
    pdf.text(
      `Address: ${formData.sellerDetails.address}, ${formData.sellerDetails.city}, ${formData.sellerDetails.state}, ${formData.sellerDetails.pincode}`,
      10,
      40
    );
    pdf.text(`PAN: ${formData.sellerDetails.pan}`, 10, 50);
    pdf.text(`GST: ${formData.sellerDetails.gst}`, 10, 60);

    pdf.text("Billing Details:", 10, 70);
    pdf.text(`Name: ${formData.billingDetails.name}`, 10, 80);
    pdf.text(
      `Address: ${formData.billingDetails.address}, ${formData.billingDetails.city}, ${formData.billingDetails.state}, ${formData.billingDetails.pincode}`,
      10,
      90
    );
    pdf.text(`State/UT Code: ${formData.billingDetails.stateCode}`, 10, 100);

    pdf.text("Items:", 10, 110);
    let yOffset = 120;
    formData.items.forEach((item, index) => {
      pdf.text(`${index + 1}. ${item.description}`, 10, yOffset);
      pdf.text(`Unit Price: ${item.unitPrice}`, 50, yOffset);
      pdf.text(`Qty: ${item.quantity}`, 90, yOffset);
      pdf.text(`Discount: ${item.discount}`, 120, yOffset);
      pdf.text(`Net: ${item.netAmount}`, 150, yOffset);
      pdf.text(`Tax: ${item.taxAmount}`, 180, yOffset);
      yOffset += 10;
    });

    pdf.text(`Total Amount: ${totalAmount}`, 10, yOffset + 10);

    if (signature) {
      const img = new Image();
      img.src = signature;
      pdf.addImage(img, "JPEG", 10, yOffset + 20, 50, 30);
      pdf.text("Authorized Signature", 10, yOffset + 60);
    }

    pdf.save("invoice.pdf");
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>

      {/* Seller Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Seller Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="Name"
            onChange={(e) => handleInputChange(e, "name", "sellerDetails")}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="Address"
            onChange={(e) => handleInputChange(e, "address", "sellerDetails")}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="City"
            onChange={(e) => handleInputChange(e, "city", "sellerDetails")}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="State"
            onChange={(e) => handleInputChange(e, "state", "sellerDetails")}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="Pincode"
            onChange={(e) => handleInputChange(e, "pincode", "sellerDetails")}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="PAN"
            onChange={(e) => handleInputChange(e, "pan", "sellerDetails")}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="GST"
            onChange={(e) => handleInputChange(e, "gst", "sellerDetails")}
          />
        </div>
      </div>

      {/* Billing Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Billing Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="Name"
            onChange={(e) => handleInputChange(e, "name", "billingDetails")}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="Address"
            onChange={(e) => handleInputChange(e, "address", "billingDetails")}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="City"
            onChange={(e) => handleInputChange(e, "city", "billingDetails")}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="State"
            onChange={(e) => handleInputChange(e, "state", "billingDetails")}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="Pincode"
            onChange={(e) => handleInputChange(e, "pincode", "billingDetails")}
          />
          <input
            className="p-2 border rounded"
            type="text"
            placeholder="State Code"
            onChange={(e) =>
              handleInputChange(e, "stateCode", "billingDetails")
            }
          />
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Items</h2>
        {formData.items.map((item, index) => (
          <div className="grid grid-cols-6 gap-4 mb-2" key={index}>
            <input
              className="p-2 border rounded"
              type="text"
              placeholder="Description"
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
            />
            <input
              className="p-2 border rounded"
              type="number"
              placeholder="Unit Price"
              onChange={(e) =>
                handleItemChange(index, "unitPrice", parseFloat(e.target.value))
              }
            />
            <input
              className="p-2 border rounded"
              type="number"
              placeholder="Quantity"
              onChange={(e) =>
                handleItemChange(index, "quantity", parseFloat(e.target.value))
              }
            />
            <input
              className="p-2 border rounded"
              type="number"
              placeholder="Discount"
              onChange={(e) =>
                handleItemChange(index, "discount", parseFloat(e.target.value))
              }
            />
            <input
              className="p-2 border rounded"
              type="number"
              placeholder="Tax Rate"
              onChange={(e) =>
                handleItemChange(index, "taxRate", parseFloat(e.target.value))
              }
            />
          </div>
        ))}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addItem}
        >
          Add Item
        </button>
      </div>

      {/* Signature */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Signature</h2>
        <input
          className="p-2 border rounded"
          type="file"
          accept="image/*"
          onChange={handleSignatureUpload}
        />
        {signature && <img src={signature} alt="signature" className="mt-4" />}
      </div>

      {/* PDF Button */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={generatePDF}
      >
        Download PDF
      </button>
    </div>
  );
}
