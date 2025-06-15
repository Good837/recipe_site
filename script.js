const recipeList = document.getElementById('recipeList');
const addBtn = document.getElementById('addRecipeBtn');
const modal = document.getElementById('recipeModal');
const form = document.getElementById('recipeForm');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const cancelBtn = document.getElementById('cancelBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');

let editingIndex = null;
let deletingIndex = null;

function loadRecipes() {
  return JSON.parse(localStorage.getItem('recipes') || '[]');
}

function saveRecipes(data) {
  localStorage.setItem('recipes', JSON.stringify(data));
}

function renderRecipes() {
  const recipes = loadRecipes();
  const search = searchInput.value.toLowerCase();
  const sorted = recipes.sort((a, b) => {
    if (sortSelect.value === 'title') return a.title.localeCompare(b.title);
    if (sortSelect.value === 'time') return a.time - b.time;
    return 0;
  }).filter(r => r.title.toLowerCase().includes(search));

  recipeList.innerHTML = '';
  for (let [index, recipe] of sorted.entries()) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${recipe.imageUrl}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>Час: ${recipe.time} хв</p>
      <div class="buttons">
        <button onclick="editRecipe(${index})">Редагувати</button>
        <button onclick="askDelete(${index})">Видалити</button>
      </div>
    `;
    card.addEventListener('click', (e) => {
  if (!e.target.closest('button')) {
    showRecipeDetails(recipe, index);
  }
});
    recipeList.appendChild(card);
  }
}

function showModal() {
  modal.style.display = 'flex';
}

function hideModal() {
  modal.style.display = 'none';
  form.reset();
  editingIndex = null;
}

function askDelete(index) {
  deletingIndex = index;
  confirmModal.style.display = 'flex';
}

function hideConfirm() {
  confirmModal.style.display = 'none';
  deletingIndex = null;
}

form.onsubmit = function(e) {
  e.preventDefault();
  const recipe = {
    title: form.title.value.trim(),
    time: parseInt(form.time.value),
    ingredients: form.ingredients.value.trim(),
    instructions: form.instructions.value.trim(),
    imageUrl: form.imageUrl.value.trim(),
  };

  const recipes = loadRecipes();
  if (editingIndex !== null) recipes[editingIndex] = recipe;
  else recipes.push(recipe);
  saveRecipes(recipes);
  renderRecipes();
  hideModal();
};

function editRecipe(index) {
  const recipe = loadRecipes()[index];
  form.title.value = recipe.title;
  form.time.value = recipe.time;
  form.ingredients.value = recipe.ingredients;
  form.instructions.value = recipe.instructions;
  form.imageUrl.value = recipe.imageUrl;
  editingIndex = index;
  showModal();
}

function showRecipeDetails(recipe, index) {
  window.location.href = `details.html?id=${index}`;
}


addBtn.onclick = showModal;
cancelBtn.onclick = hideModal;
searchInput.oninput = renderRecipes;
sortSelect.onchange = renderRecipes;
confirmDelete.onclick = function() {
  const recipes = loadRecipes();
  recipes.splice(deletingIndex, 1);
  saveRecipes(recipes);
  renderRecipes();
  hideConfirm();
};
cancelDelete.onclick = hideConfirm;
window.onclick = function(event) {
  if (event.target === modal) hideModal();
  if (event.target === confirmModal) hideConfirm();
};

renderRecipes();