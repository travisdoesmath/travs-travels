class GeoMap {

    constructor(opts) {

        this.element = opts.element;
        this.data = opts.data;
        this.topojson = opts.topojson;

        this.draw();
    }

    draw(highlight = '') {
        this.width = this.element.offsetWidth;
        this.height = this.width * 0.7;
        this.margin = {
            top: 10,
            right: 15,
            bottom: 20,
            left: 15
        };

        this.element.innerHTML = '';
        const svg = d3.select(this.element).append('svg');
        svg.attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('preserveAspectRatio', 'xMinYMid')
            .attr('width', this.width)
            .attr('height', this.height)

        this.plot = svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        this.drawMap()
        this.drawMarkers(highlight)
    }

    drawMap() {
        let outline = {type: "Sphere"}
        this.projection = d3.geoNaturalEarth1().fitWidth(this.width - this.margin.left - this.margin.right, outline)
        // this.projection = d3.geoOrthographic().fitHeight(this.height - this.margin.top - this.margin.bottom, outline).rotate(180)
        this.path = d3.geoPath().projection(this.projection)
        let land = topojson.feature(this.topojson, this.topojson.objects.land)

        let graticule = d3.geoGraticule10()

        this.plot
            .append('path')
            .attr('class','graticule')
            .attr('d', this.path(graticule))
            .attr('stroke', '#ccc')
            .attr('fill', 'none')

        this.plot
            .append('path')
            .attr('class','graticule')
            .attr('d', this.path(outline))
            .attr('stroke', '#444')
            .attr('fill', 'none')

        this.plot.selectAll('.land')
            .data(land.features)
            .enter()
            .append('path')
            .attr('class','land')
            .attr('d', this.path)
            .attr('fill', '#AAA')



    }

    drawMarkers(highlight) {
        let markers = this.plot.selectAll('.marker')
            .data(this.data)
            .enter()
            .append('g')
            .attr('class', 'marker')
            .attr('location', d => d.title)
        
        console.log('highlight', highlight)

        // markers.selectAll('.highlight-marker').data(d => d.locations.map(x => { return { title: d.title, location: {latitude: x.latitude, longitude: x.longitude} }; }))
        //     .enter()
        //     .append('circle')
        //     .attr('class', 'highlight-marker')
        //     .attr('r', d => d.title == highlight ? 8 : 0)
        //     .attr('cx', d => this.projection([d.location.longitude, d.location.latitude])[0])
        //     .attr('cy', d => this.projection([d.location.longitude, d.location.latitude])[1])
        //     .attr('fill', 'darkred')

        markers.selectAll('.marker').data(d => d.locations.map(x => { return { title: d.title, location: {latitude: x.latitude, longitude: x.longitude} }; }))
            .enter()
            .append('circle')
            .attr('class', 'marker')
            .attr('r', d => d.title == highlight ? 5 : 4)
            .attr('cx', d => this.projection([d.location.longitude, d.location.latitude])[0])
            .attr('cy', d => this.projection([d.location.longitude, d.location.latitude])[1])
            .attr('fill', d => d.title == highlight ? 'white' : 'darkred')
            .attr('stroke', d => d.title == highlight ? 'darkred' : '')
            .attr('stroke-width', d => d.title == highlight ? 2  : 0)


    }
}