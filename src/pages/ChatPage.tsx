import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { ChatArea } from '../components/Chat/ChatArea';
import { SystemPanel } from '../components/Chat/SystemPanel';
import { ConversationList } from '../components/Sidebar/ConversationList';

/**
 * ChatPage — inside HudLayout, route `/chat`.
 *
 *  ┌──────────────┬─────────────────────────────┬────────────────────┐
 *  │  History     │   JARVIS logo (grand,        │  Messages + input  │
 *  │  (220px)     │   animé, flex-1)             │  (380px)           │
 *  └──────────────┴─────────────────────────────┴────────────────────┘
 */
export function ChatPage() {
  const systemPanelOpen  = useAppStore((s) => s.systemPanelOpen);
  const [searchQuery, setSearchQuery] = useState('');
  const createConversation = useAppStore((s) => s.createConversation);
  const selectedModel      = useAppStore((s) => s.selectedModel);
  const messages           = useAppStore((s) => s.messages);

  const handleNewChat = () => {
    if (messages.length === 0) return;
    createConversation(selectedModel);
  };

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden" style={{ height: '100%' }}>

      {/* ── 1. Conversation history ─────────── */}
      <div
        className="flex flex-col shrink-0 overflow-hidden"
        style={{
          width: 220,
          borderRight: '1px solid var(--hud-border)',
          background: 'var(--hud-bg-elev)',
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-2 shrink-0"
          style={{ borderBottom: '1px solid var(--hud-border)' }}
        >
          <span className="text-[9px] font-bold tracking-[0.22em]" style={{ color: 'var(--hud-text-dim)' }}>
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

        <div className="px-2 py-1.5 shrink-0" style={{ borderBottom: '1px solid var(--hud-border)' }}>
          <div
            className="flex items-center gap-1.5 px-2 py-1"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--hud-border)' }}
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

        <div className="flex-1 overflow-y-auto px-1 py-1">
          <ConversationList searchQuery={searchQuery} />
        </div>
      </div>

      {/* ── 2. JARVIS logo grand (centre, flex-1) ── */}
      <div
        className="flex-1 flex items-center justify-center min-w-0 overflow-hidden"
        style={{ background: 'var(--hud-bg)' }}
      >
        <JarvisLogo />
      </div>

      {/* ── 3. Chat messages + input (droite, fixe) ── */}
      <div
        className="flex shrink-0 overflow-hidden"
        style={{
          width: 380,
          borderLeft: '1px solid var(--hud-border)',
        }}
      >
        <div className="flex-1 min-w-0">
          <ChatArea />
        </div>
        {systemPanelOpen && <SystemPanel />}
      </div>
    </div>
  );
}

// ─── Jarvis animated logo ──────────────────────────────────────────────────

function JarvisLogo() {
  const isStreaming = useAppStore((s) => s.streamState.isStreaming);
  const phase       = useAppStore((s) => s.streamState.phase);

  /* Rings spin much faster when talking */
  const d1 = isStreaming ? '1.4s'  : '12s';
  const d2 = isStreaming ? '0.9s'  : '8s';
  const d3 = isStreaming ? '0.55s' : '5s';
  const d4 = isStreaming ? '0.35s' : '3.5s';

  const dPulse = isStreaming
    ? 'jarvis-pulse 0.5s ease-in-out infinite'
    : 'jarvis-breathe 4s ease-in-out infinite';
  const dGlow = isStreaming
    ? 'jarvis-glow-talk 0.5s ease-in-out infinite'
    : 'jarvis-glow-fade 4s ease-in-out infinite';

  const statusLabel = isStreaming ? (phase || 'EN TRAITEMENT') : 'JARVIS · EN ÉCOUTE';
  const subLabel    = isStreaming ? '◆ TRANSMISSION ACTIVE'   : '● RÉACTEUR STABLE';

  /* Dynamic orb size based on talking state */
  const orbSize = isStreaming ? 300 : 260;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        userSelect: 'none',
      }}
    >
      {/* ── Orb ─────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          width: orbSize,
          height: orbSize,
          transition: 'width 0.4s ease, height 0.4s ease',
        }}
      >
        {/* Ring 1 — outermost slow dashed */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px dashed rgba(0,212,255,0.15)',
          animation: `jarvis-spin-cw ${d1} linear infinite`,
        }} />

        {/* Ring 2 */}
        <div style={{
          position: 'absolute', inset: '6%', borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.25)',
          borderTopColor: `rgba(0,212,255,${isStreaming ? 1 : 0.65})`,
          animation: `jarvis-spin-ccw ${d2} linear infinite`,
          boxShadow: isStreaming ? '0 0 12px rgba(0,212,255,0.3)' : 'none',
          transition: 'box-shadow 0.4s ease',
        }} />

        {/* Ring 3 */}
        <div style={{
          position: 'absolute', inset: '14%', borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.22)',
          borderBottomColor: `rgba(0,212,255,${isStreaming ? 0.9 : 0.6})`,
          borderRightColor:  `rgba(0,212,255,${isStreaming ? 0.7 : 0.45})`,
          animation: `jarvis-spin-cw ${d3} linear infinite`,
        }} />

        {/* Ring 4 — inner fast ring, only visible when talking */}
        <div style={{
          position: 'absolute', inset: '22%', borderRadius: '50%',
          border: `1px solid rgba(0,212,255,${isStreaming ? 0.8 : 0.35})`,
          animation: `jarvis-spin-ccw ${d4} linear infinite`,
          transition: 'opacity 0.4s ease',
        }} />

        {/* Ring 5 — containment */}
        <div style={{
          position: 'absolute', inset: '30%', borderRadius: '50%',
          border: `2px solid rgba(0,212,255,${isStreaming ? 0.6 : 0.3})`,
          animation: `jarvis-spin-cw ${d4} linear infinite`,
          boxShadow: isStreaming ? 'inset 0 0 20px rgba(0,212,255,0.15)' : 'none',
          transition: 'box-shadow 0.4s ease',
        }} />

        {/* Corona glow */}
        <div style={{
          position: 'absolute', inset: '26%', borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,212,255,${isStreaming ? 0.45 : 0.2}) 0%, transparent 70%)`,
          filter: `blur(${isStreaming ? 14 : 8}px)`,
          animation: dGlow,
          transition: 'filter 0.4s ease',
        }} />

        {/* Plasma core */}
        <div style={{
          position: 'absolute', inset: '34%', borderRadius: '50%',
          background: isStreaming
            ? 'radial-gradient(circle at 38% 35%, #ffffff 0%, #7ff8ff 15%, #00d4ff 40%, #0066ff 80%, #001244 100%)'
            : 'radial-gradient(circle at 38% 35%, #c8f8ff 0%, #00d4ff 35%, #0055cc 80%, #001244 100%)',
          animation: `${dPulse}, ${dGlow}`,
          transition: 'background 0.4s ease',
        }} />

        {/* Extra outer corona when talking */}
        {isStreaming && (
          <div style={{
            position: 'absolute', inset: '-8%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
            filter: 'blur(20px)',
            animation: 'jarvis-glow-talk 0.5s ease-in-out infinite',
          }} />
        )}
      </div>

      {/* ── Status labels ────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.32em',
          color: '#00d4ff',
          textShadow: isStreaming
            ? '0 0 20px rgba(0,212,255,0.9), 0 0 40px rgba(0,212,255,0.4)'
            : '0 0 12px rgba(0,212,255,0.6)',
          animation: isStreaming ? 'jarvis-text-flicker 3s linear infinite' : undefined,
          textAlign: 'center',
          transition: 'text-shadow 0.4s ease',
        }}>
          {statusLabel}
        </div>
        <div style={{
          fontSize: 10,
          letterSpacing: '0.28em',
          color: isStreaming ? 'var(--color-jarvis)' : 'var(--hud-text-dim)',
          textAlign: 'center',
          transition: 'color 0.4s ease',
        }}>
          {subLabel}
        </div>
      </div>
    </div>
  );
}
