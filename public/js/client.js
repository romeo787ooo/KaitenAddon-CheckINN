Addon.initialize({
  settings: (settingsContext) => {
    return settingsContext.openPopup({
      title: 'INN Checker Settings',
      url: './settings.html',
      height: 200,
      width: 300
    });
  },
  'card_body_section': async (bodySectionContext) => {
    const companyData = await bodySectionContext.getData('card', 'private', 'companyData');
    
    if (!companyData) {
      return [];
    }

    return [{
      title: '🏢 Данные о компании',
      content: {
        type: 'iframe',
        url: bodySectionContext.signUrl('./company-info.html'),
        height: 200,
      }
    }]
  },
  'card_facade_badges': async (context) => {
    const companyData = await context.getData('card', 'private', 'companyData');
    
    if (!companyData) {
      return {
        text: '❌ ИНН не проверен',
        color: 'red',
      }
    }

    return {
      text: '✅ ИНН проверен',
      color: 'green',
    }
  },
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
          const innField = properties?.find(prop => prop.id === '398033');
          
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

          // Сохраняем данные в карточке
          await buttonContext.setData('card', 'private', 'companyData', data);
          
          buttonContext.showSnackbar('Данные о компании успешно получены!', 'success');
        } catch (error) {
          buttonContext.showSnackbar('Ошибка при проверке ИНН', 'error');
          console.error(error);
        }
      }
    });

    return buttons;
  }
});
