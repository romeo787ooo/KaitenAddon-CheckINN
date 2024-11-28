const iframe = Addon.iframe();

const innInput = document.getElementById('innInput');
const checkButton = document.getElementById('check');
const cancelButton = document.getElementById('cancel');
const loader = document.getElementById('loader');
const buttons = document.getElementById('buttons');
const results = document.getElementById('results');

let companyData = null;
let markdownText = '';
let checks = {
 classified: false,
 tourOperator: false,
 agentLink: ''
};

iframe.fitSize('#checkInnContent');

function setLoading(isLoading) {
 loader.style.display = isLoading ? 'block' : 'none';
 checkButton.disabled = isLoading;
 innInput.disabled = isLoading;
 iframe.fitSize('#checkInnContent');
}

function renderResults(data) {
 companyData = data;
 results.style.display = 'block';
 results.innerHTML = `
   <div class="company-info">
     <span style="font-size: 14px; color: var(--addon-text-secondary-color);">Наименование организации:</span>
     <div style="font-size: 16px; font-weight: 500; margin: 4px 0 16px 0; color: var(--addon-text-primary-color);">
       ${data.title || '-'}
     </div>
     <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px; background: var(--addon-background-level2); border-radius: 8px;">
       <div style="color: var(--addon-text-primary-color);">
         <div style="margin-bottom: 8px;">
           <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ИНН</div>
           <div style="font-weight: 500;">${data.inn || '-'}</div>
         </div>
         <div style="margin-bottom: 8px;">
           <div style="color: var(--addon-text-secondary-color); font-size: 12px;">КПП</div>
           <div style="font-weight: 500;">${data.kpp || '-'}</div>
         </div>
         <div>
           <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ОГРН</div>
           <div style="font-weight: 500;">${data.ogrn || '-'}</div>
         </div>
       </div>
       <div style="color: var(--addon-text-primary-color);">
         <div style="margin-bottom: 8px;">
           <div style="color: var(--addon-text-secondary-color); font-size: 12px;">Статус</div>
           <div style="font-weight: 500;">${data.status || '-'}</div>
         </div>
         <div style="margin-bottom: 8px;">
           <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ОКПО</div>
           <div style="font-weight: 500;">${data.okpo || '-'}</div>
         </div>
         <div>
           <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ОКВЭД</div>
           <div style="font-weight: 500;">${data.okved || '-'}</div>
         </div>
       </div>
     </div>
     <div style="margin-top: 12px;">
       <div style="color: var(--addon-text-secondary-color); font-size: 12px;">Адрес</div>
       <div style="margin-top: 4px; color: var(--addon-text-primary-color);">${data.address || '-'}</div>
     </div>
     <div style="margin-top: 12px;">
       <div style="color: var(--addon-text-secondary-color); font-size: 12px;">Руководитель</div>
       <div style="margin-top: 4px; color: var(--addon-text-primary-color);">${data.managementFIO || '-'}</div>
       <div style="font-size: 12px; color: var(--addon-text-secondary-color); margin-top: 2px;">${data.managementPost || '-'}</div>
     </div>
   </div>
 `;

 // Показываем ссылки на реестры и кнопку "Проверка завершена" сразу
 const registryLinks = document.getElementById('registryLinks');
 registryLinks.style.display = 'block';
 document.getElementById('completeCheck').style.display = 'block';

 // Обновляем ссылки с учетом ИНН
 const classifiedLink = document.getElementById('classifiedLink');
 classifiedLink.href = `https://fsa.gov.ru/use-of-technology/elektronnye-reestryy/reestr-klassifitsirovannykh-obektov-gostinitsy-i-inye-sredstva-razmeshcheniya/?inn=${data.inn}`;

 const tourOperatorLink = document.getElementById('tourOperatorLink');
 tourOperatorLink.href = 'https://economy.gov.ru/material/directions/turizm/reestry_turizm/edinyy_federalnyy_reestr_turoperatorov/poisk_po_efrt/';

 // Обработчики для чек-боксов
 classifiedLink.addEventListener('click', () => {
   checks.classified = true;
   document.getElementById('classifiedCheck').style.display = 'inline';
 });

 tourOperatorLink.addEventListener('click', () => {
   checks.tourOperator = true;
   document.getElementById('tourOperatorCheck').style.display = 'inline';
 });

 document.querySelector('a[href="https://tourism.gov.ru/agents/"]').addEventListener('click', () => {
   document.getElementById('agentLinkInput').style.display = 'block';
 });

 // Обработчик ввода ссылки
 document.querySelector('#agentLinkInput input').addEventListener('change', (e) => {
   checks.agentLink = e.target.value;
 });

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
   
   const response = await fetch(`https://mt.mosgortur.ru/MGTAPI/api/PartnerRequisites/${inn}`);
   
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

// Обработчик для кнопки "Проверка завершена"
document.getElementById('completeCheck').addEventListener('click', () => {
 markdownText = `### Информация о компании\n\n`;
 markdownText += `**${companyData.title}**\n\n`;
 markdownText += `ИНН: ${companyData.inn}\n`;
 markdownText += `КПП: ${companyData.kpp}\n`;
 markdownText += `ОГРН: ${companyData.ogrn}\n`;
 markdownText += `Статус: ${companyData.status}\n`;
 markdownText += `Адрес: ${companyData.address}\n`;
 markdownText += `Руководитель: ${companyData.managementFIO}\n`;
 markdownText += `Должность: ${companyData.managementPost}\n\n`;

 if (checks.classified || checks.tourOperator || checks.agentLink) {
   markdownText += `### Проверка в реестрах\n\n`;
   if (checks.classified) {
     markdownText += `✓ Проверено в Реестре классифицированных объектов\n`;
   }
   if (checks.tourOperator) {
     markdownText += `✓ Проверено в Федеральном реестре Туроператоров\n`;
   }
   if (checks.agentLink) {
     markdownText += `🔗 Ссылка на реестр Турагентов: ${checks.agentLink}\n`;
   }
 }

 // Создаем временный элемент textarea для копирования
 const textarea = document.createElement('textarea');
 textarea.value = markdownText;
 textarea.style.position = 'fixed';
 textarea.style.opacity = 0;
 document.body.appendChild(textarea);
 textarea.select();
 
 try {
   document.execCommand('copy');
   iframe.showSnackbar('Результат проверки скопирован в буфер обмена', 'success');
   
   // Скрываем все кнопки кроме копирования
   document.getElementById('buttons').style.display = 'none';
   document.getElementById('completeCheck').style.display = 'none';
   document.getElementById('registryLinks').style.display = 'none';
   document.getElementById('copyResult').style.display = 'block';
 } catch (err) {
   iframe.showSnackbar('Не удалось скопировать текст', 'error');
 } finally {
   document.body.removeChild(textarea);
 }
});

// Обработчик для кнопки копирования
document.getElementById('copyText').addEventListener('click', () => {
 const textarea = document.createElement('textarea');
 textarea.value = markdownText;
 textarea.style.position = 'fixed';
 textarea.style.opacity = 0;
 document.body.appendChild(textarea);
 textarea.select();
 
 try {
   document.execCommand('copy');
   iframe.showSnackbar('Результат проверки скопирован в буфер обмена', 'success');
 } catch (err) {
   iframe.showSnackbar('Не удалось скопировать текст', 'error');
 } finally {
   document.body.removeChild(textarea);
 }
});

innInput.addEventListener('keypress', (e) => {
 if (e.key === 'Enter' && !innInput.disabled) {
   checkButton.click();
 }
});