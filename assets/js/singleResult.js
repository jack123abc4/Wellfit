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
var recipeObject;

var ingredientDiv = document.querySelector("#nutrition");
var ingredientHeader = ingredientDiv.querySelector("h3");
var ingredientList = ingredientDiv.querySelector("ul");
var ingredientImage = ingredientDiv.querySelector("img");

var backButton = document.createElement("button");
backButton.setAttribute("id", "back-btn");
backButton.textContent = "Back";

var nutrientsToInclude = ["CA", "CHOCDF", "CHOLE", "FAT", "FE", "FIBTG", "K", "NA", "PROCNT", "SUGAR"];


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
            recipeObject = data.hits[recipeNum].recipe;
            var recipe = data.hits[recipeNum].recipe;
            console.log(recipe);
            console.log(recipe.label);
            recipeHeader.textContent = recipe.label;
            recipeImage.setAttribute("src",recipe.image);
            recipeImage.setAttribute("id","recipe-thumbnail");
            // recipeParagraph.textContent = "This is the recipe."
            for (var i = 0; i < recipe.ingredientLines.length; i++) {
                var recipeLine = document.createElement("li");
                recipeLine.textContent = recipe.ingredientLines[i];
                recipeLine.setAttribute("id", "recipe-line-" + i);
                recipeList.appendChild(recipeLine);
            }
            
            
            mainDiv.appendChild(backButton);
            return data;
        })
        .catch(function(error) {
            console.log(error);
        });
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
  



function searchTermToURL(searchTerm) {
    return ("https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=" + recipeID + "&app_key=" + recipeKey);
}

displaySingleRecipe(window.location.search);

backButton.addEventListener("click", function() {
    document.location.replace('./recipes.html');
})

recipeList.addEventListener("click", function(event){
    var ingredientNum = event.target.getAttribute("id").split("-")[2];
    var ingredientObject = recipeObject.ingredients[ingredientNum];
    console.log(ingredientNum, event.target.textContent);
    console.log(recipeObject.ingredients[ingredientNum]);

    postIngredient(ingredientObject)
        .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
            ingredientHeader.textContent = ingredientObject.food;

            var listItems = ingredientList.querySelectorAll("li");
            for (var i = 0; i < listItems.length; i++) {
                listItems[i].remove();
            }
            

            var caloriesLi = document.createElement("li");
            caloriesLi.textContent = "Calories: " + data.calories;
            ingredientList.appendChild(caloriesLi);
            console.log(data.totalNutrients);
            console.log(data.totalNutrients.FAT);
            for (var i = 0; i < nutrientsToInclude.length; i++) {
                console.log(nutrientsToInclude[i]);
                var nutrientLi = document.createElement("li");
                var nutrientValues = data.totalNutrients[nutrientsToInclude[i]];
                console.log(nutrientValues);
                nutrientLi.textContent = nutrientValues.label + ": " + nutrientValues.quantity + nutrientValues.unit;
                ingredientList.appendChild(nutrientLi);
            }

        });
})

// postIngredient("https://api.edamam.com/api/food-database/v2/nutrients?app_id=ef193ade&app_key=472b382be6ee874666d1ada17c97d073", {
//     "ingredients": [
//       {
//         "quantity": 750,
//         "measureURI": "gram",
//         "foodId": "food_abiw5baauresjmb6xpap2bg3otzu"
//       }
//     ]
//   });

// postIngredient(null)
//     .then((data) => {
//         console.log(data); // JSON data parsed by `data.json()` call
// });