import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const alunos = [];
app.get('/ola/:nome', function (req, res) {
  res.send(`<h1>Olá, ${req.params.nome}!</h1>`);
});
app.get('/busca', function (req, res) {
  const termo = (req.query.termo || '').toLowerCase();
  const encontrados = [];
  for (const aluno of alunos) {
    if (aluno.nome.toLowerCase().includes(termo)) {
      encontrados.push(aluno);
    }
  }
  res.json(encontrados);
});
app.post('/alunos', function (req, res) {
  if (req.body === undefined) {
    res.status(400).send('<h1>Nenhum dado foi recebido.</h1><a href="/cadastro.html">Voltar</a>');
    return;
  }
  const nome = (req.body.nome || '').trim();
  const email = (req.body.email || '').trim();
  const cursoDoAluno = (req.body.curso || '').trim();
  const erros = [];
  if (nome.length < 3) {
    erros.push('O nome precisa ter pelo menos 3 letras.');
  }
  if (!email.includes('@')) {
    erros.push('Informe um e-mail válido.');
  }
  if (cursoDoAluno === '') {
    erros.push('Escolha um curso.');
  }
  // DESAFIO 2: e-mail repetido
  for (const aluno of alunos) {
    if (aluno.email === email) {
      erros.push('Este e-mail já está cadastrado');
    }
  }
  if (erros.length > 0) {
    let lista = '';
    for (const erro of erros) {
      lista += `<li>${erro}</li>`;
    }
    res.status(400).send(`
      <h1>Não foi possível cadastrar</h1>
      <ul>${lista}</ul>
      <a href="/cadastro.html">Voltar ao formulário</a>
    `);
    return;
  }
  alunos.push({ nome: nome, email: email, curso: cursoDoAluno });
  res.status(201).send(`
    <h1>Aluno cadastrado!</h1>
    <p>${nome} foi cadastrado(a) no curso ${cursoDoAluno}.</p>
    <a href="/alunos">Ver todos</a> | <a href="/cadastro.html">Cadastrar outro</a>
  `);
});
// DESAFIO 1: lista em JSON
app.get('/api/alunos', function (req, res) {
  res.json(alunos);
});
app.get('/alunos', function (req, res) {
  let itens = '';
  for (const aluno of alunos) {
    itens += `<li>${aluno.nome} (${aluno.email}) - ${aluno.curso}</li>`;
  }
  if (alunos.length === 0) {
    itens = '<li>Nenhum aluno cadastrado ainda.</li>';
  }
  res.send(`
    <h1>Alunos cadastrados</h1>
    <ul>${itens}</ul>
    <a href="/cadastro.html">Cadastrar aluno</a> | <a href="/">Início</a>
  `);
});
// DESAFIO 3: aluno por posição
app.get('/alunos/:posicao', function (req, res) {
  const posicao = Number(req.params.posicao);
  const aluno = alunos[posicao];

  if (aluno === undefined) {
    res.status(404).send('<h1>Aluno não encontrado</h1><a href="/alunos">Ver todos</a>');
    return;
  }

  res.send(`
    <h1>${aluno.nome}</h1>
    <p>E-mail: ${aluno.email}</p>
    <p>Curso: ${aluno.curso}</p>
    <a href="/alunos">Voltar</a>
  `);
});
app.use(function (req, res) {
  res.status(404).send('<h1>404 - Página não encontrada</h1><a href="/">Ir para o início</a>');
});

app.listen(3000, function () {
  console.log('Servidor rodando em http://localhost:3000');
});
