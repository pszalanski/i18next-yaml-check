# i18next-yaml-sync
Keep i18next YAML translation files in sync, including namespace support.

## Usage

Install using npm

```bash
$ npm i -g i18next-yaml-check

$ check-i18n --help
  Options:
    --version      Show version number                                   [boolean]
    -p, --primary  Primary localization language. Other language files will be
                   checked against its key structure                    [required]
    -d, --basedir  Initial directory to start looking for translation files
                                                                        [required]
    -h, --help     Show help                                             [boolean]

```

### Example

Given a primary translation language, try to find differences in other files.

```bash
$ check-i18n src/assets/i18n --primary en-US --languages de-DE es-ES fr-FR
Checking against en-US
Found languages: de-DE, en-US
Using namespace files: common.yml, forms.yml, widgets.yml
### Found differences for de-DE
  New in forms.yml: LABELS.ADDRESS.NUMBER
  Missing in forms.yml: LABELS.TEAM_NAME

Process finished with exit code 1
```
