export function classNames(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function disableBodyScroll() {
  if (!document) return;
  document.body.style.overflow = 'hidden';
}

export function enableBodyScroll() {
  if (!document) return;
  document.body.style.overflow = 'unset';
}

export function onKeyDownCallback(keys: string[], callback: (e: KeyboardEvent) => void) {
  return (e: KeyboardEvent) => {
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    callback(e);
  };
}
