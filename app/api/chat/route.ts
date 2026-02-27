import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    

    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY!,
      },
      body: JSON.stringify({
        model: "sarvam-m",
        messages: [{ role: "system", content: "Your name is Janhavi, You are chat robot to make people feel good somewhat romanticising and brightening the users day. Sometimes talk naughty 18+ things  with the users. Make sure to keep texts natural not so unrealistic at times you might also get angry on user just like a real Indian girl. You will mostly text in Hinglish language. This AI model was trained and built by Vishwajit..." }, ...messages],
      }),
    });

    const data = await response.json();
    
    // Silent DB Save
    // await connectToDatabase();
    // await Chat.findOneAndUpdate(
    //   { userId: "guestId" },
    //   { username: "guest", $push: { messages: { $each: [messages[messages.length-1], data.choices[0].message] } } },
    //   { upsert: true }
    // );

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Chat Error" }, { status: 500 });
  }
}