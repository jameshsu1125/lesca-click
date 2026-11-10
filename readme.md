[![React](https://img.shields.io/badge/-ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://zh-hant.reactjs.org/)
[![Less](https://img.shields.io/badge/Less-1d365d?style=for-the-badge&logo=less&logoColor=white)](https://lesscss.org/)
[![TypeScript](https://img.shields.io/badge/Typescript-4277c0?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://www.w3schools.com/html/)
[![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3schools.com/css/)
[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![DEV](https://img.shields.io/badge/DEV-Jameshsu1125-9cf?style=for-the-badge)](https://www.npmjs.com/~jameshsu1125)

# lesca-click

A lightweight click manager that suppresses the browser's default touch and mouse behavior (scrolling, pull-to-refresh, text selection, etc.) inside a designated root element. It is intended for web apps that do not scroll, such as full-screen games, campaign pages and kiosks.

[Live Demo](https://jameshsu1125.github.io/lesca-click/)

## Features

- Prevents default browser behavior within a configurable root element.
- Registers click handlers by class name or id through a single delegated listener.
- Distinguishes a click from a drag: a callback fires only if the pointer moved less than 30 px between press and release.
- Switches between touch events (mobile) and mouse events (desktop) automatically, including on window resize.
- Leaves interactive elements (`input`, `button`, `select`, `textarea`, `a`) usable. Click callbacks on `button` elements still fire, but dragging on a button does not trigger movement gestures or browser movement defaults.
- Supports exempting specific subtrees from `preventDefault`.
- Ships with TypeScript type definitions.

## Installation

```sh
npm install lesca-click --save
```

## Quick Start

```ts
import Click from 'lesca-click';

// Prevent default behavior inside the element matching this selector (default: '#app').
Click.install('#app');

// Register a click handler.
Click.add('.target', (e) => {
  console.log('target clicked', e);
});
```

```html
<div id="app">
  <div class="target">good</div>
  <!-- A single class name is required; compound class names will not match. -->
  <div class="target on">will not match</div>
</div>
```

> **Note:** Targets are matched against the element's exact `id` or its full `className` string. Use a single class name per target element.

## API

| Method                     | Parameters                                                  | Description                                                                                          |
| :------------------------- | :---------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| `install(app?)`            | `app: string` — root selector, `".root"` or `"#root"`. Default `"#app"` | Registers the event listeners. Default behavior is prevented only for events inside this root. |
| `add(target, execution)`   | `target: string` — `".class"` or `"#id"`<br>`execution: (event: TouchEvent \| MouseEvent) => void` | Registers a callback invoked when `target` is clicked. |
| `remove(target)`           | `target: string` — `".class"` or `"#id"`                    | Removes the callback registered for `target`.                                                        |
| `clear()`                  | —                                                           | Removes all registered callbacks.                                                                    |
| `removePreventExcept(target)` | `target: string \| string[]` — `".class"` or `"#id"`     | Reverses `addPreventExcept`: removes the given selector(s) from the exemption list.                  |
| `setPreventDefault(value)` | `value: boolean`                                            | Enables or disables `preventDefault` (enabled by default).                                           |
| `setEnabled(value)`        | `value: boolean`                                            | Enables or disables the default-prevention handling entirely (enabled by default).                   |
| `addPreventExcept(target)` | `target: string \| string[]` — `".class"` or `"#id"`        | Exempts matching elements and their descendants from `preventDefault`, e.g. a scrollable container.  |

## Development

```sh
npm install      # install dependencies
npm run dev      # start the dev server
npm run build    # type-check and build to ./lib
npm run lint     # run ESLint
```
