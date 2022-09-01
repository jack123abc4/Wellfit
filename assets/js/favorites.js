$('.lists a').click(function(e){
	var favs = $(this).parent().html();
	alert(favs);
  $(this).text('Remove');
});
var mainDiv = document.querySelector("#main-div");
var recipeHeader = mainDiv.querySelector("h2");
var recipeParagraph = mainDiv.querySelector("p");
var recipeList = mainDiv.querySelector("ul");
var recipeImage = mainDiv.querySelector("img");
var recipeResults = [];

var recipeIndex = 0;

function createRecipeThumbnail(recipe) {
    console.log(recipe.label);
    var recipeDiv = document.createElement("div");
    var recipeHeader = document.createElement("h3");
    recipeHeader.textContent = recipe.label;
    recipeHeader.classList.add("recipe-thumbnail-header", "search-result");
    var recipeImage = document.createElement("img");
    recipeImage.setAttribute("src", recipe.image);
    recipeImage.classList.add("recipe-thumbnail-img", "search-result");
    var saveButton = document.createElement("button");
    saveButton.state = "saved";
    saveButton.innerHTML = "Unsave";
    saveButton.id = "save-btn-" + recipeIndex;
    saveButton.classList.add("is-medium")

    recipeDiv.appendChild(recipeHeader);
    recipeDiv.appendChild(recipeImage);
    recipeDiv.appendChild(saveButton);
    return recipeDiv;

}

function displayRecipe(recipe) {
    recipeThumbnail = createRecipeThumbnail(recipe);
    recipeThumbnail.setAttribute("id", "recipe-thumbnail-" + recipeIndex);
    recipeIndex++;
    recipeThumbnail.classList.add("recipe-thumbnail", "search-result");
    recipeList.appendChild(recipeThumbnail);
}
function displayResults(fullURL,recipeNum) {
    wipeResults();
    fetch(fullURL, {
        method: 'GET', //GET is the default.
        })
        .then(function (response) {
            // console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log("Data",data);
            var recipe = data.hits[recipeNum].recipe;
            displayRecipe(recipe);
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

function init() {
    for (var i = 0; i < Object.keys(localStorage).length; i++) {
        recipeResults.push(Object.keys(localStorage)[i]);
        var params = Object.keys(localStorage)[i];
        var splitParams = params.split("&");
        var searchTerm = splitParams[0].split("=")[1].replace("%20", " ");
        var recipeNum = splitParams[1].split("=")[1];
        var searchURL = searchTermToURL(searchTerm);
        displayResults(searchURL,recipeNum);

    }
    
}

function flipSaveButton(buttonNum) {
    var saveButton = mainDiv.querySelectorAll("button")[buttonNum];
    console.log(saveButton);
    if (saveButton.state === "unsaved") {
        saveButton.state = "saved";
        saveButton.innerHTML = "Unsave"
    }
    else {
        saveButton.state = "unsaved";
        saveButton.innerHTML = "Save";
    }
}



mainDiv.addEventListener("click", function(event) {
    //console.log(event.target.tagName);
    if (event.target.tagName === "BUTTON") {
        console.log(event.target);
        // console.log(event.target["id"]);
        if (event.target["id"].includes("save-btn")) {
            recipeNum = event.target["id"].split("-")[2]
            console.log("Save button # " + recipeNum + " clicked");
            flipSaveButton(recipeNum);
            if (localStorage.getItem(recipeResults[recipeNum])) {
                localStorage.removeItem(recipeResults[recipeNum]);
            }
            else {
                localStorage.setItem(recipeResults[recipeNum], "saved");
            }

        }   
        // else if (event.target["id"] === "sub-btn") {
        //     subtractIngredient(ingredientHeader["textContent"]);
        // }
        // else if (event.target["id"] === "input-btn") {
        //     replaceIngredient(ingredientHeader["textContent"],document.querySelector("#input-field").value);
        // }
           
    }

})

init()
