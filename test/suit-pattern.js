var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertFailure = util.assertFailure;
var selectorTester = util.selectorTester;
var fixture = util.fixture;

describe('using SUIT pattern (default)', function () {
  it('selectors must begin with the component name', function () {
    assertSuccess(fixture('valid-rules'));
    assertFailure(fixture('all-false-match'));
    assertFailure(fixture('all-invalid-selector-tag'));
    assertFailure(fixture('all-invalid-selector-component'));
  });

  it('custom properties must begin with the component name', function () {
    assertSuccess(fixture('all-valid-root-vars'));
    assertFailure(fixture('all-invalid-root-vars'));
    assertFailure(fixture('all-invalid-root-property'));
    assertFailure(fixture('all-invalid-root-selector'));
  });

  it('must apply to selectors in media queries', function () {
    assertSuccess(fixture('all-valid-selector-in-media-query'));
    assertFailure(fixture('all-invalid-selector-in-media-query'));
  });

  it('understands namespaces', function () {
    var s = selectorTester('/** @define Foo */');

    assertSuccess(s('.ns-Foo'), { pattern: 'suit', namespace: 'ns' });
    assertFailure(s('.Foo'), { pattern: 'suit', namespace: 'ns' });
    assertSuccess(s('.Ho04__d-Foo'), { pattern: 'suit', namespace: 'Ho04__d' });
  });

  describe('in strict mode', function () {
    it('selectors must only contain valid component classes', function () {
      assertSuccess(fixture('strict-valid-rules'));
      assertFailure(fixture('strict-invalid-selector'));
    });
  });
});
