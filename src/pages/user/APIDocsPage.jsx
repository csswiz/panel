import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Card, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Tabs } from "../../components/ui/Tabs";
import { Code2, Key, Copy, RefreshCw, Terminal, Check } from "lucide-react";

export const APIDocsPage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [apiKey, setApiKey] = useState(user?.apiKey || "smm_live_demo_key_7711");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState("curl");

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    addToast("API Key copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    const newKey = `smm_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 10)}`;
    setApiKey(newKey);
    updateProfile({ apiKey: newKey });
    addToast("API Key regenerated! Make sure to update your reseller scripts.", "warning");
  };

  const codeSnippets = {
    curl: `curl -X POST https://api.wizard-smm.io/v2 \\
  -d "key=${apiKey}" \\
  -d "action=add" \\
  -d "service=1001" \\
  -d "link=https://instagram.com/p/C7x9LKtO_M8" \\
  -d "quantity=1000"`,

    javascript: `const response = await fetch('https://api.wizard-smm.io/v2', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    key: '${apiKey}',
    action: 'add',
    service: 1001,
    link: 'https://instagram.com/p/C7x9LKtO_M8',
    quantity: 1000
  })
});
const data = await response.json();
console.log('Order Result:', data);`,

    python: `import requests

url = "https://api.wizard-smm.io/v2"
payload = {
    "key": "${apiKey}",
    "action": "add",
    "service": "1001",
    "link": "https://instagram.com/p/C7x9LKtO_M8",
    "quantity": "1000"
}

response = requests.post(url, data=payload)
print(response.json())`,

    php: `<?php
$ch = curl_init('https://api.wizard-smm.io/v2');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'key' => '${apiKey}',
    'action' => 'add',
    'service' => 1001,
    'link' => 'https://instagram.com/p/C7x9LKtO_M8',
    'quantity' => 1000
]));
$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-7 h-7 text-indigo-500" /> REST API Developer Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect your custom software, child panels, or agency scripts with 2,500 req/min rate limit capability.
          </p>
        </div>

        <Badge variant="emerald" size="lg">
          API v2.0 Operational
        </Badge>
      </div>

      {/* API Key Card */}
      <Card className="p-6 space-y-4 bg-linear-to-br from-slate-900 to-indigo-950 text-white border-indigo-500/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold">Your Secret Production API Key</h3>
          </div>
          <Badge variant="indigo">Live Secret</Badge>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-xs">
          <span className="flex-1 truncate text-indigo-300">
            {showKey ? apiKey : "••••••••••••••••••••••••••••••••••••••••"}
          </span>
          <button
            onClick={() => setShowKey(!showKey)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 font-bold"
          >
            {showKey ? "Hide" : "Reveal"}
          </button>
          <Button size="sm" variant="primary" onClick={handleCopy} className="gap-1 text-xs">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <span>Keep your key secure. Never expose it in client-side repositories.</span>
          <button
            onClick={handleRegenerate}
            className="text-rose-400 hover:underline font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Regenerate Key
          </button>
        </div>
      </Card>

      {/* Code Snippet Interactive Switcher */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-500" /> Endpoint Integration Code Examples
          </CardTitle>
          <Tabs
            tabs={[
              { id: "curl", label: "cURL" },
              { id: "javascript", label: "Node.js / JS" },
              { id: "python", label: "Python" },
              { id: "php", label: "PHP" }
            ]}
            activeTab={activeLang}
            onChange={(id) => setActiveLang(id)}
          />
        </div>

        <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
          <pre>{codeSnippets[activeLang]}</pre>
        </div>
      </Card>

      {/* API Endpoints Catalog */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">API Reference Endpoints</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { action: "add", title: "Add Order", desc: "Create a new campaign order instantly.", params: "key, action=add, service, link, quantity" },
            { action: "status", title: "Order Status", desc: "Check real-time order start count, remains, and status.", params: "key, action=status, order" },
            { action: "services", title: "Service List", desc: "Retrieve complete JSON list of 5,000+ services and rates.", params: "key, action=services" },
            { action: "balance", title: "Check User Balance", desc: "Fetch available wallet balance in USD.", params: "key, action=balance" }
          ].map((ep, i) => (
            <Card key={i} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="indigo" size="sm">POST /api/v2</Badge>
                <span className="font-mono text-xs font-bold text-indigo-500">action={ep.action}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ep.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{ep.desc}</p>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                Params: {ep.params}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
