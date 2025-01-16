
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var pug = (function(exports) {

  var pug_has_own_property = Object.prototype.hasOwnProperty;

  /**
   * Merge two attribute objects giving precedence
   * to values in object `b`. Classes are special-cased
   * allowing for arrays and merging/joining appropriately
   * resulting in a string.
   *
   * @param {Object} a
   * @param {Object} b
   * @return {Object} a
   * @api private
   */

  exports.merge = pug_merge;
  function pug_merge(a, b) {
    if (arguments.length === 1) {
      var attrs = a[0];
      for (var i = 1; i < a.length; i++) {
        attrs = pug_merge(attrs, a[i]);
      }
      return attrs;
    }

    for (var key in b) {
      if (key === 'class') {
        var valA = a[key] || [];
        a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
      } else if (key === 'style') {
        var valA = pug_style(a[key]);
        valA = valA && valA[valA.length - 1] !== ';' ? valA + ';' : valA;
        var valB = pug_style(b[key]);
        valB = valB && valB[valB.length - 1] !== ';' ? valB + ';' : valB;
        a[key] = valA + valB;
      } else {
        a[key] = b[key];
      }
    }

    return a;
  }
  /**
   * Process array, object, or string as a string of classes delimited by a space.
   *
   * If `val` is an array, all members of it and its subarrays are counted as
   * classes. If `escaping` is an array, then whether or not the item in `val` is
   * escaped depends on the corresponding item in `escaping`. If `escaping` is
   * not an array, no escaping is done.
   *
   * If `val` is an object, all the keys whose value is truthy are counted as
   * classes. No escaping is done.
   *
   * If `val` is a string, it is counted as a class. No escaping is done.
   *
   * @param {(Array.<string>|Object.<string, boolean>|string)} val
   * @param {?Array.<string>} escaping
   * @return {String}
   */
  exports.classes = pug_classes;
  function pug_classes_array(val, escaping) {
    var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
    for (var i = 0; i < val.length; i++) {
      className = pug_classes(val[i]);
      if (!className) continue;
      escapeEnabled && escaping[i] && (className = pug_escape(className));
      classString = classString + padding + className;
      padding = ' ';
    }
    return classString;
  }
  function pug_classes_object(val) {
    var classString = '', padding = '';
    for (var key in val) {
      if (key && val[key] && pug_has_own_property.call(val, key)) {
        classString = classString + padding + key;
        padding = ' ';
      }
    }
    return classString;
  }
  function pug_classes(val, escaping) {
    if (Array.isArray(val)) {
      return pug_classes_array(val, escaping);
    } else if (val && typeof val === 'object') {
      return pug_classes_object(val);
    } else {
      return val || '';
    }
  }

  /**
   * Convert object or string to a string of CSS styles delimited by a semicolon.
   *
   * @param {(Object.<string, string>|string)} val
   * @return {String}
   */

  exports.style = pug_style;
  function pug_style(val) {
    if (!val) return '';
    if (typeof val === 'object') {
      var out = '';
      for (var style in val) {
        /* istanbul ignore else */
        if (pug_has_own_property.call(val, style)) {
          out = out + style + ':' + val[style] + ';';
        }
      }
      return out;
    } else {
      return val + '';
    }
  }
  /**
   * Render the given attribute.
   *
   * @param {String} key
   * @param {String} val
   * @param {Boolean} escaped
   * @param {Boolean} terse
   * @return {String}
   */
  exports.attr = pug_attr;
  function pug_attr(key, val, escaped, terse) {
    if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
      return '';
    }
    if (val === true) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    }
    var type = typeof val;
    if ((type === 'object' || type === 'function') && typeof val.toJSON === 'function') {
      val = val.toJSON();
    }
    if (typeof val !== 'string') {
      val = JSON.stringify(val);
      if (!escaped && val.indexOf('"') !== -1) {
        return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
      }
    }
    if (escaped) val = pug_escape(val);
    return ' ' + key + '="' + val + '"';
  }
  /**
   * Render the given attributes object.
   *
   * @param {Object} obj
   * @param {Object} terse whether to use HTML5 terse boolean attributes
   * @return {String}
   */
  exports.attrs = pug_attrs;
  function pug_attrs(obj, terse){
    var attrs = '';

    for (var key in obj) {
      if (pug_has_own_property.call(obj, key)) {
        var val = obj[key];

        if ('class' === key) {
          val = pug_classes(val);
          attrs = pug_attr(key, val, false, terse) + attrs;
          continue;
        }
        if ('style' === key) {
          val = pug_style(val);
        }
        attrs += pug_attr(key, val, false, terse);
      }
    }

    return attrs;
  }
  /**
   * Escape the given string of `html`.
   *
   * @param {String} html
   * @return {String}
   * @api private
   */

  var pug_match_html = /["&<>]/;
  exports.escape = pug_escape;
  function pug_escape(_html){
    var html = '' + _html;
    var regexResult = pug_match_html.exec(html);
    if (!regexResult) return _html;

    var result = '';
    var i, lastIndex, escape;
    for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
      switch (html.charCodeAt(i)) {
        case 34: escape = '&quot;'; break;
        case 38: escape = '&amp;'; break;
        case 60: escape = '&lt;'; break;
        case 62: escape = '&gt;'; break;
        default: continue;
      }
      if (lastIndex !== i) result += html.substring(lastIndex, i);
      lastIndex = i + 1;
      result += escape;
    }
    if (lastIndex !== i) return result + html.substring(lastIndex, i);
    else return result;
  }
  /**
   * Re-throw the given `err` in context to the
   * the pug in `filename` at the given `lineno`.
   *
   * @param {Error} err
   * @param {String} filename
   * @param {String} lineno
   * @param {String} str original source
   * @api private
   */

  exports.rethrow = pug_rethrow;
  function pug_rethrow(err, filename, lineno, str){
    if (!(err instanceof Error)) throw err;
    if ((typeof window != 'undefined' || !filename) && !str) {
      err.message += ' on line ' + lineno;
      throw err;
    }
    try {
      str = str || require('fs').readFileSync(filename, 'utf8');
    } catch (ex) {
      pug_rethrow(err, null, lineno);
    }
    var context = 3
      , lines = str.split('\n')
      , start = Math.max(lineno - context, 0)
      , end = Math.min(lines.length, lineno + context);

    // Error context
    var context = lines.slice(start, end).map(function(line, i){
      var curr = i + start + 1;
      return (curr == lineno ? '  > ' : '    ')
        + curr
        + '| '
        + line;
    }).join('\n');

    // Alter exception message
    err.path = filename;
    err.message = (filename || 'Pug') + ':' + lineno
      + '\n' + context + '\n\n' + err.message;
    throw err;
  }
  return exports
})({});

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
pug_mixins["button"] = pug_interp = function(buttonClass, buttonText){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cbutton" + (pug.attr("class", pug.classes([buttonClass], [true]), false, true)) + "\u003E";
pug_html = pug_html + " ";
pug_html = pug_html + (pug.escape(null == (pug_interp = buttonText) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
};
pug_html = pug_html + "\u003Cdiv class=\"modal js-modal\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"modal-blur\"\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"modal-content\"\u003E";
pug_html = pug_html + "\u003Cimg class=\"modal-content__close js-close-modal\" src=\"\u002Ficons\u002Fclose.svg\" alt=\"close\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"modal-content__title\"\u003E";
pug_html = pug_html + "Овладей нейросетями!\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"modal-content__subtitle\"\u003E";
pug_html = pug_html + "Получи в подарок доступ ко всем курсам\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cimg class=\"modal-content__present\" src=\"\u002Fimages\u002Fdialog.png\" alt=\"dialog\"\u003E";
pug_html = pug_html + "\u003Cinput class=\"input modal-content__input\" type=\"text\" placeholder=\"Введите e-mail\"\u003E";
pug_mixins["button"]('button button--primary modal-content__button', 'Личный кабинет');
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"layout\"\u003E";
pug_mixins["button"] = pug_interp = function(buttonClass, buttonText){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cbutton" + (pug.attr("class", pug.classes([buttonClass], [true]), false, true)) + "\u003E";
pug_html = pug_html + " ";
pug_html = pug_html + (pug.escape(null == (pug_interp = buttonText) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
};
pug_html = pug_html + "\u003Cheader class=\"header\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"header__logo header-logo\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"header-logo__icon\"\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"header-logo__text\"\u003E";
pug_html = pug_html + "AI\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"header__rs\"\u003E";
pug_html = pug_html + "\u003Cul class=\"header__list header-list\"\u003E";
pug_html = pug_html + "\u003Cli class=\"header-list__item\"\u003E";
pug_html = pug_html + "\u003Ca class=\"header-list-item__link\" href=\"#\"\u003E";
pug_html = pug_html + "Главная\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
pug_html = pug_html + "\u003Cli class=\"header-list__item header-list-item\"\u003E";
pug_html = pug_html + "\u003Ca class=\"header-list-item__link\" href=\"#\"\u003E";
pug_html = pug_html + "Преимущества\u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003C\u002Ful\u003E";
pug_mixins["button"]('button button--secondary', 'Личный кабинет');
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cimg class=\"header__burger-icon\" src=\"\u002Ficons\u002Fburger.svg\" alt=\"bigmak\"\u003E";
pug_html = pug_html + "\u003Cimg class=\"closebtn\" src=\"\u002Ficons\u002Fclose.svg\" alt=\"close\"\u003E\u003C\u002Fheader\u003E";
pug_mixins["button"] = pug_interp = function(buttonClass, buttonText){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cbutton" + (pug.attr("class", pug.classes([buttonClass], [true]), false, true)) + "\u003E";
pug_html = pug_html + " ";
pug_html = pug_html + (pug.escape(null == (pug_interp = buttonText) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
};
pug_html = pug_html + "\u003Csection class=\"main-content\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"main-content__ls main-content-ls\"\u003E";
pug_html = pug_html + "\u003Ch1 class=\"main-content-ls__title-h1\"\u003E";
pug_html = pug_html + "Нейросеть\u003C\u002Fh1\u003E";
pug_html = pug_html + "\u003Ch2 class=\"main-content-ls__title-h2\"\u003E";
pug_html = pug_html + "может все!\u003C\u002Fh2\u003E";
pug_html = pug_html + "\u003Cdiv class=\"main-content-ls__subtitle\"\u003E";
pug_html = pug_html + "Мы уже живем в этой удивительной реальности\u003C\u002Fdiv\u003E";
pug_mixins["button"]('button button--primary js-open-modal', 'Погрузиться в новый мир');
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"main-content__rs main-content-rs\"\u003E";
pug_html = pug_html + "\u003Cimg src=\"\u002Fimages\u002Fmain.png\" alt=\"main\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";
pug_mixins["widget"] = pug_interp = function(image, title, text){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"widget\"\u003E";
pug_html = pug_html + "\u003Cimg" + (" class=\"widget__image\""+pug.attr("src", image, true, true)+pug.attr("alt", image, true, true)) + "\u003E";
pug_html = pug_html + "\u003Ch3 class=\"widget__title\"\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = title) ? "" : pug_interp)) + "\u003C\u002Fh3\u003E";
pug_html = pug_html + "\u003Cdiv class=\"widget__text\"\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
pug_html = pug_html + "\u003Cdiv class=\"text-subscription\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"text-subscription__title\"\u003E";
pug_html = pug_html + "Преимущества курса";
pug_html = pug_html + "\u003Cdiv class=\"text-subscription__content\"\u003E";
pug_html = pug_html + "Поможем создать ";
pug_html = pug_html + "\u003Cspan class=\"text-subscription__content--color\"\u003E";
pug_html = pug_html + "Корректный промт\u003C\u002Fspan\u003E";
pug_html = pug_html + ", чтобы вы получили максимально корректный вариант под ваши нужды!\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Csection class=\"advantages\"\u003E";
pug_mixins["widget"]("/icons/goal.svg", "Хотите открыть бизнес?", "Нейросеть поможет составить бизнес-план, рассчитать расходы, нарисовать логотип, найти место получше и станет вашим главным деловым партнером");
pug_mixins["widget"]("/icons/suitcase.svg", "Мечтаете об отпуске?", "Нейросеть поможет найти место по вашим запросам, выбрать наилучший сезон, собрать чемодан, подыскать где остановиться и сделать ваш отпуск незабываемым");
pug_mixins["widget"]("/icons/checklist.svg", "Вы студент и нуждаетесь в помощи в учебе?", "Нет проблем! Нейросеть — ваш лучший друг, который поможет написать курсовую, решить сложный тест и подготовиться к экзаменам");
pug_mixins["widget"]("/icons/mental.svg", "Интересует здоровый образ жизни?", "Нейросеть поделится советами по сбалансированному питанию, безопасным тренировкам и поддержке мотивации.");
pug_html = pug_html + "\u003C\u002Fsection\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.js-modal');
  const header = document.querySelector('.header');
  const burgerIcon = document.querySelector('.header__burger-icon');
  const closeButton = document.querySelector('.closebtn');
  
  const toggleClass = (element, className, action) => {
    element.classList[action](className);
  };

  document.addEventListener('click', (e) => {
    if (e.target.matches('.js-open-modal')) toggleClass(modal, 'active', 'add');
    if (e.target.matches('.js-close-modal') || e.target === modal) toggleClass(modal, 'active', 'remove');
    
    if (e.target.matches('.header__burger-icon')) {
      toggleClass(header, 'active-mobile', 'add');
      burgerIcon.style.display = 'none';  // Прячем бургер-иконку
      closeButton.style.display = 'block';  // Показываем кнопку закрытия
    }

    if (e.target.matches('.closebtn')) {
      toggleClass(header, 'active-mobile', 'remove');
      burgerIcon.style.display = 'block';  // Показываем бургер-иконку
      closeButton.style.display = 'none';  // Прячем кнопку закрытия
    }
  });
});

document.getElementById('template').innerHTML = template();
//# sourceMappingURL=bundle.js.map
