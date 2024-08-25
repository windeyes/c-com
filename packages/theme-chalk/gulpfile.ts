import {series,src,dest} from 'gulp'
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
// 添加样式前缀
import autoprefixer from 'gulp-autoprefixer';
import path from 'path';
import postcss from 'postcss'
import cssnano from 'cssnano'
import { Transform } from 'stream'
import type Vinly from 'vinyl'

/**
 * using `postcss` and `cssnano` to compress CSS
 * @returns
 */
function compressWithCssnano() {
    const processor = postcss([
      cssnano({
        preset: [
          'default',
          {
            // avoid color transform
            colormin: false,
            // avoid font transform
            minifyFontValues: false,
          },
        ],
      }),
    ])
    return new Transform({
      objectMode: true,
      transform(chunk, _encoding, callback) {
        const file = chunk as Vinly
        if (file.isNull()) {
          callback(null, file)
          return
        }
        if (file.isStream()) {
          callback(new Error('Streaming not supported'))
          return
        }
        const cssString = file.contents!.toString()
        processor.process(cssString, { from: file.path }).then((result) => {
        //   const name = path.basename(file.path)
          file.contents = Buffer.from(result.css)
        //   consola.success(
        //     `${chalk.cyan(name)}: ${chalk.yellow(
        //       cssString.length / 1000
        //     )} KB -> ${chalk.green(result.css.length / 1000)} KB`
        //   )
          callback(null, file)
        })
      },
    })
}
  
function comScss(){
    const sass = gulpSass(dartSass)
    return src('./src/index.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(compressWithCssnano())
    .pipe(dest("./dist/css"))
}
function dealFont(){
    return src('./src/fonts/**').pipe(dest('./dist/fonts'))
}
export default series(comScss,dealFont)