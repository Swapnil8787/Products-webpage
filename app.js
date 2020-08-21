var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    Product = require("./models/product");

var url = process.env.DATABASEURL || "{use your Mongo Atlas Cluster Url here}";
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(() => { console.log('Connected to DB!'); }).catch(err => { console.log("Error :", err.message) });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));



app.get("/", function(req, res) {
    res.render("home");
});
app.get("/products", function(req, res) {
    Product.find({}, function(err, products_db) {
        if (err) {
            console.log(err);
        } else {
            res.render("products/index", { products: products_db });
        }
    })
});

//CREATE - add new products
app.post("/products", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newProd = { name: name, image: image, description: description, flag: "yes" };
    Product.create(newProd, function(err, newlyProd) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/products");
        }
    });
});

//NEW - display form to add new products
app.get("/products/new", function(req, res) {
    res.render("products/new");
});

//SHOW - show products
app.get("/products/:id", function(req, res) {
    Product.findById(req.params.id, function(err, foundProd) {
        if (err) {
            console.log(err);
        } else {
            res.render("products/show", { Prod: foundProd });
        }
    })
});

//EDIT
app.get("/products/:id/edit", function(req, res) {
    Product.findById(req.params.id, function(err, foundProd) {
        res.render("products/edit", { product: foundProd });
    });
});

//UPDATE
app.put("/products/:id", function(req, res) {
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/products");
        }
    });
});

//DELETE
app.delete("/products/:id", function(req, res) {
    Product.findById(req.params.id, function(err, newProd) {
        if (err) {
            res.redirect("/products");
        } else {
            newProd.flag = "no";
            newProd.save();
            res.redirect("/products");
        }
    });
});


var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});