
// API constants
var foodID = "ef193ade";
var foodKey = "472b382be6ee874666d1ada17c97d073";
var foodURL = "https://api.edamam.com/api/food-database/v2/nutrients?app_id=" + foodID + "&app_key=" + foodKey;
var recipeID = "03f13ddd";
var recipeKey = "02579918e4ba389d465eaa6dd2ed2a99";
var maxResults = 1;

// HTML elements
var mainDiv = document.querySelector("#recipe");
var recipeHeader = mainDiv.querySelector("#ingredients-header");
var recipeParagraph = mainDiv.querySelector("p");
var recipeList = mainDiv.querySelector("#ingredients-list");
var recipeImage = mainDiv.querySelector("img");
var myRecipeObject;

var ingredientDiv = document.querySelector("#nutrition");
var ingredientHeader = ingredientDiv.querySelector("h3");
var ingredientList = ingredientDiv.querySelector("ul");
var ingredientImage = ingredientDiv.querySelector("img");

var backButton = document.createElement("button");
backButton.setAttribute("id", "back-btn");
backButton.textContent = "Back";

var viewButton = document.createElement("button");
viewButton.setAttribute("id", "view-btn");
viewButton.textContent = "View";

var modalViewButton = document.querySelector("#modal-nutrition-btn");
var modalHeader = document.querySelector("#modal-header");
var modalList = document.querySelector("#modal-list");
var modalInput = document.querySelector("#modal-input");

var saveButton = document.querySelector("#save-btn");

// variables for nutrient calculations
var nutrientsToInclude = ["CA", "CHOCDF", "CHOLE", "FAT", "FE", "FIBTG", "K", "NA", "PROCNT", "SUGAR"];
var nutrientValuesByIng = [0,0,0,0,0,0,0,0,0,0];
var caloriesByIng = 0;

// displays single recipe
function displaySingleRecipe(params) {
    console.log(params);
    var splitParams = params.split("&");
    var searchTerm = splitParams[0].split("=")[1].replace("%20", " ");
    var recipeNum = splitParams[1].split("=")[1];
    console.log(searchTerm, recipeNum);
    var fullURL = recipeSearchToURL(searchTerm);
    getResults(fullURL, recipeNum, searchTerm);


}

// gets data from Edamam API
async function getResults(fullURL, recipeNum, searchTerm) {
    fetch(fullURL, {
        method: 'GET', //GET is the default.
    })
        .then(function (response) {
            return response.json();
        })
        .then(async function (data) {
            console.log(data);
            myRecipeObject = data.hits[recipeNum].recipe;
            refresh();

            var videos = await getYTVideo(myRecipeObject.label);
            addVideos(videos);

            console.log("YT Videos: ", videos);

            // TODO: Fetch for video with the search term
            return data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

// uses Edamam parse API to convert search term and relavent quantity/unit data into food ID
async function parseIngredient(searchTerm, quantity, unit) {
    fullURL = "https://api.edamam.com/api/food-database/v2/parser?app_id="+ foodID + "&app_key=" + foodKey + "&ingr=" + searchTerm + "&nutrition-type=cooking";
    fetch(fullURL, {
        method: 'GET', //GET is the default.
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            
            data.quantity = quantity;
            data.measure = unit;
            data.foodId = data.parsed[0].food.foodId;
            console.log("Parsed ingredient",data);
            addIngredient(data,quantity,unit);
            
            return data;
        })
        .catch(function(error) {
            console.log(error);
        });
}

// adds ingredient to recipe object
async function addIngredient(ingredientObject) {

    postIngredient(ingredientObject)
        .then((data) => {
            var ingredientText = data.ingredients[0].parsed[0].quantity + " " + data.ingredients[0].parsed[0].measure + " " + data.ingredients[0].parsed[0].food
            console.log("Added ingr",data);
            data.ingredients[0].parsed[0].text = ingredientText;
            myRecipeObject.ingredients.push(data.ingredients[0].parsed[0]);
            myRecipeObject.ingredientLines.push(ingredientText);
            updateNutrients();
    });
}


// cleans up unused HTML elements from screen
function refresh() {
    var recipeLiElements = recipeList.querySelectorAll("li");
    for (var i = 0; i < recipeLiElements.length; i++) {
        recipeLiElements[i].remove();
    }
    if (ingredientDiv.querySelector("#input-div")) {
        ingredientDiv.querySelector("#input-div").remove();
    }

    var ingredientLiElements = ingredientDiv.querySelectorAll("li");
    if (ingredientLiElements) {
        for (var i = 0; i < ingredientLiElements.length; i++) {
            ingredientLiElements[i].remove();
        }
    }
    var ingredientBtnElements = ingredientDiv.querySelectorAll("button");
    if (ingredientBtnElements) {
        for (var i = 0; i < ingredientBtnElements.length; i++) {
            ingredientBtnElements[i].remove();
        }
    }
    var modalLiElements = modalList.querySelectorAll("li");
    if (modalLiElements) {
        for (var i = 0; i < modalLiElements.length; i++) {
            modalLiElements[i].remove();
        }
    }
    ingredientHeader.textContent = "";
    
    
    

    console.log(myRecipeObject);
    console.log(myRecipeObject.label);
    recipeHeader.textContent = myRecipeObject.label;
    recipeImage.setAttribute("src",myRecipeObject.image);
    recipeImage.setAttribute("id","recipe-thumbnail");
    for (var i = 0; i < myRecipeObject.ingredientLines.length; i++) {
        var recipeLine = document.createElement("li");
        recipeLine.textContent = myRecipeObject.ingredientLines[i];
        recipeLine.setAttribute("id", "recipe-line-" + i);
        recipeList.appendChild(recipeLine);
    }
}

// posts ingredient to Edamam API, returns relavent nutritional info
async function postIngredient(ingredientObject) {
    data = {
        "ingredients": [
          {
            "quantity": ingredientObject.quantity,
            "measureURI": ingredientObject.measure,
            "foodId": ingredientObject.foodId,
          }
        ]
      }
    console.log("DATA POSTED", data);
    // Default options are marked with *
    const response = await fetch(foodURL, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

// takes ingredient text line and returns relavent ingredient from recipe object
function getIngredientByText(ingredientText) {
    for (var i = 0; i < myRecipeObject.ingredients.length; i++) {
        if (myRecipeObject.ingredients[i].text === ingredientText) {
            return myRecipeObject.ingredients[i];
        }
    }
}

// removes ingredient from recipe object
function subtractIngredient() { 
    var ingredientText = modalHeader.textContent;
    var newIngredients = [];
    var newIngredientLines = [];
    for (var i = 0; i < myRecipeObject.ingredientLines.length; i++) {
        if (myRecipeObject.ingredientLines[i] !== ingredientText) {
            newIngredientLines.push(myRecipeObject.ingredientLines[i]);
        }
    }
    for (var i = 0; i < myRecipeObject.ingredients.length; i++) {
        if (myRecipeObject.ingredients[i].text !== ingredientText) {
            newIngredients.push(myRecipeObject.ingredients[i]);
        }
    }
    myRecipeObject.ingredientLines = newIngredientLines;
    myRecipeObject.ingredients = newIngredients;
    updateNutrients();
    console.log("Updated recipe obj", myRecipeObject);
    refresh();

}

// replaces ingredient in recipe object
function replaceIngredient() {
    var subIngrText = modalHeader.textContent;
    var addIngrText = modalInput.value;
    var quantity = getIngredientByText(subIngrText).quantity;
    var unit = getIngredientByText(subIngrText).measure;
    subtractIngredient(subIngrText);
    parseIngredient(addIngrText,quantity,unit);
}

// displays input and search button elements in modal dialog to replace ingredient
function displayInputModal() {
    refresh();
    $(document.querySelector("#modal-sub-btn")).css("display","none");
    $(document.querySelector("#modal-replace-btn")).css("display","none");
    $(document.querySelector("#modal-search-btn")).css("display","inline");
    $(document.querySelector("#modal-input-div")).css("display","block");

    toggleModal();  
}

// updates nutrient values based on previously subtracted / replaced ingredients
async function updateNutrients() {
    // calories, ingredientLines, ingredients, totalNutrients,
    myRecipeObject.calories = 0;
    var nutrientKeys = Object.keys(myRecipeObject.totalNutrients);
    for (var i = 0; i < nutrientKeys.length; i++) {
        myRecipeObject.totalNutrients[nutrientKeys[i]].quantity = 0;
    }
    for (var i = 0; i < myRecipeObject.ingredients.length; i++) {
        var ingredientObject = myRecipeObject.ingredients[i];
        postIngredient(ingredientObject)
        .then((data) => {
            myRecipeObject.calories += data.calories;
            for (var i = 0; i < nutrientKeys.length; i++) {
                if (data.totalNutrients[nutrientKeys[i]]){
                    myRecipeObject.totalNutrients[nutrientKeys[i]].quantity += data.totalNutrients[nutrientKeys[i]].quantity;
                }
            }
            console.log(myRecipeObject);
        });
    }
    refresh();
    

}

// converts search term to URL usable by API
function recipeSearchToURL(searchTerm) {
    return ("https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=" + recipeID + "&app_key=" + recipeKey);
}


// handles clicks on back button
backButton.addEventListener("click", function() {
    document.location.replace('./recipes.html');
})

// handles clicks on view nutritional info button
viewButton.addEventListener("click", function() {
    refresh();
    ingredientHeader.textContent = "TOTAL NUTRIENTS";

    var caloriesLi = document.createElement("li");
    caloriesLi.textContent = "Calories: " + Math.round(myRecipeObject.calories);
    ingredientList.appendChild(caloriesLi);

    for (var i = 0; i < nutrientsToInclude.length; i++) {
        var nutrientLi = document.createElement("li");
        var nutrientValues = myRecipeObject.totalNutrients[nutrientsToInclude[i]];
        nutrientLi.textContent = nutrientValues.label + ": " + Math.round(nutrientValues.quantity) + nutrientValues.unit;
        ingredientList.appendChild(nutrientLi);
    }

})

// handles clicks on view nutritional info button, displays modal dialog
modalViewButton.addEventListener("click", function() {
    refresh();

    modalHeader.textContent = "";

    var caloriesLi = document.createElement("li");
    caloriesLi.textContent = "Calories: " + Math.round(myRecipeObject.calories);
    modalList.appendChild(caloriesLi);

    for (var i = 0; i < nutrientsToInclude.length; i++) {
        var nutrientLi = document.createElement("li");
        var nutrientValues = myRecipeObject.totalNutrients[nutrientsToInclude[i]];
        nutrientLi.textContent = nutrientValues.label + ": " + Math.round(nutrientValues.quantity) + nutrientValues.unit;
        modalList.appendChild(nutrientLi);
    
    }
    $(document.querySelector("#modal-input-div")).css("display","none");
    $(document.querySelector("#modal-sub-btn")).css("display","none");
    $(document.querySelector("#modal-search-btn")).css("display","none");
    $(document.querySelector("#modal-replace-btn")).css("display","none");
    toggleModal();

})

// handles clicks on ingredient list elements
recipeList.addEventListener("click", function(event){
    refresh();
    event.preventDefault();
    var ingredientNum = 0;
    while (myRecipeObject.ingredients[ingredientNum].text !== event.target.innerHTML) {
        ingredientNum++;
    }
    var ingredientObject = myRecipeObject.ingredients[ingredientNum];
    console.log("ingredient",myRecipeObject.ingredients[ingredientNum]);

    if (ingredientObject.text !== ingredientHeader.innerHTML) {
        postIngredient(ingredientObject)
        .then((data) => {
            modalHeader.textContent = ingredientObject.text;

            var caloriesLi = document.createElement("li");
            caloriesLi.textContent = "Calories: " + Math.round(data.calories);
            modalList.appendChild(caloriesLi);
            console.log(data.totalNutrients);

            for (var i = 0; i < nutrientsToInclude.length; i++) {
                var nutrientLi = document.createElement("li");
                var nutrientValues = data.totalNutrients[nutrientsToInclude[i]];
                if (nutrientValues && nutrientValues.quantity > 0) {
                    nutrientLi.textContent = nutrientValues.label + ": " + Math.round(nutrientValues.quantity) + nutrientValues.unit;
                    modalList.appendChild(nutrientLi);
                }
            }
            $(document.querySelector("#modal-sub-btn")).css("display","inline");
            $(document.querySelector("#modal-replace-btn")).css("display","inline");
            $(document.querySelector("#modal-input-div")).css("display","none");
            $(document.querySelector("#modal-search-btn")).css("display","none");
    
            toggleModal();
            return data;

        });
        
    }
    
})

// handles clicks on buttons
ingredientDiv.addEventListener("click", function(event) {
    if (event.target.tagName === "BUTTON") {
        if (event.target["id"] === "replace-btn") {
            displayInputDiv();
        }   
        else if (event.target["id"] === "sub-btn") {
            subtractIngredient(ingredientHeader["textContent"]);
        }
        else if (event.target["id"] === "input-btn") {
            replaceIngredient(ingredientHeader["textContent"],document.querySelector("#input-field").value);
        }
           
    }

})

// flips save button depending on recipe save state
function flipSaveButton() {
    if (saveButton.state === "unsaved") {
        saveButton.state = "saved";
        saveButton.innerHTML = "Unsave"
    }
    else {
        saveButton.state = "unsaved";
        saveButton.innerHTML = "Save";
    }
}

// handles clicks on save button
saveButton.addEventListener("click", function(){
    if (localStorage.getItem(window.location.search)) {
        console.log("Unsaved!")
        localStorage.removeItem(window.location.search);
    }
    else {
        console.log("Saved!");
        localStorage.setItem(window.location.search,"saved");
    }
    flipSaveButton();


})

// toggles modal dialog state
function toggleModal () {
    const body = document.querySelector('body')
    const modal = document.querySelector('.modal')
    modal.classList.toggle('opacity-0')
    modal.classList.toggle('pointer-events-none')
    body.classList.toggle('modal-active')
}

// called on page loading
function init() {
    displaySingleRecipe(window.location.search);
    saveButton.state = "unsaved"
    if (localStorage.getItem(window.location.search)) {
        console.log("Recipe is saved.");
        saveButton.state = "saved";
        saveButton.innerHTML = "Unsave"
    }
    else {
        console.log("Recipe is unsaved.");
        saveButton.state = "unsaved";
        saveButton.innerHTML = "Save";
    }

    // sets up modal dialog element
    var openmodal = document.querySelectorAll('.modal-open')
    for (var i = 0; i < openmodal.length; i++) {
    openmodal[i].addEventListener('click', function(event){
        event.preventDefault()
        toggleModal()
    })
    }

    const overlay = document.querySelector('.modal-overlay')
    overlay.addEventListener('click', toggleModal)

    const modalSubButton = document.querySelector('#modal-sub-btn')
    modalSubButton.addEventListener('click', subtractIngredient)

    const modalReplaceButton = document.querySelector('#modal-replace-btn')
    modalReplaceButton.addEventListener('click', displayInputModal)

    const modalSearchButton = document.querySelector('#modal-search-btn')
    modalSearchButton.addEventListener('click', replaceIngredient)

    var closemodal = document.querySelectorAll('.modal-close')
    for (var i = 0; i < closemodal.length; i++) {
    closemodal[i].addEventListener('click', toggleModal)
    }

    document.onkeydown = function(evt) {
    evt = evt || window.event
    var isEscape = false
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc")
    } else {
        isEscape = (evt.keyCode === 27)
    }
    if (isEscape && document.body.classList.contains('modal-active')) {
        toggleModal()
    }
    };
}

init();