import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_TICKETS } from "../data/mockTickets";
import { useAuth } from "./AuthContext";

const TicketsContext = createContext();

const getInitialTickets = () => {
  try {
    const saved = localStorage.getItem("smm_tickets_db");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return MOCK_TICKETS.map(t => ({ ...t, userEmail: "alex.vance@agencycloud.com" }));
};

export const TicketsProvider = ({ children }) => {
  const [allTickets, setAllTickets] = useState(getInitialTickets);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    localStorage.setItem("smm_tickets_db", JSON.stringify(allTickets));
  }, [allTickets]);

  const activeTickets = isAdmin
    ? allTickets
    : allTickets.filter(t => t.userEmail === user?.email || t.user === user?.name);

  const createTicket = ({ subject, category, message, user: userName }) => {
    const created = {
      id: `TICK-${Math.floor(8000 + Math.random() * 1000)}`,
      userEmail: user?.email || "alex.vance@agencycloud.com",
      user: userName || user?.name || "Alex Vance",
      subject,
      category,
      priority: "Medium",
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        { id: Date.now(), sender: userName || user?.name || "Alex Vance", isAgent: false, text: message, timestamp: "Just now" }
      ]
    };
    setAllTickets(prev => [created, ...prev]);
    return created;
  };

  const addMessageToTicket = (ticketId, sender, text, isAgent = false) => {
    const newMsg = {
      id: Date.now(),
      sender,
      isAgent,
      text,
      timestamp: "Just now"
    };

    setAllTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: new Date().toISOString(),
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      })
    );
  };

  const updateTicketStatus = (ticketId, status) => {
    setAllTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
  };

  return (
    <TicketsContext.Provider value={{ tickets: activeTickets, allTickets, createTicket, addMessageToTicket, updateTicketStatus }}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => {
  const ctx = useContext(TicketsContext);
  if (!ctx) throw new Error("useTickets must be used within TicketsProvider");
  return ctx;
};
