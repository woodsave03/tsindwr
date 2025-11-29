// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("OK", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (_e) {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
  }

  const { type, page, description, contact, url, userAgent, version } = body || {};

  if (!description || typeof description !== "string") {
    return new Response("Description is required", { status: 400, headers: corsHeaders });
  }

  const embed: any = {
    title: "New Sunder docs issue",
    description: description.substring(0, 1024),
    color: 0x5a2d82, // Sunder purple
    fields: [
      { name: "Type", value: type || "unspecified", inline: true },
      { name: "Page", value: page || "(not specified)", inline: true },
    ],
    timestamp: new Date().toISOString(),
  };

  if (url) {
    embed.fields.push({
      name: "Reporter contact",
      value: String(contact).substring(0, 256),
      inline: false,
    });
  }

  if (version) {
    embed.fields.push({
      name: "Site version",
      value: String(version),
      inline: true,
    });
  }

  if (userAgent) {
    embed.fields.push({
      name: "User-Agent",
      value: String(userAgent).substring(0,256),
      inline: false,
    });
  }

  const discordPayload = {
    content: "",
    embeds: [embed],
  };

  const webhookUrl = Deno.env.get("DISCORD_WEBHOOK_URL");
  if (!webhookUrl) {
    return new Response("Webhook not configured", { status: 500, headers: corsHeaders });
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(discordPayload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Discord error:", res.status, text);
    return new Response("Discord error", { status: 502, headers: corsHeaders });
  }

  return new Response("OK", { status: 200, headers: corsHeaders });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/report-bug' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
