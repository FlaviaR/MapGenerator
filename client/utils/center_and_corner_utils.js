import { Corner } from "../corner"
import { Center } from "../center"
import { isInside } from "./map_utils"
import { getRandomNumber } from './utils'
import { Queue } from "./queue";

const canvas = document.getElementById("myCanvas");
const width = canvas.width
export const mapState = ["basic", "random", "radial", "long"]

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
export function fetchBiome(center) {
	if (center.ocean) {
		return "OCEAN";
	} else if (center.isWater) {
		if (center.elevation < 0.1) return "MARSH";
		if (center.elevation > 0.8) return "ICE";
		return "WATER";
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

function updateCornerMoisture(cornerList, amount) {
	let corners = []

	let i = 0
	for (i; i < cornerList.length; i++) {
		let corner = cornerList[i]

		// elevations are supposed to be between 0.0 and 1.0 -
		corner.elevation = corner.elevation()
	}
	corners.push(corner)

	return corners
}

function updateCornerElevation(cornerList, amount) {

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
export function assignCornerMoisture(cornerList) {

	let i = 0
	for (i; i < cornerList.length; i++) {
		let corner = cornerList[i]

		if (corner.isWater) {
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
function setOceanBorders(centerList) {
	let i = 0
	for (i = 0; i < centerList.length; i++) {
		let center = centerList[i]
		let cornerList = center.corners;

		let j = 0
		for (j; j < cornerList.length; j++) {
			let corner = cornerList[j]

			if (corner.isBorder) {
				center.isWater = true;
				center.ocean = true;
				center.isBorder = true;
				center.biome = "OCEAN"
			}
		}
	}

	return centerList
}

// A coast region is land that has an ocean neighbor
function assignCoasts(centerList, voronoiObj) {
	let i = 0

	for (i; i < centerList.length; i++) {
		let center = centerList[i]

		const neighborIndexes = getNeighborsIndexes(center, voronoiObj)
		let j = 0
		for (j; j < neighborIndexes.length; j++) {
			let neighbor = centerList[neighborIndexes[j]]

			if (!center.ocean && neighbor.ocean) {
				center.isCoast = true
				break;
			}
			else center.isCoast = false
		}
	}
	return centerList
}

// BFS for ocean
function assignOcean(centerList, voronoiObj) {
	let i = 0
	let borderPolygon = null
	for (i; i < centerList.length; i++) {
		if (centerList[i].isBorder) {
			borderPolygon = centerList[i]
			break;
		}
	}

	let visited = new Array(centerList.length)
	let queue = new Queue()
	visited[borderPolygon.index] = visited
	queue.enqueue(borderPolygon)

	while (queue.getLength() != 0) {
		let center = queue.dequeue()
		const neighborIndexes = getNeighborsIndexes(center, voronoiObj)
		let j = 0
		for (j; j < neighborIndexes.length; j++) {
			let neighbor = centerList[neighborIndexes[j]]
			if (!visited[neighbor.index] && neighbor.isWater) {
				visited[neighbor.index] = true
				neighbor.ocean = true
				queue.enqueue(neighbor)
			}
		}
	}
	return centerList
}

export function finishEcosystemAssignments(centerList, voronoiObj) {
	centerList = setOceanBorders(centerList, voronoiObj);
	centerList = assignOcean(centerList, voronoiObj)
	centerList = assignCoasts(centerList, voronoiObj)

	return centerList;
}

function setCornerBorders(voronoiIndex, voronoiObj) {
	let corners = []
	let voronoiCorners = voronoiObj.getVoronoiCorners(voronoiIndex)
	let i = 0
	let offset = 10
	for (i; i < voronoiCorners.length; i++) {
		let corner = new Corner();
		corner.point = voronoiCorners[i];
		corner.index = corners.length;
		corner.isBorder = (corner.point[0] <= 0 + offset ||
			corner.point[0] >= width - offset ||
			corner.point[1] <= 0 + offset ||
			corner.point[1] >= width - offset);
		corners.push(corner)
	}
	return corners
}

export function initCorners(voronoiIndex, voronoiObj) {
	let corners = setCornerBorders(voronoiIndex, voronoiObj)
	corners = assignCornerElevations(corners)
	corners = assignCornerMoisture(corners)

	return corners
}

// Returns a list containing the neighboring centers of the given site
export function getNeighborsIndexes(center, voronoiObj) {
	let neighborsIndexesList = []
	for (let centerIndex of voronoiObj.voronoi.neighbors(center.index)) {
		neighborsIndexesList.push(centerIndex)
	}
	return neighborsIndexesList
}

// Given a Voronoi site, return a Center object with the following initialized:
// location, isWater, ocean, isBorder, and corners
export function initCenter(point, voronoiIndex, voronoiObj, oldCenter) {
	let center = new Center()
	center.point = point;
	center.index = voronoiIndex;
	center.neighbors = getNeighborsIndexes(center, voronoiObj)
	center.corners = (oldCenter == null) ? initCorners(voronoiIndex, voronoiObj) : oldCenter.corners

	if (oldCenter != null) {
		center.elevation = oldCenter.elevation
		center.moisture = oldCenter.moisture
		center.isWater = oldCenter.isWater
		center.ocean = oldCenter.ocean
	} else center = assignFaceElevationsAndMoisture(center)

	center.moistureOriginal = center.moisture
	center.elevationOriginal = center.elevation
	center.biome = (oldCenter == null) ? fetchBiome(center) : oldCenter.biome;

	return center;
}

export const createCenters = (points, voronoiObj, oldCenterList = null) => {
	let centerList = []
	let i = 0
	for (i; i < points.length; i++) {
		let oldCenter = (oldCenterList == null) ? null : oldCenterList[i]
		centerList.push(initCenter(points[i], i, voronoiObj, oldCenter))
	}

	return centerList
}


