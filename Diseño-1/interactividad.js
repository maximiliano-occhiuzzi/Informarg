// ======================================================
// MAPA BASE - ARGENMAP IGN
// ======================================================

const map = L.map('map', {
    center: [-38.4161, -63.6167],
    zoom: 4,
    minZoom: 3,
    maxZoom: 18
});

L.tileLayer(
    'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/' +
    'capabaseargenmap@EPSG:3857@png/{z}/{x}/{y}.png',
    {
        tms: true,
        attribution: '© Instituto Geográfico Nacional (IGN)',
        maxZoom: 18,
        opacity: 0.4
    }
).addTo(map);

// ======================================================
// VARIABLES GLOBALES
// ======================================================

let geojsonLayer = null;
let geojsonData = null;
let provinciaActual = "";

const municipiosLayers = {};

// ======================================================
// CAPA ACTIVA
// ======================================================

let capaActual = {
    campo: "Riesgo (Reescalado)",
    color1: "#FDDBC7",
    color2: "#67000D",
    nombre: "Riesgo general"
};

// ======================================================
// NIVELES LEYENDA
// ======================================================

const NIVELES = [
    { label: "0 – 2 Muy bajo", min: 0, max: 2 },
    { label: "2 – 4 Bajo", min: 2, max: 4 },
    { label: "4 – 6 Medio", min: 4, max: 6 },
    { label: "6 – 8 Alto", min: 6, max: 8 },
    { label: "8 – 10 Muy alto", min: 8, max: 10 }
];

// ======================================================
// COLORES
// ======================================================

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return [r, g, b];
}

function interpolarColor(valor, color1, color2) {

    const t = Math.max(0, Math.min(10, valor)) / 10;

    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return `rgb(${r}, ${g}, ${b})`;
}

// ======================================================
// ESTILO POLIGONOS
// ======================================================

function estiloFeature(feature) {

    const valor = feature.properties[capaActual.campo] ?? 0;

    return {
        fillColor: interpolarColor(
            valor,
            capaActual.color1,
            capaActual.color2
        ),

        fillOpacity: 0.85,
        color: '#FFFFFF',
        weight: 0.8,
        opacity: 1
    };
}

// ======================================================
// POPUP
// ======================================================

function construirPopup(props) {

    const filas = [

    [
        "Riesgo general",
        props["Riesgo (Reescalado)"],
        "#C0392B"
    ],

    [
        "Vulnerabilidad",
        props["Vulnerabilidad"],
        "#2E6DA4"
    ],

    [
        "Capacidad de respuesta",
        props["Falta de Capacidad de Respuesta (Reescalado)"],
        "#2E7D52"
    ],

    [
        "Peligro y exposición",
        props["Peligro y Exposición (Reescalado)"],
        "#E07B2A"
    ]
];

    const filasHTML = filas.map(([label, val, color]) => {

        const valor = val != null
            ? Number(val).toFixed(2)
            : "—";

        return `
            <div class="popup-row">
                <span>${label}</span>
                <strong style="color:${color}">
                    ${valor}
                </strong>
            </div>
        `;
    }).join('');

  return `
    <div class="popup-captura">

        <div class="popup-header">
            <h4>${props.Departamento}</h4>
            <p>${props.Provincia}</p>
        </div>

        <div class="popup-body">
            ${filasHTML}

            <button
                class="btn-descargar-popup"
                onclick="descargarReportePopup(this)">

                Descargar reporte
            </button>

        </div>

    </div>
`;
}
// ======================================================
// DESCARGAR REPORTE POPUP
// ======================================================

window.descargarReportePopup = function(button) {

    const popup =
        button.closest('.popup-captura');

    if (!popup) return;

    html2canvas(popup, {

        backgroundColor: "#FFFFFF",
        scale: 2

    }).then(canvas => {

        const link =
            document.createElement('a');

        const titulo =
            popup.querySelector('h4')
                ?.textContent
                ?.replace(/\s+/g, '_');

        link.download =
            `reporte_${titulo}.png`;

        link.href =
            canvas.toDataURL('image/png');

        link.click();
    });
};

// ======================================================
// INTERACCIONES
// ======================================================

function onEachFeature(feature, layer) {

    const props = feature.properties;

    municipiosLayers[props.id] = layer;

    layer.on({

        mouseover(e) {

            e.target.setStyle({
                weight: 2,
                color: '#333',
                fillOpacity: 0.95
            });

            e.target.bringToFront();
        },

        mouseout(e) {
            geojsonLayer.resetStyle(e.target);
        },

        click(e) {

            const popup = L.popup({
                maxWidth: 320
            })

            .setLatLng(e.latlng)

            .setContent(
                construirPopup(props)
            );

            popup.openOn(map);
        }
    });
}

// ======================================================
// LEYENDA
// ======================================================

function actualizarLeyenda() {

    const contenedor =
        document.getElementById('leyenda');

    contenedor.innerHTML = NIVELES.map(nivel => {

        const color = interpolarColor(
            (nivel.min + nivel.max) / 2,
            capaActual.color1,
            capaActual.color2
        );

        return `
            <div class="leyenda-nivel">

                <div
                    class="leyenda-cuadro"
                    style="background:${color}">
                </div>

                <span>${nivel.label}</span>

            </div>
        `;
    }).join('');

    document.getElementById(
        'currentLayerInfo'
    ).textContent = capaActual.nombre;
}

// ======================================================
// RENDERIZAR CAPA
// ======================================================

function renderizarCapa() {

    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }

    const features = provinciaActual

        ? geojsonData.features.filter(f =>
            f.properties.Provincia === provinciaActual
        )

        : geojsonData.features;

    document.getElementById('contador').innerHTML =
        `Mostrando <strong>${features.length}</strong> departamentos`;

    geojsonLayer = L.geoJSON({

        type: "FeatureCollection",
        features

    }, {

        style: estiloFeature,
        onEachFeature

    }).addTo(map);

    actualizarLeyenda();
}

// ======================================================
// CARGAR GEOJSON
// ======================================================

fetch('/Diseño-1/INFORM_web.geojson')

    .then(res => {

        if (!res.ok) {
            throw new Error(
                `HTTP ${res.status}`
            );
        }

        return res.json();
    })

    .then(data => {

        geojsonData = data;

        // ==========================================
        // PROVINCIAS
        // ==========================================

        const provincias = [

            ...new Set(
                data.features
                    .map(f => f.properties.Provincia)
                    .filter(Boolean)
            )

        ].sort();

        const select =
            document.getElementById(
                'filtro-provincia'
            );

        provincias.forEach(p => {

            const option =
                document.createElement('option');

            option.value = p;
            option.textContent = p;

            select.appendChild(option);
        });

        renderizarCapa();

        document.getElementById(
            'loading'
        ).style.display = 'none';
    })

    .catch(error => {

        console.error(error);

        mostrarToast(
            'Error al cargar INFORM_web.geojson'
        );

        document.getElementById(
            'loading'
        ).style.display = 'none';
    });

// ======================================================
// BOTONES DE CAPA
// ======================================================

document.querySelectorAll('.capa-btn')
    .forEach(btn => {

        btn.addEventListener('click', () => {

            document.querySelectorAll('.capa-btn')
                .forEach(b =>
                    b.classList.remove('active')
                );

            btn.classList.add('active');

            capaActual = {

                campo: btn.dataset.campo,

                color1: btn.dataset.color1,

                color2: btn.dataset.color2,

                nombre: btn.textContent.trim()
            };

            if (geojsonData) {
                renderizarCapa();
            }
        });
    });

// ======================================================
// FILTRO PROVINCIA
// ======================================================

document.getElementById('filtro-provincia')
    .addEventListener('change', e => {

        provinciaActual = e.target.value;

        if (!geojsonData) return;

        renderizarCapa();

        if (
            provinciaActual &&
            geojsonLayer.getBounds().isValid()
        ) {

            map.fitBounds(
                geojsonLayer.getBounds(),
                {
                    padding: [20, 20]
                }
            );

        } else {

            map.setView(
                [-38.4161, -63.6167],
                4
            );
        }
    });

// ======================================================
// TOAST
// ======================================================

function mostrarToast(msg) {

    const toast =
        document.getElementById('toast');

    toast.textContent = msg;

    toast.classList.add('visible');

    setTimeout(() => {

        toast.classList.remove('visible');

    }, 4000);
}
