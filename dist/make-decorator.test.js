"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _utilDeprecate = _interopRequireDefault(require("util-deprecate"));

var _makeDecorator = require("./make-decorator");

var _client_api = require("../../core/src/client/preview/client_api");

jest.mock('util-deprecate');
var deprecatedFns = [];

_utilDeprecate.default.mockImplementation(function (fn, warning) {
  var deprecatedFn = jest.fn(fn);
  deprecatedFns.push({
    deprecatedFn: deprecatedFn,
    warning: warning
  });
  return deprecatedFn;
});

describe('makeDecorator', function () {
  it('returns a decorator that passes parameters on the parameters argument', function () {
    var wrapper = jest.fn();
    var decorator = (0, _makeDecorator.makeDecorator)({
      wrapper: wrapper,
      name: 'test',
      parameterName: 'test'
    });
    var story = jest.fn();
    var decoratedStory = (0, _client_api.defaultDecorateStory)(story, [decorator]);
    var context = {
      parameters: {
        test: 'test-val'
      }
    };
    decoratedStory(context);
    expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, {
      parameters: 'test-val'
    });
  });
  it('passes options added at decoration time', function () {
    var wrapper = jest.fn();
    var decorator = (0, _makeDecorator.makeDecorator)({
      wrapper: wrapper,
      name: 'test',
      parameterName: 'test'
    });
    var story = jest.fn();
    var options = 'test-val';
    var decoratedStory = (0, _client_api.defaultDecorateStory)(story, [decorator(options)]);
    var context = {};
    decoratedStory(context);
    expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, {
      options: 'test-val'
    });
  });
  it('passes both options *and* parameters at the same time', function () {
    var wrapper = jest.fn();
    var decorator = (0, _makeDecorator.makeDecorator)({
      wrapper: wrapper,
      name: 'test',
      parameterName: 'test'
    });
    var story = jest.fn();
    var options = 'test-val';
    var decoratedStory = (0, _client_api.defaultDecorateStory)(story, [decorator(options)]);
    var context = {
      parameters: {
        test: 'test-val'
      }
    };
    decoratedStory(context);
    expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, {
      options: 'test-val',
      parameters: 'test-val'
    });
  });
  it('passes nothing if neither are supplied', function () {
    var wrapper = jest.fn();
    var decorator = (0, _makeDecorator.makeDecorator)({
      wrapper: wrapper,
      name: 'test',
      parameterName: 'test'
    });
    var story = jest.fn();
    var decoratedStory = (0, _client_api.defaultDecorateStory)(story, [decorator]);
    var context = {};
    decoratedStory(context);
    expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, {});
  });
  it('calls the story directly if neither options or parameters are supplied and skipIfNoParametersOrOptions is true', function () {
    var wrapper = jest.fn();
    var decorator = (0, _makeDecorator.makeDecorator)({
      wrapper: wrapper,
      name: 'test',
      parameterName: 'test',
      skipIfNoParametersOrOptions: true
    });
    var story = jest.fn();
    var decoratedStory = (0, _client_api.defaultDecorateStory)(story, [decorator]);
    var context = {};
    decoratedStory(context);
    expect(wrapper).not.toHaveBeenCalled();
    expect(story).toHaveBeenCalled();
  });
  it('calls the story directly if the disable parameter is passed to the decorator', function () {
    var wrapper = jest.fn();
    var decorator = (0, _makeDecorator.makeDecorator)({
      wrapper: wrapper,
      name: 'test',
      parameterName: 'test',
      skipIfNoParametersOrOptions: true
    });
    var story = jest.fn();
    var decoratedStory = (0, _client_api.defaultDecorateStory)(story, [decorator]);
    var context = {
      disable: true
    };
    decoratedStory(context);
    expect(wrapper).not.toHaveBeenCalled();
    expect(story).toHaveBeenCalled();
  });
  it('passes options added at story time, but with a deprecation warning, if allowed', function () {
    deprecatedFns = [];
    var wrapper = jest.fn();
    var decorator = (0, _makeDecorator.makeDecorator)({
      wrapper: wrapper,
      name: 'test',
      parameterName: 'test',
      allowDeprecatedUsage: true
    });
    var options = 'test-val';
    var story = jest.fn();
    var decoratedStory = decorator(options)(story);
    expect(deprecatedFns).toHaveLength(1);
    expect(deprecatedFns[0].warning).toMatch('addDecorator(test)');
    var context = {};
    decoratedStory(context);
    expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, {
      options: 'test-val'
    });
    expect(deprecatedFns[0].deprecatedFn).toHaveBeenCalled();
  });
  it('throws if options are added at storytime, if not allowed', function () {
    var wrapper = jest.fn();
    var decorator = (0, _makeDecorator.makeDecorator)({
      wrapper: wrapper,
      name: 'test',
      parameterName: 'test',
      allowDeprecatedUsage: false
    });
    var options = 'test-val';
    var story = jest.fn();
    expect(function () {
      return decorator(options)(story);
    }).toThrow(/not allowed/);
  });
});