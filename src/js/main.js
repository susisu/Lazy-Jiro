/*
 * Lazy Jiro / main.js
 * copyright (c) 2016 Susisu
 */

"use strict";

import "babel-polyfill";

import ace from "ace";

import { run }       from "./interpreter.js";
import { translate } from "./translator.js";

window.addEventListener("load", () => {
    // initialize editors
    let editor       = ace.edit("editor");
    let inputEditor  = ace.edit("input-editor");
    let outputEditor = ace.edit("output-editor");
    outputEditor.setReadOnly(true);

    // buttons
    let runButton       = document.getElementById("run-button");
    let translateButton = document.getElementById("translate-button");
});
