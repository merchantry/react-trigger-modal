import React, { MouseEvent } from 'react';
import ReactDOM from 'react-dom/client';
import { ModalProps } from './interfaces';
import { GetModalSubmitDataType } from './types';
import { classNames, disableBodyScroll, enableBodyScroll, onKeyDownCallback } from './utils/html';
import { modalBus } from './modalBus';

type ModalConfig = { animate: boolean };
type TriggerModalProps<R extends ModalProps<T>, T> = Omit<R, 'onSubmit' | 'onClose'>;

let modalCounter = 0;

function getOrCreateModalRoot(): HTMLDivElement {
  let el = document.getElementById('modal-root');
  if (!el) {
    el = document.createElement('div');
    el.id = 'modal-root';
    document.body.appendChild(el);
  }
  return el as HTMLDivElement;
}

export default function triggerModal<R extends ModalProps<T>, T = GetModalSubmitDataType<R>>(
  Modal: React.FC<R>,
  _props: TriggerModalProps<R, T>,
  { animate }: ModalConfig = { animate: true },
): Promise<T | undefined> {
  return new Promise(resolve => {
    const dispatched = modalBus.show({
      id: String(++modalCounter),
      Modal: Modal as React.FC<any>,
      props: _props,
      config: { animate },
      resolve,
    });

    if (dispatched) return;

    // Fallback: no ModalProvider mounted. Hooks inside modals will not work.
    console.warn(
      '[react-trigger-modal] No <ModalProvider> found. ' +
      'Wrap your app with <ModalProvider> to enable hooks inside modals.',
    );

    const root = ReactDOM.createRoot(getOrCreateModalRoot());

    const handleKeyDown = onKeyDownCallback(['Escape'], () => props.onClose());

    const removeModal = () => {
      enableBodyScroll();
      window.removeEventListener('keydown', handleKeyDown);
      root.unmount();
    };

    const props = {
      ..._props,
      onSubmit: (data: T) => { removeModal(); resolve(data); },
      onClose: () => { removeModal(); resolve(undefined); },
    } as R;

    const onClickMask = (e: MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      props.onClose();
    };

    disableBodyScroll();
    window.addEventListener('keydown', handleKeyDown);

    root.render(
      <div className={classNames('modal-mask', animate && 'animated')} onMouseDown={onClickMask}>
        <Modal {...props} />
      </div>,
    );
  });
}
