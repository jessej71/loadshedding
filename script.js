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
    caption: 'Figure 1: A decade of load shedding events, expressed as monthly averages. No load shedding took place in 2016 or 2017.',
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
    ]
  })

  // Render the plot
  const div = document.querySelector("#heatmap_timeseries");
  div.append(plot);
});


d3.csv("data/date_stage_rain.csv").then(data => {
  const plot = Plot.plot({
    x: {label: "Precipitation (m per day)",domain:[0,.025]},
    y: {label: "Electricity Interuption (hours per day)"},
    title: "Power Interuptions vs. Precipitation",
    caption:"Figure 2: Power interuption derived from Eskom loadshedding data. Precipitation averaged over 200 km square region covering Mpungalanga providence. Rainbow colors show data density to express overlapping points. Linear regression and uncertainty appear in brown.",
    marks: [
      Plot.density(data, {x: (d) => +d.precip, y: (d) => d.stage*1.5, fill: "density",bandwidth:20,fillOpacity:.15}),
      Plot.linearRegressionY(data, {x: (d) => +d.precip, y: (d) => d.stage*1.5, stroke: "brown"}),
      Plot.dot(data, {x: (d) => +d.precip, y: (d) => d.stage*1.5, fill: "currentColor", r: 1.2}),
      Plot.tip(data, Plot.pointer({x: (d) => +d.precip, y: (d) => d.stage*1.5,title: (d) => d.date}))
    ]
  })
  // Render the plot
  const div = document.querySelector("#scatter_plot");
  div.append(plot);
});