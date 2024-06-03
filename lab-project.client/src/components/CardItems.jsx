import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faEye,
  faShoppingBag,
  faShoppingCart,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CardItems = ({ token, total }) => {
  const [users, setUsers] = useState(0);
  const [products, setProducts] = useState(0);
  const [views, setViews] = useState(0);
  let euro = new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "EUR",
  });

  useEffect(() => {
    const viewsResponse = axios
      .get("https://localhost:7262/Clients/active", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        setViews(resp.data);
      });
    const productResponse = axios
      .get("https://localhost:7262/Products/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        setProducts(resp.data);
      });
    const clientResponse = axios
      .get("https://localhost:7262/Clients/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        setUsers(resp.data);
      });
  }, []);

  return (
    <div className="w-full flex tb:flex-wrap justify-between gap-4">
      {/* First Card */}
      <div className="bg-white p-6 rounded-sm border-[1px] border-slate-200 shadow-1 flex flex-col justify-between w-full h-40">
        <FontAwesomeIcon
          icon={faEye}
          className="w-6 h-6 text-gray-600 text-blue-500 rounded-full bg-gray p-2"
        />
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold">{views}</h4>
            <p className="text-slate-500 font-medium">Active Users</p>
          </div>
          <p className="text-green-500 text-sm font-medium">
            0.43% <FontAwesomeIcon icon={faArrowUp} />
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-sm border-[1px] border-slate-200 shadow-1 flex flex-col justify-between w-full h-40">
        <FontAwesomeIcon
          icon={faShoppingCart}
          className="w-6 h-6 text-gray-600 text-blue-500 rounded-full bg-gray p-2"
        />
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold">{euro.format(total)}</h4>
            <p className="text-slate-500 font-medium">Total Profit</p>
          </div>
          <p className="text-green-500 text-sm font-medium">
            4.35% <FontAwesomeIcon icon={faArrowUp} />
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-sm border-[1px] border-slate-200 shadow-1 flex flex-col justify-between w-full h-40">
        <FontAwesomeIcon
          icon={faShoppingBag}
          className="w-6 h-6 text-gray-600 text-blue-500 rounded-full bg-gray p-2"
        />
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold">{products}</h4>
            <p className="text-slate-500 font-medium">Total Product</p>
          </div>
          <p className="text-green-500 text-sm font-medium">
            2.59% <FontAwesomeIcon icon={faArrowUp} />
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-sm border-[1px] border-slate-200 shadow-1 flex flex-col justify-between w-full h-40">
        <FontAwesomeIcon
          icon={faUsers}
          className="w-6 h-6 text-gray-600 text-blue-500 rounded-full bg-gray p-2"
        />
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold">{users}</h4>
            <p className="text-slate-500 font-medium">Total Users</p>
          </div>
          <p className="text-blue-500 text-sm font-medium">
            0.95% <FontAwesomeIcon icon={faArrowDown} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardItems;
