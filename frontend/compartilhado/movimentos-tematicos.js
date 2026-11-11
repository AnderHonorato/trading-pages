(function(raiz,fabrica){
  const api=fabrica();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(raiz)raiz.MovimentosTematicos=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const TAU=Math.PI*2;
  const TEMAS=new Set(['pixel','dados','naves','cartas','voxel','criaturas','cyber','bio','arcano','oceano','floresta','clima','deserto','artico','comida','musica','esportes','origami','brinquedos']);
  const temMovimento=id=>TEMAS.has(String(id||''));
  const seed=i=>{
    const x=Math.sin((i+1)*91.137)*43758.5453;
    return x-Math.floor(x);
  };
  const safe=(x,y,W,H,extra={})=>({
    x:clamp(x,Math.max(40,W*.06),W-Math.max(40,W*.06)),
    y:clamp(y,Math.max(90,H*.13),H-Math.max(85,H*.12)),
    z:extra.z||0,prof:extra.prof||0,f:extra.f||1
  });
  const ordem=(i,n)=>n<=1?0:i/(n-1);
  const centroIndice=(i,n)=>i-(n-1)/2;

  function calcular(id,{indice=0,total=1,t=0,largura:W=1200,altura:H=800,centroX:CX=W/2,centroY:CY=H/2}={}){
    id=String(id||'');
    const i=Math.max(0,indice|0),n=Math.max(1,total|0),u=ordem(i,n),c=centroIndice(i,n),r=seed(i);
    const sx=W*.72,sy=H*.58;
    let x=CX,y=CY;

    switch(id){
      case 'pixel':{
        const cols=Math.max(3,Math.ceil(Math.sqrt(n*1.5))),row=Math.floor(i/cols),col=i%cols;
        const rows=Math.ceil(n/cols),cellX=sx/Math.max(1,cols-1),cellY=sy/Math.max(1,rows);
        const passo=Math.floor(t*.45+i*.17)%2;
        x=CX-sx/2+col*cellX+(passo?cellX*.12:-cellX*.12);
        y=CY-sy/2+(row+.55)*cellY+Math.sin(t*1.1+i)*H*.012;
        break;
      }
      case 'dados':{
        const lados=Math.ceil(Math.sqrt(n)),row=Math.floor(i/lados),col=i%lados;
        x=CX+(col-(lados-1)/2)*W*.15+Math.sin(t*.55+i)*W*.012;
        y=CY+(row-(Math.ceil(n/lados)-1)/2)*H*.18+Math.cos(t*.43+i)*H*.012;
        break;
      }
      case 'naves':{
        const lado=i===0?0:(i%2?1:-1),nivel=i===0?0:Math.ceil(i/2);
        x=CX+lado*nivel*W*.105+Math.sin(t*.55+i)*W*.018;
        y=CY-H*.24+nivel*H*.09+Math.sin(t*.72+i*.8)*H*.012;
        break;
      }
      case 'cartas':{
        const ang=(-1.22+u*2.44),raio=Math.min(W,H)*.47;
        x=CX+Math.sin(ang)*raio+Math.sin(t*.36+i)*W*.0035;
        y=CY+H*.22-Math.cos(ang)*raio*.72+Math.cos(t*.34+i)*H*.0035;
        break;
      }
      case 'voxel':{
        const cols=3,row=Math.floor(i/cols),col=i%cols;
        x=CX+(col-1)*W*.19+(row%2)*W*.045;
        y=CY+H*.22-row*H*.14-col*H*.035+Math.abs(Math.sin(t*.8+i))*H*.018;
        break;
      }
      case 'criaturas':{
        const grupos=[[-.30,-.18],[.30,-.18],[-.30,.20],[.30,.20],[0,-.25],[0,.27],[-.15,.02],[.15,.02],[0,.04]];
        const g=grupos[i%grupos.length];
        x=CX+g[0]*W+Math.sin(t*.33+i*1.7)*W*.016;
        y=CY+g[1]*H+Math.cos(t*.29+i*1.2)*H*.016;
        break;
      }
      case 'cyber':{
        const trilhas=3,linha=i%trilhas,seq=Math.floor(i/trilhas);
        const colunas=Math.ceil(n/trilhas),baseX=CX+(seq-(colunas-1)/2)*W*.25;
        const dir=linha%2? -1:1;
        x=baseX+Math.sin(t*.48*dir+i*.7)*W*.045;
        y=CY+(linha-1)*H*.19+Math.sin(t*.36+i)*H*.018;
        break;
      }
      case 'bio':{
        const colunas=3,row=Math.floor(i/colunas),col=i%colunas;
        const linhas=Math.ceil(n/colunas),pulso=1+.028*Math.sin(t*.62+i);
        x=CX+(col-1)*W*.23*pulso+Math.sin(t*.27+i)*W*.007;
        y=CY+(row-(linhas-1)/2)*H*.22*pulso+Math.cos(t*.31+i)*H*.007;
        break;
      }
      case 'arcano':{
        const vertices=6,v=i%vertices,anel=Math.floor(i/vertices);
        const ang=-Math.PI/2+v*TAU/vertices;
        const rr=Math.min(W,H)*(.31+anel*.09);
        const salto=(Math.sin(t*.5+i*.7)+1)/2;
        x=CX+Math.cos(ang)*rr+Math.cos(ang+Math.PI/2)*salto*W*.018;
        y=CY+Math.sin(ang)*rr*.72+Math.sin(ang+Math.PI/2)*salto*H*.018;
        break;
      }
      case 'oceano':{
        const camada=i%3,seq=Math.floor(i/3),colunas=Math.ceil(n/3);
        const baseX=CX+(seq-(colunas-1)/2)*W*.255;
        const fase=t*.42+seq*.78+camada*1.35;
        x=baseX+Math.sin(fase)*W*.035;
        y=CY+(camada-1)*H*.19+Math.sin(fase*.82+i*.45)*H*.035;
        break;
      }
      case 'floresta':{
        const lado=i%2?1:-1,nivel=Math.floor(i/2);
        x=CX+lado*(W*.15+Math.min(3,nivel)*W*.07)+Math.sin(t*.42+i)*W*.018;
        y=CY-H*.22+nivel*H*.085+Math.sin(t*.6+i)*H*.018;
        break;
      }
      case 'clima':{
        const camada=i%3,seq=Math.floor(i/3),colunas=Math.ceil(n/3);
        const baseX=CX+(seq-(colunas-1)/2)*W*.25;
        x=baseX+Math.sin(t*.26+(camada===1?-1:1)*i*.65)*W*.055;
        y=CY+(camada-1)*H*.20+Math.sin(t*.48+i)*H*.018;
        break;
      }
      case 'deserto':{
        const fila=Math.floor(i/5),pos=i%5,avan=.5+.5*Math.sin(t*.22+fila*.8);
        x=CX-sx/2+clamp(pos/4*.78+avan*.22,0,1)*sx;
        y=CY-H*.10+fila*H*.15+Math.sin((pos+avan*2)*1.4)*H*.045;
        break;
      }
      case 'artico':{
        const pts=[[-.28,-.18],[-.02,-.23],[.27,-.16],[-.22,.10],[.08,.05],[.30,.14],[-.10,.28],[.20,.30],[-.34,.30]];
        const p=pts[i%pts.length];
        x=CX+p[0]*W+Math.sin(t*.18+i)*W*.012;
        y=CY+p[1]*H+Math.cos(t*.16+i)*H*.010;
        break;
      }
      case 'comida':{
        const estacoes=Math.max(4,Math.min(7,n)),idx=i%estacoes;
        const fase=((t*.045+Math.floor(i/estacoes)*.33)%1+1)%1;
        x=CX-sx/2+(idx/(estacoes-1))*sx+Math.sin(fase*TAU)*W*.012;
        y=CY+(i%2?1:-1)*H*.11+Math.sin(t*.8+i)*H*.014;
        break;
      }
      case 'musica':{
        const bandas=Math.max(5,n),passo=sx/Math.max(1,bandas-1);
        const amp=(.08+.10*(.5+.5*Math.sin(t*1.2+i*.8)))*H;
        x=CX-sx/2+i*passo;
        y=CY+Math.sin(t*1.55+i*.72)*amp+(i%2?H*.05:-H*.05);
        break;
      }
      case 'esportes':{
        const linhas=3,linha=i%linhas,pos=Math.floor(i/linhas),dir=linha===1?-1:1;
        x=CX+(pos-(Math.ceil(n/linhas)-1)/2)*W*.18+Math.sin(t*.5+i)*W*.018*dir;
        y=CY+(linha-1)*H*.19+Math.cos(t*.45+i)*H*.015;
        break;
      }
      case 'origami':{
        const zig=i%2?1:-1;
        x=CX-sx/2+u*sx+Math.sin(t*.52+i)*W*.014;
        y=CY+zig*H*.18+Math.sin(t*.7+i*.5)*H*.035;
        break;
      }
      case 'brinquedos':{
        const zonas=[[-.30,-.18],[-.10,-.18],[.12,-.18],[.31,-.08],[.24,.18],[.02,.24],[-.20,.20],[-.32,.04],[0,.02]];
        const p=zonas[i%zonas.length],troca=.5+.5*Math.sin(t*.42+i);
        x=CX+p[0]*W+Math.sin(t*.7+i)*W*.016*troca;
        y=CY+p[1]*H+Math.cos(t*.62+i)*H*.016*troca;
        break;
      }
      default:{
        x=CX+c*Math.min(W*.10,100);
        y=CY+Math.sin(i)*H*.08;
      }
    }
    return safe(x,y,W,H,{z:(u-.5)*.1,prof:(u-.5)*.1,f:1});
  }

  function guias(id,{largura:W=1200,altura:H=800,centroX:CX=W/2,centroY:CY=H/2}={}){
    const cor='tema';
    switch(id){
      case 'pixel': return [{tipo:'grade',x:CX-W*.36,y:CY-H*.27,w:W*.72,h:H*.54,cor}];
      case 'dados': return [{tipo:'mesa',x:CX-W*.30,y:CY-H*.26,w:W*.60,h:H*.52,cor}];
      case 'naves': return [{tipo:'formacao-v',x:CX,y:CY-H*.22,cor}];
      case 'cartas': return [{tipo:'leque',x:CX,y:CY+H*.16,cor}];
      case 'voxel': return [{tipo:'degraus',x:CX,y:CY,cor}];
      case 'criaturas': return [{tipo:'territorios',x:CX,y:CY,cor}];
      case 'cyber': return [{tipo:'circuito',x:CX-W*.36,y:CY,w:W*.72,cor}];
      case 'bio': return [{tipo:'colonia',x:CX,y:CY,cor}];
      case 'arcano': return [{tipo:'sigilo',x:CX,y:CY,cor}];
      case 'oceano': return [{tipo:'ondas',x:CX,y:CY,cor}];
      case 'floresta': return [{tipo:'galhos',x:CX,y:CY,cor}];
      case 'clima': return [{tipo:'camadas',x:CX,y:CY,cor}];
      case 'deserto': return [{tipo:'caravana',x:CX,y:CY,cor}];
      case 'artico': return [{tipo:'placas',x:CX,y:CY,cor}];
      case 'comida': return [{tipo:'esteira',x:CX-W*.34,y:CY,w:W*.68,cor}];
      case 'musica': return [{tipo:'equalizador',x:CX-W*.34,y:CY,w:W*.68,cor}];
      case 'esportes': return [{tipo:'campo',x:CX-W*.34,y:CY-H*.26,w:W*.68,h:H*.52,cor}];
      case 'origami': return [{tipo:'dobras',x:CX-W*.34,y:CY,w:W*.68,cor}];
      case 'brinquedos': return [{tipo:'pista',x:CX,y:CY,cor}];
      default:return [];
    }
  }

  function nomeMovimento(id){
    return ({
      pixel:'Grade arcade',dados:'Mesa tática',naves:'Esquadrão em V',cartas:'Leque de cartas',
      voxel:'Degraus isométricos',criaturas:'Matilha viva',cyber:'Circuito de nós',bio:'Colônia celular',
      arcano:'Pontos de sigilo',oceano:'Cardume em ondas',floresta:'Galhos e clareiras',clima:'Camadas atmosféricas',
      deserto:'Caravana',artico:'Placas de gelo',comida:'Esteira de cozinha',musica:'Palco/equalizador',
      esportes:'Formação de campo',origami:'Dobras e voo',brinquedos:'Pista de brincar',cosmos:'Órbitas elípticas'
    })[id]||'Movimento livre';
  }

  return {temMovimento,calcular,guias,nomeMovimento,temas:[...TEMAS]};
});
