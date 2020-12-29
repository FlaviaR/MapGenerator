export class NoisyPolygon {

    constructor(center, edges) {
        // this center's index within centerList
        this.center = center
        // list of noisy edges
        this.edges = edges
    }

    print() {
        console.log("-------------- ---------------")
        console.log("Center: ", this.center)
        console.log("Edges: ", this.edges)
    }

}
