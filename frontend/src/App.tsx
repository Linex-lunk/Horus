import { useState, useEffect } from 'react';
import { MacroTelemetry } from './components/MacroTelemetry';
import { CabalGraphViewer } from './components/CabalGraphViewer';
import { KnownUniverse } from './components/KnownUniverse';
import LiveFeed from './components/LiveFeed';
import { Search, Pin, ShieldAlert, Cpu, RefreshCw } from 'lucide-react';

export function App() {
  const [mintInput, setMintInput] = useState<string>('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
  const [activeMint, setActiveMint] = useState<string>('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[]; summary?: any }>({ nodes: [], links: [] });
  const [pinnedGalaxies, setPinnedGalaxies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Initial mock items for the live feed with full wallet intelligence details
  const [liveAlerts, setLiveAlerts] = useState([
    {
      type: 'SWAP',
      timestamp: '22:25:12',
      amount: 14.5,
      senderAddress: 'Luckyw2bt7nYBhvEZLnznAsQmReBbMngyduxsP5kktR',
      receiverAddress: 'ADallN1d0yflIyLqMgopwjhdDTISokTSzlizt61GPaS49',
      senderDetails: {
        address: 'Luckyw2bt7nYBhvEZLnznAsQmReBbMngyduxsP5kktR',
        balance: 24.8,
        winRate: 82.4,
        fundingOrigin: 'FixedFloat CEX'
      }
    },
    {
      type: 'TRANSFER',
      timestamp: '22:25:12',
      amount: 2.1,
      senderAddress: 'DfXygSm4JcYnCyhVYYKSDvwqjKccBp8DnJ6LmXDXIjh.',
      receiverAddress: 'So11111111111111111111111111111111111111112',
      senderDetails: {
        address: 'DfXygSm4JcYnCyhVYYKSDvwqjKccBp8DnJ6LmXDXIjh.',
        balance: 5.4,
        winRate: 64.0,
        fundingOrigin: 'Binance Hot Wallet'
      }
    },
    {
      type: 'SWAP',
      timestamp: '22:25:13',
      amount: 32.0,
      senderAddress: '3hbyUx4Wd87N',
      receiverAddress: 'Raydium Liquidity Pool',
      senderDetails: {
        address: '3hbyUx4Wd87N',
        balance: 112.5,
        winRate: 91.2,
        fundingOrigin: 'Unknown / Fresh Funder'
      }
    }
  ]);

  // WebSocket connection for real-time pulse alerts
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/api/ws/pulse');
    
    ws.onmessage = (event) => {
      try {
        const newAlert = JSON.parse(event.data);
        const formattedAlert = {
          type: newAlert.type || 'SWAP',
          timestamp: newAlert.timestamp || new Date().toLocaleTimeString(),
          amount: Number((Math.random() * 25).toFixed(2)),
          senderAddress: newAlert.mint || 'CabalSub99...Sol',
          receiverAddress: 'Raydium AMM',
          senderDetails: {
            address: newAlert.mint || 'CabalSub99...Sol',
            balance: Number((Math.random() * 50 + 5).toFixed(1)),
            winRate: Number((Math.random() * 30 + 65).toFixed(1)),
            fundingOrigin: 'Cabal Root Funder #1'
          }
        };

        setLiveAlerts(prev => [formattedAlert, ...prev.slice(0, 49)]);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // Fetch scan data for a mint
  const scanMint = async (mint: string) => {
    if (!mint.trim()) return;
    setLoading(true);
    setActiveMint(mint);
    try {
      const res = await fetch(`http://localhost:8000/api/scan/${mint}`);
      if (res.ok) {
        const data = await res.json();
        setGraphData(data);
      } else {
        generateFallbackData(mint);
      }
    } catch (e) {
      generateFallbackData(mint);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackData = (mint: string) => {
    const nodes = [
      { id: mint, name: `Token [${mint.slice(0, 4)}...]`, val: 35, color: '#3b82f6', role: 'Token Mint', address: mint, balance: '500,000 MINT', fundingWeight: '100%' },
      { id: 'root_1', name: 'Root Funder #1', val: 25, color: '#ef4444', role: 'Root Funder', address: 'CabalRoot9981...1', balance: '24,500 SOL', fundingWeight: '38%' },
      { id: 'root_2', name: 'Root Funder #2', val: 25, color: '#ef4444', role: 'Root Funder', address: 'CabalRoot4412...2', balance: '18,200 SOL', fundingWeight: '27%' },
      { id: 'sub_1', name: 'Sub-Wallet 1', val: 15, color: '#f97316', role: 'Sub-Wallet / Ring', address: 'CabalSub101...1', balance: '1,200 SOL', fundingWeight: '8.5% Supply' },
      { id: 'sub_2', name: 'Sub-Wallet 2', val: 15, color: '#f97316', role: 'Sub-Wallet / Ring', address: 'CabalSub102...2', balance: '980 SOL', fundingWeight: '7.2% Supply' },
      { id: 'sub_3', name: 'Sub-Wallet 3', val: 15, color: '#f97316', role: 'Sub-Wallet / Ring', address: 'CabalSub103...3', balance: '1,500 SOL', fundingWeight: '11.4% Supply' },
    ];
    const links = [
      { source: 'root_1', target: mint, value: 20, type: 'DEPLOYER_FUNDING' },
      { source: 'root_2', target: mint, value: 15, type: 'DEPLOYER_FUNDING' },
      { source: 'root_1', target: 'sub_1', value: 5, type: 'MULTI_HOP_TRANSFER' },
      { source: 'root_1', target: 'sub_2', value: 5, type: 'MULTI_HOP_TRANSFER' },
      { source: 'root_2', target: 'sub_3', value: 5, type: 'MULTI_HOP_TRANSFER' },
    ];
    setGraphData({
      nodes,
      links,
      summary: {
        mint,
        tokenName: `Token [${mint.slice(0, 4)}...]`,
        cabalControlIndex: 84.6,
        totalNodes: nodes.length,
        rootFunders: 2,
        subWallets: 3,
        insiderSupplyConcentration: '84.6%',
        riskLevel: 'CRITICAL'
      }
    });
  };

  // Fetch pinned galaxies on mount
  useEffect(() => {
    fetchPinnedGalaxies();
    scanMint(activeMint);
  }, []);

  const fetchPinnedGalaxies = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/pinned');
      if (res.ok) {
        const data = await res.json();
        setPinnedGalaxies(data);
      }
    } catch (e) {
      // ignore if backend offline
    }
  };

  const handlePinCurrentGalaxy = async () => {
    if (!graphData.summary) return;
    const summary = graphData.summary;
    const newPinned = {
      mint: summary.mint,
      name: summary.tokenName,
      cabal_index: summary.cabalControlIndex,
      nodes_count: summary.totalNodes,
      timestamp: Date.now()
    };
    try {
      await fetch('http://localhost:8000/api/pinned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPinned)
      });
      fetchPinnedGalaxies();
    } catch (e) {
      if (!pinnedGangExists(newPinned.mint)) {
        setPinnedGalaxies(prev => [newPinned, ...prev]);
      }
    }
  };

  const pinnedGangExists = (mint: string) => pinnedGalaxies.some(g => g.mint === mint);

  const handleUnpinGalaxy = async (mint: string) => {
    try {
      await fetch(`http://localhost:8000/api/pinned/${mint}`, { method: 'DELETE' });
      fetchPinnedGalaxies();
    } catch (e) {
      setPinnedGalaxies(prev => prev.filter(g => g.mint !== mint));
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans antialiased">
      {/* Global Market Observability Telemetry Header */}
      <MacroTelemetry />

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-12 gap-3 p-3 overflow-hidden bg-[#09090b]">
        
        {/* Left Column: Known Universe & Scanner Controls */}
        <div className="col-span-3 flex flex-col gap-3 overflow-hidden">
          
          {/* Multi-Hop Tracer Input Block */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-3.5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2.5">
              <h2 className="text-xs font-semibold text-zinc-200 tracking-wide flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Helius Multi-Hop Tracer
              </h2>
              <span className="text-[10px] font-mono bg-zinc-800/60 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700/40">
                v1.0.4
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-400">Solana Token Mint Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mintInput}
                  onChange={(e) => setMintInput(e.target.value)}
                  placeholder="Paste mint address..."
                  className="flex-1 bg-[#09090b] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
                />
                <button
                  onClick={() => scanMint(mintInput)}
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-semibold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-950/20 shrink-0"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  Scan
                </button>
              </div>
            </div>

            {/* Cabal Control Index Card */}
            {graphData.summary && (
              <div className="bg-[#09090b] border border-zinc-800/80 rounded-lg p-3 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">Cabal Control Index</span>
                  <span className="text-rose-400 font-bold font-mono text-xs flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {graphData.summary.cabalControlIndex}%
                  </span>
                </div>

                <div className="w-full bg-zinc-800/60 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${graphData.summary.cabalControlIndex}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400 border-t border-zinc-800/50">
                  <div className="flex gap-3">
                    <span>Root: <strong className="text-zinc-200 font-mono">{graphData.summary.rootFunders}</strong></span>
                    <span>Subs: <strong className="text-zinc-200 font-mono">{graphData.summary.subWallets}</strong></span>
                  </div>
                  <button
                    onClick={handlePinCurrentGalaxy}
                    className="bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 border border-zinc-700/60 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Pin className="w-3 h-3 text-zinc-400" />
                    Pin
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Known Universe Container */}
          <div className="flex-1 overflow-hidden rounded-xl border border-zinc-800/80 bg-[#121215]">
            <KnownUniverse
              pinnedGalaxies={pinnedGalaxies}
              activeMint={activeMint}
              onSelectGalaxy={(mint) => {
                setMintInput(mint);
                scanMint(mint);
              }}
              onUnpinGalaxy={handleUnpinGalaxy}
            />
          </div>
        </div>

        {/* Center Column: Interactive Force-Directed Network Graph */}
        <div className="col-span-6 flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-[#121215]">
          <div className="flex-1 relative overflow-hidden">
            <CabalGraphViewer graphData={graphData} />
          </div>
        </div>

        {/* Right Column: Real-Time Cabal Alert Feed ("The Pulse") */}
        <div className="col-span-3 flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-[#121215]">
          <LiveFeed initialAlerts={liveAlerts} />
        </div>

      </div>
    </div>
  );
}

export default App;