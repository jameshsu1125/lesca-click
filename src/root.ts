import Click from '.';

Click.install('#app');

const createApp = () => {
  return new Promise<HTMLElement>((resolve) => {
    const app = document.createElement('div');
    app.id = 'button';
    app.innerHTML = 'Hello, World!';

    Click.add('#button', () => {
      console.log('Button clicked!');
    });

    resolve(app);
  });
};

export default createApp;

const appElement = document.getElementById('app');
if (appElement && appElement.children.length === 0) {
  createApp().then((app) => {
    appElement.appendChild(app);
  });
}
