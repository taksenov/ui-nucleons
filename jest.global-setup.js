module.exports = async () => {
  // принудительно ставим часовой пояс, чтобы тесты дат работали одинаково в любом окружении
  process.env.TZ = 'UTC';
};
