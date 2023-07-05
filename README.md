# HBcaoPopup

jquery的一个小插件，全局弹窗windo.popup

## 安装

```
<script src="/static/js/HBcaoPopup.min.js"></script>
```

## 使用

```javascript
window.popup.show({
  	content: '<p>操作成功！</p><p>3秒后自动关闭</p>',
    timeout: 2000, // 可选，自动关闭时间，单位ms
  	title: '提示', // 可选，标题文本
    ifDrag: true, //可选，是否允许拖拽
    dragLimit: true, //可选，是否限制拖拽区域
    title_color: 'white', //可选，标题字体颜色
    title_bgcolor: 'pink', //可选，标题背景颜色
    content_color: '#000', //可选，内容字体颜色
    content_bgcolor: '#fff', //可选，内容背景颜色
    title_class: 'popup_title', //可选，标题样式，设置后title_color, title_bgcolor无效
    content_class: 'popup_content', //可选，内容样式，设置后content_color, content_bgcolor无效
});
```

