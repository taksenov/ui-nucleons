import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { DotNav } from '..';
import { times } from 'lodash';

describe('<DotsNav />', () => {
  it('should renders without props', () => {
    const wrapper = mount(
      <DotNav />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should handle props', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <DotNav
        current={2}
        total={12}
        onSelect={spy}
      />
    );

    expect(wrapper).toMatchSnapshot();

    expect(spy).toBeCalledTimes(0);

    act(() => {
      wrapper.find('.item').at(5).simulate('click');
    });
    wrapper.update();

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(5);
  });

  it('should handle "current" change', () => {
    const wrapper = mount(
      <DotNav
        current={0}
        total={9}
      />
    );

    expect(wrapper).toMatchSnapshot();

    times(9).forEach(index => {
      act(() => {
        wrapper.setProps({ current: index });
      });
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
    });

    times(9).reverse().forEach(index => {
      act(() => {
        wrapper.setProps({ current: index });
      });
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
    });
  });
});
