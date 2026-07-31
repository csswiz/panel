import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const SEED_USERS = {
  "admin@wizard-smm.io": {
    id: "USR-9999",
    name: "Raghav (Super Admin)",
    email: "admin@wizard-smm.io",
    role: "Admin",
    tier: "VIP Executive",
    balance: 9999.00,
    totalSpent: 0.00,
    ordersCount: 150,
    country: "United States",
    status: "Active",
    joinedDate: "2024-01-01T00:00:00.000Z",
    apiKey: "smm_live_admin_secret_key_8899",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  "alex.vance@agencycloud.com": {
    id: "USR-1001",
    name: "Alex Vance",
    email: "alex.vance@agencycloud.com",
    role: "User",
    tier: "VIP Enterprise",
    balance: 540.00,
    totalSpent: 1240.50,
    ordersCount: 42,
    country: "United States",
    status: "Active",
    joinedDate: "2024-02-15T00:00:00.000Z",
    apiKey: "smm_live_alex_vance_key_7711",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  "user@wizard-smm.io": {
    id: "USR-1002",
    name: "Account User",
    email: "user@wizard-smm.io",
    role: "User",
    tier: "Standard",
    balance: 100.00,
    totalSpent: 45.00,
    ordersCount: 5,
    country: "Canada",
    status: "Active",
    joinedDate: "2024-03-10T00:00:00.000Z",
    apiKey: "smm_live_user_demo_key_2233",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  }
};

const getStoredUsers = () => {
  try {
    const saved = localStorage.getItem("smm_users_db");
    if (saved) return { ...SEED_USERS, ...JSON.parse(saved) };
  } catch (e) {}
  return SEED_USERS;
};

export const AuthProvider = ({ children }) => {
  const [usersDb, setUsersDb] = useState(getStoredUsers);
  const [activeEmail, setActiveEmail] = useState(() => {
    return localStorage.getItem("smm_active_email") || "alex.vance@agencycloud.com";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("smm_is_authenticated") !== "false";
  });

  const [resetCode, setResetCode] = useState(null);
  const [resetEmail, setResetEmail] = useState("");

  const currentUser = usersDb[activeEmail] || {
    id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
    name: activeEmail ? activeEmail.split("@")[0] : "Guest",
    email: activeEmail || "guest@wizard-smm.io",
    role: "User",
    tier: "Standard",
    balance: 50.00,
    totalSpent: 0.00,
    ordersCount: 0,
    country: "United States",
    status: "Active",
    joinedDate: new Date().toISOString(),
    apiKey: `smm_live_${Math.random().toString(36).substring(2, 10)}`,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  };

  useEffect(() => {
    localStorage.setItem("smm_users_db", JSON.stringify(usersDb));
  }, [usersDb]);

  useEffect(() => {
    if (isAuthenticated && activeEmail) {
      localStorage.setItem("smm_active_email", activeEmail);
      localStorage.setItem("smm_is_authenticated", "true");
    } else {
      localStorage.removeItem("smm_active_email");
      localStorage.setItem("smm_is_authenticated", "false");
    }
  }, [isAuthenticated, activeEmail]);

  const login = (emailOrUsername, password, roleType = "User") => {
    const normalizedEmail = (emailOrUsername || "user@wizard-smm.io").trim().toLowerCase();
    
    setUsersDb(prev => {
      if (prev[normalizedEmail]) {
        return prev;
      }
      const newAccount = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: roleType === "Admin" ? "Raghav (Super Admin)" : normalizedEmail.split("@")[0],
        email: normalizedEmail,
        role: roleType,
        tier: roleType === "Admin" ? "VIP Admin" : "Standard",
        balance: roleType === "Admin" ? 9999.00 : 50.00,
        totalSpent: 0.00,
        ordersCount: 0,
        country: "United States",
        status: "Active",
        joinedDate: new Date().toISOString(),
        apiKey: `smm_live_${Math.random().toString(36).substring(2, 10)}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      };
      return { ...prev, [normalizedEmail]: newAccount };
    });

    setActiveEmail(normalizedEmail);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveEmail("");
    localStorage.removeItem("smm_active_email");
    localStorage.setItem("smm_is_authenticated", "false");
  };

  const updateBalance = (amount) => {
    setUsersDb(prev => {
      const current = prev[activeEmail];
      if (!current) return prev;
      const updatedBalance = Math.max(0, parseFloat((current.balance + amount).toFixed(2)));
      const updatedSpent = amount < 0 ? parseFloat(((current.totalSpent || 0) + Math.abs(amount)).toFixed(2)) : (current.totalSpent || 0);
      const updatedOrders = amount < 0 ? (current.ordersCount || 0) + 1 : (current.ordersCount || 0);
      return {
        ...prev,
        [activeEmail]: {
          ...current,
          balance: updatedBalance,
          totalSpent: updatedSpent,
          ordersCount: updatedOrders
        }
      };
    });
  };

  const adminAdjustUserBalance = (targetEmail, amount) => {
    setUsersDb(prev => {
      const current = prev[targetEmail];
      if (!current) return prev;
      const updatedBalance = Math.max(0, parseFloat((current.balance + amount).toFixed(2)));
      return {
        ...prev,
        [targetEmail]: { ...current, balance: updatedBalance }
      };
    });
  };

  const adminToggleUserStatus = (targetEmail) => {
    setUsersDb(prev => {
      const current = prev[targetEmail];
      if (!current) return prev;
      const nextStatus = current.status === "Active" ? "Suspended" : "Active";
      return {
        ...prev,
        [targetEmail]: { ...current, status: nextStatus }
      };
    });
  };

  const updateTier = (newTier) => {
    setUsersDb(prev => {
      const current = prev[activeEmail];
      if (!current) return prev;
      return {
        ...prev,
        [activeEmail]: { ...current, tier: newTier }
      };
    });
  };

  const updateProfile = (profileData) => {
    setUsersDb(prev => {
      const current = prev[activeEmail];
      if (!current) return prev;
      return {
        ...prev,
        [activeEmail]: { ...current, ...profileData }
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        role: currentUser.role,
        isAuthenticated,
        login,
        logout,
        updateBalance,
        adminAdjustUserBalance,
        adminToggleUserStatus,
        allUsersList: Object.values(usersDb),
        updateTier,
        updateProfile,
        resetCode,
        setResetCode,
        resetEmail,
        setResetEmail,
        isAdmin: currentUser.role === "Admin"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
