# Spec Delta

## Purpose

Proveer la base visual y funcional del Dashboard de Modelos de IA: una página que presenta en tabla las métricas de cada modelo desde `mock-data.json` para validación del departamento de diseño.

## ADDED Requirements

### Requirement: Estructura base de la página del dashboard

La página SHALL presentar una cabecera identificativa del dashboard y una tabla con una columna por cada métrica solicitada: modelo, precio input, precio output, TTFT, modalidad de entrada, modalidad de salida, consumo diario y consumo semanal.

#### Scenario: Apertura de la página con tabla vacía antes de cargar datos

- **WHEN** el usuario abre la página en el navegador
- **THEN** el sistema muestra la cabecera del dashboard y la tabla con sus encabezados de columna visibles aunque los datos aún no se hayan cargado

#### Scenario: Columnas completas según diseño

- **WHEN** el usuario inspecciona el encabezado de la tabla
- **THEN** el sistema muestra columnas para nombre del modelo, precio input por token, precio output por token, TTFT en ms, modalidad de entrada, modalidad de salida, tokens de entrada/salida diarios y tokens de entrada/salida semanales

### Requirement: Carga dinámica de modelos desde mock-data.json

La página SHALL obtener los datos de los modelos mediante `fetch` sobre `mock-data.json` y SHALL renderizar una fila por cada modelo del fichero con sus valores correspondientes.

#### Scenario: Carga exitosa de los 10 modelos

- **WHEN** `mock-data.json` responde correctamente con el listado de modelos
- **THEN** el sistema inserta una fila por modelo en el cuerpo de la tabla con todos sus valores (nombre, precios, TTFT, modalidades y consumos)

#### Scenario: Valores numéricos fieles a la fuente

- **WHEN** la tabla ya está poblada
- **THEN** cada celda numérica muestra el valor exacto del campo correspondiente del JSON sin redondeos que alteren el dato (precio input/output por token, `ttft_ms`, tokens diarios y semanales de entrada y salida)

### Requirement: Estados de carga y error visibles

La página SHALL informar al usuario mientras los datos se están cargando y SHALL mostrar un mensaje de error comprensible cuando la carga de `mock-data.json` falle.

#### Scenario: Indicador de carga

- **WHEN** la petición de datos está en curso
- **THEN** el sistema muestra un mensaje de estado de carga en la zona de la tabla

#### Scenario: Fallo de carga del fichero de datos

- **WHEN** la petición a `mock-data.json` falla (fichero ausente, ruta incorrecta o respuesta no válida)
- **THEN** el sistema muestra un mensaje de error visible en la página y no deja la tabla en un estado vacío sin explicación

### Requirement: Funcionamiento autónomo sin dependencias externas

La página SHALL funcionar con tecnologías estándar del navegador (HTML5, CSS3 y JavaScript plano) sin requerir librerías, frameworks externos ni conexión a servicios de terceros para renderizar la tabla base.

#### Scenario: Apertura sin conexión a CDNs

- **WHEN** el usuario abre la página en un entorno sin acceso a CDNs ni paquetes externos
- **THEN** la estructura, los estilos y el renderizado de la tabla funcionan con los recursos locales de la página
