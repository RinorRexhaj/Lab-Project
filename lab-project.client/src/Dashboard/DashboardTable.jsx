import React, { useEffect } from "react";
import Element from "../components/Element";

const DashboardTable = ({ type, data }) => {
  return (
    <div className="w-full relative min-h-80 shadow-2 bg-white flex flex-col">
      <div className="w-full flex items-center justify-between bg-white py-4 px-8 sm:px-4">
        <h1 className="text-xl font-semibold">Top {type} this month</h1>
      </div>
      <span className="w-full h-[1px] bg-slate-200"></span>
      {data.map((el) => {
        return (
          <Element
            type={type}
            key={el.id}
            id={el.id}
            role={""}
            name={el.name || el.fullName}
            price={el.price}
          />
        );
      })}
    </div>
  );
};

export default DashboardTable;
