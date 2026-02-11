import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, seedPhrase } = await req.json();

    if (!email || !seedPhrase || !Array.isArray(seedPhrase) || seedPhrase.length < 12) {
      return new Response(
        JSON.stringify({ error: "E-Mail und gültige Seed Phrase (12 Wörter) erforderlich" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
      console.error("Error listing users:", userError);
      return new Response(
        JSON.stringify({ error: "Interner Fehler" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const user = userData.users.find((u) => u.email === email);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Kein Konto mit dieser E-Mail gefunden" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get stored encrypted seed phrase
    const { data: seedData, error: seedError } = await supabaseAdmin
      .from("wallet_seed_phrases")
      .select("encrypted_seed_phrase")
      .eq("user_id", user.id)
      .maybeSingle();

    if (seedError || !seedData) {
      return new Response(
        JSON.stringify({ error: "Keine Seed Phrase für dieses Konto hinterlegt" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decrypt and compare (base64 encoded JSON)
    let storedPhrase: string[];
    try {
      storedPhrase = JSON.parse(atob(seedData.encrypted_seed_phrase));
    } catch {
      return new Response(
        JSON.stringify({ error: "Gespeicherte Seed Phrase konnte nicht gelesen werden" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedInput = seedPhrase.map((w: string) => w.trim().toLowerCase());
    const normalizedStored = storedPhrase.map((w: string) => w.trim().toLowerCase());

    if (
      normalizedInput.length !== normalizedStored.length ||
      !normalizedInput.every((w: string, i: number) => w === normalizedStored[i])
    ) {
      return new Response(
        JSON.stringify({ error: "Die Seed Phrase stimmt nicht überein" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Seed phrase matches – generate magic link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: email,
    });

    if (linkError || !linkData) {
      console.error("Error generating link:", linkError);
      return new Response(
        JSON.stringify({ error: "Login-Link konnte nicht erstellt werden" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the token hash from the generated link
    const url = new URL(linkData.properties.action_link);
    const token_hash = url.searchParams.get("token") || url.hash?.split("token=")[1]?.split("&")[0];

    return new Response(
      JSON.stringify({
        success: true,
        token_hash: linkData.properties.hashed_token,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Ein unerwarteter Fehler ist aufgetreten" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
