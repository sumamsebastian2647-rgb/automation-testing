// fetchOtpFromMailinator.js
const { chromium } = require('@playwright/test');

async function fetchOtpFromMailinator(inboxName) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`Checking inbox for: ${inboxName}`);
    await page.goto(`https://www.mailinator.com/v4/public/inboxes.jsp?to=${inboxName}`);
    
    // Wait for the email list to load
    await page.waitForSelector('table.table-striped', { 
      timeout: 60000,
      state: 'visible'
    });

    // Click the first email with "Your OTP Code"
    await page.click('tr:has-text("Your OTP Code")');

    // Wait for message content
    await page.waitForSelector('#html_msg_body', { state: 'attached', timeout: 60000 });

    // Get email content from iframe
    const frame = page.frameLocator('#html_msg_body');
    await frame.locator('body').waitFor({ state: 'visible', timeout: 60000 });
    const emailText = await frame.locator('body').textContent();

    // Extract OTP using the exact format shown
    const otpMatch = emailText.match(/Your One-Time Password $OTP$ is: (\d{6})/);
    if (otpMatch) {
      const otp = otpMatch[1];
      console.log(`Found OTP: ${otp}`);
      return otp;
    }

    // Fallback to looking for any 6-digit number if exact format isn't found
    const fallbackMatch = emailText.match(/\b\d{6}\b/);
    if (fallbackMatch) {
      const otp = fallbackMatch[0];
      console.log(`Found OTP (fallback): ${otp}`);
      return otp;
    }

    throw new Error('OTP not found in email body.');

  } catch (err) {
    console.error('❌ Error fetching OTP:', err.message);
    return null;
  } finally {
    await browser.close();
  }
}

// Enhanced retry mechanism
async function fetchOtpWithRetry(inboxName, maxRetries = 5, delayMs = 15000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`\nAttempt ${attempt} of ${maxRetries} to fetch OTP`);
    const otp = await fetchOtpFromMailinator(inboxName);
    
    if (otp) {
      console.log(`✅ Successfully retrieved OTP: ${otp}`);
      return otp;
    }
    
    if (attempt < maxRetries) {
      console.log(`Waiting ${delayMs/1000} seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw new Error(`Failed to fetch OTP after ${maxRetries} attempts`);
}

module.exports = { 
  fetchOtpFromMailinator,
  fetchOtpWithRetry
};
