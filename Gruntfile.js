var path = require('path');
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat_in_order: {
			options:{
				extractRequired: function(filepath, filecontent) {
					var workingdir = path.normalize(filepath).split(path.sep);
					workingdir.pop();
					var deps = this.getMatches(/\*\s*@depend\s(.*)/g, filecontent);
					deps.forEach(function(dep, i) {
						dep = dep.replace(/^IT\./g, "")+ ".js";
						var dependency = workingdir.concat([dep]);
						deps[i] = path.join.apply(null, dependency);
					});
					return deps;
				},
				extractDeclared: function(filepath) {
					return [filepath];
				},
				onlyConcatRequiredFiles: true
			},
			script:{
				src:["src/js/namespace.js","src/js/lib/**/*.js"],
				dest:'src/js/it-framework-all.js'
			}
		},
		uglify: {
			options: {
				//sourceMap: true,
				compress:!true,
				/*compress: {
					drop_console: !true
				},*/
				beautify:!true,
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			// report:"gzip",
			dist: {
				files: {
					'dist/it-framework.min.js': "src/js/it-framework-all.js"
				}
			}
		},
		jsdoc : {
			dist : {
				src: ['README.md','<%= concat_in_order.script.src %>'],
				options: {
					destination: 'docs',
					recurse: true,
					verbose: true,
					template : "node_modules/docdash" // sample -> http://clenemt.github.io/docdash/module-documents_probe.html
				}
			}
		},
		sass: {
			options: {
				sourcemap:"none",
				style: 'nested', //[nested, compact, compressed, expanded]
				quiet: true,
				noCache:true,
			},
			dist: {
				src:'src/sass/it-framework.scss',
				dest:'dist/it-framework.min.css'
			}
		},
		watch: {
			configFiles: {
				files: ['Gruntfile.js'],
				tasks: ['sass','concat_in_order','uglify','jsdoc'],
				options: {
					reload: true
				}
			},
			script:{
				files: ['<%= concat_in_order.script.src %>'],
				tasks: ['concat_in_order','uglify'/*,'jsdoc'*/]
			},
			all:{
				files: ['<%= watch.configFiles.files %>'],
				tasks: ['sass','concat_in_order','uglify','jsdoc']
			},
			reload:{				
				files: [
					'<%= watch.sass.files %>',
					'<%= watch.script.files %>',
					//'<%= watch.script_no_docs.files %>',
					//'<%= watch.example.files %>',
					//'src/sass/**/*.scss'
				],
				options: {
					livereload: 8080,
					spawn: false,
				}
			},
			sass:{
				files:['src/sass/it-framework.scss'],
				tasks:['sass'],
			}
		}
	});
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-concat-in-order');
	grunt.registerTask('default', ['sass','concat_in_order','uglify','jsdoc','watch']);
};