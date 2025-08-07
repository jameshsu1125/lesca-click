import MobileDetect from 'mobile-detect';

export const GET_DEVICE = () => {
  const m = new MobileDetect(window.navigator.userAgent);

  if (m.tablet()) return 'mobile';
  else if (m.mobile()) return 'mobile';
  else return 'desktop';
};

export const CHECK_PARENT_HAS_CLASS = (e: TouchEvent | MouseEvent, classDataset: string[]) => {
  const { target } = e;

  let node = target as HTMLElement;
  const result = [];

  while (node && node.tagName !== 'HTML') {
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
    node = node.parentNode as HTMLElement;
  }

  return result.length > 0;
};

export const FIND_ROOT = (e: TouchEvent | MouseEvent) => {
  const { target } = e;

  let node = target as HTMLElement;
  let result;

  while (node && node.tagName !== 'BODY') {
    result = node;
    node = node.parentNode as HTMLElement;
  }

  return result;
};
