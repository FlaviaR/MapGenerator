import { createCenters, mapState, finishEcosystemAssignments, initCorners } from "./utils/center_and_corner_utils"
import { VoronoiObj } from "./voronoiObj"
import { drawVoronoi, drawKey } from "./utils/draw_utils"
import { relaxVoronoi } from "./utils/lloyd_relaxation_utils"
import { drawMap, generateMap, drawNoisyMap } from './utils/map_utils'
import { createNoisyPolygonList } from './utils/noiseUtils'

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
const width = canvas.width
const height = canvas.height
let num = 10
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
const downloadMapPointsButton = document.getElementById("downloadMapPointsButton")
const mapPointsInput = document.getElementById("mapPointsInput")
const reloadPointsButton = document.getElementById("reloadPoints")

let displayBiome = false

let points = Array.from({ length: num }, () => [Math.random() * width, Math.random() * height]);
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
    updateNoisyPolygonList(noisyPolygonList)
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

    generateMapType(curMap, false)
}

// See Niraj's answer: https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript
function handleFileDownload(text) {
    var textToWrite = text;
    var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    var fileNameToSaveAs = "map_points.txt";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}


const uploadMapPoints = () => {
    // console.log(mapPointsInput.files[0])
    let content = ""
    let file = mapPointsInput.files[0]
    var reader = new FileReader();

    reader.onload = function (e) {
        content = reader.result;

        let split = content.split('\n\n')

        let mapType = split[0]
        centerList = []
        points = []
        previousStateCenterListAndPoints =[]
        previousStateNoisyPolygons = []

        let i = 1
        console.log(split.length, mapType)
        for (i; i < split.length; i++) {
            try {
                if (split[i]) {
                    let center = JSON.parse(split[i])
                    centerList.push(center)
                    points.push(center.point)
                }
               
              } catch (err) {
                console.log("index: ", i)
                console.log("val: ", split[i])
                alert( "Parsing error");
                console.log( err.name );
                console.log( err.message );
              }
            
        }

        if (mapType == "random") {
            generateRandomMap()
        } else if (mapType == "radial") {
            generateRadialMap()
        } else {
            console.log("im long", mapType)
            generateLongMap()
        } 

        console.log(points)
        voronoiObj.updateVoronoi(points)

        previousStateCenterListAndPoints.push({ centerList, points })
        previousStateNoisyPolygons.push(noisyPolygonList)

    }

    reader.readAsText(file);

}

const downloadMapPoints = () => {
    let text = curMap + "\n\n"
    let i = 0
    for (i; i < centerList.length; i++) {
        text += JSON.stringify(centerList[i])
        text += "\n\n"
    }
    handleFileDownload(text)

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
downloadMapPointsButton.addEventListener('click', downloadMapPoints, false)
mapPointsInput.addEventListener("change", uploadMapPoints, false);
reloadPointsButton.addEventListener("click", uploadMapPoints, false)

displayBiomesCheckbox.addEventListener('change', function () {
    if (this.checked) {
        displayBiome = true
    } else {
        displayBiome = false
    }
    drawNoisyMap(noisyPolygonList, displayBiome, voronoiObj)

});

numberOfPointsSlider.oninput = function () {
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

moistureSlider.oninput = function () {
    moistureAmount = this.value
    if (moistureAmount < 1) {
        moistureSpan.innerHTML = "-" + moistureAmount
    } else if (moistureAmount > 1) {
        moistureSpan.innerHTML = "+" + Math.abs((1 - moistureAmount).toFixed(1))
    } else moistureSpan.innerHTML = 0
    drawNoisyMap(noisyPolygonList, displayBiome, voronoiObj, moistureAmount, elevationAmount)
}

elevationSlider.oninput = function () {
    elevationAmount = this.value
    if (elevationAmount < 1) {
        elevationSpan.innerHTML = "-" + elevationAmount
    } else if (elevationAmount > 1) {
        elevationSpan.innerHTML = "+" + Math.abs((1 - elevationAmount).toFixed(1))
    } else elevationSpan.innerHTML = 0
    drawNoisyMap(noisyPolygonList, displayBiome, voronoiObj, moistureAmount, elevationAmount)
}

init()


