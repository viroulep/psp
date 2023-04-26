import React from "react";

export default function RenderingHelp() {
  return (
    <div>
      <p>
        This website is not meant to be visited from the browser as a regular
        user, but rather from a headless browser (such as puppeteer) to make the
        export to pdf as easy as possible. You can obviously still preview how
        it will look like by visiting the competition page; you can use the form
        below to help construct the URL.
      </p>
      <div>
        <p>
          You need to figure out the competition id you want to use, and where
          to get the data from (it defaults to the WCA's production website).
          Then you can use the node script in the <code>rendering</code> folder
          to create a pdf export. It boils down to running these commands:
        </p>
        <pre>
          cd rendering
          <br />
          npm install
          <br />
          node pdf.js competitionId prod
        </pre>
        <p>
          You should then have a <code>schedules.pdf</code> file after some time
          depending on the size of your competition.
        </p>
      </div>
    </div>
  );
}
