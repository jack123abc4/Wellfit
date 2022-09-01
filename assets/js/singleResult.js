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

var viewButton = document.createElement("button");
viewButton.setAttribute("id", "view-btn");
viewButton.textContent = "View";

var nutrientsToInclude = ["CA", "CHOCDF", "CHOLE", "FAT", "FE", "FIBTG", "K", "NA", "PROCNT", "SUGAR"];
var nutrientValuesByIng = [0,0,0,0,0,0,0,0,0,0];
var caloriesByIng = 0;


function displaySingleRecipe(params) {
    console.log(params);
    var splitParams = params.split("&");
    var searchTerm = splitParams[0].split("=")[1].replace("%20", " ");
    var recipeNum = splitParams[1].split("=")[1];
    console.log(searchTerm, recipeNum);
    var fullURL = recipeSearchToURL(searchTerm);
    getResults(fullURL, recipeNum, searchTerm);


}

function addVideos(data) {

    data.items.forEach((item) => {
        videoData = `
                      <tr>
                      <td>
                      <a target="_blank" href="https://www.youtube.com/watch?v=${item.id.videoId}">
                      ${item.snippet.title}</td>
                      <td>
                      <iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                      </td>
                      <td>
                      <a target="_blank" href="https://www.youtube.com/channel/${item.snippet.channelId}">${item.snippet.channelTitle}</a>
                      </td>
                      </tr
                      `;

        // TODO: FInd an element to display the videos
        $("#vid-layout").append(videoData);
    });
}

async function getResults(fullURL, recipeNum, searchTerm) {
    fetch(fullURL, {
        method: 'GET', //GET is the default.
    })
        .then(function (response) {
            // console.log(response);
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

async function parseIngredient(searchTerm, quantity, unit) {
    fullURL = "https://api.edamam.com/api/food-database/v2/parser?app_id="+ foodID + "&app_key=" + foodKey + "&ingr=" + searchTerm + "&nutrition-type=cooking";
    fetch(fullURL, {
        method: 'GET', //GET is the default.
        })
        .then(function (response) {
            // console.log(response);
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

async function addIngredient(ingredientObject) {

    postIngredient(ingredientObject)
        .then((data) => {
            var ingredientText = data.ingredients[0].parsed[0].quantity + " " + data.ingredients[0].parsed[0].measure + " " + data.ingredients[0].parsed[0].food
            console.log("Added ingr",data);
            data.ingredients[0].parsed[0].text = ingredientText;
            myRecipeObject.ingredients.push(data.ingredients[0].parsed[0]);
            myRecipeObject.ingredientLines.push(ingredientText);
            updateNutrients();
            

            //console.log(caloriesByIng,nutrientValuesByIng);

    });
}

function refresh() {
    // var recipe = data.hits[recipeNum].recipe;
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
    mainDiv.appendChild(viewButton);
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

function getIngredientByText(ingredientText) {
    for (var i = 0; i < myRecipeObject.ingredients.length; i++) {
        if (myRecipeObject.ingredients[i].text === ingredientText) {
            return myRecipeObject.ingredients[i];
        }
    }
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

function replaceIngredient(subIngrText,addIngrText) {
    var quantity = getIngredientByText(subIngrText).quantity;
    var unit = getIngredientByText(subIngrText).measure;
    subtractIngredient(subIngrText);
    parseIngredient(addIngrText,quantity,unit);
}

function displayInputDiv() {
    if (!ingredientDiv.querySelector("#input-div")) {
        var inputDiv = document.createElement("div");
        inputDiv["id"] = "input-div";
        ingredientDiv.appendChild(inputDiv);

        var inputField = document.createElement("input");
        inputField["id"] = "input-field";
        inputDiv.appendChild(inputField);

        var inputButton = document.createElement("button");
        inputButton["textContent"] = "Search";
        inputButton["id"] = "input-btn";
        inputDiv.appendChild(inputButton);
    }   
    


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
                //console.log(nutrientKeys[i]);
                //console.log("single ingredient nutrient value", data.totalNutrients[nutrientKeys[i]]);
                if (data.totalNutrients[nutrientKeys[i]]){
                    myRecipeObject.totalNutrients[nutrientKeys[i]].quantity += data.totalNutrients[nutrientKeys[i]].quantity;
                }
                
                
            }
            console.log(myRecipeObject);
            //console.log(caloriesByIng,nutrientValuesByIng);

        });
    }
    refresh();
    

}


function recipeSearchToURL(searchTerm) {
    return ("https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=" + recipeID + "&app_key=" + recipeKey);
}

displaySingleRecipe(window.location.search);

backButton.addEventListener("click", function() {
    document.location.replace('./recipes.html');
})

viewButton.addEventListener("click", function() {
    refresh();
    ingredientHeader.textContent = "TOTAL NUTRIENTS";

    var caloriesLi = document.createElement("li");
    caloriesLi.textContent = "Calories: " + myRecipeObject.calories;
    ingredientList.appendChild(caloriesLi);

    //console.log(data.totalNutrients.FAT);
    for (var i = 0; i < nutrientsToInclude.length; i++) {
        //console.log(nutrientsToInclude[i]);
        var nutrientLi = document.createElement("li");
        var nutrientValues = myRecipeObject.totalNutrients[nutrientsToInclude[i]];
        //console.log(nutrientValues);
        nutrientLi.textContent = nutrientValues.label + ": " + nutrientValues.quantity + nutrientValues.unit;
        ingredientList.appendChild(nutrientLi);

        //nutrientValuesByIng[i] += nutrientValues.quantity;
    }

})

recipeList.addEventListener("click", function(event){
    refresh();
    // var ingredientNum = event.target.getAttribute("id").split("-")[2];
    var ingredientNum = 0;
    // console.log(myRecipeObject.ingredients[ingredientNum].text);
    // console.log(event.target);
    while (myRecipeObject.ingredients[ingredientNum].text !== event.target.innerHTML) {
        ingredientNum++;
    }
    var ingredientObject = myRecipeObject.ingredients[ingredientNum];
    console.log("ingredient",myRecipeObject.ingredients[ingredientNum]);

    if (ingredientObject.text !== ingredientHeader.innerHTML) {
        postIngredient(ingredientObject)
        .then((data) => {
            //console.log(data); // JSON data parsed by `data.json()` call
            ingredientHeader.textContent = ingredientObject.text;

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
                if (nutrientValues && nutrientValues.quantity > 0) {
                    //console.log(nutrientValues);
                    nutrientLi.textContent = nutrientValues.label + ": " + nutrientValues.quantity + nutrientValues.unit;
                    ingredientList.appendChild(nutrientLi);
                }
                
                

                //nutrientValuesByIng[i] += nutrientValues.quantity;
            }
            if (!ingredientDiv.querySelector("button")) {
                var replaceButton = document.createElement("button");
                replaceButton.setAttribute("id", "replace-btn");
                replaceButton.textContent = "Replace";
                ingredientDiv.appendChild(replaceButton);

                var subtractButton = document.createElement("button");
                subtractButton.setAttribute("id", "sub-btn");
                subtractButton.textContent = "Subtract";
                ingredientDiv.appendChild(subtractButton);
            }
            
            //console.log(caloriesByIng,nutrientValuesByIng);
            return data;

        });
    }
    
})

ingredientDiv.addEventListener("click", function(event) {
    //console.log(event.target.tagName);
    if (event.target.tagName === "BUTTON") {
        // console.log(event.target["id"]);
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