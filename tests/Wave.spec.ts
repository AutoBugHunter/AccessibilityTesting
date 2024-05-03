import { test, expect } from '@playwright/test';
import * as userData from '../data/config.json'
test('Accessibility Report', async ({ page }) => {
  console.log('Wave Start');
  await page.goto('https://wave.webaim.org/');
  await expect(page).toHaveTitle('WAVE Web Accessibility Evaluation Tools');
  await page.fill('input#input_url', userData.baseURL);
  await page.click('input#button_wave');
  await page.click('button#tab-details');
  await page.waitForTimeout(5000);
  const elementsError = await page.locator('xpath=//ul[contains(@id,"group_list_error") or contains(@id,"group_list_contrast")]/li');
  let elementsErrorCount=await elementsError.count();
  let limitCount = await page.locator('xpath=//ul[contains(@id,"group_list_error")]/li').count();
  const textMap = new Map();
  for (let i = 1; i <= elementsErrorCount; i++) {
    const element = elementsError.nth(i-1);
    let text = await element.textContent();
    let words;
    if(text!=null){
      words = text.split(' X ');
    }
    let elementsDetail;
    if(i>limitCount){
      elementsDetail = await page.locator('xpath=//ul[contains(@id,"group_list_contrast")]/li[1]/ul/li/img');
    }
    else{
      elementsDetail = await page.locator('xpath=//ul[contains(@id,"group_list_error")]/li['+i+']/ul/li/img');
    }
    let elementsDetailCount = await elementsDetail.count();
    let value = '';
    const myArray : string[]= [];
    console.log(elementsDetailCount);
    console.log(i + " value of i");
    console.log(limitCount + " value of limitCount");
    for (let j = 1; j <= elementsDetailCount; j++) {
      if(i>limitCount){
        await page.locator('xpath=//ul[contains(@id,"group_list_contrast")]/li[1]/ul/li['+j+']/img').click();      
      }
      else{
        await page.locator('xpath=//ul[contains(@id,"group_list_error")]/li['+i+']/ul/li['+j+']/img').click();
      }
      
      const iframeElement = page.frameLocator('#report');
      if(iframeElement!=null){
        let eli;
        if(words[1]=='Empty link'){
          eli=await iframeElement.locator('xpath=((//img[@alt="ERRORS: '+words[1]+'"])['+j+'])/parent::*[1]');
        }
        else if(words[1]=='Page refreshes or redirects'){
          
        }
        else if(i>limitCount){
          eli=await iframeElement.locator('xpath=((//img[@alt="CONTRAST ERRORS: '+words[1]+'"])['+j+'])/parent::*[1]');
        }
        else{
          eli=await iframeElement.locator('xpath=((//img[@alt="ERRORS: '+words[1]+'"])['+j+'])/preceding-sibling::*[1]');
        }
        let outerHtml;
        if(words[1]=='Page refreshes or redirects' || words[1]=='Missing or uninformative page title'  || words[1]=='Language missing or invalid'){
          outerHtml = 'Applies to entire page.';
        }
        else{
          console.log(words[1]+ " 00009999  "+j);
          outerHtml = await eli.evaluate(node => node.outerHTML);
        }
        
        
        myArray.push("\n"+outerHtml);
        
      }
      
      textMap.set(words[1], myArray);

    }
    
}

const object = Object.fromEntries(textMap);
const myJson = JSON.stringify(object);
const fs = require('fs').promises;

fs.writeFile('wave_data.json', myJson, (err) => {
  if (err) {
      console.error(err);
  } else {
      console.log('JSON data saved to data.json');
  }
});
console.log('Wave End');

});