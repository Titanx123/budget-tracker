import React, { useEffect, useState, useRef } from 'react';
import { fetchBudgetByMonth, fetchTransactions } from '../services/api';
import * as d3 from 'd3';

function Budgets() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const chartRef = useRef();

  useEffect(() => {
    async function loadBudgetAndExpenses() {
      setLoading(true);
      setError('');

      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');

      try {
        const budgetData = await fetchBudgetByMonth(month, year);
        console.log(budgetData)
        setBudget(budgetData?.budget_amount || 0);

        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-31`;

        const transactions = await fetchTransactions({ start_date: startDate, end_date: endDate });
        const totalExpenses = transactions.results
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        setExpenses(totalExpenses);

        drawChart(budgetData?.budget_amount || 0, totalExpenses);
      } catch (err) {
        setError('Error loading budget data.');
      } finally {
        setLoading(false);
      }
    }

    loadBudgetAndExpenses();
  }, []);
  console.log(budget)
  const drawChart = (budgetAmount, expensesAmount) => {
    const data = [
      { label: 'Budget', value: budgetAmount },
      { label: 'Expenses', value: expensesAmount }
    ];

    const width = 350, height = 250;
    const margin = { top: 30, right: 20, bottom: 40, left: 50 };

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3.select(chartRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.3])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "14px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "14px");

    svg.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.label))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", d => d.label === 'Budget' ? '#10b981' : '#ef4444');
  };

  if (loading) return <p>Loading budget...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
  <div style={{ maxWidth: 420, margin: '20px auto', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
    <h2>Monthly Budget Overview</h2>
    {budget === 0 ? (
      <p><em>No budget set for this month.</em></p>
    ) : (
      <>
        <p><strong>Budget:</strong> ${budget.toFixed(2)}</p>
        <p><strong>Expenses:</strong> ${expenses.toFixed(2)}</p>
        <svg ref={chartRef}></svg>
      </>
    )}
  </div>
);
}

export default Budgets;
