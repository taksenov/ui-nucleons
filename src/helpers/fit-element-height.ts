/**
 * Перехватив событие, подгонит высоту поля под содержимое.
 * @param event Событие.
 * @param event.target Поле.
 */
export const fitElementHeight = ({ target }: { target: HTMLElement }) => {
  target.style.height = 'auto';

  // актуальные значения после установки "auto" (в начало функции не переносить)
  const {
    scrollHeight,
    offsetHeight,
    clientHeight,
  } = target;

  target.style.height = `${scrollHeight + offsetHeight - clientHeight}px`;
};
