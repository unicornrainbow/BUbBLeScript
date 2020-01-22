
QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
  assert.ok( m, "Passed!" );
  assert.ok( w, "Passed!" );
  // assert.ok( bubblescript, "Passed!" );
  assert.ok( bubl, "Passed!" );
  assert.ok( bubbleParse, "bubbleParse" );
  assert.ok( bubbleSCRiPT, "bubbleSCRiPT" );
  assert.ok( bubl.parse, "bubl.parse is available" );
  assert.ok( bubl.evl, "bubl.evl is available" );
  assert.ok( bubl.Symbol, "bubl.Symbol is available" );
});


//(QUnit.test "Mighty Mouse"
//  (jsfn [assert]
//    (assert.ok (= 1 "1") "Passed!")))


// bubl != undefined


QUnit.test( "can parse symbol", function( assert ) {
  var q = bubbleParse("y");
  // assert.equivalent = function(n, r, v) {
  //   return this.equal(JSON.stringify(n),JSON.stringify(r),v);
  // }
  // assert.equivalent( q, [new Symbol("n")]);
  assert.propEqual( q, [new Symbol("y")]);
  // assert.equal( q[0].constructor , Symbol, "Passed!" );
});

      QUnit.test( "can parse number", function( assert ) {
        var q = bubl.parse("8");
        assert.equal( q[0], 8);
      });

QUnit.test( "can parse string", function( assert ) {
  var q = bubl.parse("\"cookie\"");
  assert.equal( q[0], "cookie");
});

QUnit.test( "can parse list", function( assert ) {
  var q = bubl.parse(' ( "cookie" )  ');

  var m = new List("cookie");
  assert.propEqual( q[0], m);

  var q = bubl.parse(' ( 7 "cookie" )  ');
  m = new List(7, m);
  assert.propEqual( q[0], m);

  var q = bubl.parse(' (9 "cookie" 7   )  ');
  var m = new List(9, new List("cookie", new List(7)));
  assert.propEqual( q[0], m);
});

QUnit.test( "can parse glider", function( assert ) {
  var q = bubl.parse(' [ "cookie" ]  ');

  var m = new Glider("cookie");
  assert.propEqual( q[0], m);

  var q = bubl.parse(' [   "cookie"  7 ]  ');

    m = new Glider(7, m);
  assert.propEqual( q[0], m);

  var q = bubl.parse('[7 cookie 9]');

  var m = new Glider(9,
    new Glider(new Symbol("cookie"),
      new Glider(7)));
  assert.propEqual( q[0], m);
});
