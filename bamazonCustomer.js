var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "banshee1",
    database: "bamazon"
});

connection.connect(function(err) {
    if(err) throw err; 
});

var productID;
var selProductPrice;
var selProductStock;

function displayProducts() {
    inquirer.prompt({
        name:"welcome",
        type:"confirm",
        message:"Welcome to Bamazon! Would you like to take a look at today's inventory?"
    }).then(function(answer) {
        if (answer.welcome) {
            console.log("Here is today's inventory...");
            var query = "SELECT item_id, product_name, price FROM products";
            connection.query(query, function(err, res) {
                if(err) throw err;
                console.log(`
Item ID: ${res.item_id}
Item Name: ${res.product_name}
Price: ${res.price}
`)
                productIDPrompt();
            })
        } else {
            console.log("Sorry, please input a valid item ID number.")
            displayProducts();
        }
    })
}

function productIDPrompt() {
    inquirer.prompt({
        name: "ask",
        message: "Please input the ID of the product you would like to buy."
    }).then(function(answer) {
        productID = answer.ask;
        var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";
        connection.query(query, { item_id: answer.ask}, function(err, res) {
            if (err) throw err;
            selProductPrice = res.price;
            selProductStock = res.stock_quantity;
            console.log(`Here is the requested item information: ${res}`);
            quantityPrompt(selProductStock);
        })
    })
}

function quantityPrompt(stock) {
    inquirer.prompt({
        name: "quantity",
        message: "How many units of the product would you like to buy?"
    }).then(function(answer) {
        if (answer.name > stock) {
        console.log("Thank you! Your order has been placed.");
        var query = "UPDATE products SET ? WHERE ?";
        connection.query(query, {stock_quantity: stock_quantity - answer.name, item_id = productID}, function(err, res) {
            if (err) throw err;
            var total = selProductPrice * answer.name;
            console.log(`Your total order is: ${total}`); 
        })
        } else {
            console.log("Insufficient quantity!");
        }
    })
}

