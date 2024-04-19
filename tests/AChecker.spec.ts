import { test, expect } from '@playwright/test';
import * as userData from '../data/config.json'
test('Accessibility Report', async ({ page }) => {
  console.log('Achecker Start');
  await page.goto('https://websiteaccessibilitychecker.com/checker/index.php');
  await expect(page).toHaveTitle('Web Accessibility Checker : Web Accessibility Checker');
  await page.fill('input#checkuri', userData.baseURL);
  await page.click('input#validate_uri');
  await page.waitForTimeout(5000);
  const elementsError = await page.locator('xpath=//div[@id="AC_errors"]/div[@class="gd_one_check"]/span/a');
  let elementsErrorCount=await elementsError.count();
  const textMap = new Map();
  for (let i = 1; i <= elementsErrorCount; i++) {
    const element = elementsError.nth(i-1);
    let text = await element.textContent();
    let words;
    const elementsDetail = await page.locator('xpath=(//div[@id="AC_errors"]/div[@class="gd_one_check"]/span/a)['+i+']/parent::span/following-sibling::table//code');
    let elementsDetailCount = await elementsDetail.count();
    let value ='';
    const myArray : string[]= [];
    for (let j = 1; j <= elementsDetailCount; j++) {
      let eli=await page.locator('xpath=((//div[@id="AC_errors"]/div[@class="gd_one_check"]/span/a)['+i+']/parent::span/following-sibling::table//code)['+j+']');
      if(eli!=null){
        value = await eli.evaluate(node => node.textContent)?? '';
      }
      myArray.push("\n"+value);
      textMap.set(text, myArray);
    }
}
const object = Object.fromEntries(textMap);
const myJson = JSON.stringify(object); 
const fs = require('fs').promises;
fs.writeFile('achecker_data.json', myJson, (err) => {
  if (err) {
      console.error(err);
  } else {
      console.log('JSON data saved to data.json');
  }
});
console.log('Achecker End');
});