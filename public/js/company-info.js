const iframe = Addon.iframe();

function renderCompanyInfo(data) {
  const container = document.getElementById('companyInfo');
  const loading = document.getElementById('loading');
  loading.style.display = 'none';

  const html = `
    <div class="company-info">
      <h3 style="margin-bottom: 16px;">${data.title}</h3>
      <div class="info-grid" style="display: grid; gap: 8px;">
        <div><strong>ИНН:</strong> ${data.inn}</div>
        <div><strong>КПП:</strong> ${data.kpp || '-'}</div>
        <div><strong>ОГРН:</strong> ${data.ogrn || '-'}</div>
        <div><strong>Статус:</strong> ${data.status || '-'}</div>
        <div><strong>Адрес:</strong> ${data.address || '-'}</div>
        <div><strong>Руководитель:</strong> ${data.managementFIO || '-'}</div>
        <div><strong>Должность:</strong> ${data.managementPost || '-'}</div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  iframe.fitSize(container);
}

iframe.getArgs().then(args => {
  if (args.companyData) {
    renderCompanyInfo(args.companyData);
  }
});
