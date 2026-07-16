const formulario = document.querySelector(".signup-form");
const mensagem = document.querySelector(".form-message");

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  mensagem.textContent = "";

  // 1. Confere as validações definidas nos inputs do HTML.
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  // 2. Captura os valores dos inputs pelo atributo "name".
  const dadosFormulario = new FormData(formulario);
  const senha = dadosFormulario.get("senha");
  const confirmarSenha = dadosFormulario.get("confirmarSenha");

  // 3. A confirmação serve apenas para validar e não vai para o banco.
  if (senha !== confirmarSenha) {
    mensagem.textContent = "As senhas não coincidem.";
    return;
  }

  // 4. Monta o objeto com os mesmos campos esperados pelo backend.
  const novoUsuario = {
    nome: dadosFormulario.get("nome"),
    email: dadosFormulario.get("email"),
    telefone: dadosFormulario.get("telefone"),
    senha
  };

  // 5. Envia o objeto em JSON para a rota POST /user do servidor.
  try {
    const resposta = await fetch("http://localhost:3000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(novoUsuario)
    });

    const resultado = await resposta.json();

    // fetch só lança erro de rede; erros HTTP precisam desta verificação.
    if (!resposta.ok) {
      throw new Error(resultado.error || "Não foi possível criar a conta.");
    }

    // 6. Mostra o resultado ao usuário e limpa o formulário.
    mensagem.textContent = "Conta criada com sucesso!";
    formulario.reset();
  } catch (error) {
    mensagem.textContent = error.message;
    console.error("Erro ao criar conta:", error);
  }
});
