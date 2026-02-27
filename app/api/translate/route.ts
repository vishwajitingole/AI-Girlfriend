import { sarvam } from '@/lib/sarvam-client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Call your "package" method
    const data = await sarvam.translate(text, sourceLang, targetLang);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Sarvam Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}