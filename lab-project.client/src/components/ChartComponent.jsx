import React from "react";
import {
  BarChart,
  Cell,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const ChartComponent = ({ data, type, title }) => {
  let euro = new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "EUR",
  });
  const monthColors = {
    1: "#003f5c",
    2: "#2f4b7c",
    3: "#665191",
    4: "#a05195",
    5: "#d45087",
    6: "#f95d6a",
    7: "#ff7c43",
    8: "#ffa600",
    9: "#003f5c",
    10: "#2f4b7c",
    11: "#665191",
    12: "#a05195",
  };
  const CustomTooltip = ({ payload, label, active }) => {
    if (active) {
      return (
        <div className="relative bottom-20 w-40 h-10 border border-slate-400 p-2 items-center bg-white">
          {label} : {euro.format(payload[0].value)}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full relative min-h-70 shadow-2 bg-white flex flex-col items-center">
      <div className="w-full flex items-center justify-between bg-white py-4 px-8 sm:px-4">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>{" "}
      <span className="w-full h-[1px] bg-slate-200"></span>
      <div className="w-full px-6 py-5 flex flex-wrap gap-10">
        <BarChart width={750} height={300} data={data}>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis
            dataKey={type === "months" ? "name" : "category.categoryName"}
            style={{
              fontWeight: "bold",
            }}
          />
          <YAxis
            style={{
              fontWeight: "bold",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            name={"Revenue Per Month"}
            dataKey="total"
            fill="#003f5c"
            style={{
              fontWeight: "bold",
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index + 1}`}
                fill={monthColors[(index % 20) + 1]}
              />
            ))}
          </Bar>
        </BarChart>
        <div className="relative w-60 max-h-70 flex flex-col flex-wrap gap-5">
          {data.map((d, index) => {
            const color = monthColors[index + 1];
            if (d.total <= 0) return;
            return (
              <div key={index} className="w-25">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-3 bg-[${color}]`}></div>
                  <p>
                    <b>
                      {type === "months" ? d.name : d.category.categoryName}:
                    </b>
                  </p>
                </div>
                <p className="font-medium">{euro.format(d.total)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
