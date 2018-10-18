"use strict";
define(function (require) {

    const Typo = ((Typo = require('./typo')) => new Typo())();

    const WeirdText = (options = {}, callback = null) => {
        let Instance = require('./weird.txt');
        Instance = new Instance();
        return Typo.isntEmpty(options) ? Instance.initialize(options, callback) : Instance;
    };

    WeirdText({
        el: '.application',
        in: '.control-input',
        out: '.control-output'
    }, app => {
        console.log(app);
    });

});