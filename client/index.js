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
let num = 3
const lloydButton = document.getElementById("lloydButton");
const randomButton = document.getElementById("randomMap");
const radialButton = document.getElementById("radialMap");
const extendedButton = document.getElementById("longMap");
const undoButton = document.getElementById("undoButton");
const displayBiomesCheckbox = document.getElementById("displayBiomes");
const biomeSlider = document.getElementById("biomeSlider")

let displayBiome = false

let points = Array.from({ length: num }, () => [Math.random() * width, Math.random() * height]);
let centerList = []
let voronoiObj = new VoronoiObj(points, width, height)
let curMap = mapState[1]
let previousState = []
context.clearRect(0, 0, width, height);

const generateMapType = (mapState, createNewMap) => {
    curMap = mapState
    centerList = generateMap(mapState, centerList, width, createNewMap)
    centerList = finishEcosystemAssignments(centerList, voronoiObj)
    let noisyPolygonList = createNoisyPolygonList(centerList, voronoiObj)
    drawNoisyMap(noisyPolygonList, displayBiome, voronoiObj)
    //drawMap(centerList, displayBiome, voronoiObj)
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
    previousState.push({ centerList, points })
    generateMapType(curMap, false)
}

const undoRelaxation = () => {
    if (previousState.length > 1) previousState.pop() // remove the most recently added state
    let prevState = previousState[previousState.length - 1]
    updateCenterListAndPoints(prevState.centerList, prevState.points)
    drawMap(centerList, displayBiome, voronoiObj)
}

function init() {
    centerList = createCenters(points, voronoiObj)
    previousState.push({ centerList, points })
    generateRandomMap()
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
    drawMap(centerList, displayBiome, voronoiObj)
});


// Update the current slider value (each time you drag the slider handle)
biomeSlider.oninput = function () {
    console.log(this.value);
}

init()


