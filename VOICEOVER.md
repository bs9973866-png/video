# Русская TTS-озвучка

В проект добавлена автоматическая генерация дикторской дорожки: нейтральный мужской русский голос Microsoft Edge TTS — `ru-RU-DmitryNeural`.

## Как это работает

- Текст озвучки хранится в `public/audio/narration.txt`.
- Скрипт `scripts/generate_voiceover.py` создаёт `public/audio/narration.mp3`.
- GitHub Actions генерирует MP3 перед рендером Remotion.
- Видеокомпозиция воспроизводит дорожку с начала ролика.

## Локальная генерация

Установи Python 3.10+ и выполни:

```bash
pip install edge-tts
python scripts/generate_voiceover.py
npm install
npm run build
```

Голос можно заменить, изменив параметр `voice` в скрипте на другой русский голос из списка Edge TTS. Для генерации требуется интернет-соединение. Перед публикацией проверь произношение имён и синхронизацию с субтитрами.
