import React from "react";
import { Link } from "react-router-dom";
import VideoPlayer from "../components/player/VideoPlayer";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 text-white py-20 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            रिपेयर इट
          </h1>
          <p className="text-lg md:text-xl font-medium opacity-90">
            छिटो र भरपर्दो उपकरण मर्मतका लागि तपाईंको विश्वासिलो साझेदार
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">हाम्रो बारेमा</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            रिपेयर इटमा, हामी फ्रिज, वाशिङ मेसिन, ओभन लगायत विभिन्न घरायसी
            उपकरणहरूको मर्मतमा विशेषज्ञता राख्छौं। हाम्रो अनुभवी प्राविधिक टोली
            कुनै पनि मर्मत कामलाई ध्यानपूर्वक र गुणस्तरीय तरिकाले सम्पन्न गर्न
            तयार छ।
          </p>
          <p className="text-gray-700 leading-relaxed">
            हामी तपाईंलाई उत्कृष्ट सेवा र भरपर्दो मर्मत सुविधा प्रदान गर्न
            प्रतिबद्ध छौं, ताकि तपाईंका उपकरणहरू छिटो र सहज रूपमा फेरि प्रयोगमा
            आउन सकून्।
          </p>
        </div>
        <div>
          <img
            src="/images/OIP.jpeg"
            alt="Repair Service"
            className="rounded-2xl shadow-2xl w-full hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Repair Videos Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 space-y-20">
        {/* Fridge Repair */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <VideoPlayer
            sources={["/videos/fridge/1.mp4", "/videos/fridge/2.mp4", "/videos/fridge/3.mp4"]}
          />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">फ्रिज मर्मत सेवा</h3>
            <p className="text-gray-700 leading-relaxed">
              हामी विशेषज्ञ फ्रिज मर्मत सेवा प्रदान गर्छौं जसले तपाईंको खानेकुरा
              लामो समय ताजा रहोस्। चिसो नहुने, चुहावट वा अनौठो आवाज जस्ता
              समस्या भए पनि हाम्रो टोली छिटो समाधान गर्नेछ।
            </p>
          </div>
        </div>

        {/* Washing Machine Repair */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">वाशिङ मेसिन मर्मत</h3>
            <p className="text-gray-700 leading-relaxed">
              निकास समस्या, अनौठो कम्पन वा अन्य समस्या भए पनि हाम्रो वाशिङ मेसिन
              मर्मत सेवा सबै प्रमुख समस्याहरू समाधान गर्छ। हामी तपाईंको कपडा धुने
              कार्यलाई फेरि सहज बनाउनेछौं।
            </p>
          </div>
          <VideoPlayer
            sources={["/videos/washing/1.mp4", "/videos/washing/2.mp4", "/videos/washing/3.mp4"]}
          />
        </div>

        {/* AC Repair */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <VideoPlayer sources={["/videos/AC/1.mp4", "/videos/AC/2.mp4"]} />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">एयर कन्डिसनर मर्मत</h3>
            <p className="text-gray-700 leading-relaxed">
              हाम्रो भरपर्दो एसी मर्मत सेवाबाट तपाईं शान्त र आरामदायी रहन सक्नुहुन्छ।
              ग्यास चुहावटदेखि चिसोपन समस्या सम्म सबै कुरा हामी ह्यान्डल गर्छौं,
              तपाईंको एसी नयाँ जस्तै काम गर्ने सुनिश्चित गर्दै।
            </p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gradient-to-r from-rose-500 to-red-600 py-20 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-4">मर्मत आवश्यक छ?</h2>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto opacity-90">
          हाम्रो सजिलो अर्डर प्रणाली मार्फत तपाईं हाम्रो मर्मत सेवाको अर्डर राख्न सक्नुहुन्छ।
        </p>
        <Link
          to="/order"
          className="bg-white text-rose-600 font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition"
        >
          अर्डर गर्नुहोस्
        </Link>
        <p className="text-2xl font-bold mt-8">
          वा हामीलाई सम्पर्क गर्नुहोस्:{" "}
          <span className="underline">+977-9800000000</span>
        </p>
        <p className="text-lg mt-3 opacity-90">
          हाम्रो टोली तपाईंको समस्या छिटो समाधान गर्न तयार छ!
        </p>
      </div>
    </div>
  );
}

export default HomePage;
