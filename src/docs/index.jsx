import React from 'react';
import { render } from 'react-dom';
import TouchEvent from './../lib/index';

import './styles.css';

TouchEvent.init();
Click.add('.myDiv', (e) => {
	console.log(e);
});

function Demo() {
	return (
		<>
			<button className='myDiv'>button</button>
		</>
	);
}

render(<Demo />, document.getElementById('app'));
