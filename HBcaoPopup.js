var Popup = function (options) {
  var self = this;
  if (!options) options = {};

  this.b_stop = true; // 防止重复点击
  this.page_w = $(window).width();
  this.page_h = $(window).height();
  this.timeout = options.timeout;

  $('body').append(`<div id="popup_box"><div id="popup"><div class="title"><p></p><div class="close_box"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg></div></div><div class="content"></div></div><div id="mask_shadow"></div></div>`);
  this.$box = $('#popup_box');
  this.$elem = this.$box.find('#popup');
  this.$oMask = this.$box.find('#mask_shadow');
  this.$oTitle = this.$elem.find('.title');
  this.$title_text = this.$oTitle.find('p');
  this.$close = this.$oTitle.find('.close_box');
  this.$cont = this.$elem.find('.content');

  this.$title_text.text(options.title);
  this.$cont[0].innerHTML = options.content;

  this.$title_text.css({ color: options.title_color });
  this.$title_text.css({ 'background-color': options.title_bgcolor });
  this.$cont.css({ color: options.content_color });
  this.$cont.css({ 'background-color': options.content_bgcolor });

  this.defaults = {
    ifDrag: true,
    dragLimit: true,
    title: '提示',
    content: '',
    title_color: 'white',
    title_bgcolor: 'pink',
    content_color: '#000',
    content_bgcolor: '#EDEDED',
    close_color: '#000',
    close_bgcolor: '',

    popup_css: {},
    title_css: {},
    title_box_css: {},
    content_css: {},
    close_css: {},
    close_box_css: {},

    popup_class: '',
    title_class: '',
    title_box_class: '',
    content_class: '',
    close_class: '',
    close_box_class: '',
  };
  this.opts = $.extend({}, this.defaults, options);

  this.$elem.on('click', function () {
    return false;
  });

  this.$close.on('click', function () {
    self.closePopbox();
    return false;
  });

  this.$oMask.on('click', () => self.closePopbox());

  // 拖拽事件
  this.$oTitle.on('mousedown', function (ev) {
    if (self.opts.ifDrag) {
      self.drag(ev);
    }

    return false;
  });
};

Popup.prototype = {
  show: function (options) {
    let self = this;
    let opts = $.extend({}, this.defaults, this.opts, options);

    this.ifDrag = opts.ifDrag;
    this.dragLimit = opts.dragLimit;
    this.$title_text.text(opts.title);
    this.$cont[0].innerHTML = opts.content;
    this.timeout = opts.timeout;

    if (!opts.popup_class) {
      this.$elem.attr('style', '');
      this.$elem.css(opts.popup_css);
    } else {
      this.$elem.addClass(opts.popup_class);
    }

    if (!opts.title_class) {
      this.$title_text.attr('style', '');
      this.$title_text.css({ color: opts.title_color });
      this.$title_text.css({ 'background-color': opts.title_bgcolor });
      this.$title_text.css(opts.title_css);
    } else {
      this.$title_text.removeClass();
      this.$title_text.addClass(opts.title_class);
    }
    this.$oTitle.css(opts.title_box_css);
    this.$oTitle.removeClass();
    this.$oTitle.addClass(opts.title_box_class + ' title');

    if (!opts.content_class) {
      this.$cont.attr('style', '');
      this.$cont.css({ color: opts.content_color });
      this.$cont.css({ 'background-color': opts.content_bgcolor });
      this.$cont.css(opts.content_css);
    } else {
      this.$cont.removeClass();
      this.$cont.addClass(opts.content_class + ' content');
    }

    if (!opts.close_class) {
      this.$close.children().attr('style', '');
      this.$close.children().css({ fill: opts.close_color });
      this.$close.children().css({ 'background-color': opts.close_bgcolor });
      this.$close.children().css(this.opts.close_css);
    } else {
      this.$close.children().removeClass();
      this.$close.children().addClass(opts.close_class + ' close');
    }
    this.$close.attr('style', '');
    this.$close.css(opts.close_box_css);
    this.$close.removeClass();
    this.$close.addClass(opts.close_box_class + ' close_box');

    this.popbox();
  },

  popbox: function () { // 显示弹窗
    var self = this;

    this.$oMask.show().animate({ opacity: 1 });
    this.$elem.show().animate({ opacity: 1 }, function () {
      self.b_stop = true;
    });
    if (this.timeout > 0) {
      this.popup_timer = setTimeout(function () {
        self.closePopbox();
      }, this.timeout);
    }

  },

  closePopbox: function () { // 关闭弹窗
    var self = this;
    if (this.b_stop) {
      clearTimeout(this.popup_timer);
      this.$oMask.animate({ opacity: 0 }, function () {
        $(this).hide();
      });;
      this.$elem.animate({ opacity: 0 }, function () {
        $(this).hide();
        self.b_stop = false;
      });

    }
  },

  drag: function (ev) { // 拖拽事件
    var self = this;
    var oEvent = ev || window.event;
    var disX = oEvent.clientX - this.$elem.offset().left;
    var disY = oEvent.clientY - this.$elem.offset().top;
    var _move = true;

    $(document).mousemove(function (ev) {
      if (_move) {
        var oEvent = ev || window.event;
        var offset_l = oEvent.clientX - disX;
        var offset_t = oEvent.clientY - disY;

        if (self.opts.dragLimit) {
          if (offset_l <= 0) {
            offset_l = 0;
          } else if (offset_l >= self.page_w - self.$elem.width()) {
            offset_l = self.page_w - self.$elem.width();
          }

          if (offset_t <= 0) {
            offset_t = 0;
          } else if (offset_t >= self.page_h - self.$elem.height()) {
            offset_t = self.page_h - self.$elem.height();
          }
        }

        self.$elem.css({ left: offset_l, top: offset_t });
      }
    }).mouseup(function () {
      _move = false;
    });
  },

  constructor: Popup
};

$(function () {
  window.popup = new Popup();
})