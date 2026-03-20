'use client';

import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { ModalEntry, modalBus } from './modalBus';
import {
  classNames,
  disableBodyScroll,
  enableBodyScroll,
  onKeyDownCallback,
} from './utils/html';

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [modals, setModals] = useState<ModalEntry[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  // Keep a ref so the keydown handler always sees the latest modals array.
  const modalsRef = useRef(modals);
  modalsRef.current = modals;

  useEffect(() => {
    return modalBus.onShow((entry) => {
      setModals((prev) => [...prev, entry]);
    });
  }, []);

  // Manage body scroll: lock when any modal is open, unlock when all are gone.
  useEffect(() => {
    if (modals.length > 0) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
  }, [modals.length]);

  // Escape key closes the topmost modal.
  useEffect(() => {
    if (modals.length === 0) return;
    const top = modals[modals.length - 1];
    const handler = onKeyDownCallback(['Escape'], () => {
      setModals((prev) => prev.filter((m) => m.id !== top.id));
      top.resolve(undefined);
    });
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modals]);

  const portal =
    isMounted &&
    ReactDOM.createPortal(
      modals.map(({ id, Modal, props, config, resolve }) => {
        const onClose = () => {
          setModals((prev) => prev.filter((m) => m.id !== id));
          resolve(undefined);
        };
        const onSubmit = (data: any) => {
          setModals((prev) => prev.filter((m) => m.id !== id));
          resolve(data);
        };
        const onClickMask = (e: MouseEvent<HTMLDivElement>) => {
          if (e.target !== e.currentTarget) return;
          onClose();
        };
        return (
          <div
            key={id}
            className={classNames('modal-mask', config.animate && 'animated')}
            onMouseDown={onClickMask}
          >
            <Modal {...props} onClose={onClose} onSubmit={onSubmit} />
          </div>
        );
      }),
      document.body,
    );

  return (
    <>
      {children}
      {portal}
    </>
  );
}
