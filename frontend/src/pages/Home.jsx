import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg- text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Repair It</h1>
          <p className="text-lg md:text-xl mb-8">
            Your trusted partner for quick and reliable appliance repairs. 
          </p>

        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">About Us</h2>
          <p className="text-gray-700 mb-4">
            At Repair It, we specialize in repairing a wide range of household appliances including refrigerators, washing machines, ovens, and more. With years of experience in the industry, our skilled technicians are equipped to handle any repair job with precision and care.
          </p>
          <p className="text-gray-700">
            We are committed to providing exceptional service and quality repairs for all your household appliances. Our team of experienced technicians is here to help you get your appliances back in working order quickly and efficiently.
          </p>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            alt="Repair Service"
            className="rounded-xl shadow-lg w-full"
          />
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-red-400 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
        <p className="text-gray-700 mb-6">
          You can place an order for our repair services through Order. Click the button below to place order and get started!
        </p>
        <Link
          to="/order"
          className="bg-rose-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-rose-700 transition"
        >
          Place an Order
        </Link>
        <p className="text-3xl font-bold mb-4">Or contact Us at: +977-9800000000</p>
        <br />
        <p className="text-gray-700 mb-6">You can contact our staff and tell us your problem. We will solve it!</p>
      </div>
    </div>
  );
}

export default HomePage;
