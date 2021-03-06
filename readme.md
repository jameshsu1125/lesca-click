[![dev by JamesHsu](https://img.shields.io/badge/Dev%20by-Jameshsu1125-green)](https://github.com/jameshsu1125/) [![made in Taiwan](https://img.shields.io/badge/Made%20in-Taiwan-orange)](https://github.com/jameshsu1125/)

# Installation

```sh
$ npm install lesca-click --save
```

# Usage

```javascript
import Click from 'lesca-click';

Click.init(true, true);

Click.add('.target', (e) => {
	console.log('target clicked');
});
```

# Methods

| method                        |    options     |            description             | default |
| :---------------------------- | :------------: | :--------------------------------: | ------: |
| init(clickEventAlso, install) | clickEventAlso |      click event combine also      |    true |
|                               |    install     |        set on window.Click         |    true |
| add(target, execution)        |     target     | selector => ".target" or "#target" |         |
|                               |   execution    |      call when target clicked      |         |
| remove(target)                |     target     | selector => ".target" or "#target" |         |
| clear()                       |                |        clear all functions         |         |
| destory()                     |                |          remove all event          |         |

# Properties

| Properties     |  type  |         description         | default |
| :------------- | :----: | :-------------------------: | ------: |
| preventDefault |  bool  | prevent Default by yourself |    true |
| deviation      | number |    click hand deviation     |      30 |
