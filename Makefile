
# npm install -g clean-css-cli 
# npm install -g uglify-js

make: 
	uglifyjs HBcaoPopup.js -o dist/HBcaoPopup.min.js
	cleancss HBcaoPopup.css -o dist/HBcaoPopup.min.css