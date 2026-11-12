from pathlib import Path
import asyncio
import edge_tts

ROOT = Path(__file__).resolve().parents[1]
TEXT = ROOT / "public" / "audio" / "narration.txt"
OUTPUT = ROOT / "public" / "audio" / "narration.mp3"

async def main():
    text = TEXT.read_text(encoding="utf-8").strip()
    if not text:
        raise SystemExit("Narration text is empty")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    voice = edge_tts.Communicate(
        text,
        voice="ru-RU-DmitryNeural",
        rate="-8%",
        volume="+0%",
        pitch="+0Hz",
    )
    await voice.save(str(OUTPUT))
    print(f"Voiceover created: {OUTPUT}")

if __name__ == "__main__":
    asyncio.run(main())
