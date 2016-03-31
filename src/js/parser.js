/*
 * Lazy Jiro / parser.js
 * copyright (c) 2016 Susisu
 */

"use strict";

import lq   from "loquat";
import lazy from "lazyk-js";

class Token {
    constructor(pos, name) {
        this.pos  = pos;
        this.name = name;
    }
}

let whiteSpaces = lq.noneOf("麺汁ブ!！").manyChar();

function lexeme(p) {
    return p.left(whiteSpaces);
}

let s = lq.gen(function * () {
    let pos = yield lq.getPosition;
    yield lexeme(lq.char("麺"));
    return new Token(pos, "S");
}).label("麺");

let k = lq.gen(function * () {
    let pos = yield lq.getPosition;
    yield lexeme(lq.char("汁"));
    return new Token(pos, "K");
}).label("汁");

let i = lq.gen(function * () {
    let pos = yield lq.getPosition;
    yield lexeme(lq.string("ブタ"));
    return new Token(pos, "I");
}).label("ブタ");

let app = lq.gen(function * () {
    let pos = yield lq.getPosition;
    yield lexeme(lq.oneOf("!！"));
    return new Token(pos, "!")
}).label("！");

let token  = lq.choice([s, k, i, app]);
let tokens = whiteSpaces.then(token.many()).left(lq.eof);

function tokenize(name, src) {
    var res = lq.parse(tokens, name, src, 4);
    if (res.succeeded) {
        return res.value;
    }
    else {
        throw res.error;
    }
}

function construct(tokens) {
    let stack = [];
    for (let token of tokens) {
        switch (token.name) {
            case "S":
            case "K":
            case "I":
                stack.push(new lazy.lambda.Variable(token.pos, token.name));
                break;
            case "!": {
                if (stack.length < 2) {
                    throw new Error(token.pos.toString() + ":\n"
                        + "アクシデント発生の為、関数適用が困難な状況となりました。\n"
                        + "このお報せを以って構築を終了します。\n"
                        + "ありがとうございました。\n\nFin"
                    );
                }
                let arg  = stack.pop();
                let func = stack.pop();
                stack.push(new lazy.lambda.Application(token.pos, func, arg));
                break;
            }
            default:
                throw new Error("unknown token: " + token.name);
        }
    }
    if (stack.length < 1) {
        throw new Error("完飲。");
    }
    else if (stack.length > 1) {
        throw new Error("完飲しろ。");
    }
    return stack.pop();
}

export default function parse(name, src) {
    return construct(tokenize(name, src));
}
