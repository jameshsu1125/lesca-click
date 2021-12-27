import React from 'react';
import { render } from 'react-dom';
import TouchEvent from './../lib/index';

import './styles.css';

TouchEvent.init();
Click.add('.myDiv', (e) => {
	console.log(e);
});

setTimeout(() => {
	Click.preventDefault = false;
}, 1000);

function Demo() {
	return (
		<>
			<button className='myDiv'>button</button>
		</>
	);
}

render(<Demo />, document.getElementById('app'));
