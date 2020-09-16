import React from 'react';
import { mount } from 'enzyme';
import NavBar from '..';
import ArrowLeftSVG from '../../icons/full-left-arrow.svg';
import CrossSVG from '../../icons/cross-big.svg';
import CartSVG from '../../icons/cart.svg';
import UserSVG from '../../icons/user.svg';

describe('<NavBar />', () => {
  it('should render just title and subtitle', () => {
    const wrapper = mount(
      <NavBar
        title='Hello'
        subtitle='World'
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render start link-button', () => {
    const wrapper = mount(
      <NavBar
        title='Очень очень очень длинный заголовок'
        subtitle='Очень очень очень очень длинный подзаголовок'
        buttons={{
          start: { text: 'Foo' },
        }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render end link-button', () => {
    const wrapper = mount(
      <NavBar
        title='Очень очень очень длинный заголовок'
        subtitle='Очень очень очень очень длинный подзаголовок'
        buttons={{
          end: { text: 'Bar' },
        }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render link-buttons', () => {
    const wrapper = mount(
      <NavBar
        title='Очень очень очень длинный заголовок'
        subtitle='Очень очень очень очень длинный подзаголовок'
        buttons={{
          start: { text: 'Foo' },
          end: { text: 'Bar' },
        }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render start icon-button', () => {
    const wrapper = mount(
      <NavBar
        title='Очень очень очень длинный заголовок'
        subtitle='Очень очень очень очень длинный подзаголовок'
        buttons={{
          start: { icon: ArrowLeftSVG },
        }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render end icon-button', () => {
    const wrapper = mount(
      <NavBar
        title='Очень очень очень длинный заголовок'
        subtitle='Очень очень очень очень длинный подзаголовок'
        buttons={{
          end: { icon: ArrowLeftSVG },
        }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render icon-buttons', () => {
    const wrapper = mount(
      <NavBar
        title='Очень очень очень длинный заголовок'
        subtitle='Очень очень очень очень длинный подзаголовок'
        buttons={{
          start: { icon: ArrowLeftSVG },
          end: { icon: CrossSVG },
        }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render four icon-buttons', () => {
    const wrapper = mount(
      <NavBar
        title='Очень очень очень длинный заголовок'
        subtitle='Очень очень очень очень длинный подзаголовок'
        buttons={{
          start: { icon: ArrowLeftSVG },
          startSecondary: { icon: CartSVG },
          end: { icon: CrossSVG },
          endSecondary: { icon: UserSVG },
        }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render mixed buttons', () => {
    const wrapper = mount(
      <NavBar
        title='Очень очень очень длинный заголовок'
        subtitle='Очень очень очень очень длинный подзаголовок'
        buttons={{
          start: { text: 'Foo' },
          end: { icon: CrossSVG },
        }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});