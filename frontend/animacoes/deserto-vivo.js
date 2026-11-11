/* Deserto Vivo: caravana exploradora, oases e tempestade de areia. */
(function(){
'use strict';
const animais=Array.from({length:5},(_,i)=>({x:.08+i*.13,y:.63+(i%2)*.06,passo:i*.8,energia:1}));
const fontes=[{x:.75,y:.73,agua:1}],rastros=[];
let vento=.2,tempestade=0,exploracoes=0,tempo=0;
const limitar=(v,a,b)=>Math.max(a,Math.min(b,v));
function explorar(x,y,w,h){const nx=limitar(x/w,.08,.92),ny=limitar(y/h,.43,.88);fontes.push({x:nx,y:ny,agua:1});if(fontes.length>5)fontes.shift();exploracoes++;tempestade=Math.max(0,tempestade-.25);document.dispatchEvent(new Event('flow:deserto'));return true;}
function ventania(){tempestade=tempestade>.5?0:1;document.dispatchEvent(new Event('flow:deserto'));}
function caminho(ctx,pts,cor){ctx.beginPath();ctx.moveTo(0,pts[0]);for(let i=1;i<pts.length;i++)ctx.quadraticCurveTo((i-.5)*ctx.canvas.clientWidth,pts[i-1],i*ctx.canvas.clientWidth,pts[i]);ctx.strokeStyle=cor;ctx.stroke();}
function desenhar(ctx,w,h,t,dt){
  tempo+=Math.min(.05,Math.max(0,dt||0));tempestade=Math.max(0,tempestade-Math.max(0,dt||0)*.012);
  ctx.save();
  const horizonte=h*.56;
  const ceu=ctx.createLinearGradient(0,0,0,h);ceu.addColorStop(0,'#221a39');ceu.addColorStop(.53,'#e8a269');ceu.addColorStop(1,'#f5cf8a');ctx.fillStyle=ceu;ctx.fillRect(0,0,w,h);
  const solX=w*.77,solY=h*.26;const brilho=ctx.createRadialGradient(solX,solY,5,solX,solY,w*.24);brilho.addColorStop(0,'#ffe8a7c9');brilho.addColorStop(1,'#ffdf9a00');ctx.fillStyle=brilho;ctx.fillRect(0,0,w,h);
  ctx.beginPath();ctx.arc(solX,solY,Math.min(w,h)*.055,0,Math.PI*2);ctx.fillStyle='#ffe6a5';ctx.fill();
  for(let camada=0;camada<4;camada++){
    const base=h*(.53+camada*.105);ctx.beginPath();ctx.moveTo(0,h);
    for(let x=0;x<=w+12;x+=12){const onda=Math.sin(x/w*6.5+camada*1.9)*h*(.025+camada*.006)+Math.sin(x/w*13+camada)*h*.008;ctx.lineTo(x,base+onda);}
    ctx.lineTo(w,h);ctx.closePath();ctx.fillStyle=['#d49a70','#c8895c','#b77c50','#916246'][camada];ctx.fill();
  }
  // Ruinas fixas: arcos de pedra e pedras estratificadas.
  for(let i=0;i<3;i++){const x=w*(.16+i*.35),y=h*(.59+i*.025),s=Math.min(w,h)*(.06+i*.006);ctx.fillStyle='#785c58';ctx.fillRect(x-s*.5,y-s,s*.24,s);ctx.fillRect(x+s*.25,y-s,s*.24,s);ctx.beginPath();ctx.arc(x,y-s,s*.5,Math.PI,0);ctx.lineWidth=s*.19;ctx.strokeStyle='#9c7869';ctx.stroke();}
  fontes.forEach(f=>{
    const x=f.x*w,y=f.y*h;ctx.save();ctx.translate(x,y);ctx.scale(1,.36);
    ctx.beginPath();ctx.ellipse(0,0,w*.07,h*.09,0,0,Math.PI*2);ctx.fillStyle='#276f75';ctx.fill();ctx.beginPath();ctx.ellipse(0,-3,w*.052,h*.064,0,0,Math.PI*2);ctx.fillStyle='#65c9bc';ctx.fill();ctx.restore();
    for(const lado of [-1,1]){ctx.save();ctx.translate(x+lado*w*.055,y-h*.018);ctx.strokeStyle='#4b5d35';ctx.lineWidth=Math.max(2,w*.004);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-h*.075);ctx.stroke();for(let j=0;j<4;j++){ctx.beginPath();ctx.ellipse((j%2?1:-1)*w*.014,-h*(.07+j*.008),w*.018,h*.008,j*.4,0,Math.PI*2);ctx.fillStyle='#55774a';ctx.fill();}ctx.restore();}
  });
  // Animais caminham em linha, aproximando-se dos oases quando necessitam agua.
  animais.forEach((a,i)=>{
    const alvo=fontes[fontes.length-1],dx=alvo.x-a.x,dy=alvo.y-a.y;
    if(dt>0){const vel=.018*(1-tempestade*.55);if(Math.hypot(dx,dy)>.035){a.x+=Math.sign(dx)*Math.min(Math.abs(dx),vel*dt);a.y+=Math.sign(dy)*Math.min(Math.abs(dy),vel*.25*dt);}else a.energia=1;a.passo+=dt*3.4;}
    const x=a.x*w,y=a.y*h,esc=Math.max(.6,Math.min(w,h)/500),bal=Math.sin(a.passo)*2*esc;
    ctx.save();ctx.translate(x,y+bal);ctx.scale(esc,esc);
    ctx.fillStyle='#4b342f';ctx.beginPath();ctx.ellipse(0,0,22,10,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#8e5b40';ctx.beginPath();ctx.ellipse(0,-10,20,12,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(-12,-12);ctx.lineTo(-5,-29);ctx.lineTo(2,-13);ctx.lineTo(9,-27);ctx.lineTo(16,-10);ctx.fill();
    ctx.fillStyle='#ab7956';ctx.fillRect(12,-17,8,20);ctx.beginPath();ctx.ellipse(24,1,10,7,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#573b35';ctx.lineWidth=4;for(const k of [-13,-3,9,17]){ctx.beginPath();ctx.moveTo(k,5);ctx.lineTo(k+Math.sin(a.passo)*2,18);ctx.stroke();}
    ctx.fillStyle='#211e22';ctx.beginPath();ctx.arc(27,-1,1.7,0,Math.PI*2);ctx.fill();ctx.restore();
  });
  // Particulas deterministicas: sem jitter aleatorio por quadro.
  if(tempestade>.02){ctx.fillStyle='rgba(230,185,119,'+(tempestade*.18)+')';ctx.fillRect(0,0,w,h);}
  const qtd=Math.floor(18+tempestade*75);
  for(let i=0;i<qtd;i++){const x=((i*97.7+tempo*(22+tempestade*180))%(w+40))-20,y=((i*53.3+Math.sin(i)*67)%(h*.78))+h*.12;ctx.fillStyle='rgba(255,226,176,'+(.12+tempestade*.4)+')';ctx.fillRect(x,y,1.5+tempestade*2,1);}
  ctx.font='600 '+Math.max(12,Math.min(18,w*.028))+'px system-ui';ctx.fillStyle='#fff4d8';ctx.textAlign='left';ctx.fillText('DESERTO VIVO  /  CARAVANA',Math.max(15,w*.035),h*.12);
  ctx.font='500 '+Math.max(11,Math.min(14,w*.024))+'px system-ui';ctx.fillText('Toque na areia para descobrir um oasis',Math.max(15,w*.035),h*.12+22);
  ctx.restore();
}
window.DesertoVivo={desenhar,explorar,ventania,estado:()=>({oases:fontes.length,exploracoes,tempestade,animais:animais.length})};
})();
