import React from 'react';

const Alert = ({ message, type = 'info', onClose, fadeOut }) => {
  const alertStyles = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    danger: 'bg-red-100 border-red-500 text-red-700',
  };

  return (
    <div 
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ pointerEvents: 'none' }} // This ensures that the alert doesn't block any interaction with the page
    >
      <div
        className={`w-full max-w-[400px] border-l-4 p-4 flex items-center rounded shadow-lg relative ${alertStyles[type]}`}
        role="alert"
        style={{ pointerEvents: 'auto' }} // This allows interactions only within the alert box
      >
        <p className="text-lg font-semibold mr-3">{message}</p>
        <button
          onClick={onClose}
          className=" text-lg font-bold text-black hover:text-gray-800"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;
