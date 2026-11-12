from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
TEXT = ROOT / "public" / "audio" / "narration.txt"
OUTPUT = ROOT / "public" / "audio" / "narration.wav"

def main():
    text = TEXT.read_text(encoding="utf-8").strip()
    if not text:
        raise SystemExit("Narration text is empty")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["espeak-ng", "-v", "ru", "-s", "132", "-a", "165", "-w", str(OUTPUT), text],
        check=True,
    )
    if not OUTPUT.exists() or OUTPUT.stat().st_size < 1000:
        raise SystemExit("TTS did not create a valid WAV file")
    print(f"Russian narration generated successfully: {OUTPUT} ({OUTPUT.stat().st_size} bytes)")

if __name__ == "__main__":
    main()
