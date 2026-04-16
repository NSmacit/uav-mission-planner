// Initialize map
const map = L.map('map').setView([51.4545, -2.5879], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// State
let waypoints = [];
let markers = [];
let polyline = null;

// Haversine formula - calculates distance between two coordinates
function haversine(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Calculate total distance
function calculateTotalDistance() {
    let total = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
        total += haversine(
            waypoints[i].lat, waypoints[i].lng,
            waypoints[i+1].lat, waypoints[i+1].lng
        );
    }
    return total.toFixed(2);
}

// Update stats panel
function updateStats() {
    const distance = calculateTotalDistance();
    const speed = parseInt(document.getElementById('speed').value);
    const time = distance > 0 ? ((distance / speed) * 60).toFixed(1) : 0;

    document.getElementById('waypoint-count').textContent = waypoints.length;
    document.getElementById('total-distance').textContent = distance;
    document.getElementById('flight-time').textContent = time;
}

// Update waypoint list in sidebar
function updateWaypointList() {
    const list = document.getElementById('waypoint-list');
    list.innerHTML = '';
    waypoints.forEach((wp, index) => {
        const item = document.createElement('div');
        item.className = 'waypoint-item';
        item.innerHTML = `
            <strong>WP${index + 1}</strong>
            <button onclick="removeWaypoint(${index})">✕</button>
            <br>
            <small>Alt: ${wp.altitude}m</small><br>
            <small>${wp.lat.toFixed(4)}, ${wp.lng.toFixed(4)}</small>
        `;
        list.appendChild(item);
    });
}

// Draw route on map
function drawRoute() {
    if (polyline) {
        map.removeLayer(polyline);
    }
    if (waypoints.length > 1) {
        const latlngs = waypoints.map(wp => [wp.lat, wp.lng]);
        polyline = L.polyline(latlngs, { color: '#00d4ff', weight: 3 }).addTo(map);
    }
}

// Add waypoint on map click
map.on('click', function(e) {
    const altitude = prompt('Enter altitude (meters):', '100');
    if (altitude === null) return;

    const wp = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        altitude: parseInt(altitude) || 100,
        name: `WP${waypoints.length + 1}`
    };

    waypoints.push(wp);

    const marker = L.marker([wp.lat, wp.lng])
        .addTo(map)
        .bindPopup(`<b>${wp.name}</b><br>Alt: ${wp.altitude}m`)
        .openPopup();

    markers.push(marker);
    drawRoute();
    updateStats();
    updateWaypointList();
});

// Remove waypoint
function removeWaypoint(index) {
    waypoints.splice(index, 1);
    map.removeLayer(markers[index]);
    markers.splice(index, 1);
    drawRoute();
    updateStats();
    updateWaypointList();
}

// Clear all
document.getElementById('clear-btn').addEventListener('click', function() {
    waypoints = [];
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    if (polyline) map.removeLayer(polyline);
    polyline = null;
    updateStats();
    updateWaypointList();
});

// Export JSON
document.getElementById('export-json').addEventListener('click', function() {
    const mission = {
        mission_name: "UAV Mission",
        created_at: new Date().toISOString(),
        uav_speed_kmh: parseInt(document.getElementById('speed').value),
        total_distance_km: parseFloat(calculateTotalDistance()),
        waypoints: waypoints
    };
    const blob = new Blob([JSON.stringify(mission, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mission.json';
    a.click();
});

// Export CSV
document.getElementById('export-csv').addEventListener('click', function() {
    let csv = 'name,latitude,longitude,altitude\n';
    waypoints.forEach(wp => {
        csv += `${wp.name},${wp.lat},${wp.lng},${wp.altitude}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mission.csv';
    a.click();
});
document.getElementById('speed').addEventListener('input', updateStats);