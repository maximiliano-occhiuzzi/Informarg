let map;
let markers = [];

const sensorLocations = [
    {
        id: 1,
        name: "Sensor CABA",
        lat: -34.6037,
        lng: -58.3816,
        temp: 28,
        humidity: 45,
        wind: 15,
        co2: 400,
        risk: "Bajo",
        pressure: 1013
    },
    {
        id: 2,
        name: "Sensor Córdoba",
        lat: -31.4201,
        lng: -64.1888,
        temp: 32,
        humidity: 28,
        wind: 25,
        co2: 420,
        risk: "Moderado",
        pressure: 1010
    },
    {
        id: 3,
        name: "Sensor Mendoza",
        lat: -32.8895,
        lng: -68.8458,
        temp: 35,
        humidity: 22,
        wind: 32,
        co2: 450,
        risk: "Alto",
        pressure: 1008
    }
];

function initMap() {
    map = L.map('map').setView([-38.4161, -63.6167], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    addMarkers();
}

function addMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    sensorLocations.forEach(sensor => {
        const markerColor = getRiskColor(sensor.risk);

        const markerIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background: ${markerColor};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                animation: pulse-marker 2s infinite;
            "></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const marker = L.marker([sensor.lat, sensor.lng], { icon: markerIcon })
            .addTo(map)
            .bindPopup(`
                <div class="custom-popup">
                    <h4>${sensor.name}</h4>
                    <p><strong>Temperatura:</strong> ${sensor.temp}°C</p>
                    <p><strong>Humedad:</strong> ${sensor.humidity}%</p>
                    <p><strong>Viento:</strong> ${sensor.wind} km/h</p>
                    <p><strong>CO2:</strong> ${sensor.co2} ppm</p>
                    <div class="risk-badge" style="background: ${getRiskColor(sensor.risk)}; color: white;">
                        Riesgo: ${sensor.risk}
                    </div>
                </div>
            `);

        markers.push(marker);
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-marker {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }
    `;
    document.head.appendChild(style);
}

function getRiskColor(risk) {
    const colors = {
        'Bajo': '#22c55e',
        'Moderado': '#eab308',
        'Alto': '#f97316',
        'Crítico': '#ef4444'
    };
    return colors[risk] || '#6b7280';
}

function getRiskStatus(risk) {
    const statuses = {
        'Bajo': 'normal',
        'Moderado': 'warning',
        'Alto': 'warning',
        'Crítico': 'danger'
    };
    return statuses[risk] || 'normal';
}

function updateSensorData(sensorId) {
    const sensor = sensorLocations.find(s => s.id === parseInt(sensorId)) || sensorLocations[0];

    document.getElementById('temp-1').textContent = `${sensor.temp}°C`;
    document.getElementById('humidity-1').textContent = `${sensor.humidity}%`;
    document.getElementById('wind-1').textContent = `${sensor.wind} km/h`;
    document.getElementById('co2-1').textContent = `${sensor.co2} ppm`;
    document.getElementById('risk-1').textContent = sensor.risk;
    document.getElementById('pressure-1').textContent = `${sensor.pressure} hPa`;

    const statusClass = getRiskStatus(sensor.risk);
    document.querySelectorAll('.sensor-status').forEach(status => {
        status.className = `sensor-status ${statusClass}`;
        status.textContent = sensor.risk;
    });

    updateAlerts(sensor);

    if (sensorId !== 'all') {
        map.setView([sensor.lat, sensor.lng], 8);
    } else {
        map.setView([-38.4161, -63.6167], 5);
    }
}

function updateAlerts(sensor) {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = '';

    const rule30 = checkRule30(sensor);

    if (rule30.triggered) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-item danger';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <div class="alert-content">
                <strong>¡ALERTA: Regla de los 30!</strong>
                <p>${rule30.message}</p>
                <span class="alert-time">Última actualización: ahora</span>
            </div>
        `;
        alertsContainer.appendChild(alertDiv);
    } else if (sensor.risk === 'Alto' || sensor.risk === 'Crítico') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-item ${sensor.risk === 'Crítico' ? 'danger' : 'warning'}`;
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <div class="alert-content">
                <strong>Riesgo ${sensor.risk} de Incendio</strong>
                <p>Se detectaron condiciones de riesgo ${sensor.risk.toLowerCase()} en ${sensor.name}</p>
                <span class="alert-time">Última actualización: hace 2 minutos</span>
            </div>
        `;
        alertsContainer.appendChild(alertDiv);
    } else if (sensor.risk === 'Moderado') {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-item warning';
        alertDiv.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <div class="alert-content">
                <strong>Riesgo Moderado</strong>
                <p>Condiciones ambientales requieren monitoreo continuo</p>
                <span class="alert-time">Última actualización: hace 5 minutos</span>
            </div>
        `;
        alertsContainer.appendChild(alertDiv);
    } else {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-item normal';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div class="alert-content">
                <strong>Sistema Normal</strong>
                <p>Todos los sensores funcionando correctamente</p>
                <span class="alert-time">Última actualización: ahora</span>
            </div>
        `;
        alertsContainer.appendChild(alertDiv);
    }
}

function checkRule30(sensor) {
    const conditions = [];

    if (sensor.temp > 30) {
        conditions.push(`Temperatura: ${sensor.temp}°C (>30°C)`);
    }
    if (sensor.wind > 30) {
        conditions.push(`Viento: ${sensor.wind} km/h (>30 km/h)`);
    }
    if (sensor.humidity < 30) {
        conditions.push(`Humedad: ${sensor.humidity}% (<30%)`);
    }

    if (conditions.length >= 2) {
        return {
            triggered: true,
            message: `Se cumplen ${conditions.length} condiciones de la Regla de los 30: ${conditions.join(', ')}`
        };
    }

    return { triggered: false };
}

function simulateSensorUpdates() {
    setInterval(() => {
        sensorLocations.forEach(sensor => {
            sensor.temp += (Math.random() - 0.5) * 2;
            sensor.humidity += (Math.random() - 0.5) * 3;
            sensor.wind += (Math.random() - 0.5) * 2;
            sensor.co2 += (Math.random() - 0.5) * 10;

            sensor.temp = Math.max(15, Math.min(45, sensor.temp));
            sensor.humidity = Math.max(10, Math.min(90, sensor.humidity));
            sensor.wind = Math.max(0, Math.min(60, sensor.wind));
            sensor.co2 = Math.max(350, Math.min(600, sensor.co2));

            if (sensor.temp > 35 || sensor.humidity < 25 || sensor.wind > 35) {
                sensor.risk = 'Crítico';
            } else if (sensor.temp > 32 || sensor.humidity < 30 || sensor.wind > 30) {
                sensor.risk = 'Alto';
            } else if (sensor.temp > 28 || sensor.humidity < 40 || sensor.wind > 25) {
                sensor.risk = 'Moderado';
            } else {
                sensor.risk = 'Bajo';
            }
        });

        const currentSensorId = document.getElementById('sensor-select').value;
        if (currentSensorId === 'all') {
            updateSensorData('1');
        } else {
            updateSensorData(currentSensorId);
        }

        addMarkers();
    }, 10000);
}

document.addEventListener('DOMContentLoaded', function() {
    initMap();

    const sensorSelect = document.getElementById('sensor-select');
    sensorSelect.addEventListener('change', function() {
        const selectedId = this.value;
        updateSensorData(selectedId === 'all' ? '1' : selectedId);
    });

    updateSensorData('1');

    simulateSensorUpdates();

    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-menu-open');
        });
    }

    const sensorCards = document.querySelectorAll('.sensor-data');
    sensorCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    console.log('Firenova Map System initialized successfully! 🔥🗺️');
});
