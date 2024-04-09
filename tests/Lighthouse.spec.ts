import { test, expect } from '@playwright/test';
//const fetch = require('node-fetch');
import * as userData from '../data/config.json'
test('has title', async ({ page }) => {
  //const fetch = (await import('node-fetch')).default;
  //const fetch = (await import('node-fetch')).default;
  // Now you can use fetch as usual
 
  
  // Example assertion or use the fetched data in your test
 
  const response = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url='+userData.baseUrl+'/&key=AIzaSyDUbvO9MNg6xnaIDvBl-mf6Rqc653BiXQI&category=ACCESSIBILITY');
  const data = await response.json();
  //console.log(data);

  // You can use the data fetched to interact with the page
  // For example, filling a form, clicking based on fetched data, etc.
  // await page.fill('#input-field', data.someProperty);
  let result = new Map<string, string[]>();
  const audits = data.lighthouseResult.audits;

  for (const key in audits) {
    const audit = audits[key];
    if (audit.score === 0) {
        const snippets = audit.details.items.map((item: any) => "\n"+item.node.snippet);
        result.set(audit.title, snippets);
    }
  }

// Logging the results to console for demonstration
  console.log("Results:");
  result.forEach((value, key) => {
    console.log(`Title: ${key}`);
    console.log(`Snippets:`);
    // value.forEach(snippet => {
    //     console.log(snippet);
    // });
});


  expect(await page.title()).not.toBeNull();
  const object = Object.fromEntries(result);
  const myJson = JSON.stringify(object);
// console.log(JSON.parse(myJson));
// console.log("***");
// console.log(myJson); 
  const fs = require('fs').promises;
// const jsonString = JSON.stringify(myJson);
// console.log(jsonString);
  fs.writeFile('lighthouse_data.json', myJson, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('JSON data saved to data.json');
    }
  });


});