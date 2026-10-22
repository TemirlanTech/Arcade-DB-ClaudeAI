const CFG={author:'CS & AI Engineering',game:'Random Question of Topic: Intro to Databases — Arcade'}; // <- put your name here
let nick='',saved='',mute=false,pen=0;
try{saved=localStorage.getItem('nick')||''}catch(e){}
const $=id=>document.getElementById(id),T=15,N=10;
let topic='Introduction to Databases',bank=[],pool=[],sc=0,st=0,rd=0,ok=0,bad=0,cur,tl=T,tm,locked=true,busy=false,state='idle',ac;
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const total=()=>Math.min(N,bank.length);

function parse(t){
  const L=t.replace(/`/g,'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean),seen=new Set(),o=[];
  for(let i=0;i+4<L.length;){const h=/^hint:/i.test(L[i+5]||''),k=L[i].toLowerCase();if(!seen.has(k)){seen.add(k);o.push({q:L[i],a:L[i+1],w:L.slice(i+2,i+5),h:h?L[i+5].replace(/^hint:\s*/i,''):''})}i+=h?6:5}
  return o;
}
function beep(f,d,type='square',v=.05){
  if(mute)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();
  o.type=type;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(ac.destination);o.start();
  g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.stop(ac.currentTime+d)}catch(e){}
}
function hud(){$('score').textContent=sc;$('streak').textContent=st;$('round').textContent=rd+'/'+total()}
function setBar(){$('bar').style.width=tl/T*100+'%';$('barwrap').classList.toggle('low',tl<=5)}
function reset(){pool=shuf(bank.slice());sc=st=rd=ok=bad=0;hud()}
function idle(){
  state='idle';tl=T;setBar();
  $('reg').hidden=true;$('chg').hidden=false;$('reel').hidden=false;$('reel').textContent='READY?';
  $('qbox').hidden=$('res').hidden=$('fin').hidden=true;
  $('main').hidden=false;$('main').disabled=false;$('main').textContent='SPIN!';
  $('cnt').textContent=topic+' · '+bank.length+' questions';
}

function spin(){
  if(busy)return;busy=true;$('chg').hidden=true;
  if(state==='final'){reset()}
  $('qbox').hidden=$('res').hidden=$('fin').hidden=true;
  $('reel').hidden=false;$('reel').classList.add('spin');
  $('main').disabled=true;$('main').textContent='SPINNING...';
  cur=pool.pop();let i=0,d=45;
  const cut=s=>s.length>60?s.slice(0,59)+'…':s;
  (function tick(){
    i++;
    if(i<24){$('reel').textContent=cut(bank[Math.random()*bank.length|0].q);beep(250+Math.random()*500,.06);d*=1.1;setTimeout(tick,d)}
    else{$('reel').classList.remove('spin');$('reel').textContent='🎯 '+cut(cur.q);beep(880,.25,'triangle',.08);setTimeout(show,800)}
  })();
}

function show(){
  busy=false;rd++;hud();locked=false;
  $('reel').hidden=true;$('qbox').hidden=false;$('main').hidden=true;
  $('q').textContent=cur.q;pen=0;$('hint').disabled=!cur.h;$('half').disabled=false;$('hinttxt').hidden=true;$('hinttxt').textContent=cur.h||'';
  const box=$('opts');box.innerHTML='';
  cur.o=shuf([{t:cur.a,c:1},...cur.w.map(t=>({t}))]);
  cur.o.forEach((x,i)=>{
    const b=document.createElement('button'),s=document.createElement('span');
    b.className='opt';b.innerHTML='<i>'+'ABCD'[i]+'</i>';s.textContent=x.t;b.append(s);
    b.onclick=()=>answer(b,x);x.b=b;box.append(b);
  });
  tl=T;setBar();
  tm=setInterval(()=>{tl=Math.max(0,tl-.1);setBar();if(tl<=0)answer(null,null)},100);
}

function answer(b,x){
  if(locked)return;locked=true;clearInterval(tm);
  $('hint').disabled=$('half').disabled=true;
  cur.o.forEach(y=>{y.b.disabled=true;y.b.style.visibility='';if(y.c)y.b.classList.add('ok')});
  const right=!!(x&&x.c);let line='';
  if(right){
    ok++;st++;
    const sp=Math.round(50*tl/T),sb=Math.min(st-1,5)*20,pts=Math.max(10,100+sp+sb-pen);sc+=pts;
    line=(st>=3?'🔥 streak x'+st+' · ':'')+'+'+pts+' pts (speed +'+sp+(sb?', streak +'+sb:'')+(pen?', hints −'+pen:'')+') · ';
    beep(660,.12);setTimeout(()=>beep(990,.25),120);burst(40);
  }else{
    bad++;st=0;if(b)b.classList.add('no');beep(140,.4,'sawtooth');$('card').classList.add('shake');setTimeout(()=>$('card').classList.remove('shake'),400);
  }
  $('banner').className='banner '+(right?'ok':'no');
  $('banner').textContent=right?'✅ CORRECT!':(x?'❌ WRONG!':"⏱ TIME'S UP!");
  $('info').textContent=line+'Answer: '+cur.a;
  $('res').hidden=false;hud();
  const last=rd>=total();state=last?'end':'result';
  $('main').hidden=false;$('main').disabled=false;
  $('main').textContent=last?'SEE RESULTS':'NEXT RANDOM QUESTION';
}

function final(){
  state='final';
  const p=Math.round(100*ok/Math.max(1,ok+bad)),
  R=p>=90?['LEGEND!','Database Master','Flawless run, '+nick+'! You own this topic.']:p>=70?['GREAT JOB!','Query Hero','Well played, '+nick+'! You really know your databases.']:p>=50?['NICE TRY!','Table Explorer','Good effort, '+nick+'! One more round and you will be a hero.']:['KEEP GOING!','Rookie','Every pro starts here, '+nick+'. Play again and beat your score!'];
  $('qbox').hidden=$('res').hidden=true;$('fin').hidden=false;$('chg').hidden=false;
  $('ftitle').textContent='🏆 '+R[0];$('fmsg').textContent=R[2];
  $('f1').textContent=ok;$('f2').textContent=bad;$('f3').textContent=sc;$('f4').textContent=p+'%';
  $('main').textContent='PLAY AGAIN';
  cert(R[1],p);
  if(p>=50){burst(160);setTimeout(()=>burst(120),400)}
  beep(523,.15);setTimeout(()=>beep(784,.3),150);
}

function cert(rank,p){
  const c=document.createElement('canvas');c.width=1200;c.height=800;const g=c.getContext('2d');
  const T2=(t,y,sz,col,f)=>{g.fillStyle=col;g.font=sz+'px '+(f||'Nunito,system-ui,sans-serif');g.fillText(t,600,y)};
  const draw=()=>{
    g.fillStyle='#fff6e8';g.fillRect(0,0,1200,800);
    g.strokeStyle='#ff7a00';g.lineWidth=14;g.strokeRect(30,30,1140,740);g.lineWidth=3;g.strokeRect(58,58,1084,684);
    g.textAlign='center';const B='Bungee,Impact,sans-serif';
    T2('🏆',120,56,'#000','sans-serif');T2('CERTIFICATE',200,70,'#ff7a00',B);T2('OF ACHIEVEMENT',245,28,'#8a5a2b');
    T2('This certificate is proudly awarded to',310,28,'#2a1300');
    let z=90;g.font=z+'px '+B;while(g.measureText(nick).width>900&&z>30){z-=4;g.font=z+'px '+B}
    T2(nick,420,z,'#2a1300',B);T2('Rank: '+rank,495,44,'#ff7a00',B);
    T2('for completing '+CFG.game+' · '+topic,555,28,'#2a1300');
    T2(sc+' points · '+ok+'/'+(ok+bad)+' correct ('+p+'%)',620,36,'#2a1300');
    g.textAlign='left';g.fillStyle='#8a5a2b';g.font='24px Nunito,sans-serif';g.fillText(new Date().toLocaleDateString(),110,705);
    g.textAlign='right';g.fillText('Author: '+CFG.author,1090,705);
    const u=c.toDataURL('image/png');$('cert').src=u;$('dl').href=u;$('dl').download='certificate-'+nick.replace(/\W+/g,'_')+'.png';
  };
  (document.fonts?document.fonts.load('40px Bungee'):Promise.resolve()).catch(()=>{}).then(draw);
}

$('main').onclick=()=>state==='end'?final():spin();
$('load').onclick=()=>{
  const b=parse($('src').value);
  if(b.length<4){$('msg').textContent='Need at least 4 questions (5 lines each).';return}
  bank=b;topic='Custom question bank';reset();nick?idle():reg();$('msg').textContent='Loaded '+b.length+' questions.';
};

const fx=$('fx'),cx=fx.getContext('2d');let ps=[],run=false;
function burst(n){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  for(let i=0;i<n;i++)ps.push({x:innerWidth/2,y:innerHeight*.45,vx:(Math.random()-.5)*16,vy:-Math.random()*13-2,r:Math.random()*6+4,c:['#ff7a00','#ffb347','#ffd23f','#fff','#1fa64a'][i%5],l:100});
  if(!run){run=true;fx.width=innerWidth;fx.height=innerHeight;loop()}
}
function loop(){
  cx.clearRect(0,0,fx.width,fx.height);ps=ps.filter(p=>p.l-->0);
  ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.35;cx.globalAlpha=Math.min(1,p.l/40);cx.fillStyle=p.c;cx.fillRect(p.x,p.y,p.r,p.r*1.6)});
  if(ps.length)requestAnimationFrame(loop);else run=false;
}
function reg(){
  state='reg';$('reel').hidden=$('main').hidden=$('chg').hidden=$('qbox').hidden=$('res').hidden=$('fin').hidden=true;
  $('reg').hidden=false;$('who').textContent='';$('nick').value=nick||saved;$('nick').focus();
}
function go(){
  const v=$('nick').value.trim().replace(/\s+/g,' ');
  if(v.length<2){$('err').textContent='Nickname needs at least 2 characters.';return}
  nick=v;try{localStorage.setItem('nick',v)}catch(e){}
  $('who').textContent='🎮 '+nick;$('err').textContent='';reset();idle();burst(50);
}
$('go').onclick=go;$('nick').onkeydown=e=>{if(e.key==='Enter')go()};
$('chg').onclick=()=>{clearInterval(tm);reg()};
$('snd').onclick=()=>{mute=!mute;$('snd').textContent=mute?'🔇':'🔊'};
$('hint').onclick=()=>{if(locked||!cur.h)return;pen+=20;$('hinttxt').hidden=false;$('hint').disabled=true;beep(520,.1,'triangle')};
$('half').onclick=()=>{if(locked)return;pen+=40;$('half').disabled=true;shuf(cur.o.filter(y=>!y.c)).slice(0,2).forEach(y=>{y.b.disabled=true;y.b.style.visibility='hidden'});beep(400,.1,'triangle')};
for(let i=0;i<16;i++){const e=document.createElement('i'),z=20+Math.random()*60;e.style.cssText='width:'+z+'px;height:'+z+'px;left:'+Math.random()*100+'%;animation-duration:'+(10+Math.random()*14)+'s;animation-delay:-'+Math.random()*20+'s';$('bg').append(e)}
$('foot').textContent=CFG.game+' · Author: '+CFG.author;
bank=parse(RAW);reset();reg();
