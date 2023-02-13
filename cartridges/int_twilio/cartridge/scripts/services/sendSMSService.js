"use strict";

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

var sendSMSService = LocalServiceRegistry.createService("int_twilio.http.twilio.sendSMS", {
    createRequest: function (svc, inputData) {
        svc.addHeader("Content-Type", "application/x-www-form-urlencoded");
        svc.setRequestMethod("POST");
            
        return "To=" + inputData.To + "&From=+19704802762&Body=" + inputData.Body;
    },
    parseResponse: function (svc, client) {
        var result;

        try {
            result = JSON.parse(client.text);
        } catch (e) {
            result = client.text;
        }
        
        return result;
    },
    filterLogMessage(msg) {
        return msg.replace(/To=(\+?d+)?[\s*\d+]"/, "To=**********");
    }
});

module.exports = sendSMSService;
