goog.provide('npf.ui.vk.LikeButton');
goog.provide('npf.ui.vk.LikeButton.Type');
goog.provide('npf.ui.vk.LikeButton.Verb');

goog.require('npf.ui.Component');


/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.Component}
 */
npf.ui.vk.LikeButton = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(npf.ui.vk.LikeButton, npf.ui.Component);


/**
 * @enum {string}
 */
npf.ui.vk.LikeButton.Type = {
  BUTTON: 'button', // Кнопка с миниатюрным счетчиком
  FULL: 'full', // Кнопка с текстовым счетчиком
  MINI: 'mini', // Миниатюрная кнопка
  VERTICAL: 'vertical' // Миниатюрная кнопка, счетчик сверху
};

/**
 * @enum {number}
 */
npf.ui.vk.LikeButton.Verb = {
  INTERESTING: 1,
  LIKE: 0
};

/**
 * @type {boolean}
 * @private
 */
npf.ui.vk.LikeButton.prototype._inited = false;

/**
 * Идентификатор страницы. Используется в случае, если у одной статьи несколько
 * адресов, а также на динамических сайтах, у которых меняется только хэш.
 * Также применяется для снятия кэша со страницы.
 * Значение по умолчанию — контрольная сумма от location.href.
 * @type {number|undefined}
 */
npf.ui.vk.LikeButton.prototype.pageId;

/**
 * Вариант дизайна кнопки
 * @type {npf.ui.vk.LikeButton.Type}
 */
npf.ui.vk.LikeButton.prototype.type = npf.ui.vk.LikeButton.Type.FULL;

/**
 * Ширина блока в пикселах (только для type = npf.ui.vk.LikeButton.Type.FULL)
 * Должно быть больше 200
 * @type {number}
 */
npf.ui.vk.LikeButton.prototype.width = 350;

/**
 * Название страницы для отображения в превью у записи на стене
 * @type {string}
 */
npf.ui.vk.LikeButton.prototype.pageTitle = '';

/**
 * Описание страницы для отображения в превью у записи на стене
 * @type {string}
 */
npf.ui.vk.LikeButton.prototype.pageDescription = '';

/**
 * Адрес страницы для отображения у записи на стене
 * Указывается в случае, если адрес страницы отличается от адреса,
 * на котором отображается кнопка.
 * @type {string}
 */
npf.ui.vk.LikeButton.prototype.pageUrl = '';

/**
 * Адрес картинки-миниатюры для отображения в превью у записи на стене
 * @type {string}
 */
npf.ui.vk.LikeButton.prototype.pageImage = '';

/**
 * Текст, который будет опубликован на стене после нажатия "Рассказать друзьям"
 * Максимальная длина — 140 символов
 * Значение по умолчанию — название страницы
 * @type {string}
 */
npf.ui.vk.LikeButton.prototype.text = '';

/**
 * Высота кнопки в пикселях. Допустимые значения: 18, 20, 22, 24.
 * @type {number}
 */
npf.ui.vk.LikeButton.prototype.height = 22;

/**
 * Вариант формулировки текста внутри кнопки
 * @type {npf.ui.vk.LikeButton.Verb}
 */
npf.ui.vk.LikeButton.prototype.verb = npf.ui.vk.LikeButton.Verb.LIKE;


/** @inheritDoc */
npf.ui.vk.LikeButton.prototype.createDom = function() {
  goog.base(this, 'createDom');

  /** @type {Element} */
  var element = this.getElement();
  element.id = this.getId();
};

/** @inheritDoc */
npf.ui.vk.LikeButton.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (!this._inited) {
    this._inited = true;

    var attrs = {
      'type': this.type,
      'height': this.height,
      'verb': this.verb
    };

    if (npf.ui.vk.LikeButton.Type.FULL == this.type) {
      attrs['width'] = this.width;
    }

    if (this.pageTitle) {
      attrs['pageTitle'] = this.pageTitle;
    }

    if (this.pageDescription) {
      attrs['pageDescription'] = this.pageDescription;
    }

    if (this.pageUrl) {
      attrs['pageUrl'] = this.pageUrl;
    }

    if (this.pageImage) {
      attrs['pageImage'] = this.pageImage;
    }

    if (this.text) {
      attrs['text'] = this.text;
    }

    this.getDomHelper().getWindow()['VK']['Widgets']['Like'](
      this.getId(), attrs, this.pageId);
  }
};
