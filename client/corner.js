export class Corner {
    constructor(index, point, isWater, ocean, isBorder, elevation, moisture, adjacent) {
        // index in respect to the corner list			  
        this.index = index
        // Corner location
        this.point = point
        // is this tile water?
        this.isWater = isWater
        // water can be either an ocean or a lake
        // if ocean is false but the is water, then its assumed to be a lake
        this.ocean = ocean
        // is this corner on the border (edges) of the map?
        this.isBorder = isBorder
        this.elevation = elevation // between 0.0 and 1.0
        this.moisture = moisture

        // the list of corners adjacent to this corner
        this.adjacent = this.adjacent;
    }

    print() {
        console.log("-----------------------------")
        console.log("Index: ", this.index)
        console.log("Point: ", this.point)
        console.log("Elevation: ", this.elevation)
        console.log("Moisture: ", this.moisture)
        console.log("IsWater: ", this.isWater)
        console.log("Ocean: ", this.ocean)
        console.log("IsBorder: ", this.isBorder)
        console.log("Elevation: ", this.elevation)
        console.log("Adjacent: ", this.adjacent)
    }
}