// import * as d3 from 'd3'

// // Set up margin/height/width

// // I'll give you the container
// let container = d3.select('#chart-06')

// // Create your scales

// // Create a d3.line function that uses your scales

// // Read in your data

// // Build your ready function that draws lines, axes, etc

// BEGIN ANSWER KEY

import * as d3 from 'd3'

const margin = { top: 30, left: 25, right: 20, bottom: 20 }

const height = 120 - margin.top - margin.bottom

const width = 90 - margin.left - margin.right

const container = d3.select('#chart-06')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([12, 55])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.line function that uses your scales
const jpArea = d3
  .line()
  .x(d => xPositionScale(d.Age))
  .y(d => yPositionScale(d.ASFR_jp))

const usArea = d3
  .line()
  .x(d => xPositionScale(d.Age))
  .y(d => yPositionScale(d.ASFR_us))

d3.csv(require('../data/fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(d => d.Year)
    .entries(datapoints)

  // Draw your dots
  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const svg = d3.select(this)

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12')

      const usValues = d.values.map(d => d.ASFR_us)
      const usSum = d3.sum(usValues).toFixed(2)

      svg
        .append('text')
        .text(usSum)
        .attr('x', width * 0.8)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10')
        .attr('fill', 'cyan')

      const jpValues = d.values.map(d => d.ASFR_jp)
      const jpSum = d3.sum(jpValues).toFixed(2)

      svg
        .append('text')
        .text(jpSum)
        .attr('x', width * 0.8)
        .attr('y', 32)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10')
        .attr('fill', 'red')

      svg
        .append('path')
        .attr('d', usArea(d.values))
        .attr('fill', 'cyan')
        .attr('opacity', 0.5)

      svg
        .append('path')
        .attr('d', jpArea(d.values))
        .attr('fill', 'red')
        .attr('opacity', 0.5)

      const xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      const yAxis = d3.axisLeft(yPositionScale).ticks(3)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
