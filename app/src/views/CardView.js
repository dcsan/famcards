/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    /*
     * @name CardView
     * @constructor
     * @description
     */

    // function _createBackground() {
    //     var background = new Surface({
    //         properties: {
    //             backgroundColor: '#FFFFF5',
    //             boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)'
    //         }
    //     });

    //     this.mainNode.add(background);
    // }


    // function _createMainText(obj) {
    //     var txt = new Surface({
    //         content: this.obj.txt
    //     })
    // }

    function addImage(base, obj) {
        var mod = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            // transform: Transform.translate( word.x, word.y, word.z)
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

    function addTextNode(base, obj, word) {

        var mod = new StateModifier({
            origin: [0, 0],
            align: [0, 0.2],
            transform: Transform.translate( word.x, word.y, word.z)
        });

        var node = new Surface({
            content: word.txt,
            pointerEvents: 'none',       // so we dont have to pipe in the surface
            size: [true, true],
            classes: ['bigWord']
        })

        obj.mod = mod;
        base.add(mod).add(node);
        node.pipe(obj.view);
    }

    function addOptions(base, obj) {

        for(var i=0; i<obj.words.length; i++) {
            word = {
                txt: obj.words[i],
                x: 10,
                y: 100*i,
                z: 0
            }
            addTextNode(base, obj, word)
        }
    }

    function CardView(obj) {
        View.apply(this, arguments);

        // this.rootModifier = new StateModifier({
        //     size: [200, 200]
        // });
        // this.mainNode = this.add(this.rootModifier);

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


        surf.pipe(obj.view);  // surface gets events, send them to parent view to scroll with
        this.add(surf);
    }

    CardView.prototype = Object.create(View.prototype);
    CardView.prototype.constructor = CardView;

    CardView.DEFAULT_OPTIONS = {};

    module.exports = CardView;

});
