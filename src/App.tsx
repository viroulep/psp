import React, { useState, useEffect } from "react";
import { Competition } from "@wca/helpers";

import "./App.css";
import PersonalSchedules from "./components/PersonalSchedules";
import RenderingHelp from "./components/RenderingHelp";
import { REMOTES, WcifUrlSelector } from "./components/WcifUrlSelector";

function App() {
  const [wcif, setWcif] = useState<Competition | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(document.location.search);
  const id = params.get("id");
  const remote = params.get("remote") || "prod";
  useEffect(() => {
    if (!id || !remote || !REMOTES[remote]) {
      return;
    }
    const url = `${REMOTES[remote]}/api/v0/competitions/${id}/wcif/public`;
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if ("error" in json) {
          console.error(json);
          return;
        }
        setWcif(json);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id, remote]);
  return (
    <div className="App">
      {wcif && <PersonalSchedules wcif={wcif} />}
      {!wcif && !loading && (
        <>
          <RenderingHelp />
          <WcifUrlSelector setWcif={setWcif} />
        </>
      )}
      {loading && <p>Loading WCIF.</p>}
    </div>
  );
}

export default App;
