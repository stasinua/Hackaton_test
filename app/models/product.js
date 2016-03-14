//setting up mongoose model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
  title: {type: String, required: true, index: {unique: true}},
  engdescription: {type: String, required: true},
  rusdescription: {type: String, required: true},
  imgsrc: {type: String, required: true},
  price: {type: String, required: true}
});

//Експортируем модель
module.exports = mongoose.model('Product', ProductSchema);
