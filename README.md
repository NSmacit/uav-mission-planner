# UAV Mission Planner

A lightweight, web-based UAV mission planning tool that allows users to plan drone flight routes on an interactive map.

## Features

- Click on the map to add waypoints
- Set altitude for each waypoint
- Real-time distance calculation using the Haversine formula
- Estimated flight time based on user-defined UAV speed
- Export mission plan as JSON or CSV
- Clear route and start over

## Technologies Used

- HTML, CSS, JavaScript
- Leaflet.js - Interactive mapping
- OpenStreetMap - Map data

## How to Use

1. Open index.html in a browser (use a local server)
2. Click anywhere on the map to add a waypoint
3. Enter the altitude for each waypoint
4. Set your UAV speed in mph
5. View total distance and estimated flight time
6. Export your mission as JSON or CSV

## Running Locally

```bash
npx serve .
```

Then open http://localhost:3000

## Author

Enes Macit — UWE Bristol, Software Development Project 2025-26
