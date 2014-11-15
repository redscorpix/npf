var path = require('path');


/**
 * @param {string=} opt_rootPath
 * @constructor
 */
var Settings = function(opt_rootPath) {
	/** @type {string} */
	this.rootPath = opt_rootPath || path.normalize(__dirname + '/..');
	/** @type {string} */
	this.binPath = this.rootPath + '/bin';
	/** @type {string} */
	this.buildPath = this.rootPath + '/build';
	/** @type {string} */
	this.sourcePath = this.rootPath + '/source';
	/** @type {string} */
	this.npfSourcePath = this.sourcePath + '/npf';
	/** @type {string} */
	this.googPath = this.rootPath + '/closure-library';
	/** @type {string} */
	this.depsWriterPath = this.binPath + '/closure/depswriter.py';
	/** @type {string} */
	this.closureBuilderPath = this.binPath + '/closure/closurebuilder.py';
	/** @type {string} */
	this.compilerPath = this.binPath + '/compiler.jar';

	var compilerFlags = [
    '--charset UTF-8',
    '--compilation_level ADVANCED_OPTIMIZATIONS',
    '--jscomp_warning accessControls',
    '--jscomp_warning ambiguousFunctionDecl',
    '--jscomp_warning checkEventfulObjectDisposal',
    '--jscomp_warning checkRegExp',
    '--jscomp_warning checkStructDictInheritance',
    '--jscomp_warning checkTypes',
    '--jscomp_warning checkVars',
    '--jscomp_warning const',
    '--jscomp_warning constantProperty',
    '--jscomp_warning deprecated',
    '--jscomp_warning duplicateMessage',
    '--jscomp_warning es3',
    '--jscomp_warning es5Strict',
    '--jscomp_warning externsValidation',
    '--jscomp_warning fileoverviewTags',
    '--jscomp_warning globalThis',
    '--jscomp_warning internetExplorerChecks',
    '--jscomp_warning invalidCasts',
    '--jscomp_warning misplacedTypeAnnotation',
    '--jscomp_warning missingProperties',
    '--jscomp_warning missingProvide',
    '--jscomp_warning missingRequire',
    '--jscomp_warning missingReturn',
    '--jscomp_warning nonStandardJsDocs',
    //'--jscomp_warning reportUnknownTypes',
    '--jscomp_warning suspiciousCode',
    '--jscomp_warning strictModuleDepCheck',
    '--jscomp_warning typeInvalidation',
    '--jscomp_warning undefinedNames',
    '--jscomp_warning undefinedVars',
    '--jscomp_warning unknownDefines',
    '--jscomp_warning uselessCode',
    '--jscomp_warning visibility',
    '--output_wrapper=\"(function(){%output%})();\"',
    '--use_types_for_optimization',
    '--warning_level=VERBOSE'
  ];
	/** @type {!Object} */
	this.applicationOptions = {
		NpfEventDispatcher: {
			outputPath: this.buildPath + '/npf_event_dispatcher.js',
			compilerFlags: compilerFlags,
			defines: {
				'goog.DEBUG': false
			},
			jsFiles: [
				this.googPath,
				this.sourcePath
			],
			inputs: [
				this.sourcePath + '/npf_event_dispatcher/event_dispatcher.js'
			]
		},
		npfTransition: {
			outputPath: this.buildPath + '/npf_animation.js',
			compilerFlags: compilerFlags,
			defines: {
				'goog.DEBUG': false
			},
			jsFiles: [
				this.googPath,
				this.sourcePath
			],
			inputs: [
				this.sourcePath + '/npf_transition/transition.js'
			]
		},
		npfSupport: {
			outputPath: this.buildPath + '/npf_support.js',
			compilerFlags: compilerFlags,
			defines: {
				'goog.DEBUG': false
			},
			jsFiles: [
				this.googPath,
				this.sourcePath
			],
			inputs: [
				this.sourcePath + '/npf_support/support.js'
			]
		},
		npfSvg: {
			outputPath: this.buildPath + '/npf_svg.js',
			compilerFlags: compilerFlags,
			defines: {
				'goog.DEBUG': false
			},
			jsFiles: [
				this.googPath,
				this.sourcePath
			],
			inputs: [
				this.sourcePath + '/npf_svg/svg.js'
			]
		},
		npfBlur: {
			outputPath: this.buildPath + '/npf_blur.js',
			compilerFlags: compilerFlags,
			defines: {
				'goog.DEBUG': false
			},
			jsFiles: [
				this.googPath,
				this.sourcePath
			],
			inputs: [
				this.sourcePath + '/npf_blur/blur.js'
			]
		}
	};
};

/**
 * @return {!Object}
 */
Settings.prototype.getApplicationOptions = function() {
	return this.applicationOptions;
};

/**
 * @param {string} appName
 * @return {Object}
 */
Settings.prototype.getApplicationOption = function(appName) {
	return this.applicationOptions[appName] || null;
};

exports.Settings = Settings;
