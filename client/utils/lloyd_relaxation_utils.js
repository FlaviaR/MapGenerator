import {createCenters} from "./center_and_corner_utils"

/*
    Find the centroid of a Voronoi region described by `vertices`, and return an
    array with the x and y coords of that centroid.
    The equation for the method used here to find the centroid of a 2D polygon
    is given here: https://en.wikipedia.org/wiki/Centroid#Of_a_polygon
    @params: array `vertices` - vertices of a given voronoi cell
    @returns array - defines the x, y coords of the centroid described by `vertices`
*/
function applyLloydRelaxation(cellVertices) {
	let area = 0
	let centroid_x = 0
	let centroid_y = 0
	let x_i = 0
	let y_i = 0
	let x_iplus1 = 0
	let y_iplus1 = 0

	let i = 0
	for (i; i < cellVertices.length - 1; i++) {
		x_i = cellVertices[i][0]
		y_i = cellVertices[i][1]
		x_iplus1 = cellVertices[i + 1][0]
		y_iplus1 = cellVertices[i + 1][1]

		let step = (x_i * y_iplus1) - (x_iplus1 * y_i)

		area += step

		centroid_x += (x_i + x_iplus1) * step
		centroid_y += (y_i + y_iplus1) * step
	}

	area /= 2
	centroid_x = (1.0 / (6.0 * area)) * centroid_x
	centroid_y = (1.0 / (6.0 * area)) * centroid_y

	return [centroid_x, centroid_y]
}

export const relaxVoronoi = (points, voronoiObj) => {
    points = relaxPoints(points, voronoiObj.voronoi)
    voronoiObj.updateVoronoi(points)
	let centerList = createCenters(points, voronoiObj)

    return [points, centerList]
}

function relaxPoints(points, voronoi) {
	let centroid = []
	let i = 0
	for (i; i < points.length; i++) {
		centroid.push(applyLloydRelaxation(voronoi.cellPolygon(i)))
	}
	return centroid
}