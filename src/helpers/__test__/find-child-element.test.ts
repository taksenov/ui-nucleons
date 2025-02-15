import findChildElement from '../find-child-element';

describe('findChildElement()', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });
  it('should return -1 without "props.isSuitable" function', () => {
    const div = document.createElement('div');
    document.body.append(div);

    expect(findChildElement({
      target: div,
      isSuitable: undefined,
    })).toBe(-1);
  });
  it('should return first suitable sibling without "props.needBreakLoop" function', () => {
    const div = document.createElement('div');
    const sibling1 = document.createElement('header');
    const sibling2 = document.createElement('aside');
    const sibling3 = document.createElement('section');
    const sibling4 = document.createElement('footer');
    document.body.append(
      div,
      sibling1,
      sibling2,
      sibling3,
      sibling4
    );

    expect(findChildElement({
      target: document.body,
      isSuitable: sibling => sibling.tagName === 'SECTION',
    })).toBe(3);
  });
  it('should return last suitable sibling with "props.needBreakLoop" function', () => {
    const div = document.createElement('div');
    const sibling1 = document.createElement('header');
    const sibling2 = document.createElement('aside');
    const sibling3 = document.createElement('section');
    const sibling4 = document.createElement('footer');
    document.body.append(
      div,
      sibling1,
      sibling2,
      sibling3,
      sibling4
    );

    expect(findChildElement({
      target: document.body,
      isSuitable: sibling => sibling.tagName !== 'FOOTER',
      needBreakLoop: passed => !passed,
    })).toBe(3);
  });
  it('should handle "props.increment" and "props.startIndex"', () => {
    const div = document.createElement('div');
    const sibling1 = document.createElement('header');
    const sibling2 = document.createElement('aside');
    const sibling3 = document.createElement('section');
    const sibling4 = document.createElement('footer');
    document.body.append(
      div,
      sibling1,
      sibling2,
      sibling3,
      sibling4
    );

    expect(findChildElement({
      target: document.body,
      startIndex: 4,
      increment: -1,
      isSuitable: sibling => sibling.tagName === 'ASIDE',
    })).toBe(2);
  });
  it('should handle "props.defaultResult" and "props.startIndex"', () => {
    const div = document.createElement('div');
    const sibling1 = document.createElement('header');
    const sibling2 = document.createElement('aside');
    const sibling3 = document.createElement('section');
    const sibling4 = document.createElement('footer');
    document.body.append(
      div,
      sibling1,
      sibling2,
      sibling3,
      sibling4
    );

    expect(findChildElement({
      target: document.body,
      startIndex: 4,
      increment: -1,
      defaultResult: NaN,
      isSuitable: sibling => sibling.tagName === 'SPAN',
    })).toBe(NaN);
  });
});
