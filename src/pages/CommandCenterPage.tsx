import { lazy, Suspense } from 'react';
import { SystemHealthCard }   from '../components/CommandCenter/SystemHealthCard';
import { AgentActivityCard }  from '../components/CommandCenter/AgentActivityCard';
import { OllamaStatusCard }   from '../components/CommandCenter/OllamaStatusCard';
import { ForgePipelinesCard } from '../components/CommandCenter/ForgePipelinesCard';
import { BudgetCard }         from '../components/CommandCenter/BudgetCard';
import { DockerLiveCard }     from '../components/CommandCenter/DockerLiveCard';
import { PrometheusLiveCard } from '../components/CommandCenter/PrometheusLiveCard';
import { ChromaDbLiveCard }   from '../components/CommandCenter/ChromaDbLiveCard';
import { SonarqubeLiveCard }  from '../components/CommandCenter/SonarqubeLiveCard';
import { GrafanaLiveCard }    from '../components/CommandCenter/GrafanaLiveCard';
import { CardSlot }           from '../systems/CardSlot';
import { useAppStore }        from '../lib/store';

/**
 * CommandCenterPage — route `/`.
 *
 * Layout:
 *   • Top: 10 live service cards (SYSTEM OVERVIEW)
 *   • Center: animated JARVIS logo — pulses when streaming
 */
export function CommandCenterPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      <SectionTitle text="SYSTEM OVERVIEW" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3">
        <CardSlot serviceId="backend"><SystemHealthCard /></CardSlot>
        <CardSlot serviceId="bruce"><AgentActivityCard /></CardSlot>
        <CardSlot serviceId="ollama"><OllamaStatusCard /></CardSlot>
        <CardSlot serviceId="forge"><ForgePipelinesCard /></CardSlot>
        <CardSlot serviceId="backend"><BudgetCard /></CardSlot>
        <CardSlot serviceId="docker"><DockerLiveCard /></CardSlot>
        <CardSlot serviceId="prometheus"><PrometheusLiveCard /></CardSlot>
        <CardSlot serviceId="chromadb"><ChromaDbLiveCard /></CardSlot>
        <CardSlot serviceId="sonarqube"><SonarqubeLiveCard /></CardSlot>
        <CardSlot serviceId="grafana"><GrafanaLiveCard /></CardSlot>
      </div>

      {/* Animated JARVIS core logo — takes remaining vertical space */}
      <div className="flex-1 min-h-[260px] flex items-center justify-center">
        <JarvisHudLogo />
      </div>
    </div>
  );
}

// ─── Animated JARVIS HUD logo ──────────────────────────────────────────────

function JarvisHudLogo() {
  const isStreaming = useAppStore((s) => s.streamState.isStreaming);
  const phase       = useAppStore((s) => s.streamState.phase);

  /* Ring animation durations — faster when talking */
  const d1 = isStreaming ? '3s'  : '10s';
  const d2 = isStreaming ? '2s'  : '7s';
  const d3 = isStreaming ? '1.2s': '4.5s';
  const dPulse = isStreaming ? 'jarvis-pulse 0.75s ease-in-out infinite'
                             : 'jarvis-breathe 3.2s ease-in-out infinite';
  const dGlow  = isStreaming ? 'jarvis-glow-talk 0.75s ease-in-out infinite'
                             : 'jarvis-glow-fade 3.2s ease-in-out infinite';

  const label = isStreaming
    ? (phase || 'PROCESSING')
    : 'JARVIS · ONLINE';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        userSelect: 'none',
        padding: '16px 0',
      }}
    >
      {/* ── Orb container ─────────────────────── */}
      <div style={{ position: 'relative', width: 220, height: 220 }}>

        {/* Outermost slow ring — dashed, very faint */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '1px dashed rgba(0,212,255,0.18)',
          animation: `jarvis-spin-cw ${d1} linear infinite`,
        }} />

        {/* Outer ring with tick segments */}
        <div style={{
          position: 'absolute', inset: '6%',
          borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.28)',
          borderTopColor: 'rgba(0,212,255,0.7)',
          animation: `jarvis-spin-ccw ${d2} linear infinite`,
        }} />

        {/* Mid ring */}
        <div style={{
          position: 'absolute', inset: '16%',
          borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.22)',
          borderBottomColor: 'rgba(0,212,255,0.65)',
          borderRightColor: 'rgba(0,212,255,0.5)',
          animation: `jarvis-spin-cw ${d3} linear infinite`,
        }} />

        {/* Inner containment ring */}
        <div style={{
          position: 'absolute', inset: '26%',
          borderRadius: '50%',
          border: `1px solid rgba(0,212,255,${isStreaming ? 0.7 : 0.4})`,
          animation: `jarvis-spin-ccw ${d3} linear infinite`,
        }} />

        {/* Plasma core */}
        <div style={{
          position: 'absolute', inset: '32%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 35%, #b0f0ff 0%, #00d4ff 35%, #0055cc 80%, #001244 100%)',
          animation: `${dPulse}, ${dGlow}`,
        }} />

        {/* Corona halo (behind core) */}
        <div style={{
          position: 'absolute', inset: '28%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.25) 0%, transparent 70%)',
          filter: 'blur(8px)',
          animation: dGlow,
        }} />
      </div>

      {/* ── Status label ──────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.32em',
          color: '#00d4ff',
          textShadow: '0 0 14px rgba(0,212,255,0.7)',
          animation: isStreaming ? 'jarvis-text-flicker 4s linear infinite' : undefined,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 9,
          letterSpacing: '0.28em',
          color: 'var(--hud-text-dim)',
        }}>
          {isStreaming ? '◆ TRANSMITTING' : '● REACTOR STABLE'}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div
      className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em]"
      style={{ color: 'var(--hud-text-dim)' }}
    >
      <span style={{ color: 'var(--color-jarvis)' }}>◆</span>
      {text}
      <span className="flex-1" style={{ height: 1, background: 'var(--hud-border)' }} />
    </div>
  );
}
