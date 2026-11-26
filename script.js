const STORAGE_KEY = "studyMaterials";

const form = document.querySelector("#materialForm");
const titleInput = document.querySelector("#title");
const typeInput = document.querySelector("#type");
const subjectInput = document.querySelector("#subject");
const descriptionInput = document.querySelector("#description");
const codeInput = document.querySelector("#code");
const photosInput = document.querySelector("#photos");

const materialIdInput = document.querySelector("#materialId");
const materialsList = document.querySelector("#materialsList");
const emptyMessage = document.querySelector("#emptyMessage");
const searchInput = document.querySelector("#search");
const filterType = document.querySelector("#filterType");
const photoPreview = document.querySelector("#photoPreview");

const formTitle = document.querySelector("#formTitle");
const submitButton = document.querySelector("#submitButton");
const cancelEditButton = document.querySelector("#cancelEdit");

let selectedPhotos = [];

function getMaterials() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveMaterials(materials) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
    return true;
  } catch {
    alert("Не удалось сохранить данные. Возможно, фотографии слишком большие.");
    return false;
  }
}

// Преобразует выбранный файл-фотографию в Data URL,
// чтобы показать и сохранить её в браузере.
function readPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Выбранный файл не является изображением."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => resolve({
      name: file.name,
      data: reader.result
    });

    reader.onerror = () => reject(new Error("Не удалось загрузить фотографию."));
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function showPhotoPreviews() {
  photoPreview.replaceChildren();

  selectedPhotos.forEach(photo => {
    const image = document.createElement("img");
    image.src = photo.data;
    image.alt = photo.name || "Предпросмотр фотографии";
    photoPreview.appendChild(image);
  });
}

photosInput.addEventListener("change", async event => {
  const files = [...event.target.files];
  if (!files.length) return;

  try {
    const loadedPhotos = await Promise.all(files.map(readPhoto));
    selectedPhotos = [...selectedPhotos, ...loadedPhotos];
    showPhotoPreviews();
  } catch (error) {
    alert(error.message);
  }

  // Позволяет снова выбрать тот же файл.
  photosInput.value = "";
});

function renderMaterials() {
  const materials = getMaterials();
  const query = searchInput.value.trim().toLowerCase();
  const selectedType = filterType.value;

  const filtered = materials.filter(material => {
    const matchesType = selectedType === "all" || material.type === selectedType;
    const searchableText = [
      material.title,
      material.subject,
      material.description,
      material.code
    ].join(" ").toLowerCase();

    return matchesType && searchableText.includes(query);
  });

  materialsList.replaceChildren();
  emptyMessage.classList.toggle("hidden", filtered.length > 0);

  filtered.forEach(material => {
    const article = document.createElement("article");
    article.className = "material-card";

    const badgeText = material.type === "practice"
      ? "Практическая работа"
      : "Шпаргалка";

    const photosHtml = (material.photos || []).map(photo => `
      <img src="${photo.data}" alt="${escapeHtml(photo.name || material.title)}" loading="lazy">
    `).join("");

    const codeHtml = material.code
      ? `<pre class="code-block"><code>${escapeHtml(material.code)}</code></pre>`
      : "";

    article.innerHTML = `
      <div class="card-top">
        <h3>${escapeHtml(material.title)}</h3>
        <span class="badge">${badgeText}</span>
      </div>

      ${material.subject
        ? `<p class="subject">${escapeHtml(material.subject)}</p>`
        : ""}

      ${material.description
        ? `<div class="description">${escapeHtml(material.description)}</div>`
        : ""}

      ${photosHtml
        ? `<div class="card-photos">${photosHtml}</div>`
        : ""}

      ${codeHtml}

      <div class="card-actions">
        <button type="button" data-action="edit" data-id="${escapeHtml(material.id)}">Редактировать</button>
        <button type="button" data-action="delete" data-id="${escapeHtml(material.id)}">Удалить</button>
      </div>
    `;

    materialsList.appendChild(article);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const materials = getMaterials();
  const existingId = materialIdInput.value;
  const existingMaterial = materials.find(item => item.id === existingId);

  const material = {
    id: existingId || createId(),
    title: titleInput.value.trim(),
    type: typeInput.value,
    subject: subjectInput.value.trim(),
    description: descriptionInput.value.trim(),
    code: codeInput.value,
    photos: [...(existingMaterial?.photos || []), ...selectedPhotos]
  };

  if (!material.title) {
    alert("Введи название материала.");
    return;
  }

  const updatedMaterials = existingId
    ? materials.map(item => item.id === existingId ? material : item)
    : [material, ...materials];

  if (!saveMaterials(updatedMaterials)) return;

  resetForm();
  renderMaterials();
});

materialsList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  const materials = getMaterials();
  const material = materials.find(item => item.id === id);

  if (!material) return;

  if (action === "delete") {
    if (!confirm(`Удалить материал «${material.title}»?`)) return;

    saveMaterials(materials.filter(item => item.id !== id));
    renderMaterials();
  }

  if (action === "edit") {
    materialIdInput.value = material.id;
    titleInput.value = material.title;
    typeInput.value = material.type;
    subjectInput.value = material.subject || "";
    descriptionInput.value = material.description || "";
    codeInput.value = material.code || "";

    // Существующие фотографии сохраняются, новые можно добавить через поле загрузки.
    selectedPhotos = [];
    showPhotoPreviews();

    formTitle.textContent = "Редактировать материал";
    submitButton.textContent = "Сохранить изменения";
    cancelEditButton.classList.remove("hidden");

    document.querySelector("#add").scrollIntoView({ behavior: "smooth" });
    titleInput.focus();
  }
});

function resetForm() {
  form.reset();
  materialIdInput.value = "";
  selectedPhotos = [];
  photoPreview.replaceChildren();

  formTitle.textContent = "Добавить материал";
  submitButton.textContent = "Добавить материал";
  cancelEditButton.classList.add("hidden");
}

cancelEditButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderMaterials);
filterType.addEventListener("change", renderMaterials);

renderMaterials();