import http from 'node:http';
let visitas = 0;
const servidor = http.createServer(function (req, res) {
  console.log(req.method, req.url);

  if (req.url === '/') { visitas = visitas + 1;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<h1>Minha página</h1><p>Esta página foi visitada ${visitas} vezes</p>`);
} else if (req.url === '/api/status') {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ visitas: visitas, horario: new Date() }));
} else {  
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Página não encontrada</h1>');
  }
});

servidor.listen(3000, function () {
  console.log('Servidor rodando em http://localhost:3000');
});