import { GET_DEVICE, CHECK_PARENT_HAS_CLASS, FIND_ROOT } from './constants';

interface TriggerTouch extends TouchEvent {
  moveOffsetProperty: {
    x: number;
    y: number;
  };
}

interface TriggerMouse extends MouseEvent {
  moveOffsetProperty: {
    x: number;
    y: number;
  };
}

export let dataset: any = {};
const mousePropertyDown = { x: 0, y: 0 };
const mousePropertyMove = { x: mousePropertyDown.x, y: mousePropertyDown.y };
const moveOffsetProperty = { x: 0, y: 0 };
const extraEvent = {
  down: (e: TouchEvent | MouseEvent) => {},
  move: (e: TriggerTouch | TriggerMouse) => {},
  up: (e: TouchEvent | MouseEvent) => {},
};
const state = { device: '', isPress: false, deviation: 30, preventDefault: true };
const eventProperty = { passive: false, capture: false };
let exceptParentClassIDDataset: string[] = [];
let rootElement = '';

const checkDataset = (e: TouchEvent | MouseEvent) => {
  const { target } = e;
  if (target) {
    if (target instanceof Element) {
      [`${target.id}_id`, `${target.className}_class`].forEach((name) => {
        dataset[name]?.(e);
      });
    }
  }
};

const eventTransform = () => {
  const { device } = state;
  const d = GET_DEVICE();
  if (!device) {
    state.device = d;
    addListener(d);
  } else if (device !== d) {
    state.device = d;
    removeListener(d);
    addListener(d);
  }
};

const areWePreventDefault = (e: TouchEvent | MouseEvent) => {
  const { preventDefault } = state;
  const root = FIND_ROOT(e);
  let isRoot = false;

  if (root) {
    if (rootElement) {
      if (rootElement.indexOf('.') >= 0) {
        isRoot = rootElement === `.${root.className}`;
      } else if (rootElement.indexOf('#') >= 0) {
        isRoot = rootElement === `#${root.id}`;
      }
    }
  }

  if (isRoot) {
    const hasClassID = CHECK_PARENT_HAS_CLASS(e, exceptParentClassIDDataset);
    if (preventDefault && !hasClassID && e.cancelable && !e.defaultPrevented) {
      if (e.target instanceof Element) {
        const { localName } = e.target;
        if (localName != 'input' && localName != 'button' && localName != 'select') {
          e.preventDefault();
        }
      }
    }
  }
};

const down = (e: TouchEvent | MouseEvent) => {
  state.isPress = true;

  const x = e instanceof TouchEvent ? e.targetTouches[0].clientX : e.clientX || false;
  const y = e instanceof TouchEvent ? e.targetTouches[0].clientY : e.clientY || false;

  if (!x || !y) return;

  areWePreventDefault(e);
  mousePropertyDown.x = x;
  mousePropertyDown.y = y;
  mousePropertyMove.x = x;
  mousePropertyMove.y = y;

  extraEvent.down(e);
};

const move = (e: TouchEvent | MouseEvent) => {
  if (!state.isPress) return;
  const x = e instanceof TouchEvent ? e.targetTouches[0].clientX : e.clientX || false;
  const y = e instanceof TouchEvent ? e.targetTouches[0].clientY : e.clientY || false;
  if (!x || !y) return;

  areWePreventDefault(e);

  const { x: dx, y: dy } = mousePropertyDown;
  moveOffsetProperty.x = x - dx;
  moveOffsetProperty.y = y - dy;

  mousePropertyMove.x = x;
  mousePropertyMove.y = y;

  extraEvent.move({ ...e, moveOffsetProperty });
};

const up = (e: TouchEvent | MouseEvent) => {
  state.isPress = false;

  const { x: dx, y: dy } = mousePropertyDown;
  const { x: mx, y: my } = mousePropertyMove;
  const { deviation } = state;

  const m = Math.sqrt((mx - dx) ** 2 + (my - dy) ** 2);
  if (m < deviation) checkDataset(e);

  extraEvent.up(e);
};

const addListener = (device: string) => {
  if (device === 'mobile') {
    document.addEventListener('touchstart', down, eventProperty);
    document.addEventListener('touchmove', move, eventProperty);
    document.addEventListener('touchend', up);
  } else {
    document.addEventListener('mousedown', down);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }
};

const removeListener = (device: string) => {
  if (device === 'mobile') {
    document.removeEventListener('mousedown', down);
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
  } else {
    document.removeEventListener('touchstart', down);
    document.removeEventListener('touchmove', move);
    document.removeEventListener('touchend', up);
  }
};

export const add = (query: string, callback: Function) => {
  if (!callback) return;

  const type = query.slice(0, 1) === '.' ? '_class' : '_id';
  const name = query.slice(1);
  const key = name + type;
  dataset[String(key)] = callback;
};

export const remove = (query: string) => {
  var type = query.slice(0, 1) == '.' ? '_class' : '_id';
  var name = query.slice(1);
  var key = name + type;
  delete dataset[key];
};

export const install = (app = '#app') => {
  rootElement = app;
  eventTransform();
  window.addEventListener('resize', eventTransform);
};

export const clear = () => {
  dataset = {};
};

export const addPreventExcept = (query: string | string[]) => {
  if (Array.isArray(query)) {
    exceptParentClassIDDataset = [...query];
  } else exceptParentClassIDDataset.push(query);
};

export const setPreventDefault = (value: boolean) => {
  state.preventDefault = value;
};

const Click = { install, dataset, addPreventExcept, setPreventDefault, add, clear, remove };

export default Click;
