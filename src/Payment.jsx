import React from 'react'

export default function Payment({ show, setShowPaymentSlide }) {
  return (
     <div
      className={`fixed top-0 right-0 z-[100] h-screen w-[250px] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-500 ease-in-out ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-5 font-semibold text-gray-800">
        Payment Section
      </div>
       <button
        onClick={() => setShowPaymentSlide(false)}
        className="bg-blue-600 text-white px-6 py-2 rounded-md"
      >
       X
      </button>
    </div>
  )
}
