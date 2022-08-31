// ytapi.js
     
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

 


