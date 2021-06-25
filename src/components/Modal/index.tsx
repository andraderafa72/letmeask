import { Button } from '../Button';

import './styles.scss'

type ModalProps = {
  isVisible: boolean;
  removeItem: () => void;
  cancel: () => void;
}

export function Modal({ isVisible = false, removeItem, cancel }: ModalProps) {
  return (
    <div className="modal">
      <div className="content">
        <p>Tem certeza que quer apagar esta pergunta?</p>

        <div className="buttons">
          <a href="#asd" onClick={cancel}>Cancelar</a>
          <Button type="button" onClick={removeItem}>Apagar</Button>
        </div>
      </div>
    </div>
  )
}
