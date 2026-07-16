// =========================================================
// DEMONSTRAÇÃO VISUAL DO CRONÔMETRO
// Este arquivo não registra sessões e não envia dados ao servidor.
// =========================================================

const demonstracao = document.querySelector("#demonstracao-cronometro");
const tempoDemonstracao = document.querySelector("#tempo-demonstracao");
const progressoDemonstracao = document.querySelector("#progresso-demonstracao");
const textoEstado = document.querySelector("#texto-estado-demonstracao");
const textoBotao = document.querySelector("#texto-botao-demonstracao");

if (
  demonstracao &&
  tempoDemonstracao &&
  progressoDemonstracao &&
  textoEstado &&
  textoBotao
) {
  const barraProgresso = progressoDemonstracao.parentElement;
  const duracaoEmMinutos = Number(demonstracao.dataset.duracaoMinutos);
  const duracaoEmSegundos = duracaoEmMinutos * 60;

  // A sessão de 15 minutos é representada em 10 segundos na demonstração.
  const duracaoDaAnimacao = 10000;
  const preferenciaMovimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let quadroDaAnimacao;
  let inicioDaAnimacao;
  let esperas = [];

  function formatarTempo(totalDeSegundos) {
    const minutos = Math.floor(totalDeSegundos / 60);
    const segundos = totalDeSegundos % 60;

    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }

  function atualizarDemonstracao(progresso) {
    const porcentagem = Math.min(progresso * 100, 100);
    const segundosExibidos = Math.min(
      Math.floor(progresso * duracaoEmSegundos),
      duracaoEmSegundos
    );

    tempoDemonstracao.textContent = formatarTempo(segundosExibidos);
    progressoDemonstracao.style.width = `${porcentagem}%`;
    barraProgresso.setAttribute("aria-valuenow", String(Math.round(porcentagem)));
  }

  function adicionarEspera(funcao, tempo) {
    const espera = window.setTimeout(funcao, tempo);
    esperas.push(espera);
  }

  function limparAnimacao() {
    window.cancelAnimationFrame(quadroDaAnimacao);
    esperas.forEach((espera) => window.clearTimeout(espera));
    esperas = [];
    inicioDaAnimacao = undefined;
  }

  function mostrarEstadoInicial() {
    demonstracao.classList.remove("pronta", "simulando-clique", "finalizada");
    textoEstado.textContent = "Em andamento";
    textoBotao.textContent = "Pausar sessão";
    atualizarDemonstracao(0);
  }

  function finalizarVisualmente() {
    demonstracao.classList.remove("simulando-clique");
    demonstracao.classList.add("finalizada");
    textoEstado.textContent = "Sessão finalizada";
    textoBotao.textContent = "Sessão finalizada";

    // Depois de uma pequena pausa, a demonstração começa novamente.
    adicionarEspera(iniciarCiclo, 2400);
  }

  function prepararFinalizacao() {
    demonstracao.classList.add("pronta");
    textoEstado.textContent = "Tempo concluído";
    textoBotao.textContent = "Finalizar sessão";

    // Primeiro o ponteiro se aproxima; depois o clique é simulado.
    adicionarEspera(() => {
      demonstracao.classList.add("simulando-clique");
      adicionarEspera(finalizarVisualmente, 450);
    }, 1400);
  }

  function contarTempo(tempoAtual) {
    if (inicioDaAnimacao === undefined) {
      inicioDaAnimacao = tempoAtual;
    }

    const tempoDecorrido = tempoAtual - inicioDaAnimacao;
    const progresso = Math.min(tempoDecorrido / duracaoDaAnimacao, 1);

    atualizarDemonstracao(progresso);

    if (progresso < 1) {
      quadroDaAnimacao = window.requestAnimationFrame(contarTempo);
      return;
    }

    prepararFinalizacao();
  }

  function iniciarCiclo() {
    limparAnimacao();
    mostrarEstadoInicial();
    quadroDaAnimacao = window.requestAnimationFrame(contarTempo);
  }

  function mostrarVersaoSemMovimento() {
    limparAnimacao();
    demonstracao.classList.remove("pronta", "simulando-clique", "finalizada");
    demonstracao.classList.add("pronta", "finalizada");
    textoEstado.textContent = "Sessão finalizada";
    textoBotao.textContent = "Sessão finalizada";
    atualizarDemonstracao(1);
  }

  function aplicarPreferenciaDeMovimento() {
    if (preferenciaMovimentoReduzido.matches) {
      mostrarVersaoSemMovimento();
      return;
    }

    iniciarCiclo();
  }

  aplicarPreferenciaDeMovimento();
  preferenciaMovimentoReduzido.addEventListener(
    "change",
    aplicarPreferenciaDeMovimento
  );
}
