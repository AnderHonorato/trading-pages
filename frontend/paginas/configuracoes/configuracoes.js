(async function(){
  const nomes={openai:'OpenAI',anthropic:'Claude / Anthropic',deepseek:'DeepSeek',xai:'Grok / xAI',gemini:'Gemini',openrouter:'OpenRouter'};
  const modelos={openai:'gpt-5',anthropic:'claude-sonnet-4-5',deepseek:'deepseek-chat',xai:'grok-4',gemini:'gemini-2.5-pro',openrouter:''};
  const raiz=document.querySelector('#provedores'),aviso=document.querySelector('#aviso-configuracoes');
  const sess=await fetch('/api/autenticacao/sessao',{credentials:'same-origin'}).then(r=>r.json()).catch(()=>({autenticado:false}));
  if(!sess.autenticado){location.href='/entrar';return;}
  if(sess.forcarTrocaSenha){location.href='/trocar-senha';return;}

  const estado2fa=document.querySelector('#estado-2fa'),acoes2fa=document.querySelector('#acoes-2fa'),config2fa=document.querySelector('#configuracao-2fa');
  function botao2fa(texto,acao){const b=document.createElement('button');b.type='button';b.className='botao-secundario';b.textContent=texto;b.addEventListener('click',acao);return b;}
  async function preparar2fa(){
    const r=await fetch('/api/autenticacao/2fa/preparar',{method:'POST',credentials:'same-origin',headers:{'X-CSRF-Token':sess.csrf}});
    const d=await r.json();if(!r.ok){aviso.className='aviso erro';aviso.textContent='Não foi possível preparar o 2FA.';return;}
    config2fa.classList.remove('oculto');document.querySelector('#segredo-2fa').textContent=d.segredo;document.querySelector('#codigo-2fa').focus();
  }
  function render2fa(ativo){
    estado2fa.textContent=ativo?'Ativa. O login exige autenticador ou código de recuperação.':'Desativada. Ative para adicionar uma segunda barreira ao login.';
    acoes2fa.replaceChildren();
    if(ativo){
      acoes2fa.append(botao2fa('Desativar',async()=>{const codigo=prompt('Digite um código do autenticador ou de recuperação para desativar:');if(!codigo)return;const r=await fetch('/api/autenticacao/2fa/desativar',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':sess.csrf},body:JSON.stringify({codigo})});if(r.ok){render2fa(false);aviso.className='aviso sucesso';aviso.textContent='2FA desativado.';}else{aviso.className='aviso erro';aviso.textContent='Código inválido.';}}));
    }else acoes2fa.append(botao2fa('Ativar 2FA',preparar2fa));
  }
  render2fa(Boolean(sess.doisFatoresAtivo));
  document.querySelector('#confirmar-2fa').addEventListener('click',async()=>{
    const codigo=document.querySelector('#codigo-2fa').value.trim();
    const r=await fetch('/api/autenticacao/2fa/ativar',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':sess.csrf},body:JSON.stringify({codigo})});
    const d=await r.json();if(!r.ok){aviso.className='aviso erro';aviso.textContent='Código 2FA inválido.';return;}
    const pre=document.querySelector('#recuperacao-2fa');pre.textContent='Guarde estes códigos em local seguro. Cada um funciona uma vez:\n\n'+d.codigosRecuperacao.join('\n');pre.classList.remove('oculto');render2fa(true);aviso.className='aviso sucesso';aviso.textContent='2FA ativado.';
  });

  const lista=await fetch('/api/configuracoes/apis',{credentials:'same-origin'}).then(r=>r.json());
  const existentes=new Map((lista.provedores||[]).map(x=>[x.provedor,x]));
  for(const id of Object.keys(nomes)){
    const atual=existentes.get(id),linha=document.createElement('form');linha.className='linha-provedor';linha.dataset.provedor=id;
    const nome=document.createElement('div');nome.className='provedor-nome';const strong=document.createElement('strong');strong.textContent=nomes[id];const estado=document.createElement('span');estado.textContent=atual?.configurada?'Configurada':'Sem chave';estado.className=atual?.configurada?'estado-ok':'estado-vazio';nome.append(strong,estado);
    const campoModelo=document.createElement('div');campoModelo.className='campo';const labelModelo=document.createElement('label');labelModelo.textContent='Modelo';const modelo=document.createElement('input');modelo.name='modelo';modelo.value=atual?.modelo||modelos[id];modelo.maxLength=120;campoModelo.append(labelModelo,modelo);
    const campoChave=document.createElement('div');campoChave.className='campo';const labelChave=document.createElement('label');labelChave.textContent='Chave API';const chave=document.createElement('input');chave.name='chave';chave.type='password';chave.autocomplete='off';chave.placeholder=atual?.configurada?'Digite uma nova chave para substituir':'Cole a chave aqui';chave.className='segredo';chave.maxLength=512;campoChave.append(labelChave,chave);
    const acao=document.createElement('button');acao.className='botao-principal';acao.type='submit';acao.textContent='Salvar';linha.append(nome,campoModelo,campoChave,acao);raiz.append(linha);
    linha.addEventListener('submit',async e=>{e.preventDefault();if(chave.value.length<8){aviso.className='aviso erro';aviso.textContent='Informe uma chave válida antes de salvar.';return;}acao.disabled=true;aviso.textContent='Salvando '+nomes[id]+'…';try{const r=await fetch('/api/configuracoes/apis/'+id,{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':sess.csrf},body:JSON.stringify({chave:chave.value,modelo:modelo.value,ativo:true})});const d=await r.json();if(!r.ok)throw new Error(d.erro||'erro');chave.value='';estado.textContent='Configurada';estado.className='estado-ok';aviso.className='aviso sucesso';aviso.textContent=nomes[id]+' salva com criptografia.';}catch{aviso.className='aviso erro';aviso.textContent='Não foi possível salvar '+nomes[id]+'.';}finally{acao.disabled=false;}});
  }
  document.querySelector('#sair').addEventListener('click',async()=>{await fetch('/api/autenticacao/sair',{method:'POST',credentials:'same-origin',headers:{'X-CSRF-Token':sess.csrf}});location.href='/entrar';});
})();