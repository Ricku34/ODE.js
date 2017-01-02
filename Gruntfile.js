module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),


        clean: {
            options: {
                force: true
            },
            lib: {
                src: ['./lib/libode.js']
            },
            doc : {
                src: ['./lib/ode.js', 'docs']
            }
        },


        concat: {
            post : {
                files: {
                    './src/post.js': [
                        './src/header.js',
                        './src/rotation.js',
                        './src/mass.js',
                        './src/joints.js',
                        './src/contact.js',
                        './src/body.js',
                        './src/world.js',
                        './src/geom.js',
                        './src/space.js',
                        './src/footer.js'
                    ]
                }
            },
           
            doc: {
                options: {
                    banner: '/*! Generated <%= pkg.name %> version <%= pkg.version %>\n' +
                            ' *  Built on <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                            ' */\n',
                    footer: ''
                },
                files: {
                    './lib/ode.js': [
                        './src/pre.js',
                        './src/post.js'
                    ]
                }
            }
        },

        jsdoc : {
            doc : {
                src: ['lib/ode.js', 'README.md'],
                options: {
                    destination: 'docs',
                    configure: 'jsdoc.json',
                    template: "./node_modules/jaguarjs-jsdoc"
                }
            }
        }


    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('docsPostProcessing', function () {
        var done = this.async();
        require('fs').appendFile('./docs/styles/jaguar.css', '.tag-source { display: none; }', function (err) {
            if (err) {
                grunt.fail.fatal(err);

                return;
            }

            done();
        });
    });

    grunt.registerTask('make', function () {
        var done = this.async();
        require("child_process").exec('make',{cwd : './ode-0.7'},function (err, stdout) {
            if (err) {
                done(err);
            }
            console.log(stdout);
            done();
        });
    });

    grunt.registerTask('makeclean', function () {
        var done = this.async();
        require("child_process").exec('make clean',{cwd : './ode-0.7'},function (err, stdout) {
            if (err) {
                done(err);
            }
            console.log(stdout);
            done();
        });
    });

    grunt.registerTask('default', ['makeclean', 'clean:lib', 'clean:doc','make']);
    grunt.registerTask('clear', ['makeclean', 'clean:doc']);
    //grunt.registerTask('build', ['clean:pre', 'jshint', 'copy', 'less', 'html2js', 'concat', 'ngAnnotate', 'uglify', 'clean:post']);
    grunt.registerTask('post', ['concat:post']);
    grunt.registerTask('doc', ['clean:doc', 'post', 'concat:doc', 'jsdoc:doc', 'docsPostProcessing']);
    grunt.registerTask('js', ['clean:lib', 'make']);

};
