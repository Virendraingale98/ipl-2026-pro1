import { useState } from 'react';
import { matches, getTeamById } from '../data/iplData';

type Filter = 'All' | 'Live' | 'Scheduled' | 'Completed';

export default function Schedule() {
  const [filter, setFilter] = useState<Filter>('All');
  const filtered = filter === 'All' ? matches : matches.filter(m => m.status === filter);

  return (
    <div className="page fade-in">
      <div className="container">
        <div className="section-header mb-16">
          <div className="section-title">📅 Match Schedule</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} matches</div>
        </div>

        <div className="stats-tabs mb-24">
          {(['All', 'Live', 'Scheduled', 'Completed'] as Filter[]).map(f => (
            <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'Live' && <span className="live-dot" style={{ display: 'inline-block' }} />}
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(match => {
            const home = getTeamById(match.homeTeamId)!;
            const away = getTeamById(match.awayTeamId)!;
            const d = new Date(match.date);
            const statusClass = match.status === 'Live' ? 'status-live' : match.status === 'Scheduled' ? 'status-scheduled' : 'status-completed';

            return (
              <div key={match.id} className="schedule-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div className="schedule-match-num">Match {match.matchNumber}</div>
                    <div className="schedule-teams" style={{ fontSize: 18 }}>
                      <span style={{ color: home.color }}>{home.logo} {home.shortName}</span>
                      <span style={{ color: 'var(--text-muted)', margin: '0 12px', fontSize: 14 }}>vs</span>
                      <span style={{ color: away.color }}>{away.logo} {away.shortName}</span>
                    </div>
                    <div className="schedule-venue" style={{ marginTop: 4 }}>📍 {match.venue}, {match.city}</div>
                    <div className={`status-chip ${statusClass}`} style={{ marginTop: 8 }}>{match.status}</div>
                  </div>
                  <div className="schedule-date">
                    <div className="schedule-date-val">{d.getDate()} {d.toLocaleString('default', { month: 'short' })} {d.getFullYear()}</div>
                    <div className="schedule-time">{match.time} IST</div>
                  </div>
                </div>

                {match.status === 'Completed' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg-glass)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 24 }}>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{home.shortName}</div>
                          <div style={{ fontFamily: 'Rajdhani', fontSize: 22, fontWeight: 700 }}>{match.homeScore}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{away.shortName}</div>
                          <div style={{ fontFamily: 'Rajdhani', fontSize: 22, fontWeight: 700 }}>{match.awayScore}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Result</div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--accent-green)' }}>{match.result}</div>
                      </div>
                    </div>
                    {match.manOfMatch && (
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        🏅 Player of the Match: <strong>{match.manOfMatch}</strong>
                      </div>
                    )}
                    {match.toss && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>🎲 {match.toss}</div>
                    )}
                  </div>
                )}

                {match.status === 'Live' && (
                  <div style={{ display: 'flex', gap: 16, background: 'rgba(239,68,68,0.08)', borderRadius: 10, padding: '14px 16px', alignItems: 'center' }}>
                    <div className="live-indicator"><span className="live-dot" />LIVE</div>
                    <div>
                      <div style={{ fontFamily: 'Rajdhani', fontSize: 20, fontWeight: 700 }}>{match.homeScore}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Over {match.currentOver}</div>
                    </div>
                    {match.currentBatsmen && (
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                        {match.currentBatsmen.map(b => (
                          <div key={b.name} style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 600, fontSize: 12 }}>{b.name}</div>
                            <div style={{ fontFamily: 'Rajdhani', fontSize: 16, fontWeight: 700 }}>{b.runs}({b.balls})</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
