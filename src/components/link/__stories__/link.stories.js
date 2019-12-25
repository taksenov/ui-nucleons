import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { LINK_COLORS } from '../create-link-style';
import Link from '../';

const padding = {
  padding: '10px',
};
const grayBackground = {
  ...padding,
  background: '#d1d2d6',
  display: 'inline-block',
};
const marginRight = {
  marginRight: '15px',
};

storiesOf('Link', module)
  .add('without underline', () => (
    <div>
      <div style={grayBackground}>
        {LINK_COLORS.map(color => (
          <span
            style={marginRight}
            key={color}
          >
            <Link color={color}>Ссылка</Link>
          </span>
        ))}
      </div>
      <div style={padding}>
        {LINK_COLORS.map(color => (
          <span
            style={marginRight}
            key={color}
          >
            <Link color={color}>Ссылка</Link>
          </span>
        ))}
      </div>
    </div>
  ))
  .add('with underline', () => (
    <div>
      <div style={grayBackground}>
        {LINK_COLORS.map(color => (
          <span
            style={marginRight}
            key={color}
          >
            <Link color={color} underlined>Ссылка</Link>
          </span>
        ))}
      </div>
      <div style={padding}>
        {LINK_COLORS.map(color => (
          <span
            style={marginRight}
            key={color}
          >
            <Link color={color} underlined>Ссылка</Link>
          </span>
        ))}
      </div>
    </div>
  ))
  .add('with underline and pseudo', () => (
    <div>
      <div style={grayBackground}>
        {LINK_COLORS.map(color => (
          <span
            style={marginRight}
            key={color}
          >
            <Link color={color} underlined pseudo>Ссылка</Link>
          </span>
        ))}
      </div>
      <div style={padding}>
        {LINK_COLORS.map(color => (
          <span
            style={marginRight}
            key={color}
          >
            <Link color={color} underlined pseudo>Ссылка</Link>
          </span>
        ))}
      </div>
    </div>
  ))
  .add('with disable hover', () => (
    <div>
      <div style={grayBackground}>
        {LINK_COLORS.map(color => (
          <span
            style={marginRight}
            key={color}
          >
            <Link color={color} disableHoverEffect>Ссылка</Link>
          </span>
        ))}
      </div>
      <div style={padding}>
        {LINK_COLORS.map(color => (
          <span
            style={marginRight}
            key={color}
          >
            <Link color={color} disableHoverEffect>Ссылка</Link>
          </span>
        ))}
      </div>
    </div>
  ))
  .add('with href and target', () => (
    <div>
      <Link
        underlined
        href='https://www.sima-land.ru/prazdniki/'
        style={marginRight}
      >
        Link without target
      </Link>
      <Link
        underlined
        external
        href='https://www.sima-land.ru/prazdniki/'
        style={marginRight}
      >
        External link without target
      </Link>
      <Link
        underlined
        href='https://www.sima-land.ru/prazdniki/'
        target='_blank'
        style={marginRight}
      >
        Blank target
      </Link>
      <Link
        underlined
        href='https://www.sima-land.ru/prazdniki/'
        target='_self'
        style={marginRight}
      >
        Self target
      </Link>
    </div>
  ))
  .add('with actions', () => (
    <div>
      <Link
        underlined
        onClick={action('click')}
        style={marginRight}
      >
        Click
      </Link>
      <Link
        underlined
        onMouseEnter={action('mouse enter')}
        style={marginRight}
      >
        Mouse enter
      </Link>
      <Link
        underlined
        onMouseLeave={action('mouse leave')}
      >
        Mouse leave
      </Link>
    </div>
  ));
