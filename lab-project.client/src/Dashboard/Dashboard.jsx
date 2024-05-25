import { useEffect, useState } from "react";
import CardItems from "../components/CardItems";
import Loader from "../components/Loader";
import DashboardTable from "./DashboardTable";
import axios from "axios";

const Dashboard = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    topProducts();
    topClients();
    setLoading(false);
  }, []);
  return (
    <div className="flex flex-col gap-5">
      {/* <h1 className="w-full text-5xl font-semibold flex justify-center items-center">Dashboard</h1> */}
      <CardItems token={token} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <DashboardTable data={products} type={"Products"} />
          <DashboardTable data={clients} type={"Clients"} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
