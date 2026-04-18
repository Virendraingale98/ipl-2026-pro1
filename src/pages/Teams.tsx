import { useState } from 'react';
import { teams, getPlayersByTeam, players } from '../data/iplData';

export default function Teams() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const team = selectedTeam ? teams.find(t => t.id === selectedTeam) : null;
  const teamPlayers = team ? getPlayersByTeam(team.id) : [];

  return (
    <div className="page fade-in">
      <div className="container">

        {!team ? (
          <>
            <div className="section-header mb-24">
              <div className="section-title">🏏 All Teams</div>
              <div className="text-secondary" style={{ fontSize: 13 }}>Click a team to explore</div>
            </div>

            <div className="grid-2">
              {teams.map(t => (
                <div key={t.id} className="card" style={{ cursor: 'pointer', borderLeft: `4px solid ${t.color}` }}
                  onClick={() => setSelectedTeam(t.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <div style={{ fontSize: 48 }}>{t.logo}</div>
                    <div>
                      <div style={{ fontFamily: 'Rajdhani', fontSize: 22, fontWeight: 700 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {t.homeGround}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <span style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-gold)', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                          🏆 {t.titles} Titles
                        </span>
                        <span className={`pts-badge`}>{t.points} pts</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
                    {[
                      { label: 'Mat', val: t.matches },
                      { label: 'Won', val: t.wins },
                      { label: 'Lost', val: t.losses },
                      { label: 'NRR', val: (t.nrr > 0 ? '+' : '') + t.nrr }
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: 'center', background: 'var(--bg-glass)', borderRadius: 8, padding: '8px 4px' }}>
                        <div style={{ fontFamily: 'Rajdhani', fontSize: 20, fontWeight: 700 }}>{s.val}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Captain</div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>👑 {t.captain}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Coach</div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{t.coach}</div>
                    </div>
                    <div className="form-badges">
                      {t.form.map((f, i) => <div key={i} className={f === 'W' ? 'form-w' : 'form-l'}>{f}</div>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="detail-panel fade-in">
            <button className="btn btn-ghost mb-24" onClick={() => setSelectedTeam(null)}>
              ← Back to Teams
            </button>

            {/* Team Hero */}
            <div className="team-hero" style={{ background: `linear-gradient(135deg, ${team.color}22, ${team.secondaryColor}11)`, border: `1px solid ${team.color}44` }}>
              <div className="team-hero-bg">{team.logo}</div>
              <div style={{ position: 'relative' }}>
                <div className="team-badge" style={{ background: `${team.color}20`, color: team.color, border: `1px solid ${team.color}40`, marginBottom: 12 }}>
                  {team.shortName} · {team.homeGround}
                </div>
                <div className="team-title-lg">{team.name}</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
                  👑 {team.captain} &nbsp;·&nbsp; 🎓 {team.coach}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stat-row mb-24">
              {[
                { label: 'Matches', val: team.matches, icon: '🏏' },
                { label: 'Wins', val: team.wins, icon: '✅' },
                { label: 'Losses', val: team.losses, icon: '❌' },
                { label: 'Points', val: team.points, icon: '⭐' },
                { label: 'NRR', val: (team.nrr > 0 ? '+' : '') + team.nrr, icon: '📊' },
                { label: 'Titles', val: team.titles, icon: '🏆' },
              ].map(s => (
                <div key={s.label} className="quick-stat-box">
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div className="quick-stat-val">{s.val}</div>
                  <div className="quick-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="mb-24">
              <div className="section-title mb-8" style={{ fontSize: 16 }}>Recent Form</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {team.form.map((f, i) => (
                  <div key={i} style={{
                    padding: '6px 14px', borderRadius: 6, fontWeight: 700, fontSize: 14,
                    background: f === 'W' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: f === 'W' ? 'var(--accent-green)' : 'var(--accent-red)'
                  }}>{f}</div>
                ))}
              </div>
            </div>

            {/* Players */}
            <div className="section-title mb-16" style={{ fontSize: 16 }}>Squad ({teamPlayers.length} Players)</div>
            <div className="grid-3">
              {teamPlayers.map(p => {
                const roleClass = p.role === 'Batsman' ? 'role-bat' : p.role === 'Bowler' ? 'role-bowl' : p.role === 'All-rounder' ? 'role-all' : 'role-wk';
                const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <div key={p.id} className="player-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div className="player-avatar" style={{ width: 42, height: 42, fontSize: 15, marginBottom: 0 }}>{initials}</div>
                      <div>
                        <div className="player-name" style={{ fontSize: 13 }}>{p.name}</div>
                        <span className={`player-role-badge ${roleClass}`}>{p.role}</span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                      {p.role !== 'Bowler' ? (
                        <>
                          <div className="stat-item"><div className="stat-val">{p.runs}</div><div className="stat-label">Runs</div></div>
                          <div className="stat-item"><div className="stat-val">{p.average.toFixed(1)}</div><div className="stat-label">Avg</div></div>
                          <div className="stat-item"><div className="stat-val">{p.strikeRate.toFixed(1)}</div><div className="stat-label">SR</div></div>
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
                      <span>#{p.jerseyNumber} · {p.nationality}</span>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>₹{p.price}Cr</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
