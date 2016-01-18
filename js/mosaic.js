{
  const selector = `mosaic-block`;

  class Mosaic {
    constructor(el, config) {
      this.el = el;
      this.config = config;
      this.dom = {};
      this.init();
    }

    init() {
      this._buildTransitionMap();

      this._renderBlocks(() => {
        this.dom.blocks = document.querySelectorAll(`.${selector}`);
        this._setLayoutValues(this._triggerEntryTransition.bind(this));
      });
    }

    _buildTransitionMap() {
      const cols = this.config.columns;
      const rows = this.config.rows;

      this._transitionMap = [];

      // Add the first item in each column.
      for (let _idx = 0; _idx < cols; _idx++) {
        ((idx) => {
          const map = [];
          map.push(idx);

          let i = 0;

          (function next(nextIdx) {
            if (i >= 100) {
              console.error(`
                Recursive function called way too many times.
                This means you're adding too many colums and rows or you are
                delevoping and wrote a bug. Don't worry, it happens; that's why
                this message is here.
              `);
              return;
            }

            if (nextIdx === 0) {
              this._transitionMap.push(map);
              return;
            }

            let tempNext;
            if (nextIdx > cols) {
              tempNext = (cols % (nextIdx + 1)) + (cols - 1);
            } else {
              tempNext = (nextIdx + 1) + (cols - 1);
            }

            if (tempNext % cols - 1 < nextIdx) {
              map.push(tempNext - 1);
              next.call(this, tempNext - 1);
            } else {
              this._transitionMap.push(map);
            }

            i++;
          }).call(this, idx);
        })(_idx);
      }

      // Add the last item in each row (excluding the first).
      for (let i = cols * 2 - 1; i < cols * rows; i = i + cols) {
        this._transitionMap.push([i]);
      }

      console.log(this._transitionMap);
    }

    _renderBlocks(done) {
      const max = this.config.columns * this.config.rows;

      for (let _idx = 0; _idx < max; _idx++) {
        ((idx) => {
          const block = this._createBlockEl(idx);
          this.el.appendChild(block);

          if (idx + 1 === max) {
            done();
          }
        })(_idx);
      }
    }

    _createBlockEl(idx) {
      const block = document.createElement("div");
      block.className = `${selector} ${selector}-${idx + 1}`;
      block.id = selector;
      return block;
    }

    _setLayoutValues(done) {
      const height = this.el.clientHeight / this.config.rows;
      const width = this.el.clientWidth / this.config.columns;

      for (let _idx = 0; _idx < this.dom.blocks.length; _idx++) {
        ((idx) => {
          this.dom.blocks[idx].style.height = `${height}px`;
          this.dom.blocks[idx].style.width = `${width}px`;

          if (idx === this.dom.blocks.length - 1) {
            done();
          }
        })(_idx);
      }
    }

    _getNextBlockIndex(pos) {
      if (pos === 0) {
         return 1;
      }

      const cols = this.config.columns;
      return (cols - pos) + (pos + 1);
    }

    _triggerEntryTransition() {
      for (let _idx = 0; _idx < this.config.columns; _idx++) {
        ((idx) => {
          setTimeout(() => {
            let nextIdx;
            this.dom.blocks[idx].className += " is-loaded";

            if (idx < 2) {
              return;
            }
          }, 100 * idx);
        })(_idx);
      }
    }
  }

  const initMosaic = () => {
    new Mosaic(
      document.getElementById("mosaic-1"),
      {
        rows: 4,
        columns: 4,
      }
    );
  };

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    initMosaic();
  } else {
    document.addEventListener("DOMContentLoaded", initMosaic);
  }
}
