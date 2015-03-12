#!/bin/bash

# this script will setup a boilerplate frontend project with gulp/livereload, sass/susy, and coffeescript as the stack,
# also utilizing jQuery, normalize.css, modernizer, and fontawesome

# clone repo
echo "Cloning repository..."
git clone https://github.com/oldskoolfan/frontend-boilerplate.git

# install node modules
echo "Installing node modules..."
cd frontend-boilerplate
npm install