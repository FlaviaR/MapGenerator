export class NoisyEdge {

    constructor(verticesList) {
        // list of vertices that compose the noisy edge
        this.vertices = verticesList
    }

    print() {
        console.log("-----------------------------")
        console.log("Vertices: ", this.vertices)
    }

}
