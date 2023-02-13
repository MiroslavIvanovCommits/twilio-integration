"use strict";

/**
 * Shows subscribeToProduct form and hides the show button.
 */

$(function () {
    var subscribeSections = $(".productAvailabilityNotification");

    subscribeSections.each(function (index, element) {
        var currSubscribeSection = $(element);

        var currShowBtn = currSubscribeSection
            .children(".show-subscribe-product-wrapper")
            .first();

        currShowBtn.on("click", function () {
            currShowBtn.remove();

            var currSubscribeFormWrapper = currSubscribeSection
                .children(".subscribe-product-wrapper")
                .first()
                .children(".subscribe-product-form-wrapper")
                .first();

            currSubscribeFormWrapper.removeClass("d-none");
        });
    });
});

/**
 * Shows subscribeToProduct form and hides the show button.
 */

var formValidation = require("base/components/formValidation");

$(document).ready(function () {
    var $allSubscribeForms = $(".subscribe-product-form");

    // Iterate over all forms in case there are several like in a product set
    $allSubscribeForms.each(function (index, element) {
        var $currSubscribeForm = $(element);

        // Modify submit event for each form
        $currSubscribeForm.submit(function (e) {
            var form = $(this);
            e.preventDefault();
            var url = form.attr("action");

            var successMessage = $currSubscribeForm.prevAll(
                ".js-subscribe-success-message"
            );
            var errorMessage = $currSubscribeForm.prevAll(
                ".js-subscribe-error-message"
            );

            form.spinner().start();
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                data: form.serialize(),
                success: function (data) {
                    form.spinner().stop();

                    if (!data.success) {
                        successMessage.addClass("d-none");
                        errorMessage.html(data.message);
                        errorMessage.removeClass("d-none");
                    } else {
                        errorMessage.addClass("d-none");
                        successMessage.html(data.message);
                        successMessage.removeClass("d-none");
                    }
                },
                error: function (err) {
                    form.spinner().stop();
                    
                    successMessage.addClass("d-none");
                    errorMessage.html(err.message);
                    errorMessage.removeClass("d-none");
                },
            });
            return false;
        });
    });
});
