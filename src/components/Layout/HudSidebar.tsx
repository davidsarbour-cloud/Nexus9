import { useNavigate, useLocation } from 'react-router';
import {
  Cpu, Brain, Hammer, Lock, ShieldAlert, Eye,
  LineChart, BarChart3, Bug, Database, Container, Server,
  BookOpen, Sparkles, Workflow, MessageSquare,
  Grid3x3, Globe, Network,
} from 'lucide-react';

import { cssVar, type ModuleKey } from '../../lib/colors';

type Entry = {
  label: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  colorKey?: ModuleKey;
  route?: string;        // optional navigation
  external?: string;     // open in new tab
  status?: 'on' | 'off' | 'warn';
  /** If true, clicking opens the Vault Graph overlay instead of navigating. */
  vaultGraph?: boolean;
};

type Section = {
  title: string;
  entries: Entry[];
};

const SECTIONS: Section[] = [
  {
    title: 'VIEWS',
    entries: [
      { label: 'Command Center', icon: Grid3x3,  colorKey: 'jarvis',  route: '/',              status: 'on' },
      { label: 'Orbital View',   icon: Globe,    colorKey: 'forge',   route: '/orbital',       status: 'on' },
      { label: 'Agent Network',  icon: Network,  colorKey: 'cortex',  route: '/agent-network', status: 'on' },
      { label: 'Brain Hub',      icon: Brain,    colorKey: 'vault',   route: '/brain',         status: 'on' },
    ],
  },
  {
    title: 'AI ENTITIES',
    entries: [
      { label: 'JARVIS',       icon: Cpu,         colorKey: 'jarvis',    status: 'on' },
      { label: 'Cortex',       icon: Brain,       colorKey: 'cortex',    status: 'on' },
      { label: 'Forge',        icon: Hammer,      colorKey: 'forge',     status: 'on' },
      { label: 'Vault',        icon: Lock,        colorKey: 'vault',     status: 'on' },
      { label: 'Security',     icon: ShieldAlert, colorKey: 'security',  status: 'warn' },
      { label: 'Surveillance', icon: Eye,         colorKey: 'cyberdeck', status: 'on' },
    ],
  },
  {
    title: 'SYSTEMS',
    entries: [
      { label: 'Prometheus', icon: LineChart, colorKey: 'forge',    external: 'http://localhost:9090', status: 'on' },
      { label: 'Grafana',    icon: BarChart3, colorKey: 'security', external: 'http://localhost:3001', status: 'on' },
      { label: 'SonarQube',  icon: Bug,       colorKey: 'cyberdeck', external: 'http://localhost:9000', status: 'on' },
      { label: 'ChromaDB',   icon: Database,  colorKey: 'vault',    status: 'on' },
      { label: 'Docker',     icon: Container, colorKey: 'docker',   status: 'on' },
      { label: 'Ollama',     icon: Server,    colorKey: 'jarvis',   external: 'http://localhost:11434', status: 'on' },
    ],
  },
  {
    title: 'TOOLS',
    entries: [
      { label: 'Obsidian',    icon: BookOpen, colorKey: 'vault',    vaultGraph: true, status: 'on' },
      { label: 'Superpowers', icon: Sparkles, colorKey: 'forge',    external: 'http://localhost:8082', status: 'on' },
      { label: 'OpenHands',   icon: Workflow, colorKey: 'commerce', external: 'http://localhost:3000', status: 'on' },
      { label: 'Chat',        icon: MessageSquare, colorKey: 'jarvis', route: '/chat', status: 'on' },
    ],
  },
];

/**
 * HudSidebar — left tactical nav, fixed width 240px.
 * 4 sections: VIEWS / AI ENTITIES / SYSTEMS / TOOLS.
 * External entries open in new tab; route entries navigate inside React.
 * `onOpenVaultGraph` triggers the Vault Graph overlay from the parent layout.
 */
export function HudSidebar({ onOpenVaultGraph }: { onOpenVaultGraph?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className="flex flex-col shrink-0 overflow-y-auto"
      style={{
        width: 240,
        background: 'var(--hud-bg-elev)',
        borderRight: '1px solid var(--hud-border)',
      }}
    >
      {SECTIONS.map((section) => (
        <div key={section.title} className="px-3 pt-4 pb-2">
          <div
            className="px-1 pb-2 text-[9px] font-bold tracking-[0.25em]"
            style={{
              color: 'var(--hud-text-dim)',
              borderBottom: '1px solid var(--hud-border)',
            }}
          >
            ── {section.title}
          </div>

          <div className="flex flex-col gap-0.5 mt-2">
            {section.entries.map((entry) => {
              const color = entry.colorKey ? cssVar(entry.colorKey) : 'var(--hud-text)';
              const isActive = entry.route && location.pathname === entry.route;
              const handleClick = () => {
                if (entry.vaultGraph) {
                  onOpenVaultGraph?.();
                } else if (entry.external) {
                  window.open(entry.external, '_blank', 'noopener,noreferrer');
                } else if (entry.route) {
                  navigate(entry.route);
                }
              };
              return (
                <button
                  key={entry.label}
                  onClick={handleClick}
                  className="flex items-center gap-2.5 px-2 py-1.5 text-[11px] tracking-wider transition-colors cursor-pointer text-left"
                  style={{
                    color: isActive ? color : 'var(--hud-text)',
                    background: isActive ? 'rgba(0,212,255,0.06)' : 'transparent',
                    borderLeft: isActive
                      ? `2px solid ${color}`
                      : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.04)';
                    e.currentTarget.style.color = color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isActive ? 'rgba(0,212,255,0.06)' : 'transparent';
                    e.currentTarget.style.color = isActive ? color : 'var(--hud-text)';
                  }}
                >
                  <entry.icon size={13} style={{ color }} />
                  <span className="flex-1">{entry.label}</span>
                  <StatusDot state={entry.status} />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}

function StatusDot({ state }: { state?: 'on' | 'off' | 'warn' }) {
  const map = {
    on:   { c: 'var(--color-docker)',    glow: 'var(--color-docker-glow)' },
    warn: { c: 'var(--color-security)',  glow: 'var(--color-security-glow)' },
    off:  { c: 'var(--color-cyberdeck)', glow: 'var(--color-cyberdeck-glow)' },
  } as const;
  const s = state ? map[state] : map.off;
  return (
    <span
      className="w-1.5 h-1.5 rounded-full"
      style={{ background: s.c, boxShadow: `0 0 4px ${s.glow}` }}
    />
  );
}
