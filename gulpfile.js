const gulp = require('gulp');
const $    = require('gulp-load-plugins')();
const fs   = require('fs');
const csv  = require('csv-parser');

gulp.task( "ejs", function () {
    let json;
    let csv_group_data = [];

    return fs.createReadStream(__dirname + '/src/csv/kyoto.csv')
        .pipe(csv())
        .on('data', function(data){
            if(typeof csv_group_data[data['group']] == 'undefined') csv_group_data[data['group']] = [];
            csv_group_data[data['group']].push(data);
        })
        .on('end', function(){
            json = {
                spot : csv_group_data
            };

            // console.log(json['spot']);
            gulp.src(["./src/ejs/index.ejs"])
                .pipe($.ejs(json))
                .pipe($.rename(
                    {
                        extname: '.html'
                    }))
                .pipe( gulp.dest( "./html" ) );

            ////////////////////////
            for(let group in csv_group_data){
                json = {
                    spot : csv_group_data[group]
                };
                let output_dir = csv_group_data[group][0]['directory']
                gulp.src(["./src/ejs/group.ejs"])
                .pipe($.ejs(json))
                .pipe($.rename(
                    { 
                        basename: 'index', 
                        extname: '.html' 
                    }))
                .pipe( gulp.dest( "./html" + output_dir ) );

                for(let spot_id in csv_group_data[group]){
                    json = {
                        spot_data : csv_group_data[group][spot_id]
                    };
                    let output_dir = json['spot_data']['directory']
                    gulp.src(["./src/ejs/spot.ejs"])
                    .pipe($.ejs(json))
                    .pipe($.rename(
                        { 
                            basename: json['spot_data']['filename'], 
                            extname: '' 
                        }))
                    .pipe( gulp.dest( "./html" + output_dir ) );
                }
            }
        });
});