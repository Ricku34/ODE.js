const fs = require('fs');
const vm = require('vm');
const sandbox = {};
const script = new vm.Script(fs.readFileSync(process.argv[2]));

const context = new vm.createContext(sandbox);
script.runInContext(context);

if(Object.keys(sandbox).length && sandbox[Object.keys(sandbox)[0]].Vertices) {
    var vertices = sandbox[Object.keys(sandbox)[0]].Vertices;
    for(var i=0;i<vertices.length/3;i++)
    {
        var y = vertices[(i*3)+1];
        vertices[(i*3)+1] = vertices[(i*3)+2];
        vertices[(i*3)+2] = y;
    }

    var normals = sandbox[Object.keys(sandbox)[0]].Normals;
    for(var i=0;i<normals.length/3;i++)
    {
        var y = normals[(i*3)+1];
        normals[(i*3)+1] = normals[(i*3)+2];
        normals[(i*3)+2] = y;
    }

    var indices = sandbox[Object.keys(sandbox)[0]].Indices;
    for(var i=0;i<indices.length/3;i++)
    {
        var y = indices[(i*3)+1];
        indices[(i*3)+1] = indices[(i*3)+2];
        indices[(i*3)+2] = y;
    }
    
    process.stdout.write(`this.${Object.keys(sandbox)[0]} = {
    Vertices : ${JSON.stringify(vertices)},
    Normals  : ${JSON.stringify(normals)},
    Indices : ${JSON.stringify(indices)}
    
}
`);
}

