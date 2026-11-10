(async function(){
  const sess=await fetch('/api/autenticacao/sessao',{credentials:'same-origin'}).then(r=>r.json()).catch(()=>({autenticado:false}));
  if(!sess.autenticado){location.href='/entrar';return;}
  if(sess.forcarTrocaSenha){location.href='/trocar-senha';return;}
  const nav=document.createElement('div');nav.id='painel-conta';
  const apis=document.createElement('a');apis.href='/configuracoes/apis';apis.textContent='APIs';
  const sair=document.createElement('button');sair.type='button';sair.textContent='Sair';
  nav.append(apis,sair);document.body.append(nav);
  sair.addEventListener('click',async()=>{await fetch('/api/autenticacao/sair',{method:'POST',credentials:'same-origin',headers:{'X-CSRF-Token':sess.csrf}});location.href='/entrar';});
})();