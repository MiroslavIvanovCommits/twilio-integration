"use strict";

/**
 * @namespace Twilio
 */

var server = require("server");
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");

/**
 * Twilio-Subscribe : The Twilio-Subscribe endpoint is the endpoint that gets hit when a shopper has subscribed for out of stock product
 * @name Base/Twilio-Subscribe
 * @function
 * @memberof Twilio
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.post(
    "Subscribe",
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var CustomObjectMgr = require("dw/object/CustomObjectMgr");
        var Transaction = require("dw/system/Transaction");
        var Resource = require('dw/web/Resource');

        var subscribeToProductForm = server.forms.getForm("subscribeToProduct");
        var type = "NotifyMeBackInStock";
        var productId = subscribeToProductForm.productId.value;

        if (subscribeToProductForm.phoneNumber && subscribeToProductForm.productId) {
            var newNumber = subscribeToProductForm.phoneNumber.value;
            if (!subscribeToProductForm.phoneNumber.valid) {
                res.json({
                    success: false,
                    error: Resource.msg('error.message.parse.phone', 'subscribeOutOfStock', null)
                });
                return next();
            }

            var subscribeToProductResult = CustomObjectMgr.getCustomObject(type, productId);

            if (!empty(subscribeToProductResult)) {
                var phoneNumbers = subscribeToProductResult.custom.phoneNumbers;
                var phoneNumbersArr = phoneNumbers.split(", ");
                if (!phoneNumbersArr.includes(newNumber)) {
                    phoneNumbersArr.push(newNumber);
                    phoneNumbers = phoneNumbersArr.join(", ");

                    Transaction.wrap(function () {
                        subscribeToProductResult.custom.phoneNumbers = phoneNumbers;
                    });

                    res.json({
                        success: true,
                        message: Resource.msg('success.message', 'subscribeOutOfStock', null)
                    });
                } else {
                    res.json({
                        error: "This phone number is already subscribed for this product",
                        message: Resource.msg('error.message', 'subscribeOutOfStock', null)
                    });
                }


            } else {
                Transaction.wrap(function () {
                    var newsletter = CustomObjectMgr.createCustomObject(type, productId);
                    newsletter.custom.phoneNumbers = newNumber;
                });

                res.json({
                    success: true,
                    message: Resource.msg('success.message', 'subscribeOutOfStock', null)
                });
            }
        } else {
            res.json({
                error: "Missing phone number",
                message: Resource.msg('error.message', 'subscribeOutOfStock', null)
            });
        }

        return next();
    }
);

module.exports = server.exports();
