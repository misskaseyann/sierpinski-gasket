let gl;

function main() {
    let canvas = document.getElementById("my-canvas");

    let vertices = [];

    let index = 0;

    let depth = 1;

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
            let start = [-0.8, -0.6, 0.7, -0.6, -0.5, 0.7];

            //createGasket(vertices, 2000);
            divide_triangle(start, depth);

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
            /*gl.drawArrays(
                            gl.POINTS,          // draw only points
                            0,                  // starting index in the array
                            vertices.length/2); // number of vertices to draw*/
            gl.drawArrays(gl.TRIANGLES, 0, Math.pow(3, depth));

        });

    function divide_triangle(pointsArr, depth) {
        if (depth > 0) {
            // midpoints of sides
            let v0 = (pointsArr[0] + pointsArr[1]) / 2;
            let v1 = (pointsArr[0] + pointsArr[2]) / 2;
            let v2 = (pointsArr[1] + pointsArr[2]) / 2;
            // subdivide all but middle
            divide_triangle(pointsArr[0], v0, v1, depth -1);
            divide_triangle(pointsArr[2], v1, v2, depth - 1);
            divide_triangle(pointsArr[1], v2, v0, depth - 1);
        } else {
            make_triangle(pointsArr[0], pointsArr[1], pointsArr[2]); // end of recursion
        }
    }

    function make_triangle(a, b, c) {
        vertices.push(a);
        vertices.push(b);
        vertices.push(c);
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

    /*function sierpinskiTriangle(inputArr, depth) {
        depth = depth - 1;
        // three points of triangle
        let a = [inputArr[0], inputArr[1]];
        let b = [inputArr[2], inputArr[3]];
        let c = [inputArr[4], inputArr[5]];
        // three midpoints of triangle
        let r = [((a[0] + b[0]) / 2), ((a[1] + b[1]) / 2)];
        let s = [((b[0] + c[0]) / 2), ((b[1] + c[1]) / 2)];
        let t = [((a[0] + c[0]) / 2), ((a[1] + c[1]) / 2)];
        //inputArr.push([a[0], a[1], r[0], r[1], t[0], t[1]]);
        let art = [a[0], a[1], r[0], r[1], t[0], t[1]];
        vertices.push(...art);
        //inputArr.push([r[0], r[1], b[0], b[1], s[0], s[1]]);
        let rbs = [r[0], r[1], b[0], b[1], s[0], s[1]];
        vertices.push(...rbs);
        //inputArr.push([t[0], t[1], s[0], s[1], c[0], c[1]]);
        let tsc = [t[0], t[1], s[0], s[1], c[0], c[1]];
        vertices.push(...tsc);
        console.log(depth);
        if (depth > 0) {
            sierpinskiTriangle(art, depth);
            sierpinskiTriangle(rbs, depth);
            sierpinskiTriangle(tsc, depth);
        }
    }*/

    const depthslide = document.getElementById("depth");
    depthslide.addEventListener('change', event => {
        console.log("New angle is ", event.target.value);
    });
}