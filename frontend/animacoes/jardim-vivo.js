/* Jardim Vivo: cultivo por toque, flores, polinizadores e clima em Canvas 2D. */
(()=>{
'use strict';
const flores=Array.from({length:7},(_,i)=>({x:.12+i*.125,y:.73+(i%2)*.055,idade:4+i*.5,cor:i%5}));
const sementes=[];const borboletas=Array.from({length:5},(_,i)=>({x:.12+i*.19,y:.35+i*.05,fase:i*1.7}));
const paleta=['#ff9fc6','#ffd57b','#a5a4ff','#ff886f','#8fe4cc'];
let tempo=0,plantadas=0,chuva=0,sol=0;
function plantar(x,y,w,h){
 const px=Math.max(.05,Math.min(.95,x/w)),py=Math.max(.54,Math.min(.9,y/h));
 if(flores.length>=24)flores.shift();
 flores.push({x:px,y:py,idade:0,cor:plantadas%paleta.length});plantadas++;
 sementes.push({x:px,y:py,vida:1});return {plantadas};
}
function regar(){chuva=6;flores.forEach(f=>f.idade+=1.2);return {flores:flores.length};}
function iluminar(){sol=5;flores.forEach(f=>f.idade+=.65);return {flores:flores.length};}
function desenhar(c,w,h,t,dt){
 const passo=Math.max(0,Math.min(dt,.05));tempo+=passo;chuva=Math.max(0,chuva-passo);sol=Math.max(0,sol-passo);
 c.save();const ceu=c.createLinearGradient(0,0,0,h);ceu.addColorStop(0,'#142d42');ceu.addColorStop(.55,sol?'#718a72':'#355a70');ceu.addColorStop(1,'#597b62');c.fillStyle=ceu;c.fillRect(0,0,w,h);
 const luaX=w*.79,luaY=h*.19;c.fillStyle=sol?'#ffe5a0':'#d7e9e3';c.shadowColor=c.fillStyle;c.shadowBlur=25;c.beginPath();c.arc(luaX,luaY,Math.min(w,h)*.06,0,Math.PI*2);c.fill();c.shadowBlur=0;
 for(let j=0;j<3;j++){c.fillStyle=['#315d61','#2e5552','#254842'][j];c.beginPath();c.moveTo(0,h*(.58+j*.08));for(let i=0;i<=20;i++)c.lineTo(w*i/20,h*(.57+j*.08)+Math.sin(i*.7+j)*h*.025);c.lineTo(w,h);c.lineTo(0,h);c.fill();}
 c.fillStyle='#263f36';c.fillRect(0,h*.82,w,h*.18);
 for(let i=0;i<42;i++){const x=w*(i+.5)/42,yy=h*(.83+Math.sin(i*2.3)*.025);c.strokeStyle=i%3?'#6caa7e':'#9ccc89';c.lineWidth=1.5;c.beginPath();c.moveTo(x,h*.89);c.quadraticCurveTo(x-5,yy+8,x+Math.sin(tempo+i)*4,yy);c.stroke();}
 flores.forEach((f,i)=>{
  f.idade+=passo*(chuva?1.5:.25);const k=Math.min(1,f.idade/2.5),x=f.x*w,y=f.y*h,altura=h*(.065+.085*k);
  const balan=Math.sin(tempo*1.3+i*1.9)*w*.004*k;
  c.strokeStyle='#70c78a';c.lineWidth=Math.max(2,w*.003);c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+balan*.3,y-altura*.55,x+balan,y-altura);c.stroke();
  c.fillStyle='#54a778';for(let lado of [-1,1]){c.beginPath();c.ellipse(x+lado*w*.012,y-altura*.4,w*.015,h*.008,lado*.5,0,Math.PI*2);c.fill();}
  if(k>.3){const cx=x+balan,cy=y-altura,r=Math.min(w,h)*(.012+.016*k);for(let p=0;p<6;p++){const a=p*Math.PI/3+Math.sin(tempo*.25+i)*.05;c.fillStyle=paleta[f.cor];c.beginPath();c.ellipse(cx+Math.cos(a)*r*.7,cy+Math.sin(a)*r*.7,r*.68,r*.48,a,0,Math.PI*2);c.fill();}c.fillStyle='#ffdb77';c.beginPath();c.arc(cx,cy,r*.38,0,Math.PI*2);c.fill();}
 });
 borboletas.forEach((b,i)=>{const x=w*(b.x+Math.sin(tempo*.36+b.fase)*.07),y=h*(b.y+Math.cos(tempo*.62+b.fase)*.055),ab=Math.sin(tempo*13+b.fase);c.save();c.translate(x,y);c.rotate(Math.sin(tempo*.5+i)*.18);c.fillStyle=paleta[i%paleta.length];for(let lado of [-1,1]){c.beginPath();c.ellipse(lado*(5+ab*2),-3,Math.max(2,7+ab*2),10,lado*.35,0,Math.PI*2);c.fill();}c.fillStyle='#263b42';c.fillRect(-1,-7,2,14);c.restore();});
 if(chuva){c.strokeStyle='rgba(190,226,255,.48)';c.lineWidth=1.3;for(let i=0;i<65;i++){const x=((i*73+tempo*95)%w),y=((i*113+tempo*250)%h);c.beginPath();c.moveTo(x,y);c.lineTo(x-4,y+13);c.stroke();}}
 sementes.forEach(s=>{s.vida-=passo;c.strokeStyle='rgba(255,230,150,'+Math.max(0,s.vida)+')';c.lineWidth=2;c.beginPath();c.arc(s.x*w,s.y*h,(1-s.vida)*30,0,Math.PI*2);c.stroke();});for(let i=sementes.length-1;i>=0;i--)if(sementes[i].vida<=0)sementes.splice(i,1);
 c.fillStyle='rgba(10,30,29,.7)';c.fillRect(w*.03,h*.29,w*.26,h*.075);c.fillStyle='#e6f6dc';c.font='600 '+Math.max(12,w*.016)+'px sans-serif';c.fillText('JARDIM VIVO  •  '+flores.length+' flores',w*.045,h*.337);
 c.restore();
}
window.JardimVivo={desenhar,plantar,regar,iluminar,estado:()=>({flores:flores.length,plantadas,chuva:chuva>0})};
})();
