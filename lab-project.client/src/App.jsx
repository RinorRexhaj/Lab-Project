import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Dashboard from "./Dashboard/Dashboard";
import Products from "./Products/Products";
import Clients from "./Clients/Clients";
import Orders from "./Orders/Orders";
import Searchbar from "./Searchbar/Searchbar";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <BrowserRouter>
      <div className="w-full h-screen flex">
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
      </div>
    </BrowserRouter>
  );
};

export default App;
