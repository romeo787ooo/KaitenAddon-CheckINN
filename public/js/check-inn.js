const iframe = Addon.iframe();

const innInput = document.getElementById('innInput');
const checkButton = document.getElementById('check');
const cancelButton = document.getElementById('cancel');

iframe.fitSize('#checkInnContent');

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
    // Используем CORS-proxy
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

    if (data.error) {
      iframe.showSnackbar(`Ошибка: ${data.error}`, 'error');
      return;
    }

    await iframe.closePopup();

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

innInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    checkButton.click();
  }
});