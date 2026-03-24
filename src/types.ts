import React from 'react';
import { ModalProps } from './interfaces';

export type GetModalSubmitDataType<T> =
  T extends ModalProps<infer R> ? R : never;

export type ModalConfig = {
  animate: boolean;
};

export type TriggerModalProps<R extends ModalProps<T>, T> = Omit<
  R,
  'onSubmit' | 'onClose'
>;

export type ModalEntry<T = any> = {
  Modal: React.FC<any>;
  props: any;
  config: ModalConfig;
  resolve: (data: T | undefined) => void;
};

export type ShowListener = (entry: ModalEntry) => void;
