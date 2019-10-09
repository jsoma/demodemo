// import * as d3 from 'd3'

// const margin = { top: 30, left: 30, right: 30, bottom: 30 }
// const height = 400 - margin.top - margin.bottom
// const width = 680 - margin.left - margin.right

// const svg = d3
//   .select('#chart-4')
//   .append('svg')
//   .attr('height', height + margin.top + margin.bottom)
//   .attr('width', width + margin.left + margin.right)
//   .append('g')
//   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// function ready(datapoints) {
//   // Draw it all
// }

// BEGIN ANSWER KEY

import * as d3 from 'd3'

const margin = { top: 30, left: 50, right: 100, bottom: 30 }

const height = 400 - margin.top - margin.bottom

const width = 680 - margin.left - margin.right

const svg = d3
  .select('#chart-04')
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
  .line()
  .x(function(d) {
    return xPositionScale(d.Year)
  })
  .y(function(d) {
    return yPositionScale(d.Value)
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
    .attr('stroke-width', 1)
    .attr('stroke', function(d) {
      if (d.key === 'France') {
        return 'blue'
      } else {
        return 'grey'
      }
    })
    .attr('fill', 'none')

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('fill', function(d) {
      if (d.key === 'France') {
        return 'blue'
      } else {
        return 'grey'
      }
    })
    .attr('r', 3)
    .attr('cx', function(d) {
      return xPositionScale(d.values[d.values.length - 1].Year)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.values[d.values.length - 1].Value)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('font-size', '12px')
    .text(function(d) {
      return d.key
    })
    .attr('fill', function(d) {
      if (d.key === 'France') {
        return 'blue'
      } else {
        return 'grey'
      }
    })
    .attr('x', function(d) {
      return xPositionScale(d.values[d.values.length - 1].Year)
    })
    .attr('y', function(d) {
      return yPositionScale(d.values[d.values.length - 1].Value)
    })
    .attr('dx', 5)
    .attr('dy', 5)

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
