var d3 = require('d3'),
    fs = require('fs');

var header = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="1600" height="1600" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
    footer = '</svg>',
    width = 1600,
    height = 1600;

createSVG(process.argv[2]);

function createSVG(filename) {

  fs.readFile(filename,'utf8',function(err,data){

    var geo = JSON.parse(data),
        projection = d3.geo.conicConformal()
          .parallels([40 + 2 / 3, 41 + 1 / 30])
          .rotate([74, 40 + 1 / 6])
          .translate([width / 2, height / 2]),
        path = d3.geo.path()
          .projection(projection),
        output = process.stdout,
        b,
        s,
        t;

    projection
        .scale(1)
        .translate([0, 0]);

    b = path.bounds(geo);
    s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
        .scale(s)
        .translate(t);

    output.write(header);

    geo.features.forEach(function(feature){
      output.write('<g><path d="'+path(feature)+'"/></g>');
    });

    output.write(footer);

  });

}