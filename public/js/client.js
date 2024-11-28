Addon.initialize({
  'card_buttons': async (cardButtonsContext) => {
    const buttons = [];

    // Добавляем только одну кнопку для проверки ИНН
    buttons.push({
      text: '🔍 Проверить ИНН',
      callback: async (buttonContext) => {
        // Открываем попап с полем ввода ИНН
        return buttonContext.openPopup({
          type: 'iframe',
          title: 'Проверка ИНН',
          url: './public/views/check-inn.html',
          height: 150,
          width: 600
        });
      }
    });

    return buttons;
  }
});
