goog.provide('npf.ui.scrollBar.Renderer');

goog.require('goog.dom.classlist');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.object');
goog.require('goog.style');
goog.require('npf.ui.StatedRenderer');


/**
 * @constructor
 * @extends {npf.ui.StatedRenderer}
 */
npf.ui.scrollBar.Renderer = function() {
  npf.ui.scrollBar.Renderer.base(this, 'constructor');

  /**
   * @private {!Object}
   */
  this._typeToCssClass = goog.object.create(
    npf.ui.ScrollBar.Type.BOTH, this.getBothCssClass(),
    npf.ui.ScrollBar.Type.HORIZONTAL, this.getHorizontalCssClass(),
    npf.ui.ScrollBar.Type.VERTICAL, this.getVerticalCssClass()
  );
};
goog.inherits(npf.ui.scrollBar.Renderer, npf.ui.StatedRenderer);
goog.addSingletonGetter(npf.ui.scrollBar.Renderer);


/**
 * @type {string}
 */
npf.ui.scrollBar.Renderer.CSS_CLASS = goog.getCssName('npf-scrollBar');


/** @inheritDoc */
npf.ui.scrollBar.Renderer.prototype.getCssClass = function() {
  return npf.ui.scrollBar.Renderer.CSS_CLASS;
};

/** @inheritDoc */
npf.ui.scrollBar.Renderer.prototype.createDom = function(component) {
  /** @type {!Element} */
  var element = npf.ui.scrollBar.Renderer.base(this, 'createDom', component);
  element.innerHTML = '<div class="' + this.getRunnerCssClass() + '"></div>';

  return element;
};

/** @inheritDoc */
npf.ui.scrollBar.Renderer.prototype.setVisible = function(element, visible) {
  if (element) {
    goog.dom.classlist.enable(element, this.getHiddenCssClass(), !visible);
  }
};

/**
 * @param {!npf.ui.ScrollBar} component
 * @param {!goog.math.Coordinate} runnerPosition
 * @return {goog.math.Coordinate}
 */
npf.ui.scrollBar.Renderer.prototype.getScrollPosition = function(component,
    runnerPosition) {
  /** @type {npf.ui.ScrollContainer} */
  var container = component.getContainer();

  if (container) {
    /** @type {!goog.math.Size} */
    var scrollSize = container.getScrollSize();
    /** @type {!goog.math.Coordinate} */
    var maxRunnerScroll = component.getMaxRunnerPosition();
    /** @type {number} */
    var left = maxRunnerScroll.x ?
      runnerPosition.x / maxRunnerScroll.x * scrollSize.width : 0;
    /** @type {number} */
    var top = maxRunnerScroll.y ?
      runnerPosition.y / maxRunnerScroll.y * scrollSize.height : 0;

    if (container.isRightStartCorner()) {
      left = scrollSize.width - left;
    }

    if (container.isBottomStartCorner()) {
      top = scrollSize.height - top;
    }

    return (new goog.math.Coordinate(left, top).round());
  }

  return null;
};

/**
 * @param {!npf.ui.ScrollBar} component
 * @param {!goog.math.Coordinate} position
 */
npf.ui.scrollBar.Renderer.prototype.setRunnerPosition = function(component,
    position) {
  /** @type {Element} */
  var runnerElement = component.getRunnerElement();

  if (runnerElement) {
    // Without transforms because goog.fx.Dragger uses left and top styles.
    runnerElement.style.left = position.x + 'px';
    runnerElement.style.top = position.y + 'px';
  }
};

/**
 * @param {!npf.ui.ScrollBar} component
 * @param {!goog.math.Coordinate} scrollPosition
 * @return {goog.math.Coordinate}
 */
npf.ui.scrollBar.Renderer.prototype.getRunnerPositionByScrollPosition =
    function(component, scrollPosition) {
  /** @type {npf.ui.ScrollContainer} */
  var container = component.getContainer();

  if (container) {
    /** @type {!goog.math.Coordinate} */
    var maxRunnerPosition = component.getMaxRunnerPosition();
    /** @type {!goog.math.Size} */
    var scrollSize = container.getScrollSize();
    /** @type {number} */
    var left = scrollSize.width ?
      scrollPosition.x / scrollSize.width * maxRunnerPosition.x : 0;
    /** @type {number} */
    var top = scrollSize.height ?
      scrollPosition.y / scrollSize.height * maxRunnerPosition.y : 0;

    if (container.isRightStartCorner()) {
      left = maxRunnerPosition.x - left;
    }

    if (container.isBottomStartCorner()) {
      top = maxRunnerPosition.y - top;
    }

    return (new goog.math.Coordinate(left, top)).round();
  }

  return null;
};

/**
 * @param {!npf.ui.ScrollBar} component
 * @return {goog.math.Coordinate}
 */
npf.ui.scrollBar.Renderer.prototype.getMaxRunnerPosition = function(component) {
  /** @type {!goog.math.Size} */
  var size = component.getSize();
  /** @type {!goog.math.Size} */
  var runnerSize = component.getRunnerSize();
  /** @type {number} */
  var x = Math.max(0, size.width - runnerSize.width);
  /** @type {number} */
  var y = Math.max(0, size.height - runnerSize.height);

  return new goog.math.Coordinate(x, y);
};

/**
 * @param {!npf.ui.ScrollBar} component
 * @return {goog.math.Size}
 */
npf.ui.scrollBar.Renderer.prototype.getRunnerSize = function(component) {
  /** @type {npf.ui.ScrollContainer} */
  var container = component.getContainer();

  if (container) {
    /** @type {!goog.math.Size} */
    var size = component.getSize();
    /** @type {!goog.math.Size} */
    var containerSize = container.getSize();
    /** @type {!goog.math.Size} */
    var containerContentSize = container.getContentSize();
    /** @type {number} */
    var width = containerSize.width / containerContentSize.width * size.width;
    /** @type {number} */
    var height =
      containerSize.height / containerContentSize.height * size.height;

    return (new goog.math.Size(width, height)).round();
  }

  return null;
};

/**
 * @param {!npf.ui.ScrollBar} component
 * @param {!goog.math.Size} size
 */
npf.ui.scrollBar.Renderer.prototype.setRunnerSize = function(component, size) {
  /** @type {Element} */
  var runnerElement = component.getRunnerElement();

  if (runnerElement) {
    if (component.isHorizontal()) {
      runnerElement.style.width = size.width + 'px';
    }

    if (component.isVertical()) {
      runnerElement.style.height = size.height + 'px';
    }
  }
};

/**
 * @param {!npf.ui.ScrollBar} component
 * @return {!goog.math.Size}
 */
npf.ui.scrollBar.Renderer.prototype.getMinRunnerSize = function(component) {
  return new goog.math.Size(20, 20);
};

/**
 * @param {!npf.ui.ScrollBar} component
 * @return {goog.math.Size}
 */
npf.ui.scrollBar.Renderer.prototype.getSize = function(component) {
  if (component.isAutoSize()) {
    /** @type {Element} */
    var element = component.getElement();

    if (element) {
      return goog.style.getBorderBoxSize(element);
    }
  } else {
    /** @type {npf.ui.ScrollContainer} */
    var container = component.getContainer();

    if (container) {
      return container.getSize();
    }
  }

  return null;
};

/**
 * @param {!npf.ui.ScrollBar} component
 * @param {!goog.math.Size} size
 */
npf.ui.scrollBar.Renderer.prototype.setSize = function(component, size) {
  /** @type {Element} */
  var element = component.getElement();

  if (element) {
    if (component.isHorizontal()) {
      element.style.width = size.width + 'px';
    }

    if (component.isVertical()) {
      element.style.height = size.height + 'px';
    }
  }
};

/**
 * @param {!npf.ui.ScrollBar} component
 * @param {npf.ui.ScrollBar.Type} type
 * @param {npf.ui.ScrollBar.Type=} opt_oldType
 */
npf.ui.scrollBar.Renderer.prototype.setType = function(component, type,
    opt_oldType) {
  /** @type {Element} */
  var element = component.getElement();

  if (element) {
    if (opt_oldType) {
      /** @type {string|undefined} */
      var oldCssClass = this._typeToCssClass[opt_oldType];

      if (oldCssClass) {
        goog.dom.classlist.remove(element, oldCssClass);
      }
    }

    /** @type {string|undefined} */
    var cssClass = this._typeToCssClass[type];

    if (cssClass) {
      goog.dom.classlist.add(element, cssClass);
    }
  }
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.scrollBar.Renderer.prototype.getRunnerElement = function(element) {
  return this.getElementByClass(this.getRunnerCssClass(), element);
};

/**
 * @return {string}
 */
npf.ui.scrollBar.Renderer.prototype.getBothCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'both');
};

/**
 * @return {string}
 */
npf.ui.scrollBar.Renderer.prototype.getHiddenCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'hidden');
};

/**
 * @return {string}
 */
npf.ui.scrollBar.Renderer.prototype.getHorizontalCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'horizontal');
};

/**
 * @return {string}
 */
npf.ui.scrollBar.Renderer.prototype.getRunnerCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'runner');
};

/**
 * @return {string}
 */
npf.ui.scrollBar.Renderer.prototype.getVerticalCssClass = function() {
  return goog.getCssName(this.getStructuralCssClass(), 'vertical');
};
