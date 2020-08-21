var mongoose = require("mongoose");
//SCHEMA SETUP
var productSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    flag: String
});

var Product = mongoose.model("Product", productSchema);

module.exports = Product;