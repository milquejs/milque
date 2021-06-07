'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var asset = require('@milque/asset');
var display = require('@milque/display');
var input = require('@milque/input');
var mogli = require('@milque/mogli');
var random = require('@milque/random');
var scene = require('@milque/scene');
var util = require('@milque/util');

function _interopNamespace(e) {
	if (e && e.__esModule) return e;
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () {
						return e[k];
					}
				});
			}
		});
	}
	n['default'] = e;
	return Object.freeze(n);
}

var asset__namespace = /*#__PURE__*/_interopNamespace(asset);
var display__namespace = /*#__PURE__*/_interopNamespace(display);
var input__namespace = /*#__PURE__*/_interopNamespace(input);
var mogli__namespace = /*#__PURE__*/_interopNamespace(mogli);
var random__namespace = /*#__PURE__*/_interopNamespace(random);
var scene__namespace = /*#__PURE__*/_interopNamespace(scene);
var util__namespace = /*#__PURE__*/_interopNamespace(util);



exports.asset = asset__namespace;
exports.display = display__namespace;
exports.input = input__namespace;
exports.mogli = mogli__namespace;
exports.random = random__namespace;
exports.scene = scene__namespace;
exports.util = util__namespace;
