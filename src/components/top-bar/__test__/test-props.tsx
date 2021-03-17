import React from 'react';
import CrossSVG from '@dev-dep/ui-quarks/icons/24x24/Stroked/cross.js';
import ArrowLeftSVG from '@dev-dep/ui-quarks/icons/24x24/Stroked/arrow-left.js';
import PersonSVG from '@dev-dep/ui-quarks/icons/24x24/Stroked/person.js';

const longText = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita ad, provident aspernatur dolore. ';

export const sizes = ['s', 'm', 'l'];

export const shortTitles = { title: 'Modal title', subtitle: 'Modal subtitle' };

export const longTitles = { title: longText.repeat(2), subtitle: longText.repeat(2) };

export const startButtons = {
  start: {
    icon: <ArrowLeftSVG />,
  },
  startSecondary: {
    icon: <PersonSVG />,
  },
};

export const endButtons = {
  end: {
    icon: <CrossSVG />,
  },
  endSecondary: {
    icon: <PersonSVG />,
  },
};

export const allButtons = {
  ...startButtons,
  ...endButtons,
};