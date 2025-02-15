import React from 'react';
import classnames from 'classnames/bind';
import { has } from 'lodash';
import classes from './top-bar.module.scss';
import { InnerBorder } from '../styling/borders';

export type TopBarSize = 's' | 'm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  'data-testid'?: string;
}

export interface TopBarProps {
  /** Свойства кнопок. */
  buttonsProps?: {
    start?: ButtonProps;
    startSecondary?: ButtonProps;
    end?: ButtonProps;
    endSecondary?: ButtonProps;
  };

  /** CSS-класс корневого элемента. */
  className?: string;

  /** Размер. */
  size?: TopBarSize;

  /** Подзаголовок. */
  subtitle?: string;

  /** Заголовок. */
  title?: string;

  /** Нужна ли разделительная черта снизу. */
  divided?: boolean;
}

// некоторым компонентам нужно знать конкретную высоту, делаем единый источник
export const TOP_BAR_HEIGHT: Readonly<Record<TopBarSize, number>> = {
  s: 64,
  m: 80,
};

const cx = classnames.bind(classes);

/**
 * Компонент шапки модальных окон/экранов.
 * @param props Свойства.
 * @return Элемент.
 */
export const TopBar = ({
  divided,
  size = 'm',
  title,
  subtitle,
  buttonsProps: { start, startSecondary, end, endSecondary } = {},
  className,
}: TopBarProps) => {
  const hasStart = has(start, 'icon');
  const hasStartSecondary = has(startSecondary, 'icon');
  const hasEnd = has(end, 'icon');
  const hasEndSecondary = has(endSecondary, 'icon');

  const stub = hasStart || hasEnd ? iconStub : null;
  const secondaryStub = hasStartSecondary || hasEndSecondary ? iconStub : null;

  return (
    <div
      className={cx(
        'root',
        `size-${size}`,
        className,
        divided && InnerBorder.bottom,
      )}
      style={{ height: `${TOP_BAR_HEIGHT[size]}px` }}
    >
      {hasStart ? <IconButton {...start} /> : stub}
      {hasStartSecondary ? <IconButton {...startSecondary} /> : secondaryStub}

      <div className={cx('main-section')}>
        <div className={cx('title', 'ellipsis')}>{title}</div>
        {Boolean(subtitle) && (
          <div className={cx('subtitle', 'ellipsis')}>{subtitle}</div>
        )}
      </div>

      {hasEndSecondary ? <IconButton {...endSecondary} /> : secondaryStub}
      {hasEnd ? <IconButton {...end} /> : stub}
    </div>
  );
};

/**
 * Компонент кнопки-иконки.
 * @param props Свойства. Поддерживаются свойства button.
 * @param props.icon Иконка.
 * @return Элемент.
 */
export const IconButton = ({ icon, ...buttonProps }: ButtonProps) => (
  <button {...buttonProps} type='button' className={cx('icon-button')}>
    {icon}
  </button>
);

const iconStub = <div className={cx('icon-button', 'stub')} />;
