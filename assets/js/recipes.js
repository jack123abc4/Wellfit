
// var searchTerm = "fried chicken";
// var fullURL = "https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=03f13ddd&app_key=02579918e4ba389d465eaa6dd2ed2a99"
var foodID = "ef193ade";
var foodKey = "472b382be6ee874666d1ada17c97d073";
var recipeID = "03f13ddd";
var recipeKey = "02579918e4ba389d465eaa6dd2ed2a99";


var mainDiv = document.querySelector("div");
var recipeHeader = document.querySelector("h2");
var recipeParagraph = document.querySelector("p");
var recipeList = document.querySelector("ul");
var recipeImage = document.querySelector("img");
var searchInput = document.querySelector("#recipe-search-input");
var searchButton = document.querySelector("#recipe-search-btn");
var recipeResults = [];

var searchTerm;


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
function displayResults(fullURL) {
    wipeResults();
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

function wipeResults() {
    
    var headers = document.querySelectorAll("h3");
    var images = document.querySelectorAll("img");
    console.log("Headers: " + headers);
    console.log("Images: " + images);
    for (var i = 0; i < headers.length; i++) {
        headers[i].remove();
        images[i].remove();
        
    }
    images[images.length-1].remove();
    console.log("Headers: " + headers);
    console.log("Images: " + images);
}

function searchTermToURL(searchTerm) {
    return ("https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=" + recipeID + "&app_key=" + recipeKey);
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
        document.location.replace('./singleResult.html?search=' + searchTerm + "&num=" + recipeNum);
    }
}

searchButton.addEventListener("click", function() {
    console.log(searchInput.value);
    searchTerm = searchInput.value;
    var searchURL = searchTermToURL(searchInput.value);
    displayResults(searchURL);
})
//displayResults();


// {
//     "ingredients": [
//         {
//             "quantity": 0,
//             "measureURI": "750 gram",
//             "foodID": "food_abiw5baauresjmb6xpap2bg3otzu"
//         }
//     ]
// }