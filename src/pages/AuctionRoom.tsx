import { useState } from 'react';
import { teams, players, getTeamById } from '../data/iplData';

const BUDGET = 100; // crores

interface AuctionPlayer {
  id: number;
  name: string;
  role: string;
  nationality: string;
  basePrice: number;
  currentBid: number;
  soldTo: number | null;
  status: 'unsold' | 'bidding' | 'sold';
}

const auctionPool: AuctionPlayer[] = players.map(p => ({
  id: p.id, name: p.name, role: p.role,
  nationality: p.nationality,
  basePrice: p.price * 0.5,
  currentBid: p.price * 0.5,
  soldTo: null, status: 'unsold',
}));

export default function AuctionRoom() {
  const [pool, setPool] = useState<AuctionPlayer[]>(auctionPool);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [budgets, setBudgets] = useState<Record<number, number>>(
    Object.fromEntries(teams.map(t => [t.id, BUDGET]))
  );
  const [myTeamId, setMyTeamId] = useState(1);
  const [bidHistory, setBidHistory] = useState<string[]>([]);
  const [bidIncrement] = useState(0.5);
  const [started, setStarted] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const current = pool[currentIdx];
  const myTeam = getTeamById(myTeamId)!;
  const myBudget = budgets[myTeamId];

  const addLog = (msg: string) => setLog(prev => [msg, ...prev.slice(0, 19)]);

  const raiseBid = () => {
    const newBid = +(current.currentBid + bidIncrement).toFixed(1);
    if (newBid > myBudget) { addLog('❌ Insufficient budget!'); return; }
    setPool(prev => prev.map((p, i) => i === currentIdx ? { ...p, currentBid: newBid, status: 'bidding' } : p));
    setBudgets(prev => ({ ...prev, [myTeamId]: +(prev[myTeamId] - bidIncrement).toFixed(1) }));
    addLog(`${myTeam.shortName} bid ₹${newBid}Cr for ${current.name}`);
  };

  const sold = () => {
    const soldTeam = getTeamById(myTeamId)!;
    setPool(prev => prev.map((p, i) => i === currentIdx ? { ...p, soldTo: myTeamId, status: 'sold' } : p));
    addLog(`🎉 SOLD! ${current.name} → ${soldTeam.shortName} for ₹${current.currentBid}Cr`);
    setTimeout(() => nextPlayer(), 1200);
  };

  const pass = () => {
    addLog(`⏭️ ${myTeam.shortName} passed on ${current.name}`);
    nextPlayer();
  };

  const nextPlayer = () => {
    if (currentIdx < pool.length - 1) setCurrentIdx(i => i + 1);
    else addLog('🏏 Auction complete!');
  };

  const myPlayers = pool.filter(p => p.soldTo === myTeamId);
  
  return (
    <div className="page fade-in">
      <div className="container">
        <div className="section-header mb-24">
          <div className="section-title">🔨 Auction Simulator</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Budget: ₹{BUDGET}Cr per team</div>
        </div>

        {!started ? (
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🏏</div>
            <div className="hero-title" style={{ fontSize: 32, marginBottom: 12 }}>IPL 2026 Auction</div>
            <p className="hero-sub" style={{ margin: '0 auto 32px' }}>Select your team and compete for the best players. Each team has ₹{BUDGET}Cr budget.</p>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>Choose your team:</div>
              <div className="grid-2" style={{ gap: 10 }}>
                {teams.slice(0, 6).map(t => (
                  <div key={t.id} onClick={() => setMyTeamId(t.id)} style={{
                    padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                    background: myTeamId === t.id ? `${t.color}20` : 'var(--bg-card)',
                    border: myTeamId === t.id ? `1px solid ${t.color}` : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s'
                  }}>
                    <span style={{ fontSize: 24 }}>{t.logo}</span>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</span>
                    {myTeamId === t.id && <span style={{ marginLeft: 'auto', color: t.color }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }} onClick={() => setStarted(true)}>
              🔨 Start Auction
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
            {/* Main Auction Area */}
            <div>
              {current && current.status !== 'sold' ? (
                <div className="auction-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Player Up for Auction</div>
                      <div style={{ fontSize: 12, color: 'var(--accent-purple)' }}>Lot {currentIdx + 1} of {pool.length}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Your Budget</div>
                      <div style={{ fontFamily: 'Rajdhani', fontSize: 22, fontWeight: 700, color: myBudget < 10 ? 'var(--accent-red)' : 'var(--accent-green)' }}>₹{myBudget}Cr</div>
                    </div>
                  </div>

                  <div className="auction-player-spotlight">
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, margin: '0 auto 16px' }}>
                      {current.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ fontFamily: 'Rajdhani', fontSize: 32, fontWeight: 700, marginBottom: 6 }}>{current.name}</div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
                      <span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 10px', borderRadius: 6, fontSize: 12 }}>{current.role}</span>
                      <span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 10px', borderRadius: 6, fontSize: 12 }}>🌍 {current.nationality}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Current Bid</div>
                    <div className="auction-amount">₹{current.currentBid}Cr</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Base: ₹{current.basePrice}Cr</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <button className="bid-btn bid-btn-raise" onClick={raiseBid}>
                      ⬆️ Raise Bid +₹{bidIncrement}Cr
                    </button>
                    <button className="bid-btn bid-btn-pass" onClick={pass}>
                      ✋ Pass
                    </button>
                  </div>
                  <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={sold}>
                    🔨 SOLD to {myTeam.shortName}!
                  </button>
                </div>
              ) : (
                <div className="auction-card" style={{ textAlign: 'center', padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                  <div style={{ fontFamily: 'Rajdhani', fontSize: 28, fontWeight: 700 }}>Auction Complete!</div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>You secured {myPlayers.length} players for ₹{(BUDGET - myBudget).toFixed(1)}Cr</div>
                  <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => { setCurrentIdx(0); setPool(auctionPool); setBudgets(Object.fromEntries(teams.map(t => [t.id, BUDGET]))); setLog([]); setStarted(false); }}>
                    🔄 New Auction
                  </button>
                </div>
              )}

              {/* My Squad */}
              {myPlayers.length > 0 && (
                <div className="card" style={{ marginTop: 20 }}>
                  <div className="section-title mb-12" style={{ fontSize: 15 }}>🏏 {myTeam.shortName} Squad ({myPlayers.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {myPlayers.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-glass)', borderRadius: 8, fontSize: 13 }}>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{p.role}</span>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>₹{p.currentBid}Cr</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: Bid Log + All Teams Budget */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Team Budgets */}
              <div className="card">
                <div className="section-title mb-12" style={{ fontSize: 14 }}>💰 Team Budgets</div>
                {teams.slice(0, 6).map(t => {
                  const spent = BUDGET - budgets[t.id];
                  const pct = (spent / BUDGET) * 100;
                  return (
                    <div key={t.id} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ fontWeight: t.id === myTeamId ? 700 : 400 }}>{t.id === myTeamId ? '★ ' : ''}{t.shortName}</span>
                        <span style={{ color: 'var(--text-muted)' }}>₹{budgets[t.id]}Cr left</span>
                      </div>
                      <div style={{ background: 'var(--border)', borderRadius: 4, height: 5 }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: t.color, transition: 'width 0.4s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bid Log */}
              <div className="card" style={{ flex: 1 }}>
                <div className="section-title mb-12" style={{ fontSize: 14 }}>📋 Bid History</div>
                <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {log.length === 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Auction started...</span>}
                  {log.map((l, i) => (
                    <div key={i} style={{ fontSize: 12, padding: '6px 10px', background: 'var(--bg-glass)', borderRadius: 6 }}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
