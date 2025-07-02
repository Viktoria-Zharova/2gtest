# samolet-2gis
This incredible project was developed for the Russian company [Samolet](https://samolet.ru/) to showcase their residential complex in [Krasnogorsk](https://en.wikipedia.org/wiki/Krasnogorsk,_Moscow_Oblast)

Here is the [link](https://samolet-2gis.hart-estate.ru/) to enjoy this beauty

And here is the [low poly version](https://samolet-2gis.hart-estate.ru/lowPoly.html)

## Instalation
If you want to run it locally, make sure you have these programs installed on your Unix machine (Windows is supported as well)

1. git
2. node.js 18+
3. npm

that's pretty much it


then execute these commands in your terminal (or cmd)
```
git clone https://gitlab.myhart.ru/hart_estate/samolet-2gis
cd samolet-2gis
npm i
npm start
```

After all that, you can open this website on your browser of choice. The only caveat is that you have to disable CORS protection.
You may use a firefox extension like [this one](https://addons.mozilla.org/en-US/firefox/addon/access-control-allow-origin/)

or launch your chromium based browser with --disable-web-protection flag
```
chromium --user-data-dir=~/randormDir --disable-web-security
```


if you want to build the project, execute
```
npm run build
```

after that the dist folder will appear in your project root, where you can open an html file of your desire in your browser (with CORS protection disabled)

