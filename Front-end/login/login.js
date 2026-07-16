const formularioLogin = document.querySelector(".login-form");
const mensagemLogin = document.querySelector(".form-message");
const botaoMostrarSenha = document.querySelector(".password-toggle");
const campoSenha = document.querySelector("#senha");

// Mostra ou esconde a senha.
botaoMostrarSenha.addEventListener("click", () => {
  const senhaEstaEscondida = campoSenha.type === "password";

  campoSenha.type = senhaEstaEscondida ? "text" : "password";
  botaoMostrarSenha.setAttribute("aria-pressed", String(senhaEstaEscondida));
  botaoMostrarSenha.setAttribute(
    "aria-label",
    senhaEstaEscondida ? "Ocultar senha" : "Mostrar senha"
  );
});

formularioLogin.addEventListener("submit", async (event) => {
  event.preventDefault();
  mensagemLogin.textContent = "";

  // Confere as validações definidas no HTML.
  if (!formularioLogin.checkValidity()) {
    formularioLogin.reportValidity();
    return;
  }

  // Pega os valores dos inputs pelo atributo "name".
  const dadosFormularioLogin = new FormData(formularioLogin);

  const dadosLogin = {
    email: dadosFormularioLogin.get("email"),
    senha: dadosFormularioLogin.get("senha")
  };

  try {
    // Envia o e-mail e a senha para a rota de login do servidor.
    const resposta = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dadosLogin)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.error || "Não foi possível entrar na conta.");
    }

    mensagemLogin.textContent = "Login realizado com sucesso!";
    console.log("Usuário conectado:", resultado.user);
    formularioLogin.reset();
  } catch (error) {
    mensagemLogin.textContent = error.message;
    console.error("Erro ao realizar login:", error);
  }
});
