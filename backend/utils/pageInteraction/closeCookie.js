import { humanlyClickLocator } from "../humanization/humanlyClickLocator.js";

export async function closeCookiePopup(page) {
  try {
    const cookiePopupLocator = await page.getByText(
      "Refuse non-essential cookies",
      {
        timeout: 5000,
        state: "visible",
      }
    );

    await humanlyClickLocator(page, cookiePopupLocator);
    console.log("✅ Cookie popup closed.");
  } catch (err) {
    console.log(
      "⚠️ No cookie popup appeared (or selector wrong). \n",
      err.message
    );
  }
}
