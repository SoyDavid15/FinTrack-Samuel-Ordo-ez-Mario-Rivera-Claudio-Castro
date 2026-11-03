const http = require('http');

const NOTA_MINIMA_APROBATORIA = 3.0;
const calificacionesEstudiante = [4.5, 3.5, 2.5, 4.0];

function calcularPromedioNotas(calificaciones) {
  const sumaTotal = calificaciones.reduce((acumuladoSuma, notaActual) => acumuladorSuma + notaActual, 0);
  return sumaTotal / calificaciones.length;
}

function verificarAprobacion(promedio, notaMinima) {
  return promedio >= notaMinima;
}

const servidor = http.createServer((req, res) => {
  if (req.url === '/salud') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ estado: 'ok' }));
    return;
  }

  if (req.url === '/equipo') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      equipo: 'Equipo 01',
      integrantes: ['Samuel Ordoñez', 'Mario Rivera', 'Claudio Castro']
    }));
    return;
  }

  if (req.url === '/notas') {
    const promedioCalculado = calcularPromedioNotas(calificacionesEstudiante);
    const estaAprobado = verificarAprobacion(promedioCalculado, NOTA_MINIMA_APROBATORIA);

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      promedio: promedioCalculado,
      aprobado: estaAprobado
    }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

servidor.listen(80);