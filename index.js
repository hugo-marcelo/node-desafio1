const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let countReq = 0;

server.use((req, res, next) => {
  countReq++;
  console.log(`Número de requisições: ${countReq}`);
  next();
});

function checkProjectInArray(req, res, next) {
  const index = projects.findIndex(p => p.id === req.params.id);
  
  if(index === -1) {
    return res.status(400).json({error: 'Project does not exists'});
  }

  req.project = projects[index];

  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const {id} = req.body;
  const {title} = req.body;

  projects.push({id, title, tasks: []});

  return res.json(projects);
});

server.put('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      projects[i].title = title;
      break;
    }
  }

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id === id);

  if (index > -1) projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
  const {id} = req.body;
  const {title} = req.body;

  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      projects[i].tasks.push(title);
      break;
    }
  }

  return res.json(projects);
});

server.listen(3000);