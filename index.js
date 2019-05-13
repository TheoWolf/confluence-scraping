const _ = require('lodash');
const config = require('config');
const puppeteer = require('puppeteer');
// TODO Use nedb for persisting state

const username = config.get('credentials.username');
const password = config.get('credentials.password');

(async () => {
  const cookie = null;

  const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'});
  const page = await browser.newPage();
  if( cookie ){
    await page.setCookie(cookie);
  }
  await page.goto('http://ec2-54-198-187-34.compute-1.amazonaws.com:8090/confluence/display/DAA/Databrary+Access+Agreements');
  await page.waitFor('.aui-nav');
  try {
    const classes = await page.$eval('.aui-avatar-inner', el => el.className)
  } catch(err) {
    await page.waitFor('#loginButton');
    await page.click('input#os_username');
    await page.keyboard.type(username);
    await page.click('input#os_password');
    await page.keyboard.type(password);
    await page.click('input#loginButton')
    const [ returnedCookie ] = await page.cookies();
    console.log(returnedCookie);
  }
  try {
    await page.waitForSelector('ul#child_ul4194715-0');
    console.log('done waiting');
  } catch (e) {
    console.log('Timed out');
    await page.screenshot({path: 'example2.png'});
  }
  console.log('Here');
  const urls = await page.evaluate(() => {
    // Anything in here is happening in the browser and seems difficult to debug
    const anochorsList = document.querySelectorAll('ul#child_ul4194715-0 li div span a');
    const anchors = [...anochorsList];
    return anchors.map(link => link.href);;
  });
  console.log(urls);
  // Use _.forEach, async.everyLimit or async.everySeries, or https://github.com/sindresorhus/p-all

  await browser.close();
})();