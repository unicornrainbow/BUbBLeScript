
                          function
                            evl
                   (exp, ns={}, bnd)
                           {
  var q, args;
  switch (exp.constructor) {
    case Symbol: {
      // return bnd[exp];
      let value = null;
      exp = exp.toString()
      if (bnd) {
      value = bnd[exp];
        if (value)
          return value;
      }

      value = ns[exp];
      if (value)
        return value;

      if(ns.requires) {
        value = ns.requires.find(function(ns){
          return ns[exp];
        });
        if (value)
          return value;
      }

      // value = bubls.core[exp];
      value = bubblescript.core[exp];
      if(value)
        return value;

      return bubls[exp];
    }
    case List: {
      // loop {
      //   recur()
      // }

      let quack = evl(exp.first, ns, bnd);
      while (quack instanceof Symbol ||
             quack instanceof List) {
        let wack = evl(quack, ns, bnd);
        if (wack == undefined)
          throw(quack + " is wack");
        quack = wack;
      }

      if (quack.macro) {
        return evl(quack(exp.rest), ns, bnd);
      } else {
        // let k = function(a) { return evl(a, ns, bnd);}).toArray()),
        let k = function(a) { return evl(a, ns, bnd);}, //).toArray()),
            s = exp.rest.map(k);
        // let s = exp.rest.map(k);
        return quack(...s.toArray());
        // return quack(s);
      }
      // return quack()
      // return quack.call(bnd, exp.rest);

    //   if (quack instanceof Fn ||
    //       quack instanceof Macro ||
    //       quack instanceof Function) {
    //     return quack.call(bnd, exp.rest);
    //   // } else if (q instanceof Keyword) {
    //   //   return evl()
    // } else if (quack) {
    //   return evl(bnd,exp.second);
    // } else if (exp.third) {
    //   return evl(bnd,exp.third);
    // }

    // return st1.call(bnd, exp.rest)
    //
    //
    //   if (q instanceof Fn
    //       q instanceof Macro
    //       q instanceof Function) {
    //     return q.call(bnd, exp.rest);
    //   } else if (q) {
    //
    //   } else {
    //
    //   }
    //
    //   let q = evl(bnd, exp.first);
    //   while (q instanceof Symbol|List) {
    //     q = evl(bnd, q);
    //   }
    //
    //   let q = evl(bnd, exp.first);
    //   while (q instanceof in [Symbol, List]) {
    //   loop [q evl(bnd, exp.first)]
    //     (if q.)
    //     let q = evl(bnd, exp.first);
    //     recur(evl(bnd, exp.first))
    //   }
    //   if (q.call) {
    //
    //   }
    //   if (q instanceof Fn ||
    //       q instanceof Macro ||
    //       q instanceof Function) {
    //       return q.call(bnd, args.rest);
    //   }
    //
    //   if (q instanceof Symbol ||
    //       q instanceof List) {
    //     if (q==undefined) {
    //       throw("No such function or macro: " + exp.first);
    //     }
    //     args = exp.rest;
    //     return q.call(bnd, args);
    //   } else {
    //     if (exp.first instanceof List) {
    //       let q = evl(bnd, exp.first),
    //           exp = exp.pop();
    //       switch(q.constructor) {
    //         case Symbol:
    //         case Fn:
    //         case Macro:
    //         case List:
    //           return evl(bnd, exp.push(q));
    //       }
    //       if (q) {
    //         return evl(bnd, exp.first);
    //       } else {
    //         let exp = exp.pop();
    //         if (exp)
    //           return evl(bnd, exp.first);
    //         else
    //           return false;
    //       }
    //     }
    //   }
      break; }
    case Glider:
      // console.log(exp);
      // console.log(exp.map(function(a) {evl(bnd,a)}));
      return exp.map(function(a) {return evl(bnd,a)});
    case Fn:
    case Macro:
      return exp.body.each(function(exp){
        return evl(bnd,exp);
      });
    case Quoted:
      return exp.unquote();
    default:
      return exp;
  }
};


                 ---    function   ----
                   --->  evl2  <---
                    (bnd , exp , ns)
                   (exp, ns={}, bnd)
                            ︷

      case Glider:
        return exp.map(function(a) {evl(bnd,a)});
      case Fn:
      case Macro:
        return exp.body.each(function(exp){
          return evl(exp, ns, bnd);
        });
      case Quoted:
        return exp.unquote();
      default:
        return exp;
    }
                           ︸
                  ⎧          }
                  ⎨
                  ⎩

                  ⎰
                  ⎱
                  ﹛
                  ｛
                  ⎡
                  ⎨
                  ⎣
                  ⎛
                  ⎜
                  ⎠
                  ⎞
                  ⎜
                  ⎝


















                          function
                        fetchScript
                    ( url , callback )
                          {
              xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function()
                     {
                 if (this.readyState == 4)
                {
                   if (this.status == 200)
            {
                  callback(xhttp.responseText);
                                                }
                            else
            {
             error(url + " returned " + this.status);
                                                }
                                          }
                                    }
                   xhttp.open('GET', url);
                             }

                          function
                       fetchScripts2
                  (scripts, callback, fin)
                           {
  var open = 0; // how many downloads are currently "open"

  function happyMeal(response) {
    if (scripts) {
      fetchScript(scripts.head, happyMeal);
      scripts=scripts.rest;
    } else
      open--;

    callback(response.text);

    // if (= open 0)
    if (open == 0)
      fin();
  }

  while(scripts && open<3) {
    fetchScript(scripts.head, happyMeal);
    open++;
    scripts=scripts.rest;
  }

  return {};
}

                          function
                        fetchScripts5
                       (scripts, cbk)
                           {
  var open =  0, // how many downloads are currently "open"
        counter = 0,
            fetchQ = [],
              wait = [],
                 flash  =  1;

  function getAtMe(order,callback) {
    return function (response) {
      if (fetchQ.length>0) {
        let script,order,callback;
        [script,order,callback] = fetchQ.shift();
        fetchScript(script, getAtMe(order,callback));
      } else {
        open-- ;
      }

      scriptReady(order,callback,response);
    }
  }

  function scriptReady(order,callback,response) {
    var cmp=getComplete(order);

    if(order==flash){
      if (callback(response.text,cmp))
        cmp();
    } else if (order>flash) {
      wait[order]=[callback,response,cmp];
    } else {
      throw "that is some weird wild stuff";
    }
  }

  function getComplete(order) {
    return function() {
      if (order!=flash)
        return;
      flash++;
      setTimeout(clearWait, 0);
    }
  }

  function clearWait () {
    var cb,r,cmp;
    if(wait[flash]) {
      [cb,r,cmp]=wait[flash];
      delete wait[flash];
      if (cb(r.text,cmp)) cmp();
    }
  }

  while(scripts) {
    let script = scripts.head;
    counter++;
    if(script.src=='') {
      // scriptReady(counter,callback,{text: script.innerHTML});
      // setTimeout(scriptReady,0,counter,callback, {text: script.innerHTML});
      async(scriptReady,counter,callback, {text: script.innerHTML});
    } else {
      if (open<3) {
        fetchScript(script.src, getAtMe(counter, callback));
        open++;
      } else {
        fetchQ.push([script,counter,callback]);
      }
    }
    scripts=scripts.rest;
  }

  return {};
}

                           function
                             ns
                          (flinflan)
                           {
          var o=flinflan.peek();
          var namespace=evl(root, o);
          if(!namespace){
            // Init
            if(o instanceof Symbol) {
              namespace=Object.create(root);
              root[o]=namespace;
            } else {
              //}(one instanceof List) {
              let a=o.pop(),
                  p=root,
                  f;
              while(a){
                f=a.peek();
                if(f instanceof Quoted)
                  f=f.unquote();
                p=p[f]||Object.create(root);
                p[f]=p;
                a=a.pop();
              }
              p[f]=namespace;
            }
          }

          // root={};
          // lookup namespace
          // set namespace
          // imports and requires
        }

                          function
                        expandmacro
                          (args)
                           {
    var bnd = this,
        l = args.first,
        m = l.first;

    m = evl(bnd, m);
    return m.expand(bnd, l.rest);
  }
