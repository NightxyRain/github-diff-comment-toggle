"use strict";

const STORAGE_KEY = "showDiffCommentButton";
const toggle = document.getElementById("visibilityToggle");
const statusCard = document.getElementById("statusCard");
const statusText = document.getElementById("statusText");
const pageStatus = document.getElementById("pageStatus");

let showDiffCommentButton = true;

function renderSetting() {
  toggle.checked = showDiffCommentButton;
  statusCard.classList.remove("error");
  statusCard.classList.toggle("hidden", !showDiffCommentButton);
  statusText.textContent = showDiffCommentButton
    ? "评论 + 按钮已显示"
    : "评论 + 按钮已隐藏";
}

function isLikelyDiffUrl(rawUrl) {
  if (!rawUrl) return false;
  try {
    const url = new URL(rawUrl);
    if (url.hostname !== "github.com") return false;
    return [
      /^\/[^/]+\/[^/]+\/pull\/\d+\/(?:files|changes)(?:\/|$)/,
      /^\/[^/]+\/[^/]+\/pull\/\d+\/commits\/[^/]+(?:\/|$)/,
      /^\/[^/]+\/[^/]+\/compare(?:\/|$)/,
      /^\/[^/]+\/[^/]+\/commit\/[^/]+(?:\/|$)/,
    ].some((pattern) => pattern.test(url.pathname));
  } catch {
    return false;
  }
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

async function detectCurrentPage() {
  const tab = await getActiveTab();
  if (!tab || typeof tab.id !== "number") {
    pageStatus.textContent = "无法读取当前标签页";
    return;
  }

  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "GHDCT_GET_PAGE_STATE",
    });
    pageStatus.textContent = response && response.isDiffPage
      ? "当前是 GitHub 文件差异页，设置已即时生效"
      : "当前标签页不是受支持的 GitHub 差异页";
  } catch {
    pageStatus.textContent = isLikelyDiffUrl(tab.url)
      ? "请刷新当前 GitHub 页面以启用插件"
      : "当前标签页不是受支持的 GitHub 差异页";
  }
}

async function applyToActiveTab() {
  const tab = await getActiveTab();
  if (!tab || typeof tab.id !== "number") return;
  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: "GHDCT_APPLY_SETTING",
      showDiffCommentButton,
    });
  } catch {
    // The content script may not be present on a non-GitHub tab or a tab that
    // was already open before the extension was installed.
  }
}

async function initialize() {
  try {
    const values = await chrome.storage.sync.get({
      [STORAGE_KEY]: true,
    });
    showDiffCommentButton = values[STORAGE_KEY] !== false;
    renderSetting();
  } catch {
    statusCard.classList.add("error");
    statusText.textContent = "读取设置失败";
  }

  await detectCurrentPage();
}

toggle.addEventListener("change", async () => {
  const previousValue = showDiffCommentButton;
  const nextValue = toggle.checked;
  toggle.disabled = true;

  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: nextValue });
    showDiffCommentButton = nextValue;
    renderSetting();
    await applyToActiveTab();
    await chrome.runtime.sendMessage({ type: "GHDCT_REFRESH_ACTION" });
    await detectCurrentPage();
  } catch {
    showDiffCommentButton = previousValue;
    toggle.checked = previousValue;
    statusCard.classList.add("error");
    statusText.textContent = "保存设置失败，请重试";
  } finally {
    toggle.disabled = false;
  }
});

void initialize();
