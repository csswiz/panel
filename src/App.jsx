import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Providers
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { CommandPaletteProvider } from "./contexts/CommandPaletteContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import { WalletProvider } from "./contexts/WalletContext";
import { TicketsProvider } from "./contexts/TicketsContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ServicesProvider } from "./contexts/ServicesContext";

// Layouts
import { LandingLayout } from "./layouts/LandingLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { UserDashboardLayout } from "./layouts/UserDashboardLayout";
import { AdminDashboardLayout } from "./layouts/AdminDashboardLayout";

// Landing & Auth Pages
import { LandingPage } from "./pages/landing/LandingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { OTPVerifyPage } from "./pages/auth/OTPVerifyPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";

// User Dashboard Pages
import { UserDashboard } from "./pages/user/UserDashboard";
import { NewOrderPage } from "./pages/user/NewOrderPage";
import { ServicesMarketplace } from "./pages/user/ServicesMarketplace";
import { OrdersPage } from "./pages/user/OrdersPage";
import { WalletPage } from "./pages/user/WalletPage";
import { APIDocsPage } from "./pages/user/APIDocsPage";
import { SupportPage } from "./pages/user/SupportPage";
import { AffiliatePage } from "./pages/user/AffiliatePage";
import { ProfilePage } from "./pages/user/ProfilePage";

// Admin Panel Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { ServiceManagementPage } from "./pages/admin/ServiceManagementPage";
import { OrderManagementPage } from "./pages/admin/OrderManagementPage";
import { FinancialsPage } from "./pages/admin/FinancialsPage";
import { TicketsAdminPage } from "./pages/admin/TicketsAdminPage";
import { ReportsPage } from "./pages/admin/ReportsPage";
import { SettingsAdminPage } from "./pages/admin/SettingsAdminPage";

// Error Page
import { NotFoundPage } from "./pages/errors/NotFoundPage";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OrdersProvider>
          <WalletProvider>
            <TicketsProvider>
              <SettingsProvider>
                <ServicesProvider>
                  <ToastProvider>
                    <CommandPaletteProvider>
                      <BrowserRouter>
                        <Routes>
                          {/* Landing Website Routes */}
                          <Route element={<LandingLayout />}>
                            <Route path="/" element={<LandingPage />} />
                          </Route>

                          {/* Authentication UI Routes */}
                          <Route path="/auth" element={<AuthLayout />}>
                            <Route path="login" element={<LoginPage />} />
                            <Route path="register" element={<RegisterPage />} />
                            <Route path="forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="otp" element={<OTPVerifyPage />} />
                            <Route path="reset-password" element={<ResetPasswordPage />} />
                          </Route>

                          {/* User Dashboard Routes */}
                          <Route path="/dashboard" element={<UserDashboardLayout />}>
                            <Route index element={<UserDashboard />} />
                            <Route path="new-order" element={<NewOrderPage />} />
                            <Route path="services" element={<ServicesMarketplace />} />
                            <Route path="orders" element={<OrdersPage />} />
                            <Route path="wallet" element={<WalletPage />} />
                            <Route path="api" element={<APIDocsPage />} />
                            <Route path="support" element={<SupportPage />} />
                            <Route path="affiliate" element={<AffiliatePage />} />
                            <Route path="profile" element={<ProfilePage />} />
                          </Route>

                          {/* Admin Panel Routes */}
                          <Route path="/admin" element={<AdminDashboardLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="analytics" element={<AdminAnalytics />} />
                            <Route path="users" element={<UserManagementPage />} />
                            <Route path="services" element={<ServiceManagementPage />} />
                            <Route path="orders" element={<OrderManagementPage />} />
                            <Route path="financials" element={<FinancialsPage />} />
                            <Route path="tickets" element={<TicketsAdminPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                            <Route path="settings" element={<SettingsAdminPage />} />
                          </Route>

                          {/* Fallback 404 Route */}
                          <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                      </BrowserRouter>
                    </CommandPaletteProvider>
                  </ToastProvider>
                </ServicesProvider>
              </SettingsProvider>
            </TicketsProvider>
          </WalletProvider>
        </OrdersProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
