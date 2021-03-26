[![nlm-github](https://img.shields.io/badge/github-groupon%2Fselenium--download%2Fissues-F4D03F?logo=github&logoColor=white)](https://github.com/groupon/selenium-download/issues)
![nlm-node](https://img.shields.io/badge/node-%3E%3D10.13-blue?logo=node.js&logoColor=white)
![nlm-version](https://img.shields.io/badge/version-2.0.16-blue?logo=version&logoColor=white)
# selenium-download

This module allows you
to download the latest versions
of the selenium standalone server
and the chromedriver.

Keep up to date with changes
by checking the
[releases](https://github.com/groupon-testium/selenium-download/releases).

## example

```js
var selenium = require('selenium-download');

selenium.ensure(__dirname + '/bin', function (error) {
  if (error) console.error(error.stack);
  process.exit(0);
});
```

## api

### selenium.ensure

`ensure` ensures that
the selenium.jar and chromedriver
files are in the path provided.

If they are not,
the latest versions of both
are downloaded into that path.

### selenium.update

`update` forces
the selenium.jar and chromedriver
files to be the latest available versions.
Pulls from temp directory if available.

### selenium.forceUpdate

`forceUpdate` forces
the selenium.jar and chromedriver
files to be the latest available versions.
Clears temp directory before checking.

