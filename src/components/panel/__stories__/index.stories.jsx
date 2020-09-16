import React from 'react';
import { storiesOf } from '@storybook/react';
import Panel from '../';
import { marginBottom, marginRight } from '../../styling/sizes';
import infoSVG from '../../icons/information.svg';

const variants = [
  { color: 'gray4' },
  { color: 'additional-red', contentColor: 'white' },
  { color: 'additional-teal', contentColor: 'white' },
  { color: 'additional-yellow' },
];

const longText = [
  'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
  'Qui, dolorum? Voluptatibus ea blanditiis accusamus error',
  'accusantium beatae eum ratione aperiam temporibus magni',
  'non ipsum maiores officia nisi est dignissimos provident?',
].join(' ');

const markup = 'Lorem <i>ipsum</i> <b>dolor</b> sit.';

storiesOf('Panel', module)
  .add('Variants', () => (
    <>
      <h3>Inline</h3>
      {variants.map((props, index) => (
        <Panel key={index} {...props} inline className={marginRight(4)}>
          Lorem ipsum
        </Panel>
      ))}

      <h3>Inline (with icon)</h3>
      {variants.map((props, index) => (
        <Panel key={index} {...props} inline className={[marginRight(4)]} icon={infoSVG}>
          Lorem ipsum
        </Panel>
      ))}

      <h3>Inline (with icon and markup)</h3>
      {variants.map((props, index) => (
        <Panel
          key={index}
          {...props}
          inline
          className={[marginRight(4)]}
          icon={infoSVG}
          html={markup}
        />
      ))}

      <h3>Block</h3>
      {variants.map((props, index) => (
        <Panel key={index} {...props} className={marginBottom(5)}>
          {longText}
        </Panel>
      ))}

      <h3>Block (with icon)</h3>
      {variants.map((props, index) => (
        <Panel key={index} {...props} className={marginBottom(5)} icon={infoSVG}>
          {longText}
        </Panel>
      ))}

      <h3>Block (with icon and markup)</h3>
      {variants.map((props, index) => (
        <Panel
          key={index}
          {...props}
          className={marginBottom(5)}
          icon={infoSVG}
          html={markup}
        />
      ))}
    </>
  ));