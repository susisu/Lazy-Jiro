/*
 * Lazy Jiro / main.js
 * copyright (c) 2016 Susisu
 */

"use strict";

import "babel-polyfill";

import ace  from "ace";
import lazy from "lazyk-js";

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

    function enable() {
        editor.setReadOnly(false);
        inputEditor.setReadOnly(false);
        runButton.disabled       = false;
        translateButton.disabled = false;
    }

    function disable() {
        editor.setReadOnly(true);
        inputEditor.setReadOnly(true);
        runButton.disabled       = true;
        translateButton.disabled = true;
    }

    enable();

    // button events
    runButton.addEventListener("click", () => {
        disable();
        let src    = editor.getValue();
        let input  = inputEditor.getValue();
        let output = "";
        outputEditor.setValue(output)
        try {
            run(
                "",
                src,
                new lazy.stream.StringStream(input),
                x => {
                    output += x;
                    outputEditor.setValue(output)
                },
                c => {
                    enable();
                }
            ).catch(error => {
                if (!(error instanceof lazy.lambda.Exit)) {
                    outputEditor.setValue(String(error));
                }
                enable();
            });
        }
        catch (error) {
            outputEditor.setValue(String(error));
            enable();
        }
    });

    translateButton.addEventListener("click", () => {
        disable();
        let src = editor.getValue();
        let translated = "";
        try {
            translated = translate("", src);
        }
        catch (error) {
            outputEditor.setValue(String(error));
            return;
        }
        let output = "";
        while (translated.length > 0) {
            let chunk = translated.substr(0, 40);
            translated = translated.substr(40);
            if (chunk[chunk.length - 1] === "ブ") {
                chunk = chunk.slice(0, -1);
                translated = "ブ" + translated;
            }
            output += chunk + "\n";
        }
        outputEditor.setValue(output);
        enable();
    });
});
