"use strict";

const handlers = require("../private/handlers");    // handlers module
const httpStatus = require("http-status-codes");
const contentTypes = {
    "text": { "Content-Type": "text/plain; charset=utf-8" },
    "start": { "Content-Type": "text/html; charset=utf-8" },
    "js": { "Content-Type": "application/js" },
    "css": { "Content-Type": "text/css" },
    "png": { "Content-Type": "image/png" },
    "jpg": { "Content-Type": "image/jpg" },
    "gif": { "Content-Type": "image/gif" },
    "ico": { "Content-Type": "image/x-icon" },
    "svg": { "Content-Type": "image/svg+xml" }
};

const routes = {                                    // register handles to routes
    "GET": {
        "/start": handlers.getAndRespond,
        "/side": handlers.getAndRespond,
        "/about": handlers.getAndRespond,
        "/contact": handlers.getAndRespond,
        "/messages": handlers.getAndRespond,
        "js": handlers.getAndRespond,
        "css": handlers.getAndRespond,
        "png": handlers.getAndRespond,
        "jpg": handlers.getAndRespond,
        "gif": handlers.getAndRespond,
        "ico": handlers.getAndRespond,
        "svg": handlers.getAndRespond
    },

    "POST": {
        "/contact": handlers.receiveData
    }
};

exports.route = function(req, res, body) {          // routing
    let asset;
    let type;
    let routedUrl;
    if (req.url.indexOf(".js") !== -1) {            // check for asset types
        asset = "js";
        routedUrl = "public/js" + req.url;
        type = contentTypes.js;
    } else if (req.url.indexOf(".css") !== -1) {
        asset = "css";
        routedUrl = "public/css" + req.url;
        type = contentTypes.css;
    }  else if (req.url.indexOf(".png") !== -1) {
        asset = "png";
        routedUrl = "public/images" + req.url;
        type = contentTypes.png;
    } else if (req.url.indexOf(".jpg") !== -1) {
        asset = "jpg";
        routedUrl = "public/images" + req.url;
        type = contentTypes.jpg;
    } else if (req.url.indexOf(".gif") !== -1) {
        asset = "gif";
        routedUrl = "public/images" + req.url;
        type = contentTypes.gif;
    } else if (req.url.indexOf(".svg") !== -1) {
        asset = "svg";
        routedUrl = "public/images" + req.url;
        type = contentTypes.svg;
    } else if (req.url.indexOf(".ico") !== -1) {
        asset = "ico";
        routedUrl = req.url;
        type = contentTypes.ico;
    } else {
        if (req.url.charAt(req.url.length - 1) === "/") {
            asset = "/start";
            routedUrl = "views/index.html";
            type = contentTypes.html;
        } else if (req.url === "/start") {
            asset = req.url;
            routedUrl = "views/index.html";
            type = contentTypes.html;
        } else {
            asset = req.url;                            
            if (req.method === "GET") {
                routedUrl = "views" + req.url + ".html";    // if post use "req"
                type = contentTypes.html;                   // if post use "res" 
            } else {
                routes[req.method][asset](req, res, body);
                return;
            }
        }
    }

    try {
        if (routes[req.method][asset]) {            // does handler exist to this route
            console.log("routing: " + asset + " file: " + routedUrl);
            routes[req.method][asset](routedUrl, type, res);  // yes, call it with params
        } else if (routes[req.method]["/contact"]) {

        } else {                                // no, return error msg
            console.log("nmlnf: " + req.url);
            res.writeHead(httpStatus.NOT_FOUND, contentTypes.text);
            res.end(`route for <kbd>${req.url}</kbd> not found`);
        }
    } catch (ex) {                              // routing exception
        console.log("Log: Routing exception: " + ex);
    }
};