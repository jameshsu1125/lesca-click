import { GET_DEVICE, CHECK_PARENT_HAS_CLASS, FIND_ROOT } from './misc';

export let dataset: Record<string, (event: TouchEvent | MouseEvent) => void> = {};
const mousePropertyDown = { x: 0, y: 0 };
const mousePropertyMove = { x: mousePropertyDown.x, y: mousePropertyDown.y };
const moveOffsetProperty = { x: 0, y: 0 };
const extraEvent: {
  down: (event: TouchEvent | MouseEvent) => void;
  move: (event: TouchEvent | MouseEvent, moveOffsetProperty?: { x: number; y: number }) => void;
  up: (event: TouchEvent | MouseEvent) => void;
} = {
  down: () => {},
  move: () => {},
  up: () => {},
};
const state = { device: '', isPress: false, deviation: 30, preventDefault: true, enabled: true };
const eventProperty = { passive: false, capture: false };
let exceptParentClassIDDataset: string[] = [];
let rootElement = '';
let isGestureBlocked = false;

const isButtonTarget = (e: TouchEvent | MouseEvent) =>
  e.target instanceof Element && e.target.closest('button') !== null;

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
  const { preventDefault, enabled } = state;
  if (!enabled) return;
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
        const interactive = e.target.closest('input, button, select, textarea, a');
        const isButtonMove =
          isButtonTarget(e) && (e.type === 'mousemove' || e.type === 'touchmove');
        if (!interactive || isButtonMove) {
          e.preventDefault();
        }
      }
    }
  }
};

const down = (e: TouchEvent | MouseEvent) => {
  state.isPress = true;
  isGestureBlocked = isButtonTarget(e);

  const x = e instanceof MouseEvent ? e.clientX : e.targetTouches[0].clientX || false;
  const y = e instanceof MouseEvent ? e.clientY : e.targetTouches[0].clientY || false;

  if (!x || !y) return;

  areWePreventDefault(e);
  mousePropertyDown.x = x;
  mousePropertyDown.y = y;
  mousePropertyMove.x = x;
  mousePropertyMove.y = y;

  if (!isGestureBlocked) extraEvent.down(e);
};

const move = (e: TouchEvent | MouseEvent) => {
  if (!state.isPress) return;
  const x = e instanceof MouseEvent ? e.clientX : e.targetTouches[0].clientX || false;
  const y = e instanceof MouseEvent ? e.clientY : e.targetTouches[0].clientY || false;
  if (!x || !y) return;

  areWePreventDefault(e);

  const { x: dx, y: dy } = mousePropertyDown;
  moveOffsetProperty.x = x - dx;
  moveOffsetProperty.y = y - dy;

  mousePropertyMove.x = x;
  mousePropertyMove.y = y;

  // Pass the event as-is, and handle moveOffsetProperty separately if needed
  if (!isGestureBlocked) {
    (
      extraEvent.move as (
        event: TouchEvent | MouseEvent,
        moveOffsetProperty?: { x: number; y: number },
      ) => void
    )(e, { ...moveOffsetProperty });
  }
};

const up = (e: TouchEvent | MouseEvent) => {
  state.isPress = false;

  const { x: dx, y: dy } = mousePropertyDown;
  const { x: mx, y: my } = mousePropertyMove;
  const { deviation } = state;

  const m = Math.sqrt((mx - dx) ** 2 + (my - dy) ** 2);
  if (m < deviation) checkDataset(e);

  if (!isGestureBlocked) extraEvent.up(e);
  isGestureBlocked = false;
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

export const add = (query: string, callback: (event: TouchEvent | MouseEvent) => void) => {
  if (!callback) return;

  const type = query.slice(0, 1) === '.' ? '_class' : '_id';
  const name = query.slice(1);
  const key = name + type;
  dataset[String(key)] = callback;
};

export const remove = (query: string) => {
  const type = query.slice(0, 1) == '.' ? '_class' : '_id';
  const name = query.slice(1);
  const key = name + type;
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

export const removePreventExcept = (query: string | string[]) => {
  const targets = Array.isArray(query) ? query : [query];
  exceptParentClassIDDataset = exceptParentClassIDDataset.filter((item) => !targets.includes(item));
};

export const setPreventDefault =(value: boolean) => {
  state.preventDefault = value;
};

export const setEnabled = (value: boolean) => {
  state.enabled = value;
};

const Click = {
  install,
  dataset,
  addPreventExcept,
  removePreventExcept,
  setPreventDefault,
  add,
  clear,
  remove,
  setEnabled,
};

export default Click;
