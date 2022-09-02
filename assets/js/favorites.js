$('.lists a').click(function(e){
	var favs = $(this).parent().html();
	alert(favs);
  $(this).text('Remove');
});
var mainDiv = document.querySelector("#main-div");
var recipeList = document.querySelector("#favorites-list");
var recipeResults = [];

var recipeIndex = 0;


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
    recipeImage.setAttribute("id", "recipe-thumbnail-" + recipeIndex)
    recipeIndex++;
    var saveButton = document.createElement("button");
    saveButton.state = "saved";
    saveButton.innerHTML = "Unsave";
    saveButton.id = "save-btn-" + recipeIndex;
    saveButton.type = "button";
    saveButton.setAttribute("class", "mt-3 mt-3 bg-white border border-gray-500 hover:border-green-600 text-gray-500 hover:text-green-600 font-bold py-2 px-4 rounded-full mt-3");

    

    recipeDiv.appendChild(recipeHeader);
    recipeDiv.appendChild(recipeImage);
    recipeDiv.appendChild(saveButton);
    card.querySelector('#center-div').appendChild(recipeDiv);
    return card;

}

function displayRecipe(recipe) {
    recipeThumbnail = createRecipeThumbnail(recipe);
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
        if (Object.keys(localStorage)[i].includes("?search=") && Object.keys(localStorage)[i].includes("&num=")) {
            recipeResults.push(Object.keys(localStorage)[i]);
            var params = Object.keys(localStorage)[i];
            var splitParams = params.split("&");
            var searchTerm = splitParams[0].split("=")[1].replace("%20", " ");
            var recipeNum = splitParams[1].split("=")[1];
            var searchURL = searchTermToURL(searchTerm);
            displayResults(searchURL,recipeNum);
        }
        

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



document.addEventListener("click", function(event) {
    console.log(event.target);
    console.log(event.target.tagName);
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
    else if (event.target.classList.contains("search-result") && event.target.tagName === "IMG") {
        var targetedEl = $(event.target);
        var allImgEls = $("img")
        console.log("og target",targetedEl[0]);
        var targetNum = targetedEl[0].id.split("-")[2];
        console.log(targetNum);
        document.location.replace('./singleResult.html' + recipeResults[targetNum]);
        
    }

})

init()
