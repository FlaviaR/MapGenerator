import { createCenters, mapState, finishEcosystemAssignments } from "./utils/center_and_corner_utils"
import { VoronoiObj } from "./voronoiObj"
import { drawVoronoi, drawKey } from "./utils/draw_utils"
import { relaxVoronoi } from "./utils/lloyd_relaxation_utils"
import { drawMap, generateMap } from './utils/map_utils'

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
const width = canvas.width
const height = canvas.height
let num = 2000
const lloydButton = document.getElementById("lloydButton");
const randomButton = document.getElementById("randomMap");
const radialButton = document.getElementById("radialMap");
const extendedButton = document.getElementById("longMap");
const displayBiomesCheckbox = document.getElementById("displayBiomes");
const biomeSlider = document.getElementById("biomeSlider")

let displayBiome = false

let points = Array.from({ length: num }, () => [Math.random() * width, Math.random() * height]);
let centerList = []
let voronoiObj = new VoronoiObj(points, width, height)
let curMap = mapState[1]

context.clearRect(0, 0, width, height);

const generateMapType = (mapState, createNewMap) => {
    curMap = mapState
    centerList = generateMap(mapState, centerList, width, createNewMap)
    centerList = finishEcosystemAssignments(centerList, voronoiObj, createNewMap)

    drawMap(centerList, displayBiome, voronoiObj)
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

const relaxVoronoiPolygons = () => {
    let ret = relaxVoronoi(points, voronoiObj, centerList)
    points = ret[0]
    centerList = ret[1]

    generateMapType(curMap, false)
}

function init() {
    centerList = createCenters(points, voronoiObj)
    drawVoronoi(points, voronoiObj)
    generateRandomMap()
    drawKey()
}


lloydButton.addEventListener('click', relaxVoronoiPolygons, false)
randomButton.addEventListener('click', generateRandomMap)
radialButton.addEventListener('click', generateRadialMap, false)
extendedButton.addEventListener('click', generateLongMap, false)

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


