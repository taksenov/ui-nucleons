import React, { Children, isValidElement } from 'react';
import classnames from 'classnames/bind';
import classes from './clean-buttons.module.scss';
import { Link, LinkProps } from '../link';

export interface CleanButtonProps extends LinkProps {
  asLink?: boolean
}

export interface CleanGroupProps {

  /** Содержимое. */
  children?: React.ReactElement<CleanButtonProps> | React.ReactElement<CleanButtonProps>[]
}

const cx = classnames.bind(classes);

/**
 * Компонент группы прозрачных кнопок.
 * @param props Свойства.
 * @return Элемент.
 */
const CleanGroup: React.FC<CleanGroupProps> = ({ children }) => (
  <div className={cx('clean-group')}>
    {Children.toArray(children).map(
      item => isValidElement(item) && item.type === CleanButton
        ? item
        : null
    )}
  </div>
);

/**
 * Компонент прозрачной кнопки.
 * @param props Свойства. Поддерживаются свойства элементов button/a (зависит от того, передан ли asLink).
 * @param props.children Содержимое.
 * @param props.size Размер.
 * @param props.href Адрес ссылки.
 * @param props.asLink Нужно ли выводить кнопку как ссылку.
 * @return Элемент.
 */
const CleanButton = ({
  href,
  asLink = Boolean(href),
  ...restProps
}: CleanButtonProps) => (
  <Link
    pseudo={asLink}
    className={cx('clean-button')}
    href={href}
    {...restProps}
  />
);

export const Clean = {
  Group: CleanGroup,
  Button: CleanButton,
};
