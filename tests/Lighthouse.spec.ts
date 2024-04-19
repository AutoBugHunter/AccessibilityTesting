import { test, expect } from '@playwright/test';

import * as userData from '../data/config.json'
test('Accessibility Report', async ({ page }) => {
  console.log('Lighthouse Start');
  console.log(userData.baseURL[userData.baseURL.length-1]);
  let baseURL = userData.baseURL;
  if(userData.baseURL.endsWith('/')){
    baseURL = userData.baseURL.slice(0,-1);
  }
  const response = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url='+baseURL+'/&key=AIzaSyDUbvO9MNg6xnaIDvBl-mf6Rqc653BiXQI&category=ACCESSIBILITY');
  const data = await response.json();
  console.log(data);
  let result = new Map<string, string[]>();
  const audits = data.lighthouseResult.audits;
  for (const key in audits) {
    const audit = audits[key];
    if (audit.score === 0) {
        const snippets = audit.details.items.map((item: any) => "\n"+item.node.snippet);
        result.set(audit.title, snippets);
    }
  }
  expect(await page.title()).not.toBeNull();
  const object = Object.fromEntries(result);
  const myJson = JSON.stringify(object);
  const fs = require('fs').promises;
  fs.writeFile('lighthouse_data.json', myJson, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('JSON data saved to data.json');
    }
  });
  console.log('Lighthouse End');
});