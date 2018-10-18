"use strict";

function Typo() {}

Typo.prototype.typeOf = function (object = null) {
    return Object.prototype.toString
        .call(object)
        .replace(/^\[object (.+)\]$/, '$1')
        .toLowerCase();
};

Typo.prototype.typify = function (object = null) {
    return Object.freeze({
        type: this.typeOf(object),
        object: object
    });
};

Typo.prototype.typeOf = function (object = null) {
    return Object.prototype.toString
        .call(object)
        .replace(/^\[object (.+)\]$/, '$1')
        .toLowerCase();
};

Typo.prototype.typify = function (object = null) {
    return Object.freeze({
        type: this.typeOf(object),
        object: object
    });
};

Typo.prototype.isDef = function (object = null, fnTrue = null, fnFalse = null, fnAfter = null) {
    let condition = !/null|undefined/.test(this.typeOf(object)) || (this.typeOf(object) === "number" && !isNaN(object));
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isntDef = function(object = null, fnTrue = null, fnFalse = null, fnAfter = null){
    let condition = !this.isDef(object);
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isFn = function (object = null, fnTrue = null, fnFalse = null, fnAfter = null) {
    let condition = /function/.test(this.typeOf(object));
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isString = function(object = null, fnTrue = null, fnFalse = null, fnAfter = null){
    let condition = typeof object === "string" || object instanceof String;
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isNumber = function(object = null, fnTrue = null, fnFalse = null, fnAfter = null){
    let condition = this.typeOf(object) === "number" && !isNaN(object) && isFinite(object);
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isFloat = function(object = null, fnTrue = null, fnFalse = null, fnAfter = null){
    let condition = this.isNumber(object) && /[.]/.test(`${object}`);
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isInteger = function(object = null, fnTrue = null, fnFalse = null, fnAfter = null){
    let condition = this.isNumber(object) && !/[.]/.test(`${object}`);
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isHEX = function(object = null, fnTrue = null, fnFalse = null, fnAfter = null){
    object = object.replace(/[#]|[0x]/g, '');
    let condition = parseInt(object, 16).toString(16) === object;
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isElement = function(object = null, fnTrue = null, fnFalse = null, fnAfter = null){
    let condition;
    try {
        if(typeof object === "string") object = document.querySelector(object);
        condition = /^(html)+(.)+(element)$|htmlelement|^(svg)+(.)+(element)$/gm.test(this.typeOf(object));
        return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
    } catch(err){
        condition = false;
        return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
    }
};

Typo.prototype.isEmpty = function (object = null, fnTrue = null, fnFalse = null, fnAfter = null) {
    let type = this.typeOf(object),
        condition = false;
    if(!this.isDef(object)) return true;
    if(type === "string" && object === ""){
        condition = true;
    }
    if(/array|htmlcollection|nodelist/.test(type) && object.length === 0){
        condition = true;
    }
    if(/set|map/.test(type) && !object.size){
        condition = true;
    }
    if(type === "object" && !Object.keys(object).length){
        condition = true;
    }
    if(this.isElement(object) && (!object.children.length && !object.childNodes.length)){
        condition = true;
    }
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isntEmpty = function (object = null, fnTrue = null, fnFalse = null, fnAfter = null) {
    let condition = !this.isEmpty(object);
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isChar = function (object = null, fnTrue = null, fnFalse = null, fnAfter = null) {
    let condition = this.typeOf(object) === "string" && object.length === 1;
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isURL = function (object = null, fnTrue = null, fnFalse = null, fnAfter = null) {
    let condition = this.typeOf(object) === "string" && /(https?:\/\/[^\s]+)/g.test(object);
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isURI = function (object = null, fnTrue = null, fnFalse = null, fnAfter = null) {
    let condition = this.isURL(object) && /([.]+(avi|mp4|ogg|wav|mp3|svg|jpg|jpeg|png|gif|webm|webp|json)$)/.test(object);
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isTouch = function(ctx = null, fnTrue = null, fnFalse = null, fnAfter = null){
    if(this.isDef(window)) ctx = window;
    if(this.isntDef(ctx)) return false;
    let condition = 'ontouchstart' in ctx || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isFacebookBrowser = function(ctx = null, fnTrue = null, fnFalse = null, fnAfter = null){
    if(this.isDef(navigator)) ctx = navigator;
    if(this.isntDef(ctx)) return false;
    let userAgent = navigator.userAgent
        || navigator.vendor
        || window.opera,
        condition = /FBAN|FBAV/.test(userAgent);
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype.isTypeChain = function(collection = [], typeChain = [], fnTrue = null, fnFalse = null, fnAfter = null){
    let condition = true;
    let typeOfCollection = this.typeOf(collection);

    if(typeOfCollection === "object") collection = Object.values(collection);

    if(typeOfCollection === "set") collection = [...collection];

    if(collection.length !== typeChain.length || /number|string|boolean|null|undefined/.test(typeOfCollection)) {
        condition = false;
    } else {
        for(let i = 0; i < typeChain.length; i++){
            let chain = typeChain[i];
            (chain === "undefined") && (chain = "null");
            if(this.typeOf(collection[i]) !== chain){
                condition = false;
                break;
            }
        }
    }
    return this._pipe({ condition, fnTrue, fnFalse, fnAfter });
};

Typo.prototype._pipe = function (options = {}) {
    const {condition, fnTrue, fnFalse, fnAfter } = options;
    this._eventually(condition, fnTrue, fnFalse, fnAfter);
    return condition;
};

Typo.prototype._eventually = function (condition, fnA, fnB, fnC) {
    (condition === true) ? ((typeof fnA === "function") && fnA()) : ((typeof fnB === "function") && fnB());
    (typeof fnC === "function") && fnC(condition);
};

define(function () {
    return Typo;
});