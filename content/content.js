(() => {
  "use strict";

  if (globalThis.__GHDCT_LOADED__) return;
  globalThis.__GHDCT_LOADED__ = true;

  const STORAGE_KEY = "showDiffCommentButton";
  const HIDDEN_CLASS = "ghdct-hidden";
  const DIFF_PAGE_CLASS = "ghdct-diff-page";
  const URL_CHECK_INTERVAL_MS = 750;

  const DIFF_PATH_PATTERNS = [
    /^\/[^/]+\/[^/]+\/pull\/\d+\/(?:files|changes)(?:\/|$)/,
    /^\/[^/]+\/[^/]+\/pull\/\d+\/commits\/[^/]+(?:\/|$)/,
    /^\/[^/]+\/[^/]+\/compare(?:\/|$)/,
    /^\/[^/]+\/[^/]+\/commit\/[^/]+(?:\/|$)/,
  ];

  let showDiffCommentButton = true;
  let lastLocationKey = "";

  function isDiffPage() {
    return (
      location.hostname === "github.com" &&
      DIFF_PATH_PATTERNS.some((pattern) => pattern.test(location.pathname))
    );
  }

  function renderState() {
    const root = document.documentElement;
    if (!root) return false;

    const diffPage = isDiffPage();
    root.classList.toggle(DIFF_PAGE_CLASS, diffPage);
    root.classList.toggle(HIDDEN_CLASS, !showDiffCommentButton);
    root.dataset.ghdctState = showDiffCommentButton ? "visible" : "hidden";
    root.dataset.ghdctPage = diffPage ? "diff" : "other";
    return true;
  }

  async function loadStoredState() {
    try {
      const values = await chrome.storage.sync.get({
        [STORAGE_KEY]: true,
      });
      showDiffCommentButton = values[STORAGE_KEY] !== false;
    } catch (error) {
      console.warn("[GitHub Diff Comment Toggle] Failed to read settings.", error);
      showDiffCommentButton = true;
    }
    renderState();
  }

  function checkForNavigation() {
    const locationKey = `${location.pathname}${location.search}`;
    if (locationKey === lastLocationKey && document.documentElement) return;
    if (renderState()) lastLocationKey = locationKey;
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !changes[STORAGE_KEY]) return;
    showDiffCommentButton = changes[STORAGE_KEY].newValue !== false;
    renderState();
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || typeof message !== "object") return;

    if (message.type === "GHDCT_GET_PAGE_STATE") {
      sendResponse({
        isDiffPage: isDiffPage(),
        showDiffCommentButton,
      });
      return;
    }

    if (message.type === "GHDCT_APPLY_SETTING") {
      showDiffCommentButton = message.showDiffCommentButton !== false;
      renderState();
      sendResponse({ ok: true });
    }
  });

  document.addEventListener("DOMContentLoaded", renderState, { once: true });
  document.addEventListener("turbo:load", checkForNavigation, true);
  document.addEventListener("pjax:end", checkForNavigation, true);
  window.addEventListener("popstate", checkForNavigation, true);
  window.addEventListener("hashchange", checkForNavigation, true);
  window.setInterval(checkForNavigation, URL_CHECK_INTERVAL_MS);

  checkForNavigation();
  void loadStoredState();
})();
