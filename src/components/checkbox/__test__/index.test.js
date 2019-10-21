import React from 'react';
import { mount, shallow } from 'enzyme';
import Checkbox from '../index';

describe('<Checkbox />', () => {
  it('should render without props', () => {
    const wrapper = mount(<Checkbox />);
    expect(wrapper.find('input')).toHaveLength(1);
    expect(wrapper.find('input').prop('type')).toBe('checkbox');
  });
  it('should handle "id" property', () => {
    const wrapper = mount(
      <Checkbox
        id='test-checkbox'
      />
    );
    expect(wrapper.find('input').prop('id')).toBe('test-checkbox');
  });
  it('should handle "onChange" property', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <Checkbox
        onChange={spy}
      />
    );
    expect(spy).toHaveBeenCalledTimes(0);

    wrapper.find('input').simulate('change');
    expect(spy).toHaveBeenCalledTimes(1);

    wrapper.setProps({ onChange: null });
    expect(() => wrapper.find('input').simulate('change')).not.toThrow();
  });
  it('should renders correctly with props', () => {
    const spy = jest.fn();
    const wrapper = shallow(
      <Checkbox
        checked
        onChange={spy}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.checkbox-container.error')).toHaveLength(0);
  });
});