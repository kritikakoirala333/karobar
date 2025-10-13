import React from "react";

export default function Payment({ show, setShowPaymentSlide }) {
  return (
    <div
      className={`fixed top-0 right-0 z-[100] h-screen w-1/2  bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-500 ease-in-out ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-10 py-3">
        <div className=" font-semibold text-gray-800 text-3xl">Payment Section</div>
        <div
          onClick={() => setShowPaymentSlide(false)}
          className="font-bold text-xl x-6 py-2 rounded-md cursor-pointer"
        >
          X
        </div>
      </div>
    </div>
  );
}
