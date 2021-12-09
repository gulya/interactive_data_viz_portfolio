export function bar2() {

  const width = window.innerWidth * 0.4,
    height = window.innerHeight * 0.35,
    margin = {
      top: 10,
      bottom: 30,
      left: 150,
      right: 10
    },
    paddingInner = 0.1;

  // these variables, initially empty, let us access
  // anything we manipulate in init() but need access to in draw()
  let svg;
  let xScale;
  let yScale;
  let yAxis;
  let xAxis;

  /* APPLICATION STATE */
let state = {
    data: [],
  };
  
  /* LOAD DATA */
  d3.csv('../data/top_artists.csv', d3.autoType).then(raw_data => {
    console.log("data", raw_data);
    // save our data to application state
    state.data = raw_data;
    init();
  });

  /* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
    /* SCALES */
    // xscale - categorical, activity
    yScale = d3.scaleBand()
      .domain(state.data.map(d=> d.artist))
      // .range([0, width])
      .range([margin.top, height - margin.bottom])    // visual variable
      .paddingInner(.2)
      .paddingOuter(.1);
  
      // yscale - linear,count
    xScale = d3.scaleLinear()
      .domain([0, d3.max(state.data, d => d.length)])
      // .range([height, 0])
      .rangeRound([margin.left, width - margin.right])
      .nice()
  
    xAxis = d3.axisBottom()
      .scale(xScale);
  
    yAxis = d3.axisLeft()
      .scale(yScale);
  
  
    draw(); // calls the draw function
  }
  
  /* DRAW FUNCTION */
  // we call this every time there is an update to the data/state
  function draw() {
    /* HTML ELEMENTS */
    // svg
    const svg = d3.select("#bar2")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
  
      svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
        .attr("transform", "translate(0,0)rotate(-30)")
        .style("font-family", "Roboto Mono")
        .style("text-anchor", "end");
  
    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .selectAll("text")
        .style("text-anchor", "end")
          .style("font-family", "Roboto Mono")
          ;
    // bars
    svg.selectAll("rect")
      .data(state.data)
      .join("rect")
      .attr("height", yScale.bandwidth())
      .attr("width", d=> xScale(d.length))
      .attr("y", d=>yScale(d.artist))
      .attr("x", d=> xScale(0))
      .attr("fill", "#97eeb7")
      .style("font-family", "Roboto Mono");
  }
}