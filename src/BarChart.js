// src/BarChart.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef();

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(response => response.json())
      .then(data => setData(data.data));
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 800;
    const height = 400;
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };

    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleTime()
      .domain([new Date(data[0][0]), new Date(data[data.length - 1][0])])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[1])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const barWidth = (width - margin.left - margin.right) / data.length;

    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(new Date(d[0])) - barWidth / 2)
      .attr('y', d => y(d[1]))
      .attr('height', d => y(0) - y(d[1]))
      .attr('width', barWidth - 1)
      .attr('data-date', d => d[0])
      .attr('data-gdp', d => d[1])
      .on('mouseover', (event, d) => {
        d3.select('#tooltip')
          .style('opacity', 1)
          .html(`Date: ${d[0]}<br>GDP: ${d[1]}`)
          .attr('data-date', d[0])
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        d3.select('#tooltip').style('opacity', 0);
      });
  }, [data]);

  return (
    <div className="chart-container">
      <h1 id="title">US GDP Over Time</h1>
      <svg ref={chartRef}></svg>
      <div id="tooltip" style={{ position: 'absolute', opacity: 0 }}></div>
    </div>
  );
};

export default BarChart;
