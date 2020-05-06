import React, { useRef, useEffect } from 'react';
import Layer from '../layer';
import isFunction from 'lodash/isFunction';
import { ScreenLayout } from './screen-layout';
import { cx } from './common';
import LoadingOverlay from '../loading-overlay';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import PropTypes from 'prop-types';

/**
 * Экран.
 * @param {Object} props Свойства.
 * @param {string} [props.title] Заголовок.
 * @param {string} [props.subtitle] Подзаголовок.
 * @param {Function} [props.onBack] Сработает при клике на кнопку "назад".
 * @param {Function} [props.onClose] Сработает при кнопке на крест.
 * @param {Function} [props.onFullScroll] Сработает при полной прокрутке контента.
 * @param {Function} [props.fullScrollThreshold=320] Отступ от нижней границы для срабатывания onFullScroll.
 * @param {boolean} [props.withHeader=true] Нужно ли выводить кнопку "назад".
 * @param {boolean} [props.withBackButton=false] Нужно ли выводить кнопку "назад".
 * @param {boolean} [props.withCloseButton=true] Нужно ли выводить закрывающий крест.
 * @param {*} [props.children] Содержимое.
 * @param {*} [props.footer] Содержимое подвала.
 * @param {boolean} [props.loading=false] Нужно ли выводить вместо содержимого состояние загрузки.
 * @param {Object} [props.loadingOverlayProps={}] Свойства компонента LoadingOverlay.
 * @return {ReactElement} Экран.
 */
const Screen = ({
  title,
  subtitle,
  onBack,
  onClose,
  onFullScroll,
  withHeader = true,
  withBackButton = false,
  withCloseButton = true,
  children,
  footer,
  loading = false,
  loadingOverlayProps = {},
  fullScrollThreshold = 320,
}) => {
  const rootRef = useRef();
  const contentRef = useRef();

  // включаем прокрутку body при размонтировании
  useEffect(() => () => enableBodyScroll(contentRef.current), []);

  return (
    <Layer>
      <div
        ref={rootRef}
        className={cx('screen', 'full-width')}
      >
        {
          loading
            ? <LoadingOverlay {...loadingOverlayProps} />
            : (
              <ScreenLayout
                title={title}
                subtitle={subtitle}
                withHeader={withHeader}
                withBackButton={withBackButton}
                withCloseButton={withCloseButton}
                children={children}
                childrenRef={createTakeScrollableElement(contentRef)}
                footer={footer}
                onBack={({ contentElement }) => {
                  isFunction(onBack) && onBack({
                    rootElement: rootRef.current,
                    contentElement,
                  });
                }}
                onClose={({ contentElement }) => {
                  isFunction(onClose) && onClose({
                    rootElement: rootRef.current,
                    contentElement,
                  });
                }}
                onFullScroll={onFullScroll}
                fullScrollThreshold={fullScrollThreshold}
              />
            )
        }
      </div>
    </Layer>
  );
};

/**
 * Возвращает функцию, которая, получив элемент, записывает его в ref и отключает прокрутку.
 * @param {Object} ref Ref-контейнер.
 * @return {Function} Функция, которая, получив элемент, записывает его в ref и отключает прокрутку.
 */
export const createTakeScrollableElement = ref => element => {
  if (element && element !== ref.current) {
    // если элемент изменился - включаем прокрутку для старого
    ref.current && enableBodyScroll(ref.current);

    // сохраняем новый элемент
    ref.current = element;

    // отключаем прокрутку для нового элемента
    disableBodyScroll(element);
  }
};

Screen.propTypes = {
  /**
   * Заголовок.
   */
  title: PropTypes.string,

  /**
   * Подзаголовок.
   */
  subtitle: PropTypes.string,

  /**
   * Сработает при клике на кнопку "назад".
   */
  onBack: PropTypes.func,

  /**
   * Сработает при кнопке на крест.
   */
  onClose: PropTypes.func,

  /**
   * Сработает при полной прокрутке контента.
   */
  onFullScroll: PropTypes.func,

  /**
   * Отступ от нижней границы для срабатывания onFullScroll.
   */
  fullScrollThreshold: PropTypes.number,

  /**
   * Нужно ли выводить шапку с заголовком и кнопками.
   */
  withHeader: PropTypes.bool,

  /**
   * Нужно ли выводить кнопку "назад".
   */
  withBackButton: PropTypes.bool,

  /**
   * Нужно ли выводить закрывающий крест.
   */
  withCloseButton: PropTypes.bool,

  /**
   * Содержимое.
   */
  children: PropTypes.any,

  /**
   * Содержимое подвала.
   */
  footer: PropTypes.any,

  /**
   * Нужно ли выводить вместо содержимого состояние загрузки.
   */
  loading: PropTypes.bool,

  /**
   * Свойства компонента LoadingOverlay.
   */
  loadingOverlayProps: PropTypes.object,
};

export default Screen;