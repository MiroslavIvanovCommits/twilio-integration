"use strict";
 
var server = require("server");
var page = module.superModule;
 
server.extend(page);
 
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
 
server.append("Show", csrfProtection.generateToken, function (req, res, next) {
    var subscribeToProductForm = server.forms.getForm("subscribeToProduct");
    subscribeToProductForm.clear();

    var viewData = res.getViewData();

    viewData.forms = { subscribeToProductForm: subscribeToProductForm };
 
    if (customer.profile && customer.profile.phoneHome) {
        viewData.phoneNumber = customer.profile.phoneHome;
    } else {
        viewData.phoneNumber = "";
    }
 
    res.setViewData(viewData);
    next();
});
 
module.exports = server.exports();