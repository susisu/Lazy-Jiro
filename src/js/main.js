/*
 * Lazy Jiro / main.js
 * copyright (c) 2016 Susisu
 */

"use strict";

import "babel-polyfill";

import ace  from "ace";

window.addEventListener("load", () => {
    if (!window.Worker) {
        console.log("Worker is not supported");
        return;
    }
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
        outputEditor.setValue(output);
        let worker = new Worker("./js/worker.bundle.js");
        worker.addEventListener("message", event => {
            switch (event.data.type) {
                case "output":
                    output += event.data.value;
                    outputEditor.setValue(output);
                    break;
                case "exit":
                    worker.terminate();
                    enable();
                    break;
                case "error":
                    outputEditor.setValue(event.data.message);
                    worker.terminate();
                    enable();
                    break;
            }
        });
        worker.postMessage({
            type : "run",
            name : "",
            src  : src,
            input: input
        });
    });

    translateButton.addEventListener("click", () => {
        disable();
        let src = editor.getValue();
        let worker = new Worker("./js/worker.bundle.js");
        worker.addEventListener("message", event => {
            switch (event.data.type) {
                case "success":
                    outputEditor.setValue(event.data.value);
                    worker.terminate();
                    enable();
                    break;
                case "error":
                    outputEditor.setValue(event.data.message);
                    worker.terminate();
                    enable();
                    break;
            }
        });
        worker.postMessage({
            type : "translate",
            name : "",
            src  : src
        });
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
