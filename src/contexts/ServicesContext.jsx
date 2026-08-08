import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { MOCK_SERVICES, CATEGORIES, PLATFORMS } from "../data/mockServices";

const ServicesContext = createContext();

const getInitialServices = () => {
  try {
    const saved = localStorage.getItem("smm_services_db");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to load services from localStorage:", e);
  }
  return MOCK_SERVICES;
};

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState(getInitialServices);

  useEffect(() => {
    localStorage.setItem("smm_services_db", JSON.stringify(services));
  }, [services]);

  const categories = useMemo(() => {
    const set = new Set(services.map(s => s.category));
    const list = Array.from(set);
    return list.length > 0 ? list : CATEGORIES;
  }, [services]);

  const addService = (serviceData) => {
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1001;
    const newService = {
      id: newId,
      name: serviceData.name,
      category: serviceData.category || "Instagram Likes & Views",
      platform: serviceData.platform || "instagram",
      rate: parseFloat(serviceData.rate) || 1.00,
      min: parseInt(serviceData.min) || 100,
      max: parseInt(serviceData.max) || 100000,
      eta: serviceData.eta || "0-15 Minutes",
      badge: serviceData.badge || "AUTO REFILL",
      description: serviceData.description || "High quality non-drop service with 30 day refill guarantee.",
      status: "Active"
    };
    setServices(prev => [newService, ...prev]);
    return newService;
  };

  const updateService = (id, updatedData) => {
    setServices(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updatedData } : s))
    );
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const toggleServiceStatus = (id) => {
    setServices(prev =>
      prev.map(s => s.id === id ? { ...s, status: s.status === "Disabled" ? "Active" : "Disabled" } : s)
    );
  };

  const applyGlobalMultiplier = (percentageIncrease) => {
    const pct = parseFloat(percentageIncrease) / 100;
    setServices(prev =>
      prev.map(s => ({
        ...s,
        rate: parseFloat((s.rate * (1 + pct)).toFixed(3))
      }))
    );
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        categories,
        platforms: PLATFORMS,
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,
        applyGlobalMultiplier
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error("useServices must be used within ServicesProvider");
  return ctx;
};
