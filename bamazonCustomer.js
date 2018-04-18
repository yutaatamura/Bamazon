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

function displayProducts() {
    inquirer.prompt({
        name:"welcome",
        type:"confirm",
        message:"Welcome to Bamazon! Would you like to take a look at today's inventory?"
    }).then(function(answer) {
        if (answer.welcome) {
            console.log("Here is today's inventory...");
            var query = "SELECT item_id, product_name, price FROM products";
            connection.query(query, {})
        }
    })
}

function productIDPrompt() {
    inquirer.prompt({
        name: "ask",
        message: "Please input the ID of the product you would like to buy."
    }).then(function(answer) {

    })
}

function quantityPrompt() {
    inquirer.prompt({
        name: "quantity",
        message: "How many units of the product would you like to buy?"
    }).then(function(answer) {

    })
}

