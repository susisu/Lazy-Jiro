/*
 * Lazy Jiro / interpreter.js
 * copyright (c) 2016 Susisu
 */

"use strict";

import lazy from "lazyk-js";

import { parse } from "./parser.js";

let prelude = Object.create(null);
prelude["S"] =
    new lazy.lambda.Lambda(undefined, "x",
        new lazy.lambda.Lambda(undefined, "y",
            new lazy.lambda.Lambda(undefined, "z",
                new lazy.lambda.Application(
                    undefined,
                    new lazy.lambda.Application(
                        undefined,
                        new lazy.lambda.Variable(undefined, "x"),
                        new lazy.lambda.Variable(undefined, "z")
                    ),
                    new lazy.lambda.Application(
                        undefined,
                        new lazy.lambda.Variable(undefined, "y"),
                        new lazy.lambda.Variable(undefined, "z")
                    )
                )
            )
        )
    ).generate(prelude);
prelude["K"] =
    new lazy.lambda.Lambda(undefined, "x",
        new lazy.lambda.Lambda(undefined, "y",
            new lazy.lambda.Variable(undefined, "x")
        )
    ).generate(prelude);
prelude["I"] =
    new lazy.lambda.Lambda(undefined, "x",
        new lazy.lambda.Variable(undefined, "x")
    ).generate(prelude);
Object.freeze(prelude);

export function run(name, src, input, output, exit) {
    let expr = parse(name, src);
    let istream = new lazy.lambda.Literal(
        "input",
        lazy.stream.istream(input)
    );
    let ostream = new lazy.lambda.Literal(
        "output",
        lazy.stream.ostream(output, exit)
    );
    expr = new lazy.lambda.Application(
        "output",
        ostream,
        new lazy.lambda.Application(
            "input",
            expr,
            istream
        )
    );
    let _expr = expr.generate(prelude);
    return _expr.eval();
}
