import React, { Component, Fragment, createRef } from 'react';
import Draggable from './draggable';
import NavButton from './nav-button';
import eq from 'lodash/fp/eq';
import inRange from 'lodash/inRange';
import isEqual from 'lodash/isEqual';
import size from 'lodash/size';
import boundsOf from '../helpers/bounds-of';
import Point from '../helpers/point';
import getRelativePos from '../helpers/get-relative-pos';
import findChildElement from '../helpers/find-child-element';
import withGlobalListeners from '../hoc/with-global-listeners';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import classes from './carousel.scss';

const CLONE_FACTOR = 3;
const cx = classnames.bind(classes);
const isAuto = eq('auto');

/**
 * Возвращает максимальный индекс списка.
 * @param {Array} list Список.
 * @return {number} Максимальный индекс.
 */
const maxIndexOf = list => {
  const listSize = size(list);
  return listSize > 0 ? listSize - 1 : 0;
};

/**
 * Компонент карусели.
 */
export class Carousel extends Component {
  /**
   * Конструктор компонента карусели.
   * @param {Object} props Свойства.
   */
  constructor (props) {
    const { items, infinite = true, targetIndex = 0 } = props;

    super(props);

    // state & data
    this.infinite = infinite;
    this.dragStartClient = Point();
    this.dragStartOffset = Point();
    this.currentIndex = inRange(targetIndex, size(items))
      ? targetIndex
      : 0;
    this.state = {
      currentOffset: 0,
      isAllItemsVisible: false,
    };

    // refs
    this.containerRef = createRef(); // для определения размеров списка элементов
    this.wrapperRef = createRef(); // для определения viewport'а карусели

    // bound methods
    this.initDragControl = this.initDragControl.bind(this);
    this.moveBackward = this.moveBackward.bind(this);
    this.moveForward = this.moveForward.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
  }

  /**
   * Возвращает элемент списка.
   * @param {*} item Элемент списка.
   * @param {number} index Индекс.
   * @return {ReactElement} Элемент списка.
   */
  static defaultRenderItem (item, index) {
    return (
      <div key={index}>
        {String(item)}
      </div>
    );
  }

  /**
   * Возвращает кнопку управления.
   * @param {Object} props Свойства кнопки.
   * @return {ReactElement} Кнопка управления.
   */
  static defaultRenderControl ({ canUse, onUse, ...restProps }) {
    return (
      <NavButton
        {...restProps}
        onClick={onUse}
        disabled={!canUse}
      />
    );
  }

  /**
   * Возвращает функцию для поиска наиболее отдаленного элемента карусели от стартовой границы viewport'а.
   * @return {Function} Функция для поиска наиболее отдаленного элемента.
   */
  static makeFurthestSiblingChecker ({
    vertical,
    viewport,
  }) {
    return vertical
      ? sibling => boundsOf(sibling).top >= viewport.top
      : sibling => boundsOf(sibling).left >= viewport.left;
  }

  /**
   * Возвращает функцию для поиска наиболее близкого элемента карусели к viewport'у.
   * @return {Function} Функция для поиска наиболее близкого элемента.
   */
  static makeNearestSiblingChecker ({
    viewport,
    vertical,
    backward,
  }) {
    const verticalBoundKey = backward ? 'bottom' : 'top';
    const horizontalBoundKey = backward ? 'right' : 'left';

    return vertical
      ? sibling => viewport.top < boundsOf(sibling)[verticalBoundKey]
      : sibling => viewport.left < boundsOf(sibling)[horizontalBoundKey];
  }

  /**
   * Выполняет подписку на глобальное событие "resize".
   * Запускает прокрутку до текущего элемента.
   * Обновляет информацию о состоянии отображения элементов.
   */
  componentDidMount () {
    const { addGlobalListener } = this.props;

    this.offWindowResize = addGlobalListener('resize', () => {
      this.toggleDragTransition(false);
      this.scrollToItem(undefined, { needTransition: false });
      this.updateItemsVisibility();
      this.toggleDragTransition(true);
    });

    this.scrollToItem(undefined, { needTransition: false });
    this.updateItemsVisibility();
  }

  /**
   * По необходимости обновляет индекс текущего элемента.
   * Обновляет информацию о состоянии отображения элементов.
   * @param {Object} prevProps Предыдущие свойства.
   */
  componentDidUpdate (prevProps) {
    const { targetIndex } = this.props;
    const { targetIndex: prevTargetIndex } = prevProps;

    if (targetIndex !== prevTargetIndex) {
      this.setCurrentIndex(targetIndex);
      this.toggleDragTransition(true);
    }

    this.updateItemsVisibility();
  }

  /**
   * Выполняет отписку от глобального события "resize".
   */
  componentWillUnmount () {
    this.offWindowResize();
  }

  /**
   * Обновляет информацию о состоянии отображения элементов.
   */
  updateItemsVisibility () {
    const isAllItemsVisible = this.isAllItemsVisible();

    if (isAllItemsVisible !== this.state.isAllItemsVisible) {
      this.setState({ isAllItemsVisible });
    }
  }

  /**
   * По возможности выполняет прокрутку карусели вперед.
   */
  moveForward () {
    const { step = 3 } = this.props;

    this.infinite
      ? this.moveInfinite(step, true)
      : this.moveForwardFinite(step);
  }

  /**
   * Выполняет конечную прокрутку карусели вперед.
   * @param {number} step На сколько элементов надо прокрутить карусель.
   */
  moveForwardFinite (step) {
    const { currentIndex } = this;
    const { current: containerEl } = this.containerRef;
    const newIndex = currentIndex + step;

    this.toggleDragTransition(true);
    this.setCurrentIndex(
      newIndex < size(containerEl.children)
        ? newIndex
        : maxIndexOf(containerEl.children)
    );
  }

  /**
   * По возможности выполняет прокрутку карусели назад.
   */
  moveBackward () {
    const { step = 3 } = this.props;

    this.infinite
      ? this.moveInfinite(step, false)
      : this.moveBackwardFinite(step);
  }

  /**
   * Выполняет конечную прокрутку карусели назад.
   * @param {number} step На сколько элементов надо прокрутить карусель.
   */
  moveBackwardFinite (step) {
    const { currentIndex } = this;
    const { vertical } = this.props;
    const { current: containerEl } = this.containerRef;

    const newIndex = findChildElement({
      target: containerEl,
      startIndex: currentIndex,
      defaultResult: currentIndex,
      increment: -1,

      // ищем элемент который находится ниже/правее чем верхняя/левая граница viewport'а
      isSuitable: Carousel.makeFurthestSiblingChecker({
        viewport: this.getViewport(),
        vertical,
      }),

      // при нахождении первого непрошедшего проверку останавливаем цикл
      needBreakLoop: passed => !passed,
    });

    this.toggleDragTransition(true);
    this.setCurrentIndex(
      newIndex !== -1 && newIndex - step >= 0
        ? newIndex - step
        : 0
    );
  }

  /**
   * Выполняет прокрутка в бесконечном режиме.
   * @param {number} step Количество элементов для прокрутки.
   * @param {boolean} forward Нужно выполнить прокрутку вперед?
   */
  moveInfinite (step, forward) {
    const { currentIndex } = this;
    const { currentOffset } = this.state;
    const { items, vertical } = this.props;
    const { current: containerEl } = this.containerRef;
    const itemsCount = size(items);

    if ((forward && currentIndex >= itemsCount) || (!forward && currentIndex < itemsCount)) {
      const itemsSize = containerEl[vertical ? 'scrollHeight' : 'scrollWidth'] / CLONE_FACTOR;
      const newOffset = currentOffset + (forward ? itemsSize : -itemsSize);
      const newIndex = currentIndex + (forward ? -itemsCount : itemsCount);

      this.setCurrentOffset(newOffset, { withStateUpdate: false });

      // отключаем плавность и смещаем карусель без видимых изменений
      this.toggleDragTransition(false);
      this.setCurrentIndex(newIndex, { needTransition: false });

      // включаем плавность и перемещаемся к следующему элементу
      this.toggleDragTransition(true);
      this.setCurrentIndex(this.currentIndex + (forward ? step : -step));
    } else {
      forward
        ? this.moveForwardFinite(step)
        : this.moveBackwardFinite(step);
    }
  }

  /**
   * Сохраняет смещение элементов карусели и позицию при захвате мышкой.
   * Отключает плавную прокрутку.
   * @param {import('./helpers/draggable-event').DraggableEvent} dragEvent Событие.
   */
  onDragStart (dragEvent) {
    this.saveDragStartData(dragEvent);
    this.toggleDragTransition(false);
  }

  /**
   * При необходимости запускает корректировку смещения.
   * @param {import('./helpers/draggable-event').DraggableEvent} dragEvent Событие.
   */
  onDrag (dragEvent) {
    this.infinite && this.correctInfiniteOffset(dragEvent);
  }

  /**
   * Корректирует смещение в бесконечном режиме.
   * @param {import('./helpers/draggable-event').DraggableEvent} dragEvent Событие.
   */
  correctInfiniteOffset (dragEvent) {
    const { vertical } = this.props;
    const { offset, client } = dragEvent;
    const { current: containerEl } = this.containerRef;
    const { dragStartClient } = this;
    const { forward, backward } = this.defineDirection(dragStartClient, client);
    const viewport = this.getViewport();

    const offsetValue = offset[vertical ? 'y' : 'x'];
    const lastItem = containerEl.lastElementChild;
    const lastItemStartBound = boundsOf(lastItem)[vertical ? 'top' : 'left'];
    const viewportStartBound = viewport[vertical ? 'top' : 'left'];
    const viewportEndBound = viewport[vertical ? 'bottom' : 'right'];
    const itemsSize = containerEl[vertical ? 'scrollHeight' : 'scrollWidth'] / CLONE_FACTOR;

    if (forward && lastItemStartBound < viewportEndBound) {
      const newOffset = offsetValue + itemsSize;

      dragEvent.preventDefault();
      this.setCurrentOffset(newOffset, { withStateUpdate: false });
      this.saveDragStartData(dragEvent);
    } else if (backward && viewportStartBound < this.findRealItemsStartBound()) {
      const newOffset = offsetValue - itemsSize;

      dragEvent.preventDefault();
      this.setCurrentOffset(newOffset, { withStateUpdate: false });
      this.saveDragStartData(dragEvent);
    }
  }

  /**
   * Определяет начальную границу (левую или верхнюю) списка не клонированных элементов.
   * @return {number} Начальную граница.
   */
  findRealItemsStartBound () {
    const { current: containerEl } = this.containerRef;
    let result = NaN;

    if (containerEl) {
      const { vertical, items } = this.props;
      const index = this.infinite ? size(items) : 0;
      const firstNotCloneItem = containerEl.children[index];

      if (firstNotCloneItem) {
        result = boundsOf(firstNotCloneItem)[vertical ? 'top' : 'left'];
      }
    }

    return result;
  }

  /**
   * Выполняет прокрутку к элементу, который наиболее близок к стартовой границе viewport'а.
   * @param {import('./helpers/draggable-event').DraggableEvent} dragEvent Событие.
   */
  onDragEnd ({ offset: endOffset, client: endClient }) {
    const {
      dragStartOffset: startOffset,
      dragStartClient: startClient,
    } = this;

    if (!isEqual(startOffset, endOffset)) {
      const { current: containerEl } = this.containerRef;
      const { vertical } = this.props;
      const { backward } = this.defineDirection(startClient, endClient);
      const lastIndex = maxIndexOf(containerEl.children);
      const edgeIndex = backward ? 0 : lastIndex;

      // ищем элемент, который находится ближе всего к начальной границе viewport'а
      const newIndex = findChildElement({
        target: containerEl,
        startIndex: backward ? lastIndex : 0,
        increment: backward ? -1 : +1,
        isSuitable: Carousel.makeNearestSiblingChecker({
          viewport: this.getViewport(),
          vertical,
          backward,
        }),

        // если прокрутили вперед, завершаем поиск когда нашли первый прошедший проверку, иначе - первый непрошедший
        needBreakLoop: passed => backward ? !passed : passed,
      });

      this.setCurrentIndex(newIndex !== -1 ? newIndex : edgeIndex);
      this.toggleDragTransition(true);
    }

    this.updateItemsVisibility();
  }

  /**
   * Определяет информацию о направлении между двумя точками.
   * @param {import('../helpers/point').Point} startPoint Точка.
   * @param {import('../helpers/point').Point} endPoint Точка.
   * @return {{ forward: boolean, backward: boolean }} Информация.
   */
  defineDirection (startPoint, endPoint) {
    const { vertical } = this.props;
    const key = vertical ? 'y' : 'x';
    const delta = startPoint[key] - endPoint[key];

    return { forward: delta > 0, backward: delta < 0 };
  }

  /**
   * Устанавливает индекс элемента к которому прокручена карусель.
   * @param {*} newIndex Индекс элемента к которому прокручена карусель.
   * @param {Object} options Опции.
   * @param {boolean} options.withScroll Нужна ли прокрутка.
   * @param {boolean} options.needTransition Нужна ли анимация при прокрутке.
   */
  setCurrentIndex (newIndex, { withScroll = true, needTransition = true } = {}) {
    this.currentIndex = newIndex;
    withScroll && this.scrollToItem(newIndex, { needTransition });
  }

  /**
   * Прокручивает галерею к заданному элементу по индексу.
   * @param {number} [targetIndex=this.state.currentIndex] Индекс.
   * @param {boolean} [needTransition=true] Нужна ли плавная анимация прокрутки.
   */
  scrollToItem (
    targetIndex = this.currentIndex,
    { needTransition = true } = {}
  ) {
    const { current: containerEl } = this.containerRef;
    const targetItemEl = containerEl.children[targetIndex];

    if (targetItemEl) {
      this.toggleDragTransition(needTransition);

      if (this.isAllItemsVisible()) {
        this.setCurrentOffset(0);
      } else {
        const { vertical } = this.props;
        const viewport = this.getViewport();
        const targetItemPos = getRelativePos(targetItemEl);
        const viewportEndBound = vertical
          ? viewport.bottom
          : viewport.right;
        const nextItemsEndBound = vertical
          ? viewport.top + containerEl.scrollHeight - targetItemPos.y
          : viewport.left + containerEl.scrollWidth - targetItemPos.x;

        if (nextItemsEndBound >= viewportEndBound) {
          const itemBound = vertical
            ? targetItemPos.y
            : targetItemPos.x;
          this.setCurrentOffset(-itemBound);
        } else {
          const maxItemsEndBound = vertical
            ? viewport.top + containerEl.scrollHeight
            : viewport.left + containerEl.scrollWidth;
          this.setCurrentOffset(viewportEndBound - maxItemsEndBound);
        }
      }
    }
  }

  /**
   * Определяет, видны ли все элементы галереи.
   * @return {boolean} Видны ли все элементы галереи.
   */
  isAllItemsVisible () {
    const listSize = this.getListSize();
    const viewportSize = this.getViewportSize();

    return Math.round(viewportSize) >= listSize;
  }

  /**
   * Определяет минимально возможное смещение списка элементов карусели.
   * @return {number} Минимально возможное смещение.
   */
  defineMinOffset () {
    const { vertical } = this.props;
    const { current: containerEl } = this.containerRef;
    let minOffset = NaN;

    if (containerEl) {
      const viewport = this.getViewport();
      const viewportEndBound = vertical
        ? viewport.bottom
        : viewport.right;
      const maxItemsEndBound = vertical
        ? viewport.top + containerEl.scrollHeight
        : viewport.left + containerEl.scrollWidth;
      minOffset = viewportEndBound - maxItemsEndBound;
    }

    return minOffset;
  }

  /**
   * Возвращает длину/ширину списка элементов (в зависимости от ориентации карусели).
   * @return {number} Длина/ширина списка элементов.
   */
  getListSize () {
    const { vertical } = this.props;
    const { current: containerEl } = this.containerRef;
    const sizeKey = vertical
      ? 'scrollHeight'
      : 'scrollWidth';

    return containerEl
      ? containerEl[sizeKey]
      : NaN;
  }

  /**
   * Возвращает длину/ширину области видимости карусели (в зависимости от ориентации).
   * @return {number} Длина/ширина области видимости.
   */
  getViewportSize () {
    const { vertical } = this.props;
    return this.getViewport()[vertical ? 'height' : 'width'];
  }

  /**
   * Возвращает данные прямоугольной области видимости карусели.
   * @return {DOMRect} Данные прямоугольной области видимости карусели.
   */
  getViewport () {
    return boundsOf(this.wrapperRef.current);
  }

  /**
   * Сохраняет смещение карусели и позицию из события при старте захвата.
   * @param {Object} dragEvent Нестандартное событие из компонента Draggable.
   * @param {Object} dragEvent.offset Смещение.
   */
  saveDragStartData ({ offset, client }) {
    this.dragStartOffset = offset;
    this.dragStartClient = client;
  }

  /**
   * Сохраняет в состоянии смещение карусели.
   * @param {number} newOffset Смещение.
   * @param {Object} options Опции.
   * @param {boolean} [options.withStateUpdate=true] Опции.
   */
  setCurrentOffset (newOffset, { withStateUpdate = true } = {}) {
    const { vertical } = this.props;

    this.setDragOffset(
      !vertical ? newOffset : 0,
      vertical ? newOffset : 0
    );

    withStateUpdate && this.setState({ currentOffset: newOffset });
  }

  /**
   * Получает управление от Draggable.
   * @param {Object} control Функции управления.
   */
  initDragControl ({ setOffset, toggleTransition }) {
    this.toggleDragTransition = toggleTransition;
    this.setDragOffset = setOffset;
  }

  /**
   * Возвращает компонент.
   * @inheritDoc
   */
  render () {
    const { currentOffset, isAllItemsVisible } = this.state;
    const {
      draggable = 'auto',
      vertical,
      containerProps = {},
      viewportElementProps = {},
      withControls = 'auto',
      renderControl = Carousel.defaultRenderControl,
    } = this.props;
    const canDrag = (isAuto(draggable) && !isAllItemsVisible) || draggable === true;
    const needShowControls = (isAuto(withControls) && !isAllItemsVisible) || withControls === true;

    return (
      <div
        {...containerProps}
        className={cx(
          'carousel-wrapper',
          containerProps.className
        )}
      >
        <Draggable
          active={canDrag}
          axis={vertical ? 'y' : 'x'}
          transitionDuration={320}
          containerProps={{
            ...viewportElementProps,
            ref: this.wrapperRef,
            className: cx(
              'full-size',
              viewportElementProps.className
            ),
          }}
          onDragStart={this.onDragStart}
          onDrag={this.onDrag}
          onDragEnd={this.onDragEnd}
          children={(
            <div
              className={cx([
                'carousel-items-container',
                vertical && 'vertical',
              ])}
              ref={this.containerRef}
              children={this.renderItems()}
            />
          )}
          initControl={this.initDragControl}
        />
        {needShowControls && (
          <Fragment>
            {renderControl({
              type: 'backward',
              onUse: this.moveBackward,
              canUse: this.infinite || currentOffset < 0,
              vertical,
            })}
            {renderControl({
              type: 'forward',
              onUse: this.moveForward,
              canUse: this.infinite || currentOffset > this.defineMinOffset(),
              vertical,
            })}
          </Fragment>
        )}
      </div>
    );
  }

  /**
   * Выводит список элементов карусели.
   * @return {Array<ReactElement>} Список элементов карусели.
   */
  renderItems () {
    const { isAllItemsVisible } = this.state;
    const { items, renderItem = Carousel.defaultRenderItem } = this.props;

    const needClone = this.infinite && !isAllItemsVisible;
    const limit = size(items) * (needClone ? CLONE_FACTOR : 1);
    const partSize = needClone ? Math.round(limit / CLONE_FACTOR) : limit;
    const result = [];

    for (let realIndex = 0; realIndex < limit; realIndex++) {
      const index = realIndex % partSize;
      result.push(renderItem(items[index], realIndex));
    }

    return result;
  }
}

Carousel.propTypes = {
  /**
   * Шаг прокрутки. По умолчанию 3.
   */
  step: PropTypes.number,

  /**
   * Данные элементов списка.
   */
  items: PropTypes.array,

  /**
   * Индекс элемента к которому нужно прокрутиться. По умолчанию 0.
   */
  targetIndex: PropTypes.number,

  /**
   * Определяет ориентацию карусели. По умолчанию false.
   */
  vertical: PropTypes.bool,

  /**
   * Определяет, можно ли перетаскивать мышью.
   * По умолчанию автоматически определяется в зависимости от того, влезли все элементы или нет.
   */
  draggable: PropTypes.oneOf([true, false, 'auto']),

  /**
   * Определяет режим карусели: бесконечный или нет.
   * По умолчанию включен бесконечный.
   */
  infinite: PropTypes.bool,

  /**
   * Определяет, нужно ли показывать кнопки прокрутки.
   * По умолчанию автоматически определяется в зависимости от того, влезли все элементы или нет.
   */
  withControls: PropTypes.oneOf([true, false, 'auto']),

  /**
   * Определяет, как вывести элемент. По умолчанию Выведет div с приведенным к строке элементом.
   */
  renderItem: PropTypes.func,

  /**
   * Определяет, как вывести кнопку прокрутки. По умолчанию выведет стандартную кнопку.
   */
  renderControl: PropTypes.func,

  /**
   * Свойства элемента контейнера. По умолчанию пустой объект.
   */
  containerProps: PropTypes.object,

  /**
   * Свойства элемента формирующего viewport карусели. По умолчанию пустой объект.
   */
  viewportElementProps: PropTypes.object,

  /**
   * Должна выполнить подписку на глобальное событие и вернуть функцию отписки.
   */
  addGlobalListener: PropTypes.func,
};

export default withGlobalListeners(Carousel);