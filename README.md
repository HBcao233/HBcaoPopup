# HBcaoPopup

jquery的一个小插件，全局弹窗windo.popup
[demo](https://demo.hbcao.top/HBcaoPopup/example.html)

## 安装

```
<script src="/static/js/HBcaoPopup.min.js"></script>
<link rel="stylesheet" href="HBcaoPopup.min.css">
```

## 使用

```javascript
$('.btn').click(function (e) {
  e.stopPropagation() //必须，否则弹窗打开会离开关闭
  window.popup.show({
    content: '<p>操作成功！</p><p>3秒后自动关闭</p>',
    timeout: 3000, // 可选，自动关闭时间，单位ms
    title: '提示', // 可选，标题文本
    ifDrag: true, //可选，是否允许拖拽
    dragLimit: true, //可选，是否限制拖拽区域
    title_class: 'popup_title', //可选，标题样式，设置后title_color, title_bgcolor无效
    content_class: 'popup_content', //可选，内容样式，设置后content_color, content_bgcolor无效
    close_box_class: 'popup_close_box', //可选，关闭按钮样式
    close_class: 'popup_close', //可选，关闭按钮内svg样式
  });
  return false; //必须，否则弹窗打开会离开关闭
})
```

