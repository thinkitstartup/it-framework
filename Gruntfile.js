var path = require('path');

const banner = '/*! \n<%= pkg.name %> - <%= pkg.license %>\n' +
	'Version\t: <%= pkg.version %> \n' +
	'Created\t: This file was auto generated at <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> \n' +
	'Author\t: <%= pkg.author %>\n' +
	'*/\n';

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat_in_order: {
			options: {
				banner: banner,
				extractRequired: function (filepath, filecontent) {
					var workingdir = path.normalize(filepath).split(path.sep);
					workingdir.pop();
					var deps = this.getMatches(/\*\s*@depend\s(.*)/g, filecontent);
					deps.forEach(function (dep, i) {
						dep = dep.replace(/^IT\./g, "") + ".js";
						var dependency = workingdir.concat([dep]);
						deps[i] = path.join.apply(null, dependency);
					});
					return deps;
				},
				extractDeclared: function (filepath) {
					return [filepath];
				},
				onlyConcatRequiredFiles: true
			},
			script: {
				src: ["src/js/namespace.js", "src/js/lib/**/*.js"],
				dest: 'dist/it-framework-all.js'
			}
		},
		uglify: {
			minify: {
				options: {
					compress: true,
					compress: {
						drop_console: !true
					},
					beautify: false,
					banner: banner
				},
				src: '<%= concat_in_order.script.dest %>',
				dest: 'dist/it-framework.min.js'
			},
		},
		jsdoc: {
			dist: {
				src: ['README.md', '<%= concat_in_order.script.src %>'],
				options: {
					destination: 'docs',
					recurse: true,
					verbose: true,
					// sample -> http://clenemt.github.io/docdash/module-documents_probe.html
					template: "node_modules/docdash"
				}
			}
		},
		sass: {
			options: {
				sourcemap:"auto",
				style: 'compressed', //[nested, compact, compressed, expanded]
				quiet: true,
				noCache:true,
			},
			dist: {
				src:'src/sass/it-framework.scss',
				dest:'dist/it-framework.min.css'
			}
		},
		watch: {
			options: {
				livereload: 8080,
				spawn: false,
			},
			configFiles: {
				files: 'Gruntfile.js',
				tasks: 'default',
				options: {
					reload: true
				}
			},
			script: {
				files: [
					'<%= watch.configFiles.files %>',
					'<%= concat_in_order.script.src %>',
					'research/**/*'
				],
				tasks: ["newer:concat_in_order","newer:uglify"],
			},
			sass: {
				files: 'src/sass/**/*',
				tasks: 'sass',
			}
		}
	});
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-concat-in-order');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.registerTask('default', [
		'sass',
		'newer:concat_in_order',
		'newer:uglify',
		'newer:jsdoc',
		'watch'
	]);
};