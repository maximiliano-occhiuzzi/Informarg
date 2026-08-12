// SUBCAPAS DE RIESGO

const SUBCAPAS_RIESGO = [
    {
        key:    "riesgo-sismica",
        campo:  "Riesgo Actividad Sísmica (Reescalado)",
        color1: "#FEE5D9",
        color2: "#67000D",
        nombre: "Riesgo Sísmico"
    },
    {
        key:    "riesgo-inundaciones",
        campo:  "Riesgo Inundaciones (Reescalado)",
        color1: "#FEE5D9",
        color2: "#67000D",
        nombre: "Riesgo por Inundaciones"
    },
    {
        key:    "riesgo-incendios",
        campo:  "Riesgo Incendios Forestales (Reescalado)",
        color1: "#FEE5D9",
        color2: "#67000D",
        nombre: "Riesgo por Incendios"
    },
    {
        key:    "riesgo-multi",
        campo:  "Riesgo (Reescalado)",
        color1: "#FEE5D9",
        color2: "#67000D",
        nombre: "Multiriesgo"
    }
];

// SUBCAPAS DE PELIGRO Y EXPOSICIÓN

const SUBCAPAS_PELIGRO = [
    {
        key:    "peligro-sismica",
        campo:  "Actividad Sísmica (Reescalado)",
        color1: "#FFF5EB",
        color2: "#7F2704",
        nombre: "Peligro Sísmico"
    },
    {
        key:    "peligro-inundaciones",
        campo:  "Inundaciones (Reescalado)",
        color1: "#FFF5EB",
        color2: "#7F2704",
        nombre: "Peligro por Inundaciones"
    },
    {
        key:    "peligro-incendios",
        campo:  "Incendios Forestales (Reescalado)",
        color1: "#FFF5EB",
        color2: "#7F2704",
        nombre: "Peligro por Incendios"
    },
    {
        key:    "peligro-multi",
        campo:  "Peligro y Exposición (Reescalado)",
        color1: "#FFF5EB",
        color2: "#7F2704",
        nombre: "Multiamenaza"
    }
];

// BREAKS CUANTÍLICOS

const QUANTILE_BREAKS = {
    "Vulnerabilidad":                               [0, 3.22, 4.08, 5.24, 6.21, 10],
    "Falta de Capacidad de Respuesta (Reescalado)": [0, 7.73, 8.02, 8.18, 8.37, 10],
};

// ESTADO GLOBAL

let geojsonData     = null;
let geojsonLayer    = null;
let provinciaActual = "";
let subMenuAbierto  = false;

let capaActual = {
    campo:  "Riesgo (Reescalado)",
    color1: "#FEE5D9",
    color2: "#67000D",
    nombre: "Multiriesgo"
};

// NIVELES LEYENDA

const NIVELES = [
    { label: "0 – 2  Muy bajo", min: 0,  max: 2  },
    { label: "2 – 4  Bajo",     min: 2,  max: 4  },
    { label: "4 – 6  Medio",    min: 4,  max: 6  },
    { label: "6 – 8  Alto",     min: 6,  max: 8  },
    { label: "8 – 10 Muy alto", min: 8,  max: 10 },
];

// MAPA BASE

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

// COLORES

function hexToRgb(hex) {
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16)
    ];
}

const PALETAS = {
    "#FEE5D9": ["#FEE5D9", "#FCAE91", "#FB6A4A", "#CB181D", "#67000D"],
    "#EFF3FF": ["#EFF3FF", "#9ECAE1", "#4292C6", "#2171B5", "#084594"],
    "#EDF8E9": ["#f7fcf5", "#c7e9c0", "#74c476", "#238b45", "#00441b"],
    "#FFF5EB": ["#FFF5EB", "#FDD0A2", "#FD8D3C", "#D94801", "#7F2704"],
};

function interpolarColor(valor, color1, color2, campo) {
    const paleta = PALETAS[color1];
    const breaks = campo ? QUANTILE_BREAKS[campo] : null;

    if (paleta && breaks) {
        const v = valor ?? 0;
        let idx = 0;
        for (let i = 0; i < 5; i++) {
            if (v >= breaks[i]) idx = i;
        }
        const lo = breaks[idx];
        const hi = breaks[Math.min(idx + 1, 5)];
        const t  = hi > lo ? Math.max(0, Math.min(1, (v - lo) / (hi - lo))) : 0;
        const c1 = hexToRgb(paleta[idx]);
        const c2 = hexToRgb(paleta[Math.min(idx + 1, 4)]);
        return `rgb(${Math.round(c1[0]+(c2[0]-c1[0])*t)},${Math.round(c1[1]+(c2[1]-c1[1])*t)},${Math.round(c1[2]+(c2[2]-c1[2])*t)})`;
    }

    if (paleta) {
        const v   = Math.max(0, Math.min(10, valor ?? 0));
        const idx = Math.min(Math.floor(v / 2), 4);
        const t   = (v % 2) / 2;
        const c1  = hexToRgb(paleta[idx]);
        const c2  = hexToRgb(paleta[Math.min(idx + 1, 4)]);
        return `rgb(${Math.round(c1[0]+(c2[0]-c1[0])*t)},${Math.round(c1[1]+(c2[1]-c1[1])*t)},${Math.round(c1[2]+(c2[2]-c1[2])*t)})`;
    }

    const t = Math.max(0, Math.min(10, valor ?? 0)) / 10;
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}

// ESTILO POLÍGONOS

function estiloFeature(feature) {
    const valor = feature.properties[capaActual.campo] ?? 0;
    return {
        fillColor:   interpolarColor(valor, capaActual.color1, capaActual.color2, capaActual.campo),
        fillOpacity: 0.85,
        color:       '#FFFFFF',
        weight:      0.8,
        opacity:     1
    };
}

// MINI-MAPA EN CANVAS

function extraerCoordenadas(geometry) {
    const coords = [];
    if (!geometry) return coords;
    if (geometry.type === 'Polygon') {
        for (const ring of geometry.coordinates)
            for (const pt of ring) coords.push(pt);
    } else if (geometry.type === 'MultiPolygon') {
        for (const poly of geometry.coordinates)
            for (const ring of poly)
                for (const pt of ring) coords.push(pt);
    }
    return coords;
}

function dibujarGeometria(ctx, geometry, toCanvas, fillColor, strokeColor, lineWidth) {
    if (!geometry) return;
    const rings = geometry.type === 'Polygon'
        ? geometry.coordinates
        : geometry.coordinates.flat();

    ctx.beginPath();
    for (const ring of rings) {
        let first = true;
        for (const [lng, lat] of ring) {
            const [px, py] = toCanvas(lng, lat);
            if (first) { ctx.moveTo(px, py); first = false; }
            else        ctx.lineTo(px, py);
        }
        ctx.closePath();
    }
    ctx.fillStyle   = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth   = lineWidth;
    ctx.stroke();
}

function dibujarMiniMapa(feature) {
    if (!geojsonData) return;

    const codigo   = feature.properties.Código;
    const provincia = feature.properties.Provincia;
    const canvas   = document.getElementById(`minimap-${codigo}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W   = canvas.width;
    const H   = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Fondo
    ctx.fillStyle = '#EBF2FA';
    ctx.fillRect(0, 0, W, H);

    // Features de la misma provincia
    const featuresProv = geojsonData.features.filter(
        f => f.properties.Provincia === provincia && f.geometry
    );
    if (featuresProv.length === 0) return;

    // Bounding box de la provincia
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const feat of featuresProv) {
        for (const [lng, lat] of extraerCoordenadas(feat.geometry)) {
            if (lng < minX) minX = lng;
            if (lng > maxX) maxX = lng;
            if (lat < minY) minY = lat;
            if (lat > maxY) maxY = lat;
        }
    }

    const pad    = 12;
    const scaleX = (W - pad * 2) / (maxX - minX || 1);
    const scaleY = (H - pad * 2) / (maxY - minY || 1);
    const scale  = Math.min(scaleX, scaleY);
    const offX   = pad + ((W - pad * 2) - (maxX - minX) * scale) / 2;
    const offY   = pad + ((H - pad * 2) - (maxY - minY) * scale) / 2;

    function toCanvas(lng, lat) {
        return [
            offX + (lng - minX) * scale,
            H - (offY + (lat - minY) * scale)
        ];
    }

    // Dibujar todos los deptos de la provincia en gris
    for (const feat of featuresProv) {
        dibujarGeometria(ctx, feat.geometry, toCanvas, '#C8D8E8', '#FFFFFF', 0.5);
    }

    // Dibujar el depto seleccionado con el color de la capa activa
    const valor        = feature.properties[capaActual.campo] ?? 0;
    const colorRelleno = interpolarColor(valor, capaActual.color1, capaActual.color2, capaActual.campo);
    dibujarGeometria(ctx, feature.geometry, toCanvas, colorRelleno, '#1B3A5C', 2);

    // Nombre del departamento — pill redondeada, sin borde duro
    const coordsTarget = extraerCoordenadas(feature.geometry);
    if (coordsTarget.length > 0) {
        let cx = 0, cy = 0;
        for (const [lng, lat] of coordsTarget) { cx += lng; cy += lat; }
        cx /= coordsTarget.length;
        cy /= coordsTarget.length;
        const [px, py] = toCanvas(cx, cy);

        const label  = feature.properties.Departamento;
        const fSize  = Math.max(8, Math.min(11, W / 30));
        ctx.font     = `600 ${fSize}px Inter, sans-serif`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        const tw  = ctx.measureText(label).width;
        const ph  = fSize + 6;   // alto pill
        const pw  = tw + 14;     // ancho pill
        const rx  = px - pw / 2;
        const ry  = py - ph / 2;
        const rad = ph / 2;

        // Sombra suave
        ctx.shadowColor   = 'rgba(0,0,0,0.18)';
        ctx.shadowBlur    = 4;
        ctx.shadowOffsetY = 1;

        // Fondo pill blanco semitransparente
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.beginPath();
        ctx.moveTo(rx + rad, ry);
        ctx.lineTo(rx + pw - rad, ry);
        ctx.quadraticCurveTo(rx + pw, ry, rx + pw, ry + rad);
        ctx.lineTo(rx + pw, ry + ph - rad);
        ctx.quadraticCurveTo(rx + pw, ry + ph, rx + pw - rad, ry + ph);
        ctx.lineTo(rx + rad, ry + ph);
        ctx.quadraticCurveTo(rx, ry + ph, rx, ry + ph - rad);
        ctx.lineTo(rx, ry + rad);
        ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
        ctx.closePath();
        ctx.fill();

        // Resetear sombra
        ctx.shadowColor   = 'transparent';
        ctx.shadowBlur    = 0;
        ctx.shadowOffsetY = 0;

        // Texto
        ctx.fillStyle = '#1B3A5C';
        ctx.fillText(label, px, py);
    }
}

// POPUP

function fila(label, val, color) {
    const txt = val != null ? Number(val).toFixed(2) : "—";
    const pct = val != null ? Math.min(100, ((val / 10) * 100)).toFixed(0) : 0;
    return `
        <div class="popup-row">
            <span>${label}</span>
            <span style="display:flex;align-items:center;gap:6px;font-weight:600;color:${color}">
                <span style="width:44px;height:5px;background:#eee;border-radius:3px;display:inline-block;overflow:hidden;">
                    <span style="display:block;height:100%;width:${pct}%;background:${color};border-radius:3px;"></span>
                </span>
                ${txt}
            </span>
        </div>`;
}

function seccion(titulo) {
    return `<div style="
        font-size:0.72rem;font-weight:700;text-transform:uppercase;
        letter-spacing:0.06em;color:#8A9BB0;
        padding:0.6rem 0 0.25rem;
        border-top:1px solid #E8EDF2;margin-top:2px;
    ">${titulo}</div>`;
}

function construirPopup(props) {
    const poblacion = props.Poblacion_2022
        ? Number(props.Poblacion_2022).toLocaleString('es-AR') + ' hab.'
        : 'Sin dato';

    const filasHTML =
        seccion("Riesgo") +
        fila("Multiriesgo",            props["Riesgo (Reescalado)"],                          "#C0392B") +
        fila("R. Sísmico",             props["Riesgo Actividad Sísmica (Reescalado)"],        "#8E44AD") +
        fila("R. Inundaciones",        props["Riesgo Inundaciones (Reescalado)"],             "#2980B9") +
        fila("R. Incendios",           props["Riesgo Incendios Forestales (Reescalado)"],     "#E67E22") +
        seccion("Peligro y Exposición") +
        fila("Multiamenaza",           props["Peligro y Exposición (Reescalado)"],            "#E07B2A") +
        fila("P. Sísmico",             props["Actividad Sísmica (Reescalado)"],               "#D35400") +
        fila("P. Inundaciones",        props["Inundaciones (Reescalado)"],                    "#2471A3") +
        fila("P. Incendios",           props["Incendios Forestales (Reescalado)"],            "#BA4A00") +
        seccion("Componentes") +
        fila("Vulnerabilidad",         props["Vulnerabilidad"],                               "#2E6DA4") +
        fila("Capacidad de respuesta", props["Falta de Capacidad de Respuesta (Reescalado)"], "#2E7D52");

    return `
        <div class="popup-captura">

            <!-- Header azul ancho completo -->
            <div class="popup-header">
                <h4>${props.Departamento}</h4>
                <p>${props.Provincia}</p>
            </div>

            <!-- Cuerpo horizontal: izquierda = mapa+población | derecha = datos -->
            <div class="popup-layout">

                <!-- Columna izquierda -->
                <div class="popup-col-izq">
                    <div class="popup-minimap-wrapper">
                        <canvas id="minimap-${props.Código}"
                            width="290" height="230"
                            style="width:100%;height:230px;">
                        </canvas>
                    </div>
                    <div class="popup-poblacion">
                        <span class="popup-pob-label">👥 Población Censo 2022</span>
                        <span class="popup-pob-valor">${poblacion}</span>
                    </div>
                </div>

                <!-- Divisor -->
                <div class="popup-divisor"></div>

                <!-- Columna derecha -->
                <div class="popup-col-der">
                    <div class="popup-body">
                        ${filasHTML}
                    </div>
                </div>

            </div>

            <!-- Footer -->
            <div class="popup-footer">
                <span class="popup-fuente">
                    Fuente: Sarkis Badola, T.M. (2026) · INFORM Argentina · INDEC Censo 2022 · IGN
                </span>
                <button class="btn-descargar-popup" onclick="descargarReportePopup(this)">
                    ⬇ Descargar reporte
                </button>
            </div>

        </div>`;
}

// DESCARGAR REPORTE

window.descargarReportePopup = function(button) {
    const popup = button.closest('.popup-captura');
    if (!popup) return;

    // ── Leer datos desde el popup ─────────────────────────────────────────
    const departamento = popup.querySelector('h4')?.textContent?.trim() ?? '';
    const provincia    = popup.querySelector('.popup-header p')?.textContent?.trim() ?? '';
    const poblacion    = popup.querySelector('.popup-pob-valor')?.textContent?.trim() ?? '';
    const minimapSrc   = popup.querySelector('canvas');

    const METRICAS = [
        { seccion: "RIESGO", items: [
            { label: "Multiriesgo",            color: "#C0392B" },
            { label: "R. Sísmico",             color: "#8E44AD" },
            { label: "R. Inundaciones",        color: "#2980B9" },
            { label: "R. Incendios",           color: "#E67E22" },
        ]},
        { seccion: "PELIGRO Y EXPOSICIÓN", items: [
            { label: "Multiamenaza",           color: "#E07B2A" },
            { label: "P. Sísmico",             color: "#D35400" },
            { label: "P. Inundaciones",        color: "#2471A3" },
            { label: "P. Incendios",           color: "#BA4A00" },
        ]},
        { seccion: "COMPONENTES", items: [
            { label: "Vulnerabilidad",         color: "#2E6DA4" },
            { label: "Capacidad de respuesta", color: "#2E7D52" },
        ]},
    ];

    // Extraer valores numéricos de las filas del popup
    const valores = {};
    popup.querySelectorAll('.popup-row').forEach(fila => {
        const label    = fila.querySelector('span:first-child')?.textContent?.trim();
        const valSpan  = fila.querySelector('span[style*="font-weight:600"]');
        const val      = valSpan ? parseFloat(valSpan.textContent) : null;
        if (label && val !== null && !isNaN(val)) valores[label] = val;
    });

    // ── Layout ────────────────────────────────────────────────────────────
    const SCALE    = 3;
    const PAD      = 20;

    // Columna izquierda
    const LEFT_W   = 300;
    const HEADER_H = 80;
    const MAP_H    = 260;
    const POB_H    = 52;
    const FOOTER_H = 44;

    // Columna derecha — altura real necesaria
    const ROW_H      = 32;
    const SEC_H      = 28;
    const RIGHT_PAD  = 24;
    const RIGHT_W    = 360;

    // totalRowH ya incluye RIGHT_PAD arriba; el de abajo lo absorbe CONTENT_H
    let totalRowH = RIGHT_PAD;
    for (const bloque of METRICAS) {
        totalRowH += SEC_H + bloque.items.length * ROW_H + 10;
    }
    // sin RIGHT_PAD final — las filas llegan hasta el borde

    // CONTENT_H: el mayor entre col izquierda fija y col derecha real
    const CONTENT_H  = Math.max(HEADER_H + MAP_H + POB_H, totalRowH);
    const MAP_H_REAL = CONTENT_H - HEADER_H - POB_H;
    const W_LOG      = PAD + LEFT_W + PAD + RIGHT_W + PAD;
    const H_LOG      = CONTENT_H + FOOTER_H;

    const canvas    = document.createElement('canvas');
    canvas.width    = W_LOG * SCALE;
    canvas.height   = H_LOG * SCALE;
    const ctx       = canvas.getContext('2d');
    ctx.scale(SCALE, SCALE);

    // helpers
    function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    // ── Fondo general ─────────────────────────────────────────────────────
    ctx.fillStyle = '#F0F4F8';
    ctx.fillRect(0, 0, W_LOG, H_LOG);

    // ── COLUMNA IZQUIERDA ─────────────────────────────────────────────────
    const LX = PAD;

    // Tarjeta izquierda: fondo blanco con bordes redondeados
    roundRect(LX, 0, LEFT_W, CONTENT_H, 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Header azul
    ctx.fillStyle = '#1B3A5C';
    roundRect(LX, 0, LEFT_W, HEADER_H, 0);
    ctx.fill();

    // Nombre departamento
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(departamento, LX + 16, 16);

    // Provincia
    ctx.fillStyle = '#A8C4DC';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(provincia, LX + 16, 50);

    // Mini-mapa — ocupa todo el espacio disponible entre header y población
    const MM_Y = HEADER_H;
    if (minimapSrc) {
        ctx.drawImage(minimapSrc, LX, MM_Y, LEFT_W, MAP_H_REAL);
    } else {
        ctx.fillStyle = '#EBF2FA';
        ctx.fillRect(LX, MM_Y, LEFT_W, MAP_H_REAL);
    }

    // Sutil borde inferior del mapa
    ctx.strokeStyle = '#C8D8E8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(LX, MM_Y + MAP_H_REAL);
    ctx.lineTo(LX + LEFT_W, MM_Y + MAP_H_REAL);
    ctx.stroke();

    // Banda población
    const POB_Y = HEADER_H + MAP_H_REAL;
    ctx.fillStyle = '#EEF5FF';
    ctx.fillRect(LX, POB_Y, LEFT_W, POB_H);

    ctx.fillStyle = '#4A6FA5';
    ctx.font = '11px Inter, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText('👥  Población Censo 2022', LX + 16, POB_Y + 10);

    ctx.fillStyle = '#1B3A5C';
    ctx.font = 'bold 17px Inter, sans-serif';
    ctx.fillText(poblacion, LX + 16, POB_Y + 26);

    // ── COLUMNA DERECHA ───────────────────────────────────────────────────
    const RX = PAD + LEFT_W + PAD;

    // Tarjeta derecha: fondo blanco
    roundRect(RX, 0, RIGHT_W, CONTENT_H, 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    let cy = RIGHT_PAD;

    for (const bloque of METRICAS) {
        // Cabecera de sección — línea izquierda de acento + texto
        ctx.fillStyle = '#1B3A5C';
        ctx.fillRect(RX + 14, cy + 2, 3, 16);

        ctx.fillStyle = '#1B3A5C';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText(bloque.seccion, RX + 22, cy + 10);

        // Línea separadora bajo el título de sección
        ctx.strokeStyle = '#D8E4EF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(RX + 14, cy + SEC_H - 4);
        ctx.lineTo(RX + RIGHT_W - 14, cy + SEC_H - 4);
        ctx.stroke();

        cy += SEC_H;

        for (const item of bloque.items) {
            const val = valores[item.label];
            const txt = val != null ? val.toFixed(2) : '—';
            const pct = val != null ? Math.min(100, (val / 10) * 100) : 0;

            // Fondo de fila alterno suave
            ctx.fillStyle = 'rgba(240,244,248,0.5)';
            ctx.fillRect(RX, cy, RIGHT_W, ROW_H);

            // Label
            ctx.fillStyle = '#2A3A4A';
            ctx.font = '13px Inter, sans-serif';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'left';
            ctx.fillText(item.label, RX + 16, cy + ROW_H / 2);

            // Barra de fondo — más larga
            const VAL_W = 46;
            const BAR_W = 100;
            const BAR_H = 7;
            const BAR_X = RX + RIGHT_W - VAL_W - BAR_W - 18;
            const BAR_Y = cy + ROW_H / 2 - BAR_H / 2;

            ctx.fillStyle = '#E2E9F0';
            roundRect(BAR_X, BAR_Y, BAR_W, BAR_H, 3);
            ctx.fill();

            // Barra de valor con mínimo visible
            const barValW = pct > 0 ? Math.max(BAR_H, BAR_W * pct / 100) : 0;
            if (barValW > 0) {
                ctx.fillStyle = item.color;
                roundRect(BAR_X, BAR_Y, barValW, BAR_H, 3);
                ctx.fill();
            }

            // Valor numérico
            ctx.fillStyle = item.color;
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(txt, RX + RIGHT_W - 16, cy + ROW_H / 2);

            cy += ROW_H;
        }

        cy += 10; // más espacio entre bloques
    }

    // ── FOOTER ────────────────────────────────────────────────────────────
    const FY = CONTENT_H;

    ctx.fillStyle = '#1B3A5C';
    ctx.fillRect(0, FY, W_LOG, FOOTER_H);

    // Fuente — dos líneas a la izquierda
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Fuente: Sarkis Badola, T.M. (2026) · INFORM Argentina', PAD, FY + FOOTER_H / 2 - 8);
    ctx.fillText('INDEC Censo 2022 · IGN', PAD, FY + FOOTER_H / 2 + 8);

    // Marca — derecha
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('MAPA DE RIESGO ARGENTINA', W_LOG - PAD, FY + FOOTER_H / 2 - 7);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('República Argentina · 2026', W_LOG - PAD, FY + FOOTER_H / 2 + 8);

    // ── Descargar ─────────────────────────────────────────────────────────
    const link = document.createElement('a');
    link.download = `reporte_${departamento.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
};

// INTERACCIONES

// Referencia al último departamento resaltado por hover, usada como
// respaldo para evitar que quede "pegado" el resaltado si el navegador
// no dispara correctamente el mouseout (bug conocido de Leaflet).
let hoverLayerActivo = null;

function onEachFeature(feature, layer) {
    layer.on({
        mouseover(e) {
            // Si por algún motivo quedó otro departamento resaltado
            // (evento mouseout perdido), lo restauramos antes de
            // resaltar el nuevo.
            if (hoverLayerActivo && hoverLayerActivo !== e.target && geojsonLayer) {
                geojsonLayer.resetStyle(hoverLayerActivo);
            }

            e.target.setStyle({ weight: 2, color: '#333', fillOpacity: 0.95 });
            hoverLayerActivo = e.target;

            // bringToFront() reordena el nodo SVG en el DOM. Si se ejecuta
            // en el mismo tick que el mouseover, puede interferir con el
            // seguimiento del mouse que hace el navegador y hacer que el
            // mouseout nunca se dispare, dejando el departamento
            // "bugueado" resaltado. Se difiere al siguiente tick para
            // evitar ese conflicto.
            setTimeout(() => e.target.bringToFront(), 0);
        },
        mouseout(e) {
            if (geojsonLayer) geojsonLayer.resetStyle(e.target);
            if (hoverLayerActivo === e.target) hoverLayerActivo = null;
        },
        click(e) {
            L.popup({ maxWidth: 560 })
                .setLatLng(e.latlng)
                .setContent(construirPopup(feature.properties))
                .openOn(map);

            // Dibuja el mini-mapa después de que el DOM del popup esté listo
            setTimeout(() => dibujarMiniMapa(feature), 60);
        }
    });
}

// LEYENDA

function actualizarLeyenda() {
    const contenedor = document.getElementById('leyenda');
    if (!contenedor) return;

    const paleta = PALETAS[capaActual.color1];

    contenedor.innerHTML = NIVELES.map((nivel, i) => {
        const color = paleta
            ? paleta[i]
            : interpolarColor(
                (nivel.min + nivel.max) / 2,
                capaActual.color1,
                capaActual.color2
              );
        return `
            <div class="leyenda-nivel">
                <div class="leyenda-cuadro" style="background:${color}"></div>
                <span>${nivel.label}</span>
            </div>`;
    }).join('');

    const info = document.getElementById('currentLayerInfo');
    if (info) info.textContent = capaActual.nombre;
}

// RENDERIZAR CAPA

function renderizarCapa() {
    if (!geojsonData) return;

    const features = provinciaActual
        ? geojsonData.features.filter(f => f.properties.Provincia === provinciaActual)
        : geojsonData.features;

    const contador = document.getElementById('contador');
    if (contador) contador.innerHTML =
        `Mostrando <strong>${features.length}</strong> departamentos`;

    if (geojsonLayer) map.removeLayer(geojsonLayer);
    hoverLayerActivo = null; // la capa vieja se destruye; evita referencias colgadas

    geojsonLayer = L.geoJSON(
        { type: "FeatureCollection", features },
        { style: estiloFeature, onEachFeature }
    ).addTo(map);

    actualizarLeyenda();
}

// FUNCIÓN GENÉRICA PARA CREAR SUBMENÚS

function crearSubMenuGenerico(idSubmenu, idDefecto, btnPadre, subcapas) {
    const existente = document.getElementById(idSubmenu);
    if (existente) return;

    const submenu = document.createElement('div');
    submenu.id = idSubmenu;
    submenu.style.cssText = `
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.3s ease;
        padding-left: 12px;
        margin-top: 2px;
    `;

    subcapas.forEach(sub => {
        const btn = document.createElement('button');
        btn.className   = 'layer-button capa-sub-btn';
        btn.dataset.key = sub.key;
        const colorDot  = interpolarColor(7, sub.color1, sub.color2, null);
        btn.style.cssText = `
            width: 100%;
            margin-bottom: 4px;
            padding: 8px 10px;
            border: 1px solid #D0DBE8;
            border-left: 3px solid ${colorDot};
            border-radius: 5px;
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            font-family: 'Barlow', sans-serif;
            color: #1a2535;
            text-align: left;
            transition: background 0.15s, border-color 0.15s;
        `;

        const dot = document.createElement('span');
        dot.style.cssText = `
            width: 10px; height: 10px;
            border-radius: 50%; flex-shrink: 0;
            background: ${colorDot};
        `;

        const label = document.createElement('span');
        label.textContent = sub.nombre;

        btn.appendChild(dot);
        btn.appendChild(label);

        btn.addEventListener('click', () => {
            submenu.querySelectorAll('.capa-sub-btn').forEach(b => {
                b.style.background = 'white';
                b.style.fontWeight = '400';
            });
            btn.style.background = '#FFF8F0';
            btn.style.fontWeight = '600';

            capaActual = {
                campo:  sub.campo,
                color1: sub.color1,
                color2: sub.color2,
                nombre: sub.nombre
            };

            if (geojsonData) renderizarCapa();
        });

        submenu.appendChild(btn);
    });

    btnPadre.insertAdjacentElement('afterend', submenu);
}

function crearSubMenu() {
    const btnRiesgo = document.querySelector('.capa-btn[data-capa="riesgo"]');
    if (btnRiesgo) crearSubMenuGenerico('submenu-riesgo', 'riesgo-multi', btnRiesgo, SUBCAPAS_RIESGO);

    const btnPeligro = document.querySelector('.capa-btn[data-capa="peligro"]');
    if (btnPeligro) crearSubMenuGenerico('submenu-peligro', 'peligro-multi', btnPeligro, SUBCAPAS_PELIGRO);
}

function abrirSubMenu(tipo) {
    const id  = tipo === 'riesgo' ? 'submenu-riesgo' : 'submenu-peligro';
    const def = tipo === 'riesgo' ? 'riesgo-multi'   : 'peligro-multi';

    const otro = tipo === 'riesgo' ? 'submenu-peligro' : 'submenu-riesgo';
    const elOtro = document.getElementById(otro);
    if (elOtro) { elOtro.style.maxHeight = '0'; }

    const submenu = document.getElementById(id);
    if (!submenu) return;
    submenu.style.maxHeight = '300px';
    subMenuAbierto = true;

    const primerBtn = submenu.querySelector(`.capa-sub-btn[data-key="${def}"]`);
    if (primerBtn) primerBtn.click();
}

function cerrarSubMenu() {
    ['submenu-riesgo', 'submenu-peligro'].forEach(id => {
        const submenu = document.getElementById(id);
        if (!submenu) return;
        submenu.style.maxHeight = '0';
        submenu.querySelectorAll('.capa-sub-btn').forEach(b => {
            b.style.background = 'white';
            b.style.fontWeight = '400';
        });
    });
    subMenuAbierto = false;
}

// CARGA DEL GEOJSON  ← apunta al archivo enriquecido

fetch('/Diseño-1/INFORM_web_enriched.geojson')
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    })
    .then(data => {
        geojsonData = data;

        const provincias = [
            ...new Set(
                data.features.map(f => f.properties.Provincia).filter(Boolean)
            )
        ].sort();

        const select = document.getElementById('filtro-provincia');
        provincias.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = p;
            select.appendChild(opt);
        });

        crearSubMenu();
        inicializarBuscador();

        const btnRiesgoActivo  = document.querySelector('.capa-btn[data-capa="riesgo"].active');
        const btnPeligroActivo = document.querySelector('.capa-btn[data-capa="peligro"].active');

        if (btnRiesgoActivo) {
            abrirSubMenu('riesgo');
        } else if (btnPeligroActivo) {
            abrirSubMenu('peligro');
        } else {
            renderizarCapa();
        }

        document.getElementById('loading').style.display = 'none';
    })
    .catch(error => {
        console.error(error);
        mostrarToast('Error al cargar INFORM_web_enriched.geojson');
        document.getElementById('loading').style.display = 'none';
    });

// BOTONES DE CAPA PRINCIPALES

document.querySelectorAll('.capa-btn').forEach(btn => {
    btn.addEventListener('click', () => {

        document.querySelectorAll('.capa-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tipoCapa = btn.dataset.capa;

        if (tipoCapa === 'riesgo' || tipoCapa === 'peligro') {
            abrirSubMenu(tipoCapa);
        } else {
            cerrarSubMenu();

            capaActual = {
                campo:  btn.dataset.campo,
                color1: btn.dataset.color1,
                color2: btn.dataset.color2,
                nombre: btn.querySelector('.layer-name')?.textContent.trim()
                        ?? btn.textContent.trim()
            };

            if (geojsonData) renderizarCapa();
        }
    });
});

// FILTRO PROVINCIA

document.getElementById('filtro-provincia').addEventListener('change', e => {
    provinciaActual = e.target.value;
    if (!geojsonData) return;

    renderizarCapa();

    if (provinciaActual && geojsonLayer?.getBounds().isValid()) {
        map.fitBounds(geojsonLayer.getBounds(), { padding: [20, 20] });
    } else {
        map.setView([-38.4161, -63.6167], 4);
    }
});

// BUSCADOR DE DEPARTAMENTOS

let resaltadoLayer = null;

function inicializarBuscador() {
    const input       = document.getElementById('buscador-depto');
    const sugerencias = document.getElementById('buscador-sugerencias');
    if (!input || !sugerencias) return;

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        sugerencias.innerHTML = '';

        if (q.length < 2) {
            sugerencias.style.display = 'none';
            return;
        }

        const resultados = geojsonData.features
            .filter(f => f.properties.Departamento?.toLowerCase().includes(q))
            .slice(0, 8);

        if (resultados.length === 0) {
            sugerencias.style.display = 'none';
            return;
        }

        resultados.forEach(feature => {
            const props = feature.properties;
            const item  = document.createElement('div');
            item.className = 'buscador-item';

            const nombre   = props.Departamento;
            const idx      = nombre.toLowerCase().indexOf(q);
            const antes    = nombre.slice(0, idx);
            const match    = nombre.slice(idx, idx + q.length);
            const despues  = nombre.slice(idx + q.length);

            item.innerHTML = `
                <span class="buscador-nombre">
                    ${antes}<strong>${match}</strong>${despues}
                </span>
                <span class="buscador-provincia">${props.Provincia}</span>
            `;

            item.addEventListener('click', () => {
                seleccionarDepartamento(feature);
                input.value = nombre;
                sugerencias.style.display = 'none';
            });

            sugerencias.appendChild(item);
        });

        sugerencias.style.display = 'block';
    });

    document.addEventListener('click', e => {
        if (!input.contains(e.target) && !sugerencias.contains(e.target)) {
            sugerencias.style.display = 'none';
        }
    });

    input.addEventListener('keydown', e => {
        const items  = sugerencias.querySelectorAll('.buscador-item');
        const activo = sugerencias.querySelector('.buscador-item.hover');
        let idx = [...items].indexOf(activo);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activo) activo.classList.remove('hover');
            idx = (idx + 1) % items.length;
            items[idx]?.classList.add('hover');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activo) activo.classList.remove('hover');
            idx = (idx - 1 + items.length) % items.length;
            items[idx]?.classList.add('hover');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activo) {
                activo.click();
            } else if (items.length >= 1) {
                // FIX: antes era === 1, ahora selecciona el primero siempre
                items[0].click();
            }
        } else if (e.key === 'Escape') {
            sugerencias.style.display = 'none';
            input.blur();
        }
    });

    const btnLimpiar = document.getElementById('buscador-limpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            input.value = '';
            sugerencias.style.display = 'none';
            limpiarResaltado();
            input.focus();
        });
    }
}

function seleccionarDepartamento(feature) {
    limpiarResaltado();

    const tempLayer = L.geoJSON(feature);
    const bounds    = tempLayer.getBounds();

    if (!bounds.isValid()) return;

    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 });

    resaltadoLayer = L.geoJSON(feature, {
        style: {
            fillColor:   interpolarColor(
                feature.properties[capaActual.campo] ?? 0,
                capaActual.color1,
                capaActual.color2,
                capaActual.campo
            ),
            fillOpacity: 0.95,
            color:       '#1B3A5C',
            weight:      3,
            opacity:     1,
            dashArray:   '6 3'
        }
    }).addTo(map);

    setTimeout(() => {
        L.popup({ maxWidth: 560 })
            .setLatLng(bounds.getCenter())
            .setContent(construirPopup(feature.properties))
            .openOn(map);

        // Dibuja el mini-mapa luego de que el popup esté en el DOM
        setTimeout(() => dibujarMiniMapa(feature), 60);
    }, 400);
}

function limpiarResaltado() {
    if (resaltadoLayer) {
        map.removeLayer(resaltadoLayer);
        resaltadoLayer = null;
    }
}

// TOAST

function mostrarToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 4000);
}

// PANTALLA COMPLETA DEL MAPA

const ICONO_EXPANDIR = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
        <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
        <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
        <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
    </svg>`;

const ICONO_CONTRAER = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
        <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
        <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
        <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
    </svg>`;

function soportaFullscreenAPI(el) {
    return !!(
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.msRequestFullscreen
    );
}

function elementoEnFullscreen() {
    return document.fullscreenElement ||
           document.webkitFullscreenElement ||
           document.msFullscreenElement ||
           null;
}

function pedirFullscreen(el) {
    if (el.requestFullscreen)        return el.requestFullscreen();
    if (el.webkitRequestFullscreen)  return el.webkitRequestFullscreen();
    if (el.msRequestFullscreen)      return el.msRequestFullscreen();
    return Promise.reject(new Error('Fullscreen API no soportada'));
}

function salirFullscreen() {
    if (document.exitFullscreen)        return document.exitFullscreen();
    if (document.webkitExitFullscreen)  return document.webkitExitFullscreen();
    if (document.msExitFullscreen)      return document.msExitFullscreen();
    return Promise.resolve();
}

function inicializarPantallaCompleta() {
    const btn     = document.getElementById('btn-fullscreen');
    const mapCard = document.querySelector('.map-card');
    if (!btn || !mapCard) return;

    function actualizarBoton(activo) {
        btn.innerHTML = activo ? ICONO_CONTRAER : ICONO_EXPANDIR;
        btn.title = activo
            ? 'Salir de pantalla completa'
            : 'Ver mapa en pantalla completa';
        btn.setAttribute('aria-label', btn.title);
    }

    function alSalirOFallarFullscreen() {
        mapCard.classList.remove('is-fullscreen');
        actualizarBoton(false);
        setTimeout(() => map.invalidateSize(), 80);
    }

    btn.addEventListener('click', () => {
        const yaActivo = mapCard.classList.contains('is-fullscreen') || elementoEnFullscreen();

        if (yaActivo) {
            if (elementoEnFullscreen()) {
                salirFullscreen().catch(() => {});
            } else {
                alSalirOFallarFullscreen();
            }
            return;
        }

        if (soportaFullscreenAPI(mapCard)) {
            pedirFullscreen(mapCard).catch(() => {
                // Si el navegador rechaza la API (ej: falta de permisos),
                // usamos el fallback por CSS.
                mapCard.classList.add('is-fullscreen');
                actualizarBoton(true);
                setTimeout(() => map.invalidateSize(), 80);
            });
        } else {
            // Navegadores sin soporte de Fullscreen API (ej: Safari iOS):
            // simulamos pantalla completa con CSS (position: fixed).
            mapCard.classList.add('is-fullscreen');
            actualizarBoton(true);
            setTimeout(() => map.invalidateSize(), 80);
        }
    });

    // Sincroniza el ícono y recalcula el tamaño del mapa cuando el estado
    // de fullscreen cambia por cualquier vía (botón, tecla Esc, navegador).
    ['fullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(evento => {
        document.addEventListener(evento, () => {
            const activo = !!elementoEnFullscreen();
            actualizarBoton(activo);
            setTimeout(() => map.invalidateSize(), 80);
        });
    });

    // Tecla Escape para salir del modo fallback por CSS (cuando el
    // navegador no soporta la Fullscreen API nativa).
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mapCard.classList.contains('is-fullscreen')) {
            alSalirOFallarFullscreen();
        }
    });
}

inicializarPantallaCompleta();
