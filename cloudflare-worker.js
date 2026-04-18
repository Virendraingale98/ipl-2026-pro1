/**
 * IPL 2026 Pro Analyzer — Cloudflare Worker
 *
 * Proxies: https://api.cricapi.com/v1/currentMatches
 * Adds CORS headers so GitHub Pages can call this freely.
 *
 * Deploy steps:
 *  1. Go to https://dash.cloudflare.com → Workers & Pages → Create Worker
 *  2. Paste this entire file into the editor
 *  3. In Settings → Variables & Secrets, add:
 *       Secret name : CRICAPI_KEY
 *       Secret value: <your CricAPI key>
 *  4. Click "Save and Deploy"
 *  5. Copy the *.workers.dev URL and paste into Dashboard.tsx → PROXY_URL
 */

// API key is injected securely via Cloudflare Secret (env.CRICAPI_KEY)
// /v1/currentMatches returns teamInfo[], score[], matchStarted, matchEnded



// Allow requests from your GitHub Pages domain (or * for any origin)
const ALLOWED_ORIGIN = '*';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── Route: API Proxy ──────────────────────────────────────────────────
    if (url.pathname === '/api/matches') {
      const CRICAPI_URL = `https://api.cricapi.com/v1/currentMatches?apikey=${env.CRICAPI_KEY}&offset=0`;
      
      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(),
        });
      }

      try {
        const apiResponse = await fetch(CRICAPI_URL, {
          headers: { 'Accept': 'application/json' },
          cf: { cacheTtl: 60, cacheEverything: true },
        });

        if (!apiResponse.ok) throw new Error(`CricAPI returned HTTP ${apiResponse.status}`);
        const data = await apiResponse.json();

        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            ...corsHeaders(),
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=60',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), {
          status: 502,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      }
    }

    // Debug: log available bindings
    console.log("Available bindings:", Object.keys(env));

    // ── Route: Static Assets (Website) ────────────────────────────────────
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    
    return new Response("env.ASSETS is undefined. Available: " + Object.keys(env).join(", "), { status: 500 });
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}
