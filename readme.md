[![dev by JamesHsu](https://img.shields.io/badge/Dev%20by-Jameshsu1125-green)](https://github.com/jameshsu1125/) [![made in Taiwan](https://img.shields.io/badge/Made%20in-Taiwan-orange)](https://github.com/jameshsu1125/) [![npm](https://img.shields.io/badge/npm-Jameshsu1125-red)](https://www.npmjs.com/~jameshsu1125)

# Installation

```sh
$ npm install lesca-click --save
```

# Usage

```javascript
import Click from 'lesca-click';

Click.install();

Click.add('.target', (e) => {
	console.log('target clicked');
});
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
