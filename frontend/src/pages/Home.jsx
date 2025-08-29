import React from "react";
import { Link } from "react-router-dom";
import VideoPlayer from "../components/player/VideoPlayer";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-cyan-100 text-cyan-700 py-12 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow">
            Repair It
          </h1>
          <p className="text-lg md:text-xl font-medium">
            Your trusted partner for quick and reliable appliance repairs.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">About Us</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            At Repair It, we specialize in repairing a wide range of household
            appliances including refrigerators, washing machines, ovens, and
            more. With years of experience in the industry, our skilled
            technicians are equipped to handle any repair job with precision and
            care.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We are committed to providing exceptional service and quality
            repairs for all your household appliances. Our team of experienced
            technicians is here to help you get your appliances back in working
            order quickly and efficiently.
          </p>
        </div>
        <div>
          <img
            src="/images/OIP.jpeg"
            alt="Repair Service"
            className="rounded-2xl shadow-xl w-full hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Repair Videos Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-15 space-y-20">
        {/* Fridge Repair */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <VideoPlayer
            sources={[
              "/videos/fridge/1.mp4", 
              "/videos/fridge/2.mp4", 
              "/videos/fridge/3.mp4"
              ]}
          />
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Refrigerator Repair
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We provide expert refrigerator repair services to ensure your food
              stays fresh. Whether it’s cooling issues, leaks, or strange noises,
              our team will diagnose and fix the problem quickly.
            </p>
          </div>
        </div>

        {/* Washing Machine Repair */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Washing Machine Repair
            </h3>
            <p className="text-gray-700 leading-relaxed">
              From drainage problems to unusual vibrations, our washing machine
              repair services cover all major issues. We’ll make sure your
              laundry routine runs smoothly again.
            </p>
          </div>
          <VideoPlayer 
            sources={[
              "/videos/washing/1.mp4",
              "/videos/washing/2.mp4",
              "/videos/washing/3.mp4"
              ]}
            />
        </div>

        {/* AC Repair */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <VideoPlayer
            sources={[
              "/videos/AC/1.mp4", 
              "/videos/AC/2.mp4"
              ]}
            />
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Air Conditioner Repair
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Stay cool and comfortable with our reliable AC repair services.
              We handle everything from gas leaks to cooling inefficiency,
              ensuring your AC works like new.
            </p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gradient-to-r from-red-400 to-rose-500 py-20 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-4">Need a Repair?</h2>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          You can place an order for our repair services through our easy Order
          system. Click below to get started!
        </p>
        <Link
          to="/order"
          className="bg-white text-rose-600 font-semibold py-3 px-6 rounded-xl shadow hover:bg-gray-100 transition"
        >
          Place an Order
        </Link>
        <p className="text-2xl font-bold mt-8">
          Or contact us at:{" "}
          <span className="underline">+977-9800000000</span>
        </p>
        <p className="text-lg mt-3">
          Our staff is ready to listen to your problem and solve it quickly!
        </p>
      </div>
    </div>
  );
}

export default HomePage;

