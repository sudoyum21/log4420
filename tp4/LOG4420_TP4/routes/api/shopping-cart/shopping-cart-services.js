
const ProductsService = require('../products/products-services');

/**
 * Defines a service to manage the shopping cart.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
var ShoppingCartService = (function (productsService) {
    "use strict";

    var self = {};
    var items = {};
    var productsService = productsService;

    /**
     * Adds an item in the shopping cart.
     *
     * @param productId   The ID associated with the product to add.
     * @param [quantity]  The quantity of the product.
     */
    self.addItem = function (req, productId, quantity) {
        if (productId === undefined) {
            throw new Error("The specified product ID is invalid.")
        }
        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
            quantity = 1;
        }
        if (!req.session.data) {
            req.session['data'] = {};
        }
        console.log('line 33 creating wftf <==================')
        if (req.session.data && req.session.data[productId]) {
            req.session.data[productId] += quantity;
        } else {
            req.session.data[productId] = quantity;
        }
        console.log(req.session['data'])
        _updateLocalItems();
        return req.session.data;
    };
    /**
 * Adds an item in the shopping cart.
 *
 * @param productId   The ID associated with the product to add.
 * @param [quantity]  The quantity of the product.
 */
    self.updateItem = function (req, productId, quantity) {
        if (productId === undefined) {
            throw new Error("The specified product ID is invalid.")
        }
        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
            quantity = 1;
        }
        if (!req.session.data) {
            req.session['data'] = {};
        }
        req.session.data[productId] = quantity;
        _updateLocalItems();
        return req.session.data;
    };
    /**
     * Gets the items in the shopping cart.
     *
  */
    self.getItems = function (req) {
        let productsHolder = productsService.getProducts("alpha-asc", "all");
        console.log('productsHolder')
        console.log(productsHolder)
        console.log(productsHolder)
        if (req && req.session) {
            if (productsHolder && productsHolder.then) {
                return productsHolder.then(function (products) {
                    return self.filterProducts(products, req);
                });
            }

        }
        return self.filterProducts(productsHolder || [], req);
    };

    self.filterProducts = function (products, req) {
        if (req.session && req.session.data) {
            return products.filter(function (product) {
                return req.session.data.hasOwnProperty(product.id) && req.session.data[product.id] !== undefined;
            }).map(function (product) {
                return {
                    product: product,
                    quantity: req.session.data[product.id],
                    total: product.price * req.session.data[product.id]
                };
            });
        }
        return [];
    }

    /**
     * Gets the quantity associated with an item.
     *
     * @param productId   The product ID associated with the item quantity to retrieve.
     * @returns {*}
     */
    self.getItemQuantity = function (productId) {
        return items[productId] || 0;
    };

    /**
     * Gets the total amount of the products in the shopping cart.
     *
     * @returns {jquery.promise}    A promise that contains the total amount.
     */
    self.getTotalAmount = function () {
        return self.getItems().then(function (items) {
            var total = 0;
            items.forEach(function (item) {
                if (item) {
                    total += item.total;
                }
            });
            return total;
        });
    };

    /**
     * Updates the quantity associated with a specified item.
     *
     * @param productId   The product ID associated with the item to update.
     * @param quantity    The item quantity.
     */
    self.updateItemQuantity = function (productId, quantity) {
        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
            throw new Error("The specified quantity is invalid.")
        }
        if (items[productId]) {
            items[productId] = quantity;
            _updateLocalItems();
        }
    };

    /**
     * Removes the specified item in the shopping cart.
     *
     * @param productId   The product ID associated with the item to remove.
     */
    self.removeItem = function (productId, req) {
        if (req.session && req.session.data) {

            delete req.session.data[productId];
        }
    };

    /**
     * Removes all the items in the shopping cart.
     */
    self.removeAllItems = function (req) {
        if (req.session && req.session.data) {
            let data = req.session.data;
            req.session.data = null;
            delete req.session.data;
            delete req.session['data'];
            console.log('deleted ')
            console.log('line 174 ' + req.session.data);
        }
        req.session.destroy(function (err) {
            // cannot access session here
        })
    };

    /**
     * Gets all the products.
     *
     * @param [sortingCriteria]   The sorting criteria to use. If no value is specified, the list returned isn't sorted.
     * @param [category]          The category of the product. The default value is "all".
     * @returns {jquery.promise}  A promise that contains the products list.
     */
    function _getCurrentCart(sortingCriteria, category) {
        return productsPromise.then(function (products) {
            console.log('line 212 ' + products)
            return products;
        });
    };


    return self;
})(ProductsService);

module.exports = ShoppingCartService;