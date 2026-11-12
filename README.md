# Последнее сообщение — 2D stickman film

Трёхминутная история в Remotion: чёрные стикмены с выразительными белыми лицами, городские локации, движение, диалоги и русская нейросетевая озвучка Piper (ru_RU-irina-medium).

## Render locally

```bash
npm install
pip install piper-tts
python scripts/generate_voice.py
npx remotion browser ensure
npm run render
```

MP4: `out/last-message.mp4`. GitHub Actions собирает его автоматически при push в main.