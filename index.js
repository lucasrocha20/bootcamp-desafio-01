const express = require("express");

const server = express();

server.use(express.json());

const projects = []; //Array de armazenamento dos projetos
let requisitions = 0; //Variavel de controle das requisições

//Middlewares

//Local verifica se o ID existe no array
function verificaId(req, res, next) {
  const project = projects.find(obj => obj.id === req.params.id);
  if (!project) {
    return res.status(400).send({ Error: "ID não encontrado nos projetos" });
  }

  return next();
}

//Global retorna quantidade de requisição
server.use((req, res, next) => {
  console.log(`Número de requisições: ${++requisitions}`);

  return next();
});

//Routes

//Cria um novo projeto
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });
  return res.json(projects);
});

//Recupera todos os projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Atualiza um projeto
server.put("/projects/:id", verificaId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(obj => obj.id === id);
  project.title = title;

  return res.json(projects);
});

//Exclui um projeto
server.delete("/projects/:id", verificaId, (req, res) => {
  const { id } = req.params;

  const project = projects.findIndex(obj => obj.id === id);

  projects.splice(project, 1);
  return res.send();
});

//Cria uma nova tarefa dentro de um projeto
server.post("/projects/:id/tasks", verificaId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(obj => obj.id === id);

  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3001);
