import { Delaunay } from "d3-delaunay";

export class VoronoiObj {
    constructor(points, width, height) {
        this.width = width
        this.height = height
        this.delaunay = Delaunay.from(points);
        this.voronoi = this.delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);
    }

    updateVoronoi(points) {
        this.delaunay = Delaunay.from(points)
        this.voronoi = this.delaunay.voronoi([0.5, 0.5, this.width - 0.5, this.height - 0.5]);
    }

    getVoronoiCorners(i) {
        return this.voronoi.cellPolygon(i)
    }

}