import React, { useState } from 'react';

export const REMOTES: { [key: string]: string } = {
  "prod": "https://www.worldcubeassociation.org",
  "staging": "https://staging.worldcubeassociation.org",
  "env": process.env.REACT_APP_WCA_HOST || "",
}

type SelectorProps = {
  setWcif: (wcif: any) => void;
};

export function WcifUrlSelector({ setWcif } : SelectorProps) {
  const [baseUrl, setBaseUrl] = useState("prod");
  const [id, setId] = useState("");

  return (
    <div>
      <label>Select the remote:
        <select
          value={baseUrl}
          onChange={e => setBaseUrl(e.target.value)}
        >
          {Object.keys(REMOTES).map(k => {
            return (
              <option value={k} key={k}>{REMOTES[k]}</option>
            );
          })}
        </select>
      </label>
      <br />
      <label>Competition id:
        <input
          value={id}
          onChange={e => setId(e.target.value)}
        />
      </label>
      <br />
      {id.length > 0 && (
        <a href={`?id=${id}&remote=${baseUrl}`}>go</a>
      )}
    </div>
  );
}
