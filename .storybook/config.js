import { configure } from '@storybook/react';
import '@storybook/addon-console';

const req = require.context('../src/components', true, /\.stories\.jsx?$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
