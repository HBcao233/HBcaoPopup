(function () {
  const isNumber = s => Object.prototype.toString.call(s) === "[object Number]";
  const isString = s => Object.prototype.toString.call(s) === "[object String]";
  const isArrayLike = s => s != null && typeof s[Symbol.iterator] === 'function';
  /**
   * 创建 Element
   * @param {String} tagName 
   * @param {Object} options 
   * @param {function} func 
   * @returns {HTMLElement | SVGElement}
   */
  function tag(tagName, options, func) {
    options = options || {};
    var svgTags = ['svg', 'g', 'path', 'filter', 'animate', 'marker', 'line', 'polyline', 'rect', 'circle', 'ellipse', 'polygon'];
    let newElement;
    if (svgTags.indexOf(tagName) >= 0) {
      newElement = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    } else {
      newElement = document.createElement(tagName);
    }
    if (options.id) newElement.id = options.id;
    if (options.class) {
      if (!Array.isArray(options.class)) options.class = options.class.split(' ');
      for (const e of options.class) {
        if (e) newElement.classList.add(e);
      }
    }
    if (options.innerHTML) newElement.innerHTML = options.innerHTML;
    if (options.children) {
      if (!isArrayLike(options.children)) options.children = [options.children];
      for (const e of options.children) {
        if (isString(e) || isNumber(e)) e = document.createTextNode(e);
        newElement.appendChild(e);
      }
    }
    if (options.style) newElement.style.cssText = options.style
    if (options.attrs) {
      for (const [k, v] of Object.entries(options.attrs)) {
        newElement.setAttribute(k, v)
      }
    }
    func && func(newElement)
    return newElement;
  }

  class Popup {
    #draging = false;
    #x = 0;
    #y = 0;

    /**
     * Popup
     * @param {Object} opt_config
     * @constructor
     * @export
     */
    constructor(options) {
      if (!options) options = {};
      if (options.ifDrag === undefined) options.ifDrag = true;
      if (options.dragLimit === undefined) options.dragLimit = true;
      this.options = options;


      this.b_stop = true; // 防止重复点击
      this.timeout = options.timeout;

      this.dialogElement = tag('dialog', {
        class: 'popup-box',
        children: (this.containerElement = tag('div', {
          class: 'popup',
          children: [
            (this.titleBoxElement = tag('div', {
              class: 'popup-title-box', children: [
                (this.titleElement = tag('p', { class: 'popup-title' })),
                (this.closeBtn = tag('div', {
                  class: 'popup-close-btn', children: (this.closeBtnSvg = tag('svg', {
                    attrs: {
                      viewBox: '0 0 24 24',
                      'aria-hidden': 'true',
                    }, innerHTML: '<g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>'
                  }))
                })),
              ],
            })),
            (this.contentElement = tag('div', { class: 'popup-content' })),
          ]
        })),
      });
      document.body.append(this.dialogElement);

      this.titleElement.innerHTML = options.title;
      this.contentElement.innerHTML = options.content;

      const setStyle = (t, s) => {
        if (!s) return;
        t.style = s;
      }
      setStyle(this.containerElement, options.style);
      setStyle(this.titleBoxElement, options.title_box_style);
      setStyle(this.titleElement, options.title_style);
      setStyle(this.contentElement, options.content_style);
      setStyle(this.closeBtn, options.close_btn_style);
      setStyle(this.closeBtnSvg, options.close_svg_style);

      const addClass = (t, c) => {
        if (!c) return;
        if (isString(c)) c = c.split(' ');
        for (const e of c) {
          if (e) t.classList.add(e);
        }
      }
      addClass(this.containerElement, options.class);
      addClass(this.titleBoxElement, options.title_box_class);
      addClass(this.titleElement, options.title_class);
      addClass(this.contentElement, options.content_class);
      addClass(this.closeBtn, options.close_btn_class);

      this.startEventListening();
      this.addEventListener = this.dialogElement.addEventListener.bind(this.dialogElement);
      this.appendChild = this.dialogElement.appendChild.bind(this.dialogElement);
      this.querySelector = this.dialogElement.querySelector.bind(this.dialogElement);
    }

    startEventListening() {
      this.dialogElement.addEventListener('click', (e) => {
        if (e.target.tagName == 'DIALOG') {
          this.close();
        }
        return false;
      });

      this.closeBtn.addEventListener('click', () => {
        this.close();
        return false;
      });

      // 拖拽事件
      this.titleBoxElement.addEventListener('mousedown', (e) => {
        if (this.options.ifDrag) {
          let r = this.containerElement.getBoundingClientRect();
          this.#x = e.clientX - r.left;
          this.#y = e.clientY - r.top;
          this.#draging = true;
        }
        return false;
      });
      document.addEventListener('mousemove', (e) => {
        if (!this.#draging) return;
        let x = e.clientX - this.#x;
        let y = e.clientY - this.#y;

        if (this.options.dragLimit) {
          if (x <= 0) {
            x = 0;
          } else if (x >= window.innerWidth - this.containerElement.clientWidth) {
            x = window.innerWidth - this.containerElement.clientWidth;
          }

          if (y <= 0) {
            y = 0;
          } else if (y >= window.innerHeight - this.containerElement.clientHeight) {
            y = window.innerHeight - this.containerElement.clientHeight;
          }
        }

        this.dialogElement.style.left = x;
        this.dialogElement.style.top = y;
      })
      document.addEventListener('mouseup', (e) => {
        this.#draging = false;
      })
    }

    show() {
      if (this.dialogElement.hasAttribute('open')) return;
      this.b_stop = true;
      this.dialogElement.showModal();
      this.dialogElement.style.left = (window.innerWidth - this.containerElement.clientWidth) / 2;
      this.dialogElement.style.top = (window.innerHeight - this.containerElement.clientHeight) / 2;
      if (this.timeout > 0) {
        this.popup_timer = setTimeout(() => {
          this.close();
        }, this.timeout);
      }
    }

    close() {
      if (!this.dialogElement.hasAttribute('open')) return;
      if (this.b_stop) {
        clearTimeout(this.popup_timer);
        this.dialogElement.close();
        this.b_stop = false;
      }
    }
  }
  window.Popup = Popup;
})();