(function(raiz,fabrica){
  const api=fabrica();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(raiz)raiz.OrbitalCoreografia=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const TAU=Math.PI*2;
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const normalizar=a=>((a%TAU)+TAU)%TAU;

  function deltaAngular(alvo,atual){
    let d=normalizar(alvo)-normalizar(atual);
    if(d>Math.PI)d-=TAU;
    if(d<-Math.PI)d+=TAU;
    return d;
  }

  function interpolarAngulo(atual,alvo,dt,velocidade=3){
    const d=deltaAngular(alvo,atual);
    const k=1-Math.exp(-Math.max(0,dt)*Math.max(.01,velocidade));
    return atual+d*k;
  }

  function mediaCircular(itens){
    if(!itens.length)return 0;
    let x=0,y=0;
    for(const item of itens){x+=Math.cos(item.angulo);y+=Math.sin(item.angulo);}
    return Math.atan2(y,x);
  }

  function distribuirFases(itens){
    if(!Array.isArray(itens)||!itens.length)return {};
    const ordenados=[...itens].sort((a,b)=>normalizar(a.angulo)-normalizar(b.angulo));
    const centro=normalizar(mediaCircular(ordenados));
    const passo=TAU/ordenados.length;
    const inicio=centro-passo*(ordenados.length-1)/2;
    const saida={};
    ordenados.forEach((item,i)=>{saida[item.id]=normalizar(inicio+i*passo);});
    return saida;
  }

  function resolverSeparacao(itens,{dt=1/60,margem=6,maxDeslocamento=20,rigidez=7,amortecimento=.78}={}){
    const desloc={};
    for(const item of itens)desloc[item.id]={x:Number(item.ox)||0,y:Number(item.oy)||0};
    for(let i=0;i<itens.length;i++){
      for(let j=i+1;j<itens.length;j++){
        const a=itens[i],b=itens[j];
        let ax=a.x+desloc[a.id].x,ay=a.y+desloc[a.id].y;
        let bx=b.x+desloc[b.id].x,by=b.y+desloc[b.id].y;
        let dx=bx-ax,dy=by-ay,dist=Math.hypot(dx,dy);
        const min=(Number(a.raio)||0)+(Number(b.raio)||0)+margem;
        if(dist>=min)continue;
        if(dist<.001){
          const ang=(i*2.399+j*.731);
          dx=Math.cos(ang);dy=Math.sin(ang);dist=1;
        }
        const falta=min-dist;
        const forca=falta*.5*(1-Math.exp(-rigidez*Math.max(dt,.001)));
        const ux=dx/dist,uy=dy/dist;
        desloc[a.id].x-=ux*forca;desloc[a.id].y-=uy*forca;
        desloc[b.id].x+=ux*forca;desloc[b.id].y+=uy*forca;
      }
    }
    for(const item of itens){
      const atual=desloc[item.id];
      atual.x=clamp(atual.x*amortecimento,-maxDeslocamento,maxDeslocamento);
      atual.y=clamp(atual.y*amortecimento,-maxDeslocamento,maxDeslocamento);
    }
    return desloc;
  }

  function escalaMicroMovimento(quantidade){
    return clamp(1-Math.max(0,Number(quantidade)-6)*.055,.35,1);
  }

  return {TAU,normalizar,deltaAngular,interpolarAngulo,distribuirFases,resolverSeparacao,escalaMicroMovimento};
});
