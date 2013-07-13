// Generated by CoffeeScript 1.6.3
(function() {
  var AppError, Forums, conf, controller, models, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  conf = require('../../../conf');

  models = require('../../../models');

  utils = require('../../../common/utils');

  AppError = require('../../../common/apperror').AppError;

  controller = require('../controller');

  Forums = (function(_super) {
    __extends(Forums, _super);

    function Forums() {
      this.index = __bind(this.index, this);
    }

    Forums.prototype.index = function(req, res, next) {
      var _this = this;
      return this.attachUser(arguments, function() {
        return res.render('forums/index.hbs', {
          pageName: 'welcome-page',
          coverPage: true,
          coverPicture: 'http://farm6.staticflickr.com/5470/9042287118_29dbe2a92b_h.jpg'
        });
      });
    };

    return Forums;

  })(controller.Controller);

  exports.Forums = Forums;

}).call(this);
