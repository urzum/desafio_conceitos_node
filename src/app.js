const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validRepositorietId(request, response, next) {
  const { id } = request.params;
  const resultIndex = repositories.findIndex((result) => result.id === id);

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID " });
  }

  if (resultIndex < 0) {
    return response.status(400).json({ error: "Repositorie not found!" });
  }

  return next();
}

app.use("/repositories/:id", validRepositorietId);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const result = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(result);

  return response.json(result);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const resultIndex = repositories.findIndex((result) => result.id === id);

  repositories[resultIndex].id = id;
  repositories[resultIndex].title = title;
  repositories[resultIndex].url = url;
  repositories[resultIndex].techs = techs;

  return response.json(repositories[resultIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const resultIndex = repositories.findIndex((result) => result.id === id);

  repositories.splice(resultIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const resultIndex = repositories.findIndex((result) => result.id === id);

  repositories[resultIndex].likes++;

  return response.json({ likes: repositories[resultIndex].likes });
});

module.exports = app;
