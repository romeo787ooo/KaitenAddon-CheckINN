const iframe = Addon.iframe();

iframe.getArgs().then(args => {
  const { companyData } = args;
  const container = document.getElementById('companyInfo');
  const loading = document.getElementById('loading');
  
  if (!companyData) {
    container.innerHTML = '<div class="error">Данные не найдены</div>';
    return;
  }

  loading.style.display = 'none';

  const html = `
    <div class="company-info">
      <h3 style="margin-bottom: 16px;">${companyData.title || 'Название не указано'}</h3>
      <div class="info-grid" style="display: grid; gap: 8px;">
        <div><strong>ИНН:</strong> ${companyData.inn || '-'}</div>
        <div><strong>КПП:</strong> ${companyData.kpp || '-'}</div>
        <div><strong>ОГРН:</strong> ${companyData.ogrn || '-'}</div>
        <div><strong>Статус:</strong> ${companyData.status || '-'}</div>
        <div><strong>Адрес:</strong> ${companyData.address || '-'}</div>
        <div><strong>Руководитель:</strong> ${companyData.managementFIO || '-'}</div>
        <div><strong>Должность:</strong> ${companyData.managementPost || '-'}</div>
        <div><strong>ОКПО:</strong> ${companyData.okpo || '-'}</div>
        <div><strong>ОКТМО:</strong> ${companyData.oktmo || '-'}</div>
        <div><strong>ОКАТО:</strong> ${companyData.okato || '-'}</div>
        <div><strong>ОКВЭД:</strong> ${companyData.okved || '-'}</div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  iframe.fitSize(container);
});
