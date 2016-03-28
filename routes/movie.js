var movie = require('./../models/movie.js');

var url = require('url');


exports.movieAdd = function(req, res) {
    // if(req.params.name){//update
    //     Movie.findByName(req.params.name,function(err, obj){
    //         console.log(obj);
    //         if(obj){
    //             return res.render('admin/movieAdd', {
    //                 title:req.params.name+'|电影|管理|moive.me',
    //                 label:'编辑电影:'+req.params.name,
    //                 page:'admin',nav:'admin.movie',
    //                 obj:obj
    //             }); 
    //         }
    //     });
    // } else {
    //     return res.render('admin/movieAdd', {//add
    //         title:'新增加|电影|管理|moive.me',
    //         label:'新增加电影',
    //         page:'admin',nav:'admin.movie',
    //         obj:false
    //     });
    // }

    if(req.params.name){//update
        return res.render('movie', {
            title:req.params.name+'|电影|管理|moive.me',
            label:'编辑电影:'+req.params.name,
            movie:req.params.name
        });
    } else {
        return res.render('movie',{
            title:'新增加|电影|管理|moive.me',
            label:'新增加电影',
            movie:false
        });
    }
};

exports.doMovieAdd = function(req, res) {

    var json = req.body.content;

    json = JSON.parse(json);

    movie.save(json, function(err){
        if(err) {
            res.send({'success':false,'err':err});
        } else {
            res.send({'success':true});
            // res.json({'success':true});
        }
    }); 

};

exports.doMovieEdit = function(req, res) {

    var json = req.body.content;

    json = JSON.parse(json);

    movie.findByIdAndUpdate(json, function(err){
        if(err) {
            res.send({'success':false,'err':err});
        } else {
            res.send({'success':true});
            // res.json({'success':true});
        }
    }); 

};


exports.movieJSON = function(req, res) {

    movie.findByName(req.params.name,function(err, obj){
        res.send(obj);
    });

}

exports.search = function(req, res){

    var name = req.body.name

    if(name){
    // search
    
        movie.searchByName(name, function(err, obj){
            return res.render('search', {
                title: '电影列表|moive.me',
                label: '电影搜索',
                movie: name,
                list: obj
            });
        });

    }else{

        return res.render('search', {
            title: '电影列表|moive.me',
            label: '电影搜索',
            movie: '',
            list: []
        });

    }

}

