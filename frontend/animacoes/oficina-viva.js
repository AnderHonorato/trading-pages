/* Oficina dos Inventos: linha de montagem 2D interativa, independente das orbitas. */
(()=>{
'use strict';
const maquinas=Array.from({length:5},(_,i)=>({x:.14+i*.18,y:.76,angulo:i*.9,energia:0,pecas:0}));
const faíscas=[],pecas=[];let tempo=0,concluidas=0,modo='montagem',ultimo=0;
const cores=['#f7bd68','#80e6e3','#fa817c','#b6a2ff','#f5df91'];
function engrenagem(c,x,y,r,angulo,cor){
 c.save();c.translate(x,y);c.rotate(angulo);c.fillStyle=cor;c.strokeStyle='#192435';c.lineWidth=2;
 c.beginPath();for(let j=0;j<24;j++){const a=j*Math.PI/12,rr=j%3===0?r*1.17:r*.86;const xx=Math.cos(a)*rr,yy=Math.sin(a)*rr;j?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.closePath();c.fill();c.stroke();
 c.beginPath();c.arc(0,0,r*.35,0,Math.PI*2);c.fillStyle='#263448';c.fill();c.strokeStyle='#d8f8ff';c.stroke();c.restore();
}
function acionar(x,y,w,h){
 const mx=x/w,my=y/h;let alvo=maquinas.reduce((melhor,m)=>Math.hypot(m.x-mx,m.y-my)<Math.hypot(melhor.x-mx,melhor.y-my)?m:melhor,maquinas[0]);
 alvo.energia=1;alvo.pecas++;concluidas++;
 for(let i=0;i<16;i++){const a=i*Math.PI*2/16;faíscas.push({x:alvo.x*w,y:alvo.y*h,vx:Math.cos(a)*(50+i*4),vy:Math.sin(a)*(50+i*4),vida:.7,cor:cores[i%cores.length]});}
 pecas.push({x:alvo.x*w,y:alvo.y*h,t:0,cor:cores[concluidas%cores.length]});
 if(faíscas.length>180)faíscas.splice(0,faíscas.length-180);
 return {concluidas,maquina:maquinas.indexOf(alvo)+1};
}
function desenhar(c,w,h,t,dt){
 const passo=Math.max(0,Math.min(dt,.05));tempo+=passo;
 c.save();
 const piso=h*.86;
 // Janelas de fabrica, vigas, bancada e esteira: composicao propria, nao orbital.
 const grad=c.createLinearGradient(0,h*.12,0,piso);grad.addColorStop(0,'#182f43');grad.addColorStop(1,'#35414a');
 c.fillStyle=grad;c.fillRect(0,h*.24,w,h*.64);
 for(let i=0;i<8;i++){const x=(i+.5)*w/8;c.fillStyle='#172738';c.fillRect(x-w*.045,h*.29,w*.09,h*.21);c.fillStyle='#5e9d9d';c.globalAlpha=.2+.08*Math.sin(tempo+i);c.fillRect(x-w*.037,h*.3,w*.074,h*.19);c.globalAlpha=1;}
 c.fillStyle='#111c29';c.fillRect(0,piso,w,h-piso);
 c.fillStyle='#314657';c.fillRect(0,h*.82,w,h*.095);
 c.fillStyle='#718896';c.fillRect(0,h*.82,w,h*.018);
 c.strokeStyle='#9dc4ca';c.lineWidth=2;
 for(let i=0;i<15;i++){const x=((i/15+tempo*.075)%1)*w;c.beginPath();c.moveTo(x,h*.84);c.lineTo(x-w*.03,h*.9);c.stroke();}
 maquinas.forEach((m,i)=>{
  const x=m.x*w,y=m.y*h,r=Math.min(w,h)*.052;
  m.energia=Math.max(0,m.energia-passo*.75);m.angulo+=passo*(.35+m.energia*8)*(i%2?-1:1);
  c.fillStyle='#263748';c.fillRect(x-r*1.35,y-r*.35,r*2.7,r*1.4);
  c.fillStyle=m.energia?'#ffe6a0':'#7a97a2';c.fillRect(x-r*.9,y-r*.12,r*1.8,r*.25);
  engrenagem(c,x,y-r*.55,r,m.angulo,cores[i]);
  c.fillStyle='#d4e6ed';c.font='600 '+Math.max(9,r*.34)+'px sans-serif';c.textAlign='center';c.fillText('M'+(i+1),x,y+r*1.18);
  if(m.energia){c.strokeStyle=cores[i];c.globalAlpha=m.energia;c.lineWidth=3;c.beginPath();c.arc(x,y-r*.55,r*1.42,0,Math.PI*2);c.stroke();c.globalAlpha=1;}
 });
 for(let i=pecas.length-1;i>=0;i--){const p=pecas[i];p.t+=passo;const x=p.x+p.t*w*.12,y=p.y-p.t*h*.16;c.save();c.translate(x,y);c.rotate(p.t*4);c.fillStyle=p.cor;c.fillRect(-8,-8,16,16);c.strokeStyle='#fff';c.strokeRect(-8,-8,16,16);c.restore();if(p.t>1.2)pecas.splice(i,1);}
 for(let i=faíscas.length-1;i>=0;i--){const f=faíscas[i];f.vida-=passo;f.x+=f.vx*passo;f.y+=f.vy*passo;f.vy+=100*passo;if(f.vida<=0){faíscas.splice(i,1);continue;}c.globalAlpha=f.vida/.7;c.fillStyle=f.cor;c.fillRect(f.x,f.y,3,3);}c.globalAlpha=1;
 c.fillStyle='#e7f5f5';c.textAlign='left';c.font='700 '+Math.max(12,Math.min(w*.026,20))+'px sans-serif';c.fillText('OFICINA DOS INVENTOS',w*.055,h*.31);
 c.font='500 '+Math.max(10,Math.min(w*.018,14))+'px sans-serif';c.fillStyle='#a8cdd2';c.fillText('Toque na bancada para fabricar  •  Pecas: '+concluidas,w*.055,h*.35);
 c.restore();
}
window.OficinaViva={desenhar,acionar,estado:()=>({pecas:concluidas,maquinas:maquinas.map(m=>m.pecas)})};
})();
