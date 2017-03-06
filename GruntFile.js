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

    var secrets = grunt.file.readJSON('secrets.json');

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
            src: ['src/app', 'src/**.*']
        },
        compress: {
            main: {
                options: {
                    archive: 'deploy/deploy.zip'
                },
                files: [{
                    src: [
                        '**',
                        '!**/*.uncompressed.js',
                        '!**/*consoleStripped.js',
                        '!**/bootstrap/less/**',
                        '!**/bootstrap/test-infra/**',
                        '!**/tests/**',
                        '!build-report.txt',
                        '!components-jasmine/**',
                        '!favico.js/**',
                        '!jasmine-favicon-reporter/**',
                        '!jasmine-jsreporter/**',
                        '!stubmodule/**',
                        '!util/**',
                        '!LICENSE',
                        '!*.md',
                        '!gruntfile.js',
                        '!package.json',
                        '!bower.json',
                        '!*.d.ts',
                        '!.DS_Store'
                    ],
                    dest: './',
                    cwd: 'dist/',
                    expand: true
                }]
            }
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
                src: ['**/*.html', 'app/package.json', '**/secrets.json'],
                dest: 'src'
            }
        },
        dojo: {
            prod: {
                options: {
                    profiles: ['src/profiles/prod.build.profile.js', 'src/profiles/build.profile.js']
                }
            },
            stage: {
                options: {
                    profiles: ['src/profiles/stage.build.profile.js', 'src/profiles/build.profile.js']
                }
            },
            options: {
                dojo: 'src/dojo/dojo.js',
                load: 'build',
                releaseDir: '../dist',
                requires: ['src/app/run.js', 'src/app/packages.js'],
                basePath: './src'
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
        processhtml: {
            options: {},
            main: {
                files: {
                    'dist/index.html': ['src/index.html']
                }
            }
        },
        secrets: secrets,
        sftp: {
            stage: {
                files: {
                    './': 'deploy/deploy.zip'
                },
                options: {
                    host: '<%= secrets.stage.host %>',
                    username: '<%= secrets.stage.username %>',
                    password: '<%= secrets.stage.password %>'
                }
            },
            prod: {
                files: {
                    './': 'deploy/deploy.zip'
                },
                options: {
                    host: '<%= secrets.prod.host %>',
                    username: '<%= secrets.prod.username %>',
                    password: '<%= secrets.prod.password %>',
                    path: './upload/recreate'
                }
            },
            options: {
                path: './wwwroot/recreate/',
                srcBasePath: 'deploy/',
                showProgress: true
            }
        },
        sshexec: {
            stage: {
                command: ['cd wwwroot/recreate', 'unzip -oq deploy.zip', 'rm deploy.zip'].join(';'),
                options: {
                    host: '<%= secrets.stage.host %>',
                    username: '<%= secrets.stage.username %>',
                    password: '<%= secrets.stage.password %>'
                }
            },
            prod: {
                command: ['cd wwwroot/recreate', 'unzip -oq deploy.zip', 'rm deploy.zip'].join(';'),
                options: {
                    host: '<%= secrets.prod.host %>',
                    username: '<%= secrets.prod.username %>',
                    password: '<%= secrets.prod.password %>'
                }
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

    grunt.registerTask('build-stage', [
        'clean:src',
        'babel',
        'copy:src',
        'stylus',
        'clean:build',
        'dojo:stage',
        'copy:dist',
        'processhtml'
    ]);

    grunt.registerTask('deploy-stage', [
        'clean:deploy',
        'compress:main',
        'sftp:stage',
        'sshexec:stage'
    ]);
};
