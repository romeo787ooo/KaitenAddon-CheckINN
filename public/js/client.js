Addon.initialize({
  'card_buttons': async (cardButtonsContext) => {
    const buttons = [];

    buttons.push({
      text: '🔍 Проверить ИНН',
      callback: async (buttonContext) => {
        return buttonContext.openPopup({
          type: 'iframe',
          title: 'Проверка ИНН',
          url: './public/views/check-inn.html',
          height: 200,
          width: 600
        });
      }
    });

    return buttons;
  },
  'card_facade_badges': async (context) => {
    const isChecked = await context.getData('card', 'private', 'innChecked');
    
    if (isChecked) {
      return {
        text: '✅ ИНН проверен',
        color: 'green'
      };
    }
    return null;
  }
});