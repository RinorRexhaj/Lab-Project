import React, { useEffect } from "react";
import Element from "../components/Element";

const DashboardTable = ({ type, data }) => {
  let euro = new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className="w-full relative min-h-80 shadow-2 bg-white flex flex-col">
      <div className="w-full flex items-center justify-between bg-white py-4 px-8 sm:px-4">
        <h1 className="text-xl font-semibold">Top {type} </h1>
      </div>
      <span className="w-full h-[1px] bg-slate-200"></span>
      {data.map((el, index) => {
        return (
          <div className="w-11/12 flex gap-20 items-center">
            <Element
              type={type}
              key={index}
              id={el.product.id}
              role={""}
              name={el.product.name}
              price={el.product.price}
            />
            <div className="w-80">
              <p className="font-medium text-md">
                <b>Amount Sold:</b> {el.count}
              </p>
              <p className="font-medium text-md">
                <b>Total Revenue:</b> {euro.format(el.count * el.product.price)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardTable;
