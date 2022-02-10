import { render } from 'react-dom';
import Click from '../lib';
import { Code, Navation } from './components';
import Demo from './demo';
import Qrcode from 'lesca-react-qrcode';
import './styles.less';

const homepage = 'https://github.com/jameshsu1125/lesca-click';
const name = 'lesca-click';
const description = 'simple exsample';
const code = `import Click from 'lesca-click';

Click.install();
`;

Click.install();

const Page = () => {
	return (
		<>
			<Navation />
			<div className='content'>
				<div>
					<h1>{name}</h1>
					<figcaption>{description}</figcaption>
				</div>
				<div>
					<h2>install</h2>
					<Code code={`npm install ${name} --save`} theme='markup' />
				</div>
				<div>
					<h2>test on mobile</h2>
					<Qrcode content={window.location.href} size='300' />
				</div>
				<div>
					<h2>install on entry file. (ex: index.js)</h2>
					<Code code={code} />
				</div>
				<div>
					<h2>set onClick use id or class name.</h2>
				</div>
				<Demo />

				<div>
					<h2>Usage</h2>
					<a href={homepage}>Documentation</a>
				</div>
			</div>
		</>
	);
};

render(<Page />, document.getElementById('app'));
