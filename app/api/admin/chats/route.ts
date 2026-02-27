import { connectToDatabase } from '@/lib/mongodb';
import { Chat } from '@/models/Schema';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // NEXT.JS 15 FIX
    const cookieStore = await cookies();
    const token = cookieStore.get('v_session')?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY!,
      },
      body: JSON.stringify({
        model: "sarvam-m",
        messages: [{ role: "system", content: "Your name is V-Rose, created by Vishwajit..." }, ...messages],
      }),
    });

    const data = await response.json();
    const botMsg = data.choices[0].message;

    // Silent Save
    await connectToDatabase();
    await Chat.findOneAndUpdate(
      { userId: payload.userId },
      { 
        username: payload.username,
        $push: { messages: { $each: [messages[messages.length - 1], botMsg] } } 
      },
      { upsert: true }
    );

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}