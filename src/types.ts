import { ModalProps } from './interfaces';

export type GetModalSubmitDataType<T> = T extends ModalProps<infer R> ? R : never;
