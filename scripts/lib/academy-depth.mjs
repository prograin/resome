import assert from "node:assert/strict";

export async function checkAcademyDepth(page) {
  const selector =
    ":is(.academy-neo, .academy-inset, .student-progress__card, .ui-button, input, select, textarea):not([type=range], [type=hidden])";
  const failures = await page.locator(selector).evaluateAll(
    (nodes, selector) =>
      nodes.flatMap((node) => {
        const shadow = getComputedStyle(node).boxShadow;
        if (!node.getClientRects().length || shadow === "none") return [];
        let depth = 1;
        for (let parent = node.parentElement; parent; parent = parent.parentElement) {
          if (parent.matches(selector)) depth++;
        }
        const inset = depth % 2 === 1;
        return shadow.includes("inset") === inset
          ? []
          : [
              {
                element: node.className || node.tagName,
                depth,
                shadow,
              },
            ];
      }),
    selector,
  );
  assert.deepEqual(failures, [], `Alternating academy surfaces: ${page.url()}`);
}
