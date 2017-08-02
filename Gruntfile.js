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
			all:{
				files: {
					'src/js/it-framework-all.js':["src/js/namespace.js","src/js/lib/**/*.js"],
				}
			}
		},
		uglify: {
			options: {
				compress: {
					drop_console: !true
				},
				beautify: true
			},
			dist: {
				files: {
					'dist/it-framework.min.js': "src/js/it-framework-all.js"
				}
			}
		},
		jsdoc : {
			dist : {
				src: ['README.md',"src/js/namespace.js","src/js/lib/**/*.js"],
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
				files: {
					'dist/it-framework.min.css': 'src/sass/it-framework.scss'
				}
			}
		},
		watch: {
			configFiles: {
				files: ['Gruntfile.js'],
				options: {
					reload: true
				}
			},
			sass:{
				files:['src/sass/it-framework.scss','src/sass/**/*.scss'],
				tasks:['sass'],
				options: {
					livereload: 8080,
					spawn: false,
				}
			},
			docs:{
				files: ['README.md'],
				tasks: ['jsdoc'],
				options: {
					spawn: false,
				}
			},
			script:{
				files: ["src/js/namespace.js","src/js/lib/**/*.js"],
				tasks: ['concat_in_order', 'uglify', 'jsdoc'],
				options: {
					livereload: 8080,
					spawn: false
				}
			},
			all:{
				files: ['<%= watch.configFiles.files %>'],
				tasks: ['sass','concat_in_order','uglify','jsdoc']
			},
			example:{
				files: ["example/**/*"],
				options: {
					livereload: 8080,
					reload: true
				}	
			}
		}
	});
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-concat-in-order');
	grunt.registerTask('default', ['sass','concat_in_order','uglify','jsdoc','watch']);
	grunt.registerTask('simple', ['concat_in_order','uglify','watch']);
};