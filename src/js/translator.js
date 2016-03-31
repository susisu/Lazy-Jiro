/*
 * Lazy Jiro / translator.js
 * copyright (c) 2016 Susisu
 */

"use strict";

import lazy from "lazyk-js";

function translateToken(token) {
    if (token instanceof lazy.tokens.S) {
        return "麺";
    }
    else if (token instanceof lazy.tokens.K) {
        return "汁";
    }
    else if (token instanceof lazy.tokens.I) {
        return "ブタ";
    }
    else if (token instanceof lazy.tokens.Iota) {
        // iota = S(SI(KS))(KK)
        return "麺麺ブタ！汁麺！！！汁汁！！";
    }
    else if (token instanceof lazy.tokens.Application) {
        return translateToken(token.func) + translateToken(token.arg) + "！";
    }
    else {
        throw new Error("unknown token");
    }
}

export function translate(name, src) {
    let token = lazy.parser.parse(name, src);
    return translateToken(token);
}
