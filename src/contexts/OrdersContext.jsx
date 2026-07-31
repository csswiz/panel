import React, { createContext, useContext, useState, useEffect } from "react";
import { SEED_ORDERS } from "../data/mockOrders";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext();

const getInitialOrders = () => {
  try {
    const saved = localStorage.getItem("smm_orders_db");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  // Tag seed orders with alex.vance's email by default
  return SEED_ORDERS.map(o => ({ ...o, userEmail: o.userEmail || "alex.vance@agencycloud.com" }));
};

export const OrdersProvider = ({ children }) => {
  const [allOrders, setAllOrders] = useState(getInitialOrders);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    localStorage.setItem("smm_orders_db", JSON.stringify(allOrders));
  }, [allOrders]);

  // Scoped orders
  const activeOrders = isAdmin
    ? allOrders
    : allOrders.filter(o => o.userEmail === user?.email || o.userName === user?.name);

  const addOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Math.floor(800000 + Math.random() * 100000)}`,
      userEmail:   user?.email || "alex.vance@agencycloud.com",
      userName:    user?.name || orderData.userName || "Alex Vance",
      serviceName: orderData.serviceName,
      serviceId:   orderData.serviceId,
      link:        orderData.link,
      quantity:    orderData.quantity,
      charge:      orderData.charge,
      startCount:  Math.floor(Math.random() * 5000),
      remains:     orderData.quantity,
      status:      "Pending",
      refillEligible: true,
      createdAt:   new Date().toISOString(),
    };
    setAllOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const refillOrder = (orderId) => {
    setAllOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, remains: Math.floor(o.quantity * 0.05), status: "Processing" }
          : o
      )
    );
  };

  const cancelOrder = (orderId) => {
    setAllOrders(prev =>
      prev.map(o =>
        o.id === orderId && ["Pending", "Processing"].includes(o.status)
          ? { ...o, status: "Canceled", remains: o.quantity }
          : o
      )
    );
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setAllOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const remains = newStatus === "Completed" ? 0 : newStatus === "Canceled" ? o.quantity : o.remains;
          return { ...o, status: newStatus, remains };
        }
        return o;
      })
    );
  };

  return (
    <OrdersContext.Provider value={{ orders: activeOrders, allOrders, addOrder, refillOrder, cancelOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
};
