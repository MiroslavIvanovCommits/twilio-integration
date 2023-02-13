var CustomObjectMgr = require("dw/object/CustomObjectMgr");
var Transaction = require("dw/system/Transaction");
var productMgr = require("dw/catalog/ProductMgr");
var sendSMSService = require("~/cartridge/scripts/services/sendSMSService.js");

/**
 * Sends SMS to all customers that are subscribed to a product if it's in stock and deletes the custom objects
 */

module.exports.execute = function () {
    var productsObjectIterator = CustomObjectMgr.getAllCustomObjects(
        "NotifyMeBackInStock"
    );

    while (productsObjectIterator.hasNext()) {
        var productObject = productsObjectIterator.next();
        var product = productMgr.getProduct(productObject.custom.productId);
        var productIsAvailable = product.availabilityModel.isInStock();
        if (productIsAvailable) {
            var phoneNumbers = productObject.custom.phoneNumbers;
            var phoneNumbersArr = phoneNumbers.split(", ");

            var error = false;
            var phoneNumbersNotProcessed = [];
            var i = 0;
            while (phoneNumbersArr[i]) {
                var message = product.name + " is now available";
                var serviceResult = sendSMSService.call({
                    To: phoneNumbersArr[i],
                    Body: message,
                }).ok;

                if (!serviceResult) {
                    error = true;
                    phoneNumbersNotProcessed.push(phoneNumbersArr[i]);
                }

                i++;
            }

            if (error) {
                var remainingPhoneNumbers = phoneNumbersNotProcessed.join(", ");
                Transaction.wrap(() => {
                    productObject.custom.phoneNumbers = remainingPhoneNumbers;
                });
            } else {
                Transaction.wrap(function () {
                    CustomObjectMgr.remove(productObject);
                });
            }
        }
    }
};
