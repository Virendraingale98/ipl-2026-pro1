import { teams, matches, getLiveMatches, getTeamById, liveCommentary } from '../data/iplData';
import { useState, useEffect } from 'react';

// Default fallback data
const fallbackLiveMatches = getLiveMatches();

// 🌍 Your unique Cloudflare Worker URL
const PROXY_URL = "https://tight-sky-9278.shubhamukey2609.workers.dev/";

function CommentaryBall({ c }: { c: typeof liveCommentary[0] }) {
  const cls = c.isWicket ? 'ball-wicket' : c.isSix ? 'ball-six' : c.isFour ? 'ball-four' : 'ball-normal';
  const itemCls = c.isWicket ? 'wicket' : c.isSix ? 'six' : c.isFour ? 'four' : '';
  return (
    <div className={`commentary-item ${itemCls}`}>
      <div className={`ball-indicator ${cls}`}>{c.ball}</div>
      <div>
        <div className="commentary-text">{c.description}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
          {c.batsman} vs {c.bowler}
        </div>
      </div>
      <div className={`commentary-runs ${c.isWicket ? 'text-red' : c.isSix ? 'text-blue' : c.isFour ? 'text-gold' : ''}`}
        style={{ marginLeft: 'auto', fontFamily: 'Rajdhani', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
        {c.isWicket ? 'W' : c.runs === 0 ? '•' : c.runs}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points).slice(0, 4);
  const [liveMatches, setLiveMatches] = useState(fallbackLiveMatches);
  const [isFetchingLive, setIsFetchingLive] = useState(false);

  useEffect(() => {
    // 🌍 Fetching Live Data from your Secure Cloudflare Proxy!
    const fetchLiveStats = async () => {
      try {
        setIsFetchingLive(true);
        const response = await fetch(PROXY_URL);
        
        if (response.ok) {
          const liveData = await response.json();
          console.log("🔥 Live API Data Received: ", liveData);
          
          /* 
            TODO: Once you see the format of the data in your browser console,
            you map the liveData into the expected format here:
            
            setLiveMatches([{
              id: liveData.id,
              homeTeamId: liveData.team1_id,
              awayTeamId: liveData.team2_id,
              ...etc
            }]);
          */
          
        } else {
          console.warn("Proxy returned an error. Using simulated data.");
        }
      } catch (error) {
        console.error("Failed to connect to proxy. Using simulated data.", error);
      } finally {
        setIsFetchingLive(false);
      }
    };

    fetchLiveStats();
    // RapidAPI free tiers have strict limits. Refreshing every 60 seconds (60000ms) prevents "Too many requests" limits.
    const interval = setInterval(fetchLiveStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page fade-in">
      <div className="container">

        {/* Hero */}
        <div className="hero-banner mb-32">
          <div className="hero-badge">🏏 IPL 2026 · Season 19</div>
          <h1 className="hero-title">IPL 2026 Pro Analyzer</h1>
          <p className="hero-sub">Real-time scores, deep analytics, player insights, auction simulator & match predictions — all in one place.</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-val">74</div>
              <div className="hero-stat-label">Total Matches</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-val">10</div>
              <div className="hero-stat-label">Teams</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-val">1</div>
              <div className="hero-stat-label">Live Now</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-val">∞</div>
              <div className="hero-stat-label">Excitement</div>
            </div>
          </div>
        </div>

        {/* Live Match */}
        {liveMatches.map(match => {
          const home = getTeamById(match.homeTeamId)!;
          const away = getTeamById(match.awayTeamId)!;
          return (
            <div key={match.id} className="mb-32">
              <div className="section-header">
                <div className="section-title" style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="live-indicator"><span className="live-dot" />LIVE</span>
                  <span style={{ marginLeft: 8 }}>Match {match.matchNumber}</span>
                  {isFetchingLive && <span style={{ marginLeft: 12, fontSize: 11, color: 'var(--text-muted)' }}>↻ Syncing...</span>}
                </div>
              </div>
              <div className="live-match-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div className="match-meta mb-8">
                      <span className="match-meta-item">📍 {match.venue}</span>
                      <span className="match-meta-item" style={{ marginLeft: 12 }}>🎲 {match.toss}</span>
                    </div>
                  </div>
                  <div className="match-meta-item text-secondary" style={{ fontSize: 12 }}>Over {match.currentOver}</div>
                </div>

                <div className="match-teams">
                  <div className="match-team">
                    <div className="team-emoji">{home.logo}</div>
                    <div className="team-name-sm" style={{ color: home.color }}>{home.shortName}</div>
                    <div className="team-score">{match.homeScore?.split(' ')[0]}</div>
                    <div className="team-score-detail">{match.homeScore?.split(' ').slice(1).join(' ')}</div>
                  </div>
                  <div className="vs-divider">VS</div>
                  <div className="match-team">
                    <div className="team-emoji">{away.logo}</div>
                    <div className="team-name-sm" style={{ color: away.color }}>{away.shortName}</div>
                    <div className="team-score" style={{ color: 'var(--text-muted)', fontSize: 18 }}>Yet to bat</div>
                  </div>
                </div>

                {/* Batsmen */}
                {match.currentBatsmen && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16, marginBottom: 16 }}>
                    {match.currentBatsmen.map(b => (
                      <div key={b.name} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 14px' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>🏏 Batting</div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{b.name}</div>
                        <div style={{ fontFamily: 'Rajdhani', fontSize: 22, fontWeight: 700 }}>
                          {b.runs} <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Inter' }}>({b.balls})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {match.currentBowler && (
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>⚾ Bowling</div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{match.currentBowler.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'Rajdhani', fontSize: 18, fontWeight: 700 }}>{match.currentBowler.wickets}/{match.currentBowler.runs}</span>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{match.currentBowler.overs} overs</div>
                    </div>
                  </div>
                )}

                {/* Commentary */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div className="section-title mb-8" style={{ fontSize: 15 }}>📢 Ball-by-Ball</div>
                  <div className="commentary-feed">
                    {liveCommentary.map((c, i) => <CommentaryBall key={i} c={c} />)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 2-col layout: Standings + Schedule */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* Points Table Snapshot */}
          <div>
            <div className="section-header">
              <div className="section-title">🏆 Playoff Race</div>
            </div>
            <div className="card">
              {sortedTeams.map((team, i) => (
                <div key={team.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <div className={`rank-badge ${i === 0 ? 'gold' : 'top4'}`}>{i + 1}</div>
                  <div className="team-dot" style={{ background: team.color }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{team.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{team.wins}W {team.losses}L · NRR {team.nrr > 0 ? '+' : ''}{team.nrr}</div>
                  </div>
                  <div className="form-badges">
                    {team.form.map((f, fi) => (
                      <div key={fi} className={f === 'W' ? 'form-w' : 'form-l'}>{f}</div>
                    ))}
                  </div>
                  <div className="pts-badge">{team.points}</div>
                </div>
              ))}
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>Top 4 qualify for playoffs</div>
            </div>
          </div>

          {/* Upcoming Matches */}
          <div>
            <div className="section-header">
              <div className="section-title">📅 Upcoming</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {matches.filter(m => m.status === 'Scheduled').slice(0, 4).map(match => {
                const home = getTeamById(match.homeTeamId)!;
                const away = getTeamById(match.awayTeamId)!;
                const d = new Date(match.date);
                return (
                  <div key={match.id} className="schedule-card">
                    <div style={{ flex: 1 }}>
                      <div className="schedule-match-num">Match {match.matchNumber}</div>
                      <div className="schedule-teams">
                        {home.logo} {home.shortName} <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>vs</span> {away.logo} {away.shortName}
                      </div>
                      <div className="schedule-venue">📍 {match.city}</div>
                      <div className="status-chip status-scheduled">Scheduled</div>
                    </div>
                    <div className="schedule-date">
                      <div className="schedule-date-val">{d.getDate()} {d.toLocaleString('default', { month: 'short' })}</div>
                      <div className="schedule-time">{match.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
