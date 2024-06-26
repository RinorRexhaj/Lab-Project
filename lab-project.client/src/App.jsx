import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar/Sidebar";

import Dashboard from "./Dashboard/Dashboard";
import Products from "./Products/Products";
import Clients from "./Clients/Clients";

import Orders from "./Orders/Orders";
import Searchbar from "./Searchbar/Searchbar";
import Login from "./Login/Login";
import Cars from "./CarRental/Cars";
import CarDashboard from "./CarReservations/CarDashboard"
import CarRentalList from "./CarRentalFront/CarRentalList";
import CarReservations from "./CarReservations/CarReservations";
import Models from "./Models/Models";
import AccountSettings from "./Settings/AccountSettings";
import axios from "axios";


const App = () => {
  const [token, setToken] = useState("");
  const [session, setSession] = useState(false);
  const [user, setUser] = useState({
    id: 0,
    fullName: "",
    email: "",
    role: "",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [data, setData] = useState([]);

  const [dataFilter, setDataFilter] = useState([]);
  const [emptyResults, setEmptyResults] = useState(false);
  const [category, setCategory] = useState("All Categories");
  const [search, setSearch] = useState("");

  //Refresh Token
  useEffect(() => {
    const mount = async () => {
      let refreshToken = sessionStorage.getItem("RefreshToken");
      if (
        refreshToken !== null &&
        refreshToken !== undefined &&
        refreshToken.length === 36
      ) {
        await refreshData(refreshToken);
        const interval = setInterval(async () => {
          await refreshData(refreshToken, interval);
        }, 600000);
      }
    };
    mount();
  }, [session]);

  const refreshData = async (refreshToken, interval) => {
    const response = await axios
      .get(`https://localhost:7262/Auth/refresh/${refreshToken}`)
      .then((resp) => {
        setToken(resp.data.newToken);
        setUser({
          id: resp.data.id,
          fullName: resp.data.fullName,
          email: resp.data.email,
          role: resp.data.role,
        });
        sessionStorage.setItem("RefreshToken", resp.data.refresh);
        setSession(sessionStorage.length > 0);
      })
      .catch((err) => {
        if (
          err.response.status === 400 ||
          err.response.status === 401 ||
          err.response.status === 403
        ) {
          setSession(false);
          setUser({});
          sessionStorage.clear();
          clearInterval(interval);
        }
      });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const addCart = (item) => {
    let newCart = [...cart];
    let itemInCart = newCart.find((product) => item.name === product.name);
    if (itemInCart) {
      itemInCart.quantity++;
    } else {
      itemInCart = {
        ...item,
        quantity: 1,
      };
      newCart.push(itemInCart);
    }
    setCart(newCart);
  };

  const decrementCart = (item) => {
    let newCart = [...cart];
    let itemInCart = newCart.find((product) => item.name === product.name);
    if (itemInCart) {
      itemInCart.quantity--;
      if (itemInCart.quantity <= 0) {
        removeCart(itemInCart);
      }
    }
    setCart(newCart);
  };

  const removeCart = (itemToRemove) => {
    setCart(cart.filter((product) => product !== itemToRemove));
  };

  return (
    <BrowserRouter>
      <div className="w-full h-screen flex relative overflow-hidden">

        {sessionStorage.length === 0 && <Navigate to="/sign-in" />}
        <Routes>
          <Route
            path="/sign-in"
            element={
              <Login
                setSession={setSession}
                setUser={setUser}
                setToken={setToken}
              />
            }
          />
        </Routes>
        {session && (
          <>
            <Sidebar
              open={sidebarOpen}
              toggleSidebar={toggleSidebar}
              role={user.role}
            />

            <div className="w-full flex flex-col items-center gap-15">

              <Searchbar
                setSession={setSession}
                token={token}
                setToken={setToken}
                user={user}
                setUser={setUser}
                toggleSidebar={toggleSidebar}
                data={data}
                setData={setData}
                dataFilter={dataFilter}
                setDataFilter={setDataFilter}
                setEmptyResults={setEmptyResults}
                category={category}
                setSearch={setSearch}
              />
              <div className="w-full h-full overflow-y-auto z-0 -mt-[74px] p-10 sm:px-6 bg-slate-100">
                <Routes>

                  <Route path="*" element={<Navigate to="/dashboard" />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route
                    path="/dashboard"
                    element={<Dashboard token={token} />}
                  />
                  <Route
                    path="/products"
                    element={
                      <Products
                        token={token}
                        setToken={setToken}
                        user={user}
                        products={data}
                        setProducts={setData}
                        productsFilter={dataFilter}
                        setProductsFilter={setDataFilter}
                        emptyResults={emptyResults}
                        setEmptyResults={setEmptyResults}
                        setCategory={setCategory}
                        search={search}
                      />
                    }
                  />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route
                    path="/settings"
                    element={
                      <AccountSettings
                        user={user}
                        setUser={setUser}
                        token={token}
                      />
                    }
                  />
                 {user.role === "Admin" && <Route
                    path="/Cars"
                    element={
                      <Cars
                      token={token}
                        setToken={setToken}
                        user={user}
                        cars={data}
                        setCars={setData}
                        carsFilter={dataFilter}
                        setCarsFilter={setDataFilter}
                      />
                    }
                  
                  />
                  } 
                  {user.role === "Admin" && <Route
                    path="/Car Dashboard"
                    element={
                      <CarDashboard
                      token={token}
                        setToken={setToken}
                        user={user}
                        cars={data}
                        setCars={setData}
                        carsFilter={dataFilter}
                        setCarsFilter={setDataFilter}
                      />
                    }
                  
                  />
                  } 
                  {user.role === "User" && <Route
                    path="/Rents"
                    element={<CarRentalList cars={data} setCars={setData} user={user}/>}
                  />
                }
                 <Route
                    path="/Car Reservations"
                    element={<CarReservations user={user} />}
                  />
                  
                  {user.role === "Admin" && <Route
                    path="/Models"
                    element={<Models  token={token}
                    setToken={setToken}
                    user={user}
                    Models={data}
                    setModels={setData}
                    ModelsFilter={dataFilter}
                    setModelsFilter={setDataFilter}
                    emptyResults={emptyResults}
                    setEmptyResults={setEmptyResults}
                    search={search}
                    />}
                  />
                  }
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
