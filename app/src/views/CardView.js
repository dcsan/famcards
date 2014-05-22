/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');

    var RenderNode = require('famous/core/RenderNode');

    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var Transitionable = require('famous/transitions/Transitionable');

    var ImageSurface = require('famous/surfaces/ImageSurface');

    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync   = require("famous/inputs/MouseSync");
    var TouchSync   = require("famous/inputs/TouchSync");
    var ScrollSync   = require("famous/inputs/ScrollSync");

    // register sync classes globally for later use in GenericSync
    GenericSync.register({
        "mouse" : MouseSync,
        "touch" : TouchSync,
        "scrollsync": ScrollSync
    });



    /*
     * @name CardView
     * @constructor
     * @description
     */

    function addImage(base, obj) {
        var mod = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.2],
            transform: Transform.translate( 0, 0, 0)
        });

        var node = new ImageSurface({
            content: obj.imgUrl,
            size: [true, true],
            classes: ['bigPic'],
            properties: {
                pointerEvents: 'none',       // so we dont have to pipe in the surface
            }
        })
        base.add(mod).add(node);
        // node.pipe(obj.view);
    }

    function addSlices(base, obj) {

        var SCREENWIDTH = window.innerWidth;
        obj.transitionable = new Transitionable(0);

        var SLICECOUNT = 3;
        var sliceMod = new Modifier(
            {
                transform: function(){
                    return Transform.translate(obj.transitionable.get(), 0, 0 )
                }
            }
        );
        var sliceNode = new RenderNode();

        var sliceBase = sliceNode.add(sliceMod);

        for(var i=0; i<SLICECOUNT; i++){
            var px = (i*50) + SCREENWIDTH/2;

            var mod = new StateModifier({
                origin: [0, 0],
                align: [0, 0],
                transform: Transform.translate( px, 0, 0)
            });

            var slice = new Surface({
                content: 'X',
                pointerEvents: 'none',       // so we dont have to pipe in the surface
                size: [true, true],
                classes: ['slice'],
                // transform: Transform.translate( px, 50, 0)
            });

            sliceBase.add(mod).add(slice);
            // sliceBase.add(mod).add(slice);
            // node.add(mod).add(slice);
            // node.add(slice);
        }

        base.add(sliceNode);
        obj.sliceMod = sliceMod;

    }


    function showResult(base, obj, mag) {

        if (mag.flag == 2) {
            scored = "RIGHT";
        } else {
            scored = "WRONG";
        }

        var mod = new StateModifier({
            origin: [0, 0],
            align: [0, 0.2],
            transform: Transform.translate( 0, 350, 0)
        });

        var surf = new Surface({
            content: scored,
            size: [true, true],
            classes: ['bigWord', scored]
        })

        console.log('res mag:', mag);
        base.add(mod).add(surf);

    }

    function addTextNode(base, obj, mag) {

        var mod = new StateModifier({
            origin: [0, 0],
            align: [0, 0.2],
            transform: Transform.translate( mag.x, mag.y, mag.z)
        });

        var surf = new Surface({
            content: mag.txt,
            // pointerEvents: 'none',       // so we dont have to pipe in the surface
            size: [true, true],
            classes: ['bigWord']
        })

        surf.on('click', function() {
            console.log('picked')
            surf.setProperties({
                backgroundColor: '#878785'
            });
            showResult(base, obj, mag);
            setTimeout(function() {
                obj.view.goToNextPage()
            }, 500);
            
        });

        obj.mod = mod;
        base.add(mod).add(surf);
        // surf.pipe(obj.view);
    }

    function addOptions(base, obj) {
        var TOPMARGIN = 100;    // offset text
        var words = obj.data.words;
        words.push(obj.data.en);

        var mags = _.map(words, function(word, ctr) {
            return {
                txt: word, 
                flag: ctr
            }
            // console.log(word, ctr);
        });

        mags = _.shuffle(mags);
        // console.log(mags);

        for(var i=0; i<mags.length; i++) {
            mag = mags[i]
            mag.x = 10;
            mag.y = (80*i) + TOPMARGIN;
            mag.z = 0;
            addTextNode(base, obj, mag);
        }
    }

    // funnel both mouse and touch input into a GenericSync
    // and only read from the x-displacement
    // function addSync(base, obj) {
    //     var sync = new GenericSync(
    //         ["mouse", "touch"],
    //         {direction : GenericSync.DIRECTION_X}
    //     );
    // }

    function CardView(obj) {
        View.apply(this, arguments);

        // funnel both mouse and touch input into a GenericSync
        // and only read from the x-displacement
        this.sync = new GenericSync(
            ["mouse", "touch", 'scrollsync'],
            {direction : GenericSync.DIRECTION_X}
        );

        surf = new Surface({
             content: 'card:' + obj.idx,
             classes: ['cardNum'],
             size: [undefined, undefined],
             properties: {
                 backgroundColor: obj.col,
                 lineHeight: '200px',
                 textAlign: 'center'
             }
        });
        
        addImage(this, obj);
        addOptions(this, obj);
        addSlices(this, obj);

        surf.pipe(this.sync);

        this.sync.on('update', moverFunc.bind(this) );
        this.obj = obj;

        surf.pipe(this._eventInput);
        this._eventInput.pipe(this._eventOutput);
        // this._eventInput.on('touchmove', moverFunc )

        this.add(surf);
    }

    function moverFunc(data) {
        // console.log('moverFunc', data, this);
        // console.log(data);
        // this.obj.transitionable.set(data.delta[0]);
        var PLAX = 0.5;
        this.obj.transitionable.set(data.position * PLAX);

        // this.obj.transitionable.set(100, {
        //     duration: 2000,
        //     curve: 'easeInOut'
        // });
        // console.log(this.obj.sliceMod.transform);
        // this.obj.sliceMod.setTransform(
        //     Transform.translate( px, 0, 0)
        // )
        // transform: Transform.translate( px, 0, 0)
        // console.log("moverFunc", obj.clientX);
    }

    CardView.prototype = Object.create(View.prototype);
    CardView.prototype.constructor = CardView;

    CardView.DEFAULT_OPTIONS = {};

    module.exports = CardView;

});
