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
        this.dom.blocks = this.el.querySelectorAll(`.${selector}`);
        this._setLayoutValues(() => {});
      });
    }

    _buildTransitionMap() {
      const cols = this.config.columns;
      const rows = this.config.rows;

      this._transitionMap = [];

      // Add the first item in each column.
      for (let idx = 0; idx < cols; idx++) {
				this._recursivelyAddIndexes(idx);
      }

      // Add the last item in each row (excluding the first).
      for (let idx = cols * 2 - 1; idx < cols * rows; idx = idx + cols) {
        this._recursivelyAddIndexes(idx);
      }
    }

		_recursivelyAddIndexes(idx) {
			const cols = this.config.columns;
      const rows = this.config.rows;
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

				const tempNext = nextIdx + cols - 1;
				if (tempNext % cols < nextIdx % cols) {
					map.push(tempNext);
					next.call(this, tempNext);
				} else {
					this._transitionMap.push(map);
				}

				i++;
			}).call(this, idx);
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
			this._transitionMap.forEach((group, idx) => {
				setTimeout(() => {
					group.forEach((elIdx) => {
						if (
							this.dom.blocks[elIdx] &&
							this.dom.blocks[elIdx].className.indexOf("is-loaded") === -1
						) {
							this.dom.blocks[elIdx].className += " is-loaded";
						}
					});
				}, 150 * idx);
			});
    }

		show() {
			this._triggerEntryTransition();
		}

		isInViewport() {
			let el = this.el;
			let top = el.offsetTop;
		  let left = el.offsetLeft;
		  let width = el.offsetWidth;
		  let height = el.offsetHeight;

		  while(el.offsetParent) {
		    el = el.offsetParent;
		    top += el.offsetTop;
		    left += el.offsetLeft;
		  }

		  return (
		    top < (window.pageYOffset + window.innerHeight) &&
		    left < (window.pageXOffset + window.innerWidth) &&
		    (top + height) > window.pageYOffset &&
		    (left + width) > window.pageXOffset
		  );
		}
  }

  const initMosaic = () => {
    const mosaic1 = new Mosaic(
      document.getElementById("mosaic-1"),
      {
        rows: 4,
        columns: 4,
      }
    );

		const mosaic2 = new Mosaic(
      document.getElementById("mosaic-2"),
      {
        rows: 4,
        columns: 4,
      }
    );

		const render = () => {
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

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    initMosaic();
  } else {
    document.addEventListener("DOMContentLoaded", initMosaic);
  }
}
