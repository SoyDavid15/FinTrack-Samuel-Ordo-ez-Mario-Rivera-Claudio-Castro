# FinTrack — Gestor de Ingresos y Gastos

Aplicación web full-stack para el control de finanzas personales que permite registrar ingresos y egresos, visualizar el balance financiero en tiempo real y consultar el historial filtrado de movimientos. Desarrollado para la asignatura **Buenas Prácticas de Desarrollo de Software (CUC 2026)**.

## Integrantes

* **Samuel Ordóñez:** Arquitectura del back-end en Node.js/Express, capa de lógica de negocio (`reglas-finanzas.js`), pruebas unitarias con Vitest y despliegue en AWS.
* **Mario Rivera:** Desarrollo de componentes de interfaz en React (`FormularioMovimiento`, `ListaMovimientos`), filtrado y búsqueda en historial, integración con API y documentación técnica.
* **Claudio Castro:** Estructura del front-end en Vite/React (`App.jsx`, `TarjetaResumen.jsx`), estilos CSS, configuración de variables de entorno y despliegue en AWS S3/EC2.

## Tecnologías

* **Front-end:** React 19, Vite, JavaScript (ES6+), CSS3, Fetch API.
* **Back-end:** Node.js, Express, CORS.
* **Testing:** Vitest.
* **Infraestructura y Control de Versiones:** AWS (S3 y EC2), Git y GitHub (flujo GitFlow con Pull Requests).