/* myTemplater.js Home made experimental templating */
"use strict";

const fs = require("fs");

const receipt = function(arr) {
    let html;
    console.log(arr);
    for (var i = 0; i < arr.length; i++) {
        html += `
            <div>
                <p>You entered the following</p>
                <h3>Subject</h3>
                <p>${arr[i].POST.topic}</p>

                <h3>Message</h3>
                <pre>${arr[i].POST.message}</pre>

                <h3>Name</h3>
                <p>${arr[i].POST.name}</p>

                <h3>Email</h3>
                <p>${arr[i].POST.email}</p>
            </div>
        `;
    }
    return html
}

exports.receipt = receipt;