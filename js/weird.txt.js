"use strict";
define(function (require) {

    const Typo = ((Typo = require('./typo')) => new Typo())();
    const Store = require('./store');
    const dataset = require('./dataset');

    function WeirdText(options = {}) {
        this.states = new Store({
            initialized: false,
            followed: false
        });

        this.data = new Store({
            textContent: ""
        });

        this.data.addReflect('textContent', text => {
            this.output(this.convertTextToWeird(text === "" ? "And see you result here" : text));
        });

        return Typo.isntEmpty(options) ? this.initialize(options) : this;
    }

    WeirdText.prototype.initialize = function(options = {}, callback = null){
        const {states} = this,
              condition = states.isnt('initialized')
                            && Typo.isntEmpty(options)
                            && this._isElements(options.el, options.in, options.out);
        if(condition){
            Object.assign(this, this._convertSelectorsToElements(options));
            this.follow();
            Typo.isFn(callback) && callback(this);
            states.initialized = true;
        }
        return this;
    };

    WeirdText.prototype.follow = function(){
        if(this.states.isnt('followed')){
            this.in.addEventListener('input', event => {
                const {target} = event;
                this.data.textContent = target.value;
            });
            this.states.followed = true;
        }
        return this;
    };

    WeirdText.prototype.convertTextToWeird = function(text){
        let splitedText = text.split(""),
            response = [];
        for(let symbol of splitedText){
            let replacerArray = dataset[symbol];
            if(Typo.isDef(replacerArray)){
                let randomIndex = Math.floor(Math.random() * replacerArray.length);
                response.push(replacerArray[randomIndex]);
            } else {
                response.push(symbol);
            }
        }
        response = response.join('');
        // let item, index;
        // for(let [key, value] of Object.entries(dataset)){
        //     item = dataset[key];
        //     index = Math.floor(Math.random() * item.length);
        //     text = text.replace(this._coin ? new RegExp(key, 'g') : new RegExp(key), item[index]);
        // }

        return response;
    };

    WeirdText.prototype.output = function(text){
        let {out} = this;
        out.innerText = text;
    };

    WeirdText.prototype._isElements = function(...els) {
        for(let el of els){
            if(!Typo.isElement(el)){
                return false;
            }
        }
        return true;
    };

    WeirdText.prototype._convertSelectorsToElements = function (options) {
        if(Typo.isntEmpty(options)){
            for(let [key, value] of Object.entries(options)){
                if(Typo.isElement(value) && Typo.isString(value)){
                    options[key] = document.querySelector(value);
                }
            }
            return options;
        } else {
            return {};
        }
    };
    WeirdText.prototype._coin = function () {
        return Math.random() > .5;
    };



    return WeirdText;

});