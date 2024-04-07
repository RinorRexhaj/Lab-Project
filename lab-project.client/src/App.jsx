import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Dashboard from "./Dashboard/Dashboard";
import Products from "./Products/Products";
import Clients from "./Clients/Clients";
import Orders from "./Orders/Orders";
import Searchbar from "./Searchbar/Searchbar";
import Login from "./Login/Login";

const App = () => {
  const [session, setSession] = useState(true);
  const [login, setLogin] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <BrowserRouter>
      <div className="w-full h-screen flex relative">
        {!session && <Navigate to="/sign-in"/>}
        <Routes>
          <Route path="/sign-in" element={session ? <Navigate to="/dashboard" /> : <Login />} />
        </Routes>
        {session && 
          <>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="w-full flex flex-col items-center gap-15">
              <Searchbar toggleSidebar={toggleSidebar} />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/products" element={<Products />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="*" element={<h1 className="font-semibold text-3xl">Doesn't Exist</h1>} />
              </Routes>
            </div>
          </>
        }
      </div>
    </BrowserRouter>
  );
};

export default App;
