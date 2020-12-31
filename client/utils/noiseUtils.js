import {getRandomNumber} from './utils'
import { NoisyPolygon } from '../noisyPolygon'
import { Queue } from "./queue";
import {getNeighborsIndexes} from "./center_and_corner_utils"


function cullPoint(point) {
    if (point[0] >= 749) point[0] = 749
    if (point[1] >= 749) point[1] = 749
    if (point[0] <= 0) point[0] = 1
    if (point[1] <= 0) point[1] = 1

    return point
}

export const createNoisyPolygonList = (centerList, voronoiObj, noiseAmount) => {
    let noisyPolygonList = []
    // fetch all voronoi vertices
    // calc parameterization
    // add noise

    let visited = new Array(centerList.length)
    let visitedCorners = []
    let queue = new Queue()
    let firstCenter = centerList[0]
	queue.enqueue(firstCenter)

	while (queue.getLength() != 0) {
		let center = queue.dequeue()
        const neighborIndexes = getNeighborsIndexes(center, voronoiObj)
        neighborIndexes.push(center.index) // make sure first center is visited as well

		let j = 0
		for (j; j < neighborIndexes.length; j++) {
            let neighbor = centerList[neighborIndexes[j]]
            
			if (!visited[neighbor.index]) {
                visited[neighbor.index] = true
                
                let neighborCorners = voronoiObj.getVoronoiCorners(neighbor.index)
                let k = 0
                let polygonNoisyEdges = []
                for (k; k < neighborCorners.length - 1; k++) {
                    let A = cullPoint(neighborCorners[k])
                    let B = cullPoint(neighborCorners[k+1])

                    if (!edgeHasBeenVisited(A,B, visitedCorners)) {
                        let noisyEdge = addNoiseToEdge(A, B, noiseAmount)
                        visitedCorners.push({a0:A[0], a1:A[1], b0:B[0], b1:B[1], noisy:noisyEdge})
                        polygonNoisyEdges.push(noisyEdge)
                    } 
                    else {
                        let index = fetchMatchingEdge(A, B, visitedCorners)
                        let noisyEdge = addNoiseToEdge(A, B, noiseAmount)

                        let visitedCornersCopy = [...visitedCorners[index].noisy].reverse()
                        visitedCornersCopy.splice(1, 1)
                        visitedCornersCopy.push(visitedCornersCopy[visitedCornersCopy.length - 1])

                        polygonNoisyEdges.push(visitedCornersCopy)
                    }
                    
                    
                }
                let polygon = new NoisyPolygon(neighbor, polygonNoisyEdges)
                noisyPolygonList.push(polygon)
				queue.enqueue(neighbor)
			}
		}
	}

    return noisyPolygonList
}

function fetchMatchingEdge(A, B, visitedCorners) {
   return visitedCorners.findIndex(obj => (obj.a0 === A[0] && obj.a1 == A[1] && obj.b0 == B[0] && obj.b1 == B[1] ||
                                           obj.a0 === B[0] && obj.a1 == B[1] && obj.b0 == A[0] && obj.b1 == A[1]))
}

function edgeHasBeenVisited(A, B, visitedCorners) {

    if(visitedCorners.some(obj => (obj.a0 === A[0] && obj.a1 == A[1] && obj.b0 == B[0] && obj.b1 == B[1] ||
                                   obj.a0 === B[0] && obj.a1 == B[1] && obj.b0 == A[0] && obj.b1 == A[1]))) {
        return true

    } 
    return false
}

function distanceBetweenPoints(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2))
}

function addNoiseToEdge(A, B, noiseAmount) {
    let noisyEdge = []

    // X = (1 - t)A + tB 
    const num = 5
    let i = 1
    noisyEdge.push(A)
    for (i; i < num + 1; i++) {
        let t = 0.2*i
        let pointA = [(1- t) * A[0], (1 - t) * A[1]]
        let pointB = [t*B[0], t*B[1]]
        let X = [pointA[0] + pointB[0], pointA[1] + pointB[1]]

        let randX = getRandomNumber(noiseAmount * 10)/10 * 2
        let randY = getRandomNumber(noiseAmount * 10)/10 * 2

        let lineLength = distanceBetweenPoints(A, B)
        let pointDistance = distanceBetweenPoints(X, A)
        let ratio = pointDistance/lineLength

        let modPoint = (ratio >= 0.3 && ratio <= 0.7) ? [X[0] + randX, X[1] + randY] : X

        modPoint = cullPoint(modPoint)
        noisyEdge.push(modPoint)
    }

    noisyEdge.push(B)
    
    return noisyEdge
}