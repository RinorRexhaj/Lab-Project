import './App.css';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import Sidebar from './Sidebar/Sidebar';
import Dashboard from './Dashboard/Dashboard';
import Products from './Products/Products';
import Clients from './Clients/Clients';
import Orders from './Orders/Orders';

const App = () => {
    return (
        <BrowserRouter>
            <div className="w-full h-screen flex">
                <Sidebar />
                <Routes>
                    <Route path="/" element={<Navigate to="/Dashboard" />}></Route>
                    <Route path="/Dashboard" element={<Dashboard />}>
                    </Route>
                    <Route path="/Products" element={<Products />}>
                    </Route>
                    <Route path="/Clients" element={<Clients />}>
                    </Route>
                    <Route path="/Orders" element={<Orders />}>
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    );

}

export default App;