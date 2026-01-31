import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import CollectionsPanel from "./components/CollectionsPanel/CollectionsPanel";
import HomePage from "./pages/HomePage/HomePage";
import CollectionPage from "./pages/CollectionPage/CollectionPage";
import Footer from "./components/Footer/Footer";
import ProductPage from "./pages/ProductPage/ProductPage";
import CartDrawer from "./components/CartDrawer/CartDrawer";
import CartPage from "./components/CartPage/CartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage/OrderSuccessPage";
import AllProductsPage from "./pages/AllProductsPage/AllProductsPage";
import FAQPage from "./pages/FAQPage/FAQPage";
import SizeGuidePage from "./pages/SizeGuidePage/SizeGuidePage";
import ShippingReturnsPage from "./pages/ShippingReturnsPage/ShippingReturnsPage";
import ContactPage from "./pages/ContactPage/ContactPage";

// ADMIN IMPORTS
import Login from "./admin_components/pages/Login";
import Dashboard from "./admin_components/pages/Dashboard";
import Categories from "./admin_components/pages/Categories";
import Products from "./admin_components/pages/Products";
import Banners from "./admin_components/pages/Banners";
import Orders from "./admin_components/pages/Orders";
import Stocks from "./admin_components/pages/Stocks";
import Newsletter from "./admin_components/pages/Newsletter";

import AdminLayout from "./admin_components/layouts/AdminLayout";
import AdminRoute from "./admin_components/guards/AdminRoute";

function App() {
  const [showCollections, setShowCollections] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
    setShowCollections(false);
  };

  return (
    <>
      {/* ================= ADMIN ROUTES ================= */}
      <Routes>
        {/* LOGIN */}
        <Route path="/admin/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* CATEGORIES */}
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminLayout>
                <Categories />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminLayout>
                <Products />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* BANNERS */}
        <Route
          path="/admin/banners"
          element={
            <AdminRoute>
              <AdminLayout>
                <Banners />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* ORDERS */}
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminLayout>
                <Orders />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* ✅ STOCKS — ADDED */}
        <Route
          path="/admin/stocks"
          element={
            <AdminRoute>
              <AdminLayout>
                <Stocks />
              </AdminLayout>
            </AdminRoute>
          }
        />
        {/* NEWSLETTER */}
        <Route
          path="/admin/newsletter"
          element={
            <AdminRoute>
              <AdminLayout>
                <Newsletter />
              </AdminLayout>
            </AdminRoute>
          }
        />
      </Routes>

      {/* ================= USER FRONTEND ================= */}
      {!window.location.pathname.startsWith("/admin") && (
        <>
          <Navbar
            onOpenCollections={() => setShowCollections(true)}
            onLogoClick={handleLogoClick}
            onOpenCart={() => setShowCart(true)}
          />

          {showCollections && (
            <CollectionsPanel onClose={() => setShowCollections(false)} />
          )}

          {showCart && (
            <CartDrawer onClose={() => setShowCart(false)} />
          )}

          <div style={{ minHeight: "80vh" }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/all" element={<AllProductsPage />} />
              <Route path="/c/:slug" element={<CollectionPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/size-guide" element={<SizeGuidePage />} />
              <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </div>

          <Footer />
        </>
      )}
    </>
  );
}

export default App;
