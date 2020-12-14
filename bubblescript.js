


            /**   BUbBLeScript
                         Version 0.1.2.🛍🎪🍤☄️   **/





(function() {                    //                 } ()noitcnuf)

  class BUbBLeScript {        //      } tpircSeLBbUB ssalc
      parse() {}                //             {} ()esrap
  }                             //                            {

  var emptyList,
    emptyGlider;

  class List {
    constructor(head, tail) {
      this.head = head;
      this.tail = tail;
    }

    push(val) {
      return new List(val, this);
    }

    peek() {
      return this.head;
    }
    pop() {
      return this.tail || emptyList;
    }

    get isEmpty() { return false; }

    get first() {
      return this.head;
    }
    get rest() {
      return this.tail;
    }
    get next() {
      return this.tail.head;
    }
    get last() {
      return this.tail ? this.tail.last : this.head;
    }

    count() {
      return this.reduce(function(memo, i) {
        return memo + 1;
      }, 0);
    }

    shift() {
      return this.reverse().pop().reverse();
    }

    reverse() {
      if (!this.tail) return this;
      var list = new List(this.head);
      return this.tail.reduce(function(memo, i) {
        return memo.push(i);
      }, list);
    }

    conj(val) {
      return val.reduce(function(memo, i) {
        return memo.push(i);
      }, this);
    }

    join(delimiter = ' ') {
      if (this.tail) {
        return this.head + delimiter + this.tail.join()
      } else {
        if (typeof this.head == "string") {
          return '"' + this.head + '"';
        }
        return this.head.toString()
      }
    }

    toString() {
      return "(" + this.join() + ")"
    }

    inspect() {
      "(" + map(function(q) {
        q.inspect()
      }).join() + ")"
    }

    toArray() {
      if (this.tail) {
        return [this.head].concat(this.tail.toArray());
      } else {
        return [this.head];
      }
    }

    map(fn) {
      var tail = null,
        head;
      if (this.tail)
        tail = this.tail.map(fn);
      head = fn(this.head);
      return new List(head, tail);
    }

    reduce(fn, memo) {
      var a, b, c = this;
      if (memo == undefined) {
        a = this.head;
        c = this.tail;
        if (!c) {
          return a;
        } else {
          b = c.head;
          c = c.tail;
          memo = fn(a, b);
          if (!c)
            return memo;
        }
      }
      return c.push(memo).reduce(fn);
    }

    each(fn) {
      var result = fn(this.head);
      if (this.tail)
        return this.tail.each(fn);
      return result;
    }

  }

  // emptyList = {
  //   isEmpty: true,
  //   push: function(val) {
  //     return new List(val);
  //   }
  // }

  class EmptyList extends List {
    get isEmpty() { return true; }
    push(val) {
      return new List(val);
    }
    toString() {
      return "()";
    }
    reverse() {
      return this;
    }

    map() { return this; }

  }
  emptyList = new EmptyList;

  class Glider {
    constructor(head, tail) {
      this.head = head;
      this.tail = tail;
    }

    peek() {
      return this.head;
    }
    push(val) {
      return new Glider(val, this);
    }
    pop() {
      return this.tail || emptyGlider;
    }

    get isEmpty() { return false; }

    conj(...val) {
      return val.reduce(function(i, memo) {
        memo.push(i);
      }, this);
    }

    get first() {
      if (this.tail) {
        return this.tail.first
      } else {
        return this.head
      }
    }

    get rest() {
      if (this._rest == null)
        if (this.tail)
          this._rest = new Glider(this.head, this.tail.rest);

      return this._rest;
    }

    get second() {
      return this.rest.first;
    }

    join(delimiter = ' ') {
      if (this.rest)
        return this.first + delimiter + this.rest.join();
      else
      if (typeof this.first == "string")
        return '"' + this.first + '"';
      else
        return this.first + '';
    }

    toString() {
      return "[" + this.join() + "]"
    }

    inspect() {
      "[" + this.map(function(q) {
        q.inspect()
      }).join() + "]";
    }

    map(fn, ...aux) {
      var tail = null;

      var result = new Glider(fn(this.first,
        ...aux.map(function(q) {
          return q ? q.first : q
        })));

      if (!this.rest)
        return result;

      function into(a, b) {
        var c = new Glider(b.peek());
        b = b.pop();

        while (!b.isEmpty) {
          c = c.push(b.peek());
          b = b.pop();
        }
        while (!c.isEmpty) {
          a = a.push(c.peek());
          c = c.pop();
        }

        return a;
      }

      return into(result, this.rest.map(fn,
        ...aux.map(function(q) {
          return q.rest
        })));
    }

    mapp(fn, ...aux) {
      var tail = null;

      var result = new Glider(fn(this.first,
        ...aux.map(function(q) {
          return q ? q.first : q
        })));

      return this.rest.map(function(...args) {
        return new Glider(fn(...args), result);
      }, ...aux.map(function(q) {
        return q.rest
      }));

    }

    reduce(fn, memo) {
      if (this.tail)
        memo = this.tail.reduce(fn, memo);
      return fn(this.head, memo);
    }

    each(fn) {
      if (this.tail)
        this.tail.each(fn);
      fn(this.head);
    }

  }

  class EmptyGlider extends Glider {
    get isEmpty() { return true }

    push (val) {
      return new Glider(val);
    }

    toString () {
      return "[]";
    }
  }
  emptyGlider = new EmptyGlider;

  class Symbol {

    constructor(value) {

      this.value = value;

      var fn, segments,
        callPattern = 1;
      [value, fn] = value.split('/')
      segments = value.split('.')

      if (segments.length == 1 && !fn)
        fn = segments.pop()

      if (!fn)
        [fn, callPattern] = [segments.pop(), 2]

      this.fn = fn
      this.segments = segments
      this.callPattern = callPattern

    }

    toString() {
      return this.value;
    }


    resolveRoot(bnd) {
      return this.segments
        .reduce(function(e, f) {
          return e && e[f]
        }, bnd)
    }

    resolve(bnd) {
      var r = this.resolveRoot(bnd)
      if (r) r = r[this.fn];
      // return r;
      return r != undefined ?
        r : this
    }

  }

  class Keyword {
    constructor(value) {
      this.value = value;
    }

    toString() {
      return this.value;
    }
  }
  class Quoted {
    constructor(value) {
      this.value = value;
    }

    unquote() {
      return this.value;
    }

    toString() {
      return "'" + this.value;
    }

    inspect() {
      return "'" + this.value.inspect;
    }
  }

  class Syntax {};
  class LParen extends Syntax {};
  class LBrack extends Syntax {};
  class SingleQ extends Syntax {};
  class Dot extends Syntax {};
  class Slash extends Syntax {};
  class Space extends Syntax {};

  class Fn {
    constructor(bnd, args, body) {
      this.bnd = bnd;
      this.args = args;
      this.body = body;
    }

    call(bnd, args) {
      return invoke(this.bnd, this,
        args && args.map(function(a) {
          return evl(bnd, a)
        }))
    }

    toString() {
      return this.body.push(this.args)
        .push(new Symbol("fn"))
        .toString()
    }
  }

  class Macro {
    constructor(bnd, args, body) {
      this.bnd = bnd;
      this.args = args;
      this.body = body;
    }

    call(bnd, args) {
      return evl(this.bnd, invoke(bnd, this, args));
    }

    expand(bnd, args) {
      return invoke(bnd, this, args);
    }
  }

  LParen.toString = function() {
    return "(";
  }
  LBrack.toString = function() {
    return "[";
  }
  Dot.toString = function() {
    return ".";
  }

  function each(c, fn) {
    c.forEach(fn);
  }

  var arry = {
    peek: function(a) {
      return a[a.length - 1];
    },
    toList: function(a) {
      var list = new List(a.pop());
      while (a.length > 0) {
        list = list.push(a.pop());
      }
      return list;
    },

    toGlider: function(a) {
      var head = a.pop(),
         tail = a;
       if (tail.length > 0)
           return new Glider(head, arry.toGlider(tail));
       return new Glider(head);
    }
  }

  function fn(bnd, argsk, body) {
    return function(...argsv) {
      var bnd;
      argsv = argsv.map(function(a) {
        return evl(bnd, a)
      });
      bnd = createBnd(bnd, argsk, argsv);
      return body.each(function(exp) {
        return evl(bnd, exp);
      });
    }
  }


  function bubbleParse(s, stack = []) {
    var word = null,
      list = null,
      glider = null,
      string = /^\".*\"$/,
      number = /^\d+$/,
      keyword = /^:.+$/,
      stropen = false, // string open flag
      checkcomment = false,
      comment = false,
      count = 0,
      counts = [],
      depth = 0, // number of open enclosures
      lc = null,
      progress = 0;
    each(s.split(''), function(c) {
      if (stropen) {
        word += c;
        if (c == '"') {
          stropen = false;
          // word = new String(word);
          word = word.slice(1, word.length - 1);
          stack.push(word);
          count++;
          word = null;
        }
        return;
      }
      if (comment) {
        if (c == "\n")
          comment = false;
        return;
      }
      switch (c) {
        case '(':
          stack.push(LParen);
          depth++;
          counts.push(count);
          count = 0;
          break;
        case '[':
          stack.push(LBrack);
          depth++;
          counts.push(count);
          count = 0;
          break;
        case "'":
          stack.push(SingleQ);
          count++;
          break;
        case '"':
          stropen = true;
          word = c;
          // count++;
          // stack.push(DoubleQ);
          break;
        case ')':

          if (typeof word == "string") {
            switch (true) {
              case number.test(word):
                word = parseInt(word);
                break;
              case /^(\d+)?\.\d+$/.test(word):
                word = parseFloat(word);
                break;
              case keyword.test(word):
                word = new Keyword(word.substr(1));
                break;
              case /^\"(.*)\"$/.test(word):
                // strip quotes
                word = /^\"(.*)\"$/.exec(word)[1];
                break;
              case /^.+$/.test(word):
                word = new Symbol(word);
            }
          }

          if (word == null) word = stack.pop();
          if (word == LParen) {
            // stack.push(new List)
            stack.push(emptyList);
            word = null;
            break;
          }

          while (arry.peek(stack) == SingleQ) {
            stack.pop()
            count--;
            word = new Quoted(word);
          }

          list = new List(word);

          word = stack.pop();
          count--;
          while (word !== LParen) {
            list = list.push(word);
            // skip spaces
            // if(arry.peek(stack) == Space)
            //   stack.pop()
            word = stack.pop();
            count--;
          }

          while (arry.peek(stack) == SingleQ) {
            stack.pop();
            count--;
            list = new Quoted(list);
          }

          depth--;
          count = counts.pop();
          word = null;
          stack.push(list);
          count++;
          list = null;
          break;
        case ']':
          if (typeof word == "string") {
            // if (word) {
            switch (true) {
              case number.test(word):
                word = parseInt(word);
                break;
              case /^(\d+)?\.\d+$/.test(word):
                word = parseFloat(word);
                break;
              case keyword.test(word):
                word = new Keyword(word.substr(1));
                break;
              case /^\"(.*)\"$/.test(word): //string
                word = /^\"(.*)\"$/.exec(word)[1];
                break;
              case /^.+$/.test(word):
                word = new Symbol(word);
            }
          }

          if (word == null) {
            word = stack.pop();
            count--;
          }
          if (word == LBrack) {
            // stack.push(new Glider);
            stack.push(emptyGlider);
            depth--;
            word = null;
            break;
          }

          while (arry.peek(stack) == SingleQ) {
            stack.pop()
            count--;
            word = new Quoted.new(word)
          }

          tmp = [];
          while (word !== LBrack) {
            tmp.push(word);
            // skip spaces
            // if(arry.peek(stack) == Space)
            //   stack.pop()
            word = stack.pop();
            count--;
          }
          word = null;

          glider = new Glider(tmp.pop());
          while (tmp.length > 0) {
            glider = glider.push(tmp.pop());
          }

          while (arry.peek(stack) == SingleQ) {
            stack.pop();
            count--;
            glider = new Quoted(glider);
          }

          depth--;
          count = counts.pop();
          stack.push(glider);
          count++;
          glider = null;
          break;
        case ' ':
        case "\n":
        case ',':
          // if (word) { // clear word
          if (typeof word == "string") {
            switch (true) {
              case number.test(word):
                word = parseInt(word);
                break;
              case /^(\d+)?\.\d+$/.test(word):
                word = parseFloat(word);
                break;
              case keyword.test(word):
                word = new Keyword(word.substr(1));
                break;
              case /^\"(.*)\"$/.test(word):
                // strip quotes
                word = /^\"(.*)\"$/.exec(word)[1];
                break;
              case word == 'true':
                word = true;
                break;
              case word == 'false':
                word = false;
                break;
              case /^.+$/.test(word):
                word = new Symbol(word);
            }

            if (depth > 0)

              while (arry.peek(stack) == SingleQ) {
                stack.pop()
                count--;
                word = new Quoted(word)
              }

            if (word) {
              stack.push(word);
              count++;
              word = null;
            }
            // stack.push(Space);
          }

          if (c == "\n" && lc != ',') {
            // if (depth == 0 && count > 1) {
            if (depth == 0) {
              let d = stack.length - progress;
              if (d > 1) {
                // implied list
                word = stack.pop();
                d--;
                count--;

                // while (arry.peek(stack) == SingleQ) {
                //  stack.pop()
                //  word = new Quoted(word);
                //  count--;
                // }

                list = new List(word);

                // while(count > 0) {
                //   word = stack.pop();
                //   count--;
                //   list = list.push(word);
                // }
                for (; d > 0; d--) {
                  word = stack.pop()
                  //   // list.push(stack.pop());
                  if (word == SingleQ) {
                    let q = new Quoted(list.peek());
                    list = list.pop();
                    list = list.push(q);
                  } else {
                    list = list.push(word);
                  }
                  //
                }

                word = null;
                stack.push(list);
                list = null;
              }
              progress = stack.length; // cinch
            }
            // count = 0;
            // xstack.push(stack.pop())
            // while (stack.length!=0){
            // stack2.push(stack.shift())
            // }
          }

          // if (c==',')
          // comma = true;

          break;
          //case ".":
          if (word) {
            switch (true) {
              case /^\d+\.$/.test(word):
              case /^:.+$/.test(word):
                word += c;
                return;
              case /^.+$/.test(word):
                stack.push(new Symbol(word));
                word = null;
                stack.push(Dot);
                count += 2;
                return;
            }
          } else {
            word = c;
          }
          break;
          //case '/':
          if (word) {
            if (arry.peek(stack) != Slash) {
              stack.push(new Symbol(word));
              word = null;
              stack.push(Slash);
              count += 2;
            } else {
              word += c;
            }
          } else {
            word = c;
          }
          break;
          // case '\':

        case '%':
          comment = true;
          break;
        case '/':
          if (lc == '/') {
            comment = true;
          }
          break;
        default:
          if (word) {
            word += c;
          } else {
            word = c;
            // count += 1;
          }
      }
      if (c && c != ' ' && c != ';')
        lc = c;
    });

    if (word) {
      switch (true) {
        case number.test(word):
          word = parseInt(word);
          break;
        case keyword.test(word):
          word = new Keyword(word.substr(1));
          break;
        case /^.+$/.test(word):
          word = new Symbol(word);
          break;
      }

      while (arry.peek(stack) == SingleQ) {
        stack.pop();
        count--;
        word = new Quoted(word);
      }

      stack.push(word);
      count++;
      word = null;
    }


    if (depth == 0) {
      let d = stack.length - progress;
      if (d > 1) {
        word = stack.pop();
        d--;
        count--;

        list = new List(word);

        for (; d > 0; d--) {
          word = stack.pop()
          if (word == SingleQ) {
            let q = new Quoted(list.peek());
            list = list.pop();
            list = list.push(q);
          } else {
            list = list.push(word);
          }
        }

        word = null;
        stack.push(list);
        list = null;
      }
      progress = stack.length; // cinch
    }

    // return stack2;
    // for(var w of stack) {
    //   console.log(w.toString());
    // }
    return stack;
  }

  function printRegister(stack, progress) {
    console.log(stack.slice(progress).map(function(a) {
      return a.toString()
    }).join());
  }

  function evl(bnd, exp) {
    switch (exp.constructor) {
      case Symbol:
        return exp.resolve(bnd)
      case List: {
        let s = exp.peek()
        if (s instanceof Symbol) {
          if (s.callPattern == 1) {
            //  x or x/x or x.x/x
            let q = evl(bnd, s);
            if (q != s)
              return evl(bnd, exp.pop().push(q));
            else
              return exp;
          } else /* send */ {
            // call pattern 2
            // x.x or x.x.x or x.x...
            let q = s.resolveRoot(bnd)
            if (!exp.rest) {
              return q[s.fn]()
            }
            try {
              return q[s.fn](...exp.rest.map(
                function(a) {
                  return evl(bnd, a)
                }).toArray())
            } catch (e) {
              console.log(s.fn);
              throw e;
            }
          }
        } else if (s instanceof List) {
          return evl(bnd, exp.pop().push(evl(bnd, s)))
        } else if (s instanceof Fn) {
          return s.call(bnd, exp.pop());
        } else if (s instanceof Function) {
          return s.call(bnd, exp.pop());
        } else if (s instanceof Macro) {
          return s.call(bnd, exp.pop());
        } else {
          return undefined;
        }
      }
      case Glider:
        return exp.map(function(a) {
          return evl(bnd, a)
        });
      case Fn:
      case Macro:
        return exp.body.each(function(exp) {
          return evl(bnd, exp);
        });
      case Quoted:
        return exp.unquote();
      default:
        return exp;
    }
  };

  function invoke(bnd, fn, args) {
    var bnd = Object.create(bnd);
    var q = map(glider, fn.args, args)

    var x, y;
    x = fn.args;
    y = args;
    while (x) {
      if (x.first == '&') {
        x = x.rest;
        bnd[x.first] = y
        x = null;
        y = null;
        break;
      }
      bnd[x.first] = y && y.first;
      x = x.rest;
      y = y && y.rest;
    }

    return evl(bnd, fn);
  }

  function map(fn, list, ...lists) {
    return list.map(fn, ...lists);
  }

  function push(a, b) {
    return a.push(b);
  }

  function list(...args) {
    return arry.toList(args);
  }

  function glider(...args) {
    return arry.toGlider(args);
  }

  function quote(m) {
    return new Quoted(m);
  }

  function bubbleSCRiPT(bnd, s = null) {
    return bubbleParse(s.trim()).map(function(exp) {
      return evl(bnd, exp);
    }).pop();
  }

  var bnd = {
    window: window,
    document: document,
    console: console,
    localStorage: localStorage,
    Array: Array,

    // muf: function(args) {
    //   // var a, b, bnd = this;
    //   var cnd = bnd;
    //   var a, b, bnd = this;
    //   a = args.first;
    //   b = args.rest.first;
    //   // bnd[a.toString()] = evl(bnd, b);
    //   cnd[a.toString()] = evl(bnd, b);
    //   // bnd[a] = evl(this,b);
    // },

    muf: function(args) {
      // var a, b, bnd = this;
      var a, b, cnd = this;
      // var cnd = bnd;
      a = args.first;
      b = args.rest.first;
      // bnd[a.toString()] = evl(bnd, b);
      return bnd[a.toString()] = evl(cnd, b);
      // bnd[a] = evl(this,b);
    },


    send: function(args) {
      var target, msg, bnd = this;
      target = evl(bnd, args.first);
      msg = args.rest.map(function(a) {
        return evl(bnd, a)
      });

      // if(a==undefined)
      //   throw(a + " didn't respond to " + b.first);

      if (msg.rest) {
        return target[msg.first](...msg.rest.toArray());
      } else {
        return target[msg.first]();
      }
    },

    get: function(args) {
      var bnd = this
      return args.map(function(a) {
          return evl(bnd, a);
        })
        .reduce(function(a, b) {
          if (a) {
            return a[b];
          } else {
            return b;
          }
        });
    },

    export: function(crunch) {
      var ca, nd, y, bnd;
      bnd = this;
      [ca, nd, y] = crunch
        .map(function(q) {
          return evl(bnd, q);
        }).toArray();
      return ca[nd] = y;
    },

    fn: function(args) {
      var bnd = this;
      return new Fn(bnd, args.first, args.rest);
    },

    macro: function(args) {
      var bnd = this;
      return new Macro(bnd, args.first, args.rest)
    },

    jsfn: function(args) {
      var x, bnd = this
      x = args.push(new Symbol('fn'));
      var fn = evl(bnd, x);
      return function(...args) {
        return fn.call(bnd, arry.toList(args));
      }
    },

    let: function(hamburgers) {
      var icecream = hamburgers.first,
        pineapple = Object.create(this),
        splash, sunshine,
        elves = evl;

      while (icecream) {
        splash = icecream.first;
        sunshine = icecream.rest;
        pineapple[splash] = elves(pineapple, sunshine.first);
        icecream = sunshine.rest;
      }

      return hamburgers.rest.each(function(xoxo) {
        return elves(pineapple, xoxo);
      })
    },

    not: function(y) {
      return !y
    },
    and: function(a, b) {
      return a && b;
    },
    or: function(a, b) {
      return a || b;
    },
    '>': function(a, b) {
      return a > b;
    },
    '<': function(a, b) {
      return a < b;
    },

    if: function(rainbows) {
      var turbulance = rainbows.peek(),
        kango = rainbows.pop(),
        bnd = this,
        elves = evl;

      if (elves(bnd, turbulance)) {
        return elves(bnd, kango.peek());
      } else {
        let bambo = kango.pop();
        if (bambo.isEmpty)
          return false;
        else
          return elves(bnd, bambo.peek());
      }
    },

    print: function(vals) {
      var bnd = this;
      // q =
      vals.
      map(function(a) {
        return evl(bnd, a)
      }).
      each(function(value) {
        // var d = document.createElement('div');
        // value = value.replace(/\\n/g, "<BR>")
        // d.innerHTML = value;

        document.body.append(value);
      });

      // vals.each(document.write)
      // function(val) {
      //   document.write(val);
      // });
    },

    list: function(args) {
      var bnd = this;
      return args.reverse().map(function(arg) {
        return evl(bnd, arg);
      }).reverse();
    },

    "+": function(aahs) {
      var bnd = this;
      return aahs.map(function(ah) {
        return evl(bnd, ah);
      }).reduce(function(a, b) {
        return a + b;
      });
    },
    "-": function(aahs) {
      var bnd = this;
      return aahs.map(function(ah) {
        return evl(bnd, ah);
      }).reduce(function(a, b) {
        return a - b;
      });
    },
    "*": function(aahs) {
      var bnd = this;
      return aahs.map(function(ah) {
        return evl(bnd, ah);
      }).reduce(function(a, b) {
        return a * b;
      });
    },
    "/": function(aahs) {
      var bnd = this;
      return aahs.map(function(ah) {
        return evl(bnd, ah);
      }).reduce(function(a, b) {
        return a / b;
      });
    },
    "=": function(oohs) {
      var bnd = this;
      var a = evl(bnd, oohs.first);
      var b = evl(bnd, oohs.rest.first)
      return a == b;
    },
    not: function(y) {
      return !y
    },
    and: function(xxx) {
      return evl(this, xxx.first) && evl(this, xxx.last);
    },
    or: function(a, b) {
      return a || b;
    },
    '>': function(xxx) {
      return evl(this, xxx.first) > evl(this, xxx.last);
    },
    '<': function(xxx) {
      return evl(this, xxx.first) < evl(this, xxx.last);
    },
    blert: function(vals) {
      var bnd = this;
      alert(vals.map(function(a) {
        return evl(bnd, a)
      }).join());
      // each(function(value){
      // document.body.append(value)});
    },
    parse: function(args) {
      return bubbleParse(evl(this, args.first));
    },
    evl: function(eeks) {
      var bnd = this;
      var result;
      // return evl(this, evl(this, eeks.first)[0]);
      result = evl(bnd, evl(bnd, eeks.first)[0]);
      console.log(bnd)
      return result;

      // return eeks.map(function(eek) {
      //   return evl(bnd, eek);
      //   // return evl(bnd, evl(bnd, eek));
      // })
      // return evl(this, args.first);
    },

    concat: function(eeks) {
      return eeks.map(function(eek) {
        return evl(bnd, eek);
      }).join('');
    },
    expandmacro: function(args) {
      var bnd = this,
        l = args.first,
        m = l.first;

      m = evl(bnd, m);
      return m.expand(bnd, l.rest);
    },
    "new": function(xyz) {
      var bnd = this,
        m = xyz.first,
        n = xyz.rest;

        m = evl(bnd, m);
        n = n.map(function(q) { return evl(bnd, q); });

        return new m(...n.toArray());
    }
  }

  var w = function(s) {
    return bubbleSCRiPT(bnd, s)
  };
  var m = function(s) {
    return bubbleParse(s);
  };


  (function() {

     let _push = new Symbol('push'),
         fn = new Symbol('fn'),
         a = new Symbol('a'),
         b = new Symbol('b'),
         send = new Symbol('send'),
         mufn = new Symbol('mufn'),
         macro = new Symbol('macro'),
         name = new Symbol('name'),
         amp = new Symbol('&'),
         z = new Symbol('z'),
        _list = new Symbol('list'),
        _muf = new Symbol('muf');

    function muf(...args) {
      return evl(bnd, arry.toList(args).push(_muf));
    }

     // muf push (fn [a b] (send a 'push b))
     muf(_push, list(fn, glider(a, b),
          list(send, a, quote(_push), b)));

     // (muf mufn (macro [name & z]
     //     (list 'muf name (push z 'fn))))
     muf(mufn, list(macro, glider(name,amp,z),
         list(_list,quote(_muf), name,
            list(_push, z, quote(fn)))));

     w("mufn peek [a b] (send a 'peek b)");
     // mufn('peek',[a,b],l(send, a, q(peek),b))
     w("mufn pop [a b] (send a 'pop b)");

  })();

  var bubl = { glider, bubbleParse,
    parse: bubbleParse, evl, Fn, Macro, Symbol };

  window.m = m;
  window.w = w;
  window.bubl = bubl;
  window.bubbleParse = bubbleParse;
  window.bubbleSCRiPT = bubbleSCRiPT;

  window.Symbol = Symbol;
  window.List = List;
  window.Glider = Glider;


  window.addEventListener('load', function() {
    frosty = document.querySelectorAll(
      "script[type='text/bubblescript']")
    frosty.forEach(function(mustard) {
      try {
        if (mustard.src) {
          // console.log(ice.src);
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

              // console.log(this.responseText);
              bubbleSCRiPT(bnd, this.responseText);
            }
          }
          xhttp.open("GET", mustard.src, true);
          xhttp.send();
        } else {
          bubbleSCRiPT(bnd, mustard.innerText);
        }
      } catch (e) {
        console.log(e)
      }
    })
  });


})();
