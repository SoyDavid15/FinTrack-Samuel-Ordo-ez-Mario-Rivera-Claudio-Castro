const http = require('http');
 
const d = [4.5, 3.5, 2.5, 4.0];

// Corrección Señal 2: Se extrae la lógica del cálculo a su propia función
function calcularPromedio(notas) {
  return notas.reduce((suma, n) => suma + n, 0) / notas.length;
}
 
const s = http.createServer((req, res) => {
 
  if (req.url === '/salud') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ estado: 'ok' }));
    return;
  }
 
  if (req.url === '/equipo') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ equipo: 'Equipo 01',
                             integrantes: ['Samuel Ordoñez', 'Mario Rivera', 'Claudio Castro'] }));
    return;
  }
 
  if (req.url === '/notas') {
    // Corrección Señal 2: La presentación ya no calcula, solo llama a la lógica
    let p = calcularPromedio(d); 
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ promedio: p, aprobado: p >= 3.0 }));
    return;
  }
 
  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});
 
s.listen(80);