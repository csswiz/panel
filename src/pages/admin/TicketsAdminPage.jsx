import React, { useState } from "react";
import { useTickets } from "../../contexts/TicketsContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Drawer } from "../../components/ui/Drawer";
import { formatDate } from "../../utils/formatters";
import { useToast } from "../../contexts/ToastContext";
import { Headphones, Send, CheckCircle } from "lucide-react";

export const TicketsAdminPage = () => {
  const { tickets, addMessageToTicket, updateTicketStatus } = useTickets();
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const { addToast } = useToast();

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const handleSendReply = () => {
    if (!replyText.trim() || !activeTicketId) return;

    addMessageToTicket(activeTicketId, "Super Admin", replyText, true);
    setReplyText("");
    addToast(`Agent reply sent to ticket ${activeTicketId}`, "success");
  };

  const handleCloseTicket = (ticketId) => {
    updateTicketStatus(ticketId, "Closed");
    addToast(`Ticket ${ticketId} status set to Closed`, "info");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Headphones className="w-7 h-7 text-rose-500" /> Support Desk Admin Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review client tickets, assign priority queues, and send instant staff responses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Client Tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Client User</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.id}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{t.user}</td>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{t.subject}</td>
                  <td className="p-4 text-slate-500">{t.category}</td>
                  <td className="p-4">
                    <Badge variant={t.priority === "High" ? "rose" : "amber"}>{t.priority}</Badge>
                  </td>
                  <td className="p-4"><Badge variant={t.status === "Open" ? "emerald" : "default"}>{t.status}</Badge></td>
                  <td className="p-4 text-right space-x-2">
                    <Button size="sm" variant="primary" onClick={() => setActiveTicketId(t.id)} className="text-xs py-1 px-3">
                      Reply Queue
                    </Button>
                    {t.status === "Open" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCloseTicket(t.id)}
                        className="text-xs py-1 px-2.5 text-slate-400"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Close
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {activeTicket && (
        <Drawer
          isOpen={!!activeTicket}
          onClose={() => setActiveTicketId(null)}
          title={`Admin Reply Desk: ${activeTicket.id}`}
        >
          <div className="flex flex-col h-[calc(100vh-140px)] justify-between space-y-4">
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{activeTicket.subject}</h4>
              <p className="text-xs text-slate-400">Client: <strong className="text-white">{activeTicket.user}</strong></p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {activeTicket.messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isAgent ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] text-slate-400 mb-1">{msg.sender} • {msg.timestamp}</span>
                  <div className={`p-3 rounded-xl text-xs font-medium max-w-[85%] ${msg.isAgent ? "bg-indigo-600 text-white" : "bg-slate-800 text-white"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                placeholder="Type official staff reply..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
              />
              <Button size="sm" variant="gradient" onClick={handleSendReply}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
