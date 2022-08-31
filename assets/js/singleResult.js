var foodID = "ef193ade";
var foodKey = "472b382be6ee874666d1ada17c97d073";
var foodURL = "https://api.edamam.com/api/food-database/v2/nutrients?app_id=" + foodID + "&app_key=" + foodKey;
var recipeID = "03f13ddd";
var recipeKey = "02579918e4ba389d465eaa6dd2ed2a99";


var mainDiv = document.querySelector("#recipe");
var recipeHeader = mainDiv.querySelector("h2");
var recipeParagraph = mainDiv.querySelector("p");
var recipeList = mainDiv.querySelector("ul");
var recipeImage = mainDiv.querySelector("img");
var myRecipeObject;

var ingredientDiv = document.querySelector("#nutrition");
var ingredientHeader = ingredientDiv.querySelector("h3");
var ingredientList = ingredientDiv.querySelector("ul");
var ingredientImage = ingredientDiv.querySelector("img");

var backButton = document.createElement("button");
backButton.setAttribute("id", "back-btn");
backButton.textContent = "Back";

var nutrientsToInclude = ["CA", "CHOCDF", "CHOLE", "FAT", "FE", "FIBTG", "K", "NA", "PROCNT", "SUGAR"];
var nutrientValuesByIng = [0,0,0,0,0,0,0,0,0,0];
var caloriesByIng = 0;


function displaySingleRecipe(params) {
    console.log(params);
    var splitParams = params.split("&");
    var searchTerm = splitParams[0].split("=")[1].replace("%20", " ");
    var recipeNum = splitParams[1].split("=")[1];
    console.log(searchTerm,recipeNum);
    var fullURL = searchTermToURL(searchTerm);
    getResults(fullURL,recipeNum);
    
    
}

async function getResults(fullURL,recipeNum) {
    fetch(fullURL, {
        method: 'GET', //GET is the default.
        })
        .then(function (response) {
            // console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            myRecipeObject = data.hits[recipeNum].recipe;
            refresh();
            return data;
        })
        .catch(function(error) {
            console.log(error);
        });
}

function refresh() {
    // var recipe = data.hits[recipeNum].recipe;
    var recipeLiElements = recipeList.querySelectorAll("li");
    for (var i = 0; i < recipeLiElements.length; i++) {
        recipeLiElements[i].remove();
    }
    var ingredientLiElements = ingredientDiv.querySelectorAll("li");
    if (ingredientLiElements) {
        for (var i = 0; i < ingredientLiElements.length; i++) {
            ingredientLiElements[i].remove();
        }
    }
    var ingredientBtnElements = ingredientDiv.querySelectorAll("button");
    if (ingredientBtnElements) {
        // console.log("Buttons", ingredientBtnElements);
        for (var i = 0; i < ingredientBtnElements.length; i++) {
            // console.log(ingredientBtnElements[i]);
            ingredientBtnElements[i].remove();
        }
    }
    ingredientHeader.textContent = "";
    
    
    

    console.log(myRecipeObject);
    console.log(myRecipeObject.label);
    recipeHeader.textContent = myRecipeObject.label;
    recipeImage.setAttribute("src",myRecipeObject.image);
    recipeImage.setAttribute("id","recipe-thumbnail");
    // recipeParagraph.textContent = "This is the recipe."
    for (var i = 0; i < myRecipeObject.ingredientLines.length; i++) {
        var recipeLine = document.createElement("li");
        recipeLine.textContent = myRecipeObject.ingredientLines[i];
        recipeLine.setAttribute("id", "recipe-line-" + i);
        recipeList.appendChild(recipeLine);
    }
    
    
    mainDiv.appendChild(backButton);
}

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
  
function subtractIngredient(ingredientText) { 
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

async function updateNutrients() {
    // calories, ingredientLines, ingredients, totalNutrients,
    myRecipeObject.calories = 0;
    var nutrientKeys = Object.keys(myRecipeObject.totalNutrients);
    for (var i = 0; i < nutrientKeys.length; i++) {
        //console.log("This thing", myRecipeObject.totalNutrients[nutrientKeys]);
        myRecipeObject.totalNutrients[nutrientKeys[i]].quantity = 0;
    }
    for (var i = 0; i < myRecipeObject.ingredients.length; i++) {
        var ingredientObject = myRecipeObject.ingredients[i];
        postIngredient(ingredientObject)
        .then((data) => {
            // console.log("Data", data);
            myRecipeObject.calories += data.calories;
            for (var i = 0; i < nutrientKeys.length; i++) {
                console.log(nutrientKeys[i]);
                console.log("single ingredient nutrient value", data.totalNutrients[nutrientKeys[i]]);
                if (data.totalNutrients[nutrientKeys[i]]){
                    myRecipeObject.totalNutrients[nutrientKeys[i]].quantity += data.totalNutrients[nutrientKeys[i]].quantity;
                }
                
                
            }
            console.log(myRecipeObject);
            //console.log(caloriesByIng,nutrientValuesByIng);

        });
    }
    

}


function searchTermToURL(searchTerm) {
    return ("https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=" + recipeID + "&app_key=" + recipeKey);
}

displaySingleRecipe(window.location.search);

backButton.addEventListener("click", function() {
    document.location.replace('./recipes.html');
})

recipeList.addEventListener("click", function(event){
    // var ingredientNum = event.target.getAttribute("id").split("-")[2];
    var ingredientNum = 0;
    // console.log(myRecipeObject.ingredients[ingredientNum].text);
    // console.log(event.target);
    while (myRecipeObject.ingredients[ingredientNum].text !== event.target.innerHTML) {
        ingredientNum++;
    }
    var ingredientObject = myRecipeObject.ingredients[ingredientNum];
    console.log(ingredientNum, event.target.textContent);
    console.log(myRecipeObject.ingredients[ingredientNum]);

    postIngredient(ingredientObject)
        .then((data) => {
            //console.log(data); // JSON data parsed by `data.json()` call
            ingredientHeader.textContent = ingredientObject.text;

            var listItems = ingredientList.querySelectorAll("li");
            for (var i = 0; i < listItems.length; i++) {
                listItems[i].remove();
            }
            

            var caloriesLi = document.createElement("li");
            caloriesLi.textContent = "Calories: " + data.calories;
            ingredientList.appendChild(caloriesLi);

            //caloriesByIng += data.calories;
            console.log(data.totalNutrients);
            //console.log(data.totalNutrients.FAT);
            for (var i = 0; i < nutrientsToInclude.length; i++) {
                //console.log(nutrientsToInclude[i]);
                var nutrientLi = document.createElement("li");
                var nutrientValues = data.totalNutrients[nutrientsToInclude[i]];
                //console.log(nutrientValues);
                nutrientLi.textContent = nutrientValues.label + ": " + nutrientValues.quantity + nutrientValues.unit;
                ingredientList.appendChild(nutrientLi);

                //nutrientValuesByIng[i] += nutrientValues.quantity;
            }
            if (!ingredientDiv.querySelector("button")) {
                var addButton = document.createElement("button");
                addButton.setAttribute("id", "add-btn");
                addButton.textContent = "Add";
                ingredientDiv.appendChild(addButton);

                var subtractButton = document.createElement("button");
                subtractButton.setAttribute("id", "sub-btn");
                subtractButton.textContent = "Subtract";
                ingredientDiv.appendChild(subtractButton);
            }
            
            //console.log(caloriesByIng,nutrientValuesByIng);
            return data;

        });
})

ingredientDiv.addEventListener("click", function(event) {
    //console.log(event.target.tagName);
    if (event.target.tagName === "BUTTON") {
        // console.log(event.target["id"]);
        if (event.target["id"] === "add-btn") {
            //
        }   
        else if (event.target["id"] === "sub-btn") {
            subtractIngredient(ingredientHeader["textContent"]);
        }
           
    }

})