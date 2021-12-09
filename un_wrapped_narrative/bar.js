export function bar() {


  // Mike Bostock: https://observablehq.com/@d3/grouped-bar-chart

  const width = window.innerWidth * 0.65,
  height = window.innerHeight * 0.6,
  margin = {
    top: 20,
    bottom: 175,
    left: 50,
    right: 10
  },
  paddingInner = 0.1,
  default_metric = "Select a Metric";

  const formatDate = d3.timeFormat("%b-%Y");

    /* APPLICATION STATE */
  let state = {
    data: [],
    selectedMetric: "minutes", // + YOUR FILTER SELECTION
  };

    // these variables, initially empty, let us access
  // anything we manipulate in init() but need access to in draw()
  let svg;
  let xScale;
  let yScale;
  let yAxis;
  let xAxis;
  let tooltip3;


    /* LOAD DATA */

  d3.csv("../data/monthly_listening.csv", d => ({
    month_year: d.time,
    value: +d.value,
    metric: d.metric
    })).then(data => {
    console.log("bar data:", data);
    state.data = data;
    init();
    });

  /* INITIALIZING FUNCTION */
// this will be run one time when the data finishes loading
function init() {
  xScale = d3.scaleBand()
    .domain(state.data.map(d => d.month_year))
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(.2)
    .paddingOuter(.1);

  // xAxis = g => g
  //   .attr("transform", `translate(0,${height - margin.bottom})`)
  //   .call(d3.axisBottom(xScale).tickSizeOuter(0))
  //   .call(g => g.select(".domain").remove())

  xAxis = d3.axisBottom(xScale);  


  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(state.data, d => d3.max(state.data, d => d.value))])
    .rangeRound([height - margin.bottom, margin.top]);

    console.log("y-scale domain", yScale.domain()[1])


  // yAxis = g => g
  //   .attr("transform", `translate(${margin.left},0)`)
  //   .call(d3.axisLeft(yScale).ticks(null, "s"))
  //   .call(g => g.select(".domain").remove())
  //   .call(g => g.select(".tick:last-of-type text").clone()
  //     .attr("x", 3)
  //     .attr("text-anchor", "start")
  //     .attr("font-weight", "bold")
  //     .text(state.data.y))

  let yAxis = d3.axisLeft(yScale);


      // + UI ELEMENT SETUP
  const selectElement = d3
      .select("#dropdown1")
      .on("change", function () {
        console.log("New selection is", this.value);
        state.selectedMetric = this.value;
        draw(); // re-draw the graph based on this new selection
      });

    // add in dropdown options from the unique values in the data
  selectElement
      .selectAll("option")
      .data([default_metric,
        ...Array.from(new Set(state.data.map(d => d.metric))),
      ])
      .join("option")
      .attr("value", d => d)
      .text(d => d);

    // this ensures that the selected value is the same as what we have in state when we initialize the options
  selectElement.property("value", default_metric);

  // selectElement.on("change", event => {
  //   state.selectedMetric = event.target.value
  //   console.log('filtered :>> ', filteredData);
  //   draw();
  // })

  // const color = d3
  //   .scaleOrdinal()
  //   .range(["#3282b8", "#C70039"])

  // const legend = svg => {
  //   const g = svg
  //     .attr("transform", `translate(${width},0)`)
  //     .attr("text-anchor", "end")
  //     .attr("font-family", "sans-serif")
  //     .attr("font-size", 10)
  //     .style("font-family", "Noto Sans Mono")
  //     .selectAll("g")
  //     .data(color.domain().slice().reverse())
  //     .join("g")
  //     .attr("transform", (d, i) => `translate(0,${i * 20})`);

  //   g.append("rect")
  //     .attr("x", -30)
  //     .attr("width", 20)
  //     .attr("height", 20)
  //     .attr("fill", color);

  //   g.append("text")
  //     .attr("x", -35)
  //     .attr("y", 9.5)
  //     .attr("dy", "0.35em")
  //     .text(d => d)
  //     .attr("class", "legend");
  //   }

  svg = d3
    .select("#bar") // in index.html
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${margin.left},0)`)
    // .call(make_y_gridlines()
    //   .tickSize(-width)
    //   .tickFormat(""));

  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
      // .call(xAxis)
      // // .append("text")
      // .append("text")  
      // .selectAll("text")
      //   .attr("transform", "rotate(-40)")
      //   .style("text-anchor", "end")
      //   .attr("dx", "-.8em")
      //   .attr("dy", "20em");


  svg.append("g")
      .attr("class", "axis y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("y", "50%")
      .attr("dx", "-3em")
      .attr("writing-mode", "vertical-rl")
      .text("# Count");


  tooltip3 = d3.select("#bar")
      .append("div")
      .attr("class", "tooltip3")
      .attr("width", 50)
      .attr("height", 50)
      .style("position", "absolute")
      .style("opacity", 0)
      .style("background-color", "#C0AFCE")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      ;

    
  draw();

} 

// append bars

function draw() {
  // + FILTER DATA BASED ON STATE
  let filteredData = [];

  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(filteredData, d => d3.max(filteredData, d => d.value))])
    .rangeRound([height - margin.bottom, margin.top]);

  if (state.selectedMetric !== null) {
    filteredData = state.data.filter(d => d.metric === state.selectedMetric);
    yScale.domain([0, d3.max(filteredData, d => d3.max(filteredData, d => d.value))]);
  }

  console.log("filtered", filteredData);

//   let yScale = d3
//         .scaleLinear()
//         .domain([0, d3.max(filteredData, d => d3.max(d, d => d.value))])
//         .range([height - margin.bottom, margin.top]);

//   let yAxis = d3.axisLeft(yScale);


console.log("y-scale domain", yScale.domain()[1])

let yAxis = d3.axisLeft(yScale);

 // redraw y-axis
 d3.select("g.y-axis")
 .transition()
 .duration(1000)
 .call(yAxis.scale(yScale)); 

const rect = svg
  .selectAll(".rect")
  .data(filteredData, d => d.metric)
  .join(
  enter => enter
      .append("rect")
      .attr("class", "rect")
      .attr("x", d => xScale(d.month_year))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(0) - yScale(d.value))
      .attr("fill", "#3C01E2")
      .on("mouseover", d => {
        tooltip3
        .html("In " + "<strong>" + d.month_year + "</strong>" 
        + "<br/>" +  " I listened to "
        +  "<strong>" + d.value + "</strong>"
        +"<br/>" + "<strong>" + d.metric + "</strong>" )
        .transition()
        .duration(200)
        .style("opacity", 1)
        })
        .on("mouseout", d => {
        tooltip3
        .transition()
        .duration(100)
        .style("opacity", 0)
        })
        .on("mousemove", d => {
        d3.select(".tooltip3")
        .style("left", (d3.event.pageX+10) + "px")
        .style("top", (d3.event.pageY+10) + "px")
        }),
  update => update,
      exit =>
      exit.call(exit =>
          exit
          .transition(10)
          // .delay(d => d.value)
          // .duration(10)
          .attr("x", d => xScale(d.month_year))
          .attr("y", d => yScale(d.value))
          .attr("width", xScale.bandwidth())
          .attr("height", d => yScale(0) - yScale(d.value))
          .remove()
      )
  )
  .call(
      selection =>
      selection
          // .transition()
          // .duration(50)
          .attr("x", d => xScale(d.month_year))
          .attr("y", d => yScale(d.value))
          .attr("width", xScale.bandwidth())
          .attr("height", d => yScale(0) - yScale(d.value)));

// const bars = svg.append("g")
//   .selectAll("g")
//   .data(filteredData)
//   .join("g")
//   .selectAll("rect")
//   .data(filteredData)
//   .join("rect")
//   .attr("x", d => xScale(d.month_year))
//   // .duration(800)
//   .attr("y", d => yScale(d.value))
//   .attr("width", xScale.bandwidth())
//   .attr("height", d => yScale(0) - yScale(d.value))
//   // .delay(function(d,i){console.log(i) ; return(i*100)})
//   .attr("fill", "#3C01E2")
//   .style("opacity", 0.7)


// svg.append("g")
//   .call(legend)
//   .style("opacity", 0.9);

return svg.node();

}
  
};

      // .on("mouseover", d => {
      // tooltip3
      // .html("Country: " + "<strong>" + d.country + "</strong>"
      // + "<br/>" + "Total Number of Players: " 
      // + "<strong>" + d.players + "</strong>" 
      // + "<br/>" + "Percent of All Players: " 
      // + "<strong>" + d.percentage + "%" + "</strong>")
      // .transition()
      // .duration(200)
      // .style("opacity", 1)
      // })
      // .on("mouseout", d => {
      // tooltip3
      // .transition()
      // .duration(100)
      // .style("opacity", 0)
      // })
      // .on("mousemove", d => {
      // d3.select(".tooltip3")
      // .style("left", (d3.event.pageX+10) + "px")
      // .style("top", (d3.event.pageY+10) + "px")
      // }),




