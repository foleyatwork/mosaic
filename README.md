# Build Dependencies
Here are the tools you need to work on this project.

## Sass
    sudo gem install sass

## Babel
    npm install -g babel-cli

## Babel ES2015 Preset
    cd mosaic
		npm install

# Build Commands
Here's how you compile the code.

## Sass
    sass --watch css/mosaic.scss:css/mosaic.css

## Babel
    babel js/mosaic.js --watch --out-file js/bundle.js
