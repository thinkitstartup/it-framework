module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ";"
			},
			dist: {
				src: ["src/js/namespace.js","src/js/lib/**/*.js"],
				dest: "src/js/it-framework-all.js"
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
					'dist/it-framework.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		jsdoc : {
			dist : {
				src: ['README.md','<%= concat.dist.src %>'],
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
				files:'src/sass/it-framework.scss',
				tasks:['sass'],
				options: {
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
				files: ['<%= concat.dist.src %>'],
				tasks: ['concat', 'uglify', 'jsdoc'],
				options: {
					livereload: 8080,
					spawn: false
				}
			},
			files: ['<%= watch.configFiles.files %>'],
			tasks: ['sass', 'concat', 'uglify', 'jsdoc']
		}
	});
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.registerTask('default', ['sass', 'concat', 'uglify', 'jsdoc', 'watch']);
};