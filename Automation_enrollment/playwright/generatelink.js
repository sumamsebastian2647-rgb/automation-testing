const { config } = require('./config');
async function expandFormsMenu(page) {
    await page.evaluate(() => {
      const allMenus = Array.from(document.querySelectorAll('a'));
      const formsMenu = allMenus.find(el => el.textContent.trim().includes('Forms'));
      if (formsMenu) {
        const li = formsMenu.closest('li');
        if (li) {
          li.classList.add('menu-open');
          const submenu = li.querySelector('.treeview-menu');
          if (submenu) submenu.style.display = 'block';
        }
      }
    });
    await page.waitForTimeout(config.timeouts.short);
  }
  
  async function generateEnrollmentLink(page, courseRegex) {
    await page.click('a:has-text("Enrolment Forms")');
    await page.waitForSelector('table');
    await page.waitForTimeout(config.timeouts.medium);
    await page.locator('button[title="Generate Link"]').first().click();
    await page.waitForTimeout(config.timeouts.short);
    // Select course
    await page.locator('#select2-dropdownCourse-container').click();
    await page.locator('li[role="option"][aria-selected="false"]:has-text("Veterinary Nursing")').click();
    await page.waitForTimeout(config.timeouts.short);
    await page.getByRole('textbox', { name: 'Please Select Class (Optional)' }).click();
    await page.getByRole('option', { name: '[Kerstin Tony] SMtest1' }).click();
    await page.locator('label').filter({ hasText: 'Manual Accept' }).getByRole('insertion').click();
    // Generate link
    await page.locator('#btnGenerateLink').click();
    await page.locator('#copylink').click();
    await page.waitForTimeout(config.timeouts.short);
    const copiedLink = await page.locator('#generatedlink').inputValue();
    // Close the modal
    const closeBtn = page.locator('#generate-link >> button.close');
    await page.locator('#generate-link').waitFor({ state: 'visible' });
    await page.waitForTimeout(config.timeouts.short);
    await closeBtn.click();
    await page.waitForTimeout(config.timeouts.medium);
    return copiedLink;
  }

  module.exports = { expandFormsMenu, generateEnrollmentLink };
