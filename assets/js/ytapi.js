// ytapi.js

// var mainDiv = document.querySelector("div");
// var recipeHeader = document.querySelector("h2");
// var recipeList = document.querySelector("ul");
// var recipeImage = document.querySelector("img");
// var searchInput = document.querySelector("#recipe-search-input");
// var searchButton = document.querySelector("#recipe-search-btn");

// var searchTerm;

// let videoEl = document.querySelector('.ytRecipe')
// // let recipeNoSpace = document.querySelector('.')

// // api key
// let YTKEY = "AIzaSyBY1dL8Q9nkhqy5NfIC-4sruEtjLYyoEHU";
// let EDKEY = "02579918e4ba389d465eaa6dd2ed2a99"

// function createRecipeThumbnail(recipe) {
//     console.log(recipe.label);d
//     var recipeDiv = document.createElement("div");
//     var recipeHeader = document.createElement("h3");
//     recipeHeader.textContent = recipe.label;
//     recipeHeader.classList.add("recipe-thumbnail-header", "search-result");
//     var recipeImage = document.createElement("img");
//     recipeImage.setAttribute("src", recipe.image);
//     recipeImage.classList.add("recipe-thumbnail-img", "search-result");
//     recipeDiv.appendChild(recipeHeader);
//     recipeDiv.appendChild(recipeImage);
//     return recipeDiv;
// }

// function searchTermToURL(searchTerm) {
//     return ("https://api.edamam.com/api/recipes/v2?type=public&q=" + searchTerm + "&app_id=03f13ddd&app_key=02579918e4ba389d465eaa6dd2ed2a99");
// }

// document.addEventListener("click", clickListener);

// function clickListener(event) {
//     var targetEl = event.target;
//     if (targetEl.classList.contains("search-result")) {
//         if (!targetEl.getAttribute("id")) {
//             targetEl = $(targetEl).parent();
//         }
//         console.log(targetEl);
//         console.log(targetEl.attr("id"));
        
//         var recipeNum = targetEl.attr("id").split("-")[2];
//         var recipe = recipeResults[recipeNum];
//         document.location.replace('./result.html?search=' + searchTerm + "&num=" + recipeNum);
//     }
// }

// searchButton.addEventListener("click", function() {
//     console.log(searchInput.value);
//     searchTerm = searchInput.value;
//     var searchURL = searchTermToURL(searchInput.value);
//     displayResults(searchURL);
// })

// let recipeNoSpace = searchInput.textContent
// recipeNoSpace = recipeNoSpace.split(' ').join('');

// let youtubeUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${recipeNoSpace}%20recipe=&key=${YTKEY}`;

// fetch(youtubeUrl, {})
// .then(function (response) {
//     return response.json();
// })

// .then(function (data) {
//     videoEl.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${data.items[0].id.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
// });

$(document).ready(function() {

    var YTKEY = "AIzaSyBY1dL8Q9nkhqy5NfIC-4sruEtjLYyoEHU";
    var search = "";
    var duration = "any";
    var filter = "relevance";
    var maxResults=3
   
    $("#duration").change(function () {
      duration = $(this).children("option:selected").val();
    });
    $("#filter").change(function () {
      filter = $(this).children("option:selected").val();
    });
    $("#myForm").submit(function (e) {
      e.preventDefault();
   
      search = $("#search").val();
   
      var url = `https://www.googleapis.com/youtube/v3/search?key=${YTKEY}
          &part=snippet&q=${search}&maxResults=${maxResults}&order=${filter}&videoDuration=${duration}&type=video`;
   
      $.ajax({
        method: "GET",
        url: url,
        beforeSend: function () {
          $("#btn").attr("disabled", true);
          $("#results").empty();
        },
        success: function (data) {
          console.log(data);
          $("#btn").attr("disabled", false);
          displayVideos(data);
        },
      });
    });
   
    $("#search").change(function () {
      search = $("#search").val();
    });
   
    function displayVideos(data) {
    
      $("#search").val("");
   
      var videoData = "";
   
      $("#table").show();
   
      data.items.forEach((item) => {
        videoData = `
                      <tr>
                      <td>
                      <a target="_blank" href="https://www.youtube.com/watch?v=${item.id.videoId}">
                      ${item.snippet.title}</td>
                      <td>
                      <iframe width="560" height="315" src="https://www.youtube.com/embed/${data.items[0].id.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                      </td>
                      <td>
                      <a target="_blank" href="https://www.youtube.com/channel/${item.snippet.channelId}">${item.snippet.channelTitle}</a>
                      </td>
                      </tr
                      `;
   
        $("#results").append(videoData);
      });
    }
  });

 


