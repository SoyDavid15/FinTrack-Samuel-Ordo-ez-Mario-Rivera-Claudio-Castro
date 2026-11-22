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

## Cómo levantarlo en local

1. Clonar el repositorio:
```bash
git clone [https://github.com/SoyDavid15/FinTrack-Samuel-Ordo-ez-Mario-Rivera-Claudio-Castro.git](https://github.com/SoyDavid15/FinTrack-Samuel-Ordo-ez-Mario-Rivera-Claudio-Castro.git)
cd FinTrack-Samuel-Ordo-ez-Mario-Rivera-Claudio-Castro
```

2. Configurar y levantar el back-end (`api/`):
```bash
cd api
cp .env.example .env
npm install
npm run dev
```
*(La API quedará escuchando por defecto en `http://localhost:3000`).*

3. Configurar y levantar el front-end (`front/`):
```bash
cd ../front
cp .env.example .env.development
npm install
npm run dev
```
## Endpoints de la API

Método,Ruta,Qué hace,Respuesta
GET,/movimientos,Lista todos los movimientos financieros registrados,200 Arreglo JSON de movimientos
GET,/movimientos/resumen,"Calcula total de ingresos, total de gastos, saldo y estado (SALUDABLE / DEFICIT)",200 Objeto JSON con resumen
POST,/movimientos,"Valida y registra un nuevo ingreso o gasto (requiere descripcion, tipo y monto > 0)",201 Movimiento creado / 400 Error de validación

