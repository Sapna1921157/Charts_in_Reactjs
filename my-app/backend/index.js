const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');  // Import path for static file serving

const app = express();
const port = 5000;

app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Replace with your actual MySQL username
    password: '',  // Replace with your actual MySQL password
    database: 'test'  // Replace with your actual database name
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected!');
});


const getSpeciesDetails = (speciesName) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM species WHERE species_name = ?';
    console.log(`Executing query: ${query} with value: ${speciesName}`); // Log the query
    db.query(query, [speciesName], (err, results) => {
      if (err) {
        console.error('Database query error:', err); // Log database query error
        return reject(err);
      }
      console.log('Query results:', results); // Log results
      resolve(results);
    });
  });
};

// API endpoint
app.get('/api/users', async (req, res) => {
  const { speciesName } = req.params;
  try {
    const data = await getSpeciesDetails(speciesName);
    if (data.length > 0) {
      res.json(data);
    } else {
      res.status(404).send({ message: 'Species not found' });
    }
  } catch (error) {
    console.error('Error fetching details:', error);
    res.status(500).send({ message: 'Error fetching details' });
  }
});



// Serve the React frontend build files
app.use(express.static(path.join(__dirname, '../build', 'build')));

// Handle React routing, return index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
