import React from 'react';
import {
  GetModalSubmitDataType,
  ModalConfig,
  TriggerModalProps,
} from './types';
import { modalBus } from './modalBus';
import { ModalProps } from './interfaces';

export default function triggerModal<
  R extends ModalProps<T>,
  T = GetModalSubmitDataType<R>,
>(
  Modal: React.FC<R>,
  _props: TriggerModalProps<R, T>,
  { animate }: ModalConfig = { animate: true },
): Promise<T | undefined> {
  return new Promise((resolve) => {
    const dispatched = modalBus.show({
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
  });
}
