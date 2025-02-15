import React from 'react';
import { act, Simulate } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Chips } from '..';

describe('Chips', () => {
  it('should renders correctly', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <Chips
        items={[
          { children: 'Ручка для пакета' },
          { children: 'Спортивные кружки' },
          { children: 'Пакеты пищевые' },
          { children: 'Пакеты для заморозки' },
          { children: 'Домашние животные' },
          { children: 'Дикие звери' },
          { children: 'Крафт пакеты' },
          { children: 'Интерьер' },
          { children: 'Зоотовары' },
        ]}
        onItemClick={spy}
        isItemChecked={item => item.children === 'Пакеты пищевые'}
      />
    );

    expect(wrapper).toMatchSnapshot();

    expect(spy).toBeCalledTimes(0);

    act(() => {
      Simulate.click(wrapper.find('a').at(4).getDOMNode());
    });
    wrapper.update();

    expect(spy).toBeCalledTimes(1);
  });

  it('should handle undefined "onItemClick" prop', () => {
    const wrapper = mount(
      <Chips
        items={[
          { children: 'Ручка для пакета' },
          { children: 'Спортивные кружки' },
          { children: 'Пакеты пищевые' },
        ]}
      />
    );

    act(() => {
      Simulate.click(wrapper.find('a').at(0).getDOMNode());
    });
    wrapper.update();
  });

  it('should handle items with "href" property', () => {
    const wrapper = mount(
      <Chips
        items={[
          { children: 'Ручка для пакета' },
          { children: 'Спортивные кружки' },
          { children: 'Пакеты пищевые' },
        ].map(item => ({ ...item, href: 'www.foo-bar.com' }))}
      />
    );

    act(() => {
      Simulate.click(wrapper.find('a').at(0).getDOMNode());
    });
    wrapper.update();
  });

  it('should render with cross', () => {
    const wrapper = mount(
      <Chips
        items={[
          { children: 'Ручка для пакета' },
          { children: 'Спортивные кружки' },
          { children: 'Пакеты пищевые' },
        ].map(item => ({ ...item, withCross: true }))}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should provide able to pass target props to anchor', () => {
    const wrapper = mount(
      <Chips
        items={[
          { href: 'https://www.foo.com', children: 'Foo', target: '_blank' },
          { href: 'https://www.bar.com', children: 'Bar', target: '_parent' },
        ]}
      />
    );

    expect(wrapper.find('a[data-testid="chips:item"]')).toHaveLength(2);
    expect(wrapper.find('a[data-testid="chips:item"]').at(0).prop('target')).toBe('_blank');
    expect(wrapper.find('a[data-testid="chips:item"]').at(1).prop('target')).toBe('_parent');
  });
});
