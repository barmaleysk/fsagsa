const kb = require('./keyboard_buttons')

module.exports = {
    menu:
    [
        [kb.menu.kroll, kb.menu.aroll],
        //[ kb.menu.maki, kb.menu.set ],
        [ kb.menu.set, kb.menu.maki],
        [kb.menu.all, kb.menu.order],
        [ kb.back]
        //[kb.back]
    ],

    home:
        [
            [kb.home.mn],
            [kb.home.geo]
        ],
    order:
    [
        [kb.order.go, kb.order.reset,  kb.back ]
    ],

    nomm:
        [
            [kb.nom.one, kb.nom.two,kb.nom.three],
            [kb.nom.four, kb.nom.five,kb.nom.six],
            [kb.nom.seven, kb.nom.eight,kb.nom.nine],
            [kb.nom.plus, kb.nom.zero]
        ],

    orderB:[
            [  kb.back ]
        ],
  
    
}