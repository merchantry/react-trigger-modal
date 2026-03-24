'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useIsMounted } from './hooks/useIsMounted';
import { createPortal } from 'react-dom';
import { modalBus } from './modalBus';
import { ModalEntry } from './types';
import { useOnKeyDown } from './hooks/useOnKeyDown';
import { classNames, disableBodyScroll, enableBodyScroll } from './utils/html';

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useIsMounted();
  const [modal, setModal] = useState<ModalEntry | undefined>(undefined);

  const resolveModal = (data: unknown) => {
    setModal(undefined);
    modal?.resolve(data);
  };

  const onClose = () => {
    resolveModal(undefined);
  };

  const onModalMaskClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;

    onClose();
  };

  useEffect(() => {
    return modalBus.onShow((entry) => {
      setModal((prev) => {
        prev?.resolve(undefined);
        return entry;
      });
    });
  }, []);

  // Manage body scroll: lock when a modal is open, unlock when gone.
  useEffect(() => {
    if (modal) disableBodyScroll();
    else enableBodyScroll();
  }, [modal]);

  useOnKeyDown(['Escape'], onClose, !!modal);

  const portal = useMemo(() => {
    if (!isMounted || !modal) return undefined;

    const modalContainer = (
      <div
        className={classNames('modal-mask', modal.config.animate && 'animated')}
        onMouseDown={onModalMaskClick}
      >
        <modal.Modal {...modal.props} onClose={onClose} />
      </div>
    );

    return createPortal(modalContainer, document.body);
  }, [isMounted, modal, onClose]);

  return (
    <>
      {children}
      {portal}
    </>
  );
}
