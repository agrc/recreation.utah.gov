module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var jsAppFiles = '_src/app/**/*.js';
    var gruntFile = 'GruntFile.js';
    var jsFiles = [
        jsAppFiles,
        gruntFile,
        'profiles/**/*.js'
    ];
    var otherFiles = [
        '_src/app/**/*.html',
        '_src/app/**/*.styl',
        '_src/index.html'
    ];

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015-without-strict']
            },
            src: {
                files: [{
                    expand: true,
                    cwd: '_src',
                    src: ['**/*.js'],
                    dest: 'src'
                }]
            }
        },
        clean: {
            build: ['dist'],
            deploy: ['deploy'],
            src: ['src/app']
        },
        connect: {
            uses_defaults: { // eslint-disable-line camelcase
            }
        },
        copy: {
            dist: {
                src: 'src/ChangeLog.html',
                dest: 'dist/ChangeLog.html'
            },
            src: {
                expand: true,
                cwd: '_src',
                src: ['**/*.html', 'app/package.json'],
                dest: 'src'
            }
        },
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            main: {
                src: jsFiles
            }
        },
        stylint: {
            src: ['_src/**/*.styl']
        },
        stylus: {
            main: {
                options: {
                    compress: false,
                    'resolve url': true
                },
                files: [{
                    expand: true,
                    cwd: '_src/',
                    src: ['app/**/*.styl'],
                    dest: 'src/',
                    ext: '.css'
                }]
            }
        },
        watch: {
            src: {
                files: jsFiles.concat(otherFiles),
                options: { livereload: true },
                tasks: ['eslint', 'stylint', 'stylus', 'babel', 'copy:src']
            }
        }
    });

    grunt.registerTask('default', [
        'eslint',
        'clean:src',
        'stylus',
        'babel',
        'copy:src',
        'connect',
        'watch'
    ]);
};
