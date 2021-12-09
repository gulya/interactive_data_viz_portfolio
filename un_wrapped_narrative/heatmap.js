export function heatmap() {


    // Mike Bostock: https://observablehq.com/@d3/grouped-bar-chart
  
    const width = window.innerWidth * 0.65,
    height = window.innerHeight * 0.6,
    margin = {
      top: 20,
      bottom: 175,
      left: 225,
      right: 10
    },
    paddingInner = 0.1;
  
    const formatDate = d3.timeFormat("%b-%Y");

    /* APPLICATION STATE */
    let state = {
        data: [],
    };
  
      // these variables, initially empty, let us access
    // anything we manipulate in init() but need access to in draw()
    let svg;
    let xScale;
    let yScale;
    let yAxis;
    let xAxis;
    let tooltip2;
    let myColor;

  
  
      /* LOAD DATA */
  
    d3.csv("../data/fav_artists.csv", d => ({
      date: d.date,
      value: +d.length,
      artist: d.artist,
      albums: +d.album,
      tracks: +d.song
      })).then(data => {
      console.log("heatmap data:", data);
      state.data = data;
      init();
      });
  
    /* INITIALIZING FUNCTION */
  // this will be run one time when the data finishes loading
  function init() {
    xScale = d3.scaleBand()
      .domain(state.data.map(d => d.date))
      .rangeRound([margin.left, width - margin.right])
 
  
  
    yScale = d3
      .scaleBand()
      .domain(state.data.map(d => d.artist))
      .rangeRound([height - margin.bottom, margin.top]);

    xAxis = d3.axisBottom()
    .scale(xScale);

    yAxis = d3.axisLeft()
    .scale(yScale);
    


    svg = d3
        .select("#heatmap") // in index.html
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    
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
    
    
    tooltip2 = d3.select("#heatmap")
          .append("div")
          .attr("class", "tooltip2")
        //   .attr("width", 50)
        //   .attr("height", 50)
          .style("position", "absolute")
          .style("opacity", 0)
          .style("background-color",  "#C0AFCE")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          ;

    myColor = d3.scaleLinear()
          .range([ "#9BEEE1", "#3C01E2",])
          .domain([3,770])
        
      
    draw();
  
  } 
  
  // append bars
  
  function draw() {



  
    const rect = svg.selectAll()
    .data(state.data)
    .enter()
    .append('rect')
      .attr("x", d=>xScale(d.date))
      .attr("y", d=>yScale(d.artist))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth() )
      .style("fill", d=>myColor(d.value))
      .on("mouseover", d => {
        tooltip2
        // .html(<iframe src="https://open.spotify.com/embed/track/3ZpaCbdt4CtpHHGOhwOa4n?utm_source=generator" width="100%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"> </iframe>)
        .html("In " + "<strong>" + d.date + "</strong>" 
        + "<br/>" +  " I listened to "
        +  "<strong>" + d.value + "</strong>" + " minutes, " 
        + "<br/>" + "<strong>" + d.albums + "</strong>" + " albums, " 
        + "<br/>" + "<strong>" + d.tracks + "</strong>" + " songs by " 

        +"<br/>" + "<strong>" + d.artist + "</strong>" )
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("left", (d3.event.pageX+10) + "px")
        .style("top", (d3.event.pageY+10) + "px")
        })
      .on("mouseout", d => {
        tooltip2
        .transition()
        .duration(100)
        .style("opacity", 0)
        })
    .on("mousemove", d => {
        d3.select(".tooltip2")
        .style("left", (d3.event.pageX+10) + "px")
        .style("top", (d3.event.pageY+10) + "px")
        })

    return svg.node();

  }
    
  };
  


  
  
  