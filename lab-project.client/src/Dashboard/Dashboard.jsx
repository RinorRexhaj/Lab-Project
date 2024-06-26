import { useEffect, useState } from "react";
import CardItems from "../components/CardItems";
import Loader from "../components/Loader";
import DashboardTable from "./DashboardTable";
import axios from "axios";
import ChartComponent from "../components/ChartComponent";

const Dashboard = ({ token, user }) => {
  const [products, setProducts] = useState([]);
  const [productsRevenue, setProductsRevenue] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const months = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  const topAmountProducts = async () => {
    const { data } = await axios.get(
      "https://localhost:7262/Products/top-amount",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setProducts(data);
  };

  const topRevenueProducts = async () => {
    const { data } = await axios.get(
      "https://localhost:7262/Products/top-revenue",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setProductsRevenue(data);
  };

  const topClients = async () => {
    const { data } = await axios.get("https://localhost:7262/Clients/top", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setClients(data);
  };

  const getOrders = async () => {
    const { data } = await axios.get("https://localhost:7262/Orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const newData = data.newOrders.map((o, index) => {
      let total = 0;
      o.forEach((orderTotal) => {
        total += orderTotal.total;
      });
      return { total, name: months[index + 1] };
    });
    setOrders(newData);
    setTotal(data.total);
  };

  const getUsersOrders = async () => {
    const { data } = await axios.get(
      "https://localhost:7262/Orders/" + user.id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const newData = data.newOrders.map((o, index) => {
      let total = 0;
      o.forEach((orderTotal) => {
        total += orderTotal.total;
      });
      return {
        total,
        name: months[parseInt(o[0].order.setDate.substring(5, 7))],
      };
    });
    setOrders(newData);
    setTotal(data.total);
    setProducts(data.newProducts);
    setProductsCount(data.newProducts.length);
  };

  const getTotalCategories = async () => {
    const { data } = await axios.get(
      "https://localhost:7262/Orders/categories",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let categories;
    await axios
      .get("https://localhost:7262/Categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        categories = resp.data;
      });
    categories = categories.map((c) => {
      if (data.some((d) => d.categoryName === c.categoryName))
        return data.find((d) => d.categoryName === c.categoryName);
      else return { ...c, total: 0 };
    });
    setCategories(categories);
  };

  useEffect(() => {
    setLoading(true);
    if (user.role === "Admin") {
      topAmountProducts();
      topRevenueProducts();
      getOrders();
      getTotalCategories();
      topClients();
    } else getUsersOrders();
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <CardItems
        token={token}
        role={user.role}
        userId={user.id}
        total={total}
        productsCount={productsCount}
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          {orders.length > 0 || !loading ? (
            <ChartComponent
              type={"months"}
              data={orders}
              title={user.role === "Admin" ? "Total Revenue" : "Amount Spent"}
              barName={
                user.role === "Admin"
                  ? "Revenue Per Month"
                  : "Amount Spent per Month"
              }
            />
          ) : (
            <div className="w-full relative h-20 shadow-2 bg-white flex flex-col items-center">
              <div className="w-full flex items-center justify-between bg-white py-4 px-8 sm:px-4">
                <h1 className="text-xl font-semibold">
                  You haven't spent any money yet...
                </h1>
              </div>{" "}
            </div>
          )}
          {products.length > 0 ? (
            <DashboardTable
              data={products}
              dataRevenue={productsRevenue}
              type={"Products"}
              key={"Products"}
              role={user.role}
            />
          ) : (
            <div className="w-full relative h-20 shadow-2 bg-white flex flex-col items-center">
              <div className="w-full flex items-center justify-between bg-white py-4 px-8 sm:px-4">
                <h1 className="text-xl font-semibold">
                  You haven't purchased any products yet...
                </h1>
              </div>{" "}
            </div>
          )}
          {user.role === "Admin" && (
            <ChartComponent
              type={"categories"}
              data={categories}
              title={"Top Selling Categories"}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
