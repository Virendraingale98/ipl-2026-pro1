import { teams, matches as staticMatches, getLiveMatches, getTeamById, liveCommentary } from '../data/iplData';
import { useState, useEffect } from 'react';

// ─── CricAPI /v1/currentMatches Types ────────────────────────────────────────
interface CricApiTeamInfo {
  name: string;
  shortname: string;
  img: string;
}

interface CricApiScore {
  r: number;   // runs
  w: number;   // wickets
  o: number;   // overs
  inning: string;
}

interface CricApiMatch {
  id: string;
  name: string;           // "Gujarat Titans vs KKR, 25th Match, Indian Premier League 2026"
  matchType: string;      // "t20" | "odi" | "test" | ""
  status: string;         // human-readable status text
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];        // ["Gujarat Titans", "Kolkata Knight Riders"]
  teamInfo: CricApiTeamInfo[];
  score?: CricApiScore[];
  matchStarted: boolean;
  matchEnded: boolean;
  series_id: string;
}

interface CricApiResponse {
  data: CricApiMatch[];
  status: string;
}

// ─── Internal parsed match ────────────────────────────────────────────────────
type MatchState = 'live' | 'fixture' | 'result';

interface ParsedMatch {
  id: string;
  name: string;
  t1: CricApiTeamInfo;
  t2: CricApiTeamInfo;
  t1Score: string;
  t2Score: string;
  status: string;
  ms: MatchState;
  matchType: string;
  venue: string;
  dateTimeGMT: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Derive match state from booleans */
const getMatchState = (m: CricApiMatch): MatchState => {
  if (!m.matchStarted) return 'fixture';
  if (m.matchStarted && !m.matchEnded) return 'live';
  return 'result';
};

/** Find the score for a given team by matching inning name (case-insensitive) */
const findTeamScore = (scores: CricApiScore[] | undefined, teamName: string): string => {
  if (!scores || scores.length === 0) return '';
  const key = teamName.toLowerCase();
  // Try to find an inning whose name contains this team's name
  const inning = scores.find(s => {
    const inn = s.inning.toLowerCase();
    // Avoid cross-matching compound inning names like "Gujarat Titans,KKR Inning 1"
    // by checking the FIRST part of the name before a comma
    const firstTeam = inn.split(',')[0].trim();
    return firstTeam.includes(key) || key.includes(firstTeam);
  });
  if (inning) return `${inning.r}/${inning.w} (${inning.o})`;
  return '';
};

/** Format a GMT ISO string to local IST display */
const fmtIST = (iso: string): string => {
  try {
    return new Date(iso + 'Z').toLocaleString('en-IN', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
  } catch { return iso; }
};

/** Parse a raw CricAPI match into our UI shape */
const parseMatch = (m: CricApiMatch): ParsedMatch => {
  const t1 = m.teamInfo?.[0] ?? { name: m.teams?.[0] ?? 'TBA', shortname: 'TBA', img: '' };
  const t2 = m.teamInfo?.[1] ?? { name: m.teams?.[1] ?? 'TBA', shortname: 'TBA', img: '' };
  return {
    id: m.id,
    name: m.name,
    t1,
    t2,
    t1Score: findTeamScore(m.score, t1.name),
    t2Score: findTeamScore(m.score, t2.name),
    status: m.status,
    ms: getMatchState(m),
    matchType: m.matchType,
    venue: m.venue,
    dateTimeGMT: m.dateTimeGMT,
  };
};

/** Map local static team data by shortName for colour / logo fallback */
const staticTeamMeta: Record<string, { color: string; logo: string }> = {};
teams.forEach(t => { staticTeamMeta[t.shortName.toUpperCase()] = { color: t.color, logo: t.logo }; });

const getColor = (shortname: string) =>
  staticTeamMeta[shortname.toUpperCase()]?.color ?? '#ffffff';

const getFallbackLogo = (shortname: string) =>
  staticTeamMeta[shortname.toUpperCase()]?.logo ?? '🏏';

// ─── Default fallback (static data) ─────────────────────────────────────────
const fallbackLive: ParsedMatch[] = getLiveMatches().map(m => {
  const home = getTeamById(m.homeTeamId)!;
  const away = getTeamById(m.awayTeamId)!;
  return {
    id: String(m.id),
    name: `${home.name} vs ${away.name}`,
    t1: { name: home.name, shortname: home.shortName, img: '' },
    t2: { name: away.name, shortname: away.shortName, img: '' },
    t1Score: m.homeScore ?? '',
    t2Score: m.awayScore ?? '',
    status: 'Live',
    ms: 'live',
    matchType: 't20',
    venue: `${m.venue}, ${m.city}`,
    dateTimeGMT: m.date,
  };
});

const PROXY_URL = 'https://bold-butterfly-8750.virendraingale98.workers.dev/';

// ─── TeamLogo ─────────────────────────────────────────────────────────────────
function TeamLogo({ imgUrl, fallback, size = 48 }: { imgUrl: string; fallback: string; size?: number }) {
  const [err, setErr] = useState(false);
  if (imgUrl && !err) {
    return (
      <img
        src={imgUrl} alt={fallback} width={size} height={size}
        style={{ borderRadius: '50%', objectFit: 'cover', background: 'rgba(255,255,255,0.08)' }}
        onError={() => setErr(true)}
      />
    );
  }
  return <span style={{ fontSize: size * 0.6 }}>{fallback}</span>;
}

// ─── Commentary Ball ───────────────────────────────────────────────────────────
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
      <div
        className={`commentary-runs ${c.isWicket ? 'text-red' : c.isSix ? 'text-blue' : c.isFour ? 'text-gold' : ''}`}
        style={{ marginLeft: 'auto', fontFamily: 'Rajdhani', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
        {c.isWicket ? 'W' : c.runs === 0 ? '•' : c.runs}
      </div>
    </div>
  );
}

// ─── Score Display ─────────────────────────────────────────────────────────────
function ScoreDisplay({ score }: { score: string }) {
  if (!score) return <div className="team-score" style={{ color: 'var(--text-muted)', fontSize: 16 }}>Yet to bat</div>;
  const [main, ...rest] = score.split(' ');
  return (
    <>
      <div className="team-score">{main}</div>
      {rest.length > 0 && <div className="team-score-detail">{rest.join(' ')}</div>}
    </>
  );
}

// ─── Live Match Card ──────────────────────────────────────────────────────────
function LiveMatchCard({ match, isFetching }: { match: ParsedMatch; isFetching: boolean }) {
  return (
    <div className="mb-32">
      <div className="section-header">
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="live-indicator"><span className="live-dot" />LIVE</span>
          <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)', maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {match.name}
          </span>
          {isFetching && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>↻ Syncing…</span>}
        </div>
      </div>

      <div className="live-match-card">
        {/* Meta row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <div>
            <div className="match-meta mb-8">
              <span className="match-meta-item">📍 {match.venue}</span>
              <span className="match-meta-item" style={{ marginLeft: 12 }}>
                🎯 {match.matchType?.toUpperCase() || 'T20'}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{match.status}</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>🕐 {fmtIST(match.dateTimeGMT)} IST</div>
        </div>

        {/* Teams */}
        <div className="match-teams">
          <div className="match-team">
            <TeamLogo imgUrl={match.t1.img} fallback={getFallbackLogo(match.t1.shortname)} size={52} />
            <div className="team-name-sm" style={{ color: getColor(match.t1.shortname) }}>{match.t1.shortname}</div>
            <ScoreDisplay score={match.t1Score} />
          </div>
          <div className="vs-divider">VS</div>
          <div className="match-team">
            <TeamLogo imgUrl={match.t2.img} fallback={getFallbackLogo(match.t2.shortname)} size={52} />
            <div className="team-name-sm" style={{ color: getColor(match.t2.shortname) }}>{match.t2.shortname}</div>
            <ScoreDisplay score={match.t2Score} />
          </div>
        </div>

        {/* Ball-by-ball commentary */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 16 }}>
          <div className="section-title mb-8" style={{ fontSize: 15 }}>📢 Ball-by-Ball</div>
          <div className="commentary-feed">
            {liveCommentary.map((c, i) => <CommentaryBall key={i} c={c} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Result Card ─────────────────────────────────────────────────────────────
function ResultCard({ match }: { match: ParsedMatch }) {
  return (
    <div className="schedule-card" style={{ flexDirection: 'column', gap: 8, padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        {/* Team 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TeamLogo imgUrl={match.t1.img} fallback={getFallbackLogo(match.t1.shortname)} size={28} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: getColor(match.t1.shortname) }}>{match.t1.shortname}</div>
            {match.t1Score && <div style={{ fontFamily: 'Rajdhani', fontSize: 12, color: 'var(--text-secondary)' }}>{match.t1Score}</div>}
          </div>
        </div>
        {/* vs */}
        <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>vs</span>
        {/* Team 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'row-reverse' }}>
          <TeamLogo imgUrl={match.t2.img} fallback={getFallbackLogo(match.t2.shortname)} size={28} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: getColor(match.t2.shortname) }}>{match.t2.shortname}</div>
            {match.t2Score && <div style={{ fontFamily: 'Rajdhani', fontSize: 12, color: 'var(--text-secondary)' }}>{match.t2Score}</div>}
          </div>
        </div>
      </div>
      {/* Result text */}
      <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textAlign: 'center', paddingTop: 4, borderTop: '1px solid var(--border)' }}>
        {match.status}
      </div>
    </div>
  );
}

// ─── Upcoming Card ────────────────────────────────────────────────────────────
function UpcomingCard({ match }: { match: ParsedMatch }) {
  const liveNow = match.ms === 'live';
  return (
    <div className="schedule-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, flexWrap: 'wrap' }}>
        <TeamLogo imgUrl={match.t1.img} fallback={getFallbackLogo(match.t1.shortname)} size={32} />
        <div style={{ flex: 1, minWidth: 120 }}>
          <div className="schedule-teams">
            <span style={{ color: getColor(match.t1.shortname) }}>{match.t1.shortname}</span>
            <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>vs</span>
            <span style={{ color: getColor(match.t2.shortname) }}>{match.t2.shortname}</span>
          </div>
          <div className="schedule-venue">📍 {match.venue}</div>
          <div className={`status-chip ${liveNow ? 'status-live' : 'status-scheduled'}`}>
            {liveNow ? '🔴 Live' : 'Scheduled'}
          </div>
        </div>
        <TeamLogo imgUrl={match.t2.img} fallback={getFallbackLogo(match.t2.shortname)} size={32} />
      </div>
      <div className="schedule-date">
        <div className="schedule-date-val">
          {(() => { const d = new Date(match.dateTimeGMT + 'Z'); return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`; })()}
        </div>
        <div className="schedule-time">
          {new Date(match.dateTimeGMT + 'Z').toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points).slice(0, 4);

  const [liveMatches,   setLiveMatches]   = useState<ParsedMatch[]>(fallbackLive);
  const [upcomingIPL,   setUpcomingIPL]   = useState<ParsedMatch[]>([]);
  const [recentResults, setRecentResults] = useState<ParsedMatch[]>([]);
  const [isFetching,    setIsFetching]    = useState(false);
  const [apiError,      setApiError]      = useState<string | null>(null);
  const [lastUpdated,   setLastUpdated]   = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setIsFetching(true);
      setApiError(null);

      const res = await fetch(PROXY_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json: CricApiResponse = await res.json();
      console.log('🔥 CricAPI /currentMatches:', json);

      if (json.status !== 'success' || !Array.isArray(json.data)) {
        throw new Error('Invalid CricAPI response');
      }

      // Filter IPL 2026 only (by match name)
      const ipl = json.data
        .filter(m => m.name?.toLowerCase().includes('indian premier league'))
        .map(parseMatch);

      const live     = ipl.filter(m => m.ms === 'live');
      const fixtures = ipl.filter(m => m.ms === 'fixture').slice(0, 5);
      const results  = ipl.filter(m => m.ms === 'result').slice(0, 6);

      setLiveMatches(live.length > 0 ? live : fallbackLive);
      setUpcomingIPL(fixtures);
      setRecentResults(results);
      setLastUpdated(new Date());

      console.log(`✅ IPL: ${live.length} live · ${fixtures.length} upcoming · ${results.length} results`);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setApiError(err.message ?? 'Unknown error');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
    // 100 req/day free tier → poll every 5 min
    const iv = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  const staticScheduled = staticMatches.filter(m => m.status === 'Scheduled').slice(0, 4);

  return (
    <div className="page fade-in">
      <div className="container">

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div className="hero-banner mb-32">
          <div className="hero-badge">🏏 IPL 2026 · Season 19</div>
          <h1 className="hero-title">IPL 2026 Pro Analyzer</h1>
          <p className="hero-sub">
            Real-time scores, deep analytics, player insights, auction simulator &amp; match predictions — all in one place.
          </p>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-val">74</div><div className="hero-stat-label">Total Matches</div></div>
            <div className="hero-stat"><div className="hero-stat-val">10</div><div className="hero-stat-label">Teams</div></div>
            <div className="hero-stat"><div className="hero-stat-val">{liveMatches.length}</div><div className="hero-stat-label">Live Now</div></div>
            <div className="hero-stat"><div className="hero-stat-val">∞</div><div className="hero-stat-label">Excitement</div></div>
          </div>

          {/* API status pill */}
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            {apiError
              ? <span style={{ fontSize: 12, color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', padding: '4px 14px', borderRadius: 20, border: '1px solid rgba(255,107,107,0.3)' }}>
                  ⚠️ Using cached data · {apiError}
                </span>
              : lastUpdated
              ? <span style={{ fontSize: 12, color: 'var(--accent)', background: 'rgba(0,255,150,0.08)', padding: '4px 14px', borderRadius: 20, border: '1px solid rgba(0,255,150,0.2)' }}>
                  ✅ Live via CricAPI · {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                </span>
              : <span style={{ fontSize: 12, color: 'var(--text-muted)', padding: '4px 14px' }}>⏳ Connecting to CricAPI…</span>
            }
          </div>
        </div>

        {/* ── Live IPL Matches ────────────────────────────────────────────── */}
        {liveMatches.map(m => (
          <LiveMatchCard key={m.id} match={m} isFetching={isFetching} />
        ))}

        {/* ── 2-col: Standings + Recent Results ─────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>

          {/* Points Table */}
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
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {team.wins}W {team.losses}L · NRR {team.nrr > 0 ? '+' : ''}{team.nrr}
                    </div>
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

          {/* Recent IPL Results */}
          <div>
            <div className="section-header">
              <div className="section-title">🎯 Recent Results</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentResults.length > 0
                ? recentResults.map(m => <ResultCard key={m.id} match={m} />)
                : <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: 24 }}>
                    {isFetching ? '⏳ Loading results…' : 'No recent IPL results found'}
                  </div>
              }
            </div>
          </div>
        </div>

        {/* ── Upcoming / Live IPL Fixtures ────────────────────────────────── */}
        <div>
          <div className="section-header">
            <div className="section-title">📅 Upcoming IPL Matches</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcomingIPL.length > 0
              ? upcomingIPL.map(m => <UpcomingCard key={m.id} match={m} />)
              : staticScheduled.map(match => {
                  const home = getTeamById(match.homeTeamId)!;
                  const away = getTeamById(match.awayTeamId)!;
                  const d = new Date(match.date);
                  return (
                    <div key={match.id} className="schedule-card">
                      <div style={{ flex: 1 }}>
                        <div className="schedule-match-num">Match {match.matchNumber}</div>
                        <div className="schedule-teams">
                          {home.logo} {home.shortName}
                          <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>vs</span>
                          {away.logo} {away.shortName}
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
                })
            }
          </div>
        </div>

      </div>
    </div>
  );
}
