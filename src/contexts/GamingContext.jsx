import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { MOCK_GAMING_SERVICES, INITIAL_GAMING_ORDERS, GAME_CATEGORIES } from "../data/mockGamingServices";
import { useAuth } from "./AuthContext";
import { useWallet } from "./WalletContext";

const GamingContext = createContext();

const getStoredGamingServices = () => {
  try {
    const saved = localStorage.getItem("smm_gaming_services_db_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return MOCK_GAMING_SERVICES;
};

const getStoredGamingOrders = () => {
  try {
    const saved = localStorage.getItem("smm_gaming_orders_db_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_GAMING_ORDERS;
};

export const GamingProvider = ({ children }) => {
  const [gameServices, setGameServices] = useState(getStoredGamingServices);
  const [gameOrders, setGameOrders] = useState(getStoredGamingOrders);

  const { user, updateBalance, adminAdjustUserBalance } = useAuth();
  const { addTransaction } = useWallet();

  useEffect(() => {
    try {
      localStorage.setItem("smm_gaming_services_db_v1", JSON.stringify(gameServices));
    } catch (e) {}
  }, [gameServices]);

  useEffect(() => {
    try {
      localStorage.setItem("smm_gaming_orders_db_v1", JSON.stringify(gameOrders));
    } catch (e) {}
  }, [gameOrders]);

  // Submit a new game service order
  const placeGameOrder = ({ gameService, packageItem, playerDetails }) => {
    if (!user) throw new Error("User must be authenticated");

    const charge = parseFloat(packageItem.price.toFixed(2));
    if ((user.balance || 0) < charge) {
      throw new Error("Insufficient wallet balance for this gaming order");
    }

    // Deduct user balance
    updateBalance(-charge);

    // Create unique order ID
    const newOrderId = `G-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: newOrderId,
      userName: user.name || "User",
      userEmail: user.email || "user@wizard-smm.io",
      gameId: gameService.id,
      gameTitle: gameService.title,
      packageTitle: packageItem.name,
      playerDetails: playerDetails.trim(),
      quantity: packageItem.amount || 1,
      charge: charge,
      status: gameService.badge === "INSTANT TOP-UP" ? "Completed" : "Pending",
      createdAt: new Date().toISOString()
    };

    // Register wallet transaction
    addTransaction(
      "Gaming Service Top-Up",
      `${gameService.title} (${packageItem.name})`,
      `REF-${newOrderId}`,
      -charge,
      "Completed"
    );

    setGameOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Admin: Update order status (Pending -> In Progress -> Completed -> Refunded)
  const adminUpdateOrderStatus = (orderId, newStatus) => {
    setGameOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          // If refunding, restore user balance
          if (newStatus === "Refunded" && ord.status !== "Refunded") {
            adminAdjustUserBalance(ord.userEmail, ord.charge);
          }
          return { ...ord, status: newStatus };
        }
        return ord;
      })
    );
  };

  // Admin CRUD for Game Catalog
  const adminAddGameService = (serviceData) => {
    const newId = `GAME-${Math.floor(500 + Math.random() * 500)}`;
    const newService = {
      id: newId,
      title: serviceData.title,
      category: serviceData.category || "Mobile Game Top-Up",
      publisher: serviceData.publisher || "Game Developer",
      platform: serviceData.platform || "mobile",
      image: serviceData.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
      badge: serviceData.badge || "FAST RELOAD",
      deliveryType: serviceData.deliveryType || "Player ID Direct",
      ratePerUnit: parseFloat(serviceData.ratePerUnit) || 0.01,
      packages: serviceData.packages || [{ name: "Standard Package", amount: 100, price: 4.99 }],
      requiredFields: serviceData.requiredFields || ["Player ID"],
      description: serviceData.description || "In-game currency top-up.",
      status: "Active"
    };

    setGameServices(prev => [newService, ...prev]);
    return newService;
  };

  const adminUpdateGameService = (id, updatedData) => {
    setGameServices(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const adminToggleGameService = (id) => {
    setGameServices(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === "Disabled" ? "Active" : "Disabled" }
          : item
      )
    );
  };

  const adminDeleteGameService = (id) => {
    setGameServices(prev => prev.filter(item => item.id !== id));
  };

  return (
    <GamingContext.Provider
      value={{
        gameServices,
        gameOrders,
        categories: GAME_CATEGORIES,
        placeGameOrder,
        adminUpdateOrderStatus,
        adminAddGameService,
        adminUpdateGameService,
        adminToggleGameService,
        adminDeleteGameService
      }}
    >
      {children}
    </GamingContext.Provider>
  );
};

export const useGaming = () => {
  const ctx = useContext(GamingContext);
  if (!ctx) throw new Error("useGaming must be used within GamingProvider");
  return ctx;
};
