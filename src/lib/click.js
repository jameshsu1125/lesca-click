module.exports = {
	preventDefault: true,
	db: {},
	deviation: 30,
	init(clickEventAlso = true, install = true, ex_down = () => {}, ex_move = () => {}, ex_up = () => {}) {
		this.px = this.mx = 0;
		this.py = this.my = 0;
		this.dx = this.dy = 0;
		this.ex_down = ex_down;
		this.ex_move = ex_move;
		this.ex_up = ex_up;
		this.is_press = false;

		this.down = (e) => {
			let n = e.target.localName;
			if (this.preventDefault) {
				if (e.cancelable) {
					if (!e.defaultPrevented) {
						if (n != 'input' && n != 'button' && n != 'select') e.preventDefault();
						try {
							this.px = this.mx = e.clientX || e.targetTouches[0].clientX;
							this.py = this.my = e.clientY || e.targetTouches[0].clientY;
						} catch {}
					}
				}
			}
			this.ex_down(e);
			this.is_press = true;
		};

		this.move = (e) => {
			if (!this.is_press) return;

			let n = e.target.localName;
			if (this.preventDefault) {
				if (e.cancelable) {
					if (!e.defaultPrevented) {
						if (n != 'input' && n != 'button' && n != 'select') e.preventDefault();
						try {
							this.px = e.clientX || e.targetTouches[0].clientX;
							this.py = e.clientY || e.targetTouches[0].clientY;
							this.dx = this.px - this.mx;
							this.dy = this.py - this.my;
						} catch {}
					}
				}
			}
			this.ex_move(e);
		};

		this.up = (e) => {
			if (Math.abs(this.px - this.mx) < this.deviation && Math.abs(this.py - this.my) < this.deviation) {
				this.get(e);
			}
			this.is_press = false;
			this.ex_up(e);
		};

		document.addEventListener('touchstart', this.down, {
			passive: false,
			capture: false,
		});
		document.addEventListener('touchmove', this.move, {
			passive: false,
			capture: false,
		});
		document.addEventListener('touchend', this.up);

		if (clickEventAlso) {
			document.addEventListener('mousedown', this.down);
			document.addEventListener('mousemove', this.move);
			document.addEventListener('mouseup', this.up);
		}

		if (install) window.Click = window.Click || this;
	},
	get(e) {
		const { localName } = e.target;
		const { type } = e;

		let key = e.target.id + '_id';
		if (this.db[key]) {
			if (localName !== 'button') {
				this.db[key](e);
			} else {
				const device = this.detect();
				if (device === 'mobile' && type === 'touchend') this.db[key](e);
				else if (device !== 'mobile' && type === 'mouseup') this.db[key](e);
			}
			return;
		}

		key = e.target.className + '_class';
		if (this.db[key]) {
			if (localName !== 'button') {
				this.db[key](e);
			} else {
				const device = this.detect();
				if (device === 'mobile' && type === 'touchend') this.db[key](e);
				else if (device !== 'mobile' && type === 'mouseup') this.db[key](e);
			}
			return;
		}
	},
	add(query, fn) {
		if (!fn) console.log('require callback function');
		let type = query.slice(0, 1) == '.' ? '_class' : '_id';
		let name = query.slice(1);
		let key = name + type;
		this.db[key] = fn;
	},
	remove(query) {
		let type = query.slice(0, 1) == '.' ? '_class' : '_id';
		let name = query.slice(1);
		let key = name + type;
		delete this.db[key];
	},
	clear() {
		this.db = {};
	},
	destory() {
		document.removeEventListener('touchstart', this.down);
		document.removeEventListener('touchmove', this.move);
		document.removeEventListener('touchend', this.up);
		if (clickEventAlso) {
			document.removeEventListener('mousedown', this.down);
			document.removeEventListener('mousemove', this.move);
			document.removeEventListener('mouseup', this.up);
		}
	},
	getClientXY(e) {
		try {
			const left = e.clientX || e.targetTouches[0].clientX;
			const top = e.clientY || e.targetTouches[0].clientY;
			return { left, top };
		} catch {
			return false;
		}
	},
	detect() {
		let MobileDetect = require('mobile-detect'),
			m = new MobileDetect(window.navigator.userAgent);

		if (m.tablet()) return 'mobile';
		else if (m.mobile()) return 'mobile';
		else return 'desktop';
	},
};
