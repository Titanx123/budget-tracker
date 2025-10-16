import React, { useEffect, useState, useRef } from 'react';
import { fetchDashboardSummary } from '../services/api';
import * as d3 from 'd3';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef();
  const pieChartRef = useRef();


  useEffect(() => {
    fetchDashboardSummary()
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard summary:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (summary) {
    //   const data = [
    //     { label: 'Income', value: summary.income_total || 0 },
    //     { label: 'Expenses', value: summary.expense_total || 0 }
    //   ];
    const data = [
        { label: 'Income', value: summary.income_total || 0 },
        { label: 'Expenses', value: summary.expense_total || 0 }
      ];
      

      const svg = d3.select(chartRef.current);
      svg.selectAll('*').remove();

      const width = 400;
      const height = 200;
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };

      const x = d3
        .scaleBand()
        .domain(data.map(d => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.2);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const xAxis = g =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));

      const yAxis = g =>
        g.attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

      svg.append('g').call(xAxis);
      svg.append('g').call(yAxis);

      svg
        .selectAll('.bar')
        .data(data)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.label))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => y(0) - y(d.value))
        .attr('fill', d => (d.label === 'Income' ? 'green' : 'red'));
    }
  }, [summary]);

  
  useEffect(() => {
    if (summary && summary.expenses_by_category && summary.expenses_by_category.length > 0) {
      // Prepare data
      const data = summary.expenses_by_category.map(item => ({
        category: item["category__name"],
        value: item.total
      }));
  
      const width = 300, height = 300, margin = 30;
      const radius = Math.min(width, height) / 2 - margin;
  
      const svg = d3.select(pieChartRef.current);
      svg.selectAll('*').remove();
  
      // Create group element
      const g = svg
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
  
      // Create color scale
      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.category))
        .range(d3.schemeSet2);
  
      // Compute pie
      const pie = d3.pie()
        .sort(null)
        .value(d => d.value);
  
      const data_ready = pie(data);
  
      // Arc generator
      const arc = d3.arc()
        .innerRadius(60) // Change for donut/pie
        .outerRadius(radius);
  
      // Draw slices
      g.selectAll('path')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.category))
        .attr('stroke', '#fff')
        .style('stroke-width', '2px');
        const tooltip = d3.select("#tooltip");

        g.selectAll('path')
          .on('mouseover', function(event, d) {
            tooltip
              .style("visibility", "visible")
              .html(`<strong>${d.data.category}:</strong> $${d.data.value.toFixed(2)}`)
              .style("left", (event.pageX + 15) + "px")
              .style("top", (event.pageY - 28) + "px");
            d3.select(this).attr("opacity", 0.7);
          })
          .on('mousemove', function(event) {
            tooltip
              .style("left", (event.pageX + 15) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on('mouseout', function() {
            tooltip.style("visibility", "hidden");
            d3.select(this).attr("opacity", 1.0);
          });
        
      // Add category labels
      g.selectAll('text')
        .data(data_ready)
        .enter()
        .append('text')
        .text(d => d.data.category)
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "12px");
    }
  }, [summary]);
  
  if (loading) return <div>Loading...</div>;

  if (!summary) return <div>No data available</div>;

  return (
    <div>
      <h1>Dashboard Summary</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <SummaryCard title="Income Total" amount={summary.income_total} color="green" />
        <SummaryCard title="Expense Total" amount={summary.expense_total} color="red" />
        <SummaryCard title="Balance" amount={summary.balance} color="blue" />
        <SummaryCard title="Budget Amount" amount={summary.budget_amount} color="purple" />
        <SummaryCard title="Budget Remaining" amount={summary.budget_remaining} color="orange" />
        {/* <SummaryCard title="Budget Used (%)" amount={`${(summary.budget_percentage * 100).toFixed(2)}%`} color="teal" /> */}
      </div>
      
      <svg ref={chartRef} width={400} height={200} />

      <h2>Expenses by Category</h2>
      <svg ref={pieChartRef} width={300} height={300}></svg>

    </div>
  );
}

const SummaryCard = ({ title, amount, color }) => (
  <div
    style={{
      border: `1px solid ${color}`,
      borderRadius: '8px',
      padding: '16px',
      width: '150px',
      color,
      textAlign: 'center'
    }}
  >
    <h3>{title}</h3>
    <p>{typeof amount === 'number' ? amount.toLocaleString() : amount}</p>
  </div>
);

export default Dashboard;
