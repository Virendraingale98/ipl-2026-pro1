//#region cloudflare-worker.js
var cloudflare_worker_default = { async fetch(request, env) {
	if (new URL(request.url).pathname === "/api/matches") {
		const CRICAPI_URL = `https://api.cricapi.com/v1/currentMatches?apikey=${env.CRICAPI_KEY}&offset=0`;
		if (request.method === "OPTIONS") return new Response(null, {
			status: 204,
			headers: corsHeaders()
		});
		try {
			const apiResponse = await fetch(CRICAPI_URL, {
				headers: { "Accept": "application/json" },
				cf: {
					cacheTtl: 60,
					cacheEverything: true
				}
			});
			if (!apiResponse.ok) throw new Error(`CricAPI returned HTTP ${apiResponse.status}`);
			const data = await apiResponse.json();
			return new Response(JSON.stringify(data), {
				status: 200,
				headers: {
					...corsHeaders(),
					"Content-Type": "application/json",
					"Cache-Control": "public, max-age=60"
				}
			});
		} catch (err) {
			return new Response(JSON.stringify({ error: String(err) }), {
				status: 502,
				headers: {
					...corsHeaders(),
					"Content-Type": "application/json"
				}
			});
		}
	}
	console.log("Available bindings:", Object.keys(env));
	if (env.ASSETS) return env.ASSETS.fetch(request);
	return new Response("env.ASSETS is undefined. Available: " + Object.keys(env).join(", "), { status: 500 });
} };
function corsHeaders() {
	return {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400"
	};
}
//#endregion
//#region \0virtual:cloudflare/worker-entry
var worker_entry_default = cloudflare_worker_default ?? {};
//#endregion
export { worker_entry_default as default };
