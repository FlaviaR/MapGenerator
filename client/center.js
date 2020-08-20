export class Center {

    constructor(index, point, elevation, moisture, biome, isWater, ocean, isBorder, isCoast, corners, neighbors) {
        // this center's index within centerList
        this.index = index
        // site of voronoi face
        this.point = point
        // elevation of this center object
        this.elevation = elevation
        // moisture for this center object - will be used to determine biomes
        this.moisture = moisture
        // biome type - see: http://www-cs-students.stanford.edu/~amitp/game-programming/polygon-map-generation/
        this.biome = biome
        // is this tile water?
        this.isWater = isWater
        // water can be either an ocean or a lake
        // if ocean is false but isWater is set, then its assumed to be a lake
        this.ocean = ocean
        // depictor for the border of the map
        this.isBorder = isBorder
        // whether this center tile is on the coast of the island
        this.isCoast = isCoast;

        this.corners = corners
        this.neighbors = neighbors
    }

    print() {
        console.log("-----------------------------")
        console.log("Index: ", this.index)
        console.log("Point: ", this.point)
        console.log("Elevation: ", this.elevation)
        console.log("Moisture: ", this.moisture)
        console.log("Biome: ", this.biome)
        console.log("IsWater: ", this.isWater)
        console.log("Ocean: ", this.ocean)
        console.log("IsBorder: ", this.isBorder)
        console.log("IsCoast: ", this.isCoast)
    }

}
