const gulp = require("gulp"),
  del = require("del"),
  sass = require("gulp-sass"),
  cleanCSS = require("gulp-clean-css"),
  browserSync = require("browser-sync").create(),
  autoprefixer = require("gulp-autoprefixer"),
  rename = require("gulp-rename"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify-es").default,
  imagemin = require("gulp-imagemin"),
  pngquant = require("imagemin-pngquant"),
  ttf2woff = require("gulp-ttf2woff"),
  ttf2woff2 = require("gulp-ttf2woff2"),
  fonter = require("gulp-fonter"),
  gcmq = require("gulp-group-css-media-queries"),
  fileinclude = require("gulp-file-include"),
  plumber = require("gulp-plumber"),
  prettyHtml = require("gulp-pretty-html"),
  babel = require("gulp-babel"),
  svgSprite = require("gulp-svg-sprite"),
  svgmin = require("gulp-svgmin"),
  replace = require("gulp-replace"),
  reload = browserSync.reload;

const fs = require("fs");
const source_folder = "src";

const path = {
  build: {
    //Тут мы укажем куда складывать готовые после сборки файлы
    html: "build/",
    js: "build/js/",
    css: "build/css/",
    img: "build/img/",
    svg: "build/img/svg",
    fonts: "build/fonts/",
  },
  src: {
    //Пути откуда брать исходники
    html: "src/#html/*.html", //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
    main: "src/js/partials/main.js",
    vendors: "src/js/partials/vendors.js",
    js: "src/js/main.js", //В стилях и скриптах нам понадобятся только main файлы
    style: "src/style/main.scss",
    img: "src/img/**/*.*", //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    svg: "src/svg-icons/*.svg",
    fonts: "src/fonts/**/*.*",
  },
  watch: {
    //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    html: "src/**/*.html",
    js: "src/js/**/*.js",
    style: "src/style/**/*.scss",
    img: "src/img/**/*.*",
    fonts: "src/fonts/**/*.*",
  },
  clean: "./build",
};

let autoprefixBrowsers = [
  "> 1%",
  "last 2 versions",
  "firefox >= 4",
  "safari 7",
  "safari 8",
  "IE 8",
  "IE 9",
  "IE 10",
  "IE 11",
];

gulp.task("browser-sync", function () {
  browserSync.init({
    server: "./build",
    port: 5080,
    notify: false,
  });
});

gulp.task("html:build", function (done) {
  return gulp
    .src(path.src.html) //Выберем файлы по нужному пути
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "./src/#html",
      })
    )
    .pipe(prettyHtml())
    .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
    .pipe(reload({ stream: true })); //И перезагрузим наш сервер для обновлений
});

gulp.task("babel", function (done) {
  return gulp
    .src("src/js/partials/main.js") //Найдем наш main файл
    .pipe(plumber())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulp.dest("src/js/es5"));
});

gulp.task("js:build-old", function (done) {
  return gulp
    .src(path.src.js) //Найдем наш main файл
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: "!!",
        basepath: "./src/js",
      })
    )
    .pipe(sourcemaps.init()) //Инициализируем sourcemap
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify()) //Сожмем наш js
    .pipe(sourcemaps.write()) //Пропишем карты
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({ stream: true })); //И перезагрузим сервер
});

gulp.task("js:build", function (done) {
  gulp
    .src(path.src.vendors)
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: "!!",
        basepath: "./src/js",
      })
    )
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(gulp.dest(path.build.js));
  return (
    gulp
      .src(path.src.main)
      .pipe(plumber())
      //  .pipe(sourcemaps.init())
      .pipe(
        fileinclude({
          prefix: "!!",
          basepath: "./src/js",
        })
      )
      .pipe(
        babel({
          presets: ["@babel/env"],
        })
      )
      .pipe(gulp.dest(path.build.js))
      .pipe(uglify())
      //  .pipe(sourcemaps.write())
      .pipe(
        rename({
          extname: ".min.js",
        })
      )
      .pipe(gulp.dest(path.build.js))
      .pipe(reload({ stream: true }))
  );
});

gulp.task("style:build", function (done) {
  return gulp
    .src(path.src.style) //Выберем наш main.scss
    .pipe(sourcemaps.init()) //То же самое что и с js
    .pipe(plumber())
    .pipe(sass()) //Скомпилируем
    .pipe(
      autoprefixer({
        browsers: autoprefixBrowsers,
        cascade: false,
      })
    ) //Добавим вендорные префиксы
    .pipe(gcmq())
    .pipe(gulp.dest(path.build.css))
    .pipe(cleanCSS({ compatibility: "ie8" })) //Сожмем
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(path.build.css)) //И в build
    .pipe(reload({ stream: true }));
});

gulp.task("image:build", function (done) {
  return gulp
    .src(path.src.img) //Выберем наши картинки
    .pipe(
      imagemin({
        //Сожмем их
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
        interlaced: true,
      })
    )
    .pipe(gulp.dest(path.build.img)) //И бросим в build
    .pipe(reload({ stream: true }));
});

gulp.task("fonts:build", function (done) {
  gulp.src(path.src.fonts).pipe(ttf2woff()).pipe(gulp.dest(path.build.fonts));
  return gulp.src(path.src.fonts).pipe(ttf2woff2()).pipe(gulp.dest(path.build.fonts));
});

gulp.task("otf2ttf", function () {
  return gulp
    .src(path.src.fonts)
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(gulp.dest(path.src.fonts));
});

gulp.task("fonts:connect", function (done) {
  let file_content = fs.readFileSync(source_folder + "/style/partials/fonts.scss");
  let font;
  let fontname;
  let fontweight;

  if (file_content == "") {
    fs.writeFile(source_folder + "/style/partials/fonts.scss", "", cb);
    fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          font = items[i].split(".")[0];
          fontname = font.split("-")[0];
          fontweight = font.split("-")[1] ? font.split("-")[1].toLowerCase() : "normal";
          fontstyle = font.split("-")[2] ? font.split("-")[2].toLowerCase() : "normal";

          if (c_fontname != font) {
            fs.appendFile(
              source_folder + "/style/partials/fonts.scss",
              `@include font("${fontname}", "${font}", "${fontweight}", "${fontstyle}"); \r\n`,
              cb
            );
          }
          c_fontname = font;
        }
      }
    });
  }

  done();
});

gulp.task("clean", function () {
  return del(path.clean);
});

gulp.task("sprite:build", function () {
  return gulp
    .src(path.src.svg)
    .pipe(
      svgSprite({
        mode: {
          stack: true,
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(replace("&gt;", ">"))
    .pipe(gulp.dest(path.build.svg));
});

function cb() {}

gulp.task("build", gulp.parallel("html:build", "js:build", "style:build", "image:build"));

gulp.task("watch", function () {
  gulp.watch([path.watch.html], gulp.series("html:build"));
  gulp.watch([path.watch.style], gulp.series("style:build"));
  gulp.watch([path.watch.js], gulp.series("js:build"));
});

gulp.task("default", gulp.parallel("build", "browser-sync", "watch"));
gulp.task("online", gulp.parallel("browser-sync", "watch"));
