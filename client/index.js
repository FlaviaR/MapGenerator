import { createCenters, mapState, finishEcosystemAssignments, initCorners } from "./utils/center_and_corner_utils"
import { VoronoiObj } from "./voronoiObj"
import { drawVoronoi, drawKey } from "./utils/draw_utils"
import { relaxVoronoi } from "./utils/lloyd_relaxation_utils"
import { drawMap, generateMap, drawNoisyMap } from './utils/map_utils'
import {createNoisyPolygonList} from './utils/noiseUtils'

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
const width = canvas.width
const height = canvas.height
let num = 100
const lloydButton = document.getElementById("lloydButton");
const randomButton = document.getElementById("randomMap");
const radialButton = document.getElementById("radialMap");
const extendedButton = document.getElementById("longMap");
const undoButton = document.getElementById("undoButton");
const displayBiomesCheckbox = document.getElementById("displayBiomes");
const noiseSlider = document.getElementById("noiseSlider")
const numberOfPointsSlider = document.getElementById("numberOfPointsSlider")
const moistureSlider = document.getElementById("moistureSlider")
const moistureSpan = document.getElementById("moistureSpan")
const elevationSlider = document.getElementById("elevationSlider")
const elevationSpan = document.getElementById("elevationSpan")

let displayBiome = false

let points = Array.from({ length: num}, () => [Math.random() * width, Math.random() * height]);
let centerList = []
let noisyPolygonList = []
let voronoiObj = new VoronoiObj(points, width, height)
let curMap = mapState[1]
let previousStateCenterListAndPoints = []
let previousStateNoisyPolygons = []
let noiseAmount = 0
let moistureAmount = 1.0
let elevationAmount = 1.0

context.clearRect(0, 0, width, height);

const generateMapType = (mapState, createNewMap) => {
    curMap = mapState
    centerList = generateMap(mapState, centerList, width, createNewMap)
    centerList = finishEcosystemAssignments(centerList, voronoiObj)
    noisyPolygonList = createNoisyPolygonList(centerList, voronoiObj, noiseAmount)
    drawNoisyMap(noisyPolygonList, displayBiome, voronoiObj, moistureAmount, elevationAmount)
}

const generateRandomMap = () => {
    generateMapType(mapState[1])
}

const generateRadialMap = () => {
    generateMapType(mapState[2])
}

const generateLongMap = () => {
    generateMapType(mapState[3])
}

const updateCenterListAndPoints = (newCenterList, newPoints) => {
    centerList = newCenterList
    points = newPoints
    voronoiObj.updateVoronoi(points)
}

const updateNoisyPolygonList = (newNoisyPolygonList) => {
    noisyPolygonList = newNoisyPolygonList
}

const relaxVoronoiPolygons = () => {
    let relaxed = relaxVoronoi(points, voronoiObj, centerList)

    // If the relaxation expands a site outside of the map,
    // be sure to treat that site as a border
    let i = 0
    for (i; i < relaxed.centerList.length; i++) {
        let center = relaxed.centerList[i]
        center.corners = initCorners(i, voronoiObj)
    }

    updateCenterListAndPoints(relaxed.centerList, relaxed.points)
    previousStateCenterListAndPoints.push({ centerList, points })
    previousStateNoisyPolygons.push(noisyPolygonList)
    generateMapType(curMap, false)
}

const undoRelaxation = () => {
    if (previousStateCenterListAndPoints.length > 1) previousStateCenterListAndPoints.pop() // remove the most recently added state
    let prevState = previousStateCenterListAndPoints[previousStateCenterListAndPoints.length - 1]

    if (previousStateNoisyPolygons.length > 1) previousStateNoisyPolygons.pop()
    let prevStateNoisyPolygon = previousStateNoisyPolygons[previousStateNoisyPolygons.length - 1]

    if (prevState) updateCenterListAndPoints(prevState.centerList, prevState.points)
    if (prevStateNoisyPolygon) updateNoisyPolygonList(prevStateNoisyPolygon)
    
    drawNoisyMap(noisyPolygonList, displayBiome, voronoiObj, moistureAmount, elevationAmount)
}

function init() {
    centerList = createCenters(points, voronoiObj)
    previousStateCenterListAndPoints.push({ centerList, points })
    generateRandomMap()
    previousStateNoisyPolygons.push(noisyPolygonList)
    drawKey()
}

lloydButton.addEventListener('click', relaxVoronoiPolygons, false)
randomButton.addEventListener('click', generateRandomMap)
radialButton.addEventListener('click', generateRadialMap, false)
extendedButton.addEventListener('click', generateLongMap, false)
undoButton.addEventListener('click', undoRelaxation, false)

displayBiomesCheckbox.addEventListener('change', function () {
    if (this.checked) {
        displayBiome = true
    } else {
        displayBiome = false
    }
    drawNoisyMap(noisyPolygonList, displayBiome, voronoiObj)

});

numberOfPointsSlider.oninput = function() {
    points = Array.from({ length: this.value }, () => [Math.random() * width, Math.random() * height]);
    voronoiObj.updateVoronoi(points)
    centerList = createCenters(points, voronoiObj)
    previousStateCenterListAndPoints.push({ centerList, points })
    generateMapType(curMap, true)
    previousStateNoisyPolygons.push(noisyPolygonList)
}

noiseSlider.oninput = function () {
    noiseAmount = this.value
    noisyPolygonList = createNoisyPolygonList(centerList, voronoiObj, noiseAmount)
    drawNoisyMap(noisyPolygonList, displayBiome, voronoiObj, moistureAmount, elevationAmount)
}

moistureSlider.oninput = function() {
    moistureAmount = this.value
    moistureSpan.innerHTML = this.value
    drawNoisyMap(noisyPolygonList, displayBiome, voronoiObj, moistureAmount, elevationAmount)
}

elevationSlider.oninput = function() {
    elevationAmount = this.value
    elevationSpan.innerHTML = elevationAmount
    drawNoisyMap(noisyPolygonList, displayBiome, voronoiObj, moistureAmount, elevationAmount)
}

init()


