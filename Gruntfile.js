module.exports = function(grunt){
	grunt.initConfig({
		uglify: {
			my_target: {
				files: {
					'../templates/virgin.min.js': ['js/**/*.js','!js/player_old.js']
				},
			}
		},
		compass: {     
			dist: { 
				options: {         
					config: 'config.rb',         
					//sourcemap: true       
				} 
			}    
		},
		cssmin: {
			/*options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},*/
			target: {
				files: {
					'../templates/styles.min.css': ['../templates/styles.css']
				}
			}
		},
		watch: {
			css: {       
				files: '../templates/*.css',
				tasks: ['cssmin'],
				options: {
            		spawn: false
        		}   
			},
			scss: {       
				files: 'sass/*.scss',
				tasks: ['compass'] ,
				options: {
            		sourcemap: true
        		}   
			},
			scripts: {
				files: ['js/**/*.js'],
				tasks: ['uglify'],
				options: {
					spawn: false
				}
			} 
		},
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
}