import React from 'react';
import  { PieChart, BarChart, LineChart,  }  from './piechart/piecharts';

const App = () => {
    return (
        <div>
                <h1>My React Charts</h1>
            <PieChart />
              <BarChart />
              <LineChart />
              
         
        </div>
    );
};

export default App;