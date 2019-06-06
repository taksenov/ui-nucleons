import {
  getSample,
  parseToString,
  makeBoldSubstring,
  formatNumber,
} from '../utils';

let result;

describe('test makeBoldSubstring', () => {
  const test1 = [
    {
      isBold: false,
      text: 'строкА с ',
    },
    {
      isBold: true,
      text: 'нуЖноЙ',
    },
    {
      isBold: false,
      text: ' поДстРокой',
    },
  ];
  const test2 = [
    {
      isBold: false,
      text: 'ничего НЕТ',
    },
  ];
  it('getSample() works properly', () => {
    result = getSample('строкА с нуЖноЙ поДстРокой', 'нУжНоЙ');
    expect(result).toEqual(test1);
    result = getSample('ничего НЕТ', 'есть');
    expect(result).toEqual(test2);
    result = getSample('ничего НЕТ', '');
    expect(result).toEqual(test2);
    result = getSample(123, 123);
    expect(result).toEqual([{ isBold: true, text: '123' }]);
  });
  it('parseToString() works priperly', () => {
    result = parseToString(test1);
    expect(result).toEqual('строкА с <b>нуЖноЙ</b> поДстРокой');
    result = parseToString(test2);
    expect(result).toEqual('ничего НЕТ');
  });
  it('makeBoldSubstring() works properly', () => {
    result = makeBoldSubstring('i have bold substring', 'bold');
    expect(result).toEqual('i have <b>bold</b> substring');
    result = makeBoldSubstring('i have bold substring', 'normal');
    expect(result).toEqual('i have bold substring');
    result = makeBoldSubstring('i have bold substring', '');
    expect(result).toEqual('i have bold substring');
  });
});

describe('test formatNumber', () => {
  it('formatNumber() works properly', () => {
    result = formatNumber(100.55, ' ');
    expect(result).toEqual(['100', '55']);
    result = formatNumber(123456789.34475484);
    expect(result).toEqual(['123 456 789', '34']);
    result = formatNumber(123456789.34475484, '.');
    expect(result).toEqual(['123.456.789', '34']);
  });
});

