import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Activity, ShieldAlert, Zap, Layers } from 'lucide-react';

interface MacroData {
  sol_price: number;
  price_change_24h: number;
  tvl: string;
  liquidity_shift_24h: string;
  fear_greed_index: number;
  sentiment: string;
  active_cabals_tracked: number;
}

export const MacroTelemetry: React.FC = () => {
  const [macro, setMacro] = useState<MacroData>({
    sol_price: 142.5,
    price_change_24h: 4.82,
    tvl: "$4.32B",
    liquidity_shift_24h: "+$128.4M",
    fear_greed_index: 78,
    sentiment: "Extreme Greed",
    active_cabals_tracked: 156
  });

  useEffect(() => {
    const fetchMacro = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/macro');
        if (res.ok) {
          const data = await res.json();
          setMacro(data);
        }
      } catch (e) {
        // fallback to live simulation ticks
      }
    };

    fetchMacro();
    const interval = setInterval(fetchMacro, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xl z-30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-wider text-slate-100 flex items-center gap-2">
            SOLANA GLOBAL MONITOR
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              COSMIC INTELLIGENCE V1.0
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono">Real-time insider wallet cluster observability & multi-hop telemetry</p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">SOL:</span>
          <span className="text-slate-100 font-bold">${macro.sol_price}</span>
          <span className="text-emerald-400 text-[10px]">(+{macro.price_change_24h}%)</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">DeFi TVL:</span>
          <span className="text-slate-100 font-bold">{macro.tvl}</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">24h Flow:</span>
          <span className="text-emerald-400 font-bold">{macro.liquidity_shift_24h}</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Fear & Greed:</span>
          <span className="text-amber-400 font-bold">{macro.fear_greed_index} ({macro.sentiment})</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span className="text-slate-400">Cabals Tracked:</span>
          <span className="text-red-400 font-bold">{macro.active_cabals_tracked}</span>
        </div>
      </div>
    </div>
  );
};
