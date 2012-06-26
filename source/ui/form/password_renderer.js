goog.provide('npf.ui.form.PasswordRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.ui.form.TextRenderer');


/**
 * @constructor
 * @extends {npf.ui.form.TextRenderer}
 */
npf.ui.form.PasswordRenderer = function() {
	goog.base(this);
};
goog.inherits(npf.ui.form.PasswordRenderer, npf.ui.form.TextRenderer);
goog.addSingletonGetter(npf.ui.form.PasswordRenderer);


/**
 * @param {npf.ui.form.Password} block
 * @param {Element} element
 * @protected
 */
npf.ui.form.PasswordRenderer.prototype.appendFieldElement = function(block, element) {
	/** @type {Element} */
	var valueElement = goog.dom.createDom(goog.dom.TagName.INPUT, {
		'class': this.getValueCssClass(),
		'name': block.getName(),
		'type': 'password'
	});
	goog.dom.appendChild(this.getContentElement(element), valueElement);
};
