Addon.initialize({
  'card_buttons': async (cardButtonsContext) => {
    const buttons = [];
    
    // Получаем ID карточки из контекста
    const context = await cardButtonsContext.getContext();
    const cardId = context.card_id;

    buttons.push({
      text: '🔍 Проверить ИНН',
      callback: async (buttonContext) => {
        // Открываем попап с полем ввода ИНН и передаем cardId
        return buttonContext.openPopup({
          type: 'iframe',
          title: 'Проверка ИНН',
          url: './public/views/check-inn.html',
          height: 150,
          width: 400,
          args: { cardId }
        });
      }
    });

    return buttons;
  }
});