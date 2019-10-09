// import * as d3 from 'd3'

// const margin = { top: 30, left: 100, right: 30, bottom: 30 }
// const height = 400 - margin.top - margin.bottom
// const width = 680 - margin.left - margin.right

// console.log('Building chart 1')

// const svg = d3
//   .select('#chart-01')
//   .append('svg')
//   .attr('height', height + margin.top + margin.bottom)
//   .attr('width', width + margin.left + margin.right)
//   .append('g')
//   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// // Create a time parser
// const parseTime = d3.timeParse('%Y-%m-%d')

// // Create your scales

// // Create a d3.line function that uses your scales

// d3.csv(require('../data/AAPL.csv'))
//   .then(ready)
//   .catch(err => {
//     console.log(err)
//   })

// function ready(datapoints) {
//   // After we read in our data, we need to clean our datapoints
//   // up a little bit. d.Date is a string to begin with, but
//   // treating a date like a string doesn't work well. So instead
//   // we use parseTime (which we created up above) to turn it into a date.
//   datapoints.forEach(function(d) {
//     d.datetime = parseTime(d.Date)
//   })
//   // Update your scales

//   // Draw your dots

//   // Draw your single

//   // Add your axes
// }

// BEGIN ANSWER KEY

import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'

d3.tip = d3Tip

const margin = { top: 30, left: 50, right: 30, bottom: 30 }

const height = 400 - margin.top - margin.bottom

const width = 680 - margin.left - margin.right

const svg = d3
  .select('#chart-01')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser
const parseTime = d3.timeParse('%Y-%m-%d')
const timeFormat = d3.timeFormat('%Y-%m-%d')

// Create your scales
const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

// Create a d3.line function that uses your scales
const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.Close)
  })

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
    return (
      "<strong>Close:</strong> <span style='color:red'>" + d.Close + '</span>'
    )
  })
svg.call(tip)

d3.csv(require('../data/AAPL.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.Date)
  })

  const dates = datapoints.map(function(d) {
    return d.datetime
  })
  const closes = datapoints.map(function(d) {
    return +d.Close
  })

  const closeMax = d3.max(closes)
  const closeMin = d3.min(closes)

  const dateMax = d3.max(dates)
  const dateMin = d3.min(dates)

  xPositionScale.domain([dateMin, dateMax])
  yPositionScale.domain([closeMin, closeMax])

  // Draw your dots

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('cx', function(d) {
      return xPositionScale(d.datetime)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.Close)
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  // Draw your single line
  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  const annotations = [
    {
      type: d3Annotation.annotationCalloutCircle,
      note: {
        label: 'Longer text to show text wrapping',
        title: 'Annotations :)'
      },
      data: { Date: '2016-04-11', Close: 110 },
      subject: { radius: 50 },
      dy: -30,
      dx: 72,
      color: 'red',
      connector: { end: 'dot' }
    },
    {
      type: d3Annotation.annotationCallout,
      note: {
        label: 'Longer text to show text wrapping',
        bgPadding: 10,
        title: 'Annotations :)'
      },
      data: { Date: '2015-12-14', Close: 106.029999 },
      connector: { end: 'arrow' },
      className: 'show-bg',
      dy: 80,
      dx: -12,
      color: 'red'
    },
    {
      type: d3Annotation.annotationCalloutRect,
      note: {
        title: 'Range annotation',
        label: 'This shows you a section',
        wrap: 75,
        lineType: 'none'
      },
      // can use x, y directly instead of data
      x: xPositionScale(parseTime('2016-01-01')),
      y: 0,
      disable: ['connector'], // doesn't draw the connector
      dy: 20,
      dx: 15,
      subject: {
        width:
          xPositionScale(parseTime('2016-03-01')) -
          xPositionScale(parseTime('2016-01-01')),
        height: height
      }
    }
  ]

  const makeAnnotations = d3Annotation
    .annotation()
    .accessors({
      x: d => xPositionScale(parseTime(d.Date)),
      y: d => yPositionScale(d.Close)
    })
    .annotations(annotations)

  svg.call(makeAnnotations)
  // document.fonts.ready.then(function() {
  //       .append('g')
  //       .attr('class', 'annotation-group')
  //       .style('font-size', '12')
  //   })

  // Add your axes
  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%m/%d/%y'))
    .ticks(9)

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
