goog.provide('npf.string');

goog.require('goog.format.EmailAddress');
goog.require('goog.string');


/**
 * @param {Array.<string>} variants
 * @param {number} count
 * @return {string}
 */
npf.string.declension = function(variants, count) {
	count = Math.floor(count);

	if (/1[1-4]$/.test(count)) {
		return variants[2];
	}
	if (/[2-4]$/.test(count)) {
		return variants[1];
	}
	if (/1$/.test(count)) {
		return variants[0];
	}

	return variants[2];
};

/**
 * Возвращает длительность в формате H:i:s.
 * @param {number} duration In seconds.
 * @return {string}
 */
npf.string.hisDuration = function(duration) {
	/** @type {number} */
	var hours = Math.floor(duration / 3600);
	/** @type {number} */
	var seconds = duration - hours * 3600;
	/** @type {number} */
	var minutes = Math.floor(seconds / 60);
	/** @type {!Array.<string|number>} */
	var result = [];

	seconds -= minutes * 60;

	if (hours) {
		result.push(hours);
		result.push(npf.string.pad(minutes, 2));
	} else if (minutes) {
		result.push(minutes);
	} else {
		result.push('0');
	}

	result.push(npf.string.pad(seconds, 2));

	return result.join(':');
};

/**
 * @param {string} template
 * @param {Object.<string,string|number>=} opt_scope
 * @return {string}
 */
npf.string.supplant = function(template, opt_scope) {
	if (!opt_scope) {
		return template;
	}

	/** @type {string} */
	var result = '';

	/** @type {boolean} */
	var isEscape = false;
	/** @type {boolean} */
	var isInserting = false;
	/** @type {string} */
	var insertName;

	for (var i = 0; i < template.length; i++) {
		/** @type {string} */
		var symbol = template[i];

		if (isEscape) {
			isEscape = false;
		} else if ('\\' == symbol) {
			symbol = '';
			isEscape = true;
		} else if (!isInserting && '{' == symbol) {
			symbol = '';
			isInserting = true;
			insertName = '';
		} else if (isInserting && '}' == symbol) {
			symbol = '';
			isInserting = false;

			if (goog.isNumber(opt_scope[insertName]) || goog.isString(opt_scope[insertName])) {
				result += opt_scope[insertName] + '';
			}
		}

		if (symbol) {
			if (isInserting) {
				insertName += symbol;
			} else {
				result += symbol;
			}
		}
	}

	return result;
};

/**
 * @param {string} template
 * @return {!Array.<string>}
 */
npf.string.getIdsFromTemplate = function(template) {
	/** @type {!Array.<string>} */
	var ids = [];

	/** @type {boolean} */
	var isEscape = false;
	/** @type {boolean} */
	var isInserting = false;
	/** @type {string} */
	var insertName;

	for (var i = 0; i < template.length; i++) {
		/** @type {string} */
		var symbol = template[i];

		if (isEscape) {
			isEscape = false;
		} else if ('\\' == symbol) {
			symbol = '';
			isEscape = true;
		} else if (!isInserting && '{' == symbol) {
			symbol = '';
			isInserting = true;
			insertName = '';
		} else if (isInserting && '}' == symbol) {
			symbol = '';
			isInserting = false;

			ids.push(insertName);
		}

		if (symbol && isInserting) {
			insertName += symbol;
		}
	}

	return ids;
};

/**
 * Удаляет тэги.
 * @param {string} source
 * @return {string}
 */
npf.string.stripTags = function(source) {
	return source.replace(/<\/?[^>]+>/gi, '');
};

/**
 * Truncate email address by pattern aa<...>aa@bb.cc or aa@bb<...>
 * @param {string} email Email address
 * @param {number=} opt_maxLength Max length of truncated email address, default is 30
 * @param {number=} opt_maxHostLength Max lenngth substring after "@" of email address, default is 23
 * @return {string}
 */
npf.string.trunctateEmail = function(email, opt_maxLength, opt_maxHostLength) {
	/** @type {number} */
	var atPos = email.indexOf('@');

	if (-1 == atPos) {
		return email;
	}

	/** @type {string} */
	var emailName = email.substr(0, atPos);
	/** @type {string} */
	var emailHost = email.substr(atPos);
	/** @type {number} */
	var maxLength = opt_maxLength || 30;
	/** @type {number} */
	var maxHostLength = opt_maxHostLength || 23;

	if (maxHostLength < emailHost.length) {
		return goog.string.truncate(email, maxLength);
	}

	/** @type {number} */
	var maxNameLength = maxLength - emailHost.length;

	return goog.string.truncateMiddle(emailName, maxNameLength) + emailHost;
};

/**
 * Добавляет ведущие нули.
 * @param {number} number
 * @param {number} length
 * @return {string}
 */
npf.string.pad = function(number, length) {
	/** @type {number} */
	var numberLen = number.toString().length;
	/** @type {string} */
	var resultNumber = number.toString();

	while (numberLen++ < length) {
		resultNumber = '0' + resultNumber;
	}

	return resultNumber;
};
