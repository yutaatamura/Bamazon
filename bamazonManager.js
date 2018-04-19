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
var productStock;

function menu() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Please select an option below:",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    })
    .then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale":
            viewProducts();
            break;

            case "View Low Inventory":
            viewLowInv();
            break;

            case "Add to Inventory":
            selectItem();
            break;

            case "Add New Product":
            addNew();
            break;
        }
    });
};

function viewProducts() {
    console.log("Here are all the available items:");
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i=0; i<res.length; i++) {
        console.log(`
**********************************
Item ID: ${res[i].item_id}
Product: ${res[i].product_name}
Price: $${res[i].price}
Quantity: ${res[i].stock_quantity}`)
        }
    }) 
}

function viewLowInv() {
    console.log("Here are all items with low inventory:");
    var query = "SELECT * FROM products GROUP BY stock_quantity HAVING count(*) < 5"
    connection.query(query, function(err, res) {
        if(err) throw err;
        for (var i=0; i<res.length; i++) {
            console.log(`
**********************************
Item ID: ${res[i].item_id}
Product: ${res[i].product_name}
Price: $${res[i].price}
Quantity: ${res[i].stock_quantity}`)
        }
    }) 
}

function selectItem() {
    inquirer.prompt({
        name: "item",
        message: "Which item would you like to add inventory? Please enter item ID number."
        })
        .then(function(answer) {
            
            var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE ?";

            connection.query(query, {item_id: answer.item}, function(err, res) {
            if(err) throw err;
            
            productID = res[0].item_id;
            productStock = res[0].stock_quantity;

            inquirer.prompt({
                name: "check",
                type: "confirm",
                message: `You have selected ${res[0].product_name}. Is this correct?`
            }).then(function(answer) {
                if (answer.check) {

                    addInv()
                }
            })
        })
    }
}

function addInv() {
    inquirer.prompt({
        name: "add",
        message: "How many would you like to add?"
    }).then(function(answer) {
        var query = "UPDATE products SET ? WHERE ?";
        connection.query(query, [{stock_quantity: productStock + answer.add}, {item_id: productID}], function(err, res) {
            if(err) throw err;
            console.log(`Your total stock is now: ${}`)
        })
    })


