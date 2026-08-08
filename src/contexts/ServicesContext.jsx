import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { CRESCITALY_SERVICES } from "../data/crescitalyServices";
import { TRUSTYHUB_SERVICES } from "../data/trustyHubServices";
import { VIIEAGENCY_SERVICES } from "../data/viieAgencyServices";
import { WORLDOFSMM_SERVICES } from "../data/worldOfSmmServices";
import { MOCK_SERVICES, CATEGORIES, PLATFORMS } from "../data/mockServices";

const ServicesContext = createContext();

const STORAGE_KEY = "smm_services_db_master_v4";

const getCombinedCatalog = () => {
  const world = Array.isArray(WORLDOFSMM_SERVICES) ? WORLDOFSMM_SERVICES : [];
  const viie = Array.isArray(VIIEAGENCY_SERVICES) ? VIIEAGENCY_SERVICES : [];
  const trusty = Array.isArray(TRUSTYHUB_SERVICES) ? TRUSTYHUB_SERVICES : [];
  const crescitaly = Array.isArray(CRESCITALY_SERVICES) ? CRESCITALY_SERVICES : [];
  
  if (world.length === 0 && viie.length === 0 && trusty.length === 0 && crescitaly.length === 0) return MOCK_SERVICES;

  const idSet = new Set();
  const list = [];

  for (const s of world) {
    if (!idSet.has(s.id)) {
      idSet.add(s.id);
      list.push(s);
    }
  }

  for (const s of viie) {
    let targetId = s.id;
    if (idSet.has(targetId)) targetId = s.id + 10000;
    if (!idSet.has(targetId)) {
      idSet.add(targetId);
      list.push({ ...s, id: targetId });
    }
  }

  for (const s of trusty) {
    let targetId = s.id;
    if (idSet.has(targetId)) targetId = s.id + 20000;
    if (!idSet.has(targetId)) {
      idSet.add(targetId);
      list.push({ ...s, id: targetId });
    }
  }

  for (const s of crescitaly) {
    let targetId = s.id;
    if (idSet.has(targetId)) targetId = s.id + 50000;
    if (!idSet.has(targetId)) {
      idSet.add(targetId);
      list.push({ ...s, id: targetId });
    }
  }

  return list;
};

const INITIAL_CATALOG = getCombinedCatalog();

const getInitialServices = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 5000) return parsed;
    }
  } catch (e) {
    console.error("Failed to load services from localStorage:", e);
  }
  return INITIAL_CATALOG;
};

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState(getInitialServices);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
      localStorage.setItem("smm_services_db", JSON.stringify(services));
    } catch (e) {}
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

  const bulkImportServices = (newServicesList, overwrite = false) => {
    setServices(prev => {
      if (overwrite) return newServicesList;
      const existingIds = new Set(prev.map(s => s.id));
      const filteredNew = newServicesList.filter(s => !existingIds.has(s.id));
      return [...filteredNew, ...prev];
    });
  };

  const resetServicesToDefault = () => {
    setServices(INITIAL_CATALOG);
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
        applyGlobalMultiplier,
        bulkImportServices,
        resetServicesToDefault
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
