'use strict';
/*
 * handlers.js
 * Requesthandlers to be called by the routing mechanism
 */
const fs = require("fs");                               // file system access
const httpStatus = require("http-status-codes");        // http sc
const lib = require("../private/libWebUtil");           // home grown utilities
const experimental = require("../private/myTemplater"); // highly experimental template
const filename = "private/userMsg.json";
const querystring = require("querystring");

const goError = function(res) {
    res.writeHead(httpStatus.NOT_FOUND, {   // http page not found, 404
        "Content-Type": "text/html; charset=utf-8"
    });
    res.write("<h1>404 Not Found</h1>");
    res.end();
};

exports.getAndRespond = function(path, contentType, res) {
    console.log(path);
    if (fs.existsSync(path)) {              // does file exist, sync
        if (path === "views/messages.html") {
            console.log("im letting u know, this is the right path to go!");
            let arr = [];
            fs.readFile(filename, "utf8", function(err1, data) { // read to check
                if (err1) {
                    throw err1;
                }
                if (data != "") {
                   arr = JSON.parse(data); 
                }
                res.write(experimental.receipt(arr));           // home made templating for native node
            });

        }
        fs.readFile(path, function(err, data) { // read
            if (err) {                      // if read error
                console.log("nml: " + err);           // inform server
                goError(res);               // inform user
                return;                     // back to caller
            }
            res.writeHead(httpStatus.OK, contentType); // prep header
            res.write(data);                // prep body with read data
            res.end();                      // send response
        });
    } else {
        goError(res);                       // doesnt exist error
    }
};
exports.receiveData = function(req, res, data) {
    let obj = lib.makeWebArrays(req, data);         // home made GET and POST objects
    res.writeHead(httpStatus.OK, {                  // yes, write relevant header
        "Content-Type": "text/html; charset=utf-8"
    });
    let time = lib.makeLogEntry(req);
    let arr = [];
    fs.readFile(filename, "utf8", function(err1, data) {
        if (err1) {
            throw err1;
        }
        if (data != "") {
           arr = JSON.parse(data); 
        }
        obj.POST.submit = time;
        arr.push(obj.POST);
        let jsonstr = JSON.stringify(arr);
        console.log(JSON.parse(jsonstr));
        fs.writeFile(filename, jsonstr, function(err) { // write to json file
            if (err) {
                throw err;
            }
        });
    });
    res.write("<a href='/'>Return to front page</a>");
    res.end();
};