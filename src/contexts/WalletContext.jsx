import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_TRANSACTIONS } from "../data/mockTransactions";
import { useAuth } from "./AuthContext";

const WalletContext = createContext();

const getInitialTxns = () => {
  try {
    const saved = localStorage.getItem("smm_wallet_db");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return MOCK_TRANSACTIONS.map(t => ({ ...t, userEmail: "alex.vance@agencycloud.com" }));
};

export const WalletProvider = ({ children }) => {
  const [allTxns, setAllTxns] = useState(getInitialTxns);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    localStorage.setItem("smm_wallet_db", JSON.stringify(allTxns));
  }, [allTxns]);

  const activeTransactions = isAdmin
    ? allTxns
    : allTxns.filter(t => t.userEmail === user?.email);

  const addTransaction = (type, method, reference, amount, status = "Completed") => {
    const newTxn = {
      id: `TXN-${Math.floor(900000 + Math.random() * 100000)}`,
      userEmail: user?.email || "alex.vance@agencycloud.com",
      type,
      method,
      reference,
      amount,
      status,
      date: new Date().toISOString(),
    };
    setAllTxns(prev => [newTxn, ...prev]);
    return newTxn;
  };

  return (
    <WalletContext.Provider value={{ transactions: activeTransactions, allTransactions: allTxns, addTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};
