import React from "react";
import Product from "./Element";

const Invoice = () => {
  return (
    <div className="w-full relative shadow-2 bg-white flex flex-col p-6 gap-10">
      <h2 className="text-3xl font-medium">Order #13456</h2>
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-25 flex-wrap lg:gap-15">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-medium">Roger Culhane</h1>
            <div className="flex flex-col gap-2">
              <p className="text-md font-normal text-slate-400">
                <span className="text-slate-500 font-medium">Email:</span>{" "}
                contact@example.com
              </p>
              <p className="text-md font-normal text-slate-400">
                <span className="text-slate-500 font-medium">Address:</span>{" "}
                2972 Westheimer
              </p>
              <p className="text-md font-normal text-slate-400">
                <span className="text-slate-500 font-medium">Phone:</span>{" "}
                +383-44-434-543
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-medium">Shipping Method</h1>
            <p className="text-lg font-medium text-slate-400">
              FedEx <br /> 3 business days
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-medium">Payment Method</h1>
            <p className="text-lg font-medium text-slate-400">
              MasterCard <br /> **** **** **** 4535
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full relative flex items-center justify-start gap-5 pr-4 sm:flex-wrap outline outline-1 outline-slate-300 rounded-md">
          <Product
            img={"src/components/images/product-01.png"}
            name={"Apple Watch Series 7"}
            price={269}
          />
          <div className="flex items-center gap-15 font-medium text-md md:flex-col md:gap-3 md:text-sm sm:px-6 sm:py-2 sm:flex-row sm:gap-10">
            <p>Qty: 01</p>
            <p>$269.00</p>
          </div>
        </div>
        <div className="w-full relative flex items-center justify-start gap-5  pr-4 sm:flex-wrap outline outline-1 outline-slate-300 rounded-md">
          <Product
            img={"src/components/images/product-03.png"}
            name={"Dell Inspiron 15"}
            price={643}
          />
          <div className="flex items-center gap-15 font-medium text-md md:flex-col md:gap-3 md:text-sm sm:px-6 sm:py-2 sm:flex-row sm:gap-10">
            <p>Qty: 02</p>
            <p>$1286.00</p>
          </div>
        </div>
      </div>
      <div className="w-5/12 md:w-9/12 flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="font-medium">Subtotal</p>
            <p className="font-medium">$1555.00</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Shipping</p>
            <p className="font-medium">$15.00</p>
          </div>
          <span className="h-[1px] w-full bg-slate-300"></span>
          <div className="flex justify-between">
            <p className="font-medium">Total</p>
            <p className="font-medium">$1570.00</p>
          </div>
        </div>
        <div className="flex gap-5 md:flex-col">
          <button className="w-full p-3 rounded-md font-medium outline outline-1 outline-blue-500 text-blue-500 hover:text-blue-700 hover:outline-blue-700 duration-150 ease-linear">
            Download Invoice
          </button>
          <button className="w-full p-3 rounded-md font-medium bg-blue-600 hover:bg-blue-500 duration-150 ease-linear text-white">
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
