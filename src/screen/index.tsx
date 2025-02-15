import React, { Fragment, useRef, useEffect } from 'react';
import { Portal } from '../portal';
import { isFunction } from 'lodash';
import { ScreenLayout, ScreenLayoutProps, CallbackData } from './screen-layout';
import { cx, OrNil } from './utils';
import { LoadingOverlay, LoadingOverlayProps } from '../loading-overlay';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { LayerProvider, useLayer } from '../helpers/layer';

interface AdvancedCallbackData extends CallbackData {
  rootElement: OrNil<HTMLDivElement>
}

export interface ScreenProps {

  /** Содержимое. */
  children?: React.ReactNode

  /** Реф контента. */
  contentRef?: ScreenLayoutProps['childrenRef']

  /** Содержимое подвала. */
  footer?: any

  /** Отступ от нижней границы для срабатывания onFullScroll. */
  fullScrollThreshold?: number

  /** Нужно ли выводить вместо содержимого состояние загрузки. */
  loading?: boolean

  /** Определяет область отображаемую как загружающуюся. */
  loadingArea?: 'content' | 'full'

  /** Свойства компонента LoadingOverlay. */
  loadingOverlayProps?: LoadingOverlayProps

  /** Свойства компонента NavBar. */
  navBarProps?: ScreenLayoutProps['navBarProps']

  /** Сработает при клике на кнопку "назад". */
  onBack?: (data: AdvancedCallbackData) => void

  /** Сработает при кнопке на крест. */
  onClose?: (data: AdvancedCallbackData) => void

  /** Сработает при полной прокрутке контента. */
  onFullScroll?: ScreenLayoutProps['onFullScroll']

  /** Подзаголовок. */
  subtitle?: string

  /** Заголовок. */
  title?: string

  /** Нужно ли выводить кнопку "назад". */
  withBackButton?: boolean

  /** Нужно ли выводить закрывающий крест. */
  withCloseButton?: boolean

  /** Нужно ли рисовать черту между шапкой и основным содержимым. */
  withDivideHeader?: boolean

  /** Нужно ли выводить кнопку "назад". */
  withHeader?: boolean

  /** Нужно ли выводить Layer (при SSR необходимо указать false). */
  inPortal?: boolean
}

/**
 * Экран.
 * @param props Свойства.
 * @return Элемент.
 */
export const Screen: React.FC<ScreenProps> = ({
  children,
  contentRef,
  footer,
  fullScrollThreshold = 320,
  loading = false,
  loadingArea = 'full',
  loadingOverlayProps,
  navBarProps,
  onBack,
  onClose,
  onFullScroll,
  subtitle,
  title,
  withBackButton = false,
  withCloseButton = true,
  withDivideHeader = true,
  withHeader = true,
  inPortal = true,
}) => {
  const Wrapper = inPortal ? Portal : Fragment;
  const layer = useLayer() + 300; // 300 из-за монолита
  const rootRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);

  // включаем прокрутку body при размонтировании
  useEffect(() => () => {
    innerContentRef.current && enableBodyScroll(innerContentRef.current);
  }, []);

  return (
    <Wrapper>
      <div
        ref={rootRef}
        className={cx('screen', 'full-width')}
        style={{ zIndex: layer }}
      >
        {
          loading && loadingArea === 'full'
            ? <LoadingOverlay {...loadingOverlayProps} />
            : (
              <LayerProvider value={layer}>
                <ScreenLayout
                  title={title}
                  subtitle={subtitle}
                  withHeader={withHeader}
                  withDivideHeader={withDivideHeader}
                  withBackButton={withBackButton}
                  withCloseButton={withCloseButton}
                  children={
                    loading && loadingArea === 'content'
                      ? (
                        <LoadingOverlay
                          {...loadingOverlayProps}
                          {...loadingArea === 'content' && {
                            fill: false,
                            style: { height: '100%' },
                          }}
                        />
                      )
                      : children
                  }
                  childrenRef={element => {
                    setRefValue(contentRef as any, element);
                    takeScrollableElement(innerContentRef, element);
                  }}
                  footer={footer}
                  onBack={({ contentElement }) => {
                    onBack && onBack({
                      rootElement: rootRef.current,
                      contentElement,
                    });
                  }}
                  onClose={({ contentElement }) => {
                    onClose && onClose({
                      rootElement: rootRef.current,
                      contentElement,
                    });
                  }}
                  onFullScroll={onFullScroll}
                  fullScrollThreshold={fullScrollThreshold}
                  navBarProps={navBarProps}
                />
              </LayerProvider>
            )
        }
      </div>
    </Wrapper>
  );
};

/**
 * Записывает переданное значение в ref контента.
 * @param ref Ref-контейнер.
 * @param value Значение для записи.
 */
export const setRefValue = (ref: React.RefCallback<any> | React.MutableRefObject<any>, value: any) => {
  if (isFunction(ref)) {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
};

/**
 * Записывает полученный элемент в ref и отключает прокрутку.
 * @param ref Ref-контейнер.
 * @param element Элемент для записи.
 */
export const takeScrollableElement = (
  ref: React.MutableRefObject<OrNil<HTMLDivElement>>,
  element?: HTMLDivElement | null
) => {
  if (element && element !== ref.current) {
    // если элемент изменился - включаем прокрутку для старого
    ref.current && enableBodyScroll(ref.current);

    // сохраняем новый элемент
    ref.current = element;

    // отключаем прокрутку для нового элемента
    disableBodyScroll(element);
  }
};
