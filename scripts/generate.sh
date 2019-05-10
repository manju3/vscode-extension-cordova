cd $1
npm run generate
# rename the file name of _nuxt
mv ./dist/_nuxt ./dist/nuxt

# find and replace
find ./dist -type f -exec sed -i 's+/_nuxt/+./nuxt/+g' {} \;
find ./dist/nuxt -type f -exec sed -i 's+/_nuxt/+./nuxt/+g' {} \;
ex -sc '8i|<script type="text/javascript" src="cordova.js"></script>' -cx ./dist/index.html
cp -r ./dist/* $2/www