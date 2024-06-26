import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCar,
  faMoneyBillTrendUp,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CarDashboard = ({ token, setToken, user, cars, setCars, carsFilter }) => {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [sales, setSales] = useState(0);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [durationData, setDurationData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [timePeriod, setTimePeriod] = useState("7");
  const [filteredBookings, setFilteredBookings] = useState(0);
  const [filteredSales, setFilteredSales] = useState(0);

  useEffect(() => {
    getCars();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("https://localhost:7262/Rents");
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
    getUsers();
    fetchReservations();
  }, []);

  const getUsers = async () => {
    const { data } = await axios.get(`https://localhost:7262/Clients/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(data);
  };

  const getCars = async () => {
    const { data } = await axios.get(`https://localhost:7262/Cars/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCars(data);
    setLoading(false);
  };

  useEffect(() => {
    if (reservations.length && cars.length) {
      let totalSales = 0;
      reservations.forEach((r) => {
        const car = cars.find((car) => car.id === r.carID);
        if (car) {
          totalSales += car.price * r.days;
        }
      });
      setSales(totalSales);
    }
  }, [reservations, cars]);

  useEffect(() => {
    let userCount = users.length;
    users.forEach((u) => {
      if (u.role === "Admin") {
        userCount--;
      }
    });
    setTotalUsers(userCount);
  }, [users]);

  const getTodaysReservations = () => {
    const today = new Date();
    // today.setDate(today.getDate()+1);
    return reservations.filter((reservation) => {
      const reservationDate = new Date(reservation.startDate);
      return reservationDate.toDateString() === today.toDateString();
    });
  };

  const todaysReservations = getTodaysReservations();

  useEffect(() => {
    const durationCounts = {
      "1-6 days": 0,
      "7-14 days": 0,
      "15-30 days": 0,
      "30+ days": 0,
    };

    reservations.forEach((r) => {
      if (r.days <= 6) durationCounts["1-6 days"]++;
      else if (r.days <= 14) durationCounts["7-14 days"]++;
      else if (r.days <= 30) durationCounts["15-30 days"]++;
      else durationCounts["30+ days"]++;
    });

    const durationData = Object.keys(durationCounts).map((key) => ({
      name: key,
      value: durationCounts[key],
    }));

    setDurationData(durationData);
  }, [reservations]);

  const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
  let count = 0;

  useEffect(() => {
    generateSalesData(timePeriod);
    filterBookingsAndSales(timePeriod);
  }, [timePeriod, reservations, cars]);

  const generateSalesData = (days) => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const filteredReservations = reservations.filter(
      (reservation) => new Date(reservation.startDate) >= pastDate
    );

    const salesData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(pastDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateString = date.toLocaleDateString();
      const daySales = filteredReservations
        .filter(
          (reservation) =>
            new Date(reservation.startDate).toLocaleDateString() === dateString
        )
        .reduce(
          (total, reservation) =>
            total +
            cars.find((car) => car.id === reservation.carID)?.price *
              reservation.days,
          0
        );

      salesData.push({ date: dateString, sales: daySales });
    }

    setSalesData(salesData);
  };

  const filterBookingsAndSales = (days) => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const filteredReservations = reservations.filter(
      (reservation) => new Date(reservation.startDate) >= pastDate
    );

    let totalSales = 0;
    filteredReservations.forEach((r) => {
      const car = cars.find((car) => car.id === r.carID);
      if (car) {
        totalSales += car.price * r.days;
      }
    });

    setFilteredBookings(filteredReservations.length);
    setFilteredSales(totalSales);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl text-neutral-600">Car Dashboard</h1>
        <div className="flex gap-6 bg-white rounded-lg p-2">
          <button
            onClick={() => setTimePeriod("7")}
            className={`font-bold p-1 rounded-lg ${
              timePeriod === "7"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-500 hover:text-white transition-all"
            }`}
          >
            Last 7 days
          </button>
          <button
            onClick={() => setTimePeriod("30")}
            className={`font-bold p-1 rounded-lg ${
              timePeriod === "30"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-500 hover:text-white transition-all"
            }`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setTimePeriod("90")}
            className={`font-bold p-1 rounded-lg ${
              timePeriod === "90"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-500 hover:text-white transition-all"
            }`}
          >
            Last 90 days
          </button>
        </div>
      </div>
      <div className="flex mt-15 gap-5 justify-between">
        <div className="bg-white shadow rounded-lg flex items-center p-5 gap-5">
          <FontAwesomeIcon
            icon={faBriefcase}
            className="text-[35px] text-blue-500 bg-blue-200 p-5 rounded-full"
          />
          <div className="flex flex-col pr-12">
            <p className="text-sm text-neutral-400 font-bold">BOOKINGS</p>
            <h1 className="text-3xl font-medium text-black">
              {filteredBookings}
            </h1>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg flex items-center p-5 gap-5">
          <FontAwesomeIcon
            icon={faMoneyBillTrendUp}
            className="text-[35px] text-green-500 bg-green-200 p-5 rounded-full"
          />
          <div className="flex flex-col pr-2">
            <p className="text-sm text-neutral-400 font-bold">SALES</p>
            <h1 className="text-3xl font-medium text-black">
              {filteredSales.toFixed(2)} €
            </h1>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg flex items-center p-5 gap-5">
          <FontAwesomeIcon
            icon={faCar}
            className="text-[35px] text-orange-500 bg-orange-200 p-5 rounded-full"
          />
          <div className="flex flex-col pr-12">
            <p className="text-sm text-neutral-400 font-bold">TOTAL CARS</p>
            <h1 className="text-3xl font-medium text-black">{cars.length}</h1>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg flex items-center p-5 gap-5">
          <FontAwesomeIcon
            icon={faUser}
            className="text-[35px] text-amber-500 bg-amber-200 p-5 rounded-full"
          />
          <div className="flex flex-col pr-12">
            <p className="text-sm text-neutral-400 font-bold">TOTAL USERS</p>
            <h1 className="text-3xl font-medium text-black">{totalUsers}</h1>
          </div>
        </div>
      </div>
      <div className="flex gap-5 mt-10 justify-between">
        <div className="bg-white rounded-lg shadow w-[585px] p-5">
          <h1 className="font-bold text-3xl text-neutral-600">
            Today's Reservations
          </h1>
          <div className="">
            {todaysReservations.map((reservation) => {
              const user = users.find((u) => u.id === reservation.clientID);
              count++;
              return (
                user && (
                  <div
                    key={reservation.rentalID}
                    className="border-b border-gray-200 py-2"
                  >
                    <p>
                      <b>Name:</b> {user.fullName}
                    </p>
                    <p>
                      <b>Email:</b> {user.email}
                    </p>
                  </div>
                )
              );
            })}
          </div>
          <span>
            {count !== 1
              ? `There are ${count} reservations awaiting for today`
              : `There is ${count} reservation awaiting for today`}{" "}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow w-[560px] p-5">
          <h1 className="font-bold text-3xl text-neutral-600">
            Reservation Duration Summary
          </h1>
          <PieChart width={400} height={400}>
            <Pie
              data={durationData}
              cx={180}
              cy={180}
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {durationData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
      <div className="mt-10 bg-white rounded-lg shadow p-5">
        <h1 className="font-bold text-3xl text-neutral-600">
          Sales Over The Last {timePeriod} Days
        </h1>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={salesData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default CarDashboard;
