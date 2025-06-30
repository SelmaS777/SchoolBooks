import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import "./App.css";
import MainPage from "./pages/MainPage";
import ProductPage from "./pages/Product/ProductPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import PremiumPage from "./pages/PremiumPage";
import CartPage from "./pages/CartPage";
import NotFound from "./pages/NotFound"; 
import HeroPage from "./pages/HeroPage";

import Navbar from "./components/Navbar";
import CheckoutPage from "./pages/CheckoutPage";
import PurchaseConfirmationPage from "./pages/PurchaseConfimationPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import RegistrationPage from "./pages/RegistrationPage";
import AddProductPage from "./pages/Product/AddProductPage";
import EditProductPage from "./pages/Product/EditProductPage";
import { NotificationProvider } from "./contexts/NotificationContext";
import WishlistPage from "./pages/WishlistPage";
import SavedSearchesPage from "./pages/SavedSearchesPage";
import NotificationScreen from "./pages/NotificationScreen";
import OrdersPage from "./pages/OrdersPage";
import PayPage from "./pages/PayPage";
// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#F15A24',
    },
    secondary: {
      main: '#F15A24',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
       <NotificationProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/hero" element={<HeroPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/purchase-confirmation" element={<PurchaseConfirmationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/product/add" element={<AddProductPage />} />
          <Route path="/product/edit/:id" element={<EditProductPage />} />
           <Route path="/wishlist" element={<WishlistPage />} />
           <Route path="/saved" element={<SavedSearchesPage />} />
           <Route path="/notifications" element={<NotificationScreen />} />
           <Route path="/orders" element={<OrdersPage />} />
           <Route path="/paypage" element={<PayPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/hero" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;