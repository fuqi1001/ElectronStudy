var gulp = require('gulp');
var sass = require('gulp-sass');
const autoPrefix = require("gulp-autoprefixer");
const concatenate = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");

gulp.task('styles',() =>{
    gulp.src('app/css/source/sass/**/*.scss')
        .pipe(concatenate("styles-from-sass.min.css"))
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('./app/css'))
});

gulp.task("css", () => {
    gulp.src('app/css/**/*.css')
        .pipe(concatenate("calendar.css"))
        .pipe(autoPrefix())
        .pipe(cleanCSS())
        .pipe(gulp.dest("./app/css"));
})


gulp.task('watch',() => {
    gulp.watch('app/css/source/sass/**/*.scss',['styles']);
    gulp.watch('app/css/**/*.css',['css']);
})

gulp.task("default",['watch']);