import React, { useEffect, useState } from 'react';
import { Pie, Bar, Line} from 'react-chartjs-2';
import { Chart as ChartJS,ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import './piechart.css'; // Import CSS


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const PieChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [selectedData, setSelectedData] = useState(null); // State for detailed data of selected segment

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users'); // Replace with your API endpoint
        const data = await response.json();

        // Process data for the chart
        const labels = data.map(item => item.species_name);
        const counts = data.map(item => item.count);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Fruit Count',
              data: counts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle chart segment click
 const handleClick = async (event) => {
  const { index } = event;
  const speciesName = chartData.labels[index]; // Get the species name from chart data
  try {
    const response = await fetch(`http://localhost:5001/api/species/${encodeURIComponent(speciesName)}`); // Use encodeURIComponent
    const data = await response.json();
    if (response.ok) {
      setSelectedData(data[0]); // Assuming data is an array, take the first item
    } else {
      console.error('Error fetching details:', data.message);
    }
  } catch (error) {
    console.error('Error fetching details:', error);
  }
};

  const options = {
    plugins: {
      legend: { position: 'bottom' },
    },
    onClick: handleClick,
  };

  return (
    <div className="chart-container">
      <div className="chart-box">
        <h2 className="chart-title">Fruit Count Pie Chart</h2>
        <div className="pie-chart">
          {chartData ? <Pie data={chartData} options={options} /> : <p>Loading...</p>}
        </div>
      </div>
      <div className="chart-box">
        <h2 className="chart-title">Fruit Count Bar Chart</h2>
        <div className="bar-chart">
          {chartData ? <Bar data={chartData} options={options} /> : <p>Loading...</p>}
        </div>
      </div>
      <div className="chart-box">
        <h2 className="chart-title">Fruit Count Line Chart</h2>
        <div className="line-chart">
          {chartData ? <Line data={chartData} options={options} /> : <p>Loading...</p>}
        </div>
      </div>
      <div className="data-table-container">
        <h3>Details for Selected Species</h3>
        {selectedData ? (
          <ul>
            {selectedData.map((item, index) => (
              <li key={index}>{item.species_name}: {item.count}</li>
            ))}
          </ul>
        ) : (
          <p>Select a segment to view details</p>
        )}
      </div>
    </div>
  );
};



const BarChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch data from an API or another dynamic source
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users'); // Replace with your API endpoint
        const data = await response.json();

        // Process data for the chart
        const labels = data.map(item => item.species_name);
        const counts = data.map(item => item.count);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Fruit Count',
              data: counts,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Fruit Count Bar Chart',
      },
    },
  };

  // return (
  //   <div className="chart-container"> <div className='pie-chart'>
  //     {chartData ? <Bar data={chartData} options={options} /> : <p>Loading...</p>}
  //     </div>
  //   </div>
  // );
};


const LineChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Fetch data from an API or another dynamic source
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users'); // Replace with your API endpoint
        const data = await response.json();

        // Process data for the chart
        const labels = data.map(item => item.species_name);
        const counts = data.map(item => item.count);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Fruit Count Over Time',
              data: counts,
              fill: false,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              tension: 0.1, // Smooth the line
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Fruit Count Line Chart',
      },
    },
  };

  // return (
  //   <div className="chart-container">
  //     <h2 className="chart-title">Fruit Count Line Chart</h2> <div className='pie-chart'>
  //     {chartData.labels.length ? <Line data={chartData} options={options} /> : <p>Loading...</p>}
  //     </div>
  //   </div>
  // );
};


export { PieChart, BarChart, LineChart };