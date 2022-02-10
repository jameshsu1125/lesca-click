import { GET_DEVICE, CHECK_PARENT_HAS_CLASS } from './constants';

/**
 * event dataset
 */
export let dataset = {};

const mousePropertyDown = { x: 0, y: 0 };
const mousePropertyMove = { x: mousePropertyDown.x, y: mousePropertyDown.y };
const extraEvent = { down: () => {}, move: () => {}, up: () => {} };
const state = { device: false, isPress: false, deviation: 30, preventDefault: true };
const eventProperty = { passive: false, capture: false };
const moveOffsetProperty = { x: 0, y: 0 };
let exceptParentClassIDDataset = [];

const checkDataset = (e) => {
	const { target } = e;
	[`${target.id}_id`, `${target.className}_class`].forEach((name) => {
		dataset[name]?.(e);
	});
};

const areWePreventDefault = (e) => {
	const { preventDefault } = state;
	const hasClassID = CHECK_PARENT_HAS_CLASS(e, exceptParentClassIDDataset);
	if (preventDefault && !hasClassID && e.cancelable && !e.defaultPrevented) {
		const n = e.target.localName;
		if (n != 'input' && n != 'button' && n != 'select') e.preventDefault();
	}
};

const down = (e) => {
	state.isPress = true;
	const x = e.clientX || e.targetTouches[0].clientX || false;
	const y = e.clientY || e.targetTouches[0].clientY || false;
	if (!x || !y) return;

	areWePreventDefault(e);
	mousePropertyDown.x = x;
	mousePropertyDown.y = y;
	mousePropertyMove.x = x;
	mousePropertyMove.y = y;

	extraEvent.down(e);
};

const move = (e) => {
	if (!state.isPress) return;
	const x = e.clientX || e.targetTouches[0].clientX || false;
	const y = e.clientY || e.targetTouches[0].clientY || false;
	if (!x || !y) return;

	areWePreventDefault(e);

	const { x: dx, y: dy } = mousePropertyDown;
	moveOffsetProperty.x = x - dx;
	moveOffsetProperty.y = y - dy;

	mousePropertyMove.x = x;
	mousePropertyMove.y = y;

	extraEvent.move({ ...e, moveOffsetProperty });
};

const up = (e) => {
	state.isPress = false;

	const { x: dx, y: dy } = mousePropertyDown;
	const { x: mx, y: my } = mousePropertyMove;
	const { deviation } = state;

	const m = Math.sqrt((mx - dx) ** 2 + (my - dy) ** 2);
	if (m < deviation) checkDataset(e);

	extraEvent.up(e);
};

const addListener = (device) => {
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

const removeListener = (device) => {
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

/**
 *
 * @param {queryString} query make sure it's uni-name.(ex: .target || #target)
 */
export const addPreventExcept = (query) => {
	const type = typeof query;
	if (type === 'string') exceptParentClassIDDataset.push(query);
	else if (Array.isArray(query)) {
		exceptParentClassIDDataset = [...query];
	}
};

/**
 * set preventDefault will call or not.
 * @param {boolean} value
 */
export const setPreventDefault = (value) => {
	state.preventDefault = value;
};

/**
 *
 * @param {queryString} query make sure it's uni-name.(ex: .target || #target)
 * @param {function} callback call when click
 * @returns
 */
export const add = (query, callback) => {
	if (!callback) return;

	const type = query.slice(0, 1) === '.' ? '_class' : '_id';
	const name = query.slice(1);
	const key = name + type;
	dataset[key] = callback;
};

export const remove = (query) => {
	var type = query.slice(0, 1) == '.' ? '_class' : '_id';
	var name = query.slice(1);
	var key = name + type;
	delete dataset[key];
};

/**
 * add events
 */
export const install = () => {
	eventTransform();
	window.addEventListener('resize', eventTransform);
};

/**
 * clear all dataset
 */
export const clear = () => {
	dataset = {};
};

const Click = { install, dataset, addPreventExcept, setPreventDefault, add, clear, remove };

export default Click;
