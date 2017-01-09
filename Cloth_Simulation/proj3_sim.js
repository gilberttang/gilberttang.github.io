/*
 * Global variables
 */
var meshResolution;

// Particle states
var mass;
var vertexPosition, vertexNormal, vertexColor, vertexAlpha, bvertexColor, bvertexPosition, bvertexNormal, bvertexAlpha;
var collision = new Array();
var vertexBurnPosition;
var vertexVelocity;
var PI = 3.1415926535897932384626433832795;
var radius ;
var ballResolution = 20;
var ballMesh;
var ballCenter = new Array(0,0,.50);
var ballVelocity = vec3.create(0,0,0);
// Spring properties
var K, restLength; 
var clickX = -1, clickY = -1;
var click = false;
var repelIntensity = 20;

var rainingSpeed = 30;
var countR;
var counti;
var countj;
var burningSpeed = 5;

var arrageOfPoint;

// Force parameters
var Cd;
var uf, Cv,Wind,Windangle;
var BallX, BallY,XXX,BallZ;

/*
 * Getters and setters
 */
function getPosition(i, j) {
    var id = i*meshResolution + j;
    return vec3.create([vertexPosition[3*id], vertexPosition[3*id + 1], vertexPosition[3*id + 2]]);
}

function getBurnPosition(i, j) {
    var id = i*meshResolution + j;
    return vec3.create([vertexBurnPosition[3*id], vertexBurnPosition[3*id + 1], vertexBurnPosition[3*id + 2]]);
}

function setBurnPosition(i, j, x) {
    var id = i*meshResolution + j;
    vertexBurnPosition[3*id] = x[0]; vertexBurnPosition[3*id + 1] = x[1]; vertexBurnPosition[3*id + 2] = x[2];
}


function getbPosition(i, j) {
    var id = i*ballResolution + j;
    return vec3.create([bvertexPosition[3*id], bvertexPosition[3*id + 1], bvertexPosition[3*id + 2]]);
}

function setbPosition(x) {
	ballCenter[0] = x[0];
	ballCenter[1] = x[1];
	ballCenter[2] = x[2];
	for (i = 0; i < ballResolution; i++){
		for (j = 0; j < ballResolution; j++){
			bvertexPosition[3*(i*ballResolution + j)] = ballCenter[0] + radius * Math.cos(2*PI*((ballResolution-j)/ballResolution)) * Math.sin(2*PI*((ballResolution-i)/ballResolution));
			bvertexPosition[3*(i*ballResolution + j) + 1] = ballCenter[1] + radius * Math.sin(2*PI*((ballResolution-j)/ballResolution)) * Math.sin(2*PI*((ballResolution-i)/ballResolution));
			bvertexPosition[3*(i*ballResolution + j) + 2] = ballCenter[2] + radius * Math.cos(2*PI*((ballResolution-i)/ballResolution));

		}
	}
}

function setPosition(i, j, x) {
    var id = i*meshResolution + j;
    vertexPosition[3*id] = x[0]; vertexPosition[3*id + 1] = x[1]; vertexPosition[3*id + 2] = x[2];
}

function getNormal(i, j) {
    var id = i*meshResolution + j;
    return vec3.create([vertexNormal[3*id], vertexNormal[3*id + 1], vertexNormal[3*id + 2]]);
}

function getVelocity(i, j) {
    var id = i*meshResolution + j;
    return vec3.create(vertexVelocity[id]);
}

function setVelocity(i, j, v) {
    var id = i*meshResolution + j;
    vertexVelocity[id] = vec3.create(v);
}

//color
function setColor(i, j, x) {
    var id = i*meshResolution + j;
    vertexColor[3*id] = x[0]; vertexColor[3*id + 1] = x[1]; vertexColor[3*id + 2] = x[2]; 
}

function setbColor(i, j, x) {
    var id = i*ballResolution + j;
    bvertexColor[3*id] = x[0]; bvertexColor[3*id + 1] = x[1]; bvertexColor[3*id + 2] = x[2];
}

//alpha
function setAlpha(i, j, x) {
    var id = i*meshResolution + j;
    vertexAlpha[id] = x;
}

function setbAlpha(i, j, x) {
    var id = i*meshResolution + j;
    bvertexAlpha[id] = x;
}

document.onmousedown = function(e) {
    //console.log(e.pageX);
    clickX = e.pageX;
    clickY = e.pageY;
    click  = true;
  //  changeColor(e);
}
/*
 * Provided global functions (you do NOT have to modify them)
 */
function computeNormals() {
    var dx = [1, 1, 0, -1, -1, 0], dy = [0, 1, 1, 0, -1, -1];
    var e1, e2;
    var i, j, k = 0, t;
    for ( i = 0; i < meshResolution; ++i ){
        for ( j = 0; j < meshResolution; ++j ) {
            var p0 = getPosition(i, j), norms = [];
            for ( t = 0; t < 6; ++t ) {
                var i1 = i + dy[t], j1 = j + dx[t];
                var i2 = i + dy[(t + 1) % 6], j2 = j + dx[(t + 1) % 6];
                if ( i1 >= 0 && i1 < meshResolution && j1 >= 0 && j1 < meshResolution &&
                     i2 >= 0 && i2 < meshResolution && j2 >= 0 && j2 < meshResolution ) {
                    e1 = vec3.subtract(getPosition(i1, j1), p0);
                    e2 = vec3.subtract(getPosition(i2, j2), p0);
                    norms.push(vec3.normalize(vec3.cross(e1, e2)));
                }
            }
            e1 = vec3.create();
            for ( t = 0; t < norms.length; ++t ) vec3.add(e1, norms[t]);
            vec3.normalize(e1);
            vertexNormal[3*k] = e1[0];
            vertexNormal[3*k + 1] = e1[1];
            vertexNormal[3*k + 2] = e1[2];
            ++k;
        }
	}
	var dx = [1, 1, 0, -1, -1, 0], dy = [0, 1, 1, 0, -1, -1];
    var e1, e2;
    var i, j, k = 0, t;
    for ( i = 0; i < ballResolution; ++i ){
        for ( j = 0; j < ballResolution; ++j ) {
            var p0 = getbPosition(i, j), norms = [];
            for ( t = 0; t < 6; ++t ) {
                var i1 = i + dy[t], j1 = j + dx[t];
                var i2 = i + dy[(t + 1) % 6], j2 = j + dx[(t + 1) % 6];
                if ( i1 >= 0 && i1 < ballResolution && j1 >= 0 && j1 < ballResolution &&
                     i2 >= 0 && i2 < ballResolution && j2 >= 0 && j2 < ballResolution ) {
                    e1 = vec3.subtract(getbPosition(i1, j1), p0);
                    e2 = vec3.subtract(getbPosition(i2, j2), p0);
                    norms.push(vec3.normalize(vec3.cross(e1, e2)));
                }
            }
            e1 = vec3.create();
            for ( t = 0; t < norms.length; ++t ) vec3.add(e1, norms[t]);
            vec3.normalize(e1);
            bvertexNormal[3*k] = e1[0];
            bvertexNormal[3*k + 1] = e1[1];
            bvertexNormal[3*k + 2] = e1[2];
            ++k;
        }
	}
}


var clothIndex, clothWireIndex, ballIndex, ballWireIndex;
function initMesh() {
    var i, j, k;
	
	var collision = new Array();
	
    vertexPosition = new Array(meshResolution*meshResolution*3);
    vertexBurnPosition = new Array(meshResolution*meshResolution*3);
    vertexNormal = new Array(meshResolution*meshResolution*3);
    vertexColor = new Array(meshResolution*meshResolution*3);
    vertexAlpha = new Array(meshResolution*meshResolution*1);
    clothIndex = new Array((meshResolution - 1)*(meshResolution - 1)*6);


    bvertexColor = new Array(ballResolution*ballResolution*3);
	bvertexPosition = new Array(ballResolution*ballResolution*3);
	ballIndex = new Array((ballResolution - 1)*(ballResolution-1)*6);
	bvertexNormal = new Array(ballResolution*ballResolution*3);
	bvertexAlpha = new Array(ballResolution*ballResolution*1);
    clothWireIndex = [];
	ballWireIndex = [];

    vertexVelocity = new Array(meshResolution*meshResolution);
    restLength[0] = 4.0/(meshResolution - 1);
    restLength[1] = Math.sqrt(2.0)*4.0/(meshResolution - 1);
    restLength[2] = 2.0*restLength[0];

   
    //Set Burning Parameter
    countR = 0.5;
   	count = 0.0;

    //set ball color
	for (i = 0; i < ballResolution; i++){
		for (j = 0; j < ballResolution; j++){
			bvertexPosition[3*(i*ballResolution + j)] = ballCenter[0] + radius * Math.cos(2*PI*((ballResolution-j)/ballResolution)) * Math.sin(2*PI*((ballResolution-i)/ballResolution));
			bvertexPosition[3*(i*ballResolution + j) + 1] = ballCenter[1] + radius * Math.sin(2*PI*((ballResolution-j)/ballResolution)) * Math.sin(2*PI*((ballResolution-i)/ballResolution));
			bvertexPosition[3*(i*ballResolution + j) + 2] = ballCenter[2] + radius * Math.cos(2*PI*((ballResolution-i)/ballResolution));
			setbColor(i,j, [0.3, 3.0, 0.3]); 
			if ( j < ballResolution - 1 )
                ballWireIndex.push(i*ballResolution + j, i*ballResolution + j + 1);
            if ( i < ballResolution - 1 )
                ballWireIndex.push(i*ballResolution + j, (i + 1)*ballResolution + j);
            if ( i < ballResolution - 1 && j < ballResolution - 1 )
                ballWireIndex.push(i*ballResolution + j, (i + 1)*ballResolution + j + 1);
			//setbAlpha(i,j, 1.0);
		}
	}

    for ( i = 0; i < meshResolution; ++i )
        for ( j = 0; j < meshResolution; ++j ) {
            setPosition(i, j, [-2.0 + 4.0*j/(meshResolution - 1), -2.0 + 4.0*i/(meshResolution - 1), 0.0]);
            setBurnPosition(i, j, [-2.0 + 4.0*j/(meshResolution - 1), -2.0 + 4.0*i/(meshResolution - 1), 0.0])
            setVelocity(i, j, vec3.create());
            setAlpha(i, j, 1.0);
            setbAlpha(i,j, 1.0);
            setColor(i, j, [.0, .0, 2.0]);

			var pos = getPosition(i,j);
			var key = generateKey(pos[0],pos[1],pos[2]);
			collision[key] = [i,j];
			
            if ( j < meshResolution - 1 )
                clothWireIndex.push(i*meshResolution + j, i*meshResolution + j + 1);
            if ( i < meshResolution - 1 )
                clothWireIndex.push(i*meshResolution + j, (i + 1)*meshResolution + j);
            if ( i < meshResolution - 1 && j < meshResolution - 1 )
                clothWireIndex.push(i*meshResolution + j, (i + 1)*meshResolution + j + 1);
        }

    computeNormals();

    k = 0;
    for ( i = 0; i < meshResolution - 1; ++i ){
        for ( j = 0; j < meshResolution - 1; ++j ) {
            clothIndex[6*k] = i*meshResolution + j;
            clothIndex[6*k + 1] = i*meshResolution + j + 1;
            clothIndex[6*k + 2] = (i + 1)*meshResolution + j + 1;
            clothIndex[6*k + 3] = i*meshResolution + j;
            clothIndex[6*k + 4] = (i + 1)*meshResolution + j + 1;            
            clothIndex[6*k + 5] = (i + 1)*meshResolution + j;
            ++k;
        }
	}
	k = 0;
    for ( i = 0; i < ballResolution - 1; ++i ){
        for ( j = 0; j < ballResolution - 1; ++j ) {
			ballIndex[6*k] = i*ballResolution + j;
            ballIndex[6*k + 1] = i*ballResolution + j + 1;
            ballIndex[6*k + 2] = (i + 1)*ballResolution + j + 1;
            ballIndex[6*k + 3] = i*ballResolution + j;
            ballIndex[6*k + 4] = (i + 1)*ballResolution + j + 1;            
            ballIndex[6*k + 5] = (i + 1)*ballResolution + j;
            ++k;
		}
	}


	//Start burning
	if(document.getElementById("bottomleft").checked){
		counti = 0;
		countj = 0;
	}
	if(document.getElementById("topleft").checked){
		counti = parseInt(meshResolution-1);
		countj = 0;
	}
	if(document.getElementById("topright").checked){
		counti = parseInt(meshResolution-1);
		countj = parseInt(meshResolution-1);
	}
	if(document.getElementById("bottomright").checked){
		counti = 0;
		countj = parseInt(meshResolution-1);
	}
	if(document.getElementById("center").checked){
		counti = parseInt(meshResolution/2);
		countj = parseInt(meshResolution/2);
	}
}


/*
 * KEY function: simulate one time-step using Euler's method
 */
 function getSpring(i, i1, p){
    var e = vec3.subtract(vec3.create(i),i1);
    var length = vec3.length(e);
	var fSpring = vec3.scale(e, K[p] * (restLength[p] - length) * (1/length));
    return fSpring;
}


 function getAccummulatedForce(i,j){
	var Fi = vec3.create(0,0,0);

		
	if((j+1) <meshResolution){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i,j+1),0));
	}
	if((j-1)>= 0){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i,j-1),0));
	}
	if((i+1) <meshResolution){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i+1,j),0));
	}
	if((i-1)>= 0){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i-1,j),0));
	}
	
	
	if((i+1)<meshResolution && (j+1)<meshResolution){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i+1,j+1),1));
	}
	if((i+1)<meshResolution && (j-1)>= 0){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i+1,j-1),1));
	}
	if((i-1)>= 0 && (j-1)>= 0){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i-1,j-1),1));
	}
	if((i-1)>= 0 && (j+1)<meshResolution){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i-1,j+1),1));
	}
	
	if((j+2) <meshResolution){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i,j+2),2));
	}
	if((j-2)>= 0){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i,j-2),2));
	}
	if((i+2) <meshResolution){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i+2,j),2));
	}
	if((i-2)>= 0){
		vec3.add(Fi,getSpring(getPosition(i,j),getPosition(i-2,j),2));
	}
	
	
	
	var c = 0.12;
	var h = 0.5;
	var p = 1.2;
	
	
	
	
	var v = Wind;
	var rad = Windangle*Math.PI*(1/180);
	//console.log(Math.cos(rad),Math.sin(rad));
	var rr = Math.random();
	var tt = c*h*p*v*v;
	
	// add gravity force
	var Fg = vec3.create();
	Fg[0] = tt*Math.sin(rad);
	Fg[1] = (-9.8)*mass;
	Fg[2] = tt*Math.cos(rad);
	vec3.add(Fi,Fg);
	
	// add Cd force
	var copyV = vec3.create(getVelocity(i,j));
	var Fd = vec3.create();
	Fd[0] = copyV[0]*(0-Cd);
	Fd[1] = copyV[1]*(0-Cd);
	Fd[2] = copyV[2]*(0-Cd);
	
	vec3.add(Fi,Fd);
	//console.log(Fd[0],Fd[1],Fd[2]);
	
	//add fluid force
	var n = getNormal(i,j);
	var n2 = getNormal(i,j);
	var v = getVelocity(i,j);
	var u = vec3.create(uf);
	
	vec3.subtract(u,v);
	vec3.scale(n2,Cv);
	var d = vec3.dot(n,u);
	vec3.scale(n2,d);
	vec3.add(Fi,n2);
	
	return Fi;
}

function generateKey(x, y, z) {
	var xkey = Math.floor(x / .1);
	var ykey = Math.floor(y / .1);
	var zkey = Math.floor(z / .1);
	//alert(xkey + " " + ykey + " " + zkey);
	return [xkey, ykey, zkey];
}

function simulate(stepSize) {
	var ball = vec3.create(ballCenter);
	var xp = BallX/10000;
	var yp = BallY/10000;
	var zp = BallZ/10000;
	ball[2] = ball[2] + zp;
	ball[1] = ball[1] + yp;
	ball[0] = ball[0] + xp;
	setbPosition([ball[0],ball[1],ball[2]]);
    for ( i = 0; i < meshResolution ; i++ )
        for ( j = 0; j < meshResolution; j++ ) {
				var Fi = getAccummulatedForce(i,j);
				//console.log(Fi[0],Fi[1],Fi[2]);
				vec3.scale(Fi,1/mass)
				vec3.scale(Fi,stepSize);
				var vnew = vec3.add(Fi,getVelocity(i,j));
				setVelocity(i,j,vnew);
        }
	var pi1 = getPosition(meshResolution-1,0);
	var pi2 = getPosition(meshResolution-1,meshResolution-1);
	var detect1 = getBurnPosition(counti,countj);	 

 	//var checked = document.getElementById("burn").checked;
	if (document.getElementById("burn").checked){
		for ( i = 0; i < meshResolution ; i=i+.5 ){
	    	for ( j = 0; j < meshResolution; j=j+.5 ){
	    		var temp = getBurnPosition(i,j);
	    		var circle = (temp[0]-detect1[0])*(temp[0]-detect1[0]) + (temp[1]-detect1[1])*(temp[1]-detect1[1]); 
	    		if ( circle <= countR*countR){
	    			if ( circle+0.1 > countR*countR)
	    				setColor(i, j,[0.0, 0.0, 0.0]);
	    			else if ( circle+0.2 > countR*countR)
	    				setColor(i, j,[2.3, 0.4, 0.0]);
	    			else if ( circle+0.3 > countR*countR)
	    				setColor(i, j,[2.3, 0.1, 0.0]);
	    			else if ( circle+0.5 > countR*countR)
	    				setColor(i, j,[2.3, 0.01, 0.0]);
	    			else
	    				setAlpha(i, j, 0.0);
	    		}
	    	}
	    }
		countR = countR + burningSpeed/1000.0;
	}

	if (document.getElementById("raindrop").checked){
		if (count%parseInt((1/rainingSpeed)*500) == 0){
			var dropR = 0.002;
	        for ( k = 0; k < 5; ++k ){
	        		var drops = getBurnPosition(parseInt(Math.random()*meshResolution), parseInt(Math.random()*meshResolution) );
					for ( i = 0; i < meshResolution ; i++ ){
				    	for ( j = 0; j < meshResolution; j++){
				    		var temp = getBurnPosition(i,j);
				    		var circle = (temp[0]-drops[0])*(temp[0]-drops[0]) + (temp[1]-drops[1])*(temp[1]-drops[1]); 
				    		if ( circle <= dropR*dropR){
				    			setColor(i, j,[0.0, 0.0, 1.0]);
				    		}
				    	}
				    }
			}
		}
		count++;
	}



     for ( i = 0; i < meshResolution ; i++ )
        for ( j = 0; j < meshResolution; j++ ) {
			var vv = getVelocity(i,j);
			vec3.scale(vv,stepSize);
			var oldpos = getPosition(i,j);
			var pnew = vec3.add(vv,oldpos);
			var key = generateKey(pnew[0], pnew[1], pnew[2]);
			var check = collision[key];
			//alert(i + " " + j + " " + collision[key]);
			if (check != undefined 
			&& !(Math.abs(check[0] - i) <= meshResolution/2 && Math.abs(check[1] - j) <= meshResolution/2)){
				//alert(i + " " + j + " " + collision[key]);
				var opposition = getPosition(check[0],check[1]);
				var old_vector = [oldpos[0] - opposition[0], oldpos[1] - opposition[1], oldpos[2] - opposition[2]];
				var new_vector = [pnew[0] - opposition[0], pnew[1] - opposition[1], pnew[2] - opposition[2]];
				var numerator = new_vector[0] + old_vector[0] + new_vector[1] + old_vector[1] + new_vector[2] + old_vector[2];
				var v = Math.sqrt(Math.pow(old_vector[0], 2) + Math.pow(old_vector[1], 2) + Math.pow(old_vector[2], 2));
				var w = Math.sqrt(Math.pow(pnew[0], 2) + Math.pow(pnew[1], 2) + Math.pow(pnew[2], 2));
				var result  = Math.acos(numerator/ (v*w)) * 180 / PI;
				
				/*
				normal = getNormal(check[0],check[1]);
				var n = Math.sqrt(Math.pow(normal[0], 2) + Math.pow(normal[1], 2) + Math.pow(normal[2], 2));	
				var numerator = new_vector[0] + normal[0] + new_vector[1] + normal[1] + new_vector[2] + normal[2];
				result1 = Math.acos(numerator/ (n*w)) * 180 / PI;
				var numerator = old_vector[0] + normal[0] + old_vector[1] + normal[1] + old_vector[2] + normal[2];
				result2 = Math.acos(numerator/ (n*w)) * 180 / PI;
				
				var cross = true;
				if ((result1 < 90 && result2 < 90) || (result1 >= 90 && result2 >= 90)){
					cross = false;
				}
				
				if ((result > 100 && !cross) || (result <= 100 && cross)){
					setVelocity(i,j, [0,0,0]);
				}
				else{
					delete collision[oldpos[0], oldpos[1], oldpos[2]];
					collision[key] = [i,j];
				}
				*/
				if (result > 90){
					setVelocity(i,j, [0,0,0]);
				}
				else{
					delete collision[oldpos[0], oldpos[1], oldpos[2]];
					collision[key] = [i,j];
				}
			}
			else {
				delete collision[oldpos[0], oldpos[1], oldpos[2]];
				collision[key] = [i,j];
				//alert(i + " " + j + " " + collision[key]);
			}
			
			if(Math.sqrt(Math.pow(pnew[0] - ballCenter[0], 2) + Math.pow(pnew[1] - ballCenter[1], 2) + Math.pow(pnew[2] - ballCenter[2], 2)) > (radius + .02)){
				setPosition(i,j,pnew);
			}
			else{
				pnew = getPosition(i,j);
				setVelocity(i,j,vec3.create(0,0,0));
				ballVelocity = [xp,yp,zp];
				var direction = [xp + (pnew[0] - ball[0])/repelIntensity,yp + (pnew[1] - ball[1])/repelIntensity,zp + (pnew[2] - ball[2])/repelIntensity];
				vec3.add(pnew, direction);
				setPosition(i,j,pnew);
			}
			setPosition(meshResolution-1,0,pi1);
			setPosition(meshResolution-1,meshResolution-1,pi2);	
    	}



    //console.log(stepSize);
		
}

