(function(){
'use strict';
/* ================= CONFIG — edite aqui ================= */
const OV=window.OrbitalV9||null;
const CONFIG={
  marca:'ANDER QUANT OS',
  nucleo:{titulo:'OBSERVANDO'},
  /* tema inicial. ids: pixel | dados | naves | cartas | voxel | criaturas | cosmos | cyber | bio | arcano
     | oceano | floresta | clima | deserto | artico | comida | musica | esportes | origami | brinquedos */
  tema:'pixel',
  /* grupos de abas: o primeiro é o principal. Para esconder um tema, tire o id da lista. */
  grupos:[
    {id:'game',   nome:'Game',   temas:['pixel','dados','naves','cartas','voxel']},
    {id:'estilos',nome:'Estilos',temas:['criaturas','cosmos','cyber','bio','arcano']},
    {id:'natureza',nome:'Natureza',temas:['oceano','floresta','clima','deserto','artico']},
    {id:'pop',    nome:'Pop',    temas:['comida','musica','esportes','origami','brinquedos','jardim','aquario','oficina']}
  ],
  mostrarAbas:true,
  lembrarTema:true,          // lembra a última aba escolhida neste navegador
  /* XP: o núcleo começa no nível 1 e evolui com o tempo e com os sinais (nomes dos níveis vêm do tema) */
  xp:{passivo:1.2,porSinal:6,niveis:Array.from({length:50},(_,i)=>({xp:Math.round(i*54+i*i*18+i*i*i*.18)}))},
  /* órbitas 3D: r = raio, incl = inclinação do plano (graus), no = giro do plano (graus), vel = voltas/s */
  orbitas:[
    {r:.52,incl:8, no:10, vel:.050},
    {r:.82,incl:-6,no:65, vel:-.034},
    {r:1.12,incl:4, no:-30,vel:.024}
  ],
  camera:{inclinacao:29,deriva:true,parallax:true},
  agentes:[
    /* ---- agentes base (ativos) — "forma" vale para o tema criaturas; os outros temas usam a posição na lista ---- */
    {nome:'KELLY',  papel:'Sizing',   forma:'buraconegro',cor:'#f0b24a',orbita:0,fase:.00,status:'sizing 1,8%',ativo:true},
    {nome:'SPOTTER',papel:'Fluxo',    forma:'nuvem',      cor:'#7fd0bd',orbita:0,fase:.50,status:'fluxo comprador',ativo:true},
    {nome:'TAKER',  papel:'Execução', forma:'blob',       cor:'#f08a4b',orbita:1,fase:.12,status:'ordem enviada',ativo:true},
    {nome:'CLOSER', papel:'Saída',    forma:'fantasma',   cor:'#ee7f98',orbita:1,fase:.62,status:'alvo 2R',ativo:true},
    {nome:'PRIOR',  papel:'Prior',    forma:'aguaviva',   cor:'#8fb0ee',orbita:2,fase:.27,status:'prior 0,58',ativo:true},
    {nome:'EDGE',   papel:'Edge',     forma:'cristal',    cor:'#b99cf5',orbita:2,fase:.77,status:'edge +0,32R',ativo:true},
    /* ---- reserva: folclore brasileiro (ligue pelos botões ou ativo:true) ---- */
    {nome:'SACI',      papel:'Volatilidade',forma:'redemoinho',cor:'#e4605a',orbita:null,fase:null,status:'ventania no book',ativo:false},
    {nome:'IARA',      papel:'Liquidez',    forma:'gota',      cor:'#4fd3e6',orbita:null,fase:null,status:'maré cheia',ativo:false},
    {nome:'BOITATÁ',   papel:'Risco / Stop',forma:'serpente',  cor:'#ff8a3a',orbita:null,fase:null,status:'stop em chamas',ativo:false},
    {nome:'MURUCUTUTU',papel:'Sentimento',  forma:'coruja',    cor:'#c7a3ff',orbita:null,fase:null,status:'noite otimista',ativo:false},
    {nome:'TATUBOLA',  papel:'Hedge',       forma:'tatu',      cor:'#d4b996',orbita:null,fase:null,status:'carteira blindada',ativo:false},
    {nome:'CAPIZEN',   papel:'Paciência',   forma:'capivara',  cor:'#e0a96d',orbita:null,fase:null,status:'sem pressa, sem FOMO',ativo:false},
    {nome:'LUNA',papel:'Exploração',forma:'gato',cor:'#d4afff',orbita:0,fase:.23,status:'investigando',ativo:true},
    {nome:'RUBI',papel:'Agilidade',forma:'raposa',cor:'#ff9566',orbita:1,fase:.39,status:'esquivando',ativo:true},
    {nome:'AXO',papel:'Cura',forma:'axolote',cor:'#ff9bc6',orbita:2,fase:.53,status:'regeneração',ativo:true},
    {nome:'BRASA',papel:'Ofensiva',forma:'dragao',cor:'#f87d56',orbita:null,fase:null,status:'guardião de fogo',ativo:false},
    {nome:'MEL',papel:'Vigilância',forma:'abelha',cor:'#ffd164',orbita:null,fase:null,status:'patrulha aérea',ativo:false},
    {nome:'NÉVOA',papel:'Camuflagem',forma:'polvo',cor:'#9b9bfc',orbita:null,fase:null,status:'camuflagem ativa',ativo:false},
    {nome:'PIPO',papel:'Suporte',forma:'panda',cor:'#d9e2dd',orbita:null,fase:null,status:'pronto para ajudar',ativo:false},
    {nome:'LUME',papel:'Energia',forma:'vagalume',cor:'#aaff89',orbita:null,fase:null,status:'carga luminosa',ativo:false}
  ],
  intervaloPulso:900,
  /* cadeia de produção: quem passa trabalho para quem (só vale se os dois estiverem ativos) */
  fluxos:[['SPOTTER','PRIOR'],['PRIOR','EDGE'],['EDGE','KELLY'],['KELLY','TAKER'],['TAKER','CLOSER'],
          ['SACI','KELLY'],['IARA','TAKER'],['BOITATÁ','CLOSER'],['MURUCUTUTU','PRIOR'],['TATUBOLA','KELLY'],['CAPIZEN','EDGE']],
  eventos:{sinal:.34,passe:.24,ordem:.14,mercado:.20,onda:.08},
  /* ameaças: barreira + reforço + interceptores. Sem ataques na "zona segura". Tempos em segundos. */
  ataques:{ativo:true,primeiro:12,intervalo:[14,24],paz:7,
    tipos:[{nome:'FLASH CRASH',cor:'#ff4d6d'},{nome:'FUD',cor:'#b66bff'},{nome:'SLIPPAGE',cor:'#ff9f43'},{nome:'RUG PULL',cor:'#ff3b3b'},{nome:'HACK',cor:'#4dffb8'}]},
  tamanhoAgente:.043,
  mostrarReserva:true
};
/* ======================================================= */

/* ================= utilidades ================= */
const PI=Math.PI,TAU=PI*2;
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,k)=>a+(b-a)*k;
const easeOut=k=>1-Math.pow(1-k,3),easeInOut=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
const easeBack=k=>{const c=1.70158;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
const hexA=(h,a)=>{const n=parseInt(h.slice(1,7),16);return 'rgba('+(n>>16)+','+((n>>8)&255)+','+(n&255)+','+clamp(a,0,1)+')';};
const mixHex=(a,b,k)=>{const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16);const c=s=>Math.round(lerp((x>>s)&255,(y>>s)&255,k));return '#'+((1<<24)|(c(16)<<16)|(c(8)<<8)|c(0)).toString(16).slice(1);};
const mulberry=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const hash1=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);};
const ruido=x=>{const i=Math.floor(x),f=x-i,s=f*f*(3-2*f);return lerp(hash1(i),hash1(i+1),s);};

/* brilho aditivo (luz) */
function luz(x,y,r,cor,a){
  if(a<=0||r<=0)return;
  ctx.save();ctx.globalCompositeOperation='lighter';
  const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(cor,a));g.addColorStop(.4,hexA(cor,a*.35));g.addColorStop(1,hexA(cor,0));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
}
function aditivo(fn){ctx.save();ctx.globalCompositeOperation='lighter';fn();ctx.restore();}
function comAlfa(a,fn){const ga=ctx.globalAlpha;ctx.globalAlpha=ga*a;fn();ctx.globalAlpha=ga;}

/* ponto na superfície de uma esfera de raio 1 (para texturas que giram) */
const esf=(lon,lat,rot)=>{const l=lon-rot,c=Math.cos(lat);return{x:Math.sin(l)*c,y:-Math.sin(lat),v:Math.cos(l)*c};};

/* runa procedural (traço no quadrado -1..1) */
function runa(seed){
  const r=mulberry(seed*9301+49297);ctx.beginPath();
  const n=2+Math.floor(r()*3);
  for(let i=0;i<n;i++){
    const k=Math.floor(r()*5);
    if(k===0){const x=(r()-.5)*1.2;ctx.moveTo(x,-.9);ctx.lineTo(x,.9);}
    else if(k===1){const y=(r()-.5)*1.2;ctx.moveTo(-.7,y);ctx.lineTo(.7,y);}
    else if(k===2){const a=r()*TAU,rr=.3+r()*.5;ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);ctx.arc(0,0,rr,a,a+PI*(.6+r()));}
    else if(k===3){const m=r()-.5;ctx.moveTo(-.7,-.8);ctx.lineTo(m,0);ctx.lineTo(.7,.8);}
    else{const x=r()-.5,y=r()-.5;ctx.moveTo(x,y-.28);ctx.lineTo(x+.28,y);ctx.lineTo(x,y+.28);ctx.lineTo(x-.28,y);ctx.closePath();}
  }
  ctx.stroke();
}

/* ---------- poliedros para wireframes ---------- */
const POLI=(()=>{
  const phi=(1+Math.sqrt(5))/2;
  const norm=vs=>vs.map(v=>{const l=Math.hypot(v[0],v[1],v[2]);return[v[0]/l,v[1]/l,v[2]/l];});
  const porDist=vs=>{let m=1e9;for(let i=0;i<vs.length;i++)for(let j=i+1;j<vs.length;j++){const d=Math.hypot(vs[i][0]-vs[j][0],vs[i][1]-vs[j][1],vs[i][2]-vs[j][2]);if(d>1e-6&&d<m)m=d;}
    const e=[];for(let i=0;i<vs.length;i++)for(let j=i+1;j<vs.length;j++){const d=Math.hypot(vs[i][0]-vs[j][0],vs[i][1]-vs[j][1],vs[i][2]-vs[j][2]);if(d<m*1.08)e.push([i,j]);}return{v:vs,e};};
  const P={};
  P.tetra=porDist(norm([[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]]));
  P.cubo=porDist(norm([[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]));
  P.octa=porDist([[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]);
  P.ico=porDist(norm([[0,1,phi],[0,-1,phi],[0,1,-phi],[0,-1,-phi],[1,phi,0],[-1,phi,0],[1,-phi,0],[-1,-phi,0],[phi,0,1],[-phi,0,1],[phi,0,-1],[-phi,0,-1]]));
  P.dode=porDist(norm((()=>{const a=1/phi,b=phi,v=[];for(const x of[-1,1])for(const y of[-1,1])for(const z of[-1,1])v.push([x,y,z]);
    for(const s1 of[-1,1])for(const s2 of[-1,1]){v.push([0,s1*a,s2*b]);v.push([s1*a,s2*b,0]);v.push([s1*b,0,s2*a]);}return v;})()));
  P.cubocta=porDist(norm((()=>{const v=[];for(const a of[-1,1])for(const b of[-1,1]){v.push([a,b,0]);v.push([a,0,b]);v.push([0,a,b]);}return v;})()));
  const prisma=(n,h,r)=>{const v=[],e=[];for(let i=0;i<n;i++){const a=i/n*TAU;v.push([Math.cos(a)*r,h,Math.sin(a)*r],[Math.cos(a)*r,-h,Math.sin(a)*r]);}
    for(let i=0;i<n;i++){const j=(i+1)%n;e.push([i*2,j*2],[i*2+1,j*2+1],[i*2,i*2+1]);}return{v,e};};
  P.prisma=prisma(6,.6,.8);
  P.piramide=(()=>{const v=[[0,1,0],[-.75,-.6,-.75],[.75,-.6,-.75],[.75,-.6,.75],[-.75,-.6,.75]];return{v,e:[[0,1],[0,2],[0,3],[0,4],[1,2],[2,3],[3,4],[4,1]]};})();
  P.bipir=(()=>{const v=[[0,1.1,0],[0,-1.1,0]],e=[];for(let i=0;i<5;i++){const a=i/5*TAU;v.push([Math.cos(a)*.75,0,Math.sin(a)*.75]);}
    for(let i=0;i<5;i++){e.push([0,i+2],[1,i+2],[i+2,(i+1)%5+2]);}return{v,e};})();
  P.toro=(()=>{const v=[],e=[],M=12,N=5;for(let i=0;i<M;i++)for(let j=0;j<N;j++){const a=i/M*TAU,b=j/N*TAU,r=.72+.28*Math.cos(b);v.push([Math.cos(a)*r,.28*Math.sin(b),Math.sin(a)*r]);}
    for(let i=0;i<M;i++)for(let j=0;j<N;j++){const k=i*N+j;e.push([k,((i+1)%M)*N+j],[k,i*N+(j+1)%N]);}return{v,e};})();
  P.estrela=(()=>{const t=P.tetra.v,v=t.concat(t.map(p=>[-p[0],-p[1],-p[2]])),e=[];
    for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){e.push([i,j],[i+4,j+4]);}return{v,e};})();
  P.esfera=(()=>{const v=[],e=[],LA=5,LO=10;for(let i=1;i<LA;i++){const la=-PI/2+i*PI/LA;for(let j=0;j<LO;j++){const lo=j/LO*TAU;v.push([Math.cos(la)*Math.cos(lo),Math.sin(la),Math.cos(la)*Math.sin(lo)]);}}
    for(let i=0;i<LA-1;i++)for(let j=0;j<LO;j++){const k=i*LO+j;e.push([k,i*LO+(j+1)%LO]);if(i<LA-2)e.push([k,k+LO]);}
    const n=v.length;v.push([0,1,0],[0,-1,0]);for(let j=0;j<LO;j++){e.push([n,(LA-2)*LO+j],[n+1,j]);}return{v,e};})();
  return P;
})();
function rot3(p,ax,ay,az){
  let [x,y,z]=p,c=Math.cos(ax),s=Math.sin(ax);[y,z]=[y*c-z*s,y*s+z*c];
  c=Math.cos(ay);s=Math.sin(ay);[x,z]=[x*c+z*s,-x*s+z*c];
  c=Math.cos(az);s=Math.sin(az);[x,y]=[x*c-y*s,x*s+y*c];return[x,y,z];
}
/* desenha poliedro em néon (coordenadas unitárias) */
function wire(P,ax,ay,az,cor,u,lw,esc,opt){
  esc=esc||1;opt=opt||{};
  const pts=P.v.map(v=>{const q=rot3(v,ax,ay,az),f=2.8/(2.8+q[2]);return{x:q[0]*f*esc,y:q[1]*f*esc,z:q[2]};});
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';
  for(const tras of[true,false]){
    ctx.beginPath();
    for(const [i,j] of P.e){const z=(pts[i].z+pts[j].z)/2;if((z>0)!==tras)continue;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);}
    const m=tras?.35:1;
    for(const [w,al] of[[lw*4.5,.12],[lw*1.8,.45],[lw*.8,1]]){ctx.lineWidth=w*u;ctx.strokeStyle=al===1&&!tras?(opt.nucleoCor||'#ffffff'):hexA(cor,al*m);ctx.stroke();}
  }
  if(opt.pontos){for(const p of pts){const s=(p.z<0?1:.6)*opt.pontos;ctx.fillStyle=hexA(cor,p.z<0?1:.5);ctx.beginPath();ctx.arc(p.x,p.y,s*u,0,TAU);ctx.fill();}}
  ctx.restore();return pts;
}

/* ---------- pintura de fundos (pré-renderizado) ---------- */
function pintaBase(g,w,h,c0,c1,c2,cy){
  const gr=g.createRadialGradient(w/2,h*(cy||.5),Math.min(w,h)*.05,w/2,h/2,Math.max(w,h)*.75);
  gr.addColorStop(0,c0);gr.addColorStop(.5,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.fillRect(0,0,w,h);
}
function pintaNebulosas(g,w,h,cores,seed,n,al){
  const r=mulberry(seed),s=Math.min(w,h);g.save();g.globalCompositeOperation='screen';
  for(let i=0;i<n;i++){
    const cx=w*(.08+r()*.84),cy=h*(.08+r()*.84),col=cores[i%cores.length];
    for(let j=0;j<5;j++){
      const x=cx+(r()-.5)*s*.3,y=cy+(r()-.5)*s*.2,rad=s*(.14+r()*.3);
      const gr=g.createRadialGradient(x,y,0,x,y,rad);gr.addColorStop(0,hexA(col,al));gr.addColorStop(1,hexA(col,0));
      g.fillStyle=gr;g.fillRect(x-rad,y-rad,rad*2,rad*2);
    }
  }
  g.restore();
}
function pintaViaLactea(g,w,h,ang,cor,dens,seed){
  const r=mulberry(seed||5),s=Math.min(w,h);
  g.save();g.globalCompositeOperation='screen';g.translate(w/2,h/2);g.rotate(ang);
  const gr=g.createLinearGradient(0,-s*.24,0,s*.24);gr.addColorStop(0,hexA(cor,0));gr.addColorStop(.5,hexA(cor,.08));gr.addColorStop(1,hexA(cor,0));
  g.fillStyle=gr;g.fillRect(-w,-s*.24,w*2,s*.48);
  for(let i=0;i<dens;i++){const x=(r()-.5)*w*1.6,y=((r()+r()+r()+r())/4-.5)*s*.55;g.fillStyle=hexA(cor,.06+r()*.35);const z=r()*1.2+.3;g.fillRect(x,y,z,z);}
  /* faixas escuras de poeira */
  for(let i=0;i<40;i++){const x=(r()-.5)*w*1.5,y=(r()-.5)*s*.08,rad=s*(.03+r()*.06);const gg=g.createRadialGradient(x,y,0,x,y,rad);gg.addColorStop(0,'rgba(0,0,0,.25)');gg.addColorStop(1,'rgba(0,0,0,0)');
    g.globalCompositeOperation='source-over';g.fillStyle=gg;g.fillRect(x-rad,y-rad,rad*2,rad*2);}
  g.restore();
}
function pintaEstrelas(g,w,h,n,seed,cores){
  const r=mulberry(seed);for(let i=0;i<n;i++){const c=cores[Math.floor(r()*cores.length)];g.fillStyle=hexA(c,.15+r()*.6);const z=r()<.97?r()*1.1+.3:r()*1.8+1;g.fillRect(r()*w,r()*h,z,z);}
}
function pintaVinheta(g,w,h,forca,cor){
  const gr=g.createRadialGradient(w/2,h/2,Math.min(w,h)*.32,w/2,h/2,Math.max(w,h)*.75);
  gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,cor?hexA(cor,forca):'rgba(0,0,0,'+forca+')');g.fillStyle=gr;g.fillRect(0,0,w,h);
}

/* ---------- camadas vivas reaproveitáveis ---------- */
const ESTR=Array.from({length:220},(_,i)=>{const r=mulberry(i*97+3);return{x:r(),y:r(),s:r()*1.5+.3,t:r()*TAU,z:r(),b:r()<.06};});
function estrelasVivas(t,cores,forca){
  forca=forca==null?1:forca;
  for(const e of ESTR){
    const a=(.2+.6*(.5+.5*Math.sin(t*(.5+e.s*.5)+e.t)))*forca,x=e.x*W-par.x*S*.06*e.z,y=e.y*H-par.y*S*.06*e.z;
    const c=cores[(e.t*10|0)%cores.length];
    ctx.globalAlpha=a;ctx.fillStyle=c;ctx.fillRect(x,y,e.s,e.s);
    if(e.b){ctx.globalAlpha=a*.6;ctx.fillRect(x-e.s*3,y+e.s/2-.35,e.s*7,.7);ctx.fillRect(x+e.s/2-.35,y-e.s*3,.7,e.s*7);}
  }
  ctx.globalAlpha=1;
}
const MOTES=Array.from({length:46},(_,i)=>{const r=mulberry(i*31+5);return{x:r(),y:r(),s:r()*2+.8,v:r()*.02+.006,t:r()*TAU,z:r()};});
function particulasFrente(t,cor,subir){
  for(const m of MOTES){
    const y=((m.y-(subir===false?-1:1)*t*m.v)%1+1)%1,x=m.x+Math.sin(t*.4+m.t)*.012;
    const px=x*W-par.x*S*.08*m.z,py=y*H-par.y*S*.08*m.z,al=.12+.3*(.5+.5*Math.sin(t*1.2+m.t));
    ctx.beginPath();ctx.arc(px,py,m.s*2.6,0,TAU);ctx.fillStyle=hexA(cor,al*.16);ctx.fill();
    ctx.beginPath();ctx.arc(px,py,m.s*.6,0,TAU);ctx.fillStyle=hexA(cor,al);ctx.fill();
  }
}
/* rede de constelação */
const NOS=Array.from({length:100},(_,i)=>({a:Math.random()*TAU,d:Math.sqrt(Math.random()),v:(Math.random()*.02+.004)*(Math.random()<.5?-1:1),c:i%6,s:Math.random()*1.5+.6,t:Math.random()*TAU}));
function redeConstelacao(t,dt,cores,forca){
  const pos=NOS.map(n=>{n.a+=n.v*dt;const x=Math.cos(n.a)*n.d*W*.47,y=Math.sin(n.a)*n.d*H*.42;
    return{x:W/2+x*.98-y*.18-par.x*S*.025,y:H/2+x*.18+y*.98-par.y*S*.025};});
  ctx.lineWidth=.7;const lim=S*.1;
  for(let i=0;i<NOS.length;i++)for(let j=i+1;j<NOS.length;j++){
    const d=Math.hypot(pos[i].x-pos[j].x,pos[i].y-pos[j].y);
    if(d<lim){ctx.strokeStyle=hexA(cores[NOS[i].c%cores.length],(1-d/lim)*.2*forca);ctx.beginPath();ctx.moveTo(pos[i].x,pos[i].y);ctx.lineTo(pos[j].x,pos[j].y);ctx.stroke();}
  }
  NOS.forEach((n,i)=>{ctx.fillStyle=hexA(cores[n.c%cores.length],(.3+.35*Math.sin(t*.8+n.t))*forca);ctx.beginPath();ctx.arc(pos[i].x,pos[i].y,n.s,0,TAU);ctx.fill();});
}
/* velas de candlestick rolando (sabor trading) */
const VELAS=[];let velaT=0;
(function(){let p=100;for(let i=0;i<48;i++){const v=novaVela(p);VELAS.push(v);p=v.c;}})();
function novaVela(p){const o=p,c=p+(Math.random()-.48)*3,h=Math.max(o,c)+Math.random()*1.6,l=Math.min(o,c)-Math.random()*1.6;return{o,c,h,l};}
function velasFundo(dt,up,down,al,y0,alt){
  velaT+=dt/1.4;if(velaT>=1){velaT-=1;VELAS.push(novaVela(VELAS[VELAS.length-1].c));VELAS.shift();}
  const n=VELAS.length,bw=W*.9/n,x0=W*.05,hh=H*(alt||.12),yb=H*(y0||.9);
  let mn=1e9,mx=-1e9;VELAS.forEach(v=>{mn=Math.min(mn,v.l);mx=Math.max(mx,v.h);});
  const f=y=>yb-(y-mn)/(mx-mn)*hh;
  VELAS.forEach((v,i)=>{
    const x=x0+(i-velaT)*bw+bw/2,u=v.c>=v.o;ctx.strokeStyle=ctx.fillStyle=hexA(u?up:down,al);
    ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,f(v.h));ctx.lineTo(x,f(v.l));ctx.stroke();
    ctx.fillRect(x-bw*.3,Math.min(f(v.o),f(v.c)),bw*.6,Math.max(1,Math.abs(f(v.o)-f(v.c))));
  });
}

/* ================= estado e câmera 3D ================= */
const cv=document.getElementById('ao-canvas'),ctx=cv.getContext('2d');
const root=document.getElementById('ao-root');
const reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;
const css=getComputedStyle(document.documentElement);
const V=n=>css.getPropertyValue(n).trim();
if(!CanvasRenderingContext2D.prototype.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(typeof r==='number'?r:0,w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();};}

let W=0,H=0,S=0,DPR=1,K=1,CX=0,CY=0;
const cam={yaw:0,pitch:.5,zoom:1,D:6,pulso:0,voo:0};
const par={x:0,y:0,tx:0,ty:0};
const AG=CONFIG.agentes;
AG.forEach((a,i)=>{a.i=i;a.seed=i*.61+.2;a.bounce=0;a.happy=0;a.p=null;a.nasc=a.ativo?0:1;a.ang=(a.fase||0)*TAU;
  a.carga=0;a.pend=null;a.recuoX=0;a.recuoY=0;a.glow=0;a.balao=null;a.olhar=null;a.olharT=2+Math.random()*3;a.corT=a.cor;});
const ativos=()=>AG.filter(a=>a.ativo);
const NIV=CONFIG.xp.niveis;
const nuc={xp:0,nivel:1,nivelAnt:1,morph:0,r:0,happy:0,evo:0,lookX:0,lookY:0,alvoX:0,alvoY:0,sinais:0,aviso:0,avisoTxt:'',
  shake:0,combo:0,comboT:-9,comboPop:0,flash:0,paz:6,medo:0,dano:0,defesas:0,escudo:{on:.18,alvoOn:.18,hp:24,max:36,rip:[]}};
const ameaca={fase:0,nome:'',cor:'#ff4d6d',n:0,spawn:0,prox:CONFIG.ataques.primeiro,quebrou:false};
const fx=[],fxTxt=[],proj=[],aneis=[],ondas=[],agenda=[];
const TEMAS={};
let TEMA=null,fundoImg=null,transicao=null,flashTela=0,tempoEscala=1,tSim=0;

/* projeção 3D: mundo (y para cima) -> tela */
function proj3(x,y,z){
  const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw);
  const X=x*cy-z*sy,Z=x*sy+z*cy;
  const cp=Math.cos(cam.pitch),sp=Math.sin(cam.pitch);
  const Y2=y*cp+Z*sp,Z2=-y*sp+Z*cp;
  const f=cam.D/Math.max(.3,cam.D+Z2),k=K*cam.zoom*f;
  return{x:CX+X*k,y:CY-Y2*k,z:Z2,f};
}
function orbW(o,ang){
  if(OV)return OV.orbital(o,ang,tSim);
  const r=o.r,px=Math.cos(ang)*r,pz0=Math.sin(ang)*r,ic=o.incl*PI/180,no=o.no*PI/180;
  const py=pz0*Math.sin(ic),pz=pz0*Math.cos(ic);
  return{x:px*Math.cos(no)-pz*Math.sin(no),y:py,z:px*Math.sin(no)+pz*Math.cos(no)};
}
function posOrbita(o,ang){const w=orbW(o,ang),p=proj3(w.x,w.y,w.z);p.prof=-p.z;return p;}
function posCenario(a,t,indice,total){
  // Distribuição baseada nos agentes ativos: reservas não deixam espaços vazios.
  const id=TEMA.id,n=Math.max(1,total),i=indice;
  const colunas=W<570?Math.min(3,n):Math.min(5,n);
  const linhas=Math.ceil(n/colunas),col=i%colunas,row=Math.floor(i/colunas);
  const xBase=W*(col+.5)/colunas,yBase=H*(.27+.53*(row+.5)/linhas);
  const fase=a.seed*4.3,osc=Math.sin(t*.8+fase),grupo=i%3;
  let x=xBase,y=yBase;
  if(['oceano','aquario'].includes(id)){
    // Cardume em faixas de profundidade, sem círculos orbitais.
    x+=Math.sin(t*.35+fase)*S*.025;
    y+=Math.sin(t*.65+i*1.2)*S*.015;
  }else if(['floresta','jardim','bio'].includes(id)){
    // Bosque: personagens sobre clareiras, balançando como folhas.
    x+=Math.sin(t*.3+fase)*S*.014;
    y+=Math.cos(t*.42+fase)*S*.007;
  }else if(id==='musica'){
    // Palco: cada integrante responde a uma batida distinta.
    y-=Math.abs(Math.sin(t*(1.25+grupo*.15)+fase))*S*.035;
  }else if(['pixel','cyber','voxel','oficina'].includes(id)){
    // Bancadas digitais: linhas estáveis e microanimações de atividade.
    x+=Math.sin(t*.35+fase)*S*.005;
    y+=Math.sin(t*.55+fase)*S*.005;
  }else if(['esportes','brinquedos'].includes(id)){
    // Arena e parque: pequenos saltos alternados.
    y-=Math.abs(Math.sin(t*.9+fase))*S*.025;
  }else if(['clima','artico'].includes(id)){
    x+=Math.sin(t*.42+fase)*S*.02;
    y+=Math.sin(t*.25+fase)*S*.012;
  }else if(id==='origami'){
    // Dobraduras organizadas em zigue-zague.
    x+=(row%2?1:-1)*S*.025;
    y+=Math.sin(t*.45+fase)*S*.008;
  }else if(id==='cartas'||id==='dados'){
    // Mesa de jogo: participantes em leque, com inclinação suave.
    x+=Math.sin((i+.5)/n*PI)*S*.015;
    y+=Math.cos((i+.5)/n*PI)*S*.02;
  }else{
    y+=osc*S*.012;
  }
  return{x:clamp(x,S*.075,W-S*.075),y:clamp(y,H*.2,H*.83),z:0,prof:0,f:1};
}
/* anel no plano horizontal (raio em unidades do mundo) */
function caminhoAnel(rr,y,n){
  n=n||72;ctx.beginPath();
  for(let i=0;i<=n;i++){const a=i/n*TAU,p=proj3(Math.cos(a)*rr,y,Math.sin(a)*rr);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}
}
/* desenha algo "deitado" no plano y=const, em unidades do mundo (transformação afim) */
function noPlano(x,y,z,fn){
  const e=.05,p0=proj3(x,y,z),px=proj3(x+e,y,z),pz=proj3(x,y,z+e);
  const a=(px.x-p0.x)/e,b=(px.y-p0.y)/e,c=(pz.x-p0.x)/e,d=(pz.y-p0.y)/e;
  ctx.save();ctx.transform(a,b,c,d,p0.x,p0.y);fn(1/Math.max(1e-3,Math.hypot(a,b)));ctx.restore();
}
/* raio do núcleo em unidades do mundo */
const rMundo=r=>r/(K*cam.zoom);

/* ================= TEMA: CRIATURAS (mascotes) ================= */
function olhos(cx,cy,sep,sz,look,blink,feliz,iris){
  for(const s of[-1,1]){
    const x=cx+s*sep;
    if(feliz||blink>.55){
      ctx.beginPath();ctx.arc(x,cy+sz*.4,sz*.85,PI*1.1,PI*1.9);ctx.lineWidth=sz*.5;ctx.lineCap='round';ctx.strokeStyle='#1d1612';ctx.stroke();
    }else{
      ctx.beginPath();ctx.ellipse(x,cy,sz,sz*1.25*(1-blink*.8),0,0,TAU);ctx.fillStyle='#fff';ctx.fill();
      const px=x+look.x*sz*.38,py=cy+look.y*sz*.45;
      ctx.beginPath();ctx.arc(px,py,sz*.62,0,TAU);ctx.fillStyle=iris||'#1d1612';ctx.fill();
      ctx.beginPath();ctx.arc(px-sz*.2,py-sz*.22,sz*.2,0,TAU);ctx.fillStyle='#fff';ctx.fill();
    }
  }
}
function bochechas(cx,cy,sep,r,cor){ctx.fillStyle=cor;for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(cx+s*sep,cy,r,r*.6,0,0,TAU);ctx.fill();}}
function boca(x,y,w,feliz){
  ctx.beginPath();
  if(feliz){ctx.arc(x,y-w*.2,w,.1*PI,.9*PI);ctx.closePath();ctx.fillStyle='#3a1a14';ctx.fill();}
  else{ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x,y+w*.9,x+w,y);ctx.lineWidth=w*.35;ctx.lineCap='round';ctx.strokeStyle='#1d1612';ctx.stroke();}
}
function brilho(x,y,rx,ry,rot,al){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,TAU);ctx.fillStyle='rgba(255,255,255,'+(al==null?.4:al)+')';ctx.fill();}
function contorno(corLinha,u,w){ctx.lineWidth=(w||7)*u;ctx.strokeStyle=corLinha;ctx.lineJoin='round';ctx.stroke();}
function pontoCirculo(cx,cy,r,n){for(let i=0;i<n;i++){const a=i/n*TAU;ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}}

const FORMAS={

/* KELLY — buraco negro: disco de acreção, lente gravitacional, jatos */
buraconegro(a,t,u,look,blink,feliz){
  ctx.rotate(-.28);
  let g=ctx.createRadialGradient(0,0,.3,0,0,2.5);g.addColorStop(0,a.cor+'77');g.addColorStop(.5,a.cor+'22');g.addColorStop(1,a.cor+'00');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,2.5,0,TAU);ctx.fill();
  for(const s of[-1,1]){
    g=ctx.createLinearGradient(0,s*.5,0,s*2.2);g.addColorStop(0,'rgba(255,235,185,.65)');g.addColorStop(1,'rgba(255,235,185,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-.1,s*.5);ctx.lineTo(.1,s*.5);ctx.lineTo(.035*(1+Math.sin(t*5)*.4),s*2.2);ctx.lineTo(-.035,s*2.2);ctx.fill();
  }
  const cores=['#fffaf0','#ffe6a0','#ffc15a','#f08a30','#c0541c','#7a2a12'];
  const disco=(ini,fim)=>cores.forEach((c,i)=>{
    ctx.beginPath();ctx.ellipse(0,0,2.0-i*.2,.56-i*.055,0,ini,fim);ctx.lineWidth=(7.5-i)*u*1.3;ctx.lineCap='round';ctx.strokeStyle=c;ctx.stroke();
  });
  disco(PI,TAU);
  ctx.beginPath();ctx.arc(0,0,.68,0,TAU);ctx.lineWidth=5.5*u;ctx.strokeStyle='#fff0c4';ctx.shadowColor=a.cor;ctx.shadowBlur=18;ctx.stroke();ctx.shadowBlur=0;
  ctx.beginPath();ctx.arc(0,0,.6,0,TAU);ctx.fillStyle='#020101';ctx.fill();
  ctx.beginPath();ctx.ellipse(0,-.06,1.0,.82,0,PI*1.05,PI*1.95);ctx.lineWidth=4.5*u;ctx.strokeStyle='rgba(255,220,140,.9)';ctx.stroke();
  ctx.save();ctx.rotate(.28);olhos(0,.02,.2,.1,look,blink,feliz,'#1d1612');ctx.restore();
  disco(0,PI);
  /* lado do disco que vem na nossa direção brilha mais (efeito Doppler) */
  ctx.beginPath();ctx.ellipse(0,0,1.8,.5,0,.1*PI,.55*PI);ctx.lineWidth=5*u;ctx.strokeStyle='rgba(255,255,255,.55)';ctx.stroke();
  for(let i=0;i<18;i++){
    const f=(t*.35+i/18)%1,ang=i*2.4+t*1.4,rr=2.0-f*1.4;
    ctx.beginPath();ctx.arc(Math.cos(ang)*rr,Math.sin(ang)*rr*.27,.045*(1-f*.5),0,TAU);ctx.fillStyle='rgba(255,238,195,'+(.9-f*.5)+')';ctx.fill();
  }
},

/* SPOTTER — nuvem de dados com radar e chuva de bits */
nuvem(a,t,u,look,blink,feliz){
  const flu=Math.sin(t*1.6+a.seed)*.04;
  const cs=[[-.72,.18,.46],[-.3,-.22,.62],[.28,-.28,.58],[.72,.12,.48],[0,.28,.62],[-.5,.42,.4],[.5,.42,.4]];
  ctx.save();ctx.translate(0,-1.22);
  for(const rr of[.5,.3]){ctx.beginPath();ctx.arc(0,.3,rr,PI*1.15,PI*1.85);ctx.lineWidth=2.5*u;ctx.strokeStyle='rgba(127,208,189,.6)';ctx.stroke();}
  const sw=Math.sin(t*2.2)*.6;ctx.beginPath();ctx.moveTo(0,.3);ctx.lineTo(Math.sin(sw)*.55,.3-Math.cos(sw)*.55);ctx.strokeStyle='#d4fff3';ctx.stroke();
  ctx.restore();
  for(let i=0;i<8;i++){
    const f=(t*.6+i*.31)%1,x=-.75+i*.21;ctx.fillStyle='rgba(180,255,235,'+(1-f)*.9+')';
    ctx.fillRect(x,.78+f*1.0,.05,.22*(1-f*.4));
    if(i%2){ctx.font='.14px monospace';ctx.fillText(i%4?'1':'0',x+.06,.9+f*1.0);}
  }
  const corpo=()=>{ctx.beginPath();cs.forEach(([x,y,r],i)=>{ctx.moveTo(x+r,y+flu*i);ctx.arc(x,y+flu*i,r,0,TAU);});};
  corpo();contorno('#2a7466',u,8);
  const g=ctx.createLinearGradient(0,-.9,0,.9);g.addColorStop(0,'#f6fffc');g.addColorStop(.5,'#c5f1e5');g.addColorStop(1,'#78cdb9');
  corpo();ctx.fillStyle=g;ctx.fill();
  /* relevos internos */
  ctx.strokeStyle='rgba(42,116,102,.25)';ctx.lineWidth=3*u;
  for(const [x,y,r] of cs.slice(0,4)){ctx.beginPath();ctx.arc(x,y+.06,r*.8,PI*.15,PI*.65);ctx.stroke();}
  brilho(-.4,-.5,.24,.1,-.55,.75);brilho(.35,-.55,.14,.07,-.4,.6);
  olhos(0,.12,.3,.15,look,blink,feliz);
  bochechas(0,.4,.5,.12,'rgba(255,140,150,.5)');boca(0,.4,.12,feliz);
},

/* TAKER — blob elástico: braços, topete e raio de execução */
blob(a,t,u,look,blink,feliz){
  const sq=1+Math.sin(t*3.4+a.seed*6)*.07;ctx.scale(sq,1/sq);
  for(const s of[-1,1]){
    ctx.save();ctx.translate(s*.95,.2);ctx.rotate(s*(.55+Math.sin(t*4+s)*.35));
    ctx.beginPath();ctx.ellipse(0,0,.34,.17,0,0,TAU);ctx.fillStyle='#d4682e';ctx.fill();contorno('#7a3714',u,5);
    for(const k of[-1,0,1]){ctx.beginPath();ctx.arc(s*.34,k*.09,.065,0,TAU);ctx.fillStyle='#fde2c6';ctx.fill();}
    ctx.restore();
  }
  for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(s*.42,.98,.3,.15,0,0,TAU);ctx.fillStyle='#c25a24';ctx.fill();contorno('#7a3714',u,5);}
  const corpo=()=>{ctx.beginPath();for(let i=0;i<=56;i++){const th=i/56*TAU,r=1+.05*Math.sin(3*th+t*2.2)+.035*Math.sin(5*th-t*1.7);const x=Math.cos(th)*r*1.02,y=Math.sin(th)*r*.95;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();};
  corpo();contorno('#7a3714',u,7);
  const g=ctx.createRadialGradient(-.35,-.45,.1,0,0,1.2);g.addColorStop(0,'#ffc796');g.addColorStop(.55,'#f08a4b');g.addColorStop(1,'#b8501f');
  corpo();ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();ctx.ellipse(0,.45,.55,.38,0,0,TAU);ctx.fillStyle='rgba(255,226,190,.38)';ctx.fill();
  brilho(-.42,-.55,.3,.13,-.6,.5);
  ctx.fillStyle='#7a3714';
  for(const [x,h] of [[-.2,.5],[0,.7],[.22,.46]]){ctx.beginPath();ctx.moveTo(x-.14,-.9);ctx.lineTo(x+.01,-.9-h);ctx.lineTo(x+.14,-.9);ctx.fill();}
  ctx.beginPath();ctx.moveTo(.05,-.78);ctx.lineTo(-.12,-.5);ctx.lineTo(0,-.5);ctx.lineTo(-.07,-.25);ctx.lineTo(.14,-.55);ctx.lineTo(.02,-.55);ctx.closePath();ctx.fillStyle='#ffe066';ctx.fill();
  olhos(0,-.02,.36,.19,look,blink,feliz);bochechas(0,.28,.62,.13,'rgba(255,90,90,.4)');boca(0,.36,.26,true);
},

/* CLOSER — fantasminha-diabrete */
fantasma(a,t,u,look,blink,feliz){
  const flut=Math.sin(t*2.6+a.seed)*.05;
  ctx.beginPath();ctx.moveTo(.6,.6);ctx.bezierCurveTo(1.25,.7,1.2,.2,1.35,.3);ctx.lineWidth=7*u;ctx.strokeStyle='#6b1f33';ctx.lineCap='round';ctx.stroke();
  ctx.beginPath();ctx.moveTo(1.2,.12);ctx.lineTo(1.6,.28);ctx.lineTo(1.28,.5);ctx.closePath();ctx.fillStyle='#6b1f33';ctx.fill();
  const corpo=()=>{ctx.beginPath();ctx.moveTo(-.85,-.1);ctx.arc(0,-.1,.85,PI,TAU);ctx.lineTo(.85,.78);
    for(let i=0;i<4;i++){const x1=.85-i*.425,w=Math.sin(t*4+i*1.3)*.07;ctx.quadraticCurveTo(x1-.2125,.78+.38+w,x1-.425,.78);}ctx.closePath();};
  ctx.fillStyle='#6b1f33';
  for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*.62,-.7);ctx.quadraticCurveTo(s*.95,-1.0,s*.8,-1.38);ctx.quadraticCurveTo(s*.45,-1.05,s*.28,-.92);ctx.closePath();ctx.fill();}
  ctx.save();ctx.translate(0,flut);
  corpo();contorno('#6b1f33',u,7);
  const g=ctx.createLinearGradient(0,-1,0,1.2);g.addColorStop(0,'#ffc8d4');g.addColorStop(.6,'#ee7f98');g.addColorStop(1,'#a8425c');
  corpo();ctx.fillStyle=g;ctx.fill();
  brilho(-.35,-.62,.22,.1,-.5,.55);
  for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(s*.9,.35+Math.sin(t*3+s)*.05,.17,.24,s*.3,0,TAU);ctx.fillStyle='#ee7f98';ctx.fill();contorno('#6b1f33',u,5);}
  olhos(0,-.08,.34,.17,look,blink,feliz);
  bochechas(0,.28,.6,.12,'rgba(255,255,255,.28)');
  ctx.beginPath();ctx.moveTo(-.28,.28);ctx.quadraticCurveTo(.05,.55,.34,.2);ctx.lineWidth=.07;ctx.lineCap='round';ctx.strokeStyle='#4a1424';ctx.stroke();
  ctx.beginPath();ctx.moveTo(.2,.33);ctx.lineTo(.26,.45);ctx.lineTo(.32,.27);ctx.fillStyle='#fff';ctx.fill();
  ctx.restore();
},

/* PRIOR — água-viva com a curva de probabilidade */
aguaviva(a,t,u,look,blink,feliz){
  const bob=Math.sin(t*2+a.seed)*.06,pulso=1+Math.sin(t*2.4+a.seed)*.05;
  ctx.translate(0,-.15+bob);ctx.scale(1/pulso,pulso);
  for(let i=0;i<6;i++){
    const x0=-.72+i*.288;ctx.beginPath();ctx.moveTo(x0,.35);
    for(let k=1;k<=10;k++)ctx.lineTo(x0+Math.sin(t*3+k*.6+i)*.08*k/3,.35+k*.16);
    ctx.lineWidth=(5-(i%2)*1.5)*u;ctx.lineCap='round';ctx.strokeStyle='rgba(143,176,238,'+(.85-(i%2)*.3)+')';ctx.stroke();
  }
  for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*.2,.4);for(let k=1;k<=8;k++)ctx.lineTo(s*.2+Math.sin(t*2.4+k*.7+s)*.12*k/3,.4+k*.2);ctx.lineWidth=8*u;ctx.strokeStyle='rgba(199,216,250,.7)';ctx.stroke();}
  const sino=()=>{ctx.beginPath();ctx.moveTo(-1,.35);ctx.bezierCurveTo(-1.08,-1.35,1.08,-1.35,1,.35);ctx.quadraticCurveTo(.5,.62,0,.4);ctx.quadraticCurveTo(-.5,.62,-1,.35);ctx.closePath();};
  sino();contorno('#3d5aa8',u,6);
  const g=ctx.createRadialGradient(-.3,-.7,.1,0,-.1,1.3);g.addColorStop(0,'rgba(240,246,255,.98)');g.addColorStop(.5,'rgba(163,190,243,.95)');g.addColorStop(1,'rgba(98,126,205,.95)');
  sino();ctx.fillStyle=g;ctx.fill();
  brilho(-.5,-.8,.28,.1,-.55,.6);
  ctx.beginPath();for(let i=0;i<=40;i++){const x=-.75+i*.0375,y=-.28-.5*Math.exp(-(x*x)/.12);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  ctx.lineWidth=3.5*u;ctx.strokeStyle='rgba(40,60,130,.55)';ctx.stroke();
  for(let i=0;i<5;i++){const x=-.5+i*.25;ctx.beginPath();ctx.arc(x,-.28-.5*Math.exp(-(x*x)/.12),.04,0,TAU);ctx.fillStyle='#fff';ctx.fill();}
  olhos(0,.02,.3,.14,look,blink,feliz);bochechas(0,.24,.52,.11,'rgba(255,140,170,.5)');boca(0,.22,.1,feliz);
},

/* EDGE — cristal facetado */
cristal(a,t,u,look,blink,feliz){
  ctx.translate(0,Math.sin(t*2.2+a.seed)*.05);ctx.scale(.9+.1*Math.cos(t*1.5+a.seed),1);
  const T=[0,-1.25],R=[.92,-.12],B=[0,1.2],L=[-.92,-.12],C=[0,.08],UL=[-.46,-.7],UR=[.46,-.7],LL=[-.5,.5],LR=[.5,.5];
  const sil=()=>{ctx.beginPath();[L,UL,T,UR,R,LR,B,LL].forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();};
  sil();contorno('#4c2e96',u,7);
  [[L,UL,C,'#c9b2ff'],[UL,T,C,'#e6dcff'],[T,UR,C,'#cdb8ff'],[UR,R,C,'#9a78e0'],[R,LR,C,'#7d5cc9'],[LR,B,C,'#6544b5'],[B,LL,C,'#7351c0'],[LL,L,C,'#a98aef']]
    .forEach(([p,q,r,c])=>{ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.lineTo(r[0],r[1]);ctx.closePath();ctx.fillStyle=c;ctx.fill();ctx.lineWidth=2*u;ctx.strokeStyle='rgba(255,255,255,.32)';ctx.stroke();});
  ctx.save();sil();ctx.clip();
  const x=((t*.45+a.seed)%2-.5)*3.2-1.6;const g=ctx.createLinearGradient(x-.3,-1,x+.3,1);
  g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,.7)');g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=g;ctx.fillRect(-1.5,-1.5,3,3);ctx.restore();
  olhos(0,.0,.26,.14,look,blink,feliz);bochechas(0,.24,.44,.1,'rgba(255,130,170,.5)');boca(0,.25,.09,feliz);
  for(let i=0;i<4;i++){
    const ang=t*.9+i*PI/2,rr=1.45+Math.sin(t*2+i)*.1,tw=.5+.5*Math.sin(t*4+i*2);
    ctx.save();ctx.translate(Math.cos(ang)*rr,Math.sin(ang)*rr*.8);ctx.rotate(t+i);
    ctx.beginPath();for(let k=0;k<4;k++){const aa=k*PI/2;ctx.lineTo(Math.cos(aa)*.2*tw,Math.sin(aa)*.2*tw);ctx.lineTo(Math.cos(aa+PI/4)*.05,Math.sin(aa+PI/4)*.05);}
    ctx.closePath();ctx.fillStyle='rgba(235,225,255,.95)';ctx.fill();ctx.restore();
  }
},

/* ===== RESERVA: folclore brasileiro ===== */

/* SACI — redemoinho de pernas e gorro vermelho, cachimbo soltando fumaça */
redemoinho(a,t,u,look,blink,feliz){
  const seg=5;
  for(let i=seg-1;i>=0;i--){
    const k=i/(seg-1),x=Math.sin(t*3.2+i*.9)*.14*i,y=-.4+i*.36,rx=1.0-k*.78;
    ctx.beginPath();ctx.ellipse(x,y,rx,.24,0,0,TAU);
    const g=ctx.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,'#aeb9d1');g.addColorStop(.5,'#eef2fa');g.addColorStop(1,'#98a4c2');
    ctx.fillStyle=g;ctx.fill();contorno('#55627f',u,5);
    ctx.beginPath();ctx.ellipse(x,y+.03,rx*.7,.1,0,0,PI);ctx.strokeStyle='rgba(85,98,127,.35)';ctx.lineWidth=2.5*u;ctx.stroke();
  }
  /* poeira girando */
  for(let i=0;i<10;i++){const ang=t*2.4+i*.63,rr=.9+.35*Math.sin(i*2);ctx.beginPath();ctx.arc(Math.cos(ang)*rr,.6+Math.sin(ang)*.22+Math.sin(i)*.4,.04,0,TAU);ctx.fillStyle='rgba(238,242,250,'+(.35+.3*Math.sin(t*3+i))+')';ctx.fill();}
  /* gorro vermelho */
  ctx.beginPath();ctx.moveTo(-.78,-.42);ctx.quadraticCurveTo(-.5,-1.3,.1,-1.35);ctx.quadraticCurveTo(.85,-1.4,1.25,-.95+Math.sin(t*3)*.08);ctx.quadraticCurveTo(.7,-.95,.78,-.42);ctx.closePath();
  ctx.fillStyle='#d8362f';ctx.fill();contorno('#6b130f',u,6);
  ctx.beginPath();ctx.arc(1.28,-.93+Math.sin(t*3)*.08,.1,0,TAU);ctx.fillStyle='#ffe3a3';ctx.fill();
  brilho(-.3,-1.0,.22,.08,-.4,.45);
  olhos(0,-.18,.3,.16,look,blink,feliz);bochechas(0,.05,.52,.1,'rgba(255,120,120,.45)');boca(0,.06,.12,feliz);
  /* cachimbo + fumaça */
  ctx.beginPath();ctx.moveTo(.1,.02);ctx.lineTo(.62,.1);ctx.lineWidth=5*u;ctx.strokeStyle='#5a3a1e';ctx.lineCap='round';ctx.stroke();
  ctx.beginPath();ctx.arc(.7,.06,.1,0,TAU);ctx.fillStyle='#3d2713';ctx.fill();
  for(let i=0;i<4;i++){const f=(t*.5+i*.25)%1;ctx.beginPath();ctx.arc(.72+f*.35+Math.sin(f*6+i)*.05,-.05-f*.7,.06+f*.1,0,TAU);ctx.fillStyle='rgba(235,235,245,'+(.55*(1-f))+')';ctx.fill();}
},

/* IARA — gota d'água com cauda de sereia, cabelo de algas e concha */
gota(a,t,u,look,blink,feliz){
  const bob=Math.sin(t*2.2+a.seed)*.05;ctx.translate(0,bob);
  /* cabelo de alga */
  for(const s of[-1,1])for(let k=0;k<3;k++){
    ctx.beginPath();ctx.moveTo(s*.6,-.2+k*.18);
    for(let i=1;i<=7;i++)ctx.quadraticCurveTo(s*(.75+i*.09+k*.08),-.2+k*.18+i*.14+Math.sin(t*3+i+k)*.06,s*(.7+i*.1+k*.08),-.12+k*.18+i*.16);
    ctx.lineWidth=(6-k)*u;ctx.lineCap='round';ctx.strokeStyle=k%2?'#2fae7d':'#59d19b';ctx.stroke();
  }
  /* cauda de sereia */
  const sw=Math.sin(t*3+a.seed)*.12;
  ctx.beginPath();ctx.moveTo(-.18,.85);ctx.quadraticCurveTo(-.1,1.2,-.72+sw,1.5);ctx.quadraticCurveTo(-.2,1.5,0,1.28);ctx.quadraticCurveTo(.2,1.5,.72+sw,1.5);ctx.quadraticCurveTo(.1,1.2,.18,.85);ctx.closePath();
  ctx.fillStyle='#2fae7d';ctx.fill();contorno('#136b4d',u,5);
  const gota=()=>{ctx.beginPath();ctx.moveTo(0,-1.3);ctx.bezierCurveTo(.2,-.8,.98,-.25,.98,.35);ctx.bezierCurveTo(.98,1.02,-.98,1.02,-.98,.35);ctx.bezierCurveTo(-.98,-.25,-.2,-.8,0,-1.3);ctx.closePath();};
  gota();contorno('#0d6c82',u,7);
  const g=ctx.createRadialGradient(-.3,-.2,.1,0,.2,1.2);g.addColorStop(0,'#e4fdff');g.addColorStop(.5,'#6fe0f0');g.addColorStop(1,'#1f9bbd');
  gota();ctx.fillStyle=g;ctx.fill();
  brilho(-.45,-.15,.2,.4,.25,.6);brilho(.35,.6,.12,.06,-.5,.5);
  /* concha */
  ctx.save();ctx.translate(.45,-.6);ctx.rotate(.4);ctx.beginPath();ctx.moveTo(0,.2);
  for(let i=0;i<=4;i++){const aa=PI+i*PI/4;ctx.lineTo(Math.cos(aa)*.28,.2+Math.sin(aa)*.28);}
  ctx.closePath();ctx.fillStyle='#ffb3c7';ctx.fill();contorno('#c4506f',u,3.5);
  for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,.2);ctx.lineTo(Math.cos(PI+i*PI/4)*.28,.2+Math.sin(PI+i*PI/4)*.28);ctx.lineWidth=1.5*u;ctx.strokeStyle='#c4506f';ctx.stroke();}
  ctx.restore();
  olhos(0,.12,.32,.17,look,blink,feliz);bochechas(0,.4,.56,.12,'rgba(255,140,170,.55)');boca(0,.42,.12,feliz);
  for(let i=0;i<4;i++){const f=(t*.4+i*.27)%1;ctx.beginPath();ctx.arc(-.9+i*.6+Math.sin(f*7+i)*.1,-.5-f*.9,.06+i*.01,0,TAU);ctx.strokeStyle='rgba(220,250,255,'+(.8*(1-f))+')';ctx.lineWidth=1.8*u;ctx.stroke();}
},

/* BOITATÁ — serpente de fogo de olhos enormes */
serpente(a,t,u,look,blink,feliz){
  const N=10,pts=[];
  for(let i=0;i<N;i++){const k=i/(N-1);pts.push({x:1.0-k*2.1,y:Math.sin(t*4-i*.7)*.3*(.35+k)+k*.15,r:.4*(1-k*.6)});}
  for(let i=N-1;i>=0;i--){
    const p=pts[i],f=Math.sin(t*9+i*1.7)*.12;
    ctx.beginPath();ctx.moveTo(p.x-p.r*.8,p.y-p.r*.3);ctx.quadraticCurveTo(p.x-p.r*.3,p.y-p.r*(1.5+f*3),p.x+f*.4,p.y-p.r*(2.4+f*4));
    ctx.quadraticCurveTo(p.x+p.r*.5,p.y-p.r*1.4,p.x+p.r*.8,p.y-p.r*.3);ctx.closePath();
    ctx.fillStyle=i%2?'rgba(255,122,42,.85)':'rgba(255,196,80,.85)';ctx.fill();
  }
  for(let i=N-1;i>=0;i--){
    const p=pts[i],k=i/(N-1);
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,TAU);
    const g=ctx.createRadialGradient(p.x-p.r*.3,p.y-p.r*.35,p.r*.1,p.x,p.y,p.r);
    g.addColorStop(0,'hsl('+(55-k*38)+',100%,72%)');g.addColorStop(1,'hsl('+(30-k*26)+',92%,'+(52-k*8)+'%)');
    ctx.fillStyle=g;ctx.fill();contorno('#7a1f0a',u,5);
  }
  const h=pts[0];
  brilho(h.x-.14,h.y-.22,.14,.07,-.6,.55);
  /* olhos enormes e brilhantes */
  ctx.save();ctx.translate(h.x,h.y);ctx.scale(1.5,1.5);olhos(.0,-.05,.19,.17,look,blink,feliz,'#e8501c');
  ctx.beginPath();ctx.arc(.04,.14,.07,0,PI);ctx.fillStyle='#4a1209';ctx.fill();ctx.restore();
  for(let i=0;i<6;i++){const f=(t*.7+i*.17)%1;ctx.beginPath();ctx.arc(h.x-.9+i*.45+Math.sin(i*3)*.1,h.y-.8-f*.9,.05*(1-f),0,TAU);ctx.fillStyle='rgba(255,210,120,'+(1-f)+')';ctx.fill();}
},

/* MURUCUTUTU — coruja grande, sábia, de olhos enormes */
coruja(a,t,u,look,blink,feliz){
  const flap=Math.sin(t*3+a.seed)*.1;
  for(const s of[-1,1]){ctx.save();ctx.translate(s*.9,.1);ctx.rotate(s*(.18+flap));ctx.beginPath();ctx.ellipse(0,.25,.3,.78,0,0,TAU);ctx.fillStyle='#5c3fa8';ctx.fill();contorno('#2d1c63',u,5);
    for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(0,.0+k*.28,.2,.1*PI,.9*PI);ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=2.5*u;ctx.stroke();}ctx.restore();}
  for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(s*.38,1.05,.2,.1,0,0,TAU);ctx.fillStyle='#f0a030';ctx.fill();contorno('#7a4a10',u,4);}
  const corpo=()=>{ctx.beginPath();ctx.moveTo(-.88,-.55);ctx.lineTo(-.7,-1.2);ctx.lineTo(-.28,-.88);ctx.quadraticCurveTo(0,-.95,.28,-.88);ctx.lineTo(.7,-1.2);ctx.lineTo(.88,-.55);
    ctx.bezierCurveTo(1.05,.3,.9,1.05,0,1.08);ctx.bezierCurveTo(-.9,1.05,-1.05,.3,-.88,-.55);ctx.closePath();};
  corpo();contorno('#2d1c63',u,7);
  const g=ctx.createLinearGradient(0,-1,0,1.1);g.addColorStop(0,'#9a78e6');g.addColorStop(1,'#5c3fa8');corpo();ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();ctx.ellipse(0,.5,.58,.52,0,0,TAU);ctx.fillStyle='#f3e6ff';ctx.fill();
  ctx.strokeStyle='rgba(92,63,168,.4)';ctx.lineWidth=2.5*u;
  for(let r=0;r<3;r++)for(let c=-1;c<=1;c++){ctx.beginPath();ctx.arc(c*.3+(r%2)*.15-.07,.28+r*.24,.14,.15*PI,.85*PI);ctx.stroke();}
  for(const s of[-1,1]){ctx.beginPath();ctx.arc(s*.38,-.3,.42,0,TAU);ctx.fillStyle='#f3e6ff';ctx.fill();contorno('#2d1c63',u,4.5);
    ctx.beginPath();ctx.arc(s*.38,-.3,.42,0,TAU);ctx.strokeStyle='rgba(199,163,255,.8)';ctx.lineWidth=2.5*u;ctx.stroke();}
  olhos(0,-.3,.38,.21,look,blink,feliz,'#3d1f85');
  ctx.beginPath();ctx.moveTo(-.13,-.02);ctx.lineTo(.13,-.02);ctx.lineTo(0,.2);ctx.closePath();ctx.fillStyle='#f0a030';ctx.fill();contorno('#7a4a10',u,3.5);
  brilho(-.45,-.78,.24,.09,-.4,.4);
  /* estrelinha da noite */
  ctx.save();ctx.translate(0,-.78);ctx.rotate(t);ctx.beginPath();for(let k=0;k<4;k++){const aa=k*PI/2;ctx.lineTo(Math.cos(aa)*.13,Math.sin(aa)*.13);ctx.lineTo(Math.cos(aa+PI/4)*.04,Math.sin(aa+PI/4)*.04);}ctx.closePath();ctx.fillStyle='#ffe9a8';ctx.fill();ctx.restore();
},

/* TATUBOLA — tatu que se enrola em bola de vez em quando */
tatu(a,t,u,look,blink,feliz){
  const curl=Math.pow(Math.max(0,Math.sin(t*.6+a.seed*4)),5);
  const cascos=(r,rot)=>{
    ctx.beginPath();ctx.arc(0,0,r,0,TAU);
    const g=ctx.createRadialGradient(-r*.35,-r*.4,r*.1,0,0,r*1.1);g.addColorStop(0,'#e6d3b8');g.addColorStop(.6,'#b79e80');g.addColorStop(1,'#7a6450');
    ctx.fillStyle=g;ctx.fill();contorno('#4a3a2c',u,7);
    ctx.save();ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.clip();
    ctx.strokeStyle='rgba(74,58,44,.6)';ctx.lineWidth=3.5*u;
    for(let i=-3;i<=3;i++){ctx.beginPath();ctx.ellipse(i*r*.3+Math.sin(rot)*0,0,r*.14,r*1.1,0,0,TAU);ctx.stroke();}
    ctx.restore();
  };
  if(curl>.5){
    ctx.rotate(t*2.4);cascos(.95,t);
    ctx.rotate(-t*2.4);
    ctx.save();ctx.beginPath();ctx.arc(0,0,.95,0,TAU);ctx.clip();brilho(-.35,-.45,.28,.12,-.6,.5);ctx.restore();
    olhos(0,-.05,.26,.12,look,blink,feliz);
    return;
  }
  /* corpo estendido */
  ctx.beginPath();ctx.moveTo(.9,.45);ctx.quadraticCurveTo(1.6,.5,1.55,.9);ctx.lineWidth=7*u;ctx.strokeStyle='#7a6450';ctx.lineCap='round';ctx.stroke();
  for(const x of[-.5,.55]){ctx.beginPath();ctx.ellipse(x,.98,.22,.12,0,0,TAU);ctx.fillStyle='#8e7560';ctx.fill();contorno('#4a3a2c',u,4);}
  ctx.beginPath();ctx.moveTo(-.95,.85);ctx.arc(0,.6,.97,PI*.98,TAU*1.0);ctx.lineTo(.95,.85);ctx.closePath();
  let g=ctx.createLinearGradient(0,-.4,0,.9);g.addColorStop(0,'#d9c4a6');g.addColorStop(1,'#8e7560');ctx.fillStyle=g;ctx.fill();contorno('#4a3a2c',u,7);
  ctx.save();ctx.beginPath();ctx.arc(0,.6,.97,PI,TAU);ctx.clip();
  ctx.strokeStyle='rgba(74,58,44,.6)';ctx.lineWidth=3.5*u;
  for(let i=-3;i<=3;i++){ctx.beginPath();ctx.ellipse(i*.3,.6,.15,1,0,0,TAU);ctx.stroke();}
  ctx.restore();
  brilho(-.2,-.2,.3,.1,-.4,.5);
  /* cabeça */
  const hx=-1.0,hy=.4;
  ctx.beginPath();ctx.ellipse(hx-.2,hy+.1,.5,.38,.15,0,TAU);ctx.fillStyle='#e8d6bd';ctx.fill();contorno('#4a3a2c',u,5);
  ctx.beginPath();ctx.ellipse(hx-.62,hy+.16,.2,.15,0,0,TAU);ctx.fillStyle='#f4bfae';ctx.fill();contorno('#4a3a2c',u,3.5);
  ctx.beginPath();ctx.ellipse(hx+.12,hy-.3,.14,.2,.3,0,TAU);ctx.fillStyle='#d4b996';ctx.fill();contorno('#4a3a2c',u,4);
  olhos(hx-.15,hy,.14,.095,look,blink,feliz);
},

/* CAPIZEN — capivara zen com laranja na cabeça */
capivara(a,t,u,look,blink,feliz){
  const resp=Math.sin(t*1.4+a.seed)*.03;
  for(const x of[-.55,.55]){ctx.beginPath();ctx.ellipse(x,1.0,.28,.14,0,0,TAU);ctx.fillStyle='#8a5a38';ctx.fill();contorno('#4d2f1b',u,5);}
  ctx.beginPath();ctx.ellipse(0,.55,1.0,.62+resp,0,0,TAU);let g=ctx.createLinearGradient(0,0,0,1);g.addColorStop(0,'#b98255');g.addColorStop(1,'#8a5a38');ctx.fillStyle=g;ctx.fill();contorno('#4d2f1b',u,7);
  const cab=()=>{ctx.beginPath();ctx.roundRect(-.82,-.62,1.64,1.15,.52);};
  cab();contorno('#4d2f1b',u,7);
  g=ctx.createLinearGradient(0,-.6,0,.5);g.addColorStop(0,'#c99163');g.addColorStop(1,'#a56f44');cab();ctx.fillStyle=g;ctx.fill();
  for(const s of[-1,1]){ctx.beginPath();ctx.arc(s*.66,-.62,.17,0,TAU);ctx.fillStyle='#a56f44';ctx.fill();contorno('#4d2f1b',u,4.5);ctx.beginPath();ctx.arc(s*.66,-.62,.08,0,TAU);ctx.fillStyle='#5c3a22';ctx.fill();}
  /* focinho */
  ctx.beginPath();ctx.ellipse(0,.22,.5,.3,0,0,TAU);ctx.fillStyle='#d9ac80';ctx.fill();contorno('#4d2f1b',u,3.5);
  for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(s*.17,.12,.08,.06,0,0,TAU);ctx.fillStyle='#3a2314';ctx.fill();}
  ctx.beginPath();ctx.moveTo(-.2,.34);ctx.quadraticCurveTo(0,.45,.2,.34);ctx.lineWidth=3*u;ctx.strokeStyle='#4d2f1b';ctx.stroke();
  /* olhos fechados, paz interior */
  olhos(0,-.18,.4,.12,look,0,true);
  bochechas(0,.05,.62,.1,'rgba(255,140,110,.4)');
  brilho(-.4,-.5,.25,.08,-.3,.35);
  /* laranja equilibrada */
  ctx.save();ctx.translate(0,-.92+Math.sin(t*1.4)*.015);
  ctx.beginPath();ctx.arc(0,0,.3,0,TAU);const go=ctx.createRadialGradient(-.1,-.1,.03,0,0,.3);go.addColorStop(0,'#ffc15a');go.addColorStop(1,'#f07d1a');ctx.fillStyle=go;ctx.fill();contorno('#a24a0a',u,4);
  ctx.beginPath();ctx.ellipse(.12,-.3,.12,.06,-.5,0,TAU);ctx.fillStyle='#3fae4c';ctx.fill();
  brilho(-.1,-.1,.07,.04,-.5,.6);ctx.restore();
  /* vapor zen */
  for(let i=0;i<3;i++){const f=(t*.3+i*.33)%1;ctx.beginPath();ctx.moveTo(-.15+i*.15,-1.25-f*.5);ctx.quadraticCurveTo(-.05+i*.15,-1.35-f*.5,-.15+i*.15,-1.45-f*.5);ctx.strokeStyle='rgba(255,236,200,'+(.5*(1-f))+')';ctx.lineWidth=2*u;ctx.stroke();}
}
};
if(OV)OV.installForms(FORMAS,ctx);
const COR_NIVEL=['#ffbf70','#c3e88e','#ffd9a8','#9fe3ff','#ffd24a'];
function olhosNucleo(look,bl,feliz,sep,rx,ry,y){
  if(feliz||bl>.55){for(const s of[-1,1]){ctx.beginPath();ctx.arc(s*sep,y+.02,rx*1.1,PI*1.1,PI*1.9);ctx.lineWidth=.09;ctx.lineCap='round';ctx.strokeStyle='#1a1410';ctx.stroke();}return;}
  for(const s of[-1,1]){
    const x=s*sep+look.x*.05,yy=y+look.y*.05;
    ctx.beginPath();ctx.ellipse(x,yy,rx,ry,0,0,TAU);ctx.fillStyle='#1a1410';ctx.fill();
    ctx.beginPath();ctx.arc(x-rx*.3,yy-ry*.38,rx*.36,0,TAU);ctx.fillStyle='#fff';ctx.fill();
    ctx.beginPath();ctx.arc(x+rx*.3,yy+ry*.25,rx*.18,0,TAU);ctx.fill();
  }
}
function corpoFantasma(){
  ctx.beginPath();ctx.moveTo(-1,.5);ctx.bezierCurveTo(-1.08,-1.45,1.08,-1.45,1,.5);
  ctx.quadraticCurveTo(1,1,.55,1);ctx.quadraticCurveTo(.28,1,0,.84);ctx.quadraticCurveTo(-.28,1,-.55,1);ctx.quadraticCurveTo(-1,1,-1,.5);ctx.closePath();
}
function nucleoCriaturas(nv,t,u,est){
  let g;const cor=COR_NIVEL[nv-1],look=est.look,bl=est.blink,feliz=est.feliz,prog=est.prog;
  if(nv===1){                                   /* SEMENTE: ovo que brilha por dentro */
    const bal=Math.sin(t*2.4)*.05;ctx.rotate(bal);
    const ovo=()=>{ctx.beginPath();ctx.moveTo(0,-1.2);ctx.bezierCurveTo(.9,-1.0,1.05,.2,.78,.7);ctx.bezierCurveTo(.5,1.15,-.5,1.15,-.78,.7);ctx.bezierCurveTo(-1.05,.2,-.9,-1.0,0,-1.2);ctx.closePath();};
    ovo();contorno('rgba(120,90,60,.7)',u,6);
    g=ctx.createRadialGradient(-.3,-.5,.1,0,0,1.3);g.addColorStop(0,'#fffaf0');g.addColorStop(.6,'#f2e4cc');g.addColorStop(1,'#cdb48e');ovo();ctx.fillStyle=g;ctx.fill();
    ctx.fillStyle='rgba(190,150,100,.3)';for(const [x,y,s] of[[-.4,.1,.12],[.35,-.35,.1],[.2,.5,.14],[-.2,-.6,.08]]){ctx.beginPath();ctx.arc(x,y,s,0,TAU);ctx.fill();}
    ctx.save();ovo();ctx.clip();
    ctx.beginPath();ctx.moveTo(-.2,-1.1);ctx.lineTo(.05,-.7);ctx.lineTo(-.15,-.45);ctx.lineTo(.12,-.1);ctx.lineTo(-.05,.2);
    ctx.lineWidth=(3+prog*3)*u;ctx.strokeStyle=hexA('#ffb040',.35+prog*.65);ctx.shadowColor='#ffb040';ctx.shadowBlur=10+prog*16;ctx.stroke();ctx.shadowBlur=0;
    ctx.restore();
    brilho(-.4,-.7,.2,.1,-.6,.55);
    for(const s of[-1,1]){ctx.beginPath();ctx.arc(s*.3,.2,.13,PI*.12,PI*.88);ctx.lineWidth=.07;ctx.lineCap='round';ctx.strokeStyle='#5a3c22';ctx.stroke();}
    bochechas(0,.42,.45,.1,'rgba(255,130,120,.4)');
    for(let i=0;i<3;i++){const f=(t*.4+i*.33)%1;ctx.font='bold .3px '+V('--ao-fonte-corpo');ctx.fillStyle='rgba(255,236,200,'+(1-f)+')';ctx.fillText('z',.75+f*.5,-.5-f*.8);}
  }
  else if(nv===2){                              /* BROTO: bebê slime com folhinhas */
    const sq=1+Math.sin(t*3)*.05;ctx.scale(sq,1/sq);ctx.translate(0,.12);
    const b=()=>{ctx.beginPath();ctx.moveTo(-.95,.55);ctx.bezierCurveTo(-1.05,-1.0,1.05,-1.0,.95,.55);ctx.quadraticCurveTo(.9,.95,.5,.95);ctx.quadraticCurveTo(0,.8,-.5,.95);ctx.quadraticCurveTo(-.9,.95,-.95,.55);ctx.closePath();};
    b();contorno('rgba(110,120,70,.65)',u,6);
    g=ctx.createRadialGradient(-.3,-.4,.1,0,0,1.2);g.addColorStop(0,'#ffffff');g.addColorStop(.7,'#f0f5dc');g.addColorStop(1,'#bccf90');b();ctx.fillStyle=g;ctx.fill();
    ctx.beginPath();ctx.moveTo(0,-.62);ctx.quadraticCurveTo(.05,-1.0,0,-1.2);ctx.lineWidth=.08;ctx.lineCap='round';ctx.strokeStyle='#4fa63c';ctx.stroke();
    for(const s of[-1,1]){const w=Math.sin(t*2.4+s)*.1;ctx.beginPath();ctx.moveTo(0,-1.18);ctx.quadraticCurveTo(s*.5,-1.5+w,s*.62,-1.15);ctx.quadraticCurveTo(s*.2,-1.0,0,-1.18);ctx.fillStyle='#6ccf4f';ctx.fill();contorno('#2f7a28',u,3);}
    brilho(-.42,-.55,.22,.1,-.6,.6);
    olhosNucleo(look,bl,feliz,.34,.17,.25,-.05);bochechas(0,.25,.62,.12,'rgba(255,130,150,.4)');boca(0,.27,.1,feliz);
  }
  else{                                         /* NV3+ mascote completo */
    if(nv>=5){                                  /* asas de luz */
      for(const s of[-1,1])for(let k=0;k<4;k++){
        ctx.save();ctx.translate(s*.85,.15);ctx.rotate(s*(.2+k*.38+Math.sin(t*2+k)*.04));
        ctx.beginPath();ctx.ellipse(0,-.8-k*.02,.17,.82-k*.12,0,0,TAU);
        const gw=ctx.createLinearGradient(0,0,0,-1.6);gw.addColorStop(0,'rgba(255,255,255,.95)');gw.addColorStop(1,'rgba(255,210,90,.7)');ctx.fillStyle=gw;ctx.fill();contorno('rgba(255,190,60,.8)',u,2.5);ctx.restore();
      }
    }
    if(nv>=4){                                  /* halo */
      ctx.beginPath();ctx.ellipse(0,nv>=5?-1.75:-1.4,.62,.15,0,0,TAU);ctx.lineWidth=5*u;ctx.strokeStyle='#ffe28a';ctx.shadowColor='#ffd24a';ctx.shadowBlur=14;ctx.stroke();ctx.shadowBlur=0;
    }
    corpoFantasma();contorno('rgba(120,100,80,.55)',u,6);
    g=ctx.createRadialGradient(-.35,-.55,.1,0,0,1.4);g.addColorStop(0,'#ffffff');g.addColorStop(.7,'#f1e8da');g.addColorStop(1,'#cdbfa9');corpoFantasma();ctx.fillStyle=g;ctx.fill();
    if(nv<5)for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*.55,-.95);ctx.quadraticCurveTo(s*.8,-1.3,s*.95,-1.05);ctx.lineWidth=6*u;ctx.strokeStyle='#cdbfa9';ctx.lineCap='round';ctx.stroke();ctx.beginPath();ctx.arc(s*.95,-1.05,.09,0,TAU);ctx.fillStyle=cor;ctx.fill();}
    brilho(-.45,-.62,.22,.1,-.6,.6);
    olhosNucleo(look,bl,feliz,.36,.17,.27,-.08);
    bochechas(0,.25,.62,.13,'rgba(255,130,150,.4)');boca(0,.28,.11,feliz);
    if(nv>=4){                                  /* terceiro olho */
      ctx.save();ctx.translate(0,-.58);ctx.beginPath();ctx.moveTo(0,-.12);ctx.lineTo(.1,0);ctx.lineTo(0,.12);ctx.lineTo(-.1,0);ctx.closePath();
      ctx.fillStyle='#7fe8ff';ctx.shadowColor='#7fe8ff';ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;ctx.restore();
      for(let i=0;i<3;i++){const aa=t*1.2+i*TAU/3,x=Math.cos(aa)*1.55,y=Math.sin(aa)*.45-.1;
        ctx.save();ctx.translate(x,y);ctx.rotate(t+i);ctx.beginPath();ctx.moveTo(0,-.14);ctx.lineTo(.1,0);ctx.lineTo(0,.14);ctx.lineTo(-.1,0);ctx.closePath();
        ctx.fillStyle=['#7fe8ff','#ffd24a','#ff9ad0'][i];ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.fill();ctx.restore();}
      ctx.shadowBlur=0;
    }
    if(nv>=5){                                  /* coroa */
      ctx.beginPath();ctx.moveTo(-.52,-.86);ctx.lineTo(-.55,-1.42);ctx.lineTo(-.27,-1.18);ctx.lineTo(0,-1.62);ctx.lineTo(.27,-1.18);ctx.lineTo(.55,-1.42);ctx.lineTo(.52,-.86);ctx.closePath();
      const gc=ctx.createLinearGradient(0,-1.6,0,-.86);gc.addColorStop(0,'#fff0a0');gc.addColorStop(1,'#e6a21a');ctx.fillStyle=gc;ctx.fill();contorno('#8a5a0a',u,4);
      for(const [x,y,c] of[[0,-1.0,'#ff4d6d'],[-.3,-1.05,'#4de0ff'],[.3,-1.05,'#4de0ff']]){ctx.beginPath();ctx.arc(x,y,.06,0,TAU);ctx.fillStyle=c;ctx.fill();}
    }
  }
  if(nuc.medo>0&&nv>=2){                          /* expressão de alerta: sobrancelhas firmes e gota de suor */
    ctx.lineCap='round';ctx.strokeStyle='#1a1410';ctx.lineWidth=.1;
    for(const sd of[-1,1]){ctx.beginPath();ctx.moveTo(sd*.62,-.52);ctx.lineTo(sd*.14,-.34);ctx.stroke();}
    ctx.fillStyle='rgba(127,232,255,.9)';ctx.beginPath();ctx.ellipse(.85,-.4+((t*2)%1)*.5,.07,.11,0,0,TAU);ctx.fill();
  }
  if(nuc.dano>0){ctx.fillStyle='rgba(255,70,90,'+Math.min(.45,nuc.dano*.5)+')';ctx.beginPath();ctx.arc(0,0,1.1,0,TAU);ctx.fill();}
}

const LISTA_FORMAS=['buraconegro','nuvem','blob','fantasma','aguaviva','cristal','redemoinho','gota','serpente','coruja','tatu','capivara'];
let estrelaCadente=null,proxCadente=3;
function cadente(dt,cor){
  if(reduz)return;
  proxCadente-=dt;
  if(proxCadente<0&&!estrelaCadente){estrelaCadente={x:W*(.1+Math.random()*.6),y:H*(.05+Math.random()*.3),t:0};proxCadente=5+Math.random()*7;}
  if(estrelaCadente){
    const e=estrelaCadente;e.t+=dt*1.3;const x=e.x+e.t*S*.5,y=e.y+e.t*S*.22;
    const g=ctx.createLinearGradient(x,y,x-S*.15,y-S*.065);g.addColorStop(0,hexA(cor,.95));g.addColorStop(1,hexA(cor,0));
    ctx.strokeStyle=g;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-S*.15,y-S*.065);ctx.stroke();
    luz(x,y,6,cor,.8);if(e.t>1)estrelaCadente=null;
  }
}
TEMAS.criaturas={
  id:'criaturas',nome:'Criaturas',cor:'#d98a52',
  css:{bg:'#0b0810',fg:'#f5ead8',suave:'#b9a98f',ac:'#d98a52',fonte:'var(--ao-fonte-corpo)',raio:'999px',chip:'rgba(18,14,11,.72)'},
  pal:{texto:'#f5ead8',suave:'#b9a98f',destaque:'#d98a52',ok:'#5fe3a1',alerta:'#ff6b81',onda:'#ffd9a8',escudo:'#7fe8ff',ordem:'#ffd86a',
    titulo:"'Caprasimo',Georgia,serif",corpo:"'Figtree',system-ui,sans-serif",mono:"'JetBrains Mono',ui-monospace,monospace",
    placaBg:'rgba(14,10,12,.84)',placaRaio:6,balaoBg:'rgba(250,242,228,.96)',balaoFg:'#2a1c14',
    nucleo:['#ffbf70','#c3e88e','#ffd9a8','#9fe3ff','#ffd24a']},
  niveis:['Semente','Broto','Guardião','Oráculo','Soberano'],
  sombra:true,halo:true,
  fundoEstatico(g,w,h){
    pintaBase(g,w,h,'#2a1b24','#150f1b','#07050b',.52);
    pintaNebulosas(g,w,h,['#5b2f86','#1f6a75','#9a4a1c','#7a2a63','#27458f','#2d7a5b'],11,13,.2);
    pintaViaLactea(g,w,h,-.42,'#ffe1be',1400,5);
    pintaVinheta(g,w,h,.7);
  },
  fundo(t,dt){
    estrelasVivas(t,['#ffffff','#ffd9a8','#bfd6ff']);
    cadente(dt,'#fff5e1');
    redeConstelacao(t,dt,AG.slice(0,6).map(a=>a.cor),1);
    velasFundo(dt,'#5fe3a1','#ff6b81',.14,.92,.12);
  },
  chao(t){
    ctx.save();
    for(let i=1;i<=5;i++){caminhoAnel(i*.26,-.18,90);ctx.strokeStyle=hexA('#d98a52',.16-i*.022);ctx.lineWidth=1;ctx.stroke();}
    noPlano(0,-.18,0,u=>{
      for(let i=0;i<28;i++){const a=i/28*TAU+t*.04,c=Math.cos(a),s=Math.sin(a);
        const g=ctx.createLinearGradient(c*.12,s*.12,c*1.35,s*1.35);g.addColorStop(0,'rgba(217,138,82,.12)');g.addColorStop(1,'rgba(217,138,82,0)');
        ctx.strokeStyle=g;ctx.lineWidth=u;ctx.beginPath();ctx.moveTo(c*.12,s*.12);ctx.lineTo(c*1.35,s*1.35);ctx.stroke();}
    });
    ctx.restore();
  },
  agente(a,t,u,inf){(FORMAS[a.forma]||FORMAS[LISTA_FORMAS[a.i%12]])(a,t,u,inf.look,inf.blink,inf.feliz);},
  escalaAgente:1,
  auraNucleo(cx,cy,r,nv,t,est){
    const cor=this.pal.nucleo[nv-1],rw=rMundo(r),yb=-rw*1.15;
    for(let i=0;i<3+Math.min(2,nv-1);i++){
      caminhoAnel(rw*(1.5+i*.5),yb,64);ctx.lineWidth=1.3;ctx.strokeStyle=hexA(cor,.55-i*.09);
      ctx.setLineDash(i%2?[3,8]:[14,10]);ctx.lineDashOffset=-t*(i%2?-14:18);ctx.stroke();
    }
    ctx.setLineDash([]);
    luz(cx,cy,r*(2.6+nv*.35),cor,.42+est.happy*.2+est.flash*.3);
    const pb=proj3(0,yb,0),g=ctx.createLinearGradient(0,pb.y,0,cy-r*1.6);g.addColorStop(0,hexA(cor,.22));g.addColorStop(1,hexA(cor,0));
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx-r*1.4,pb.y);ctx.lineTo(cx-r*.7,cy-r*1.6);ctx.lineTo(cx+r*.7,cy-r*1.6);ctx.lineTo(cx+r*1.4,pb.y);ctx.fill();
    if(nv>=5)aditivo(()=>{ctx.translate(cx,cy);ctx.rotate(t*.15);
      for(let i=0;i<14;i++){ctx.rotate(TAU/14);const gg=ctx.createLinearGradient(0,0,r*3.6,0);gg.addColorStop(0,'rgba(255,220,110,.3)');gg.addColorStop(1,'rgba(255,220,110,0)');
        ctx.fillStyle=gg;ctx.beginPath();ctx.moveTo(r*.6,-r*.08);ctx.lineTo(r*3.6,-r*.3);ctx.lineTo(r*3.6,r*.3);ctx.lineTo(r*.6,r*.08);ctx.fill();}});
  },
  nucleo(nv,t,u,est){nucleoCriaturas(nv,t,u,est);},
  frente(t){particulasFrente(t,'#ffd9a8');}
};

/* ================= TEMA: COSMOS (planetas iluminados pela estrela-núcleo) ================= */
const COSMO=(()=>{const r=mulberry(77);
  const linha=()=>{const pts=[];let lon=r()*TAU,lat=(r()-.5)*2.4;for(let i=0;i<8;i++){pts.push([lon,lat]);lon+=(r()-.5)*.8;lat=clamp(lat+(r()-.5)*.5,-1.4,1.4);}return pts;};
  const blob=rad=>{const lon=r()*TAU,lat=(r()-.5)*1.9,pts=[];for(let i=0;i<14;i++){const a=i/14*TAU,rr=rad*(.55+r()*.6);pts.push([lon+Math.cos(a)*rr/Math.max(.35,Math.cos(lat)),lat+Math.sin(a)*rr]);}return{lon,lat,pts};};
  const fib=[];const N=34;for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,rr=Math.sqrt(1-y*y),th=i*2.399963;fib.push([Math.atan2(Math.sin(th)*rr,Math.cos(th)*rr),Math.asin(y)]);}
  const fe=[];fib.forEach((p,i)=>{const d=fib.map((q,j)=>[j,Math.acos(clamp(Math.cos(p[1])*Math.cos(q[1])*Math.cos(p[0]-q[0])+Math.sin(p[1])*Math.sin(q[1]),-1,1))]).filter(x=>x[0]!==i).sort((a,b)=>a[1]-b[1]);
    for(let k=0;k<3;k++)if(i<d[k][0])fe.push([i,d[k][0]]);});
  return{rachas:Array.from({length:10},linha),continentes:Array.from({length:6},()=>blob(.5)),nuvens:Array.from({length:8},()=>blob(.32)),
    crateras:Array.from({length:12},()=>({lon:r()*TAU,lat:(r()-.5)*2.4,s:.06+r()*.14})),fib,fe};})();
function linhaEsf(pts,rot){ctx.beginPath();let on=false;for(const [lo,la] of pts){const p=esf(lo,la,rot);if(p.v>0){on?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);on=true;}else on=false;}}
function blobEsf(b,rot){const c=esf(b.lon,b.lat,rot);if(c.v<.22)return false;ctx.beginPath();b.pts.forEach(([lo,la],i)=>{const p=esf(lo,la,rot);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});ctx.closePath();return true;}
function crateras(rot,cor){for(const c of COSMO.crateras){const p=esf(c.lon,c.lat,rot);if(p.v<=.06)continue;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.y,p.x));
  ctx.beginPath();ctx.ellipse(0,0,c.s*p.v,c.s,0,0,TAU);ctx.fillStyle=cor;ctx.fill();ctx.beginPath();ctx.ellipse(c.s*.2*p.v,0,c.s*p.v*.8,c.s*.8,0,-PI/2,PI/2);ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=.025;ctx.stroke();ctx.restore();}}
/* esfera iluminada pela estrela (luz = direção da estrela na tela) */
function planeta(luzD,cores,rim,u,tex){
  ctx.save();ctx.beginPath();ctx.arc(0,0,1,0,TAU);ctx.clip();
  let g=ctx.createRadialGradient(luzD.x*.35,luzD.y*.35,.05,0,0,1.05);g.addColorStop(0,cores[0]);g.addColorStop(.65,cores[1]);g.addColorStop(1,cores[2]);
  ctx.fillStyle=g;ctx.fillRect(-1.1,-1.1,2.2,2.2);
  if(tex)tex();
  g=ctx.createLinearGradient(luzD.x,luzD.y,-luzD.x,-luzD.y);
  g.addColorStop(0,'rgba(255,255,255,.12)');g.addColorStop(.42,'rgba(0,0,0,0)');g.addColorStop(.62,'rgba(2,4,14,.7)');g.addColorStop(1,'rgba(2,4,14,.94)');
  ctx.fillStyle=g;ctx.fillRect(-1.1,-1.1,2.2,2.2);
  g=ctx.createRadialGradient(0,0,.55,0,0,1);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.4)');ctx.fillStyle=g;ctx.fillRect(-1.1,-1.1,2.2,2.2);
  ctx.restore();
  aditivo(()=>{
    ctx.beginPath();ctx.arc(0,0,1.015,0,TAU);ctx.lineWidth=3*u;
    const gr=ctx.createLinearGradient(luzD.x,luzD.y,-luzD.x,-luzD.y);gr.addColorStop(0,hexA(rim,.95));gr.addColorStop(.55,hexA(rim,0));ctx.strokeStyle=gr;ctx.stroke();
    const ga=ctx.createRadialGradient(0,0,.95,0,0,1.4);ga.addColorStop(0,hexA(rim,.3));ga.addColorStop(1,hexA(rim,0));ctx.fillStyle=ga;ctx.beginPath();ctx.arc(0,0,1.4,0,TAU);ctx.fill();
  });
}
function faixas(rot,cores,n,amp){for(let i=0;i<n;i++){const y=-1+i*(2/n)+Math.sin(i*1.7)*.04,h=2/n*.6;ctx.fillStyle=cores[i%cores.length];ctx.beginPath();ctx.moveTo(-1.1,y);
  for(let x=-1.1;x<=1.15;x+=.1)ctx.lineTo(x,y+Math.sin(x*4+rot*3+i)*amp);ctx.lineTo(1.1,y+h);ctx.lineTo(-1.1,y+h);ctx.closePath();ctx.fill();}}
const PLANETAS=[
  /* 0 gigante gasoso com tempestade */
  (a,t,u,f)=>{const rot=t*.16+a.i;planeta(f.luz,['#f6e2bf','#c9905c','#6e4126'],a.corT,u,()=>{faixas(rot,['rgba(120,60,30,.35)','rgba(255,240,215,.22)','rgba(170,90,50,.3)'],9,.025);
    const p=esf(1.2,-.35,rot);if(p.v>0){ctx.fillStyle='rgba(200,80,50,.8)';ctx.beginPath();ctx.ellipse(p.x,p.y,.2*p.v+.02,.1,0,0,TAU);ctx.fill();}});},
  /* 1 planeta com anéis */
  (a,t,u,f)=>{const rot=t*.12+a.i,anel=(i0,i1)=>{ctx.save();ctx.rotate(-.38);const cs=['#e8d4a8','#cdb48a','#fff0cf','#b89a6e','#e6cfa2','#9c8466'];
      for(let i=0;i<6;i++){if(i===2)continue;ctx.beginPath();ctx.ellipse(0,0,1.5+i*.12,.33+i*.026,0,i0,i1);ctx.lineWidth=6.5*u;ctx.strokeStyle=hexA(cs[i],.8);ctx.stroke();}ctx.restore();};
    anel(PI,TAU);planeta(f.luz,['#fff3d6','#e2c38c','#8a6a3c'],a.corT,u,()=>faixas(rot,['rgba(160,120,60,.25)','rgba(255,245,220,.2)'],8,.015));anel(0,PI);},
  /* 2 gelo */
  (a,t,u,f)=>{const rot=t*.1+a.i;planeta(f.luz,['#ffffff','#bfe6ff','#4f7fb8'],a.corT,u,()=>{ctx.strokeStyle='rgba(80,140,200,.55)';ctx.lineWidth=.035;
    COSMO.rachas.forEach(l=>{linhaEsf(l,rot);ctx.stroke();});ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.ellipse(0,-.92,.55,.16,0,0,TAU);ctx.fill();});},
  /* 3 lava */
  (a,t,u,f)=>{const rot=t*.13+a.i,pul=.6+.4*Math.sin(t*2+a.i);planeta(f.luz,['#5a2312','#2a0d08','#0e0302'],a.corT,u,()=>{
    aditivo(()=>{COSMO.rachas.forEach((l,i)=>{linhaEsf(l,rot);ctx.lineWidth=.09;ctx.strokeStyle=hexA('#ff5a1a',.35*pul);ctx.stroke();ctx.lineWidth=.035;ctx.strokeStyle=hexA('#ffcf6b',.9*pul);ctx.stroke();});});});
    luz(0,0,1.6,'#ff5a1a',.18*pul);},
  /* 4 oceano com continentes e nuvens */
  (a,t,u,f)=>{const rot=t*.14+a.i;planeta(f.luz,['#7cc4ff','#1d62c4','#0a2655'],a.corT,u,()=>{
    COSMO.continentes.forEach((b,i)=>{if(blobEsf(b,rot)){ctx.fillStyle=i%2?'#4f9a4a':'#7a8f3f';ctx.fill();}});
    COSMO.nuvens.forEach(b=>{if(blobEsf(b,rot*1.35)){ctx.fillStyle='rgba(255,255,255,.55)';ctx.fill();}});});},
  /* 5 deserto com crateras */
  (a,t,u,f)=>{const rot=t*.11+a.i;planeta(f.luz,['#f5cf98','#c98b52','#5e3519'],a.corT,u,()=>{faixas(rot,['rgba(140,80,40,.12)'],5,.04);crateras(rot,'rgba(110,60,25,.45)');});},
  /* 6 gasoso violeta com aurora */
  (a,t,u,f)=>{const rot=t*.17+a.i;planeta(f.luz,['#efd6ff','#9a68e0','#371866'],a.corT,u,()=>faixas(rot,['rgba(255,255,255,.12)','rgba(80,30,140,.25)'],7,.03));
    aditivo(()=>{for(let k=0;k<2;k++){ctx.beginPath();ctx.ellipse(0,-.78,.5+k*.08,.14+k*.03,0,PI*1.05,PI*1.95);ctx.lineWidth=(.07-k*.03);ctx.strokeStyle=hexA(k?'#ff7ad9':'#5dffb0',.6+.3*Math.sin(t*3+k));ctx.stroke();}});},
  /* 7 rochoso com lua */
  (a,t,u,f)=>{const rot=t*.1+a.i,m=t*1.1+a.i,mx=Math.cos(m)*1.75,my=Math.sin(m)*.45,lua=()=>{ctx.save();ctx.translate(mx,my);ctx.scale(.26,.26);planeta(f.luz,['#f2f2f2','#a8a8b0','#3a3a44'],'#ffffff',u*4,()=>crateras(rot*2,'rgba(60,60,70,.4)'));ctx.restore();};
    if(Math.sin(m)<0)lua();planeta(f.luz,['#c8fff0','#3fa891','#123d35'],a.corT,u,()=>crateras(rot,'rgba(10,50,40,.35)'));if(Math.sin(m)>=0)lua();},
  /* 8 cometa — a cauda sempre aponta para longe da estrela */
  (a,t,u,f)=>{const d={x:-f.luz.x,y:-f.luz.y},n={x:-d.y,y:d.x};
    aditivo(()=>{let g=ctx.createLinearGradient(0,0,d.x*3.4,d.y*3.4);g.addColorStop(0,'rgba(140,200,255,.55)');g.addColorStop(1,'rgba(140,200,255,0)');ctx.fillStyle=g;ctx.beginPath();
      ctx.moveTo(n.x*.35,n.y*.35);ctx.lineTo(d.x*3.4+n.x*.1,d.y*3.4+n.y*.1);ctx.lineTo(d.x*3.4-n.x*.1,d.y*3.4-n.y*.1);ctx.lineTo(-n.x*.35,-n.y*.35);ctx.fill();
      g=ctx.createLinearGradient(0,0,d.x*2.6,d.y*2.6);g.addColorStop(0,'rgba(255,225,170,.45)');g.addColorStop(1,'rgba(255,225,170,0)');ctx.fillStyle=g;ctx.beginPath();
      ctx.moveTo(n.x*.4,n.y*.4);ctx.quadraticCurveTo(d.x*1.4+n.x*.9,d.y*1.4+n.y*.9,d.x*2.6+n.x*1.3,d.y*2.6+n.y*1.3);ctx.lineTo(d.x*2.4+n.x*.6,d.y*2.4+n.y*.6);ctx.quadraticCurveTo(d.x*1.2+n.x*.2,d.y*1.2+n.y*.2,-n.x*.3,-n.y*.3);ctx.fill();});
    luz(0,0,1.25,'#9fd8ff',.55);ctx.save();ctx.scale(.5,.5);planeta(f.luz,['#e9f6ff','#8fa3b8','#2e3a48'],a.corT,u*2,()=>crateras(t*.2,'rgba(40,50,60,.4)'));ctx.restore();},
  /* 9 planeta de cristal facetado */
  (a,t,u,f)=>{const rot=t*.12+a.i;planeta(f.luz,['#f6f0ff','#a98bff','#2f1f6e'],a.corT,u,()=>{ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=.02;
    for(const [i,j] of COSMO.fe){const p=esf(COSMO.fib[i][0],COSMO.fib[i][1],rot),q=esf(COSMO.fib[j][0],COSMO.fib[j][1],rot);if(p.v>0&&q.v>0){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
    aditivo(()=>{COSMO.fib.forEach((p,i)=>{const q=esf(p[0],p[1],rot);if(q.v>.5&&(i+Math.floor(t*2))%7===0)luz(q.x,q.y,.18,'#ffffff',.9);});});});},
  /* 10 tóxico com redemoinhos */
  (a,t,u,f)=>{const rot=t*.15+a.i;planeta(f.luz,['#efffb8','#7fd13b','#1f4a0c'],a.corT,u,()=>{ctx.strokeStyle='rgba(30,70,10,.35)';ctx.lineWidth=.06;
    for(let k=0;k<4;k++){const p=esf(k*1.7,(k-1.5)*.45,rot);if(p.v<.15)continue;ctx.beginPath();for(let s=0;s<30;s++){const aa=s*.4+t,rr=s*.008*p.v;ctx.lineTo(p.x+Math.cos(aa)*rr*1.4,p.y+Math.sin(aa)*rr*.8);}ctx.stroke();}});},
  /* 11 pulsar com feixes girando */
  (a,t,u,f)=>{const b=t*2.6+a.i;aditivo(()=>{for(const s of[0,PI]){ctx.save();ctx.rotate(b+s);const g=ctx.createLinearGradient(0,0,3.6,0);g.addColorStop(0,'rgba(170,220,255,.55)');g.addColorStop(1,'rgba(170,220,255,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(.2,0);ctx.lineTo(3.6,-.45);ctx.lineTo(3.6,.45);ctx.closePath();ctx.fill();ctx.restore();}});
    for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(s*.75,0,.75,.55,0,0,TAU);ctx.strokeStyle='rgba(150,200,255,.2)';ctx.lineWidth=1.5*u;ctx.stroke();}
    luz(0,0,1.3,'#bfe6ff',.7);ctx.save();ctx.scale(.55,.55);planeta(f.luz,['#ffffff','#cfe8ff','#5f8fd0'],a.corT,u*1.8);ctx.restore();}
];
/* estrela-núcleo em 5 estágios */
function corpoEstrela(cores,rr,t,rot){
  let g=ctx.createRadialGradient(-rr*.2,-rr*.2,rr*.05,0,0,rr);g.addColorStop(0,cores[0]);g.addColorStop(.62,cores[1]);g.addColorStop(1,cores[2]);
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,rr,0,TAU);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(0,0,rr,0,TAU);ctx.clip();
  for(let i=0;i<80;i++){const p=esf(hash1(i)*TAU,(hash1(i+50)-.5)*2.8,rot);if(p.v<0)continue;
    ctx.fillStyle=i%2?'rgba(255,255,255,.07)':'rgba(140,50,0,.07)';ctx.beginPath();ctx.arc(p.x*rr,p.y*rr,rr*(.08+.06*hash1(i+9))*(.4+.6*p.v),0,TAU);ctx.fill();}
  g=ctx.createRadialGradient(0,0,rr*.6,0,0,rr);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(120,30,0,.25)');ctx.fillStyle=g;ctx.fillRect(-rr,-rr,rr*2,rr*2);
  ctx.restore();
}
function nucleoCosmos(nv,t,u,est){
  const pul=1+.03*Math.sin(t*2)+est.flash*.08,medo=est.medo>0?.5+.5*Math.sin(t*14):0;
  if(nv===1){
    aditivo(()=>{for(let i=0;i<170;i++){const arm=i%3,d=(i/170)*1.9+.1,ang=arm*TAU/3+d*2.4+t*.35,x=Math.cos(ang)*d,y=Math.sin(ang)*d*.62;
      const c=i%6===0?'#ffffff':(d<1?'#ff9ad5':'#7fb6ff'),s=(.06+.09*hash1(i))*(1.25-d*.3);
      const g=ctx.createRadialGradient(x,y,0,x,y,s*3);g.addColorStop(0,hexA(c,.45));g.addColorStop(1,hexA(c,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,s*3,0,TAU);ctx.fill();}});
    luz(0,0,.95*pul,'#ffd6f0',.6);luz(0,0,.28,'#ffffff',.95);
  }else if(nv===2){
    const disco=(i0,i1)=>aditivo(()=>{const cs=['#ff6a2a','#ff9a3d','#ffc36b','#ff7b4a','#c2410c'];for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(0,0,1.75-i*.18,.42-i*.04,-.15,i0,i1);ctx.lineWidth=.17-i*.02;ctx.strokeStyle=hexA(cs[i],.5);ctx.stroke();}
      for(let k=0;k<14;k++){const aa=t*.9+k*.45;if((Math.sin(aa)>0)!==(i0===0))continue;const x=Math.cos(aa)*1.45,y=Math.sin(aa)*.36;ctx.save();ctx.rotate(-.15);luz(x,y,.12,'#ffd08a',.8);ctx.restore();}});
    aditivo(()=>{for(const s of[-1,1]){const fl=.11+.04*Math.sin(t*9+s);const g=ctx.createLinearGradient(0,s*.4,0,s*2.5);g.addColorStop(0,'rgba(170,215,255,.7)');g.addColorStop(1,'rgba(170,215,255,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-fl,s*.4);ctx.lineTo(fl,s*.4);ctx.lineTo(.02,s*2.5);ctx.lineTo(-.02,s*2.5);ctx.fill();}});
    disco(PI,TAU);luz(0,0,1.3*pul,'#ff8a3d',.5);
    const g=ctx.createRadialGradient(-.15,-.15,.05,0,0,.62);g.addColorStop(0,'#fff1d6');g.addColorStop(.6,'#ff8a3d');g.addColorStop(1,'#a8320e');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,.62,0,TAU);ctx.fill();
    disco(0,PI);
  }else if(nv===3||nv===4){
    const azul=nv===4,rr=azul?1.12:1,cc=azul?['#ffffff','#bfe2ff','#4f8dff']:['#fffbe8','#ffd25a','#ff8a1f'],cor=azul?'#7fb6ff':'#ffb347';
    luz(0,0,2.8*pul,cor,.55);
    aditivo(()=>{for(let i=0;i<36;i++){const aa=i/36*TAU+t*.05,l=rr*(1.15+.55*ruido(i*3.1+t*.6));ctx.strokeStyle=hexA(cor,.22);ctx.lineWidth=.04;ctx.beginPath();ctx.moveTo(Math.cos(aa)*rr*.95,Math.sin(aa)*rr*.95);ctx.lineTo(Math.cos(aa)*l,Math.sin(aa)*l);ctx.stroke();}});
    if(azul)aditivo(()=>{for(let i=0;i<6;i++){const aa=i/6*PI+t*.03,len=4.2*(i%3===0?1:.55);ctx.save();ctx.rotate(aa);const g=ctx.createLinearGradient(-len,0,len,0);
      g.addColorStop(0,'rgba(190,225,255,0)');g.addColorStop(.5,'rgba(230,245,255,.75)');g.addColorStop(1,'rgba(190,225,255,0)');ctx.fillStyle=g;ctx.fillRect(-len,-.025,len*2,.05);ctx.restore();}
      for(let k=0;k<28;k++){const aa=t*.4+k/28*TAU,x=Math.cos(aa)*2,y=Math.sin(aa)*.5;if(Math.sin(aa)<0)luz(x,y,.08,'#bfe2ff',.7);}});
    corpoEstrela(cc,rr,t,t*.08);
    if(!azul)aditivo(()=>{for(let k=0;k<2;k++){const a0=t*.12+k*2.6,p1={x:Math.cos(a0)*rr,y:Math.sin(a0)*rr},p2={x:Math.cos(a0+.35)*rr,y:Math.sin(a0+.35)*rr},c={x:Math.cos(a0+.17)*rr*(1.5+.1*Math.sin(t*2+k)),y:Math.sin(a0+.17)*rr*(1.5+.1*Math.sin(t*2+k))};
      ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.quadraticCurveTo(c.x,c.y,p2.x,p2.y);ctx.lineWidth=.08;ctx.strokeStyle='rgba(255,90,40,.7)';ctx.stroke();ctx.lineWidth=.03;ctx.strokeStyle='rgba(255,210,120,.9)';ctx.stroke();}});
    if(azul)aditivo(()=>{for(let k=0;k<28;k++){const aa=t*.4+k/28*TAU,x=Math.cos(aa)*2,y=Math.sin(aa)*.5;if(Math.sin(aa)>=0)luz(x,y,.08,'#bfe2ff',.8);}});
  }else{
    aditivo(()=>{for(const s of[-1,1]){const g=ctx.createLinearGradient(0,0,0,s*5);g.addColorStop(0,'rgba(200,235,255,.85)');g.addColorStop(1,'rgba(160,200,255,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-.16,0);ctx.lineTo(.16,0);ctx.lineTo(.04,s*5);ctx.lineTo(-.04,s*5);ctx.fill();
      for(let i=0;i<4;i++){const k=(t*.45+i/4)%1;luz(0,s*(.5+k*4.3),.2*(1-k*.5),'#e6f4ff',.8*(1-k));}}});
    const cs=['#ffffff','#ffe6a0','#ff9a3d','#ff4d6d','#b66bff','#4f8dff'];
    const disco=(i0,i1)=>aditivo(()=>{ctx.save();ctx.rotate(-.12);for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(0,0,2.6-i*.28,.58-i*.06,0,i0,i1);ctx.lineWidth=.2-i*.018;ctx.strokeStyle=hexA(cs[i],.55);ctx.stroke();}
      ctx.beginPath();ctx.ellipse(0,0,2.3,.5,0,.1*PI,.5*PI);ctx.lineWidth=.12;ctx.strokeStyle='rgba(255,255,255,.5)';ctx.stroke();ctx.restore();});
    disco(PI,TAU);luz(0,0,3.2*pul,'#ffe6c4',.55);
    ctx.beginPath();ctx.arc(0,0,.66,0,TAU);ctx.lineWidth=.1;ctx.strokeStyle='#fff3cf';ctx.stroke();
    ctx.beginPath();ctx.arc(0,0,.56,0,TAU);ctx.fillStyle='#000';ctx.fill();
    aditivo(()=>{ctx.beginPath();ctx.ellipse(0,-.08,1.05,.85,0,PI*1.05,PI*1.95);ctx.lineWidth=.09;ctx.strokeStyle='rgba(255,220,150,.85)';ctx.stroke();});
    disco(0,PI);
  }
  if(medo)luz(0,0,1.8,'#ff2b4a',.35*medo);
  if(est.dano>0)luz(0,0,1.6,'#ffffff',est.dano*.6);
}
TEMAS.cosmos={
  id:'cosmos',nome:'Cosmos',cor:'#9fd3ff',
  css:{bg:'#03050c',fg:'#e8f1ff',suave:'#8ea3c4',ac:'#9fd3ff',fonte:'var(--ao-fonte-corpo)',raio:'999px',chip:'rgba(6,10,24,.72)'},
  pal:{texto:'#e8f1ff',suave:'#8ea3c4',destaque:'#9fd3ff',ok:'#7dffcf',alerta:'#ff6b81',onda:'#9fd3ff',escudo:'#7fffd8',ordem:'#ffd27a',
    titulo:"'Figtree',system-ui,sans-serif",corpo:"'Figtree',system-ui,sans-serif",mono:"'JetBrains Mono',ui-monospace,monospace",
    placaBg:'rgba(4,8,20,.8)',placaRaio:4,balaoBg:'rgba(225,238,255,.95)',balaoFg:'#0b1430',tituloPeso:'700 ',
    nucleo:['#ff9ad5','#ff8a3d','#ffc04a','#7fb6ff','#ffe6c4']},
  niveis:['Nebulosa','Protoestrela','Estrela','Gigante Azul','Quasar'],
  halo:false,escalaAgente:.9,escalaNucleo:.9,caudaAditiva:true,rastroLargura:.12,
  fundoEstatico(g,w,h){
    pintaBase(g,w,h,'#0a1024','#050814','#010205',.5);
    pintaNebulosas(g,w,h,['#1b2a6b','#4a1b5e','#0f4a63','#5e1b3a'],23,10,.16);
    pintaViaLactea(g,w,h,.35,'#cfe0ff',2200,9);
    pintaEstrelas(g,w,h,1600,4,['#ffffff','#cfe0ff','#ffe2c4']);
    const r=mulberry(31);
    for(let i=0;i<6;i++){const x=r()*w,y=r()*h,s=6+r()*16,a=r()*PI;g.save();g.translate(x,y);g.rotate(a);g.scale(1,.35+r()*.4);
      const gr=g.createRadialGradient(0,0,0,0,0,s);gr.addColorStop(0,'rgba(255,240,220,.35)');gr.addColorStop(1,'rgba(160,180,255,0)');g.fillStyle=gr;g.beginPath();g.arc(0,0,s,0,TAU);g.fill();g.restore();}
    pintaVinheta(g,w,h,.75);
  },
  fundo(t,dt){estrelasVivas(t,['#ffffff','#cfe0ff','#ffe2c4'],1.1);cadente(dt,'#d6ecff');},
  orbita(pts){
    for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],fr=clamp((a.prof+1)/2,0,1);ctx.strokeStyle=hexA('#9fc6ff',.05+fr*.16);ctx.lineWidth=.6+fr*.8;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  },
  agente(a,t,u,inf){PLANETAS[a.i%PLANETAS.length](a,t,u,inf);},
  auraNucleo(cx,cy,r,nv,t,est){
    const cor=this.pal.nucleo[nv-1];
    luz(cx,cy,r*(5+nv),cor,.18+est.flash*.15);
    if(nv>=3)aditivo(()=>{const L=r*(5+nv*1.4),g=ctx.createLinearGradient(cx-L,0,cx+L,0);g.addColorStop(0,hexA(cor,0));g.addColorStop(.5,hexA('#ffffff',.3));g.addColorStop(1,hexA(cor,0));
      ctx.fillStyle=g;ctx.fillRect(cx-L,cy-r*.035,L*2,r*.07);
      for(const [k,s] of[[.6,.12],[-.45,.08],[1.1,.05]])luz(cx+(CX-W/2-par.x*S*.3)*k+k*r*3,cy+k*r*.8,r*s*6,cor,.25);});
  },
  nucleo(nv,t,u,est){nucleoCosmos(5,t,u,est);},
  escudo(cx,cy,R,f,t,nv,rip,on){
    const c=mixHex('#ff4d6d','#7fffd8',f);
    ctx.save();ctx.globalAlpha*=on;
    const g=ctx.createRadialGradient(cx,cy,R*.6,cx,cy,R);g.addColorStop(0,hexA(c,0));g.addColorStop(1,hexA(c,.16));ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();
    aditivo(()=>{
      for(let i=1;i<=4;i++)for(const s of[-1,1]){const k=.25+i*.18;ctx.beginPath();ctx.ellipse(cx+s*R*k,cy,R*k,R*Math.min(.98,k*1.6),0,0,TAU);ctx.strokeStyle=hexA(c,.12);ctx.lineWidth=1;ctx.stroke();}
      for(const s of[-1,1])for(let k=0;k<34;k++){const aa=PI*(1.1+.8*k/33),x=cx+Math.cos(aa)*R*.55,y=cy+s*R*.72+Math.sin(aa)*R*.14*s,hh=R*(.12+.1*Math.sin(t*2.5+k*.5));
        const gg=ctx.createLinearGradient(x,y,x,y-s*hh);gg.addColorStop(0,hexA('#5dffb0',.5));gg.addColorStop(1,hexA('#ff7ad9',0));ctx.strokeStyle=gg;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-s*hh);ctx.stroke();}
      ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.lineWidth=2;ctx.strokeStyle=hexA(c,.8);ctx.stroke();
      rip.forEach(w=>{ctx.beginPath();ctx.arc(cx,cy,R,w.ang-.7*(1-w.t),w.ang+.7*(1-w.t));ctx.lineWidth=6*(1-w.t)+1;ctx.strokeStyle=hexA('#ffffff',1-w.t);ctx.stroke();
        luz(cx+Math.cos(w.ang)*R,cy+Math.sin(w.ang)*R,R*.5*(1-w.t*.5),c,.6*(1-w.t));});
      ctx.beginPath();ctx.arc(cx,cy,R*1.06+4,-PI/2,-PI/2+TAU*f);ctx.lineWidth=2.5;ctx.strokeStyle=hexA(c,.9);ctx.stroke();
    });
    ctx.restore();
  },
  tiro(s,t){
    if(s.tipo==='ataque'){luz(-4,0,16,'#ff6a2a',.7);ctx.rotate(s.t*5);ctx.beginPath();for(let i=0;i<9;i++){const a=i/9*TAU,rr=6+3*hash1(i+s.seed*9);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();
      ctx.fillStyle='#6b5a4a';ctx.fill();ctx.strokeStyle='#ffb27a';ctx.lineWidth=1;ctx.stroke();return;}
    if(s.tipo==='mercado'||s.tipo==='intercepta'||s.tipo==='ordem'){luz(0,0,14,s.cor,.8);aditivo(()=>{const g=ctx.createLinearGradient(-16,0,10,0);g.addColorStop(0,hexA(s.cor,0));g.addColorStop(1,'#ffffff');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(-3,0,13,2.2,0,0,TAU);ctx.fill();});return;}
    if(s.tipo==='fill'){luz(0,0,13,s.cor,.9);ctx.rotate(-s.ang);ctx.fillStyle='#fff';ctx.font='700 10px '+TEMA.pal.mono;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.ganho?'$':'!',0,.5);return;}
    luz(0,0,11,s.cor,.95);aditivo(()=>{ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(0,0,4.5,2,0,0,TAU);ctx.fill();});
  },
  frente(t){particulasFrente(t,'#cfe0ff',false);}
};

/* ================= TEMA: CYBER (terminal neon, drones wireframe) ================= */
const NEON=['#00f0ff','#39ff88','#ff2bd6','#ffe600','#8f7bff','#ff7a35','#00ffc8','#ff3864','#b6ff00','#5ad1ff','#ff9de2','#e8f7ff'];
const FORMAS_CYBER=['tetra','cubo','octa','ico','dode','prisma','piramide','bipir','toro','estrela','cubocta','esfera'];
const CHUVA=Array.from({length:46},(_,i)=>{const r=mulberry(i*13+7);return{x:r(),v:.08+r()*.18,o:r(),n:6+Math.floor(r()*10),s:Math.floor(r()*1000)};});
const GLIFOS='0123456789ABCDEF<>/$#%';
let scanImg=null,glitch=0;
function fazScan(){const c=document.createElement('canvas');c.width=4;c.height=4;const g=c.getContext('2d');g.fillStyle='rgba(0,0,0,.28)';g.fillRect(0,0,4,1);g.fillRect(0,2,4,1);scanImg=ctx.createPattern(c,'repeat');}
function nucleoCyber(nv,t,u,est){
  const medo=est.medo>0,cor=medo&&Math.sin(t*16)>0?'#ff3864':(nv>=5?'#ffffff':'#00f0ff'),cor2=medo?'#ff3864':'#ff2bd6';
  const jit=est.dano>0?(Math.random()-.5)*.15*est.dano:0;ctx.translate(jit,0);
  luz(0,0,1.6,cor,.35+est.flash*.3);
  /* anel de mira segmentado */
  aditivo(()=>{ctx.lineCap='butt';for(let k=0;k<2;k++){ctx.save();ctx.rotate((k?-1:1)*t*(.4+k*.3));const rr=1.55+k*.28,seg=k?24:12;
    for(let i=0;i<seg;i++){if((i+k)%3===0)continue;ctx.beginPath();ctx.arc(0,0,rr,i/seg*TAU,(i+.6)/seg*TAU);ctx.lineWidth=(k?2:3.5)*u;ctx.strokeStyle=hexA(k?cor2:cor,.75);ctx.stroke();}ctx.restore();}
    for(let i=0;i<48;i++){const aa=i/48*TAU,l=i%4===0?.12:.05;ctx.strokeStyle=hexA(cor,.4);ctx.lineWidth=1.2*u;ctx.beginPath();ctx.moveTo(Math.cos(aa)*2.0,Math.sin(aa)*2.0);ctx.lineTo(Math.cos(aa)*(2.0+l),Math.sin(aa)*(2.0+l));ctx.stroke();}});
  const sp=1+est.flash*.6+est.happy*.5;
  const forma=['tetra','cubo','octa','ico','dode'][nv-1];
  if(nv>=2)wire(POLI[['tetra','tetra','cubo','octa','ico'][nv-1]],t*.9*sp,-t*.7*sp,t*.3,cor2,u,1.6,.55);
  wire(POLI[forma],t*.4*sp,t*.6*sp,0,cor,u,2.2,1.05,{pontos:3.5});
  if(nv>=3)aditivo(()=>{for(let k=0;k<nv-2;k++){ctx.save();ctx.rotate(k*1.1+t*.2);ctx.scale(1,.28+.1*Math.sin(t+k));ctx.beginPath();ctx.arc(0,0,1.25+k*.12,0,TAU);ctx.lineWidth=2*u;ctx.strokeStyle=hexA(k%2?cor2:cor,.7);ctx.stroke();
    const aa=t*2+k*2;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(Math.cos(aa)*(1.25+k*.12),Math.sin(aa)*(1.25+k*.12),4*u,0,TAU);ctx.fill();ctx.restore();}});
  if(nv>=5)aditivo(()=>{for(let i=0;i<16;i++){const aa=i/16*TAU-t*.3,l=2.3+.4*Math.sin(t*3+i);ctx.strokeStyle=hexA(i%2?cor:cor2,.5);ctx.lineWidth=1.5*u;ctx.beginPath();ctx.moveTo(Math.cos(aa)*1.9,Math.sin(aa)*1.9);ctx.lineTo(Math.cos(aa)*l,Math.sin(aa)*l);ctx.stroke();}});
  /* olho do núcleo */
  const lk=est.look,o=.35+.08*Math.sin(t*4);
  aditivo(()=>{ctx.beginPath();ctx.arc(lk.x*.12,lk.y*.12,.2*o/.35,0,TAU);ctx.fillStyle=hexA(cor,.9);ctx.fill();ctx.beginPath();ctx.arc(lk.x*.15,lk.y*.15,.07,0,TAU);ctx.fillStyle='#ffffff';ctx.fill();});
}
TEMAS.cyber={
  id:'cyber',nome:'Cyber',cor:'#00f0ff',
  css:{bg:'#02040a',fg:'#c8f7ff',suave:'#5fa8b8',ac:'#00f0ff',fonte:'var(--ao-fonte-mono)',raio:'3px',chip:'rgba(2,8,16,.82)'},
  pal:{texto:'#c8f7ff',suave:'#5fa8b8',destaque:'#00f0ff',ok:'#39ff88',alerta:'#ff3864',onda:'#ff2bd6',escudo:'#00f0ff',ordem:'#ffe600',
    titulo:"'JetBrains Mono',ui-monospace,monospace",corpo:"'JetBrains Mono',ui-monospace,monospace",mono:"'JetBrains Mono',ui-monospace,monospace",tituloPeso:'700 ',
    placaBg:'rgba(0,10,18,.86)',placaRaio:1,balaoBg:'rgba(0,240,255,.92)',balaoFg:'#001018',
    nucleo:['#00f0ff','#00f0ff','#39ff88','#ff2bd6','#ffffff']},
  niveis:['Boot','Kernel','Daemon','Neural','Singularidade'],
  cores:NEON,halo:false,escalaAgente:.82,caudaAditiva:true,caudaPixel:true,rastroLargura:.0,
  fundoEstatico(g,w,h){
    const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#02030a');gr.addColorStop(.55,'#0a0420');gr.addColorStop(.62,'#2a0838');gr.addColorStop(1,'#03020a');
    g.fillStyle=gr;g.fillRect(0,0,w,h);
    const hz=h*.6,hg=g.createRadialGradient(w/2,hz,0,w/2,hz,w*.6);hg.addColorStop(0,'rgba(255,43,214,.35)');hg.addColorStop(1,'rgba(255,43,214,0)');g.fillStyle=hg;g.fillRect(0,0,w,h);
    /* skyline */
    const r=mulberry(9);let x=0;g.fillStyle='#05030e';
    while(x<w){const bw=12+r()*40,bh=h*(.03+r()*.12);g.fillRect(x,hz-bh,bw,bh);
      for(let k=0;k<bh/7;k++)for(let j=0;j<bw/6;j++)if(r()<.12){g.fillStyle=r()<.5?'rgba(0,240,255,.5)':'rgba(255,43,214,.45)';g.fillRect(x+2+j*6,hz-bh+3+k*7,2,2);g.fillStyle='#05030e';}
      x+=bw+r()*6;}
    pintaEstrelas(g,w,h*.5,300,3,['#9feaff','#ffffff']);
    pintaVinheta(g,w,h,.8);
  },
  fundo(t,dt){
    if(!scanImg)fazScan();
    ctx.font='12px '+this.pal.mono;ctx.textAlign='center';ctx.textBaseline='middle';
    for(const c of CHUVA){const x=c.x*W-par.x*S*.04,y0=H*.12+((c.o+t*c.v)%1.3-.15)*H*.5;
      for(let k=0;k<c.n;k++){const y=y0-k*14;if(y<H*.12||y>H*.6)continue;ctx.fillStyle=k===0?'rgba(220,255,255,.45)':hexA('#00f0ff',.2*(1-k/c.n));ctx.fillText(GLIFOS[(c.s+k*7+Math.floor(t*6))%GLIFOS.length],x,y);}}
  },
  chao(t,dt){
    const yb=-.62,st=.35,off=(t*.32)%st;ctx.save();ctx.lineWidth=1;
    for(let i=-10;i<=10;i++){const x=i*st;const a=proj3(x,yb,-3.5),b=proj3(x,yb,6);const g=ctx.createLinearGradient(a.x,a.y,b.x,b.y);g.addColorStop(0,'rgba(255,43,214,.45)');g.addColorStop(1,'rgba(255,43,214,0)');
      ctx.strokeStyle=g;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    for(let j=0;j<28;j++){const z=-3.5+j*st-off;if(z<-3.4)continue;const a=proj3(-3.5,yb,z),b=proj3(3.5,yb,z),al=clamp(1-(z+3.5)/9,0,1)*.5;ctx.strokeStyle=hexA('#ff2bd6',al);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    ctx.restore();
    velasFundo(dt,'#39ff88','#ff3864',.12,.95,.1);
  },
  orbita(pts,o,t){
    ctx.lineWidth=1.2;
    for(let i=1;i<pts.length;i++){if(i%3===0)continue;const a=pts[i-1],b=pts[i],fr=clamp((a.prof+1)/2,0,1);ctx.strokeStyle=hexA('#00f0ff',.06+fr*.3);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    for(let i=0;i<pts.length;i+=10){const p=pts[i];ctx.fillStyle=hexA('#00f0ff',.25+.4*clamp((p.prof+1)/2,0,1));ctx.fillRect(p.x-1.5,p.y-1.5,3,3);}
  },
  rastro(a,pts,r,al){for(let i=1;i<pts.length;i+=2){const p=pts[i],k=1-i/pts.length,s=Math.max(1.5,r*.14*k);ctx.fillStyle=hexA(a.corT,al*k*.8);ctx.fillRect(p.x-s/2,p.y-s/2,s,s);}},
  agente(a,t,u,inf){
    const P=POLI[FORMAS_CYBER[a.i%FORMAS_CYBER.length]],cor=a.corT,e=1+inf.carga*.35,sp=1+inf.carga*4;
    luz(0,0,1.5,cor,.25+inf.carga*.4);
    wire(P,t*.7*sp+a.i,t*.9*sp+a.i*2,t*.2,cor,u,1.7,.95*e,{pontos:2.6});
    aditivo(()=>{ctx.save();ctx.rotate(-t*1.5);ctx.beginPath();ctx.arc(0,0,1.25*e,0,PI*.5);ctx.lineWidth=2*u;ctx.strokeStyle=hexA(cor,.7);ctx.stroke();ctx.beginPath();ctx.arc(0,0,1.25*e,PI,PI*1.5);ctx.stroke();ctx.restore();
      ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(inf.look.x*.15,inf.look.y*.15,.1+.05*Math.sin(t*6+a.i),0,TAU);ctx.fill();});
    if(inf.feliz)aditivo(()=>{ctx.strokeStyle=hexA(cor,.9);ctx.lineWidth=2*u;ctx.strokeRect(-1.3,-1.3,2.6,2.6);});
  },
  auraNucleo(cx,cy,r,nv,t,est){
    const rw=rMundo(r),yb=-rw*1.3,cor=this.pal.nucleo[nv-1];
    for(let i=0;i<3;i++){caminhoAnel(rw*(1.4+i*.45),yb,48);ctx.strokeStyle=hexA(i%2?'#ff2bd6':cor,.6-i*.15);ctx.lineWidth=1.5;ctx.setLineDash([6,6]);ctx.lineDashOffset=t*(i%2?-20:20);ctx.stroke();}
    ctx.setLineDash([]);
    const pb=proj3(0,yb,0);aditivo(()=>{const g=ctx.createLinearGradient(0,pb.y,0,cy-r*3);g.addColorStop(0,hexA(cor,.3));g.addColorStop(1,hexA(cor,0));ctx.fillStyle=g;ctx.fillRect(cx-r*1.1,cy-r*3,r*2.2,pb.y-cy+r*3);});
  },
  nucleo(nv,t,u,est){nucleoCyber(nv,t,u,est);},
  escudo(cx,cy,R,f,t,nv,rip,on){
    const c=mixHex('#ff3864','#00f0ff',f);ctx.save();ctx.globalAlpha*=on;
    ctx.translate(cx,cy);ctx.scale(R,R);const u=1/R;
    wire(POLI.esfera,t*.3,t*.5,0,c,u,1.1,1);
    aditivo(()=>{ctx.beginPath();ctx.arc(0,0,1.02,0,TAU);ctx.lineWidth=2*u;ctx.strokeStyle=hexA(c,.8);ctx.stroke();
      rip.forEach(w=>{ctx.save();ctx.rotate(w.ang);const k=1-w.t;ctx.strokeStyle=hexA('#ffffff',k);ctx.lineWidth=3*u;ctx.strokeRect(.85,-.25*k,.25,.5*k);ctx.restore();});
      ctx.beginPath();ctx.arc(0,0,1.12,-PI/2,-PI/2+TAU*f);ctx.lineWidth=3*u;ctx.strokeStyle=hexA(c,.9);ctx.stroke();});
    ctx.scale(u,u);ctx.font='700 10px '+this.pal.mono;ctx.textAlign='center';ctx.fillStyle=hexA(c,.9);ctx.fillText('FIREWALL '+Math.round(f*100)+'%',0,-R*1.2);
    ctx.restore();
  },
  tiro(s,t){
    const c=s.cor;
    if(s.tipo==='ataque'){ctx.rotate(-s.ang);for(let i=0;i<4;i++){const j=(Math.random()-.5)*8;ctx.fillStyle=i%2?'#ff3864':'#ffffff';ctx.fillRect(-6+j,-6+i*3+j*.3,12-i*2,3);}luz(0,0,14,'#ff3864',.6);return;}
    luz(0,0,10,c,.7);
    if(s.tipo==='passe'){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-6,-5);ctx.lineTo(0,0);ctx.lineTo(-6,5);ctx.moveTo(1,-5);ctx.lineTo(7,0);ctx.lineTo(1,5);ctx.stroke();return;}
    if(s.tipo==='mercado'||s.tipo==='ordem'||s.tipo==='intercepta'){aditivo(()=>{ctx.fillStyle='#fff';ctx.fillRect(-14,-1.2,24,2.4);ctx.fillStyle=hexA(c,.6);ctx.fillRect(-20,-3,30,6);});return;}
    if(s.tipo==='fill'){ctx.rotate(-s.ang);ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.strokeRect(-7,-7,14,14);ctx.fillStyle=c;ctx.font='700 10px '+this.pal.mono;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.ganho?'$':'!',0,.5);return;}
    ctx.rotate(PI/4);ctx.fillStyle='#ffffff';ctx.fillRect(-3.5,-3.5,7,7);ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.strokeRect(-6,-6,12,12);
  },
  frente(t,dt){
    ctx.save();ctx.fillStyle=scanImg;ctx.globalAlpha=.5;ctx.fillRect(0,0,W,H);ctx.restore();
    if(ameaca.fase>0&&Math.random()<.08)glitch=.15;
    if(glitch>0&&!reduz){glitch-=dt;for(let i=0;i<5;i++){const y=Math.random()*H,h=4+Math.random()*24,dx=(Math.random()-.5)*30;
      ctx.drawImage(cv,0,y*DPR,cv.width,h*DPR,dx,y,W,h);}}
  }
};

/* ================= TEMA: BIO (microscópio) ================= */
const BIOC=['#7fffd4','#b4ff7a','#ffb3d1','#ffd36e','#9ad7ff','#d0a8ff','#7fe0ff','#ffa07a','#c6ff6b','#a0f0e0','#ffc6a8','#f0e68c'];
function bforma(n,rx,ry,amp,t,seed){ctx.beginPath();for(let i=0;i<=n;i++){const a=i/n*TAU,w=1+amp*(Math.sin(a*3+t*2+seed)*.5+Math.sin(a*5-t*1.3+seed*2)*.5);const x=Math.cos(a)*rx*w,y=Math.sin(a)*ry*w;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();}
function bfill(cor,u,lw){const g=ctx.createRadialGradient(-.3,-.35,.05,0,0,1.25);g.addColorStop(0,hexA(cor,.12));g.addColorStop(.7,hexA(cor,.3));g.addColorStop(1,hexA(cor,.55));
  ctx.fillStyle=g;ctx.fill();ctx.lineWidth=(lw||2.4)*u;ctx.strokeStyle=hexA(cor,.95);ctx.stroke();}
function granulos(n,rx,ry,t,seed,cor){for(let i=0;i<n;i++){const a=hash1(i+seed)*TAU+t*.3*(hash1(i+seed+3)-.5),d=Math.sqrt(hash1(i+seed+7))*.8;
  ctx.fillStyle=hexA(cor,.55);ctx.beginPath();ctx.arc(Math.cos(a)*d*rx,Math.sin(a)*d*ry,.035+.03*hash1(i+seed+11),0,TAU);ctx.fill();}}
function brilhoVidro(){ctx.beginPath();ctx.ellipse(-.35,-.45,.28,.1,-.6,0,TAU);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fill();}
const MICROBIOS=[
  /* 0 bacilo com flagelos */
  (a,t,u,f,c)=>{ctx.rotate(Math.atan2(f.dir.y,f.dir.x));
    for(let k=0;k<3;k++){ctx.beginPath();for(let s=0;s<=20;s++){const x=-1-s*.07,y=(k-1)*.18+Math.sin(s*.7-t*14+k)*.12*(s/20);s?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.lineWidth=1.6*u;ctx.strokeStyle=hexA(c,.7);ctx.stroke();}
    ctx.beginPath();ctx.roundRect(-1,-.44,2,.88,.44);bfill(c,u);granulos(9,.8,.3,t,a.i,c);brilhoVidro();},
  /* 1 cocos em cacho */
  (a,t,u,f,c)=>{const P=[[0,0],[.62,.1],[-.6,.15],[.25,-.55],[-.3,-.52],[.05,.6],[.6,-.45]];P.forEach(([x,y],i)=>{ctx.save();ctx.translate(x+Math.sin(t*2+i)*.04,y+Math.cos(t*1.7+i)*.04);
    ctx.beginPath();ctx.arc(0,0,.4,0,TAU);ctx.scale(.4,.4);bfill(c,u/.4);ctx.restore();ctx.fillStyle=hexA(c,.6);ctx.beginPath();ctx.arc(x-.1,y-.1,.06,0,TAU);ctx.fill();});},
  /* 2 espirilo */
  (a,t,u,f,c)=>{ctx.rotate(Math.atan2(f.dir.y,f.dir.x));ctx.beginPath();for(let s=0;s<=40;s++){const x=-1.3+s*.065,y=Math.sin(s*.45-t*8)*.38;s?ctx.lineTo(x,y):ctx.moveTo(x,y);}
    ctx.lineCap='round';ctx.lineWidth=.34;ctx.strokeStyle=hexA(c,.45);ctx.stroke();ctx.lineWidth=.1;ctx.strokeStyle=hexA(c,.95);ctx.stroke();
    ctx.beginPath();ctx.moveTo(1.3,Math.sin(40*.45-t*8)*.38);ctx.lineTo(1.7,Math.sin(t*10)*.2);ctx.lineWidth=1.4*u;ctx.stroke();},
  /* 3 ameba com pseudópodes */
  (a,t,u,f,c)=>{bforma(56,1,.88,.22,t*1.4,a.i);bfill(c,u);granulos(14,.7,.6,t,a.i*3,c);
    ctx.beginPath();ctx.arc(.15,-.05,.28,0,TAU);ctx.fillStyle=hexA('#6a3fa0',.5);ctx.fill();ctx.strokeStyle=hexA(c,.9);ctx.lineWidth=1.5*u;ctx.stroke();
    ctx.beginPath();ctx.arc(-.4,.3,.12+.05*Math.sin(t*3),0,TAU);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fill();},
  /* 4 diatomácea (vidro radial) */
  (a,t,u,f,c)=>{ctx.rotate(t*.3+a.i);ctx.beginPath();ctx.arc(0,0,.95,0,TAU);bfill(c,u);ctx.strokeStyle=hexA(c,.55);ctx.lineWidth=1*u;
    for(let i=0;i<32;i++){const aa=i/32*TAU;ctx.beginPath();ctx.moveTo(Math.cos(aa)*.2,Math.sin(aa)*.2);ctx.lineTo(Math.cos(aa)*.92,Math.sin(aa)*.92);ctx.stroke();}
    for(const rr of[.35,.6,.85]){ctx.beginPath();ctx.arc(0,0,rr,0,TAU);ctx.stroke();for(let i=0;i<32;i++){const aa=(i+.5)/32*TAU;ctx.fillStyle=hexA(c,.7);ctx.beginPath();ctx.arc(Math.cos(aa)*(rr-.12),Math.sin(aa)*(rr-.12),.025,0,TAU);ctx.fill();}}
    brilhoVidro();},
  /* 5 bacteriófago */
  (a,t,u,f,c)=>{ctx.rotate(Math.sin(t*1.5+a.i)*.15);ctx.translate(0,-.2);
    for(let k=0;k<6;k++){const s=k<3?-1:1,i=k%3,w=Math.sin(t*5+k)*.08;ctx.beginPath();ctx.moveTo(0,.75);ctx.lineTo(s*(.3+i*.15),.95+w);ctx.lineTo(s*(.5+i*.2),1.25+w);ctx.lineWidth=2*u;ctx.strokeStyle=hexA(c,.85);ctx.stroke();}
    ctx.beginPath();ctx.rect(-.1,0,.2,.75);bfill(c,u,1.6);for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(-.1,i*.13);ctx.lineTo(.1,i*.13);ctx.stroke();}
    ctx.beginPath();ctx.rect(-.25,.72,.5,.08);bfill(c,u,1.6);
    ctx.beginPath();for(let i=0;i<6;i++){const aa=i/6*TAU+PI/6;ctx.lineTo(Math.cos(aa)*.5,-.5+Math.sin(aa)*.5);}ctx.closePath();bfill(c,u);
    ctx.beginPath();for(let i=0;i<3;i++){const aa=i/3*TAU+PI/2;ctx.moveTo(0,-.5);ctx.lineTo(Math.cos(aa)*.5,-.5+Math.sin(aa)*.5);}ctx.lineWidth=1*u;ctx.stroke();},
  /* 6 paramécio com cílios */
  (a,t,u,f,c)=>{ctx.rotate(Math.atan2(f.dir.y,f.dir.x));
    for(let i=0;i<54;i++){const aa=i/54*TAU,x=Math.cos(aa)*1.1,y=Math.sin(aa)*.52,nx=Math.cos(aa),ny=Math.sin(aa)*2.1,l=Math.hypot(nx,ny),w=Math.sin(t*9-i*.45)*.5;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(nx/l*Math.cos(w)-ny/l*Math.sin(w))*.2,y+(ny/l*Math.cos(w)+nx/l*Math.sin(w))*.2);ctx.lineWidth=1*u;ctx.strokeStyle=hexA(c,.6);ctx.stroke();}
    ctx.beginPath();ctx.ellipse(0,0,1.1,.52,0,0,TAU);bfill(c,u);ctx.beginPath();ctx.moveTo(.6,-.1);ctx.quadraticCurveTo(0,.25,-.3,.05);ctx.strokeStyle=hexA(c,.8);ctx.lineWidth=2*u;ctx.stroke();
    for(const x of[-.65,.55]){const s=.12+.04*Math.sin(t*3+x);ctx.beginPath();for(let i=0;i<10;i++){const aa=i/10*TAU,rr=i%2?s*.4:s;ctx.lineTo(x+Math.cos(aa)*rr,-.12+Math.sin(aa)*rr);}ctx.closePath();ctx.fillStyle='rgba(255,255,255,.3)';ctx.fill();}
    granulos(10,.8,.32,t,a.i,c);brilhoVidro();},
  /* 7 euglena */
  (a,t,u,f,c)=>{ctx.rotate(Math.atan2(f.dir.y,f.dir.x));
    ctx.beginPath();ctx.moveTo(.95,0);for(let s=1;s<=20;s++){ctx.lineTo(.95+s*.06,Math.sin(s*.6-t*12)*.12*s/20);}ctx.lineWidth=1.5*u;ctx.strokeStyle=hexA(c,.8);ctx.stroke();
    const b=1+Math.sin(t*2)*.06;ctx.beginPath();ctx.moveTo(1,0);ctx.bezierCurveTo(.6,-.55*b,-.7,-.4*b,-1.15,0);ctx.bezierCurveTo(-.7,.4*b,.6,.55*b,1,0);bfill(c,u);
    for(let i=0;i<8;i++){ctx.fillStyle='rgba(90,200,80,.6)';ctx.beginPath();ctx.ellipse(-.6+i*.17,Math.sin(i*2)*.15,.08,.05,i,0,TAU);ctx.fill();}
    ctx.fillStyle='#ff4d4d';ctx.beginPath();ctx.arc(.65,-.08,.07,0,TAU);ctx.fill();brilhoVidro();},
  /* 8 volvox (colônia esférica) */
  (a,t,u,f,c)=>{ctx.beginPath();ctx.arc(0,0,1,0,TAU);bfill(c,u);const rot=t*.4+a.i;
    COSMO.fib.forEach(([lo,la])=>{const p=esf(lo,la,rot);if(p.v<0)return;ctx.fillStyle=hexA(c,.4+.5*p.v);ctx.beginPath();ctx.arc(p.x*.95,p.y*.95,.04+.03*p.v,0,TAU);ctx.fill();});
    for(const [x,y,r] of[[-.3,.2,.28],[.35,-.15,.22],[.05,.45,.18]]){ctx.beginPath();ctx.arc(x+Math.sin(t+x)*.05,y,r,0,TAU);ctx.fillStyle=hexA('#3fae4c',.45);ctx.fill();ctx.strokeStyle=hexA(c,.7);ctx.lineWidth=1*u;ctx.stroke();}
    brilhoVidro();},
  /* 9 radiolário (espinhos e treliça) */
  (a,t,u,f,c)=>{ctx.rotate(t*.2+a.i);ctx.strokeStyle=hexA(c,.75);ctx.lineWidth=1.2*u;
    for(let i=0;i<24;i++){const aa=i/24*TAU,l=1.05+.35*(i%2)+.05*Math.sin(t*2+i);ctx.beginPath();ctx.moveTo(Math.cos(aa)*.6,Math.sin(aa)*.6);ctx.lineTo(Math.cos(aa)*l,Math.sin(aa)*l);ctx.stroke();}
    ctx.beginPath();ctx.arc(0,0,.62,0,TAU);bfill(c,u);
    for(let i=0;i<12;i++){const aa=i/12*TAU;ctx.beginPath();for(let k=0;k<6;k++){const b=k/6*TAU;ctx.lineTo(Math.cos(aa)*.4+Math.cos(b)*.11,Math.sin(aa)*.4+Math.sin(b)*.11);}ctx.closePath();ctx.strokeStyle=hexA(c,.6);ctx.stroke();}
    luz(0,0,.35,c,.6);},
  /* 10 rotífero (coroa de cílios girando) */
  (a,t,u,f,c)=>{ctx.rotate(Math.atan2(f.dir.y,f.dir.x)+PI/2);
    ctx.beginPath();ctx.moveTo(-.45,-.4);ctx.quadraticCurveTo(-.55,.5,-.12,1.1);ctx.lineTo(.12,1.1);ctx.quadraticCurveTo(.55,.5,.45,-.4);ctx.closePath();bfill(c,u);
    for(const s of[-1,1]){ctx.save();ctx.translate(s*.32,-.55);ctx.beginPath();ctx.arc(0,0,.3,0,TAU);bfill(c,u,1.5);ctx.rotate(t*8*s);
      for(let i=0;i<12;i++){const aa=i/12*TAU;ctx.beginPath();ctx.moveTo(Math.cos(aa)*.3,Math.sin(aa)*.3);ctx.lineTo(Math.cos(aa+.3)*.48,Math.sin(aa+.3)*.48);ctx.lineWidth=1.2*u;ctx.strokeStyle=hexA(c,.8);ctx.stroke();}ctx.restore();}
    granulos(8,.3,.5,t,a.i,c);},
  /* 11 levedura brotando */
  (a,t,u,f,c)=>{const b=.25+.2*(.5+.5*Math.sin(t*.8+a.i));ctx.beginPath();ctx.ellipse(.75,-.55,b,b*.85,.6,0,TAU);bfill(c,u,1.8);
    ctx.beginPath();ctx.ellipse(0,0,.92,.75,.3,0,TAU);bfill(c,u);ctx.beginPath();ctx.arc(-.2,.05,.3,0,TAU);ctx.fillStyle='rgba(255,255,255,.2)';ctx.fill();
    for(const [x,y] of[[-.55,-.35],[.3,.45]]){ctx.beginPath();ctx.arc(x,y,.1,0,TAU);ctx.strokeStyle=hexA(c,.7);ctx.lineWidth=1.2*u;ctx.stroke();}
    granulos(8,.6,.5,t,a.i,c);brilhoVidro();}
];
const PART_BIO=Array.from({length:80},(_,i)=>{const r=mulberry(i*17+1);return{x:r(),y:r(),z:r(),s:r(),t:r()*TAU};});
function nucleoBio(nv,t,u,est){
  const medo=est.medo>0,cor=medo?'#ff8a9a':'#7fffd4',amp=(medo?.09:.035)+.01*nv;
  if(nv===1){
    const p=1+.03*Math.sin(t*1.5);ctx.scale(p,p);luz(0,0,1.5,'#7fffd4',.25+est.flash*.3);
    ctx.beginPath();ctx.arc(0,0,.85,0,TAU);const g=ctx.createRadialGradient(-.25,-.3,.05,0,0,.9);g.addColorStop(0,'rgba(220,255,240,.9)');g.addColorStop(1,'rgba(70,160,130,.75)');
    ctx.fillStyle=g;ctx.fill();ctx.lineWidth=.12;ctx.strokeStyle='#2f7a65';ctx.stroke();
    for(let i=0;i<44;i++){const aa=i/44*TAU;ctx.fillStyle='rgba(20,70,55,.6)';ctx.beginPath();ctx.arc(Math.cos(aa)*.85,Math.sin(aa)*.85,.035,0,TAU);ctx.fill();}
    granulos(10,.6,.6,t,3,'#2f7a65');brilhoVidro();
  }else{
    if(nv>=4)for(let i=0;i<80;i++){const aa=i/80*TAU,w=Math.sin(t*6-i*.4)*.45,l=.16+.05*nv;ctx.beginPath();ctx.moveTo(Math.cos(aa),Math.sin(aa));
      ctx.lineTo(Math.cos(aa)*(1+l)+Math.cos(aa+PI/2)*w*l*.8,Math.sin(aa)*(1+l)+Math.sin(aa+PI/2)*w*l*.8);ctx.lineWidth=1.3*u;ctx.strokeStyle=hexA(cor,.55);ctx.stroke();}
    bforma(80,1,1,amp,t,1);
    let g=ctx.createRadialGradient(-.3,-.35,.1,0,0,1.1);g.addColorStop(0,'rgba(200,255,240,.22)');g.addColorStop(.75,'rgba(90,200,175,.3)');g.addColorStop(1,hexA(cor,.55));ctx.fillStyle=g;ctx.fill();
    ctx.lineWidth=4*u;ctx.strokeStyle=hexA(cor,.95);ctx.stroke();bforma(80,.94,.94,amp,t,1);ctx.lineWidth=1.2*u;ctx.strokeStyle=hexA(cor,.5);ctx.stroke();
    const nr=.3+.04*nv,nx=est.look.x*.06,ny=est.look.y*.06;
    if(nv>=3){ctx.strokeStyle='rgba(255,170,200,.45)';ctx.lineWidth=2*u;for(let k=0;k<3;k++){ctx.beginPath();for(let i=0;i<=40;i++){const aa=-1+i/40*2.4+k*.2,rr=nr+.12+k*.08+Math.sin(i*1.1+t*2)*.02;i?ctx.lineTo(nx+Math.cos(aa)*rr,ny+Math.sin(aa)*rr):ctx.moveTo(nx+Math.cos(aa)*rr,ny+Math.sin(aa)*rr);}ctx.stroke();}
      for(const [x,y,r] of[[-.55,.35,.15],[.5,.5,.11]]){ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1*u;ctx.stroke();}}
    for(let i=0;i<2+nv;i++){const aa=t*.25+i*TAU/(2+nv),d=.66+.06*Math.sin(t+i),x=Math.cos(aa)*d,y=Math.sin(aa)*d;ctx.save();ctx.translate(x,y);ctx.rotate(aa+PI/2);
      ctx.beginPath();ctx.ellipse(0,0,.16,.07,0,0,TAU);ctx.fillStyle='rgba(255,140,90,.65)';ctx.fill();ctx.strokeStyle='rgba(255,200,150,.9)';ctx.lineWidth=1*u;ctx.stroke();
      ctx.beginPath();for(let k=0;k<6;k++)ctx.lineTo(-.12+k*.05,(k%2?.04:-.04));ctx.stroke();ctx.restore();}
    ctx.beginPath();ctx.arc(nx,ny,nr,0,TAU);g=ctx.createRadialGradient(nx-.08,ny-.08,.02,nx,ny,nr);g.addColorStop(0,'rgba(190,150,255,.85)');g.addColorStop(1,'rgba(90,50,160,.85)');ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle='rgba(220,200,255,.9)';ctx.lineWidth=2*u;ctx.stroke();
    if(nv>=5){ctx.strokeStyle='rgba(255,230,120,.95)';ctx.lineWidth=3*u;ctx.lineCap='round';for(let i=0;i<4;i++){const aa=t*.5+i*1.6,x=nx+Math.cos(aa)*nr*.45,y=ny+Math.sin(aa)*nr*.45;ctx.save();ctx.translate(x,y);ctx.rotate(aa);ctx.beginPath();ctx.moveTo(-.07,-.07);ctx.lineTo(.07,.07);ctx.moveTo(.07,-.07);ctx.lineTo(-.07,.07);ctx.stroke();ctx.restore();}}
    else{ctx.beginPath();ctx.arc(nx+.06,ny-.04,nr*.3,0,TAU);ctx.fillStyle='rgba(40,20,80,.8)';ctx.fill();}
    if(nv>=5)for(let k=0;k<4;k++){const aa=t*1.4+k*TAU/4;luz(Math.cos(aa),Math.sin(aa),.35,'#7fe8ff',.8);}
    brilhoVidro();
  }
  if(est.dano>0)luz(0,0,1.3,'#ff5d73',est.dano*.6);
}
TEMAS.bio={
  id:'bio',nome:'Bio',cor:'#7fffd4',
  css:{bg:'#010a0c',fg:'#d8fff4',suave:'#7fb8ad',ac:'#7fffd4',fonte:'var(--ao-fonte-corpo)',raio:'999px',chip:'rgba(2,20,22,.75)'},
  pal:{texto:'#d8fff4',suave:'#7fb8ad',destaque:'#7fffd4',ok:'#b4ff7a',alerta:'#ff5d73',onda:'#7fffd4',escudo:'#7fffd4',ordem:'#ffd36e',
    titulo:"'Figtree',system-ui,sans-serif",corpo:"'Figtree',system-ui,sans-serif",mono:"'JetBrains Mono',ui-monospace,monospace",tituloPeso:'700 ',
    placaBg:'rgba(2,24,26,.8)',placaRaio:10,balaoBg:'rgba(215,255,244,.94)',balaoFg:'#03201c',
    nucleo:['#7fffd4','#7fffd4','#9dffcf','#b4ff7a','#7fe8ff']},
  niveis:['Esporo','Célula','Organismo','Colônia','Simbionte'],
  cores:BIOC,halo:true,escalaAgente:.95,escalaNucleo:1.15,rastroLargura:0,
  fundoEstatico(g,w,h){
    pintaBase(g,w,h,'#0d4544','#062024','#010608',.5);
    const r=mulberry(41),s=Math.min(w,h);g.save();g.globalCompositeOperation='screen';
    for(let i=0;i<90;i++){const x=r()*w,y=r()*h,rad=s*(.02+r()*.08);const gr=g.createRadialGradient(x,y,0,x,y,rad);gr.addColorStop(0,'rgba(120,255,220,.06)');gr.addColorStop(1,'rgba(120,255,220,0)');g.fillStyle=gr;g.fillRect(x-rad,y-rad,rad*2,rad*2);}
    for(let i=0;i<16;i++){const x=r()*w,y=r()*h,rad=s*(.04+r()*.1);g.strokeStyle='rgba(160,255,230,'+(.03+r()*.05)+')';g.lineWidth=2+r()*4;g.beginPath();g.arc(x,y,rad,0,TAU);g.stroke();
      const gr=g.createRadialGradient(x,y,0,x,y,rad);gr.addColorStop(0,'rgba(120,255,220,.04)');gr.addColorStop(1,'rgba(120,255,220,0)');g.fillStyle=gr;g.fill();}
    g.restore();
    const gr=g.createRadialGradient(w/2,h/2,Math.max(w,h)*.42,w/2,h/2,Math.max(w,h)*.62);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.92)');g.fillStyle=gr;g.fillRect(0,0,w,h);
  },
  fundo(t,dt){
    aditivo(()=>{for(let i=0;i<3;i++){const x=W*(.5+.35*Math.sin(t*.07+i*2)),y=H*(.5+.3*Math.cos(t*.05+i*1.7)),r=S*.5;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(90,255,210,.05)');g.addColorStop(1,'rgba(90,255,210,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}});
    for(const p of PART_BIO){const x=((p.x+Math.sin(t*.3+p.t)*.02+t*.004*(p.z-.5))%1+1)%1*W-par.x*S*.06*p.z,y=((p.y+Math.cos(t*.25+p.t)*.02)%1+1)%1*H-par.y*S*.06*p.z,s=1+p.s*2.5*p.z;
      ctx.fillStyle=hexA('#a0ffe6',.08+.25*p.z);ctx.beginPath();ctx.arc(x,y,s,0,TAU);ctx.fill();if(p.z>.85){ctx.strokeStyle='rgba(160,255,230,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,s*5,0,TAU);ctx.stroke();}}
  },
  orbita(pts){for(let i=0;i<pts.length;i+=3){const p=pts[i],fr=clamp((p.prof+1)/2,0,1);ctx.fillStyle=hexA('#7fffd4',.06+fr*.22);ctx.beginPath();ctx.arc(p.x,p.y,1+fr,0,TAU);ctx.fill();}},
  rastro(a,pts,r,al){for(let i=2;i<pts.length;i+=3){const p=pts[i],k=1-i/pts.length;ctx.strokeStyle=hexA(a.corT,al*k*.6);ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x+Math.sin(i+tSim*3)*3,p.y-i*.4,1.5+r*.12*k,0,TAU);ctx.stroke();}},
  agente(a,t,u,inf){const c=a.corT;luz(0,0,1.6,c,.18+inf.carga*.4);MICROBIOS[a.i%MICROBIOS.length](a,t,u,inf,c);},
  auraNucleo(cx,cy,r,nv,t,est){
    luz(cx,cy,r*3.4,'#7fffd4',.2+est.flash*.25);
    for(let i=0;i<3;i++){const k=(t*.15+i/3)%1;ctx.beginPath();ctx.arc(cx,cy,r*(1.3+k*2.6),0,TAU);ctx.strokeStyle=hexA('#7fffd4',.18*(1-k));ctx.lineWidth=1.5;ctx.stroke();}
  },
  nucleo(nv,t,u,est){nucleoBio(nv,t,u,est);},
  escudo(cx,cy,R,f,t,nv,rip,on){
    const c=mixHex('#ff5d73','#7fffd4',f);ctx.save();ctx.globalAlpha*=on;
    const rr=a=>{let b=0;rip.forEach(w=>{const d=Math.atan2(Math.sin(a-w.ang),Math.cos(a-w.ang));b+=Math.exp(-d*d*8)*(1-w.t)*.12;});return 1-b+.012*Math.sin(a*9+t*3);};
    for(const k of[1,.9]){ctx.beginPath();for(let i=0;i<=120;i++){const a=i/120*TAU,q=R*k*rr(a);i?ctx.lineTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q):ctx.moveTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q);}
      ctx.lineWidth=2;ctx.strokeStyle=hexA(c,.75);ctx.stroke();
      for(let i=0;i<90;i++){const a=i/90*TAU,q=R*k*rr(a);ctx.fillStyle=hexA(c,.8);ctx.beginPath();ctx.arc(cx+Math.cos(a)*q,cy+Math.sin(a)*q,2.2,0,TAU);ctx.fill();}}
    const g=ctx.createRadialGradient(cx,cy,R*.6,cx,cy,R);g.addColorStop(0,hexA(c,0));g.addColorStop(1,hexA(c,.15));ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,R*1.07+4,-PI/2,-PI/2+TAU*f);ctx.lineWidth=3;ctx.lineCap='round';ctx.strokeStyle=hexA(c,.9);ctx.stroke();
    ctx.restore();
  },
  tiro(s,t){
    const c=s.cor;
    if(s.tipo==='ataque'){ctx.rotate(s.t*4);ctx.strokeStyle=c;ctx.lineWidth=1.5;for(let i=0;i<10;i++){const a=i/10*TAU;ctx.beginPath();ctx.moveTo(Math.cos(a)*5,Math.sin(a)*5);ctx.lineTo(Math.cos(a)*9,Math.sin(a)*9);ctx.stroke();ctx.beginPath();ctx.arc(Math.cos(a)*9.5,Math.sin(a)*9.5,1.6,0,TAU);ctx.fillStyle=c;ctx.fill();}
      ctx.beginPath();ctx.arc(0,0,5.5,0,TAU);ctx.fillStyle=hexA(c,.7);ctx.fill();return;}
    if(s.tipo==='intercepta'){ctx.rotate(PI/2);ctx.strokeStyle='#e8fffb';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(0,0);ctx.lineTo(-6,-7);ctx.moveTo(0,0);ctx.lineTo(6,-7);ctx.stroke();luz(0,0,10,'#7fe8ff',.6);return;}
    luz(0,0,10,c,.5);
    if(s.tipo==='ordem'){ctx.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;ctx.lineTo(Math.cos(a)*6,Math.sin(a)*6);}ctx.closePath();ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,1.8,0,TAU);ctx.fill();return;}
    if(s.tipo==='passe'){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,6,.5,TAU-.5);ctx.closePath();ctx.fillStyle=hexA(c,.8);ctx.fill();return;}
    if(s.tipo==='mercado'){ctx.beginPath();for(let i=0;i<10;i++)ctx.lineTo(-6-i*2,Math.sin(i-s.t*30)*2);ctx.strokeStyle=c;ctx.lineWidth=1.2;ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,8,3,0,0,TAU);ctx.fillStyle=hexA(c,.8);ctx.fill();return;}
    if(s.tipo==='fill'){ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fillStyle=hexA(c,.85);ctx.fill();ctx.beginPath();ctx.arc(-2,-2,2,0,TAU);ctx.fillStyle='rgba(255,255,255,.7)';ctx.fill();return;}
    ctx.beginPath();ctx.arc(0,0,5,0,TAU);ctx.fillStyle=hexA(c,.45);ctx.fill();ctx.strokeStyle='#ffffff';ctx.lineWidth=1.2;ctx.stroke();
  },
  frente(t){
    ctx.save();ctx.strokeStyle='rgba(160,255,230,.08)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(W*.08,CY);ctx.lineTo(W*.92,CY);ctx.moveTo(CX,H*.06);ctx.lineTo(CX,H*.94);ctx.stroke();
    for(let i=-20;i<=20;i++){const x=CX+i*S*.02;ctx.beginPath();ctx.moveTo(x,CY-(i%5?3:7));ctx.lineTo(x,CY+(i%5?3:7));ctx.stroke();}
    const bx=W*.06,by=H*.86,bw=S*.12;ctx.strokeStyle='rgba(216,255,244,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+bw,by);ctx.moveTo(bx,by-4);ctx.lineTo(bx,by+4);ctx.moveTo(bx+bw,by-4);ctx.lineTo(bx+bw,by+4);ctx.stroke();
    ctx.fillStyle='rgba(216,255,244,.75)';ctx.font='600 11px '+this.pal.mono;ctx.textAlign='left';ctx.textBaseline='bottom';ctx.fillText('10 µm',bx,by-7);ctx.textBaseline='top';ctx.fillText('400×  ·  CAMPO CLARO',bx,by+8);
    ctx.restore();
  }
};

/* ================= TEMA: ARCANO (espíritos elementais e orbe rúnico) ================= */
const ARC=['#ff7a3a','#4fc3ff','#d9a55a','#bff2e6','#ffe45c','#b48cff','#fff2b0','#7ee08a','#b8ecff','#9dff5c','#d6d6e6','#ff5ce1'];
const RUNAS_AR=Array.from({length:26},(_,i)=>{const r=mulberry(i*29+3);return{x:r(),y:r(),s:6+r()*8,t:r()*TAU,v:.004+r()*.01,seed:Math.floor(r()*999)};});
function chama(t,seed,cores,alt){
  for(let k=0;k<cores.length;k++){const s=1-k*.27;ctx.beginPath();const n=28;
    for(let i=0;i<=n;i++){const a=i/n*TAU,up=Math.max(0,-Math.sin(a));let r=.62*s*(1+up*(alt||1.3)*(1+.3*Math.sin(t*9+seed+k*1.3+i*.7)));
      const x=Math.cos(a)*r*.88,y=Math.sin(a)*r*.82+.28*s;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
    ctx.closePath();ctx.fillStyle=cores[k];ctx.fill();}
}
function anelRunas(rx,ry,tilt,fase,metade,cor,u,n){
  ctx.save();ctx.rotate(tilt);ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,metade?0:PI,metade?PI:TAU);ctx.lineWidth=2.5*u;ctx.strokeStyle=hexA(cor,.85);ctx.stroke();
  ctx.lineWidth=1.4*u;ctx.strokeStyle=hexA(cor,.9);
  for(let k=0;k<(n||10);k++){const a=fase+k/(n||10)*TAU;if((Math.sin(a)>=0)!==!!metade)continue;ctx.save();ctx.translate(Math.cos(a)*rx,Math.sin(a)*ry);ctx.scale(.08,.08);ctx.lineWidth=1.4*u/.08;runa(k+7);ctx.restore();}
  ctx.restore();
}
function estrelaPoli(n,pulo,r){ctx.beginPath();for(let i=0;i<=n;i++){const a=(i*pulo)/n*TAU-PI/2;i?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();}
function orbe(cores,u){const g=ctx.createRadialGradient(-.3,-.35,.05,0,0,1);g.addColorStop(0,cores[0]);g.addColorStop(.6,cores[1]);g.addColorStop(1,cores[2]);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,TAU);ctx.fill();
  ctx.beginPath();ctx.ellipse(-.35,-.45,.3,.12,-.6,0,TAU);ctx.fillStyle='rgba(255,255,255,.45)';ctx.fill();}
const ESPIRITOS=[
  /* 0 fogo */ (a,t,u,f,c)=>{luz(0,0,1.7,'#ff6a2a',.45);chama(t,a.i,['#ff4d1a','#ff9a2e','#ffe08a','#ffffff']);
    for(let i=0;i<5;i++){const k=(t*.8+i/5)%1;luz(Math.sin(i*3+t)*.4,-.5-k*1.4,.1*(1-k),'#ffb347',.9*(1-k));}},
  /* 1 água */ (a,t,u,f,c)=>{luz(0,0,1.5,'#4fc3ff',.35);ctx.save();ctx.scale(.8,.8);orbe(['#e6f9ff','#4fc3ff','#0b3d7a'],u);ctx.beginPath();ctx.arc(0,0,1,0,TAU);ctx.clip();
      ctx.beginPath();ctx.moveTo(-1,.1);for(let x=-1;x<=1.01;x+=.1)ctx.lineTo(x,.1+Math.sin(x*5+t*3)*.1);ctx.lineTo(1,1);ctx.lineTo(-1,1);ctx.fillStyle='rgba(20,90,180,.45)';ctx.fill();ctx.restore();
    for(let i=0;i<3;i++){const aa=t*1.6+i*TAU/3;ctx.save();ctx.translate(Math.cos(aa)*1.25,Math.sin(aa)*.4);ctx.beginPath();ctx.moveTo(0,-.16);ctx.quadraticCurveTo(.12,.02,0,.1);ctx.quadraticCurveTo(-.12,.02,0,-.16);ctx.fillStyle='#bfefff';ctx.fill();ctx.restore();}},
  /* 2 terra (cristais) */ (a,t,u,f,c)=>{luz(0,0,1.4,'#d9a55a',.3);const cr=(x,y,h,w,ang,c1,c2)=>{ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(0,-h);ctx.lineTo(w,-h*.65);ctx.lineTo(w,h*.5);ctx.lineTo(0,h*.7);ctx.lineTo(-w,h*.5);ctx.lineTo(-w,-h*.65);ctx.closePath();
      const g=ctx.createLinearGradient(-w,0,w,0);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='rgba(255,230,180,.6)';ctx.lineWidth=1.5*u;ctx.stroke();ctx.beginPath();ctx.moveTo(0,-h);ctx.lineTo(0,h*.7);ctx.stroke();ctx.restore();};
    ctx.translate(0,Math.sin(t*1.5+a.i)*.06);cr(-.4,.15,.6,.2,-.4,'#f2c98a','#7a4d1f');cr(.42,.2,.55,.18,.45,'#e8b874','#6b3f18');cr(0,-.05,.95,.26,0,'#ffe0a8','#8a5a24');
    for(let i=0;i<4;i++){const aa=t*.9+i*TAU/4;ctx.fillStyle='#8a6a48';ctx.beginPath();ctx.arc(Math.cos(aa)*1.2,Math.sin(aa)*.35+.3,.07,0,TAU);ctx.fill();}},
  /* 3 vento */ (a,t,u,f,c)=>{luz(0,0,1.3,'#bff2e6',.25);ctx.lineCap='round';for(let k=0;k<3;k++){ctx.save();ctx.rotate(t*2+k*TAU/3);ctx.beginPath();for(let i=0;i<=30;i++){const aa=i/30*PI*1.4,rr=.15+i/30*.95;i?ctx.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr*.75):ctx.moveTo(Math.cos(aa)*rr,Math.sin(aa)*rr*.75);}
      ctx.lineWidth=(4-k)*u*1.4;ctx.strokeStyle=hexA('#e8fffa',.75-k*.15);ctx.stroke();ctx.restore();}
    for(let i=0;i<3;i++){const aa=t*2.4+i*2.1;ctx.save();ctx.translate(Math.cos(aa)*1.1,Math.sin(aa)*.6);ctx.rotate(aa*2);ctx.beginPath();ctx.ellipse(0,0,.12,.05,0,0,TAU);ctx.fillStyle='#8fe0a0';ctx.fill();ctx.restore();}},
  /* 4 raio */ (a,t,u,f,c)=>{luz(0,0,1.6,'#ffe45c',.45);const r=mulberry(Math.floor(t*12)+a.i*100);aditivo(()=>{for(let k=0;k<4;k++){let x=0,y=0,aa=r()*TAU;ctx.beginPath();ctx.moveTo(0,0);
      for(let i=0;i<5;i++){aa+=(r()-.5)*1.2;x+=Math.cos(aa)*.24;y+=Math.sin(aa)*.24;ctx.lineTo(x,y);}ctx.lineWidth=3*u;ctx.strokeStyle='rgba(255,240,150,.9)';ctx.stroke();ctx.lineWidth=1.2*u;ctx.strokeStyle='#ffffff';ctx.stroke();}});
    ctx.save();ctx.scale(.45,.45);orbe(['#ffffff','#ffe45c','#b38a00'],u);ctx.restore();},
  /* 5 sombra */ (a,t,u,f,c)=>{luz(0,0,1.7,'#b48cff',.35);for(let i=0;i<6;i++){const aa=i/6*TAU+t*.4;ctx.beginPath();ctx.moveTo(Math.cos(aa)*.6,Math.sin(aa)*.6);
      for(let s=1;s<=10;s++){const rr=.6+s*.08;ctx.lineTo(Math.cos(aa+Math.sin(t*3+s*.5+i)*.25)*rr,Math.sin(aa+Math.sin(t*3+s*.5+i)*.25)*rr);}ctx.lineWidth=3*u;ctx.strokeStyle='rgba(60,20,110,.7)';ctx.stroke();}
    ctx.save();ctx.scale(.8,.8);orbe(['#3a1f6b','#160830','#050010'],u);ctx.restore();ctx.beginPath();ctx.arc(0,0,.8,0,TAU);ctx.lineWidth=2*u;ctx.strokeStyle='rgba(180,140,255,.8)';ctx.stroke();
    const bl=f.blink>.5||f.feliz;for(const s of[-1,1]){ctx.save();ctx.translate(s*.25+f.look.x*.08,-.05+f.look.y*.06);ctx.beginPath();ctx.ellipse(0,0,.14,bl?.02:.06,s*.25,0,TAU);ctx.fillStyle='#ff5ce1';ctx.fill();luz(0,0,.25,'#ff5ce1',.6);ctx.restore();}},
  /* 6 luz */ (a,t,u,f,c)=>{luz(0,0,2,'#fff2b0',.5);aditivo(()=>{ctx.save();ctx.rotate(t*.6);for(let i=0;i<8;i++){ctx.rotate(TAU/8);const l=i%2?1.1:1.6;const g=ctx.createLinearGradient(0,0,l,0);g.addColorStop(0,'rgba(255,250,220,.95)');g.addColorStop(1,'rgba(255,240,180,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(.2,-.08);ctx.lineTo(l,0);ctx.lineTo(.2,.08);ctx.fill();}ctx.restore();});ctx.save();ctx.scale(.42,.42);orbe(['#ffffff','#fff2b0','#e0b84a'],u);ctx.restore();},
  /* 7 natureza */ (a,t,u,f,c)=>{luz(0,0,1.4,'#7ee08a',.3);for(let k=0;k<2;k++){ctx.beginPath();for(let i=0;i<=40;i++){const aa=i/40*TAU*1.2+k*PI+t*.5,rr=.55+i/40*.55;i?ctx.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr*.8):ctx.moveTo(Math.cos(aa)*rr,Math.sin(aa)*rr*.8);}
      ctx.lineWidth=2.5*u;ctx.strokeStyle='#3f8a3a';ctx.stroke();for(let i=8;i<=40;i+=8){const aa=i/40*TAU*1.2+k*PI+t*.5,rr=.55+i/40*.55;ctx.save();ctx.translate(Math.cos(aa)*rr,Math.sin(aa)*rr*.8);ctx.rotate(aa+Math.sin(t*2+i)*.3);ctx.beginPath();ctx.ellipse(.1,0,.13,.06,0,0,TAU);ctx.fillStyle='#7ee08a';ctx.fill();ctx.restore();}}
    ctx.save();ctx.scale(.55,.55);orbe(['#eaffd8','#7ee08a','#1f5a22'],u);ctx.restore();},
  /* 8 gelo (floco) */ (a,t,u,f,c)=>{luz(0,0,1.5,'#b8ecff',.35);ctx.save();ctx.rotate(t*.35+a.i);ctx.lineCap='round';
    for(let i=0;i<6;i++){ctx.rotate(TAU/6);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-1.1);for(const y of[.35,.6,.85]){const l=.32*(1.1-y);ctx.moveTo(0,-y);ctx.lineTo(l,-y-l);ctx.moveTo(0,-y);ctx.lineTo(-l,-y-l);}
      ctx.lineWidth=5*u;ctx.strokeStyle='rgba(120,200,255,.45)';ctx.stroke();ctx.lineWidth=2*u;ctx.strokeStyle='#f2fbff';ctx.stroke();}ctx.restore();luz(0,0,.3,'#ffffff',.8);},
  /* 9 veneno */ (a,t,u,f,c)=>{luz(0,0,1.5,'#9dff5c',.3);ctx.save();ctx.scale(.78,.78);orbe(['#eaffc8','#7fd13b','#1f3f0a'],u);ctx.restore();
    for(let i=0;i<6;i++){const k=(t*.6+i/6)%1,x=Math.sin(i*2.3)*.45,y=.3-k*1.6,s=.08+.08*Math.sin(k*PI);ctx.beginPath();ctx.arc(x,y,s,0,TAU);ctx.strokeStyle=hexA('#c6ff6b',1-k);ctx.lineWidth=1.5*u;ctx.stroke();}
    const d=(t*.7+a.i)%1;ctx.beginPath();ctx.ellipse(.2,.78+d*.5,.05,.08,0,0,TAU);ctx.fillStyle=hexA('#9dff5c',1-d);ctx.fill();},
  /* 10 disco rúnico */ (a,t,u,f,c)=>{luz(0,0,1.4,'#d6d6e6',.25);ctx.save();ctx.rotate(t*.5);ctx.beginPath();for(let i=0;i<24;i++){const aa=i/24*TAU,r=i%2?.95:1.08;ctx.lineTo(Math.cos(aa)*r,Math.sin(aa)*r);}ctx.closePath();
    const g=ctx.createRadialGradient(-.3,-.3,.1,0,0,1.1);g.addColorStop(0,'#ffffff');g.addColorStop(.6,'#b8b8c8');g.addColorStop(1,'#55556a');ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle='#3a3a50';ctx.lineWidth=1.4*u;ctx.beginPath();ctx.arc(0,0,.62,0,TAU);ctx.stroke();for(let k=0;k<8;k++){ctx.save();ctx.rotate(k/8*TAU);ctx.translate(0,-.8);ctx.scale(.09,.09);ctx.lineWidth=1.4*u/.09;runa(k*3+a.i);ctx.restore();}ctx.restore();
    ctx.save();ctx.rotate(-t);ctx.scale(.3,.3);ctx.lineWidth=1.4*u/.3;ctx.strokeStyle='#ffd27a';runa(a.i+40);ctx.restore();},
  /* 11 vazio (portal) */ (a,t,u,f,c)=>{luz(0,0,1.6,'#ff5ce1',.35);ctx.save();ctx.scale(1,.75);ctx.beginPath();ctx.arc(0,0,.95,0,TAU);ctx.fillStyle='#08000f';ctx.fill();ctx.clip();
    aditivo(()=>{for(let k=0;k<5;k++){ctx.beginPath();for(let i=0;i<=30;i++){const aa=i/30*TAU*.8+k*TAU/5-t*2,rr=.95-i/30*.85;i?ctx.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr):ctx.moveTo(Math.cos(aa)*rr,Math.sin(aa)*rr);}ctx.lineWidth=3*u;ctx.strokeStyle=hexA(k%2?'#ff5ce1':'#8f7bff',.55);ctx.stroke();}});ctx.restore();
    ctx.beginPath();ctx.ellipse(0,0,.98,.74,0,0,TAU);ctx.lineWidth=4*u;ctx.strokeStyle='#ff9de2';ctx.stroke();}
];
function nucleoArcano(nv,t,u,est){
  const medo=est.medo>0,ouro='#ffd27a',vi='#b48cff';
  if(nv===1){luz(0,0,1.8,ouro,.45+est.flash*.3);ctx.scale(.85,.85);chama(t,1,['#ffb347','#ffd27a','#fff2c4','#ffffff'],1.1);
    for(let i=0;i<6;i++){const aa=t*1.5+i*TAU/6;luz(Math.cos(aa)*1.1,Math.sin(aa)*.35,.12,ouro,.8);}}
  else if(nv===2){luz(0,0,2,vi,.45+est.flash*.3);anelRunas(1.35,.32,0,t*.6,false,ouro,u,12);
    ctx.save();ctx.translate(0,Math.sin(t*1.6)*.06);ctx.scale(.55+.45*Math.abs(Math.cos(t*.8)),1);
    const P=[[0,-1.15],[.48,0],[0,1.15],[-.48,0]];ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    const g=ctx.createLinearGradient(-.5,-1,.5,1);g.addColorStop(0,'#f3e6ff');g.addColorStop(.5,'#9a6bff');g.addColorStop(1,'#2a0f6b');ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1.5*u;ctx.stroke();ctx.beginPath();ctx.moveTo(0,-1.15);ctx.lineTo(0,1.15);ctx.moveTo(-.48,0);ctx.lineTo(.48,0);ctx.stroke();ctx.restore();
    anelRunas(1.35,.32,0,t*.6,true,ouro,u,12);}
  else{
    const an=nv-2;
    if(nv>=5){aditivo(()=>{ctx.save();ctx.rotate(t*.1);estrelaPoli(7,3,2.4);ctx.lineWidth=2*u;ctx.strokeStyle='rgba(255,210,122,.55)';ctx.stroke();ctx.beginPath();ctx.arc(0,0,2.4,0,TAU);ctx.stroke();ctx.restore();
      for(let i=0;i<16;i++){ctx.save();ctx.rotate(i/16*TAU-t*.05);const g=ctx.createLinearGradient(1.1,0,3.4,0);g.addColorStop(0,'rgba(255,230,160,.25)');g.addColorStop(1,'rgba(255,230,160,0)');ctx.fillStyle=g;ctx.fillRect(1.1,-.04,2.3,.08);ctx.restore();}});}
    luz(0,0,2.2,vi,.45+est.flash*.3);
    for(let k=0;k<an;k++)anelRunas(1.45+k*.2,.3+k*.1,k*1.05+.35,t*(.5+k*.25)*(k%2?-1:1),false,k%2?vi:ouro,u,10);
    orbe(medo?['#ffd6dc','#ff4d6d','#3a0010']:['#f3e6ff','#7b4dff','#1d0b45'],u);
    ctx.save();ctx.beginPath();ctx.arc(0,0,.98,0,TAU);ctx.clip();aditivo(()=>{for(let k=0;k<4;k++){ctx.beginPath();for(let i=0;i<=30;i++){const aa=i/30*TAU*.9+k*TAU/4+t*1.2,rr=.1+i/30*.8;i?ctx.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr):ctx.moveTo(Math.cos(aa)*rr,Math.sin(aa)*rr);}
      ctx.lineWidth=3*u;ctx.strokeStyle=hexA(k%2?'#ff9de2':'#9fe3ff',.45);ctx.stroke();}});ctx.restore();
    if(nv>=5){const bl=est.blink>.5||est.feliz;ctx.beginPath();ctx.moveTo(-.55,0);ctx.quadraticCurveTo(0,bl?-.05:-.42,.55,0);ctx.quadraticCurveTo(0,bl?.05:.42,-.55,0);ctx.fillStyle='rgba(255,245,220,.9)';ctx.fill();
      if(!bl){ctx.beginPath();ctx.arc(est.look.x*.12,est.look.y*.08,.17,0,TAU);ctx.fillStyle='#ffb347';ctx.fill();ctx.beginPath();ctx.arc(est.look.x*.12,est.look.y*.08,.07,0,TAU);ctx.fillStyle='#1a0a2a';ctx.fill();}}
    else luz(0,0,.45,'#ffffff',.7);
    for(let k=0;k<an;k++)anelRunas(1.45+k*.2,.3+k*.1,k*1.05+.35,t*(.5+k*.25)*(k%2?-1:1),true,k%2?vi:ouro,u,10);
    if(nv>=4)for(let i=0;i<4;i++){const aa=t*.8+i*TAU/4,x=Math.cos(aa)*1.9,y=Math.sin(aa)*.6-.1;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t+i)*.3);ctx.beginPath();ctx.moveTo(0,-.2);ctx.lineTo(.08,0);ctx.lineTo(0,.2);ctx.lineTo(-.08,0);ctx.closePath();
      ctx.fillStyle=['#9fe3ff','#ffd27a','#ff9de2','#9dffcf'][i];ctx.fill();ctx.restore();luz(x,y,.25,['#9fe3ff','#ffd27a','#ff9de2','#9dffcf'][i],.5);}
  }
  if(medo)luz(0,0,1.8,'#ff2b4a',.3*(.5+.5*Math.sin(t*12)));
  if(est.dano>0)luz(0,0,1.5,'#ffffff',est.dano*.6);
}
TEMAS.arcano={
  id:'arcano',nome:'Arcano',cor:'#ffd27a',
  css:{bg:'#0b0616',fg:'#f3e6ff',suave:'#a99bc4',ac:'#ffd27a',fonte:'var(--ao-fonte-arcana)',raio:'6px',chip:'rgba(16,8,30,.78)'},
  pal:{texto:'#f3e6ff',suave:'#a99bc4',destaque:'#ffd27a',ok:'#9dffcf',alerta:'#ff5c7a',onda:'#ffd27a',escudo:'#ffd27a',ordem:'#ffd27a',
    titulo:"'Cinzel','Trajan Pro',Georgia,serif",corpo:"'Figtree',system-ui,sans-serif",mono:"'Cinzel','Trajan Pro',Georgia,serif",tituloPeso:'700 ',
    placaBg:'rgba(14,6,28,.84)',placaRaio:3,balaoBg:'rgba(255,244,220,.95)',balaoFg:'#2a1240',
    nucleo:['#ffd27a','#b48cff','#b48cff','#9fe3ff','#ffd27a']},
  niveis:['Fagulha','Runa','Orbe','Oráculo','Arquimago'],
  cores:ARC,halo:false,escalaAgente:.92,caudaAditiva:true,rastroLargura:0,
  fundoEstatico(g,w,h){
    pintaBase(g,w,h,'#2a1240','#120826','#05020c',.55);
    pintaNebulosas(g,w,h,['#4a1b7a','#1b3a6b','#6b1b5e','#1b5e5a'],61,9,.18);
    pintaEstrelas(g,w,h,900,8,['#ffffff','#ffe9c4','#d6c4ff']);
    const r=mulberry(12);g.strokeStyle='rgba(255,220,160,.12)';g.lineWidth=1;
    for(let c=0;c<5;c++){const cx=r()*w,cy=r()*h*.6,pts=[];for(let i=0;i<5;i++)pts.push([cx+(r()-.5)*w*.18,cy+(r()-.5)*h*.15]);g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();
      pts.forEach(p=>{g.fillStyle='rgba(255,236,200,.7)';g.beginPath();g.arc(p[0],p[1],1.6,0,TAU);g.fill();});}
    pintaVinheta(g,w,h,.75,'#05020c');
  },
  fundo(t,dt){
    aditivo(()=>{for(let i=0;i<4;i++){const x=((i*.3+t*.01*(i%2?1:-1))%1.4+1.4)%1.4*W-W*.2,y=H*(.35+.18*i),r=S*.45;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(150,110,220,.07)');g.addColorStop(1,'rgba(150,110,220,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}});
    estrelasVivas(t,['#ffffff','#ffe9c4','#d6c4ff'],.8);
    ctx.lineCap='round';
    for(const q of RUNAS_AR){const y=((q.y-t*q.v)%1+1)%1,al=.15+.35*Math.max(0,Math.sin(t*.6+q.t));ctx.save();ctx.translate(q.x*W-par.x*S*.05,y*H-par.y*S*.05);ctx.scale(q.s,q.s);ctx.lineWidth=1.3/q.s;ctx.strokeStyle=hexA('#ffd27a',al);runa(q.seed);ctx.restore();}
  },
  chao(t){
    const nv=nuc.nivel;
    aditivo(()=>noPlano(0,-.42,0,u=>{ctx.scale(.62,.62);u/=.62;ctx.rotate(t*.05);const c=hexA('#ffd27a',.14+.04*nv);ctx.strokeStyle=c;ctx.lineWidth=1.5*u;
      for(const rr of[1.3,1.16,.62]){ctx.beginPath();ctx.arc(0,0,rr,0,TAU);ctx.stroke();}
      estrelaPoli(7,3,1.16);ctx.stroke();estrelaPoli(6,2,.62);ctx.stroke();
      for(let i=0;i<28;i++){ctx.save();ctx.rotate(i/28*TAU);ctx.translate(0,-1.23);ctx.scale(.05,.05);ctx.lineWidth=1.5*u/.05;runa(i+100);ctx.restore();}
      ctx.rotate(-t*.12);for(let i=0;i<12;i++){ctx.save();ctx.rotate(i/12*TAU);ctx.translate(0,-.9);ctx.scale(.04,.04);ctx.lineWidth=1.5*u/.04;ctx.strokeStyle=hexA('#b48cff',.35);runa(i+300);ctx.restore();}}));
  },
  orbita(pts){ctx.setLineDash([1,7]);ctx.lineCap='round';for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],fr=clamp((a.prof+1)/2,0,1);ctx.strokeStyle=hexA('#ffd27a',.08+fr*.3);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.setLineDash([]);},
  rastro(a,pts,r,al){aditivo(()=>{for(let i=1;i<pts.length;i++){if((i+Math.floor(tSim*20))%3)continue;const p=pts[i],k=1-i/pts.length;luz(p.x+Math.sin(i*7)*r*.2,p.y+Math.cos(i*5)*r*.2,2+r*.15*k,a.corT,al*k*.7);}});},
  agente(a,t,u,inf){ESPIRITOS[a.i%ESPIRITOS.length](a,t,u,inf,a.corT);},
  auraNucleo(cx,cy,r,nv,t,est){
    const pb=proj3(0,-.42,0);aditivo(()=>{const g=ctx.createLinearGradient(0,pb.y,0,cy-r*4);g.addColorStop(0,'rgba(255,210,122,.25)');g.addColorStop(1,'rgba(255,210,122,0)');ctx.fillStyle=g;
      ctx.beginPath();ctx.moveTo(cx-r*1.6,pb.y);ctx.lineTo(cx-r*.5,cy-r*4);ctx.lineTo(cx+r*.5,cy-r*4);ctx.lineTo(cx+r*1.6,pb.y);ctx.fill();});
    luz(cx,cy,r*4,'#b48cff',.25+est.flash*.25);
  },
  nucleo(nv,t,u,est){nucleoArcano(nv,t,u,est);},
  escudo(cx,cy,R,f,t,nv,rip,on){
    const c=mixHex('#ff5c7a','#ffd27a',f);ctx.save();ctx.globalAlpha*=on;
    const g=ctx.createRadialGradient(cx,cy,R*.55,cx,cy,R);g.addColorStop(0,hexA(c,0));g.addColorStop(1,hexA(c,.2));ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();
    aditivo(()=>{ctx.translate(cx,cy);ctx.strokeStyle=hexA(c,.85);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(0,0,R*.9,0,TAU);ctx.lineWidth=1;ctx.stroke();
      ctx.save();ctx.rotate(t*.4);estrelaPoli(6,2,R*.9);ctx.strokeStyle=hexA(c,.25);ctx.stroke();for(let i=0;i<24;i++){ctx.save();ctx.rotate(i/24*TAU);ctx.translate(0,-R*.95);ctx.scale(R*.035,R*.035);ctx.lineWidth=1.5/(R*.035);ctx.strokeStyle=hexA(c,.9);runa(i+500);ctx.restore();}ctx.restore();
      rip.forEach(w=>{const k=1-w.t;ctx.beginPath();ctx.arc(0,0,R,w.ang-.6*k,w.ang+.6*k);ctx.lineWidth=7*k+1;ctx.strokeStyle=hexA('#ffffff',k);ctx.stroke();});
      ctx.beginPath();ctx.arc(0,0,R*1.07+4,-PI/2,-PI/2+TAU*f);ctx.lineWidth=3;ctx.strokeStyle=hexA(c,.9);ctx.stroke();});
    ctx.restore();
  },
  tiro(s,t){
    const c=s.cor;
    if(s.tipo==='ataque'){luz(0,0,16,'#ff2b4a',.55);ctx.rotate(PI);chama(t*1.5,s.seed*9,['#2a0010','#5a0a2a','#ff2b4a'],1.6);return;}
    if(s.tipo==='intercepta'||s.tipo==='ordem'){luz(0,0,12,'#ffd27a',.7);ctx.fillStyle='#fff7e0';ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(2,-4);ctx.lineTo(3,-1);ctx.lineTo(-10,-1);ctx.lineTo(-10,1);ctx.lineTo(3,1);ctx.lineTo(2,4);ctx.closePath();ctx.fill();return;}
    if(s.tipo==='fill'){luz(0,0,11,c,.8);ctx.rotate(-s.ang);ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fillStyle=s.ganho?'#ffd27a':'#ff5c7a';ctx.fill();ctx.save();ctx.scale(3,3);ctx.strokeStyle='#3a1a00';ctx.lineWidth=.4;estrelaPoli(5,2,1);ctx.stroke();ctx.restore();return;}
    luz(0,0,12,c,.75);ctx.rotate(-s.ang);ctx.save();ctx.scale(5,5);ctx.lineWidth=1.6/5;ctx.lineCap='round';ctx.strokeStyle='#ffffff';runa(Math.floor(s.seed*50));ctx.restore();
  },
  frente(t){particulasFrente(t,'#ffd27a',true);}
};

/* ================= GAME · PIXEL (arcade 8-bit) ================= */
const PX_FONTE="'Press Start 2P','Silkscreen',ui-monospace,monospace";
const PX_SPR=[
  /* 0 slime */[[ "..........","....bb....","...baab...","..baacab..",".baaaaaab.",".bawkawkab","baaaaaaaab","baraaaarab","baaabbaaab",".bbbbbbbb."],
               [ "..........","..........","...bbbb...","..baacab..",".baaaaaab.",".bawkawkab","baaaaaaaab","baraaaarab","baaabbaaab","bbbbbbbbbb"]],
  /* 1 morcego */[[ "b........b","ab..bb..ba","aab.aa.baa","aaabaabaaa",".aaawkwka.","..aaaaaa..","...aaaa...","....aa....","..........",".........."],
               [ "..........","....bb....","...baab...","..aaaaaa..","aaaawkwkaa","aa.aaaa.aa","a..aaaa..a","....aa....","..........",".........."]],
  /* 2 cavaleiro */[[ "...brrb...","..bccccb..",".bcaaaacb.",".baaaaaab.",".bkkkkkkb.",".baaaaaab.",".bacaacab.",".baaaaaab.","..bbbbbb..","...b..b..."]],
  /* 3 disco voador */[[ "..........","...bccb...","..bcwwcb..",".bbbbbbbb.","baaaaaaaab","bayaayaayb",".bbbbbbbb.","..c....c..","..........",".........."],
               [ "..........","...bccb...","..bcwwcb..",".bbbbbbbb.","baaaaaaaab","byaayaayab",".bbbbbbbb.","...c..c...","..........",".........."]],
  /* 4 fantasminha */[[ "...bbbb...","..baaaab..",".baaaaaab.",".bawkawkb.",".baaaaaab.",".baraarab.",".baaaaaab.",".baaaaaab.",".babaabab.",".b.b..b.b."],
               [ "...bbbb...","..baaaab..",".baaaaaab.",".bawkawkb.",".baaaaaab.",".baraarab.",".baaaaaab.",".baaaaaab.",".bbabbabb.","..b.bb.b.."]],
  /* 5 robô */[[ "....y.....","....b.....",".bbbbbbbb.",".bccccccb.",".bcwkcwkb.",".bccccccb.",".bckkkkcb.",".bbbbbbbb.","..baaaab..","..bb..bb.."],
               [ ".....y....","....b.....",".bbbbbbbb.",".bccccccb.",".bckwckwb.",".bccccccb.",".bckkkkcb.",".bbbbbbbb.","..baaaab..","..bb..bb.."]],
  /* 6 dragãozinho */[[ "..b...b...",".bab.bab..",".baaaaab..","baaaaaaab.","bawkaaaaab","baaaaaaaab","baaacccab.",".baaaaab..","..bbbbb...",".........."],
               [ "..b...b...",".bab.bab..",".baaaaab..","baaaaaaab.","bawkaaaaab","baaaaaaaab","baaarrrryy",".baaaaab..","..bbbbb...",".........."]],
  /* 7 olho */[[ "...bbbb...","..bwwwwb..",".bwwaawwb.","bwwakkawwb","bwwakkawwb",".bwwaawwb.","..bwwwwb..","...bbbb...","....r.r...","...r...r.."],
               [ "..........","..........","..........","bbbbbbbbbb","bwwakkawwb","..bbbbbb..","..........","..........","....r.r...","...r...r.."]],
  /* 8 caranguejo-bot */[[ "b........b","ab......ba",".ab.bb.ba.","..baaaab..",".bawkawkb.","baaaaaaaab",".baaaaaab.","b.b.bb.b.b","..........",".........."],
               [ "..........","b........b",".ab.bb.ba.","..baaaab..",".bawkawkb.","baaaaaaaab",".baaaaaab.",".b.b..b.b.","..........",".........."]],
  /* 9 abelha */[[ "..cc..cc..","..cc..cc..","..bbbbbbb.",".byykyykyb","bwkykyykyb",".byykyykyb","..bbbbbbb.","........b.","..........",".........."],
               [ "..........",".cc....cc.","..bbbbbbb.",".byykyykyb","bwkykyykyb",".byykyykyb","..bbbbbbb.","........b.","..........",".........."]],
  /* 10 caveira fofa */[[ "..bbbbbb..",".bwwwwwwb.","bwwwwwwwwb","bwkkwwkkwb","bwkkwwkkwb","bwwwkkwwwb",".bwwwwwwb.","..bwkwkb..","...bbbb...",".........."]],
  /* 11 gato */[[ ".b......b.","bab....bab","baabbbbaab","baaaaaaaab","bawkaawkab","baaarraaab","baaaaaaaab",".baaaaaab.","..bb..bb..",".........."],
               [ ".b......b.","bab....bab","baabbbbaab","baaaaaaaab","bakkaakkab","baaarraaab","baaaaaaaab",".baaaaaab.","..bb..bb..",".........."]]
];
const PX_NUC=[
  null,
  ["............","...bbbbbb...","..bccwcccb..",".bccwcccccb.","bbbbbbbbbbbb",".baaaaaaaab.","..baaaaaab..","...baaaab...","....baab....",".....bb.....","............","............"],
  ["............","..bb....bb..",".brrb..brrb.","brwrrbbrrrrb","brwrrrrrrrrb","brrrrrrrrrrb",".brrrrrrrrb.","..brrrrrrb..","...brrrrb...","....brrb....",".....bb.....","............"],
  ["............","y....y....y.","yy..yyy..yy.","yyy.yyy.yyy.","yyyyyyyyyyy.","yyrryyyrryy.","yyyyyyyyyyy.","ooooooooooo.","............","............","............","............"],
  ["..bbbbbbbb..","bbyyyyyyyybb","by.ywyyyyy.b","by.ywyyyyy.b",".byyyyyyyyb.","..byyyyyyb..","...byyyyb...","....byyb....",".....bb.....","....byyb....","..bbbbbbbb..","..boooooob.."]
];
function pixSprite(mapa,pal){const n=mapa.length,s=2/n,o=(mapa[0].length*s)/2;
  for(let y=0;y<n;y++){const row=mapa[y];for(let x=0;x<row.length;x++){const ch=row[x];if(ch==='.')continue;ctx.fillStyle=pal[ch]||'#ff00ff';ctx.fillRect(-o+x*s,-1+y*s,s+.006,s+.006);}}}
function pixCirculo(r,n,cor,fill){const s=2*r/n;ctx.fillStyle=cor;for(let y=0;y<n;y++)for(let x=0;x<n;x++){const dx=x+.5-n/2,dy=y+.5-n/2,d=Math.hypot(dx,dy);if(fill?d<n/2:Math.abs(d-n/2+.6)<.6)ctx.fillRect(-r+x*s,-r+y*s,s+.006,s+.006);}}
const palAg=c=>({a:c,c:mixHex(c,'#ffffff',.5),b:mixHex(c,'#000000',.72),w:'#ffffff',k:'#101018',r:'#ff6b81',y:'#ffe066',o:'#b8860b'});
const NUVENS_PX=Array.from({length:7},(_,i)=>{const r=mulberry(i*41+9);return{x:r(),y:.08+r()*.35,w:3+Math.floor(r()*5),v:.004+r()*.008,z:r()};});
TEMAS.pixel={
  id:'pixel',nome:'Pixel',cor:'#ff4fa3',grupo:'game',
  css:{bg:'#120a2a',fg:'#fff6d6',suave:'#a99bd6',ac:'#ff4fa3',fonte:'var(--ao-fonte-bloco)',raio:'0px',chip:'rgba(14,8,34,.85)'},
  pal:{texto:'#fff6d6',suave:'#a99bd6',destaque:'#ffd84a',ok:'#6dff7a',alerta:'#ff4f6a',onda:'#ff4fa3',escudo:'#4fd8ff',ordem:'#ffd84a',
    titulo:PX_FONTE,corpo:PX_FONTE,mono:PX_FONTE,tituloPeso:'',placaBg:'rgba(16,8,36,.92)',placaRaio:0,balaoBg:'#fff6d6',balaoFg:'#1a0f3a',
    nucleo:['#ffd84a','#4fd8ff','#ff4f6a','#ffd84a','#ffd84a']},
  niveis:['Moeda','Gema','Coração','Coroa','Troféu'],
  cores:['#6dff7a','#b07bff','#c0c8d8','#4fd8ff','#ffffff','#9fb3c8','#ff7a3a','#ff4fa3','#ff5a5a','#ffd84a','#f0e6d6','#ffb347'],
  halo:false,escalaAgente:.95,caudaPixel:true,rastroLargura:0,ligacoes:false,
  fundoEstatico(g,w,h){
    const bandas=['#120a2a','#160d34','#1b113f','#22164c','#2b1c5c','#37246d','#47307f','#5a3d8f'];
    bandas.forEach((c,i)=>{g.fillStyle=c;g.fillRect(0,h*i/bandas.length*.7,w,h*.7/bandas.length+1);});
    g.fillStyle='#5a3d8f';g.fillRect(0,h*.7,w,h*.3);
    const r=mulberry(77),q=Math.max(2,Math.round(Math.min(w,h)/220));
    for(let i=0;i<260;i++){g.fillStyle=r()<.2?'#ffe9a8':'#ffffff';g.globalAlpha=.3+r()*.7;g.fillRect(Math.round(r()*w/q)*q,Math.round(r()*h*.6/q)*q,q,q);}
    g.globalAlpha=1;
    const mx=w*.82,my=h*.2,mr=q*9;for(let y=-mr;y<=mr;y+=q)for(let x=-mr;x<=mr;x+=q){const d=Math.hypot(x,y);if(d<mr){g.fillStyle=d>mr-q*2?'#d8d0ff':((x*7+y*3)%11===0?'#c8c0f0':'#f4f0ff');g.fillRect(mx+x,my+y,q,q);}}
    const montes=(base,alt,cor,seed)=>{const rr=mulberry(seed);g.fillStyle=cor;let x=0;while(x<w){const bw=q*(6+Math.floor(rr()*14)),bh=alt*(.4+rr()*.6);for(let k=0;k<bw;k+=q){const hh=bh*(1-Math.abs(k/bw-.5)*2);g.fillRect(x+k,base-Math.round(hh/q)*q,q,h);}x+=bw;}};
    montes(h*.62,h*.22,'#2a1a55',3);montes(h*.7,h*.14,'#1c1040',5);
    g.fillStyle='rgba(0,0,0,.35)';for(let y=0;y<h;y+=q*2)g.fillRect(0,y,w,q*.5);
  },
  fundo(t,dt){
    estrelasVivas(t,['#ffffff','#ffe9a8'],.8);
    const q=Math.max(3,Math.round(S/160));
    for(const n of NUVENS_PX){const x=((n.x+t*n.v)%1.3-.15)*W-par.x*S*.05*n.z,y=n.y*H;ctx.fillStyle='rgba(220,210,255,'+(.12+.12*n.z)+')';
      for(let i=0;i<n.w;i++){ctx.fillRect(x+i*q*3,y,q*3,q*2);if(i>0&&i<n.w-1)ctx.fillRect(x+i*q*3,y-q*2,q*3,q*2);}}
  },
  chao(t){
    noPlano(0,-.5,0,u=>{const s=.24;for(let i=-7;i<=6;i++)for(let j=-7;j<=6;j++){const cx=(i+.5)*s,cz=(j+.5)*s,d=Math.hypot(cx,cz);if(d>1.55)continue;
      ctx.fillStyle=((i+j)&1)?'rgba(255,79,163,'+(.16*(1-d/1.6))+')':'rgba(79,216,255,'+(.12*(1-d/1.6))+')';ctx.fillRect(i*s,j*s,s,s);}});
  },
  orbita(pts){for(let i=0;i<pts.length;i+=4){const p=pts[i],fr=clamp((p.prof+1)/2,0,1),z=2+fr*2;ctx.fillStyle=hexA('#ffd84a',.1+fr*.4);ctx.fillRect(Math.round(p.x-z/2),Math.round(p.y-z/2),z,z);}},
  rastro(a,pts,r,al){for(let i=1;i<pts.length;i+=3){const p=pts[i],k=1-i/pts.length,z=Math.max(2,r*.18*k);ctx.fillStyle=hexA(a.corT,al*k*.8);ctx.fillRect(Math.round(p.x-z/2),Math.round(p.y-z/2),z,z);}},
  agente(a,t,u,inf){
    const fr=PX_SPR[a.i%PX_SPR.length],fi=Math.floor(t*4+a.i),f=fr[((fi%fr.length)+fr.length)%fr.length]||fr[0];if(!f)return;
    const pal=palAg(a.corT);if(inf.feliz){pal.k='#101018';}
    if(inf.carga>0)pal.a=mixHex(a.corT,'#ffffff',inf.carga*.7);
    const hop=Math.abs(Math.sin(t*4+a.i))*.12;ctx.translate(0,-hop);
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(-.6,1.05+hop,1.2,.12);
    pixSprite(f,pal);
  },
  auraNucleo(cx,cy,r,nv,t){
    const q=Math.max(3,r*.12);for(let i=0;i<10;i++){const a=i/10*TAU+t*.6,d=r*(1.9+.2*Math.sin(t*3+i)),on=Math.sin(t*5+i*2)>0;if(!on)continue;
      const x=Math.round((cx+Math.cos(a)*d)/q)*q,y=Math.round((cy+Math.sin(a)*d*.8)/q)*q;ctx.fillStyle=i%2?'#ffd84a':'#ffffff';ctx.fillRect(x,y,q,q);ctx.fillRect(x-q,y,q*3,q*.0+q);ctx.fillRect(x,y-q,q,q*3);}
  },
  nucleo(nv,t,u,est){
    const pal={b:'#2a1a00',y:'#ffd84a',o:'#b8860b',w:'#ffffff',r:'#ff4f6a',c:'#bff6ff',a:'#3fd0ff',k:'#101018'};
    const bob=Math.round(Math.sin(t*3)*2)/16;ctx.translate(0,bob);
    if(est.medo>0&&Math.sin(t*16)>0){pal.y='#ff8a8a';pal.a='#ff8a8a';pal.r='#ffffff';}
    if(nv===1){const sx=Math.max(.15,Math.abs(Math.cos(t*2.5)));ctx.save();ctx.scale(sx,1);pixCirculo(1,12,'#b8860b',true);ctx.scale(.85,.85);pixCirculo(1,12,est.flash>0?'#fff4b0':'#ffd84a',true);
      ctx.fillStyle='#b8860b';ctx.fillRect(-.12,-.55,.24,1.1);ctx.restore();}
    else pixSprite(PX_NUC[nv-1],pal);
    if(est.dano>0){ctx.fillStyle='rgba(255,255,255,'+est.dano*.6+')';ctx.fillRect(-1,-1,2,2);}
  },
  escudo(cx,cy,R,f,t,nv,rip,on){
    ctx.save();ctx.globalAlpha*=on;const q=Math.max(3,Math.round(R/14)),c=f>.5?'#4fd8ff':(f>.25?'#ffd84a':'#ff4f6a');
    for(let i=0;i<64;i++){const a=i/64*TAU+t*.3;let k=1;rip.forEach(w=>{const d=Math.atan2(Math.sin(a-w.ang),Math.cos(a-w.ang));if(Math.abs(d)<.4)k=1+(1-w.t)*.12;});
      const x=Math.round((cx+Math.cos(a)*R*k)/q)*q,y=Math.round((cy+Math.sin(a)*R*k)/q)*q;ctx.fillStyle=(i%4===0)?'#ffffff':c;ctx.fillRect(x,y,q,q);}
    const n=5,hw=q*3,x0=cx-n*hw*1.2/2;for(let i=0;i<n;i++){const cheio=f*n>i+.5;ctx.save();ctx.translate(x0+i*hw*1.2+hw/2,cy-R-q*5);ctx.scale(hw/2,hw/2);pixSprite(PX_NUC[2],{b:'#2a0010',r:cheio?'#ff4f6a':'#3a2a4a',w:cheio?'#ffffff':'#4a3a5a'});ctx.restore();}
    ctx.restore();
  },
  tiro(s,t){
    const q=4,c=s.cor;
    if(s.tipo==='ataque'){ctx.rotate(-s.ang);pixCirculo(7,7,'#1a1a1a',true);ctx.fillStyle='#ffd84a';ctx.fillRect(2,-10,3,3);if(Math.sin(t*30)>0){ctx.fillStyle='#ff4f6a';ctx.fillRect(4,-13,3,3);}ctx.fillStyle='#ffffff';ctx.fillRect(-4,-4,2,2);return;}
    if(s.tipo==='fill'){ctx.rotate(-s.ang);pixCirculo(6,6,s.ganho?'#ffd84a':'#ff4f6a',true);ctx.fillStyle='#2a1a00';ctx.fillRect(-1,-4,2,8);return;}
    if(s.tipo==='mercado'){ctx.fillStyle='#fff';ctx.fillRect(-14,-2,24,4);ctx.fillStyle=c;ctx.fillRect(-18,-4,6,8);return;}
    if(s.tipo==='ordem'||s.tipo==='intercepta'){ctx.fillStyle=s.tipo==='ordem'?'#ffd84a':'#ffffff';ctx.fillRect(-8,-1.5,14,3);ctx.fillRect(4,-4,3,8);ctx.fillRect(7,-2,3,4);return;}
    ctx.fillStyle=c;ctx.fillRect(-q*1.5,-q*1.5,q*3,q*3);ctx.fillStyle='#ffffff';ctx.fillRect(-q/2,-q/2,q,q);
  },
  frente(t){
    if(!scanImg)fazScan();ctx.save();ctx.fillStyle=scanImg;ctx.globalAlpha=.35;ctx.fillRect(0,0,W,H);ctx.restore();
    ctx.font=fonte('',Math.max(9,S*.016),PX_FONTE);ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle='#ffd84a';
    ctx.fillText('SCORE '+String(nuc.sinais*100+nuc.defesas*500).padStart(7,'0')+'   HI '+String(Math.max(99900,nuc.sinais*100)).padStart(7,'0'),CX,H*.085);
    if(Math.sin(t*3)>0&&nuc.nivel<2){ctx.fillStyle='#ff4fa3';ctx.fillText('PRESS START',CX,H*.9);}
  }
};

/* ================= GAME · DADOS (RPG de mesa) ================= */
const DD_FONTE="'MedievalSharp','Cinzel',Georgia,serif";
const DADO_TIPOS=['d4','d6','d8','d10','d12','d20'],DADO_MAX={d4:4,d6:6,d8:8,d10:10,d12:12,d20:20};
function poliReg(n,r,rot){const p=[];for(let i=0;i<n;i++){const a=rot+i/n*TAU;p.push([Math.cos(a)*r,Math.sin(a)*r]);}return p;}
function dadoForma(tipo){
  if(tipo==='d4')return{c:[[0,-1.05],[.95,.62],[-.95,.62]],l:[[0,0,0,-1.05],[0,0,.95,.62],[0,0,-.95,.62]],ny:.18};
  if(tipo==='d8')return{c:[[0,-1.1],[.85,0],[0,1.1],[-.85,0]],l:[[-.85,0,.85,0]],ny:-.32};
  if(tipo==='d10')return{c:[[0,-1.1],[.9,-.15],[.55,.75],[0,1.0],[-.55,.75],[-.9,-.15]],l:[[0,-1.1,-.4,.35],[0,-1.1,.4,.35],[-.4,.35,.4,.35],[-.4,.35,-.55,.75],[.4,.35,.55,.75],[-.4,.35,0,1],[.4,.35,0,1]],ny:-.05};
  if(tipo==='d12'){const o=poliReg(5,1,-PI/2),i=poliReg(5,.55,-PI/2),l=[];for(let k=0;k<5;k++){const a=i[k],b=i[(k+1)%5];l.push([a[0],a[1],b[0],b[1]],[a[0],a[1],o[k][0],o[k][1]]);}return{c:o,l,ny:0};}
  if(tipo==='d20'){const o=poliReg(6,1.05,-PI/2),t=[[0,-.55],[.55,.38],[-.55,.38]],l=[];for(let k=0;k<3;k++){const a=t[k],b=t[(k+1)%3];l.push([a[0],a[1],b[0],b[1]]);}
    [[0,0],[1,0],[1,1],[2,1],[2,2],[3,1],[4,2],[4,0],[5,0],[0,0]].forEach(([oi,ti])=>{const a=o[oi],b=t[ti];l.push([a[0],a[1],b[0],b[1]]);});return{c:o,l,ny:.02};}
  return null;
}
const PIPS={1:[[0,0]],2:[[-.35,-.35],[.35,.35]],3:[[-.38,-.38],[0,0],[.38,.38]],4:[[-.36,-.36],[.36,-.36],[-.36,.36],[.36,.36]],5:[[-.38,-.38],[.38,-.38],[0,0],[-.38,.38],[.38,.38]],6:[[-.36,-.42],[.36,-.42],[-.36,0],[.36,0],[-.36,.42],[.36,.42]]};
function desenhaDado(tipo,cor,num,u,trans,esc){
  const c1=mixHex(cor,'#ffffff',.4),c2=mixHex(cor,'#000000',.45),ga=ctx.globalAlpha;
  if(tipo==='d6'){
    ctx.fillStyle=c2;ctx.beginPath();ctx.roundRect(-.86,-.78,1.72,1.72,.32);ctx.fill();
    const g=ctx.createLinearGradient(-.9,-.9,.9,.9);g.addColorStop(0,c1);g.addColorStop(1,cor);ctx.fillStyle=g;ctx.globalAlpha=ga*(trans?.85:1);
    ctx.beginPath();ctx.roundRect(-.86,-.9,1.72,1.72,.32);ctx.fill();ctx.globalAlpha=ga;ctx.lineWidth=2*u;ctx.strokeStyle=hexA('#ffffff',.5);ctx.stroke();
    ctx.fillStyle=trans?'#ffffff':'#1a1208';(PIPS[clamp(num,1,6)]||[]).forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y-.04,.13,0,TAU);ctx.fill();});
    ctx.beginPath();ctx.ellipse(-.4,-.6,.3,.08,-.3,0,TAU);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fill();return;
  }
  const F=dadoForma(tipo);ctx.beginPath();F.c.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]+.08):ctx.moveTo(p[0],p[1]+.08));ctx.closePath();ctx.fillStyle=c2;ctx.fill();
  ctx.beginPath();F.c.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
  const g=ctx.createLinearGradient(-1,-1,1,1);g.addColorStop(0,c1);g.addColorStop(.55,cor);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.globalAlpha=ga*(trans?.82:1);ctx.fill();ctx.globalAlpha=ga;
  ctx.lineWidth=2.2*u;ctx.strokeStyle=hexA('#ffffff',.55);ctx.lineJoin='round';ctx.stroke();
  ctx.beginPath();F.l.forEach(([a,b,c,d])=>{ctx.moveTo(a,b);ctx.lineTo(c,d);});ctx.lineWidth=1.5*u;ctx.strokeStyle=hexA(trans?'#ffffff':'#000000',.3);ctx.stroke();
  if(trans){ctx.save();ctx.clip();ctx.beginPath();ctx.ellipse(-.3,-.45,.35,.12,-.5,0,TAU);ctx.fillStyle='rgba(255,255,255,.4)';ctx.fill();ctx.restore();}
  const fs=tipo==='d20'?.42:(tipo==='d4'?.38:.4);ctx.font='700 '+fs+'px '+DD_FONTE;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineWidth=.08;ctx.strokeStyle='rgba(0,0,0,.55)';ctx.strokeText(String(num),0,F.ny);ctx.fillStyle='#fffaf0';ctx.fillText(String(num),0,F.ny);
}
const ROLAGEM=new Map();
function numeroDado(chave,max,rolando,t){let e=ROLAGEM.get(chave);if(!e){e={n:1+Math.floor(Math.random()*max),tq:0};ROLAGEM.set(chave,e);}
  if(rolando&&t-e.tq>.07){e.n=1+Math.floor(Math.random()*max);e.tq=t;}return e.n;}
TEMAS.dados={
  id:'dados',nome:'Dados',cor:'#ffcf5a',grupo:'game',
  css:{bg:'#0a2419',fg:'#fff4dc',suave:'#b8c9a8',ac:'#ffcf5a',fonte:'var(--ao-fonte-medieval)',raio:'6px',chip:'rgba(20,14,6,.82)'},
  pal:{texto:'#fff4dc',suave:'#c4d2b2',destaque:'#ffcf5a',ok:'#7dffa8',alerta:'#ff5a5a',onda:'#ffcf5a',escudo:'#7fe8ff',ordem:'#ffcf5a',
    titulo:DD_FONTE,corpo:"'Figtree',system-ui,sans-serif",mono:"'JetBrains Mono',ui-monospace,monospace",tituloPeso:'',
    placaBg:'rgba(28,18,8,.88)',placaRaio:4,balaoBg:'rgba(252,240,210,.97)',balaoFg:'#3a2410',
    nucleo:['#c58a4a','#f2e6cf','#e0344a','#3a6bff','#ffcf5a']},
  niveis:['D4 de Madeira','D6 de Marfim','D10 de Rubi','D12 de Safira','D20 Lendário'],
  cores:['#e0344a','#3a6bff','#2fbf71','#9b5de5','#f28f3b','#00b4d8','#ffcf5a','#ff5d8f','#7bd389','#b7b7c9','#c58a4a','#2a2a3a'],
  halo:true,escalaAgente:.92,rastroLargura:.1,
  fundoEstatico(g,w,h){
    pintaBase(g,w,h,'#1c6b47','#0f4630','#06231a',.5);
    const r=mulberry(19);for(let i=0;i<9000;i++){g.fillStyle=r()<.5?'rgba(255,255,255,.035)':'rgba(0,0,0,.06)';g.fillRect(r()*w,r()*h,1.2,1.2);}
    const b=Math.min(w,h)*.035;g.lineWidth=b;const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#7a4a24');gr.addColorStop(.5,'#5a3418');gr.addColorStop(1,'#3a200c');g.strokeStyle=gr;g.strokeRect(b/2,b/2,w-b,h-b);
    g.strokeStyle='rgba(255,220,170,.12)';g.lineWidth=1;for(let i=0;i<40;i++){const y=r()*b;g.beginPath();g.moveTo(0,y);g.lineTo(w,y+r()*3);g.stroke();g.beginPath();g.moveTo(0,h-y);g.lineTo(w,h-y-r()*3);g.stroke();}
    pintaVinheta(g,w,h,.65,'#120a02');
  },
  fundo(t){
    aditivo(()=>{for(const [x,y,k] of[[.12,.15,0],[.88,.2,1.7],[.5,.05,3.1]]){const fl=.07+.03*Math.sin(t*9+k)+.02*Math.sin(t*23+k*2),R=S*.6;const g=ctx.createRadialGradient(W*x,H*y,0,W*x,H*y,R);
      g.addColorStop(0,'rgba(255,190,110,'+fl+')');g.addColorStop(1,'rgba(255,190,110,0)');ctx.fillStyle=g;ctx.fillRect(W*x-R,H*y-R,R*2,R*2);}});
  },
  chao(t){
    noPlano(0,-.48,0,u=>{const s=.16,hh=s*Math.sqrt(3);ctx.lineWidth=1.2*u;
      for(let q=-9;q<=9;q++)for(let rr=-9;rr<=9;rr++){const x=s*1.5*q,z=hh*(rr+q/2);const d=Math.hypot(x,z);if(d>1.5)continue;
        ctx.beginPath();for(let k=0;k<6;k++){const a=k/6*TAU;ctx.lineTo(x+Math.cos(a)*s*.96,z+Math.sin(a)*s*.96);}ctx.closePath();
        const f=1-d/1.55,cel=Math.abs(Math.sin(q*12.9+rr*78.2))%1;
        if(cel>.86){ctx.fillStyle=hexA(cel>.94?'#3a6bff':'#c58a4a',.12*f+.04*Math.sin(t*2+q));ctx.fill();}
        ctx.strokeStyle=hexA('#fff4dc',.16*f);ctx.stroke();}});
  },
  orbita(pts){ctx.setLineDash([6,8]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],fr=clamp((a.prof+1)/2,0,1);ctx.strokeStyle=hexA('#fff4dc',.05+fr*.18);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.setLineDash([]);},
  agente(a,t,u,inf){
    const tipo=DADO_TIPOS[a.i%6],trans=a.i>=6,rol=inf.carga>0||(Math.sin(t*.7+a.i*1.9)>.93),num=numeroDado(a.nome,DADO_MAX[tipo],rol,t);
    const spin=rol?t*14:Math.sin(t*.8+a.i)*.25;ctx.rotate(spin);
    if(rol)ctx.translate(0,-Math.abs(Math.sin(t*12))*.15);
    desenhaDado(tipo,a.corT,num,u,trans);
  },
  auraNucleo(cx,cy,r,nv,t,est){
    luz(cx,cy,r*3.2,this.pal.nucleo[nv-1],.28+est.flash*.3);
    if(nv>=5)aditivo(()=>{ctx.translate(cx,cy);ctx.rotate(t*.2);for(let i=0;i<12;i++){ctx.rotate(TAU/12);const g=ctx.createLinearGradient(r,0,r*3.4,0);g.addColorStop(0,'rgba(255,215,110,.35)');g.addColorStop(1,'rgba(255,215,110,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(r,-r*.06);ctx.lineTo(r*3.4,-r*.25);ctx.lineTo(r*3.4,r*.25);ctx.lineTo(r,r*.06);ctx.fill();}});
  },
  nucleo(nv,t,u,est){
    const tipos=['d4','d6','d10','d12','d20'],tipo=tipos[nv-1],cor=this.pal.nucleo[nv-1],rol=est.feliz||est.flash>.5;
    let num=numeroDado('__nuc'+nv,DADO_MAX[tipo],rol,t);if(nv===5&&!rol)num=20;
    ctx.rotate(rol?t*10:Math.sin(t*.6)*.12);if(est.medo>0)ctx.translate((Math.random()-.5)*.06,0);
    desenhaDado(tipo,cor,num,u,nv>=3);
    if(nv===5&&!rol){ctx.font='700 .16px '+DD_FONTE;ctx.textAlign='center';ctx.fillStyle='#fff4b0';ctx.fillText('CRÍTICO',0,.62);}
    if(est.dano>0){ctx.globalAlpha*=est.dano*.6;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(0,0,1.05,0,TAU);ctx.fill();}
  },
  tiro(s,t){
    if(s.tipo==='ataque'){luz(0,0,16,'#ff7a2a',.7);ctx.rotate(-s.ang+s.t*8);ctx.fillStyle='#ffb347';ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();ctx.fillStyle='#fff3c4';ctx.beginPath();ctx.arc(-1.5,-1.5,2.5,0,TAU);ctx.fill();return;}
    if(s.tipo==='intercepta'||s.tipo==='ordem'){ctx.strokeStyle=s.tipo==='ordem'?'#ffcf5a':'#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(8,0);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(5,-4);ctx.lineTo(5,4);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(-16,-4);ctx.moveTo(-12,0);ctx.lineTo(-16,4);ctx.stroke();return;}
    if(s.tipo==='fill'){ctx.rotate(-s.ang);ctx.fillStyle=s.ganho?'#ffcf5a':'#ff5a5a';ctx.beginPath();ctx.arc(0,0,6.5,0,TAU);ctx.fill();ctx.strokeStyle='#5a3a10';ctx.lineWidth=1.2;ctx.stroke();return;}
    ctx.rotate(-s.ang+s.t*14);ctx.scale(7,7);desenhaDado(s.tipo==='passe'?'d20':'d6',s.cor,1+Math.floor(s.seed*6),1/7,false);
  }
};

/* ================= GAME · NAVES (space shooter) ================= */
const NV_FONTE="'Orbitron','JetBrains Mono',sans-serif";
const CASCOS=[
  [[1,0],[.2,-.3],[-.3,-.85],[-.5,-.85],[-.35,-.25],[-.7,-.2],[-.7,.2],[-.35,.25],[-.5,.85],[-.3,.85],[.2,.3]],
  [[1,0],[-.6,-.8],[-.4,0],[-.6,.8]],
  [[1,0],[.3,-.15],[.1,-.7],[-.2,-.75],[-.1,-.2],[-.7,-.15],[-.7,.15],[-.1,.2],[-.2,.75],[.1,.7],[.3,.15]],
  null,
  [[.8,-.2],[.95,0],[.8,.2],[.2,.35],[-.2,.9],[-.5,.9],[-.45,.35],[-.8,.3],[-.8,-.3],[-.45,-.35],[-.5,-.9],[-.2,-.9],[.2,-.35]],
  [[1.1,0],[0,-.18],[-.6,-.5],[-.8,-.5],[-.6,-.12],[-.8,0],[-.6,.12],[-.8,.5],[-.6,.5],[0,.18]],
  [[.9,-.12],[1,0],[.9,.12],[-.7,.18],[-.7,-.18]],
  [[.9,0],[.1,-.2],[-.2,-.9],[-.35,-.5],[-.6,-.6],[-.45,-.15],[-.6,0],[-.45,.15],[-.6,.6],[-.35,.5],[-.2,.9],[.1,.2]],
  [[.8,-.3],[.95,-.1],[.95,.1],[.8,.3],[-.75,.4],[-.8,0],[-.75,-.4]],
  null,
  [[1,-.42],[.9,-.3],[-.7,-.3],[-.7,-.55],[.6,-.55]],
  [[1.15,0],[.3,-.1],[-.75,-.14],[-.75,.14],[.3,.1]]
];
function chamaMotor(x,y,w,len,cor,t,k){aditivo(()=>{const l=len*(.8+.3*Math.sin(t*40+k));const g=ctx.createLinearGradient(x,0,x-l,0);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.25,hexA(cor,.85));g.addColorStop(1,hexA(cor,0));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,y-w);ctx.quadraticCurveTo(x-l*.4,y-w*.6,x-l,y);ctx.quadraticCurveTo(x-l*.4,y+w*.6,x,y+w);ctx.closePath();ctx.fill();});}
function casco(pts,cor,u){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
  const g=ctx.createLinearGradient(0,-.9,0,.9);g.addColorStop(0,'#e8eef8');g.addColorStop(.5,'#9aa8bf');g.addColorStop(1,'#3a4558');ctx.fillStyle=g;ctx.fill();
  ctx.lineWidth=2*u;ctx.strokeStyle='#1a2030';ctx.stroke();ctx.save();ctx.clip();ctx.fillStyle=hexA(cor,.85);ctx.fillRect(-.2,-1,.16,2);ctx.fillRect(-.48,-1,.07,2);
  ctx.strokeStyle='rgba(20,30,50,.35)';ctx.lineWidth=1*u;ctx.beginPath();ctx.moveTo(-1,0);ctx.lineTo(1,0);ctx.moveTo(.2,-1);ctx.lineTo(.2,1);ctx.stroke();ctx.restore();}
function cabine(x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);const g=ctx.createLinearGradient(x,y-ry,x,y+ry);g.addColorStop(0,'#c8f4ff');g.addColorStop(1,'#1a6a9a');ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();ctx.ellipse(x+rx*.25,y-ry*.35,rx*.35,ry*.25,0,0,TAU);ctx.fillStyle='rgba(255,255,255,.7)';ctx.fill();}
function luzes(t,pts,k){pts.forEach(([x,y,c],i)=>{if(Math.sin(t*5+i*2+k)>.2)luz(x,y,.16,c,.95);});}
function nave(i,cor,t,u,carga){
  const P=CASCOS[i%12],k=i*1.7,boost=1+carga*1.5;
  if(i%12===3){chamaMotor(-.3,0,.18,.7*boost,cor,t,k);ctx.beginPath();ctx.ellipse(0,0,.95,.42,0,0,TAU);const g=ctx.createLinearGradient(0,-.4,0,.4);g.addColorStop(0,'#eef2f8');g.addColorStop(1,'#4a5568');ctx.fillStyle=g;ctx.fill();
    ctx.lineWidth=2*u;ctx.strokeStyle='#1a2030';ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,.95,.12,0,0,TAU);ctx.strokeStyle=hexA(cor,.9);ctx.stroke();cabine(0,-.18,.38,.28);
    for(let j=0;j<6;j++){const a=t*3+j/6*TAU;if(Math.sin(a)>-.2)luz(Math.cos(a)*.8,Math.sin(a)*.12+.05,.12,cor,.9);}return;}
  if(i%12===9){chamaMotor(-.6,0,.12,.5*boost,cor,t,k);ctx.beginPath();ctx.arc(0,0,.75,0,TAU);ctx.lineWidth=.16;ctx.strokeStyle='#9aa8bf';ctx.stroke();ctx.lineWidth=.05;ctx.strokeStyle=hexA(cor,.9);ctx.stroke();
    ctx.save();ctx.rotate(t*2);for(let j=0;j<3;j++){ctx.rotate(TAU/3);ctx.fillStyle='#5a6880';ctx.fillRect(.18,-.05,.5,.1);}ctx.restore();luz(0,0,.6,cor,.7);ctx.beginPath();ctx.arc(0,0,.22,0,TAU);ctx.fillStyle='#ffffff';ctx.fill();return;}
  if(i%12===6){for(const s of[-1,1]){chamaMotor(-.7,s*.42,.12,.6*boost,cor,t,k+s);ctx.save();ctx.translate(0,s*.42);ctx.scale(.9,.9);casco(P,cor,u/.9);ctx.restore();}
    ctx.fillStyle='#5a6880';ctx.fillRect(-.3,-.42,.5,.84);cabine(.35,0,.22,.14);return;}
  if(i%12===10){for(const s of[-1,1]){chamaMotor(-.7,s*.42,.1,.55*boost,cor,t,k+s);ctx.save();ctx.scale(1,s);casco(P,cor,u);ctx.restore();}ctx.fillStyle='#7a889f';ctx.fillRect(-.2,-.3,.6,.6);cabine(.2,0,.18,.12);return;}
  chamaMotor(-.62,0,.17,.75*boost,cor,t,k);if(i%12===4){chamaMotor(-.78,-.55,.1,.45*boost,cor,t,k+1);chamaMotor(-.78,.55,.1,.45*boost,cor,t,k+2);}
  casco(P,cor,u);cabine(.3,0,.24,.13);
  if(i%12===11){ctx.beginPath();ctx.ellipse(-.25,0,.18,.6,0,0,TAU);ctx.lineWidth=.07;ctx.strokeStyle=hexA(cor,.9);ctx.stroke();}
  luzes(t,[[-.35,-.8,'#ff4d6d'],[-.35,.8,'#5dff9e']],k);
}
function estacao(nv,t,u,est){
  const ac=est.medo>0&&Math.sin(t*14)>0?'#ff4d6d':'#4fd1ff';
  const anel=(rx,ry,rot,seg,i0,i1)=>{ctx.save();ctx.rotate(rot);ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,i0,i1);ctx.lineWidth=.16;ctx.strokeStyle='#8a97ad';ctx.stroke();ctx.lineWidth=.06;ctx.strokeStyle='#d8e2f0';ctx.stroke();
    for(let k=0;k<seg;k++){const a=t*.3+k/seg*TAU;if((Math.sin(a)>=0)!==(i0===0))continue;const x=Math.cos(a)*rx,y=Math.sin(a)*ry;ctx.fillStyle='#5a6880';ctx.fillRect(x-.06,y-.06,.12,.12);if(k%2&&Math.sin(t*4+k)>0)luz(x,y,.1,ac,.9);}ctx.restore();};
  const paineis=(x,y,w,h,rot)=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot);const g=ctx.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,'#1a3a8a');g.addColorStop(1,'#2f6fd0');ctx.fillStyle=g;ctx.fillRect(-w/2,-h/2,w,h);
    ctx.strokeStyle='rgba(180,220,255,.5)';ctx.lineWidth=1*u;for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(-w/2+i*w/6,-h/2);ctx.lineTo(-w/2+i*w/6,h/2);ctx.stroke();}ctx.strokeRect(-w/2,-h/2,w,h);ctx.restore();};
  const nucleoEst=(r)=>{luz(0,0,r*2.2,ac,.45+est.flash*.3);ctx.beginPath();ctx.arc(0,0,r,0,TAU);const g=ctx.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r);g.addColorStop(0,'#f2f6fc');g.addColorStop(1,'#5a6880');ctx.fillStyle=g;ctx.fill();
    ctx.lineWidth=2*u;ctx.strokeStyle='#1a2030';ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.45,0,TAU);ctx.fillStyle=ac;ctx.fill();luz(0,0,r*.7,ac,.8);};
  if(nv===1){ctx.rotate(Math.sin(t*.4)*.15);paineis(-.85,0,.9,.38,0);paineis(.85,0,.9,.38,0);ctx.fillStyle='#8a97ad';ctx.fillRect(-.35,-.04,.7,.08);nucleoEst(.32);
    ctx.beginPath();ctx.arc(.05,-.45,.18,PI*.1,PI*.9);ctx.lineWidth=.05;ctx.strokeStyle='#d8e2f0';ctx.stroke();if(Math.sin(t*3)>0)luz(.05,-.45,.12,'#ff4d6d',.9);return;}
  const nr=[0,1,2,3][nv-2];
  for(let i=0;i<nr;i++)anel(1.25+i*.28,.36+i*.1,i*.9-.3,12+i*4,PI,TAU);
  if(nv>=4)for(let i=0;i<6;i++){const a=i/6*TAU+t*.1;ctx.save();ctx.rotate(a);ctx.fillStyle='#7a889f';ctx.fillRect(.4,-.04,.75+(nv>=5?.4:0),.08);if(Math.sin(t*3+i)>0)luz(1.15+(nv>=5?.4:0),0,.12,i%2?'#ff4d6d':ac,.9);ctx.restore();}
  if(nv>=3){paineis(-1.0,-.05,.55,.26,.1);paineis(1.0,.05,.55,.26,.1);}
  nucleoEst(nv>=5?.6:.45);
  if(nv>=5)aditivo(()=>{ctx.rotate(-t*.5);for(let k=0;k<3;k++){ctx.rotate(TAU/3);ctx.beginPath();ctx.arc(0,0,.85,0,PI*.5);ctx.lineWidth=.05;ctx.strokeStyle=hexA(ac,.8);ctx.stroke();}});
  for(let i=0;i<nr;i++)anel(1.25+i*.28,.36+i*.1,i*.9-.3,12+i*4,0,PI);
  if(est.dano>0)luz(0,0,1.2,'#ffffff',est.dano*.6);
}
const WARP=Array.from({length:70},(_,i)=>{const r=mulberry(i*7+31);return{a:r()*TAU,d:r(),v:.08+r()*.25,z:r()};});
TEMAS.naves={
  id:'naves',nome:'Naves',cor:'#4fd1ff',grupo:'game',
  css:{bg:'#02030a',fg:'#e6f0ff',suave:'#8a9bbd',ac:'#4fd1ff',fonte:'var(--ao-fonte-sci)',raio:'4px',chip:'rgba(4,8,20,.82)'},
  pal:{texto:'#e6f0ff',suave:'#8a9bbd',destaque:'#4fd1ff',ok:'#5dff9e',alerta:'#ff4d6d',onda:'#4fd1ff',escudo:'#4fd1ff',ordem:'#ffd166',
    titulo:NV_FONTE,corpo:"'Figtree',system-ui,sans-serif",mono:NV_FONTE,tituloPeso:'700 ',
    placaBg:'rgba(4,10,24,.86)',placaRaio:2,balaoBg:'rgba(210,236,255,.95)',balaoFg:'#04122a',
    nucleo:['#4fd1ff','#4fd1ff','#5dff9e','#ffd166','#ff7ad9']},
  niveis:['Satélite','Módulo','Estação','Complexo','Nave-Mãe'],
  cores:['#ffd166','#4fd1ff','#ff7a3a','#ff4d6d','#b28dff','#5dff9e','#ff9de2','#7af0ff','#ffb347','#a0ffd6','#f4f4f4','#ff5ad1'],
  halo:false,escalaAgente:.95,rastroLargura:.08,caudaAditiva:true,
  fundoEstatico(g,w,h){
    pintaBase(g,w,h,'#0b1430','#050a1a','#010206',.45);
    pintaNebulosas(g,w,h,['#123a6b','#3a1260','#0f5a63'],51,8,.14);
    pintaEstrelas(g,w,h,1400,12,['#ffffff','#cfe0ff','#ffe2c4']);
    const R=Math.max(w,h)*.55,px=w*.92,py=h*1.28;
    let gr=g.createRadialGradient(px-R*.3,py-R*.3,R*.2,px,py,R);gr.addColorStop(0,'#3f7fd0');gr.addColorStop(.7,'#173a7a');gr.addColorStop(1,'#08122a');
    g.fillStyle=gr;g.beginPath();g.arc(px,py,R,0,TAU);g.fill();
    g.save();g.beginPath();g.arc(px,py,R,0,TAU);g.clip();const r=mulberry(4);g.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<30;i++){g.beginPath();g.ellipse(px+(r()-.5)*R*1.6,py-R*.6+(r()-.5)*R*.6,R*(.05+r()*.15),R*.02,-.3,0,TAU);g.fill();}g.restore();
    g.globalCompositeOperation='screen';gr=g.createRadialGradient(px,py,R*.98,px,py,R*1.08);gr.addColorStop(0,'rgba(120,200,255,.5)');gr.addColorStop(1,'rgba(120,200,255,0)');g.fillStyle=gr;g.beginPath();g.arc(px,py,R*1.08,0,TAU);g.fill();
    g.globalCompositeOperation='source-over';pintaVinheta(g,w,h,.7);
  },
  fundo(t,dt){
    estrelasVivas(t,['#ffffff','#cfe0ff'],.8);
    ctx.lineCap='round';for(const s of WARP){const d=((s.d+t*s.v)%1),r0=S*.08+d*S*.75,r1=r0+S*(.02+.08*d);
      ctx.strokeStyle=hexA('#cfe8ff',d*.35*s.z);ctx.lineWidth=.6+d*1.2;ctx.beginPath();ctx.moveTo(CX+Math.cos(s.a)*r0,CY+Math.sin(s.a)*r0*.7);ctx.lineTo(CX+Math.cos(s.a)*r1,CY+Math.sin(s.a)*r1*.7);ctx.stroke();}
  },
  orbita(pts,o,t){
    for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],fr=clamp((a.prof+1)/2,0,1);ctx.strokeStyle=hexA('#4fd1ff',.04+fr*.12);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    const n=pts.length-1,off=((t*.5*Math.sign(o.vel))%1+1)%1;
    for(let k=0;k<12;k++){const i=Math.floor((k/12+off)%1*n),p=pts[i],q=pts[Math.min(n,i+1)],a=Math.atan2(q.y-p.y,q.x-p.x)*(o.vel<0?1:1)+(o.vel<0?PI:0),fr=clamp((p.prof+1)/2,0,1);
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);ctx.strokeStyle=hexA('#4fd1ff',.15+fr*.35);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-3,-4);ctx.lineTo(2,0);ctx.lineTo(-3,4);ctx.stroke();ctx.restore();}
  },
  agente(a,t,u,inf){ctx.rotate(Math.atan2(inf.dir.y,inf.dir.x)+Math.sin(t*2+a.i)*.08);nave(a.i,a.corT,t,u,inf.carga);},
  auraNucleo(cx,cy,r,nv,t,est){luz(cx,cy,r*3,'#4fd1ff',.15+est.flash*.25);},
  nucleo(nv,t,u,est){estacao(nv,t,u,est);},
  tiro(s,t){
    const c=s.cor;
    if(s.tipo==='ataque'){ctx.scale(9,9);chamaMotor(-.6,0,.15,.8,'#ff4d6d',t,s.seed*9);ctx.beginPath();ctx.moveTo(1,0);ctx.lineTo(-.6,-.7);ctx.lineTo(-.3,0);ctx.lineTo(-.6,.7);ctx.closePath();ctx.fillStyle='#3a0a14';ctx.fill();ctx.lineWidth=.12;ctx.strokeStyle='#ff4d6d';ctx.stroke();return;}
    if(s.tipo==='mercado'){ctx.fillStyle='#d8e2f0';ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(4,-2.5);ctx.lineTo(-6,-2.5);ctx.lineTo(-6,2.5);ctx.lineTo(4,2.5);ctx.closePath();ctx.fill();ctx.fillStyle=c;ctx.fillRect(-6,-4,3,8);luz(-8,0,8,'#ffb347',.9);return;}
    if(s.tipo==='intercepta'){aditivo(()=>{ctx.fillStyle='#ffffff';ctx.fillRect(-26,-1,34,2);});return;}
    if(s.tipo==='fill'){ctx.rotate(-s.ang);luz(0,0,10,c,.8);ctx.fillStyle='#fff';ctx.font='700 9px '+NV_FONTE;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.ganho?'$':'!',0,.5);return;}
    luz(0,0,12,c,.8);aditivo(()=>{ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(0,0,9,1.8,0,0,TAU);ctx.fill();ctx.fillStyle=hexA(c,.8);ctx.beginPath();ctx.ellipse(-3,0,13,3.5,0,0,TAU);ctx.fill();});
  },
  frente(t){
    ctx.save();ctx.strokeStyle='rgba(79,209,255,.22)';ctx.lineWidth=1;const m=S*.06;
    for(const [x,y,sx,sy] of[[m,m*2.6,1,1],[W-m,m*2.6,-1,1],[m,H-m*1.6,1,-1],[W-m,H-m*1.6,-1,-1]]){ctx.beginPath();ctx.moveTo(x,y+sy*m*.6);ctx.lineTo(x,y);ctx.lineTo(x+sx*m*.6,y);ctx.stroke();}
    ctx.restore();
  }
};

/* ================= GAME · CARTAS (card game) ================= */
const CT_FONTE="'Cinzel','Trajan Pro',Georgia,serif";
const ICONES=[
  ()=>{ctx.beginPath();ctx.moveTo(0,-.42);ctx.lineTo(.07,.12);ctx.lineTo(-.07,.12);ctx.closePath();ctx.fill();ctx.fillRect(-.18,.12,.36,.06);ctx.fillRect(-.03,.18,.06,.16);},
  ()=>{ctx.beginPath();ctx.moveTo(0,-.38);ctx.lineTo(.3,-.28);ctx.quadraticCurveTo(.3,.2,0,.4);ctx.quadraticCurveTo(-.3,.2,-.3,-.28);ctx.closePath();ctx.fill();},
  ()=>{estrelaPoli(5,2,.38);ctx.fill();},
  ()=>{ctx.beginPath();ctx.arc(0,0,.34,0,TAU);ctx.arc(.14,-.08,.28,0,TAU,true);ctx.fill('evenodd');},
  ()=>{chama(0,1,[ctx.fillStyle],1.2);},
  ()=>{ctx.beginPath();ctx.moveTo(0,-.4);ctx.bezierCurveTo(.1,-.2,.3,0,.3,.14);ctx.bezierCurveTo(.3,.45,-.3,.45,-.3,.14);ctx.bezierCurveTo(-.3,0,-.1,-.2,0,-.4);ctx.fill();},
  ()=>{ctx.beginPath();ctx.ellipse(0,0,.18,.4,.6,0,TAU);ctx.fill();},
  ()=>{ctx.beginPath();ctx.moveTo(.08,-.42);ctx.lineTo(-.18,.04);ctx.lineTo(0,.04);ctx.lineTo(-.08,.42);ctx.lineTo(.2,-.06);ctx.lineTo(.02,-.06);ctx.closePath();ctx.fill();},
  ()=>{ctx.beginPath();ctx.moveTo(-.4,0);ctx.quadraticCurveTo(0,-.32,.4,0);ctx.quadraticCurveTo(0,.32,-.4,0);ctx.fill();ctx.save();ctx.fillStyle='#1a0f2a';ctx.beginPath();ctx.arc(0,0,.12,0,TAU);ctx.fill();ctx.restore();},
  ()=>{ctx.beginPath();ctx.moveTo(-.36,.2);ctx.lineTo(-.36,-.2);ctx.lineTo(-.18,0);ctx.lineTo(0,-.3);ctx.lineTo(.18,0);ctx.lineTo(.36,-.2);ctx.lineTo(.36,.2);ctx.closePath();ctx.fill();},
  ()=>{ctx.beginPath();ctx.arc(0,-.06,.3,PI*.9,PI*2.1);ctx.lineTo(.2,.3);ctx.lineTo(-.2,.3);ctx.closePath();ctx.fill();ctx.save();ctx.fillStyle='#1a0f2a';for(const s of[-1,1]){ctx.beginPath();ctx.arc(s*.12,-.04,.08,0,TAU);ctx.fill();}ctx.restore();},
  ()=>{ctx.beginPath();ctx.moveTo(0,-.38);ctx.lineTo(.3,-.1);ctx.lineTo(0,.4);ctx.lineTo(-.3,-.1);ctx.closePath();ctx.fill();}
];
function carta(op){
  const {cor,u,frente,icone,nome,atk,def,raro,t,lend}=op,w=.66,h=.95;
  ctx.beginPath();ctx.roundRect(-w,-h,w*2,h*2,.1);
  if(!frente){const g=ctx.createLinearGradient(-w,-h,w,h);g.addColorStop(0,'#2a1a5e');g.addColorStop(1,'#120a2e');ctx.fillStyle=g;ctx.fill();ctx.lineWidth=3*u;ctx.strokeStyle='#ffc857';ctx.stroke();
    ctx.save();ctx.clip();ctx.strokeStyle='rgba(255,200,87,.18)';ctx.lineWidth=1*u;for(let i=-8;i<=8;i++){ctx.beginPath();ctx.moveTo(i*.15-1,-1);ctx.lineTo(i*.15+1,1);ctx.moveTo(i*.15+1,-1);ctx.lineTo(i*.15-1,1);ctx.stroke();}ctx.restore();
    ctx.beginPath();ctx.roundRect(-w*.78,-h*.84,w*1.56,h*1.68,.06);ctx.strokeStyle='rgba(255,200,87,.6)';ctx.lineWidth=1.5*u;ctx.stroke();
    ctx.fillStyle='#ffc857';ctx.save();ctx.scale(.9,.9);estrelaPoli(7,3,.32);ctx.fill();ctx.restore();ctx.beginPath();ctx.arc(0,0,.14,0,TAU);ctx.fillStyle='#120a2e';ctx.fill();return;}
  const g=ctx.createLinearGradient(-w,-h,w,h);g.addColorStop(0,mixHex(cor,'#ffffff',.35));g.addColorStop(.5,cor);g.addColorStop(1,mixHex(cor,'#000000',.45));ctx.fillStyle=g;ctx.fill();
  ctx.lineWidth=3*u;ctx.strokeStyle=lend?'#ffe28a':mixHex(cor,'#000000',.6);ctx.stroke();
  ctx.beginPath();ctx.roundRect(-w*.82,-h*.72,w*1.64,h*.9,.05);const ga=ctx.createLinearGradient(0,-h*.72,0,h*.18);ga.addColorStop(0,'#1a1036');ga.addColorStop(1,mixHex(cor,'#120a2e',.6));ctx.fillStyle=ga;ctx.fill();
  ctx.save();ctx.clip();luz(0,-h*.27,.6,cor,.6);ctx.fillStyle=mixHex(cor,'#ffffff',.55);ctx.translate(0,-h*.27);ctx.scale(.95,.95);ICONES[icone%ICONES.length]();ctx.restore();
  ctx.beginPath();ctx.roundRect(-w*.82,-h*.93,w*1.64,h*.17,.04);ctx.fillStyle='rgba(20,10,40,.75)';ctx.fill();
  ctx.font='700 .13px '+CT_FONTE;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff3e0';ctx.fillText(nome,0,-h*.845);
  ctx.beginPath();ctx.roundRect(-w*.82,h*.24,w*1.64,h*.5,.04);ctx.fillStyle='rgba(255,243,224,.9)';ctx.fill();
  ctx.fillStyle='#3a2a50';ctx.fillRect(-w*.6,h*.38,w*1.2,.02);ctx.fillRect(-w*.6,h*.48,w*.9,.02);ctx.fillRect(-w*.6,h*.58,w*1.05,.02);
  for(const [x,v,c] of[[-w*.72,atk,'#ff5470'],[w*.72,def,'#4fa8ff']]){ctx.beginPath();ctx.arc(x,h*.86,.15,0,TAU);ctx.fillStyle=c;ctx.fill();ctx.lineWidth=1.5*u;ctx.strokeStyle='#fff3e0';ctx.stroke();
    ctx.font='700 .14px '+CT_FONTE;ctx.fillStyle='#ffffff';ctx.fillText(String(v),x,h*.865);}
  for(let k=0;k<raro;k++){ctx.save();ctx.translate((k-(raro-1)/2)*.14,h*.86);ctx.rotate(PI/4);ctx.fillStyle='#ffc857';ctx.fillRect(-.04,-.04,.08,.08);ctx.restore();}
  ctx.save();ctx.beginPath();ctx.roundRect(-w,-h,w*2,h*2,.1);ctx.clip();ctx.globalCompositeOperation='lighter';
  const x=((t*.35)%2-1)*2.4,gh=ctx.createLinearGradient(x-.4,-1,x+.4,1);gh.addColorStop(0,'rgba(255,255,255,0)');gh.addColorStop(.35,lend?'rgba(255,120,220,.3)':'rgba(255,255,255,0)');gh.addColorStop(.5,'rgba(255,255,255,'+(lend?.45:.28)+')');gh.addColorStop(.65,lend?'rgba(120,220,255,.3)':'rgba(255,255,255,0)');gh.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=gh;ctx.fillRect(-1,-1.2,2,2.4);ctx.restore();
}
const CARTAS_FUNDO=Array.from({length:10},(_,i)=>{const r=mulberry(i*19+5);return{x:r(),y:r(),r:r()*TAU,s:.5+r()*.8,v:(r()-.5)*.2,z:r()};});
TEMAS.cartas={
  id:'cartas',nome:'Cartas',cor:'#ffc857',grupo:'game',
  css:{bg:'#120a1e',fg:'#fff3e0',suave:'#b9a8c9',ac:'#ffc857',fonte:'var(--ao-fonte-arcana)',raio:'6px',chip:'rgba(22,10,34,.82)'},
  pal:{texto:'#fff3e0',suave:'#c3b3d6',destaque:'#ffc857',ok:'#6dffb0',alerta:'#ff5470',onda:'#ffc857',escudo:'#ffc857',ordem:'#ffc857',
    titulo:CT_FONTE,corpo:"'Figtree',system-ui,sans-serif",mono:"'JetBrains Mono',ui-monospace,monospace",tituloPeso:'700 ',
    placaBg:'rgba(24,10,38,.88)',placaRaio:4,balaoBg:'rgba(255,243,224,.96)',balaoFg:'#2a1240',
    nucleo:['#ffc857','#ffc857','#ff7ad9','#ffc857','#ffffff']},
  niveis:['Carta Virada','Deck','Mão Cheia','Lendária','Mestre do Baralho'],
  cores:['#e0344a','#3a6bff','#ffc857','#8f7bff','#ff7a3a','#22b8cf','#4cc96a','#ffd43b','#c06bff','#ff9de2','#7a8aa0','#2fd6c4'],
  halo:true,escalaAgente:1.05,rastroLargura:.12,
  fundoEstatico(g,w,h){
    pintaBase(g,w,h,'#3a1a4e','#1d0d2e','#08040e',.4);
    g.strokeStyle='rgba(255,200,87,.035)';g.lineWidth=1;for(let i=-h;i<w;i+=22){g.beginPath();g.moveTo(i,0);g.lineTo(i+h,h);g.stroke();g.beginPath();g.moveTo(i+h,0);g.lineTo(i,h);g.stroke();}
    const gr=g.createRadialGradient(w/2,-h*.1,0,w/2,h*.4,h*.9);gr.addColorStop(0,'rgba(255,230,180,.22)');gr.addColorStop(1,'rgba(255,230,180,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);
    pintaVinheta(g,w,h,.75);
  },
  fundo(t){
    for(const c of CARTAS_FUNDO){ctx.save();ctx.translate(c.x*W-par.x*S*.05*c.z,((c.y+t*.008*(c.z+.2))%1.2-.1)*H-par.y*S*.05*c.z);ctx.rotate(c.r+t*c.v);const s=S*.05*c.s;
      ctx.globalAlpha=.06+.08*c.z;ctx.strokeStyle='#ffc857';ctx.lineWidth=1.2;ctx.beginPath();ctx.roundRect(-s*.66,-s*.95,s*1.32,s*1.9,s*.1);ctx.stroke();ctx.restore();}
    ctx.globalAlpha=1;
  },
  chao(t){
    aditivo(()=>noPlano(0,-.5,0,u=>{ctx.lineWidth=1.4*u;ctx.strokeStyle='rgba(255,200,87,.16)';ctx.beginPath();ctx.roundRect(-1.5,-.95,3,1.9,.12);ctx.stroke();
      for(let i=0;i<5;i++){const x=-1.2+i*.6;ctx.beginPath();ctx.roundRect(x-.2,-.75,.4,.56,.04);ctx.strokeStyle='rgba(255,200,87,'+(.1+.06*Math.sin(t*2+i))+')';ctx.stroke();ctx.beginPath();ctx.roundRect(x-.2,.2,.4,.56,.04);ctx.stroke();}
      ctx.beginPath();ctx.arc(0,0,.32,0,TAU);ctx.strokeStyle='rgba(255,200,87,.22)';ctx.stroke();ctx.save();ctx.rotate(t*.2);estrelaPoli(7,3,.3);ctx.stroke();ctx.restore();}));
  },
  agente(a,t,u,inf){
    const ph=t*.55+a.i*.9+(inf.carga>0?inf.carga*PI:0),fl=Math.cos(ph),sx=Math.max(.06,Math.abs(fl));
    ctx.rotate(Math.sin(t*.8+a.i)*.12);ctx.scale(sx,1);
    carta({cor:a.corT,u,frente:fl>0,icone:a.i,nome:a.nome.slice(0,9),atk:2+(a.i*7)%8,def:1+(a.i*5)%8,raro:1+a.i%3,t:t+a.i,lend:false});
  },
  auraNucleo(cx,cy,r,nv,t,est){luz(cx,cy,r*3.2,'#ffc857',.2+est.flash*.3);},
  nucleo(nv,t,u,est){
    const c='#8f5bff';ctx.translate(0,Math.sin(t*1.4)*.05);
    if(nv===1){ctx.rotate(Math.sin(t*.7)*.1);carta({cor:c,u,frente:false,t});}
    else if(nv===2){for(let k=2;k>=0;k--){ctx.save();ctx.translate(k*.06,-k*.06);ctx.rotate(k*.04);carta({cor:c,u,frente:false,t});ctx.restore();}}
    else if(nv===3){for(let k=0;k<5;k++){ctx.save();ctx.translate(0,.6);ctx.rotate((k-2)*.28+Math.sin(t+k)*.02);ctx.translate(0,-.6);ctx.scale(.85,.85);
      carta({cor:['#e0344a','#3a6bff','#ffc857','#4cc96a','#c06bff'][k],u:u/.85,frente:true,icone:k*2,nome:'',atk:k+2,def:5-k,raro:2,t:t+k});ctx.restore();}}
    else{if(nv>=5)for(let k=0;k<6;k++){const a=t*.7+k/6*TAU,x=Math.cos(a)*1.55,y=Math.sin(a)*.5;ctx.save();ctx.translate(x,y);ctx.scale(.3,.3);ctx.rotate(Math.sin(a)*.3);carta({cor:['#e0344a','#3a6bff','#ffc857','#4cc96a','#c06bff','#22b8cf'][k],u:u/.3,frente:Math.cos(a*2)>0,icone:k,nome:'',atk:k,def:k,raro:1,t});ctx.restore();}
      ctx.scale(1.05,1.05);carta({cor:'#ffc857',u:u/1.05,frente:true,icone:9,nome:'LENDÁRIA',atk:9,def:9,raro:3,t,lend:true});
      if(nv>=5){ctx.save();ctx.translate(0,-1.25);ctx.scale(1.2,1.2);ctx.fillStyle='#ffe28a';ICONES[9]();ctx.restore();}}
    if(est.medo>0){ctx.fillStyle='rgba(255,84,112,'+(.15+.15*Math.sin(t*12))+')';ctx.fillRect(-.7,-1,1.4,2);}
    if(est.dano>0){ctx.fillStyle='rgba(255,255,255,'+est.dano*.6+')';ctx.fillRect(-.7,-1,1.4,2);}
  },
  escudo(cx,cy,R,f,t,nv,rip,on){
    ctx.save();ctx.globalAlpha*=on;const n=8,vis=Math.ceil(f*n);
    for(let k=0;k<n;k++){const a=t*.5+k/n*TAU;let rr=R;rip.forEach(w=>{const d=Math.atan2(Math.sin(a-w.ang),Math.cos(a-w.ang));if(Math.abs(d)<.5)rr=R*(1-(1-w.t)*.1);});
      ctx.save();ctx.translate(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.9);ctx.rotate(a+PI/2);const s=R*.32;ctx.scale(s,s);ctx.globalAlpha*=k<vis?1:.18;
      carta({cor:'#3a6bff',u:1/s,frente:false,t});ctx.restore();}
    aditivo(()=>{ctx.beginPath();ctx.arc(cx,cy,R*.92,0,TAU);ctx.strokeStyle=hexA('#ffc857',.4);ctx.lineWidth=1.5;ctx.stroke();});
    ctx.restore();
  },
  tiro(s,t){
    if(s.tipo==='fill'){ctx.rotate(-s.ang);luz(0,0,10,s.cor,.7);ctx.fillStyle=s.ganho?'#ffc857':'#ff5470';ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();return;}
    if(s.tipo==='intercepta'||s.tipo==='mercado'){luz(0,0,10,s.cor,.6);ctx.fillStyle='#fff';ctx.fillRect(-12,-1.2,20,2.4);return;}
    const cor=s.tipo==='ataque'?'#1a0a14':(s.tipo==='ordem'?'#ffc857':s.cor);
    luz(0,0,12,s.tipo==='ataque'?'#ff5470':cor,.55);ctx.rotate(s.t*12);ctx.scale(9,9);
    ctx.beginPath();ctx.roundRect(-.66,-.95,1.32,1.9,.12);ctx.fillStyle=cor;ctx.fill();ctx.lineWidth=.18;ctx.strokeStyle=s.tipo==='ataque'?'#ff5470':'#fff3e0';ctx.stroke();
    if(s.tipo==='ataque'){ctx.fillStyle='#ff5470';estrelaPoli(5,2,.4);ctx.fill();}
  },
  frente(t){particulasFrente(t,'#ffc857',true);}
};

/* ================= GAME · VOXEL (mundo de blocos) ================= */
const VX_FONTE="'Silkscreen','Press Start 2P',ui-monospace,monospace";
const VX_FACES=[[0,1,2,3,0,0,-1,'lado'],[5,4,7,6,0,0,1,'lado'],[4,0,3,7,-1,0,0,'lado'],[1,5,6,2,1,0,0,'lado'],[3,2,6,7,0,1,0,'topo'],[4,5,1,0,0,-1,0,'base']];
const VX_LUZ=(()=>{const l=[.35,.85,-.45],m=Math.hypot(...l);return l.map(v=>v/m);})();
/* caixa 3D com textura em grade (coordenadas unitárias) */
function caixa(o){
  const {dx,dy,dz,ax,ay,u,tex,grade,alfa}=o,ox=o.ox||0,oy=o.oy||0,oz=o.oz||0;
  const ca=Math.cos(ay),sa=Math.sin(ay),cp=Math.cos(ax),sp=Math.sin(ax);
  const rot=(x,y,z)=>{const X=x*ca+z*sa,Z=-x*sa+z*ca;return{x:X,y:-(y*cp+Z*sp),z:-y*sp+Z*cp};};
  const V=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([a,b,c])=>rot(ox+a*dx,oy+b*dy,oz+c*dz));
  const vis=[];
  for(const F of VX_FACES){const nx=F[4],ny=F[5],nz=F[6],nX=nx*ca+nz*sa,nZ=-nx*sa+nz*ca,zz=-ny*sp+nZ*cp;if(zz>=-.001)continue;
    const sh=.55+.45*Math.max(0,nX*VX_LUZ[0]+ny*VX_LUZ[1]+nZ*VX_LUZ[2]);vis.push({F,q:[V[F[0]],V[F[1]],V[F[2]],V[F[3]]],sh,zz});}
  const ga=ctx.globalAlpha;if(alfa!=null)ctx.globalAlpha=ga*alfa;
  for(const f of vis){
    const q=f.q,tipo=f.F[7],g=grade||4,base=tex(tipo,-1,-1);
    ctx.beginPath();q.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=sombrear(base,f.sh);ctx.fill();
    const P=(s,v)=>{const a={x:lerp(q[0].x,q[1].x,s),y:lerp(q[0].y,q[1].y,s)},b={x:lerp(q[3].x,q[2].x,s),y:lerp(q[3].y,q[2].y,s)};return{x:lerp(a.x,b.x,v),y:lerp(a.y,b.y,v)};};
    for(let i=0;i<g;i++)for(let j=0;j<g;j++){const c=tex(tipo,i,j,f.F);if(!c)continue;const a=P(i/g,j/g),b=P((i+1)/g,j/g),cc=P((i+1)/g,(j+1)/g),d=P(i/g,(j+1)/g);
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(cc.x,cc.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fillStyle=sombrear(c,f.sh);ctx.fill();}
    ctx.beginPath();q.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.lineWidth=1.4*u;ctx.strokeStyle='rgba(0,0,0,.35)';ctx.stroke();
    f.P=P;
  }
  ctx.globalAlpha=ga;
  return vis;
}
function sombrear(c,k){if(c[0]!=='#')return c;return mixHex(c,'#000000',1-k);}
function hashC(i,j,k){return hash1(i*13.1+j*7.7+k*31.3);}
const BLOCOS=[
  {nome:'grama',tex:(f,i,j)=>i<0?(f==='topo'?'#5dbb46':'#8a5a32'):(f==='topo'?(hashC(i,j,1)>.6?'#4aa636':null):(j===0?'#5dbb46':(hashC(i,j,2)>.75?'#6e4524':null)))},
  {nome:'pedra',tex:(f,i,j)=>i<0?'#8a8f99':(hashC(i,j,3)>.6?'#6f747e':(hashC(i,j,4)>.85?'#a3a8b2':null))},
  {nome:'tronco',tex:(f,i,j)=>i<0?(f==='topo'?'#c79a5a':'#7a5230'):(f==='topo'?((Math.abs(i-1.5)+Math.abs(j-1.5))%2<1?'#a87a40':null):(i%2?'#5e3e22':null))},
  {nome:'areia',tex:(f,i,j)=>i<0?'#e6d39a':(hashC(i,j,5)>.65?'#d4bf82':null)},
  {nome:'gelo',alfa:.85,tex:(f,i,j)=>i<0?'#a8e4ff':((i===j||i===j+1)?'#e8f8ff':null)},
  {nome:'lava',tex:(f,i,j,F,t)=>i<0?'#ff6a1a':(Math.sin(tSim*3+i*1.7+j*2.3)>.3?'#ffd23f':(hashC(i,j,6)>.7?'#c03a0a':null))},
  {nome:'ouro',tex:(f,i,j)=>i<0?'#8a8f99':(hashC(i,j,7)>.72?'#ffd23f':(hashC(i,j,8)>.8?'#6f747e':null))},
  {nome:'diamante',tex:(f,i,j)=>i<0?'#8a8f99':(hashC(i,j,9)>.74?'#5ff2e6':(hashC(i,j,10)>.82?'#6f747e':null))},
  {nome:'abobora',rosto:true,tex:(f,i,j)=>i<0?(f==='topo'?'#e07a1a':'#f08a24'):(f==='topo'?(i===1&&j===1?'#3f7a2a':null):(i%2?'#d8741a':null))},
  {nome:'slime',alfa:.72,interno:'#2f8a2a',tex:(f,i,j)=>i<0?'#7dff6b':(hashC(i,j,11)>.85?'#b8ffad':null)},
  {nome:'ametista',tex:(f,i,j)=>i<0?'#9b5de5':((i+j)%3===0?'#c9a3ff':(hashC(i,j,12)>.8?'#6a3fb0':null))},
  {nome:'bau',bau:true,tex:(f,i,j)=>i<0?'#a0662f':(j===1?'#6e4220':(f==='topo'&&i%2?'#8a5428':null))}
];
function rostoBloco(vis,t,u,feliz,blink,abobora){
  let best=null;vis.forEach(f=>{if(f.F[7]==='lado'&&(!best||f.zz<best.zz))best=f;});if(!best)return;const P=best.P;
  const quad=(u0,v0,u1,v1,c)=>{const a=P(u0,v0),b=P(u1,v0),d=P(u0,v1),cc=P(u1,v1);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(cc.x,cc.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fillStyle=c;ctx.fill();};
  if(abobora){const c=Math.sin(t*6)>0?'#ffd23f':'#ffb020';quad(.18,.25,.38,.45,c);quad(.62,.25,.82,.45,c);quad(.22,.62,.78,.75,c);quad(.35,.55,.45,.62,c);return;}
  const h=(feliz||blink>.5)?.04:.18;quad(.24,.42-h/2,.4,.42+h/2,'#141018');quad(.6,.42-h/2,.76,.42+h/2,'#141018');
  if(!feliz&&blink<.5){quad(.24,.42-h/2,.3,.42-h/2+.06,'#ffffff');quad(.6,.42-h/2,.66,.42-h/2+.06,'#ffffff');}
  quad(.4,.66,.6,.72,feliz?'#141018':'rgba(20,16,24,.5)');
}
const ILHA=(()=>{const c=.17,cel=[],set=new Set();for(let i=-8;i<=8;i++)for(let j=-8;j<=8;j++){const x=i*c,z=j*c,d=Math.hypot(x,z)+ruido(i*3.1+j*1.7)*.18;if(d<1.12){cel.push([i,j]);set.add(i+','+j);}}return{c,cel,set};})();
const NUV_VX=Array.from({length:6},(_,i)=>{const r=mulberry(i*23+3);return{x:r(),y:.06+r()*.3,w:2+Math.floor(r()*4),v:.003+r()*.006,z:r()};});
TEMAS.voxel={
  id:'voxel',nome:'Voxel',cor:'#7dff6b',grupo:'game',
  css:{bg:'#1d2b64',fg:'#ffffff',suave:'#d6dcff',ac:'#7dff6b',fonte:'var(--ao-fonte-bloco)',raio:'2px',chip:'rgba(20,24,60,.8)'},
  pal:{texto:'#ffffff',suave:'#d6dcff',destaque:'#ffd23f',ok:'#7dff6b',alerta:'#ff5a4f',onda:'#7dff6b',escudo:'#5ff2e6',ordem:'#ffd23f',
    titulo:VX_FONTE,corpo:"'Figtree',system-ui,sans-serif",mono:VX_FONTE,tituloPeso:'',
    placaBg:'rgba(20,22,48,.88)',placaRaio:0,balaoBg:'#ffffff',balaoFg:'#1d2b64',
    nucleo:['#5ff2e6','#ffd23f','#5ff2e6','#4cd964','#ffd23f']},
  niveis:['Bloco','Base','Torre','Pirâmide','Farol Supremo'],
  cores:['#5dbb46','#8a8f99','#c79a5a','#e6d39a','#a8e4ff','#ff6a1a','#ffd23f','#5ff2e6','#f08a24','#7dff6b','#b57bff','#a0662f'],
  halo:false,escalaAgente:.9,rastroLargura:0,sombra:true,
  fundoEstatico(g,w,h){
    const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#1d2b64');gr.addColorStop(.45,'#6b4fa0');gr.addColorStop(.7,'#f08a78');gr.addColorStop(1,'#f8c08a');g.fillStyle=gr;g.fillRect(0,0,w,h);
    const q=Math.max(4,Math.round(Math.min(w,h)/90));
    for(let y=0;y<h;y+=q){g.fillStyle='rgba(0,0,0,'+(y%(q*2)?0:.04)+')';g.fillRect(0,y,w,q);}
    const sx=w*.16,sy=h*.5,ss=q*5;g.fillStyle='rgba(255,236,170,.25)';g.fillRect(sx-ss*1.6,sy-ss*1.6,ss*3.2,ss*3.2);g.fillStyle='#fff3c0';g.fillRect(sx-ss,sy-ss,ss*2,ss*2);
    const r=mulberry(8);for(let i=0;i<120;i++){g.fillStyle='rgba(255,255,255,'+(.3+r()*.6)+')';g.fillRect(Math.round(r()*w/q)*q,Math.round(r()*h*.35/q)*q,q/2,q/2);}
    const montes=(base,alt,cor,seed)=>{const rr=mulberry(seed);g.fillStyle=cor;let x=0;while(x<w){const bw=q*(4+Math.floor(rr()*8)),bh=Math.round(alt*(.3+rr()*.7)/q)*q;g.fillRect(x,base-bh,bw,h);x+=bw;}};
    montes(h*.66,h*.16,'#4a3478',2);montes(h*.72,h*.1,'#33245a',6);
    g.fillStyle='#2a1d4a';g.fillRect(0,h*.78,w,h*.22);
  },
  fundo(t){
    const q=Math.max(5,Math.round(S/80));
    for(const n of NUV_VX){const x=((n.x+t*n.v)%1.3-.15)*W-par.x*S*.05*n.z,y=n.y*H;
      for(let i=0;i<n.w;i++){ctx.fillStyle='rgba(255,220,235,.55)';ctx.fillRect(x+i*q*3,y,q*3,q*2);ctx.fillStyle='rgba(255,255,255,.65)';ctx.fillRect(x+i*q*3,y,q*3,q*.6);}
      ctx.fillStyle='rgba(255,230,240,.5)';ctx.fillRect(x+q*3,y-q*1.5,q*3*Math.max(1,n.w-2),q*1.5);}
  },
  chao(t){
    const I=ILHA,c=I.c,y=-.58,cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw);
    const cel=I.cel.map(([i,j])=>{const x=i*c-c/2,z=j*c-c/2,m=proj3(i*c,y,j*c);return{i,j,x,z,dz:m.z};}).sort((a,b)=>b.dz-a.dz);
    for(const k of cel){
      const P=[proj3(k.x,y,k.z),proj3(k.x+c,y,k.z),proj3(k.x+c,y,k.z+c),proj3(k.x,y,k.z+c)];
      for(const [di,dj,a,b] of[[0,-1,0,1],[1,0,1,2],[0,1,2,3],[-1,0,3,0]]){if(I.set.has((k.i+di)+','+(k.j+dj)))continue;const nz=di*sy+dj*cy;if(nz>=0)continue;
        const ex=[k.x,k.x+c,k.x+c,k.x][a],ez=[k.z,k.z,k.z+c,k.z+c][a],fx=[k.x,k.x+c,k.x+c,k.x][b],fz=[k.z,k.z,k.z+c,k.z+c][b];
        const A=P[a],B=P[b],A2=proj3(ex,y-c,ez),B2=proj3(fx,y-c,fz),A1=proj3(ex,y-c*.25,ez),B1=proj3(fx,y-c*.25,fz);
        ctx.beginPath();ctx.moveTo(A1.x,A1.y);ctx.lineTo(B1.x,B1.y);ctx.lineTo(B2.x,B2.y);ctx.lineTo(A2.x,A2.y);ctx.closePath();ctx.fillStyle=(k.i+k.j)&1?'#6e4524':'#7a4e2a';ctx.fill();
        ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.lineTo(B1.x,B1.y);ctx.lineTo(A1.x,A1.y);ctx.closePath();ctx.fillStyle='#4aa636';ctx.fill();}
      ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();
      const v=hashC(k.i,k.j,1);ctx.fillStyle=v>.66?'#66c450':(v>.33?'#5dbb46':'#55b03f');ctx.fill();ctx.lineWidth=.6;ctx.strokeStyle='rgba(0,0,0,.12)';ctx.stroke();
      if(v>.93){const m=proj3(k.x+c/2,y,k.z+c/2);ctx.fillStyle=hashC(k.i,k.j,5)>.5?'#ff5a8a':'#ffd23f';ctx.fillRect(m.x-2,m.y-6,4,4);ctx.fillStyle='#2f7a28';ctx.fillRect(m.x-.5,m.y-3,1,3);}
    }
  },
  orbita(pts){for(let i=0;i<pts.length;i+=4){const p=pts[i],fr=clamp((p.prof+1)/2,0,1),z=2+fr*2;ctx.fillStyle=hexA('#ffffff',.12+fr*.35);ctx.fillRect(Math.round(p.x-z/2),Math.round(p.y-z/2),z,z);}},
  rastro(a,pts,r,al){for(let i=2;i<pts.length;i+=3){const p=pts[i],k=1-i/pts.length,z=Math.max(2,r*.16*k);ctx.fillStyle=hexA(a.corT,al*k*.7);ctx.fillRect(p.x-z/2,p.y-z/2-i*.3,z,z);}},
  agente(a,t,u,inf){
    const B=BLOCOS[a.i%BLOCOS.length],ph=t*3+a.i*1.3,hop=Math.abs(Math.sin(ph))*.32,sq=hop<.08?(.08-hop)*1.6:0;
    ctx.translate(0,-hop+.15);ctx.scale(1+sq,1-sq);
    const ay=t*.5+a.i+(inf.carga>0?inf.carga*PI:0),ax=.5,tex=(f,i,j,F)=>B.tex(f,i,j,F,t);
    if(B.interno)caixa({dx:.35,dy:.35,dz:.35,ax,ay,u,tex:()=>B.interno});
    const vis=caixa({dx:.62,dy:.62,dz:.62,ax,ay,u,tex,alfa:B.alfa});
    if(B.bau){let best=null;vis.forEach(f=>{if(f.F[7]==='lado'&&(!best||f.zz<best.zz))best=f;});if(best){const p=best.P(.5,.3);ctx.fillStyle='#ffd23f';ctx.fillRect(p.x-.09,p.y-.09,.18,.22);}}
    rostoBloco(vis,t,u,inf.feliz,inf.blink,!!B.rosto);
  },
  auraNucleo(cx,cy,r,nv,t,est){
    aditivo(()=>{const w=r*(.35+.06*nv)*(1+.15*Math.sin(t*6)),g=ctx.createLinearGradient(0,cy,0,0);g.addColorStop(0,'rgba(140,255,240,'+(.25+.1*nv)+')');g.addColorStop(1,'rgba(140,255,240,0)');
      ctx.fillStyle=g;ctx.fillRect(cx-w,0,w*2,cy);ctx.fillStyle='rgba(255,255,255,'+(.12+.05*nv)+')';ctx.fillRect(cx-w*.3,0,w*.6,cy);});
    luz(cx,cy,r*2.6,'#5ff2e6',.2+est.flash*.3);
  },
  nucleo(nv,t,u,est){
    const L=nv-1,b=L?2.1/(2*L+1):.9,ay=t*.25,ax=.5,cores=['#ffd23f','#5ff2e6','#4cd964','#ffd23f'];
    const tot=L*b+b,y0=-tot/2+b/2+.15;
    for(let k=0;k<L;k++){const n=2*(L-k)+1,hc=n*b/2,cor=cores[k%cores.length];
      caixa({dx:hc,dy:b/2,dz:hc,oy:y0+k*b,ax,ay,u,grade:n,tex:(f,i,j)=>i<0?cor:((i+j)%2?mixHex(cor,'#ffffff',.25):null)});}
    const yb=y0+L*b,cc=est.medo>0&&Math.sin(t*14)>0?'#ff5a4f':'#5ff2e6';
    caixa({dx:b*.48,dy:b*.48,dz:b*.48,oy:yb,ax,ay,u,grade:3,alfa:.9,tex:(f,i,j)=>i<0?'#bff8ff':(i===1&&j===1?cc:(hashC(i,j,13)>.6?'#ffffff':null))});
    const tp=(()=>{const X=0,Z=0,cp=Math.cos(ax),sp=Math.sin(ax);return{x:X,y:-((yb+b*.48)*cp+Z*sp)};})();
    luz(tp.x,tp.y+b*.5,b*1.4,cc,.6+est.flash*.3);
    if(est.dano>0){ctx.fillStyle='rgba(255,255,255,'+est.dano*.5+')';ctx.fillRect(-1.2,-1.4,2.4,2.6);}
  },
  escudo(cx,cy,R,f,t,nv,rip,on){
    ctx.save();ctx.globalAlpha*=on;const c=f>.5?'#5ff2e6':(f>.25?'#ffd23f':'#ff5a4f'),q=Math.max(4,R/9);
    for(let i=0;i<40;i++){const a=i/40*TAU+t*.2;let k=1;rip.forEach(w=>{const d=Math.atan2(Math.sin(a-w.ang),Math.cos(a-w.ang));if(Math.abs(d)<.45)k=1+(1-w.t)*.1;});
      const x=cx+Math.cos(a)*R*k,y=cy+Math.sin(a)*R*k;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=hexA(c,.45);ctx.fillRect(-q/2,-q/2,q,q);ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1;ctx.strokeRect(-q/2,-q/2,q,q);ctx.restore();}
    const n=10;for(let i=0;i<n;i++){ctx.fillStyle=i<f*n?c:'rgba(255,255,255,.15)';ctx.fillRect(cx-n*q*.55+i*q*1.1,cy-R-q*2.6,q,q);}
    ctx.restore();
  },
  tiro(s,t){
    if(s.tipo==='intercepta'){ctx.fillStyle='#ffffff';ctx.fillRect(-10,-1.5,16,3);ctx.fillRect(4,-4,3,8);ctx.fillRect(-12,-3,3,6);return;}
    if(s.tipo==='mercado'){ctx.fillStyle='#fff';ctx.fillRect(-14,-2,24,4);ctx.fillStyle=s.cor;ctx.fillRect(-18,-4,5,8);return;}
    ctx.rotate(-s.ang);ctx.scale(7,7);const u=1/7;
    if(s.tipo==='ataque'){caixa({dx:.7,dy:.7,dz:.7,ax:.5,ay:s.t*6,u,tex:(f,i,j)=>i<0?'#d8342a':(j===1||j===2?'#ffffff':null)});if(Math.sin(t*30)>0){ctx.fillStyle='#ffd23f';ctx.fillRect(-.15,-1.6,.3,.3);}return;}
    const cor=s.tipo==='fill'?(s.ganho?'#ffd23f':'#ff5a4f'):(s.tipo==='ordem'?'#ffd23f':s.cor);
    caixa({dx:.6,dy:.6,dz:.6,ax:.5,ay:s.t*8,u,grade:2,tex:(f,i,j)=>i<0?cor:((i+j)%2?mixHex(cor,'#ffffff',.35):null)});
  },
  frente(t){particulasFrente(t,'#ffe9c4',true);}
};

/* ================= utilidades extras (grupos Natureza e Pop) ================= */
function palDe(o){return Object.assign({texto:'#ffffff',suave:'#c8d0e0',destaque:'#ffd23f',ok:'#6dff9e',alerta:'#ff5a5a',onda:'#ffffff',escudo:'#7fe8ff',ordem:'#ffd23f',
  titulo:"'Fredoka','Figtree',system-ui,sans-serif",corpo:"'Figtree',system-ui,sans-serif",mono:"'JetBrains Mono',ui-monospace,monospace",tituloPeso:'700 ',
  placaBg:'rgba(10,12,24,.84)',placaRaio:8,balaoBg:'rgba(255,255,255,.96)',balaoFg:'#1a1a2a',nucleo:['#ffffff','#ffffff','#ffffff','#ffffff','#ffffff']},o);}
/* preenchimento "brilhante" com contorno */
function gloss(path,cor,u,lw,esc){path();const g=ctx.createLinearGradient(0,-1,0,1);g.addColorStop(0,mixHex(cor,'#ffffff',.38));g.addColorStop(1,mixHex(cor,'#000000',.32));
  ctx.fillStyle=g;ctx.fill();if(lw!==0){ctx.lineWidth=(lw||2.4)*u;ctx.strokeStyle=esc||mixHex(cor,'#000000',.58);ctx.lineJoin='round';ctx.stroke();}}
function esfera3(cor,r,x,y){x=x||0;y=y||0;const g=ctx.createRadialGradient(x-.35*r,y-.4*r,r*.05,x,y,r);g.addColorStop(0,mixHex(cor,'#ffffff',.6));g.addColorStop(.5,cor);g.addColorStop(1,mixHex(cor,'#000000',.45));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}
function olhinhos(x,y,sep,r,look,blink){for(const s of[-1,1]){if(blink>.5){ctx.fillStyle='#141018';ctx.fillRect(x+s*sep-r,y-r*.2,r*2,r*.4);continue;}
  ctx.beginPath();ctx.arc(x+s*sep,y,r,0,TAU);ctx.fillStyle='#141018';ctx.fill();ctx.beginPath();ctx.arc(x+s*sep-r*.35+look.x*r*.2,y-r*.35+look.y*r*.2,r*.38,0,TAU);ctx.fillStyle='#ffffff';ctx.fill();}}
function orientar(dir){const a=Math.atan2(dir.y,dir.x);ctx.rotate(a);if(Math.cos(a)<0)ctx.scale(1,-1);}
function nuvemPath(cs){ctx.beginPath();cs.forEach(([x,y,r])=>{ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,TAU);});}
const NUVEM_STD=[[-.55,.12,.38],[-.15,-.18,.48],[.35,-.08,.42],[.65,.18,.3],[.05,.2,.42]];
function nuvem(cor,u,esc,dx,dy){ctx.save();ctx.translate(dx||0,dy||0);ctx.scale(esc||1,esc||1);const cs=NUVEM_STD;
  nuvemPath(cs);ctx.lineWidth=5*u/(esc||1);ctx.strokeStyle=mixHex(cor,'#000000',.35);ctx.lineJoin='round';ctx.stroke();
  const g=ctx.createLinearGradient(0,-.7,0,.6);g.addColorStop(0,'#ffffff');g.addColorStop(1,cor);nuvemPath(cs);ctx.fillStyle=g;ctx.fill();ctx.restore();}
function tiroItem(s,fn){if(s.tipo==='sinal'||s.tipo==='passe'){ctx.save();ctx.rotate(-s.ang+s.t*6);ctx.scale(8,8);fn(s);ctx.restore();luz(0,0,10,s.cor,.4);}else tiroPadrao(s);}

/* ================= GRUPO NATUREZA ================= */

/* ---------- OCEANO ---------- */
function peixe(c1,c2,u,t,k,o){
  o=o||{};const al=o.alt||.52,sw=Math.sin(t*8+k)*.12;
  ctx.beginPath();ctx.moveTo(-.7,0);ctx.lineTo(-1.25,-.45+sw);ctx.quadraticCurveTo(-1.05,0,-1.25,.45+sw);ctx.closePath();ctx.fillStyle=c2;ctx.fill();ctx.lineWidth=2*u;ctx.strokeStyle=mixHex(c1,'#000000',.5);ctx.stroke();
  if(o.dorsal!==false){ctx.beginPath();ctx.moveTo(-.35,-al+.08);ctx.quadraticCurveTo(o.dorsalAlta?-.05:0,-al-(o.dorsalAlta?.6:.32),.3,-al+.1);ctx.closePath();ctx.fillStyle=c2;ctx.fill();ctx.stroke();}
  gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.85,al,0,0,TAU);},c1,u);
  if(o.barriga){ctx.save();ctx.beginPath();ctx.ellipse(0,0,.85,al,0,0,TAU);ctx.clip();ctx.fillStyle=o.barriga;ctx.beginPath();ctx.ellipse(.1,al*.75,.8,al*.5,0,0,TAU);ctx.fill();ctx.restore();}
  if(o.listras){ctx.save();ctx.beginPath();ctx.ellipse(0,0,.85,al,0,0,TAU);ctx.clip();for(const x of[-.38,.22]){ctx.fillStyle=o.listras;ctx.fillRect(x-.09,-1,.18,2);ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(x-.11,-1,.03,2);ctx.fillRect(x+.08,-1,.03,2);}ctx.restore();}
  if(o.guelras){ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.5*u;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(.25-i*.1,0,.25,-.6,.6);ctx.stroke();}}
  ctx.beginPath();ctx.ellipse(-.05,.18,.22,.08,.6+sw*2,0,TAU);ctx.fillStyle=c2;ctx.fill();
  ctx.beginPath();ctx.arc(.5,-.12,.13,0,TAU);ctx.fillStyle='#ffffff';ctx.fill();ctx.beginPath();ctx.arc(.54,-.12,.075,0,TAU);ctx.fillStyle='#111';ctx.fill();
  ctx.beginPath();ctx.arc(.78,.1,.06,.2,PI-.2);ctx.lineWidth=1.5*u;ctx.strokeStyle='rgba(0,0,0,.5)';ctx.stroke();
  brilho(-.05,-al*.6,.4,.08,0,.35);
}
const MAR=[
  (a,t,u,f,c)=>{orientar(f.dir);peixe(c,mixHex(c,'#000000',.2),u,t,a.i,{listras:'#ffffff'});},
  (a,t,u,f,c)=>{const r=.72*(1+f.carga*.35+.04*Math.sin(t*3));ctx.strokeStyle=mixHex(c,'#000000',.4);ctx.lineWidth=2*u;
    for(let i=0;i<18;i++){const aa=i/18*TAU;ctx.beginPath();ctx.moveTo(Math.cos(aa)*r,Math.sin(aa)*r);ctx.lineTo(Math.cos(aa)*(r+.18),Math.sin(aa)*(r+.18));ctx.stroke();}
    esfera3(c,r);ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(0,r*.45,r*.65,r*.35,0,0,TAU);ctx.fill();olhinhos(f.look.x*.1,-.15,.28,.12,f.look,f.blink);
    ctx.beginPath();ctx.arc(0,.18,.08,0,TAU);ctx.fillStyle='#5a2a2a';ctx.fill();},
  (a,t,u,f,c)=>{for(let k=0;k<8;k++){const x0=-.6+k*.17;ctx.beginPath();ctx.moveTo(x0,.2);for(let s=1;s<=10;s++)ctx.lineTo(x0+Math.sin(t*3+s*.6+k)*.12*s/6,.2+s*.11);
      ctx.lineWidth=7*u;ctx.lineCap='round';ctx.strokeStyle=mixHex(c,'#000000',.15);ctx.stroke();}
    gloss(()=>{ctx.beginPath();ctx.ellipse(0,-.25,.7,.65,0,0,TAU);},c,u);olhinhos(f.look.x*.08,-.2,.25,.11,f.look,f.blink);brilho(-.25,-.6,.2,.08,-.4,.5);},
  (a,t,u,f,c)=>{orientar(f.dir);const p=Math.sin(t*4+a.i)*.35;ctx.fillStyle='#6fbf6a';
    for(const [x,y,s] of[[.35,-.5,1],[.35,.5,-1],[-.45,-.42,1],[-.45,.42,-1]]){ctx.save();ctx.translate(x,y);ctx.rotate(s*(.5+p));ctx.beginPath();ctx.ellipse(0,s*-.12,.12,.3,0,0,TAU);ctx.fill();ctx.restore();}
    ctx.beginPath();ctx.arc(.85,0,.2,0,TAU);ctx.fillStyle='#7fd07a';ctx.fill();ctx.beginPath();ctx.arc(.92,-.07,.04,0,TAU);ctx.fillStyle='#111';ctx.fill();
    gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.72,.58,0,0,TAU);},c,u);ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1.5*u;
    for(const [x,y] of[[0,0],[-.35,-.2],[-.35,.2],[.32,-.2],[.32,.2]]){ctx.beginPath();for(let k=0;k<6;k++){const aa=k/6*TAU;ctx.lineTo(x+Math.cos(aa)*.17,y+Math.sin(aa)*.17);}ctx.closePath();ctx.stroke();}},
  (a,t,u,f,c)=>{ctx.translate(0,Math.sin(t*2+a.i)*.08);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(.1,-.75);ctx.quadraticCurveTo(.55,-.35,.15,.05);ctx.quadraticCurveTo(-.3,.45,.05,.75);ctx.quadraticCurveTo(.35,1.0,.25,.7);
    ctx.lineWidth=.42;ctx.strokeStyle=mixHex(c,'#000000',.45);ctx.stroke();ctx.lineWidth=.32;ctx.strokeStyle=c;ctx.stroke();
    ctx.beginPath();ctx.ellipse(.08,-.78,.26,.2,.3,0,TAU);ctx.fillStyle=c;ctx.fill();ctx.beginPath();ctx.moveTo(.25,-.82);ctx.lineTo(.62,-.72);ctx.lineTo(.6,-.64);ctx.lineTo(.25,-.7);ctx.fill();
    ctx.beginPath();ctx.arc(.12,-.82,.06,0,TAU);ctx.fillStyle='#111';ctx.fill();const fl=Math.sin(t*14)*.1;ctx.beginPath();ctx.ellipse(-.22,-.1,.12,.2+fl,0,0,TAU);ctx.fillStyle=hexA('#ffffff',.5);ctx.fill();},
  (a,t,u,f,c)=>{ctx.rotate(t*.3+a.i);ctx.beginPath();for(let i=0;i<10;i++){const aa=i/10*TAU-PI/2,r=i%2?.38:1;ctx.lineTo(Math.cos(aa)*r,Math.sin(aa)*r);}ctx.closePath();
    const g=ctx.createRadialGradient(0,0,.1,0,0,1);g.addColorStop(0,mixHex(c,'#ffffff',.4));g.addColorStop(1,c);ctx.fillStyle=g;ctx.fill();ctx.lineWidth=2.5*u;ctx.lineJoin='round';ctx.strokeStyle=mixHex(c,'#000000',.45);ctx.stroke();
    for(let i=0;i<5;i++){const aa=i/5*TAU-PI/2;for(let k=1;k<4;k++){ctx.beginPath();ctx.arc(Math.cos(aa)*k*.22,Math.sin(aa)*k*.22,.05,0,TAU);ctx.fillStyle='rgba(255,255,255,.7)';ctx.fill();}}},
  (a,t,u,f,c)=>{const w=Math.sin(t*10+a.i)*.08;ctx.strokeStyle=mixHex(c,'#000000',.35);ctx.lineWidth=4*u;ctx.lineCap='round';
    for(const s of[-1,1])for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(s*.4,.15+k*.12);ctx.lineTo(s*(.85+k*.05),.3+k*.18+(k%2?w:-w));ctx.lineTo(s*(.95+k*.05),.55+k*.15);ctx.stroke();}
    for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*.45,-.15);ctx.lineTo(s*.75,-.45);ctx.stroke();ctx.save();ctx.translate(s*.85,-.62);ctx.rotate(s*(.3+w*2));ctx.beginPath();ctx.arc(0,0,.22,s>0?-.3:PI-1.3,s>0?4.8:PI+4.6+.5);ctx.lineTo(0,0);ctx.closePath();ctx.fillStyle=c;ctx.fill();ctx.stroke();ctx.restore();}
    gloss(()=>{ctx.beginPath();ctx.ellipse(0,.1,.62,.42,0,0,TAU);},c,u);for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*.15,-.25);ctx.lineTo(s*.18,-.48);ctx.stroke();}
    olhinhos(0,-.52,.18,.09,f.look,f.blink);},
  (a,t,u,f,c)=>{orientar(f.dir);for(let k=0;k<6;k++){ctx.beginPath();ctx.moveTo(-.4,(k-2.5)*.08);for(let s=1;s<=8;s++)ctx.lineTo(-.4-s*.11,(k-2.5)*.08*(1+s*.15)+Math.sin(t*6+s*.7+k)*.06);ctx.lineWidth=3.5*u;ctx.lineCap='round';ctx.strokeStyle=mixHex(c,'#000000',.15);ctx.stroke();}
    gloss(()=>{ctx.beginPath();ctx.moveTo(1,0);ctx.quadraticCurveTo(.6,-.42,-.4,-.3);ctx.lineTo(-.4,.3);ctx.quadraticCurveTo(.6,.42,1,0);},c,u);
    ctx.beginPath();ctx.moveTo(.9,0);ctx.lineTo(.55,-.5);ctx.lineTo(.45,-.15);ctx.moveTo(.9,0);ctx.lineTo(.55,.5);ctx.lineTo(.45,.15);ctx.fillStyle=mixHex(c,'#000000',.15);ctx.fill();
    ctx.beginPath();ctx.arc(-.25,-.12,.09,0,TAU);ctx.fillStyle='#fff';ctx.fill();ctx.beginPath();ctx.arc(-.28,-.12,.05,0,TAU);ctx.fillStyle='#111';ctx.fill();},
  (a,t,u,f,c)=>{orientar(f.dir);const fl=.55+.45*Math.sin(t*4+a.i);ctx.beginPath();ctx.moveTo(-.4,0);ctx.quadraticCurveTo(-1.0,.05,-1.5,Math.sin(t*3)*.1);ctx.lineWidth=2.5*u;ctx.strokeStyle=mixHex(c,'#000000',.4);ctx.stroke();
    gloss(()=>{ctx.beginPath();ctx.moveTo(.8,0);ctx.quadraticCurveTo(.3,-1.0*fl,-.5,-1.0*fl);ctx.quadraticCurveTo(-.2,0,-.5,1.0*fl);ctx.quadraticCurveTo(.3,1.0*fl,.8,0);},c,u);
    for(const s of[-1,1]){ctx.beginPath();ctx.arc(.45,s*.15,.06,0,TAU);ctx.fillStyle='#111';ctx.fill();}},
  (a,t,u,f,c)=>{orientar(f.dir);peixe('#9fb3c8',mixHex('#9fb3c8','#000000',.2),u,t,a.i,{barriga:'#f2f6fa',dorsalAlta:true,guelras:true,alt:.48});ctx.fillStyle=c;ctx.fillRect(-.2,-.05,.12,.1);},
  (a,t,u,f,c)=>{orientar(f.dir);const sw=Math.sin(t*3+a.i)*.15;ctx.beginPath();ctx.moveTo(-.8,0);ctx.lineTo(-1.25,-.35+sw);ctx.lineTo(-1.1,0);ctx.lineTo(-1.25,.35+sw);ctx.closePath();ctx.fillStyle=mixHex(c,'#000000',.2);ctx.fill();
    gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.95,.55,0,0,TAU);},c,u);ctx.save();ctx.beginPath();ctx.ellipse(0,0,.95,.55,0,0,TAU);ctx.clip();ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.ellipse(.15,.45,.85,.3,0,0,TAU);ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=1*u;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-.4+i*.15,.25);ctx.lineTo(-.3+i*.15,.5);ctx.stroke();}ctx.restore();
    ctx.beginPath();ctx.arc(.55,-.05,.07,0,TAU);ctx.fillStyle='#111';ctx.fill();ctx.beginPath();ctx.ellipse(.05,.22,.2,.07,.5,0,TAU);ctx.fillStyle=mixHex(c,'#000000',.2);ctx.fill();},
  (a,t,u,f,c)=>{orientar(f.dir);ctx.beginPath();ctx.moveTo(.5,-.35);ctx.quadraticCurveTo(.8,-1,1.15,-.7);ctx.lineWidth=2*u;ctx.strokeStyle='#6a7a8a';ctx.stroke();luz(1.15,-.7,.5,c,.9);ctx.beginPath();ctx.arc(1.15,-.7,.1,0,TAU);ctx.fillStyle='#ffffff';ctx.fill();
    peixe('#2a3346','#1a2030',u,t,a.i,{alt:.55});ctx.fillStyle='#e8eef8';for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(.6+i*.06,.12);ctx.lineTo(.63+i*.06,.22);ctx.lineTo(.66+i*.06,.12);ctx.fill();}}
];
function concha(ab,u,cor){
  const forma=()=>{ctx.beginPath();ctx.moveTo(-.95,0);for(let i=0;i<=8;i++){const aa=PI+i/8*PI,r=.95;const x=Math.cos(aa)*r,y=Math.sin(aa)*r*.85;const am=PI+(i-.5)/8*PI;if(i>0)ctx.quadraticCurveTo(Math.cos(am)*1.05,Math.sin(am)*.95,x,y);}ctx.lineTo(.2,0);ctx.lineTo(-.2,0);ctx.closePath();};
  const metade=(sy)=>{ctx.save();ctx.scale(1,sy);gloss(forma,cor,u);ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=1.5*u;for(let i=1;i<8;i++){const aa=PI+i/8*PI;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(aa)*.9,Math.sin(aa)*.78);ctx.stroke();}ctx.restore();};
  metade(-.6);ctx.save();ctx.rotate(-ab);metade(.7);ctx.restore();
}
function perola(r,t){luz(0,0,r*3,'#ffe8ff',.55);esfera3('#f6eaff',r);ctx.beginPath();ctx.arc(-r*.3,-r*.35,r*.25,0,TAU);ctx.fillStyle='rgba(255,255,255,.85)';ctx.fill();}
const BOLHAS=Array.from({length:40},(_,i)=>{const r=mulberry(i*11+2);return{x:r(),o:r(),v:.03+r()*.06,s:1+r()*4,z:r()};});
TEMAS.oceano={
  id:'oceano',nome:'Oceano',cor:'#4fd8ff',grupo:'natureza',
  css:{bg:'#031a33',fg:'#e6faff',suave:'#8fc3d8',ac:'#4fd8ff',fonte:"'Fredoka',var(--ao-fonte-corpo)",raio:'999px',chip:'rgba(2,20,40,.78)'},
  pal:palDe({texto:'#e6faff',suave:'#8fc3d8',destaque:'#4fd8ff',ok:'#7dffcf',alerta:'#ff6b6b',onda:'#9feaff',escudo:'#9feaff',ordem:'#ffe08a',placaBg:'rgba(2,24,48,.84)',balaoFg:'#03243f',
    nucleo:['#fff3c4','#f6eaff','#ffc4dc','#ff9a8a','#ffe08a']}),
  niveis:['Grão de Areia','Pérola','Concha','Recife','Pérola Rainha'],
  cores:['#ff8c42','#ffd23f','#c06bff','#5fbf6a','#ffb347','#ff5e78','#ff6b4a','#ff9de2','#4fa8ff','#9fb3c8','#3a6bff','#7af0ff'],
  halo:false,escalaAgente:.95,rastroLargura:0,
  fundoEstatico(g,w,h){
    const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#0f5a8a');gr.addColorStop(.45,'#063257');gr.addColorStop(1,'#020c1c');g.fillStyle=gr;g.fillRect(0,0,w,h);
    const r=mulberry(66);g.fillStyle='#0b2a2a';
    for(let i=0;i<14;i++){const x=r()*w,hh=h*(.15+r()*.3),ww=8+r()*14;g.beginPath();g.moveTo(x,h);for(let y=0;y<=hh;y+=8)g.lineTo(x+Math.sin(y*.04+i)*ww,h-y);for(let y=hh;y>=0;y-=8)g.lineTo(x+Math.sin(y*.04+i)*ww+ww*.6,h-y);g.fill();}
    const sg=g.createLinearGradient(0,h*.88,0,h);sg.addColorStop(0,'rgba(194,170,120,0)');sg.addColorStop(1,'rgba(194,170,120,.35)');g.fillStyle=sg;g.fillRect(0,h*.85,w,h*.15);
    pintaVinheta(g,w,h,.6,'#00060f');
  },
  fundo(t,dt){
    aditivo(()=>{for(let i=0;i<6;i++){const x=W*(.1+i*.17)+Math.sin(t*.3+i)*W*.04,g=ctx.createLinearGradient(x,0,x+W*.15,H);g.addColorStop(0,'rgba(180,240,255,.12)');g.addColorStop(1,'rgba(180,240,255,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+W*.05,0);ctx.lineTo(x+W*.22,H);ctx.lineTo(x+W*.12,H);ctx.closePath();ctx.fill();}});
    for(const b of BOLHAS){const y=H*(1-((b.o+t*b.v)%1.1)),x=b.x*W+Math.sin(t*2+b.o*9)*6-par.x*S*.05*b.z;ctx.beginPath();ctx.arc(x,y,b.s,0,TAU);ctx.strokeStyle='rgba(200,245,255,'+(.2+.3*b.z)+')';ctx.lineWidth=1;ctx.stroke();}
  },
  chao(t){aditivo(()=>noPlano(0,-.55,0,u=>{for(let i=0;i<26;i++){const x=Math.sin(i*7.1+t*.4)*1.1,z=Math.cos(i*3.7+t*.3)*.9,r=.12+.08*Math.sin(t+i);ctx.beginPath();ctx.ellipse(x,z,r*1.6,r,i,0,TAU);ctx.lineWidth=2*u;ctx.strokeStyle='rgba(170,240,255,.1)';ctx.stroke();}}));},
  agente(a,t,u,inf){MAR[a.i%MAR.length](a,t,u,inf,a.corT);},
  auraNucleo(cx,cy,r,nv,t,est){luz(cx,cy,r*3.5,'#bff4ff',.2+est.flash*.3);},
  nucleo(nv,t,u,est){
    ctx.translate(0,Math.sin(t*1.5)*.05);
    if(nv===1){for(let i=0;i<7;i++){ctx.beginPath();ctx.arc(Math.cos(i*2.4)*.5,.3+Math.sin(i*1.7)*.15,.06,0,TAU);ctx.fillStyle='#d8c08a';ctx.fill();}luz(0,0,.8,'#fff3c4',.7+.3*Math.sin(t*4));esfera3('#fff3c4',.18);}
    else if(nv===2)perola(.42,t);
    else{if(nv>=4){ctx.lineCap='round';const ramo=(x,y,a,l,d)=>{if(d>3)return;const x2=x+Math.cos(a)*l,y2=y+Math.sin(a)*l;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.lineWidth=(.16-d*.03);ctx.strokeStyle=d%2?'#ff7a8a':'#ff9a6a';ctx.stroke();
        ramo(x2,y2,a-.45+Math.sin(t+d)*.05,l*.72,d+1);ramo(x2,y2,a+.45,l*.72,d+1);};ramo(-.7,.5,-PI/2-.3,.55,0);ramo(.7,.5,-PI/2+.3,.55,0);if(nv>=5)ramo(0,.6,-PI/2,.7,0);}
      ctx.save();ctx.translate(0,.3);concha(.55+.1*Math.sin(t*1.2),u,nv>=5?'#ffd6e6':'#f4c8a8');ctx.translate(0,-.12);perola(nv>=5?.32:.24,t);ctx.restore();
      if(nv>=5)aditivo(()=>{for(let i=0;i<10;i++){ctx.save();ctx.rotate(i/10*TAU+t*.1);const g=ctx.createLinearGradient(.4,0,2.2,0);g.addColorStop(0,'rgba(255,240,200,.3)');g.addColorStop(1,'rgba(255,240,200,0)');ctx.fillStyle=g;ctx.fillRect(.4,-.03,1.8,.06);ctx.restore();}});}
    if(est.dano>0)luz(0,0,1.2,'#ffffff',est.dano*.6);
  },
  escudo(cx,cy,R,f,t,nv,rip,on){
    ctx.save();ctx.globalAlpha*=on;const rr=a=>{let b=0;rip.forEach(w=>{const d=Math.atan2(Math.sin(a-w.ang),Math.cos(a-w.ang));b+=Math.exp(-d*d*6)*(1-w.t)*.1;});return R*(1-b+.01*Math.sin(a*6+t*3));};
    ctx.beginPath();for(let i=0;i<=90;i++){const a=i/90*TAU,q=rr(a);i?ctx.lineTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q):ctx.moveTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q);}ctx.closePath();
    const g=ctx.createRadialGradient(cx,cy,R*.7,cx,cy,R);g.addColorStop(0,'rgba(200,245,255,0)');g.addColorStop(1,'rgba(200,245,255,.22)');ctx.fillStyle=g;ctx.fill();
    const gl=ctx.createLinearGradient(cx-R,cy-R,cx+R,cy+R);['#ff9de2','#9feaff','#ffe08a','#9dffcf'].forEach((c,i)=>gl.addColorStop(i/3,c));ctx.strokeStyle=gl;ctx.lineWidth=2.5;ctx.stroke();
    ctx.beginPath();ctx.ellipse(cx-R*.4,cy-R*.45,R*.25,R*.1,-.6,0,TAU);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,R*1.07+4,-PI/2,-PI/2+TAU*f);ctx.lineWidth=3;ctx.lineCap='round';ctx.strokeStyle=f>.3?'#9feaff':'#ff6b6b';ctx.stroke();ctx.restore();
  },
  tiro(s,t){
    if(s.tipo==='ataque'){ctx.rotate(-s.ang);ctx.strokeStyle='#cfd8e0';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(0,4);ctx.arc(-4,4,4,0,PI*.9);ctx.stroke();ctx.beginPath();ctx.moveTo(-7.5,5);ctx.lineTo(-9,1);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(0,-40);ctx.lineWidth=.6;ctx.stroke();return;}
    if(s.tipo==='sinal'||s.tipo==='passe'){ctx.beginPath();ctx.arc(0,0,5.5,0,TAU);ctx.strokeStyle='rgba(220,250,255,.95)';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle=hexA(s.cor,.35);ctx.fill();ctx.beginPath();ctx.arc(-2,-2,1.6,0,TAU);ctx.fillStyle='#fff';ctx.fill();return;}
    tiroPadrao(s);
  },
  frente(t){particulasFrente(t,'#bff4ff',true);}
};

/* ---------- FLORESTA ---------- */
const BICHOS=[
  (a,t,u,f,c)=>{const ab=f.carga>0?.5:0;ctx.strokeStyle='#1a1a1a';ctx.lineWidth=2.5*u;for(const s of[-1,1])for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(s*.4,-.1+k*.25);ctx.lineTo(s*.75,-.2+k*.3+Math.sin(t*12+k+s)*.05);ctx.stroke();}
    ctx.beginPath();ctx.arc(0,-.62,.3,0,TAU);ctx.fillStyle='#1a1a1a';ctx.fill();olhinhos(0,-.68,.13,.06,f.look,f.blink);
    for(const s of[-1,1]){ctx.save();ctx.rotate(s*ab);gloss(()=>{ctx.beginPath();ctx.moveTo(0,-.4);ctx.arc(0,.1,.62,-PI/2,PI/2,s<0);ctx.closePath();},c,u);
      ctx.fillStyle='#1a1a1a';for(const [x,y] of[[.3,-.1],[.25,.3],[.45,.15]]){ctx.beginPath();ctx.arc(s*x,y,.09,0,TAU);ctx.fill();}ctx.restore();}
    ctx.beginPath();ctx.moveTo(0,-.4);ctx.lineTo(0,.72);ctx.stroke();brilho(-.25,-.2,.15,.06,-.5,.5);},
  (a,t,u,f,c)=>{const fl=.25+.75*Math.abs(Math.sin(t*6+a.i));const c2=mixHex(c,'#ffffff',.4);
    for(const s of[-1,1]){ctx.save();ctx.scale(s*fl,1);gloss(()=>{ctx.beginPath();ctx.ellipse(.48,-.32,.48,.42,-.4,0,TAU);},c,u);gloss(()=>{ctx.beginPath();ctx.ellipse(.38,.32,.32,.3,.4,0,TAU);},c2,u);
      ctx.fillStyle='rgba(255,255,255,.8)';ctx.beginPath();ctx.arc(.55,-.38,.1,0,TAU);ctx.fill();ctx.fillStyle='#1a1a1a';ctx.beginPath();ctx.arc(.75,-.55,.06,0,TAU);ctx.fill();ctx.restore();}
    ctx.beginPath();ctx.ellipse(0,0,.08,.55,0,0,TAU);ctx.fillStyle='#2a1a10';ctx.fill();ctx.strokeStyle='#2a1a10';ctx.lineWidth=1.5*u;for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(0,-.5);ctx.quadraticCurveTo(s*.15,-.8,s*.25,-.85);ctx.stroke();}},
  (a,t,u,f,c)=>{const p=.5+.5*Math.sin(t*3+a.i);luz(0,.3,1.4,'#d4ff6a',.35+.4*p);ctx.fillStyle='rgba(220,240,255,.45)';for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(s*.35,-.25,.4,.18,s*(.4+Math.sin(t*30)*.2),0,TAU);ctx.fill();}
    ctx.beginPath();ctx.ellipse(0,-.3,.22,.28,0,0,TAU);ctx.fillStyle='#3a2a1a';ctx.fill();ctx.beginPath();ctx.ellipse(0,.3,.26,.4,0,0,TAU);ctx.fillStyle=mixHex('#d4ff6a','#ffffff',p*.4);ctx.fill();olhinhos(0,-.4,.1,.06,f.look,f.blink);},
  (a,t,u,f,c)=>{ctx.strokeStyle='#1a1a1a';ctx.lineWidth=2.5*u;for(const s of[-1,1])for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(s*.35,-.1+k*.28);ctx.lineTo(s*.8,-.25+k*.35+Math.sin(t*10+k)*.06);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(0,-.7);ctx.quadraticCurveTo(.1,-1.1,.3,-1.05);ctx.stroke();
    const g=ctx.createLinearGradient(-.5,-.6,.5,.7);g.addColorStop(0,'#5dffb0');g.addColorStop(.5,c);g.addColorStop(1,'#6a2aa8');ctx.beginPath();ctx.ellipse(0,.1,.5,.72,0,0,TAU);ctx.fillStyle=g;ctx.fill();ctx.lineWidth=2.5*u;ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,-.35);ctx.lineTo(0,.8);ctx.stroke();ctx.beginPath();ctx.arc(0,-.62,.25,0,TAU);ctx.fillStyle='#1a1a1a';ctx.fill();brilho(-.2,-.1,.12,.25,0,.4);},
  (a,t,u,f,c)=>{orientar(f.dir);const fl=Math.sin(t*28)*.25;ctx.fillStyle='rgba(220,245,255,.4)';ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1*u;
    for(const [x,s,k] of[[.3,-1,1],[.3,1,1],[.05,-1,.85],[.05,1,.85]]){ctx.save();ctx.translate(x,0);ctx.rotate(s*(1.3+fl));ctx.beginPath();ctx.ellipse(.5*k,0,.5*k,.12,0,0,TAU);ctx.fill();ctx.stroke();ctx.restore();}
    for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(-.15-i*.15,0,.09,.07,0,0,TAU);ctx.fillStyle=i%2?c:mixHex(c,'#000000',.3);ctx.fill();}
    ctx.beginPath();ctx.ellipse(.25,0,.18,.12,0,0,TAU);ctx.fillStyle=c;ctx.fill();ctx.beginPath();ctx.arc(.5,-.08,.1,0,TAU);ctx.arc(.5,.08,.1,0,TAU);ctx.fillStyle='#2a6a5a';ctx.fill();},
  (a,t,u,f,c)=>{const st=Math.sin(t*2+a.i)*.05;ctx.beginPath();ctx.moveTo(-.9,.55);ctx.quadraticCurveTo(-.2,.6+st,.7,.5);ctx.quadraticCurveTo(.95,.45,.9,.2);ctx.lineTo(.55,.35);ctx.closePath();ctx.fillStyle='#c9b48a';ctx.fill();
    ctx.strokeStyle='#8a7550';ctx.lineWidth=1.5*u;ctx.stroke();for(const x of[.75,.88]){ctx.beginPath();ctx.moveTo(x,.25);ctx.lineTo(x+.05,-.12);ctx.stroke();ctx.beginPath();ctx.arc(x+.05,-.14,.05,0,TAU);ctx.fillStyle='#1a1a1a';ctx.fill();}
    gloss(()=>{ctx.beginPath();ctx.arc(-.1,0,.6,0,TAU);},c,u);ctx.beginPath();for(let i=0;i<60;i++){const aa=i*.22,r=.55-i*.009;ctx.lineTo(-.1+Math.cos(aa)*r,Math.sin(aa)*r);}ctx.strokeStyle=mixHex(c,'#000000',.45);ctx.lineWidth=2*u;ctx.stroke();},
  (a,t,u,f,c)=>{ctx.translate(0,Math.sin(t*2+a.i)*.03);gloss(()=>{ctx.beginPath();ctx.moveTo(-.25,0);ctx.quadraticCurveTo(-.3,.8,-.2,.9);ctx.lineTo(.2,.9);ctx.quadraticCurveTo(.3,.8,.25,0);ctx.closePath();},'#f2ead8',u);
    gloss(()=>{ctx.beginPath();ctx.moveTo(-.95,.08);ctx.quadraticCurveTo(-.9,-.9,0,-.9);ctx.quadraticCurveTo(.9,-.9,.95,.08);ctx.quadraticCurveTo(0,-.08,-.95,.08);},c,u);
    ctx.fillStyle='rgba(255,255,255,.9)';for(const [x,y,r] of[[-.45,-.35,.12],[.1,-.6,.14],[.5,-.3,.1],[-.1,-.2,.08]]){ctx.beginPath();ctx.ellipse(x,y,r,r*.8,0,0,TAU);ctx.fill();}},
  (a,t,u,f,c)=>{ctx.rotate(Math.sin(t*1.5+a.i)*.5);gloss(()=>{ctx.beginPath();ctx.moveTo(0,-1);ctx.quadraticCurveTo(.7,-.4,0,.9);ctx.quadraticCurveTo(-.7,-.4,0,-1);},c,u);
    ctx.strokeStyle=mixHex(c,'#000000',.4);ctx.lineWidth=1.8*u;ctx.beginPath();ctx.moveTo(0,-.9);ctx.lineTo(0,1.1);for(let i=1;i<5;i++){ctx.moveTo(0,-.8+i*.32);ctx.lineTo(.3,-.95+i*.32);ctx.moveTo(0,-.8+i*.32);ctx.lineTo(-.3,-.95+i*.32);}ctx.stroke();},
  (a,t,u,f,c)=>{ctx.rotate(Math.sin(t*2+a.i)*.12);gloss(()=>{ctx.beginPath();ctx.ellipse(0,.2,.45,.6,0,0,TAU);},c,u);brilho(-.15,0,.1,.25,0,.4);
    gloss(()=>{ctx.beginPath();ctx.ellipse(0,-.3,.55,.28,0,0,TAU);},'#7a5a32',u);ctx.fillStyle='rgba(0,0,0,.2)';for(let i=0;i<10;i++){ctx.beginPath();ctx.arc(-.4+i*.09,-.3+Math.sin(i)*.06,.04,0,TAU);ctx.fill();}
    ctx.beginPath();ctx.moveTo(0,-.55);ctx.lineTo(.05,-.78);ctx.lineWidth=4*u;ctx.strokeStyle='#5a3a1a';ctx.stroke();},
  (a,t,u,f,c)=>{ctx.rotate(t*.6+a.i);for(let i=0;i<6;i++){ctx.save();ctx.rotate(i/6*TAU);gloss(()=>{ctx.beginPath();ctx.ellipse(0,-.52,.26,.45,0,0,TAU);},c,u);ctx.restore();}
    esfera3('#ffd23f',.3);ctx.fillStyle='rgba(120,70,0,.4)';for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(Math.cos(i*2.4)*.15,Math.sin(i*2.4)*.15,.03,0,TAU);ctx.fill();}},
  (a,t,u,f,c)=>{orientar(f.dir);ctx.fillStyle='rgba(230,245,255,.5)';for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(0,s*.35,.35,.16,s*(.6+Math.sin(t*30)*.3),0,TAU);ctx.fill();}
    gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.65,.42,0,0,TAU);},'#ffd23f',u);ctx.save();ctx.beginPath();ctx.ellipse(0,0,.65,.42,0,0,TAU);ctx.clip();ctx.fillStyle='#2a1a10';for(const x of[-.35,0,.3])ctx.fillRect(x-.07,-1,.14,2);ctx.restore();
    ctx.beginPath();ctx.moveTo(-.65,0);ctx.lineTo(-.85,0);ctx.lineWidth=3*u;ctx.strokeStyle='#2a1a10';ctx.stroke();ctx.beginPath();ctx.arc(.5,-.1,.07,0,TAU);ctx.fillStyle='#111';ctx.fill();},
  (a,t,u,f,c)=>{ctx.rotate(Math.sin(t+a.i)*.1);gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.55,.85,0,0,TAU);},c,u);ctx.save();ctx.beginPath();ctx.ellipse(0,0,.55,.85,0,0,TAU);ctx.clip();
    ctx.strokeStyle=mixHex(c,'#000000',.45);ctx.lineWidth=2*u;for(let r=0;r<8;r++)for(let k=0;k<5;k++){const x=-.5+k*.25+(r%2)*.125,y=-.8+r*.22;ctx.beginPath();ctx.arc(x,y,.13,.2,PI-.2);ctx.stroke();}ctx.restore();
    ctx.beginPath();ctx.moveTo(0,-.85);ctx.lineTo(0,-1.05);ctx.lineWidth=4*u;ctx.strokeStyle='#5a3a1a';ctx.stroke();}
];
function arvore(nv,t,u,est){
  const brilha=nv>=5,h=[0,.3,.85,1.15,1.35][nv-1],tw=[0,.05,.12,.2,.28][nv-1];
  ctx.translate(0,.55);
  if(nv===1){ctx.save();ctx.translate(0,.1);gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.35,.25,0,0,TAU);},'#a0662f',u);ctx.beginPath();ctx.moveTo(0,-.2);ctx.quadraticCurveTo(.05,-.5,.15,-.6);ctx.lineWidth=4*u;ctx.strokeStyle='#5dbb46';ctx.stroke();
    ctx.beginPath();ctx.ellipse(.25,-.62,.12,.06,-.4,0,TAU);ctx.fillStyle='#7ee08a';ctx.fill();ctx.restore();luz(0,-.2,.9,'#d4ff6a',.4+.3*Math.sin(t*3));return;}
  if(nv>=4){ctx.strokeStyle='#5a3a1a';ctx.lineCap='round';for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*tw*.5,0);ctx.quadraticCurveTo(s*.4,.05,s*.7,.15);ctx.lineWidth=.08;ctx.stroke();}}
  gloss(()=>{ctx.beginPath();ctx.moveTo(-tw,0);ctx.quadraticCurveTo(-tw*.6,-h*.5,-tw*.5,-h);ctx.lineTo(tw*.5,-h);ctx.quadraticCurveTo(tw*.6,-h*.5,tw,0);ctx.closePath();},'#7a5230',u,2);
  if(nv>=3){ctx.strokeStyle='#6a4426';ctx.lineWidth=tw*.6;ctx.lineCap='round';for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(0,-h*.6);ctx.quadraticCurveTo(s*.3,-h*.8,s*.5,-h*1.0);ctx.stroke();}}
  const sw=Math.sin(t*.8)*.03;
  const copa=nv===2?[[0,-h-.08,.22]]:nv===3?[[-.35,-h-.1,.38],[.35,-h-.1,.38],[0,-h-.35,.45]]:[[-.6,-h,.42],[.6,-h,.42],[-.3,-h-.35,.5],[.3,-h-.35,.5],[0,-h-.65,.5],[0,-h-.1,.45]];
  const cc=brilha?'#4ccf6a':'#3fa648';
  ctx.save();ctx.translate(sw,0);ctx.beginPath();copa.forEach(([x,y,r])=>{ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,TAU);});ctx.lineWidth=4*u;ctx.strokeStyle='#1f5a24';ctx.stroke();
  const g=ctx.createLinearGradient(0,-h-1.2,0,-h+.4);g.addColorStop(0,'#9dff7a');g.addColorStop(1,cc);ctx.beginPath();copa.forEach(([x,y,r])=>{ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,TAU);});ctx.fillStyle=g;ctx.fill();
  copa.forEach(([x,y,r])=>brilho(x-r*.3,y-r*.4,r*.35,r*.15,-.4,.25));
  if(nv>=4)for(let i=0;i<(nv>=5?9:5);i++){const x=Math.cos(i*2.1)*.6,y=-h-.3+Math.sin(i*1.7)*.35;if(brilha){luz(x,y,.18,'#fff3a0',.6+.4*Math.sin(t*3+i));}else{ctx.beginPath();ctx.arc(x,y,.06,0,TAU);ctx.fillStyle='#ff5a5a';ctx.fill();}}
  ctx.restore();
  if(brilha)for(let i=0;i<4;i++){const aa=t*.8+i*TAU/4;luz(Math.cos(aa)*1.2,-h*.6+Math.sin(aa)*.35,.2,'#d4ff6a',.8);}
  if(est.medo>0)luz(0,-h,1.2,'#ff5a5a',.25*(.5+.5*Math.sin(t*12)));
  if(est.dano>0)luz(0,-h,1.2,'#ffffff',est.dano*.6);
}
const FOLHAS=Array.from({length:18},(_,i)=>{const r=mulberry(i*5+77);return{x:r(),o:r(),v:.03+r()*.04,s:4+r()*5,r:r()*TAU,z:r()};});
TEMAS.floresta={
  id:'floresta',nome:'Floresta',cor:'#7ee08a',grupo:'natureza',
  css:{bg:'#06140e',fg:'#eaffe6',suave:'#9cc4a2',ac:'#7ee08a',fonte:"'Caprasimo',var(--ao-fonte-corpo)",raio:'999px',chip:'rgba(6,22,14,.8)'},
  pal:palDe({texto:'#eaffe6',suave:'#9cc4a2',destaque:'#d4ff6a',ok:'#7ee08a',alerta:'#ff6b5a',onda:'#d4ff6a',escudo:'#9dffcf',ordem:'#ffe08a',titulo:"'Caprasimo',Georgia,serif",tituloPeso:'',placaBg:'rgba(8,24,14,.86)',balaoFg:'#14301c',
    nucleo:['#d4ff6a','#7ee08a','#5dbb46','#4ccf6a','#fff3a0']}),
  niveis:['Semente','Broto','Árvore Jovem','Árvore Grande','Árvore Anciã'],
  cores:['#e0344a','#ff9de2','#d4ff6a','#2fbf71','#4fd8ff','#ff9a3d','#e0344a','#ffb347','#c58a4a','#ff7ad9','#ffd23f','#a0662f'],
  halo:true,escalaAgente:.92,rastroLargura:.08,sombra:true,
  fundoEstatico(g,w,h){
    pintaBase(g,w,h,'#173a2e','#0b2018','#030a06',.3);
    const lm=g.createRadialGradient(w*.75,h*.18,0,w*.75,h*.18,h*.35);lm.addColorStop(0,'rgba(230,250,220,.35)');lm.addColorStop(1,'rgba(230,250,220,0)');g.fillStyle=lm;g.fillRect(0,0,w,h);
    g.fillStyle='#f2fbe8';g.beginPath();g.arc(w*.75,h*.18,h*.05,0,TAU);g.fill();
    const r=mulberry(3);
    const pinheiros=(base,alt,cor,n)=>{g.fillStyle=cor;for(let i=0;i<n;i++){const x=r()*w,hh=alt*(.6+r()*.6),ww=hh*.35;for(let k=0;k<3;k++){g.beginPath();g.moveTo(x,base-hh+k*hh*.2);g.lineTo(x+ww*(.6+k*.2),base-hh*.35+k*hh*.25);g.lineTo(x-ww*(.6+k*.2),base-hh*.35+k*hh*.25);g.fill();}g.fillRect(x-ww*.08,base-hh*.1,ww*.16,hh*.2);}};
    pinheiros(h*.7,h*.35,'#0f2a1e',40);pinheiros(h*.82,h*.4,'#0a1e15',30);
    const fog=g.createLinearGradient(0,h*.55,0,h*.85);fog.addColorStop(0,'rgba(180,220,200,0)');fog.addColorStop(.5,'rgba(180,220,200,.1)');fog.addColorStop(1,'rgba(180,220,200,0)');g.fillStyle=fog;g.fillRect(0,h*.5,w,h*.4);
    pinheiros(h*1.02,h*.5,'#050f0a',16);pintaVinheta(g,w,h,.7);
  },
  fundo(t){for(const l of FOLHAS){const y=((l.o+t*l.v)%1.1-.05)*H,x=l.x*W+Math.sin(t*1.2+l.r)*30-par.x*S*.05*l.z;ctx.save();ctx.translate(x,y);ctx.rotate(t*1.5+l.r);ctx.globalAlpha=.25+.35*l.z;
    ctx.beginPath();ctx.ellipse(0,0,l.s,l.s*.45,0,0,TAU);ctx.fillStyle=l.z>.5?'#c58a2a':'#5dbb46';ctx.fill();ctx.restore();}ctx.globalAlpha=1;},
  chao(t){noPlano(0,-.5,0,u=>{const g=ctx.createRadialGradient(0,0,.2,0,0,1.4);g.addColorStop(0,'rgba(80,160,70,.3)');g.addColorStop(1,'rgba(80,160,70,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1.4,0,TAU);ctx.fill();
    for(let i=0;i<14;i++){const a=i/14*TAU,x=Math.cos(a)*.95,z=Math.sin(a)*.95;ctx.beginPath();ctx.ellipse(x,z,.06,.04,0,0,TAU);ctx.fillStyle='rgba(255,90,90,.45)';ctx.fill();}});},
  agente(a,t,u,inf){BICHOS[a.i%BICHOS.length](a,t,u,inf,a.corT);},
  auraNucleo(cx,cy,r,nv,t,est){luz(cx,cy-r*.5,r*3.2,'#d4ff6a',.18+est.flash*.3+(nv>=5?.15:0));},
  nucleo(nv,t,u,est){arvore(nv,t,u,est);},
  tiro(s,t){if(s.tipo==='ataque'){ctx.rotate(-s.ang+s.t*5);luz(0,0,14,'#ff6a2a',.6);chama(t,s.seed*9,['#ff4d1a','#ff9a2e','#ffe08a'],1.2);return;}
    tiroItem(s,()=>{ctx.beginPath();ctx.ellipse(0,0,.9,.45,0,0,TAU);ctx.fillStyle=s.cor;ctx.fill();ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=.12;ctx.beginPath();ctx.moveTo(-.9,0);ctx.lineTo(.9,0);ctx.stroke();});},
  frente(t){particulasFrente(t,'#d4ff6a',true);}
};

/* ---------- CLIMA ---------- */
const TEMPO=[
  (a,t,u,f,c)=>{aditivo(()=>{ctx.save();ctx.rotate(t*.5);for(let i=0;i<12;i++){ctx.rotate(TAU/12);ctx.beginPath();ctx.moveTo(.6,-.1);ctx.lineTo(1.05+(i%2)*.15,0);ctx.lineTo(.6,.1);ctx.fillStyle='rgba(255,210,80,.9)';ctx.fill();}ctx.restore();});esfera3('#ffd23f',.6);luz(0,0,1.4,'#ffd23f',.35);},
  (a,t,u,f,c)=>{nuvem(mixHex(c,'#ffffff',.5),u,1,Math.sin(t+a.i)*.05);},
  (a,t,u,f,c)=>{for(let i=0;i<6;i++){const k=(t*1.6+i/6)%1;ctx.beginPath();ctx.ellipse(-.5+i*.2,.35+k*.8,.04,.1,0,0,TAU);ctx.fillStyle=hexA('#4fa8ff',1-k);ctx.fill();}nuvem('#9fb7d8',u,.95,0,-.2);},
  (a,t,u,f,c)=>{const fl=(t*1.3+a.i)%2.2<.15;if(fl)luz(0,.2,1.6,'#fff3a0',.7);ctx.beginPath();ctx.moveTo(.05,.1);ctx.lineTo(-.18,.55);ctx.lineTo(0,.55);ctx.lineTo(-.12,1);ctx.lineTo(.22,.45);ctx.lineTo(.04,.45);ctx.lineTo(.2,.1);ctx.closePath();
    ctx.fillStyle=fl?'#ffffff':'#ffd23f';ctx.fill();ctx.strokeStyle='#b8860b';ctx.lineWidth=2*u;ctx.stroke();nuvem('#6b7894',u,.95,0,-.25);},
  (a,t,u,f,c)=>{for(let i=0;i<6;i++){const k=(t*.6+i/6)%1,x=-.5+i*.2+Math.sin(t*2+i)*.05;ctx.save();ctx.translate(x,.35+k*.8);ctx.rotate(t+i);ctx.strokeStyle=hexA('#ffffff',1-k);ctx.lineWidth=1.5*u;for(let j=0;j<3;j++){ctx.rotate(PI/3);ctx.beginPath();ctx.moveTo(-.07,0);ctx.lineTo(.07,0);ctx.stroke();}ctx.restore();}nuvem('#c8d8f0',u,.95,0,-.2);},
  (a,t,u,f,c)=>{const cs=['#ff5a5a','#ff9a3d','#ffd23f','#5dbb46','#4fa8ff','#8f7bff'];cs.forEach((cc,i)=>{ctx.beginPath();ctx.arc(0,.45,.95-i*.1,PI,TAU);ctx.lineWidth=.1;ctx.strokeStyle=cc;ctx.stroke();});nuvem('#ffffff',u,.4,-.85,.45);nuvem('#ffffff',u,.4,.85,.45);},
  (a,t,u,f,c)=>{for(let i=0;i<8;i++){const y=-.8+i*.22,r=.8-i*.08,x=Math.sin(t*4+i*.6)*.12*(i/8);ctx.beginPath();ctx.ellipse(x,y,r,.12,0,0,TAU);ctx.fillStyle=mixHex('#9aa8bf','#ffffff',i*.05);ctx.fill();ctx.strokeStyle='#6a7890';ctx.lineWidth=1.5*u;ctx.stroke();}
    for(let i=0;i<4;i++){const aa=t*5+i*1.6;ctx.fillStyle='#8a6a48';ctx.fillRect(Math.cos(aa)*.6-.04,-.3+i*.3,.08,.08);}},
  (a,t,u,f,c)=>{ctx.beginPath();ctx.arc(0,0,.7,0,TAU);ctx.arc(.32,-.18,.6,0,TAU,true);const g=ctx.createLinearGradient(-.7,-.7,.7,.7);g.addColorStop(0,'#fffbe0');g.addColorStop(1,'#e0c060');ctx.fillStyle=g;ctx.fill('evenodd');
    for(const [x,y,s] of[[.65,-.55,.12],[.75,.25,.08]]){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#fff3a0';estrelaPoli(5,2,1);ctx.fill();ctx.restore();}luz(0,0,1.3,'#fff3a0',.25);},
  (a,t,u,f,c)=>{ctx.lineCap='round';for(let k=0;k<3;k++){const y=-.45+k*.42,o=Math.sin(t*3+k)*.1;ctx.beginPath();ctx.moveTo(-.9+o,y);ctx.lineTo(.4+o,y);ctx.arc(.4+o,y-.18,.18,PI/2,-PI*.9,true);ctx.lineWidth=.1;ctx.strokeStyle=mixHex(c,'#ffffff',.5);ctx.stroke();}},
  (a,t,u,f,c)=>{for(let i=0;i<5;i++){const k=Math.abs(Math.sin(t*3+i));ctx.beginPath();ctx.arc(-.5+i*.25,.45+k*.45,.08,0,TAU);ctx.fillStyle='#e8f6ff';ctx.fill();ctx.strokeStyle='#8fb3d0';ctx.lineWidth=1*u;ctx.stroke();}nuvem('#8fa6c8',u,.95,0,-.25);},
  (a,t,u,f,c)=>{ctx.lineCap='round';for(let k=0;k<4;k++){const y=-.55+k*.36,o=Math.sin(t*1.2+k*1.3)*.25;ctx.beginPath();ctx.moveTo(-.8+o,y);ctx.lineTo(.8+o,y);ctx.lineWidth=.2;ctx.strokeStyle=hexA('#e8eef8',.4+.12*k);ctx.stroke();}},
  (a,t,u,f,c)=>{gloss(()=>{ctx.beginPath();ctx.moveTo(0,-.95);ctx.bezierCurveTo(.2,-.5,.75,-.05,.75,.3);ctx.bezierCurveTo(.75,.95,-.75,.95,-.75,.3);ctx.bezierCurveTo(-.75,-.05,-.2,-.5,0,-.95);},c,u);brilho(-.3,.1,.12,.3,.3,.6);}
];
TEMAS.clima={
  id:'clima',nome:'Clima',cor:'#9ec9ef',grupo:'natureza',
  css:{bg:'#1e3a6e',fg:'#ffffff',suave:'#d0e2f8',ac:'#ffd23f',fonte:"'Fredoka',var(--ao-fonte-corpo)",raio:'999px',chip:'rgba(16,36,72,.8)'},
  pal:palDe({texto:'#ffffff',suave:'#d0e2f8',destaque:'#ffd23f',ok:'#7dffb0',alerta:'#ff6b6b',onda:'#ffffff',escudo:'#ffffff',ordem:'#ffd23f',placaBg:'rgba(16,36,72,.86)',balaoFg:'#16305c',
    nucleo:['#4fa8ff','#ffffff','#9fb7d8','#c8d8f0','#ffd23f']}),
  niveis:['Gota','Nuvem','Tempestade','Furacão','Sol Radiante'],
  cores:['#ffd23f','#ffffff','#4fa8ff','#ffd23f','#c8d8f0','#ff9de2','#9aa8bf','#fff3a0','#9feaff','#e8f6ff','#e8eef8','#4fa8ff'],
  halo:false,escalaAgente:.95,rastroLargura:.1,
  fundoEstatico(g,w,h){
    const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#16306a');gr.addColorStop(.5,'#3d6fb8');gr.addColorStop(1,'#a8d4f4');g.fillStyle=gr;g.fillRect(0,0,w,h);
    const r=mulberry(14);g.globalCompositeOperation='screen';for(let i=0;i<22;i++){const x=r()*w,y=h*(.3+r()*.7),rx=w*(.08+r()*.18),ry=rx*.35;const cg=g.createRadialGradient(x,y,0,x,y,rx);cg.addColorStop(0,'rgba(255,255,255,.28)');cg.addColorStop(1,'rgba(255,255,255,0)');
      g.fillStyle=cg;g.save();g.translate(x,y);g.scale(1,ry/rx);g.translate(-x,-y);g.beginPath();g.arc(x,y,rx,0,TAU);g.fill();g.restore();}g.globalCompositeOperation='source-over';
    pintaVinheta(g,w,h,.35,'#0a1430');
  },
  fundo(t){for(let i=0;i<5;i++){const x=((i*.27+t*.006*(1+i*.2))%1.4-.2)*W,y=H*(.12+i*.1);ctx.save();ctx.translate(x,y);ctx.scale(S*.12,S*.12);nuvemPath(NUVEM_STD);ctx.fillStyle='rgba(255,255,255,.16)';ctx.fill();ctx.restore();}
    if(ameaca.fase>0&&Math.random()<.02)flashTela=Math.max(flashTela,.5);},
  agente(a,t,u,inf){TEMPO[a.i%TEMPO.length](a,t,u,inf,a.corT);},
  auraNucleo(cx,cy,r,nv,t,est){luz(cx,cy,r*3,nv>=5?'#ffd23f':'#ffffff',.2+est.flash*.3);},
  nucleo(nv,t,u,est){
    ctx.translate(0,Math.sin(t*1.4)*.05);
    if(nv===1)TEMPO[11](null,t,u,est,'#4fa8ff');
    else if(nv===2)nuvem('#e8f2ff',u,1.05);
    else if(nv===3){for(let k=0;k<2;k++){if(((t*1.5+k*.7)%1.6)<.12){luz(0,.5,1.5,'#fff3a0',.8);ctx.beginPath();ctx.moveTo(-.2+k*.4,.2);ctx.lineTo(-.4+k*.4,.7);ctx.lineTo(-.2+k*.4,.7);ctx.lineTo(-.35+k*.4,1.2);ctx.lineWidth=.06;ctx.strokeStyle='#ffffff';ctx.stroke();}}
      for(let i=0;i<8;i++){const kk=(t*2+i/8)%1;ctx.beginPath();ctx.ellipse(-.7+i*.2,.35+kk*.9,.035,.1,0,0,TAU);ctx.fillStyle=hexA('#9fc8ff',1-kk);ctx.fill();}nuvem('#6b7894',u,1.15,0,-.15);}
    else if(nv===4){ctx.save();ctx.rotate(-t*.8);for(let k=0;k<4;k++){ctx.rotate(TAU/4);ctx.beginPath();for(let i=0;i<=30;i++){const aa=i/30*PI*1.1,rr=.25+i/30*.95;i?ctx.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr):ctx.moveTo(Math.cos(aa)*rr,Math.sin(aa)*rr);}
      ctx.lineWidth=.28*(1-k*.05);ctx.lineCap='round';ctx.strokeStyle=hexA('#e8f2ff',.85);ctx.stroke();ctx.lineWidth=.1;ctx.strokeStyle='#9fb7d8';ctx.stroke();}ctx.restore();ctx.beginPath();ctx.arc(0,0,.2,0,TAU);ctx.fillStyle='#3d6fb8';ctx.fill();}
    else{ctx.scale(.72,.72);const cs=['#ff5a5a','#ff9a3d','#ffd23f','#5dbb46','#4fa8ff','#8f7bff'];cs.forEach((cc,i)=>{ctx.beginPath();ctx.arc(0,.6,1.75-i*.13,PI,TAU);ctx.lineWidth=.13;ctx.strokeStyle=hexA(cc,.85);ctx.stroke();});TEMPO[0](null,t,u,est);nuvem('#ffffff',u,.55,-1.2,.55);nuvem('#ffffff',u,.55,1.2,.55);}
    if(est.dano>0)luz(0,0,1.2,'#ffffff',est.dano*.6);
  },
  tiro(s,t){if(s.tipo==='ataque'){ctx.rotate(-s.ang);luz(0,0,14,'#fff3a0',.6);ctx.beginPath();ctx.moveTo(3,-10);ctx.lineTo(-4,1);ctx.lineTo(1,1);ctx.lineTo(-3,11);ctx.lineTo(6,-2);ctx.lineTo(1,-2);ctx.lineTo(5,-10);ctx.closePath();ctx.fillStyle='#fff3a0';ctx.fill();return;}
    tiroItem(s,()=>TEMPO[11](null,t,1/8,null,s.cor));},
  frente(t){}
};

/* ---------- DESERTO ---------- */
const AREIA=[
  (a,t,u,f,c)=>{const g=c;ctx.lineCap='round';for(const [x,y,s] of[[-.45,-.1,-1],[.45,.15,1]]){ctx.beginPath();ctx.moveTo(s*.2,y+.2);ctx.lineTo(x,y+.2);ctx.lineTo(x,y-.35);ctx.lineWidth=.26;ctx.strokeStyle=mixHex(g,'#000000',.35);ctx.stroke();ctx.lineWidth=.18;ctx.strokeStyle=g;ctx.stroke();}
    gloss(()=>{ctx.beginPath();ctx.roundRect(-.22,-.95,.44,1.9,.22);},g,u);ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1.5*u;ctx.beginPath();ctx.moveTo(0,-.85);ctx.lineTo(0,.9);ctx.stroke();
    ctx.strokeStyle='#fff8d0';ctx.lineWidth=1*u;for(let i=0;i<8;i++){const y=-.8+i*.22;ctx.beginPath();ctx.moveTo(-.22,y);ctx.lineTo(-.32,y-.04);ctx.moveTo(.22,y+.1);ctx.lineTo(.32,y+.06);ctx.stroke();}},
  (a,t,u,f,c)=>{gloss(()=>{ctx.beginPath();ctx.ellipse(0,.2,.7,.62,0,0,TAU);},c,u);ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=1.5*u;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.ellipse(0,.2,Math.abs(i)*.16+.02,.6,0,0,TAU);ctx.stroke();}
    for(let i=0;i<5;i++){ctx.save();ctx.translate(0,-.45);ctx.rotate(i/5*TAU+t*.4);ctx.beginPath();ctx.ellipse(0,-.17,.1,.2,0,0,TAU);ctx.fillStyle='#ff7ad9';ctx.fill();ctx.restore();}ctx.beginPath();ctx.arc(0,-.45,.08,0,TAU);ctx.fillStyle='#ffd23f';ctx.fill();},
  (a,t,u,f,c)=>{orientar(f.dir);ctx.strokeStyle=mixHex(c,'#000000',.4);ctx.lineWidth=3*u;for(const s of[-1,1])for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(.1-k*.15,s*.18);ctx.lineTo(-k*.15,s*(.45+Math.sin(t*12+k)*.05));ctx.stroke();}
    for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(.3,s*.12);ctx.quadraticCurveTo(.6,s*.4,.8,s*.35);ctx.lineWidth=.08;ctx.stroke();gloss(()=>{ctx.beginPath();ctx.ellipse(.92,s*.35,.14,.1,0,0,TAU);},c,u);}
    gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.38,.24,0,0,TAU);},c,u);
    let x=-.35,y=0;for(let i=0;i<6;i++){const a2=PI+i*.45+Math.sin(t*3)*.08;x+=Math.cos(a2)*.17;y+=Math.sin(a2)*.17*(i>2?-1:-.3);ctx.beginPath();ctx.arc(x,y,.1-i*.008,0,TAU);ctx.fillStyle=c;ctx.fill();ctx.stroke();}
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+.15,y+.12);ctx.lineWidth=.05;ctx.strokeStyle='#2a1a10';ctx.stroke();},
  (a,t,u,f,c)=>{orientar(f.dir);const w=Math.sin(t*10+a.i)*.2;ctx.lineCap='round';ctx.strokeStyle=c;ctx.lineWidth=.12;
    for(const [x,s,k] of[[.35,-1,0],[.35,1,1],[-.3,-1,1],[-.3,1,0]]){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+(k?w:-w)*.5,s*.42);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(-.4,0);ctx.quadraticCurveTo(-.9,Math.sin(t*4)*.3,-1.3,Math.sin(t*4+1)*.2);ctx.lineWidth=.1;ctx.stroke();
    gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.55,.2,0,0,TAU);},c,u);gloss(()=>{ctx.beginPath();ctx.ellipse(.62,0,.22,.15,0,0,TAU);},c,u);
    ctx.beginPath();ctx.arc(.7,-.07,.04,0,TAU);ctx.fillStyle='#111';ctx.fill();},
  (a,t,u,f,c)=>{ctx.strokeStyle='#3a2a10';ctx.lineWidth=2.5*u;for(const s of[-1,1])for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(s*.35,-.1+k*.25);ctx.lineTo(s*.75,-.3+k*.35+Math.sin(t*10+k)*.05);ctx.stroke();}
    const g=ctx.createLinearGradient(-.5,-.7,.5,.7);g.addColorStop(0,'#fff0a0');g.addColorStop(.5,'#d8a020');g.addColorStop(1,'#6a4a10');ctx.beginPath();ctx.ellipse(0,.1,.48,.65,0,0,TAU);ctx.fillStyle=g;ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,-.3);ctx.lineTo(0,.75);ctx.stroke();ctx.beginPath();ctx.ellipse(0,-.58,.3,.18,0,0,TAU);ctx.fillStyle='#8a6a20';ctx.fill();ctx.stroke();brilho(-.2,-.05,.08,.22,0,.5);},
  (a,t,u,f,c)=>{orientar(f.dir);ctx.lineCap='round';ctx.beginPath();for(let i=0;i<=24;i++){const x=.6-i*.08,y=Math.sin(i*.5-t*6)*.22*(i/24+.3);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
    ctx.lineWidth=.26;ctx.strokeStyle=mixHex(c,'#000000',.4);ctx.stroke();ctx.lineWidth=.18;ctx.strokeStyle=c;ctx.stroke();ctx.setLineDash([.05,.08]);ctx.lineWidth=.06;ctx.strokeStyle=mixHex(c,'#000000',.3);ctx.stroke();ctx.setLineDash([]);
    gloss(()=>{ctx.beginPath();ctx.ellipse(.68,0,.2,.15,0,0,TAU);},c,u);ctx.beginPath();ctx.arc(.75,-.06,.035,0,TAU);ctx.fillStyle='#111';ctx.fill();
    if(Math.sin(t*5)>.3){ctx.beginPath();ctx.moveTo(.88,0);ctx.lineTo(1.05,0);ctx.lineTo(1.12,-.05);ctx.moveTo(1.05,0);ctx.lineTo(1.12,.05);ctx.lineWidth=.025;ctx.strokeStyle='#e0344a';ctx.stroke();}},
  (a,t,u,f,c)=>{const e=Math.sin(t*2+a.i)*.08;for(const s of[-1,1]){gloss(()=>{ctx.beginPath();ctx.moveTo(s*.2,-.15);ctx.lineTo(s*(.75+e),-1.0);ctx.lineTo(s*.65,-.05);ctx.closePath();},c,u);ctx.beginPath();ctx.moveTo(s*.3,-.2);ctx.lineTo(s*(.68+e),-.82);ctx.lineTo(s*.58,-.15);ctx.closePath();ctx.fillStyle='#ffd6c8';ctx.fill();}
    gloss(()=>{ctx.beginPath();ctx.ellipse(0,.1,.6,.5,0,0,TAU);},c,u);ctx.beginPath();ctx.ellipse(0,.38,.3,.2,0,0,TAU);ctx.fillStyle='#fff3e0';ctx.fill();ctx.beginPath();ctx.arc(0,.3,.06,0,TAU);ctx.fillStyle='#2a1a10';ctx.fill();olhinhos(0,0,.22,.08,f.look,f.blink);},
  (a,t,u,f,c)=>{gloss(()=>{ctx.beginPath();ctx.moveTo(-.25,-.85);ctx.lineTo(.25,-.85);ctx.quadraticCurveTo(.1,-.55,.6,-.2);ctx.quadraticCurveTo(.85,.4,.35,.8);ctx.lineTo(-.35,.8);ctx.quadraticCurveTo(-.85,.4,-.6,-.2);ctx.quadraticCurveTo(-.1,-.55,-.25,-.85);},c,u);
    ctx.save();ctx.beginPath();ctx.rect(-1,-.15,2,.25);ctx.clip();ctx.fillStyle='#2a1a10';for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(i*.18,-.15);ctx.lineTo(i*.18+.09,.1);ctx.lineTo(i*.18+.18,-.15);ctx.fill();}ctx.restore();brilho(-.3,-.2,.08,.3,.2,.4);},
  (a,t,u,f,c)=>{for(let i=0;i<3;i++){const k=(t*.4+i/3)%1;ctx.beginPath();ctx.arc(.7+Math.sin(k*6+i)*.1,-.35-k*.9,.08+k*.15,0,TAU);ctx.fillStyle=hexA('#d8c8f0',(1-k)*.6);ctx.fill();}
    gloss(()=>{ctx.beginPath();ctx.moveTo(-.9,.05);ctx.quadraticCurveTo(-.6,.5,0,.45);ctx.quadraticCurveTo(.5,.4,.75,-.3);ctx.lineTo(.6,-.32);ctx.quadraticCurveTo(.4,.05,0,.05);ctx.quadraticCurveTo(-.5,0,-.9,.05);},'#ffcf5a',u);
    ctx.beginPath();ctx.arc(-.95,.15,.15,PI*.5,PI*1.5);ctx.lineWidth=.06;ctx.strokeStyle='#b8860b';ctx.stroke();gloss(()=>{ctx.beginPath();ctx.ellipse(-.1,.05,.28,.08,0,0,TAU);},'#e8b030',u);},
  (a,t,u,f,c)=>{const P=[[0,-.9,.25,.5,'#f2d6b0'],[-.4,-.4,.2,.42,'#e8c49a'],[.4,-.35,.22,.4,'#f6dcbc'],[-.2,.15,.28,.4,'#e0b88a'],[.3,.25,.25,.38,'#eac6a0']];
    P.forEach(([x,y,rx,ry,cc],i)=>{ctx.save();ctx.translate(x,y);ctx.rotate(i*1.3);gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,rx,ry*.4,0,0,TAU);},cc,u);ctx.restore();});},
  (a,t,u,f,c)=>{const k=(t*.15+a.i*.1)%1;ctx.rotate(k>.92?(k-.92)/.08*PI:0);gloss(()=>{ctx.beginPath();ctx.rect(-.55,-.95,1.1,.14);ctx.rect(-.55,.81,1.1,.14);},'#8a5a2a',u);
    ctx.beginPath();ctx.moveTo(-.42,-.8);ctx.lineTo(.42,-.8);ctx.lineTo(.06,0);ctx.lineTo(.42,.8);ctx.lineTo(-.42,.8);ctx.lineTo(-.06,0);ctx.closePath();ctx.fillStyle='rgba(220,240,255,.35)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.5*u;ctx.stroke();
    ctx.fillStyle='#e8c070';const s1=.6*(1-k),s2=.6*k;ctx.beginPath();ctx.moveTo(-.3*s1/.6,-.08-s1*.6);ctx.lineTo(.3*s1/.6,-.08-s1*.6);ctx.lineTo(.05,-.05);ctx.lineTo(-.05,-.05);ctx.fill();
    ctx.beginPath();ctx.moveTo(-.42*s2/.6-.01,.8);ctx.lineTo(.42*s2/.6+.01,.8);ctx.lineTo(0,.8-s2*.7);ctx.fill();ctx.fillRect(-.012,-.05,.024,.85-s2*.7);},
  (a,t,u,f,c)=>{ctx.rotate(t*.2+a.i);gloss(()=>{ctx.beginPath();ctx.arc(0,0,.85,0,TAU);},c,u);ctx.beginPath();for(let i=0;i<70;i++){const aa=i*.2,r=.8*Math.exp(-i*.03);ctx.lineTo(Math.cos(aa)*r,Math.sin(aa)*r);}ctx.strokeStyle=mixHex(c,'#000000',.45);ctx.lineWidth=2.5*u;ctx.stroke();
    ctx.lineWidth=1*u;for(let i=0;i<30;i++){const aa=i*.4,r=.8*Math.exp(-i*.06);ctx.beginPath();ctx.moveTo(Math.cos(aa)*r,Math.sin(aa)*r);ctx.lineTo(Math.cos(aa)*r*.75,Math.sin(aa)*r*.75);ctx.stroke();}}
];
function palmeira(x,y,h,t,k,u){ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+.12,y-h*.5,x+.05,y-h);ctx.lineWidth=.1;ctx.strokeStyle='#8a5a2a';ctx.stroke();
  for(let i=0;i<6;i++){const a=-PI/2+(i-2.5)*.55+Math.sin(t*1.2+i+k)*.05;ctx.beginPath();ctx.moveTo(x+.05,y-h);ctx.quadraticCurveTo(x+.05+Math.cos(a)*.35,y-h+Math.sin(a)*.25-.1,x+.05+Math.cos(a)*.55,y-h+Math.sin(a)*.2+.18);ctx.lineWidth=.09;ctx.strokeStyle='#3f8a3a';ctx.stroke();}
  ctx.fillStyle='#6a4a1a';ctx.beginPath();ctx.arc(x+.05,y-h+.05,.05,0,TAU);ctx.fill();}
function oasis(nv,t,u,est){
  if(nv>=5){ctx.beginPath();ctx.moveTo(-.9,.25);ctx.lineTo(0,-1.05);ctx.lineTo(.9,.25);ctx.closePath();const g=ctx.createLinearGradient(-.9,0,.9,0);g.addColorStop(0,'#ffe08a');g.addColorStop(.5,'#f0b030');g.addColorStop(1,'#a87010');ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle='rgba(120,70,0,.3)';ctx.lineWidth=1*u;for(let i=1;i<8;i++){const y=-1.05+i*.16,hw=.9*(i*.16)/1.3;ctx.beginPath();ctx.moveTo(-hw,y);ctx.lineTo(hw,y);ctx.stroke();}luz(0,-1.05,.5,'#fff3a0',.6+.3*Math.sin(t*3));}
  ctx.beginPath();ctx.ellipse(0,.4,nv===1?.4:.85,nv===1?.12:.25,0,0,TAU);const g=ctx.createLinearGradient(0,.15,0,.65);g.addColorStop(0,'#7fe0ff');g.addColorStop(1,'#1f7ab8');ctx.fillStyle=g;ctx.fill();ctx.lineWidth=.06;ctx.strokeStyle='#e8d098';ctx.stroke();
  ctx.save();ctx.beginPath();ctx.ellipse(0,.4,nv===1?.4:.85,nv===1?.12:.25,0,0,TAU);ctx.clip();ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=1*u;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(Math.sin(t+i)*.2,.4,.2+((t*.3+i/3)%1)*.5,.06,0,0,TAU);ctx.stroke();}ctx.restore();
  if(nv===2){ctx.beginPath();ctx.moveTo(.5,.35);ctx.quadraticCurveTo(.55,.1,.6,0);ctx.lineWidth=.05;ctx.strokeStyle='#3f8a3a';ctx.stroke();ctx.beginPath();ctx.ellipse(.68,-.02,.1,.05,-.4,0,TAU);ctx.fillStyle='#7ee08a';ctx.fill();}
  if(nv>=3)palmeira(.55,.32,1.1,t,0,u);if(nv>=4){palmeira(-.6,.35,.95,t,2,u);ctx.save();ctx.translate(-.1,.15);ctx.beginPath();ctx.moveTo(-.25,.1);ctx.lineTo(0,-.25);ctx.lineTo(.25,.1);ctx.closePath();ctx.fillStyle='#f2e6cf';ctx.fill();ctx.strokeStyle='#a0662f';ctx.lineWidth=1.5*u;ctx.stroke();ctx.restore();}
  if(est.medo>0)luz(0,0,1.2,'#ff5a5a',.25*(.5+.5*Math.sin(t*12)));if(est.dano>0)luz(0,0,1.2,'#ffffff',est.dano*.6);
}
const GRAOS=Array.from({length:60},(_,i)=>{const r=mulberry(i*9+5);return{y:r(),o:r(),v:.08+r()*.15,z:r()};});
let bola=null;
TEMAS.deserto={
  id:'deserto',nome:'Deserto',cor:'#ffb347',grupo:'natureza',
  css:{bg:'#3a1e0e',fg:'#fff4e0',suave:'#e0c4a0',ac:'#ffb347',fonte:"'Rye',var(--ao-fonte-corpo)",raio:'4px',chip:'rgba(50,26,10,.82)'},
  pal:palDe({texto:'#fff4e0',suave:'#e8cca8',destaque:'#ffcf5a',ok:'#9dff7a',alerta:'#ff5a4f',onda:'#ffcf5a',escudo:'#7fe0ff',ordem:'#ffcf5a',titulo:"'Rye',Georgia,serif",tituloPeso:'',placaBg:'rgba(46,24,10,.86)',placaRaio:3,balaoFg:'#3a1e0e',
    nucleo:['#7fe0ff','#7ee08a','#3f8a3a','#ffcf5a','#ffe08a']}),
  niveis:['Poça','Broto','Oásis','Acampamento','Oásis Dourado'],
  cores:['#5d9e4a','#7cbf5a','#c9a36a','#a8c06a','#d8a020','#c08040','#f0c890','#d9764a','#ffcf5a','#e8c49a','#c9a36a','#b8a07a'],
  halo:false,escalaAgente:.95,rastroLargura:.06,sombra:true,
  fundoEstatico(g,w,h){
    const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#2a1240');gr.addColorStop(.35,'#c0503a');gr.addColorStop(.55,'#f0a050');gr.addColorStop(1,'#f8d090');g.fillStyle=gr;g.fillRect(0,0,w,h);
    const sg=g.createRadialGradient(w*.5,h*.48,0,w*.5,h*.48,h*.3);sg.addColorStop(0,'rgba(255,240,180,.9)');sg.addColorStop(.25,'rgba(255,220,140,.4)');sg.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=sg;g.fillRect(0,0,w,h);
    const duna=(base,amp,cor,f,ph)=>{g.fillStyle=cor;g.beginPath();g.moveTo(0,h);for(let x=0;x<=w;x+=8)g.lineTo(x,base+Math.sin(x*f+ph)*amp+Math.sin(x*f*2.3+ph*2)*amp*.4);g.lineTo(w,h);g.fill();};
    duna(h*.6,h*.04,'#d88a4a',.006,1);duna(h*.7,h*.05,'#c0703a',.005,3);duna(h*.82,h*.06,'#a0582a',.004,5);
    pintaVinheta(g,w,h,.5,'#1a0a04');
  },
  fundo(t,dt){for(const g of GRAOS){const x=((g.o+t*g.v)%1.1-.05)*W,y=g.y*H+Math.sin(t*3+g.o*9)*4;ctx.fillStyle=hexA('#ffe0b0',.15+.35*g.z);ctx.fillRect(x,y,2+g.z*2,1);}
    if(!bola&&Math.random()<.002)bola={x:-40,y:H*(.7+Math.random()*.15),v:120+Math.random()*80};
    if(bola){bola.x+=bola.v*dt;const r=14,yy=bola.y-Math.abs(Math.sin(bola.x*.03))*20;ctx.save();ctx.translate(bola.x,yy);ctx.rotate(bola.x*.05);ctx.strokeStyle='rgba(120,80,40,.7)';ctx.lineWidth=1;for(let i=0;i<8;i++){ctx.beginPath();ctx.ellipse(0,0,r,r*.5,i,0,TAU);ctx.stroke();}ctx.restore();if(bola.x>W+40)bola=null;}},
  chao(t){noPlano(0,-.5,0,u=>{ctx.strokeStyle='rgba(120,60,20,.18)';ctx.lineWidth=2*u;for(let i=0;i<9;i++){ctx.beginPath();for(let x=-1.6;x<=1.6;x+=.05)ctx.lineTo(x,-1.2+i*.3+Math.sin(x*3+i)*.06);ctx.stroke();}});},
  agente(a,t,u,inf){AREIA[a.i%AREIA.length](a,t,u,inf,a.corT);},
  auraNucleo(cx,cy,r,nv,t,est){luz(cx,cy,r*3,'#ffe08a',.18+est.flash*.3);},
  nucleo(nv,t,u,est){oasis(nv,t,u,est);},
  tiro(s,t){if(s.tipo==='ataque'){ctx.rotate(-s.ang+s.t*8);ctx.strokeStyle='rgba(160,110,60,.9)';ctx.lineWidth=1.2;for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(0,0,9,4,i,0,TAU);ctx.stroke();}return;}
    tiroItem(s,()=>{esfera3(s.cor,.7);});},
  frente(t){aditivo(()=>{const g=ctx.createLinearGradient(0,H*.6,0,H);g.addColorStop(0,'rgba(255,200,120,0)');g.addColorStop(1,'rgba(255,200,120,'+(.06+.03*Math.sin(t*2))+')');ctx.fillStyle=g;ctx.fillRect(0,H*.6,W,H*.4);});}
};

/* ---------- ÁRTICO ---------- */
function rostoFofo(y,look,blink,cor){olhinhos(0,y,.2,.08,look,blink);ctx.beginPath();ctx.ellipse(0,y+.17,.07,.05,0,0,TAU);ctx.fillStyle=cor||'#1a1a2a';ctx.fill();}
const GELO=[
  (a,t,u,f,c)=>{const w=Math.sin(t*6+a.i)*.08;ctx.rotate(w);gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.55,.85,0,0,TAU);},'#1f2a3a',u);ctx.beginPath();ctx.ellipse(0,.15,.38,.62,0,0,TAU);ctx.fillStyle='#f6f8fc';ctx.fill();
    for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(s*.55,.1,.12,.35,s*(.3+w*2),0,TAU);ctx.fillStyle='#1f2a3a';ctx.fill();ctx.beginPath();ctx.ellipse(s*.2,.85,.18,.07,0,0,TAU);ctx.fillStyle='#ffa030';ctx.fill();}
    olhinhos(0,-.4,.15,.07,f.look,f.blink);ctx.beginPath();ctx.moveTo(-.1,-.25);ctx.lineTo(.1,-.25);ctx.lineTo(0,-.12);ctx.closePath();ctx.fillStyle='#ffa030';ctx.fill();ctx.fillStyle=c;ctx.fillRect(-.3,-.05,.6,.08);},
  (a,t,u,f,c)=>{for(const s of[-1,1]){gloss(()=>{ctx.beginPath();ctx.arc(s*.55,-.55,.22,0,TAU);},'#f2f4f8',u);}gloss(()=>{ctx.beginPath();ctx.arc(0,0,.75,0,TAU);},'#f2f4f8',u);
    ctx.beginPath();ctx.ellipse(0,.25,.32,.24,0,0,TAU);ctx.fillStyle='#e0e4ec';ctx.fill();rostoFofo(-.05,f.look,f.blink);ctx.fillStyle=c;ctx.fillRect(-.5,.62,1,.1);},
  (a,t,u,f,c)=>{orientar(f.dir);gloss(()=>{ctx.beginPath();ctx.ellipse(-.1,0,.85,.42,0,0,TAU);},'#9aa6b8',u);ctx.beginPath();ctx.moveTo(-.9,0);ctx.lineTo(-1.25,-.25);ctx.lineTo(-1.2,.25);ctx.closePath();ctx.fillStyle='#7a8698';ctx.fill();
    ctx.fillStyle='rgba(60,70,90,.4)';for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(-.5+i*.18,-.1+Math.sin(i)*.12,.04,0,TAU);ctx.fill();}ctx.beginPath();ctx.arc(.55,-.1,.06,0,TAU);ctx.fillStyle='#111';ctx.fill();
    ctx.strokeStyle='#ffffff';ctx.lineWidth=1*u;for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(.7,.05);ctx.lineTo(.95,.05+s*.08);ctx.stroke();}},
  (a,t,u,f,c)=>{for(const s of[-1,1])gloss(()=>{ctx.beginPath();ctx.moveTo(s*.2,-.4);ctx.lineTo(s*.55,-.95);ctx.lineTo(s*.62,-.3);ctx.closePath();},'#f6f8fc',u);
    gloss(()=>{ctx.beginPath();ctx.moveTo(-.65,-.35);ctx.quadraticCurveTo(0,-.65,.65,-.35);ctx.quadraticCurveTo(.6,.25,0,.6);ctx.quadraticCurveTo(-.6,.25,-.65,-.35);},'#f6f8fc',u);rostoFofo(-.1,f.look,f.blink);ctx.fillStyle=c;ctx.fillRect(-.4,.5,.8,.08);},
  (a,t,u,f,c)=>{gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.8,.65,0,0,TAU);},'#a87a5a',u);for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*.15,.3);ctx.lineTo(s*.2,.95);ctx.lineTo(s*.3,.3);ctx.fillStyle='#fff8e8';ctx.fill();}
    ctx.beginPath();ctx.ellipse(0,.18,.35,.2,0,0,TAU);ctx.fillStyle='#c89a78';ctx.fill();olhinhos(0,-.25,.25,.08,f.look,f.blink);ctx.strokeStyle='#5a3a2a';ctx.lineWidth=1*u;for(const s of[-1,1])for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(s*.2,.15+k*.05);ctx.lineTo(s*.55,.1+k*.08);ctx.stroke();}},
  (a,t,u,f,c)=>{ctx.translate(0,Math.sin(t*2+a.i)*.03);gloss(()=>{ctx.beginPath();ctx.arc(0,.45,.55,0,TAU);},'#ffffff',u);gloss(()=>{ctx.beginPath();ctx.arc(0,-.35,.38,0,TAU);},'#ffffff',u);
    ctx.fillStyle='#1a1a2a';for(const y of[.25,.5])ctx.beginPath(),ctx.arc(0,y,.05,0,TAU),ctx.fill();olhinhos(0,-.42,.13,.05,f.look,f.blink);
    ctx.beginPath();ctx.moveTo(0,-.32);ctx.lineTo(.3,-.28);ctx.lineTo(0,-.24);ctx.fillStyle='#ff8a2a';ctx.fill();ctx.fillStyle=c;ctx.fillRect(-.38,-.1,.76,.1);ctx.fillRect(.2,-.1,.1,.35);
    ctx.fillStyle='#2a2a3a';ctx.fillRect(-.25,-.85,.5,.12);ctx.fillRect(-.17,-1.15,.34,.32);},
  (a,t,u,f,c)=>{gloss(()=>{ctx.beginPath();ctx.arc(0,.35,.9,PI,TAU);ctx.closePath();},'#e8f2fc',u);ctx.strokeStyle='rgba(120,150,190,.5)';ctx.lineWidth=1.5*u;
    for(let r=0;r<4;r++){const y=.35-r*.22,hw=Math.sqrt(Math.max(0,.81-Math.pow(.35-y+.0,2)));ctx.beginPath();ctx.moveTo(-hw,y);ctx.lineTo(hw,y);ctx.stroke();for(let k=-3;k<=3;k++){const x=k*.25+(r%2)*.125;if(Math.abs(x)<hw){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-.22);ctx.stroke();}}}
    ctx.beginPath();ctx.arc(0,.35,.28,PI,TAU);ctx.closePath();ctx.fillStyle='#1a2a44';ctx.fill();luz(0,.25,.4,c,.4);},
  (a,t,u,f,c)=>{orientar(f.dir);const sw=Math.sin(t*3+a.i)*.15;ctx.beginPath();ctx.moveTo(-.8,0);ctx.lineTo(-1.2,-.3+sw);ctx.lineTo(-1.05,0);ctx.lineTo(-1.2,.3+sw);ctx.closePath();ctx.fillStyle='#e8eef8';ctx.fill();
    gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.9,.48,0,0,TAU);},'#f6f8fc',u);gloss(()=>{ctx.beginPath();ctx.ellipse(.55,-.25,.3,.25,0,0,TAU);},'#f6f8fc',u,0);
    ctx.beginPath();ctx.arc(.6,-.08,.06,0,TAU);ctx.fillStyle='#111';ctx.fill();ctx.beginPath();ctx.arc(.8,.08,.08,0,PI*.9);ctx.lineWidth=1.5*u;ctx.strokeStyle='#6a7a8a';ctx.stroke();},
  (a,t,u,f,c)=>{ctx.rotate(Math.sin(t*.7+a.i)*.15);const hx=.45;ctx.beginPath();ctx.moveTo(0,-1);ctx.lineTo(hx,-.6);ctx.lineTo(hx,.6);ctx.lineTo(0,1);ctx.lineTo(-hx,.6);ctx.lineTo(-hx,-.6);ctx.closePath();
    const g=ctx.createLinearGradient(-hx,0,hx,0);g.addColorStop(0,'#e8faff');g.addColorStop(.5,c);g.addColorStop(1,'#5a9ad0');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#ffffff';ctx.lineWidth=2*u;ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,-1);ctx.lineTo(0,1);ctx.moveTo(-hx,-.6);ctx.lineTo(0,-.3);ctx.lineTo(hx,-.6);ctx.strokeStyle='rgba(255,255,255,.5)';ctx.stroke();luz(.1,-.3,.2,'#ffffff',.6+.4*Math.sin(t*4+a.i));},
  (a,t,u,f,c)=>{for(let k=0;k<3;k++){const y=-.7+k*.45,w=.35+k*.25;gloss(()=>{ctx.beginPath();ctx.moveTo(0,y-.35);ctx.lineTo(w,y+.3);ctx.lineTo(-w,y+.3);ctx.closePath();},'#2f7a4a',u);
      ctx.beginPath();ctx.moveTo(-w*.8,y+.22);ctx.quadraticCurveTo(0,y+.05,w*.8,y+.22);ctx.lineTo(w,y+.3);ctx.lineTo(-w,y+.3);ctx.fillStyle='#ffffff';ctx.fill();}ctx.fillStyle='#6a4426';ctx.fillRect(-.1,.6,.2,.3);
    ctx.fillStyle=c;ctx.beginPath();ctx.arc(0,-1.05,.08,0,TAU);ctx.fill();},
  (a,t,u,f,c)=>{const e=Math.sin(t*1.5+a.i)*.06;for(const s of[-1,1])gloss(()=>{ctx.beginPath();ctx.ellipse(s*.22,-.75,.13,.5,s*(.15+e),0,TAU);},'#f6f8fc',u);
    gloss(()=>{ctx.beginPath();ctx.ellipse(0,.05,.62,.55,0,0,TAU);},'#f6f8fc',u);rostoFofo(-.02,f.look,f.blink,'#ff9ab0');ctx.fillStyle=c;ctx.fillRect(-.35,.52,.7,.08);},
  (a,t,u,f,c)=>{ctx.rotate(t*.4+a.i);ctx.lineCap='round';for(let i=0;i<6;i++){ctx.rotate(TAU/6);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-1);for(const y of[.4,.7]){const l=.3*(1.1-y);ctx.moveTo(0,-y);ctx.lineTo(l,-y-l);ctx.moveTo(0,-y);ctx.lineTo(-l,-y-l);}
    ctx.lineWidth=6*u;ctx.strokeStyle=hexA(c,.5);ctx.stroke();ctx.lineWidth=2.5*u;ctx.strokeStyle='#ffffff';ctx.stroke();}}
];
function nucleoArtico(nv,t,u,est){
  ctx.translate(0,Math.sin(t*1.3)*.05);
  if(nv===1){ctx.save();ctx.scale(.75,.75);GELO[11]({i:0},t,u/.75,est,'#9feaff');ctx.restore();luz(0,0,1,'#bff4ff',.5);}
  else if(nv===2){esfera3('#ffffff',.65);ctx.fillStyle='rgba(180,210,240,.4)';for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(Math.cos(i*2.4)*.35,Math.sin(i*2.4)*.35,.08,0,TAU);ctx.fill();}}
  else if(nv===3){ctx.save();ctx.scale(1.1,1.1);GELO[6]({i:0},t,u/1.1,est,'#ffd23f');ctx.restore();}
  else{const tw=nv>=5?1.3:1;const torre=(x,w,h)=>{gloss(()=>{ctx.beginPath();ctx.rect(x-w/2,.7-h,w,h);},'#d8ecff',u);ctx.beginPath();ctx.moveTo(x-w*.65,.7-h);ctx.lineTo(x,.7-h-w*1.2);ctx.lineTo(x+w*.65,.7-h);ctx.closePath();
      const g=ctx.createLinearGradient(x-w,0,x+w,0);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#7ab8e8');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#5a8ac0';ctx.lineWidth=2*u;ctx.stroke();ctx.fillStyle='#2a4a7a';ctx.fillRect(x-w*.15,.7-h*.6,w*.3,w*.4);};
    torre(-.7*tw,.32,.9);torre(.7*tw,.32,.9);torre(0,.45,1.35);gloss(()=>{ctx.beginPath();ctx.rect(-.9*tw,.25,1.8*tw,.45);},'#c8e2ff',u);ctx.fillStyle='#2a4a7a';ctx.beginPath();ctx.arc(0,.7,.18,PI,TAU);ctx.fill();
    if(nv>=5){ctx.save();ctx.translate(0,-1.25);aditivo(()=>{for(let k=0;k<3;k++){ctx.beginPath();for(let i=0;i<=20;i++){const x=-.6+i*.06;ctx.lineTo(x,Math.sin(i*.6+t*2+k)*.1-k*.12);}ctx.lineWidth=.08;ctx.strokeStyle=hexA(k%2?'#ff7ad9':'#5dffb0',.6);ctx.stroke();}});ctx.restore();luz(0,-1.25,.6,'#9dffcf',.6);}}
  if(est.medo>0)luz(0,0,1.2,'#ff5a5a',.25*(.5+.5*Math.sin(t*12)));if(est.dano>0)luz(0,0,1.2,'#ffffff',est.dano*.6);
}
const NEVE=Array.from({length:90},(_,i)=>{const r=mulberry(i*3+8);return{x:r(),o:r(),v:.03+r()*.05,s:.8+r()*2.2,z:r()};});
TEMAS.artico={
  id:'artico',nome:'Ártico',cor:'#9feaff',grupo:'natureza',
  css:{bg:'#06122a',fg:'#eef8ff',suave:'#a8c4e0',ac:'#9feaff',fonte:"'Fredoka',var(--ao-fonte-corpo)",raio:'999px',chip:'rgba(8,20,44,.8)'},
  pal:palDe({texto:'#eef8ff',suave:'#a8c4e0',destaque:'#9feaff',ok:'#9dffcf',alerta:'#ff6b81',onda:'#9dffcf',escudo:'#9feaff',ordem:'#ffe08a',placaBg:'rgba(8,20,44,.86)',balaoFg:'#0a1e40',
    nucleo:['#bff4ff','#ffffff','#e8f2fc','#d8ecff','#9dffcf']}),
  niveis:['Floco','Bola de Neve','Iglu','Castelo de Gelo','Coroa Polar'],
  cores:['#ff5a5a','#4fa8ff','#ffd23f','#ff7ad9','#7ee08a','#e0344a','#ffb347','#9feaff','#bfe8ff','#ffd23f','#8f7bff','#bff4ff'],
  halo:false,escalaAgente:.95,rastroLargura:.08,sombra:true,
  fundoEstatico(g,w,h){
    pintaBase(g,w,h,'#0e2a50','#06142e','#020610',.3);pintaEstrelas(g,w,h*.6,500,21,['#ffffff','#dff0ff']);
    const mt=(base,alt,cor,seed)=>{const r=mulberry(seed);g.fillStyle=cor;g.beginPath();g.moveTo(0,h);let x=0;g.lineTo(0,base);while(x<w){const ww=60+r()*140,hh=alt*(.4+r()*.6);g.lineTo(x+ww/2,base-hh);g.lineTo(x+ww,base);x+=ww;}g.lineTo(w,h);g.fill();};
    mt(h*.62,h*.22,'#1e3a66',4);mt(h*.7,h*.15,'#e8f2fc',7);g.fillStyle='rgba(20,40,80,.35)';g.fillRect(0,h*.68,w,h*.04);mt(h*.85,h*.1,'#f6faff',9);
    pintaVinheta(g,w,h,.6,'#020610');
  },
  fundo(t,dt){
    aditivo(()=>{for(let k=0;k<3;k++){const cor=['#5dffb0','#7affd8','#ff7ad9'][k];for(let i=0;i<60;i++){const x=i/60*W,y=H*(.12+.06*k)+Math.sin(i*.25+t*.6+k*2)*H*.05,hh=H*(.12+.08*Math.sin(i*.4+t*.9+k));
      const g=ctx.createLinearGradient(x,y,x,y+hh);g.addColorStop(0,hexA(cor,0));g.addColorStop(.3,hexA(cor,.14));g.addColorStop(1,hexA(cor,0));ctx.fillStyle=g;ctx.fillRect(x,y,W/60+1,hh);}}});
    for(const n of NEVE){const y=((n.o+t*n.v)%1.05)*H,x=n.x*W+Math.sin(t+n.o*10)*12-par.x*S*.06*n.z;ctx.fillStyle=hexA('#ffffff',.4+.5*n.z);ctx.beginPath();ctx.arc(x,y,n.s*(.6+n.z*.6),0,TAU);ctx.fill();}
  },
  chao(t){noPlano(0,-.5,0,u=>{const g=ctx.createRadialGradient(0,0,.1,0,0,1.4);g.addColorStop(0,'rgba(220,240,255,.3)');g.addColorStop(1,'rgba(220,240,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1.4,0,TAU);ctx.fill();
    ctx.strokeStyle='rgba(160,210,255,.25)';ctx.lineWidth=1.5*u;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(Math.cos(i)*.3,Math.sin(i)*.3);ctx.lineTo(Math.cos(i+.3)*1.1,Math.sin(i+.3)*1.1);ctx.stroke();}});},
  agente(a,t,u,inf){GELO[a.i%GELO.length](a,t,u,inf,a.corT);},
  auraNucleo(cx,cy,r,nv,t,est){luz(cx,cy,r*3,'#bff4ff',.2+est.flash*.3);},
  nucleo(nv,t,u,est){nucleoArtico(nv,t,u,est);},
  tiro(s,t){if(s.tipo==='ataque'){ctx.rotate(-s.ang);luz(0,0,12,'#ff6b81',.5);esfera3('#c8d8e8',6);ctx.fillStyle='#ff6b81';ctx.fillRect(-2,-2,4,4);return;}
    tiroItem(s,()=>{esfera3('#ffffff',.8);});},
  frente(t){}
};

/* ================= GRUPO POP ================= */

/* ---------- COMIDA ---------- */
const PRATOS=[
  (a,t,u,f)=>{ctx.rotate(Math.sin(t+a.i)*.15);gloss(()=>{ctx.beginPath();ctx.moveTo(0,.95);ctx.lineTo(-.75,-.6);ctx.quadraticCurveTo(0,-.9,.75,-.6);ctx.closePath();},'#ffd166',u);
    gloss(()=>{ctx.beginPath();ctx.moveTo(-.82,-.62);ctx.quadraticCurveTo(0,-1.0,.82,-.62);ctx.lineTo(.75,-.48);ctx.quadraticCurveTo(0,-.8,-.75,-.48);ctx.closePath();},'#d08a3a',u);
    for(const [x,y] of[[-.2,-.35],[.25,-.25],[0,.15],[-.05,.5]]){gloss(()=>{ctx.beginPath();ctx.arc(x,y,.13,0,TAU);},'#d8342a',u,1.5);}
    const d=(t*.5+a.i)%1;ctx.beginPath();ctx.ellipse(.3,-.1+d*.5,.05,.08,0,0,TAU);ctx.fillStyle='#ffd166';ctx.fill();},
  (a,t,u,f)=>{const b=Math.sin(t*3+a.i)*.03;gloss(()=>{ctx.beginPath();ctx.ellipse(0,-.38-b,.85,.45,0,PI,TAU);ctx.lineTo(.85,-.3-b);ctx.lineTo(-.85,-.3-b);ctx.closePath();},'#e0a050',u);
    ctx.fillStyle='#fff3c4';for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(-.5+i*.2,-.6-b+Math.sin(i*2)*.06,.04,.025,i,0,TAU);ctx.fill();}
    ctx.beginPath();for(let i=0;i<=16;i++){ctx.lineTo(-.9+i*.1125,-.25+(i%2?.08:0));}ctx.lineTo(.9,-.15);ctx.lineTo(-.9,-.15);ctx.closePath();ctx.fillStyle='#5dbb46';ctx.fill();
    ctx.beginPath();ctx.moveTo(-.8,-.12);ctx.lineTo(.8,-.12);ctx.lineTo(.55,.12);ctx.lineTo(.4,-.02);ctx.lineTo(-.8,-.02);ctx.closePath();ctx.fillStyle='#ffc93a';ctx.fill();
    gloss(()=>{ctx.beginPath();ctx.roundRect(-.85,-.05,1.7,.28,.14);},'#6a3a1a',u);gloss(()=>{ctx.beginPath();ctx.roundRect(-.82,.28,1.64,.3,.12);},'#e0a050',u);},
  (a,t,u,f,c)=>{ctx.rotate(t*.4+a.i);gloss(()=>{ctx.beginPath();ctx.arc(0,0,.85,0,TAU);ctx.arc(0,0,.3,0,TAU,true);},'#e0a050',u);
    ctx.beginPath();for(let i=0;i<=24;i++){const aa=i/24*TAU,r=.78+(i%2?.06:0);ctx.lineTo(Math.cos(aa)*r,Math.sin(aa)*r);}ctx.arc(0,0,.36,TAU,0,true);ctx.fillStyle=c;ctx.fill('evenodd');
    const cs=['#ffffff','#4fa8ff','#ffd23f','#5dbb46','#ff5a5a'];for(let i=0;i<16;i++){const aa=i*2.4,r=.5+.2*hash1(i);ctx.save();ctx.translate(Math.cos(aa)*r,Math.sin(aa)*r);ctx.rotate(i);ctx.fillStyle=cs[i%5];ctx.fillRect(-.06,-.02,.12,.04);ctx.restore();}brilho(-.35,-.45,.2,.06,-.6,.5);},
  (a,t,u,f)=>{ctx.rotate(Math.sin(t*.8+a.i)*.1);gloss(()=>{ctx.beginPath();ctx.roundRect(-.75,-.05,1.5,.55,.25);},'#f8f6f0',u);ctx.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<10;i++){ctx.beginPath();ctx.arc(-.6+i*.13,.2+Math.sin(i*3)*.12,.035,0,TAU);ctx.fill();}
    gloss(()=>{ctx.beginPath();ctx.moveTo(-.85,0);ctx.quadraticCurveTo(-.7,-.45,0,-.45);ctx.quadraticCurveTo(.8,-.45,.9,0);ctx.quadraticCurveTo(0,.12,-.85,0);},'#ff8a5a',u);
    ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=3*u;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-.5+i*.35,-.38);ctx.quadraticCurveTo(-.4+i*.35,-.2,-.55+i*.35,-.02);ctx.stroke();}},
  (a,t,u,f)=>{ctx.rotate(Math.sin(t+a.i)*.1);ctx.fillStyle='#5dbb46';ctx.beginPath();for(let i=0;i<=12;i++){const aa=PI+i/12*PI;ctx.lineTo(Math.cos(aa)*(.78+(i%2?.06:0)),.2+Math.sin(aa)*(.78+(i%2?.06:0)));}ctx.fill();
    for(const [x,y,c2] of[[-.35,-.25,'#d8342a'],[.2,-.4,'#ffc93a'],[.4,-.15,'#d8342a'],[-.05,-.15,'#8a4a1a']]){ctx.beginPath();ctx.arc(x,y,.13,0,TAU);ctx.fillStyle=c2;ctx.fill();}
    gloss(()=>{ctx.beginPath();ctx.arc(0,.2,.85,0,PI,false);ctx.lineTo(-.75,.2);ctx.arc(0,.2,.75,PI,0,true);ctx.closePath();},'#f0c050',u);},
  (a,t,u,f,c)=>{ctx.translate(0,.1);gloss(()=>{ctx.beginPath();ctx.moveTo(-.45,-.1);ctx.lineTo(0,1);ctx.lineTo(.45,-.1);ctx.closePath();},'#d8a050',u);ctx.save();ctx.beginPath();ctx.moveTo(-.45,-.1);ctx.lineTo(0,1);ctx.lineTo(.45,-.1);ctx.clip();
    ctx.strokeStyle='rgba(120,70,20,.5)';ctx.lineWidth=1.5*u;for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(i*.15-.5,-.1);ctx.lineTo(i*.15+.5,1);ctx.moveTo(i*.15+.5,-.1);ctx.lineTo(i*.15-.5,1);ctx.stroke();}ctx.restore();
    gloss(()=>{ctx.beginPath();ctx.arc(0,-.18,.45,0,TAU);},'#fff3e0',u);gloss(()=>{ctx.beginPath();ctx.arc(.05,-.62,.38,0,TAU);},c,u);const d=(t*.4+a.i)%1;ctx.beginPath();ctx.ellipse(-.3,.0+d*.3,.05,.08,0,0,TAU);ctx.fillStyle=c;ctx.fill();
    ctx.beginPath();ctx.arc(.05,-1.02,.09,0,TAU);ctx.fillStyle='#d8342a';ctx.fill();},
  (a,t,u,f,c)=>{gloss(()=>{ctx.beginPath();ctx.moveTo(-.55,0);ctx.lineTo(.55,0);ctx.lineTo(.42,.85);ctx.lineTo(-.42,.85);ctx.closePath();},'#ff9ad0',u);ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=1.5*u;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*.15,0);ctx.lineTo(i*.12,.85);ctx.stroke();}
    for(let k=0;k<3;k++){gloss(()=>{ctx.beginPath();ctx.ellipse(0,-.08-k*.22,.62-k*.17,.2,0,0,TAU);},c,u);}ctx.beginPath();ctx.arc(0,-.82,.12,0,TAU);ctx.fillStyle='#d8342a';ctx.fill();ctx.beginPath();ctx.moveTo(0,-.9);ctx.quadraticCurveTo(.1,-1.05,.2,-1.05);ctx.lineWidth=1.5*u;ctx.strokeStyle='#3a6a2a';ctx.stroke();},
  (a,t,u,f,c)=>{for(let i=0;i<3;i++){const k=(t*.5+i/3)%1;ctx.beginPath();ctx.moveTo(-.2+i*.2,-.45-k*.5);ctx.bezierCurveTo(-.05+i*.2,-.55-k*.5,-.35+i*.2,-.7-k*.5,-.2+i*.2,-.8-k*.5);ctx.lineWidth=3*u;ctx.strokeStyle=hexA('#ffffff',(1-k)*.6);ctx.stroke();}
    ctx.beginPath();ctx.arc(.62,.12,.22,-PI/2,PI/2);ctx.lineWidth=.1;ctx.strokeStyle='#ffffff';ctx.stroke();gloss(()=>{ctx.beginPath();ctx.moveTo(-.65,-.35);ctx.lineTo(.65,-.35);ctx.lineTo(.5,.55);ctx.quadraticCurveTo(0,.7,-.5,.55);ctx.closePath();},'#ffffff',u);
    ctx.beginPath();ctx.ellipse(0,-.35,.62,.12,0,0,TAU);ctx.fillStyle='#6a3a1a';ctx.fill();ctx.fillStyle=c;ctx.fillRect(-.55,0,1.08,.12);},
  (a,t,u,f)=>{for(let i=0;i<9;i++){const x=-.45+(i%5)*.22,y=-.5-Math.floor(i/5)*.22+Math.sin(t*4+i)*.02;gloss(()=>{ctx.beginPath();ctx.arc(x,y,.17,0,TAU);},'#fff8e0',u,1.2);}
    gloss(()=>{ctx.beginPath();ctx.moveTo(-.6,-.4);ctx.lineTo(.6,-.4);ctx.lineTo(.45,.9);ctx.lineTo(-.45,.9);ctx.closePath();},'#ffffff',u);ctx.save();ctx.beginPath();ctx.moveTo(-.6,-.4);ctx.lineTo(.6,-.4);ctx.lineTo(.45,.9);ctx.lineTo(-.45,.9);ctx.clip();
    ctx.fillStyle='#e0344a';for(let i=-3;i<=3;i+=2){ctx.beginPath();ctx.moveTo(i*.12-.06,-.4);ctx.lineTo(i*.12+.06,-.4);ctx.lineTo(i*.1+.05,.9);ctx.lineTo(i*.1-.05,.9);ctx.fill();}ctx.restore();},
  (a,t,u,f)=>{ctx.rotate(Math.sin(t*1.5+a.i)*.12);gloss(()=>{ctx.beginPath();ctx.moveTo(0,.95);ctx.bezierCurveTo(-.9,.4,-.85,-.5,0,-.45);ctx.bezierCurveTo(.85,-.5,.9,.4,0,.95);},'#e0344a',u);
    ctx.fillStyle='#ffe08a';for(let i=0;i<12;i++){ctx.beginPath();ctx.ellipse(Math.cos(i*2.3)*.4,.15+Math.sin(i*2.3)*.4,.03,.05,0,0,TAU);ctx.fill();}
    for(let i=0;i<5;i++){ctx.save();ctx.translate(0,-.5);ctx.rotate(-PI/2+(i-2)*.5);ctx.beginPath();ctx.ellipse(.25,0,.25,.09,0,0,TAU);ctx.fillStyle='#3f9a3a';ctx.fill();ctx.restore();}brilho(-.3,-.1,.1,.2,.3,.5);},
  (a,t,u,f)=>{ctx.rotate(Math.sin(t+a.i)*.12);gloss(()=>{ctx.beginPath();ctx.moveTo(0,-.95);ctx.bezierCurveTo(.5,-.9,.75,.2,.7,.45);ctx.bezierCurveTo(.6,1,-.6,1,-.7,.45);ctx.bezierCurveTo(-.75,.2,-.5,-.9,0,-.95);},'#3a6a2a',u);
    ctx.beginPath();ctx.moveTo(0,-.78);ctx.bezierCurveTo(.4,-.75,.6,.2,.56,.42);ctx.bezierCurveTo(.5,.85,-.5,.85,-.56,.42);ctx.bezierCurveTo(-.6,.2,-.4,-.75,0,-.78);ctx.fillStyle='#d8f08a';ctx.fill();
    gloss(()=>{ctx.beginPath();ctx.arc(0,.35,.3,0,TAU);},'#8a5a2a',u);olhinhos(0,-.25,.18,.06,f.look,f.blink);},
  (a,t,u,f)=>{ctx.rotate(Math.sin(t*.8+a.i)*.12);const seg=[[-.75,.25,.22,-.6],[-.4,.0,.3,-.3],[0,-.08,.38,0],[.4,0,.3,.3],[.75,.25,.22,.6]];
    seg.forEach(([x,y,r,ro])=>gloss(()=>{ctx.beginPath();ctx.ellipse(x,y,r*.8,r,ro,0,TAU);},'#e8a040',u));brilho(-.1,-.3,.25,.06,0,.5);}
];
TEMAS.comida={
  id:'comida',nome:'Comida',cor:'#ff8a5a',grupo:'pop',
  css:{bg:'#2a1408',fg:'#fff6ea',suave:'#e8c8a8',ac:'#ff8a5a',fonte:"'Fredoka',var(--ao-fonte-corpo)",raio:'999px',chip:'rgba(42,20,8,.82)'},
  pal:palDe({texto:'#fff6ea',suave:'#ecccaa',destaque:'#ffd166',ok:'#7ee08a',alerta:'#ff5a5a',onda:'#ffd166',escudo:'#ffd166',ordem:'#ffd166',placaBg:'rgba(46,22,8,.86)',balaoFg:'#3a1c08',
    nucleo:['#fff3d6','#e0a050','#ff9ad0','#ffd166','#ff5a8a']}),
  niveis:['Ovo','Pão','Bolo','Bolo Duplo','Bolo de Festa'],
  cores:['#ff8a5a','#e0a050','#ff7ad9','#ff8a5a','#f0c050','#ff9ad0','#c06bff','#a0662f','#e0344a','#e0344a','#5dbb46','#e8a040'],
  halo:true,escalaAgente:.95,rastroLargura:.08,sombra:true,
  fundoEstatico(g,w,h){pintaBase(g,w,h,'#6a3a1a','#3a1c0a','#120602',.4);
    const q=Math.min(w,h)*.06;g.strokeStyle='rgba(255,220,180,.05)';g.lineWidth=2;for(let x=0;x<w;x+=q){g.beginPath();g.moveTo(x,0);g.lineTo(x,h*.55);g.stroke();}for(let y=0;y<h*.55;y+=q){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
    const lg=g.createRadialGradient(w/2,0,0,w/2,0,h*.8);lg.addColorStop(0,'rgba(255,220,160,.25)');lg.addColorStop(1,'rgba(255,220,160,0)');g.fillStyle=lg;g.fillRect(0,0,w,h);pintaVinheta(g,w,h,.6,'#120602');},
  fundo(t){},
  chao(t){noPlano(0,-.5,0,u=>{const s=.2;for(let i=-8;i<8;i++)for(let j=-6;j<6;j++){const x=(i+.5)*s,z=(j+.5)*s,d=Math.hypot(x,z);if(d>1.55)continue;const k=(i&1)+(j&1);
    ctx.fillStyle=k===2?'rgba(224,52,74,.5)':k===1?'rgba(224,52,74,.28)':'rgba(255,245,235,.28)';ctx.globalAlpha=1-d/1.6;ctx.fillRect(i*s,j*s,s,s);}ctx.globalAlpha=1;});},
  agente(a,t,u,inf){PRATOS[a.i%PRATOS.length](a,t,u,inf,a.corT);},
  auraNucleo(cx,cy,r,nv,t,est){luz(cx,cy,r*3,'#ffd166',.18+est.flash*.3);},
  nucleo(nv,t,u,est){
    ctx.translate(0,Math.sin(t*1.3)*.04+.1);
    if(nv===1){gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.55,.72,0,0,TAU);},'#fff3d6',u);brilho(-.2,-.35,.12,.25,.3,.6);return;}
    if(nv===2){gloss(()=>{ctx.beginPath();ctx.moveTo(-.85,.4);ctx.quadraticCurveTo(-.9,-.55,0,-.55);ctx.quadraticCurveTo(.9,-.55,.85,.4);ctx.closePath();},'#d08a3a',u);ctx.strokeStyle='rgba(255,240,200,.6)';ctx.lineWidth=3*u;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-.45+i*.35,-.35);ctx.lineTo(-.3+i*.35,-.1);ctx.stroke();}return;}
    const and=nv===3?1:nv===4?2:3,cores=['#ff9ad0','#ffd166','#8fd8ff'];let y=.65;
    for(let k=0;k<and;k++){const w=.95-k*.25,h=.38;gloss(()=>{ctx.beginPath();ctx.roundRect(-w,y-h,w*2,h,.06);},cores[k],u);
      ctx.fillStyle='#fff6ea';ctx.beginPath();ctx.moveTo(-w,y-h);for(let i=0;i<=10;i++){const x=-w+i*w*.2;ctx.lineTo(x,y-h+(i%2?.12:.04));}ctx.lineTo(w,y-h);ctx.closePath();ctx.fill();y-=h;}
    if(nv>=4)for(let i=0;i<(nv>=5?5:3);i++){const x=(i-(nv>=5?2:1))*.18;ctx.fillStyle='#ffffff';ctx.fillRect(x-.03,y-.3,.06,.3);const fl=.8+.2*Math.sin(t*15+i);luz(x,y-.38,.12,'#ffb347',.9);ctx.save();ctx.translate(x,y-.38);ctx.scale(.1*fl,.12*fl);chama(t,i,['#ff9a2e','#ffe08a'],1);ctx.restore();}
    else{ctx.beginPath();ctx.arc(0,y-.08,.1,0,TAU);ctx.fillStyle='#d8342a';ctx.fill();}
    if(est.dano>0)luz(0,0,1.2,'#ffffff',est.dano*.6);
  },
  tiro(s,t){if(s.tipo==='ataque'){ctx.rotate(-s.ang+s.t*6);ctx.fillStyle='#5a7a2a';ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();ctx.fillStyle='#3a5a1a';ctx.beginPath();ctx.arc(2,-1,1.6,0,TAU);ctx.arc(-2,2,1.2,0,TAU);ctx.fill();luz(0,0,12,'#9dff5c',.4);return;}
    tiroItem(s,()=>{ctx.beginPath();ctx.arc(0,0,.8,0,TAU);ctx.fillStyle='#c98a4a';ctx.fill();ctx.fillStyle='#4a2a10';for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(Math.cos(i*1.7)*.4,Math.sin(i*1.7)*.4,.12,0,TAU);ctx.fill();}});},
  frente(t){}
};

/* ---------- MÚSICA ---------- */
const batida=t=>Math.pow(Math.max(0,Math.sin(t*PI*2)),6);
const INSTR=[
  (a,t,u,f,c)=>{ctx.rotate(t*3);ctx.beginPath();ctx.arc(0,0,.9,0,TAU);ctx.fillStyle='#141418';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1*u;for(let r=.4;r<.88;r+=.06){ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();}
    ctx.beginPath();ctx.arc(0,0,.32,0,TAU);ctx.fillStyle=c;ctx.fill();ctx.beginPath();ctx.arc(0,0,.05,0,TAU);ctx.fillStyle='#141418';ctx.fill();ctx.beginPath();ctx.moveTo(-.6,-.5);ctx.lineTo(.2,.4);ctx.lineWidth=.04;ctx.strokeStyle='rgba(255,255,255,.12)';ctx.stroke();},
  (a,t,u,f,c)=>{ctx.rotate(-.6+Math.sin(t*2)*.05);gloss(()=>{ctx.beginPath();ctx.rect(-.07,-1.05,.14,.8);},'#5a3a1a',u);gloss(()=>{ctx.beginPath();ctx.roundRect(-.12,-1.25,.24,.22,.05);},'#3a2410',u);
    gloss(()=>{ctx.beginPath();ctx.arc(0,-.05,.35,0,TAU);ctx.moveTo(.55,.45);ctx.arc(0,.45,.55,0,TAU);},c,u);ctx.beginPath();ctx.arc(0,.1,.14,0,TAU);ctx.fillStyle='#1a1a1a';ctx.fill();
    ctx.strokeStyle='#e8e8e8';ctx.lineWidth=.8*u;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*.025,-1.2);ctx.lineTo(i*.025,.7);ctx.stroke();}},
  (a,t,u,f,c)=>{gloss(()=>{ctx.beginPath();ctx.roundRect(-.95,-.45,1.9,.9,.08);},c,u);const ativa=Math.floor(t*4+a.i)%7;
    for(let i=0;i<7;i++){ctx.fillStyle=i===ativa?'#ffe08a':'#ffffff';ctx.fillRect(-.85+i*.243,-.25,.22,.62);}ctx.fillStyle='#141418';for(const i of[0,1,3,4,5])ctx.fillRect(-.7+i*.243,-.25,.13,.38);},
  (a,t,u,f,c)=>{ctx.rotate(.3);gloss(()=>{ctx.beginPath();ctx.moveTo(-.12,.05);ctx.lineTo(.12,.05);ctx.lineTo(.07,1);ctx.lineTo(-.07,1);ctx.closePath();},'#2a2a30',u);
    gloss(()=>{ctx.beginPath();ctx.arc(0,-.35,.45,0,TAU);},'#b8bcc8',u);ctx.save();ctx.beginPath();ctx.arc(0,-.35,.45,0,TAU);ctx.clip();ctx.strokeStyle='rgba(40,40,50,.5)';ctx.lineWidth=1*u;for(let i=-6;i<=6;i++){ctx.beginPath();ctx.moveTo(i*.08,-1);ctx.lineTo(i*.08,.2);ctx.moveTo(-1,-.35+i*.08);ctx.lineTo(1,-.35+i*.08);ctx.stroke();}ctx.restore();
    ctx.fillStyle=c;ctx.fillRect(-.14,.0,.28,.08);},
  (a,t,u,f,c)=>{ctx.beginPath();ctx.arc(0,.1,.75,PI*1.05,TAU-.05*PI);ctx.lineWidth=.14;ctx.strokeStyle='#2a2a30';ctx.stroke();for(const s of[-1,1]){gloss(()=>{ctx.beginPath();ctx.roundRect(s*.75-.2,-.05,.4,.6,.15);},c,u);}},
  (a,t,u,f,c)=>{ctx.rotate(Math.sin(t*4)*.12);gloss(()=>{ctx.beginPath();ctx.ellipse(-.25,.55,.32,.24,-.4,0,TAU);},c,u);ctx.fillStyle=mixHex(c,'#000000',.3);ctx.fillRect(-.02,-.9,.1,1.45);
    ctx.beginPath();ctx.moveTo(.06,-.9);ctx.quadraticCurveTo(.55,-.6,.4,-.15);ctx.quadraticCurveTo(.45,-.5,.06,-.6);ctx.closePath();ctx.fill();},
  (a,t,u,f,c)=>{const b=batida(t);ctx.save();ctx.translate(0,.15);gloss(()=>{ctx.beginPath();ctx.rect(-.75,-.3,1.5,.7);},c,u);ctx.beginPath();ctx.ellipse(0,-.3,.75,.22,0,0,TAU);ctx.fillStyle='#f2f2f2';ctx.fill();ctx.strokeStyle='#888';ctx.lineWidth=2*u;ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.6)';for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(-.75+i*.3,-.25);ctx.lineTo(-.6+i*.3,.38);ctx.stroke();}ctx.restore();
    for(const s of[-1,1]){ctx.save();ctx.translate(s*.3,-.35);ctx.rotate(s*(-.5+b*.4));ctx.fillStyle='#e8c08a';ctx.fillRect(-.03,-.75,.06,.75);ctx.beginPath();ctx.arc(0,-.75,.06,0,TAU);ctx.fill();ctx.restore();}},
  (a,t,u,f,c)=>{ctx.rotate(.4);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(.1,-1);ctx.lineTo(.1,.3);ctx.quadraticCurveTo(.1,.8,-.3,.75);ctx.quadraticCurveTo(-.55,.7,-.55,.4);ctx.lineWidth=.22;ctx.strokeStyle=mixHex('#ffcf5a','#000000',.3);ctx.stroke();ctx.lineWidth=.16;ctx.strokeStyle='#ffcf5a';ctx.stroke();
    ctx.beginPath();ctx.ellipse(-.55,.25,.2,.12,.2,0,TAU);ctx.fillStyle='#e8b030';ctx.fill();ctx.fillStyle=c;for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(.18,-.7+i*.22,.05,0,TAU);ctx.fill();}},
  (a,t,u,f,c)=>{ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-.9,0);ctx.lineTo(.3,0);ctx.lineWidth=.12;ctx.strokeStyle='#e8b030';ctx.stroke();gloss(()=>{ctx.beginPath();ctx.moveTo(.3,-.08);ctx.lineTo(.9,-.4);ctx.lineTo(.9,.4);ctx.lineTo(.3,.08);ctx.closePath();},'#ffcf5a',u);
    ctx.beginPath();ctx.ellipse(-.2,.15,.35,.15,0,0,TAU);ctx.lineWidth=.08;ctx.strokeStyle='#d8a020';ctx.stroke();for(let i=0;i<3;i++){ctx.fillStyle=c;ctx.fillRect(-.45+i*.15,-.25,.06,.2);}},
  (a,t,u,f,c)=>{for(const s of[-1,1]){ctx.save();ctx.rotate(s*(.4+Math.sin(t*10+s)*.15));ctx.fillStyle='#a0662f';ctx.fillRect(-.04,0,.08,.75);gloss(()=>{ctx.beginPath();ctx.ellipse(0,-.15,.28,.36,0,0,TAU);},s>0?c:mixHex(c,'#ffffff',.3),u);ctx.restore();}},
  (a,t,u,f,c)=>{gloss(()=>{ctx.beginPath();ctx.roundRect(-.95,-.6,1.9,1.2,.08);},'#2a2a30',u);ctx.fillStyle=c;ctx.fillRect(-.82,-.48,1.64,.5);ctx.fillStyle='#f2f2f2';ctx.fillRect(-.6,-.22,1.2,.36);
    for(const x of[-.35,.35]){ctx.save();ctx.translate(x,-.04);ctx.rotate(t*3);ctx.beginPath();ctx.arc(0,0,.14,0,TAU);ctx.fillStyle='#2a2a30';ctx.fill();for(let i=0;i<6;i++){ctx.rotate(PI/3);ctx.fillStyle='#f2f2f2';ctx.fillRect(-.02,.06,.04,.06);}ctx.restore();}
    ctx.fillStyle='#4a4a54';ctx.beginPath();ctx.moveTo(-.5,.6);ctx.lineTo(-.4,.35);ctx.lineTo(.4,.35);ctx.lineTo(.5,.6);ctx.fill();},
  (a,t,u,f,c)=>{const b=batida(t);gloss(()=>{ctx.beginPath();ctx.roundRect(-.6,-.95,1.2,1.9,.1);},'#2a2a30',u);
    for(const [y,r] of[[-.45,.25],[.32,.42]]){ctx.beginPath();ctx.arc(0,y,r*(1+b*.12),0,TAU);ctx.fillStyle='#141418';ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=3*u;ctx.stroke();ctx.beginPath();ctx.arc(0,y,r*.35,0,TAU);ctx.fillStyle='#3a3a44';ctx.fill();}
    if(b>.3)luz(0,.32,.8,c,b*.5);}
];
const NOTAS=Array.from({length:14},(_,i)=>{const r=mulberry(i*17+3);return{x:r(),o:r(),v:.03+r()*.04,s:10+r()*10,z:r(),k:Math.floor(r()*3)};});
const EQ=Array.from({length:40},()=>({v:0,a:0}));
TEMAS.musica={
  id:'musica',nome:'Música',cor:'#ff4fd8',grupo:'pop',
  css:{bg:'#0e0618',fg:'#fbeaff',suave:'#c4a8d8',ac:'#ff4fd8',fonte:"'Righteous',var(--ao-fonte-corpo)",raio:'999px',chip:'rgba(20,8,34,.84)'},
  pal:palDe({texto:'#fbeaff',suave:'#c8acdc',destaque:'#ff4fd8',ok:'#5dffb0',alerta:'#ff4f6a',onda:'#ff4fd8',escudo:'#4fe8ff',ordem:'#ffe08a',titulo:"'Righteous',sans-serif",tituloPeso:'',placaBg:'rgba(20,8,34,.86)',balaoFg:'#2a0a3a',
    nucleo:['#ff4fd8','#ffe08a','#4fe8ff','#ff4fd8','#ffe08a']}),
  niveis:['Nota','Vinil','Toca-discos','Boombox','Palco Principal'],
  cores:['#ff4fd8','#e0344a','#4fa8ff','#ffd23f','#5dffb0','#ff9a3d','#c06bff','#4fe8ff','#ffd23f','#ff7ad9','#ff4f6a','#5dffb0'],
  halo:true,escalaAgente:.95,rastroLargura:.1,caudaAditiva:true,
  fundoEstatico(g,w,h){pintaBase(g,w,h,'#2a0e3a','#140620','#060208',.35);
    const r=mulberry(5);for(let i=0;i<200;i++){g.fillStyle=hexA(['#ff4fd8','#4fe8ff','#ffe08a'][i%3],.15+r()*.3);g.beginPath();g.arc(r()*w,h*(.78+r()*.22),1+r()*2,0,TAU);g.fill();}
    g.fillStyle='rgba(0,0,0,.6)';g.beginPath();g.moveTo(0,h);for(let x=0;x<=w;x+=10)g.lineTo(x,h*.86+Math.sin(x*.05)*6+(Math.floor(x/30)%2)*8);g.lineTo(w,h);g.fill();pintaVinheta(g,w,h,.65);},
  fundo(t,dt){
    const b=batida(t);aditivo(()=>{for(let i=0;i<4;i++){const ang=Math.sin(t*.5+i*1.7)*.5,x=W*(.15+i*.23),g=ctx.createLinearGradient(x,0,x+Math.sin(ang)*H,H);const cor=['#ff4fd8','#4fe8ff','#ffe08a','#8f7bff'][i];
      g.addColorStop(0,hexA(cor,.22+b*.1));g.addColorStop(1,hexA(cor,0));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-6,0);ctx.lineTo(x+6,0);ctx.lineTo(x+Math.sin(ang)*H+H*.12,H);ctx.lineTo(x+Math.sin(ang)*H-H*.12,H);ctx.closePath();ctx.fill();}});
    const n=EQ.length,bw=W/n;EQ.forEach((e,i)=>{e.a=Math.max(e.a*.9,(Math.random()*.5+.5)*(.3+.7*b)*(.5+.5*Math.sin(i*.4+t*3)));e.v+=(e.a-e.v)*.3;const hh=e.v*H*.14;
      const g=ctx.createLinearGradient(0,H-hh,0,H);g.addColorStop(0,hexA('#ff4fd8',.5));g.addColorStop(1,hexA('#4fe8ff',.2));ctx.fillStyle=g;ctx.fillRect(i*bw+1,H-hh-40,bw-2,hh);});
    ctx.font='22px serif';ctx.textAlign='center';for(const nt of NOTAS){const y=((1-((nt.o+t*nt.v)%1.1)))*H,x=nt.x*W+Math.sin(t+nt.o*9)*14;ctx.fillStyle=hexA(['#ff4fd8','#4fe8ff','#ffe08a'][nt.k],.15+.35*nt.z);ctx.font=nt.s+'px serif';ctx.fillText(nt.k?'♪':'♫',x,y);}
  },
  agente(a,t,u,inf){const b=batida(t+a.i*.05);ctx.scale(1+b*.08,1-b*.05);INSTR[a.i%INSTR.length](a,t,u,inf,a.corT);},
  auraNucleo(cx,cy,r,nv,t,est){const b=batida(t);luz(cx,cy,r*(3+b),'#ff4fd8',.2+b*.2+est.flash*.3);
    if(nv>=4)for(let k=0;k<3;k++){const kk=(t*.8+k/3)%1;ctx.beginPath();ctx.arc(cx,cy,r*(1.3+kk*2.5),0,TAU);ctx.strokeStyle=hexA('#4fe8ff',(1-kk)*.4);ctx.lineWidth=2;ctx.stroke();}},
  nucleo(nv,t,u,est){
    const b=batida(t);ctx.scale(1+b*.06,1+b*.06);
    if(nv===1){ctx.save();ctx.scale(1.1,1.1);INSTR[5]({i:0},t,u,est,'#ff4fd8');ctx.restore();}
    else if(nv===2)INSTR[0]({i:0},t,u,est,'#ffe08a');
    else if(nv===3){gloss(()=>{ctx.beginPath();ctx.roundRect(-1.1,-.75,2.2,1.5,.1);},'#3a2a20',u);ctx.save();ctx.translate(-.15,0);ctx.scale(.75,.75);INSTR[0]({i:0},t,u/.75,est,'#4fe8ff');ctx.restore();
      ctx.save();ctx.translate(.85,-.55);ctx.rotate(.5+Math.sin(t)*.02);ctx.fillStyle='#d8d8e0';ctx.fillRect(-.03,0,.06,.85);ctx.fillRect(-.06,.8,.12,.1);ctx.restore();}
    else{if(nv>=5){aditivo(()=>{ctx.save();ctx.rotate(t*.3);for(let i=0;i<16;i++){ctx.rotate(TAU/16);ctx.fillStyle=hexA(i%2?'#ff4fd8':'#4fe8ff',.25);ctx.beginPath();ctx.moveTo(1,-.05);ctx.lineTo(2.4,-.2);ctx.lineTo(2.4,.2);ctx.lineTo(1,.05);ctx.fill();}ctx.restore();});}
      gloss(()=>{ctx.beginPath();ctx.roundRect(-1.2,-.6,2.4,1.2,.2);},nv>=5?'#ffcf5a':'#2a2a30',u);ctx.fillStyle='#d8d8e0';ctx.fillRect(-.6,-.85,1.2,.12);
      for(const x of[-.7,.7]){ctx.beginPath();ctx.arc(x,.05,.38*(1+b*.15),0,TAU);ctx.fillStyle='#141418';ctx.fill();ctx.strokeStyle='#ff4fd8';ctx.lineWidth=3*u;ctx.stroke();ctx.beginPath();ctx.arc(x,.05,.13,0,TAU);ctx.fillStyle='#3a3a44';ctx.fill();}
      ctx.fillStyle='#4fe8ff';ctx.fillRect(-.25,-.35,.5,.22);for(let i=0;i<5;i++){ctx.fillStyle=i<b*5+1?'#5dffb0':'#2a3a3a';ctx.fillRect(-.22+i*.09,.15,.07,.25);}}
    if(est.dano>0)luz(0,0,1.2,'#ffffff',est.dano*.6);
  },
  tiro(s,t){if(s.tipo==='ataque'){ctx.rotate(-s.ang);luz(0,0,14,'#ff4f6a',.6);ctx.font='700 18px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ff4f6a';ctx.fillText('✕',0,0);return;}
    if(s.tipo==='sinal'||s.tipo==='passe'){ctx.rotate(-s.ang);luz(0,0,12,s.cor,.6);ctx.font='700 18px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffffff';ctx.fillText(s.tipo==='sinal'?'♪':'♫',0,0);return;}tiroPadrao(s);},
  frente(t){}
};

/* ---------- ESPORTES ---------- */
function bolaBase(cor,u){esfera3(cor,.85);}
function clipBola(fn){ctx.save();ctx.beginPath();ctx.arc(0,0,.85,0,TAU);ctx.clip();fn();ctx.restore();}
function brilhoBola(u){ctx.beginPath();ctx.arc(0,0,.85,0,TAU);ctx.lineWidth=2*u;ctx.strokeStyle='rgba(0,0,0,.35)';ctx.stroke();brilho(-.3,-.4,.22,.1,-.6,.55);}
const BOLAS=[
  (a,t,u,f)=>{ctx.rotate(t*2+a.i);bolaBase('#f6f6f6',u);clipBola(()=>{ctx.fillStyle='#1a1a1a';const pent=(x,y,r,ro)=>{ctx.beginPath();for(let i=0;i<5;i++){const aa=ro+i/5*TAU;ctx.lineTo(x+Math.cos(aa)*r,y+Math.sin(aa)*r);}ctx.closePath();ctx.fill();};
    pent(0,0,.28,-PI/2);for(let i=0;i<5;i++){const aa=-PI/2+i/5*TAU+PI/5;pent(Math.cos(aa)*.78,Math.sin(aa)*.78,.26,aa+PI);}
    ctx.strokeStyle='#888';ctx.lineWidth=1.2*u;for(let i=0;i<5;i++){const aa=-PI/2+i/5*TAU;ctx.beginPath();ctx.moveTo(Math.cos(aa)*.28,Math.sin(aa)*.28);ctx.lineTo(Math.cos(aa)*.6,Math.sin(aa)*.6);ctx.stroke();}});brilhoBola(u);},
  (a,t,u,f)=>{ctx.rotate(t*2.4+a.i);bolaBase('#ff8a2a',u);clipBola(()=>{ctx.strokeStyle='#2a1408';ctx.lineWidth=3*u;ctx.beginPath();ctx.moveTo(-1,0);ctx.lineTo(1,0);ctx.moveTo(0,-1);ctx.lineTo(0,1);ctx.stroke();
    for(const s of[-1,1]){ctx.beginPath();ctx.arc(s*1.1,0,.75,0,TAU);ctx.stroke();}});brilhoBola(u);},
  (a,t,u,f)=>{ctx.rotate(t*3+a.i);bolaBase('#d8f040',u);clipBola(()=>{ctx.strokeStyle='#ffffff';ctx.lineWidth=5*u;ctx.beginPath();ctx.arc(-1,0,.75,-.9,.9);ctx.stroke();ctx.beginPath();ctx.arc(1,0,.75,PI-.9,PI+.9);ctx.stroke();});brilhoBola(u);},
  (a,t,u,f)=>{ctx.rotate(t*1.8+a.i);bolaBase('#ffffff',u);clipBola(()=>{const cs=['#4fa8ff','#ffd23f'];for(let i=0;i<3;i++){ctx.save();ctx.rotate(i*TAU/3);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(.3,-.2,.6,-.2,1,0);ctx.lineTo(1,.4);ctx.bezierCurveTo(.6,.2,.3,.2,0,0);ctx.fillStyle=cs[i%2];ctx.fill();ctx.restore();}});brilhoBola(u);},
  (a,t,u,f)=>{ctx.rotate(t*2.2+a.i);bolaBase('#f6f2ea',u);clipBola(()=>{ctx.strokeStyle='#d8342a';ctx.lineWidth=2*u;for(const s of[-1,1]){ctx.beginPath();ctx.arc(s*1.15,0,.8,s>0?PI-.75:-.75,s>0?PI+.75:.75);ctx.stroke();
    for(let i=-4;i<=4;i++){const aa=(s>0?PI:0)+i*.17,x=s*1.15+Math.cos(aa)*.8,y=Math.sin(aa)*.8;ctx.beginPath();ctx.moveTo(x-.05,y-.05);ctx.lineTo(x+.05,y+.05);ctx.stroke();}}});brilhoBola(u);},
  (a,t,u,f)=>{ctx.rotate(t+a.i);bolaBase('#ffffff',u);clipBola(()=>{ctx.fillStyle='rgba(0,0,0,.1)';for(let i=0;i<40;i++){const aa=i*2.4,r=Math.sqrt(i/40)*.8;ctx.beginPath();ctx.arc(Math.cos(aa)*r,Math.sin(aa)*r,.05,0,TAU);ctx.fill();}});brilhoBola(u);},
  (a,t,u,f,c)=>{ctx.rotate(t*1.5+a.i);bolaBase(c,u);clipBola(()=>{ctx.fillStyle='#141418';for(const [x,y] of[[-.15,-.35],[.15,-.35],[0,-.08]]){ctx.beginPath();ctx.arc(x,y,.09,0,TAU);ctx.fill();}});brilhoBola(u);},
  (a,t,u,f)=>{ctx.rotate(t*2+a.i);gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.95,.58,0,0,TAU);},'#8a4a20',u);ctx.strokeStyle='#ffffff';ctx.lineWidth=2.5*u;ctx.beginPath();ctx.moveTo(-.3,-.25);ctx.lineTo(.3,-.25);ctx.stroke();
    for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*.12,-.33);ctx.lineTo(i*.12,-.17);ctx.stroke();}for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*.7,-.3);ctx.lineTo(s*.7,.3);ctx.stroke();}brilho(-.3,-.3,.25,.08,-.2,.4);},
  (a,t,u,f)=>{ctx.rotate(Math.sin(t*2+a.i)*.6);bolaBase('#141418',u);ctx.beginPath();ctx.arc(.05,-.1,.38,0,TAU);ctx.fillStyle='#ffffff';ctx.fill();ctx.font='700 .5px '+"'Bungee',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#141418';ctx.fillText('8',.05,-.07);brilhoBola(u);},
  (a,t,u,f,c)=>{ctx.rotate(Math.sin(t*3+a.i)*.3);for(let i=0;i<7;i++){ctx.save();ctx.rotate((i-3)*.18);ctx.beginPath();ctx.moveTo(0,.2);ctx.lineTo(-.12,-.85);ctx.quadraticCurveTo(0,-.95,.12,-.85);ctx.closePath();ctx.fillStyle=i%2?'#ffffff':mixHex(c,'#ffffff',.5);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=1*u;ctx.stroke();ctx.restore();}
    ctx.beginPath();ctx.ellipse(0,.4,.32,.32,0,0,PI);ctx.lineTo(-.32,.4);ctx.closePath();gloss(()=>{ctx.beginPath();ctx.arc(0,.4,.32,0,PI);ctx.closePath();},'#d8a060',u);ctx.fillStyle=c;ctx.fillRect(-.32,.3,.64,.12);},
  (a,t,u,f)=>{ctx.rotate(t*4+a.i);ctx.beginPath();ctx.ellipse(0,.12,.8,.3,0,0,TAU);ctx.fillStyle='#000';ctx.fill();ctx.fillRect(-.8,-.12,1.6,.24);gloss(()=>{ctx.beginPath();ctx.ellipse(0,-.12,.8,.3,0,0,TAU);},'#2a2a30',u);ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='700 .22px sans-serif';ctx.textAlign='center';ctx.fillText('PUCK',0,-.06);},
  (a,t,u,f,c)=>{ctx.rotate(Math.sin(t*2+a.i)*.3);gloss(()=>{ctx.beginPath();ctx.ellipse(0,0,.95,.35,0,0,TAU);},c,u);ctx.beginPath();ctx.ellipse(0,-.04,.65,.2,0,0,TAU);ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=2*u;ctx.stroke();brilho(-.3,-.15,.3,.06,0,.5);}
];
TEMAS.esportes={
  id:'esportes',nome:'Esportes',cor:'#5dff6a',grupo:'pop',
  css:{bg:'#04140a',fg:'#f0fff2',suave:'#a8d0b0',ac:'#5dff6a',fonte:"'Bungee',var(--ao-fonte-corpo)",raio:'4px',chip:'rgba(4,22,10,.84)'},
  pal:palDe({texto:'#f0fff2',suave:'#b0d4b8',destaque:'#ffd23f',ok:'#5dff6a',alerta:'#ff4f4f',onda:'#ffffff',escudo:'#ffffff',ordem:'#ffd23f',titulo:"'Bungee',sans-serif",tituloPeso:'',placaBg:'rgba(4,22,10,.86)',placaRaio:3,balaoFg:'#0a2a10',
    nucleo:['#cd7f32','#c0c0c0','#ffd23f','#ffd23f','#ffd23f']}),
  niveis:['Bronze','Prata','Ouro','Taça','Campeão'],
  cores:['#f6f6f6','#ff8a2a','#d8f040','#4fa8ff','#f6f2ea','#ffffff','#8f7bff','#8a4a20','#141418','#ff4f8a','#2a2a30','#ff9a3d'],
  halo:false,escalaAgente:.9,rastroLargura:.08,sombra:true,
  fundoEstatico(g,w,h){const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#05080f');gr.addColorStop(.42,'#0e1a2a');gr.addColorStop(.45,'#1a2a20');gr.addColorStop(1,'#0a2a12');g.fillStyle=gr;g.fillRect(0,0,w,h);
    const r=mulberry(44);for(let row=0;row<6;row++){const y=h*(.22+row*.035);g.fillStyle=row%2?'#141c28':'#18222e';g.fillRect(0,y,w,h*.035);for(let i=0;i<w/5;i++){if(r()<.35){g.fillStyle=hexA(['#e0344a','#4fa8ff','#ffd23f','#ffffff'][Math.floor(r()*4)],.25+r()*.3);g.fillRect(i*5,y+r()*h*.03,3,3);}}}
    for(const x of[.08,.92]){g.fillStyle='#2a3240';g.fillRect(w*x-3,h*.05,6,h*.25);const lg=g.createRadialGradient(w*x,h*.05,0,w*x,h*.05,h*.35);lg.addColorStop(0,'rgba(255,255,230,.6)');lg.addColorStop(1,'rgba(255,255,230,0)');g.fillStyle=lg;g.fillRect(0,0,w,h);
      g.fillStyle='#fffbe0';g.fillRect(w*x-20,h*.04,40,10);}
    pintaVinheta(g,w,h,.55);},
  fundo(t){for(let i=0;i<5;i++){if(Math.random()<.04)luz(Math.random()*W,H*(.22+Math.random()*.2),6+Math.random()*8,'#ffffff',.9);}},
  chao(t){noPlano(0,-.5,0,u=>{for(let i=-8;i<8;i++){ctx.fillStyle=i%2?'rgba(60,180,80,.22)':'rgba(40,140,60,.22)';ctx.fillRect(i*.2,-1.1,.2,2.2);}
    ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=2.5*u;ctx.strokeRect(-1.55,-1.05,3.1,2.1);ctx.beginPath();ctx.moveTo(0,-1.05);ctx.lineTo(0,1.05);ctx.stroke();ctx.beginPath();ctx.arc(0,0,.4,0,TAU);ctx.stroke();
    ctx.strokeRect(-1.55,-.5,.4,1);ctx.strokeRect(1.15,-.5,.4,1);});},
  agente(a,t,u,inf){const h=Math.abs(Math.sin(t*2.5+a.i))*.2;ctx.translate(0,-h);BOLAS[a.i%BOLAS.length](a,t,u,inf,a.corT);},
  auraNucleo(cx,cy,r,nv,t,est){luz(cx,cy,r*3,'#ffd23f',.15+est.flash*.3+(nv>=4?.1:0));},
  nucleo(nv,t,u,est){
    ctx.translate(0,Math.sin(t*1.4)*.04);
    if(nv<=3){const cor=['#cd7f32','#c0c0c0','#ffd23f'][nv-1];ctx.beginPath();ctx.moveTo(-.35,-1.1);ctx.lineTo(-.1,-.2);ctx.lineTo(.1,-.2);ctx.lineTo(.35,-1.1);ctx.lineTo(.15,-1.1);ctx.lineTo(0,-.55);ctx.lineTo(-.15,-1.1);ctx.closePath();ctx.fillStyle='#e0344a';ctx.fill();
      ctx.save();ctx.translate(0,.25);ctx.scale(Math.max(.2,Math.abs(Math.cos(t*.8))),1);esfera3(cor,.62);ctx.beginPath();ctx.arc(0,0,.45,0,TAU);ctx.strokeStyle=mixHex(cor,'#000000',.3);ctx.lineWidth=3*u;ctx.stroke();
      ctx.fillStyle=mixHex(cor,'#000000',.35);ctx.font='700 .45px '+"'Bungee',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(4-nv),0,.03);ctx.restore();}
    else{const e=nv>=5?1.15:1;ctx.scale(e,e);const gc=ctx.createLinearGradient(-.6,0,.6,0);gc.addColorStop(0,'#fff0a0');gc.addColorStop(.5,'#ffd23f');gc.addColorStop(1,'#b8860b');
      ctx.lineWidth=.1;ctx.strokeStyle='#d8a020';for(const s of[-1,1]){ctx.beginPath();ctx.arc(s*.6,-.45,.25,s>0?-PI/2:PI/2,s>0?PI/2:PI*1.5);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(-.65,-.85);ctx.lineTo(.65,-.85);ctx.quadraticCurveTo(.6,0,0,.2);ctx.quadraticCurveTo(-.6,0,-.65,-.85);ctx.fillStyle=gc;ctx.fill();ctx.fillStyle='#d8a020';ctx.fillRect(-.08,.15,.16,.35);ctx.fillRect(-.4,.5,.8,.25);ctx.fillStyle='#3a2a10';ctx.fillRect(-.3,.55,.6,.12);
      brilho(-.35,-.6,.08,.3,.1,.6);ctx.save();ctx.translate(0,-.45);ctx.scale(.2,.2);ctx.fillStyle='#fff8d0';estrelaPoli(5,2,1);ctx.fill();ctx.restore();}
    if(nv>=5)for(let i=0;i<14;i++){const k=(t*.5+i/14)%1;ctx.save();ctx.translate(Math.sin(i*2.7)*1.3,-1.4+k*2.6);ctx.rotate(t*3+i);ctx.fillStyle=['#e0344a','#4fa8ff','#ffd23f','#5dff6a'][i%4];ctx.globalAlpha*=1-k;ctx.fillRect(-.05,-.025,.1,.05);ctx.restore();}
    if(est.dano>0)luz(0,0,1.2,'#ffffff',est.dano*.6);
  },
  tiro(s,t){if(s.tipo==='ataque'){ctx.rotate(-s.ang);ctx.fillStyle='#e0344a';ctx.fillRect(-5,-7,10,14);ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.strokeRect(-5,-7,10,14);return;}
    tiroItem(s,()=>{esfera3(s.cor==='#141418'?'#f6f6f6':s.cor,.8);});},
  frente(t){}
};

/* ---------- ORIGAMI ---------- */
function dobra(tris,cor,u){const tons=[mixHex(cor,'#ffffff',.35),cor,mixHex(cor,'#000000',.22)];
  tris.forEach(([p,tom])=>{ctx.beginPath();p.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.fillStyle=tons[tom];ctx.fill();ctx.lineWidth=1*u;ctx.strokeStyle='rgba(60,40,20,.25)';ctx.lineJoin='round';ctx.stroke();});}
const PAPEIS=[
  (t,k)=>{const w=Math.sin(t*4+k)*.35;return[[[[-.2,0],[.2,0],[0,.25]],2],[[[-.2,0],[0,-.15],[.2,0]],1],[[[-.1,-.05],[-.75,-.75-w*.4],[.05,-.1]],0],[[[.1,-.05],[.75,-.75-w*.4],[-.05,-.1]],1],[[[.2,0],[.75,-.1],[.8,-.4]],2],[[[-.2,0],[-.85,-.05],[-.75,-.3]],2],[[[.75,-.1],[.9,-.42],[.8,-.4]],0]];},
  (t,k)=>{const j=Math.max(0,Math.sin(t*3+k))*.15;return[[[[0,-.5-j],[.6,.2],[0,.5]],1],[[[0,-.5-j],[-.6,.2],[0,.5]],0],[[[.6,.2],[.9,.55],[.3,.45]],2],[[[-.6,.2],[-.9,.55],[-.3,.45]],2],[[[-.2,-.35-j],[0,-.5-j],[-.1,-.15]],2]];},
  ()=>[[[[-.9,.15],[.9,.15],[.6,.55],[-.6,.55]],1],[[[0,-.85],[0,.12],[-.6,.12]],0],[[[0,-.85],[.65,.12],[0,.12]],2]],
  (t)=>{const e=Math.sin(t*2)*.05;return[[[[-.7,-.7+e],[-.3,-.1],[-.75,.0]],2],[[[.7,-.7+e],[.3,-.1],[.75,.0]],1],[[[-.75,0],[0,.75],[0,-.1]],0],[[[.75,0],[0,.75],[0,-.1]],1],[[[-.3,-.1],[.3,-.1],[0,.2]],0]];},
  ()=>[[[[1,0],[-.8,-.6],[-.4,0]],0],[[[1,0],[-.4,0],[-.8,.6]],1],[[[-.4,0],[-.6,.12],[1,0]],2]],
  (t)=>{const s=Math.sin(t*6)*.15;return[[[[.8,0],[0,-.5],[-.4,0]],0],[[[.8,0],[-.4,0],[0,.5]],1],[[[-.4,0],[-.95,-.45+s],[-.8,0]],2],[[[-.4,0],[-.8,0],[-.95,.45+s]],1]];},
  (t)=>{const o=Math.sin(t*2)*.08;return[[[[-.3,-.3],[-.45,-1.0+o],[-.1,-.35]],1],[[[.1,-.35],[.45,-1.0-o],[.3,-.3]],2],[[[-.55,-.3],[.55,-.3],[0,.6]],0],[[[-.55,-.3],[0,.6],[-.4,.35]],2],[[[.55,-.3],[.4,.35],[0,.6]],1]];},
  (t)=>{const f=.4+.6*Math.abs(Math.sin(t*5));return[[[[0,0],[-.9*f,-.7],[-.6*f,.1]],0],[[[0,0],[.9*f,-.7],[.6*f,.1]],1],[[[0,0],[-.6*f,.1],[-.5*f,.6]],2],[[[0,0],[.6*f,.1],[.5*f,.6]],2]];},
  ()=>{const r=[];for(let i=0;i<5;i++){const a=-PI/2+i/5*TAU,b=a+PI/5,c=a-PI/5;r.push([[[0,0],[Math.cos(a),Math.sin(a)],[Math.cos(b)*.4,Math.sin(b)*.4]],i%2?0:1],[[[0,0],[Math.cos(c)*.4,Math.sin(c)*.4],[Math.cos(a),Math.sin(a)]],2]);}return r;},
  ()=>[[[[0,.85],[-.85,-.1],[-.45,-.6],[0,-.25]],0],[[[0,.85],[0,-.25],[.45,-.6],[.85,-.1]],1]],
  (t)=>{const s=Math.sin(t*2)*.12;return[[[[.9,.1],[.2,-.5],[-.6,0],[0,.4]],0],[[[.9,.1],[0,.4],[-.6,0]],1],[[[-.6,0],[-1,-.45+s],[-.85,0]],2],[[[-.6,0],[-.85,0],[-1,.35+s]],1],[[[.2,-.5],[.4,-.75],[.3,-.45]],2]];},
  (t)=>{const w=Math.sin(t*6)*.3;return[[[[.6,-.1],[-.5,-.2],[-.3,.25]],1],[[[.6,-.1],[.95,-.05],[.6,.05]],2],[[[-.1,-.1],[-.3,-.85-w],[.2,-.15]],0],[[[-.5,-.2],[-.9,-.4],[-.6,0]],2]];}
];
const GRUAS=Array.from({length:8},(_,i)=>{const r=mulberry(i*29+1);return{x:r(),y:r(),v:.01+r()*.015,s:.5+r()*.8,z:r()};});
TEMAS.origami={
  id:'origami',nome:'Origami',cor:'#e85a4f',grupo:'pop',
  css:{bg:'#efe6d6',fg:'#2b2420',suave:'#6b5e52',ac:'#e85a4f',fonte:"'Zen Maru Gothic',var(--ao-fonte-corpo)",raio:'4px',chip:'rgba(255,250,240,.9)'},
  pal:palDe({texto:'#2b2420',suave:'#6b5e52',destaque:'#c0392b',ok:'#2f8a4a',alerta:'#c0392b',onda:'#c0392b',escudo:'#2b7ab8',ordem:'#d08a1a',titulo:"'Zen Maru Gothic',sans-serif",corpo:"'Zen Maru Gothic','Figtree',sans-serif",
    placaBg:'rgba(255,250,240,.92)',placaRaio:3,balaoBg:'rgba(43,36,32,.92)',balaoFg:'#fff8ee',nucleo:['#f2ead8','#e8dcc4','#e85a4f','#d4a017','#c0392b']}),
  niveis:['Folha','Primeira Dobra','Tsuru','Tsuru Dourado','Fênix de Papel'],
  cores:['#e85a4f','#4fa86a','#2b7ab8','#e88a3a','#8f7bc0','#3ab0c0','#f2f2f2','#e8b030','#d4a017','#e85a8a','#5a7ac0','#4f8a5a'],
  halo:false,escalaAgente:1,rastroLargura:.06,sombra:true,ligacoes:false,
  fundoEstatico(g,w,h){g.fillStyle='#efe6d6';g.fillRect(0,0,w,h);const r=mulberry(70);
    for(let i=0;i<2500;i++){g.strokeStyle='rgba(120,90,60,'+(.03+r()*.05)+')';g.lineWidth=.6;const x=r()*w,y=r()*h,a=r()*TAU,l=4+r()*14;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();}
    g.strokeStyle='rgba(120,90,60,.08)';g.lineWidth=1.5;g.beginPath();g.moveTo(0,0);g.lineTo(w,h);g.moveTo(w,0);g.lineTo(0,h);g.moveTo(w/2,0);g.lineTo(w/2,h);g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke();
    const vg=g.createRadialGradient(w/2,h/2,Math.min(w,h)*.3,w/2,h/2,Math.max(w,h)*.75);vg.addColorStop(0,'rgba(120,90,60,0)');vg.addColorStop(1,'rgba(120,90,60,.25)');g.fillStyle=vg;g.fillRect(0,0,w,h);},
  fundo(t){for(const c of GRUAS){const x=((c.x+t*c.v)%1.2-.1)*W-par.x*S*.05*c.z,y=c.y*H*.8+Math.sin(t+c.x*9)*8;ctx.save();ctx.translate(x,y);ctx.scale(S*.03*c.s,S*.03*c.s);ctx.globalAlpha=.12+.1*c.z;dobra(PAPEIS[0](t,c.x*9),'#b8a890',.03);ctx.restore();}ctx.globalAlpha=1;},
  chao(t){noPlano(0,-.5,0,u=>{ctx.strokeStyle='rgba(120,90,60,.18)';ctx.lineWidth=1.5*u;ctx.setLineDash([.06,.05]);for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*.4,-1.2);ctx.lineTo(i*.4,1.2);ctx.stroke();ctx.beginPath();ctx.moveTo(-1.4,i*.35);ctx.lineTo(1.4,i*.35);ctx.stroke();}ctx.setLineDash([]);});},
  orbita(pts){ctx.setLineDash([3,6]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],fr=clamp((a.prof+1)/2,0,1);ctx.strokeStyle=hexA('#6b5e52',.08+fr*.22);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.setLineDash([]);},
  agente(a,t,u,inf){ctx.translate(0,Math.sin(t*1.8+a.i)*.06);ctx.rotate(Math.sin(t*.9+a.i)*.08);dobra(PAPEIS[a.i%PAPEIS.length](t,a.i),a.corT,u);},
  auraNucleo(cx,cy,r,nv,t,est){if(nv>=4)luz(cx,cy,r*3,'#ffd68a',.25+est.flash*.3);},
  nucleo(nv,t,u,est){
    ctx.translate(0,Math.sin(t*1.2)*.05);
    if(nv===1){ctx.rotate(Math.sin(t*.6)*.1);dobra([[[[-.75,-.75],[.75,-.75],[.75,.75],[-.75,.75]],1]],'#f2ead8',u);ctx.strokeStyle='rgba(120,90,60,.25)';ctx.lineWidth=1*u;ctx.beginPath();ctx.moveTo(-.75,-.75);ctx.lineTo(.75,.75);ctx.stroke();}
    else if(nv===2)dobra([[[[-.8,.5],[.8,.5],[0,-.7]],1],[[[0,-.7],[.8,.5],[.15,.5]],2]],'#e8dcc4',u);
    else{if(nv>=5){for(let i=0;i<12;i++){const aa=t*.5+i/12*TAU;ctx.save();ctx.translate(Math.cos(aa)*1.7,Math.sin(aa)*.55);ctx.scale(.2,.2);dobra(PAPEIS[0](t,i),['#e85a4f','#d4a017','#2b7ab8','#4fa86a'][i%4],u/.2);ctx.restore();}}
      const cor=nv===3?'#e85a4f':nv===4?'#d4a017':'#c0392b';ctx.scale(nv>=4?1.3:1,nv>=4?1.3:1);dobra(PAPEIS[0](t*.6,0),cor,u);if(nv>=5){ctx.save();ctx.scale(1,1);dobra([[[[-.1,-.05],[-1.0,-.4],[-.6,.1]],0],[[[.1,-.05],[1.0,-.4],[.6,.1]],0]],'#d4a017',u);ctx.restore();}}
    if(est.medo>0){ctx.strokeStyle='rgba(192,57,43,'+(.3+.3*Math.sin(t*12))+')';ctx.lineWidth=3*u;ctx.beginPath();ctx.arc(0,0,1.1,0,TAU);ctx.stroke();}
  },
  escudo(cx,cy,R,f,t,nv,rip,on){ctx.save();ctx.globalAlpha*=on;const n=12;for(let i=0;i<n;i++){const a=t*.3+i/n*TAU;let rr=R;rip.forEach(w=>{const d=Math.atan2(Math.sin(a-w.ang),Math.cos(a-w.ang));if(Math.abs(d)<.5)rr=R*(1-(1-w.t)*.1);});
    ctx.save();ctx.translate(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);ctx.rotate(a+PI/2);const s=R*.18;ctx.scale(s,s);ctx.globalAlpha*=i<f*n?1:.2;dobra([[[[0,-1],[.9,.6],[-.9,.6]],1],[[[0,-1],[.9,.6],[0,.2]],2]],'#2b7ab8',1/s);ctx.restore();}ctx.restore();},
  tiro(s,t){if(s.tipo==='ataque'){ctx.rotate(-s.ang+s.t*5);ctx.fillStyle='#2b2420';ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(7,6);ctx.lineTo(-7,6);ctx.closePath();ctx.fill();ctx.fillStyle='#c0392b';ctx.fillRect(-1,-2,2,5);return;}
    if(s.tipo==='sinal'||s.tipo==='passe'){ctx.scale(8,8);dobra(PAPEIS[4](t,0),s.cor,1/8);return;}tiroPadrao(s);},
  frente(t){}
};

/* ---------- BRINQUEDOS ---------- */
const BRINQ=[
  (a,t,u,f,c)=>{ctx.rotate(Math.sin(t*3)*.1);gloss(()=>{ctx.beginPath();ctx.moveTo(-.75,-.1);ctx.quadraticCurveTo(0,-.6,.75,-.1);ctx.lineTo(0,.9);ctx.closePath();},c,u);
    ctx.save();ctx.beginPath();ctx.moveTo(-.75,-.1);ctx.quadraticCurveTo(0,-.6,.75,-.1);ctx.lineTo(0,.9);ctx.closePath();ctx.clip();for(let i=-4;i<=4;i++){ctx.fillStyle=i%2?'rgba(255,255,255,.45)':'rgba(0,0,0,0)';const x=((i*.25+t*2)%2+2)%2-1;ctx.fillRect(x-.06,-1,.12,2);}ctx.restore();
    ctx.fillStyle='#8a5a2a';ctx.fillRect(-.06,-.75,.12,.4);},
  (a,t,u,f,c)=>{const y=Math.sin(t*3+a.i)*.5;ctx.beginPath();ctx.moveTo(0,-1.1);ctx.lineTo(0,y-.3);ctx.lineWidth=1.5*u;ctx.strokeStyle='#f2f2f2';ctx.stroke();ctx.save();ctx.translate(0,y);ctx.rotate(t*8);gloss(()=>{ctx.beginPath();ctx.arc(0,0,.42,0,TAU);},c,u);
    ctx.beginPath();ctx.arc(0,0,.18,0,TAU);ctx.fillStyle='#ffffff';ctx.fill();ctx.fillStyle=mixHex(c,'#000000',.3);ctx.fillRect(-.3,-.04,.6,.08);ctx.restore();},
  (a,t,u,f,c)=>{ctx.rotate(t+a.i);ctx.beginPath();ctx.arc(0,0,.6,0,TAU);const g=ctx.createRadialGradient(-.2,-.25,.05,0,0,.6);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.6,hexA(c,.5));g.addColorStop(1,hexA(c,.85));ctx.fillStyle=g;ctx.fill();
    ctx.beginPath();ctx.moveTo(-.4,.2);ctx.bezierCurveTo(-.1,-.4,.2,.4,.45,-.2);ctx.lineWidth=.12;ctx.strokeStyle=mixHex(c,'#ffffff',.3);ctx.stroke();brilho(-.22,-.28,.14,.06,-.6,.8);},
  (a,t,u,f,c)=>{if(f.dir.x<0)ctx.scale(-1,1);gloss(()=>{ctx.beginPath();ctx.moveTo(-.9,.25);ctx.lineTo(-.85,-.1);ctx.lineTo(-.4,-.15);ctx.lineTo(-.2,-.5);ctx.lineTo(.35,-.5);ctx.lineTo(.55,-.15);ctx.lineTo(.9,-.1);ctx.lineTo(.92,.25);ctx.closePath();},c,u);
    ctx.fillStyle='#bfe8ff';ctx.beginPath();ctx.moveTo(-.15,-.42);ctx.lineTo(.3,-.42);ctx.lineTo(.45,-.17);ctx.lineTo(-.3,-.17);ctx.closePath();ctx.fill();
    for(const x of[-.5,.55]){ctx.save();ctx.translate(x,.28);ctx.rotate(t*8);ctx.beginPath();ctx.arc(0,0,.2,0,TAU);ctx.fillStyle='#2a2a30';ctx.fill();ctx.fillStyle='#d8d8e0';ctx.fillRect(-.03,-.12,.06,.24);ctx.restore();}},
  (a,t,u,f,c)=>{const w=Math.sin(t*10)*.04;ctx.translate(w,0);gloss(()=>{ctx.beginPath();ctx.roundRect(-.45,-.85,.9,.6,.08);},'#b8bcc8',u);gloss(()=>{ctx.beginPath();ctx.roundRect(-.55,-.2,1.1,.9,.1);},c,u);
    olhinhos(0,-.55,.18,.09,f.look,f.blink);ctx.fillStyle='#ffd23f';ctx.fillRect(-.15,-.4,.3,.06);for(let i=0;i<3;i++){ctx.fillStyle=['#e0344a','#ffd23f','#4fa8ff'][i];ctx.beginPath();ctx.arc(-.25+i*.25,.1,.08,0,TAU);ctx.fill();}
    ctx.save();ctx.translate(.6,.25);ctx.scale(Math.cos(t*4),1);ctx.fillStyle='#8a8a94';ctx.fillRect(0,-.04,.2,.08);ctx.beginPath();ctx.ellipse(.28,0,.08,.18,0,0,TAU);ctx.fill();ctx.restore();
    ctx.fillStyle='#4a4a54';ctx.fillRect(-.4,.7,.25,.2);ctx.fillRect(.15,.7,.25,.2);},
  (a,t,u,f,c)=>{const cs=['#ffffff','#e0344a','#4fa8ff','#ffd23f','#5dbb46','#ff9a3d'];const face=(pts,off)=>{for(let i=0;i<3;i++)for(let j=0;j<3;j++){const P=(s,v)=>[pts[0][0]+(pts[1][0]-pts[0][0])*s+(pts[3][0]-pts[0][0])*v,pts[0][1]+(pts[1][1]-pts[0][1])*s+(pts[3][1]-pts[0][1])*v];
      const q=[P(i/3+.03,j/3+.03),P((i+1)/3-.03,j/3+.03),P((i+1)/3-.03,(j+1)/3-.03),P(i/3+.03,(j+1)/3-.03)];ctx.beginPath();q.forEach((p,k)=>k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=cs[(i*3+j+off+Math.floor(t*.5+a.i))%6];ctx.fill();}};
    ctx.fillStyle='#141418';ctx.beginPath();ctx.moveTo(0,-.9);ctx.lineTo(.8,-.45);ctx.lineTo(.8,.5);ctx.lineTo(0,.95);ctx.lineTo(-.8,.5);ctx.lineTo(-.8,-.45);ctx.closePath();ctx.fill();
    face([[0,-.9],[.8,-.45],[0,0],[-.8,-.45]],0);face([[-.8,-.45],[0,0],[0,.95],[-.8,.5]],2);face([[0,0],[.8,-.45],[.8,.5],[0,.95]],4);},
  (a,t,u,f,c)=>{const b=Math.sin(t*2+a.i)*.06;ctx.rotate(b);gloss(()=>{ctx.beginPath();ctx.ellipse(.05,.3,.85,.5,0,0,TAU);},'#ffd23f',u);gloss(()=>{ctx.beginPath();ctx.arc(-.35,-.35,.4,0,TAU);},'#ffd23f',u);
    ctx.beginPath();ctx.moveTo(-.72,-.38);ctx.quadraticCurveTo(-1.05,-.3,-.75,-.22);ctx.closePath();ctx.fillStyle='#ff8a2a';ctx.fill();olhinhos(-.4,-.45,.1,.06,f.look,f.blink);
    ctx.beginPath();ctx.ellipse(.25,.15,.35,.18,-.3,0,TAU);ctx.fillStyle='#f0c020';ctx.fill();ctx.fillStyle=c;ctx.fillRect(-.6,-.1,.5,.08);},
  (a,t,u,f,c)=>{ctx.rotate(.4);if(f.carga>0||Math.sin(t*3)>0)chamaMotor(0,.85,.16,.6,'#ffb347',t,a.i);ctx.save();ctx.rotate(PI/2);ctx.restore();
    gloss(()=>{ctx.beginPath();ctx.moveTo(0,-1);ctx.quadraticCurveTo(.35,-.5,.3,.6);ctx.lineTo(-.3,.6);ctx.quadraticCurveTo(-.35,-.5,0,-1);},'#f2f2f2',u);
    for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*.3,.2);ctx.lineTo(s*.6,.75);ctx.lineTo(s*.3,.6);ctx.closePath();ctx.fillStyle=c;ctx.fill();}ctx.beginPath();ctx.arc(0,-.2,.14,0,TAU);ctx.fillStyle='#4fa8ff';ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=3*u;ctx.stroke();},
  (a,t,u,f,c)=>{for(const s of[-1,1]){gloss(()=>{ctx.beginPath();ctx.arc(s*.55,-.55,.25,0,TAU);},c,u);ctx.beginPath();ctx.arc(s*.55,-.55,.12,0,TAU);ctx.fillStyle=mixHex(c,'#ffffff',.4);ctx.fill();}
    gloss(()=>{ctx.beginPath();ctx.arc(0,0,.72,0,TAU);},c,u);ctx.beginPath();ctx.ellipse(0,.25,.3,.22,0,0,TAU);ctx.fillStyle=mixHex(c,'#ffffff',.45);ctx.fill();olhinhos(0,-.12,.25,.08,f.look,f.blink);
    ctx.beginPath();ctx.ellipse(0,.15,.09,.06,0,0,TAU);ctx.fillStyle='#2a1a10';ctx.fill();ctx.fillStyle='#e0344a';ctx.beginPath();ctx.moveTo(0,.62);ctx.lineTo(-.25,.5);ctx.lineTo(-.25,.75);ctx.closePath();ctx.moveTo(0,.62);ctx.lineTo(.25,.5);ctx.lineTo(.25,.75);ctx.closePath();ctx.fill();},
  (a,t,u,f,c)=>{const L='ABCDEFGHIJKL'[a.i%12];ctx.fillStyle=mixHex(c,'#000000',.35);ctx.beginPath();ctx.moveTo(-.65,-.55);ctx.lineTo(-.4,-.8);ctx.lineTo(.85,-.8);ctx.lineTo(.85,.45);ctx.lineTo(.6,.7);ctx.closePath();ctx.fill();
    gloss(()=>{ctx.beginPath();ctx.rect(-.65,-.55,1.25,1.25);},c,u);ctx.font='700 .9px '+"'Fredoka',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffffff';ctx.fillText(L,-.03,.1);},
  (a,t,u,f,c)=>{ctx.fillStyle='#8a8a94';ctx.fillRect(-.04,0,.08,1);ctx.save();ctx.rotate(t*3+a.i);const cs=[c,'#ffd23f','#4fa8ff','#5dbb46'];for(let i=0;i<4;i++){ctx.rotate(PI/2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(.7,-.05);ctx.lineTo(.2,-.5);ctx.closePath();ctx.fillStyle=cs[i];ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1*u;ctx.stroke();}ctx.restore();
    ctx.beginPath();ctx.arc(0,0,.08,0,TAU);ctx.fillStyle='#ffffff';ctx.fill();},
  (a,t,u,f,c)=>{ctx.rotate(t*1.5+a.i);const cs=[c,'#ffffff','#ffd23f','#ffffff','#4fa8ff','#ffffff'];for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,.85,i/6*TAU,(i+1)/6*TAU);ctx.closePath();ctx.fillStyle=cs[i];ctx.fill();}
    ctx.beginPath();ctx.arc(0,0,.85,0,TAU);ctx.lineWidth=2*u;ctx.strokeStyle='rgba(0,0,0,.3)';ctx.stroke();ctx.beginPath();ctx.arc(0,0,.12,0,TAU);ctx.fillStyle='#ffffff';ctx.fill();brilho(-.3,-.4,.22,.08,-.6,.5);}
];
TEMAS.brinquedos={
  id:'brinquedos',nome:'Brinquedos',cor:'#ffd23f',grupo:'pop',
  css:{bg:'#1e2a5a',fg:'#ffffff',suave:'#c8d4f8',ac:'#ffd23f',fonte:"'Fredoka',var(--ao-fonte-corpo)",raio:'999px',chip:'rgba(20,28,64,.82)'},
  pal:palDe({texto:'#ffffff',suave:'#c8d4f8',destaque:'#ffd23f',ok:'#7dff9e',alerta:'#ff5a6a',onda:'#ffd23f',escudo:'#7fe8ff',ordem:'#ffd23f',placaBg:'rgba(20,28,64,.88)',balaoFg:'#1e2a5a',
    nucleo:['#e0344a','#4fa8ff','#ffd23f','#5dbb46','#ff7ad9']}),
  niveis:['Bloco','Torre','Castelo','Fortaleza','Reino dos Brinquedos'],
  cores:['#e0344a','#4fa8ff','#5dffb0','#ff9a3d','#e0344a','#ffffff','#ff4fd8','#e0344a','#c58a4a','#8f7bff','#ff4fd8','#e0344a'],
  halo:true,escalaAgente:.95,rastroLargura:.1,sombra:true,
  fundoEstatico(g,w,h){const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#2a3a7a');gr.addColorStop(.6,'#1e2a5a');gr.addColorStop(1,'#141a3a');g.fillStyle=gr;g.fillRect(0,0,w,h);
    const r=mulberry(81),q=Math.min(w,h)*.09;for(let y=0;y<h*.7;y+=q)for(let x=(y/q%2)*q/2;x<w;x+=q){g.save();g.translate(x,y);g.scale(q*.12,q*.12);if(r()<.5){g.fillStyle='rgba(255,230,120,.12)';g.beginPath();for(let i=0;i<10;i++){const a=i/10*TAU-PI/2,rr=i%2?.45:1;g.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}g.fill();}
      else{g.fillStyle='rgba(255,255,255,.07)';g.beginPath();g.arc(-.4,0,.5,0,TAU);g.arc(.2,-.2,.6,0,TAU);g.arc(.7,.1,.4,0,TAU);g.fill();}g.restore();}
    g.fillStyle='rgba(255,255,255,.06)';g.fillRect(0,h*.68,w,6);pintaVinheta(g,w,h,.55,'#0a0e24');},
  fundo(t){},
  chao(t){noPlano(0,-.5,0,u=>{ctx.save();ctx.beginPath();ctx.arc(0,0,1.45,0,TAU);ctx.clip();for(let i=-8;i<8;i++){ctx.fillStyle=i%2?'rgba(190,130,70,.32)':'rgba(170,110,55,.32)';ctx.fillRect(i*.2,-1.3,.2,2.6);ctx.strokeStyle='rgba(90,50,20,.3)';ctx.lineWidth=1*u;ctx.strokeRect(i*.2,-1.3,.2,2.6);}
    const fg=ctx.createRadialGradient(0,0,1,0,0,1.45);fg.addColorStop(0,'rgba(30,42,90,0)');fg.addColorStop(1,'rgba(30,42,90,1)');ctx.fillStyle=fg;ctx.fillRect(-1.5,-1.5,3,3);ctx.restore();
    ctx.beginPath();ctx.arc(0,0,.95,0,TAU);ctx.fillStyle='rgba(255,122,217,.18)';ctx.fill();ctx.beginPath();ctx.arc(0,0,.75,0,TAU);ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=4*u;ctx.setLineDash([.08,.08]);ctx.stroke();ctx.setLineDash([]);});},
  agente(a,t,u,inf){BRINQ[a.i%BRINQ.length](a,t,u,inf,a.corT);},
  auraNucleo(cx,cy,r,nv,t,est){luz(cx,cy,r*3,'#ffd23f',.18+est.flash*.3);
    if(nv>=5)for(let k=0;k<3;k++){const kk=(t*.6+k/3)%1,x=cx+Math.sin(k*2.3)*r*2.2,y=cy-r*1.6-k*r*.3;if(kk<.7)continue;const e=(kk-.7)/.3;for(let i=0;i<12;i++){const a=i/12*TAU;ctx.fillStyle=hexA(['#ff4fd8','#ffd23f','#4fa8ff'][k],1-e);ctx.beginPath();ctx.arc(x+Math.cos(a)*e*r*1.2,y+Math.sin(a)*e*r*1.2,2.5,0,TAU);ctx.fill();}}},
  nucleo(nv,t,u,est){
    ctx.translate(0,Math.sin(t*1.2)*.04);const bloco=(x,y,s,c,L)=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);BRINQ[9]({i:'ABCDEFGHIJKL'.indexOf(L)},t,u/s,est,c);ctx.restore();};
    if(nv===1)bloco(0,0,.8,'#e0344a','A');
    else if(nv===2){bloco(0,.38,.55,'#4fa8ff','B');bloco(0,-.32,.55,'#e0344a','A');}
    else{const torreC=(x,h,c)=>{gloss(()=>{ctx.beginPath();ctx.rect(x-.22,.75-h,.44,h);},c,u);for(let i=0;i<3;i++){ctx.fillStyle=c;ctx.fillRect(x-.22+i*.17,.75-h-.1,.1,.1);}};
      torreC(-.75,1.1,'#4fa8ff');torreC(.75,1.1,'#5dbb46');gloss(()=>{ctx.beginPath();ctx.rect(-.55,.05,1.1,.7);},'#ffd23f',u);ctx.fillStyle='#8a5a2a';ctx.beginPath();ctx.arc(0,.75,.2,PI,TAU);ctx.fill();
      torreC(0,1.45,'#e0344a');if(nv>=4){for(const [x,h,c] of[[-.75,1.1,'#ff4fd8'],[.75,1.1,'#ffd23f'],[0,1.45,'#5dffb0']]){ctx.fillStyle='#8a8a94';ctx.fillRect(x-.01,.65-h-.35,.02,.35);ctx.beginPath();ctx.moveTo(x+.01,.65-h-.35);ctx.lineTo(x+.25+Math.sin(t*4+x)*.03,.65-h-.28);ctx.lineTo(x+.01,.65-h-.2);ctx.fillStyle=c;ctx.fill();}}}
    if(est.dano>0)luz(0,0,1.2,'#ffffff',est.dano*.6);
  },
  tiro(s,t){if(s.tipo==='ataque'){ctx.rotate(-s.ang+s.t*6);ctx.fillStyle='#2a2a30';ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();ctx.fillStyle='#ff5a6a';ctx.fillRect(-1.5,-9,3,4);return;}
    tiroItem(s,()=>BRINQ[2]({i:0},t,1/8,null,s.cor));},
  frente(t){particulasFrente(t,'#ffe08a',true);}
};


const CENARIOS_NOVOS=[
  {id:'jardim',nome:'Jardim Encantado',base:'floresta',cor:'#b6ef91',niveis:['Semente','Broto','Flor','Bosque','Jardim Vivo']},
  {id:'aquario',nome:'Aquário Abissal',base:'oceano',cor:'#7ce8ef',niveis:['Bolha','Coral','Recife','Abismo','Oceano Vivo']},
  {id:'oficina',nome:'Oficina dos Inventos',base:'cyber',cor:'#ffbd72',niveis:['Faísca','Engrenagem','Autômato','Laboratório','Inventor Mestre']}
];
for(const c of CENARIOS_NOVOS){
  const base=TEMAS[c.base];
  TEMAS[c.id]={...base,id:c.id,nome:c.nome,cor:c.cor,niveis:c.niveis,
    css:{...base.css,ac:c.cor},pal:{...base.pal,destaque:c.cor,onda:c.cor},
    agente(a,t,u,inf){
      base.agente(a,t,u,inf);
      ctx.save();ctx.lineWidth=Math.max(.025,u*1.7);ctx.strokeStyle=c.cor;ctx.fillStyle=c.cor;
      if(c.id==='jardim'){
        ctx.translate(.6,-.6);ctx.rotate(Math.sin(t+a.i)*.15);
        for(let j=0;j<5;j++){ctx.rotate(TAU/5);ctx.beginPath();ctx.ellipse(0,-.2,.1,.2,0,0,TAU);ctx.fill();}
        ctx.beginPath();ctx.arc(0,0,.1,0,TAU);ctx.fillStyle='#ffe7a1';ctx.fill();
      }else if(c.id==='aquario'){
        for(let j=0;j<3;j++){ctx.beginPath();ctx.arc(.68+Math.sin(t+j+a.i)*.08,.6-j*.26-(t*.15%1),.06,0,TAU);ctx.stroke();}
      }else{
        ctx.translate(.65,-.65);ctx.rotate(t*.5+a.i);
        for(let j=0;j<8;j++){ctx.rotate(TAU/8);ctx.fillRect(-.065,-.3,.13,.15);}
        ctx.beginPath();ctx.arc(0,0,.2,0,TAU);ctx.stroke();
      }
      ctx.restore();
    }
  };
}

function desenhaAmbiente(t){
  if(TEMA.id==='cosmos')return;
  const id=TEMA.id,cor=TEMA.pal.destaque;
  ctx.save();ctx.lineWidth=1;
  if(['pixel','cyber','oficina','voxel'].includes(id)){
    const passo=Math.max(34,S*.095),desloc=t*6%passo;
    ctx.strokeStyle=hexA(cor,.09);
    for(let x=desloc;x<W;x+=passo){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=desloc;y<H;y+=passo){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  }else if(['oceano','aquario','clima','artico'].includes(id)){
    for(let k=0;k<7;k++){ctx.beginPath();const y=H*(.22+k*.1);
      for(let x=0;x<=W+14;x+=14){const yy=y+Math.sin(x*.018+t*.6+k*.8)*S*.012;
        if(x===0)ctx.moveTo(x,yy);else ctx.lineTo(x,yy);}
      ctx.strokeStyle=hexA(cor,.06+k*.008);ctx.stroke();}
  }else if(['jardim','floresta','bio','origami'].includes(id)){
    for(let k=0;k<18;k++){const x=(k+.5)/18*W,y=H*.9+Math.sin(k*1.7)*S*.04;
      ctx.beginPath();ctx.moveTo(x,H);ctx.quadraticCurveTo(x+Math.sin(t*.6+k)*S*.035,y-S*.04,x+Math.sin(t*.5+k)*S*.025,y-S*.11);
      ctx.strokeStyle=hexA(cor,.12);ctx.stroke();}
  }else if(id==='musica'){
    for(let k=0;k<24;k++){const x=(k+.5)/24*W,altura=(.06+.14*Math.abs(Math.sin(t*1.6+k*.7)))*H;
      ctx.fillStyle=hexA(cor,.09);ctx.fillRect(x,H*.9-altura,Math.max(2,W/50),altura);}
  }else{
    for(let k=0;k<12;k++){const x=(k+.5)/12*W,y=H*(.25+.6*((k*7)%12)/12);
      ctx.beginPath();ctx.arc(x,y,S*(.01+.006*Math.sin(t*.5+k)**2),0,TAU);
      ctx.strokeStyle=hexA(cor,.11);ctx.stroke();}
  }
  ctx.restore();
}
/* ================= MOTOR (lógica comum a todos os temas) ================= */
const nomeNivel=n=>{
  if(n<=5)return (NIV[n-1]&&NIV[n-1].nome)||(TEMA&&TEMA.niveis[n-1])||('Nível '+n);
  const fases=['','ASCENSÃO','AURORA','CONSTELAÇÃO','LENDÁRIO','SOBERANIA','TRANSCENDÊNCIA','INFINITO','CELESTIAL','SUPREMO'];
  const epoca=Math.floor((n-1)/5),forma=(n-1)%5+1;
  return (fases[Math.min(fases.length-1,epoca)]||'SUPREMO')+' · FORMA '+forma;
};
const fonte=(peso,px,fam)=>(peso||'')+Math.round(px)+'px '+fam;

function criaFundo(){
  const c=document.createElement('canvas');c.width=Math.max(2,Math.round(W*1.1));c.height=Math.max(2,Math.round(H*1.1));
  const g=c.getContext('2d');
  if(TEMA.fundoEstatico)TEMA.fundoEstatico(g,c.width,c.height);else{g.fillStyle=TEMA.css.bg;g.fillRect(0,0,c.width,c.height);}
  return c;
}
function resize(){
  const b=root.getBoundingClientRect();DPR=Math.min(devicePixelRatio||1,2);
  W=Math.max(1,b.width);H=Math.max(1,b.height);S=Math.min(W,H);
  cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);
  K=Math.min(W*.38,H*.58);CX=W/2;CY=H*.48;if(W<600){K=Math.min(W*.47,H*.42);CY=H*.45;}scanImg=null;
  if(TEMA)fundoImg=criaFundo();
}

/* ---------------- XP e evolução ---------------- */
function progresso(){if(nuc.nivel>=NIV.length)return 1;const a=NIV[nuc.nivel-1].xp,b=NIV[nuc.nivel].xp;return clamp((nuc.xp-a)/(b-a),0,1);}
function explosao(x,y,cor,n,vel){for(let i=0;i<n;i++){const ang=Math.random()*TAU,v=(.3+Math.random())*vel;fx.push({x,y,vx:Math.cos(ang)*v,vy:Math.sin(ang)*v,l:1,m:.6+Math.random()*.9,cor,s:1.5+Math.random()*2.5});}}
function subirNivel(ant){
  nuc.nivelAnt=ant;nuc.morph=1;nuc.evo=1;nuc.aviso=3;nuc.avisoTxt='EVOLUIU!  NV '+nuc.nivel+' · '+nomeNivel(nuc.nivel).toUpperCase();
  nuc.shake=.7;nuc.paz=Math.max(nuc.paz,CONFIG.ataques.paz+3);flashTela=1;tempoEscala=.25;cam.pulso=.1;
  if(OV)OV.onLevel(nuc.nivel);
  ondas.push({t:0,cor:TEMA.pal.destaque},{t:-.15,cor:'#ffffff'});
  explosao(CX,CY,TEMA.pal.destaque,70,S*.5);explosao(CX,CY,'#ffffff',30,S*.35);
}
function darXP(v,cor,x,y){
  if(v<=0)return;nuc.xp+=v;
  if(cor&&x!=null)fxTxt.push({x,y,t:0,txt:'+'+Math.round(v),cor});
  while(nuc.nivel<NIV.length&&nuc.xp>=NIV[nuc.nivel].xp){const ant=nuc.nivel;nuc.nivel++;subirNivel(ant);}
}
function setNivel(n){n=clamp(n|0,1,NIV.length);if(n===nuc.nivel)return;const ant=nuc.nivel,sobe=n>ant;nuc.nivel=n;nuc.xp=NIV[n-1].xp;if(sobe)subirNivel(ant);else{nuc.nivelAnt=ant;nuc.morph=1;}}

/* ---------------- tiros: todas as direções ---------------- */
function alvoDe(x){if(x==='nucleo')return{x:CX,y:CY};if(x&&x.nome)return x.p?{x:x.p.x,y:x.p.y}:null;return x||null;}
function borda(p,ang){const dx=Math.cos(ang),dy=Math.sin(ang);let tx=1e9,ty=1e9;
  if(dx>0)tx=(W-10-p.x)/dx;else if(dx<0)tx=(10-p.x)/dx;if(dy>0)ty=(H-10-p.y)/dy;else if(dy<0)ty=(10-p.y)/dy;
  const k=Math.max(0,Math.min(tx,ty));return{x:p.x+dx*k,y:p.y+dy*k};}
function lancar(tipo,de,para,o){
  o=o||{};const A=alvoDe(de);if(!A)return null;
  const cor=o.cor||(de&&de.corT)||TEMA.pal.ordem;
  const s={tipo,de,para,x0:A.x,y0:A.y,x:A.x,y:A.y,cor,t:0,k:0,dur:o.dur||(tipo==='mercado'?1.15:.85),seed:Math.random(),
    poder:o.poder||null,poderTipo:o.poderTipo||null,curva:o.curva!=null?o.curva:(tipo==='passe'?.2:(Math.random()-.5)*.12),txt:o.txt,ganho:o.ganho,hist:[],ang:0};
  proj.push(s);
  if(para==='nucleo'){const dx=A.x-CX,dy=A.y-CY,d=Math.hypot(dx,dy)||1;nuc.alvoX=dx/d;nuc.alvoY=dy/d;}
  return s;
}
function dispararDe(a,tipo,para,o){if(TEMA.id==='cosmos'&&a&&a.nome)return false;if(!a||!a.ativo||!a.p||a.carga>0)return false;a.carga=.35;a.pend={tipo,para,o:o||{}};return true;}
function liberar(a){
  const pd=a.pend;a.pend=null;if(!pd||!a.ativo||!a.p)return;
  let alvo=pd.para;if(pd.tipo==='mercado')alvo=borda(a.p,Math.atan2(a.p.y-CY,a.p.x-CX)+(Math.random()-.5)*1.2);
  const A=alvoDe(alvo);if(!A)return;
  const ang=Math.atan2(A.y-a.p.y,A.x-a.p.x);a.recuoX=-Math.cos(ang)*S*.024;a.recuoY=-Math.sin(ang)*S*.024;
  lancar(pd.tipo,a,alvo,pd.o);aneis.push({x:a.p.x,y:a.p.y,t:0,cor:a.corT});explosao(a.p.x,a.p.y,a.corT,8,S*.15);
  const txt=pd.tipo==='sinal'?a.status:pd.tipo==='passe'?'→ '+pd.para.nome:pd.tipo==='mercado'?'ordem enviada!':pd.tipo==='reforco'?'reforçando a barreira!':'pronto!';
  a.balao={txt,t:1.7,dur:1.7};
}
function nucleoOrdem(a){
  if(!a||!a.ativo||!a.p)return;nuc.flash=1;nuc.happy=.4;
  const dx=a.p.x-CX,dy=a.p.y-CY,d=Math.hypot(dx,dy)||1;nuc.alvoX=dx/d;nuc.alvoY=dy/d;
  agenda.push({t:.3,fn:()=>{if(a.ativo&&a.p)lancar('ordem','nucleo',a,{cor:TEMA.pal.ordem,dur:.8,curva:.1});}});
}
function impacto(s){
  if(OV&&s.tipo==='nucleo-agente')return OV.impact(s);
  if(OV&&s.poder)OV.powerHit(s);
  if(s.tipo==='ataque')return impactoAtaque(s);
  if(s.tipo==='reforco')return impactoReforco(s);
  if(s.tipo==='intercepta')return impactoIntercepta(s);
  const alvo=s.para;aneis.push({x:s.x,y:s.y,t:0,cor:s.cor});explosao(s.x,s.y,s.cor,10,S*.2);
  if(alvo==='nucleo'){
    nuc.happy=.7;nuc.flash=1;nuc.sinais++;const agora=performance.now()/1000;
    nuc.combo=(agora-nuc.comboT<2.6)?nuc.combo+1:1;nuc.comboT=agora;nuc.comboPop=1;
    darXP(CONFIG.xp.porSinal*Math.min(3,1+.25*(nuc.combo-1)),s.cor,CX+(Math.random()-.5)*S*.1,CY-S*.12);
    if(s.de&&s.de.nome)s.de.happy=.8;
  }else if(alvo&&alvo.nome){
    alvo.happy=.9;alvo.glow=1;alvo.recuoX+=Math.cos(s.ang)*S*.014;alvo.recuoY+=Math.sin(s.ang)*S*.014;
    const py=alvo.p?alvo.p.y-alvo.p.r*1.7:CY,px=alvo.p?alvo.p.x:CX;
    if(s.tipo==='ordem'){alvo.balao={txt:'ordem recebida!',t:1.6,dur:1.6};darXP(1.5,s.cor,px,py);}
    else if(s.tipo==='passe'){alvo.balao={txt:'recebi de '+s.de.nome,t:1.6,dur:1.6};darXP(1,s.cor,px,py);}
    else if(s.tipo==='fill'){fxTxt.push({x:px,y:py,t:0,txt:s.txt,cor:s.cor,bruto:true});darXP(s.ganho?3:1);
      if(s.ganho)nuc.paz=Math.max(nuc.paz,CONFIG.ataques.paz);agenda.push({t:.35,fn:()=>dispararDe(alvo,'sinal','nucleo')});}
  }else if(s.tipo==='mercado'){
    const ganho=Math.random()<.72,v=(ganho?'+':'−')+(Math.random()*.9+.1).toFixed(2).replace('.',',')+'R',de=s.de,ox=s.x,oy=s.y;
    agenda.push({t:.45,fn:()=>{if(de&&de.ativo&&de.p)lancar('fill',{x:ox,y:oy},de,{cor:ganho?TEMA.pal.ok:TEMA.pal.alerta,txt:v,ganho,dur:1,curva:.22});}});
  }
}
function atualizaProj(dt){
  for(let i=proj.length-1;i>=0;i--){
    const s=proj[i];if(s.morto){proj.splice(i,1);continue;}
    s.t+=dt;const k=Math.min(1,s.t/s.dur);s.k=k;
    const A=alvoDe(s.para);if(!A){proj.splice(i,1);continue;}
    const kk=Math.pow(k,1.7),dx=A.x-s.x0,dy=A.y-s.y0,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,off=Math.sin(PI*kk)*s.curva*len;
    const x=s.x0+dx*kk+nx*off,y=s.y0+dy*kk+ny*off,ant=s.hist[s.hist.length-1];
    if(ant&&(x!==ant.x||y!==ant.y))s.ang=Math.atan2(y-ant.y,x-ant.x);else if(!ant)s.ang=Math.atan2(dy,dx);
    s.hist.push({x,y});if(s.hist.length>18)s.hist.shift();s.x=x;s.y=y;
    if(k>=1){impacto(s);proj.splice(i,1);}
  }
}
function tiroPadrao(s){
  ctx.shadowColor=s.cor;ctx.shadowBlur=14;
  if(s.tipo==='ordem'||s.tipo==='intercepta'){ctx.fillStyle='#fff3c4';ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-7,-4.5);ctx.lineTo(-3,0);ctx.lineTo(-7,4.5);ctx.closePath();ctx.fill();}
  else if(s.tipo==='passe'||s.tipo==='reforco'){ctx.fillStyle=s.cor;ctx.beginPath();ctx.arc(0,0,5,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(3,-4);ctx.lineTo(4.5,0);ctx.lineTo(3,4);ctx.closePath();ctx.fill();}
  else if(s.tipo==='ataque'){ctx.rotate(s.t*9);ctx.fillStyle=s.cor;ctx.beginPath();for(let i=0;i<10;i++){const rr=i%2?4:10,a=i*PI/5;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,2.5,0,TAU);ctx.fill();}
  else if(s.tipo==='mercado'){ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(10,0);ctx.stroke();}
  else if(s.tipo==='fill'){ctx.rotate(-s.ang);ctx.fillStyle=s.cor;ctx.beginPath();ctx.arc(0,0,7,0,TAU);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#10201a';ctx.font='700 9px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.ganho?'$':'!',0,.5);}
  else{ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(0,-4);ctx.lineTo(-6,0);ctx.lineTo(0,4);ctx.closePath();ctx.fill();}
  ctx.shadowBlur=0;
}
function desenhaProj(t){
  const T=TEMA;
  proj.forEach(s=>{
    const h=s.hist,laser=s.tipo==='mercado',fade=s.k>.85&&laser?(1-s.k)/.15:1;
    ctx.save();ctx.globalAlpha=fade;if(T.caudaAditiva)ctx.globalCompositeOperation='lighter';
    for(let i=1;i<h.length;i++){const f=i/h.length;
      if(T.caudaPixel){if(i%2)continue;const z=2+f*4;ctx.fillStyle=hexA(s.cor,f*.9);ctx.fillRect(h[i].x-z/2,h[i].y-z/2,z,z);continue;}
      ctx.beginPath();ctx.moveTo(h[i-1].x,h[i-1].y);ctx.lineTo(h[i].x,h[i].y);ctx.lineWidth=f*(laser?3.2:5.5);ctx.lineCap='round';ctx.strokeStyle=hexA(s.cor,f*.85);ctx.stroke();}
    ctx.restore();
    ctx.save();ctx.globalAlpha=fade;ctx.translate(s.x,s.y);ctx.rotate(s.ang);(T.tiro?T.tiro.bind(T):tiroPadrao)(s,t);ctx.restore();
  });
}

/* ---------------- defesa do núcleo ---------------- */
function iniciaAmeaca(nome){
  const A=CONFIG.ataques,tp=A.tipos.find(x=>x.nome===nome)||A.tipos[Math.floor(Math.random()*A.tipos.length)];
  ameaca.fase=1;ameaca.nome=tp.nome;ameaca.cor=tp.cor;ameaca.spawn=0;ameaca.quebrou=false;ameaca.n=3+Math.min(9,Math.floor(nuc.nivel/2))+Math.floor(Math.random()*3);
  const e=nuc.escudo;e.max=24+12*nuc.nivel;e.hp=e.max;e.alvoOn=1;nuc.medo=3.5;
  ativos().filter(a=>a.p&&a.carga<=0).sort(()=>Math.random()-.5).slice(0,3).forEach((a,i)=>agenda.push({t:.5+i*.25,fn:()=>dispararDe(a,'reforco','nucleo',{cor:TEMA.pal.escudo})}));
  for(let i=0;i<ameaca.n;i++)agenda.push({t:1.4+i*.4,fn:spawnAtaque});
}
function spawnAtaque(){
  const o=borda({x:CX,y:CY},Math.random()*TAU);
  const s=lancar('ataque',{x:o.x,y:o.y},'nucleo',{cor:ameaca.cor,dur:1.15+Math.random()*.4,curva:(Math.random()-.5)*.3});
  ameaca.spawn++;ameaca.fase=2;aneis.push({x:o.x,y:o.y,t:0,cor:ameaca.cor});
  ativos().forEach(a=>{if(!a.p)return;const dx=o.x-a.p.x,dy=o.y-a.p.y,d=Math.hypot(dx,dy)||1;a.olhar={x:dx/d,y:dy/d,t:.8};a.olharT=3;});
  if(s&&Math.random()<.45+.1*nuc.nivel)agenda.push({t:.22,fn:()=>{if(!s.morto&&proj.includes(s))lancar('intercepta','nucleo',s,{cor:TEMA.pal.ordem,dur:.45,curva:0});}});
}
function finalizaAmeaca(){
  const A=CONFIG.ataques;ameaca.fase=0;ameaca.prox=A.intervalo[0]+Math.random()*(A.intervalo[1]-A.intervalo[0]);nuc.aviso=2.4;
  if(!ameaca.quebrou){nuc.avisoTxt='DEFESA PERFEITA!';darXP(8+nuc.nivel*2,TEMA.pal.escudo,CX,CY-S*.15);nuc.paz=Math.max(nuc.paz,A.paz*.6);ondas.push({t:0,cor:TEMA.pal.escudo});nuc.happy=1;}
  else nuc.avisoTxt='NÚCLEO RESISTIU';
  agenda.push({t:1.2,fn:()=>{nuc.escudo.alvoOn=0;}});
}
function impactoAtaque(s){
  const e=nuc.escudo,dano=5+Math.random()*4;
  if(e.on>.5&&e.hp>0){
    e.hp-=dano;e.rip.push({ang:Math.atan2(s.y-CY,s.x-CX),t:0});aneis.push({x:s.x,y:s.y,t:0,cor:TEMA.pal.escudo});
    explosao(s.x,s.y,s.cor,12,S*.2);explosao(s.x,s.y,'#ffffff',6,S*.12);nuc.flash=.6;cam.pulso=Math.max(cam.pulso,.015);
    if(e.hp<=0){e.hp=0;e.alvoOn=0;ameaca.quebrou=true;explosao(CX,CY,TEMA.pal.escudo,50,S*.5);nuc.shake=.5;tempoEscala=.4;
      fxTxt.push({x:CX,y:CY-nuc.r*3,t:0,txt:'BARREIRA ROMPIDA!',cor:TEMA.pal.alerta,bruto:true});}
  }else{
    nuc.dano=.8;nuc.shake=.45;nuc.xp=Math.max(NIV[nuc.nivel-1].xp,nuc.xp-6);explosao(s.x,s.y,s.cor,18,S*.25);aneis.push({x:s.x,y:s.y,t:0,cor:s.cor});
    fxTxt.push({x:CX+(Math.random()-.5)*S*.1,y:CY-nuc.r*1.8,t:0,txt:'−6 XP',cor:TEMA.pal.alerta,bruto:true});
  }
}
function impactoReforco(s){const e=nuc.escudo;if(e.on>.3)e.hp=Math.min(e.max,e.hp+6);aneis.push({x:s.x,y:s.y,t:0,cor:s.cor});explosao(s.x,s.y,s.cor,8,S*.15);nuc.flash=.5;
  if(s.de&&s.de.nome){s.de.happy=.8;if(s.de.p)darXP(1,s.cor,s.de.p.x,s.de.p.y-s.de.p.r*1.7);}}
function impactoIntercepta(s){const t=s.para;if(t&&t.tipo==='ataque'&&!t.morto&&proj.includes(t)){t.morto=true;explosao(t.x,t.y,t.cor,16,S*.22);explosao(t.x,t.y,'#ffe9a8',8,S*.14);
  aneis.push({x:t.x,y:t.y,t:0,cor:TEMA.pal.ordem});nuc.defesas++;darXP(2,TEMA.pal.ordem,t.x,t.y-S*.03);}}
function escudoPadrao(cx,cy,R0,f,t,nv,rip,on){
  const hue=Math.round(8+182*f),col='hsl('+hue+',95%,62%)',cols=h=>'hsla('+hue+',95%,62%,'+h+')';
  ctx.save();ctx.globalAlpha*=Math.min(1,on);
  const g=ctx.createRadialGradient(cx,cy,R0*.55,cx,cy,R0);g.addColorStop(0,cols(0));g.addColorStop(1,cols(.3+.2*nuc.flash));ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R0,0,TAU);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,R0,0,TAU);ctx.clip();const hs=R0*.2,hh=hs*Math.sqrt(3)/2;ctx.strokeStyle=cols(.2);ctx.lineWidth=1;
  for(let row=-7;row<=7;row++)for(let c=-7;c<=7;c++){const x=cx+c*hs*1.5,y=cy+row*hh*2+(c&1?hh:0);ctx.beginPath();for(let k=0;k<6;k++){const a=k*PI/3;ctx.lineTo(x+Math.cos(a)*hs*.55,y+Math.sin(a)*hs*.55);}ctx.closePath();ctx.stroke();}
  rip.forEach(w=>{const px=cx+Math.cos(w.ang)*R0,py=cy+Math.sin(w.ang)*R0,gg=ctx.createRadialGradient(px,py,0,px,py,R0*.7*(w.t+.2));gg.addColorStop(0,'rgba(255,255,255,'+(.55*(1-w.t))+')');gg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gg;ctx.fillRect(cx-R0,cy-R0,R0*2,R0*2);});
  ctx.restore();
  ctx.beginPath();ctx.arc(cx,cy,R0,0,TAU);ctx.lineWidth=2.5;ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=18;ctx.stroke();ctx.shadowBlur=0;
  for(let i=1;i<1+Math.floor((nv-1)/2);i++){ctx.beginPath();ctx.arc(cx,cy,R0*(1+.13*i),0,TAU);ctx.lineWidth=1.5;ctx.strokeStyle=cols(.55);ctx.setLineDash([10,8]);ctx.lineDashOffset=-t*(20+i*10)*(i%2?1:-1);ctx.stroke();ctx.setLineDash([]);}
  if(nv>=3)for(let i=0;i<3;i++){const a0=t*.9+i*TAU/3;ctx.beginPath();ctx.arc(cx,cy,R0*1.1,a0,a0+.7);ctx.lineWidth=5;ctx.lineCap='round';ctx.strokeStyle=cols(.9);ctx.stroke();}
  ctx.beginPath();ctx.arc(cx,cy,R0*1.05+4,-PI/2,-PI/2+TAU*f);ctx.lineWidth=3;ctx.strokeStyle=cols(.9);ctx.lineCap='round';ctx.stroke();
  ctx.restore();
}
function desenhaEscudo(t,dt){
  const e=nuc.escudo;e.on+=(e.alvoOn-e.on)*Math.min(1,dt*5);
  for(let i=e.rip.length-1;i>=0;i--){e.rip[i].t+=dt/.6;if(e.rip[i].t>=1)e.rip.splice(i,1);}
  if(e.on<.02)return;
  const nv=Math.min(5,nuc.nivel),R=nuc.r*(2+.1*nv)*(.7+.3*e.on),f=e.max?Math.max(0,e.hp/e.max):0;
  (TEMA.escudo?TEMA.escudo.bind(TEMA):escudoPadrao)(CX,CY,R,f,t,nv,e.rip,Math.min(1,e.on));
}

/* ---------------- agentes ---------------- */
function blinkDe(a,t){const ph=(t+a.seed*7)%4.2;return ph>4.05?Math.max(0,1-Math.abs((ph-4.125)/.075)):0;}
function desenhaAgente(a,p,t){
  const T=TEMA,o=CONFIG.orbitas[a.orbita],sg=Math.sign(o.vel)||1;
  const nasc=a.nasc>0?Math.max(.001,easeBack(1-a.nasc)):1;
  const densidade=Math.max(0,ativos().length-6);
  const escalaGrupo=Math.max(.56,1-densidade*.024);
  const r=S*CONFIG.tamanhoAgente*escalaGrupo*(T.escalaAgente||1)*p.f*nasc*(T.id==='criaturas'&&a.forma==='buraconegro'?.82:1);
  const al=.62+.38*clamp((p.prof+1)/2,0,1),pulo=a.bounce>0?-Math.sin((1-a.bounce)*PI)*r*.9:0;
  const cs=a.carga>0?1-a.carga/.35:0,rec=Math.min(1,Math.hypot(a.recuoX,a.recuoY)/(r*.6+1));
  const cx=p.x+a.recuoX,cy=p.y+a.recuoY,dx=CX-cx,dy=CY-cy,d=Math.hypot(dx,dy)||1,luzD={x:dx/d,y:dy/d};
  let look=luzD;if(a.olhar)look=a.olhar;
  if(a.carga>0&&a.pend){const A=alvoDe(a.pend.para);if(A){const ex=A.x-cx,ey=A.y-cy,ed=Math.hypot(ex,ey)||1;look={x:ex/ed,y:ey/ed};}}
  const orbital=T.id==='cosmos',q=orbital?posOrbita(o,a.ang+sg*.03):{x:p.x+1,y:p.y};
  const qd=Math.hypot(q.x-p.x,q.y-p.y)||1,dir={x:(q.x-p.x)/qd,y:(q.y-p.y)/qd};
  const pts=[];if(orbital)for(let i=1;i<=12;i++)pts.push(posOrbita(o,a.ang-sg*i*.075));
  if(orbital&&T.rastro)T.rastro(a,pts,r,al);
  else if(orbital){const lw=T.rastroLargura==null?.32:T.rastroLargura;if(lw>0){let ant=p;pts.forEach((q2,i)=>{ctx.beginPath();ctx.moveTo(ant.x,ant.y);ctx.lineTo(q2.x,q2.y);ctx.lineWidth=Math.max(.5,r*lw*(1-(i+1)/27));ctx.lineCap='round';ctx.strokeStyle=hexA(a.corT,al*(1-(i+1)/27)*.5);ctx.stroke();ant=q2;});}}
  if(T.halo){const g=ctx.createRadialGradient(cx,cy,r*.2,cx,cy,r*2.4);g.addColorStop(0,hexA(a.corT,.27));g.addColorStop(1,hexA(a.corT,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*2.4,0,TAU);ctx.fill();}
  if(T.sombra){ctx.beginPath();ctx.ellipse(p.x,p.y+r*1.35,r*.8,r*.16,0,0,TAU);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fill();}
  if(a.glow>0){ctx.beginPath();ctx.arc(cx,cy,r*(1.4+(1-a.glow)*1.4),0,TAU);ctx.lineWidth=2.5;ctx.strokeStyle=hexA(a.corT,a.glow*.85);ctx.stroke();}
  if(cs>0)for(let i=0;i<10;i++){const ang=i/10*TAU+t*5,dd=r*(2.7-cs*1.7);ctx.beginPath();ctx.arc(cx+Math.cos(ang)*dd,cy+Math.sin(ang)*dd,2.4*cs+.6,0,TAU);ctx.fillStyle=hexA(a.corT,.3+.7*cs);ctx.fill();}
  if(OV)OV.drawAura(a,{cx,cy,r},t);
  ctx.save();ctx.translate(cx,cy+pulo+Math.sin(t*2+a.seed*6)*r*.04);ctx.scale(r*(1+.14*cs-.1*rec),r*(1-.12*cs+.12*rec));ctx.globalAlpha=al;
  T.agente(a,t,1/r,{look,luz:luzD,dir,blink:blinkDe(a,t),feliz:a.happy>0||cs>.6,carga:cs,prof:p.prof});
  ctx.restore();ctx.globalAlpha=1;
  a.p={x:cx,y:cy,r};
  if(OV)OV.drawDetails(a,a.p,t);
}
function placa(a){
  if(TEMA.id==='cosmos'||ativos().length>8)return;
  const p=a.p;if(!p||a.nasc>.4)return;const P=TEMA.pal,compacto=p.r<22||W<600,y=p.y+p.r*1.75;
  ctx.textAlign='left';ctx.textBaseline='middle';
  const f1=fonte('700 ',compacto?9.5:11.5,P.corpo),f2=fonte('',compacto?8.5:10,P.mono);
  ctx.font=f1;const w1=ctx.measureText(a.nome).width;ctx.font=f2;const w2=compacto?0:ctx.measureText(a.status).width;
  const pad=7,w=w1+(compacto?0:w2+9)+pad*2+10,h=compacto?17:21;
  ctx.fillStyle=P.placaBg;ctx.strokeStyle=hexA(a.corT,.8);ctx.lineWidth=1.2;ctx.beginPath();ctx.roundRect(p.x-w/2,y-h/2,w,h,P.placaRaio);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.arc(p.x-w/2+pad+2,y,2.5,0,TAU);ctx.fillStyle=a.corT;ctx.fill();
  ctx.font=f1;ctx.fillStyle=P.texto;ctx.fillText(a.nome,p.x-w/2+pad+9,y+.5);
  if(!compacto){ctx.font=f2;ctx.fillStyle=P.suave;ctx.fillText(a.status,p.x-w/2+pad+9+w1+8,y+.5);}
}
function desenhaBalao(a){if(TEMA.id==='cosmos')return;
  const b=a.balao;if(!b||!a.p)return;const P=TEMA.pal,el=b.dur-b.t,pop=el<.25?easeBack(el/.25):1,fade=b.t<.3?b.t/.3:1;
  ctx.font=fonte('600 ',11,P.corpo);const w=ctx.measureText(b.txt).width+16,h=22,p=a.p;
  const x=clamp(p.x-w/2,6,W-w-6),y=Math.max(6,p.y-p.r*2.05-h);
  ctx.save();ctx.globalAlpha=fade;ctx.translate(p.x,y+h+6);ctx.scale(pop,pop);ctx.translate(-p.x,-(y+h+6));
  ctx.fillStyle=P.balaoBg;ctx.beginPath();ctx.roundRect(x,y,w,h,Math.min(8,P.placaRaio+4));ctx.fill();
  ctx.beginPath();ctx.moveTo(p.x-5,y+h-.5);ctx.lineTo(p.x,y+h+6);ctx.lineTo(p.x+5,y+h-.5);ctx.fill();
  ctx.fillStyle=P.balaoFg;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(b.txt,x+8,y+h/2+.5);ctx.restore();
}

/* ---------------- núcleo ---------------- */
function blinkN(t){const ph=(t+1.3)%4.6;return ph>4.45?1-Math.abs((ph-4.525)/.075):0;}
function desenhaNucleo(t,dt){
  const T=TEMA,P=T.pal,nv=nuc.nivel,formaVisual=Math.min(5,nv),cor=P.nucleo[formaVisual-1]||P.destaque;
  const alvo=S*(.05+.0095*(formaVisual-1))*(T.escalaNucleo||1)*cam.zoom;
  nuc.r=nuc.r?lerp(nuc.r,alvo,Math.min(1,dt*3+.001)):alvo;
  const pop=1+.25*Math.sin(Math.max(0,nuc.evo)*PI)+nuc.happy*.05,r=nuc.r*pop,cx=CX,cy=CY+Math.sin(t*1.8)*nuc.r*.05;
  const est={look:{x:nuc.lookX,y:nuc.lookY},blink:blinkN(t),feliz:nuc.happy>0,prog:progresso(),medo:nuc.medo,dano:nuc.dano,flash:nuc.flash,happy:nuc.happy};
  if(T.auraNucleo)T.auraNucleo(cx,cy,r,formaVisual,t,est);
  const corpo=(n,esc,al)=>{if(al<=.01||esc<=.02)return;ctx.save();ctx.translate(cx,cy);ctx.scale(r*esc,r*esc);ctx.globalAlpha=al;T.nucleo(Math.min(5,n),t,1/(r*esc),est);ctx.restore();};
  if(nuc.morph>0&&nuc.nivelAnt!==nv){const k=1-nuc.morph;corpo(nuc.nivelAnt,1+k*.6,nuc.morph*nuc.morph);corpo(nv,Math.max(.05,easeBack(clamp(k*1.25,0,1))),clamp(k*1.8,0,1));}
  else corpo(nv,1,1);
  if(OV)OV.drawAscension(cx,cy,r,nv,t);
  ctx.globalAlpha=1;
  if(nuc.evo>0){const k=1-nuc.evo;ctx.beginPath();ctx.arc(cx,cy,r*(1+k*4.5),0,TAU);ctx.lineWidth=4*(1-k)+1;ctx.strokeStyle=hexA(P.destaque,1-k);ctx.stroke();}
  if(T.id==='cosmos')return;
  /* placa + barra de XP */
  const ty=CY+Math.max(r*2.25,S*.1),txt=CONFIG.nucleo.titulo;
  ctx.font=fonte(P.tituloPeso,Math.max(13,S*.022),P.titulo);
  const pw=ctx.measureText(txt).width+S*.07,ph=Math.max(24,S*.04);
  ctx.fillStyle=P.placaBg;ctx.strokeStyle=hexA(cor,.95);ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(cx-pw/2,ty-ph/2,pw,ph,P.placaRaio>6?ph/2:P.placaRaio);ctx.fill();ctx.stroke();
  ctx.fillStyle=P.texto;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(txt,cx-pw/2+S*.022,ty+1);
  ctx.beginPath();ctx.arc(cx+pw/2-S*.022,ty,Math.max(3,S*.005),0,TAU);ctx.fillStyle=hexA(P.ok,.55+.45*Math.sin(t*3.4));ctx.fill();
  const by=ty+ph/2+S*.016,bw=Math.max(pw,S*.34),bh=Math.max(5,S*.008);
  ctx.font=fonte('600 ',Math.max(9,S*.0145),P.mono);ctx.fillStyle=cor;ctx.textAlign='left';ctx.fillText('NV '+nv+' · '+nomeNivel(nv).toUpperCase(),cx-bw/2,by+bh+S*.014);
  ctx.fillStyle=P.suave;ctx.textAlign='right';ctx.fillText(nv>=NIV.length?'NÍVEL MÁXIMO':Math.floor(nuc.xp)+' / '+NIV[nv].xp+' XP',cx+bw/2,by+bh+S*.014);
  ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.roundRect(cx-bw/2,by,bw,bh,bh/2);ctx.fill();
  ctx.fillStyle=cor;ctx.beginPath();ctx.roundRect(cx-bw/2,by,Math.max(bh,bw*progresso()),bh,bh/2);ctx.fill();
}

/* ---------------- HUD ---------------- */
function desenhaHud(t){
  const P=TEMA.pal,m=Math.max(14,S*.03),fs=Math.max(9,S*.0155),top=W<720?94:m;
  ctx.font=fonte('500 ',fs,P.mono);ctx.textBaseline='top';ctx.textAlign='left';
  ctx.fillStyle=P.destaque;ctx.fillText(CONFIG.marca,m,top);ctx.fillStyle=P.suave;
  ctx.fillText('AGENTES ATIVOS · '+ativos().length,m,top+fs*1.5);ctx.fillText('SINAIS PROCESSADOS · '+nuc.sinais,m,top+fs*3);ctx.fillText('DEFESAS · '+nuc.defesas,m,top+fs*4.5);
  const amea=ameaca.fase>0,seguro=nuc.paz>0&&!amea;ctx.fillStyle=amea?P.alerta:(seguro?P.ok:P.suave);
  ctx.fillText('STATUS · '+(amea?'AMEAÇA: '+ameaca.nome:(seguro?'ZONA SEGURA':'VIGIANDO')),m,top+fs*6);
  ctx.textAlign='right';ctx.fillStyle=P.suave;ctx.fillText(new Date().toISOString().slice(11,19)+' UTC',W-m,top);
  ctx.fillStyle=hexA(P.ok,.6+.4*Math.sin(t*3));ctx.fillText('● SIMULAÇÃO',W-m,top+fs*1.5);
  ctx.fillStyle=P.suave;ctx.fillText('TEMA · '+TEMA.nome.toUpperCase(),W-m,top+fs*3);
  ctx.strokeStyle=hexA(P.destaque,.5);ctx.lineWidth=1.2;const c=14,e=6;
  [[e,e,1,1],[W-e,e,-1,1],[e,H-e,1,-1],[W-e,H-e,-1,-1]].forEach(([x,y,sx,sy])=>{ctx.beginPath();ctx.moveTo(x,y+sy*c);ctx.lineTo(x,y);ctx.lineTo(x+sx*c,y);ctx.stroke();});
}
function desenhaCombo(){
  const ag=performance.now()/1000-nuc.comboT;if(nuc.combo<2||ag>2.6)return;
  const P=TEMA.pal,pop=1+nuc.comboPop*.35;ctx.save();ctx.translate(CX,H*.15);ctx.scale(pop,pop);
  ctx.font=fonte(P.tituloPeso,Math.max(16,S*.032),P.titulo);ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=P.destaque;ctx.shadowColor=P.destaque;ctx.shadowBlur=16;ctx.fillText('COMBO ×'+nuc.combo,0,0);ctx.shadowBlur=0;
  const bw=S*.2;ctx.fillStyle=hexA(P.destaque,.25);ctx.fillRect(-bw/2,S*.03,bw,3);ctx.fillStyle=P.destaque;ctx.fillRect(-bw/2,S*.03,bw*(1-ag/2.6),3);ctx.restore();
}

/* ---------------- eventos aleatórios ---------------- */
function evento(){
  const l=ativos().filter(a=>a.p&&a.carga<=0);if(!l.length)return;
  const E=CONFIG.eventos,pick=arr=>arr[Math.floor(Math.random()*arr.length)];
  let r=Math.random()*(E.sinal+E.passe+E.ordem+E.mercado+E.onda);
  if((r-=E.sinal)<0)return void dispararDe(pick(l),'sinal','nucleo');
  if((r-=E.passe)<0){const fl=CONFIG.fluxos.map(([x,y])=>[AG.find(a=>a.nome===x),AG.find(a=>a.nome===y)]).filter(([x,y])=>x&&y&&x.ativo&&y.ativo&&x.p&&y.p&&x.carga<=0);
    if(fl.length){const [x,y]=pick(fl);return void dispararDe(x,'passe',y);}return void dispararDe(pick(l),'sinal','nucleo');}
  if((r-=E.ordem)<0)return nucleoOrdem(pick(l));
  if((r-=E.mercado)<0){const pref=l.filter(a=>a.nome==='TAKER'||a.nome==='CLOSER');return void dispararDe(pick(pref.length?pref:l),'mercado',null);}
  ondas.push({t:0,cor:TEMA.pal.onda});
}

/* ---------------- quadro ---------------- */
function quadro(t,dt,dtR){
  if(OV)OV.tick(dt,dtR,t);
  const T=TEMA,P=T.pal,Cm=CONFIG.camera;
  par.x+=(par.tx-par.x)*Math.min(1,dtR*3);par.y+=(par.ty-par.y)*Math.min(1,dtR*3);
  cam.voo=Math.max(0,cam.voo-dtR/1.1);cam.pulso*=Math.exp(-dtR*3);
  cam.yaw=(Cm.deriva?.22*Math.sin(t*.045):0)+(Cm.parallax?par.x*.5:0)+easeInOut(cam.voo)*.7;
  cam.pitch=clamp(Cm.inclinacao*PI/180+(Cm.deriva?.035*Math.sin(t*.06):0)+(Cm.parallax?par.y*.2:0)+easeInOut(cam.voo)*.25,.2,.95);
  const excesso=Math.max(0,ativos().length-6);
  const zoomDesejado=1/(1+excesso*.10);
  cam.encaixe=cam.encaixe==null?zoomDesejado:lerp(cam.encaixe,zoomDesejado,Math.min(1,dtR*2.5));
  cam.zoom=(1+.25*easeInOut(cam.voo)+cam.pulso)*cam.encaixe;
  ctx.clearRect(0,0,W,H);ctx.save();
  // Impactos afetam efeitos locais, nunca deslocam a câmera inteira.
  nuc.shake=Math.max(0,nuc.shake-dtR);
  ctx.drawImage(fundoImg,-W*.05-par.x*S*.03,-H*.05-par.y*S*.03,W*1.1,H*1.1);
  if(T.fundo)T.fundo(t,dt);
  if(OV)OV.drawBackground(t,dt);
  desenhaAmbiente(t);
  if(T.chao&&T.id==='cosmos')T.chao(t,dt);
  for(let i=ondas.length-1;i>=0;i--){const w=ondas[i];w.t+=dt/1.8;if(w.t>=1){ondas.splice(i,1);continue;}if(w.t<0)continue;
    caminhoAnel(w.t*1.15,0,90);ctx.lineWidth=1+3*(1-w.t);ctx.strokeStyle=hexA(w.cor||P.onda,(1-w.t)*.6);ctx.stroke();}
  if(T.id==='cosmos')CONFIG.orbitas.forEach(o=>{const pts=[];for(let i=0;i<=64;i++)pts.push(posOrbita(o,i/64*TAU));
    if(T.orbita)T.orbita(pts,o,t);else{ctx.setLineDash([2,8]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],fr=clamp((a.prof+1)/2,0,1);ctx.strokeStyle=hexA(P.texto,.05+fr*.14);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.setLineDash([]);}});
  /* simulação */
  if(!reduz)darXP(CONFIG.xp.passivo*dt);
  const AT=CONFIG.ataques;
  if(AT.ativo&&!reduz){nuc.paz=Math.max(0,nuc.paz-dt);
    if(nuc.combo>=3&&performance.now()/1000-nuc.comboT<2.6)nuc.paz=Math.max(nuc.paz,AT.paz*.6);
    if(ameaca.fase===0){ameaca.prox-=dt;if(ameaca.prox<=0){if(nuc.paz<=0)iniciaAmeaca();else ameaca.prox=1.5;}}
    else if(ameaca.fase===2&&ameaca.spawn>=ameaca.n&&!proj.some(s=>s.tipo==='ataque'))finalizaAmeaca();}
  nuc.medo=Math.max(0,nuc.medo-dt);nuc.dano=Math.max(0,nuc.dano-dt*1.4);nuc.morph=Math.max(0,nuc.morph-dt/1.2);
  nuc.happy=Math.max(0,nuc.happy-dt);nuc.evo=Math.max(0,nuc.evo-dt*.7);nuc.aviso=Math.max(0,nuc.aviso-dtR);
  nuc.flash=Math.max(0,nuc.flash-dt*2.2);nuc.comboPop=Math.max(0,nuc.comboPop-dt*3);
  nuc.lookX+=(nuc.alvoX-nuc.lookX)*Math.min(1,dt*4);nuc.lookY+=(nuc.alvoY-nuc.lookY)*Math.min(1,dt*4);
  for(let i=agenda.length-1;i>=0;i--){agenda[i].t-=dt;if(agenda[i].t<=0){const f=agenda[i].fn;agenda.splice(i,1);f();}}
  const agentesAtivos=ativos();
  const lista=agentesAtivos.map((a,indice)=>{
    const velOrbital=CONFIG.orbitas[a.orbita].vel;
    a.ang+=(TEMA.id==='cosmos'?Math.abs(velOrbital):velOrbital)*TAU*dt;
    a.bounce=Math.max(0,a.bounce-dt*1.6);a.happy=Math.max(0,a.happy-dt);a.nasc=Math.max(0,a.nasc-dt*1.8);a.glow=Math.max(0,a.glow-dt*1.4);
    const kk=Math.exp(-9*dt);a.recuoX*=kk;a.recuoY*=kk;
    if(a.balao){a.balao.t-=dt;if(a.balao.t<=0)a.balao=null;}
    a.olharT-=dt;if(a.olhar){a.olhar.t-=dt;if(a.olhar.t<=0)a.olhar=null;}
    if(a.olharT<=0){const ang=Math.random()*TAU;a.olhar={x:Math.cos(ang),y:Math.sin(ang),t:.9};a.olharT=3+Math.random()*4;}
    if(a.carga>0){a.carga-=dt;if(a.carga<=0)liberar(a);}
    const p=TEMA.id==='cosmos'?posOrbita(CONFIG.orbitas[a.orbita],a.ang):posCenario(a,t,indice,agentesAtivos.length);if(OV&&TEMA.id==='cosmos')OV.move(a,p,t,dt);return{a,p};
  });
  if(OV&&TEMA.id==='cosmos')OV.separate(lista,t,dt);
  // A órbita é o alvo; a posição desenhada mantém continuidade mesmo ao
  // trocar de modo ou quando a resolução de colisões muda repentinamente.
  for(const {a,p} of lista){
    const anterior=a.posVisual;
    if(!anterior||!Number.isFinite(anterior.x)||!Number.isFinite(anterior.y)){
      a.posVisual={x:p.x,y:p.y};
    }else{
      const suavizar=1-Math.exp(-Math.min(.05,Math.max(0,dtR))*9);
      anterior.x+=(p.x-anterior.x)*suavizar;
      anterior.y+=(p.y-anterior.y)*suavizar;
      p.x=anterior.x;p.y=anterior.y;
    }
  }
  lista.sort((x,y)=>x.p.prof-y.p.prof);
  ondas.forEach(w=>{if(w.t<0)return;lista.forEach(({a})=>{if(Math.abs(CONFIG.orbitas[a.orbita].r-w.t*1.15)<.04)a.glow=Math.max(a.glow,.9);});});
  if(T.id==='cosmos'&&T.ligacoes!==false)lista.forEach(({a,p})=>{const g=ctx.createLinearGradient(p.x,p.y,CX,CY);g.addColorStop(0,hexA(a.corT,.25));g.addColorStop(1,hexA(a.corT,.02));
    ctx.strokeStyle=g;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(CX,CY);ctx.stroke();});
  lista.filter(i=>i.p.z>0).forEach(i=>desenhaAgente(i.a,i.p,t));
  desenhaNucleo(t,dt);desenhaEscudo(t,dt);
  lista.filter(i=>i.p.z<=0).forEach(i=>desenhaAgente(i.a,i.p,t));
  lista.forEach(i=>placa(i.a));
  atualizaProj(dt);desenhaProj(t);
  lista.forEach(i=>desenhaBalao(i.a));
  if(OV)OV.drawScene(t,dt);
  for(let i=aneis.length-1;i>=0;i--){const a=aneis[i];a.t+=dt/.55;if(a.t>=1){aneis.splice(i,1);continue;}
    ctx.beginPath();ctx.arc(a.x,a.y,S*.01+a.t*S*.07,0,TAU);ctx.lineWidth=2.2*(1-a.t)+.4;ctx.strokeStyle=hexA(a.cor,1-a.t);ctx.stroke();}
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.l-=dt/f.m;if(f.l<=0){fx.splice(i,1);continue;}
    f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.98;f.vy*=.98;ctx.globalAlpha=f.l;ctx.fillStyle=f.cor;ctx.beginPath();ctx.arc(f.x,f.y,f.s*f.l,0,TAU);ctx.fill();}
  ctx.restore();
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(let i=fxTxt.length-1;i>=0;i--){const f=fxTxt[i];f.t+=dt;if(f.t>1.3){fxTxt.splice(i,1);continue;}
    ctx.font=fonte('700 ',Math.max(11,S*(f.bruto?.026:.02)),P.mono);ctx.globalAlpha=Math.min(1,(1.3-f.t)/.5);ctx.fillStyle=f.cor;ctx.fillText(f.bruto?f.txt:f.txt+' XP',f.x,f.y-f.t*S*.07);}
  ctx.globalAlpha=1;
  if(ameaca.fase>0){const pu=.5+.5*Math.sin(t*8),gv=ctx.createRadialGradient(W/2,H/2,S*.35,W/2,H/2,Math.max(W,H)*.7);
    gv.addColorStop(0,'rgba(255,40,70,0)');gv.addColorStop(1,'rgba(255,40,70,'+(.1+.12*pu)+')');ctx.fillStyle=gv;ctx.fillRect(0,0,W,H);
    ctx.font=fonte(P.tituloPeso,Math.max(13,S*.026),P.titulo);ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=hexA(P.alerta,.7+.3*pu);ctx.shadowColor=P.alerta;ctx.shadowBlur=14;ctx.fillText('AMEAÇA DETECTADA · '+ameaca.nome,CX,H*.21);ctx.shadowBlur=0;}
  if(nuc.aviso>0){const a=Math.min(1,nuc.aviso),sc=1+(nuc.aviso>2.7?(nuc.aviso-2.7)*1.2:0);ctx.save();ctx.translate(CX,H*.27);ctx.scale(sc,sc);ctx.globalAlpha=a;
    ctx.font=fonte(P.tituloPeso,Math.max(18,S*.04),P.titulo);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=P.destaque;ctx.shadowColor=P.destaque;ctx.shadowBlur=20;ctx.fillText(nuc.avisoTxt,0,0);ctx.restore();}
  if(T.frente)T.frente(t,dtR);
  desenhaHud(t);desenhaCombo();
  ctx.restore();
  if(flashTela>0){flashTela=Math.max(0,flashTela-dtR*2.2);ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,255,255,'+(flashTela*.3)+')';ctx.fillRect(0,0,W,H);ctx.restore();}
  if(transicao){transicao.t+=dtR/.75;const k=easeOut(Math.min(1,transicao.t));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1-k;const s=1+k*.12,w=cv.width,h=cv.height;ctx.drawImage(transicao.img,w/2-w*s/2,h/2-h*s/2,w*s,h*s);ctx.restore();
    if(transicao.t>=1)transicao=null;}
}
let ultimo=performance.now(),proxEv=.8;
function loop(now){
  const dtR=Math.min((now-ultimo)/1000,.05);ultimo=now;
  tempoEscala+=(1-tempoEscala)*Math.min(1,dtR*2.5);
  const dt=reduz?0:dtR*tempoEscala;tSim+=dt;
  if(!reduz){proxEv-=dt;if(proxEv<=0){evento();if(Math.random()<.3)agenda.push({t:.25,fn:evento});proxEv=CONFIG.intervaloPulso/1000*(.5+Math.random()*.7);}}
  quadro(reduz?1.2:tSim,dt,reduz?0:dtR);
  requestAnimationFrame(loop);
}

/* ---------------- temas (abas) ---------------- */
const tabsEl=document.getElementById('ao-tabs'),chipsEl=document.getElementById('ao-chips');
function setTema(id,inst){
  const T=TEMAS[id];if(!T||T===TEMA)return;
  if(TEMA&&!inst&&W>2){const c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;c.getContext('2d').drawImage(cv,0,0);transicao={img:c,t:0};cam.voo=1;}
  TEMA=T;if(OV)OV.theme(T);AG.forEach(a=>{a.posVisual=null;a.corT=(T.cores&&T.cores[a.i%T.cores.length])||a.cor;});
  const s=root.style,c=T.css;s.setProperty('--t-bg',c.bg);s.setProperty('--t-fg',c.fg);s.setProperty('--t-suave',c.suave);s.setProperty('--t-ac',c.ac);
  s.setProperty('--t-font',c.fonte);s.setProperty('--t-raio',c.raio);s.setProperty('--t-chip',c.chip);
  document.body.style.background=c.bg;
  if(W>2)fundoImg=criaFundo();
  if(listaEl){const g=grupoDe(id);if(g!==grupoAtual)selecionaGrupo(g.id,false);listaEl.querySelectorAll('.ao-tab').forEach(b=>{const on=b.dataset.t===id;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});}
  chipsEl.querySelectorAll('.ao-chip').forEach(b=>{const a=AG.find(x=>x.nome===b.dataset.n);b.style.setProperty('--c',a.corT);});
  if(CONFIG.lembrarTema){try{localStorage.setItem('ao-tema-v7',id);}catch(e){}}
}
const GRUPOS=(CONFIG.grupos||[{id:'todos',nome:'Temas',temas:CONFIG.temas||Object.keys(TEMAS)}]).map(g=>({...g,temas:g.temas.filter(id=>TEMAS[id])})).filter(g=>g.temas.length);
const TODOS=GRUPOS.flatMap(g=>g.temas);
let grupoAtual=null,listaEl=null;
function grupoDe(id){return GRUPOS.find(g=>g.temas.includes(id))||GRUPOS[0];}
function montaLista(g){
  listaEl.innerHTML='';
  g.temas.forEach(id=>{const T=TEMAS[id],b=document.createElement('button');b.className='ao-tab';b.type='button';b.setAttribute('role','tab');b.dataset.t=id;
    b.style.setProperty('--c',T.cor);b.innerHTML='<i></i>'+T.nome;b.addEventListener('click',()=>setTema(id));
    const on=TEMA&&TEMA.id===id;b.setAttribute('aria-selected',String(!!on));b.tabIndex=on?0:-1;listaEl.appendChild(b);});
}
function selecionaGrupo(id,trocar){
  const g=GRUPOS.find(x=>x.id===id);if(!g)return;grupoAtual=g;
  tabsEl.querySelectorAll('.ao-grupo').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.g===id)));
  montaLista(g);if(trocar&&(!TEMA||!g.temas.includes(TEMA.id)))setTema(g.temas[0]);
}
function montaAbas(){
  if(!CONFIG.mostrarAbas){tabsEl.hidden=true;return;}
  if(GRUPOS.length>1){const gb=document.createElement('div');gb.className='ao-grupos';gb.setAttribute('role','group');gb.setAttribute('aria-label','Grupo de temas');
    GRUPOS.forEach(g=>{const b=document.createElement('button');b.className='ao-grupo';b.type='button';b.dataset.g=g.id;b.textContent=g.nome;b.addEventListener('click',()=>selecionaGrupo(g.id,true));gb.appendChild(b);});
    tabsEl.appendChild(gb);const sp=document.createElement('span');sp.className='ao-sep';tabsEl.appendChild(sp);}
  listaEl=document.createElement('div');listaEl.className='ao-lista';listaEl.setAttribute('role','tablist');listaEl.setAttribute('aria-label','Tema');tabsEl.appendChild(listaEl);
  listaEl.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;const ids=grupoAtual.temas,i=ids.indexOf(TEMA.id),n=ids[(i+(e.key==='ArrowRight'?1:-1)+ids.length)%ids.length];
    setTema(n);const b=listaEl.querySelector('[data-t="'+n+'"]');if(b)b.focus();e.preventDefault();});
}

/* ---------------- agentes da reserva ---------------- */
function ativar(nome){
  const a=AG.find(x=>x.nome===nome);if(!a||a.ativo)return;
  if(a.orbita==null||a.fase==null){
    let melhor=0,menor=1e9;CONFIG.orbitas.forEach((o,i)=>{const n=ativos().filter(x=>x.orbita===i).length/o.r;if(n<menor){menor=n;melhor=i;}});a.orbita=melhor;
    const angs=ativos().filter(x=>x.orbita===melhor).map(x=>((x.ang%TAU)+TAU)%TAU).sort((p,q)=>p-q);
    if(!angs.length)a.ang=Math.random()*TAU;else{let gap=-1,pos=0;angs.forEach((v,i)=>{const nx=i+1<angs.length?angs[i+1]:angs[0]+TAU,gg=nx-v;if(gg>gap){gap=gg;pos=v+gg/2;}});a.ang=pos;}
  }else a.ang=a.fase*TAU;
  a.ativo=true;a.nasc=1;a.happy=1;const p=posOrbita(CONFIG.orbitas[a.orbita],a.ang);explosao(p.x,p.y,a.corT,24,S*.25);atualizaChips();
}
function desativar(nome){const a=AG.find(x=>x.nome===nome);if(!a||!a.ativo||ativos().length<=1)return;if(a.p)explosao(a.p.x,a.p.y,a.corT,24,S*.25);a.ativo=false;a.p=null;atualizaChips();}
function atualizaChips(){chipsEl.querySelectorAll('.ao-chip').forEach(b=>b.setAttribute('aria-pressed',String(!!AG.find(x=>x.nome===b.dataset.n).ativo)));}
function montaChips(){
  if(!CONFIG.mostrarReserva){chipsEl.hidden=true;return;}
  AG.forEach(a=>{const b=document.createElement('button');b.className='ao-chip';b.type='button';b.dataset.n=a.nome;b.title=a.papel+' — '+a.status;
    b.style.setProperty('--c',a.corT);b.innerHTML='<i></i>'+a.nome;b.addEventListener('click',()=>a.ativo?desativar(a.nome):ativar(a.nome));chipsEl.appendChild(b);});
  atualizaChips();
}

/* ---------------- interação e início ---------------- */
function achar(ev){const b=cv.getBoundingClientRect(),x=ev.clientX-b.left,y=ev.clientY-b.top;return ativos().find(a=>a.p&&Math.hypot(a.p.x-x,a.p.y-y)<a.p.r*1.4);}
cv.addEventListener('pointerdown',ev=>{const a=achar(ev);if(a){a.bounce=1;a.happy=1;dispararDe(a,'sinal','nucleo');}});
cv.addEventListener('pointermove',ev=>{cv.style.cursor=achar(ev)?'pointer':'default';const b=cv.getBoundingClientRect();par.tx=(ev.clientX-b.left)/b.width-.5;par.ty=(ev.clientY-b.top)/b.height-.5;});
cv.addEventListener('pointerleave',()=>{par.tx=0;par.ty=0;});
addEventListener('resize',resize);

montaAbas();montaChips();
let inicial=CONFIG.tema;
try{const h=(location.hash||'').slice(1);if(TEMAS[h])inicial=h;else if(CONFIG.lembrarTema){const sv=localStorage.getItem('ao-tema-v7');if(sv&&TODOS.includes(sv))inicial=sv;}}catch(e){}
if(!TEMAS[inicial])inicial=TODOS[0]||Object.keys(TEMAS)[0];
setTema(inicial,true);resize();requestAnimationFrame(loop);

window.AgentesOrbitais={
  tema:id=>setTema(id),temas:()=>Object.keys(TEMAS),grupo:id=>selecionaGrupo(id,true),
  setStatus(n,s){const a=AG.find(x=>x.nome===n);if(a)a.status=s;},
  pulso(n){dispararDe(AG.find(x=>x.nome===n),'sinal','nucleo');},
  passe(de,para){dispararDe(AG.find(x=>x.nome===de),'passe',AG.find(x=>x.nome===para));},
  ordem(n){nucleoOrdem(AG.find(x=>x.nome===n));},
  mercado(n){dispararDe(AG.find(x=>x.nome===n),'mercado',null);},
  ataque(n){if(ameaca.fase===0)iniciaAmeaca(n);},
  darXP(v){darXP(v);},setNivel,ativar,desativar,
  estado(){return{tema:TEMA.id,nivel:nuc.nivel,xp:Math.floor(nuc.xp),sinais:nuc.sinais,defesas:nuc.defesas};},
  config:CONFIG,TEMAS,
  combate:()=>OV?OV.state():null,
  modoOrbita:(m)=>OV?OV.setMode(m):null,
  desafiar:()=>OV?OV.challenge():null
};
if(OV)OV.setup({CONFIG,AG,nuc,ameaca,ctx,root,cv,proj,fxTxt,aneis,ativos,lancar,dispararDe,explosao,darXP,ativar,desativar,atualizaChips,hexA,getTheme:()=>TEMA,getSize:()=>({W,H,S,CX,CY}),agentesAPI:window.AgentesOrbitais});

})();
