Addon.initialize({
  'card_buttons': async (cardButtonsContext) => {
    const buttons = [];
    
    // Получаем права доступа
    const permissions = cardButtonsContext.getPermissions();
    if (!permissions.card.read) {
      return [];
    }

    buttons.push({
      text: '🔍 Проверить ИНН',
      callback: async (buttonContext) => {
        try {
          // Получаем карточку
          const card = await buttonContext.getCard();
          
          // Получаем свойства карточки
          const properties = await buttonContext.getCardProperties('customProperties');
          
          // Ищем поле с ID 398033
          const innField = properties?.find(prop => prop.id === 398033);
          
          if (!innField?.value) {
            buttonContext.showSnackbar('ИНН не указан в карточке', 'warning');
            return;
          }

          // Делаем запрос к API
          const response = await fetch(`https://mt.mosgortur.ru/MGTAPI/api/PartnerRequisites/${innField.value}`);
          const data = await response.json();

          if (data.error) {
            buttonContext.showSnackbar(`Ошибка: ${data.error}`, 'error');
            return;
          }

          // Показываем результат в диалоговом окне
          return buttonContext.openDialog({
            title: 'Информация о компании',
            url: buttonContext.signUrl('./company-info.html'),
            width: 'md',
            height: 400,
            // Передаем данные в диалог
            args: { companyData: data }
          });
        } catch (error) {
          buttonContext.showSnackbar('Ошибка при проверке ИНН', 'error');
        }
      }
    });

    return buttons;
  }
});
