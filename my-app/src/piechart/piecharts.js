import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

function PieChart() {
  const [chartData, setChartData] = useState({});
  const [details, setDetails] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    axios.get('http://localhost:5000/api/species')
      .then(response => {
        const speciesData = response.data;
        setChartData({
          labels: speciesData.map(item => item.species_name),
          datasets: [
            {
              label: 'Species Count',
              data: speciesData.map(item => item.species_count),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            }
          ]
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Handle click on pie chart segment
  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const speciesName = chartData.labels[index];
      axios.get(`http://localhost:5000/api/species/details?species_name=${speciesName}`)
        .then(response => {
          setDetails(response.data); // Set detailed data based on the selected segment
          setSelectedSpecies(speciesName);
        })
        .catch(error => console.error('Error fetching detail data:', error));
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%' }}>
        <h3>Species Pie Chart</h3>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.label}: ${context.raw}`;
                  }
                }
              }
            },
            onClick: handleClick
          }}
        />
      </div>
      <div style={{ width: '50%', paddingLeft: '20px' }}>
        <h3>Details for {selectedSpecies}</h3>
        {details.length > 0 ? (
          <ul>
            {details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        ) : (
          <p>Select a section to see details</p>
        )}
      </div>
    </div>
  );
}

export default PieChart;
