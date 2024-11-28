const iframe = Addon.iframe();

const innInput = document.getElementById('innInput');
const checkButton = document.getElementById('check');
const cancelButton = document.getElementById('cancel');
const loader = document.getElementById('loader');
const buttons = document.getElementById('buttons');

iframe.fitSize('#checkInnContent');

function setLoading(isLoading) {
  loader.style.display = isLoading ? 'block' : 'none';
  buttons.style.display = isLoading ? 'none' : 'flex';
  innInput.disabled = isLoading;
  iframe.fitSize('#checkInnContent');
}

cancelButton.addEventListener('click', () => {
  iframe.closePopup();
});

checkButton.addEventListener('click', async () => {
  const inn = innInput.value.trim();
  
  if (!inn || inn.length < 10) {
    iframe.showSnackbar('Введите корректный ИНН', 'warning');
    return;
  }

  try {
    setLoading(true);
    
    const apiUrl = `https://mt.mosgortur.ru/MGTAPI/api/PartnerRequisites/${inn}`;
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${apiUrl}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Origin': 'https://romeo787ooo.github.io'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data); // Для отладки

    if (data.error) {
      setLoading(false);
      iframe.showSnackbar(`Ошибка: ${data.error}`, 'error');
      return;
    }

    // Закрываем попап только после успешного получения данных
    await iframe.closePopup();

    // Открываем диалог с результатами
    return iframe.openDialog({
      title: `Информация о компании: ${data.title || inn}`,
      url: './company-info.html',
      width: 'md',
      height: 400,
      args: { companyData: data } // Передаем данные
    });

  } catch (error) {
    console.error('Error details:', error);
    iframe.showSnackbar('Ошибка при проверке ИНН. Проверьте консоль для деталей.', 'error');
    setLoading(false);
  }
});

innInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !innInput.disabled) {
    checkButton.click();
  }
});