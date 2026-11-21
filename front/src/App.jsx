// front/src/App.jsx
// Componente raíz de FinTrack.
// Gestiona el estado global con useState y coordina los datos entre componentes hijos.

import { useState, useEffect } from 'react';
import { obtenerMovimientos, obtenerResumen, crearMovimiento } from './api';

// Componentes hijos (DRY: cada uno hace una sola cosa)
import TarjetaResumen       from './componentes/TarjetaResumen';
import FormularioMovimiento from './componentes/FormularioMovimiento';
import ListaMovimientos     from './componentes/ListaMovimientos';

import './App.css';

function App() {
  // ── Estado global de la aplicación ───────────────────────────────────────
  const [movimientos, setMovimientos] = useState([]);
  const [resumen, setResumen]         = useState(null);
  const [cargando, setCargando]       = useState(true);
  const [errorGlobal, setErrorGlobal] = useState(null);

  // ── Carga inicial de datos al montar el componente ────────────────────────
  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    setErrorGlobal(null);
    try {
      // Peticiones en paralelo para mejor rendimiento
      const [listaMovimientos, resumenFinanciero] = await Promise.all([
        obtenerMovimientos(),
        obtenerResumen()
      ]);
      setMovimientos(listaMovimientos);
      setResumen(resumenFinanciero);
    } catch (err) {
      setErrorGlobal('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
      console.error('Error al cargar datos:', err.message);
    } finally {
      setCargando(false);
    }
  }

  // ── Manejador de nuevo movimiento ─────────────────────────────────────────
  async function handleMovimientoAgregado(nuevoMovimiento) {
    // La función de api.js lanza un Error si el servidor responde con 400 o 500
    await crearMovimiento(nuevoMovimiento);
    // Recarga los datos para reflejar el cambio en resumen y lista
    await cargarDatos();
  }

  // ── Determina el tipo de tarjeta del saldo según el estado del servidor ───
  function tipoSaldo(estado) {
    if (!estado) return 'saldo';
    return estado === 'DEFICIT' ? 'deficit' : 'saldo';
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Encabezado */}
      <header className="encabezado">
        <h1 className="encabezado__titulo">💰 FinTrack</h1>
        <p className="encabezado__subtitulo">
          Controla tus ingresos y gastos de forma efectiva
        </p>
      </header>

      {/* Error global de conexión */}
      {errorGlobal && (
        <div className="estado-error">
          ⚠ {errorGlobal}
          <button
            onClick={cargarDatos}
            style={{ marginLeft: 12, textDecoration: 'underline', background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}
          >
            Reintentar
          </button>
        </div>
      )}

      {cargando ? (
        <p className="estado-carga">⏳ Cargando datos financieros...</p>
      ) : (
        <>
          {/* ── Tarjetas de resumen: TarjetaResumen reutilizado 3 veces (DRY front) ── */}
          <section className="resumen" aria-label="Resumen financiero">
            <TarjetaResumen
              titulo="Total Ingresos"
              valor={resumen?.totalIngresos}
              tipo="ingreso"
            />
            <TarjetaResumen
              titulo="Total Gastos"
              valor={resumen?.totalGastos}
              tipo="gasto"
            />
            <TarjetaResumen
              titulo="Saldo Actual"
              valor={resumen?.saldo}
              tipo={tipoSaldo(resumen?.estado)}
              estado={resumen?.estado}
            />
          </section>

          {/* ── Formulario para agregar movimiento ── */}
          <section className="seccion">
            <FormularioMovimiento onMovimientoAgregado={handleMovimientoAgregado} />
          </section>

          {/* ── Lista del historial de movimientos ── */}
          <section className="seccion">
            <ListaMovimientos movimientos={movimientos} />
          </section>
        </>
      )}

      <footer className="pie">
        <p>FinTrack · Equipo 01 · Samuel Ordóñez, Mario Rivera, Claudio Castro · CUC 2026</p>
      </footer>
    </div>
  );
}

export default App;
