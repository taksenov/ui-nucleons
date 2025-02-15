import React from 'react';
import { ArrowButton } from '..';
import { action } from '@storybook/addon-actions';

const sizes = ['l', 's'];

const directions = ['up', 'right', 'down', 'left'];

export default {
  title: 'desktop/ArrowButton',
  component: ArrowButton,
  parameters: {
    layout: 'padded',
  },
};

export const Primary = () => (
  <>
    {sizes.map(size => (
      <div key={size} style={{ marginBottom: 16 }}>
        <h3>Size: {size}</h3>
        {directions.map(direction => (
          <div key={direction} style={{ display: 'inline-block', paddingRight: 32 }}>
            <ArrowButton
              aria-label={direction}
              size={size as any}
              direction={direction as any}
              onClick={() => action('onClick')(`${size}, ${direction}`)}
            />
          </div>
        ))}
      </div>
    ))}
  </>
);

export const Disabled = () => (
  <>
    {sizes.map(size => (
      <div key={size} style={{ marginBottom: 16 }}>
        <h3>Size: {size}</h3>
        {directions.map(direction => (
          <div key={direction} style={{ display: 'inline-block', paddingRight: 32 }}>
            <ArrowButton
              disabled
              aria-label={direction}
              size={size as any}
              direction={direction as any}
              onClick={() => action('onClick')(`${size}, ${direction}`)}
            />
          </div>
        ))}
      </div>
    ))}
  </>
);
