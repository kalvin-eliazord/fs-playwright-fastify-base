import { humanlyClickLocator } from "../humanization/humanlyClickLocator.js";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delayMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function scrollFeed(page) {
  try {
    console.log(
      "✅ Fake scrolling started, waiting 30–50 sec before next loop..."
    );

    // Go to Home tab
    const homeBtn = await page.getByTestId("AppTabBar_Home_Link");
    await humanlyClickLocator(page, homeBtn);

    const start = Date.now();
    const duration = randomInt(30000, 50000);

    while (Date.now() - start < duration) {
      // Random scroll
      const scrollAmount = randomInt(200, 600);
      const delay = randomInt(800, 3000);

      await page.evaluate((scrollBy) => {
        window.scrollBy({ top: scrollBy, left: 0, behavior: "smooth" });
      }, scrollAmount);

      await delayMs(delay);

      // 10% chance: hover over a random tweet
      if (Math.random() < 0.1) {
        const tweetsLocator = page.getByTestId("tweet");
        const tweets = await tweetsLocator.elementHandles();
        if (tweets.length > 0) {
          const randomTweet = tweets[randomInt(0, tweets.length - 1)];
          const box = await randomTweet.boundingBox();
          if (box) {
            const x = box.x + box.width / 2 + randomInt(-30, 30);
            const y = box.y + box.height / 3 + randomInt(-20, 20);
            await page.mouse.move(x, y, { steps: 5 });
            await delayMs(randomInt(1000, 3000));
          }
        }
      }

      // 5% chance: wiggle mouse randomly
      if (Math.random() < 0.05) {
        const { innerWidth: width, innerHeight: height } = await page.evaluate(
          () => ({
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
          })
        );

        const x = randomInt(100, width - 100);
        const y = randomInt(100, height - 100);
        await page.mouse.move(x, y, { steps: 10 });
        await delayMs(randomInt(500, 1500));
      }
    }

    console.log("✅ Finished scrolling feed naturally");
  } catch (err) {
    console.warn("⚠️ Scrolling process error:", err.message);
  }
}
