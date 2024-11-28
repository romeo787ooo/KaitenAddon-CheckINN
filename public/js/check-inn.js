const iframe = Addon.iframe();

const innInput = document.getElementById('innInput');
const checkButton = document.getElementById('check');
const cancelButton = document.getElementById('cancel');

// Подстраиваем размер iframe под контент
iframe.fitSize('#checkInnContent');

// Обработка отмены
cancelButton.addEventListener('click', () => {
  iframe.closePopup();
});

// Проверка ИНН
checkButton.addEventListener('click', async () => {
  const inn = innInput.value.trim();
  
  // Простая валидация
  if (!inn || inn.length < 10) {
    iframe.showSnackbar('Введите корректный ИНН', 'warning');
    return;
  }

  try {
    // Исправленный URL запроса к API (было Partne, стало Partner)
    const response = await fetch(`https://mt.mosgortur.ru/MGTAPI/api/PartnerRequisites/${inn}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.error) {
      iframe.showSnackbar(`Ошибка: ${data.error}`, 'error');
      return;
    }

    // Закрываем текущий попап
    await iframe.closePopup();

    // Открываем диалог с результатом
    return iframe.openDialog({
      title: 'Информация о компании',
      url: './company-info.html',
      width: 'md',
      height: 400,
      args: { companyData: data }
    });
  } catch (error) {
    console.error('Error details:', error);
    iframe.showSnackbar('Ошибка при проверке ИНН. Проверьте консоль для деталей.', 'error');
  }
});

// Обработка нажатия Enter в поле ввода
innInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    checkButton.click();
  }
});
