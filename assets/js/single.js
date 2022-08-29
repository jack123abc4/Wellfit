var mainDiv = document.querySelector("div");
var recipeHeader = document.querySelector("h2");
var recipeParagraph = document.querySelector("p");
var recipeList = document.querySelector("ul");
var recipeImage = document.querySelector("img");

var fullURL = "https://api.edamam.com/api/recipes/v2?type=public&q=" + "fried chicken" + "&app_id=03f13ddd&app_key=02579918e4ba389d465eaa6dd2ed2a99"

function displaySingleRecipe(params) {
    console.log(params);
    var splitParams = params.split("&");
    var searchTerm = splitParams[0].split("=")[1].replace("%20", " ");
    var recipeNum = splitParams[1].split("=")[1];
    console.log(searchTerm,recipeNum);
    console.log(searchTermToURL(searchTerm));
    var results = getResults(searchTerm);
    console.log(results);
    var recipe = results.hits[recipeNum].recipe;
    console.log(recipe);
    console.log(recipe.label);
    recipeHeader.textContent = recipe.label;
    recipeImage.setAttribute("src",recipe.image);
    recipeImage.setAttribute("id","recipe-thumbnail");
    // recipeParagraph.textContent = "This is the recipe."
    for (var i = 0; i < recipe.ingredientLines.length; i++) {
        var recipeLine = document.createElement("li");
        recipeLine.textContent = recipe.ingredientLines[i];
        recipeList.appendChild(recipeLine);
    }
}

function getResults(searchTerm) {
    fetch(fullURL, {
        method: 'GET', //GET is the default.
        })
        .then(function (response) {
            // console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            return data;
        })
        .catch(function(error) {
            console.log(error);
        });
}

function searchTermToURL(searchTerm) {
    return ("https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=03f13ddd&app_key=02579918e4ba389d465eaa6dd2ed2a99")
}

displaySingleRecipe(window.location.search);