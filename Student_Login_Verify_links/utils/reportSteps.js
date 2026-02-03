const { logStep } = require('./reportCollector');

async function logPage(page, pageName) {
  logStep({
    pageName,
    url: page.url(),
    action: 'PAGE VISITED'
  });
}

async function logToast(page, pageName, action) {
  try {
    const toast = page.locator('.toast-message'); // adjust selector
    await toast.waitFor({ timeout: 5000 });

    const text = (await toast.textContent()).trim();
    const status = /success|saved|created/i.test(text)
      ? 'SUCCESS'
      : 'FAIL';

    logStep({
      pageName,
      url: page.url(),
      action,
      toast: text,
      status,
      note: 'Toast captured'
    });
  } catch {
    logStep({
      pageName,
      url: page.url(),
      action,
      toast: 'Toast not found',
      status: 'UNKNOWN',
      note: 'No toast'
    });
  }
}

module.exports = { logPage, logToast };
