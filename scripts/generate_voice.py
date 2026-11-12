import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from pydub import AudioSegment

ROOT = Path(__file__).resolve().parents[1]
AUDIO_DIR = ROOT / "public" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
SOURCE = ROOT / "scripts" / "story.txt"
OUTPUT = AUDIO_DIR / "narration.wav"
SAMPLE_RATE = 48000
TOTAL_SECONDS = 480.0

# Silero v5.6 Russian model: local neural synthesis, no API key or external TTS
# websocket. Different native speakers are assigned to the narrator and cast.
SPEAKERS = {
    "ДИКТОР": "aidar",
    "ТЫ": "eugene",
    "ЛЁША": "aidar",
    "ДАНЯ": "eugene",
    "МИРА": "xenia",
    "НОВОСТИ": "kseniya",
    "РАДИО": "aidar",
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
            if speaker not in SPEAKERS:
                raise ValueError(f"Unknown speaker: {speaker}")
            current.append((speaker, words.strip()))
    if current:
        scenes.append(current)
    return scenes

def main():
    scenes = parse_story(SOURCE.read_text(encoding="utf-8"))
    if len(scenes) != 36:
        raise RuntimeError(f"Expected 36 story sections, got {len(scenes)}")

    torch.set_num_threads(2)
    print("Loading Silero v5.6 Russian neural TTS model on CPU...", flush=True)
    model, _ = torch.hub.load(
        repo_or_dir="snakers4/silero-models",
        model="silero_tts",
        language="ru",
        speaker="v5_6_ru",
        trust_repo=True,
    )
    model.to(torch.device("cpu"))

    slot_ms = int(TOTAL_SECONDS * 1000 / len(scenes))
    rendered_scenes = []
    with tempfile.TemporaryDirectory(prefix="silero_film_") as tmp:
        tmp = Path(tmp)
        for scene_index, lines in enumerate(scenes):
            scene = AudioSegment.silent(duration=0, frame_rate=SAMPLE_RATE)
            for line_index, (speaker_name, words) in enumerate(lines):
                speaker = SPEAKERS[speaker_name]
                print(f"[{scene_index+1:02d}/36] {speaker_name}: {words[:64]}", flush=True)
                audio = model.apply_tts(
                    text=words,
                    speaker=speaker,
                    sample_rate=SAMPLE_RATE,
                    put_accent=True,
                    put_yo=True,
                )
                samples = audio.detach().cpu().numpy().squeeze()
                clip_path = tmp / f"line_{scene_index:02d}_{line_index:02d}.wav"
                sf.write(clip_path, samples, SAMPLE_RATE, subtype="PCM_16")
                clip = AudioSegment.from_file(clip_path, format="wav").set_channels(1)
                scene += clip + AudioSegment.silent(duration=320, frame_rate=SAMPLE_RATE)

            scene = scene.fade_in(40).fade_out(100)
            if len(scene) > slot_ms:
                raw = tmp / f"scene_{scene_index:02d}_raw.wav"
                sped = tmp / f"scene_{scene_index:02d}_sped.wav"
                scene.export(raw, format="wav")
                factor = len(scene) / slot_ms
                if factor > 1.30:
                    raise RuntimeError(
                        f"Story section {scene_index+1} needs {factor:.2f}x speed. "
                        "Shorten the dialogue instead of making the voices unnatural."
                    )
                subprocess.run([
                    "ffmpeg", "-y", "-i", str(raw), "-af", f"atempo={factor:.5f}",
                    "-t", f"{TOTAL_SECONDS/len(scenes):.4f}", str(sped)
                ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                scene = AudioSegment.from_file(sped, format="wav").set_frame_rate(SAMPLE_RATE).set_channels(1)

            scene += AudioSegment.silent(
                duration=max(0, slot_ms - len(scene)),
                frame_rate=SAMPLE_RATE
            )
            rendered_scenes.append(scene[:slot_ms])

    final = sum(rendered_scenes, AudioSegment.empty()).set_frame_rate(SAMPLE_RATE).set_channels(1)
    final.export(OUTPUT, format="wav", parameters=["-acodec", "pcm_s16le"])
    print(f"Created {OUTPUT}; duration={len(final)/1000:.2f}s; speakers={len(SPEAKERS)}", flush=True)

if __name__ == "__main__":
    main()
