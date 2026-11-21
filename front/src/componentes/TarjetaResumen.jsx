// front/src/componentes/TarjetaResumen.jsx
// Componente reutilizable que muestra una tarjeta de resumen financiero.
// Se utiliza 3 veces en App.jsx: Ingresos, Gastos y Saldo (cumple requisito DRY del front).

import './TarjetaResumen.css';

/**
 * @param {string}  titulo   - Etiqueta visible de la tarjeta (ej. "Total Ingresos")
 * @param {number}  valor    - Monto a mostrar formateado en COP
 * @param {string}  tipo     - 'ingreso' | 'gasto' | 'saldo' | 'deficit' (controla el color)
 * @param {string}  [estado] - Texto adicional opcional (ej. "SUPERAVIT", "DEFICIT")
 */
function TarjetaResumen({ titulo, valor, tipo, estado }) {
  const valorFormateado = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor ?? 0);

  return (
    <div className={`tarjeta tarjeta--${tipo}`}>
      <p className="tarjeta__titulo">{titulo}</p>
      <p className={`tarjeta__valor tarjeta__valor--${tipo}`}>
        {valorFormateado}
      </p>
      {estado && <p className="tarjeta__estado">{estado}</p>}
    </div>
  );
}

export default TarjetaResumen;
