# Русская TTS-озвучка

Дикторская дорожка генерируется автоматически офлайн через eSpeak NG с русским голосом. Голос синтетический и немного роботизированный, зато сборка не зависит от стороннего облачного TTS.

- Текст: `public/audio/narration.txt`
- Скрипт: `scripts/generate_voiceover.py`
- Результат: `public/audio/narration.wav`
- GitHub Actions устанавливает eSpeak NG, генерирует WAV и затем рендерит Remotion.
- Видеокомпозиция подключает WAV как аудиодорожку.

## Локально

На Ubuntu/Debian:

```bash
sudo apt-get install espeak-ng
python scripts/generate_voiceover.py
npm install
npm run build
```

Чтобы заменить синтетический голос на более естественный, можно позже подставить записанный или сгенерированный WAV/MP3, обновив путь в `src/Video.tsx`.
