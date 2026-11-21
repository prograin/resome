import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";

export async function checkInstallInvitation(fixture) {
  const context = await fixture.browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    await context.addInitScript(() => {
      localStorage.setItem("portfolio_locale", "en");
      window.__tabHidden = true;
      Object.defineProperty(document, "hidden", { get: () => window.__tabHidden });
      window.addEventListener(
        "beforeinstallprompt",
        (event) => {
          if (event.isTrusted) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        },
        true,
      );
    });
    const page = await context.newPage();
    await page.goto(fixture.login);
    await page.getByRole("button", { name: "Install academy", exact: true }).waitFor();
    await page.waitForTimeout(1700);
    const invitation = page.getByRole("dialog", { name: "Keep your academy close" });
    assert.equal(await invitation.count(), 0, "Do not open invitations in background tabs");
    await page.evaluate(() => {
      window.__tabHidden = false;
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await invitation.waitFor();
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    assert.deepEqual(
      audit.violations.map((issue) => issue.id),
      [],
    );
    await page.evaluate(() => {
      window.__invitationInstall = 0;
      const event = new Event("beforeinstallprompt", { cancelable: true });
      event.prompt = async () => {
        window.__invitationInstall++;
      };
      event.userChoice = Promise.resolve({ outcome: "accepted", platform: "web" });
      window.dispatchEvent(event);
    });
    await invitation.getByRole("button", { name: "Install academy", exact: true }).click();
    await invitation.waitFor({ state: "hidden" });
    assert.equal(
      await page.evaluate(() => window.__invitationInstall),
      1,
      "Use a native prompt that arrived after the invitation opened",
    );
    await page.evaluate(() => {
      window.dispatchEvent(new Event("appinstalled"));
      sessionStorage.clear();
    });
    await page.reload();
    await page.evaluate(() => {
      window.__tabHidden = false;
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForTimeout(1700);
    assert.equal(await invitation.count(), 0, "An installed app must not be advertised again");
    console.log(
      "PASS install invitation: English accessibility, background-tab recovery, latest native prompt, successful installation persistence and no repeated invitation.",
    );
  } finally {
    await context.close();
  }
}
