let gl;
let depth = 5;
let numTriangles = Math.pow(3, depth);
let numVertices = 3 * numTriangles;
let points = [];
let index = 0;

function main() {
    let canvas = document.getElementById("my-canvas");
    const depthslide = document.getElementById("depth");
    const el = document.getElementById("my-canvas");



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
            //let start = [-0.8, -0.6, 0.7, -0.6, -0.5, 0.7];
            let start = [];

            //createGasket(vertices, 2000);
            //divide_triangle(start, depth);

            // Create WebGL Buffer and Populate
            let vertexBuff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

            // Copy the vertices data
            //gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(points), gl.STATIC_DRAW);

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
            /*gl.drawArrays(
                            gl.POINTS,          // draw only points
                            0,                  // starting index in the array
                            vertices.length/2); // number of vertices to draw*/

            el.addEventListener('click', event => {
                let cx = event.clientX - canvas.offsetLeft;
                let cy = event.clientY - canvas.offsetTop;

                if (start.length < 4) {
                    x = (((2 * cx) / 512) - 1);
                    start.push(x);
                    y = -(((2 * cy) / 512) - 1);
                    start.push(y);
                } else if (start.length === 4) {
                    x = (((2 * cx) / 512) - 1);
                    start.push(x);
                    y = -(((2 * cy) / 512) - 1);
                    start.push(y);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    divide_triangle(start, depth);
                    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(points), gl.STATIC_DRAW);
                    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
                } else {
                    // do nothing
                }
            });

            depthslide.addEventListener('change', event => {
                depth = event.target.value;
                update();
            });

            window.addEventListener('keydown', event => {
                if(event.keyCode === 39) {
                    start[0] += 0.01;
                    start[2] += 0.01;
                    start[4] += 0.01;
                    update();
                }
                if(event.keyCode === 37) {
                    start[0] -= 0.01;
                    start[2] -= 0.01;
                    start[4] -= 0.01;
                    update();
                }
                if(event.keyCode === 40) {
                    start[1] -= 0.01;
                    start[3] -= 0.01;
                    start[5] -= 0.01;
                    update();
                }
                if(event.keyCode === 38) {
                    start[1] += 0.01;
                    start[3] += 0.01;
                    start[5] += 0.01;
                    update();
                }
            });

            //gl.drawArrays(gl.TRIANGLES, 0, numVertices);

            function update() {
                numTriangles = Math.pow(3, depth);
                numVertices = 3 * numTriangles;
                points = [];
                index = 0;
                divide_triangle(start, depth);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(points), gl.STATIC_DRAW);
                gl.drawArrays(gl.TRIANGLES, 0, numVertices);
            }

        });

    function divide_triangle(pointArr, count) {
        // three points of the triangle
        let a = [pointArr[0], pointArr[1]];
        let b = [pointArr[2], pointArr[3]];
        let c = [pointArr[4], pointArr[5]];
        if (count > 0) {
            // midpoints of sides
            let v0 = [((a[0] + b[0]) / 2), ((a[1] + b[1]) / 2)];
            let v1 = [((a[0] + c[0]) / 2), ((a[1] + c[1]) / 2)];
            let v2 = [((b[0] + c[0]) / 2), ((b[1] + c[1]) / 2)];
            // subdivide all but middle
            divide_triangle([a[0], a[1], v0[0], v0[1], v1[0], v1[1]], count - 1);
            divide_triangle([c[0], c[1], v1[0], v1[1], v2[0], v2[1]], count - 1);
            divide_triangle([b[0], b[1], v2[0], v2[1], v0[0], v0[1]], count - 1);
        } else {
            make_triangle(a, b, c); // end of recursion
        }
    }

    function make_triangle(a, b, c) {
        points[index] = a[0];
        index++;
        points[index] = a[1];
        index++;
        points[index] = b[0];
        index++;
        points[index] = b[1];
        index++;
        points[index] = c[0];
        index++;
        points[index] = c[1];
        index++;
    }

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