const puppeteer = require('puppeteer');

const browserOptions = {
  headless: false,
  ignoreHTTPSErrors: true,
  defaultViewport: null,
  args: [
    // `--proxy-server=socks5://207.97.174.134:1080`,
  ]
};

const userEmail = 'mancivoda+preprod0006@gmail.com';
const userPassword = 'test123';

const MAX_WINDOWS_AMOUNT = 5;
const AACU_URL = 'https://auth.tmus.preprod.ticketmaster.net/archtics-consolidate/as/authorization.oauth2?lang=en-us&client_id=96f45441ad8a.web.iompreprod-iomedia_preprod.us&integratorId=nam&placementId=homepage&visualPresets=lafc&response_type=code&scope=openid%20profile%20phone%20offline_access%20email%20tm&redirect_uri=https://auth.tmus.preprod.ticketmaster.net/archtics-consolidate/demo-exchange/&state=asdf3ddkasdlfioiuysodjlfhaiuer';

async function signIn() {
  const browser = await puppeteer.launch(browserOptions);
  const pages = await browser.pages();
  const page = pages[0];

  await page.goto(AACU_URL);
   
  const email = await page.waitForSelector('input[data-bdd="email-address-field"]');
  await email.type(userEmail, {delay: 50});

  const password = await page.waitForSelector('input[data-bdd="password-field"]');
  await password.type(userPassword, {delay: 50});

  const submitButton = await page.waitForSelector('button[data-bdd=next-button]');
  await submitButton.click();

  await Promise.race([
    page.waitForXPath('//h3[contains(text(), "Enter Your Phone Number")]'),
    page.waitForXPath('//h1[contains(text(), "You are successfully authorized!")]')
  ])
  console.log('SIGN IN: DONE');
  await page.waitFor(2000);
  browser.close();
}

async function infiniteLogin() {
  while (true) {
    try {
      await signIn();
    } catch(e) {
      console.log('error', e)
    }
  }
}

function main() {
  for(let i = 0; i < MAX_WINDOWS_AMOUNT; i++) {
    infiniteLogin();
  }
}

main();
