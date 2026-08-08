import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { MOCK_GAMING_SERVICES, INITIAL_GAMING_ORDERS, GAME_CATEGORIES } from "../data/mockGamingServices";
import { ALL_ELDORADO_GAMES, INITIAL_MARKETPLACE_LISTINGS } from "../data/eldoradoGamesList";
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

const getStoredEldoradoListings = () => {
  try {
    const saved = localStorage.getItem("smm_eldorado_listings_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_MARKETPLACE_LISTINGS;
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
  const [eldoradoListings, setEldoradoListings] = useState(getStoredEldoradoListings);
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
      localStorage.setItem("smm_eldorado_listings_v1", JSON.stringify(eldoradoListings));
    } catch (e) {}
  }, [eldoradoListings]);

  useEffect(() => {
    try {
      localStorage.setItem("smm_gaming_orders_db_v1", JSON.stringify(gameOrders));
    } catch (e) {}
  }, [gameOrders]);

  // Submit a Top-Up Game Order
  const placeGameOrder = ({ gameService, packageItem, playerDetails }) => {
    if (!user) throw new Error("User must be authenticated");

    const charge = parseFloat(packageItem.price.toFixed(2));
    if ((user.balance || 0) < charge) {
      throw new Error("Insufficient wallet balance for this gaming order");
    }

    updateBalance(-charge);

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
      type: "Top-Up",
      status: gameService.badge === "INSTANT TOP-UP" ? "Completed" : "Completed",
      createdAt: new Date().toISOString()
    };

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

  // Buy Eldorado Stacked Account
  const placeAccountOrder = ({ listing }) => {
    if (!user) throw new Error("User must be authenticated");

    const charge = parseFloat(listing.price.toFixed(2));
    if ((user.balance || 0) < charge) {
      throw new Error("Insufficient wallet balance for this account purchase");
    }

    updateBalance(-charge);

    const newOrderId = `ELD-ACC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: newOrderId,
      userName: user.name || "User",
      userEmail: user.email || "user@wizard-smm.io",
      gameId: listing.id,
      gameTitle: listing.game,
      packageTitle: listing.title,
      playerDetails: listing.credentials || "Credentials released in purchase details.",
      quantity: 1,
      charge: charge,
      type: "Account Purchase",
      status: "Completed",
      createdAt: new Date().toISOString()
    };

    addTransaction(
      "Eldorado Account Purchase",
      `${listing.game} - ${listing.title}`,
      `REF-${newOrderId}`,
      -charge,
      "Completed"
    );

    setGameOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Admin: Update order status
  const adminUpdateOrderStatus = (orderId, newStatus) => {
    setGameOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          if (newStatus === "Refunded" && ord.status !== "Refunded") {
            adminAdjustUserBalance(ord.userEmail, ord.charge);
          }
          return { ...ord, status: newStatus };
        }
        return ord;
      })
    );
  };

  // Admin CRUD for Eldorado Listings
  const adminAddAccountListing = (listingData) => {
    const newId = `ELD-${Math.floor(2000 + Math.random() * 8000)}`;
    const newListing = {
      id: newId,
      game: listingData.game,
      category: listingData.category || "Accounts",
      title: listingData.title,
      seller: listingData.seller || "ProGamerVault",
      rating: parseFloat(listingData.rating) || 5.0,
      reviews: parseInt(listingData.reviews) || 120,
      price: parseFloat(listingData.price) || 19.99,
      originalPrice: parseFloat(listingData.originalPrice) || 35.00,
      deliveryType: "Instant Delivery",
      badge: listingData.badge || "VERIFIED SELLER",
      specs: listingData.specs || {
        platform: "PC / Console / Mobile",
        access: "Full Email Access",
        warranty: "30 Days Protection"
      },
      credentials: listingData.credentials || "Account Login Details"
    };

    setEldoradoListings(prev => [newListing, ...prev]);
    return newListing;
  };

  const adminDeleteAccountListing = (id) => {
    setEldoradoListings(prev => prev.filter(item => item.id !== id));
  };

  return (
    <GamingContext.Provider
      value={{
        gameServices,
        eldoradoListings,
        allGamesings: ALL_ELDORADO_GAMES,
        gameOrders,
        categories: GAME_CATEGORIES,
        placeGameOrder,
        placeAccountOrder,
        adminUpdateOrderStatus,
        adminAddAccountListing,
        adminDeleteAccountListing
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
