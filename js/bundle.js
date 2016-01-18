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
            _this.dom.blocks = document.querySelectorAll("." + selector);
            _this._setLayoutValues(_this._triggerEntryTransition.bind(_this));
          });
        }
      }, {
        key: "_buildTransitionMap",
        value: function _buildTransitionMap() {
          var _this2 = this;

          var cols = this.config.columns;
          var rows = this.config.rows;

          this._transitionMap = [];

          // Add the first item in each column.
          for (var _idx = 0; _idx < cols; _idx++) {
            (function (idx) {
              var map = [];
              map.push(idx);

              var i = 0;

              (function next(nextIdx) {
                if (i >= 100) {
                  console.error("\n                Recursive function called way too many times.\n                This means you're adding too many colums and rows or you are\n                delevoping and wrote a bug. Don't worry, it happens; that's why\n                this message is here.\n              ");
                  return;
                }

                if (nextIdx === 0) {
                  this._transitionMap.push(map);
                  return;
                }

                var tempNext = undefined;
                if (nextIdx > cols) {
                  tempNext = cols % (nextIdx + 1) + (cols - 1);
                } else {
                  tempNext = nextIdx + 1 + (cols - 1);
                }

                if (tempNext % cols - 1 < nextIdx) {
                  map.push(tempNext - 1);
                  next.call(this, tempNext - 1);
                } else {
                  this._transitionMap.push(map);
                }

                i++;
              }).call(_this2, idx);
            })(_idx);
          }

          // Add the last item in each row (excluding the first).
          for (var i = cols * 2 - 1; i < cols * rows; i = i + cols) {
            this._transitionMap.push([i]);
          }

          console.log(this._transitionMap);
        }
      }, {
        key: "_renderBlocks",
        value: function _renderBlocks(done) {
          var _this3 = this;

          var max = this.config.columns * this.config.rows;

          for (var _idx = 0; _idx < max; _idx++) {
            (function (idx) {
              var block = _this3._createBlockEl(idx);
              _this3.el.appendChild(block);

              if (idx + 1 === max) {
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
          var _this4 = this;

          var height = this.el.clientHeight / this.config.rows;
          var width = this.el.clientWidth / this.config.columns;

          for (var _idx = 0; _idx < this.dom.blocks.length; _idx++) {
            (function (idx) {
              _this4.dom.blocks[idx].style.height = height + "px";
              _this4.dom.blocks[idx].style.width = width + "px";

              if (idx === _this4.dom.blocks.length - 1) {
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
          var _this5 = this;

          for (var _idx = 0; _idx < this.config.columns; _idx++) {
            (function (idx) {
              setTimeout(function () {
                var nextIdx = undefined;
                _this5.dom.blocks[idx].className += " is-loaded";

                if (idx < 2) {
                  return;
                }
              }, 100 * idx);
            })(_idx);
          }
        }
      }]);

      return Mosaic;
    }();

    var initMosaic = function initMosaic() {
      new Mosaic(document.getElementById("mosaic-1"), {
        rows: 4,
        columns: 4
      });
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
      initMosaic();
    } else {
      document.addEventListener("DOMContentLoaded", initMosaic);
    }
  })();
}
