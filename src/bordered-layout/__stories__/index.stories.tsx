import React from 'react';
import { BorderedLayout, BorderedLayoutProps } from '..';

export default {
  title: 'mobile/BorderedLayout',
  component: BorderedLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Primary = () => {
  const Demo: React.FC<BorderedLayoutProps> = ({ children, ...props }) => (
    <div style={{ margin: '32px 0' }}>
      <BorderedLayout {...props}>
        <div style={{ padding: '16px 0' }}>
          {children}
        </div>
      </BorderedLayout>
    </div>
  );

  return (
    <>
      <Demo top bottom>
        Граница сверху и снизу
      </Demo>

      <Demo top>
        Граница сверху
      </Demo>

      <Demo bottom>
        Граница снизу
      </Demo>
    </>
  );
};
