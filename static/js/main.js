let dataPromises = [
    {'url':'./static/json/trip-data.json', 'loader': d3.json},
    {'url':'./static/json/land-50m.json', 'loader': d3.json},
]

Promise.all(dataPromises.map(x => x.loader(x.url))).then(([tripData, mapData]) => {
    const timelineChart = new TimelineChart({
        element: document.querySelector('#timeline'),
        data: tripData,
        x0: d => d.start,
        x1: d => d.end,
        rows: 4,
    });

    worldmap = new GeoMap({
        element: document.querySelector('#map'),
        data: tripData,
        topojson: mapData
    })

    worldmap.draw('Copenhagen')



})