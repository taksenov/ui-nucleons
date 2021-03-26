import React from 'react';
import { range } from 'lodash';
import classnames from 'classnames/bind';
import StarSVG from './star.svg';
import styles from './rating.scss';
import { composeClasses, getStarClass } from './utils';
import { Classes } from './types';

export interface Props {
  value: number
  count?: number
  starSize?: number,
  withHover?: boolean
  classes?: Classes
  onStarClick?: (index: number) => void
}

const DEFAULT_CLASSES: Classes = {
  rating: styles.rating,
  hoveredRating: styles['rating-can-be-hovered'],
  star: styles['rating-star'],
  emptyStar: styles['empty-star'],
  halfStar: styles['half-star'],
  fullStar: styles['full-star'],
};

const cx = classnames.bind(styles);

/**
 * Компонент рейтинга.
 * @param props Свойства компонента.
 * @param props.value Значение рейтинга.
 * @param props.count Общее количество звезд рейтинга.
 * @param props.starSizes Размеры звезд.
 * @param props.withHover С эффектом при наведении.
 * @param props.classes Пользовательские классы.
 * @param props.onStarClick Функция, вызываемая при клике на звезду.
 * @return Элемент.
 */
const Rating: React.FC<Props> = ({
  value,
  count = 5,
  starSize = 16,
  withHover,
  classes: classesProp = {},
  onStarClick,
}) => {
  const classes = composeClasses(DEFAULT_CLASSES, classesProp);

  return (
    <div className={cx(classes.rating, withHover && classes.hoveredRating)}>
      {range(count, 0).map(index => (
        <StarSVG
          key={index}
          className={getStarClass({ index, value, classes })}
          onClick={() => onStarClick && onStarClick(index)}
          width={starSize}
          height={starSize}
        />
      ))}
    </div>
  );
};

export default Rating;