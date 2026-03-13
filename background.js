const browser = globalThis.browser || chrome;

browser.contextMenus.create({
  id: "add-radial-tab",
  title: "Add to Radial Tabs",
  contexts: ["tab"],
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  const data = await browser.storage.local.get("radialTabs");
  let radialTabs = data.radialTabs || [];

  if (info.menuItemId === "add-radial-tab") {
    radialTabs.push({
      title: tab.title,
      url: tab.url,
      favicon: tab.favIconUrl,
    });
  }

  if (info.menuItemId === "remove-radial-tab") {
    radialTabs = radialTabs.filter((t) => t.url !== tab.url);
  }

  await browser.storage.local.set({ radialTabs });
});

browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "GET_RADIAL_TABS") {
    const data = await browser.storage.local.get("radialTabs");
    return data.radialTabs || [];
  }

  if (msg.type === "OPEN_TAB") {
    const tabs = await browser.tabs.query({});

    const existing = tabs.find((t) => t.url === msg.url);

    if (existing) {
      browser.tabs.update(existing.id, { active: true });
    } else {
      browser.tabs.create({ url: msg.url });
    }
  }
});
