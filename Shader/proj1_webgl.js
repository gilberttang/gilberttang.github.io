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
 * Initializing object geometries
 */
var meshes, meshTransforms;
var currentMesh, currentTransform;
function initMesh() {
    // Load object meshes
    meshes = [
        new OBJ.Mesh(teapot_mesh_str),
        new OBJ.Mesh(bunny_mesh_str)
    ];
    OBJ.initMeshBuffers(gl, meshes[0]);
    OBJ.initMeshBuffers(gl, meshes[1]);

    currentMesh = meshes[0];

    meshTransforms = [mat4.create(), mat4.create()];

    // Set per-object transforms to make them better fitting the viewport
    mat4.identity(meshTransforms[0]);
    mat4.rotateX(meshTransforms[0], -1.5708);
    mat4.scale(meshTransforms[0], [0.15, 0.15, 0.15]);        

    mat4.identity(meshTransforms[1]);
    mat4.translate(meshTransforms[1], [0.5, 0, 0]);

    currentTransform = meshTransforms[0];
}


/*
 * Initializing shaders 
 */
var shaderPrograms;
var currentProgram;
var lightProgram;
function createShader(vs_id, fs_id) {
    var shaderProg = createShaderProg(vs_id, fs_id);

    shaderProg.vertexPositionAttribute = gl.getAttribLocation(shaderProg, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProg.vertexPositionAttribute);
    shaderProg.vertexNormalAttribute = gl.getAttribLocation(shaderProg, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProg.vertexNormalAttribute);        

    shaderProg.pMatrixUniform = gl.getUniformLocation(shaderProg, "uPMatrix");
    shaderProg.mvMatrixUniform = gl.getUniformLocation(shaderProg, "uMVMatrix");
    shaderProg.nMatrixUniform = gl.getUniformLocation(shaderProg, "uNMatrix");
    shaderProg.lightPosUniform = gl.getUniformLocation(shaderProg, "uLightPos");
    shaderProg.lightPowerUniform = gl.getUniformLocation(shaderProg, "uLightPower");
    shaderProg.kdUniform = gl.getUniformLocation(shaderProg, "uDiffuseColor");
    shaderProg.ambientUniform = gl.getUniformLocation(shaderProg, "uAmbient");    

    return shaderProg;
}

function initShaders() {
    shaderPrograms = [
        createShader("shader-vs", "shader-fs0"),
        createShader("shader-vs", "shader-fs1-1"),
        createShader("shader-vs", "shader-fs1-2"),
        createShader("shader-vs", "shader-fs1-3"),
        createShader("shader-vs", "shader-fs2"),
        createShader("shader-vs", "shader-fs3-1"),
        createShader("shader-vs", "shader-fs3-2"),
        createShader("shader-vs", "shader-fs4"),
    ];
    currentProgram = shaderPrograms[0];

    //
    // Declaring shading model specific uniform variables
    //

    // Phong shading
    shaderPrograms[5].exponentUniform = gl.getUniformLocation(shaderPrograms[5], "uExponent");
    gl.useProgram(shaderPrograms[5]);
    gl.uniform1f(shaderPrograms[5].exponentUniform, 50.0);    

    // Blinn-Phong shading
    shaderPrograms[6].exponentUniform = gl.getUniformLocation(shaderPrograms[6], "uExponent");
    gl.useProgram(shaderPrograms[6]);
    gl.uniform1f(shaderPrograms[6].exponentUniform, 50.0);

    // Microfacet shading
    shaderPrograms[7].iorUniform = gl.getUniformLocation(shaderPrograms[7], "uIOR");
    shaderPrograms[7].betaUniform = gl.getUniformLocation(shaderPrograms[7], "uBeta");
    gl.useProgram(shaderPrograms[7]);
    gl.uniform1f(shaderPrograms[7].iorUniform, 5.0);
    gl.uniform1f(shaderPrograms[7].betaUniform, 0.2);

    // Initializing light source drawing shader
    lightProgram = createShaderProg("shader-vs-light", "shader-fs-light");
    lightProgram.vertexPositionAttribute = gl.getAttribLocation(lightProgram, "aVertexPosition");
    gl.enableVertexAttribArray(lightProgram.vertexPositionAttribute);
    lightProgram.pMatrixUniform = gl.getUniformLocation(lightProgram, "uPMatrix");
}


/*
 * Initializing buffers
 */
var lightPositionBuffer;
function initBuffers() {
    lightPositionBuffer = gl.createBuffer();
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
var lightPower = 5.0;                           // "Power" of the light source

// Common parameters for shading models
var diffuseColor = [0.2392, 0.5216, 0.7765];    // Diffuse color
var ambientIntensity = 0.1;                     // Ambient

// Animation related variables
var rotY = 0.0;                                 // object rotation
var rotY_light = 0.0;                           // light position rotation

function setUniforms(prog) {
    gl.uniformMatrix4fv(prog.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(prog.mvMatrixUniform, false, mvMatrix);

    var nMatrix = mat4.transpose(mat4.inverse(mvMatrix));
    gl.uniformMatrix4fv(prog.nMatrixUniform, false, nMatrix);

    gl.uniform3fv(prog.lightPosUniform, lightPos);
    gl.uniform1f(prog.lightPowerUniform, lightPower);
    gl.uniform3fv(prog.kdUniform, diffuseColor);
    gl.uniform1f(prog.ambientUniform, ambientIntensity);
}

var draw_light = false;
function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(35, gl.viewportWidth/gl.viewportHeight, 0.1, 1000.0, pMatrix);

    mat4.identity(lightMatrix);
    mat4.translate(lightMatrix, [0.0, -1.0, -7.0]);
    mat4.rotateX(lightMatrix, 0.3);
    mat4.rotateY(lightMatrix, rotY_light);

    lightPos.set([0.0, 2.5, 3.0]);
    mat4.multiplyVec3(lightMatrix, lightPos);

    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, -1.0, -7.0]);
    mat4.rotateX(mvMatrix, 0.3);
    mat4.rotateY(mvMatrix, rotY);
    mat4.multiply(mvMatrix, currentTransform);

    gl.useProgram(currentProgram);
    setUniforms(currentProgram);   

    gl.bindBuffer(gl.ARRAY_BUFFER, currentMesh.vertexBuffer);
    gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, currentMesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, currentMesh.normalBuffer);
    gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, currentMesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, currentMesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, currentMesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    if ( draw_light ) {
        gl.useProgram(lightProgram);
        gl.uniformMatrix4fv(lightProgram.pMatrixUniform, false, pMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, lightPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(lightPos), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(lightProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

var lastTime = 0;
var rotSpeed = 60, rotSpeed_light = 60;
var animated = false, animated_light = false;
function tick() {
    requestAnimationFrame(tick);

    var timeNow = new Date().getTime();
    if ( lastTime != 0 ) {
      var elapsed = timeNow - lastTime;
      if ( animated )
        rotY += rotSpeed*0.0175*elapsed/1000.0;
      if ( animated_light )
        rotY_light += rotSpeed_light*0.0175*elapsed/1000.0;
    }
    lastTime = timeNow;        

    drawScene();
}

function webGLStart() {
    var canvas = $("#canvas0")[0];

    initGL(canvas);
    initMesh();
    initShaders();
    initBuffers();

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.enable(gl.DEPTH_TEST);

    currentProgram = shaderPrograms[0];
    tick();
}
