/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    /*
     * @name CardView
     * @constructor
     * @description
     */

    function CardView(obj) {
        View.apply(this, arguments);

        surf = new Surface({
             content: 'Surface: ',
             size: [undefined, undefined],
             properties: {
                 backgroundColor: obj.col,
                 lineHeight: '200px',
                 textAlign: 'center'
             }
        });
        surf.pipe(obj.view);  // surface gets events, send them to parent view to scroll with
        this.add(surf);
    }

    CardView.prototype = Object.create(View.prototype);
    CardView.prototype.constructor = CardView;

    CardView.DEFAULT_OPTIONS = {};

    module.exports = CardView;

});
