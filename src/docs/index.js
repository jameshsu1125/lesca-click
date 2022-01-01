import React from 'react';
import { render } from 'react-dom';
import Click from '../lib/index';

import './styles.css';

console.log(Click);
Click.install();
Click.addPreventExcept(['#mmmmm', '.g']);
Click.add('.btn', (e) => {
	console.log(e);
});

function Demo() {
	return (
		<>
			<div id='mmmmm'>
				<button className='myDiv'>button</button>
			</div>

			<div className='g'>
				<div className='btn'>button</div>
			</div>
		</>
	);
}

render(<Demo />, document.getElementById('app'));
