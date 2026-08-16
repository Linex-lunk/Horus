
import { X, Copy, ExternalLink, Activity, Wallet, AlertTriangle, Crosshair } from 'lucide-react';

interface WalletData {
  address: string;
  balance: number;
  winRate: number;
  fundingOrigin: string;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletData | null;
}

export default function WalletModal({ isOpen, onClose, wallet }: WalletModalProps) {
  if (!isOpen || !wallet) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[450px] bg-[#0a0f1c] border border-cyan-500/30 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-[#0d1425] p-4 border-b border-cyan-500/20">
          <h3 className="text-cyan-400 font-mono text-sm flex items-center gap-2">
            <span className="text-lg">🕵️</span> WALLET INTELLIGENCE
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 font-mono text-xs text-slate-300">
          
          {/* Address & Quick Links */}
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Address:</span>
              <span className="text-white font-semibold">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => copyToClipboard(wallet.address)} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-cyan-400 transition-colors">
                <Copy size={12} /> Copy
              </button>
              <a href={`https://solscan.io/account/${wallet.address}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-purple-400 transition-colors">
                Solscan <ExternalLink size={12} />
              </a>
              <a href={`https://gmgn.ai/sol/address/${wallet.address}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-orange-400 transition-colors">
                GMGN <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0d1425] p-3 rounded-lg border border-slate-800">
              <div className="text-slate-500 mb-1 flex items-center gap-1"><Wallet size={12}/> SOL Balance</div>
              <div className="text-lg text-white">{wallet.balance} SOL</div>
            </div>
            <div className="bg-[#0d1425] p-3 rounded-lg border border-slate-800">
              <div className="text-slate-500 mb-1 flex items-center gap-1"><Activity size={12}/> 7D Win Rate</div>
              <div className="text-lg text-green-400">{wallet.winRate}%</div>
            </div>
          </div>

          {/* Funding Origin */}
          <div className="flex items-center justify-between p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-slate-400">
              <AlertTriangle size={14} className="text-red-400" />
              Funding Origin:
            </div>
            <div className="text-red-300 bg-red-900/30 px-2 py-0.5 rounded border border-red-500/30">
              {wallet.fundingOrigin}
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/50">
            <Crosshair size={16} /> Snipe / Copytrade
          </button>
        </div>
      </div>
    </div>
  );
}