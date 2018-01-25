let gl;

function main() {
    let canvas = document.getElementById("my-canvas");

    // setupWebGL is defined in webgl-utils.js
    gl = WebGLUtils.setupWebGL(canvas);

    // Load the shader pair. 2nd arg is vertex shader, 3rd arg is fragment shader.
    ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
        .then( (prog) => {

            gl.useProgram(prog);

            // Use black RGB = (0,0,0) for the clear color
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            // Set up the 2D view port (0,0) is upper left (512,512) is lower right corner.
            gl.viewport(0, 0, canvas.width, canvas.height);

            // Clear the color buffer.
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Initialize a JS array; -1 <= x <= 1
            // x1, y1, x2, y2, x3, y3
            let vertices = [-0.8, -0.6, 0.7, -0.6, -0.5, 0.7];

            createGasket(vertices, 2000);

            // Create WebGL Buffer and Populate
            let vertexBuff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

            // Copy the vertices data
            gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

            // Obtain Reference to Vertex Shader Attribute
            // vertexPos is an attribute name in vertex shader.
            let posAttr = gl.getAttribLocation(prog, "vertexPos");
            gl.enableVertexAttribArray(posAttr);

            // Specify Layout of Shader Attribute
            gl.vertexAttribPointer(posAttr,
                                    2,          // each attribute as TWO components (x,y)
                                    gl.FLOAT,   // each component is a 32-bit float
                                    false,      // data does not require normalization into "unit" range
                                    0,          // stride=0: the attributes are tightly packed
                                    0);         // offset=0: the first byte of the buffer is the actual data
            gl.drawArrays(
                            gl.POINTS,          // draw only points
                            0,                  // starting index in the array
                            vertices.length/2); // number of vertices to draw
        });

    function createGasket(inputArr, count) {
        // random coordinate between -1 and 1
        let p = [0, 0];
        let c = 0;
        while (c < count) {
            let v = 0;
            // select a random vertices
            switch(Math.floor(Math.random() * 3)) {
                case 0:
                    v = [inputArr[0], inputArr[1]];
                    break;
                case 1:
                    v = [inputArr[2], inputArr[3]];
                    break;
                case 2:
                    v = [inputArr[4], inputArr[5]];
                    break;
                default:
                    v = [inputArr[0], inputArr[1]];
                    break;
            }
            // point halfway between p and v
            let q = [((p[0] + v[0]) / 2), ((p[1] + v[1]) / 2)];
            inputArr.push(q[0]);
            inputArr.push(q[1]);
            p = q;
            c++;
        }
    }
}