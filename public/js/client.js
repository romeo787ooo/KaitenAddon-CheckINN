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
          
          // Получаем пользовательские поля
          const customProperties = await buttonContext.getCardProperties('customProperties');
          console.log('Custom Properties:', customProperties); // для отладки
          
          // Ищем поле с ID 398033 (важно - сравниваем числа)
          const innField = customProperties?.find(prop => prop.id === 398033);
          console.log('INN Field:', innField); // для отладки
          
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
            url: './public/views/company-info.html',
            width: 'md',
            height: 400,
            args: { companyData: data }
          });
        } catch (error) {
          console.error('Error:', error); // для отладки
          buttonContext.showSnackbar('Ошибка при проверке ИНН', 'error');
        }
      }
    });

    return buttons;
  }
});
