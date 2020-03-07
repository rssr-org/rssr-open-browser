/**
 * cloned version of open-browser-webpack-plugin
 * https://www.npmjs.com/package/open-browser-webpack-plugin
 *
 * open-browser-webpack-plugin is good webpack plugin but developer of this
 * package archived the Reipository.
 *
 * we clone it for update 'open' version and do some changes.
 *
 */
const open = require('open');

/**
 * Creates a function that is restricted to invoking func once.
 * Repeat calls to the function return the value of the first invocation.
 * The func is invoked with the this binding and arguments of the created function.
 * @param {Function} function The function to restrict.
 * @returns {Function} Returns the new restricted function.
 */
function once(fn) {
    let called = false;
    return function() {
        if (!called) {
            called = true;
            fn.apply(this, arguments);
        }
    }
}

/**
 * Opens the browser the first time if there's no compilation errors.
 * @param {Object} options Options object.
 * @param {String} [options.url] Url to open in browser.
 * @param {Number} [options.delay] If no delay (in ms) is specified, the browser will be started immediately.
 * @param {String} [options.browser] Browser to use. If not available, use default browser.
 * @param {Boolean} [options.ignoreErrors] Ignore webpack errors.
 * @constructor
 */
function OpenBrowserPlugin(options) {
    options || (options = {});
    this.url = options.url || 'http://localhost:8000';
    this.delay = options.delay || 0;
    this.browser = options.browser;
    this.ignoreErrors = options.ignoreErrors;
}

OpenBrowserPlugin.prototype.apply = function(compiler) {
    let isWatching = false;
    const url = this.url;
    const delay = this.delay;
    const browser = this.browser;
    const ignoreErrors = this.ignoreErrors;
    const executeOpen = once(function() {
        setTimeout(function () {
            open(url, browser, function(err) {
                if (err) throw err;
            });
        }, delay);
    })

    compiler.plugin('watch-run', function checkWatchingMode(watching, done) {
        isWatching = true;
        done();
    });

    compiler.plugin('done', function doneCallback(stats) {
        if (isWatching && (!stats.hasErrors() || ignoreErrors)) {
            executeOpen();
        }
    })
}

module.exports = OpenBrowserPlugin;
