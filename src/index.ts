import * as fs from 'fs';
import {load as loadYaml} from 'yamljs';
import {diff} from 'deep-diff';

function cleanKeys(obj: object): object {
    for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string') {
            obj[k] = null;
        } else if(typeof v === 'object') {
            cleanKeys(v);
        }
    }
    return obj;
}

function loadKeys(yamlFile: string): object {
    return cleanKeys(loadYaml(yamlFile))
}

function allKeysMatch(baseDir: string, primaryLanguage: string,
                      languages: string[], namespaceFiles: string[]): boolean {
    let translationsMatch = true;
    const primaryTranslation = {};
    namespaceFiles.forEach(ns => {
        primaryTranslation[ns] = loadKeys(`${baseDir}/${primaryLanguage}/${ns}`);
    });

    const translations = {};
    languages.filter(l => l != primaryLanguage).forEach(lang => {
        translations[lang] = {};
        namespaceFiles.forEach(ns => {
            translations[lang][ns] = loadKeys(`${baseDir}/${lang}/${ns}`);
        });
        const differences = diff(primaryTranslation, translations[lang]);
        if (differences) {
            translationsMatch = false;
            console.warn('### Found differences for', lang);
            for (const d of differences) {
                let msg: string;
                if (d.kind === 'N') {
                    msg = '  New in';
                } else if (d.kind === 'D') {
                    msg = '  Missing in';
                }
                console.warn(msg, d.path[0] + ':', d.path.slice(1).join('.'));
            }
        } else {
            console.info('Did not find any differences for', lang);
        }
    });
    return translationsMatch;
}

export default function sync(options: { primary: string; basedir: string }): void {
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
