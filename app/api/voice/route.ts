import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!process.env.ELEVENLABS_API_KEY) {
      console.error("CRITICAL: ELEVENLABS_API_KEY is not defined in .env.local");
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

   
    const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; 

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        }
      }),
    });

    if (!response.ok) {
      const detailedError = await response.json();
      console.error("ELEVENLABS API REJECTED REQUEST:", detailedError); // <--- Yeh terminal mein dekho
      return NextResponse.json({ error: detailedError.detail?.message || "ElevenLabs Error" }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json({ audio: base64Audio });
  } catch (error: any) {
    console.error("SERVER ERROR:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}