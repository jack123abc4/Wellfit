// ytapi.sj

// variables
var YTKEY = "AIzaSyBY1dL8Q9nkhqy5NfIC-4sruEtjLYyoEHU";
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

  $("#duration").change(function() {
    duration = $(this).children("option:selected").val();
  });
  $("#vid-filter").change(function() {
    filter = $(this).children("option:selected").val();
  });
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

    $("#search-bar").val("");

    var videoData = "";

    $("#vid-layout").show();

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
      $("#results").append(videoData);
    });
  }
});