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

    var _ = require('underscore');

    var CardView = require('views/CardView');

    var fullHeight = window.innerHeight;


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
        'horse',
        'monkey',
        'mouse',
        'snake'
    ]

    var data = [

        {
            en: 'boat',
            ja: 'ふね',
            words: ['pig', 'door']
        },

        {
            en: 'cat',
            ja: 'ネコ',
            words: ['goat', 'snake']
        },

        {
            en: 'cow',
            ja: 'うし',
            words: ['monkey', 'fire']
        },

        {
            en: 'fire',
            ja: 'かじ',
            words: ['cow', 'cat']
        },

        {
            en: 'horse',
            ja: 'うま',
            words: ['boat', 'snake']
        },

        {
            en: 'monkey',
            ja: 'さる',
            words: ['mouse', 'cat']
        },

        {
            en: 'mouse',
            ja: 'ねずみ',
            words: ['goat', 'horse']
        },

        {
            en: 'snake',
            ja: 'へび',
            words: ['pig', 'cat']
        },

    ]

    var cols = [
            '#F7977A',
            '#F9AD81',
            '#FDC68A',
            '#FFF79A',
            '#C4DF9B',
            '#A2D39C',
            '#82CA9D',
            '#7BCDC8',
            '#6ECFF6',
            '#7EA7D8',
            '#8493CA',
            '#8882BE',
            '#A187BE',
            '#BC8DBF',
            '#F49AC2',
            '#F6989D'
            ];

    var cards = [];
    for (var i=0; i<data.length; i++) {
        var item = data[i];
        var col = cols[i];
        var card = new CardView({
            idx: i,
            col: _.sample(cols), 
            view: scrollview,
            data: item,
            imgUrl: 'content/images/' + item.en + '.png',
            // words: ['one', 'two', 'three']
        })
        // card.pipe()

        card.pipe(scrollview);
        cards.push(card);
    }

    scrollview.on('pageChange', function() {
        // debugger;
    })
    scrollview.sequenceFrom(cards);

    mainContext.add(scrollview);

});
