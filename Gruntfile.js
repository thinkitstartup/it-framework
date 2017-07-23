module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		"concat": {
			"options": {
				"separator": ";"
			},
			"dist": {
				"src": ["src/namespace.js","src/lib/**/*.js"],
				"dest": "src/it-framework-all.js"
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/it-framework-min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		jsdoc : {
			dist : {
				src: ['<%= watch.files %>'],
				options: {
					destination: 'docs',
					template : "node_modules/docdash" // sample -> http://clenemt.github.io/docdash/module-documents_probe.html
				}
			}
		},
		watch: {
			files: ['README.md','<%= concat.dist.src %>'],
			tasks: ['concat','uglify','jsdoc']
		}
	});
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default', ['concat', 'uglify','watch']);
};