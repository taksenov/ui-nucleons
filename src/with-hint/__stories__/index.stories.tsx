import React, { useEffect, useState } from 'react';
import { WithHint, useTempHint } from '..';
import { Modal } from '../../modal';

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  opener: {
    padding: 8,
    fontSize: 18,
    display: 'inline-flex',
    background: '#eee',
    cursor: 'pointer',
    borderRadius: 4,
    marginTop: 48,
  },
  modalContent: {
    position: 'relative',
    height: 320,
    overflowY: 'auto',
    padding: 20,
  },
};

export default {
  title: 'WithHint',
  component: WithHint,
  parameters: {
    layout: 'padded',
  },
};

export const Primary = () => (
  <div style={styles.root}>
    {(['right', 'bottom', 'left', 'top'] as const).map(direction => (
      <WithHint
        key={direction}
        direction={direction}
        hint={<>Первая строчка.<br />И вторая строчка.</>}
      >
        {(ref, toggle) => (
          <div
            ref={ref as any}
            onMouseEnter={() => toggle(true)}
            onMouseLeave={() => toggle(false)}
            style={styles.opener}
          >
            Наведи на меня
          </div>
        )}
      </WithHint>
    ))}
  </div>
);

export const AutoCloseHook = () => {
  const [data, setData] = useState<string>();
  const [bind, toggle] = useTempHint();

  useEffect(() => {
    if (data) {
      toggle(true);
    }
  }, [data, toggle]);

  const fakeFetch = () => {
    setData(`Новый хинт! (${Date.now()})`);
  };

  return (
    <div style={styles.root}>
      <WithHint hint={data} {...bind}>
        {ref => (
          <div ref={ref as any} style={styles.opener} onClick={fakeFetch}>
            Нажми на меня
          </div>
        )}
      </WithHint>
    </div>
  );
};

export const InScrolledParent = () => {
  const [bind, toggle] = useTempHint();

  return (
    <Modal size='s' title='Тестовое окно' withDivideTopBar>
      <div style={styles.modalContent}>
        {[...Array(32).keys()].map(i => (
          <p key={i}>Прокрути вниз</p>
        ))}

        <WithHint hint='Проверочный хинт!' direction='right' {...bind}>
          {ref => (
            <div
              ref={ref as any}
              onClick={() => toggle(true)}
              style={{ ...styles.opener, marginBottom: 48 }}
            >
              Нажми на меня
            </div>
          )}
        </WithHint>

        {[...Array(32).keys()].map(i => (
          <p key={i}>Можешь прокрутить еще</p>
        ))}
      </div>
    </Modal>
  );
};

export const InDocumentWithScroll = () => {
  const [bind, toggle] = useTempHint();

  return (
    <>
      {[...Array(32).keys()].map(i => (
        <p key={i}>Прокрути вниз</p>
      ))}

      <WithHint hint='Проверочный хинт!' direction='right' {...bind}>
        {ref => (
          <div
            ref={ref as any}
            onClick={() => toggle(true)}
            style={{ ...styles.opener, marginBottom: 48 }}
          >
            Нажми на меня
          </div>
        )}
      </WithHint>

      {[...Array(32).keys()].map(i => (
        <p key={i}>Можешь прокрутить еще</p>
      ))}
    </>
  );
};