import React, { useState } from "react";
import { KNOWLEDGE_BASE_ARTICLES } from "../../data/mockTickets";
import { useTickets } from "../../contexts/TicketsContext";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Drawer } from "../../components/ui/Drawer";
import { formatDate } from "../../utils/formatters";
import { useToast } from "../../contexts/ToastContext";
import { Headphones, PlusCircle, MessageSquare, BookOpen, Send } from "lucide-react";

export const SupportPage = () => {
  const { tickets, createTicket, addMessageToTicket } = useTickets();
  const { user } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const { addToast } = useToast();

  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("Order Status");
  const [newMessage, setNewMessage] = useState("");

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    createTicket({
      subject: newSubject,
      category: newCategory,
      message: newMessage,
      user: user.name
    });

    setCreateModalOpen(false);
    setNewSubject("");
    setNewMessage("");
    addToast("Support ticket created! A specialist will reply shortly.", "success");
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !activeTicketId) return;

    addMessageToTicket(activeTicketId, user.name, chatMessage, false);
    const sentText = chatMessage;
    setChatMessage("");

    // Simulate Agent Auto-Reply after 1.5s
    setTimeout(() => {
      addMessageToTicket(
        activeTicketId,
        "Support Specialist (David)",
        "Thank you for updating your ticket! Our tech node is inspecting this right away.",
        true
      );
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Headphones className="w-7 h-7 text-indigo-500" /> Support Desk & Knowledge Base
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            24/7 dedicated assistance for order inquiries, API integrations, and billing.
          </p>
        </div>

        <Button variant="gradient" onClick={() => setCreateModalOpen(true)} className="gap-2 font-bold shadow-indigo-500/30">
          <PlusCircle className="w-4 h-4" /> Open Support Ticket
        </Button>
      </div>

      {/* Support Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" /> Your Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{ticket.id}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{ticket.subject}</td>
                  <td className="p-4 text-slate-500 font-semibold">{ticket.category}</td>
                  <td className="p-4">
                    <Badge variant={ticket.priority === "High" ? "rose" : ticket.priority === "Medium" ? "amber" : "default"}>
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={ticket.status === "Open" ? "emerald" : "default"}>
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-400">{formatDate(ticket.updatedAt)}</td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setActiveTicketId(ticket.id)}
                      className="py-1 px-3 text-xs"
                    >
                      Open Chat
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Knowledge Base Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" /> Knowledge Base & Guides
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {KNOWLEDGE_BASE_ARTICLES.map(art => (
            <Card key={art.id} hover className="p-5 space-y-3 cursor-pointer">
              <Badge variant="indigo" size="sm">{art.category}</Badge>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{art.title}</h4>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{art.reads} Reads</span>
                <span className="text-indigo-500 font-bold hover:underline">Read Guide →</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Open Support Ticket"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
          <Input
            label="Subject"
            placeholder="Order speed inquiry or balance issue..."
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            required
          />

          <div>
            <label className="block font-bold text-slate-400 uppercase text-[10px] mb-1">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100"
            >
              <option value="Order Status">Order Status & Refill</option>
              <option value="Payment Issue">Payment & Deposit Issue</option>
              <option value="API & Technical">API & Integration Tech</option>
              <option value="General">General Inquiries</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-400 uppercase text-[10px] mb-1">Message Details</label>
            <textarea
              rows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Describe your issue with exact order ID or transaction hash..."
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <Button type="submit" variant="gradient" className="w-full justify-center py-3 font-bold text-sm">
            Submit Support Ticket
          </Button>
        </form>
      </Modal>

      {/* Ticket Chat Drawer */}
      {activeTicket && (
        <Drawer
          isOpen={!!activeTicket}
          onClose={() => setActiveTicketId(null)}
          title={`Ticket Chat: ${activeTicket.id}`}
        >
          <div className="flex flex-col h-[calc(100vh-140px)] justify-between space-y-4">
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{activeTicket.subject}</h4>
              <div className="flex items-center gap-2">
                <Badge variant="indigo">{activeTicket.category}</Badge>
                <Badge variant={activeTicket.status === "Open" ? "emerald" : "default"}>{activeTicket.status}</Badge>
              </div>
            </div>

            {/* Chat Conversation Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {activeTicket.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isAgent ? "items-start" : "items-end"}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                    <span>{msg.sender}</span>
                    <span>• {msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium ${
                      msg.isAgent
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none"
                        : "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-500/20"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message reply..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button size="sm" variant="gradient" onClick={handleSendMessage} className="px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
