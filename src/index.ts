import * as fs from 'fs';
import {load as loadYaml} from 'yamljs';
import * as util from 'util';
import {detailedDiff} from 'deep-object-diff';

function isEmpty(obj: object) {
    return Object.keys(obj).length === 0;
}

function allKeysMatch(baseDir: string, primaryLanguage: string,
                      languages: string[], namespaceFiles: string[]): boolean {
    const translations = {};
    languages.forEach(lang => {
        translations[lang] = {};
        namespaceFiles.forEach(ns => {
            translations[lang][ns] = loadYaml(`${baseDir}/${lang}/${ns}`);
        });
        if (lang !== primaryLanguage) {
            const diff = detailedDiff(translations[primaryLanguage], translations[lang]);
            if (!isEmpty(diff['added']) || !isEmpty(diff['deleted'])) {
                console.info('Found differences for', lang, util.inspect(diff));
            } else {
                console.info('Did not find any differences for', lang);
            }
        }
    });
    return false;
}

export default function sync(options: { primary: any; basedir: any }): void {
    console.log('Checking against', options.primary);

    const languages: string[] = [];
    let namespaceFiles: string[];

    fs.readdirSync(options.basedir).forEach(languageDir => {
        languages.push(languageDir);
        if (languageDir === options.primary) {
            namespaceFiles = fs.readdirSync(`${options.basedir}/${languageDir}`);
        }
    });

    console.info('Found languages:', languages.join(', '));
    console.info('Using namespace files:', namespaceFiles.join(', '));

    if (!allKeysMatch(options.basedir, options.primary, languages, namespaceFiles)) {
        process.exit(1);
    }
}
