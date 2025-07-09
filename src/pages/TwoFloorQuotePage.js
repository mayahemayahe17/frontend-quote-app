import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function TwoFloorQuotePage() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      <Header />
      <main
        className="flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url(/images/background.jpg)" }}>
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 w-[400px]">
          <h2 className="text-xl font-semibold mb-4 text-center">
            这是 2F 报价页面
          </h2>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TwoFloorQuotePage;
