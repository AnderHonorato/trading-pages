(function(){
  const form=document.querySelector('#formulario-entrar'),aviso=document.querySelector('#aviso-entrar'),botao=form.querySelector('button[type="submit"]'),campo2fa=document.querySelector('#campo-2fa');
  let csrf='';
  const mensagem={credenciais_invalidas:'Usuário ou senha incorretos.',muitas_tentativas:'Muitas tentativas. Aguarde antes de tentar novamente.',csrf_invalido:'A sessão de segurança expirou. Recarregue a página.',codigo_2fa_invalido:'Código de autenticação inválido.'};
  async function preparar(){const r=await fetch('/api/autenticacao/iniciar',{credentials:'same-origin'});const d=await r.json();csrf=d.csrf||'';}
  form.addEventListener('submit',async e=>{
    e.preventDefault();aviso.className='aviso';aviso.textContent='Validando…';botao.disabled=true;
    try{
      if(!csrf)await preparar();
      const corpo={usuario:form.usuario.value.trim(),senha:form.senha.value,codigo2fa:form.codigo2fa?.value?.trim()||''};
      const r=await fetch('/api/autenticacao/entrar',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify(corpo)});
      const d=await r.json();
      if(d.erro==='2fa_necessario'){campo2fa.classList.remove('oculto');form.codigo2fa.focus();aviso.className='aviso';aviso.textContent='Digite o código do autenticador ou um código de recuperação.';return;}
      if(!r.ok){aviso.className='aviso erro';aviso.textContent=mensagem[d.erro]||'Não foi possível entrar.';if(r.status===403)await preparar();return;}
      location.href=d.forcarTrocaSenha?'/trocar-senha':'/painel';
    }catch{aviso.className='aviso erro';aviso.textContent='Servidor indisponível.';}
    finally{botao.disabled=false;}
  });
  fetch('/api/autenticacao/sessao',{credentials:'same-origin'}).then(r=>r.json()).then(d=>{if(d.autenticado)location.href=d.forcarTrocaSenha?'/trocar-senha':'/painel';else preparar();}).catch(()=>preparar());
})();