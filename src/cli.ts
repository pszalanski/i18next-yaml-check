#!/usr/bin/env node

import sync from './';
import * as yargs from 'yargs';

const {
    primary,
    basedir
} = yargs
    .describe('p', 'Primary localization language. Other language files will be checked against its key structure')
    .demandOption('p', 'Please provide a primary language to compare against')
    .alias('p', 'primary')

    .describe('d', 'Initial directory to start looking for translation files')
    .demandOption('d', 'Please specify a directory')
    .alias('d', 'basedir')

    .help('h')
    .alias('h', 'help')

    .argv;

sync({
    primary: primary as string,
    basedir: basedir as string
});
