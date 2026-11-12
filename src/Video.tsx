import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, Easing, Audio, staticFile} from 'remotion';

const scenes = [
  {title:'МИР БЕЗ ИНТЕРНЕТА', sub:'Что, если бы он никогда не появился?', tag:'АЛЬТЕРНАТИВНАЯ ИСТОРИЯ', kind:'title', bg:'#101b32'},
  {title:'УТРО БЕЗ УВЕДОМЛЕНИЙ', sub:'День начинается не с экрана, а со звука будильника и шороха газеты.', tag:'07:00 • ДОМ', kind:'morning', bg:'#e9b77c'},
  {title:'НОВОСТИ — НА БУМАГЕ', sub:'Чтобы узнать, что происходит в мире, нужно дождаться выпуска газеты или включить радио.', tag:'ИНФОРМАЦИЯ', kind:'news', bg:'#d9d1bd'},
  {title:'ГДЕ ИСКАТЬ ОТВЕТЫ?', sub:'Библиотеки становятся главными поисковыми системами: каталоги, карточки и толстые справочники.', tag:'ЗНАНИЯ', kind:'library', bg:'#c8b99b'},
  {title:'ОБЩЕНИЕ НА РАССТОЯНИИ', sub:'Письма идут днями. Звонки требуют времени, а встреча — договорённости заранее.', tag:'ЛЮДИ', kind:'people', bg:'#b6c9c6'},
  {title:'ИГРЫ — РЯДОМ', sub:'Мультиплеер живёт в одной комнате: приставка, разделённый экран и друзья на диване.', tag:'РАЗВЛЕЧЕНИЯ', kind:'gaming', bg:'#827da8'},
  {title:'МУЗЫКА И КУЛЬТУРА', sub:'Альбомы покупают на кассетах и виниле. Новую группу чаще узнают от знакомых или по радио.', tag:'КУЛЬТУРА', kind:'music', bg:'#d9a5a0'},
  {title:'БИЗНЕС НА БУМАГЕ', sub:'Счета, договоры и архивы требуют папок, печатей, курьеров и человеческого труда.', tag:'ЭКОНОМИКА', kind:'business', bg:'#9eac9c'},
  {title:'ГОРОД БЕЗ GPS', sub:'Маршрут строят по атласу и дорожным указателям. Ошибка на перекрёстке стоит времени.', tag:'ТРАНСПОРТ', kind:'maps', bg:'#d2b88d'},
  {title:'МИР НЕ ОСТАНОВИЛСЯ БЫ', sub:'Он просто работал бы медленнее. Интернет стал невидимым каркасом повседневной жизни.', tag:'ВЫВОД', kind:'ending', bg:'#172b43'}
];
const captions = [
  ['Представь обычное утро.','Ты просыпаешься — и телефон','не мигает на тумбочке.','Нет сообщений, новостей','и бесконечной ленты.'],
  ['Вместо смартфона — будильник.','На кухне играет радио.','На столе лежит свежая газета.','Чтобы узнать новости,','нужно дождаться выпуска.'],
  ['Никакого Google.','Нужен ответ — иди в библиотеку.','Сначала найди нужный раздел,','потом карточку в каталоге,','а затем нужную книгу.'],
  ['Поиск занимает часы,','а не секунды.','Зато библиотекарь знает,','где искать редкие материалы.','Знания требуют пути.'],
  ['Друзьям пишут письма.','Или договариваются о звонке.','Нельзя просто отправить мем','за долю секунды.','Зато встречи планируют заранее.'],
  ['Онлайн-матчей нет.','Играть можно рядом:','одна приставка, один телевизор,','разделённый экран','и компания друзей.'],
  ['Музыку покупают физически.','Кассеты перематывают карандашом.','Винил бережно ставят на проигрыватель.','Новые песни узнают по радио','или совету знакомого.'],
  ['Компании хранят документы','в бумажных архивах.','Банковские операции медленнее.','Платёж подтверждают чеком,','а договор — подписью и печатью.'],
  ['Навигатор не перестраивает путь.','Водитель раскрывает атлас.','Смотрит на указатели.','И иногда спрашивает дорогу','у прохожего.'],
  ['Но мир не остановился бы.','Наука, торговля и общение','продолжили бы развиваться.','Просто многие процессы','занимали бы больше времени.'],
  ['Интернет — не просто сайты.','Это невидимая инфраструктура','под банками, логистикой,','образованием и общением.','Мы замечаем её, когда её нет.'],
  ['Возможно, люди чаще встречались бы','лицом к лицу.','Но доступ к знаниям и услугам','был бы гораздо менее равным.','У скорости есть своя цена.'],
  ['Так что интернет не сделал','мир идеальным.','Но он изменил саму скорость,','с которой человечество','обменивается информацией.'],
  ['А теперь представь:','ты смотришь на этот экран…','и пытаешься представить мир,','в котором его никогда','не существовало.']
];

const palette = {ink:'#172033', paper:'#fff7e8', accent:'#f05b45', blue:'#456b91'};
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const Person: React.FC<{x?:number;y?:number;scale?:number;color?:string}> = ({x=0,y=0,scale=1,color='#456b91'}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle cx="0" cy="-78" r="35" fill="#e8b58e"/>
    <path d="M-34 -91 Q-25 -132 13 -119 Q39 -111 34 -78 Q10 -101 -34 -91" fill="#382b2a"/>
    <path d="M-54 55 Q-50 -35 0 -38 Q52 -35 56 55Z" fill={color}/>
    <path d="M-18 -72 Q-8 -65 0 -72" stroke="#49332c" strokeWidth="3" fill="none"/>
    <circle cx="15" cy="-77" r="3" fill="#49332c"/>
  </g>
);

const Illustration: React.FC<{kind:string; frame:number}> = ({kind,frame}) => {
  const bob = Math.sin(frame/18)*7;
  if(kind==='title') return <g transform="translate(1450 530)"><circle r="245" fill="#233d61"/><circle r="180" fill="none" stroke="#f05b45" strokeWidth="3" strokeDasharray="12 18"/><path d="M-130 -80 L0 -160 L130 -80 L130 80 L0 160 L-130 80Z" fill="#f05b45" opacity=".9"/><path d="M-70 0 H70 M0 -70 V70" stroke="white" strokeWidth="12" opacity=".8"/></g>;
  if(kind==='morning') return <g transform={`translate(1280 ${500+bob})`}><rect x="-300" y="-170" width="530" height="330" rx="22" fill="#fff1d8"/><rect x="-270" y="-140" width="190" height="130" fill="#8bb5c2"/><circle cx="-180" cy="-75" r="34" fill="#f4cf83"/><rect x="-40" y="45" width="220" height="22" rx="8" fill="#9a674a"/><rect x="0" y="68" width="15" height="90" fill="#9a674a"/><rect x="135" y="68" width="15" height="90" fill="#9a674a"/><circle cx="-170" cy="5" r="42" fill="#e4a75f"/><path d="M-170 -30 V5 L-145 20" stroke="#fff" strokeWidth="6" fill="none"/><Person x={-355} y={110} scale={1.3}/></g>;
  if(kind==='news') return <g transform={`translate(1320 ${530+bob}) rotate(-5)`}><rect x="-230" y="-180" width="460" height="350" fill="#fffaf0" stroke="#4a4a42" strokeWidth="5"/><text x="0" y="-115" textAnchor="middle" fontSize="38" fontWeight="900" fill="#242424">ЕЖЕДНЕВНЫЕ</text><path d="M-190 -85 H190 M-190 -65 H190" stroke="#333" strokeWidth="5"/><rect x="-185" y="-35" width="150" height="105" fill="#a7a08e"/><path d="M-10 -30 H190 M-10 -5 H190 M-10 20 H190 M-190 95 H190 M-190 120 H190" stroke="#777" strokeWidth="8"/></g>;
  if(kind==='library') return <g transform="translate(1320 520)"><rect x="-270" y="-210" width="540" height="420" fill="#805e42"/>{Array.from({length:5},(_,i)=><g key={i}><rect x={-245+i*100} y="-190" width="78" height="375" fill={['#c77e54','#d5b56f','#5f8b83','#b95e50','#d0c5a1'][i]}/><path d={`M${-230+i*100} -120 h48 M${-230+i*100} -95 h48 M${-230+i*100} 120 h48`} stroke="#fff1d8" strokeWidth="7"/></g>)}<rect x="-320" y="190" width="640" height="22" fill="#513c2f"/></g>;
  if(kind==='people') return <g transform="translate(1300 520)"><Person x={-130} y={80} scale={1.4} color="#d76d55"/><Person x={100} y={80} scale={1.4} color="#456b91"/><path d="M-25 -65 Q0 -115 25 -65" stroke="#fff" strokeWidth="9" fill="none"/><path d="M-5 -40 Q0 -55 5 -40" stroke="#fff" strokeWidth="8" fill="none"/></g>;
  if(kind==='gaming') return <g transform="translate(1300 550)"><rect x="-300" y="-180" width="600" height="340" rx="24" fill="#282b48"/><rect x="-270" y="-150" width="540" height="280" fill="#8ac4b0"/><path d="M-270 40 L-80 -50 L50 15 L270 -90 V130 H-270Z" fill="#477c70"/><rect x="-100" y="175" width="200" height="55" rx="28" fill="#292b3d"/><circle cx="-35" cy="202" r="14" fill="#f05b45"/><circle cx="35" cy="202" r="14" fill="#f05b45"/></g>;
  if(kind==='music') return <g transform={`translate(1300 ${530+bob})`}><circle r="190" fill="#292b3d"/><circle r="145" fill="#3e425a"/><circle r="100" fill="#292b3d"/><circle r="20" fill="#e6c27a"/><path d="M-190 -185 Q-250 -250 -180 -275 Q-120 -280 -130 -210" fill="none" stroke="#f05b45" strokeWidth="18"/><rect x="160" y="-250" width="65" height="500" rx="12" fill="#e0b56f"/><circle cx="192" cy="-180" r="18" fill="#292b3d"/><circle cx="192" cy="180" r="18" fill="#292b3d"/></g>;
  if(kind==='business') return <g transform="translate(1300 530)"><rect x="-270" y="-190" width="540" height="370" rx="14" fill="#f4ead7"/>{[-150,-30,90].map((x,i)=><g key={i}><rect x={x} y={-130+i*20} width="150" height="230" rx="8" fill={['#d5a66c','#8da49a','#b9a2a0'][i]}/><path d={`M${x+20} -85 h110 M${x+20} -55 h110 M${x+20} -25 h110 M${x+20} 5 h110`} stroke="#fff" strokeWidth="8"/></g>)}</g>;
  if(kind==='maps') return <g transform="translate(1300 530) rotate(8)"><path d="M-300 -180 L-100 -230 L100 -180 L300 -230 V180 L100 230 L-100 180 L-300 230Z" fill="#f4e5bd" stroke="#6f654f" strokeWidth="6"/><path d="M-100 -230 V180 M100 -180 V230 M-250 20 Q-80 -100 10 40 T250 -80" fill="none" stroke="#7c9d8a" strokeWidth="16"/><path d="M-15 -25 L0 -90 L15 -25 L0 -38Z" fill="#e65c45"/><circle cy="-20" r="18" fill="#e65c45"/></g>;
  return <g transform="translate(1320 530)"><circle r="230" fill="#233d61"/><circle r="160" fill="none" stroke="#6fa7bd" strokeWidth="5"/><path d="M-120 0 H120 M0 -120 V120" stroke="#f05b45" strokeWidth="8"/><circle r="28" fill="#f4d49b"/><path d="M-320 270 H320" stroke="#f4d49b" strokeWidth="5"/></g>;
};

const Scene: React.FC<{scene:typeof scenes[number]; index:number}> = ({scene,index}) => {
  const frame = useCurrentFrame();
  const {fps} = {fps:30};
  const enter = interpolate(frame,[0,24],[0,1],{extrapolateRight:'clamp', easing:ease});
  const drift = interpolate(frame,[0,450],[35,-35],{extrapolateRight:'clamp'});
  return <AbsoluteFill style={{backgroundColor:scene.bg, overflow:'hidden'}}>
    <AbsoluteFill style={{background:'linear-gradient(115deg,rgba(255,255,255,.16),transparent 55%),radial-gradient(circle at 78% 45%,rgba(255,255,255,.24),transparent 30%)'}}/>
    <div style={{position:'absolute',left:110,top:100,fontFamily:'Arial',fontSize:22,fontWeight:800,letterSpacing:5,color:scene.kind==='title'||scene.kind==='ending'?'#9dc6d5':'#4d514c',opacity:enter}}>{scene.tag}</div>
    <div style={{position:'absolute',left:110,top:300,width:850,transform:`translateY(${(1-enter)*45}px)`,opacity:enter}}>
      <div style={{fontFamily:'Arial,sans-serif',fontWeight:900,fontSize:76,lineHeight:1.02,letterSpacing:-2,color:scene.kind==='title'||scene.kind==='ending'?'#fff7e8':palette.ink}}>{scene.title}</div>
      <div style={{marginTop:38,maxWidth:740,fontFamily:'Arial,sans-serif',fontSize:32,lineHeight:1.35,color:scene.kind==='title'||scene.kind==='ending'?'#d9e8f0':'#343b42'}}>{scene.sub}</div>
    </div>
    <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%',transform:`translateX(${drift}px) scale(${0.94+enter*.06})`}}><Illustration kind={scene.kind} frame={frame}/></svg>
    <div style={{position:'absolute',bottom:55,left:110,right:110,display:'flex',justifyContent:'space-between',fontFamily:'Arial',fontSize:18,fontWeight:700,letterSpacing:3,color:scene.kind==='title'||scene.kind==='ending'?'#9dc6d5':'#4d514c'}}><span>А ЧТО, ЕСЛИ…</span><span>0{index+1} / 10</span></div>
  </AbsoluteFill>;
};

export const NoInternetVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneFrames = 630;
  const sceneIndex = Math.min(scenes.length-1,Math.floor(frame/sceneFrames));
  const local = frame%sceneFrames;
  const captionIndex = Math.min(captions.length-1,Math.floor(frame/450));
  const caption = captions[captionIndex][Math.floor((frame%450)/90)] ?? '';
  const fade = interpolate(local,[0,18,sceneFrames-18,sceneFrames],[0,1,1,0],{extrapolateRight:'clamp'});
  return <AbsoluteFill style={{backgroundColor:'#101b32'}}>
    <Audio src={staticFile('audio/narration.wav')} />
    {scenes.map((scene,i)=><Sequence key={scene.kind} from={i*sceneFrames} durationInFrames={sceneFrames}><Scene scene={scene} index={i}/></Sequence>)}
    <AbsoluteFill style={{justifyContent:'flex-end',alignItems:'center',paddingBottom:115,opacity:frame<6000?1:0}}>
      <div style={{fontFamily:'Arial,sans-serif',fontSize:34,fontWeight:700,color:'#fff',textShadow:'0 3px 14px #000',background:'rgba(9,17,30,.72)',padding:'16px 34px',borderRadius:12,maxWidth:1500,textAlign:'center'}}>{caption}</div>
    </AbsoluteFill>
    <AbsoluteFill style={{backgroundColor:'#07101e',opacity:frame<30?interpolate(frame,[0,30],[1,0]):frame>6270?interpolate(frame,[6270,6300],[0,1]):0}}/>
  </AbsoluteFill>;
};
