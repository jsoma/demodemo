// import * as d3 from 'd3'

// const margin = { top: 30, left: 30, right: 30, bottom: 30 }
// const height = 400 - margin.top - margin.bottom
// const width = 680 - margin.left - margin.right

// console.log('Building chart 3')

// const svg = d3
//   .select('#chart-3')
//   .append('svg')
//   .attr('height', height + margin.top + margin.bottom)
//   .attr('width', width + margin.left + margin.right)
//   .append('g')
//   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// // Create your scales

// // Do you need a d3.line function for this? Maybe something similar?

// // Import your data file using d3.csv

// function ready(datapoints) {
//   // Draw your dots
//   // Draw your areas
//   // Add your axes
// }

// BEGIN ANSWER KEY

import * as d3 from 'd3'

const margin = { top: 30, left: 50, right: 30, bottom: 30 }

const height = 400 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

const svg = d3
  .select('#chart-03')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .range([0, width])
  .domain([2000, 2014])
const yPositionScale = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, 500])
const colorScale = d3
  .scaleOrdinal()
  .range(['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f'])

// Create a d3.line function that uses your scales
const area = d3
  .area()
  .x0(function(d) {
    return xPositionScale(d.Year)
  })
  .y0(function(d) {
    return yPositionScale(d.Value)
  })
  .x1(function(d) {
    return xPositionScale(d.Year)
  })
  .y1(function(d) {
    return height
  })

d3.csv(require('../data/air-emissions.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Draw your dots

  const nested = d3
    .nest()
    .key(function(d) {
      return d.Country
    })
    .entries(datapoints)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('d', function(d) {
      return area(d.values)
    })
    .attr('opacity', 0.5)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('fill', function(d) {
      return colorScale(d.key)
    })

  // Add your axes
  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .lower()

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()
}
