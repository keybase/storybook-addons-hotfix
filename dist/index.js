'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
Object.defineProperty(exports, 'mockChannel', {
  enumerable: true,
  get: function get() {
    return _storybookChannelMock.default
  },
})
Object.defineProperty(exports, 'makeDecorator', {
  enumerable: true,
  get: function get() {
    return _makeDecorator.makeDecorator
  },
})
exports.default = exports.AddonStore = void 0

var _objectSpread2 = _interopRequireDefault(require('@babel/runtime/helpers/objectSpread'))

var _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'))

var _createClass2 = _interopRequireDefault(require('@babel/runtime/helpers/createClass'))

var _global = _interopRequireDefault(require('global'))

var _components = {} // require("@storybook/components");

var _storybookChannelMock = _interopRequireDefault(require('./storybook-channel-mock'))

var _makeDecorator = require('./make-decorator')

// Resolves to window in browser and to global in node
var AddonStore =
  /*#__PURE__*/
  (function() {
    function AddonStore() {
      ;(0, _classCallCheck2.default)(this, AddonStore)
      this.loaders = {}
      this.panels = {}
      this.channel = null
      this.preview = null
      this.database = null
    }

    ;(0, _createClass2.default)(AddonStore, [
      {
        key: 'getChannel',
        value: function getChannel() {
          // this.channel should get overwritten by setChannel. If it wasn't called (e.g. in non-browser environment), throw.
          if (!this.channel) {
            throw new Error(
              'Accessing nonexistent addons channel, see https://storybook.js.org/basics/faq/#why-is-there-no-addons-channel'
            )
          }

          return this.channel
        },
      },
      {
        key: 'hasChannel',
        value: function hasChannel() {
          return Boolean(this.channel)
        },
      },
      {
        key: 'setChannel',
        value: function setChannel(channel) {
          this.channel = channel
        },
      },
      {
        key: 'getPreview',
        value: function getPreview() {
          return this.preview
        },
      },
      {
        key: 'setPreview',
        value: function setPreview(preview) {
          this.preview = preview
        },
      },
      {
        key: 'getDatabase',
        value: function getDatabase() {
          return this.database
        },
      },
      {
        key: 'setDatabase',
        value: function setDatabase(database) {
          this.database = database
        },
      },
      {
        key: 'getPanels',
        value: function getPanels() {
          return this.panels
        },
      },
      {
        key: 'addPanel',
        value: function addPanel(name, panel) {
          // supporting legacy addons, which have not migrated to the active-prop
          var original = panel.render

          if (original && original.toString() && !original.toString().match(/active/)) {
            this.panels[name] = panel(0, _objectSpread2.default)({}, panel, {
              render: function render(_ref) {
                var active = _ref.active
                return (0, _components.TabWrapper)({
                  active: active,
                  render: original,
                })
              },
            })
          } else {
            this.panels[name] = panel
          }
        },
      },
      {
        key: 'register',
        value: function register(name, loader) {
          this.loaders[name] = loader
        },
      },
      {
        key: 'loadAddons',
        value: function loadAddons(api) {
          var _this = this

          Object.keys(this.loaders)
            .map(function(name) {
              return _this.loaders[name]
            })
            .forEach(function(loader) {
              return loader(api)
            })
        },
      },
    ])
    return AddonStore
  })() // Enforce addons store to be a singleton

exports.AddonStore = AddonStore
var KEY = '__STORYBOOK_ADDONS'

function getAddonsStore() {
  if (!_global.default[KEY]) {
    _global.default[KEY] = new AddonStore()
  }

  return _global.default[KEY]
}

var _default = getAddonsStore()

exports.default = _default
