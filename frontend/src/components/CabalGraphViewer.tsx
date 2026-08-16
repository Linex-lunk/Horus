import React, { useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Shield, Cpu } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  val: number;
  color: string;
  role: string;
  address: string;
  balance: string;
  fundingWeight: string;
  x?: number;
  y?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  value: number;
  type: string;
}

interface CabalGraphViewerProps {
  graphData: {
    nodes: Node[];
    links: Link[];
    summary?: any;
  };
  onSelectNode?: (node: Node) => void;
}

export const CabalGraphViewer: React.FC<CabalGraphViewerProps> = ({ graphData, onSelectNode }) => {
  const fgRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-950 overflow-hidden border border-slate-800/80 rounded-xl shadow-2xl">
      {/* Legend Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-lg text-xs space-y-2 shadow-lg">
        <div className="font-bold text-slate-200 tracking-wider mb-1 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          COSMIC NODE TOPOLOGY
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]"></span>
          <span className="text-slate-300">Token Mint Node (#3b82f6)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]"></span>
          <span className="text-slate-300">Root Funder Wallets (#ef4444)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316]"></span>
          <span className="text-slate-300">Upstream Sub-Wallets (#f97316)</span>
        </div>
      </div>

      {/* Hover-State Telemetry Box */}
      {hoveredNode && (
        <div className="absolute bottom-4 right-4 z-20 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 p-4 rounded-xl text-xs w-72 shadow-[0_0_20px_rgba(6,182,212,0.15)] space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              {hoveredNode.role}
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
              {hoveredNode.fundingWeight}
            </span>
          </div>
          <div className="space-y-1 text-slate-300">
            <div><span className="text-slate-500">Entity Name:</span> <span className="text-slate-100 font-semibold">{hoveredNode.name}</span></div>
            <div className="truncate"><span className="text-slate-500">Address:</span> <span className="font-mono text-cyan-200">{hoveredNode.address}</span></div>
            <div><span className="text-slate-500">Balance:</span> <span className="text-emerald-400 font-mono">{hoveredNode.balance}</span></div>
          </div>
        </div>
      )}

      {/* Force Graph Renderer */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel={(node: any) => `${node.role}: ${node.name} (${node.address})`}
        nodeColor={(node: any) => node.color}
        nodeVal={(node: any) => node.val}
        nodeRelSize={6}
        linkCurvature={0.2}
        linkColor={() => 'rgba(100, 116, 139, 0.3)'}
        linkWidth={1.5}
        backgroundColor="#020617"
        onNodeHover={(node: any) => setHoveredNode(node || null)}
        onNodeClick={(node: any) => onSelectNode && onSelectNode(node)}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 11 / globalScale;
          ctx.font = `${fontSize}px monospace`;
          
          // Draw outer glow circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val * 0.6, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0; // reset

          // Inner core dot
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val * 0.3, 0, 2 * Math.PI, false);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // Label text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(label, node.x, node.y + node.val * 0.7);
        }}
      />
    </div>
  );
};
