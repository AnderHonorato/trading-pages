const test=require('node:test');
const assert=require('node:assert/strict');
const Mov=require('../frontend/compartilhado/movimentos-tematicos.js');

const TEMAS=['pixel','dados','naves','cartas','voxel','criaturas','cyber','bio','arcano','oceano','floresta','clima','deserto','artico','comida','musica','esportes','origami','brinquedos'];

test('todos os 19 temas não-Cosmo possuem movimento próprio',()=>{
  for(const id of TEMAS) assert.equal(Mov.temMovimento(id),true,id);
  assert.equal(Mov.temMovimento('cosmos'),false);
});

test('movimentos não-Cosmo permanecem contínuos e dentro da arena',()=>{
  for(const id of TEMAS){
    let anterior=null;
    for(let passo=0;passo<=40;passo++){
      const atual=Mov.calcular(id,{indice:0,total:9,t:passo*.1,largura:1200,altura:800,centroX:600,centroY:400});
      assert.ok(Number.isFinite(atual.x)&&Number.isFinite(atual.y),id);
      assert.ok(atual.x>=0&&atual.x<=1200&&atual.y>=0&&atual.y<=800,id);
      if(anterior){
        const deslocamento=Math.hypot(atual.x-anterior.x,atual.y-anterior.y);
        assert.ok(deslocamento<85,id+' deve mover continuamente entre quadros; salto='+deslocamento.toFixed(1));
      }
      anterior=atual;
    }
  }
});

test('temas têm assinaturas de formação diferentes',()=>{
  const assinatura=id=>{
    const pts=[0,1,2,3,4].map(i=>Mov.calcular(id,{indice:i,total:9,t:1.2,largura:1200,altura:800,centroX:600,centroY:400}));
    return pts.map(p=>Math.round(p.x/20)+':'+Math.round(p.y/20)).join('|');
  };
  const assinaturas=new Set(TEMAS.map(assinatura));
  assert.ok(assinaturas.size>=15,'esperava pelo menos 15 formações distintas, recebeu '+assinaturas.size);
});

test('movimento musical reage em bandas verticais e naves mantêm esquadrão',()=>{
  const musica=[0,1,2].map(i=>Mov.calcular('musica',{indice:i,total:6,t:2,largura:1000,altura:700,centroX:500,centroY:350}));
  assert.ok(new Set(musica.map(p=>Math.round(p.x))).size===3);
  const n0=Mov.calcular('naves',{indice:0,total:7,t:2,largura:1000,altura:700,centroX:500,centroY:350});
  const n1=Mov.calcular('naves',{indice:1,total:7,t:2,largura:1000,altura:700,centroX:500,centroY:350});
  assert.ok(n0.y<n1.y || n0.y>n1.y);
});

test('guias temáticas existem sem anéis orbitais fora do Cosmo',()=>{
  for(const id of TEMAS){
    const g=Mov.guias(id,{largura:1200,altura:800,centroX:600,centroY:400});
    assert.ok(Array.isArray(g),id);
    assert.equal(g.some(x=>x.tipo==='orbita'),false,id);
  }
});
