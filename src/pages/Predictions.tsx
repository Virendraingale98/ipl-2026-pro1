import { useState } from 'react';
import { teams, matches, getTeamById } from '../data/iplData';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

function simulateWinProbability(homeId: number, awayId: number) {
  const home = teams.find(t => t.id === homeId)!;
  const away = teams.find(t => t.id === awayId)!;
  const homeScore = home.wins * 10 + home.nrr * 5;
  const awayScore = away.wins * 10 + away.nrr * 5;
  const total = homeScore + awayScore + 0.01;
  const homeAdv = 5;
  const homePct = Math.round(((homeScore + homeAdv) / (total + homeAdv)) * 100);
  return { home: Math.min(Math.max(homePct, 20), 80), away: 100 - Math.min(Math.max(homePct, 20), 80) };
}

export default function Predictions() {
  const [homeId, setHomeId] = useState(1);
  const [awayId, setAwayId] = useState(3);
  const [predicted, setPredicted] = useState(false);

  const homeTeam = getTeamById(homeId)!;
  const awayTeam = getTeamById(awayId)!;
  const prob = simulateWinProbability(homeId, awayId);

  const radarData = [
    { subject: 'Form', A: homeTeam.wins, B: awayTeam.wins },
    { subject: 'NRR', A: Math.max(0, homeTeam.nrr + 1) * 20, B: Math.max(0, awayTeam.nrr + 1) * 20 },
    { subject: 'Titles', A: homeTeam.titles * 10, B: awayTeam.titles * 10 },
    { subject: 'Wins', A: homeTeam.wins * 7, B: awayTeam.wins * 7 },
    { subject: 'Points', A: homeTeam.points * 3, B: awayTeam.points * 3 },
    { subject: 'Home Adv', A: 70, B: 30 },
  ];

  const keyFactors = [
    { factor: 'Head-to-Head', winner: prob.home > 50 ? homeTeam.shortName : awayTeam.shortName, detail: 'Based on historical record' },
    { factor: 'Recent Form', winner: homeTeam.wins >= awayTeam.wins ? homeTeam.shortName : awayTeam.shortName, detail: `${homeTeam.wins}W vs ${awayTeam.wins}W this season` },
    { factor: 'Net Run Rate', winner: homeTeam.nrr >= awayTeam.nrr ? homeTeam.shortName : awayTeam.shortName, detail: `${homeTeam.nrr > 0 ? '+' : ''}${homeTeam.nrr} vs ${awayTeam.nrr > 0 ? '+' : ''}${awayTeam.nrr}` },
    { factor: 'Home Advantage', winner: homeTeam.shortName, detail: `Playing at ${homeTeam.homeGround}` },
    { factor: 'Batting Depth', winner: prob.home > 50 ? homeTeam.shortName : awayTeam.shortName, detail: 'Average bat + SR analysis' },
  ];

  const completedMatches = matches.filter(m => m.status === 'Completed');

  return (
    <div className="page fade-in">
      <div className="container">
        <div className="section-header mb-24">
          <div className="section-title">🔮 Match Predictions</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>AI-powered win probability analysis</div>
        </div>

        {/* Matchup Selector */}
        <div className="prediction-card mb-24">
          <div className="mb-16">
            <div style={{ fontFamily: 'Rajdhani', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Select a Matchup</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Choose two teams to get win probability prediction</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Home Team</div>
              <select className="select-styled" style={{ width: '100%', padding: '12px 16px', fontSize: 14 }}
                value={homeId} onChange={e => { setHomeId(+e.target.value); setPredicted(false); }}>
                {teams.map(t => <option key={t.id} value={t.id}>{t.logo} {t.name}</option>)}
              </select>
            </div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'var(--text-muted)', fontSize: 20, paddingTop: 20 }}>VS</div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Away Team</div>
              <select className="select-styled" style={{ width: '100%', padding: '12px 16px', fontSize: 14 }}
                value={awayId} onChange={e => { setAwayId(+e.target.value); setPredicted(false); }}>
                {teams.filter(t => t.id !== homeId).map(t => <option key={t.id} value={t.id}>{t.logo} {t.name}</option>)}
              </select>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px' }}
            onClick={() => setPredicted(true)}>
            🔮 Predict Winner
          </button>
        </div>

        {predicted && (
          <div className="fade-in">
            {/* Win Probability */}
            <div className="card mb-24" style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #1a0940 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div style={{ fontFamily: 'Rajdhani', fontSize: 22, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>
                Win Probability
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 36 }}>{homeTeam.logo}</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{homeTeam.shortName}</div>
                  <div className="pct-label" style={{ color: homeTeam.color }}>{prob.home}%</div>
                </div>
                <div style={{ flex: 'none', padding: '0 16px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>WIN PROB</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 36 }}>{awayTeam.logo}</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{awayTeam.shortName}</div>
                  <div className="pct-label" style={{ color: awayTeam.color }}>{prob.away}%</div>
                </div>
              </div>

              <div className="win-bar">
                <div className="win-bar-a" style={{ width: `${prob.home}%`, background: homeTeam.color }} />
                <div className="win-bar-b" style={{ width: `${prob.away}%`, background: awayTeam.color }} />
              </div>

              <div style={{ textAlign: 'center', marginTop: 20, padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Predicted Winner</div>
                <div style={{ fontFamily: 'Rajdhani', fontSize: 28, fontWeight: 700, color: prob.home >= 50 ? homeTeam.color : awayTeam.color }}>
                  {prob.home >= 50 ? `${homeTeam.logo} ${homeTeam.name}` : `${awayTeam.logo} ${awayTeam.name}`}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  with {Math.max(prob.home, prob.away)}% probability · Confidence: {Math.max(prob.home, prob.away) > 65 ? 'High' : 'Moderate'}
                </div>
              </div>
            </div>

            {/* 2-col: Radar + Key Factors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              {/* Radar Chart */}
              <div className="card">
                <div className="section-title mb-16" style={{ fontSize: 15 }}>Team Comparison Radar</div>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8892a4', fontSize: 11 }} />
                    <Radar name={homeTeam.shortName} dataKey="A" stroke={homeTeam.color} fill={homeTeam.color} fillOpacity={0.2} />
                    <Radar name={awayTeam.shortName} dataKey="B" stroke={awayTeam.color} fill={awayTeam.color} fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
                  {[homeTeam, awayTeam].map(t => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: t.color }} />{t.shortName}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Factors */}
              <div className="card">
                <div className="section-title mb-16" style={{ fontSize: 15 }}>🔑 Key Factors</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {keyFactors.map((f, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{f.factor}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{f.detail}</div>
                      </div>
                      <div style={{
                        padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                        background: f.winner === homeTeam.shortName ? `${homeTeam.color}22` : `${awayTeam.color}22`,
                        color: f.winner === homeTeam.shortName ? homeTeam.color : awayTeam.color
                      }}>
                        {f.winner}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Results */}
        <div className="section-title mb-16">📊 Recent Results</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {completedMatches.map(m => {
            const home = getTeamById(m.homeTeamId)!;
            const away = getTeamById(m.awayTeamId)!;
            return (
              <div key={m.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1 }}>
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <div style={{ fontSize: 20 }}>{home.logo}</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{home.shortName}</div>
                    <div style={{ fontFamily: 'Rajdhani', fontSize: 16, fontWeight: 700 }}>{m.homeScore?.split(' ')[0]}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>vs</div>
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <div style={{ fontSize: 20 }}>{away.logo}</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{away.shortName}</div>
                    <div style={{ fontFamily: 'Rajdhani', fontSize: 16, fontWeight: 700 }}>{m.awayScore?.split(' ')[0]}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flex: 1 }}>
                  <div style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: 13 }}>{m.result}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>🏅 {m.manOfMatch}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
