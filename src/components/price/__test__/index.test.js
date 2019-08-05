import React from 'react';
import Price from '../';
import { shallow } from 'enzyme';

let price;

describe('<Price />', () => {
  let props = {
    value: 100.578,
    currencySign: 'RUB',
    beforePrice: true,
    withFractionalPart: true,
  };

  it('renders correctly', () => {
    price = shallow(<Price {...props} />);
    expect(price).toMatchSnapshot();
    props = { value: 100, currencyGrapheme: '$' };
    price = shallow(<Price {...props} />);
    expect(price).toMatchSnapshot();
    props = {
      value: 100,
      currencyGrapheme: '€',
      withFractionalPart: true,
      boldIntegerPart: true,
      fractionalAtTop: true,
    };
    price = shallow(<Price {...props} />);
    expect(price).toMatchSnapshot();
    props = {
      value: 100,
      className: 'test',
      currencyGrapheme: '₽',
      currencyGraphemeClass: 'currency-class',
      fractionalClass: 'fractional-class',
      withFractionalPart: true,
      fractionalInSuper: true,
    };
    price = shallow(<Price {...props} />);
    expect(price.prop('className')).toEqual('price test');
    expect(price.find('span').at(1).prop('className')).toEqual('grapheme currency-class');
    expect(price.find('sup').prop('className')).toEqual('fractional-class');
  });

  it('should render currency grapheme with non-breaking space at correct place', () => {
    props = { value: 100, className: 'test', currencyGrapheme: '₽', beforePrice: true };
    price = shallow(<Price {...props} />);
    const grapheme = price.find({ className: 'grapheme' });
    expect(grapheme).toHaveLength(1);
    expect(grapheme.text()).toEqual('₽\u00A0');
    price.setProps({ beforePrice: false });
    expect(price.find({ className: 'grapheme' }).text()).toEqual('\u00A0₽');
  });

  it('should render fractal part correctly', () => {
    props = { value: 100, currencyGrapheme: '₽', withFractionalPart: true, fractionalInSuper: true };
    price = shallow(<Price {...props} />);
    expect(price.find('sup')).toHaveLength(1);
    price.setProps({ fractionalInSuper: false });
    expect(price.find('sup')).toHaveLength(0);
  });
});
