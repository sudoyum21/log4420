'use strict';

var ProductController = (function() {
    var self = {};
    var productId;

    self.init = function() {
        productId = $.urlParam('id');
        var product = ProductServices.getProduct(productId);
        if (product != null) {
            _displayProduct(product);
        } else {
            _displayNotFound();
        }
        _setOnSubmitAddToCartForm();
    }

    function _setOnSubmitAddToCartForm() {
        $('#add-to-cart-form').submit((event) => {
            event.preventDefault();
            var quantity = $('#product-quantity').val();
            // Show dialog to confirm
            ProductServices.Cart.saveAddedProduct(productId, quantity);
            HeaderController.updateCartCount();
        });
    }

    function _displayProduct(product) {
        $('#product-name').html(product.name);
        $('#product-image').attr('alt', product.name);
        $('#product-image').attr('src', './assets/img/' + product.image);
        $('#product-desc').html(product.description);
        product.features.forEach(feature => {
            $('#product-features').append('<li>' + feature + '</li>');
        });
        $('#product-price').html(product.price + ' $');
    }

    function _displayNotFound(product) {
        $('#product-name').html('Page non trouvée !');
        $('.row').remove();
    }

    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results[1] || 0;
    }

    $(document).ready(function() {
        HeaderController.updateCartCount();
        ProductServices.getRequest().done(data => {
            ProductServices.initData(data);
            ProductController.init();
        });
    });

    return self;
})();
