import isEqual from 'lodash/isEqual';
import { useEffect, useRef, useMemo, useState } from 'react';
import { isTouchDevice } from '../helpers/is-touch-device';
import isFunction from 'lodash/isFunction';
import on from '../helpers/on';

/**
 * Вызывает переданную функцию при монтировании компонента.
 * @param {Function} callback Функция обратного вызова.
 */
export const useOnMount = callback => {
  useEffect(callback, []);
};

/**
 * Расширенная версия useMemo, передающая зависимости внутрь callback'а.
 * @inheritdoc
 */
export const useApplyMemo = (computeValue, dependencies) => {
  const memoContainer = useRef(() => computeValue(dependencies));
  const dependenciesContainer = useRef(dependencies);

  if (!isEqual(dependencies, dependenciesContainer.current)) {
    dependenciesContainer.current = dependencies;
    memoContainer.current = () => computeValue(dependencies);
  }

  return useMemo(memoContainer.current, dependencies);
};

/**
 * При монтировании проверяет, поддерживает ли устройство touch события.
 * @return {boolean} True - если поддерживает, false - если нет.
 */
export const useIsTouchDevice = () => {
  const [isTouch, setTouch] = useState(false);

  useOnMount(() => {
    setTouch(isTouchDevice());
  });

  return isTouch;
};

/**
 * Реализует подписку на событие полной прокрутки списка.
 * @param {Object} ref Реф прокручиваемого элемента.
 * @param {Object} options Опции.
 * @param {Function} options.onFullScroll Сработает при событии полной прокрутки.
 * @param {number} [options.threshold=0] Отступ от конца списка по которому событие должно срабатывать.
 * @return {undefined}
 */
export const useInfiniteScroll = (ref, {
  onFullScroll,
  threshold = 0,
}) => useEffect(() => {
  const { current: element } = ref;

  if (element) {
    return on(element, 'scroll', event => {
      const {
        scrollTop,
        clientHeight,
        scrollHeight,
      } = event.target;
      const bottom = threshold + scrollTop + clientHeight;
      const isFullyScrolled = bottom >= scrollHeight;

      if (isFullyScrolled && isFunction(onFullScroll)) {
        onFullScroll(event);
      }
    });
  }
}, [ref.current, threshold, onFullScroll]);

/**
 * Запускает переданный обработчик при клике вне элемента.
 * @param {Object} elementRef Ref элемента, клик вне которого нужно обработать.
 * @param {Function} callback Сработает при клике вне элемента.
 */
export const useOutsideClick = (elementRef, callback) => {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => on(document.documentElement, 'click', event => {
    const { current: element } = elementRef;
    const { current: handleClick } = callbackRef;

    element
      && element !== event.target
      && !element.contains(event.target)
      && isFunction(handleClick)
      && handleClick(event);
  }), []);
};
