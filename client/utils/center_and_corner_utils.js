import { Corner } from "../corner"
import { Center } from "../center"
import { isInside } from "./map_utils"
import { getRandomNumber } from './utils'

const canvas = document.getElementById("myCanvas");
const width = canvas.width
export const mapState = ["basic", "random", "radial", "long"]

//TODO - assign temperatures / assign coast

// Set the moisture and elevation of the given center to be the average elevation and moisture of its corners
function assignFaceElevationsAndMoisture(center) {
	let corners = center.corners;
	let elevSum = 0.0;
	let moistSum = 0.0;

	let i = 0
	for (i; i < corners.length; i++) {
		elevSum += corners[i].elevation
		moistSum += corners[i].elevation
	}

	center.elevation = elevSum / corners.length
	center.moisture = moistSum / corners.length

	return center
}

// Return a biome type based on the given center's moisture levels
function fetchBiome(center) {
	if (center.ocean) {
		return "OCEAN";
	} else if (center.isWater) {
		if (center.elevation < 0.1) return "MARSH";
		if (center.elevation > 0.8) return "ICE";
		return "LAKE";
	} else if (center.isCoast) {
		return "BEACH";
	} else if (center.elevation > 0.8) {
		if (center.moisture > 0.50) return "SNOW";
		else if (center.moisture > 0.33) return "TUNDRA";
		else if (center.moisture > 0.16) return "BARE";
		else return "SCORCHED";
	} else if (center.elevation > 0.6) {
		if (center.moisture > 0.66) return "TAIGA";
		else if (center.moisture > 0.33) return "SHRUBLAND";
		else return "TEMPERATE_DESERT";
	} else if (center.elevation > 0.3) {
		if (center.moisture > 0.83) return "TEMPERATE_RAIN_FOREST";
		else if (center.moisture > 0.50) return "TEMPERATE_DECIDUOUS_FOREST";
		else if (center.moisture > 0.16) return "GRASSLAND";
		else return "TEMPERATE_DESERT";
	} else {
		if (center.moisture > 0.66) return "TROPICAL_RAIN_FOREST";
		else if (center.moisture > 0.33) return "TROPICAL_SEASONAL_FOREST";
		else if (center.moisture > 0.16) return "GRASSLAND";
		else return "SUBTROPICAL_DESERT";
	}
}

// Determine elevation for each Voronoi polygon corner
function assignCornerElevations(cornerList) {
	let corners = []

	let i = 0
	for (i; i < cornerList.length; i++) {
		let corner = cornerList[i]
		corner.isWater = !isInside(true, corner.point, width);

		if (corner.isBorder) {
			corner.elevation = 0.0;
		} else {
			// elevations are supposed to be between 0.0 and 1.0 -
			corner.elevation = getRandomNumber(10) / 10;
		}
		corners.push(corner)
	}
	return corners
}

// Determine moisture for each Voronoi polygon corner
function assignCornerMoisture(cornerList) {

	let i = 0
	for (i; i < cornerList.length; i++) {
		let corner = cornerList[i]

		if (corner.ocean) {
			corner.moisture = 1.0;
		} else {
			corner.moisture = getRandomNumber(10) / 10;
		}
	}

	return cornerList
}

// If a given center contains a corner with the 'border' attribute,
// then return a modified center object set as a border and ocean
// All border faces are expected to be oceans
function setOceanBorders(center) {
	let cornerList = center.corners;

	let i = 0
	for (i; i < cornerList.length; i++) {
		let corner = cornerList[i]

		if (corner.isBorder) {
			center.isWater = true;
			center.ocean = true;
			center.isBorder = true;
		}

		if (center.ocean) center.isWater = true;
	}

	return center
}


function initCorners(voronoiIndex, voronoiObj) {
	let corners = []
	let voronoiCorners = voronoiObj.getVoronoiCorners(voronoiIndex)
	let i = 0
	for (i; i < voronoiCorners.length; i++) {
		let corner = new Corner();
		corner.point = voronoiCorners[i];
		corner.index = corners.length;
		corner.isBorder = (corner.point[0] <= 0 ||
			corner.point[0] >= width ||
			corner.point[1] <= 0 ||
			corner.point[1] >= width);
		corners.push(corner)
	}
	corners = assignCornerElevations(corners)
	corners = assignCornerMoisture(corners)

	return corners
}

// Returns a list containing the neighboring centers of the given site
export function getNeighbors(center, centerList, voronoiObj) {
	let neighborsCenterList = []
	for (let centerIndex of voronoiObj.voronoi.neighbors(center.index)) {
		neighborsCenterList.push(centerList[centerIndex])
	  }
	return neighborsCenterList
}

// Given a Voronoi site, return a Center object with the following initialized:
// location, isWater, ocean, isBorder, and corners
export function initCenters(point, voronoiIndex, voronoiObj) {
	let center = new Center()
	center.point = point;
	center.index = voronoiIndex;
	// center.isWater = !isInside(true, center.point, 1000);
	center.corners = initCorners(voronoiIndex, voronoiObj)

	center = setOceanBorders(center);
	center = assignFaceElevationsAndMoisture(center);
	center.biome = fetchBiome(center);

	return center;
}

export const createCenters = (points, voronoiObj) => {
	let centerList = []
	let i = 0
	for (i; i < points.length; i++) {
		centerList.push(initCenters(points[i], i, voronoiObj))
	}

	return centerList
}


