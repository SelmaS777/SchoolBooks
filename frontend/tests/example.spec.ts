import { test, expect } from '@playwright/test';

async function login(page, email, password) {
  await page.waitForURL('http://localhost:5173/login');
  await page.fill('input#email', email);
  await page.fill('input#password', password);

  await page.click('button:has-text("Sign In")');

  await page.waitForURL('http://localhost:5173');
  await page.locator('h1[data-testid="welcome-message"]').waitFor({ state: 'visible' });
}
  
test('Registration & Login', async ({ page }) => {
  await page.goto('http://localhost:5173/hero');

  await page.locator('a[href="/register"]').click();

  await expect(page.locator('form')).toBeVisible();

  await page.fill('input#fullName', 'Test User');

  // Use current unix time to ensure unique email
  const uniqueEmail = `testuser${Date.now()}@example.com`;
  await page.fill('input#email', uniqueEmail);
  const password = 'TestPassword123!';
  await page.fill('input#password', password);
  await page.fill('input#phoneNumber', '1234567890');
  await page.click('button[type="submit"]');

  // Log in with the newly created user
  await login(page, uniqueEmail, password);
  await expect(page.locator('h1[data-testid="welcome-message"]')).toHaveText('Welcome back, Test!');
});

test('Add product', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.locator('a[href="/login"]').click();

  // Log in
  const email = 'selma.salman4@gmail.com';
  const password = 'Fakultet123!';
  await login(page, email, password);

  await page.locator('h6:has-text("Add Your Product")').waitFor({ 
    state: 'visible', 
    timeout: 180000 // 3 minutes
  });

  await expect(page.locator('h6:has-text("Add Your Product")')).toBeVisible();
  await page.locator('h6:has-text("Add Your Product")').click();

  await page.waitForURL('http://localhost:5173/product/add');

  await page.fill('input[placeholder="Title"]', 'Test Book');
  await page.fill('input[placeholder="Author"]', 'Test Author');
  await page.fill('input[placeholder="Year of Publication"]', '2025');
  await page.fill('input[placeholder="Price"]', '42');

  await page.click('p:has-text("Category")');
  await page.waitForSelector('[role="option"][data-value="3"]');
  await page.click('[role="option"][data-value="3"]');

  await page.click('p:has-text("State of the Book")');
  await page.waitForSelector('[role="option"][data-value="3"]');
  await page.click('[role="option"][data-value="3"]');

  await page.fill('textarea[placeholder="Description"]', 'Test Description.'); 

  await page.waitForSelector('p:has-text("Click to upload image")');
  await page.click('p:has-text("Click to upload image")');
  await page.setInputFiles('input[type="file"]', 'tests/assets/test-image.jpg');
  await page.click('button:has-text("Continue")');

  await page.click('button:has-text("Publish")');

  await page.waitForSelector('div:has-text("Product added successfully!")', { timeout: 60000 });
});

test('Remove added test products', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.locator('a[href="/login"]').click();

  // Log in
  const email = 'selma.salman4@gmail.com';
  const password = 'Fakultet123!';
  await login(page, email, password);

  await page.locator('a[href="/profile"]').click();

  await page.waitForSelector('.MuiGrid-container', { state: 'visible' });

  // Navigate to Edit Profile
  await page.click('button:has-text("Edit Profile")');
  
  await page.waitForTimeout(2000);

  const dialogContainer = page.locator('.MuiDialog-container');
  if (await dialogContainer.isVisible()) {
    const closeButton = page.locator('button[aria-label="close"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(1000);
  }

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(2000);

  // Function to delete one Test Book card in edit mode
  async function deleteOneTestBookInEditMode() {
    const blockingDialog = page.locator('.MuiDialog-root');
    if (await blockingDialog.isVisible()) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    const testBookCards = page.locator('.MuiCard-root').filter({ 
      has: page.locator('.MuiTypography-h6:has-text("Test Book")') 
    });

    const cardCount = await testBookCards.count();
    if (cardCount === 0) return false;

    const firstCard = testBookCards.first();
    
    const deleteButton = firstCard.locator('button:has([data-testid="DeleteIcon"])');
    
    try {
      await deleteButton.click({ timeout: 5000 });
    } catch (error) {
      console.log('Normal click failed, trying force click...');
      await deleteButton.click({ force: true });
    }
    
    await page.waitForSelector('button.MuiButton-textError:has-text("Delete")', { 
      state: 'visible',
      timeout: 5000 
    });
    
    await page.click('button.MuiButton-textError:has-text("Delete")');
    
    await page.waitForTimeout(2000);
    
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);

    return true;
  }

  // Delete all Test Book cards one by one
  let deletedCount = 0;
  while (await deleteOneTestBookInEditMode()) {
    deletedCount++;
    console.log(`Deleted Test Book #${deletedCount} in edit mode`);
    
    if (deletedCount > 10) break;
  }

  await page.click('button:has-text("Save")');

  await page.waitForTimeout(3000);

  await page.goto('http://localhost:5173/');

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(2000);

  const finalTestBookCards = page.locator('.MuiTypography-h6:has-text("Test Book")');
  await expect(finalTestBookCards).toHaveCount(0);

  console.log(`✅ Successfully deleted ${deletedCount} Test Book cards through Edit Profile. None remain.`);
});