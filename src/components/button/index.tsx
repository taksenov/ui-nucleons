import React, { forwardRef } from 'react';
import { always, cond, eq, stubTrue } from 'lodash/fp';
import classnames from 'classnames/bind';
import classes from './button.scss';

type Size = 'small' | 'medium'

type ViewType = 'primary' | 'secondary'

type IconPosition = 'start' | 'end';

interface CustomProps<T extends 'button' | 'link' | 'container'> {
  size?: Size
  actionType?: ViewType
  iconPosition?: IconPosition
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  appearance?: T
}

export type Props = (
  CustomProps<'button'> & JSX.IntrinsicElements['button']
  | CustomProps<'link'> & JSX.IntrinsicElements['a']
  | CustomProps<'container'> & JSX.IntrinsicElements['div']
)

const cx = classnames.bind(classes);

/**
 * Возвращает компонент кнопки.
 * @param props Свойства.
 * @param props.children Содержимое.
 * @param props.className CSS-класс.
 * @param props.disabled Отключена ли кнопка.
 * @param props.actionType Определяет внешний вид кнопки.
 * @param props.appearance Определяет тип корневого элемента.
 * @param props.size Определяет размер.
 * @param props.icon Иконка.
 * @param props.iconPosition Положение иконки.
 * @return Компонент кнопки.
 */
const Button = forwardRef<any, Props>(function Button ({
  children,
  className,
  actionType = 'primary',
  appearance = 'button',
  size = 'medium',
  icon: Icon,
  iconPosition = 'start',
  ...restProps
}, ref) {
  const [Element, moreProps] = resolveAppearance(appearance);

  const readyClassName = computeClassName({
    className,
    size,
    actionType,
    withIcon: Boolean(Icon),
    withContent: Boolean(children) && children !== 0,
    iconPosition,
  });

  return (
    <Element
      {...restProps as any}
      {...moreProps as any}
      ref={ref}
      className={readyClassName}
      children={(
        <>
          {Icon && iconPosition === 'start' && (
            <Icon
              width={24}
              height={24}
              className={cx('icon', children && 'icon-start')}
            />
          )}
          {children}
          {Icon && iconPosition === 'end' && (
            <Icon
              width={24}
              height={24}
              className={cx('icon', children && 'icon-end')}
            />
          )}
        </>
      )}
    />
  );
});

/**
 * Возвращает строку с классами для стилизации кнопки.
 * @param props Опции.
 * @param props.actionType Определяет внешний вид кнопки.
 * @param props.size Определяет размер.
 * @param props.iconPosition Положение иконки.
 * @param props.withIcon Показывать ли иконку.
 * @param props.withContent Есть ли контент.
 * @param props.className Дополнительный класс.
 * @return Строка с классами.
 */
export const computeClassName = ({
  size,
  actionType,
  iconPosition,
  withIcon,
  withContent,
  className,
}: {
  size: Size
  actionType: ViewType
  iconPosition: IconPosition
  withIcon: boolean
  withContent: boolean
  className?: string
}) => cx([
  className,
  'button-base',
  actionType === 'secondary' ? 'button-secondary' : 'button-primary',
  size === 'small' && 'button-small',
  size === 'medium' && 'button-medium',
  withContent && !withIcon && `text-button-${size}`,
  withContent && withIcon && `button-${size}-with-${iconPosition}-icon`,
]);

/**
 * Возвращает кортеж с именем элемента и свойствами компонента по ключу.
 * @param appearance Ключ.
 * @return Кортеж с именем элемента и свойствами.
 */
export const resolveAppearance = cond<
'button' | 'link' | 'container',
['button' | 'div' | 'a', null | { role: 'button' }]
>([
  [eq('link'), always(['a', null])],
  [eq('container'), always(['div', { role: 'button' }])],
  [stubTrue, always(['button', null])],
]);

export default Button;