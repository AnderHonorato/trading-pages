(async function(){
  const sess=await fetch('/api/autenticacao/sessao',{credentials:'same-origin'}).then(r=>r.json()).catch(()=>({autenticado:false}));
  if(!sess.autenticado){location.href='/entrar';return;}
  const form=document.querySelector('#formulario-senha'),aviso=document.querySelector('#aviso-senha');
  form.addEventListener('submit',async e=>{e.preventDefault();aviso.textContent='Salvando…';
    const r=await fetch('/api/autenticacao/trocar-senha',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':sess.csrf},body:JSON.stringify({senhaAtual:form.senhaAtual.value,novaSenha:form.novaSenha.value})});
    const d=await r.json();if(!r.ok){aviso.className='aviso erro';aviso.textContent=d.erro==='senha_fraca'?'A nova senha precisa ter pelo menos 12 caracteres.':'A senha temporária não confere.';return;}
    aviso.className='aviso sucesso';aviso.textContent='Senha alterada. Entre novamente.';setTimeout(()=>location.href='/entrar',700);
  });
})();