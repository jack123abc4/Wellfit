
// var searchTerm = "fried chicken";
// var fullURL = "https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=03f13ddd&app_key=02579918e4ba389d465eaa6dd2ed2a99"

var mainDiv = document.querySelector("div");
var recipeHeader = document.querySelector("h2");
var recipeParagraph = document.querySelector("p");
var recipeList = document.querySelector("ul");
var recipeImage = document.querySelector("img");
var searchInput = document.querySelector("#recipe-search-input");
var searchButton = document.querySelector("#recipe-search-btn");
var recipeResults = [];

var searchTerm;

function createcard() {
    var outerDiv = document.createElement('div')
    outerDiv.classList.add('flex', 'justify-center',)
    var innerDiv = document.createElement('div')
    innerDiv.classList.add('flex', 'flex-col', 'md:flex-row', 'md:max-w-xl', 'rounded-lg', 'bg-white', 'shadow-lg',)
    outerDiv.appendChild(innerDiv)
    var imgEl = document.createElement('img')
    imgEl.setAttribute('class','flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg')
    innerDiv.appendChild(imgEl)
    var centerDiv = document.createElement('div')
    centerDiv.setAttribute('class','p-6 flex flex-col justify-start')
    centerDiv.setAttribute('id','center-div')
    innerDiv.appendChild(centerDiv)
    return outerDiv;
};

function createRecipeThumbnail(recipe) {
    var card = createcard();
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
    card.querySelector('#center-div').appendChild(recipeDiv)
    return card;
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
        recipeList.appendChild(recipeThumbnail);
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
    console.log("Headers: " + headers);
    console.log("Images: " + images);
}

function searchTermToURL(searchTerm) {
    return ("https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=03f13ddd&app_key=02579918e4ba389d465eaa6dd2ed2a99");
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