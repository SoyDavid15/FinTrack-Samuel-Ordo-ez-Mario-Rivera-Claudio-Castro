// front/src/componentes/ListaMovimientos.jsx
// Componente que renderiza el historial de movimientos financieros.
// Usa key={mov.id} (nunca el índice del array) para identificar cada elemento del DOM.

import './ListaMovimientos.css';

const FORMATO_MONEDA = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

/**
 * @param {Array} movimientos - Lista de movimientos obtenida desde la API
 */
function ListaMovimientos({ movimientos }) {
  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="lista">
        <h2 className="lista__titulo">Historial de Movimientos</h2>
        <p className="lista__vacia">Aún no hay movimientos registrados. ¡Agrega el primero!</p>
      </div>
    );
  }

  return (
    <div className="lista">
      <h2 className="lista__titulo">
        Historial de Movimientos
        <span style={{ marginLeft: 8, fontWeight: 400, color: '#7f8c8d', fontSize: 14 }}>
          ({movimientos.length})
        </span>
      </h2>
      <ul className="lista__ul">
        {/* key={mov.id}: identificador único del servidor, nunca el índice del array */}
        {movimientos.map((mov) => (
          <li key={mov.id} className={`lista__item lista__item--${mov.tipo}`}>
            <span className="lista__descripcion">{mov.descripcion}</span>
            <span className="lista__fecha">{mov.fecha}</span>
            <span className={`lista__monto lista__monto--${mov.tipo}`}>
              {mov.tipo === 'gasto' ? '- ' : '+ '}
              {FORMATO_MONEDA.format(mov.monto)}
            </span>
            <span className={`lista__badge lista__badge--${mov.tipo}`}>
              {mov.tipo}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaMovimientos;
