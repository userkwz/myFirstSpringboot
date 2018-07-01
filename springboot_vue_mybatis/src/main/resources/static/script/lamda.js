
(function (window) {

    var  lambda = function (items) {
        if (lambda.type(items) === "string") return lambda._compile(items);
        return new lambda.prototype.init(items);
    },

   
    _lambda = window.lambda,

 
	__ = window._;

    lambda.prototype.init = function (items) {

        this.items = items;
        return this;
    }


    lambda.prototype.each = function (fn) {

        var name, i = 0, length = this.items.length, isObj = length === undefined || lambda.type(this.items) === "function";
        var its = this.items;
        if (isObj) {
            for (name in its) {
                fn.call(its[name], name, its[name]);
            }
        } else {
            for (; i < its.length;) {
                fn.call(its[i], i, its[i++]);
            }
        }
    }
    lambda.prototype.count= function(fn) {
        if (fn == null)
            return this.items.length;
        else
            return this.find(fn).items.length;
    }
    lambda.prototype.map = function (fn) {

        var result = [];
        this.each(function (index,item) {

            result[index]=fn(item);
        })
        return lambda(result);
    }

    lambda.prototype.first = function (fn) {

        if (fn != null) {
            return this.find(fn).first();
        }
        else {
            // If no clause was specified, then return the First element in the Array
            if (this.items.length > 0)
                return lambda([this.items[0]]);
            else
                return null;
        }
    }

    lambda.prototype.find = function (fn) {
        
        var newArr=[], self = this, i = 0;
       
        this.each(function (index, item) {

            if (fn(item,index)) newArr[i++] = item;
          
        })

        return lambda(newArr);
        
    }

    lambda.prototype.sortBy = function (clause) {
            var tempArray = [];
            for (var i = 0; i < this.items.length; i++) {
                tempArray[tempArray.length] = this.items[i];
            }
            return  lambda(
            tempArray.sort(function (a, b) {
                var x = clause(a);
                var y = clause(b);
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            })
        );
    }

    lambda.type = function (obj) {
        return obj == null ?
         String(obj) :
         {
             "[object Array]": "array",
             "[object Boolean]": "boolean",
             "[object Date]": "date",
             "[object Function]": "function",
             "[object Number]": "number",
             "[object Object]": "object",
             "[object RegExp]": "regexp",
             "[object String]": "string"
         }[Object.prototype.toString.call(obj)] || "object";
    }

    lambda._compile = function (condition) {
        var conditionStr = condition.split("=>");
      
        if (conditionStr[0].indexOf("(") === -1) {
            return function (item) {               
                return eval(conditionStr[1].replace(new RegExp("\\b" + conditionStr[0] + "(?![A-Za-z0-9_])", "g"), "item"));
            }
        } else {
            var tempStr = conditionStr[0].replace(/\(/g, "").replace(/\)/g, "").split(",");
            var tempItem = lambda.trim(tempStr[0]);
            var tempIndex = lambda.trim(tempStr[1]);
            return function (item,index) {
                return eval(conditionStr[1].replace(new RegExp("\\b" + tempItem + "(?![A-Za-z0-9_])", "g"), "item").replace(new RegExp("\\b" + tempIndex + "(?![A-Za-z0-9_])", "g"), "index"));
            }
        }
    }



    var trimLeft = /^\s+/,
	trimRight = /\s+$/,
    rnotwhite = /\S/,
    trim = String.prototype.trim;
    
    // IE doesn't match non-breaking spaces with \s
    if (rnotwhite.test("\xA0")) {
        trimLeft = /^[\s\xA0]+/;
        trimRight = /[\s\xA0]+$/;
    }

    lambda.trim = trim ?
		function (text) {
		    return text == null ?
				"" :
				trim.call(text);
		} :

    // Otherwise use our own trimming functionality
		function (text) {
		    return text == null ?
				"" :
				text.toString().replace(trimLeft, "").replace(trimRight, "");
		};

    lambda.prototype.init.prototype = lambda.prototype;


    
    
    lambda.noConflict = function (deep) {
        if (window._ === lambda) {
            window._ = __;
        }

        if (deep && window.lambda === lambda) {
            window.lambda = _lambda;
        }

        return lambda;
    }


    var root = this;

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = lambda = _;
        }
        exports.lambda = exports._ = lambda;
    } else {
        root.lambda = root._ = lambda;
    }

    // Current version.
    _.VERSION = '1.0.0';
 
}(window))



//Array.prototype.remove = function (from, to) {
//    var rest = this.slice((to || from) + 1 || this.length);
//    this.length = from < 0 ? this.length + from : from;
//    return this.push.apply(this, rest);
//};