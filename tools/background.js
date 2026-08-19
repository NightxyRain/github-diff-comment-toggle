"use strict";

const STORAGE_KEY = "showDiffCommentButton";

async function getSetting() {
  const values = await chrome.storage.sync.get({
    [STORAGE_KEY]: true,
  });
  return values[STORAGE_KEY] !== false;
}

async function ensureDefaultSetting() {
  const values = await chrome.storage.sync.get(STORAGE_KEY);
  if (typeof values[STORAGE_KEY] !== "boolean") {
    await chrome.storage.sync.set({ [STORAGE_KEY]: true });
  }
}

async function updateAction() {
  const showButton = await getSetting();
  await Promise.all([
    chrome.action.setBadgeText({ text: showButton ? "" : "OFF" }),
    chrome.action.setBadgeBackgroundColor({ color: "#57606a" }),
    chrome.action.setTitle({
      title: showButton
        ? "GitHub 评论 + 按钮：显示"
        : "GitHub 评论 + 按钮：隐藏",
    }),
  ]);
}

chrome.runtime.onInstalled.addListener(() => {
  void (async () => {
    await ensureDefaultSetting();
    await updateAction();
  })();
});

chrome.runtime.onStartup.addListener(() => {
  void updateAction();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes[STORAGE_KEY]) {
    void updateAction();
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== "GHDCT_REFRESH_ACTION") return;

  void updateAction()
    .then(() => sendResponse({ ok: true }))
    .catch((error) => sendResponse({ ok: false, error: String(error) }));
  return true;
});
