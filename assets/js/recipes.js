// html element variables
var recipeHeader = document.querySelector("h2");
var recipeParagraph = document.querySelector("p");
var recipeList = document.querySelector("#recipe-list");
var recipeImage = document.querySelector("img");
var searchInput = document.querySelector("#recipe-search-input");
var searchButton = document.querySelector("#recipe-search-btn");
var recipeResults = [];

var searchTerm;

// creates card wrapper for dynamically created HTML elements
function createCard() {
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

// dynamically creates HTML elements for recipe thumbnails
function createRecipeThumbnail(recipe) {
    var card = createCard();
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
    card.querySelector('#center-div').appendChild(recipeDiv);
    return card;
    return recipeDiv;
}

// displays recipe thumbnails, sets relavent attributes
function displayMultipleRecipes(searchResults) {
    recipeResults = [];
    for (var i = 0; i < searchResults.hits.length; i++) {
        var recipe = searchResults.hits[i].recipe;
        recipeResults.push(recipe);
        recipeThumbnail = createRecipeThumbnail(recipe);
        console.log("rec thumb",recipeThumbnail);
        var thumbnailDiv = recipeThumbnail.querySelector("div");
        var parentThumbnailDiv = $(thumbnailDiv).parent();
        $(thumbnailDiv).attr("id", "recipe-thumbnail-" + i);
        $(parentThumbnailDiv).attr("id", "recipe-thumbnail-" + i);
        $(thumbnailDiv).addClass("recipe-thumbnail", "search-result");
        $(parentThumbnailDiv).addClass("recipe-thumbnail", "search-result");
        console.log("child,parent",thumbnailDiv,parentThumbnailDiv);
        recipeList.appendChild(thumbnailDiv);
    }
    console.log(recipeResults);
}

// pulls data from Edamam API
function displayResults(fullURL) {
    
    fetch(fullURL, {
        method: 'GET', //GET is the default.
        })
        .then(function (response) {
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

// wipes previously displayed thumbnails if completes another recipe search
function wipeResults() {
    var rDivs = recipeList.querySelectorAll("div");
    for (var i = 0; i < rDivs.length; i++) {
        rDivs[i].remove();
    }
    recipeResults = [];
}

// converts user serach term to URL for the Edamam API
function searchTermToURL(searchTerm) {
    return ("https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=03f13ddd&app_key=02579918e4ba389d465eaa6dd2ed2a99");
}

document.addEventListener("click", clickListener);

// handles clicks, looks to see if dynamically created HTML elements have been clicked
function clickListener(event) {
    var targetEl = event.target;
    if (targetEl.classList.contains("search-result")) {
        if (!targetEl.getAttribute("id")) {
            targetEl = $(targetEl).parent();
        }
        console.log("target element",targetEl);
        console.log("children",$(targetEl).children());
        console.log("parent",$(targetEl).parent());
        console.log("grandparent",$(targetEl).parent().parent());
        var grandparent = $(targetEl).parent().parent();
        var recipeNum = grandparent.attr("id").split("-")[2];
        var recipe = recipeResults[recipeNum];
        document.location.replace('./singleResult.html?search=' + searchTerm + "&num=" + recipeNum);
    }
}

// handles clicks on search button
searchButton.addEventListener("click", function() {
    console.log(searchInput.value);
    searchTerm = searchInput.value;
    var searchURL = searchTermToURL(searchInput.value);
    wipeResults();
    displayResults(searchURL);
})

// scrolling
let pageHeight = window.innerHeight;
window.scrollBy(0, pageHeight);

scrollBy();