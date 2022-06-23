import { Button, ButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import Click from '../../lib';

Click.install();

const Demo = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    Click.add('#increase', () => {
      setCount((c) => c + 1);
    });
    Click.add('#remove', () => {
      Click.remove('#increase');
    });
  }, []);

  return (
    <div className='Demo'>
      <h2>Demo</h2>
      <pre>
        <code>{count}</code>
      </pre>
      <ButtonGroup variant='contained'>
        <Button id='increase'>increase count</Button>
        <Button id='remove'>remove Click event</Button>
      </ButtonGroup>
    </div>
  );
};
export default Demo;
