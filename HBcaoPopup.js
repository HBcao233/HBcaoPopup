var Popup = function (options) {
  var self = this;
  if (!options) options = {};

  this.b_stop = true; // 防止重复点击
  this.page_w = $(window).width();
  this.page_h = $(window).height();
  this.timeout = options.timeout;

  $('body').append(`<div id="popup_box"><div id="popup"><div class="title"><p></p><div class="close_box"><svg viewBox="0 0 24 24" aria-hidden="true" class="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg></div></div><div class="cont"></div></div><div id="mask_shadow"></div></div>`);
  this.$box = $('#popup_box');
  this.$elem = this.$box.find('#popup');
  this.$oMask = this.$box.find('#mask_shadow');
  this.$oTitle = this.$elem.find('.title');
  this.$title_text = this.$oTitle.find('p');
  this.$close = this.$oTitle.find('.close_box');
  this.$cont = this.$elem.find('.cont');

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
    title_class: '',
    content_color: '#000',
    content_bgcolor: '#EDEDED',
    content_class: '',
    close_color: '#000',
    close_bgcolor: '',
    close_class: '',
    close_box_class: '',
  };
  this.opts = $.extend({}, this.defaults, options);

  this.$elem.css({ left: (this.page_w - this.$elem.width()) / 2 });

  this.$elem.on('click', function () {
    return false;
  });

  this.$close.on('click', function () {
    self.closePopbox();

    return false;
  });

  $(document.body).on('click', function () {
    self.closePopbox();
  });

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
    this.ifDrag = options.ifDrag;
    this.dragLimit = options.dragLimit;
    this.$title_text.text(options.title);
    this.$cont[0].innerHTML = options.content;
    this.timeout = options.timeout;

    if (!options.title_class) {
      this.$title_text.css({ color: options.title_color });
      this.$title_text.css({ 'background-color': options.title_bgcolor });
    } else {
      this.$title_text.addClass(options.title_class);
    }

    if (!options.content_class) {
      this.$cont.css({ color: options.content_color });
      this.$cont.css({ 'background-color': options.content_bgcolor });
    } else {
      this.$cont.addClass(options.content_class);
    }

    if (!options.close_class) {
      this.$close.children().css({ fill: options.close_color });
      this.$close.children().css({ 'background-color': options.close_bgcolor });
    } else {
      this.$close.children().addClass(options.close_class);
    }
    this.$close.addClass(options.close_box_class);

    this.opts = $.extend({}, this.defaults, this.opts, options);

    this.popbox();
  },

  popbox: function () { // 显示弹窗
    var self = this;

    this.$oMask.show().animate({ opacity: 1 });
    this.$elem.show().animate({ opacity: 1, top: 260 }, function () {
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
    clearTimeout(this.popup_timer);
    if (this.b_stop) {
      this.$oMask.animate({ opacity: 0 }, function () {
        $(this).hide();
      });;
      this.$elem.animate({ opacity: 0, top: 150 }, function () {
        $(this).hide();
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