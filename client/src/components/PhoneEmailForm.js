// PhoneEmailForm.js
import React, { useState } from 'react';
import { PiCircleNotch } from 'react-icons/pi';

const PhoneEmailForm = ({ method, formData, onMethodChange, onFormDataChange, onSubmit, isProcessing }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-10 w-full">
      <div className="text-left flex flex-col w-full">
        <div className="w-full flex">
          <button
            type="button"
            className={`px-4 w-1/2 py-2 ${method === "phone" ? "border-b-4 text-black border-blue-500" : "text-gray-500"}`}
            onClick={() => onMethodChange("phone")}
          >
            Phone (UK Only)
          </button>
          <button
            type="button"
            className={`px-4 w-1/2 py-2 ${method === "email" ? "border-b-4 text-black border-blue-500" : "text-gray-500"}`}
            onClick={() => onMethodChange("email")}
          >
            Email
          </button>
        </div>
        {method === 'phone' ? (
          <div className="flex space-x-2 mt-4">
            <input
              type="text"
              name="extention"
              placeholder="+44"
              value={formData.extention}
              onChange={onFormDataChange}
              className="px-3 w-[70px] py-2 border rounded"
              maxLength="4"
              required
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={onFormDataChange}
              className="flex-1 px-3 py-2 border rounded"
              maxLength="10"
              required
            />
          </div>
        ) : (
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={onFormDataChange}
            className="flex-1 px-3 py-2 mt-2 border rounded"
            required
          />
        )}
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700 shadow-sm"
        disabled={isProcessing}
      >
        {isProcessing ? <PiCircleNotch className="animate-spin text-[30px] m-auto" /> : <span>Next</span>}
      </button>
    </form>
  );
};

export default PhoneEmailForm;
