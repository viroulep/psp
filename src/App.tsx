import React, { useState, useEffect } from 'react';
import { Competition } from '@wca/helpers';

import './App.css';
import PersonalSchedules from './components/PersonalSchedules';


function App() {
  //const wcif = require("./wcif.json") as Competition;
  const id = "FrenchChampionship2023";
  const [wcif, setWcif] = useState(undefined);
  useEffect(() => {
    console.log("coucou");
    fetch(`https://staging.worldcubeassociation.org/api/v0/competitions/${id}/wcif/public`)
      .then(response => response.json())
      .then(setWcif)
      .catch(error => console.log(error));
  }, [id])
  return (
    <div className="App">
      {wcif ? (
        <PersonalSchedules wcif={wcif} />
      ) : (
        <div>
          No WCIF yet.
        </div>
      )}
    </div>
  );
}

export default App;
