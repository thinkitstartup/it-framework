ThinkIT Framework
==================================================
ThinkIT Framework is a Framework jQuery-based. ThinkIT made of JavaScript ECMA Script 6.


### Installation
##### Classic web with <script\> tag
To install it as front-end framework, you need these package to be downloaded.
 - [Font Awesome](http://fontawesome.io/)
 - [JQuery](http://jquery.com/download/)
 - [Input Mask](https://github.com/RobinHerbots/Inputmask)
 - [Selectize](https://github.com/selectize/selectize.js)
 - [IT-Framework](https://github.com/thinkitstartup/it-framework)

the easiest step is by installing it via bower
```bash
bower install Font-Awesome
bower install jQuery
bower install inputmask
bower install selectize
bower install it-framework
```
You may add `--save` to save package in bower.json (`bower install <pkg> --save`). 
If you don't have/want to install via bower, please do some efffort to download all the dependecies manually.
<br>
Lastly, include this to your HTML
```html
<!-- Dependecies -->
<link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css" />
<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="bower_components/inputmask/dist/min/jquery.inputmask.bundle.min.js"></script>
<script type="text/javascript" src="bower_components/selectize/dist/js/standalone/selectize.min.js"></script>

<!-- ThinkIT -->
<link rel="stylesheet" href="bower_components/it-framework/dist/it-framework.min.css" />
<script type="text/javascript" src="bower_components/it-framework/dist/it-framework.min.js"></script>
```


### Contribution
Feel free to make a pull request ^_^. We would be happy to discuss anything to make it better.

##### Clone or download this package <br>
```
git clone git@github.com:thinkitstartup/it-framework.git
```

##### Install dev dependecies (can be found at [package.json](https://github.com/thinkitstartup/it-framework/blob/master/package.json))<br>
```
npm install
```
##### Make sure you have : 
* `grunt-cli` installed. `npm install -g grunt-cli`. [link](https://www.npmjs.com/package/grunt-cli)
* `sass` installed. `sudo gem install sass`. [link](http://sass-lang.com/install)

##### Run grunt task (concat, uglify, jsdoc, sass, watch) simply by executing default ```GruntFile.js``` <br>
```
grunt
``` 

### API
We use [jsdoc3/jsdoc](https://github.com/jsdoc3/jsdoc) to auto generating our documentation. It use [DocDash](https://github.com/thinkitstartup/docdash/tree/fixconstructor) as the template, forked from [DocDash](https://github.com/clenemt/docdash) to satisfy our need. As per this time, there's no CDN for the API Docs. But, you could make the api locally.
It can be Done by following the [Contributing Step](#contribution), and run the task with `grunt jsdoc`


### Contributors
Rohimat Nuryana <br>
Egy Mohammad Erdin <br>
Teguh Muhammad Zundi