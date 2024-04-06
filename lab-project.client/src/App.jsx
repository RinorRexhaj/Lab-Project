import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Dashboard from "./Dashboard/Dashboard";
import Products from "./Products/Products";
import Clients from "./Clients/Clients";
import Orders from "./Orders/Orders";
import Searchbar from "./Searchbar/Searchbar";
import Login from "./Login/Login";
import Register from "./Register/Register";

const App = () => {
  const [session, setSession] = useState(false);
  const [login, setLogin] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <BrowserRouter>
      <div className="w-full h-screen flex">
        {!session && <Navigate to="/sign-in"/>}
        <Routes>
          <Route path="/sign-in" element={session ? <Navigate to="/dashboard" /> : <Login />}></Route>
          <Route path="/sign-up" element={session ? <Navigate to="/dashboard" /> : <Register />}></Route>
        </Routes>
        {session && 
          <>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="w-full flex flex-col items-center gap-15">
              <Searchbar toggleSidebar={toggleSidebar} />
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />}></Route>
                <Route path="/dashboard" element={<Dashboard />}></Route>
                <Route path="/products" element={<Products />}></Route>
                <Route path="/clients" element={<Clients />}></Route>
                <Route path="/orders" element={<Orders />}></Route>
              </Routes>
            </div>
          </>
        }
      </div>
    </BrowserRouter>
  );
};

export default App;
