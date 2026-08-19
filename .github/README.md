# GitHub Diff Comment Button Toggle

A Manifest V3 extension for Microsoft Edge and Google Chrome. It allows you to show or hide the blue comment `+` button that appears on the left side of code lines on GitHub file diff pages.

## Features

- Show or hide the line comment `+` button with a single toggle in the extension popup.
- Changes take effect immediately on the current page.
- Supports both old and new GitHub PR `Files changed` routes, compare pages, and commit diff pages.
- The toggle state is stored in the browser extension storage.
- Does not read code content, send network requests, or collect data.

## Chrome Installation

1. Extract the ZIP file.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `github-diff-comment-toggle` folder containing `manifest.json`.

## Edge Installation

1. Extract the ZIP file.
2. Open `edge://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `github-diff-comment-toggle` folder containing `manifest.json`.

## Usage

1. Open a GitHub file diff page.
2. Click the extension icon in the browser toolbar.
3. Toggle **Show blue comment + button**.

GitHub pages that were already open when the extension was first installed need to be refreshed once.

## Permissions

- `storage`: Stores a Boolean toggle value.
- `https://github.com/*`: Injects the CSS and state script used to hide the button on GitHub pages.

## Development Information

- Version: `1.0.0`
- Manifest version: Manifest V3
- Primary selector: `td.diff-text-cell button[aria-label="Add comment"]`
- Legacy selectors: `.js-add-line-comment`, `.add-line-comment`
