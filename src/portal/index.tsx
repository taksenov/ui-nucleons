import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {

  /** Вернет элемент, в который нужно вывести содержимое через портал. */
  defineRoot?: () => HTMLElement

  /** Содержимое. */
  children?: React.ReactNode
}

/**
 * Компонент слоя. Выводит содержимое в портале.
 * @param props Свойства.
 * @return Элемент.
 */
export const Portal: React.FC<PortalProps> = ({ children, defineRoot = () => document.body }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    const root = defineRoot();

    ref.current = document.createElement('div');

    root.appendChild(ref.current);
    setMounted(true);

    return () => {
      ref.current && ref.current.remove();
    };
  }, []);

  return mounted && ref.current
    ? createPortal(children, ref.current)
    : null;
};
