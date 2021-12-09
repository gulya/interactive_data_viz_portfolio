export function table() {

  // constants
  const width = window.innerWidth * 0.35, // 40% of window width
    height = window.innerHeight * 0.4,
    margin = {
      top: 20,
      bottom: 10,
      left: 10,
      right: 10
    }

  d3.csv("../data/playlist.csv", d3.autoType)
    //.then(data => { console.log("data loaded:", data); })
    .then(data => {

      const columns = ["Track", "Artist", "Album"];

      const table = d3
        .select("#table")
        .append("table")
        .attr("width", width)
        .attr("height", height)
        .style("border-spacing", "0");

      table
        .append("thead")
        .append("tr")
        .selectAll("th")
        .data(columns)
        .join("th")
        .text(d => d) // column names to appear
        .attr("class", "columns");

      const rows = table
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .join("tr");

      rows
        .selectAll("td")
        .data(d => Object.values(d))
        .join("td")
        .text(d => d);

    });

}