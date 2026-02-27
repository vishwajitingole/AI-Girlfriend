// This acts as your "internal SDK"
export class SarvamClient {
  private apiKey: string;
  private baseUrl = "https://api.sarvam.ai";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async translate(text: string, source: string, target: string) {
    const response = await fetch(`${this.baseUrl}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": this.apiKey,
      },
      body: JSON.stringify({
        input: text,
        source_language_code: source,
        target_language_code: target,
        speaker_gender: "Female",
        mode: "formal",
      }),
    });

    if (!response.ok) throw new Error("Sarvam API error");
    return response.json();
  }

  // Add more methods here for TTS, STT, etc.
}

// Initialize a single instance
export const sarvam = new SarvamClient(process.env.SARVAM_API_KEY!);