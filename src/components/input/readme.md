Возможные состояния
```jsx
import Icon from '../icon';
import icons from '../icons/';

<React.Fragment>
  <h3>Just text input with placeholder</h3>
  <div>
    <h4>Regular</h4>
    <Input
      autoFocus
      placeholder='Enter your name'
    />
    <h4>Failed</h4>
    <Input
      placeholder='Enter your name'
      failed
    />
  </div>

  <h3>With start icon</h3>
  <div>
    <Input
      startAdornment={(
        <Icon
          icon={icons.search}
          color='gray'
          size={19}
        />
      )}
      placeholder='Type to search'
    />
  </div>

  <h3>With start & end icon</h3>
  <div>
    <Input
      startAdornment={(
        <Icon
          icon={icons.search}
          color='gray'
          size={19}
        />
      )}
      endAdornment={(
        <Icon
          icon={icons.cross}
          color='gray'
          size={10}
        />
      )}
      placeholder='Enter user name'
    />
  </div>

  <h3>With end adornment</h3>
  <div>
    <Input
      type='number'
      endAdornment='Kg'
      placeholder='Your weight'
    />
  </div>
</React.Fragment>
```