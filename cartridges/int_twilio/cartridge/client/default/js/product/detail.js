"use strict";
var base = require("base/product/detail");

/**
 * Shows/ Hides add to card button and subscribe form based on product availability
 * @param {Boolean} isAvailable
 */

function productAvailabilityActionsTrigger(product, $productContainer) {
        if (product.available) {
            $productContainer
                .find(".addToCartProduct")
                .removeClass("d-none");
            $productContainer
                .find(".productAvailabilityNotification")
                .addClass("d-none");
        } else {
            $productContainer
                .find(".addToCartProduct")
                .addClass("d-none");
            $productContainer
                .find(".productAvailabilityNotification")
                .removeClass("d-none");
        }
}

base.updateAvailability = function () {
    $("body").on("product:updateAvailability", function (e, response) {
        $("div.availability", response.$productContainer)
            .data("ready-to-order", response.product.readyToOrder)
            .data("available", response.product.available);

        $(".availability-msg", response.$productContainer)
            .empty()
            .html(response.message);

        productAvailabilityActionsTrigger(response.product, response.$productContainer);

        if ($(".global-availability").length) {
            var allAvailable = $(".product-availability")
                .toArray()
                .every(function (item) {
                    return $(item).data("available");
                });

            var allReady = $(".product-availability")
                .toArray()
                .every(function (item) {
                    return $(item).data("ready-to-order");
                });

            $(".global-availability")
                .data("ready-to-order", allReady)
                .data("available", allAvailable);

            $(".global-availability .availability-msg")
                .empty()
                .html(
                    allReady
                        ? response.message
                        : response.resources.info_selectforstock
                );
        }
    });
};

base.updateAttribute = function () {
    $('body').on('product:afterAttributeSelect', function (e, response) {
        if ($('.product-detail>.bundle-items').length) {
            response.container.data('pid', response.data.product.id);
            response.container.find('.product-id').text(response.data.product.id);
        } else if ($('.product-set-detail').eq(0)) {
            response.container.data('pid', response.data.product.id);
            response.container.find('.product-id').text(response.data.product.id);
        } else {
            $('.product-id').text(response.data.product.id);
            $('.product-detail:not(".bundle-item")').data('pid', response.data.product.id);
        }
        $(".subscribeFormProductId").val(response.data.product.id);
    });
}

module.exports = base;
