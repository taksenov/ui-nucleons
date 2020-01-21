import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { BasePagination, BUTTON_CONTENTS } from '../base-pagination';
import { PageButton } from '../page-button';

describe('<BasePagination />', () => {
  it('should render without props', () => {
    const wrapper = mount(
      <BasePagination />
    );

    expect(wrapper).toMatchSnapshot();
  });
  it('should handle "total" and "current" props', () => {
    const wrapper = mount(
      <BasePagination
        current={1}
        total={100}
      />
    );

    expect(wrapper.find(PageButton).at(0).prop('children')).toBe(1);
    expect(wrapper.find(PageButton).at(0).prop('selected')).toBe(true);
    expect(wrapper.find(PageButton).at(1).prop('children')).toBe(2);
    expect(wrapper.find(PageButton).at(1).prop('selected')).toBe(false);

    act(() => {
      wrapper.setProps({ current: 2 });
    });
    wrapper.update();

    expect(wrapper.find(PageButton).at(0).prop('children')).toBe(BUTTON_CONTENTS.prev);

    expect(wrapper.find(PageButton).at(1).prop('children')).toBe(1);
    expect(wrapper.find(PageButton).at(1).prop('selected')).toBe(false);

    expect(wrapper.find(PageButton).at(2).prop('children')).toBe(2);
    expect(wrapper.find(PageButton).at(2).prop('selected')).toBe(true);

    expect(wrapper).toMatchSnapshot();
  });
  it('should handle "onButtonClick" prop', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <BasePagination
        current={3}
        total={100}
        onButtonClick={spy}
      />
    );

    // arrow prev
    expect(wrapper.find(PageButton).at(0).prop('children')).toBe(BUTTON_CONTENTS.prev);
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.find(PageButton).at(0).prop('onClick')();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe(2);

    expect(wrapper.find(PageButton).at(1).prop('children')).toBe(1);
    wrapper.find(PageButton).at(1).prop('onClick')();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1][0]).toBe(1);

    expect(wrapper.find(PageButton).at(2).prop('children')).toBe(2);
    wrapper.find(PageButton).at(2).prop('onClick')();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls[2][0]).toBe(2);

    // last number
    expect(wrapper.find(PageButton).at(8).prop('children')).toBe(100);
    wrapper.find(PageButton).at(8).prop('onClick')();
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls[3][0]).toBe(100);

    // arrow next
    expect(wrapper.find(PageButton).at(9).prop('children')).toBe(BUTTON_CONTENTS.next);
    wrapper.find(PageButton).at(9).prop('onClick')();
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy.mock.calls[4][0]).toBe(4);
    expect(wrapper).toMatchSnapshot();
  });
});