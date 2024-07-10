import { test, expect } from '@playwright/test';
import * as userData from '../data/config.json'
test('Accessibility Report', async ({ page }) => {
  console.log('Access Monitor Start');
  await page.goto('https://accessmonitor.acessibilidade.gov.pt/');
  await expect(page).toHaveTitle('Access Monitor Plus');
  await page.fill('input#url', userData.baseURL);
  await page.waitForTimeout(3000);
  await page.locator('xpath=(//div[@class="card_actions"]/button)[1]').click();
  await page.waitForTimeout(10000);
  const elementsError = await page.locator('xpath=//table[@class="evaluation-table"]/tbody//td[@class="rowerr"]/following-sibling::td[3]/a');
  let elementsErrorCount=await elementsError.count();
  console.log(elementsErrorCount);
  const textMap = new Map();
  for (let i = 1; i <= elementsErrorCount; i++) {
    const element = elementsError.nth(i-1);
    await element.click();
    //await page.waitForTimeout(10000);
    let keyElement = await page.locator('xpath=//div[@class="R result"]/following-sibling::span[1]');
    let keyText = await keyElement.textContent();
    console.log(keyText);

    let valueElement = await page.locator('xpath=(//th/strong[text()="Code:"]/parent::th/following-sibling::td/code)');
    let  valueElementsCount = await valueElement.count();
    const myArray : string[]= [];
    console.log('ch01');
    console.log(valueElementsCount);
    console.log('ch02');
    for (let j = 1; j <= valueElementsCount; j++){
      let valueElements = await page.locator('xpath=(//th/strong[text()="Code:"]/parent::th/following-sibling::td/code)['+j+']');
      let valueElementsText = await valueElements.textContent();
      console.log('valueElementsText');
      console.log(valueElementsText);
      console.log('valueElementsText1');
      if (valueElementsText !== null) {
        myArray.push("\n"+valueElementsText);
      } else {
        console.log("Value is null or element not found");
      }
    }
    textMap.set(keyText, myArray);
    console.log(myArray);
    console.log(textMap);
    await page.goBack();
}

const object = Object.fromEntries(textMap);
const myJson = JSON.stringify(object);
const fs = require('fs').promises;

fs.writeFile('accessmonitor_data.json', myJson, (err) => {
  if (err) {
      console.error(err);
  } else {
      console.log('JSON data saved to data.json');
  }
});
console.log('AccessMonitor End');

});