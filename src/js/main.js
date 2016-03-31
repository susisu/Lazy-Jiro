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
    outputEditor.setValue(`Lazy Jiro
copyright (c) 2016 Susisu (@susisu2413)
inspired by @habomaijiro

麺   = s
汁   = k
ブタ = i
xy！ = \`xy (関数適用)
これ以外の文字はコメントとして扱われます。
`)

    // buttons
    let runButton       = document.getElementById("run-button");
    let translateButton = document.getElementById("translate-button");

    // select
    let sampleSelect = document.getElementById("sample-select");

    function enable() {
        editor.setReadOnly(false);
        inputEditor.setReadOnly(false);
        runButton.disabled       = false;
        translateButton.disabled = false;
        sampleSelect.disabled    = false;
    }

    function disable() {
        editor.setReadOnly(true);
        inputEditor.setReadOnly(true);
        runButton.disabled       = true;
        translateButton.disabled = true;
        sampleSelect.disabled    = true;
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

    sampleSelect.addEventListener("change", () => {
        let name = sampleSelect.options[sampleSelect.selectedIndex].value;
        let src  = "";
        switch (name) {
            case "none":
                return;
            case "echo":
                src = `平成28年4月1日金曜日、ラメーン二郎 歯舞店、ラメーン 700YEN
麺、極めて柔らか、汁染みまくってて、ウンメ〜ッ！
汁、ウンメ〜ッ！醤油利いててメッチャ俺好みのもの。
完飲。`;
                break;
        }
        editor.setValue(src);
    });
});
