# HBcaoPopup

jquery的一个小插件，全局弹窗windo.popup

[demo](https://demo.hbcao.top/HBcaoPopup/example.html)

## 安装

```
<script src="/static/js/HBcaoPopup.min.js"></script>
<link rel="stylesheet" href="HBcaoPopup.min.css">
```

## 使用

### 显示弹窗

```javascript
window.popup.show({
  content: '<p>操作成功！</p><p>3秒后自动关闭</p>',
  timeout: 3000,  // 可选，自动关闭时间，单位ms
  title: '提示',  // 可选，标题文本
  ifDrag: true,  // 可选，是否允许拖拽, 默认为true
  dragLimit: true,  // 可选，是否限制拖拽区域, 默认为true

  popup_css: {}, // 可选，弹窗本体的css
  title_css: {
    'background-color': 'green',
    color: 'skyblue',
  },  // 可选
  title_box_css: {},  // 可选
  content_css: {
    'background-color': 'red',
    color: 'blue',
  },  // 可选，内容样式
  close_box_css: {
    width: '30px',
    height: '30px',
    'border-radius': '50%',
    border: 'none',
  },  // 可选，关闭按钮样式
  close_css: {
    fill: '#fff',
    'font-size': '25px',
  },  // 可选，关闭按钮内svg样式

  popup_class: '',  // 可选，主要用于设置:hover等伪类
  title_class: 'popup_title',
  title_box_class: '',
  content_class: '',
  close_box_class: 'popup_close_box',
  close_class: '',
});
```

### 关闭弹窗

```
window.popup.closePopbox();
```

