export interface ModalProps<T> {
  title?: string;
  className?: string;
  onClose: () => void;
  onSubmit: (data: T) => void;
}
