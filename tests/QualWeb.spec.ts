import { test, expect } from '@playwright/test';
import * as userData from '../data/config.json'
test('Accessibility Report', async ({ page }) => {
  console.log('Qual Web Start');
  await page.goto('https://qualweb.di.fc.ul.pt/evaluator/');
  await expect(page).toHaveTitle('QualWeb');
  await page.fill('//input[@type="url"]', userData.baseURL);
  //await page.waitForTimeout(3000);
  await page.locator('xpath=//input[@type="submit"]').click();
  //await page.waitForTimeout(10000);
  
  let isChecked = await page.isChecked('input#mat-checkbox-3-input');
  if(isChecked){
    await page.locator('//input[@id="mat-checkbox-3-input"]').click({ force: true });
  }
  
  isChecked = await page.isChecked('input#mat-checkbox-5-input');
  if(isChecked){
    await page.locator('//input[@id="mat-checkbox-5-input"]').click({ force: true });
  }
  const elementsError = await page.locator('//div[@id="main"]/mat-expansion-panel');
  let elementsErrorCount=await elementsError.count();
  console.log(elementsErrorCount);
  await page.waitForTimeout(10000);
  const textMap = new Map();
  for (let i = 1; i <= elementsErrorCount; i++) {
    //await page.waitForTimeout(10000);
    const element = elementsError.nth(i-1);
    await element.click();
    //await page.waitForTimeout(10000);
    let keyElement = await page.locator('xpath=(//div[@id="main"]/mat-expansion-panel)['+i+']//div[@class="around_title"]/h2');
    let keyText = await keyElement.textContent();
    console.log(keyText);

    let valueElement = await page.locator('xpath=(//div[@id="main"]/mat-expansion-panel)[1]//div[@class="around_title"]/h2//ancestor::mat-expansion-panel-header/following-sibling::div//span[text()="Failed"]/parent::h3/following-sibling::cdk-virtual-scroll-viewport//mat-card');
    let  valueElementsCount = await valueElement.count();
    const myArray : string[]= [];
    console.log('ch01');
    console.log(valueElementsCount);
    console.log('ch02');
    for (let j = 1; j <= valueElementsCount; j++){
      let valueElements = await page.locator('xpath=((//div[@id="main"]/mat-expansion-panel)[1]//div[@class="around_title"]/h2//ancestor::mat-expansion-panel-header/following-sibling::div//span[text()="Failed"]/parent::h3/following-sibling::cdk-virtual-scroll-viewport//mat-card['+j+']//code)[1]');
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
    //await page.goBack();
}

const object = Object.fromEntries(textMap);
const myJson = JSON.stringify(object);
const fs = require('fs').promises;

fs.writeFile('qualweb_data.json', myJson, (err) => {
  if (err) {
      console.error(err);
  } else {
      console.log('JSON data saved to data.json');
  }
});
console.log('Qual Web End');

});