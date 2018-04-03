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
        [kb.order.go,  kb.back ]
    ]
  
    
}