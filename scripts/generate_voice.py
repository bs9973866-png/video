import urllib.request, subprocess
from pathlib import Path

root=Path(__file__).resolve().parents[1]
audio=root/'public/audio'
audio.mkdir(parents=True,exist_ok=True)
voice='ru_RU-dmitri-medium'
base=f'https://huggingface.co/rhasspy/piper-voices/resolve/main/ru/ru_RU/dmitri/medium/'
model=audio/f'{voice}.onnx'
config=audio/f'{voice}.onnx.json'
for name,path in [(f'{voice}.onnx',model),(f'{voice}.onnx.json',config)]:
    if not path.exists():
        print(f'Downloading male Russian voice: {name}')
        urllib.request.urlretrieve(base+name,path)
text=(root/'scripts/narration.txt').read_text(encoding='utf-8')
raw=audio/'narration_raw.wav'
final=audio/'narration.wav'
subprocess.run(['piper','--model',str(model),'--config',str(config),'--output_file',str(raw)],input=text,text=True,check=True)
# Slightly lower pitch, add warm low-mid body and controlled compression.
# The tempo compensation keeps the narration duration close to the original.
subprocess.run([
    'ffmpeg','-y','-i',str(raw),'-af',
    'asetrate=22050*0.92,aresample=22050,atempo=0.97,'
    'equalizer=f=115:t=q:w=1:g=3.5,equalizer=f=260:t=q:w=1:g=1.5,'
    'acompressor=threshold=-19dB:ratio=2.2:attack=12:release=100,alimiter=limit=0.95',
    '-ar','22050',str(final)
],check=True)
raw.unlink(missing_ok=True)
probe=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(final)],capture_output=True,text=True,check=True)
duration=float(probe.stdout.strip())
print(f'Generated deep male Russian narration: {duration:.1f}s')
if duration < 155:
    raise SystemExit(f'Narration is too short for the 180-second film: {duration:.1f}s')