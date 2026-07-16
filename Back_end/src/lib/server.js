import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "./prisma.ts";
import * as argon2 from "argon2";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontEndPath = path.resolve(__dirname, "../../../Front-end");

app.use(cors());
app.use(express.json());
app.use(express.static(frontEndPath));

const PORT = 3000;

app.get("/user", async (req, res) => {
 try { 
    const user = await prisma.user.findMany();
    res.json(user);
 } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
 }
});
app.get("/user/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

app.post("/user", async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha,
        telefone
      }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  // Antes de consultar o banco, confere se os dados foram enviados.
  if (!email || !senha) {
    return res.status(400).json({
      error: "E-mail e senha são obrigatórios."
    });
  }

  try {
    // O e-mail é único no banco, então findUnique encontra uma conta.
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    // A mensagem não revela qual dos dois campos está errado.
    if (!user || user.senha !== senha) {
      return res.status(401).json({
        error: "E-mail ou senha incorretos."
      });
    }

    // Nunca envia a senha de volta para o navegador.
    res.json({
      message: "Login realizado com sucesso.",
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({
      error: "Erro interno ao realizar login."
    });
  }
});

app.delete("/user/:id", async (req, res) => {
  const id = Number(req.params.id);
  try { 
    const user = await prisma.user.delete({
      where: {
        id
      }
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
});

app.put("/user/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  try {
    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        nome,
        email,
        senha,
        telefone
      }
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

//Parte dos Estudos


app.get("/user/:userId/Estudos", async (req, res) => {
  const userId = Number(req.params.userId);
  try { const estudos = await prisma.estudos.findMany({
      where: {
        User_id: userId
      },
      orderBy: {
        start: "desc"
      }
    });
    res.json(estudos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar estudos" });
  }
});

app.post("/user/:userId/Estudos", async (req, res) => {
const userId = Number(req.params.userId);
try {
const { materia, horas } = req.body;
const estudo = await prisma.estudos.create({
  data: {
    User_id: userId,
    materia,
    horas,
  }
});
} catch (error) {
  console.error(error);
  res.status(500).json({ error: "Erro ao criar estudo" });
}
});

app.delete("/user/:userId/Estudos/:estudoId", async (req, res) => {
  const userId = Number(req.params.userId);
  const estudoId = Number(req.params.estudoId);
  try {
    const estudo = await prisma.estudos.delete({
      where: {
        id: estudoId,
        User_id: userId
      }
    });
    res.json(estudo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir estudo" });
  }
});

//parte do foghinho-------------------------------------------------------

app.get("/user/:userId/fogos", async (req, res) => {
  const userId = Number(req.params.userId);
  try {
    const fogos = await prisma.fogo.findMany({
      where: {
        User_id: userId
      }
    });
    res.json(fogos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar fogos" });
  }
});

app.post("/user/:userId/fogos", async (req, res) => {
  const userId = Number(req.params.userId);
  try {
    const { fogo_atual, fogo_maximo } = req.body;
    const fogo = await prisma.fogo.create({
      data: {
        User_id: userId,
        fogo_atual,
        fogo_maximo
      }
    });
    res.status(201).json(fogo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar fogo" });
  }
});

app.delete("/user/:userId/fogos/:fogoId", async (req, res) => {
  const userId = Number(req.params.userId);
  const fogoId = Number(req.params.fogoId);
  try {
    const fogo = await prisma.fogo.delete({
      where: {
        id: fogoId,
        User_id: userId
      }
    });
    res.json(fogo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir fogo" });
  }
});

// parte dos amigos-------------------------------------------------------
app.get("/user/:userId/pedidos", async (req, res) => {
  const userId = Number(req.params.userId);

  try {
    const pedidos = await prisma.friendship.findMany({
      where: {
        addresseeId: userId,
        status: "PENDING"
      },
      include: {
        requester: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao buscar pedidos"
    });
  }
});

app.post("/user/:userId/amigos/:amigoId", async (req, res) => {
  const requesterId = Number(req.params.userId);
  const addresseeId = Number(req.params.amigoId);

  try {
    if (requesterId === addresseeId) {
      return res.status(400).json({
        error: "Você não pode adicionar a si mesmo"
      });
    }

    // Procura amizade ou pedido nos dois sentidos
    const existente = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          {
            requesterId: addresseeId,
            addresseeId: requesterId
          }
        ]
      }
    });

    if (existente) {
      return res.status(409).json({
        error: "Já existe uma amizade ou pedido entre esses usuários"
      });
    }

    const pedido = await prisma.friendship.create({
      data: {
        requesterId,
        addresseeId
        // status começa como PENDING automaticamente
      }
    });

    res.status(201).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao enviar pedido de amizade"
    });
  }
});

app.put("/user/:userId/pedidos/:pedidoId/aceitar", async (req, res) => {
  const userId = Number(req.params.userId);
  const pedidoId = Number(req.params.pedidoId);

  try {
    const resultado = await prisma.friendship.updateMany({
      where: {
        id: pedidoId,
        addresseeId: userId,
        status: "PENDING"
      },
      data: {
        status: "ACCEPTED"
      }
    });

    if (resultado.count === 0) {
      return res.status(404).json({
        error: "Pedido pendente não encontrado"
      });
    }

    const amizade = await prisma.friendship.findUnique({
      where: {
        id: pedidoId
      }
    });

    res.json(amizade);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao aceitar pedido"
    });
  }
});
app.put("/user/:userId/pedidos/:pedidoId/recusar", async (req, res) => {
  const userId = Number(req.params.userId);
  const pedidoId = Number(req.params.pedidoId);

  try {
    const resultado = await prisma.friendship.updateMany({
      where: {
        id: pedidoId,
        addresseeId: userId,
        status: "PENDING"
      },
      data: {
        status: "REJECTED"
      }
    });

    if (resultado.count === 0) {
      return res.status(404).json({
        error: "Pedido pendente não encontrado"
      });
    }

    const amizade = await prisma.friendship.findUnique({
      where: {
        id: pedidoId
      }
    });

    res.json(amizade);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao recusar pedido"
    });
  }
});
