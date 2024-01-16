import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.8.5/+esm';

// Use d3 to load a CSV file
const tp = d3.timeParse("%Y-%m-%d %H:%M:%S");

d3.csv("data/eskom_shed.csv").then(data => {

  const plot = Plot.plot({
    padding: 0.0,
    x: { label: "Month", tickFormat: Plot.formatMonth("en", "short") },
    y: { label: "Year", transform: (d) => d == 124 ? '2024' : "'".concat(String(d - 100)) },
    color: {
      type: "linear",
      label: "Hours per day without electricity",
      range: ["white", "orange", "red", "brown", "black"],
      legend: true
    },
    title: "Load Shedding in South Africa",
    marks: [
      Plot.cell(data, Plot.group({ fill: "mean" }, {
        x: (d) => tp(d.date).getMonth(),
        y: (d) => tp(d.date).getYear(),
        fill: (d) => d.stage * 1.5,
        inset: 0.5,
        tip: {
          format: {
            stroke: true,
            y: true,
            x: (d) => `${d + 1}`
          }
        }

      }))
      /*,
      Plot.tip(
        [`2016-2017, a period of no load shedding.`],
        { x: new Date("2016-06-16").getMonth(), y: new Date("2016-06-16").getYear(), dy: 10, anchor: "middle" }
      )*/
    ]
  })

  // Render the plot
  const div = document.querySelector("#heatmap_timeseries");
  div.append(plot);
});