import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Sidebar from "./Sidebar/Sidebar";
import Dashboard from "./Dashboard/Dashboard";
import Products from "./Products/Products";
import Clients from "./Clients/Clients";
import Orders from "./Orders/Orders";
import Searchbar from "./Searchbar/Searchbar";
import Login from "./Login/Login";
import Cars from "./CarRental/Cars";
import CarRentalList from "./CarRentalFront/CarRentalList";
import AccountSettings from "./Settings/AccountSettings";
import axios from "axios";
import Categories from "./Categories/Categories";

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
      let refreshToken;
      if (localStorage.length > 0)
        refreshToken = localStorage.getItem("RefreshToken");
      else if (sessionStorage.length > 0)
        refreshToken = sessionStorage.getItem("RefreshToken");

      if (
        refreshToken !== null &&
        refreshToken !== undefined &&
        refreshToken.length === 36
      ) {
        await refreshData(refreshToken);
        const interval = setInterval(async () => {
          await refreshData(refreshToken, interval);
        }, 600000);
      } else {
        localStorage.clear();
        sessionStorage.clear();
        if (window.location.pathname !== "/sign-in")
          window.location.href = "/sign-in";
      }
    };
    mount();
  }, [session]);

  // window.addEventListener("beforeunload", async (e) => {
  //   // e.returnValue = "";
  //   if (session) {
  //     const connection = new HubConnectionBuilder()
  //       .withUrl("https://localhost:7262/chat", { withCredentials: false })
  //       .build();
  //     await connection
  //       .start()
  //       .then(() => {
  //         console.log(user.id);
  //         connection.invoke("Disconnect", user.id);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  //   e.preventDefault();
  // });

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
        {(sessionStorage.length === 0 ||
          sessionStorage.getItem("RefreshToken") === "" ||
          sessionStorage.getItem("RefreshToken") === null) &&
          (localStorage.length === 0 ||
            localStorage.getItem("RefreshToken") === "" ||
            localStorage.getItem("RefreshToken") === null) && (
            <Navigate to="/sign-in" />
          )}
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
                  {user.role === "Admin" && (
                    <Route
                      path="/categories"
                      element={
                        <Categories
                          token={token}
                          setToken={setToken}
                          user={user}
                          categories={data}
                          setCategories={setData}
                          categoriesFilter={dataFilter}
                          setCategoriesFilter={setDataFilter}
                          emptyResults={emptyResults}
                          setEmptyResults={setEmptyResults}
                          search={search}
                        />
                      }
                    />
                  )}
                  {user.role === "Admin" && (
                    <Route
                      path="/clients"
                      element={<Clients token={token} />}
                    />
                  )}
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
                  <Route
                    path="/Cars"
                    element={
                      <Cars
                        cars={data}
                        setCars={setData}
                        carsFilter={dataFilter}
                        setCarsFilter={setDataFilter}
                      />
                    }
                  />
                  <Route
                    path="/Rents"
                    element={<CarRentalList cars={data} setCars={setData} />}
                  />
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
