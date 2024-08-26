import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import Register from "./components/Register";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import UploadProduct from "./components/UploadProduct";
import Products from "./components/Products";
import Home from "./components/Home";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import CheckoutPage from "./components/CheckoutPage";
import CreateCategory from "./components/CreateCategory";
import AddProductToCategory from "./components/AddProductToCategory";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails";
import AdminHome from "./components/AdminHome";
import Categories from "./components/Categories";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* public routes */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/" element={<Home />} />
          {/* <Route path="/profile" element={<Profile/>} /> */}

          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>

          <Route element={<AdminProtectedRoute />}>
            <Route path="/upload" element={<UploadProduct />} />
            <Route path="/category" element={<Categories />} />
            <Route path="/addToCategory" element={<AddProductToCategory />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/admin" element={<AdminHome />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
