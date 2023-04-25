import React from 'react';

export default function RenderingHelp() {
  return (
    <div>
      <p>
        This website is not meant to be visited from the browser as a regular user,
        but rather from a headless browser (such as puppeteer) to make the export
        to pdf as easy as possible.
        You can obviously still preview how it will look like by visiting the
        comptition page.
      </p>
      <p>
        You can use the form below to help construct the URL, then you can use the
        pdf export helper in the <code>rendering</code> folder:
        edit <code>pdf.js</code> to include the appropriate url, then run the following:
        <pre>
          npm install<br/>
          node pdf.js
        </pre>
        You should then have a <code>schedules.pdf</code> file after some time
        depending on the size of your competition.
      </p>
    </div>
  );
}
