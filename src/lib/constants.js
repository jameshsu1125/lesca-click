import MobileDetect from 'mobile-detect';

export const GET_DEVICE = () => {
	const m = new MobileDetect(window.navigator.userAgent);

	if (m.tablet()) return 'mobile';
	else if (m.mobile()) return 'mobile';
	else return 'desktop';
};

/**
 *
 * @param {event} e
 * @param {array} classDataset
 */
export const CHECK_PARENT_HAS_CLASS = (e, classDataset) => {
	const { target } = e;

	let node = target;
	const result = [];

	while (node.tagName !== 'HTML') {
		const { id, className } = node;
		const is =
			classDataset.filter((e) => {
				const attr = e.slice(0, 1);
				const name = e.slice(1);
				switch (attr) {
					case '.':
						if (className === name) return true;
						break;

					case '#':
						if (id === name) return true;
						break;
				}
				return false;
			}).length > 0;

		if (is) result.push(node);
		node = node.parentNode;
	}

	return result.length > 0;
};
