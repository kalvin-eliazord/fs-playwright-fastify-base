/**
 * Simulates a human-like interaction with optional diversions and safe return.
 *
 * @param {import('playwright').Page} page
 * @param {import('playwright').ElementHandle} element
 * @param {{
 *   diversionChance?: number,
 *   steps?: number,
 *   delayRange?: [number, number],
 *   returnTo?: string,
 *   debug?: boolean
 * }} options
 */
export async function simulateHumanBehavior(
  page,
  element = null,
  options = {}
) {
  const {
    diversionChance = 0.4,
    steps = 10,
    delayRange = [800, 2500],
    returnTo = null,
    debug = false,
  } = options;

  function log(msg) {
    if (debug) console.log(msg);
  }

  // 👣 Simulate human randomness
  const maybeScroll = async () => {
    const direction = Math.random() > 0.5 ? "down" : "up";
    const delta = Math.floor(Math.random() * 1200 + 400);
    const xScroll = Math.random() > 0.85 ? Math.floor(Math.random() * 500) : 0;
    log(`🌀 Scrolling ${direction} ${delta}px`);
    await page.mouse.wheel(xScroll, direction === "down" ? delta : -delta);
    await page.waitForTimeout(Math.random() * 1500 + 800);
  };

  const maybeVisitUnrelatedPage = async () => {
    const urls = ["/home", "/explore", "/notifications"];
    const target = urls[Math.floor(Math.random() * urls.length)];
    log(`🚪 Visiting unrelated page: ${target}`);
    await page.goto(`https://x.com${target}`);
    await page.waitForTimeout(Math.random() * 2500 + 2000);
  };

  if (Math.random() < diversionChance) {
    if (Math.random() < 0.6) {
      await maybeScroll();
    } else {
      await maybeVisitUnrelatedPage();
    }
  }

  if (element) {
    const box = await element.boundingBox();
    if (!box) throw new Error("❌ Element not visible or detached");
  }

  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  log("🖱️ Moving mouse...");
  await page.mouse.move(centerX, centerY, { steps });

  const [min, max] = delayRange;
  const delay = Math.floor(Math.random() * (max - min) + min);
  log(`⏳ Waiting ${delay}ms before click...`);
  await page.waitForTimeout(delay);

  await element.click();
  log("✅ Element clicked.");

  if (returnTo) {
    log(`↩️ Returning to ${returnTo}...`);
    await page.goto(`https://x.com${returnTo}`);
    await page.waitForLoadState("networkidle");
  }
}
