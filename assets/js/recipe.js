
var searchTerm = "";
var fullURL = "https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=03f13ddd&app_key=02579918e4ba389d465eaa6dd2ed2a99"

var mainDiv = document.querySelector("div");
var recipeHeader = document.querySelector("h2");
var recipeParagraph = document.querySelector("p");
var recipeList = document.querySelector("ul");
var recipeImage = document.querySelector("img");


fetch(fullURL, {
    method: 'GET', //GET is the default.
    })
    .then(function (response) {
        // console.log(response);
        return response.json();
    })
    .then(function (data) {
        console.log("First hit:\n");
        var recipe = data.hits[0].recipe;
        console.log(recipe);
        console.log(recipe.label);
        recipeHeader.textContent = recipe.label;
        recipeImage.setAttribute("src",recipe.image);
        // recipeParagraph.textContent = "This is the recipe."
        for (var i = 0; i < recipe.ingredientLines.length; i++) {
            recipeLine = document.createElement("li");
            recipeLine.textContent = recipe.ingredientLines[i];
            recipeList.appendChild(recipeLine);
        }

    })
    .catch(function(error) {
        console.log(error);
    });