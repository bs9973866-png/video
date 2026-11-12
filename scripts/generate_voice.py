import urllib.request, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
audio=root/'public/audio'; audio.mkdir(parents=True,exist_ok=True)
base='https://huggingface.co/rhasspy/piper-voices/resolve/main/ru/ru_RU/irina/medium/'
for name in ['ru_RU-irina-medium.onnx','ru_RU-irina-medium.onnx.json']:
 p=audio/name
 if not p.exists(): urllib.request.urlretrieve(base+name,p)
text=(root/'scripts/narration.txt').read_text(encoding='utf-8')
subprocess.run(['piper','--model',str(audio/'ru_RU-irina-medium.onnx'),'--config',str(audio/'ru_RU-irina-medium.onnx.json'),'--output_file',str(audio/'narration.wav')],input=text,text=True,check=True)
print('Neural narration generated')