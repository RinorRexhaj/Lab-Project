import React, { useState } from "react";
import Element from "../components/Element";

const DashboardTable = ({ type, data, dataRevenue, role }) => {
  const [currentButton, setCurrentButton] = useState("Amount");
  const [products, setProducts] = useState(data);
  let euro = new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className="w-full relative min-h-80 shadow-2 bg-white flex flex-col">
      <div className="w-full flex items-center justify-between bg-white py-4 px-8 sm:px-4">
        <h1 className="text-xl font-semibold">
          {role === "Admin" ? `Top ${type}` : `Recently Purchased ${type}`}
        </h1>
        <div>
          <button
            className={`w-20 h-8 font-medium rounded-md ${
              currentButton === "Amount"
                ? "bg-blue-500 text-white"
                : "bg-slate-50 text-blue-500"
            } duration-150 ease-linear`}
            onClick={() => {
              setCurrentButton("Amount");
              setProducts(data);
            }}
          >
            Amount
          </button>
          <button
            className={`w-20 h-8 font-medium rounded-md ${
              currentButton === "Revenue"
                ? "bg-blue-500 text-white"
                : "bg-slate-50 text-blue-500"
            } duration-150 ease-linear`}
            onClick={() => {
              setCurrentButton("Revenue");
              setProducts(dataRevenue);
            }}
          >
            Revenue
          </button>
        </div>
      </div>
      <span className="w-full h-[1px] bg-slate-200"></span>
      <div className="h-96 overflow-y-auto">
        {products.map((el, index) => {
          return (
            <div className="w-11/12 flex gap-20 items-center px-6">
              <Element
                type={type}
                key={index}
                id={role === "Admin" ? el.product.id : el.id}
                role={""}
                name={role === "Admin" ? el.product.name : el.name}
                price={role === "Admin" ? el.product.price : el.price}
              />
              {role === "Admin" && (
                <div className="w-80">
                  <p className="font-medium text-md">
                    <b>Amount Sold:</b> {el.count}
                  </p>
                  <p className="font-medium text-md">
                    <b>Total Revenue:</b>{" "}
                    {euro.format(el.count * el.product.price)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardTable;
