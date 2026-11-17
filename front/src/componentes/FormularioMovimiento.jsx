// front/src/componentes/FormularioMovimiento.jsx
// Componente que maneja el formulario de agregar un nuevo movimiento financiero.

import { useState } from 'react';
import './FormularioMovimiento.css';

const ESTADO_INICIAL = { descripcion: '', monto: '', tipo: 'ingreso' };

/**
 * @param {function} onMovimientoAgregado - Callback que App ejecuta tras un POST exitoso
 */
function FormularioMovimiento({ onMovimientoAgregado }) {
  const [campos, setCampos] = useState(ESTADO_INICIAL);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setCampos(prev => ({ ...prev, [name]: value }));
    if (error) setError(null); // Limpia el error al escribir
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setCargando(true);
    setError(null);

    try {
      await onMovimientoAgregado({
        descripcion: campos.descripcion,
        monto: Number(campos.monto),
        tipo: campos.tipo
      });
      setCampos(ESTADO_INICIAL); // Resetear formulario al éxito
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="formulario">
      <h2 className="formulario__titulo">Registrar Movimiento</h2>
      <form onSubmit={manejarEnvio}>
        <div className="formulario__campos">
          <input
            className="formulario__input"
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={campos.descripcion}
            onChange={manejarCambio}
            required
          />
          <input
            className="formulario__input"
            type="number"
            name="monto"
            placeholder="Monto (COP)"
            value={campos.monto}
            onChange={manejarCambio}
            min="0.01"
            step="any"
            required
          />
          <select
            className="formulario__select"
            name="tipo"
            value={campos.tipo}
            onChange={manejarCambio}
          >
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>
          <button
            className="formulario__boton"
            type="submit"
            disabled={cargando}
          >
            {cargando ? 'Guardando...' : '+ Agregar'}
          </button>
        </div>
      </form>
      {error && <p className="formulario__error">⚠ {error}</p>}
    </div>
  );
}

export default FormularioMovimiento;
