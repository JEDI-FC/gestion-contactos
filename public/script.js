const apiUrl = '/api/contacts';

const contactForm = document.getElementById('contactForm');
const contactIdInput = document.getElementById('contactId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const companyInput = document.getElementById('company');
const notesInput = document.getElementById('notes');
const searchInput = document.getElementById('searchInput');
const contactsList = document.getElementById('contactsList');
const contactCount = document.getElementById('contactCount');
const emptyState = document.getElementById('emptyState');
const formTitle = document.getElementById('formTitle');
const submitButton = document.getElementById('submitButton');
const cancelEditButton = document.getElementById('cancelEditButton');
const refreshButton = document.getElementById('refreshButton');
const formMessage = document.getElementById('formMessage');

let contacts = [];
let searchTimer;

function setMessage(message, type = '') {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`.trim();
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Ocurrio un error inesperado');
  }

  return data;
}

function getFormData() {
  return {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    company: companyInput.value.trim(),
    notes: notesInput.value.trim(),
  };
}

function resetForm() {
  contactForm.reset();
  contactIdInput.value = '';
  formTitle.textContent = 'Nuevo contacto';
  submitButton.textContent = 'Agregar contacto';
  cancelEditButton.classList.add('hidden');
  setMessage('');
}

function renderContacts() {
  contactCount.textContent = `${contacts.length} ${contacts.length === 1 ? 'registro' : 'registros'}`;
  contactsList.innerHTML = '';
  emptyState.classList.toggle('hidden', contacts.length > 0);

  contacts.forEach((contact) => {
    const card = document.createElement('article');
    card.className = 'contact-card';
    card.innerHTML = `
      <div>
        <h3>${escapeHtml(contact.name)}</h3>
        <div class="contact-meta">
          <span>${escapeHtml(contact.email)}</span>
          <span>${escapeHtml(contact.phone)}</span>
          ${contact.company ? `<span>${escapeHtml(contact.company)}</span>` : ''}
        </div>
        ${contact.notes ? `<p class="contact-notes">${escapeHtml(contact.notes)}</p>` : ''}
      </div>
      <div class="contact-actions">
        <button class="ghost-button" type="button" data-action="edit" data-id="${contact._id}">Editar</button>
        <button class="danger-button" type="button" data-action="delete" data-id="${contact._id}">Eliminar</button>
      </div>
    `;

    contactsList.appendChild(card);
  });
}

async function loadContacts() {
  const search = searchInput.value.trim();
  const url = search ? `${apiUrl}?search=${encodeURIComponent(search)}` : apiUrl;

  contacts = await requestJson(url);
  renderContacts();
}

function startEdit(contact) {
  contactIdInput.value = contact._id;
  nameInput.value = contact.name || '';
  emailInput.value = contact.email || '';
  phoneInput.value = contact.phone || '';
  companyInput.value = contact.company || '';
  notesInput.value = contact.notes || '';
  formTitle.textContent = 'Editar contacto';
  submitButton.textContent = 'Actualizar contacto';
  cancelEditButton.classList.remove('hidden');
  setMessage('');
  nameInput.focus();
}

async function deleteContact(id) {
  const shouldDelete = confirm('Deseas eliminar este contacto?');

  if (!shouldDelete) {
    return;
  }

  await requestJson(`${apiUrl}/${id}`, { method: 'DELETE' });
  await loadContacts();
  setMessage('Contacto eliminado correctamente.', 'success');
}

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('');

  try {
    const id = contactIdInput.value;
    const payload = getFormData();

    if (id) {
      await requestJson(`${apiUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setMessage('Contacto actualizado correctamente.', 'success');
    } else {
      await requestJson(apiUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setMessage('Contacto agregado correctamente.', 'success');
    }

    resetForm();
    await loadContacts();
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

contactsList.addEventListener('click', async (event) => {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  const id = button.dataset.id;
  const contact = contacts.find((item) => item._id === id);

  try {
    if (button.dataset.action === 'edit' && contact) {
      startEdit(contact);
    }

    if (button.dataset.action === 'delete') {
      await deleteContact(id);
    }
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    loadContacts().catch((error) => setMessage(error.message, 'error'));
  }, 250);
});

refreshButton.addEventListener('click', () => {
  loadContacts().catch((error) => setMessage(error.message, 'error'));
});

cancelEditButton.addEventListener('click', resetForm);

loadContacts().catch((error) => setMessage(error.message, 'error'));
