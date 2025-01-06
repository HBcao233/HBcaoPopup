
# npm install -g clean-css-cli 
# npm install -g uglify-js

make: 
	uglifyjs HBcaoPopup.js -o HBcaoPopup.min.js
	cleancss HBcaoPopup.css -o HBcaoPopup.min.css