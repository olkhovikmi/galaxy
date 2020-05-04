let project_folder = 'dist'; // эту папку надо выгружать на сервер и передавать заказчику
let source_folder = '#src'; // папка с исходниками

let path = {
	build: {
		html: project_folder + '/',
		css: project_folder + '/css/',
		js: project_folder + '/js/',
		img: project_folder + '/img/',
		fonts: project_folder + '/fonts/'
	}, // пути вывода
	src: {
		html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
		css: source_folder + '/scss/style.scss',
		js: source_folder + '/js/script.js',
		img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
		fonts: source_folder + '/fonts/*.{ttf,woff,woff2}'
	}, // пути вывода
	watch: {
		html: source_folder + '/**/*.html',
		css: source_folder + '/scss/**/*.scss',
		js: source_folder + '/js/**/*.js',
		img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}'
	},
	clean: './' + project_folder + '/'
};
//ПЕРЕМЕННЫЕ
let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	group_media = require('gulp-group-css-media-queries'),
	clean_css = require('gulp-clean-css'),
	rename = require('gulp-rename');

function browserSync() {
	browsersync.init({
		server: {
			baseDir: './' + project_folder + '/'
		},
		port: 3000,
		notify: false
	});
}

function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
} //работа с html файлами

function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: 'expanded' // scss формируетя не сжатым
			})
		)
		.pipe(group_media())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 5 versions'],
				cascade: true
			})
		) // настройка аутопрефикса для css
		.pipe(dest(path.build.css)) // выгружаем файл css
		.pipe(clean_css()) //сжимаем css файл
		.pipe(
			rename({
				extname: '.min.css'
			})
		) //  создаем сжатый файл css
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
} //работа с css файлами

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
} //обновляет код html

function clear() {
	return del(path.clean);
} //удаляет папку dist

let build = gulp.series(clear, gulp.parallel(css, html));
let watch = gulp.parallel(build, watchFiles, browserSync); //вызывает функции

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
