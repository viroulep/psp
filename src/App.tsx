import React from 'react';
import { Competition } from '@wca/helpers';

import './App.css';
import PersonalSchedules from './components/PersonalSchedules';


function App() {
  const wcif = require("./wcif.json") as Competition;
  return (
    <div className="App">
      <PersonalSchedules wcif={wcif} />
    </div>
  );
}

export default App;
