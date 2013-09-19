goog.provide('npf.ui.form.EventType');

goog.require('goog.events');


/**
 * @enum {string}
 */
npf.ui.form.EventType = {
  /**
   * Изменилось значение поля.
   * npf.ui.form.FieldEvent
   */
  CHANGE: goog.events.getUniqueId('change'),

  /**
   * Ошибочное значение поля.
   * npf.ui.form.FieldEvent
   */
  ERROR: goog.events.getUniqueId('error'),

  /**
   * Поле стало валидным.
   * npf.ui.form.FieldEvent
   */
  VALID: goog.events.getUniqueId('valid'),

  /**
   * Отправка формы.
   */
  SUBMIT: goog.events.getUniqueId('submit')
};
