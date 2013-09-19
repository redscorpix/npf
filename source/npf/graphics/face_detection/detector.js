goog.provide('npf.graphics.faceDetection.Detector');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.graphics.faceDetection.cascade');


/**
 * @param {HTMLCanvasElement} canvas
 * @param {number=} opt_interval
 * @param {number=} opt_minNeighbors
 * @constructor
 */
npf.graphics.faceDetection.Detector = function(canvas, opt_interval,
    opt_minNeighbors) {
  /**
   * @type {HTMLCanvasElement}
   */
  this.canvas = canvas;

  /**
   * @type {!goog.dom.DomHelper}
   */
  this.domHelper = goog.dom.getDomHelper(this.canvas);

  /**
   * @type {number}
   */
  this.interval = opt_interval || npf.graphics.faceDetection.Detector.INTERVAL;

  /**
   * @type {number}
   */
  this.minNeighbors = opt_minNeighbors ||
    npf.graphics.faceDetection.Detector.MIN_NEIGHBORS;

  /**
   * @type {number}
   */
  this.scale = Math.pow(2, 1 / (this.interval + 1));

  /**
   * @type {number}
   */
  this.next = this.interval + 1;

  /**
   * @type {!Array.<Object>}
   */
  this.features_ = [];

  /**
   * @type {number}
   */
  this.scaleUpto = Math.floor(Math.log(Math.min(canvas.width /
    npf.graphics.faceDetection.cascade.WIDTH, canvas.height /
    npf.graphics.faceDetection.cascade.HEIGHT)) / Math.log(this.scale));
};


/**
 * @const {number}
 */
npf.graphics.faceDetection.Detector.INTERVAL = 5;

/**
 * @const {number}
 */
npf.graphics.faceDetection.Detector.MIN_NEIGHBORS = 1;

/**
 * @typedef {{
 *  width: number,
 *  height: number,
 *  data: Uint8ClampedArray
 * }}
 */
npf.graphics.faceDetection.Detector.CanvasData;

/**
 * @typedef {{
 *  x: number,
 *  y: number,
 *  width: number,
 *  height: number,
 *  neighbors: number,
 *  confidence: number
 * }}
 */
npf.graphics.faceDetection.Detector.Face;


npf.graphics.faceDetection.Detector.prototype.detect = function() {
  return this.post(this.core(this.pre()));
};

/**
 * @return {!Array.<npf.graphics.faceDetection.Detector.CanvasData>}
 */
npf.graphics.faceDetection.Detector.prototype.pre = function() {
  /** @type {number} */
  var count = (this.scaleUpto + this.next * 2) * 4;
  /** @type {!Array.<HTMLCanvasElement>} */
  var canvases = new Array(count);
  /** @type {!Array.<npf.graphics.faceDetection.Detector.CanvasData>} */
  var result = new Array(count);
  /** @type {function(HTMLCanvasElement, number, number, number, number): Uint8ClampedArray} */
  var getData = function(canvas, x, y, width, height) {
    return canvas.getContext("2d").getImageData(x, y, width, height).data;
  };
  /**
   * @type {function(HTMLCanvasElement, HTMLCanvasElement, number, number,
   *        number, number, number, number, number, number)}
   */
  var draw = function(dest, source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dest.getContext("2d").drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);
  };
  /** @type {function(number,number):!HTMLCanvasElement} */
  var createCanvasElement = goog.bind(function(width, height) {
    return /** @type {!HTMLCanvasElement} */ (
      this.domHelper.createDom(goog.dom.TagName.CANVAS, {
        'width': width,
        'height': height
      })
    );
  }, this);

  canvases[0] = this.canvas;
  result[0] = {
    width: this.canvas.width,
    height: this.canvas.height,
    data: getData(this.canvas, 0, 0, this.canvas.width, this.canvas.height)
  };

  var i;
  /** @type {HTMLCanvasElement} */
  var canvas;
  /** @type {HTMLCanvasElement} */
  var source;
  /** @type {number} */
  var width;
  /** @type {number} */
  var height;
  /** @type {number} */
  var sIndex;
  /** @type {number} */
  var sWidth;
  /** @type {number} */
  var sHeight;

  for (i = 1; i <= this.interval; i++) {
    sIndex = 0;
    source = canvases[sIndex];
    sWidth = result[sIndex].width;
    sHeight = result[sIndex].height;
    width = Math.floor(sWidth / Math.pow(this.scale, i));
    height = Math.floor(sHeight / Math.pow(this.scale, i));
    canvas = createCanvasElement(width, height);
    draw(canvas, source, 0, 0, sWidth, sHeight, 0, 0, width, height);
    canvases[i * 4] = canvas;
    result[i * 4] = {
      width: width,
      height: height,
      data: getData(canvas, 0, 0, width, height)
    };
  }

  for (i = this.next; i < this.scaleUpto + this.next * 2; i++) {
    sIndex = i * 4 - this.next * 4;
    source = canvases[sIndex];
    sWidth = result[sIndex].width;
    sHeight = result[sIndex].height;
    width = Math.floor(sWidth / 2);
    height = Math.floor(sHeight / 2);
    canvas = createCanvasElement(width, height);
    draw(canvas, source, 0, 0, sWidth, sHeight, 0, 0, width, height);
    canvases[i * 4] = canvas;
    result[i * 4] = {
      width: width,
      height: height,
      data: getData(canvas, 0, 0, width, height)
    };
  }

  for (i = this.next * 2; i < this.scaleUpto + this.next * 2; i++) {
    sIndex = i * 4 - this.next * 4;
    source = canvases[sIndex];
    sWidth = result[sIndex].width;
    sHeight = result[sIndex].height;
    width = Math.floor(sWidth / 2);
    height = Math.floor(sHeight / 2);

    canvas = createCanvasElement(width, height);
    draw(canvas, source, 1, 0, sWidth - 1, sHeight, 0, 0, width - 2, height);
    canvases[i * 4 + 1] = canvas;
    result[i * 4 + 1] = {
      width: width,
      height: height,
      data: getData(canvas, 0, 0, width, height)
    };

    canvas = createCanvasElement(width, height);
    draw(canvas, source, 0, 1, sWidth, sHeight - 1, 0, 0, width, height - 2);
    canvases[i * 4 + 2] = canvas;
    result[i * 4 + 2] = {
      width: width,
      height: height,
      data: getData(canvas, 0, 0, width, height)
    };

    canvas = createCanvasElement(width, height);
    draw(canvas, source, 1, 1, sWidth - 1, sHeight - 1, 0, 0, width - 2, height - 2);
    canvases[i * 4 + 3] = canvas;
    result[i * 4 + 3] = {
      width: width,
      height: height,
      data: getData(canvas, 0, 0, width, height)
    };
  }

  return result;
};

/**
 * @param {Array.<npf.graphics.faceDetection.Detector.CanvasData>} canvasData
 * @return {!Array.<npf.graphics.faceDetection.Detector.Face>}
 */
npf.graphics.faceDetection.Detector.prototype.core = function(canvasData) {
  /** @type {number} */
  var i;
  /** @type {number} */
  var j;
  /** @type {number} */
  var k;
  /** @type {number} */
  var q;
  /** @type {number} */
  var scaleX = 1;
  /** @type {number} */
  var scaleY = 1;
  /** @type {!Array.<number>} */
  var dx = [0, 1, 0, 1];
  /** @type {!Array.<number>} */
  var dy = [0, 0, 1, 1];
  /** @type {!Array.<npf.graphics.faceDetection.Detector.Face>} */
  var seq = [];
  /** @type {!Array.<Object>} */
  var stageClassifier = npf.graphics.faceDetection.cascade.stageClassifier;

  for (i = 0; i < this.scaleUpto; i++) {
    var qw = canvasData[i * 4 + this.next * 8].width -
      Math.floor(npf.graphics.faceDetection.cascade.WIDTH / 4);
    var qh = canvasData[i * 4 + this.next * 8].height -
      Math.floor(npf.graphics.faceDetection.cascade.HEIGHT / 4);
    var step = [
      canvasData[i * 4].width * 4,
      canvasData[i * 4 + this.next * 4].width * 4,
      canvasData[i * 4 + this.next * 8].width * 4
    ];
    var paddings = [
      canvasData[i * 4].width * 16 - qw * 16,
      canvasData[i * 4 + this.next * 4].width * 8 - qw * 8,
      canvasData[i * 4 + this.next * 8].width * 4 - qw * 4
    ];

    for (j = 0; j < stageClassifier.length; j++) {
      var origFeature = stageClassifier[j].feature;
      var feature = new Array(stageClassifier[j].count);

      for (k = 0; k < stageClassifier[j].count; k++) {
        feature[k] = {
          size: origFeature[k].size,
          px: new Array(origFeature[k].size),
          pz: new Array(origFeature[k].size),
          nx: new Array(origFeature[k].size),
          nz: new Array(origFeature[k].size)
        };

        for (q = 0; q < origFeature[k].size; q++) {
          feature[k].px[q] = origFeature[k].px[q] * 4 +
            origFeature[k].py[q] * step[origFeature[k].pz[q]];
          feature[k].pz[q] = origFeature[k].pz[q];
          feature[k].nx[q] = origFeature[k].nx[q] * 4 +
            origFeature[k].ny[q] * step[origFeature[k].nz[q]];
          feature[k].nz[q] = origFeature[k].nz[q];
        }
      }

      this.features_[j] = feature;
    }

    for (q = 0; q < 4; q++) {
      var u8 = [
        canvasData[i * 4].data,
        canvasData[i * 4 + this.next * 4].data,
        canvasData[i * 4 + this.next * 8 + q].data
      ];
      var u8o = [
        dx[q] * 8 + dy[q] * canvasData[i * 4].width * 8,
        dx[q] * 4 + dy[q] * canvasData[i * 4 + this.next * 4].width * 4,
        0
      ];

      for (var y = 0; y < qh; y++) {
        for (var x = 0; x < qw; x++) {
          var sum = 0;
          var flag = true;

          for (j = 0; j < stageClassifier.length; j++) {
            sum = 0;

            var alpha = stageClassifier[j].alpha;
            var feature = this.features_[j];

            for (k = 0; k < stageClassifier[j].count; k++) {
              var feature_k = feature[k];
              var pmin = u8[feature_k.pz[0]][u8o[feature_k.pz[0]] +
                feature_k.px[0]];
              var nmax = u8[feature_k.nz[0]][u8o[feature_k.nz[0]] +
                feature_k.nx[0]];

              if (pmin <= nmax) {
                sum += alpha[k * 2];
              } else {
                var shortcut = true;

                for (var f = 0; f < feature_k.size; f++) {
                  if (feature_k.pz[f] >= 0) {
                    var p = u8[feature_k.pz[f]][u8o[feature_k.pz[f]] +
                      feature_k.px[f]];

                    if (p < pmin) {
                      if (p <= nmax) {
                        shortcut = false;
                        break;
                      }
                      pmin = p;
                    }
                  }

                  if (feature_k.nz[f] >= 0) {
                    var n = u8[feature_k.nz[f]][u8o[feature_k.nz[f]] +
                      feature_k.nx[f]];

                    if (n > nmax) {
                      if (pmin <= n) {
                        shortcut = false;
                        break;
                      }

                      nmax = n;
                    }
                  }
                }

                sum += (shortcut) ? alpha[k * 2 + 1] : alpha[k * 2];
              }
            }

            if (sum < stageClassifier[j].threshold) {
              flag = false;
              break;
            }
          }

          if (flag) {
            seq.push({
              x: (x * 4 + dx[q] * 2) * scaleX,
              y: (y * 4 + dy[q] * 2) * scaleY,
              width: npf.graphics.faceDetection.cascade.WIDTH * scaleX,
              height: npf.graphics.faceDetection.cascade.HEIGHT * scaleY,
              neighbor: 1,
              confidence: sum
            });
          }

          u8o[0] += 16;
          u8o[1] += 8;
          u8o[2] += 4;
        }

        u8o[0] += paddings[0];
        u8o[1] += paddings[1];
        u8o[2] += paddings[2];
      }
    }

    scaleX *= this.scale;
    scaleY *= this.scale;
  }

  return seq;
};

/**
 * @param {!Array.<npf.graphics.faceDetection.Detector.Face>} seq
 * @return {!Array.<npf.graphics.faceDetection.Detector.Face>}
 */
npf.graphics.faceDetection.Detector.prototype.post = function(seq) {
  if (this.minNeighbors <= 0) {
    return seq;
  }

  /** @type {number} */
  var i;
  /** @type {number} */
  var j;
  var result = this.arrayGroup_(seq, function (r1, r2) {
    var distance = Math.floor(r1.width * 0.25 + 0.5);

    return r2.x <= r1.x + distance &&
      r2.x >= r1.x - distance &&
      r2.y <= r1.y + distance &&
      r2.y >= r1.y - distance &&
      r2.width <= Math.floor(r1.width * 1.5 + 0.5) &&
      Math.floor(r2.width * 1.5 + 0.5) >= r1.width;
  });

  var ncomp = result.cat;
  var idx_seq = result.index;
  /** @type {!Array.<npf.graphics.faceDetection.Detector.Face>} */
  var comps = new Array(ncomp + 1);

  for (i = 0; i < comps.length; i++) {
    comps[i] = {
      neighbors: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      confidence: 0
    };
  }

  // count number of neighbors
  for (i = 0; i < seq.length; i++) {
    var r1 = seq[i];
    var idx = idx_seq[i];

    if (comps[idx].neighbors == 0) {
      comps[idx].confidence = r1.confidence;
    }

    ++comps[idx].neighbors;

    comps[idx].x += r1.x;
    comps[idx].y += r1.y;
    comps[idx].width += r1.width;
    comps[idx].height += r1.height;
    comps[idx].confidence = Math.max(comps[idx].confidence, r1.confidence);
  }

  var seq2 = [];

  // calculate average bounding box
  for (i = 0; i < ncomp; i++) {
    var n = comps[i].neighbors;

    if (n >= this.minNeighbors) {
      seq2.push({
        x: (comps[i].x * 2 + n) / (2 * n),
        y: (comps[i].y * 2 + n) / (2 * n),
        width: (comps[i].width * 2 + n) / (2 * n),
        height: (comps[i].height * 2 + n) / (2 * n),
        neighbors: comps[i].neighbors,
        confidence: comps[i].confidence
      });
    }
  }

  var resultSeq = [];

  // filter out small face rectangles inside large face rectangles
  for (i = 0; i < seq2.length; i++) {
    var r1 = seq2[i];
    var flag = true;

    for (j = 0; j < seq2.length; j++) {
      var r2 = seq2[j];
      var distance = Math.floor(r2.width * 0.25 + 0.5);

      if (
        i != j &&
        r1.x >= r2.x - distance &&
        r1.y >= r2.y - distance &&
        r1.x + r1.width <= r2.x + r2.width + distance &&
        r1.y + r1.height <= r2.y + r2.height + distance &&
        (r2.neighbors > Math.max(3, r1.neighbors) || r1.neighbors < 3)
      ) {
        flag = false;
        break;
      }
    }

    if (flag) {
      resultSeq.push(r1);
    }
  }

  return resultSeq;
};

/**
 * @param {Array.<npf.graphics.faceDetection.Detector.Face>} seq
 * @param {function(npf.graphics.faceDetection.Detector.Face,
 *                  npf.graphics.faceDetection.Detector.Face):boolean} gfunc
 * @return {{cat:number,index:!Array.<number>}}
 * @private
 */
npf.graphics.faceDetection.Detector.prototype.arrayGroup_ = function(seq,
    gfunc) {
  /** @type {number} */
  var i;
  /** @type {number} */
  var j;
  var node = new Array(seq.length);

  for (i = 0; i < seq.length; i++) {
    node[i] = {
      parent: -1,
      element: seq[i],
      rank: 0
    };
  }

  for (i = 0; i < seq.length; i++) {
    if (!node[i].element) {
      continue;
    }

    var root = i;

    while (node[root].parent != -1) {
      root = node[root].parent;
    }

    for (j = 0; j < seq.length; j++) {
      if (i != j && node[j].element && gfunc(node[i].element, node[j].element)) {
        var root2 = j;

        while (node[root2].parent != -1) {
          root2 = node[root2].parent;
        }

        if (root2 != root) {
          if (node[root].rank > node[root2].rank) {
            node[root2].parent = root;
          } else {
            node[root].parent = root2;

            if (node[root].rank == node[root2].rank) {
              node[root2].rank++;
            }

            root = root2;
          }

          /* compress path from node2 to the root: */
          var temp;
          var node2 = j;

          while (node[node2].parent != -1) {
            temp = node2;
            node2 = node[node2].parent;
            node[temp].parent = root;
          }

          /* compress path from node to the root: */
          node2 = i;

          while (node[node2].parent != -1) {
            temp = node2;
            node2 = node[node2].parent;
            node[temp].parent = root;
          }
        }
      }
    }
  }

  /** @type {!Array.<number>} */
  var idx = new Array(seq.length);
  /** @type {number} */
  var classIdx = 0;

  for (i = 0; i < seq.length; i++) {
    j = -1;

    var node1 = i;

    if (node[node1].element) {
      while (node[node1].parent != -1) {
        node1 = node[node1].parent;
      }

      if(node[node1].rank >= 0) {
        node[node1].rank = ~classIdx++;
      }

      j = ~node[node1].rank;
    }

    idx[i] = j;
  }

  return {
    index: idx,
    cat: classIdx
  };
};
