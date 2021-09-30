import {getRandomNumber} from './utils/utils'
import {pointLength} from './utils/map_utils'

// Factor should ideally be between 1.0 and 2.0
// lower bounds lead to more constricted islands
const ISLAND_FACTOR = 0.2

// Generates a randomized map -- very sparse
export function generateRandomMap(point) {
    Math.seedrandom(point[0] + point[1] + 0.5)
    let num = Math.floor() * 100
    if (num % 3 == 0) return false;
    else return true;
}

// Generates a circular map using overlapping sine waves (ensue black magic)
// Center point of a voronoi cell
export function generateRadialMap(point) {
    Math.seedrandom(point[0] + point[1] + 0.5)
    let bumps =  getRandomNumber(6) + 1
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
    Math.seedrandom(point[0] + point[1] + 0.5)
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