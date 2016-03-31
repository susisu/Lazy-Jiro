/*
 * Lazy Jiro / worker.js
 * copyright (c) 2016 Susisu
 */

"use strict";

import "babel-polyfill";

import lazy from "lazyk-js";

import { run }       from "./interpreter.js";
import { translate } from "./translator.js";

addEventListener("message", event => {
    switch (event.data.type) {
        case "run": {
            let name  = event.data.name;
            let src   = event.data.src;
            let input = event.data.input;
            try {
                run(
                    "",
                    src,
                    new lazy.stream.StringStream(input),
                    x => postMessage({ type: "output", value: x }),
                    c => postMessage({ type: "exit", code: c })
                ).catch(error => {
                    if (!(error instanceof lazy.lambda.Exit)) {
                        postMessage({ type: "error", message: String(error) });
                    }
                });
            }
            catch (error) {
                postMessage({ type: "error", message: String(error) });
            }
            return;
        }
        case "translate": {
            let name       = event.data.name;
            let src        = event.data.src;
            let translated = "";
            try {
                translated = translate(name, src);
            }
            catch (error) {
                postMessage({ type: "error", message: String(error) });
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
            postMessage({ type: "success", value: output });
        }
    }    
});
