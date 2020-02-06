#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
var yargs = require("yargs");
var _a = yargs
    .describe('p', 'Primary localization language. Other language files will be checked against its key structure')
    .demandOption('p', 'Please provide a primary language to compare against')
    .alias('p', 'primary')
    .describe('d', 'Initial directory to start looking for translation files')
    .demandOption('d', 'Please specify a directory')
    .alias('d', 'basedir')
    .help('h')
    .alias('h', 'help')
    .argv, primary = _a.primary, basedir = _a.basedir;
_1.default({
    primary: primary,
    basedir: basedir
});
//# sourceMappingURL=cli.js.map