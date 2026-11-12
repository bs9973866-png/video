import json, subprocess, urllib.request
from pathlib import Path

root=Path(__file__).resolve().parents[1]
audio=root/'public/audio'
audio.mkdir(parents=True,exist_ok=True)
voice='ru_RU-dmitri-medium'
base='https://huggingface.co/rhasspy/piper-voices/resolve/main/ru/ru_RU/dmitri/medium/'
model=audio/f'{voice}.onnx'
config=audio/f'{voice}.onnx.json'
for name,path in [(f'{voice}.onnx',model),(f'{voice}.onnx.json',config)]:
    if not path.exists():
        print(f'Downloading Russian voice: {name}')
        urllib.request.urlretrieve(base+name,path)

text=(root/'scripts/narration.txt').read_text(encoding='utf-8')
raw=audio/'narration_raw.wav'
final=audio/'narration.wav'
subprocess.run(
    ['piper','--model',str(model),'--config',str(config),'--output_file',str(raw)],
    input=text,text=True,check=True
)

def duration(path):
    result=subprocess.run(
        ['ffprobe','-v','error','-show_entries','format=duration',
         '-of','default=noprint_wrappers=1:nokey=1',str(path)],
        capture_output=True,text=True,check=True
    )
    return float(result.stdout.strip())

raw_duration=duration(raw)
# Pitch shift is deliberately subtle; tempo is calculated so narration fits
# the eight-minute picture instead of running over the ending.
pitch_rate=0.96
target_seconds=474.0
tempo=raw_duration/(pitch_rate*target_seconds)
tempo=max(0.85,min(1.50,tempo))
print(f'Raw voice: {raw_duration:.1f}s; tempo factor: {tempo:.3f}')
filters=(
    f'asetrate=22050*{pitch_rate},aresample=22050,atempo={tempo:.5f},'
    'equalizer=f=140:t=q:w=1:g=1.8,'
    'equalizer=f=2800:t=q:w=1:g=1.2,'
    'acompressor=threshold=-20dB:ratio=2:attack=15:release=120,'
    'alimiter=limit=0.95,apad=pad_dur=6'
)
subprocess.run(
    ['ffmpeg','-y','-i',str(raw),'-af',filters,'-t','480','-ar','22050',str(final)],
    check=True
)
raw.unlink(missing_ok=True)
final_duration=duration(final)
print(f'Final narration: {final_duration:.1f}s (picture: 480.0s)')
if final_duration < 470:
    raise SystemExit(f'Narration is too short for the eight-minute film: {final_duration:.1f}s')
