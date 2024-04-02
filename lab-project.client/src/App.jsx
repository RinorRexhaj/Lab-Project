import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
                    <Route path="/" element={<Navigate to="/dashboard" />}></Route>
                    <Route path="/dashboard" element={<Dashboard />}>
                    </Route>
                    <Route path="/products" element={<Products />}>
                    </Route>
                    <Route path="/clients" element={<Clients />}>
                    </Route>
                    <Route path="/orders" element={<Orders />}>
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    );

}

export default App;