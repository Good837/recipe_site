document.addEventListener("DOMContentLoaded", () => {
  const recipeContainer = document.getElementById("recipe-detail-container");
  const params = new URLSearchParams(window.location.search);
  const recipeId = parseInt(params.get("id"));

  const recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
  const recipe = recipes[recipeId];

  if (recipe) {
    recipeContainer.innerHTML = `
      <div class="recipe-detail-card">
        <img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-detail-image" />
        <h2>${recipe.title}</h2>
        <p><strong>Час приготування:</strong> ${recipe.time} хв</p>
        <p><strong>Інгредієнти:</strong><br>${recipe.ingredients.replace(/\n/g, "<br>")}</p>
        <p><strong>Інструкції:</strong><br>${recipe.instructions.replace(/\n/g, "<br>")}</p>
      </div>
    `;
  } else {
    recipeContainer.innerHTML = `<p>Рецепт не знайдено.</p>`;
  }
});
