[![React](https://img.shields.io/badge/-ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://zh-hant.reactjs.org/)
[![React](https://img.shields.io/badge/Less-1d365d?style=for-the-badge&logo=less&logoColor=white)](https://lesscss.org/)
[![React](https://img.shields.io/badge/Typescript-4277c0?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://www.w3schools.com/html/)
[![React](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3schools.com/css/)
[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![React](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![NPM](https://img.shields.io/badge/DEV-Jameshsu1125-9cf?style=for-the-badge)](https://www.npmjs.com/~jameshsu1125)

# Why use it?

use for prevent browser default behavior.
usually used in web without scroll app.

# Installation

```sh
$ npm install lesca-click --save
```

# Demo

[Live Demo](https://jameshsu1125.github.io/lesca-click/)

# Usage

```JSX
import Click from 'lesca-click';

Click.install();

Click.add('.target', (e) => {
  console.log('target clicked');
});

// find single className only
<div class='target'> // good
<div class='target on'> // bed

```

# Methods

| method                   |  options  |   type   |             description              | default |
| :----------------------- | :-------: | :------: | :----------------------------------: | ------: |
| .install()               |           |          |               install                |    true |
| add(target, execution)   |  target   |  string  |  selector => ".target" or "#target"  |         |
|                          | execution | function |       call when target clicked       |         |
| remove(target)           |  target   |  string  |  selector => ".target" or "#target"  |         |
| clear()                  |           |          |         clear all functions          |         |
| setPreventDefault(value) |   value   | boolean  | set preventDefault enable or disable |         |
| addPreventExcept(target) |  target   |  string  |        ".target" or "#target"        |         |

### Features

- maintain if necessary
