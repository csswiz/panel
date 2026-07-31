import React, { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [panelName, setPanelName] = useState("Wizard SMM Enterprise");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [rateLimit, setRateLimit] = useState(2500);
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: "Global Price Multiplier (+10%)", admin: "Super Admin", ip: "192.168.1.1", time: "10m ago" },
    { id: 2, action: "User USR-9007 Suspended", admin: "Super Admin", ip: "192.168.1.1", time: "2h ago" },
    { id: 3, action: "API Cluster v4.2 Deployed", admin: "System Node", ip: "10.0.0.4", time: "1d ago" }
  ]);

  const addAuditLog = (action, admin = "Super Admin") => {
    const log = {
      id: Date.now(),
      action,
      admin,
      ip: "127.0.0.1",
      time: "Just now"
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  return (
    <SettingsContext.Provider
      value={{
        panelName,
        setPanelName,
        maintenanceMode,
        setMaintenanceMode,
        rateLimit,
        setRateLimit,
        auditLogs,
        addAuditLog
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
