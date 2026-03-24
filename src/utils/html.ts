export function disableBodyScroll() {
  if (!document) return;
  document.body.style.overflow = 'hidden';
}

export function enableBodyScroll() {
  if (!document) return;
  document.body.style.overflow = 'unset';
}

export function onKeyDownCallback(
  keys: string[],
  callback: (e: KeyboardEvent) => void,
) {
  const keysSet = new Set(keys);

  return (e: KeyboardEvent) => {
    if (!keysSet.has(e.key)) return;
    e.preventDefault();
    callback(e);
  };
}
