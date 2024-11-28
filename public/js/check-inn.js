const iframe = Addon.iframe();

const innInput = document.getElementById('innInput');
const checkButton = document.getElementById('check');
const cancelButton = document.getElementById('cancel');
const loader = document.getElementById('loader');
const buttons = document.getElementById('buttons');
const results = document.getElementById('results');

iframe.fitSize('#checkInnContent');

function setLoading(isLoading) {
  loader.style.display = isLoading ? 'block' : 'none';
  checkButton.disabled = isLoading;
  innInput.disabled = isLoading;
  iframe.fitSize('#checkInnContent');
}

function renderResults(data) {
  results.style.display = 'block';
  results.innerHTML = `
    <div class="company-info">
      <h3 style="margin-bottom: 16px; color: var(--addon-text-primary-color);">
        ${data.title || 'Информация о компании'}
      </h3>
      <div class="info-grid">
        <div><strong>ИНН:</strong> ${data.inn || '-'}</div>
        <div><strong>КПП:</strong> ${data.kpp || '-'}</div>
        <div><strong>ОГРН:</strong> ${data.ogrn || '-'}</div>
        <div><strong>Статус:</strong> ${data.status || '-'}</div>
        <div><strong>Адрес:</strong> ${data.address || '-'}</div>
        <div><strong>Руководитель:</strong> ${data.managementFIO || '-'}</div>
        <div><strong>Должность:</strong> ${data.managementPost || '-'}</div>
        <div><strong>ОКПО:</strong> ${data.okpo || '-'}</div>
      </div>
    </div>
  `;
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
    results.style.display = 'none';
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

    if (data.error) {
      setLoading(false);
      iframe.showSnackbar(`Ошибка: ${data.error}`, 'error');
      return;
    }

    setLoading(false);
    renderResults(data);

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