class TimelineChart {

    constructor(opts) {
        //default objects
        this.parse = d3.timeParse('%Y-%m-%d')
        this.start = d => d.start;
        this.end = d => d.end;
        // this.rows = 1;

        if (opts.start) this.start = opts.start;
        if (opts.end) this.end = opts.end;
        // if (opts.rows) this.rows = opts.rows;

        this.element = opts.element;
        this.data = opts.data;

        this.draw();
    }

    draw() {
        this.width = this.element.offsetWidth;
        this.height = 2000;
        this.margin = {
            top: 10,
            right: 0,
            bottom: 10,
            left: 0
        };

        this.element.innerHTML = '';
        const svg = d3.select(this.element).append('svg');
        svg.attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('preserveAspectRatio', 'xMinYMid')
            .attr('width', this.width)
            .attr('height', this.height)

        this.plot = svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        this.tooltip = d3.select(this.element).append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        d3.select(document).on('scroll', () => {
            this.tooltip
                .style('opacity', 0);
        })

        this.createScales();
        // this.addAxes();
        this.addDateDots();
        this.addMarkers();
    }

    createScales() {
        this.minYear = d3.min(this.data, d => this.parse(this.start(d))).getFullYear();
        this.maxYear = d3.max(this.data, d => this.parse(this.end(d))).getFullYear() + 1;

        const yMin = new Date(this.minYear, 0, 1);
        const yMax = new Date(this.maxYear, 0, 1);

        this.yScale = d3.scaleTime()
            .domain([yMin, yMax])
            .range([0, this.height - this.margin.top - this.margin.bottom])

    }

    addAxes() {
        this.xScales.forEach((scale, i, scales) => {
            let axis = d3.axisBottom()
                .scale(scale)
                .ticks(d3.timeYear)

            this.plot.append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(0,${i/scales.length * (this.height - (this.margin.top + this.margin.bottom)) + this.margin.top})`)
                .call(axis)
        })
    }

    addDateDots() {
        let months = []
        let years = range(this.minYear, this.maxYear + 1)
        years.forEach(year => {
            range(0, 12).forEach(month => {
                months.push(new Date(year, month, 1))
            })
        })
        this.plot.selectAll('.month')
            .data(months)
            .enter()
            .append('circle')
            .attr('class', 'month')
            .attr('cx', 50)
            .attr('cy', d => this.yScale(d))
            .attr('r', 3)
            .attr('fill', '#CCC')

        let yearDots = this.plot.selectAll('.year')
            .data(years)
            .enter()
            .append('g')
            .attr('class', 'year')

        yearDots
            .append('circle')
            .attr('cx', 50)
            .attr('cy', d => this.yScale(new Date(d, 0, 1)))
            .attr('r', 4)
            .attr('fill', '#888')

        yearDots
            .append('text')
            .attr('x', 50 - 10)
            .attr('y', d => this.yScale(new Date(d, 0, 1)))
            .attr('dy', 4)
            .attr('font-size', '.75em')
            .attr('font-weight', '800')
            .attr('text-anchor', 'end')
            .text(d => d)


    }

    addMarkers() {
        let radius = 7

        var markers = this.plot.selectAll('.timeline-marker')
            .data(this.data)
            .enter() 
            .append('g')
            .attr('transform', d => `translate(0,${this.yScale(this.parse(this.start(d)))})`)
            .attr('class', 'timeline-marker')

        markers.append('rect')
            .attr('rx', radius)
            // .attr('cx', d => this.xScale(this.parse(x0(d))))
            .attr('x', 50 - radius)
            .attr('width', 2*radius)
            .attr('y', 0)
            .attr('height', d => Math.max(14, this.yScale(this.parse(this.end(d))) - this.yScale(this.parse(this.start(d)))))
            .attr('fill', 'darkred')

        markers.append('text')
            .text(d => d.title)
            .attr('y', 11)
            .attr('x', 50 + radius + 5)
            .attr('font-size', '.75em')
            .attr('text-anchor', 'start')
    }
}