import React from 'react';
import {AbsoluteFill,Audio,interpolate,staticFile,useCurrentFrame} from 'remotion';

type Action='idle'|'walk'|'run'|'talk'|'point'|'phone'|'surprised'|'wave'|'sit'|'carry'|'look'|'cheer'|'write'|'listen'|'read'|'smile';
type Scene={title:string;sub:string;place:string;time:'day'|'dusk'|'night';caption:string;action:Action;friend:Action;third?:Action;focus:string};
const scenes:Scene[]=[
{title:'ПОСЛЕДНЕЕ ОБЫЧНОЕ УТРО',sub:'Ты просыпаешься и проверяешь телефон',place:'room',time:'day',caption:'Утро начинается как всегда: сообщения, музыка и новости.',action:'phone',friend:'idle',focus:'phone'},
{title:'ПЛАНЫ НА ВЕЧЕР',sub:'Лёша зовёт всех встретиться после школы',place:'room',time:'day',caption:'В общем чате уже спорят, где провести вечер.',action:'talk',friend:'phone',focus:'screen'},
{title:'ГОРОД НА СВЯЗИ',sub:'Транспорт, магазины и службы используют сеть',place:'street',time:'day',caption:'Никто не замечает, сколько всего зависит от интернета.',action:'walk',friend:'walk',focus:'city'},
{title:'ПОСЛЕДНИЙ СИГНАЛ',sub:'Экран внезапно перестаёт обновляться',place:'room',time:'day',caption:'И вдруг всё обрывается в одну секунду.',action:'surprised',friend:'idle',focus:'phone'},
{title:'ПЕРЕЗАГРУЗКА',sub:'Ты проверяешь роутер и настройки',place:'room',time:'day',caption:'Сначала кажется, что сломалось только у тебя.',action:'point',friend:'idle',focus:'router'},
{title:'НЕ РАБОТАЕТ НИЧЕГО',sub:'Не открываются сайты и сообщения',place:'room',time:'day',caption:'Но ни одна попытка не возвращает соединение.',action:'phone',friend:'look',focus:'screen'},
{title:'СБОЙ ВО ВСЁМ ГОРОДЕ',sub:'На улице люди смотрят на телефоны',place:'street',time:'day',caption:'У соседей та же проблема. И у прохожих тоже.',action:'look',friend:'surprised',focus:'city'},
{title:'ЗВОНОК ЛЁШЕ',sub:'Ты пытаешься дозвониться другу',place:'street',time:'day',caption:'Вызов не проходит. Впервые телефон бесполезен.',action:'phone',friend:'look',focus:'phone'},
{title:'НОВОСТИ ПРЕРЫВАЮТСЯ',sub:'Телевизор показывает срочное сообщение',place:'room',time:'day',caption:'Ведущий сообщает о глобальном отключении сетей.',action:'look',friend:'listen',focus:'screen'},
{title:'ЭКСТРЕННЫЙ ВЫПУСК',sub:'Власти просят сохранять спокойствие',place:'radio',time:'day',caption:'Причина неизвестна. Сроки восстановления никто не называет.',action:'talk',friend:'listen',focus:'radio'},
{title:'ПЕРВЫЕ ЧАСЫ',sub:'Люди собираются у подъезда',place:'hall',time:'day',caption:'Все задают один вопрос: что теперь делать?',action:'look',friend:'talk',focus:'neighbors'},
{title:'ПОИСК ДРУЗЕЙ',sub:'Ты идёшь к знакомой площадке',place:'street',time:'day',caption:'Без геолокации приходится вспоминать привычные маршруты.',action:'walk',friend:'look',focus:'map'},
{title:'ВОТ ТЫ ГДЕ',sub:'Лёша замечает тебя у площадки',place:'court',time:'day',caption:'Вы наконец находите друг друга без звонков.',action:'walk',friend:'wave',focus:'friends'},
{title:'МИРА ПРИХОДИТ',sub:'Мира появляется с другой стороны улицы',place:'park',time:'day',caption:'Она обошла несколько мест, прежде чем вас найти.',action:'wave',friend:'wave',focus:'friends'},
{title:'НИКТО НЕ ЗНАЕТ',sub:'Друзья обсуждают, что делать дальше',place:'park',time:'day',caption:'Никто не верит, что отключение затянется надолго.',action:'talk',friend:'talk',focus:'friends'},
{title:'ПЛАН НА БУМАГЕ',sub:'Вы назначаете ежедневную встречу',place:'park',time:'day',caption:'Каждый день в шесть — у старой остановки.',action:'point',friend:'look',focus:'notebook'},
{title:'ПЕРВАЯ НОЧЬ',sub:'Город непривычно тихий',place:'street',time:'night',caption:'Без ленты новостей люди слушают радио и разговоры.',action:'look',friend:'look',focus:'city'},
{title:'УТРО БЕЗ КАРТ',sub:'Люди спрашивают дорогу на перекрёстках',place:'crossroad',time:'day',caption:'Бумажные карты снова становятся полезными.',action:'talk',friend:'point',focus:'map'},
{title:'МАГАЗИН БЕЗ СЕТИ',sub:'Кассир записывает покупки в тетрадь',place:'shop',time:'day',caption:'Оплата и учёт замедляются, очередь растёт.',action:'look',friend:'carry',focus:'counter'},
{title:'ОСТАНОВКА',sub:'Пассажиры сверяют бумажное расписание',place:'bus',time:'day',caption:'Автобусы ходят, но маршруты приходится уточнять вручную.',action:'point',friend:'talk',focus:'bus'},
{title:'ПЕРВАЯ НЕДЕЛЯ',sub:'Друзья встречаются у остановки',place:'park',time:'dusk',caption:'Прошла неделя. Встреча стала важнее уведомлений.',action:'talk',friend:'listen',focus:'bench'},
{title:'РАДИО В КАЖДОМ ДОМЕ',sub:'Соседи слушают сводку новостей',place:'radio',time:'night',caption:'Радио становится главным окном в происходящее.',action:'listen',friend:'talk',focus:'radio'},
{title:'ШКОЛА БЕЗ ССЫЛОК',sub:'Учитель приносит книги и распечатки',place:'class',time:'day',caption:'Занятия продолжаются, но всё приходится делать иначе.',action:'write',friend:'read',focus:'class'},
{title:'БИБЛИОТЕКА ОТКРЫТА',sub:'Люди ищут информацию в справочниках',place:'library',time:'day',caption:'Библиотекари помогают находить старые бумажные источники.',action:'look',friend:'read',focus:'books'},
{title:'ПЕРВЫЙ МЕСЯЦ',sub:'Календарь отмечает тридцатый день',place:'room',time:'day',caption:'Прошёл месяц. Глобальная сеть всё ещё молчит.',action:'look',friend:'look',focus:'calendar'},
{title:'НОВОСТИ ЧЕРЕЗ МЕСЯЦ',sub:'Специалисты не называют сроков',place:'radio',time:'day',caption:'Международные группы продолжают искать причину сбоя.',action:'talk',friend:'listen',focus:'radio'},
{title:'ГОРОД ПРИВЫКАЕТ',sub:'На стенах появляются объявления',place:'street',time:'day',caption:'Люди создают доски объявлений в каждом районе.',action:'walk',friend:'write',focus:'notice'},
{title:'ДОСТАВКА ВРУЧНУЮ',sub:'Курьер сверяет адрес на бумаге',place:'street',time:'day',caption:'Работа становится медленнее, но город не останавливается.',action:'look',friend:'carry',focus:'city'},
{title:'ТРИ МЕСЯЦА',sub:'Смена сезона показывает ход времени',place:'park',time:'dusk',caption:'Три месяца без сети изменили повседневную жизнь.',action:'look',friend:'talk',focus:'calendar'},
{title:'НОВАЯ ИДЕЯ',sub:'Ты предлагаешь соединить район',place:'park',time:'day',caption:'Если весь мир недоступен, начнём с соседних улиц.',action:'talk',friend:'listen',focus:'friends'},
{title:'СТАРОЕ ОБОРУДОВАНИЕ',sub:'Даня приносит коробку с аппаратурой',place:'room',time:'day',caption:'У Дани нашлись старые радиостанции и схемы.',action:'look',friend:'carry',focus:'repair'},
{title:'ПЕРВЫЕ ТЕСТЫ',sub:'Друзья проверяют оборудование',place:'street',time:'day',caption:'Сначала слышны только помехи и обрывки сигналов.',action:'point',friend:'look',focus:'repair'},
{title:'СИГНАЛ ИЗ СОСЕДНЕГО РАЙОНА',sub:'Из динамика доносится голос',place:'room',time:'day',caption:'Кто-то отвечает. Это ещё не интернет, но уже связь.',action:'surprised',friend:'listen',focus:'radio'},
{title:'МАЛЕНЬКАЯ СЕТЬ',sub:'Команда соединяет несколько общественных точек',place:'street',time:'day',caption:'Школа, библиотека и пункт помощи обмениваются сообщениями.',action:'carry',friend:'write',focus:'repair'},
{title:'СООБЩЕНИЕ СОСЕДЯМ',sub:'Мира передаёт объявление',place:'radio',time:'day',caption:'Информация снова начинает распространяться от человека к человеку.',action:'talk',friend:'listen',focus:'radio'},
{title:'ПОЛГОДА',sub:'На календаре проходит шесть месяцев',place:'room',time:'dusk',caption:'Полгода. Кажется, будто прежний мир остался где-то далеко.',action:'look',friend:'look',focus:'calendar'},
{title:'НОВОСТИ ПОЛУГОДИЯ',sub:'Города создают локальные системы',place:'radio',time:'night',caption:'В некоторых регионах запускают независимые сети для важных служб.',action:'talk',friend:'listen',focus:'radio'},
{title:'УСТАЛОСТЬ',sub:'Лёша спорит с командой',place:'park',time:'dusk',caption:'Неудачи накапливаются. Даже друзья начинают ссориться.',action:'talk',friend:'talk',focus:'friends'},
{title:'ПОЧТИ СДАЛИСЬ',sub:'Ты просишь команду не бросать работу',place:'room',time:'night',caption:'Ты напоминаешь: маленький результат всё равно имеет значение.',action:'point',friend:'look',focus:'notebook'},
{title:'НОВАЯ ВСТРЕЧА',sub:'Даня показывает обновлённую схему',place:'room',time:'day',caption:'Он нашёл способ связать несколько локальных узлов.',action:'look',friend:'point',focus:'repair'},
{title:'ПЕРВЫЙ УСТОЙЧИВЫЙ КАНАЛ',sub:'На экране появляется ответ',place:'room',time:'night',caption:'Соединение держится дольше обычного. Команда замирает.',action:'surprised',friend:'cheer',focus:'screen'},
{title:'ДРУГИЕ ДОБРОВОЛЬЦЫ',sub:'На связи появляются новые города',place:'radio',time:'day',caption:'Оказывается, похожие команды работают в других местах.',action:'listen',friend:'talk',focus:'radio'},
{title:'ОБМЕН ОПЫТОМ',sub:'Даня записывает технические заметки',place:'room',time:'day',caption:'Люди делятся решениями и помогают друг другу.',action:'write',friend:'talk',focus:'notebook'},
{title:'ВОСЕМЬ МЕСЯЦЕВ',sub:'Городской парк меняется вместе с сезоном',place:'park',time:'dusk',caption:'Восемь месяцев без глобальной сети.',action:'look',friend:'talk',focus:'calendar'},
{title:'НОВОСТИ О ПРОГРЕССЕ',sub:'Ведущий сообщает о региональных узлах',place:'radio',time:'night',caption:'Первые районы могут обмениваться ограниченными данными.',action:'talk',friend:'listen',focus:'radio'},
{title:'ГОД БЕЗ ИНТЕРНЕТА',sub:'На календаре двенадцать месяцев',place:'room',time:'day',caption:'Прошёл год. Никто уже не ждёт, что всё вернётся завтра.',action:'look',friend:'look',focus:'calendar'},
{title:'ГОДОВОЙ ВЫПУСК',sub:'Новости подводят итоги',place:'radio',time:'day',caption:'Год спустя мир научился обходиться без многих цифровых привычек.',action:'talk',friend:'listen',focus:'radio'},
{title:'НОВЫЕ ПРАВИЛА',sub:'Соседи сохраняют бумажные списки',place:'hall',time:'day',caption:'Даже при локальной связи люди оставляют запасные способы оповещения.',action:'talk',friend:'write',focus:'neighbors'},
{title:'ПЕРВАЯ БОЛЬШАЯ СЕТЬ',sub:'Несколько районов обмениваются данными',place:'street',time:'day',caption:'Локальные сети постепенно объединяются в более крупную систему.',action:'point',friend:'carry',focus:'repair'},
{title:'СЛОЖНЫЙ ТЕСТ',sub:'Связь обрывается во время проверки',place:'room',time:'night',caption:'Один неверный шаг — и всё приходится начинать заново.',action:'surprised',friend:'look',focus:'screen'},
{title:'СПОР КОМАНДЫ',sub:'Друзья не согласны с планом',place:'room',time:'night',caption:'Каждый устал, но никто не хочет сдаваться первым.',action:'talk',friend:'talk',focus:'notebook'},
{title:'ПЕРЕМИРИЕ',sub:'Мира возвращает всех к общей цели',place:'park',time:'dusk',caption:'Они вспоминают, ради чего начали эту работу.',action:'smile',friend:'listen',focus:'friends'},
{title:'ПЯТНАДЦАТЬ МЕСЯЦЕВ',sub:'На экране появляется новая дата',place:'room',time:'day',caption:'Пятнадцать месяцев. И наконец появляется настоящий прорыв.',action:'look',friend:'cheer',focus:'calendar'},
{title:'СИГНАЛ ИЗДАЛЕКА',sub:'Приходит пакет данных из другого региона',place:'room',time:'night',caption:'Впервые узлы из разных регионов отвечают одновременно.',action:'surprised',friend:'point',focus:'screen'},
{title:'ПОДТВЕРЖДЕНИЕ',sub:'Даня проверяет повторный ответ',place:'room',time:'night',caption:'Он перепроверяет результат, чтобы исключить ошибку.',action:'look',friend:'write',focus:'repair'},
{title:'НОВОСТИ О ПРОРЫВЕ',sub:'В эфире сообщают о соединении регионов',place:'radio',time:'day',caption:'Специалисты осторожно говорят о первых успехах.',action:'talk',friend:'listen',focus:'radio'},
{title:'ПОДГОТОВКА',sub:'Команда собирает оборудование в одной комнате',place:'room',time:'day',caption:'Теперь нужно объединить каналы и провести финальный тест.',action:'carry',friend:'point',focus:'repair'},
{title:'ПОСЛЕДНЯЯ НЕДЕЛЯ',sub:'Друзья почти не отходят от аппаратуры',place:'room',time:'night',caption:'Каждый час приближает решающую проверку.',action:'look',friend:'write',focus:'screen'},
{title:'ВОСЕМНАДЦАТЬ МЕСЯЦЕВ',sub:'Календарь показывает полтора года',place:'room',time:'day',caption:'Ровно полтора года весь мир жил без привычного интернета.',action:'look',friend:'look',focus:'calendar'},
{title:'КОМАНДА ВМЕСТЕ',sub:'Ты, Лёша, Мира и Даня собираетесь у экрана',place:'room',time:'day',caption:'Все понимают: сегодня может получиться.',action:'talk',friend:'listen',focus:'friends'},
{title:'ПОСЛЕДНЯЯ ПРОВЕРКА',sub:'Даня подтверждает готовность каналов',place:'room',time:'day',caption:'Все узлы отвечают. Ошибок пока нет.',action:'point',friend:'look',focus:'repair'},
{title:'НЕУВЕРЕННОСТЬ',sub:'Лёша нервно шутит',place:'room',time:'day',caption:'Даже сейчас никто не решается поверить заранее.',action:'talk',friend:'smile',focus:'friends'},
{title:'МИРА ВКЛЮЧАЕТ ЗАПИСЬ',sub:'Она готовит камеру к моменту',place:'room',time:'day',caption:'Мира хочет сохранить этот день для всех.',action:'look',friend:'point',focus:'screen'},
{title:'РУКА НА КНОПКЕ',sub:'Ты готовишься подтвердить запуск',place:'room',time:'day',caption:'В комнате становится тихо.',action:'look',friend:'listen',focus:'screen'},
{title:'ЗАПУСК',sub:'Ты подтверждаешь соединение',place:'room',time:'day',caption:'На экране появляется первая строка ответа.',action:'point',friend:'surprised',focus:'screen'},
{title:'ЕЩЁ ОДНА СТРОКА',sub:'Данные начинают поступать',place:'room',time:'day',caption:'Потом вторая. Третья. Канал не обрывается.',action:'surprised',friend:'cheer',focus:'screen'},
{title:'ЭТО РАБОТАЕТ',sub:'Друзья понимают, что получилось',place:'room',time:'day',caption:'После восемнадцати месяцев сеть снова оживает.',action:'cheer',friend:'cheer',focus:'friends'},
{title:'ПЕРВЫЙ ЗВОНОК',sub:'Мира набирает близкого человека',place:'room',time:'day',caption:'Первый звонок звучит почти нереально.',action:'talk',friend:'smile',focus:'phone'},
{title:'ЛЁША НЕ ВЕРИТ',sub:'Он обновляет страницу снова и снова',place:'room',time:'day',caption:'Лёша проверяет новости и смеётся от облегчения.',action:'smile',friend:'cheer',focus:'screen'},
{title:'СРОЧНЫЙ ВЫПУСК',sub:'Телеведущий объявляет о восстановлении',place:'radio',time:'day',caption:'Международный обмен данными постепенно возвращается.',action:'talk',friend:'listen',focus:'radio'},
{title:'МИР УЗНАЁТ',sub:'На экранах появляются сообщения из разных стран',place:'square',time:'day',caption:'Миллионы людей получают возможность связаться с близкими.',action:'look',friend:'cheer',focus:'city'},
{title:'ВОКЗАЛЫ ОБНОВЛЯЮТСЯ',sub:'На табло появляются расписания',place:'bus',time:'day',caption:'Транспортные системы постепенно возвращаются к онлайн-режиму.',action:'point',friend:'look',focus:'bus'},
{title:'СЕМЬИ СОЕДИНЯЮТСЯ',sub:'Люди звонят родным',place:'street',time:'day',caption:'После долгой тишины многие впервые слышат знакомые голоса.',action:'smile',friend:'talk',focus:'friends'},
{title:'НОВОСТИ СО ВСЕГО МИРА',sub:'Журналисты рассказывают о восстановлении',place:'radio',time:'day',caption:'Редакции собирают истории о полутора годах изоляции.',action:'talk',friend:'listen',focus:'radio'},
{title:'ЧТО ИЗМЕНИЛОСЬ',sub:'Друзья смотрят на оживший город',place:'street',time:'dusk',caption:'Интернет вернулся, но мир уже успел измениться.',action:'look',friend:'talk',focus:'city'},
{title:'ЛОКАЛЬНЫЕ СЕТИ ОСТАНУТСЯ',sub:'Даня показывает оборудование',place:'room',time:'day',caption:'Люди решили сохранить резервные способы связи.',action:'point',friend:'look',focus:'repair'},
{title:'БУМАЖНЫЕ АРХИВЫ',sub:'Библиотека хранит новые справочники',place:'library',time:'day',caption:'За это время бумажные источники снова обрели ценность.',action:'look',friend:'read',focus:'books'},
{title:'НОВЫЕ ПРАВИЛА ГОРОДА',sub:'На доске остаются объявления',place:'street',time:'day',caption:'Город не спешит отказываться от того, что помогло выстоять.',action:'write',friend:'look',focus:'notice'},
{title:'ВСТРЕЧА У ОСТАНОВКИ',sub:'Друзья приходят в привычное место',place:'park',time:'dusk',caption:'Они снова встречаются в шесть, как обещали.',action:'walk',friend:'wave',focus:'friends'},
{title:'СТАРАЯ ШУТКА',sub:'Лёша вспоминает их договорённость',place:'park',time:'dusk',caption:'Теперь никто не может сослаться на сообщение, которое не дошло.',action:'talk',friend:'smile',focus:'friends'},
{title:'МИРА ПРЕДЛАГАЕТ',sub:'Она предлагает оставить традицию',place:'park',time:'dusk',caption:'Иногда полезно просто увидеться, а не написать.',action:'talk',friend:'listen',focus:'bench'},
{title:'ТЫ СОГЛАШАЕШЬСЯ',sub:'Ты убираешь телефон в карман',place:'park',time:'dusk',caption:'Связь вернулась. Но друзья никуда не исчезали.',action:'smile',friend:'smile',focus:'friends'},
{title:'ГОРОД СНОВА ОНЛАЙН',sub:'На улицах работают цифровые табло',place:'square',time:'night',caption:'Сервисы запускаются постепенно, и жизнь ускоряется.',action:'look',friend:'wave',focus:'city'},
{title:'ПОСЛЕДНИЙ РЕПОРТАЖ',sub:'Диктор подводит итоги полутора лет',place:'radio',time:'night',caption:'Восемнадцать месяцев изменили привычки целого поколения.',action:'talk',friend:'listen',focus:'radio'},
{title:'ГЛАВНЫЙ ВОПРОС',sub:'Лёша спрашивает, верил ли ты в успех',place:'park',time:'night',caption:'Он всё ещё не понимает, как вы не бросили попытки.',action:'talk',friend:'look',focus:'friends'},
{title:'ОТВЕТ',sub:'Ты объясняешь, что команда не сдавалась',place:'park',time:'night',caption:'В одиночку ничего бы не получилось.',action:'talk',friend:'listen',focus:'friends'},
{title:'НЕ ОДИН ГЕРОЙ',sub:'Мира и Даня присоединяются к разговору',place:'park',time:'night',caption:'Это была работа множества людей в разных городах.',action:'smile',friend:'smile',focus:'friends'},
{title:'СВЯЗЬ — ЭТО ЛЮДИ',sub:'Четверо друзей стоят рядом',place:'square',time:'night',caption:'Технологии соединяют устройства, а люди помогают друг другу.',action:'wave',friend:'wave',focus:'final'},
{title:'ПОСЛЕДНИЙ КАДР',sub:'Камера отдаляется от освещённого города',place:'square',time:'night',caption:'Интернет вернулся спустя полтора года. И мир стал немного мудрее.',action:'wave',friend:'wave',focus:'final'}
];

const palette:Record<string,{sky:string;far:string;near:string;ground:string;accent:string}>={
day:{sky:'#9dd8ed',far:'#8ba6b8',near:'#536a7d',ground:'#c4b9a6',accent:'#ffd36b'},
dusk:{sky:'#e39b82',far:'#6d718a',near:'#39465c',ground:'#514d58',accent:'#ffcf86'},
night:{sky:'#101b35',far:'#35415b',near:'#202b42',ground:'#171e2d',accent:'#f5d88e'}
};
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const smooth=(v:number)=>{const t=clamp(v,0,1);return t*t*(3-2*t)};
const Limb:React.FC<{d:string;width?:number;color?:string}> = ({d,width=13,color='#171923'})=><path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"/>;
const Character:React.FC<{x:number;y:number;name:string;color:string;action:Action;seed:number;scale?:number}> = ({x,y,name,color,action,seed,scale=1})=>{
 const f=useCurrentFrame(); const t=f+seed*19; const moving=action==='walk'||action==='run'||action==='carry';
 const speed=action==='run'?.24:.13; const gait=moving?Math.sin(t*speed):Math.sin(t*.045)*.035;
 const bounce=moving?Math.abs(Math.sin(t*speed))* (action==='run'?13:7):Math.sin(t*.09)*2.2;
 const lean=action==='run'?10:action==='walk'?4:action==='look'?-4:0;
 const blink=(Math.sin(t*.031+seed)*.5+.5)>.985;
 const phone=action==='phone',point=action==='point',wave=action==='wave'||action==='cheer',talk=action==='talk',write=action==='write',read=action==='read';
 const armL=wave?[-42,-205]:phone?[-42,-112]:point?[-90,-150]:write?[-28,-95]:read?[-55,-105]:talk?[-74,-150]:[-46,-100];
 const armR=wave?[58,-220]:phone?[45,-150]:point?[88,-155]:write?[34,-100]:read?[55,-105]:talk?[72,-176]:[46,-100];
 const legA=moving?Math.sin(t*speed)*27:Math.sin(t*.07)*2;
 const legB=moving?-Math.sin(t*speed)*25:Math.sin(t*.07+1)*2;
 const torsoY=-137+bounce;
 const headY=-202+bounce;
 return <g transform={'translate('+x+' '+y+') scale('+scale+')'}>
  <ellipse cx="0" cy="4" rx="48" ry="11" fill="#101827" opacity=".2"/>
  <g transform={'translate(0 '+bounce+') rotate('+(-lean+gait*3)+' 0 -125)'}>
   <path d="M-22 -62 Q-35 -34 -31 -4 L-22 0 L-16 -12 L0 -4 L17 -12 L24 0 L34 -5 Q35 -40 22 -64Z" fill="#252b38" stroke="#111722" strokeWidth="5"/>
   <path d="M-25 -131 Q-42 -120 -38 -69 Q0 -51 38 -69 Q42 -119 25 -131Z" fill={color} stroke="#171923" strokeWidth="6"/>
   <path d="M-18 -121 Q0 -108 18 -121" stroke="#ffffff" strokeOpacity=".25" strokeWidth="4" fill="none"/>
   <path d="M-12 -62 L-12 -20 M12 -62 L12 -20" stroke="#111722" strokeWidth="5" opacity=".55"/>
   <path d={'M-29 -119 Q-50 -113 '+armL[0]+' '+armL[1]} stroke="#171923" strokeWidth="17" fill="none" strokeLinecap="round"/>
   <path d={'M'+armL[0]+' '+armL[1]+' Q'+(armL[0]-4)+' '+(armL[1]+22)+' '+(armL[0]+(phone?5:-7))+' '+(armL[1]+42)} stroke="#171923" strokeWidth="15" fill="none" strokeLinecap="round"/>
   <circle cx={armL[0]+(phone?5:-7)} cy={armL[1]+42} r="9" fill="#e9b99d" stroke="#171923" strokeWidth="3"/>
   <path d={'M29 -119 Q50 -113 '+armR[0]+' '+armR[1]} stroke="#171923" strokeWidth="17" fill="none" strokeLinecap="round"/>
   <path d={'M'+armR[0]+' '+armR[1]+' Q'+(armR[0]+8)+' '+(armR[1]+23)+' '+(armR[0]+(wave?10:0))+' '+(armR[1]+43)} stroke="#171923" strokeWidth="15" fill="none" strokeLinecap="round"/>
   <circle cx={armR[0]+(wave?10:0)} cy={armR[1]+43} r="9" fill="#e9b99d" stroke="#171923" strokeWidth="3"/>
   <path d={'M-15 -6 Q-23 15 '+(-19+legA)+' 39 L'+(-22+legA)+' 70'} stroke="#171923" strokeWidth="19" fill="none" strokeLinecap="round"/>
   <path d={'M15 -6 Q23 15 '+(19+legB)+' 39 L'+(22+legB)+' 70'} stroke="#171923" strokeWidth="19" fill="none" strokeLinecap="round"/>
   <path d={'M'+(-22+legA)+' 70 q-12 4 -10 15 q16 7 35 0 l-3 -9'} fill="#f4f1e9" stroke="#171923" strokeWidth="5" strokeLinejoin="round"/>
   <path d={'M'+(22+legB)+' 70 q-12 4 -10 15 q16 7 35 0 l-3 -9'} fill="#f4f1e9" stroke="#171923" strokeWidth="5" strokeLinejoin="round"/>
   <path d="M-38 -210 Q-48 -251 -8 -251 Q35 -257 39 -215 L31 -197 Q0 -221 -31 -197Z" fill="#171923"/>
   <ellipse cx="0" cy="-202" rx="39" ry="43" fill="#f1c9ac" stroke="#171923" strokeWidth="6"/>
   <path d="M-37 -210 Q-32 -246 0 -247 Q31 -244 38 -211 Q16 -226 -2 -225 Q-21 -221 -37 -210" fill="#171923"/>
   <path d="M-23 -216 Q-9 -225 0 -216 M8 -216 Q20 -224 28 -215" stroke="#171923" strokeWidth="5" fill="none" strokeLinecap="round"/>
   {blink?<path d="M-20 -202 h11 M10 -202 h11" stroke="#171923" strokeWidth="4" strokeLinecap="round"/>:<><ellipse cx="-15" cy="-202" rx="4.5" ry="7" fill="#171923"/><ellipse cx="15" cy="-202" rx="4.5" ry="7" fill="#171923"/></>}
   <path d={talk?'M-9 -180 Q0 -169 10 -180':action==='surprised'?'M-5 -181 Q0 -168 5 -181':'M-9 -181 Q0 -174 9 -181'} stroke="#171923" strokeWidth="4" fill="none" strokeLinecap="round"/>
   {phone&&<g transform="translate(2 -112) rotate(-8)"><rect x="-12" y="-22" width="24" height="43" rx="5" fill="#182538" stroke="#eaf6ff" strokeWidth="3"/><rect x="-8" y="-17" width="16" height="30" rx="2" fill="#65d7e7"/></g>}
  </g>
  <text x="0" y="42" fontSize="17" textAnchor="middle" fontWeight="900" fill="#fff" stroke="#151923" strokeWidth="4" paintOrder="stroke" letterSpacing="1">{name}</text>
 </g>;
};

const Tree:React.FC<{x:number;y:number;scale?:number}> = ({x,y,scale=1})=><g transform={'translate('+x+' '+y+') scale('+scale+')'}><path d="M0 0 V-105" stroke="#5c4638" strokeWidth="20"/><circle cx="-22" cy="-125" r="48" fill="#527b69"/><circle cx="25" cy="-142" r="53" fill="#638d75"/><circle cx="0" cy="-180" r="42" fill="#719b7c"/><circle cx="-36" cy="-133" r="8" fill="#9dbd8e" opacity=".55"/></g>;
const Building:React.FC<{x:number;y:number;w:number;h:number;idx:number;night:boolean}> = ({x,y,w,h,idx,night})=><g><rect x={x} y={y-h} width={w} height={h} fill={['#667e91','#7b8991','#536d80','#8a817d'][idx%4]} stroke="#33465a" strokeWidth="5"/><path d={'M'+(x-8)+' '+(y-h)+' l'+(w/2)+' -32 l'+(w/2+8)+' 32'} fill="#4c5a6c"/>{Array.from({length:Math.floor(h/85)*2},(_,j)=><g key={j}><rect x={x+18+(j%2)*(w/2)} y={y-h+28+Math.floor(j/2)*72} width={Math.max(17,w/2-32)} height="34" rx="3" fill={night?'#ffd98b':'#bfe4e8'}/><path d={'M'+(x+18+(j%2)*(w/2))+' '+(y-h+45+Math.floor(j/2)*72)+' h'+Math.max(17,w/2-32)} stroke="#708da0" strokeWidth="3"/></g>)}</g>;
const Backdrop:React.FC<{scene:Scene;idx:number}> = ({scene,idx})=>{
 const f=useCurrentFrame(),p=palette[scene.time],night=scene.time==='night';
 const cloudX=(f*.45+idx*83)%2200-180;
 return <g>
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.sky}/><stop offset="1" stopColor={scene.time==='night'?'#303c58':'#e7d9c2'}/></linearGradient></defs>
  <rect width="1920" height="1080" fill="url(#sky)"/>
  {night?Array.from({length:70},(_,i)=><circle key={i} cx={(i*197)%1920} cy={(i*83)%430} r={i%4===0?3:1.6} fill="#fff3d3" opacity={.45+Math.sin(f*.03+i)*.2}/>):<g opacity=".55" transform={'translate('+cloudX+' '+(110+idx%4*20)+')'}><ellipse cx="0" cy="0" rx="75" ry="25" fill="#fff"/><ellipse cx="45" cy="-13" rx="45" ry="28" fill="#fff"/><ellipse cx="-38" cy="-9" rx="38" ry="22" fill="#fff"/></g>}
  <circle cx={scene.time==='night'?1560:1510} cy="170" r={scene.time==='night'?38:62} fill={scene.time==='night'?'#f8e9c8':'#ffe4a5'} opacity=".95"/>
  {Array.from({length:10},(_,i)=><Building key={i} x={i*205-25} y={770+(i%3)*18} w={170} h={245+(i*47)%240} idx={i} night={night}/>)}
  <path d="M0 770 Q450 735 950 770 T1920 755 V1080 H0Z" fill={p.near}/>
  {scene.place!=='room'&&scene.place!=='hall'&&<g opacity=".9"><rect y="865" width="1920" height="215" fill={p.ground}/><path d="M0 865 H1920" stroke="#e6d6bf" strokeWidth="9" opacity=".6"/><path d="M0 1000 H1920" stroke="#fff" strokeWidth="5" strokeDasharray="55 45" opacity=".35"/></g>}
  {scene.place==='room'&&<g><rect width="1920" height="1080" fill="#d9d6cf"/><rect x="0" y="760" width="1920" height="320" fill="#8a7161"/><rect x="150" y="110" width="560" height="440" fill="#79b7d0" stroke="#f5f0e6" strokeWidth="28"/><path d="M430 110 V550 M150 330 H710" stroke="#f5f0e6" strokeWidth="16"/><rect x="1080" y="570" width="560" height="34" rx="7" fill="#604735"/><rect x="1120" y="604" width="28" height="170" fill="#604735"/><rect x="1570" y="604" width="28" height="170" fill="#604735"/><rect x="1230" y="340" width="230" height="220" rx="16" fill="#253348" stroke="#151d2b" strokeWidth="12"/><rect x="1248" y="360" width="194" height="170" fill={idx<4?'#68d6e4':'#202b3b'}/><path d="M1280 400 H1408 M1280 430 H1375 M1280 460 H1390" stroke="#c6f7ff" strokeWidth="9" opacity=".7"/></g>}
  {scene.place==='hall'&&<g><rect width="1920" height="1080" fill="#b6b0a7"/><path d="M0 0 L430 0 L720 1080 H0Z" fill="#8c8278"/><path d="M1920 0 H1490 L1200 1080 H1920Z" fill="#8c8278"/>{Array.from({length:6},(_,i)=><g key={i}><rect x={140+i*275} y={180+i%2*80} width="170" height="300" fill="#5b5c65" stroke="#d9d2c5" strokeWidth="16"/><circle cx={280+i*275} cy={330+i%2*80} r="7" fill="#edce83"/></g>)}</g>}
  {scene.place==='school'&&<g><rect x="270" y="440" width="1380" height="425" fill="#d8d0b9" stroke="#6d7884" strokeWidth="9"/><path d="M230 445 L960 240 L1690 445Z" fill="#53677c"/><rect x="820" y="570" width="280" height="295" fill="#7b6758"/><rect x="380" y="540" width="180" height="140" fill="#87c4d8"/><rect x="1360" y="540" width="180" height="140" fill="#87c4d8"/><text x="960" y="415" textAnchor="middle" fontSize="42" fill="#33445a" fontWeight="900">ШКОЛА № 12</text></g>}
  {scene.place==='court'&&<g><rect x="1140" y="360" width="18" height="420" fill="#e8e2d4"/><rect x="1080" y="360" width="145" height="16" fill="#e8e2d4"/><rect x="1075" y="370" width="155" height="100" fill="none" stroke="#e8e2d4" strokeWidth="10"/><ellipse cx="1150" cy="485" rx="45" ry="12" fill="none" stroke="#e88c4d" strokeWidth="9"/><path d="M1140 495 L1130 525 M1160 495 L1170 525" stroke="#e88c4d" strokeWidth="7"/></g>}
  {scene.place==='park'&&<g><Tree x={250} y={875} scale={1.15}/><Tree x={1640} y={870} scale={1.3}/><rect x="760" y="815" width="420" height="18" rx="7" fill="#60483a"/><path d="M800 833 V900 M1140 833 V900" stroke="#60483a" strokeWidth="15"/><path d="M800 820 L820 780 H1120 L1140 820" fill="#8d6650" stroke="#60483a" strokeWidth="8"/></g>}
  {(scene.place==='street'||scene.place==='crossroad'||scene.place==='bus'||scene.place==='square')&&<g><Tree x={180} y={870}/><Tree x={1740} y={870}/><path d="M330 865 V560 M300 560 H360" stroke="#2b3948" strokeWidth="18"/><path d="M360 560 L440 560" stroke="#2b3948" strokeWidth="12"/><rect x="430" y="525" width="190" height="80" rx="10" fill="#e8d8ad" stroke="#3d4b5d" strokeWidth="8"/><text x="525" y="575" fontSize="26" textAnchor="middle" fill="#34465a" fontWeight="900">УЛИЦА</text></g>}
  {scene.place==='shop'&&<g><rect x="1120" y="430" width="600" height="440" fill="#d8c7a6" stroke="#584b43" strokeWidth="10"/><rect x="1160" y="490" width="520" height="135" fill="#6aa3b2"/><text x="1420" y="570" textAnchor="middle" fontSize="45" fontWeight="900" fill="white">МАГАЗИН</text><path d="M1140 650 H1700" stroke="#584b43" strokeWidth="12"/><rect x="1250" y="660" width="300" height="110" fill="#8b6047"/></g>}
  {scene.place==='bus'&&<g><rect x="1160" y="520" width="510" height="260" rx="28" fill="#4d91a6" stroke="#25364b" strokeWidth="12"/><rect x="1200" y="555" width="130" height="95" fill="#c5e8e8"/><rect x="1350" y="555" width="130" height="95" fill="#c5e8e8"/><rect x="1500" y="555" width="130" height="95" fill="#c5e8e8"/><circle cx="1280" cy="785" r="42" fill="#252b36"/><circle cx="1540" cy="785" r="42" fill="#252b36"/></g>}
  {scene.place==='radio'&&<g><rect x="1150" y="380" width="560" height="420" rx="18" fill="#26364a" stroke="#141d2b" strokeWidth="10"/><rect x="1200" y="430" width="460" height="230" fill="#c5d1d1"/><circle cx="1430" cy="540" r="85" fill="#27364a"/><circle cx="1430" cy="540" r="65" fill="#647d8b"/><path d="M1230 700 H1610" stroke="#f3d58b" strokeWidth="12"/></g>}
  {scene.place==='library'&&<g>{Array.from({length:5},(_,i)=><g key={i}><rect x={1080+i*125} y="400" width="110" height="420" fill="#6a4d3b"/>{Array.from({length:5},(_,j)=><rect key={j} x={1090+i*125} y={420+j*74} width="18" height="55" fill={['#bd765d','#6f91a7','#d4b46c','#8b9b79'][((i+j)%4)]}/>)}</g>)}</g>}
  {scene.place==='class'&&<g><rect x="1050" y="300" width="650" height="360" fill="#3e554d" stroke="#a38c6a" strokeWidth="16"/><path d="M1110 380 H1620 M1110 450 H1530 M1110 520 H1590" stroke="#e8e5d4" strokeWidth="9" opacity=".7"/>{Array.from({length:4},(_,i)=><g key={i}><rect x={230+i*210} y="740" width="175" height="75" fill="#8d6a4e"/><path d={'M'+(250+i*210)+' 815 V880 M'+(390+i*210)+' 815 V880'} stroke="#5a4436" strokeWidth="12"/></g>)}</g>}
  {scene.place==='square'&&<g><circle cx="960" cy="650" r="190" fill="#303f54" opacity=".55"/><path d="M960 300 V770 M760 520 H1160" stroke="#e1d0ad" strokeWidth="14"/><circle cx="960" cy="480" r="70" fill="#e4d3ad"/></g>}
  <g opacity=".35"><path d="M0 910 Q500 870 1000 910 T1920 900" stroke="#fff" strokeWidth="4" fill="none"/><path d="M0 1040 H1920" stroke="#111" strokeWidth="8" opacity=".3"/></g>
 </g>;
};
const Props:React.FC<{scene:Scene;idx:number}> = ({scene,idx})=>{
 const f=useCurrentFrame(),pulse=.7+.3*Math.sin(f*.18);
 return <g>
  {scene.focus==='phone'&&<g transform="translate(1390 560) rotate(-10)"><rect x="-55" y="-95" width="110" height="190" rx="20" fill="#172233" stroke="#f2f5f7" strokeWidth="8"/><rect x="-42" y="-75" width="84" height="145" rx="8" fill="#74d9e5"/><circle cx="0" cy="82" r="6" fill="#fff"/><circle cx="28" cy="-48" r="8" fill="#f45b70" opacity={pulse}/></g>}
  {scene.focus==='router'&&<g transform="translate(1450 750)"><rect x="-120" y="-65" width="240" height="95" rx="18" fill="#25364b" stroke="#131b29" strokeWidth="8"/><path d="M-70 -65 L-100 -175 M70 -65 L100 -175" stroke="#26364b" strokeWidth="12"/>{[0,1,2,3].map(i=><circle key={i} cx={-65+i*42} cy="-15" r="9" fill={i===3?'#f15b66':'#6fe4be'} opacity={pulse}/>)}</g>}
  {scene.focus==='map'&&<g transform="translate(1390 650)"><path d="M-150 -95 L-50 -125 L60 -85 L155 -120 V100 L60 130 L-50 90 L-150 120Z" fill="#f2e6c9" stroke="#88775f" strokeWidth="7"/><path d="M-50 -125 V90 M60 -85 V130 M-120 45 L-30 -15 L50 30 L120 -45" fill="none" stroke="#6d9eaa" strokeWidth="9"/><circle cx="50" cy="30" r="16" fill="#e35d60"/></g>}
  {scene.focus==='notice'&&<g transform="translate(1420 610)"><rect x="-160" y="-140" width="320" height="270" rx="10" fill="#6a4e3e" stroke="#342c2b" strokeWidth="10"/><rect x="-140" y="-120" width="280" height="230" fill="#f1e4c7"/>{['СЕГОДНЯ В 18:00','ВСТРЕЧА У ШКОЛЫ','ПРИХОДИТЕ ВСЕ'].map((v,i)=><text key={i} x="0" y={-60+i*70} fontSize="24" textAnchor="middle" fill="#34465a" fontWeight="900">{v}</text>)}</g>}
  {scene.focus==='notebook'&&<g transform="translate(1390 660) rotate(-7)"><rect x="-130" y="-100" width="260" height="200" rx="8" fill="#f2e5c9" stroke="#9c866a" strokeWidth="7"/>{Array.from({length:5},(_,i)=><path key={i} d={'M-95 '+(-55+i*36)+' H95'} stroke="#8ca5ae" strokeWidth="4"/>)}</g>}
  {scene.focus==='radio'&&<g transform="translate(1420 390)"><path d="M-120 -25 L100 -125" stroke="#28394a" strokeWidth="10"/><circle cx="-100" cy="-25" r="12" fill="#f1d58a"/><path d="M-80 -45 Q0 -130 80 -45 M-55 -25 Q0 -85 55 -25" fill="none" stroke="#e8d9b8" strokeWidth="7" opacity={pulse}/></g>}
  {scene.focus==='books'&&<g transform="translate(1480 740)"><rect x="-150" y="-90" width="110" height="150" fill="#b76e58" stroke="#4e3d38" strokeWidth="6"/><rect x="-35" y="-110" width="110" height="170" fill="#6f8fa4" stroke="#4e3d38" strokeWidth="6"/><rect x="80" y="-80" width="100" height="140" fill="#d2b36f" stroke="#4e3d38" strokeWidth="6"/></g>}
  {scene.focus==='bench'&&<g transform="translate(960 850)"><rect x="-190" y="-30" width="380" height="24" rx="8" fill="#8d6148"/><path d="M-150 -5 V70 M150 -5 V70" stroke="#4f3d35" strokeWidth="15"/></g>}
  {scene.focus==='repair'&&<g transform="translate(1450 700)"><rect x="-115" y="-80" width="230" height="120" rx="10" fill="#e5b35c" stroke="#5d4a36" strokeWidth="8"/><path d="M-60 -80 V-160 M60 -80 V-160" stroke="#5d4a36" strokeWidth="10"/><circle cx="-60" cy="-165" r="12" fill="#f3e4bb"/><circle cx="60" cy="-165" r="12" fill="#f3e4bb"/></g>}
  {scene.focus==='traffic'&&<g transform="translate(1450 810)"><rect x="-160" y="-55" width="320" height="85" rx="22" fill="#d46d57" stroke="#28394b" strokeWidth="8"/><rect x="-90" y="-95" width="160" height="60" rx="14" fill="#8ac7d7"/><circle cx="-95" cy="30" r="27" fill="#252a32"/><circle cx="100" cy="30" r="27" fill="#252a32"/></g>}
  {scene.focus==='final'&&<g transform="translate(960 300)"><text textAnchor="middle" fontSize="58" fontWeight="900" fill="#fff4db" stroke="#25364b" strokeWidth="5" paintOrder="stroke">НАСТОЯЩАЯ СВЯЗЬ — ЭТО МЫ</text><path d="M-270 45 H270" stroke="#f4d58c" strokeWidth="7" strokeDasharray="14 14"/></g>}
  {scene.focus==='city'&&<g opacity=".8"><path d="M320 520 Q520 430 720 520 T1120 520" fill="none" stroke="#e9faff" strokeWidth="6" strokeDasharray="12 18"/><circle cx="720" cy="520" r="17" fill="#f4d68d"/></g>}
  {scene.focus==='friends'&&<g><path d="M730 690 Q960 610 1190 690" stroke="#ffe4a6" strokeWidth="5" fill="none" strokeDasharray="8 12"/></g>}
 </g>;
};
const Dust:React.FC<{idx:number}> = ({idx})=>{const f=useCurrentFrame();return <g opacity=".28">{Array.from({length:24},(_,i)=><circle key={i} cx={(i*179+f*(.35+i%3*.16)+idx*31)%1920} cy={520+(i*67)%440+Math.sin(f*.025+i)*12} r={i%5===0?4:2} fill="#fff6df"/>)}</g>};
export const Film:React.FC=()=>{
 const f=useCurrentFrame();
 const framesPerScene=14400/scenes.length;
 const idx=Math.min(scenes.length-1,Math.floor(f/framesPerScene));
 const local=f-idx*framesPerScene,s=scenes[idx];
 const enter=smooth(local/18),exit=1-smooth((local-(framesPerScene-14))/14);
 const cameraX=Math.sin((local/framesPerScene)*Math.PI*2+idx)*10, cameraY=Math.sin((local/framesPerScene)*Math.PI+idx*.7)*5;
 const positions=idx<4?[{x:650+Math.sin(f*.04)*15,name:'ТЫ',color:'#4f8ec7',action:s.action as Action},{x:1190,name:'ЛЁША',color:'#d27d50',action:s.friend as Action}]:idx<16?[{x:620+Math.sin(f*.03)*18,name:'ТЫ',color:'#4f8ec7',action:s.action as Action},{x:1260,name:'ГОРОЖАНИН',color:'#8d9c72',action:s.friend as Action}]:[{x:390+Math.sin(f*.03)*12,name:'ТЫ',color:'#4f8ec7',action:s.action as Action},{x:790+Math.sin(f*.025+1)*10,name:'ЛЁША',color:'#d27d50',action:s.friend as Action},{x:1190+Math.sin(f*.028+2)*12,name:'МИРА',color:'#986cba',action:(s.third||'idle') as Action},...(idx>=30?[{x:1580+Math.sin(f*.022+3)*9,name:'ДАНЯ',color:'#4f9c91',action:'listen' as Action}]:[])];
 return <AbsoluteFill style={{background:'#111827',fontFamily:'Arial, sans-serif'}}>
  <svg viewBox="0 0 1920 1080" width="100%" height="100%">
   <g transform={'translate('+cameraX+' '+cameraY+') scale(1.012)'}>
    <Backdrop scene={s} idx={idx}/><Props scene={s} idx={idx}/>
    {positions.map((p,i)=><Character key={p.name} x={p.x+(i===0?interpolate(local,[0,framesPerScene],[40,-10]):i===1?interpolate(local,[0,framesPerScene],[-25,15]):0)} y={880} name={p.name} color={p.color} action={p.action} seed={i+idx*3} scale={i===2?.94:1}/>)}
    <Dust idx={idx}/>
   </g>
   <rect width="1920" height="1080" fill="#07111e" opacity={1-enter}/>
   <rect width="1920" height="1080" fill="#07111e" opacity={1-exit}/>
  </svg>
  <div style={{position:'absolute',top:46,left:76,right:76,display:'flex',justifyContent:'space-between',alignItems:'flex-start',color:'white',textShadow:'0 3px 14px #142033'}}>
   <div><div style={{fontSize:25,fontWeight:900,letterSpacing:5,color:'#f3d58b'}}>{s.title}</div><div style={{fontSize:22,marginTop:10,fontWeight:600}}>{s.sub}</div></div>
   <div style={{fontSize:20,fontWeight:800,letterSpacing:3,opacity:.8}}>БЕЗ ИНТЕРНЕТА · {String(idx+1).padStart(2,'0')}/{scenes.length}</div>
  </div>
  <div style={{position:'absolute',left:100,right:100,bottom:68,display:'flex',justifyContent:'center'}}>
   <div style={{maxWidth:1460,padding:'22px 38px',borderRadius:18,background:'rgba(8,14,25,.88)',border:'1px solid rgba(255,255,255,.24)',boxShadow:'0 14px 40px rgba(0,0,0,.28)',color:'#fff',fontSize:30,fontWeight:700,textAlign:'center',lineHeight:1.25,opacity:interpolate(local,[0,10,132,149],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{s.caption}</div>
  </div>
  <div style={{position:'absolute',bottom:22,left:80,right:80,height:5,background:'rgba(255,255,255,.2)',borderRadius:8}}><div style={{height:5,width:((idx+local/framesPerScene)/scenes.length*100)+'%',background:'#f3d58b',borderRadius:8}}/></div>
  <Audio src={staticFile('audio/narration.wav')} volume={0.98}/>
 </AbsoluteFill>;
};
