import {createCenters, mapState, assignCoasts} from "./utils/center_and_corner_utils"
import { VoronoiObj } from "./voronoiObj"
import {drawVoronoi, drawKey} from "./utils/draw_utils"
import {relaxVoronoi} from "./utils/lloyd_relaxation_utils"
import {redrawMap, generateMap} from './utils/map_utils'

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
const width = canvas.width
const height = canvas.height
let num = 1000
const lloydButton = document.getElementById("lloydButton");
const randomButton = document.getElementById("randomMap");
const radialButton = document.getElementById("radialMap");
const extendedButton = document.getElementById("longMap");
const displayBiomesCheckbox = document.getElementById("displayBiomes");

let displayBiome = false

let points = Array.from({ length: num }, () => [Math.random() * width, Math.random() * height]);
let centerList = []
let voronoiObj = new VoronoiObj(points, width, height)

context.clearRect(0, 0, width, height);

const generateRandomMap = () => {
    centerList = generateMap(mapState[1], centerList, width, displayBiome, voronoiObj)
    centerList = assignCoasts(centerList, voronoiObj)
}

const generateRadialMap = () => {
    centerList = generateMap(mapState[2], centerList, width, displayBiome, voronoiObj)
    centerList = assignCoasts(centerList, voronoiObj)
}

const generateLongMap = () => {
    centerList = generateMap(mapState[3], centerList, width, displayBiome, voronoiObj)
    centerList = assignCoasts(centerList, voronoiObj)
}

const relaxVoronoiPolygons = () => {
    let ret = relaxVoronoi(points, voronoiObj)
    points = ret[0]
    centerList = ret[1]
}

function init() {
    centerList = createCenters(points, voronoiObj)
    drawVoronoi(points, voronoiObj)
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
    redrawMap(centerList, displayBiome, voronoiObj)
});

init()


