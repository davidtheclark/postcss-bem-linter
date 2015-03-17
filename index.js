'use strict';

/**
 * Module dependencies
 */

var objectAssign = require('object-assign');
var validateCustomProperties = require('./lib/validate-properties');
var validateSelectors = require('./lib/validate-selectors');
var validateRules = require('./lib/validate-rules');
var presetPatterns = require('./lib/preset-patterns');

/**
 * Module exports
 */

module.exports = conformance;

var RE_DIRECTIVE = /\*\s*@define ([-_a-zA-Z0-9]+)\s*(?:;\s*(use strict))?\s*/;

/**
 * Check patterns or setup defaults. If the input CSS does not have a
 * directive defining a component name according to the specified pattern,
 * do nothing -- or warn, if the directive is there but the name does not match.
 * Then call all of the validators.
 *
 * @param {Object} [opts = 'suit']
 * @param {String} [opts.pattern]
 * @param {RegExp} [opts.componentName]
 * @param {Object|Function} [opts.selectors]
 * @param {String} [opts.namespace]
 */
function conformance(opts) {
  opts = opts || 'suit';
  if (typeof opts === 'string') {
    opts = presetPatterns[verifyPatternName(opts)];
  } else if (opts.pattern) {
    objectAssign(opts, presetPatterns[verifyPatternName(opts.pattern)]);
  }
  var componentNamePattern = opts.componentName || /[-_a-zA-Z0-9]+/;

  return function (styles) {
    var firstNode = styles.nodes[0];
    if (firstNode.type !== 'comment') { return; }

    var initialComment = firstNode.text;
    if (!initialComment || !initialComment.match(RE_DIRECTIVE)) { return; }

    var componentName = initialComment.match(RE_DIRECTIVE)[1].trim();
    if (!componentName.match(componentNamePattern)) {
      throw firstNode.error(
        'Invalid component name in definition /*' +
        initialComment + '*/.',
        'Component names must match the pattern ' + componentNamePattern
      );
      return;
    }

    var isStrict = initialComment.match(RE_DIRECTIVE)[2] === 'use strict';

    validateRules(styles);
    validateSelectors(styles, componentName, isStrict, opts);
    validateCustomProperties(styles, componentName);
  };
}

/**
 * Throw an error if user has entered a nonexistent preset pattern name.
 *
 * @param {String} name - The name to check
 * @return {String} The name that was passed in
 */
function verifyPatternName(name) {
  if (!presetPatterns[name]) {
    throw new Error('There is no preset pattern named "' + name + '"');
  }
  return name;
}
