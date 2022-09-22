"use strict"

// createShader program
function createShader(gl, type, source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}


// GLSL Program
function createProgram(gl, vertexShader, fragmentShader){
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success){
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

// SET COLOR FUNCTION
function setColors(gl){
    // 2 random colors
    var r1 = Math.random();
    var g1 = Math.random();
    var b1 = Math.random();

    var r2 = Math.random();
    var g2 = Math.random();
    var b2 = Math.random();

    // put those 2 colors into bufferData
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(
            [   r1, g1, b1, 1,
                r1, g1, b1, 1,
                r1, g1, b1, 1,
                r2, g2, b2, 1,
                r2, g2, b2, 1,
                r2, g2, b2, 1
            ]
        ), gl.STATIC_DRAW);
}

// MAIN FUNCTION
function main(){
    var canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl");
    // get shader source from the html file
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
    if(!gl){
        console.log("HEHE");
        return;
    }

    // create vertex and fragment shader
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    // call the createProgram function
    var program = createProgram(gl, vertexShader, fragmentShader); // linking those 2 shaders into a 'program'
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position"); // look up position data from vertex shader
    var colorAttributeLocation = gl.getAttribLocation(program, "a_color"); // look up color attr
    var matrixLocation = gl.getUniformLocation(program, "u_matrix"); // lookup uniforms

    var positionBuffer = gl.createBuffer(); // Attributes get their data from buffers so we need to create a buffer
    var colorBuffer = gl.createBuffer();
    

    // three 2d points
    var positions = [
        0, 0,
        0, 0.5,
        0.7, 0,
        -0.7, 0,
        0, -0.5,
        0, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW); // gl.bufferData copies positions to positionBuffer

    // adding colors to the gl
    setColors(gl);

    // RENDERING
    // clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // tell the gl to use our program (pair of shaders)
    gl.useProgram(program);
    // enable vertex attriib (position)
    gl.enableVertexAttribArray(positionAttributeLocation);
    // enable vertex attrib (color)
    gl.enableVertexAttribArray(colorAttributeLocation);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // bind positionAttrib to the buffer before supplying data to the buffer (through the bind point)
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer); // bind the color buffer

     // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;   // 2 components per iteration ( from a_position (0, 0 ,0, 1) -> x=0, y=0)
    var type = gl.FLOAT; // 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // Tell the color attribute how to get data out of colorBuffer
    var size = 4;   // 4 components per iteration ( from a_position (0, 0 ,0, 1) -> x=0, y=0, z= 0, l = 1)
    var type = gl.FLOAT; // 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);

    // Compute the matrix
    var matrix = m3.projection()

    // ask webGl to execute our GLSL program (draw)
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
}

main();