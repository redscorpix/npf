goog.provide('npf.userAgent.forms');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.ui.IdGenerator');
goog.require('goog.userAgent');
goog.require('npf.userAgent.utils');


/**
 * @const {RegExp}
 * @private
 */
npf.userAgent.forms.FILE_INPUT_SUPPORT_REG_EXP_ =
  /(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/;

/**
 * @const {string}
 * @private
 */
npf.userAgent.forms.SMILE_ = ':)';

/**
 * @typedef {{
 *  autocomplete: boolean,
 *  autofocus: boolean,
 *  list: boolean,
 *  max: boolean,
 *  min: boolean,
 *  multiple: boolean,
 *  pattern: boolean,
 *  placeholder: boolean,
 *  required: boolean,
 *  step: boolean
 * }}
 */
npf.userAgent.forms.InputAttributes;

/**
 * @private {boolean?}
 */
npf.userAgent.forms.capture_ = null;

/**
 * When used on an `<input>`, this attribute signifies that the resource
 * it takes should be generated via device's camera, camcorder, sound recorder.
 * @return {boolean}
 */
npf.userAgent.forms.isCaptureSupported = function() {
  if (goog.isNull(npf.userAgent.forms.capture_)) {
    npf.userAgent.forms.capture_ =
      'capture' in goog.dom.createElement(goog.dom.TagName.INPUT);
  }

  return /** @type {boolean} */ (npf.userAgent.forms.capture_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.color_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isColorSupported = function() {
  if (goog.isNull(npf.userAgent.forms.color_)) {
    /** @type {HTMLInputElement} */
    var element = npf.userAgent.forms.createInputElement_('color');

    npf.userAgent.forms.color_ =
      !!element && npf.userAgent.forms.SMILE_ != element.value;
  }

  return /** @type {boolean} */ (npf.userAgent.forms.color_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.date_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isDateSupported = function() {
  if (goog.isNull(npf.userAgent.forms.date_)) {
    /** @type {HTMLInputElement} */
    var element = npf.userAgent.forms.createInputElement_('date');

    npf.userAgent.forms.date_ =
      !!element && npf.userAgent.forms.SMILE_ != element.value;
  }

  return /** @type {boolean} */ (npf.userAgent.forms.date_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.dateTime_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isDateTimeSupported = function() {
  if (goog.isNull(npf.userAgent.forms.dateTime_)) {
    /** @type {HTMLInputElement} */
    var element = npf.userAgent.forms.createInputElement_('datetime');

    npf.userAgent.forms.dateTime_ =
      !!element && npf.userAgent.forms.SMILE_ != element.value
  }

  return /** @type {boolean} */ (npf.userAgent.forms.dateTime_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.dateTimeLocal_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isDateTimeLocalSupported = function() {
  if (goog.isNull(npf.userAgent.forms.dateTimeLocal_)) {
    /** @type {HTMLInputElement} */
    var element = npf.userAgent.forms.createInputElement_('datetime-local');

    npf.userAgent.forms.dateTimeLocal_ =
      !!element && npf.userAgent.forms.SMILE_ != element.value
  }

  return /** @type {boolean} */ (npf.userAgent.forms.dateTimeLocal_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.email_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isEmailSupported = function() {
  if (goog.isNull(npf.userAgent.forms.email_)) {
    /** @type {HTMLInputElement} */
    var element = npf.userAgent.forms.createInputElement_('email');

    npf.userAgent.forms.email_ = !!element && !!element['checkValidity'] &&
      false === element['checkValidity']();
  }

  return /** @type {boolean} */ (npf.userAgent.forms.email_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.fileInput_ = null;

/**
 * Detects whether input type="file" is available on the platform.
 * E.g. iOS < 6 and some android version don't support this.
 * @return {boolean}
 */
npf.userAgent.forms.isFileInputSupported = function() {
  if (goog.isNull(npf.userAgent.forms.fileInput_)) {
    npf.userAgent.forms.fileInput_ = false;

    /** @type {string} */
    var ua = goog.userAgent.getUserAgentString();

    if (!ua.match(npf.userAgent.forms.FILE_INPUT_SUPPORT_REG_EXP_)) {
      var elem = /** @type {!HTMLInputElement} */ (
        goog.dom.createDom(goog.dom.TagName.INPUT, {
          'type': 'file'
        }));
      npf.userAgent.forms.fileInput_ = !elem.disabled;
    }
  }

  return /** @type {boolean} */ (npf.userAgent.forms.fileInput_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.fileInputDirectory_ = null;

/**
 * When used on an `<input type="file">`, the `directory` attribute instructs
 * the user agent to present a directory selection dialog instead of the usual
 * file selection dialog.
 * @return {boolean}
 */
npf.userAgent.forms.isFileInputDirectorySupported = function() {
  if (goog.isNull(npf.userAgent.forms.fileInputDirectory_)) {
    var elem = /** @type {!HTMLInputElement} */ (
      goog.dom.createDom(goog.dom.TagName.INPUT, {
        'type': 'file'
      }));
    /** @type {string} */
    var dir = 'directory';

    npf.userAgent.forms.fileInputDirectory_ = dir in elem;

    if (!npf.userAgent.forms.fileInputDirectory_) {
      /** @type {!Array<string>} */
      var domPrefixes = npf.userAgent.utils.DOM_PREFIXES;

      for (var i = 0, len = domPrefixes.length; i < len; i++) {
        if (domPrefixes[i] + dir in elem) {
          npf.userAgent.forms.fileInputDirectory_ = true;
          break;
        }
      }
    }
  }

  return /** @type {boolean} */ (npf.userAgent.forms.fileInputDirectory_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.formActionAttr_ = null;

/**
 * Detect support for the formaction attribute on form inputs.
 * @return {boolean}
 */
npf.userAgent.forms.isFormActionAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.forms.formActionAttr_)) {
    npf.userAgent.forms.formActionAttr_ =
      'formAction' in goog.dom.createElement(goog.dom.TagName.INPUT);
  }

  return /** @type {boolean} */ (npf.userAgent.forms.formActionAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.formAttr_ = null;

/**
 * Detects whether input form="form_id" is available on the platform.
 * E.g. IE 10 (and below), don't support this.
 * @return {boolean}
 */
npf.userAgent.forms.isFormAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.forms.formAttr_)) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();
    /** @type {string} */
    var id = goog.ui.IdGenerator.getInstance().getNextUniqueId();
    var form = /** @type {!HTMLFormElement} */ (
      goog.dom.createDom(goog.dom.TagName.FORM, {
        'id': id
      }));
    var input = /** @type {!HTMLInputElement} */ (
      goog.dom.createElement(goog.dom.TagName.INPUT));
    /** @type {!Element} */
    var div = goog.dom.createElement(goog.dom.TagName.DIV);

    // IE6/7 confuses the form idl attribute and the form content attribute,
    // so we use document.createAttribute.
    try {
      input.setAttribute('form', id);
    } catch (e) {
      if (doc.createAttribute) {
        var attr = doc.createAttribute('form');
        attr.nodeValue = id;
        input.setAttributeNode(attr);
      }
    }

    div.appendChild(form);
    div.appendChild(input);

    doc.documentElement.appendChild(div);
    npf.userAgent.forms.formAttr_ =
      !!form.elements && 1 == form.elements.length && input.form === form;
    goog.dom.removeNode(div);
  }

  return /** @type {boolean} */ (npf.userAgent.forms.formAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.formEnctypeAttr_ = null;

/**
 * Detect support for the formenctype attribute on form inputs, which overrides
 * the form enctype attribute.
 * @return {boolean}
 */
npf.userAgent.forms.isFormEnctypeAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.forms.formEnctypeAttr_)) {
    npf.userAgent.forms.formEnctypeAttr_ =
      'formEnctype' in goog.dom.createElement(goog.dom.TagName.INPUT);
  }

  return /** @type {boolean} */ (npf.userAgent.forms.formEnctypeAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.formMethodAttr_ = null;

/**
 * Detect support for the formmethod attribute on form inputs.
 * @return {boolean}
 */
npf.userAgent.forms.isFormMethodAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.forms.formMethodAttr_)) {
    npf.userAgent.forms.formMethodAttr_ =
      'formMethod' in goog.dom.createElement(goog.dom.TagName.INPUT);
  }

  return /** @type {boolean} */ (npf.userAgent.forms.formMethodAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.formTargetAttr_ = null;

/**
 * Detect support for the formtarget attribute on form inputs, which overrides
 * the form target attribute.
 * @return {boolean}
 */
npf.userAgent.forms.isFormTargetAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.forms.formTargetAttr_)) {
    npf.userAgent.forms.formTargetAttr_ =
      'formtarget' in goog.dom.createElement(goog.dom.TagName.INPUT);
  }

  return /** @type {boolean} */ (npf.userAgent.forms.formTargetAttr_);
};

/**
 * @private {npf.userAgent.forms.InputAttributes?}
 */
npf.userAgent.forms.supportedInputAttrs_ = null;

/**
 * Detects support for HTML5 `<input>` element attributes.
 * @return {npf.userAgent.forms.InputAttributes}
 */
npf.userAgent.forms.getSupportedInputAttributes = function() {
  if (goog.isNull(npf.userAgent.forms.supportedInputAttrs_)) {
    // Run through HTML5's new input attributes to see if the UA understands
    // any.
    // Mike Taylr has created a comprehensive resource for testing these
    // attributes when applied to all input types:
    //   miketaylr.com/code/input-type-attr.html

    var inputElem = /** @type {!HTMLInputElement} */ (
      goog.dom.createElement(goog.dom.TagName.INPUT));

    npf.userAgent.forms.supportedInputAttrs_ = {
      autocomplete: 'autocomplete' in inputElem,
      autofocus: 'autofocus' in inputElem,
      // safari false positive's on datalist: webk.it/74252
      list: !!(goog.dom.createElement(goog.dom.TagName.DATALIST) &&
        goog.global['HTMLDataListElement']),
      max: 'max' in inputElem,
      min: 'min' in inputElem,
      multiple: 'multiple' in inputElem,
      pattern: 'pattern' in inputElem,
      placeholder: 'placeholder' in inputElem,
      required: 'required' in inputElem,
      step: 'step' in inputElem
    };
  }

  return /** @type {npf.userAgent.forms.InputAttributes} */ (
    npf.userAgent.forms.supportedInputAttrs_);
};

/**
 * @param {string} type
 * @return {HTMLInputElement}
 * @private
 */
npf.userAgent.forms.createInputElement_ = function(type) {
  var inputElement = /** @type {!HTMLInputElement} */ (
    goog.dom.createDom(goog.dom.TagName.INPUT, {
      'type': type
    }));

  if ('text' !== inputElement.type && 'style' in inputElement) {
    inputElement.value = npf.userAgent.forms.SMILE_;
    inputElement.style.cssText = 'position:absolute;visibility:hidden';

    return inputElement;
  }

  return null;
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.localizedNumber_ = null;

/**
 * Detects whether input type="number" is capable of receiving and displaying
 * localized numbers, e.g. with comma separator.
 * @return {boolean}
 */
npf.userAgent.forms.isLocalizedNumberSupported = function() {
  if (goog.isNull(npf.userAgent.forms.localizedNumber_)) {
    npf.userAgent.forms.localizedNumber_ = false;

    if (
      npf.userAgent.forms.isNumberSupported() &&
      npf.userAgent.forms.isValidationSupported()
    ) {
      /** @type {!Element} */
      var el = goog.dom.createDom(goog.dom.TagName.DIV, {
        'innerHTML': '<input type="number" value="1.0" step="0.1"/>'
      });
      /** @type {!(HTMLElement|SVGElement)} */
      var body = npf.userAgent.utils.getBody();
      /** @type {!Document} */
      var doc = goog.dom.getDomHelper().getDocument();
      var root = (function() {
        var docElement = doc.documentElement;

        return docElement.insertBefore(
          body, docElement.firstElementChild || docElement.firstChild);
      }());

      var input = el.childNodes[0];
      root.appendChild(el);
      input.focus();

      try {
        doc.execCommand('InsertText', false, '1,1');
      } catch (e) { } // prevent warnings in IE

      /** @type {boolean} */
      var diff = 'number' === input.type && 1.1 === input.valueAsNumber &&
        input.checkValidity();
      root.removeChild(el);

      if (body['fake']) {
        goog.dom.removeNode(root);
      }

      npf.userAgent.forms.localizedNumber_ = diff;
    }
  }

  return /** @type {boolean} */ (npf.userAgent.forms.localizedNumber_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.month_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isMonthSupported = function() {
  if (goog.isNull(npf.userAgent.forms.month_)) {
    /** @type {HTMLInputElement} */
    var element = npf.userAgent.forms.createInputElement_('month');

    npf.userAgent.forms.month_ =
      !!element && npf.userAgent.forms.SMILE_ != element.value;
  }

  return /** @type {boolean} */ (npf.userAgent.forms.month_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.number_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isNumberSupported = function() {
  if (goog.isNull(npf.userAgent.forms.number_)) {
    /** @type {HTMLInputElement} */
    var element = npf.userAgent.forms.createInputElement_('number');

    npf.userAgent.forms.number_ = !!element && !!element['checkValidity'] &&
      false === element['checkValidity']();
  }

  return /** @type {boolean} */ (npf.userAgent.forms.number_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.placeholderAttr_ = null;

/**
 * Tests for placeholder attribute in inputs and textareas.
 * @return {boolean}
 */
npf.userAgent.forms.isPlaceholderAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.forms.placeholderAttr_)) {
    npf.userAgent.forms.placeholderAttr_ =
      'placeholder' in goog.dom.createElement(goog.dom.TagName.INPUT) &&
      'placeholder' in goog.dom.createElement(goog.dom.TagName.TEXTAREA);
  }

  return /** @type {boolean} */ (npf.userAgent.forms.placeholderAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.range_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isRangeSupported = function() {
  if (goog.isNull(npf.userAgent.forms.range_)) {
    /** @type {HTMLInputElement} */
    var element = npf.userAgent.forms.createInputElement_('range');
    npf.userAgent.forms.range_ = !!element;

    if (element && goog.isDef(element.style['WebkitAppearance'])) {
      /** @type {!Document} */
      var doc = goog.dom.getDomHelper();
      /** @type {Element} */
      var docElement = doc.documentElement;
      docElement.appendChild(element);
      /** @type {!Window} */
      var defaultView = doc.defaultView;

      // Safari 2-4 allows the smiley as a value, despite making a slider
      npf.userAgent.forms.range_ = defaultView.getComputedStyle &&
        'textfield' !==
          defaultView.getComputedStyle(element, null)['WebkitAppearance'] &&
        // Mobile android web browser has false positive, so must
        // check the height to see if the widget is actually there.
        0 !== element.offsetHeight;

      docElement.removeChild(element);
    }
  }

  return /** @type {boolean} */ (npf.userAgent.forms.range_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.requestAutocomplete_ = null;

/**
 * When used with input[autocomplete] to annotate a form,
 * form.requestAutocomplete() shows a dialog in Chrome that speeds up
 * checkout flows (payments specific for now).
 * @return {boolean}
 */
npf.userAgent.forms.isRequestAutocompleteSupported = function() {
  if (goog.isNull(npf.userAgent.forms.requestAutocomplete_)) {
    npf.userAgent.forms.requestAutocomplete_ = !!npf.userAgent.utils.prefixed(
      'requestAutocomplete', goog.dom.createElement(goog.dom.TagName.FORM));
  }

  return /** @type {boolean} */ (npf.userAgent.forms.requestAutocomplete_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.search_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isSearchSupported = function() {
  if (goog.isNull(npf.userAgent.forms.search_)) {
    npf.userAgent.forms.search_ =
      !!npf.userAgent.forms.createInputElement_('search');
  }

  return /** @type {boolean} */ (npf.userAgent.forms.search_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.tel_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isTelSupported = function() {
  if (goog.isNull(npf.userAgent.forms.tel_)) {
    npf.userAgent.forms.tel_ = !!npf.userAgent.forms.createInputElement_('tel');
  }

  return /** @type {boolean} */ (npf.userAgent.forms.tel_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.textareaMaxLengthAttr_ = null;

/**
 * Detect support for the maxlength attribute of a textarea element.
 * @return {boolean}
 */
npf.userAgent.forms.isTextareaMaxLengthAttributeSupported = function() {
  if (goog.isNull(npf.userAgent.forms.textareaMaxLengthAttr_)) {
    npf.userAgent.forms.textareaMaxLengthAttr_ =
      'maxLength' in goog.dom.createElement(goog.dom.TagName.TEXTAREA);
  }

  return /** @type {boolean} */ (npf.userAgent.forms.textareaMaxLengthAttr_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.time_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isTimeSupported = function() {
  if (goog.isNull(npf.userAgent.forms.time_)) {
    /** @type {HTMLInputElement} */
    var element = npf.userAgent.forms.createInputElement_('time');

    npf.userAgent.forms.time_ =
      !!element && npf.userAgent.forms.SMILE_ != element.value;
  }

  return /** @type {boolean} */ (npf.userAgent.forms.time_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.url_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isUrlSupported = function() {
  if (goog.isNull(npf.userAgent.forms.url_)) {
    /** @type {HTMLInputElement} */
    var element = npf.userAgent.forms.createInputElement_('url');

    npf.userAgent.forms.url_ = !!element && !!element['checkValidity'] &&
      false === element['checkValidity']();
  }

  return /** @type {boolean} */ (npf.userAgent.forms.url_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.validation_ = null;

/**
 * This implementation only tests support for interactive form validation.
 * @return {boolean}
 */
npf.userAgent.forms.isValidationSupported = function() {
  if (goog.isNull(npf.userAgent.forms.validation_)) {
    npf.userAgent.forms.validation_ = false;

    var form = /** @type {!HTMLFormElement} */ (
      goog.dom.createElement(goog.dom.TagName.FORM));

    if (('checkValidity' in form) && ('addEventListener' in form)) {
      npf.userAgent.forms.validation_ = 'reportValidity' in form;

      if (!npf.userAgent.forms.validation_) {
        // Prevent form from being submitted
        form.addEventListener('submit', function(e) {
          // Old Presto based Opera does not validate form, if submit is prevented
          // although Opera Mini servers use newer Presto.
          if (!goog.global['opera'] || goog.global['operamini']) {
            e.preventDefault();
          }

          e.stopPropagation();
        }, false);

        // Calling form.submit() doesn't trigger interactive validation,
        // use a submit button instead
        //older opera browsers need a name attribute
        form.innerHTML = '<input name="modTest" required><button></button>';

        /** @type {string} */
        var styles = '#' + npf.userAgent.utils.ID +
          ' form{position:absolute;top:-99999em}';

        npf.userAgent.utils.testStyles(styles, function(node) {
          node.appendChild(form);

          // Record whether "invalid" event is fired
          form.childNodes[0].addEventListener('invalid', function(e) {
            npf.userAgent.forms.validation_ = true;
            e.preventDefault();
            e.stopPropagation();
          }, false);

          // Submit form by clicking submit button
          form.childNodes[1].click();
        });
      }
    }
  }

  return /** @type {boolean} */ (npf.userAgent.forms.validation_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.forms.week_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.forms.isWeekSupported = function() {
  if (goog.isNull(npf.userAgent.forms.week_)) {
    /** @type {HTMLInputElement} */
    var element = npf.userAgent.forms.createInputElement_('week');

    npf.userAgent.forms.week_ =
      !!element && npf.userAgent.forms.SMILE_ != element.value;
  }

  return /** @type {boolean} */ (npf.userAgent.forms.week_);
};
