"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var yamljs_1 = require("yamljs");
var deep_diff_1 = require("deep-diff");
function cleanKeys(obj) {
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        if (typeof v === 'string') {
            obj[k] = null;
        }
        else if (typeof v === 'object') {
            cleanKeys(v);
        }
    }
    return obj;
}
function loadKeys(yamlFile) {
    return cleanKeys(yamljs_1.load(yamlFile));
}
function allKeysMatch(baseDir, primaryLanguage, languages, namespaceFiles) {
    var translationsMatch = true;
    var primaryTranslation = {};
    namespaceFiles.forEach(function (ns) {
        primaryTranslation[ns] = loadKeys(baseDir + "/" + primaryLanguage + "/" + ns);
    });
    var translations = {};
    languages.filter(function (l) { return l != primaryLanguage; }).forEach(function (lang) {
        translations[lang] = {};
        namespaceFiles.forEach(function (ns) {
            translations[lang][ns] = loadKeys(baseDir + "/" + lang + "/" + ns);
        });
        var differences = deep_diff_1.diff(primaryTranslation, translations[lang]);
        if (differences) {
            translationsMatch = false;
            console.warn('### Found differences for', lang);
            for (var _i = 0, differences_1 = differences; _i < differences_1.length; _i++) {
                var d = differences_1[_i];
                var msg = void 0;
                if (d.kind === 'N') {
                    msg = '  New in';
                }
                else if (d.kind === 'D') {
                    msg = '  Missing in';
                }
                console.warn(msg, d.path[0] + ':', d.path.slice(1).join('.'));
            }
        }
        else {
            console.info('Did not find any differences for', lang);
        }
    });
    return translationsMatch;
}
function sync(options) {
    console.log('Checking against', options.primary);
    var languages = [];
    var namespaceFiles;
    fs.readdirSync(options.basedir).forEach(function (languageDir) {
        languages.push(languageDir);
        if (languageDir === options.primary) {
            namespaceFiles = fs.readdirSync(options.basedir + "/" + languageDir);
        }
    });
    console.info('Found languages:', languages.join(', '));
    console.info('Using namespace files:', namespaceFiles.join(', '));
    if (!allKeysMatch(options.basedir, options.primary, languages, namespaceFiles)) {
        process.exit(1);
    }
}
exports.default = sync;
//# sourceMappingURL=index.js.map