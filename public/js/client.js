Addon.initialize({
  'card_buttons': async (cardButtonsContext) => {
    const buttons = [];

    buttons.push({
      text: '🔍 Проверить ИНН',
      callback: async (buttonContext) => {
        // Открываем попап с полем ввода ИНН
        return buttonContext.openPopup({
          type: 'iframe',
          title: 'Проверка ИНН',
          url: './public/views/check-inn.html',
          height: 150,
          width: 400
        });
      }
    });
    // TESTOVII Комментарий
    return buttons;
  }
});
