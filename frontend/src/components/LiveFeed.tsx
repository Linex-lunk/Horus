import { useState } from 'react';
import { Pause, Play, Filter } from 'lucide-react';
import WalletModal from './WalletModal';

interface AlertItem {
  type: string;
  timestamp: string;
  amount: number;
  senderAddress: string;
  receiverAddress: string;
  senderDetails: {
    address: string;
    balance: number;
    winRate: number;
    fundingOrigin: string;
  };
}

interface LiveFeedProps {
  initialAlerts: AlertItem[];
}

export default function LiveFeed({ initialAlerts }: LiveFeedProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [minSolFilter, setMinSolFilter] = useState<number>(0);
  const [alerts] = useState<AlertItem[]>(initialAlerts);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);

  const visibleAlerts = alerts.filter(alert => alert.amount >= minSolFilter);

  return (
    <div className="flex flex-col h-full bg-[#070b14] rounded-xl border border-slate-800 overflow-hidden">
      
      {/* Feed Control Bar */}
      <div className="flex items-center justify-between p-3 bg-[#0d1425] border-b border-slate-800">
        <h3 className="text-cyan-500 font-mono text-xs font-bold tracking-widest flex items-center gap-2">
          THE PULSE {isPaused ? <span className="text-red-500">(PAUSED)</span> : <span className="text-green-500 flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> LIVE</span>}
        </h3>
        
        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded border border-slate-700">
            <Filter size={12} className="text-slate-400" />
            <select 
              className="bg-transparent text-xs text-slate-300 font-mono outline-none cursor-pointer"
              onChange={(e) => setMinSolFilter(Number(e.target.value))}
            >
              <option value="0">All Txns</option>
              <option value="1">&gt; 1 SOL</option>
              <option value="5">&gt; 5 SOL</option>
              <option value="20">Whales (&gt; 20 SOL)</option>
            </select>
          </div>

          {/* Pause Toggle */}
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${isPaused ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            {isPaused ? <><Play size={12} /> RESUME</> : <><Pause size={12} /> PAUSE</>}
          </button>
        </div>
      </div>

      {/* Feed List */}
      <div className={`flex-1 overflow-y-auto p-3 space-y-3 ${isPaused ? 'scrollbar-default' : 'scroll-smooth'}`}>
        {visibleAlerts.map((alert, idx) => (
          <div key={idx} className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-lg hover:border-cyan-500/30 transition-colors">
            
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${alert.type === 'SWAP' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {alert.type}
              </span>
              <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
            </div>
            
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              <span 
                onClick={() => setSelectedWallet(alert.senderDetails)}
                className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition-colors"
              >
                {alert.senderAddress}
              </span> 
              {' '}transferred <span className="text-green-400 font-bold">{alert.amount} SOL</span> to{' '}
              <span className="text-slate-400">{alert.receiverAddress}</span>.
            </p>
          </div>
        ))}
      </div>

      {/* Render the Modal */}
      <WalletModal 
        isOpen={!!selectedWallet} 
        wallet={selectedWallet} 
        onClose={() => setSelectedWallet(null)} 
      />
    </div>
  );
}