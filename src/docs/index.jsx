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
			<div className='myDiv'>button</div>
		</>
	);
}

render(<Demo />, document.getElementById('app'));
