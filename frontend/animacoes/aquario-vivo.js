/* Ecossistema do Aquario: animacao deterministica e interacao por alimento. */
(function(){
'use strict';
const peixes=Array.from({length:11},(_,i)=>({fase:i*2.399,altura:.25+(i%5)*.12,ritmo:.035+(i%4)*.012,tamanho:9+(i%3)*5,cor:['#ffcf80','#7ce3da','#f2a2cb','#9cceff'][i%4]}));
const alimentos=[];
function alimentar(x,y){alimentos.push({x,y,idade:0});if(alimentos.length>12)alimentos.shift();}
function desenhar(ctx,w,h,t,dt){
 if(!w||!h)return;
 ctx.save();
 const fundo=ctx.createLinearGradient(0,0,0,h);fundo.addColorStop(0,'rgba(2,48,85,.16)');fundo.addColorStop(1,'rgba(4,71,68,.38)');ctx.fillStyle=fundo;ctx.fillRect(0,0,w,h);
 for(let i=0;i<5;i++){const x=w*(i+.2)/5+Math.sin(t*.17+i)*w*.025;ctx.beginPath();ctx.moveTo(x-w*.035,0);ctx.lineTo(x+w*.05,0);ctx.lineTo(x+w*.17,h);ctx.lineTo(x-w*.11,h);ctx.closePath();ctx.fillStyle='rgba(166,248,255,.035)';ctx.fill();}
 for(let i=0;i<11;i++){const x=w*(i+.35)/11,altura=h*(.12+(i%4)*.045),balanco=Math.sin(t*.7+i)*w*.009;ctx.strokeStyle=i%2?'#3cae9d':'#66c9a2';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,h);ctx.quadraticCurveTo(x+balanco*2,h-altura*.6,x+balanco,h-altura);ctx.stroke();for(let j=1;j<=3;j++){const y=h-altura*j/4;ctx.beginPath();ctx.ellipse(x+balanco*j/3+(j%2?8:-8),y,10,4,j%2?-.6:.6,0,Math.PI*2);ctx.fillStyle='rgba(82,211,166,.7)';ctx.fill();}}
 for(let i=0;i<27;i++){const ciclo=(t*(.025+i%3*.007)+i*.137)%1,x=w*((i*.6180339)%1)+Math.sin(t*.6+i)*w*.008,y=h*(1-ciclo);ctx.beginPath();ctx.arc(x,y,2+(i%4)*1.1,0,Math.PI*2);ctx.strokeStyle='rgba(184,248,255,'+(.12+.22*(1-ciclo))+')';ctx.lineWidth=1.2;ctx.stroke();}
 for(const a of alimentos){a.idade+=dt;ctx.beginPath();ctx.arc(a.x,a.y+Math.min(h*.45,a.idade*17),3,0,Math.PI*2);ctx.fillStyle='#ffe3a0';ctx.fill();}
 for(let i=alimentos.length-1;i>=0;i--)if(alimentos[i].idade>12)alimentos.splice(i,1);
 for(let i=0;i<peixes.length;i++){const p=peixes[i],dir=i%2?1:-1,r=p.tamanho*Math.max(.75,Math.min(1.5,w/550));let x=w*((.5+dir*(t*p.ritmo+p.fase))%1+1)%w,y=h*p.altura+Math.sin(t*.75+p.fase)*h*.014;const comida=alimentos.find(a=>a.idade<7&&Math.abs(a.x-x)<w*.24);if(comida){const k=Math.min(1,comida.idade/2);x+=(comida.x-x)*k*.3;y+=(comida.y-y)*k*.35;}ctx.save();ctx.translate(x,y);ctx.scale(dir,1);ctx.fillStyle=p.cor;ctx.strokeStyle='rgba(4,44,59,.45)';ctx.lineWidth=1;const cauda=Math.sin(t*8+p.fase)*r*.16;ctx.beginPath();ctx.moveTo(-r*.75,0);ctx.lineTo(-r*1.7,-r*.55+cauda);ctx.lineTo(-r*1.7,r*.55+cauda);ctx.closePath();ctx.fill();ctx.beginPath();ctx.ellipse(0,0,r,r*.62,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-r*.2,-r*.48);ctx.lineTo(-r*.5,-r*.9);ctx.lineTo(r*.3,-r*.5);ctx.closePath();ctx.fill();const pisca=(t+p.fase*3)%5.7<.14;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(r*.53,-r*.13,r*.2,pisca?1:r*.22,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#17384b';ctx.beginPath();ctx.arc(r*.6,-r*.13,r*.09,0,Math.PI*2);ctx.fill();ctx.restore();}
 ctx.restore();
}
window.AquarioVivo={desenhar,alimentar,estado:()=>({peixes:peixes.length,alimentos:alimentos.length})};
})();
