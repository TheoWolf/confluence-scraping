const _ = require('lodash');
const config = require('config');
const puppeteer = require('puppeteer');

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
  await page.screenshot({path: 'example.png'});
  const us = await page.evaluate((selector) => {
    const anochorsList = document.querySelectorAll(selector);
    const anchors = [...anochorsList];
    return anchors.map(link => link.href);
  }, 'ul#child_ul4194715-0 li .plugin_pagetree_children_span > a');
  console.log(us);
  
  await browser.close();
})();