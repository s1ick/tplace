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

function template(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
pug_html = pug_html + "\u003C!DOCTYPE html\u003E";
pug_html = pug_html + "\u003Chtml lang=\"en\"\u003E";
pug_html = pug_html + "\u003Chead\u003E";
pug_html = pug_html + "\u003Cmeta charset=\"UTF-8\"\u003E";
pug_html = pug_html + "\u003Cmeta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"\u003E";
pug_html = pug_html + "\u003Ctitle\u003E";
pug_html = pug_html + "Мой Pug-шаблон\u003C\u002Ftitle\u003E";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fdist\u002Fstyle.css\"\u003E\u003C\u002Fhead\u003E";
pug_html = pug_html + "\u003Cbody\u003E";
pug_html = pug_html + "\u003Cnav\u003E";
pug_html = pug_html + "\u003Cul\u003E";
pug_html = pug_html + "\u003Cli\u003E";
pug_html = pug_html + "\u003Ca href=\"#home\"\u003E";
pug_html = pug_html + "Главная\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
pug_html = pug_html + "\u003Cli\u003E";
pug_html = pug_html + "\u003Ca href=\"#about\"\u003E";
pug_html = pug_html + "О нас\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
pug_html = pug_html + "\u003Cli\u003E";
pug_html = pug_html + "\u003Ca href=\"#services\"\u003E";
pug_html = pug_html + "Услуги\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
pug_html = pug_html + "\u003Cli\u003E";
pug_html = pug_html + "\u003Ca href=\"#contact\"\u003E";
pug_html = pug_html + "Контакты\u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fnav\u003E";
pug_html = pug_html + "\u003Csection class=\"main-content\"\u003E";
pug_html = pug_html + "\u003Ch2\u003E";
pug_html = pug_html + "Основное содержимое\u003C\u002Fh2\u003E";
pug_html = pug_html + "\u003Cp\u003E";
pug_html = pug_html + "Тут будет основной контент сайта.\u003C\u002Fp\u003E\u003C\u002Fsection\u003E";
pug_html = pug_html + "\u003Csection class=\"advantages\"\u003E";
pug_html = pug_html + "\u003Ch2\u003E";
pug_html = pug_html + "Преимущества\u003C\u002Fh2\u003E";
pug_html = pug_html + "\u003Cul\u003E";
pug_html = pug_html + "\u003Cli\u003E";
pug_html = pug_html + "Преимущество 1\u003C\u002Fli\u003E";
pug_html = pug_html + "\u003Cli\u003E";
pug_html = pug_html + "Преимущество 2\u003C\u002Fli\u003E";
pug_html = pug_html + "\u003Cli\u003E";
pug_html = pug_html + "Преимущество 4\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fsection\u003E\u003C\u002Fbody\u003E\u003C\u002Fhtml\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

document.body.innerHTML = template();
