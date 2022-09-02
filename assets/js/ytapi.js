// ytapi.sj

// variables
var YTKEY = "AIzaSyAlYrgp2sgGj3bMROSzqJ4PXpegUI6VgYM";
var search = "";
var duration = "any";
var filter = "relevance";
var maxResults = 1;

// ES6 - Async/Await
// Module/Reusable function
async function getYTVideo(search) {
  var url = `https://www.googleapis.com/youtube/v3/search?key=${YTKEY}
        &part=snippet&q=${search}&maxResults=${maxResults}&order=${filter}&videoDuration=${duration}&type=video`;
  try {

    var result = await $.ajax({
      method: "GET",
      url
    });

    return result;
  } catch (error) {
    console.log("Error fetching for Youtube Videos");
  }
}

$(document).ready(function() {

  // $("#duration").change(function () {
  //   duration = $(this).children("option:selected").val();
  // });
  // $("#vid-filter").change(function () {
  //   filter = $(this).children("option:selected").val();
  // });
  $("#vidForm").submit(async function(e) {
    e.preventDefault();

    search = $("#search-bar").val();

    $("#search-btn").attr("disabled", true);
    $("#results").empty();

    var videos = await getYTVideo(search);

    console.log(videos);
    $("#search-btn").attr("disabled", false);
    displayVideos(videos);
  });

  $("#search-bar").change(function() {
    search = $("#search-bar").val();
  });

  function displayVideos(data) {
    for (var i = 0; i < $(document.querySelector("#ytRecipe")).children().length; i++) {
      $(document.querySelector("#ytRecipe")).children()[i].remove();
    }
    $("#search-bar").val("");

    var videoData = "";

    $("#vid-layout").show();

    data.items.forEach((item) => {
      videoData = `
                    <iframe width="800" height="500" src="https://www.youtube.com/embed/${item.id.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    `;
      $("#ytRecipe").append(videoData);
    });
  }
});


