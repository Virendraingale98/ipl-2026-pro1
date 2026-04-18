import { teams } from '../data/iplData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const standingsData = [...teams].sort((a, b) => b.points - a.points);

// Simulated historical NRR data for chart
const nrrTrend = [
  { match: 'M1', MI: 0.42, CSK: -0.1, RCB: 0.8, KKR: -0.3 },
  { match: 'M3', MI: 0.55, CSK: 0.2, RCB: 0.6, KKR: -0.1 },
  { match: 'M5', MI: 0.7, CSK: 0.35, RCB: 0.45, KKR: 0.05 },
  { match: 'M7', MI: 0.82, CSK: 0.45, RCB: 0.52, KKR: 0.08 },
  { match: 'M9', MI: 0.78, CSK: 0.5, RCB: 0.38, KKR: 0.1 },
  { match: 'M10', MI: 0.84, CSK: 0.51, RCB: 0.39, KKR: 0.11 },
];

export default function Standings() {
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
        <div className="section-header mb-24">
          <div className="section-title">🏆 Points Table</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>After 10 matches each</div>
        </div>

        {/* Playoff Qualification Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.08))',
          border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24
        }}>
          <span style={{ fontSize: 20 }}>🎟️</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Playoff Qualification</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Top 4 teams qualify · Playoff starts May 20, 2026 · Final on June 1, 2026</div>
          </div>
        </div>

        {/* Main Table */}
        <div className="card mb-32" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="standings-table">
            <thead>
              <tr>
                <th style={{ width: 48 }}>#</th>
                <th>Team</th>
                <th>M</th>
                <th>W</th>
                <th>L</th>
                <th>Pts</th>
                <th>NRR</th>
                <th>Form</th>
                <th>Captain</th>
              </tr>
            </thead>
            <tbody>
              {standingsData.map((team, i) => (
                <tr key={team.id}>
                  <td>
                    <div className={`rank-badge ${i === 0 ? 'gold' : i < 4 ? 'top4' : ''}`}>{i + 1}</div>
                  </td>
                  <td>
                    <div className="team-cell">
                      <div className="team-dot" style={{ background: team.color }} />
                      <div>
                        <div className="team-full-name">{team.name}</div>
                        <div className="team-short">{team.shortName}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{team.matches}</td>
                  <td className="text-green font-bold">{team.wins}</td>
                  <td className="text-red">{team.losses}</td>
                  <td><span className="pts-badge">{team.points}</span></td>
                  <td><span className={team.nrr >= 0 ? 'nrr-pos' : 'nrr-neg'}>{team.nrr >= 0 ? '+' : ''}{team.nrr}</span></td>
                  <td>
                    <div className="form-badges">
                      {team.form.map((f, fi) => <div key={fi} className={f === 'W' ? 'form-w' : 'form-l'}>{f}</div>)}
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{team.captain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Team Stats Cards */}
        <div className="section-title mb-16">Team Performance Overview</div>
        <div className="grid-5 mb-32">
          {standingsData.slice(0, 5).map((team, i) => (
            <div key={team.id} className="card" style={{ padding: '16px', borderLeft: `3px solid ${team.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{team.logo}</span>
                <span className="pts-badge">{team.points}pts</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{team.shortName}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ fontSize: 11 }}><span className="text-green font-bold">{team.wins}W</span> <span className="text-red">{team.losses}L</span></div>
              </div>
              <div style={{ marginTop: 8, background: 'var(--border)', borderRadius: 4, height: 4 }}>
                <div style={{ width: `${(team.wins / team.matches) * 100}%`, height: '100%', borderRadius: 4, background: team.color }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Win rate {((team.wins / team.matches) * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>

        {/* NRR Trend Chart */}
        <div className="card">
          <div className="section-title mb-16" style={{ fontSize: 16 }}>📈 NRR Progression (Top 4 Teams)</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={nrrTrend}>
                <defs>
                  {[['MI','#005DA0'],['CSK','#F5A623'],['RCB','#EC1C24'],['KKR','#3A225D']].map(([k,c]) => (
                    <linearGradient key={k} id={`grad${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis dataKey="match" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="MI" stroke="#005DA0" fill="url(#gradMI)" strokeWidth={2} />
                <Area type="monotone" dataKey="CSK" stroke="#F5A623" fill="url(#gradCSK)" strokeWidth={2} />
                <Area type="monotone" dataKey="RCB" stroke="#EC1C24" fill="url(#gradRCB)" strokeWidth={2} />
                <Area type="monotone" dataKey="KKR" stroke="#8b5cf6" fill="url(#gradKKR)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12 }}>
              {[['MI', '#005DA0'], ['CSK', '#F5A623'], ['RCB', '#EC1C24'], ['KKR', '#8b5cf6']].map(([n, c]) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: c }} />{n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
