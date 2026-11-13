/* Backup portátil da Sala de Rotinas: validação antes de substituir dados locais. */
(() => {
  'use strict';
  const CHAVES = { tarefas:'ander-flow-rotinas-v1', historico:'ander-flow-rotinas-historico-v1', planos:'ander-flow-rotinas-planos-v2' };
  const aviso = document.querySelector('#aviso');
  const botaoExportar = document.querySelector('#exportar');
  const importar = document.querySelector('#importar');
  const resumo = document.querySelector('#resumo-backup');
  const limite = 1024 * 1024;
  function ler(chave, padrao) {
    try { return JSON.parse(localStorage.getItem(chave) || JSON.stringify(padrao)); }
    catch { return padrao; }
  }
  function informar(mensagem) { aviso.textContent = mensagem; }
  function validar(dados) {
    if (!dados || typeof dados !== 'object' || !Array.isArray(dados.tarefas) || !Array.isArray(dados.historico)) throw Error('Formato de backup inválido.');
    if (dados.tarefas.length > 500 || dados.historico.length > 60) throw Error('Backup excede os limites de atividades ou histórico.');
    const ids = new Set();
    const tarefas = dados.tarefas.map(t => {
      if (!t || typeof t.id !== 'string' || t.id.length > 100 || ids.has(t.id) ||
          typeof t.titulo !== 'string' || !t.titulo.trim() || t.titulo.length > 100 ||
          !['fila','andamento','concluida'].includes(t.estado) ||
          !['alta','normal','baixa'].includes(t.prioridade) ||
          typeof t.responsavel !== 'string' || t.responsavel.length > 50) throw Error('Atividade inválida ou ID duplicado.');
      ids.add(t.id);
      return {id:t.id,titulo:t.titulo,responsavel:t.responsavel,prioridade:t.prioridade,estado:t.estado};
    });
    if (!dados.historico.every(h => typeof h === 'string' && h.length <= 500)) throw Error('Histórico inválido.');
    const origem = dados.planos === undefined ? {} : dados.planos;
    if (!origem || typeof origem !== 'object' || Array.isArray(origem)) throw Error('Planos inválidos.');
    const planos = Object.create(null);
    for (const [id, plano] of Object.entries(origem)) {
      if (!ids.has(id) || !plano || !Array.isArray(plano.etapas) || plano.etapas.length > 30 ||
          typeof plano.prazo !== 'string' || (plano.prazo && !/^\d{4}-\d{2}-\d{2}$/.test(plano.prazo))) throw Error('Plano inválido.');
      if (!plano.etapas.every(e => e && typeof e.texto === 'string' && e.texto.length <= 120 && typeof e.feito === 'boolean')) throw Error('Etapas inválidas.');
      planos[id] = {prazo:plano.prazo,etapas:plano.etapas.map(e => ({texto:e.texto,feito:e.feito}))};
    }
    return {tarefas,historico:dados.historico,planos};
  }
  botaoExportar.addEventListener('click', evento => {
    evento.stopImmediatePropagation();
    try {
      const dados = {formato:'ander-flow-rotinas',versao:2,exportadoEm:new Date().toISOString(),
        tarefas:ler(CHAVES.tarefas,[]),historico:ler(CHAVES.historico,[]),planos:ler(CHAVES.planos,{})};
      const blob = new Blob([JSON.stringify(dados,null,2)],{type:'application/json'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href=url;link.download='flow-rotinas-backup-'+new Date().toISOString().slice(0,10)+'.json';
      link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
      informar('Backup completo exportado, incluindo prazos e checklists.');
    } catch { informar('Não foi possível exportar o backup.'); }
  }, true);
  importar.addEventListener('change', async () => {
    const arquivo=importar.files?.[0];
    if (!arquivo) return;
    try {
      if (arquivo.size > limite) throw Error('Arquivo maior que 1 MB.');
      const dados=validar(JSON.parse(await arquivo.text()));
      const feitas=dados.tarefas.filter(t=>t.estado==='concluida').length;
      const etapas=Object.values(dados.planos).reduce((n,p)=>n+p.etapas.length,0);
      resumo.textContent='Backup conferido: '+dados.tarefas.length+' atividades, '+feitas+' concluídas e '+etapas+' etapas.';
      if (!confirm(resumo.textContent+'\n\nSubstituir as atividades deste navegador? Esta ação não pode ser desfeita. Exporte o backup atual antes.')) {
        informar('Importação cancelada; seus dados foram preservados.');return;
      }
      const anteriores=Object.fromEntries(Object.values(CHAVES).map(chave=>[chave,localStorage.getItem(chave)]));
      try {
        localStorage.setItem(CHAVES.tarefas,JSON.stringify(dados.tarefas));
        localStorage.setItem(CHAVES.historico,JSON.stringify(dados.historico));
        localStorage.setItem(CHAVES.planos,JSON.stringify(dados.planos));
      } catch (erro) {
        for (const [chave,valor] of Object.entries(anteriores)) {
          try { if (valor===null)localStorage.removeItem(chave);else localStorage.setItem(chave,valor); } catch {}
        }
        throw erro;
      }
      informar('Backup restaurado. Atualizando o quadro…');
      location.reload();
    } catch (erro) { resumo.textContent='Nenhum dado alterado.';informar('Importação recusada: '+erro.message); }
    finally { importar.value=''; }
  });
})();
