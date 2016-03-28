var mongodb = require('./mongodb');

var ObjectId = require('mongodb').ObjectID;

var Schema = mongodb.mongoose.Schema;

var MovieSchema = new Schema({
    name           : String,
    alias           : [String],
    publish       : Date,
    create_date   : { type: Date, default: Date.now},
    images        :{
                    coverSmall:String,
                    coverBig:String,
                  },
    source        :[{
                    source:String,
                    link:String,
                    swfLink:String,
                    quality:String,
                    version:String,
                    lang:String,
                    subtitle:String,
                    create_date  : { type: Date, default: Date.now }
                  }]

});

var Movie = mongodb.mongoose.model("movie", MovieSchema);

var MovieDAO = function(){};

MovieDAO.prototype.save = function(obj, callback) {

    obj.publish = new Date( obj.publish );
    var instance = new Movie(obj);

  instance.save(function(err){
    callback(err);
  });
};

MovieDAO.prototype.findByIdAndUpdate = function(obj,callback){
  var _id = obj._id;
  delete obj._id;

  Movie.update({ _id: ObjectId(_id)}, { $set: obj}, function(err,obj){
    callback(err, obj);
  });
}


MovieDAO.prototype.findByName = function(name, callback) {

  Movie.findOne({name: name}, function(err, obj){
    callback(err, obj);
  });

};

MovieDAO.prototype.searchByName = function(name, callback){
  var reg = new RegExp(name);
  console.log(reg)
  Movie.find({name: reg}, function(err, obj){
    callback(err, obj);
  })
}

module.exports = new MovieDAO();