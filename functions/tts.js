export async function onRequest(context) {
  const { request } = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { text } = await request.json();

    if (!text) {
      return new Response('No text provided', { status: 400 });
    }

    // 使用 Microsoft Edge TTS API
    const VOICE_NAME = 'zh-CN-YunxiaNeural';
    const response = await fetch(
      `https://api.edge-tts.com/v1/text-to-speech`,
      {
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
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
