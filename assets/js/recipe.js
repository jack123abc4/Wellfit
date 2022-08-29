
var searchTerm = "toast";
var fullURL = "https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=03f13ddd&app_key=02579918e4ba389d465eaa6dd2ed2a99"

var mainDiv = document.querySelector("div");
var recipeHeader = document.querySelector("h2");
var recipeParagraph = document.querySelector("p");
var recipeList = document.querySelector("ul");
var recipeImage = document.querySelector("img");

var recipeResults = [];



function createRecipeThumbnail(recipe) {
    console.log(recipe.label);
    var recipeDiv = document.createElement("div");
    var recipeHeader = document.createElement("h3");
    recipeHeader.textContent = recipe.label;
    recipeHeader.classList.add("recipe-thumbnail-header", "search-result");
    var recipeImage = document.createElement("img");
    recipeImage.setAttribute("src", recipe.image);
    recipeImage.classList.add("recipe-thumbnail-img", "search-result");
    recipeDiv.appendChild(recipeHeader);
    recipeDiv.appendChild(recipeImage);
    return recipeDiv;

}

function displayMultipleRecipes(searchResults) {
    recipeResults = [];
    for (var i = 0; i < searchResults.hits.length; i++) {
        var recipe = searchResults.hits[i].recipe;
        recipeResults.push(recipe);
        recipeThumbnail = createRecipeThumbnail(recipe);
        recipeThumbnail.setAttribute("id", "recipe-thumbnail-" + i);
        recipeThumbnail.classList.add("recipe-thumbnail", "search-result");
        mainDiv.appendChild(recipeThumbnail);
    }
    console.log(recipeResults);
}
function displayResults() {
    fetch(fullURL, {
        method: 'GET', //GET is the default.
        })
        .then(function (response) {
            // console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var recipe = data.hits[0].recipe;
            displayMultipleRecipes(data);
        })
        .catch(function(error) {
            console.log(error);
        });
}


document.addEventListener("click", clickListener);

function clickListener(event) {
    var targetEl = event.target;
    if (targetEl.classList.contains("search-result")) {
        if (!targetEl.getAttribute("id")) {
            targetEl = $(targetEl).parent();
        }
        console.log(targetEl);
        console.log(targetEl.attr("id"));
        
        var recipeNum = targetEl.attr("id").split("-")[2];
        var recipe = recipeResults[recipeNum];
        document.location.replace('./result.html?search=' + searchTerm + "&num=" + recipeNum);
    }
}

displayResults();