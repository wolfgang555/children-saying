import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { join } from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // 创建临时音频文件的路径
    const outputDir = join(process.cwd(), 'public', 'audio');
    const fileName = `speech-${Date.now()}.mp3`;
    const outputPath = join(outputDir, fileName);

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 运行 edge-tts 命令
    return new Promise((resolve) => {
      const tts = spawn('edge-tts', [
        '--voice', 'zh-CN-YunxiaNeural',
        '--text', text,
        '--write-media', outputPath
      ]);

      tts.on('close', (code) => {
        if (code === 0) {
          resolve(NextResponse.json({ 
            success: true, 
            audioUrl: `/audio/${fileName}` 
          }));
        } else {
          resolve(NextResponse.json({ 
            error: 'Failed to generate speech' 
          }, { status: 500 }));
        }
      });

      tts.on('error', (err) => {
        console.error('TTS Error:', err);
        resolve(NextResponse.json({ 
          error: 'Failed to start TTS process' 
        }, { status: 500 }));
      });
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
