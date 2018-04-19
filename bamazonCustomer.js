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
displayProducts();

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
                for (var i=0; i<res.length; i++) {
                console.log(`------------------------------------------------   
Item ID: ${res[i].item_id}
Item Name: ${res[i].product_name}
Price: $${res[i].price}
`)
                }
                productIDPrompt();
            })
        } else {
            console.log("Thank you for shopping at Bamazon! Have a nice day.");
            return;
        }
    })
}
// console.log("Sorry, please input a valid item ID number.")
//             displayProducts();

function productIDPrompt() {
    inquirer.prompt({
        name: "ask",
        message: "Please input the ID of the product you would like to buy."
    }).then(function(answer) {
        productID = answer.ask;
        var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";
        connection.query(query, { item_id: answer.ask}, function(err, res) {
            if (err) throw err;
            selProductPrice = res[0].price;
            selProductStock = res[0].stock_quantity;
            
            console.log(`Here is the requested item information: 
________________________________________

Item ID: ${res[0].item_id}
Item Name: ${(res[0].product_name)}
Price: $${res[0].price}
Stock: ${res[0].stock_quantity}
________________________________________
`);
            console.log(selProductPrice);
            console.log(selProductStock);
            quantityPrompt(selProductStock);
        })
    })
}

function quantityPrompt(stock) {
    inquirer.prompt({
        name: "quantity",
        message: "How many units of the product would you like to buy?"
    }).then(function(answer) {
        
        if (answer.quantity < stock) {
        console.log("Thank you! Your order has been placed.");
        var query = "UPDATE products SET ? WHERE ?";
        connection.query(query, [{stock_quantity: stock - answer.quantity}, {item_id: productID}], function(err, res) {
            if (err) throw err;
            var total = selProductPrice * answer.quantity;
            console.log(`Your total order is: $${total}`); 
            reOrder();
        })
        } else {
            console.log("Insufficient quantity!");
        }
    })
}

function reOrder() {
    inquirer.prompt({
        name: "reorder",
        type: "confirm",
        message: "Would you like to order another item?"
    }).then(function(answer) {
        if (answer.reorder) {
            displayProducts();
        } else {
            console.log("Thank you for shopping at Bamazon! Have a nice day.");
            return;
        }
    })
};

