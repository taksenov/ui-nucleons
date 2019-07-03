import React from 'react';
import PositioningPopup, { defaultArrowProps } from '../';
import { shallow, mount } from 'enzyme';

let popup;

describe('<PositioningPopup />', () => {
  it('renders correctly', () => {
    popup = shallow(<PositioningPopup withArrow />);
    expect(popup).toMatchSnapshot();
    popup = shallow(<PositioningPopup isOpen opener={document.createElement('div')} />);
    expect(popup).toMatchSnapshot();
    popup = shallow(<PositioningPopup withArrow isOpen basePopupClass='animation' />);
    expect(popup).toMatchSnapshot();
  });

  it('has correct ref', () => {
    popup = mount(<PositioningPopup withArrow isOpen opener={document.createElement('div')} />);
    expect(popup.instance().popup instanceof HTMLDivElement).toBeTruthy();
  });

  it('method getPopupPosition return correct values', () => {
    popup = mount(<PositioningPopup withArrow isOpen opener={document.createElement('div')} />);
    popup.setProps({ parentWidth: 500 });
    let popupPosition = popup.instance().getPopupPosition({ left: 10 }, 20);
    expect(popupPosition).toEqual({ left: '20px', top: '100%', width: 20 });
    popupPosition = popup.instance().getPopupPosition({ left: 500 }, 200);
    expect(popupPosition).toEqual({ left: '280px', top: '100%', width: 200 });
    popup.setProps({ positioningMargin: 0 });
    popupPosition = popup.instance().getPopupPosition({ left: 0 }, 100);
    expect(popupPosition).toEqual({ left: '0px', top: '100%', width: 100 });
  });

  it('method getArrowProps return correct values', () => {
    const arrowPosition = {
      left: '10px',
      top: '5px',
    };
    popup = shallow(<PositioningPopup withArrow isOpen arrowProps={{ position: arrowPosition }} />);
    let arrowProps = popup.instance().getArrowProps({}, {});
    expect(arrowProps).toEqual({ ...defaultArrowProps, ...{ position: arrowPosition } });
    popup.instance().popup = {};
    popup.instance().popup.offsetWidth = 200;
    popup.setProps({ arrowProps: {} });
    const bounds = { left: 5, width: 200 };
    const popupPosition = { left: '50px' };
    arrowProps = popup.instance().getArrowProps(bounds, popupPosition);
    expect(arrowProps).toEqual({ ...defaultArrowProps, ...{ position: { left: '45px' } } });
    expect(Object.keys(arrowProps)).toEqual(Object.keys(defaultArrowProps));
    popup.setProps({ arrowProps: {} });
    arrowProps = popup.instance().getArrowProps({ left: 100, width: 20 }, { left: '50px', width: 40 });
    expect(arrowProps).toEqual({ ...defaultArrowProps, ...{ position: { left: '15px' } } });
  });
});