// Generated by CoffeeScript 1.6.3
(function() {
  var Editable, Editor,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Editor = (function() {
    function Editor(options) {
      this.options = options;
      this.activateEditable = __bind(this.activateEditable, this);
      this.editable = __bind(this.editable, this);
      this.editables = [];
    }

    Editor.prototype.editable = function(selector, options) {
      var editable;
      editable = new Editable(selector, options, this);
      this.editables.push(editable);
      return editable;
    };

    Editor.prototype.activateEditable = function(editable) {
      var _ref;
      if (this.activeEditable !== editable) {
        if ((_ref = this.activeEditable) != null) {
          _ref.deactivate();
        }
      }
      return this.activeEditable = editable;
    };

    Editor.prototype.uniqueId = function(length) {
      var id;
      if (length == null) {
        length = 16;
      }
      id = "";
      while (id.length < length) {
        id += Math.random().toString(36).substr(2);
      }
      return id.substr(0, length);
    };

    return Editor;

  })();

  Editable = (function() {
    function Editable(selector, options, editor) {
      this.selector = selector;
      this.options = options;
      this.editor = editor;
      this.getValue = __bind(this.getValue, this);
      this.fixHtml = __bind(this.fixHtml, this);
      this.getNodeAtCaret = __bind(this.getNodeAtCaret, this);
      this.wrapHtml = __bind(this.wrapHtml, this);
      this.surroundSelectedText = __bind(this.surroundSelectedText, this);
      this.pasteHtmlAtCaret = __bind(this.pasteHtmlAtCaret, this);
      this.closeOptionsForm = __bind(this.closeOptionsForm, this);
      this.showLinkOptions = __bind(this.showLinkOptions, this);
      this.addImageOptions = __bind(this.addImageOptions, this);
      this.setImage = __bind(this.setImage, this);
      this.onImageSelect = __bind(this.onImageSelect, this);
      this.showUploadBox = __bind(this.showUploadBox, this);
      this.makeImagesEditable = __bind(this.makeImagesEditable, this);
      this.deactivate = __bind(this.deactivate, this);
      this.activate = __bind(this.activate, this);
      this.makeEditable = __bind(this.makeEditable, this);
      this.handleAction = __bind(this.handleAction, this);
      this.attachHandlers = __bind(this.attachHandlers, this);
    }

    Editable.prototype.attachHandlers = function() {
      var self,
        _this = this;
      self = this;
      $(document).on('mousedown', this.selector, function(e) {
        _this.clickArgs = e;
        return _this.closeOptionsForm();
      });
      $(document).on('focus', this.selector, this.activate);
      return $(document).on('click', "" + this.selector + " a", function(e) {
        return self.showLinkOptions(this);
      });
    };

    Editable.prototype.handleAction = function(what) {
      var e, link, markerUrl, uniqueId;
      switch (what) {
        case 'bold':
          return document.execCommand('bold', false, null);
        case 'italic':
          return document.execCommand('italic', false, null);
        case 'h2':
          return document.execCommand('formatBlock', false, "<h2>");
        case 'image':
          uniqueId = "bangjs-image-insert-" + (this.editor.uniqueId());
          this.pasteHtmlAtCaret("<div id=\"" + uniqueId + "\" class=\"bangjs-image-insert\"></div>");
          return this.showUploadBox("#" + uniqueId, this.options.imageOptions);
        case 'list':
          return this.pasteHtmlAtCaret("<ul><li>Item 1</li></ul>");
        case 'link':
          markerUrl = this.editor.uniqueId();
          document.execCommand('createLink', false, markerUrl);
          link = $("a[href=" + markerUrl + "]");
          link.attr("href", "");
          return this.showLinkOptions(link[0]);
        case 'quote':
          return this.wrapHtml("“", "”");
        case 'indent':
          return document.execCommand('formatBlock', false, 'blockquote');
        case 'unformat':
          e = this.getNodeAtCaret();
          return $(e).contents().parent('blockquote,h1,h2,h3').contents().unwrap();
      }
    };

    Editable.prototype.makeEditable = function() {
      switch (this.options.mode) {
        case 'text':
          $(this.selector).attr('contenteditable', 'true');
          break;
        case 'html':
          this.toolbar = new BangJS.Toolbar({
            items: "h2,bold,italic,image,link,list,quote,indent,unformat"
          }, this);
          $(this.selector).attr('contenteditable', 'true');
          this.fixHtml('load');
          this.makeImagesEditable();
          break;
        case 'image':
          this.makeImagesEditable();
      }
      $(this.selector).addClass('bangjs-editable');
      return this.attachHandlers();
    };

    Editable.prototype.activate = function(event) {
      this.editor.activateEditable(this);
      if (!this.isActive) {
        this.isActive = true;
        if (this.toolbar) {
          if (this.clickArgs) {
            if (this.options.position) {
              this.toolbar.setPosition(this.options.position(event));
            } else {
              this.toolbar.setPosition({
                left: this.clickArgs.pageX - $(window).scrollLeft() + 20,
                top: this.clickArgs.pageY - $(window).scrollTop() - 80
              });
            }
          } else {
            this.toolbar.setPosition({
              left: $(this.selector).position().left + 20,
              top: $(this.selector).position().top - 80
            });
          }
          this.toolbar.show();
        }
      }
      this.clickArgs = null;
      return true;
    };

    Editable.prototype.deactivate = function() {
      var _ref;
      this.isActive = false;
      return (_ref = this.toolbar) != null ? _ref.hide() : void 0;
    };

    Editable.prototype.makeImagesEditable = function() {
      var img, _base;
      img = $(this.selector).find('img');
      if (img.length) {
        img.wrap('<div class="image-container"></div>');
        return this.addImageOptions(this.options.imageOptions, $(this.selector).find('.image-container'));
      } else {
        return typeof (_base = this.options.imageOptions).onEmpty === "function" ? _base.onEmpty() : void 0;
      }
    };

    Editable.prototype.showUploadBox = function(selector, options) {
      var element,
        _this = this;
      if (options.name == null) {
        options.name = "bangjs-image-editable-" + this.editor.uniqueId();
      }
      element = $(selector);
      if (options.title == null) {
        options.title = 'Upload a picture';
      }
      element.html("        <div class=\"" + options.name + " image-upload-box\" contenteditable=\"false\">            <form name=\"form\" method=\"POST\" target=\"" + options.name + "-frame\" enctype=\"multipart/form-data\" >                <p>                    " + options.title + ": <br />                    <input type=\"file\" class=\"file-input\" name=\"file\" />                </p>                <p>                    <i class=\"icon-remove\"></i>                </p>                <iframe id=\"" + options.name + "-frame\" name=\"" + options.name + "-frame\" src=\"\" style=\"display:none;height:0;width:0\"></iframe>            </form>        </div>");
      element.find('i.icon-remove').click(function() {
        if (options.onEmpty) {
          return options.onEmpty();
        } else {
          return element.remove();
        }
      });
      return $(document).bindNew('change', "." + options.name + " .file-input", function() {
        return _this.onImageSelect(options);
      });
    };

    Editable.prototype.onImageSelect = function(options) {
      var form, frame,
        _this = this;
      form = $("." + options.name + " form");
      form.attr('action', options.uploadUrl);
      frame = $("#" + options.name + "-frame");
      frame.bindNew('load', function() {
        var image, thumbnail;
        image = JSON.parse($(frame[0].contentWindow.document).text()).image;
        thumbnail = options.createThumbnail ? JSON.parse($(frame[0].contentWindow.document).text()).thumbnail : void 0;
        return _this.setImage(options, image, thumbnail);
      });
      return form.submit();
    };

    Editable.prototype.setImage = function(options, imageUrl, thumbnailUrl) {
      var imageBox;
      imageBox = $('<div class="image-container"></div>');
      imageBox.html("<img src=\"" + imageUrl + "\" data-filter=\"none\" data-src=\"" + imageUrl + "\" data-thumbnail-src=\"" + thumbnailUrl + "\" class=\"picture\" />");
      $("." + options.name).replaceWith(imageBox);
      return this.addImageOptions(options, imageBox);
    };

    Editable.prototype.addImageOptions = function(options, imageBox) {
      var _this = this;
      if (this.options.mode === 'image') {
        imageBox.append("                <div class=\"bg bangjs-option\"></div>                <div class=\"picture-options bangjs-option\">                    <p class=\"buttons\">                        <a href=\"#\" class=\"add-title\">Add caption</a><span class=\"gray\"> | </span><a href=\"#\" class=\"remove\">Remove</a>                    </p>                </div>");
        return imageBox.find('a.remove').click(function() {
          if (options.onEmpty) {
            options.onEmpty();
          } else {
            imageBox.remove();
          }
          return false;
        });
      }
    };

    Editable.prototype.showLinkOptions = function(link) {
      var options,
        _this = this;
      link = $(link);
      this.closeOptionsForm();
      options = $("<div class=\"bangjs-options-form\" style=\"display:none\">                        <p>                            <input class=\"url\" placeholder=\"http://www.example.com\" type=\"text\" style=\"width:300px;\" /> or <a class=\"clear\" href=\"#\">clear</a>.                        </p>                    </div>");
      $('body').append(options);
      options.css({
        left: "" + (link.position().left) + "px",
        top: "" + (link.position().top - 40) + "px"
      });
      options.show();
      if (link.attr('href')) {
        $('.bangjs-options-form input.url').val(link.attr('href'));
      }
      $('.bangjs-options-form input.url').focus();
      options[0].onClose = function() {
        if ($('.bangjs-options-form input.url').val()) {
          return link.attr('href', $('.bangjs-options-form input.url').val());
        } else {
          return link.contents().unwrap();
        }
      };
      $(document).off('click', '.bangjs-options-form a.clear');
      $(document).on('click', '.bangjs-options-form a.clear', function() {
        link.contents().unwrap();
        _this.closeOptionsForm(false);
        return false;
      });
      $(document).off('keypress', '.bangjs-options-form input.url');
      $(document).on('keypress', '.bangjs-options-form input.url', function(e) {
        if (e.which === 13) {
          if ($('.bangjs-options-form input.url').val()) {
            link.attr('href', $('.bangjs-options-form input.url').val());
          } else {
            link.contents().unwrap();
          }
          return _this.closeOptionsForm(false);
        }
      });
      return false;
    };

    Editable.prototype.closeOptionsForm = function(fireClose) {
      var form, _base;
      if (fireClose == null) {
        fireClose = true;
      }
      form = $('.bangjs-options-form');
      if (form.length) {
        if (fireClose) {
          if (typeof (_base = form[0]).onClose === "function") {
            _base.onClose();
          }
        }
        return form.remove();
      }
    };

    Editable.prototype.pasteHtmlAtCaret = function(html) {
      var el, frag, lastNode, node, range, sel;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          el = document.createElement("div");
          el.innerHTML = html;
          frag = document.createDocumentFragment();
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            return sel.addRange(range);
          }
        }
      } else if (document.selection && document.selection.type !== "Control") {
        return document.selection.createRange().pasteHTML(html);
      }
    };

    Editable.prototype.surroundSelectedText = function(element) {
      var range, sel, selRange;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          element.appendChild(document.createTextNode(range.toString()));
          range.deleteContents();
          range.insertNode(element);
          range = range.cloneRange();
          range.setStartAfter(element);
          range.collapse(true);
          sel.removeAllRanges();
          return sel.addRange(range);
        } else if (document.selection && document.selection.type !== "Control") {
          selRange = document.selection.createRange();
          element.appendChild(document.createTextNode(selRange.text));
          return selRange.pasteHTML(element.outerHTML);
        }
      }
    };

    Editable.prototype.wrapHtml = function(leftInsert, rightInsert) {
      var range, sel, selectedText;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
          range = sel.getRangeAt(0);
          selectedText = range.toString();
          range.deleteContents();
          return range.insertNode(document.createTextNode(leftInsert + selectedText + rightInsert));
        }
      } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        selectedText = document.selection.createRange().text + "";
        return range.text = leftInsert + selectedText + rightInsert;
      }
    };

    Editable.prototype.getNodeAtCaret = function() {
      var node;
      node = document.getSelection().anchorNode;
      if (node.nodeType === 3) {
        return node.parentNode;
      } else {
        return node;
      }
    };

    Editable.prototype.fixHtml = function(event) {
      if (this.options.mode === 'html') {
        if (event === 'save') {
          $('.bangjs-option').remove();
          $('h1,h2,h3').each(function() {
            return $('<br />').insertAfter($(this));
          });
          $('blockquote').each(function() {
            return $('<br /><br />').insertAfter($(this));
          });
        }
        $('.post-content p').each(function() {
          var container, contents;
          container = $('<div></div>');
          contents = $(this).contents();
          container.append(contents);
          container.append('<br />');
          return $(this).replaceWith(container);
        });
        return $('.post-content div').each(function() {
          var contents, last;
          contents = $(this).contents();
          last = contents.last();
          $(this).replaceWith(contents);
          return $('<br />').insertAfter(last);
        });
      }
    };

    Editable.prototype.getValue = function(format) {
      switch (format) {
        case 'markdown':
          this.fixHtml('save');
          return new reMarked().render($(this.selector)[0]);
        case 'text':
          return $(this.selector).text();
      }
    };

    return Editable;

  })();

  window.BangJS = {
    Editor: Editor
  };

}).call(this);
