const iframe = Addon.iframe();

function renderCompanyInfo(data) {
  console.log('Rendering data:', data); // Для отладки
  
  const container = document.getElementById('companyInfo');
  const loading = document.getElementById('loading');
  
  if (!data) {
    container.innerHTML = '<div class="error">Данные не найдены</div>';
    return;
  }

  loading.style.display = 'none';

  const html = `
    <div class="company-info">
      <div class="info-grid" style="display: grid; gap: 12px;">
        <div><strong>Наименование:</strong> ${data.title || '-'}</div>
        <div><strong>ИНН:</strong> ${data.inn || '-'}</div>
        <div><strong>КПП:</strong> ${data.kpp || '-'}</div>
        <div><strong>ОГРН:</strong> ${data.ogrn || '-'}</div>
        <div><strong>Статус:</strong> ${data.status || '-'}</div>
        <div><strong>Адрес:</strong> ${data.address || '-'}</div>
        <div><strong>Руководитель:</strong> ${data.managementFIO || '-'}</div>
        <div><strong>Должность руководителя:</strong> ${data.managementPost || '-'}</div>
        <div><strong>ОКПО:</strong> ${data.okpo || '-'}</div>
        <div><strong>ОКТМО:</strong> ${data.oktmo || '-'}</div>
        <div><strong>ОКАТО:</strong> ${data.okato || '-'}</div>
        <div><strong>ОКВЭД:</strong> ${data.okved || '-'}</div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  iframe.fitSize(container);
}

// Получаем данные, переданные через args
iframe.getArgs().then(args => {
  console.log('Received args:', args); // Для отладки
  if (args && args.companyData) {
    renderCompanyInfo(args.companyData);
  } else {
    renderCompanyInfo(null);
  }
}).catch(error => {
  console.error('Error getting args:', error);
  renderCompanyInfo(null);
});