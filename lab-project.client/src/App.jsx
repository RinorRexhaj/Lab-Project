import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Dashboard from "./Dashboard/Dashboard";
import Products from "./Products/Products";
import Clients from "./Clients/Clients";
import Orders from "./Orders/Orders";
import Searchbar from "./Searchbar/Searchbar";
import Login from "./Login/Login";
import CartButton from "./components/CartButton";
import AccountSettings from "./Settings/AccountSettings";

const App = () => {
  const [session, setSession] = useState(false);
  const [login, setLogin] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleLogin = () => {
    setLogin(!login);
  }

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
        {!session && <Navigate to="/sign-in"/>}
        <Routes>
          <Route path="/sign-in" element={<Login session={session} setSession={setSession} login={login} toggleLogin={toggleLogin} />} />
        </Routes>
        {session && 
          <>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="w-full flex flex-col items-center gap-15">
              <Searchbar toggleSidebar={toggleSidebar} />
              <div className="w-full h-full overflow-y-auto z-0 -mt-[74px] p-10 sm:px-6 bg-slate-100">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/products" element={<Products />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<AccountSettings />} />
                <Route path="*" element={<h1 className="font-semibold text-3xl">Doesn't Exist</h1>} />
              </Routes>
              </div>
              <CartButton />
            </div>
          </>
        }
      </div>
    </BrowserRouter>
  );
};

export default App;
