
class BubbleScript {
  parse() {}
}
// Todoit
// *Parse comments (lines)
// *Add jsfn
// *String formatting in toString
// *fn bindings
// *list macro
// *onclick fn

// touchmove fn
// expandmacro
// let
// multi list macros?
// & vardic
// destructing
// ns

class List {
  constructor(head, tail=null) {
    this.head = head;
    this.tail = tail;
  }

  push(val) {
    return new List(val, this);
  }

  peek() { return this.head; }
  pop()  { return this.tail; }

  get first() { return this.head; }
  get rest()  { return this.tail; }
  get next()  { return this.tail.head;}
  get last()  { return this.tail ? this.tail.last : this.head; }

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

  join(delimiter=' ') {
    if(this.rest) {
      console.log(this.first);
      return this.first + delimiter + this.rest.join()
    } else {
      if (typeof this.head == "string") {
        return '"' + this.head +'"';
      }
      return this.head.toString()
    }
  }

  toString() {
    return "(" + this.join() + ")"
  }

  inspect() {
    "(" + map(function(q){q.inspect()}).join() + ")"
  }

  toArray() {
    if (this.rest) {
      return [this.first].concat(this.rest.toArray());
    } else {
      return [this.first];
    }
  }

  map (fn) {
    var tail=null, head;
    if (this.tail)
      tail = this.tail.map(fn);
    head = fn(this.head);
    return new List(head, tail);
  }

  reduce(fn, memo) {
    var a, b, c=this;
    if (memo==undefined) {
      a = this.head;
      c = this.rest;
      if (!c) {
        return a;
      } else {
        b = c.head;
        c = c.rest;
        memo = fn(a, b);
        if(!c)
          return memo;
      }
    }
    return c.push(memo).reduce(fn);
  }

  // reduce(fn, memo) {
  //   if (memo) {
  //     return this._reduce(fn, memo);
  //   } else {
  //     if (this.tail) {
  //       return this.tail._reduce(fn, this.head)
  //     } else {
  //       return this.head;
  //     }
  //   }
  // }
  //
  // _reduce(fn, memo='endlesslove') {
  //   memo = fn(memo, this.head);
  //   if (this.tail) {
  //     return this.tail._reduce(fn, memo);
  //   } else {
  //     return memo;
  //   }
  // }

  each (fn) {
    var result = fn(this.first);
    if (this.rest)
      return this.rest.each(fn);
    return result;
  }

}

class Glider {
  constructor(head, tail=null) {
    this.head = head;
    this.tail = tail;
  }

  peek() { return this.head; }
  push(val) {
    return new Glider(val, this); }
  pop() { return this.tail; }

  conj(...val){
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

    // if (this._first == null)
    //   if (this.tail)
    //     this._first = this.tail.first
    //   else
    //     this._first = this.head
    //
    // return this._first;
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

  join(delimiter=' ') {
    if(this.rest)
      return this.first + delimiter + this.rest.join();
    else
      if (typeof this.first == "string")
        return '"' + this.first +'"';
      else
        return this.first + '';
  }

  toString() {
    this.inspect();
  }

  toString() {
    return "[" + this.join() + "]"
  }

  inspect() {
    "[" + this.map(function(q){q.inspect()}).join() + "]";
  }


  map(fn) {
    var q=null;
    if(this.tail)
      q = this.tail.map(fn);
    return new Glider(fn(this.head), q);
  }

  map(fn, ...aux) {
    var tail=null;

    // var result = new Glider(fn(this.first,
    //   ...aux.map(function(q) {
    //     return q ? q.first : q})));
    //
    // if (!this.rest) {
    //   return result;
    // }
    //
    // return this.rest.reduce(function([a, aux], b) {
    //   return [new Glider(fn(b.first, ...aux.map(function(q) {
    //     return q ? q.first : q})), a), aux.map(function(q) {
    //       return q ? q.rest : q})]
    // }, [result, aux]);
    //
    // var result = new Glider(fn(this.first,
    //   ...aux.map(function(q) {
    //     return q ? q.first : q})));

    // if(this.rest) {
    //   aux = aux.map(function(q) {
    //     return q ? q.rest : q});
    //   return this.rest.reduce(function([a, ...aux], b) {
    //     return [new Glider(fn(b.first, ...aux.map(function(q) {
    //       return q ? q.first : q}), a), ...aux.map(function(q) {
    //         return q ? q.rest : q})]
    //   }, [result, ...aux])
    //
    //   this.rest.map(fn, ...aux.map(function(q) {
    //     return q ? q.rest : q}))
    //
    //   return new Glider(fn(this.head,
    //     ...aux.map(function(q) {
    //       return q ? q.first : q})),
    //     this.tail.map(fn, ...aux.map(function(q) {
    //       return q ? q.rest : q})));
    //
    // } else {
    //   return result;
    //   var result = new Glider(fn(this.first,
    //     ...aux.map(function(q) {
    //       return q ? q.first : q})));
    // }

    // console.log('xoxo', this.head)

    var result = new Glider(fn(this.first,
      ...aux.map(function(q) {
        return q ? q.first : q})));

    // console.log(result, 'cat')
    if(!this.rest)
      return result;

    function into(a, b) {
      // if (!b || !b.peek())
      //   return a;

      var c = new Glider(b.peek()); //b.peek());
      b = b.pop();

      // console.log(b, 'taco')
      while(b) {
        c = c.push(b.peek());
        b = b.pop();
      }
      while(c) {
        a = a.push(c.peek());
        c = c.pop();
      }

      return a;
    }

    // return result;
    // return result;
    return into(result, this.rest.map(fn,
      ...aux.map(function(q) {
        return q.rest})));

    // return this.rest.map(fn,
    //   ...aux.map(function(q) {
    //     return q.rest}))

  }

  mapp(fn, ...aux) {
    var tail=null;

    var result = new Glider(fn(this.first,
      ...aux.map(function(q) {
        return q ? q.first : q})));

    // if(!this.rest)
    //   return result;

    return this.rest.map(function(...args) {
      return new Glider(fn(...args), result);
    }, ...aux.map(function(q) {
      return q.rest}));


    //   return new Glider(fn(), result)
    // }, ...aux.map(function(q) {
    //   return q.rest}))
    //
    // return into(result, this.rest.map(fn,
    //   ...aux.map(function(q) {
    //     return q.rest})));

  }

  reduce(fn, memo=null) {
    if (this.tail)
      memo = this.tail.reduce(fn, memo);
    return fn(this.head, memo);
  }

  each(fn) {
    if(this.tail)
      this.tail.each(fn);
    fn(this.head);
  }

}


class Symbol {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

// class String {
//   constructor(value) {
//     this.value = value;
//   }
//
//   toString() {
//     return this.value;
//   }
// }

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
class LParen  extends Syntax {};
class LBrack  extends Syntax {};
class SingleQ extends Syntax {};
class Dot     extends Syntax {};
class Slash   extends Syntax {};
class Space   extends Syntax {};

LParen.toString = function () { return "("; }
LBrack.toString = function () { return "["; }
Dot.toString = function () { return "."; }

function each(c, fn) {
  c.forEach(fn);
}

// Adds peek() to array
if (Array.prototype.peek == undefined) {
  Array.prototype.peek = function() {
    return this[this.length-1];
  }

  // Object.defineProperty(Array.prototype, 'last', {
  //   get: function() {
  //     return this[this.length-1];
  //   }
  // });
}

var bubl = {};
(function() {

  class Fn {
    constructor (bnd, args, body) {
      this.bnd  = bnd;
      this.args = args;
      this.body = body;
    }

    call(bnd, args) {
      return invoke(this.bnd, this,
        args && args.map(function(a){
          return evl(bnd,a)}))
    }

    toString() {
      return this.body.push(this.args)
         .push(new Symbol("fn"))
         .toString()
    }
  }

  function fn(bnd, argsk, body) {
    return function(...argsv) {
      var bnd;
      argsv = argsv.map(function(a) { return evl(bnd,a)});
      bnd = createBnd(bnd, argsk, argsv);
      return body.each(function(exp){
        return evl(bnd, exp);
      });
    }
  }

  class Macro {
    constructor(bnd, args, body) {
      this.bnd  = bnd;
      this.args = args;
      this.body = body;

    }

    call(bnd, args) {
      // console.log(invoke(bnd,this,args).toString());
      return evl(this.bnd, invoke(bnd,this,args));
    }
  }

  function bubbleParse(s, stack=[]) {
    var word = null,
        list = null,
        glider = null,
        string = /^\".*\"$/,
        number = /^\d+$/,
        keyword = /^:.+$/,
        stropen = false, // string open flag
        comment = false,
        count = 0,
        counts = [],
        depth = 0, // number of open enclosures
        lc = null,
        progress=0;
    each(s.split(''), function(c) {
      if(stropen) {
        word += c;
        if (c == '"') {
          stropen = false;
          // word = new String(word);
          word = word.slice(1,word.length-1);
          stack.push(word);
          count++;
          word = null;
        }
        return;
      }
      if(comment) {
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
                word  = new Keyword(word.substr(1));
                break;
              case /^\"(.*)\"$/.test(word):
                // strip quotes
                word = /^\"(.*)\"$/.exec(word)[1];
                break;
              case /^.+$/.test(word):
                // console.log(word);
                word = new Symbol(word);
            }
          }

          if (!word) word = stack.pop();
          if (word == LParen) {
            stack.push(new List)
            word = null;
            break;
          }


          // console.log(stack);
          // console.log(register);
          // let y = progress;

          //printRegister(stack, progress);
          console.log(stack.peek());
          console.log(word);




          // progress
          //word = buildGetSend(stack, word);
          //word = buildGetSend(stack, word, progress, depth);
          // [word, count] = buildGetSend(stack, word, count, depth);
          [word, count] = buildGetSend(stack, word, stack.length-progress, depth);


          // {
          //   let m = [];
          //   m.push(word);
          //   while(stack.peek()!=LParen) {
          //     m.push(stack.pop())
          //   }
          //   k=m.pop();
          //   if (m.peek()==Dot) {
          //
          //   }
          // }
          // { // build get send
          //   let a = [],
          //     b = [],
          //     c,d;
          //   c = stack.pop();
          //   while (c!=LParam) {
          //     switch (c) {
          //       case Dot:
          //       case Slash:
          //         b.push(word);
          //         break;
          //       default:
          //         a.push(word);
          //         word = c;
          //     }
          //   }
          //
          //   if(c!=Dot && c!=Slash){
          //     a.push(stack.pop());
          //   } else {
          //
          //   }
          //   word
          //   stack.pop()
          // }


          // console.log(stack.last);
          while (stack.peek() == SingleQ) {
            stack.pop()
            count--;
            word = new Quoted(word);
          }

          list = new List(word);

          word = stack.pop();
          count--;
          while(word != LParen) {
            list = list.push(word);
            // skip spaces
            // if(stack.peek() == Space)
            //   stack.pop()
            word = stack.pop();
            count--;
          }

          while (stack.peek() == SingleQ) {
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

          if (!word) {
             word = stack.pop();
             count--;
          }
          if (word == LBrack) {
            stack.push(new Glider);
            depth--;
            word = null;
            break;
          }

          // word = buildGetSend(stack, word);
          // [word, count] = buildGetSend(stack, word, count, depth);
          [word, count] = buildGetSend(stack, word, stack.length-progress, depth);

          while (stack.peek() == SingleQ) {
            stack.pop()
            count--;
            word = new Quoted.new(word)
          }

          tmp = [];
          while(word != LBrack) {
            tmp.push(word);
            // skip spaces
            // if(stack.peek() == Space)
            //   stack.pop()
            word = stack.pop();
            count--;
          }
          word = null;

          glider = new Glider(tmp.pop());
          while (tmp.length > 0) {
            glider = glider.push(tmp.pop());
          }

          while (stack.peek() == SingleQ) {
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

            // word = buildGetSend(stack, word);
            // console.log(count)

           [word, count] = buildGetSend(stack, word, stack.length-progress, depth);

          if (depth>0)
            // [word, count] = buildGetSend(stack, word, stack.length-progress, depth);
            // console.log(word, count)
             // console.log(count);

            while (stack.peek() == SingleQ) {
              stack.pop()
              count--;
              word = new Quoted(word)
            }

           console.log('d', word);
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
              [word,count] = buildGetSend2(stack, word, progress);
              let d = stack.length - progress;
              if (d > 1) {
                // implied list
                word = stack.pop();
                d--;
                count--;

               //[word, count] = buildGetSend(stack, word, count);
                //
                // while (stack.peek() == SingleQ) {
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
                console.log(d, count)
                for(;d>0;d--) {
                  word = stack.pop()
                //   // console.log(word);
                //   // list.push(stack.pop());
                  if (word==SingleQ) {
                    let q = new Quoted(list.peek());
                    list =list.pop();
                    list=list.push(q);
                  } else {
                    list=list.push(word);
                  }
                //
                }
                // console.log(stack.length)
                // console.log(list)

                // console.log(stack);

                word = null;
                stack.push(list);
                list = null;
              // }              v84rf4r5e4i89u=8/88    (c == ' ') {
              }
              progress = stack.length; // cinch
              // console.log({'progress': progress})
            }
            // count = 0;
            // xstack.push(stack.pop())
            // while (stack.length!=0){
              // stack2.push(stack.shift())
              // console.log(stack.length)
            // }
          }

          // if (c==',')
            // comma = true;

          break;
        case ".":
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
                count+=2;
                return;
            }
          } else {
            word = c;
          }
          break;
        case '/':
          if (word) {
            if (stack.peek() != Slash) {
              stack.push(new Symbol(word));
              word = null;
              stack.push(Slash);
              count +=2;
            } else {
              word += c;
            }
          } else {
            word = c;
          }
          break;
        // case '\':

        case ';':
          comment = true;
          break;
        default:
          if (word) {
            word += c;
          } else {
            word = c;
            // count += 1;
          }
      }
      if (c&&c!=' '&&c!=';')
        lc = c;
    });

    if (word) {
      switch(true) {
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

      while (stack.peek() == SingleQ) {
        stack.pop();
        count--;
        word = new Quoted(word);
      }

      stack.push(word);
      count++;
      word = null;
    }

    // return stack2;
    console.log(stack)
    for(var w of stack) {
      console.log(w.toString());
    }
    return stack;
  }

  function printRegister(stack, progress) {
    console.log(stack.slice(progress).map(function(a){return a.toString()}).join());
  }

  var get  = new Symbol('get'),
      send = new Symbol('send');
  // Peeks at the stack, and builds get or send
  // if nesscesary.
  function buildGetSend(stack, word, count, depth) {
    var list, d;
    if(stack.peek() == Slash ||
       stack.peek() == Dot) {

      if (! word instanceof Symbol) {
        throw("Expected a Symbol got a " + word.constructor);
      }

         d = stack.pop();
         count--;

      // quote that word and create a list with it
      word = new Quoted(word);
      list = new List(word);

      // pop off successions of symbols and dots from stack and add to list
      while (stack.peek() instanceof Symbol) {
        word = stack.pop();
        count--;
        word = new Quoted(word);
        list = list.push(word);
        if (stack.peek() == Dot){
          stack.pop(); count--
        } else
          break;
      }

      // unquote the first word in list (last added)
      word = list.peek();//lollipop
      list = list.pop();
      list = list.push(word.unquote());

      // if((stack.peek() == LParen
      //           &&  d == Dot) ||
      //     (count==0 && depth==0)) {
      if(stack.peek() == LParen
                &&  d == Dot) {
        stack.push(send);
        count++;
        var length = list.count();
        if (length == 2) {
          stack.push(list.head);
          count++;
        } else {
          if (length < 2)
            throw("Is it your birthday?");
          list = list.push(get);
          stack.push(list.shift());
          count++;
        }
        word = list.last;
      } else {
        // console.log('z',count)
        if (count>0) {
          // if (space) stack.push(Space);
          list = list.push(get);
          word = list;
        } else {
          //undo it
          stack.push(list.peek());
          list=list.pop();
          while(list) {
            stack.push(Dot);
            stack.push(list.peek().unquote());
            list=list.pop();
          }
          word = stack.pop();
        }
      }
    }
    // console.log(count)
    return [word, count];
  }


  function buildGetSend2(stack, word, progress) {
    let b=[];
    let k=stack.length-progress;
    if(k<=1)
     return [word,k];
    var a,e,r;
    for(var i=0;i<k;i++) {
      b.push(stack.pop());
    }
    a=b.pop();
    console.log('xyz', a)
    if (b.peek()==Dot){
      b.pop();
      e=b.pop();
      r = b.length ? send : get
      b.push(new Quoted(e));
      b.push(a);
      b.push(r);
    } else {
      b.push(a);
    }

    // while(b.length) {
    //   stack.push(b.pop());
    // }
    for(i=0,k=b.length;i<k;i++) {
      stack.push(b.pop());
    }

    // return word;
    return [word,k];
  }

  function evl(bnd, exp) {
    switch (exp.constructor) {
      case Symbol:
        // console.log(exp, 'it');
        // console.log(exp.toString(), 'i');
        // console.log(exp)
        //return bnd[exp];
        {
          let s = bnd[exp];
          if (s === undefined)
            return exp;
          else
            return s
        }
      case List:
        var q, args;
        if (exp.first instanceof Symbol) {
          console.log(exp.first);
          q = evl(bnd, exp.first);
          if (q==undefined) {
            throw("Could not find fn or macro named \"" + exp.first + "\"");
          }
          args = exp.rest;
          return q.call(bnd, args);
        } else {
          return exp;
        }
        break;
      case Glider:
        return exp.map(function(a) {evl(bnd,a)});
      case Fn:
      case Macro:
        // console.log(exp)
        return exp.body.each(function(exp){
          return evl(bnd,exp);
        });
      case Quoted:
        return exp.unquote();
      default:
        return exp;
    }
  };


  function invoke(bnd, fn, args) {
    var bnd = Object.create(bnd);

    //(map vector fn.args args)
    //fn.args.map(vector args)
    //(map (fn [a b] bnd[a]) fn.args args)

    // console.log('type', fn.args.constructor)
    // console.log(fn.args, args)
    // var q =fn.args.map(function(a,b) {return new Glider(b, new Glider(a));}, args)
    // var q =fn.args.map(function(a,b) {return (glider a b);}, args)
    // var q =fn.args.map(glider, args)
    var q =map(glider, fn.args, args)
    // var q =(map glider fn.args args)


    // each(fn.args, args, function(name, value) {
    //   bnd[name]=value;
    // });
    //
    // each(function(name, value) {
    //   bnd[name]=value;
    // }, fn.args, args);




    console.log(q.toString());

    var x,y;
    x = fn.args; y = args;
    while (x) {
      if(x.first == '&'){
        x = x.rest;
        bnd[x.first] = y
        x = null; y = null;
        break;
      }
      bnd[x.first] = y && y.first;
      x = x.rest; y = y && y.rest;
    }


    //bnd = createBinding(bnd, args);

    return evl(bnd,fn);
  }

  function map(fn, list, ...lists) {
    return list.map(fn, ...lists);
  }

  function push(a, b) {
    return a.push(b);
  }

  function glider(...args) {
    var head = args.pop(), tail = args ;
    if(tail.length > 0)
      // return push(glider(...tail), head);
      // return new Glider(args.head, args.tail)
      return new Glider(head, glider(...tail));
       // push(glider(args.tail), args.head);
    return new Glider(head);

  }

  bubl.glider = glider;
  bubl.bubbleParse = bubbleParse;
  bubl.evl = evl
  bubl.Fn = Fn;
  bubl.Macro = Macro;

  // bubl = this;

})();


bubbleParse = bubl.bubbleParse;
evl = bubl.evl;
Fn = bubl.Fn;
Macro = bubl.Macro;


function bubbleSCRiPT(bnd, s=null) {
  // console.log(s);
  return bubbleParse(s.trim()).map(function(exp){
    return evl(bnd,exp);
  }).pop();
}

var bnd = {
  window: window,
  document: document,

  muf: function(args) {
    var a, b, bnd=this;
    a = args.first;
    b = args.rest.first;
    bnd[a.toString()] = evl(bnd, b);
    // bnd[a] = evl(this,b);
  },

  send: function(args) {
    var target, msg, bnd=this;
    target = evl(bnd,args.first);
    msg = args.rest.map(function(a){return evl(bnd,a)});

    // if(a==undefined)
    //   throw(a + " didn't respond to " + b.first);

    if (msg.rest) {
      return target[msg.first](...msg.rest.toArray());
    } else {
      // console.log(a[b.first.toString()]());
      return target[msg.first]();
    }
  },

  get: function(args) {
    var bnd=this
    // console.log(args);
    return args.map(function(a){
              return evl(bnd,a);})
    .reduce(function(a,b) {
      if (a) {
        return a[b];
      } else {
        return b;
      }
    });
    // console.log(args.map(function(a){
    //               return evl(bnd,a);
    //             })
    //            .reduce(function(a,b) {
    //               console.log(a, b);
    //               return b[a.toString()];
    //             }, bnd));
    // return args.map(function(a){
    //               return evl(bnd,a);
    //             })
    //            .reduce(function(a,b) {
    //               return b[a.toString()];
    //             }, bnd);
  },

  export: function(crunch) {
    var ca,nd,y,bnd;
    bnd=this;
    [ca,nd,y]=crunch
      .map(function(q){
        return evl(bnd,q);
      }).toArray();
    return ca[nd]=y;
  },

  fn: function(args) {
    var bnd = this;
    return new Fn(bnd, args.first, args.rest);
  },

  macro: function (args) {
    var bnd = this;
    return new Macro(bnd, args.first, args.rest)
  },

  jsfn: function(args) {
    var x, bnd = this
    x = args.push(new Symbol('fn'));
    var fn = evl(bnd, x);
    return function(...args) {
      var list = new List(args.pop());
      while (args.length>0) {
        list = list.push(args.pop());
      }

      return fn.call(bnd, list);
    }
  },

  let: function(hamburgers) {
    var icecream = hamburgers.first,
        pineapple = Object.create(this),
        splash, sunshine,
        elves=evl;

    while (icecream) {
      splash = icecream.first;
      sunshine = icecream.rest;
      pineapple[splash] = elves(pineapple, sunshine.first);
      icecream = sunshine.rest;
    }

    hamburgers.rest.each(function (xoxo){
      return elves(pineapple, xoxo);
    })
  },

  not: function(y) { return !y },
  and: function(a,b) { return a && b; },
   or: function(a,b) { return a || b; },
   '>': function(a,b) { return a > b; },
   '<': function(a,b) { return a < b; },

  if: function(rainbows) {
    var turbulance = rainbows.peek(),
        kango = rainbows.pop(),
        bnd = this,
        elves = evl;

    console.log('j',turbulance);
    console.log('j',elves(bnd,turbulance));
    if(elves(bnd,turbulance)){
      return elves(bnd, kango.peek());
    } else {
      let bambo = kango.pop();
      if (bambo)
        return elves(bnd, bambo.peek());
      else
        return false;
    }
  },

  print: function(vals) {
    var bnd = this;
    // q =
    // console.log(this[a])
    // console.log(this);
    vals.
      map(function(a){return evl(bnd,a)}).
      each(function(value){
        // var d = document.createElement('div');
        // value = value.replace(/\\n/g, "<BR>")
        // d.innerHTML = value;

        document.body.append(value);});

    // console.log.apply(this,q);
    // vals.each(document.write)
    // function(val) {
    //   document.write(val);
    // });
  },

  list: function(args) {
    var bnd = this;
    return args.map(function(arg){
      return evl(bnd, arg);
    })
  },

  "+": function(args){
    // return args.first+args.next;
    return args.reduce(function(a, b){return a+b;});
  },
  "-": function(aahs){
    var bnd = this;
    return aahs.map(function(ah){
      return evl(bnd, ah);
    }).reduce(function(a, b){return a-b;});
  },
  "*": function(args){
    // return args.first*args.last;
    return args.rest.reduce(function(a, b){return a*b;}, args.first);
  },
  "/": function(args){
    return args.reduce(function(a, b){return a/b;});
  },
  "=": function(oohs){
    var bnd=this;
    var a = evl(bnd, oohs.first);
    var b = evl(bnd, oohs.rest.first)
    return a==b;
  },
  not: function(y) { return !y },
  and: function(xxx) { return evl(this,xxx.first) && evl(this,xxx.last); },
   or: function(a,b) { return a || b; },
   '>': function(xxx) { return evl(this,xxx.first) > evl(this,xxx.last); },
   '<': function(xxx) { return evl(this,xxx.first) < evl(this,xxx.last); },
  alert: function(msg) {
    alert(msg);
  },
  alert: function(vals) {
    var bnd = this;
    alert(vals.
      map(function(a){return evl(bnd,a)}).join());
      // each(function(value){
        // document.body.append(value)});
  },
  parse: function(args) {
    return bubbleParse(evl(this, args.first));
  },
  evl: function(eeks) {
    var bnd = this;
    return evl(this, evl(this, eeks.first)[0]);
    return eeks.map(function(eek){
      // console.log(evl(bnd, eek))
      return evl(bnd, eek);
      // return evl(bnd, evl(bnd, eek));
    })
    // console.log('v', args.first)
    // return evl(this, args.first);
  },

  concat: function(eeks) {
    return eeks.map(function(eek){
      return evl(bnd, eek);
    }).join('');
  }

  // set: function(key,value) {
  //   this[key] = value;
  // }
}

// bnz = Object.create(window);

// bnd["/"] = function(args){
//   console.log(args);
//   return args.first/args.next; }
//


bubbleSCRiPT(bnd, "\
  (muf println\n\
    (fn [a] (print a \"\\n\")))\n\
\n\
  (muf blank [a & b]\n\
    (log a)\n\
    (log b))\n\
\n\
");




// (def vector
//   (fn [first & rest]
//    (reduce (fn [a b]
//      (new Vector a b))
//      rest
//      (new Vector first))))
//
// (def vector
//   (fn [first & rest]
//     (reduce conj rest
//       (new Vector first))))
//
// (def vector
//   (fn [first & rest]
//     (conj (new Vector first) & rest)))
//
// (def map ())

// (fn [frag] (send document :append "xyz"))

// (def println
//   (fn [a] (print a "<br>")))

// export { BubbleScript, List };

var w = function(s) { return bubbleSCRiPT(bnd, s) };
var m = function(s) { return bubbleParse(s); };

window.addEventListener('load', function () {
  frosty = document.querySelectorAll(
    "script[type='text/bubblescript']")
  frosty.forEach(function(ice) {
    bubbleSCRiPT(bnd,ice.innerText);
  })
});
