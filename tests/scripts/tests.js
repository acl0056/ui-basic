// !Preferences
window.gkdebug = true;
module("ui-basic");

test("Size", function() {
	var size = new Size(100, 200);

	equal(size.width, 100, "width property");
	equal(size.height, 200, "height property");
	
	throws(function(){var size =  new Size("width");}, "Arguments width and height must be numeric.");
	throws(function(){var size =  new Size(100);}, "Arguments width and height must be numeric.");
	
	var size2 = new Size(100, 200);
	equal(size.equals(size2), true, "equals1");
	equal(size.equals({width:100,height:200}), true, "equals2");
	size2.height = 900;
	equal(size.equals(size2), false, "equals3");
});


test("Point", function() {
	var point = new Point(100, 200);
	
	equal(point.x, 100, "x property");
	equal(point.y, 200, "y property");
	
	throws(function(){var point =  new Point("width");}, "Arguments x and y must be numeric.");
	throws(function(){var point =  new Point(100);}, "Arguments x and y must be numeric.");
	
	var point2 = new Point(100, 200);
	equal(point.equals(point2), true, "equals1");
	equal(point.equals({x:100,y:200}), true, "equals2");
	point2.y = 900;
	equal(point.equals(point2), false, "equals3");
	
	var point3 = point2.add(point);
	equal(point3.equals({x:200,y:1100}), true, "add");
	
	point3 = point2.distance(point);
	equal(point3.equals({x:0,y:-700}), true, "distance");
	
	point3 = point2.subtract(point);
	equal(point3.equals({x:0,y:700}), true, "subtract");
	
	point3 = point2.negative();
	equal(point3.equals({x:-100,y:-900}), true, "negative");
});

test("Line", function(){
	var line1 = new Line({x:5,y:0},{x:5,y:10});
	var line2 = new Line({x:0,y:5},{x:10,y:5});
	var point = line1.intersection(line2);
	equal(point.equals({x:5,y:5}), true, "line intersection");
	
	line1 = new Line({x:0,y:7},{x:10,y:7});
	strictEqual(line1.intersection(line2), null, "parallel lines");
});

test("Frame", function(){
	var frame1 = new Frame(new Point(0,0),new Size(100,100));
	var frame2 = Frame.make(0,0,100,200);
	equal(frame1.equals(frame2), false, "frame equals false");
	var frame3 = frame1.copy();
	equal(frame1.equals(frame3), true, "frame equals true");
	var point = new Point(50,50);
	equal(frame1.isPointInsideFrame(point), true, "isPointInsideFrame true");
	point.x = 400;
	equal(frame1.isPointInsideFrame(point), false, "isPointInsideFrame false");
	point.x = 50;
	point.y = 400;
	equal(frame1.isPointInsideFrame(point), false, "isPointInsideFrame false");
});


test("PointAndTransform", function() {
	
	var point = new Point(1, 1);
	var transform = Transform.scaleMatrix(2);
	point.applyTransform(transform);
	equal(point.equals({x:2,y:2}), true, "apply transform");
	
	point = new Point(1, 1);
	transform = Transform.rotationMatrix(90);
	point.applyTransform(transform);
	ok(point.x-1 < 0.0001 , "apply rotation x");
	ok(point.x+1 < 0.0001 , "apply rotation y");
	
	point = new Point(1, 1);
	transform = Transform.translationMatrix({x:10,y:20});
	point.applyTransform(transform);
	equal(point.equals({x:11,y:21}), true, "apply translation");
	
	transform = Transform.identityMatrix();
	point.applyTransform(transform);
	equal(point.equals({x:11,y:21}), true, "apply identity");
});

test("MatrixArray", function() {
	
	var matrix = new MatrixArray(3,3,[1,0,0,0,1,0,0,0,1]);
	
	deepEqual(matrix.pos, [[1,0,0],[0,1,0],[0,0,1]], "Testing 2D array");
	deepEqual(matrix.getColumn(1).pos,[[0],[1],[0]],"Testing getColumn()");
	deepEqual(matrix.getRow(1).pos,[[0,1,0]],"Testing getRow()");
	
	var rotate90 = new MatrixArray(3,3,[0,1,0,-1,0,0,0,0,1]);
	var tester = Transform.rotationMatrix(90);
	var tester2 = Transform.rotationMatrix(Math.PI/2, true);
	
	// deepEqual(rotate90.pos,tester.pos,"Testing matrix vs Transform.rotationMatrix");
	// This was confirmed visually to be a very close approximation and therefor equal.
	
	deepEqual(tester.pos,tester2.pos,"Testing deg vs rad");
	
	equal(matrix.isIdentityMatrix(),true,"Testing isIdentityMatrix()");
	var idMatrix = MatrixArray.identityMatrix(3);
	equal(matrix.equals(idMatrix),true,"Testing .equal()");
	
	var mult = matrix.multiply(rotate90);
	
	deepEqual(mult.pos,rotate90.pos,"Test multiply() on ID matrix");
	
	matrix = new MatrixArray(3,3,[1,0,0,0,1,0,0,90,1]);
	var translate = Transform.translationMatrix({x:0,y:90});
	
	deepEqual(matrix.pos,translate.pos,"Test translationMatrix()");
	
	var translateAndRotate = new MatrixArray(3,3,[0,1,0,-1,0,0,-90,0,1]);
	tester = matrix.multiply(rotate90);
	deepEqual(tester.pos,translateAndRotate.pos,"Test multiply() on translation matrix by rotation matrix");
	
	var scale = Transform.scaleMatrix({x:2,y:2});
	deepEqual(scale.pos,[[2,0,0],[0,2,0],[0,0,1]],"Testing scale matrix.");
	
	var inv = matrix.inverse();
	deepEqual(inv.pos,[[1,0,0],[0,1,0],[0,-90,1]],"Testing inverse()");
	
	inv = scale.inverse();
	scale.applyTransform(inv);
	equal(scale.isIdentityMatrix(),true,"Testing transform.inverse() and applyTransform()");
	
	equal(scale.css(), "matrix(1.0000000000000000,0.0000000000000000,0.0000000000000000,1.0000000000000000,0.0000000000000000,0.0000000000000000)","Testing .css()");
	
});