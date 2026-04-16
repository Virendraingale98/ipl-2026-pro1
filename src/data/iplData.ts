// ==================== IPL 2026 PRO ANALYZER DATA ====================

export interface Team {
  id: number;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  logo: string;
  homeGround: string;
  captain: string;
  coach: string;
  titles: number;
  matches: number;
  wins: number;
  losses: number;
  nrr: number;
  points: number;
  form: ('W' | 'L' | 'N')[];
}

export interface Player {
  id: number;
  name: string;
  teamId: number;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  nationality: string;
  age: number;
  jerseyNumber: number;
  matches: number;
  runs: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  wickets: number;
  economy: number;
  bestBowling: string;
  price: number; // in crores
  isCapped: boolean;
}

export interface Match {
  id: number;
  matchNumber: number;
  homeTeamId: number;
  awayTeamId: number;
  venue: string;
  city: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Live' | 'Completed';
  homeScore?: string;
  awayScore?: string;
  result?: string;
  manOfMatch?: string;
  toss?: string;
  currentOver?: string;
  currentBatsmen?: { name: string; runs: number; balls: number }[];
  currentBowler?: { name: string; overs: string; wickets: number; runs: number };
}

export interface Commentary {
  ball: string;
  description: string;
  runs: number;
  isWicket: boolean;
  isFour: boolean;
  isSix: boolean;
  batsman: string;
  bowler: string;
}

export const teams: Team[] = [
  {
    id: 1, name: 'Mumbai Indians', shortName: 'MI',
    color: '#005DA0', secondaryColor: '#D4AF37',
    logo: '🔵', homeGround: 'Wankhede Stadium', captain: 'Rohit Sharma',
    coach: 'Mark Boucher', titles: 5, matches: 10, wins: 7, losses: 3, nrr: 0.842, points: 14,
    form: ['W', 'W', 'L', 'W', 'W']
  },
  {
    id: 2, name: 'Chennai Super Kings', shortName: 'CSK',
    color: '#F5A623', secondaryColor: '#1B4F8A',
    logo: '🟡', homeGround: 'MA Chidambaram Stadium', captain: 'MS Dhoni',
    coach: 'Stephen Fleming', titles: 5, matches: 10, wins: 6, losses: 4, nrr: 0.515, points: 12,
    form: ['W', 'L', 'W', 'W', 'L']
  },
  {
    id: 3, name: 'Royal Challengers Bangalore', shortName: 'RCB',
    color: '#EC1C24', secondaryColor: '#000000',
    logo: '🔴', homeGround: 'M Chinnaswamy Stadium', captain: 'Virat Kohli',
    coach: 'Andy Flower', titles: 0, matches: 10, wins: 6, losses: 4, nrr: 0.389, points: 12,
    form: ['L', 'W', 'W', 'W', 'L']
  },
  {
    id: 4, name: 'Kolkata Knight Riders', shortName: 'KKR',
    color: '#3A225D', secondaryColor: '#F5A623',
    logo: '🟣', homeGround: 'Eden Gardens', captain: 'Shreyas Iyer',
    coach: 'Chandrakant Pandit', titles: 3, matches: 10, wins: 5, losses: 5, nrr: 0.112, points: 10,
    form: ['W', 'L', 'W', 'L', 'W']
  },
  {
    id: 5, name: 'Delhi Capitals', shortName: 'DC',
    color: '#0078BC', secondaryColor: '#EF1C25',
    logo: '🔷', homeGround: 'Arun Jaitley Stadium', captain: 'Rishabh Pant',
    coach: 'Ricky Ponting', titles: 0, matches: 10, wins: 5, losses: 5, nrr: -0.065, points: 10,
    form: ['L', 'W', 'L', 'W', 'W']
  },
  {
    id: 6, name: 'Rajasthan Royals', shortName: 'RR',
    color: '#E91E8C', secondaryColor: '#006CB7',
    logo: '🩷', homeGround: 'Sawai Mansingh Stadium', captain: 'Sanju Samson',
    coach: 'Kumar Sangakkara', titles: 1, matches: 10, wins: 5, losses: 5, nrr: -0.132, points: 10,
    form: ['W', 'W', 'L', 'L', 'W']
  },
  {
    id: 7, name: 'Sunrisers Hyderabad', shortName: 'SRH',
    color: '#F7A721', secondaryColor: '#E95A0C',
    logo: '🟠', homeGround: 'Rajiv Gandhi International Stadium', captain: 'Pat Cummins',
    coach: 'Daniel Vettori', titles: 1, matches: 10, wins: 4, losses: 6, nrr: -0.298, points: 8,
    form: ['L', 'W', 'L', 'L', 'W']
  },
  {
    id: 8, name: 'Punjab Kings', shortName: 'PBKS',
    color: '#ED1B24', secondaryColor: '#DCDDDF',
    logo: '🦁', homeGround: 'Punjab Cricket Association IS Bindra Stadium', captain: 'Shikhar Dhawan',
    coach: 'Trevor Bayliss', titles: 0, matches: 10, wins: 4, losses: 6, nrr: -0.412, points: 8,
    form: ['L', 'L', 'W', 'L', 'W']
  },
  {
    id: 9, name: 'Lucknow Super Giants', shortName: 'LSG',
    color: '#A72B8C', secondaryColor: '#53C5F5',
    logo: '💜', homeGround: 'BRSABV Ekana Cricket Stadium', captain: 'KL Rahul',
    coach: 'Andy Flower', titles: 0, matches: 10, wins: 3, losses: 7, nrr: -0.654, points: 6,
    form: ['L', 'L', 'L', 'W', 'L']
  },
  {
    id: 10, name: 'Gujarat Titans', shortName: 'GT',
    color: '#1C1C6F', secondaryColor: '#C8A84B',
    logo: '🔱', homeGround: 'Narendra Modi Stadium', captain: 'Hardik Pandya',
    coach: 'Ashish Nehra', titles: 2, matches: 10, wins: 3, losses: 7, nrr: -0.823, points: 6,
    form: ['L', 'L', 'W', 'L', 'L']
  },
];

export const players: Player[] = [
  // Mumbai Indians
  { id: 1, name: 'Rohit Sharma', teamId: 1, role: 'Batsman', nationality: 'Indian', age: 38, jerseyNumber: 45, matches: 10, runs: 512, average: 56.8, strikeRate: 148.2, fifties: 4, hundreds: 1, wickets: 0, economy: 0, bestBowling: '-', price: 16, isCapped: true },
  { id: 2, name: 'Jasprit Bumrah', teamId: 1, role: 'Bowler', nationality: 'Indian', age: 30, jerseyNumber: 93, matches: 10, runs: 12, average: 6.0, strikeRate: 75.0, fifties: 0, hundreds: 0, wickets: 22, economy: 6.8, bestBowling: '5/10', price: 12, isCapped: true },
  { id: 3, name: 'Suryakumar Yadav', teamId: 1, role: 'Batsman', nationality: 'Indian', age: 33, jerseyNumber: 63, matches: 10, runs: 487, average: 54.1, strikeRate: 182.3, fifties: 3, hundreds: 1, wickets: 0, economy: 0, bestBowling: '-', price: 8, isCapped: true },
  { id: 4, name: 'Hardik Pandya', teamId: 10, role: 'All-rounder', nationality: 'Indian', age: 30, jerseyNumber: 228, matches: 10, runs: 298, average: 37.2, strikeRate: 155.7, fifties: 2, hundreds: 0, wickets: 8, economy: 8.9, bestBowling: '2/24', price: 15, isCapped: true },
  { id: 5, name: 'Virat Kohli', teamId: 3, role: 'Batsman', nationality: 'Indian', age: 37, jerseyNumber: 18, matches: 10, runs: 620, average: 77.5, strikeRate: 143.2, fifties: 5, hundreds: 2, wickets: 0, economy: 0, bestBowling: '-', price: 21, isCapped: true },
  { id: 6, name: 'MS Dhoni', teamId: 2, role: 'Wicket-keeper', nationality: 'Indian', age: 44, jerseyNumber: 7, matches: 10, runs: 189, average: 37.8, strikeRate: 172.7, fifties: 1, hundreds: 0, wickets: 0, economy: 0, bestBowling: '-', price: 14, isCapped: true },
  { id: 7, name: 'Ravindra Jadeja', teamId: 2, role: 'All-rounder', nationality: 'Indian', age: 35, jerseyNumber: 8, matches: 10, runs: 245, average: 30.6, strikeRate: 142.1, fifties: 1, hundreds: 0, wickets: 14, economy: 7.2, bestBowling: '3/18', price: 16, isCapped: true },
  { id: 8, name: 'KL Rahul', teamId: 9, role: 'Wicket-keeper', nationality: 'Indian', age: 33, jerseyNumber: 1, matches: 10, runs: 378, average: 42.0, strikeRate: 136.2, fifties: 3, hundreds: 0, wickets: 0, economy: 0, bestBowling: '-', price: 17, isCapped: true },
  { id: 9, name: 'Pat Cummins', teamId: 7, role: 'All-rounder', nationality: 'Australian', age: 30, jerseyNumber: 30, matches: 10, runs: 98, average: 16.3, strikeRate: 122.5, fifties: 0, hundreds: 0, wickets: 18, economy: 8.1, bestBowling: '4/34', price: 20.5, isCapped: true },
  { id: 10, name: 'Shreyas Iyer', teamId: 4, role: 'Batsman', nationality: 'Indian', age: 29, jerseyNumber: 41, matches: 10, runs: 421, average: 46.7, strikeRate: 147.8, fifties: 3, hundreds: 1, wickets: 0, economy: 0, bestBowling: '-', price: 12.25, isCapped: true },
  { id: 11, name: 'Rishabh Pant', teamId: 5, role: 'Wicket-keeper', nationality: 'Indian', age: 27, jerseyNumber: 17, matches: 10, runs: 463, average: 51.4, strikeRate: 168.7, fifties: 3, hundreds: 1, wickets: 0, economy: 0, bestBowling: '-', price: 27, isCapped: true },
  { id: 12, name: 'Sanju Samson', teamId: 6, role: 'Wicket-keeper', nationality: 'Indian', age: 29, jerseyNumber: 9, matches: 10, runs: 398, average: 44.2, strikeRate: 155.1, fifties: 2, hundreds: 1, wickets: 0, economy: 0, bestBowling: '-', price: 14, isCapped: true },
  { id: 13, name: 'Travis Head', teamId: 7, role: 'Batsman', nationality: 'Australian', age: 30, jerseyNumber: 25, matches: 10, runs: 534, average: 59.3, strikeRate: 192.4, fifties: 4, hundreds: 1, wickets: 0, economy: 0, bestBowling: '-', price: 6.8, isCapped: true },
  { id: 14, name: 'Glenn Maxwell', teamId: 3, role: 'All-rounder', nationality: 'Australian', age: 35, jerseyNumber: 32, matches: 10, runs: 312, average: 34.7, strikeRate: 178.9, fifties: 2, hundreds: 0, wickets: 6, economy: 8.4, bestBowling: '2/19', price: 11, isCapped: true },
  { id: 15, name: 'Yuzvendra Chahal', teamId: 6, role: 'Bowler', nationality: 'Indian', age: 33, jerseyNumber: 3, matches: 10, runs: 5, average: 2.5, strikeRate: 62.5, fifties: 0, hundreds: 0, wickets: 20, economy: 7.9, bestBowling: '4/20', price: 18, isCapped: true },
];

export const matches: Match[] = [
  {
    id: 1, matchNumber: 1, homeTeamId: 1, awayTeamId: 2,
    venue: 'Wankhede Stadium', city: 'Mumbai',
    date: '2026-03-22', time: '19:30', status: 'Completed',
    homeScore: '195/4 (20)', awayScore: '187/8 (20)',
    result: 'Mumbai Indians won by 8 runs', manOfMatch: 'Rohit Sharma',
    toss: 'Mumbai Indians won the toss and elected to bat'
  },
  {
    id: 2, matchNumber: 2, homeTeamId: 3, awayTeamId: 4,
    venue: 'M Chinnaswamy Stadium', city: 'Bangalore',
    date: '2026-03-23', time: '15:30', status: 'Completed',
    homeScore: '214/3 (20)', awayScore: '198/6 (20)',
    result: 'Royal Challengers Bangalore won by 16 runs', manOfMatch: 'Virat Kohli',
    toss: 'RCB won the toss and elected to bat'
  },
  {
    id: 3, matchNumber: 3, homeTeamId: 5, awayTeamId: 6,
    venue: 'Arun Jaitley Stadium', city: 'Delhi',
    date: '2026-03-24', time: '19:30', status: 'Completed',
    homeScore: '178/7 (20)', awayScore: '181/4 (19.2)',
    result: 'Rajasthan Royals won by 6 wickets', manOfMatch: 'Sanju Samson',
    toss: 'Delhi Capitals won the toss and elected to bat'
  },
  {
    id: 4, matchNumber: 11, homeTeamId: 1, awayTeamId: 3,
    venue: 'Wankhede Stadium', city: 'Mumbai',
    date: '2026-04-10', time: '19:30', status: 'Live',
    homeScore: '127/3 (14.2)',
    currentOver: '14.2',
    currentBatsmen: [
      { name: 'Rohit Sharma', runs: 67, balls: 42 },
      { name: 'Suryakumar Yadav', runs: 38, balls: 21 }
    ],
    currentBowler: { name: 'Glenn Maxwell', overs: '2.2', wickets: 1, runs: 18 },
    toss: 'Mumbai Indians won the toss and elected to bat'
  },
  {
    id: 5, matchNumber: 12, homeTeamId: 2, awayTeamId: 4,
    venue: 'MA Chidambaram Stadium', city: 'Chennai',
    date: '2026-04-11', time: '19:30', status: 'Scheduled',
  },
  {
    id: 6, matchNumber: 13, homeTeamId: 7, awayTeamId: 8,
    venue: 'Rajiv Gandhi International Stadium', city: 'Hyderabad',
    date: '2026-04-12', time: '15:30', status: 'Scheduled',
  },
  {
    id: 7, matchNumber: 14, homeTeamId: 9, awayTeamId: 10,
    venue: 'BRSABV Ekana Cricket Stadium', city: 'Lucknow',
    date: '2026-04-13', time: '19:30', status: 'Scheduled',
  },
  {
    id: 8, matchNumber: 15, homeTeamId: 5, awayTeamId: 1,
    venue: 'Arun Jaitley Stadium', city: 'Delhi',
    date: '2026-04-14', time: '19:30', status: 'Scheduled',
  },
];

export const liveCommentary: Commentary[] = [
  { ball: '14.2', description: 'FOUR! Rohit Sharma drives through covers magnificently!', runs: 4, isWicket: false, isFour: true, isSix: false, batsman: 'Rohit Sharma', bowler: 'Maxwell' },
  { ball: '14.1', description: 'Single to long-on. Good running between the wickets.', runs: 1, isWicket: false, isFour: false, isSix: false, batsman: 'SKY', bowler: 'Maxwell' },
  { ball: '13.6', description: 'SIX! Suryakumar Yadav goes downtown! Massive hit over long-on!', runs: 6, isWicket: false, isFour: false, isSix: true, batsman: 'SKY', bowler: 'Siraj' },
  { ball: '13.5', description: 'Dot ball. Good delivery, defended back to bowler.', runs: 0, isWicket: false, isFour: false, isSix: false, batsman: 'SKY', bowler: 'Siraj' },
  { ball: '13.4', description: 'WICKET! Ishan Kishan caught at mid-on! Siraj strikes!', runs: 0, isWicket: true, isFour: false, isSix: false, batsman: 'Kishan', bowler: 'Siraj' },
  { ball: '13.3', description: 'Two runs. Pushed to mid-wicket, good running!', runs: 2, isWicket: false, isFour: false, isSix: false, batsman: 'Kishan', bowler: 'Siraj' },
  { ball: '13.2', description: 'FOUR! Cut shot through point! Brilliant timing by Kishan.', runs: 4, isWicket: false, isFour: true, isSix: false, batsman: 'Kishan', bowler: 'Siraj' },
  { ball: '13.1', description: 'Dot ball. Fuller length, driven to mid-off.', runs: 0, isWicket: false, isFour: false, isSix: false, batsman: 'Kishan', bowler: 'Siraj' },
];

export const topRunScorers = players
  .filter(p => p.runs > 0)
  .sort((a, b) => b.runs - a.runs)
  .slice(0, 10);

export const topWicketTakers = players
  .filter(p => p.wickets > 0)
  .sort((a, b) => b.wickets - a.wickets)
  .slice(0, 10);

export const getTeamById = (id: number) => teams.find(t => t.id === id);
export const getPlayersByTeam = (teamId: number) => players.filter(p => p.teamId === teamId);
export const getLiveMatches = () => matches.filter(m => m.status === 'Live');
export const getScheduledMatches = () => matches.filter(m => m.status === 'Scheduled');
export const getCompletedMatches = () => matches.filter(m => m.status === 'Completed');
