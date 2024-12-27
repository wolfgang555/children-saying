import { NextResponse } from 'next/server';

// 指定使用 Edge Runtime
export const runtime = 'edge';

export async function POST(request: Request): Promise<Response> {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return new Response('No text provided', { status: 400 });
    }

    // 使用 Microsoft Edge TTS API
    const VOICE_NAME = 'zh-CN-YunxiaNeural';
    const ENDPOINT = 'https://api.edge-tts.com/v1/text-to-speech';

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice: VOICE_NAME,
        rate: '+0%',
        volume: '+0%',
      }),
    });

    if (!response.ok) {
      return new Response('Failed to generate speech', { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
