const http = require('http');
const d = [4.5, 3.5, 2.5, 4.0];

function responder(res, codigo, datos) {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(datos));
}

const s = http.createServer((req, res) => {
  if (req.url === '/salud') {
    responder(res, 200, { estado: 'ok' });
    return;
  }
  if (req.url === '/equipo') {
    responder(res, 200, { equipo: 'Equipo 1',
      integrantes: ['Claudio', 'Mario','Samuel'] });
    return;
  }
  if (req.url === '/notas') {
    let t = 0;
    for (let i = 0; i < d.length; i++) { t = t + d[i]; }
    let p = t / d.length;
    responder(res, 200, { promedio: p, aprobado: p >= 3.0 });
    return;
  }
  responder(res, 404, { error: 'Ruta no encontrada' });
});
s.listen(80);