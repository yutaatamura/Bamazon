 var mysql = require("mysql");
 var inquirer = require("inquirer");
 var Table = require("cli-table");

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
menu();

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
        var table = new Table({
            head: ['Item ID', 'Product', 'Price', 'Quantity']
        });

        for (var i=0; i<res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, '$'+res[i].price, res[i].stock_quantity]);
 
// If rather not use cli-table and just console       
//         console.log(`
// **********************************
// Item ID: ${res[i].item_id}
// Product: ${res[i].product_name}
// Price: $${res[i].price}
// Quantity: ${res[i].stock_quantity}`)
        }
        console.log(table.toString());
        menu();
    }) 
}

function viewLowInv() {
    console.log("Here are all items with low inventory:");
    var query = "SELECT * FROM products WHERE stock_quantity < 5"
    connection.query(query, function(err, res) {
        if(err) throw err;
        var table = new Table({
            head: ['Item ID', 'Product', 'Price', 'Quantity']
        });
        for (var i=0; i<res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, '$'+res[i].price, res[i].stock_quantity]);

//             console.log(`
// **********************************
// Item ID: ${res[i].item_id}
// Product: ${res[i].product_name}
// Price: $${res[i].price}
// Quantity: ${res[i].stock_quantity}`)
        }
        console.log(table.toString());
        menu();
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

                    addInv();
                } else {
                    selectItem();
                }
            })
        })
    });
}

function addInv() {
    inquirer.prompt({
        name: "add",
        message: "How many would you like to add?"
    }).then(function(answer) {
        var query = "UPDATE products SET ? WHERE ?";
        var sumStock = parseInt(productStock) + parseInt(answer.add);
        connection.query(query, [{stock_quantity: sumStock}, {item_id: productID}], function(err, res) {
            if(err) throw err;
            updateStock();
        })
    })
}

function updateStock() {
    var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE ?";

            connection.query(query, {item_id: productID}, function(err, res) {
            if(err) throw err;
            console.log(`Your total stock is now: ${res[0].stock_quantity}`)
            menu();
            });
}

function addNew() {
    inquirer.prompt([
        {
        name: "newProduct",
        type: "input",
        message: "Please enter new product name."
        },
        {
        name: "newPrice",
        type: "input",
        message: "Please enter new product price."
        },
        {
        name: "newQuantity",
        type: "input",
        message: "Please enter new product stock quantity.",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
                return false;
            }    
        }
    ])
    .then(function(answer) {
        var query = "INSERT INTO products SET ?"
        connection.query(query, {
            item_id: 11,
            product_name: answer.newProduct,
            price: answer.newPrice,
            stock_quantity: answer.newQuantity
        },
    function(err) {
        if (err) throw err;
        console.log("Your new item has been added!");
        menu();
    });
    })
}




