$('.lists a').click(function(e){
	var favs = $(this).parent().html();
	alert(favs);
  $(this).text('Remove');
});