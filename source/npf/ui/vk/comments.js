goog.provide('npf.ui.vk.Comments');
goog.provide('npf.ui.vk.Comments.Attach');
goog.provide('npf.ui.vk.Comments.Size');

goog.require('npf.ui.Component');


/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.Component}
 */
npf.ui.vk.Comments = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(npf.ui.vk.Comments, npf.ui.Component);


/**
 * @enum {string}
 */
npf.ui.vk.Comments.Attach = {
  ALL: '*',
  AUDIO: 'audio',
  GRAFFITI: 'graffiti',
  LINK: 'link',
  PHOTO: 'photo',
  VIDEO: 'video'
};

/**
 * @enum {string}
 */
npf.ui.vk.Comments.Size = {
  AUTO: 'auto',
  MINI: 'mini',
  NORMAL: 'normal'
};

/**
 * @type {boolean}
 * @private
 */
npf.ui.vk.Comments.prototype._inited = false;

/**
 * Идентификатор страницы. Используется в случае, если у одной статьи несколько
 * адресов, а также на динамических сайтах, у которых меняется только хэш.
 * Также применяется для снятия кэша со страницы.
 * Значение по умолчанию — контрольная сумма от location.href.
 * @type {number|undefined}
 */
npf.ui.vk.Comments.prototype.pageId;

/**
 * Ширина блока в пикселах
 * Должно быть больше 300
 * @type {npf.ui.vk.Comments.Type}
 */
npf.ui.vk.Comments.prototype.width = 350;

/**
 * Количество комментариев на странице (5-100)
 * @type {npf.ui.vk.Comments.Type}
 */
npf.ui.vk.Comments.prototype.limit = 10;

/**
 * Типа прикреплений к комментариям
 * @type {npf.ui.vk.Comments.Attach|Array.<npf.ui.vk.Comments.Attach>}
 */
npf.ui.vk.Comments.prototype.attach = npf.ui.vk.Comments.Attach.ALL;

/**
 * Автоматическая публикация комментария в статус пользователя
 * @type {boolean}
 */
npf.ui.vk.Comments.prototype.autoPublish = true;

/**
 * Нормальный или минималистичный тип виджета.
 * @type {npf.ui.vk.Comments.Size}
 */
npf.ui.vk.Comments.prototype.size = npf.ui.vk.Comments.Size.AUTO;

/**
 * Максимальная высота виджета в пикселях (> 500)
 * 0 — высота не ограничена
 * @type {string}
 */
npf.ui.vk.Comments.prototype.height = 0;

/**
 * Отключает обновление ленты комментариев в реальном времени
 * @type {boolean}
 */
npf.ui.vk.Comments.prototype.noRealTime = false;

/**
 * Адрес страницы с виджетом, на которую ссылается статус в случае,
 * когда включена автоматическая трансляция в статус.
 * на котором отображается кнопка.
 * @type {string}
 */
npf.ui.vk.Comments.prototype.pageUrl = '';


/** @inheritDoc */
npf.ui.vk.Comments.prototype.createDom = function() {
  goog.base(this, 'createDom');

  /** @type {Element} */
  var element = this.getElement();
  element.id = this.getId();
};

/** @inheritDoc */
npf.ui.vk.Comments.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (!this._inited) {
    this._inited = true;

    var attrs = {
      'width': this.width,
      'limit': this.limit,
      'autoPublish': this.autoPublish ? 1 : 0,
      'height': this.height,
      'norealtime': this.noRealTime ? 1 : 0
    };

    /** @type {Array.<npf.ui.vk.Comments.Attach>} */
    var attach;

    if (goog.isArray(this.attach)) {
      attach = this.attach;
    } else {
      attach = [this.attach];
    }

    if (attach.length) {
      attrs['attach'] = attach.join(',');
    }

    if (npf.ui.vk.Comments.Size.NORMAL == this.size) {
      attrs['mini'] = 0;
    } else if (npf.ui.vk.Comments.Size.MINI == this.size) {
      attrs['mini'] = 1;
    } else {
      attrs['mini'] = 'auto';
    }

    if (this.pageUrl) {
      attrs['pageUrl'] = this.pageUrl;
    }

    this.getDomHelper().getWindow()['VK']['Widgets']['Comments'](
      this.getId(), attrs, this.pageId);
  }
};
