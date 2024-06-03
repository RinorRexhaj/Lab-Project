import { useEffect, useState } from "react";
import CardItems from "../components/CardItems";
import Loader from "../components/Loader";
import DashboardTable from "./DashboardTable";
import axios from "axios";
import ChartComponent from "../components/ChartComponent";

const Dashboard = ({ token }) => {
  const [products, setProducts] = useState([]);
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

  const topProducts = async () => {
    const { data } = await axios.get("https://localhost:7262/Products/top", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProducts(data);
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
    const { data } = await axios.get("https://localhost:7262/Orders");
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

  const getTotalCategories = async () => {
    const { data } = await axios.get(
      "https://localhost:7262/Orders/categories",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setCategories(data);
  };

  useEffect(() => {
    setLoading(true);
    topProducts();
    topClients();
    getOrders();
    getTotalCategories();
    setLoading(false);
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <CardItems token={token} total={total} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <ChartComponent
            type={"months"}
            data={orders}
            title={"Total Revenue"}
          />
          <ChartComponent
            type={"categories"}
            data={categories}
            title={"Top Selling Categories"}
          />
          <DashboardTable data={products} type={"Products"} key={"Products"} />
          {/* <DashboardTable data={clients} type={"Clients"} /> */}
        </>
      )}
    </div>
  );
};

export default Dashboard;
