import React, { useEffect, useState } from 'react';
import { Radio, AlertTriangle, Zap } from 'lucide-react';

interface AlertItem {
  id: string;
  timestamp: string;
  type: string;
  mint: string;
  description: string;
  severity: string;
  cabalIndex: number;
}

export const PulseFeed: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Connect to backend websocket or mock if unavailable
    const wsUrl = `${wsProtocol}//localhost:8000/api/ws/pulse`;
    let ws: WebSocket | null = null;
    let fallbackTimer: any = null;

    const connectWs = () => {
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setAlerts((prev) => [data, ...prev].slice(0, 50));
        };

        ws.onclose = () => {
          setIsConnected(false);
          // try reconnect after 3s
          setTimeout(connectWs, 3000);
        };

        ws.onerror = () => {
          setIsConnected(false);
          if (ws) ws.close();
        };
      } catch (e) {
        setIsConnected(false);
      }
    };

    connectWs();

    // Fallback simulation generator if websocket is disconnected for demo
    fallbackTimer = setInterval(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        const types = ['STEALTH_TRANSFER', 'SUPPLY_ACCUMULATION', 'DUMP_WARNING', 'NEW_CABAL_CLUSTER'];
        const descs = [
          'Stealth multi-hop SOL disbursement detected across cluster nodes.',
          'Coordinated wallet accumulation spike (>15% supply swept).',
          'Potential exit liquidity routing detected from root funder wallet.',
          'New high-density insider funding ring mapped via Helius RPC.'
        ];
        const idx = Math.floor(Math.random() * types.length);
        const newAlert: AlertItem = {
          id: `alert_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: types[idx],
          mint: `So111111${Math.floor(Math.random() * 89999 + 10000)}`,
          description: descs[idx],
          severity: Math.random() > 0.5 ? 'CRITICAL' : 'HIGH',
          cabalIndex: Number((Math.random() * 30 + 65).toFixed(1))
        };
        setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
      }
    }, 4500);

    return () => {
      if (ws) ws.close();
      if (fallbackTimer) clearInterval(fallbackTimer);
    };
  }, []);

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <h2 className="text-sm font-bold tracking-wider text-cyan-400 flex items-center gap-2">
          <Radio className={`w-4 h-4 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-500'}`} />
          REAL-TIME CABAL ALERT FEED ("THE PULSE")
        </h2>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`}></span>
          <span className="text-[10px] font-mono text-slate-400">
            {isConnected ? 'LIVE STREAM' : 'SIMULATION MODE'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-10 space-y-2">
            <Zap className="w-8 h-8 text-slate-700 animate-pulse" />
            <p className="text-xs">Listening for high-frequency on-chain telemetry & cabal triggers...</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-cyan-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  {alert.type}
                </span>
                <span className="font-mono text-slate-500">{alert.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono border-t border-slate-900">
                <span className="text-slate-500 truncate">Mint: {alert.mint}</span>
                <span className="px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-900/50">
                  Index: {alert.cabalIndex}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
