let wheelOpen = false;
let tabs = [];

document.addEventListener("keydown", async (e) => {
  if (e.key === "Alt" && !wheelOpen) {
    tabs = await browser.runtime.sendMessage({
      type: "GET_RADIAL_TABS",
    });

    if (tabs.length === 0) return;

    wheelOpen = true;
    showWheel(tabs);
  }
});

document.addEventListener("keyup", async (e) => {
  if (e.key === "Alt" && wheelOpen) {
    const result = getSelectedTab();

    if (result === "CLEAR") {
      browser.storage.local.set({ radialTabs: [] });
    } else if (result) {
      browser.runtime.sendMessage({
        type: "OPEN_TAB",
        url: result.url,
      });
    }

    hideWheel();
    wheelOpen = false;
  }
});

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  updateHighlight();
});
