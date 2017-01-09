/*
 * Rendering control
 */
function changeResolution(sel) {
    var id = parseInt(sel.value, 10);

    var width = 0, height = 0;
    switch ( id ) {
        case 0:
            width = 480; height = 640; break;

        case 1:
            width = 600; height = 800; break;

        case 2:
            width = 720; height = 960; break;

        default:
            alert("Unknown resolution!");
    }
	XXX=width;
    if ( width > 0 ) {
        var canvas = $("#canvas0")[0];
        
        canvas.width = width; 
        canvas.height = height;

        gl.viewportWidth = width;
        gl.viewportHeight = height;
    }
}

function changeMode(value) {
    drawMode = parseInt(value, 10);
}

function changeRotatingState(ifRotating) {
    rotating = ifRotating;
    $("#sliderBar").prop("disabled", !rotating);
}

function updateSlider(sliderAmount) {
    $("#sliderAmount").html(sliderAmount*10);
    rotSpeed = sliderAmount*10.0;
}

function changeAnimatedLightState(ifAnimated) {
    rotating_light = ifAnimated;
    $("#sliderBarLight").prop("disabled", !rotating_light);
}

function updateSliderLight(sliderAmount) {
    var value = sliderAmount*10.0;
    $("#sliderAmountLight").html(value);
    rotSpeed_light = value;
}

function updateSliderMass(sliderAmount) {
    var value = sliderAmount*0.1;
    $("#sliderAmountMass").html(value.toFixed(1));
    mass = value;
}

function updateSliderK0(sliderAmount) {
    var value = sliderAmount*1000.0;
    $("#sliderAmountK0").html(sliderAmount);
    K[0] = value;
}

function updateSliderK1(sliderAmount) {
    var value = sliderAmount*1000.0;
    $("#sliderAmountK1").html(sliderAmount);
    K[1] = value;
}

function updateSliderK2(sliderAmount) {
    var value = sliderAmount*1000.0;
    $("#sliderAmountK2").html(sliderAmount);
    K[2] = value;
}

function updateSliderCd(sliderAmount) {
    var value = sliderAmount*0.1;
    $("#sliderAmountCd").html(value.toFixed(1));
    Cd = value;
}

function updateSliderCv(sliderAmount) {
    var value = sliderAmount*0.1;
    $("#sliderAmountCv").html(value.toFixed(1));
    Cv = value;
}
function updateSliderWind(sliderAmount) {
    var value = sliderAmount;
    $("#sliderAmountWind").html(value);
	Wind= value;
}
function updateSliderWindangle(sliderAmount) {
    var value = sliderAmount;
    $("#sliderAmountWindangle").html(value);
	Windangle= value;
}

function updateSliderCameraDepth(sliderAmount) {
    var value = sliderAmount;
    $("#sliderAmountCameraDepth").html(value);
    CameraDepth = value;
}


function updateSliderBallX(sliderAmount) {
    var value = sliderAmount;
    $("#sliderAmountBallX").html(value);
    BallX = value;
}
function updateSliderBallY(sliderAmount) {
    var value = sliderAmount;
    $("#sliderAmountBallY").html(value);
    BallY = value;
}
function updateSliderBallZ(sliderAmount) {
    var value = sliderAmount;
    $("#sliderAmountBallZ").html(value);
    BallZ = value;
}
function updateSliderBallR(sliderAmount) {
    var value = sliderAmount;
    $("#sliderAmountBallR").html(value);
    radius = value/10;
}
function updateSliderBurningSpeed(sliderAmount){
    var value = sliderAmount;
    $("#sliderAmountBurningSpeed").html(value);
    burningSpeed = value;
}
function updateSliderRainingSpeed(sliderAmount){
    var value = sliderAmount;
    $("#sliderAmountRainingSpeed").html(value);
    rainingSpeed = value;
}
/*
 * Animation control
 */
function changeMeshResolution(value) {
    var id = parseInt(value, 10);
    switch ( id ) {
    case 1:
        meshResolution = 15; break;
    case 2:
        meshResolution = 25; break;
    case 3:
        meshResolution = 35; break;
    }
    initMesh();
    initBuffers(false);
}

function changeAnimatedState(value) {
    animated = value;
}

/*
 * Page-load handler
 */
$(function() {
    webGLStart();
});
