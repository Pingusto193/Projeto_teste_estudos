import express from "express";
import cors from "cors";
import { prisma } from "./prisma.ts";

const app = express();
app.use(cors());
app.use(express.json());

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
  const { nome, email, senha } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha
      }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuário" });
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
        senha
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