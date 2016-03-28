$(function() {

	var mdata={};
	var url = '/javascripts/movie.json';

	var movie=$('#c_editor').attr('movie')
	if(movie){
		url = '/movie/json/'+movie;
	}

	$.getJSON(url, function(data) {
		mdata=data;
	  	render_editor_form(mdata);
	  	render_event_form(mdata);
	});

	var render_editor_form=function(data){
		$('#c_editor').val($.toJSON(data));
	};

	var render_event_form=function(){
		$('#c_save').on('click',function(event){
			var s_data = {};
			s_data['content'] = $('#c_editor').val();

			var url = '';

			if(mdata._id){
				url = '/movie/edit';
			}else{
				url = '/movie/add';
			}

			$.ajax({
			  type: "POST",
			  url: url,
			  data: s_data,
			  success: function (data, textStatus){

			  	  if(data.success){
			  	  	$('#msg').html('成功保存!');
			  	  	$('#msg').addClass('alert alert-success');
			  	  	$(location).attr('href','/movie/' + JSON.parse($('#c_editor').val()).name);
			  	  } else {
			  	  	$('#msg').html(data.err);
			  	  	$('#msg').addClass('alert alert-error');
			  	  }
			  }
			});
		});
	};

	
});