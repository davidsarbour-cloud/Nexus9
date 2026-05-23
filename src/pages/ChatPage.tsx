import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { ChatArea } from '../components/Chat/ChatArea';
import { SystemPanel } from '../components/Chat/SystemPanel';
import { ConversationList } from '../components/Sidebar/ConversationList';

/**
 * ChatPage — inside HudLayout, route `/chat`.
 *
 * Layout (left → right):
 *   ┌─────────────────┬──────────────────┬──────────────────────────────┐
 *   │ Conversations   │  Jarvis Logo     │  Messages + Input            │
 *   │ (history panel) │  (animated,      │  (streaming chat area)       │
 *   │ 220px           │   pulses when    │  flex-1                      │
 *   │                 │   talking) 200px │                              │
 *   └─────────────────┴──────────────────┴──────────────────────────────┘
 *
 * The HudSidebar and RightPanel are provided by the parent HudLayout.
 */
export function ChatPage() {
  const systemPanelOpen = useAppStore((s) => s.systemPanelOpen);
  const [searchQuery, setSearchQuery] = useState('');
  const createConversation = useAppStore((s) => s.createConversation);
  const selectedModel = useAppStore((s) => s.selectedModel);
  const messages = useAppStore((s) => s.messages);

  const handleNewChat = () => {
    if (messages.length === 0) return; // already empty
    createConversation(selectedModel);
  };

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── 1. Conversation history panel ──────── */}
      <div
        className="flex flex-col shrink-0 overflow-hidden"
        style={{
          width: 220,
          borderRight: '1px solid var(--hud-border)',
          background: 'var(--hud-bg-elev)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-3 py-2 shrink-0"
          style={{ borderBottom: '1px solid var(--hud-border)' }}
        >
          <span
            className="text-[9px] font-bold tracking-[0.22em]"
            style={{ color: 'var(--hud-text-dim)' }}
          >
            ── HISTORY
          </span>
          <button
            onClick={handleNewChat}
            title="New chat"
            className="p-1 cursor-pointer rounded transition-colors"
            style={{ color: 'var(--hud-text-dim)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-jarvis)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--hud-text-dim)'; }}
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Search */}
        <div className="px-2 py-1.5 shrink-0" style={{ borderBottom: '1px solid var(--hud-border)' }}>
          <div
            className="flex items-center gap-1.5 px-2 py-1 text-[10px]"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--hud-border)',
            }}
          >
            <Search size={10} style={{ color: 'var(--hud-text-dim)' }} />
            <input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              style={{
                color: 'var(--hud-text)',
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: 10,
              }}
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-1 py-1">
          <ConversationList searchQuery={searchQuery} />
        </div>
      </div>

      {/* ── 2. Jarvis animated logo ───────────── */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 200,
          borderRight: '1px solid var(--hud-border)',
          background: 'var(--hud-bg)',
        }}
      >
        <JarvisLogo />
      </div>

      {/* ── 3. Chat messages + input ──────────── */}
      <div className="flex-1 min-w-0 flex overflow-hidden">
        <div className="flex-1 min-w-0">
          <ChatArea />
        </div>
        {systemPanelOpen && <SystemPanel />}
      </div>
    </div>
  );
}

// ─── Animated Jarvis logo ──────────────────────────────────────────────────

function JarvisLogo() {
  const isStreaming = useAppStore((s) => s.streamState.isStreaming);
  const phase       = useAppStore((s) => s.streamState.phase);

  const d1 = isStreaming ? '2.5s' : '10s';
  const d2 = isStreaming ? '1.8s' : '7s';
  const d3 = isStreaming ? '1.1s' : '4.5s';

  const dPulse = isStreaming
    ? 'jarvis-pulse 0.75s ease-in-out infinite'
    : 'jarvis-breathe 3.2s ease-in-out infinite';
  const dGlow = isStreaming
    ? 'jarvis-glow-talk 0.75s ease-in-out infinite'
    : 'jarvis-glow-fade 3.2s ease-in-out infinite';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, userSelect: 'none', padding: '0 12px' }}>

      {/* Orb */}
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px dashed rgba(0,212,255,0.18)',
          animation: `jarvis-spin-cw ${d1} linear infinite`,
        }} />
        <div style={{
          position: 'absolute', inset: '8%', borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.28)',
          borderTopColor: 'rgba(0,212,255,0.7)',
          animation: `jarvis-spin-ccw ${d2} linear infinite`,
        }} />
        <div style={{
          position: 'absolute', inset: '20%', borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.22)',
          borderBottomColor: 'rgba(0,212,255,0.65)',
          animation: `jarvis-spin-cw ${d3} linear infinite`,
        }} />
        <div style={{
          position: 'absolute', inset: '30%', borderRadius: '50%',
          border: `1px solid rgba(0,212,255,${isStreaming ? 0.75 : 0.4})`,
          animation: `jarvis-spin-ccw ${d3} linear infinite`,
        }} />
        {/* Corona */}
        <div style={{
          position: 'absolute', inset: '28%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.28) 0%, transparent 70%)',
          filter: 'blur(6px)', animation: dGlow,
        }} />
        {/* Core */}
        <div style={{
          position: 'absolute', inset: '34%', borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 35%, #c8f8ff 0%, #00d4ff 35%, #0055cc 80%, #001244 100%)',
          animation: `${dPulse}, ${dGlow}`,
        }} />
      </div>

      {/* Label */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          fontSize: 10, fontWeight: 700, letterSpacing: '0.26em',
          color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.6)',
          animation: isStreaming ? 'jarvis-text-flicker 4s linear infinite' : undefined,
          textAlign: 'center',
        }}>
          {isStreaming ? (phase || 'PROCESSING') : 'JARVIS · ONLINE'}
        </div>
        <div style={{ fontSize: 8, letterSpacing: '0.22em', color: 'var(--hud-text-dim)', textAlign: 'center' }}>
          {isStreaming ? '◆ TRANSMITTING' : '● REACTOR STABLE'}
        </div>
      </div>
    </div>
  );
}
