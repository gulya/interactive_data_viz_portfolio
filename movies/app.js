document.addEventListener('DOMContentLoaded', function () {
    const width = 500;
    const height = 500;
    const rows = 10;
    const cols = 10;
    const padding = 5;
    const squareSize = (width - padding * (cols - 1)) / cols;

    // Create the tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    const svg = d3.select('#visualization')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => (i % cols) * (squareSize + padding))
        .attr('y', (d, i) => Math.floor(i / cols) * (squareSize + padding))
        .attr('width', squareSize)
        .attr('height', squareSize)
        .attr('fill', 'lightpink')
        .on('mouseover', function (event, d) {
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(d.movie)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 20) + 'px');
        })
        .on('mouseout', function () {
            tooltip.transition().duration(500).style('opacity', 0);
        });

    // Calculate scales based on data
    const myScoreExtent = d3.extent(data, d => d.myScore);
    const imdbScoreExtent = d3.extent(data, d => d.imdbScore);
    const rottenTomatoesExtent = d3.extent(data, d => d.RottenTomatoes);

    const myScoreScale = d3.scaleLinear()
        .domain(myScoreExtent)
        .range(['#f7eeed', '#f191ac']); // Light pink to dark red

    const imdbScoreScale = d3.scaleLinear()
        .domain(imdbScoreExtent)
        .range(['#D4FCD4', '#004D00']); // Light green to dark green

    const rottenTomatoesScale = d3.scaleLinear()
        .domain(rottenTomatoesExtent)
        .range([ '#708d81', '#ff686b']); // Pukey Green to red

    // Initialize scrollama
    const scroller = scrollama();

    // Handle step enter
    function handleStepEnter(response) {
        const sectionId = response.element.id;
        updateVisualization(sectionId);
    }

    // Setup the instance, pass callback functions
    scroller.setup({
        step: '.text-content',
        offset: 1, // Trigger at bottom of viewport
        debug: false
    }).onStepEnter(handleStepEnter);

    function updateVisualization(section) {
        if (section === 'introduction') {
            svg.selectAll('rect')
                .transition()
                .duration(500)
                .attr('fill', 'lightpink');
        } else if (section === 'paragraph-1') {
            svg.selectAll('rect')
                .data(data)
                .transition()
                .duration(500)
                .attr('fill', d => d.year >= 2020 ? '#5bc8af' : '#FFE6E6');
        } else if (section === 'paragraph-2') {
            svg.selectAll('rect')
                .data(data)
                .transition()
                .duration(500)
                .attr('fill', d => d.year > 2000 && d.year < 2020 ? '#5fb0b7' : '#FFE6E6');
        } else if (section === 'paragraph-3') {
            svg.selectAll('rect')
                .data(data)
                .transition()
                .duration(500)
                .attr('fill', d =>  d.year < 2000 ? '#6c91bf' : '#FFE6E6');
        } else if (section === 'paragraph-4') {
            svg.selectAll('rect')
                .data(data)
                .transition()
                .duration(500)
                .attr('fill', d => {
                    if (d.year >= 2020) return '#5bc8af';
                    if (d.year > 2000 && d.year < 2020) return '#5fb0b7';
                    if (d.year < 2000) return '#6c91bf';
                    return '#FFE6E6';
                });
        } else if (section === 'paragraph-5') {
            svg.selectAll('rect')
                .data(data)
                .transition()
                .duration(500)
                .attr('fill', d => {
                    if (d.length >= 120) return '#441151';
                    if (d.length >= 90 && d.length < 120) return '#883677';
                    if (d.length < 90) return '#ca61c3';
                    return '#FFE6E6';
                });
        } else if (section === 'paragraph-6') {
            svg.selectAll('rect')
                .data(data)
                .transition()
                .duration(500)
                .attr('fill', d => rottenTomatoesScale(d.RottenTomatoes));
        } else if (section === 'paragraph-7') {
            svg.selectAll('rect')
                .data(data)
                .transition()
                .duration(500)
                .attr('fill', d => imdbScoreScale(d.imdbScore));
        } else if (section === 'paragraph-8') {
            svg.selectAll('rect')
                .data(data)
                .transition()
                .duration(500)
                .attr('fill', d => myScoreScale(d.myScore) );
        } else if (section === 'paragraph-9') {
            svg.selectAll('rect')
                .data(data)
                .transition()
                .duration(500)
                .attr('fill', d =>  d.rewatch === true ? '#ff8fab' : '#FFE6E6');
        } else if (section === 'paragraph-10') {
            svg.selectAll('rect')
                .data(data)
                .transition()
                .duration(500)
                .attr('fill', d =>  d.heart === true ? '#ff8fab' : '#FFE6E6');
        }
    }
});
