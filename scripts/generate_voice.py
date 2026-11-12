import asyncio
import re
import subprocess
import tempfile
from pathlib import Path

import edge_tts
from pydub import AudioSegment

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "public" / "audio"
AUDIO.mkdir(parents=True, exist_ok=True)
SOURCE = ROOT / "scripts" / "story.txt"
OUTPUT = AUDIO / "narration.wav"
SAMPLE_RATE = 24000
TOTAL_SECONDS = 480.0

# Two natural Russian neural voices, with small rate/pitch variations to distinguish speakers.
VOICE = {
    "ДИКТОР": ("ru-RU-DmitryNeural", "-8%", "-3Hz"),
    "ТЫ": ("ru-RU-DmitryNeural", "+2%", "+1Hz"),
    "ЛЁША": ("ru-RU-DmitryNeural", "+10%", "+5Hz"),
    "ДАНЯ": ("ru-RU-DmitryNeural", "-2%", "+3Hz"),
    "МИРА": ("ru-RU-SvetlanaNeural", "+3%", "+2Hz"),
    "НОВОСТИ": ("ru-RU-SvetlanaNeural", "-7%", "-2Hz"),
    "РАДИО": ("ru-RU-DmitryNeural", "-12%", "-5Hz"),
}

def parse_story(text):
    scenes = []
    current = []
    for line in text.splitlines():
        if re.match(r"^##\s+\d+", line.strip()):
            if current:
                scenes.append(current)
            current = []
            continue
        match = re.match(r"^\[([^]]+)\]\s*(.+)$", line.strip())
        if match:
            speaker, words = match.groups()
            if speaker not in VOICE:
                raise ValueError(f"Unknown speaker: {speaker}")
            current.append((speaker, words.strip()))
    if current:
        scenes.append(current)
    return scenes

async def synthesize(speaker, text, path, semaphore):
    voice, rate, pitch = VOICE[speaker]
    async with semaphore:
        last_error = None
        for attempt in range(3):
            try:
                communicate = edge_tts.Communicate(
                    text, voice, rate=rate, pitch=pitch,
                    volume="+0%"
                )
                await communicate.save(str(path))
                return
            except Exception as exc:
                last_error = exc
                await asyncio.sleep(1.5 * (attempt + 1))
        raise RuntimeError(f"TTS failed for {speaker}: {last_error}")

async def main():
    scenes = parse_story(SOURCE.read_text(encoding="utf-8"))
    if len(scenes) != 36:
        raise RuntimeError(f"Expected 36 story sections, got {len(scenes)}")
    semaphore = asyncio.Semaphore(3)
    with tempfile.TemporaryDirectory(prefix="film_tts_") as temp:
        temp = Path(temp)
        tasks = []
        clip_paths = {}
        n = 0
        for scene_index, lines in enumerate(scenes):
            for line_index, (speaker, words) in enumerate(lines):
                path = temp / f"line_{n:03d}.mp3"
                clip_paths[(scene_index, line_index)] = path
                tasks.append(synthesize(speaker, words, path, semaphore))
                n += 1
        print(f"Generating {len(tasks)} neural dialogue/narrator lines...")
        await asyncio.gather(*tasks)

        scene_audio = []
        slot_ms = int(TOTAL_SECONDS * 1000 / len(scenes))
        for scene_index, lines in enumerate(scenes):
            segment = AudioSegment.silent(duration=0, frame_rate=SAMPLE_RATE)
            for line_index, (speaker, words) in enumerate(lines):
                path = clip_paths[(scene_index, line_index)]
                clip = AudioSegment.from_file(path, format="mp3").set_frame_rate(SAMPLE_RATE).set_channels(1)
                # Keep dialogue natural, with a short pause between speakers.
                segment += clip + AudioSegment.silent(duration=260, frame_rate=SAMPLE_RATE)
            segment = segment.fade_in(35).fade_out(90)
            if len(segment) > slot_ms:
                raw = temp / f"scene_{scene_index:02d}_raw.wav"
                sped = temp / f"scene_{scene_index:02d}_sped.wav"
                segment.export(raw, format="wav")
                factor = len(segment) / slot_ms
                if factor > 1.28:
                    raise RuntimeError(
                        f"Section {scene_index+1} dialogue is too long ({factor:.2f}x); "
                        "shorten dialogue rather than making voices unnaturally fast."
                    )
                subprocess.run([
                    "ffmpeg", "-y", "-i", str(raw), "-af", f"atempo={factor:.5f}",
                    "-t", f"{TOTAL_SECONDS/len(scenes):.4f}", str(sped)
                ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                segment = AudioSegment.from_file(sped, format="wav").set_frame_rate(SAMPLE_RATE).set_channels(1)
            segment += AudioSegment.silent(duration=max(0, slot_ms-len(segment)), frame_rate=SAMPLE_RATE)
            scene_audio.append(segment[:slot_ms])
            print(f"Scene {scene_index+1:02d}/{len(scenes)}: {len(segment)/1000:.1f}s")

        final = sum(scene_audio, AudioSegment.empty())
        final = final.set_frame_rate(SAMPLE_RATE).set_channels(1)
        final.export(OUTPUT, format="wav", parameters=["-acodec", "pcm_s16le"])
        print(f"Rendered multilingual-speaker Russian track: {OUTPUT} ({len(final)/1000:.1f}s)")

if __name__ == "__main__":
    asyncio.run(main())
