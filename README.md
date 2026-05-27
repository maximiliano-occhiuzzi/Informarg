# 🗺️ Mapa de Riesgo Argentina

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![GeoJSON](https://img.shields.io/badge/GeoJSON-004B87?style=for-the-badge&logo=json&logoColor=white)

![Status](https://img.shields.io/badge/estado-activo-brightgreen?style=flat-square)
![Cobertura](https://img.shields.io/badge/cobertura-nacional-blue?style=flat-square&logo=googlemaps)
![Departamentos](https://img.shields.io/badge/departamentos-~500-orange?style=flat-square)
![Licencia](https://img.shields.io/badge/licencia-académica-lightgrey?style=flat-square)
![Argentina](https://img.shields.io/badge/país-Argentina-74ACDF?style=flat-square)

Sistema de visualización geoespacial interactiva de riesgo de desastres a nivel departamental, basado en el índice **INFORM Argentina**.

---

## 📋 Descripción

Esta aplicación web permite explorar los índices de riesgo, vulnerabilidad, peligro y capacidad de respuesta para los **~500 departamentos** de la República Argentina, a partir de los datos del modelo INFORM adaptado al contexto nacional.

Incluye visualización dinámica por capas temáticas, filtros por provincia, búsqueda de departamentos, y generación de reportes descargables en formato imagen.

---

## 🚀 Funcionalidades

- **Mapa interactivo** con capas temáticas seleccionables
- **Índices visualizados:**
  - Índice de Riesgo (Multiriesgo, Sísmico, Inundaciones, Incendios)
  - Peligro y Exposición (Multiamenaza, Sísmico, Inundaciones, Incendios)
  - Vulnerabilidad
  - Falta de Capacidad de Respuesta
- **Mini-mapa** contextual por provincia al hacer clic en un departamento
- **Filtro por provincia** y **buscador** de departamentos con autocompletado
- **Leyenda dinámica** que se actualiza según la capa activa
- **Reporte descargable** en formato PNG apaisado por departamento
- Cartografía base del **Instituto Geográfico Nacional (IGN)**

---

## 🗂️ Estructura del proyecto

```
├── index.html                    # Estructura principal de la aplicación
├── estilos.css                   # Estilos y diseño visual
├── interactividad.js             # Lógica del mapa, popups y reportes
├── INFORM_web_enriched.geojson   # Datos geoespaciales enriquecidos
└── README.md
```

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| [![Leaflet](https://img.shields.io/badge/Leaflet_1.9.4-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/) | Mapa interactivo |
| ![GeoJSON](https://img.shields.io/badge/GeoJSON-004B87?style=flat-square&logo=json&logoColor=white) | Geometrías departamentales |
| ![Canvas](https://img.shields.io/badge/Canvas_API-E34F26?style=flat-square&logo=html5&logoColor=white) | Mini-mapas y reportes PNG |
| ![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Frontend sin frameworks |
| ![IGN](https://img.shields.io/badge/IGN_WMS/TMS-2E86AB?style=flat-square&logo=googlemaps&logoColor=white) | Capa base cartográfica |

---

## 📦 Instalación y uso

El proyecto no requiere instalación ni dependencias de Node. Simplemente servir los archivos con cualquier servidor HTTP estático.

### ![LiveServer](https://img.shields.io/badge/VS_Code-Live_Server-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white) Opción 1 — VS Code Live Server

Instalar la extensión **Live Server** y hacer clic en *Open with Live Server* sobre `index.html`.

### ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) Opción 2 — Python

```bash
python -m http.server 8080
```

Luego abrir `http://localhost:8080` en el navegador.

### ![Node](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) Opción 3 — Node.js

```bash
npx serve .
```

> ⚠️ **Importante:** la aplicación realiza un `fetch` al archivo `INFORM_web_enriched.geojson`. Abrir `index.html` directamente como archivo local (`file://`) bloqueará esta petición por política CORS del navegador. Es necesario usar un servidor.

---

## 📊 Datos

Los datos provienen del modelo **INFORM Argentina**, adaptación nacional del índice global [INFORM](https://drmkc.jrc.ec.europa.eu/inform-index) (Index for Risk Management).

Las geometrías departamentales corresponden al **Instituto Geográfico Nacional (IGN)** de la República Argentina.

**Fuente:**
> Sarkis Badola, T.M. (2026). *INFORM Argentina*. INDEC Censo 2022 · IGN.

---

## 🗺️ Capas temáticas

| Capa | Campo GeoJSON | Escala |
|---|---|---|
| ![Riesgo](https://img.shields.io/badge/-Índice_de_Riesgo-C0392B?style=flat-square) | `Riesgo (Reescalado)` | 0 – 10 |
| ![Sismico](https://img.shields.io/badge/-Riesgo_Sísmico-8E44AD?style=flat-square) | `Riesgo Actividad Sísmica (Reescalado)` | 0 – 10 |
| ![Inundaciones](https://img.shields.io/badge/-Riesgo_Inundaciones-2980B9?style=flat-square) | `Riesgo Inundaciones (Reescalado)` | 0 – 10 |
| ![Incendios](https://img.shields.io/badge/-Riesgo_Incendios-E67E22?style=flat-square) | `Riesgo Incendios Forestales (Reescalado)` | 0 – 10 |
| ![Peligro](https://img.shields.io/badge/-Peligro_y_Exposición-E07B2A?style=flat-square) | `Peligro y Exposición (Reescalado)` | 0 – 10 |
| ![Vulnerabilidad](https://img.shields.io/badge/-Vulnerabilidad-2E6DA4?style=flat-square) | `Vulnerabilidad` | 0 – 10 |
| ![Capacidad](https://img.shields.io/badge/-Cap._de_Respuesta-2E7D52?style=flat-square) | `Falta de Capacidad de Respuesta (Reescalado)` | 0 – 10 |

---

## 🖨️ Reporte descargable

Al hacer clic sobre cualquier departamento en el mapa, se despliega un popup con los índices detallados. El botón **"Descargar reporte"** genera un PNG apaisado con:

- Nombre del departamento y provincia
- Mini-mapa contextual de la provincia con el departamento resaltado
- Población Censo 2022
- Tabla completa de índices con barras proporcionales
- Fuente bibliográfica y marca institucional

---

## 📄 Licencia

![Licencia](https://img.shields.io/badge/licencia-académica--técnica-lightgrey?style=flat-square)

Desarrollo académico-técnico. Los datos geoespaciales son de uso público conforme a la política de datos abiertos del IGN y el INDEC.

---

*República Argentina · 2026*
