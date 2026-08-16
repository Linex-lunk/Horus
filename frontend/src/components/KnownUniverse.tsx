import React from 'react';
import { Globe, Pin, Trash2, ArrowUpRight, ShieldAlert } from 'lucide-react';

interface PinnedGalaxy {
  mint: string;
  name: string;
  cabal_index: number;
  nodes_count: number;
  timestamp: number;
}

interface KnownUniverseProps {
  pinnedGalaxies: PinnedGalaxy[];
  activeMint: string;
  onSelectGalaxy: (mint: string) => void;
  onUnpinGalaxy: (mint: string) => void;
}

export const KnownUniverse: React.FC<KnownUniverseProps> = ({
  pinnedGalaxies,
  activeMint,
  onSelectGalaxy,
  onUnpinGalaxy
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <h2 className="text-sm font-bold tracking-wider text-cyan-400 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
          THE KNOWN UNIVERSE (PINNED SURVEILLANCE)
        </h2>
        <span className="text-xs bg-slate-800 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono">
          {pinnedGalaxies.length} Galaxies Tracked
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {pinnedGalaxies.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-10 space-y-2">
            <Pin className="w-8 h-8 text-slate-700 animate-bounce" />
            <p className="text-xs">No cabal clusters pinned yet.<br />Scan a mint address and pin its galaxy into the Known Universe.</p>
          </div>
        ) : (
          pinnedGalaxies.map((galaxy) => {
            const isActive = galaxy.mint === activeMint;
            return (
              <div
                key={galaxy.mint}
                onClick={() => onSelectGalaxy(galaxy.mint)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                  isActive
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 text-xs truncate">{galaxy.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-900/50 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      {galaxy.cabal_index}% Cabal
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    Mint: {galaxy.mint}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnpinGalaxy(galaxy.mint);
                    }}
                    className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
                    title="Unpin from surveillance"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ArrowUpRight className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
