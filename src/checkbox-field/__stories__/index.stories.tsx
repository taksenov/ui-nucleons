import React from 'react';
import { CheckboxField } from '..';

export default {
  title: 'common/CheckboxField',
  component: CheckboxField,
  parameters: {
    layout: 'padded',
  },
};

export const Primary = () => (
  <>
    <h3>Just with label</h3>
    <div>
      <CheckboxField label='Оставить отзыв анонимно' />
    </div>

    <h3>With label, info and error</h3>
    <div>
      <CheckboxField
        label='Оставить отзыв анонимно'
        info='По умолчанию отзыв будет оставлен от вашего имени'
        error='Тестовая ошибка'
      />
    </div>

    <h3>A lot of text</h3>
    <div style={{ maxWidth: 240 }}>
      <CheckboxField
        label={`
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Expedita ipsum nisi nobis ratione.
        `.trim()}
        info={`
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Expedita ipsum nisi nobis ratione.
        `.trim()}
        error={`
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Expedita ipsum nisi nobis ratione.
        `.trim()}
      />
    </div>
  </>
);
