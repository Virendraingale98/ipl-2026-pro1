import { useState } from 'react';
import { players, teams, topRunScorers, topWicketTakers, getTeamById } from '../data/iplData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

type StatTab = 'Orange Cap' | 'Purple Cap' | 'All Players' | 'Comparison';

export default function Players() {
  const [tab, setTab] = useState<StatTab>('Orange Cap');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (roleFilter === 'All' || p.role === roleFilter)
  );

  const toggleCompare = (id: number) => {
    setSelectedPlayers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
        <strong>{label}</strong>
        {payload.map((p: any) => <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
      </div>
    );
    return null;
  };

  return (
    <div className="page fade-in">
      <div className="container">
        <div className="section-header mb-16">
          <div className="section-title">👤 Players & Stats</div>
        </div>

        <div className="stats-tabs mb-24">
          {(['Orange Cap', 'Purple Cap', 'All Players', 'Comparison'] as StatTab[]).map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'Orange Cap' && '🟠 '}{t === 'Purple Cap' && '🟣 '}{t}
            </button>
          ))}
        </div>

        {/* Orange Cap Leaderboard */}
        {tab === 'Orange Cap' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div className="section-title mb-16" style={{ fontSize: 16 }}>🟠 Most Runs - IPL 2026</div>
              {topRunScorers.map((p, i) => {
                const team = getTeamById(p.teamId);
                const pct = (p.runs / topRunScorers[0].runs) * 100;
                return (
                  <div key={p.id} className="leaderboard-row">
                    <div className={`leaderboard-rank ${i === 0 ? 'one' : i === 1 ? 'two' : i === 2 ? 'three' : ''}`}>
                      {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{team?.shortName} · {p.matches} matches</div>
                    </div>
                    <div className="leaderboard-bar-wrap" style={{ maxWidth: 140 }}>
                      <div className="leaderboard-bar-fill" style={{ width: `${pct}%`, background: i === 0 ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : undefined }} />
                    </div>
                    <div className="leaderboard-val">{p.runs}</div>
                  </div>
                );
              })}
            </div>

            <div className="card">
              <div className="section-title mb-16" style={{ fontSize: 15 }}>Runs Distribution</div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topRunScorers.slice(0, 8).map(p => ({ name: p.name.split(' ')[1] || p.name.split(' ')[0], runs: p.runs, avg: p.average.toFixed(1) }))}>
                    <XAxis dataKey="name" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="runs" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Purple Cap Leaderboard */}
        {tab === 'Purple Cap' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div className="section-title mb-16" style={{ fontSize: 16 }}>🟣 Most Wickets - IPL 2026</div>
              {topWicketTakers.map((p, i) => {
                const team = getTeamById(p.teamId);
                const pct = (p.wickets / topWicketTakers[0].wickets) * 100;
                return (
                  <div key={p.id} className="leaderboard-row">
                    <div className={`leaderboard-rank ${i === 0 ? 'one' : i === 1 ? 'two' : i === 2 ? 'three' : ''}`}>
                      {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{team?.shortName} · Eco {p.economy}</div>
                    </div>
                    <div className="leaderboard-bar-wrap" style={{ maxWidth: 140 }}>
                      <div className="leaderboard-bar-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#8b5cf6,#6366f1)' }} />
                    </div>
                    <div className="leaderboard-val">{p.wickets}</div>
                  </div>
                );
              })}
            </div>

            <div className="card">
              <div className="section-title mb-16" style={{ fontSize: 15 }}>Wickets Chart</div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topWicketTakers.slice(0, 8).map(p => ({ name: p.name.split(' ')[1] || p.name.split(' ')[0], wickets: p.wickets, eco: p.economy }))}>
                    <XAxis dataKey="name" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="wickets" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* All Players Grid */}
        {tab === 'All Players' && (
          <>
            <div className="filter-row">
              <input className="search-input" style={{ maxWidth: 280 }} placeholder="🔍 Search players..." value={search} onChange={e => setSearch(e.target.value)} />
              <select className="select-styled" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                <option>All</option>
                <option>Batsman</option>
                <option>Bowler</option>
                <option>All-rounder</option>
                <option>Wicket-keeper</option>
              </select>
            </div>
            <div className="grid-3">
              {filtered.map(p => {
                const team = getTeamById(p.teamId);
                const roleClass = p.role === 'Batsman' ? 'role-bat' : p.role === 'Bowler' ? 'role-bowl' : p.role === 'All-rounder' ? 'role-all' : 'role-wk';
                const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <div key={p.id} className="player-card">
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <div className="player-avatar" style={{ marginBottom: 0, background: `linear-gradient(135deg, ${team?.color}aa, ${team?.secondaryColor}88)` }}>{initials}</div>
                      <div>
                        <div className="player-name">{p.name}</div>
                        <span className={`player-role-badge ${roleClass}`}>{p.role}</span>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{team?.shortName} · #{p.jerseyNumber}</div>
                      </div>
                    </div>
                    <div className="player-stats-grid">
                      {p.role !== 'Bowler' ? (
                        <>
                          <div className="stat-item"><div className="stat-val">{p.runs}</div><div className="stat-label">Runs</div></div>
                          <div className="stat-item"><div className="stat-val">{p.average.toFixed(0)}</div><div className="stat-label">Avg</div></div>
                          <div className="stat-item"><div className="stat-val">{p.strikeRate.toFixed(0)}</div><div className="stat-label">SR</div></div>
                        </>
                      ) : (
                        <>
                          <div className="stat-item"><div className="stat-val">{p.wickets}</div><div className="stat-label">Wkts</div></div>
                          <div className="stat-item"><div className="stat-val">{p.economy.toFixed(1)}</div><div className="stat-label">Eco</div></div>
                          <div className="stat-item"><div className="stat-val">{p.bestBowling}</div><div className="stat-label">Best</div></div>
                        </>
                      )}
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                      <span>🌍 {p.nationality} · Age {p.age}</span>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>₹{p.price}Cr</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Player Comparison */}
        {tab === 'Comparison' && (
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Select up to 2 players to compare side-by-side.
            </div>
            <div className="grid-3 mb-24">
              {players.map(p => {
                const team = getTeamById(p.teamId);
                const isSelected = selectedPlayers.includes(p.id);
                return (
                  <div key={p.id} onClick={() => toggleCompare(p.id)} style={{
                    cursor: 'pointer', background: isSelected ? 'rgba(59,130,246,0.12)' : 'var(--bg-card)',
                    border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border)',
                    borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s'
                  }}>
                    {isSelected && <div style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: 18 }}>✓</div>}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{team?.shortName} · {p.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedPlayers.length === 2 && (() => {
              const p1 = players.find(p => p.id === selectedPlayers[0])!;
              const p2 = players.find(p => p.id === selectedPlayers[1])!;
              const radarData = [
                { subject: 'Runs', A: Math.min(p1.runs / 7, 100), B: Math.min(p2.runs / 7, 100) },
                { subject: 'Avg', A: Math.min(p1.average, 100), B: Math.min(p2.average, 100) },
                { subject: 'SR', A: Math.min(p1.strikeRate / 2, 100), B: Math.min(p2.strikeRate / 2, 100) },
                { subject: 'Wkts', A: Math.min(p1.wickets * 4, 100), B: Math.min(p2.wickets * 4, 100) },
                { subject: 'Eco', A: Math.max(0, 100 - (p1.economy * 8)), B: Math.max(0, 100 - (p2.economy * 8)) },
                { subject: 'Matches', A: Math.min(p1.matches * 5, 100), B: Math.min(p2.matches * 5, 100) },
              ];
              return (
                <div className="card fade-in">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px 1fr', gap: 24, alignItems: 'center' }}>
                    {/* Player 1 */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Rajdhani', fontSize: 28, fontWeight: 700, color: '#3b82f6', marginBottom: 4 }}>{p1.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 16 }}>{getTeamById(p1.teamId)?.shortName} · {p1.role}</div>
                      {[
                        { l: 'Runs', v: p1.runs }, { l: 'Average', v: p1.average.toFixed(1) },
                        { l: 'Strike Rate', v: p1.strikeRate.toFixed(1) }, { l: 'Wickets', v: p1.wickets },
                        { l: 'Economy', v: p1.economy.toFixed(2) },
                      ].map(s => (
                        <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.l}</span>
                          <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 16 }}>{s.v}</span>
                        </div>
                      ))}
                    </div>

                    {/* Radar */}
                    <ResponsiveContainer width="100%" height={260}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#8892a4', fontSize: 10 }} />
                        <Radar name={p1.name.split(' ')[0]} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                        <Radar name={p2.name.split(' ')[0]} dataKey="B" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>

                    {/* Player 2 */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Rajdhani', fontSize: 28, fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>{p2.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 16 }}>{getTeamById(p2.teamId)?.shortName} · {p2.role}</div>
                      {[
                        { l: 'Runs', v: p2.runs }, { l: 'Average', v: p2.average.toFixed(1) },
                        { l: 'Strike Rate', v: p2.strikeRate.toFixed(1) }, { l: 'Wickets', v: p2.wickets },
                        { l: 'Economy', v: p2.economy.toFixed(2) },
                      ].map(s => (
                        <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.l}</span>
                          <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 16 }}>{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
