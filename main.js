const form = document.getElementById('bookmarkForm');
const nameInput = document.getElementById('siteName');
const urlInput = document.getElementById('siteURL');
const nameStatus = document.getElementById('nameStatus');
const urlStatus = document.getElementById('urlStatus');
const tableBody = document.querySelector('#bookmarksTable tbody');

const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');

let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

function isValidURL(url) {
  const re = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;
  return re.test(url);
}

function showModal() {
  modal.classList.remove('hidden');
}
function hideModal() {
  modal.classList.add('hidden');
}
modalClose.addEventListener('click', hideModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) hideModal();
});

function updateStatus() {
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();

  if (name.length >= 3) {
    nameInput.className = 'valid';
    nameStatus.className = 'status valid';
    nameStatus.textContent = '✓';
  } else if (name.length === 0) {
    nameInput.className = '';
    nameStatus.className = 'status';
    nameStatus.textContent = '';
  } else {
    nameInput.className = 'invalid';
    nameStatus.className = 'status invalid';
    nameStatus.textContent = '✕';
  }

  if (url.length === 0) {
    urlInput.className = '';
    urlStatus.className = 'status';
    urlStatus.textContent = '';
  } else if (isValidURL(url)) {
    urlInput.className = 'valid';
    urlStatus.className = 'status valid';
    urlStatus.textContent = '✓';
  } else {
    urlInput.className = 'invalid';
    urlStatus.className = 'status invalid';
    urlStatus.textContent = '✕';
  }
}

nameInput.addEventListener('input', updateStatus);
urlInput.addEventListener('input', updateStatus);

function addBookmark(name, url) {
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  bookmarks.push({ name, url });
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  renderTable();
}

function deleteBookmark(index) {
  if (!confirm('Are you sure you want to delete this bookmark?')) return;
  bookmarks.splice(index, 1);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  renderTable();
}

function visitSite(url) {
  window.open(url, '_blank');
}

function renderTable() {
  tableBody.innerHTML = '';
  bookmarks.forEach((bm, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${bm.name}</td>
      <td><button class="visit-btn" data-url="${bm.url}"><i class="fa-solid fa-eye"></i> Visit</button></td>
      <td><button class="delete-btn" data-index="${idx}"><i class="fa-solid fa-trash"></i> Delete</button></td>
    `;
    tableBody.appendChild(tr);
  });

  document.querySelectorAll('.visit-btn').forEach(btn =>
    btn.addEventListener('click', () => visitSite(btn.dataset.url))
  );
  document.querySelectorAll('.delete-btn').forEach(btn =>
    btn.addEventListener('click', () => deleteBookmark(Number(btn.dataset.index)))
  );
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();

  const nameOk = name.length >= 3;
  const urlOk = isValidURL(url);

  if (!nameOk || !urlOk) {
    showModal();
    updateStatus();
    return;
  }

  addBookmark(name, url);
  form.reset();
  nameStatus.textContent = '';
  urlStatus.textContent = '';
  nameInput.className = '';
  urlInput.className = '';
});

renderTable();
updateStatus();
