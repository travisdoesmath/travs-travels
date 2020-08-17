function range(start = 0, end, step=1) {
    if (end === undefined) {
        end = start;
        start = 0;
    }
    return Array.from(Array(end - start), (_, i) => i*step + start)
}

const timelineChart = new TimelineChart({
    element: document.querySelector('#timeline'),
    data: data,
    x0: d => d.start,
    x1: d => d.end,
    rows: 4,
})

let worldmap;
d3.json('/static/json/land-50m.json').then(m => {
    worldmap = new GeoMap({
        element: document.querySelector('#map'),
        data: data,
        topojson: m
    })
})

