import {mapState} from './center_and_corner_utils'
import {getRandomNumber} from './utils'

var seedrandom = require('seedrandom');

// Factor should ideally be between 1.0 and 2.0
// lower bounds lead to more constricted islands
const ISLAND_FACTOR = 1.07

// Generates a randomized map -- very sparse
export function generateRandomMap(point) {
    // let num = Math.floor(seedrandom(point[0] + point[1] + 0.5)() * 100) 
    let num = getRandomNumber(100);
    if (num % 7 == 0) return false;
    else return true;
}

// CHeck to see whether a given point is inside land or in water
export function isInside(type, point, width) {
    if (type === mapState[2]) {
        // The point has to be normalized to be between -1.0 and +1.0
        let pt = [1.5 * (point[0] / width - 0.5), 1.5 * (point[1] / width - 0.5)];
        return generateRadialMap(pt);
    } else if (type === mapState[3]) {
        let pt = [1.5 * (point[0] / width - 0.5), 1.5 * (point[1] / width - 0.5)];
        return generateLongMap(pt)
    }
    else return generateRandomMap(point);
}

// Return the distance from (0, 0) to this point
function pointLength(point) {
    return Math.sqrt(Math.pow(point[0], 2.0) + Math.pow(point[1], 2.0));
}

// Generates a circular map using overlapping sine waves (ensue black magic)
// Center point of a voronoi cell
export function generateRadialMap(point) {
    let seed = Math.floor(seedrandom(point[0] + point[1] + 0.5))
    let bumps = getRandomNumber(6) + 1
    let dipAngle = getRandomNumber(100)/100 * 2 * Math.PI
    let startAngle = getRandomNumber(100)/100 * 2 * Math.PI
    let dipWidth = getRandomNumber(5) / 10 + 0.2 // random between 0.2 and 0.7

    let angle = Math.atan(point[1] / point[0])
    let length = 0.5 * Math.max(Math.abs(point[0]), Math.abs(point[1])) + pointLength(point)
    let r1 = 0.5 + 0.40 * Math.sin(startAngle + bumps * angle + Math.cos((bumps + 3) * angle))
    let r2 = 0.7 - 0.20 * Math.sin(startAngle + bumps * angle - Math.sin((bumps + 2) * angle))

    if (Math.abs(angle - dipAngle) < dipWidth ||
        Math.abs(angle - dipAngle + 2 * Math.PI) < dipWidth ||
        Math.abs(angle - dipAngle - 2 * Math.PI) < dipWidth) {
        r1 = r2 = 0.2
    }
    let isInside = (length < r1 || (length > r1 * ISLAND_FACTOR && length < r2))
    return isInside
}

// Generates a circular map using overlapping sine waves (ensue black magic)
// Center point of a voronoi cell
export function generateLongMap(point) {
    let bumps = getRandomNumber(6)
    let dipAngle = getRandomNumber(1) * 2 * Math.PI
    let startAngle = getRandomNumber(1) * 2 * Math.PI
    let dipWidth = getRandomNumber(5) / 10 + 0.2 // random between 0.2 and 0.7
    let angle = Math.atan(point[1] / point[0])
    let length = 0.5 * Math.max(Math.abs(point[0]), Math.abs(point[1])) + pointLength(point)
    let r1 = 0.5 + 0.40 * Math.sin(startAngle) + bumps * angle + Math.cos((bumps + 3)) * angle
    let r2 = 0.7 - 0.20 * Math.sin(startAngle + bumps * angle - Math.sin((bumps + 2) * angle))

    if (Math.abs(angle - dipAngle) < dipWidth ||
        Math.abs(angle - dipAngle + 2 * Math.PI) < dipWidth ||
        Math.abs(angle - dipAngle - 2 * Math.PI) < dipWidth) {
        r1 = r2 = 0.2
    }
    let isInside = (length < r1 || length > r1 * ISLAND_FACTOR && length < r2)
    return isInside
}

// export function generateRadialMap(point) {
//     let seed = Math.floor(seedrandom(point[0] + point[1] + 0.5))
//     let bumps = getRandomNumber(6)
//     let dipAngle = getRandomNumber(10)/10 * 2 * Math.PI
//     let startAngle = getRandomNumber(10)/10 * 2 * Math.PI
//     let dipWidth = getRandomNumber(5) / 10 + 0.2 // random between 0.2 and 0.7

//     let angle = Math.atan(point[1] / point[0])
//     let length = 0.5 * (Math.max(Math.abs(point[0]), Math.abs(point[1])) + pointLength(point))
//     let r1 = 0.5 + 0.40 * Math.sin(startAngle + bumps * angle + Math.cos((bumps + 3) * angle))
//     let r2 = 0.7 - 0.20 * Math.sin(startAngle + bumps * angle - Math.sin((bumps + 2) * angle))

//     if (Math.abs(angle - dipAngle) < dipWidth ||
//         Math.abs(angle - dipAngle + 2 * Math.PI) < dipWidth ||
//         Math.abs(angle - dipAngle - 2 * Math.PI) < dipWidth) {
//         r1 = r2 = 0.2
//     }
//     let isInside = (length < r1 || (length > r1*ISLAND_FACTOR && length < r2))
//     return isInside
// }