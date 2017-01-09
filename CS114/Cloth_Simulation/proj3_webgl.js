/* 
 * Initializing GL object
 */
var gl;
function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if ( !gl ) alert("Could not initialise WebGL, sorry :-(");

    gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, validateNoneOfTheArgsAreUndefined);
}


/*
 * Initializing shaders 
 */
var shaderProgram;
function createShader(vs_id, fs_id) {
    var shaderProg = createShaderProg(vs_id, fs_id);

    shaderProg.vertexPositionAttribute = gl.getAttribLocation(shaderProg, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProg.vertexPositionAttribute);
    shaderProg.vertexNormalAttribute = gl.getAttribLocation(shaderProg, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProg.vertexNormalAttribute);
    shaderProg.vertexColorAttribute = gl.getAttribLocation(shaderProg, "aVertexColor");
    gl.enableVertexAttribArray(shaderProg.vertexColorAttribute);
    shaderProg.vertexAlphaAttribute = gl.getAttribLocation(shaderProg, "aVertexAlpha");
    gl.enableVertexAttribArray(shaderProg.vertexAlphaAttribute);
  
  

    shaderProg.pMatrixUniform = gl.getUniformLocation(shaderProg, "uPMatrix");
    shaderProg.mvMatrixUniform = gl.getUniformLocation(shaderProg, "uMVMatrix");
    shaderProg.nMatrixUniform = gl.getUniformLocation(shaderProg, "uNMatrix");
    shaderProg.lightPosUniform = gl.getUniformLocation(shaderProg, "uLightPos");
    //shaderProg.vertexColorAttribute = gl.getUniformLocation(shaderProg, "aVertexColor");

    return shaderProg;
}

function initShaders() {
    shaderProgram = createShader("shader-vs", "shader-fs");
    gl.useProgram(shaderProgram);    
}


/*
 * Initializing and updating buffers
 */
var vertexPositionBuffer, vertexNormalBuffer, indexBuffer, vertexColorBuffer, wireIndexBuffer, vertexAlphaBuffer, 
bVertexPositionBuffer, bVertexNormalBuffer, bvertexColorBuffer, index2Buffer, bvertexAlphaBuffer;

function initBuffers(createBuffers) {
    if ( createBuffers ) {
        //Cloth
        vertexPositionBuffer = gl.createBuffer();
        vertexNormalBuffer = gl.createBuffer();        
        indexBuffer = gl.createBuffer();
        wireIndexBuffer = gl.createBuffer(); 
        //color
        vertexColorBuffer = gl.createBuffer();
        //alpha 
        vertexAlphaBuffer = gl.createBuffer(); 
    
        //Ball
		bVertexPositionBuffer = gl.createBuffer();	
		bVertexNormalBuffer = gl.createBuffer();
        bvertexColorBuffer = gl.createBuffer();
        bvertexAlphaBuffer = gl.createBuffer();
		index2Buffer = gl.createBuffer();
		ballWireIndexBuffer = gl.createBuffer(); 
	}

    //Cloth
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexPosition), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexNormal), gl.DYNAMIC_DRAW);
    //color
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexColor), gl.DYNAMIC_DRAW);
    //alpha
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexAlphaBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexAlpha), gl.DYNAMIC_DRAW);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(clothIndex), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(clothWireIndex), gl.STATIC_DRAW);

    //Ball
	gl.bindBuffer(gl.ARRAY_BUFFER, bVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(bvertexPosition), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(bvertexNormal), gl.DYNAMIC_DRAW);  
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ballWireIndexBuffer);	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(ballWireIndex), gl.STATIC_DRAW);
    //Ball color
    gl.bindBuffer(gl.ARRAY_BUFFER, bvertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(bvertexColor), gl.DYNAMIC_DRAW);
    //Ball Alpha
    gl.bindBuffer(gl.ARRAY_BUFFER, bvertexAlphaBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(bvertexAlpha), gl.DYNAMIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index2Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(ballIndex), gl.STATIC_DRAW); 
}

function updateBuffers() {
    //clothes
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexPosition), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexNormal), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexColor), gl.DYNAMIC_DRAW);

    //alpha
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexAlphaBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexAlpha), gl.DYNAMIC_DRAW);
	
    //ball
	gl.bindBuffer(gl.ARRAY_BUFFER, bVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(bvertexPosition), gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, bVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(bvertexNormal), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bvertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(bvertexColor), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bvertexAlphaBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(bvertexAlpha), gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ballWireIndexBuffer);	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(ballWireIndex), gl.STATIC_DRAW);
}

function resetMesh() {
    initMesh();
    initBuffers(false);
}


/*
 * Main rendering code 
 */

// Basic rendering parameters
var mvMatrix = mat4.create();                   // Model-view matrix for the main object
var pMatrix = mat4.create();                    // Projection matrix

// Lighting control
var lightMatrix = mat4.create();                // Model-view matrix for the point light source
var lightPos = vec3.create();                   // Camera-space position of the light source
var alpha = vec3.create();

// Animation related variables
var rotY = 0.3;                                 // object rotation
var rotY_light = 0.0;                           // light position rotation

// Color

function setUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var nMatrix = mat4.transpose(mat4.inverse(mvMatrix));
    gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);
    gl.uniform3fv(shaderProgram.lightPosUniform, lightPos);

}

var drawMode;
var CameraDepth = -10;
function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(35, gl.viewportWidth/gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(lightMatrix);
    mat4.translate(lightMatrix, [0.0, 0.5, -10.0]);
    //mat4.rotateX(lightMatrix, 0.3);
    mat4.rotateY(lightMatrix, rotY_light);

    lightPos.set([0.0, 2.5, 5.0]);
    mat4.multiplyVec3(lightMatrix, lightPos);

    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.5, CameraDepth]);
    // $("#sliderAmountCameraDepth").html(value);
   // mat4.translate(mvMatrix, [0.0, 0.5, parseFloat(document.getElementById("sliderAmountCameraDepth").value)]);
    //mat4.rotateX(mvMatrix, 0.3);
    mat4.rotateY(mvMatrix, rotY);

    setUniforms();
    
    //Cloth
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    //Color
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

    //Alpha
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexAlphaBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexAlphaAttribute, 1, gl.FLOAT, false, 0, 0);
  




   var checked = document.getElementById("burn").checked;
    if (checked){
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
    }


    if ( drawMode == 0 ) {
        // Normal mode
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);   
        gl.drawElements(gl.TRIANGLES, clothIndex.length, gl.UNSIGNED_SHORT, 0);
    }
    else {
        // Wire-frame mode
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireIndexBuffer);        
        gl.drawElements(gl.LINES, clothWireIndex.length, gl.UNSIGNED_SHORT, 0);
    }
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);	


    //Ball
	gl.bindBuffer(gl.ARRAY_BUFFER, bVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, bVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, bvertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, bvertexAlphaBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexAlphaAttribute, 1, gl.FLOAT, false, 0, 0);
   

	
	if ( drawMode == 0 ) {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index2Buffer);        
        gl.drawElements(gl.TRIANGLES, ballIndex.length, gl.UNSIGNED_SHORT, 0);
    }
    else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ballWireIndexBuffer);        
        gl.drawElements(gl.LINES, ballWireIndex.length, gl.UNSIGNED_SHORT, 0);
        // Wire-frame mode
    }
}

var lastTime = 0;
var rotSpeed = 60, rotSpeed_light = 60;
var rotating = false, rotating_light = false;
var animated = true;
function tick() {
    requestAnimationFrame(tick);

    var timeNow = new Date().getTime();
    if ( lastTime != 0 ) {
      var elapsed = timeNow - lastTime;
      if ( rotating )
        rotY += rotSpeed*0.0175*elapsed/1000.0;
      if ( rotating_light )
        rotY_light += rotSpeed_light*0.0175*elapsed/1000.0;
    }
    lastTime = timeNow;        

    drawScene();

    if ( animated ) {
        var timeStep = 0.001;
        var n = Math.ceil(0.01/timeStep);
        for ( var i = 0; i < n; ++i ) simulate(timeStep);
        computeNormals();
        updateBuffers();
    }
}

function webGLStart() {
    var canvas = $("#canvas0")[0];


    meshResolution = 25;
    mass = 1.0;
    restLength = vec3.create();
    K = vec3.create([25000.0, 25000.0, 25000.0]);
    Cd = 0.5;
    uf = vec3.create([0.0, 0.0, 1.0]);
    Cv = 0.5;  
	Wind = 15;
	Windangle = 0;
	BallX = 0;
	XXX=600;
	BallY=0;
	BallZ=0;
	radius = .4;
    initGL(canvas);
    initShaders();

    initMesh();
    initBuffers(true);

    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    drawMode = 0;

    tick();
}