var async = require('async');
var closureBuilder = require('closurebuilder');

var settings = new (require('./settings.js').Settings)();

main(process.argv[2], process.argv[3]);

function main(opt_command, opt_appNamespace) {
	if (opt_command && 'compile' == opt_command) {
		var appOptions = opt_appNamespace ? settings.getApplicationOptions(opt_appNamespace) : null;
		var appNamespace = appOptions ? opt_appNamespace : null;

		compileAppJs(appNamespace);
	}
}

function compileAppJs(opt_appNamespace) {
	var appNamespaces = [];

	if (opt_appNamespace) {
		appNamespaces.push(opt_appNamespace);
	} else {
		var applications = settings.getApplicationOptions();

		for (var appNamespace in applications) {
			appNamespaces.push(appNamespace);
		}
	}

	async.eachSeries(appNamespaces, compileJs, function(err) {
		if (err) {
			console.error(err);
		}
	});
}

/**
 * @param {string} appNamespace
 * @param {function(Error)} callback
 */
function compileJs(appNamespace, callback) {
	var application = settings.getApplicationOption(appNamespace);
	var compilerPath = settings.compilerPath;
	var inputs = application.inputs;
	var jsFiles = application.jsFiles;

	closureBuilder.builder.compile(compilerPath, inputs, jsFiles, {
		compilerFlags: application.compilerFlags,
		defines: application.defines,
		externs: application.externs,
		jvmFlags: application.jvmFlags,
		maxBuffer: application.maxBuffer,
		outputFile: application.outputPath
	}, callback);
}
