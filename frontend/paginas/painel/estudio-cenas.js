/* Estudio de cenas demonstrativas — controles locais, sem IA ou ordens reais. */
(() => {
 'use strict';
 const api=()=>window.AgentesOrbitais;
 const temas=[['pixel','Arcade'],['dados','Mesa RPG'],['naves','Esquadrao'],['cartas','Baralho'],['voxel','Blocos'],['criaturas','Jardim'],['cosmos','Cosmos'],['cyber','Central cyber'],['bio','Laboratorio'],['arcano','Oficina magica'],['oceano','Recife'],['floresta','Bosque'],['clima','Ceu'],['deserto','Caravana'],['artico','Geleira'],['comida','Cozinha'],['musica','Palco'],['esportes','Estadio'],['origami','Atelie'],['brinquedos','Brinquedoteca']];
 const raiz=document.getElementById('estudio-cenas');if(!raiz)return;
 const botao=document.getElementById('abrir-estudio');
 let historico=[],roteiro=[],executando=false,interromper=false;
 const $=s=>raiz.querySelector(s);
 const guardar=()=>{try{localStorage.setItem('flow-estudio-roteiro-v1',JSON.stringify(roteiro));}catch{}};
 try{const v=JSON.parse(localStorage.getItem('flow-estudio-roteiro-v1')||'[]');if(Array.isArray(v))roteiro=v.filter(x=>temas.some(t=>t[0]===x.tema)).slice(0,12);}catch{}
 const registrar=(mensagem)=>{historico.unshift({mensagem,hora:new Date().toLocaleTimeString('pt-BR')});historico=historico.slice(0,12);const ul=$('[data-historico]');ul.replaceChildren();historico.forEach(x=>{const li=document.createElement('li');li.textContent=x.hora+' · '+x.mensagem;ul.append(li);});};
 const desenharRoteiro=()=>{const ul=$('[data-roteiro]');ul.replaceChildren();roteiro.forEach((item,i)=>{const li=document.createElement('li'),nome=temas.find(t=>t[0]===item.tema)?.[1]||item.tema;li.textContent=(i+1)+'. '+nome+' · '+item.acao+' ';const del=document.createElement('button');del.type='button';del.textContent='Remover';del.setAttribute('aria-label','Remover cena '+(i+1));del.addEventListener('click',()=>{roteiro.splice(i,1);guardar();desenharRoteiro();});li.append(del);ul.append(li);});$('[data-executar]').disabled=!roteiro.length||executando;};
 const lista=$('[data-temas]');temas.forEach(([id,nome])=>{const opt=document.createElement('option');opt.value=id;opt.textContent=nome;lista.append(opt);});
 const agentes=$('[data-agentes]');(api()?.config?.agentes||[]).forEach(a=>{const opt=document.createElement('option');opt.value=a.nome;opt.textContent=a.nome+' · '+a.papel;agentes.append(opt);});
 const aplicar=(item)=>{const a=api();if(!a)return false;a.tema(item.tema);if(item.acao==='pulso'&&item.agente)a.pulso(item.agente);if(item.acao==='xp')a.darXP(25);if(item.acao==='nivel')a.setNivel(Math.min(50,(a.estado()?.nivel||1)+1));registrar('Cena '+(temas.find(t=>t[0]===item.tema)?.[1]||item.tema)+' · '+item.acao+' (demonstração)');return true;};
 const atual=()=>({tema:lista.value,acao:$('[data-acao]').value,agente:agentes.value});
 $('[data-aplicar]').addEventListener('click',()=>aplicar(atual()));
 $('[data-adicionar]').addEventListener('click',()=>{if(roteiro.length>=12){registrar('Limite de 12 cenas atingido');return;}roteiro.push(atual());guardar();desenharRoteiro();registrar('Cena adicionada ao roteiro');});
 $('[data-limpar]').addEventListener('click',()=>{roteiro=[];guardar();desenharRoteiro();registrar('Roteiro limpo');});
 $('[data-executar]').addEventListener('click',async()=>{if(executando)return;executando=true;interromper=false;$('[data-executar]').disabled=true;$('[data-parar]').disabled=false;const copia=roteiro.slice();for(let i=0;i<copia.length&&!interromper;i++){aplicar(copia[i]);$('[data-progresso]').textContent='Cena '+(i+1)+' de '+copia.length;await new Promise(resolve=>setTimeout(resolve,1800));}executando=false;$('[data-parar]').disabled=true;$('[data-progresso]').textContent=interromper?'Roteiro interrompido':'Roteiro concluído';desenharRoteiro();});
 $('[data-parar]').addEventListener('click',()=>{interromper=true;});
 const abrir=(sim)=>{raiz.hidden=!sim;botao.setAttribute('aria-expanded',String(sim));if(sim){const estado=api()?.estado();if(estado&&temas.some(t=>t[0]===estado.tema))lista.value=estado.tema;$('[data-fechar]').focus();}else botao.focus();};
 botao.addEventListener('click',()=>abrir(raiz.hidden));$('[data-fechar]').addEventListener('click',()=>abrir(false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!raiz.hidden)abrir(false);});
 desenharRoteiro();registrar('Estúdio pronto · nenhuma ação financeira real');
})();
