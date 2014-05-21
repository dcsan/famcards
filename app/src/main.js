/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');
    var Scrollview = require('famous/views/Scrollview');

    var fullHeight = window.innerHeight;

    var CardView = require('views/CardView');

    // create the main context
    var mainContext = Engine.createContext();
    var scrollview = new Scrollview({
        direction: 0,
        paginated: true
    });

    var pics = [
        'boat',
        'cat',
        'cow',
        'fire',
        'hen',
        'horse',
        'monkey',
        'mouse',
        'snake'
    ]

    var cards = [];
    var cols = ['red', 'green', 'blue'];
    for (var i=0; i<pics.length; i++) {
        var col = cols[i];
        var card = new CardView({
            idx: i,
            col: col, 
            view: scrollview,
            imgUrl: '/content/images/' + pics[i] + '.png',
            words: ['one', 'two', 'three']
        })
        cards.push(card)
    }

    scrollview.sequenceFrom(cards);

    mainContext.add(scrollview);

});
