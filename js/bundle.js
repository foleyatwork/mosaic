"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

{
  (function () {
    var selector = "mosaic-block";

    var Mosaic = function () {
      function Mosaic(el, config) {
        _classCallCheck(this, Mosaic);

        this.el = el;
        this.config = config;
        this.dom = {};
        this.init();
      }

      _createClass(Mosaic, [{
        key: "init",
        value: function init() {
          var _this = this;

          this._buildTransitionMap();

          this._renderBlocks(function () {
            _this.dom.blocks = _this.el.querySelectorAll("." + selector);
            _this._setLayoutValues(function () {});
          });

          window.addEventListener("resize", function () {
            _this._setLayoutValues(function () {});
          });
        }
      }, {
        key: "_buildTransitionMap",
        value: function _buildTransitionMap() {
          var cols = this.config.columns;
          var rows = this.config.rows;

          this._transitionMap = [];

          // Add the first item in each column.
          for (var idx = 0; idx < cols; idx++) {
            this._recursivelyAddIndexes(idx);
          }

          // Add the last item in each row (excluding the first).
          for (var idx = cols * 2 - 1; idx < cols * rows; idx = idx + cols) {
            this._recursivelyAddIndexes(idx);
          }
        }
      }, {
        key: "_recursivelyAddIndexes",
        value: function _recursivelyAddIndexes(idx) {
          var cols = this.config.columns;
          var rows = this.config.rows;
          var map = [];
          map.push(idx);

          var i = 0;

          (function next(nextIdx) {
            if (i >= 100) {
              console.error("\n\t\t\t\t\t\tRecursive function called way too many times.\n\t\t\t\t\t\tThis means you're adding too many colums and rows or you are\n\t\t\t\t\t\tdelevoping and wrote a bug. Don't worry, it happens; that's why\n\t\t\t\t\t\tthis message is here.\n\t\t\t\t\t");
              return;
            }

            if (nextIdx === 0) {
              this._transitionMap.push(map);
              return;
            }

            var tempNext = nextIdx + cols - 1;
            if (tempNext % cols < nextIdx % cols) {
              map.push(tempNext);
              next.call(this, tempNext);
            } else {
              this._transitionMap.push(map);
            }

            i++;
          }).call(this, idx);
        }
      }, {
        key: "_renderBlocks",
        value: function _renderBlocks(done) {
          var _this2 = this;

          var max = this.config.columns * this.config.rows;
          var inner = document.createElement("div");
          inner.className = "mosaic-inner";

          for (var _idx = 0; _idx < max; _idx++) {
            (function (idx) {
              var block = _this2._createBlockEl(idx);
              inner.appendChild(block);

              if (idx + 1 === max) {
                _this2.el.appendChild(inner);
                done();
              }
            })(_idx);
          }
        }
      }, {
        key: "_createBlockEl",
        value: function _createBlockEl(idx) {
          var block = document.createElement("div");
          block.className = selector + " " + selector + "-" + (idx + 1);
          block.id = selector;
          return block;
        }
      }, {
        key: "_setLayoutValues",
        value: function _setLayoutValues(done) {
          var _this3 = this;

          var height = 100 / this.config.rows;
          var width = 100 / this.config.columns;

          for (var _idx = 0; _idx < this.dom.blocks.length; _idx++) {
            (function (idx) {
              _this3.dom.blocks[idx].style.height = height + "%";
              _this3.dom.blocks[idx].style.width = width + "%";

              if (idx === _this3.dom.blocks.length - 1) {
                done();
              }
            })(_idx);
          }
        }
      }, {
        key: "_getNextBlockIndex",
        value: function _getNextBlockIndex(pos) {
          if (pos === 0) {
            return 1;
          }

          var cols = this.config.columns;
          return cols - pos + (pos + 1);
        }
      }, {
        key: "_triggerEntryTransition",
        value: function _triggerEntryTransition() {
          var _this4 = this;

          this._transitionMap.forEach(function (group, idx) {
            setTimeout(function () {
              group.forEach(function (elIdx) {
                if (_this4.dom.blocks[elIdx] && _this4.dom.blocks[elIdx].className.indexOf("is-loaded") === -1) {
                  _this4.dom.blocks[elIdx].className += " is-loaded";
                }
              });
            }, (_this4.config.delay || 150) * idx);
          });
        }
      }, {
        key: "show",
        value: function show() {
          this._triggerEntryTransition();
        }
      }, {
        key: "isInViewport",
        value: function isInViewport() {
          var el = this.el;
          var top = el.offsetTop;
          var left = el.offsetLeft;
          var width = el.offsetWidth;
          var height = el.offsetHeight;

          while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
          }

          return top < window.pageYOffset + window.innerHeight && left < window.pageXOffset + window.innerWidth && top + height > window.pageYOffset && left + width > window.pageXOffset;
        }
      }]);

      return Mosaic;
    }();

    var initMosaic = function initMosaic() {
      var mosaic1 = new Mosaic(document.getElementById("mosaic-1"), {
        rows: 3,
        columns: 4
      });

      var mosaic2 = new Mosaic(document.getElementById("mosaic-2"), {
        rows: 3,
        columns: 4
      });

      var render = function render() {
        if (mosaic1.isInViewport()) {
          mosaic1.show();
        }

        if (mosaic2.isInViewport()) {
          mosaic2.show();
        }
      };

      render();
      addEventListener("scroll", render);
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
      initMosaic();
    } else {
      document.addEventListener("DOMContentLoaded", initMosaic);
    }
  })();
}
