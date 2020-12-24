import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import TextField from '../index';
import Icon from '../../icon';
import classes from './stories.scss';

const baseProps = { className: classes['full-width'] };

const stateProps = {
  default: {},
  disabled: { disabled: true },
  failed: { failed: true },
  focused: { focused: true },
};

const desktopSizes = ['xs', 's', 'l'];

const longValue = [
  'Lorem ipsum dolor sit amet consectetur,',
  'adipisicing elit. Distinctio maxime at tempora',
  'adipisci placeat odio omnis laudantium cumque.',
  'Omnis, accusamus?',
].join(' \n');

const testValues = ['test', 123, '', null, undefined];

const Demo = ({ children }) => (
  <div style={{ padding: 32 }}>{children}</div>
);

storiesOf('TextField', module)
  .add('Default', () => (
    <Demo>
      <h2>Desktop</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {Object.entries(stateProps).map(([stateName, props]) => (
          <div style={{ flexGrow: '1', marginRight: 16 }} key={stateName}>
            <h4 style={{ textTransform: 'capitalize' }}>{stateName}</h4>
            {desktopSizes.map(sizeName => (
              <div style={{ marginTop: 24 }} key={sizeName}>
                <h5 style={{ textTransform: 'uppercase' }}>Size: {sizeName}</h5>
                <TextField
                  {...baseProps}
                  {...props}
                  label='Label'
                  placeholder='Placeholder'
                  size={sizeName}
                  defaultValue='Text'
                  variant='desktop'
                  caption='Caption'
                  endAdornment={(
                    <Icon
                      size={16}
                    />
                  )}
                />
                {sizeName === 'l' && (
                  <>
                    <div style={{ height: 32 }} />
                    <TextField
                      {...baseProps}
                      {...props}
                      size={sizeName}
                      placeholder='Placeholder'
                      defaultValue='Text'
                      variant='desktop'
                      caption='Caption'
                      endAdornment={(
                        <Icon
                          size={16}
                        />
                      )}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 32 }}>Mobile</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
        {Object.entries(stateProps).map(([stateName, props]) => (
          <div style={{ flexGrow: 1, marginRight: 16 }} key={stateName}>
            <h4 style={{ textTransform: 'capitalize' }}>{stateName}</h4>
            <TextField
              {...baseProps}
              {...props}
              label='Label'
              placeholder='Placeholder'
              defaultValue='Text'
              variant='mobile'
              caption='Caption'
              endAdornment={(
                <Icon
                  size={16}
                />
              )}
            />
            <div style={{ height: 32 }} />
            <TextField
              {...baseProps}
              {...props}
              placeholder='Placeholder'
              defaultValue='Text'
              variant='mobile'
              caption='Caption'
              endAdornment={(
                <Icon
                  size={16}
                />
              )}
            />
          </div>
        ))}
      </div>
    </Demo>
  ))
  .add('Multiline', () => (
    <Demo>
      <h2>Desktop</h2>
      <TextField
        {...baseProps}
        defaultValue={longValue}
        multiline
        label='Label'
        caption='Caption'
        placeholder='Placeholder'
      />
      <div style={{ height: 32 }} />
      <TextField
        {...baseProps}
        defaultValue={longValue}
        multiline
        caption='Caption'
        placeholder='Placeholder'
      />

      <h2>Mobile</h2>
      <TextField
        {...baseProps}
        defaultValue={longValue}
        multiline
        label='Label'
        caption='Caption'
        placeholder='Placeholder'
        variant='mobile'
      />
      <div style={{ height: 32 }} />
      <TextField
        {...baseProps}
        defaultValue={longValue}
        multiline
        caption='Caption'
        placeholder='Placeholder'
        variant='mobile'
      />
    </Demo>
  ))
  .add('Different values', () => testValues.map((testValue, index) => (
    <Demo key={index}>
      <h3>Значение <code>value</code>: {String(testValue) || JSON.stringify(testValue)}</h3>
      <TextField
        {...baseProps}
        label='Label'
        defaultValue={testValue}
      />
    </Demo>
  )))
  .add('Rounds', () => (
    <Demo>
      <h2>Скругления</h2>
      <p>Их можно задавать только для варианта <code>desktop</code>:</p>
      {[
        'none',
        'all',
        'top',
        'left',
        'bottom',
        'right',
        'bottomLeft',
        'bottomRight',
        'topLeft',
        'topRight',
      ].map(variant => (
        <div style={{ marginBottom: 32 }} key={variant}>
          <TextField
            {...baseProps}
            label={`rounds="${variant}"`}
            rounds={variant}
          />
        </div>
      ))}
    </Demo>
  ))
  .add('Rest placeholder', () => {
    const [value, setValue] = useState('');

    return (
      <Demo>
        <h3>Введите 10 цифр</h3>
        <TextField
          value={value}
          label='Label'
          onChange={e => setValue(e.target.value.slice(0, 10))}
          restPlaceholder={'9'.repeat(10).slice(value.length)}
          style={{ width: 240 }}
        />
        <div style={{ height: 24 }} />
        <TextField
          variant='mobile'
          label='Label'
          value={value}
          onChange={e => setValue(e.target.value.slice(0, 10))}
          restPlaceholder={'9'.repeat(10).slice(value.length)}
          style={{ width: 240 }}
        />
      </Demo>
    );
  })
  .add('service: Value prop change', () => {
    const [value, setValue] = useState('');

    return (
      <Demo>
        <p>
          Label должен подниматься и опускаться в зависимости от того введено значение или нет
        </p>

        <p>
          <button onClick={() => setValue('Some text')}>Заполнить</button>
          {' '}
          <button onClick={() => setValue('')}>Очистить</button>
        </p>

        <TextField
          label='Test label'
          value={value}
          onChange={event => setValue(event.target.value)}
          style={{ width: 240 }}
        />
      </Demo>
    );
  });
