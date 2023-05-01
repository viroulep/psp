/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const puppeteer = require('puppeteer');

const argc = process.argv.length;
if (argc < 3) {
  console.log('Usage: node pdf.js competitionId [prod|staging|env]');
  return;
}


const remote = argc == 4 ? process.argv[3] : 'prod';
const competitionId = process.argv[2];
const pdfName = 'schedules.pdf';

console.log(`Generating pdf for '${competitionId}' from '${remote}' in ${pdfName}`);
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(`https://philippevirouleau.fr/psp/?id=${competitionId}&remote=${remote}`, {
    waitUntil: 'networkidle0',
  });
  await page.emulateMediaType('screen');
  // page.pdf() is currently supported only in headless mode.
  // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
  await page.pdf({
    path: pdfName,
    format: 'a4',
  });

  await browser.close();
})();
