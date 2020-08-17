class TimelineChart {

    constructor(opts) {
        //default objects
        this.parse = d3.timeParse('%Y-%m-%d')
        this.x0 = d => d.x0;
        this.x1 = d => d.x1;
        this.rows = 1;

        if (opts.x0) this.x0 = opts.x0;
        if (opts.x1) this.x1 = opts.x1;
        if (opts.rows) this.rows = opts.rows;

        this.element = opts.element;
        this.data = opts.data;

        this.draw();
    }

    draw() {
        this.width = this.element.offsetWidth;
        this.height = 200;
        this.margin = {
            top: 10,
            right: 15,
            bottom: 20,
            left: 10
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
        this.addAxes();
        this.addBlobs();
    }

    createScales() {
        const minYear = d3.min(this.data, d => this.parse(this.x0(d))).getFullYear();
        const maxYear = d3.max(this.data, d => this.parse(this.x1(d))).getFullYear() + 1;

        const xMin = new Date(minYear, 0, 1);
        const xMax = new Date(maxYear, 0, 1);

        this.xScales = [];

        for (let row = 0; row < this.rows; row++) {
            var yearDiff = maxYear - minYear + 1;
            var tempMinYear = minYear + row * Math.floor(yearDiff / (this.rows));
            var tempMaxYear = minYear + (row+1) * Math.floor(yearDiff / (this.rows));
            let newScale = d3.scaleTime()
                .domain([
                    new Date(tempMinYear, 0, 1), 
                    new Date(Math.min(maxYear, tempMaxYear), 0, 1)
                    ])
                .range([
                    0, 
                    Math.min(tempMaxYear - tempMinYear, maxYear - tempMinYear) / (tempMaxYear - tempMinYear) * (this.width - this.margin.left - this.margin.right)])
            this.xScales.push(newScale);
        }

        this.xScale = d => {
            let out = undefined;
            this.xScales.forEach(scale => {
                // console.log(d, scale.domain()[0], scale.domain()[1])
                // console.log(d >= scale.domain()[0], d <= scale.domain()[1])
                if (d >= scale.domain()[0] && d <= scale.domain()[1]) {
                    out = scale(d);
                }
            })
            return out;
        }

        this.yScale = d => {
            let out = undefined;
            this.xScales.forEach((scale, i, scales) => {
                if (d >= scale.domain()[0] && d <= scale.domain()[1]) {
                    out = (this.height - this.margin.top - this.margin.bottom) * (i / scales.length) + this.margin.top;
                }
            })
            return out;
        }

        // this.xScale = d3.scaleTime()
        //     .range([0, this.width - this.margin.right - this.margin.left])
        //     .domain([xMin, xMax]);

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

    addBlobs() {
        let x0 = this.x0;
        let x1 = this.x1;

        var blobs = this.plot.selectAll('.blob')
            .data(this.data)
        
    
        this.data.forEach(d => {
            var start = x0(d);
            var end = x1(d);
        });

        // blobs.enter()
        //     .append('rect')
        //     .attr('rx', this.height/2)
        //     .attr('class', 'blob')
        //     .merge(blobs)
        //     .attr('x', d => this.xScale(this.parse(x0(d))))
        //     .attr('width', d => this.xScale(this.parse(x1(d))) - this.xScale(this.parse(x0(d))))
        //     .attr('height', this.height - this.margin.top - this.margin.bottom)

        blobs.enter() 
            .append('circle')
            .attr('r', 7)
            .attr('class', 'blob')
            .merge(blobs)
            .attr('cx', d => this.xScale(this.parse(x0(d))))
            .attr('cy', d => this.yScale(this.parse(x0(d))))
            .attr('fill', 'steelblue')
            .attr('opacity', 0.5)
            .attr('stroke', 'white')
    }
}