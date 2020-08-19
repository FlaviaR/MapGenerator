var seedrandom = require('seedrandom');

// Factor should ideally be between 1.0 and 2.0
// lower bounds lead to more constricted islands
const ISLAND_FACTOR = 1.15

function getRandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Generates a randomized map -- very sparse
export function generateRandomMap(point) {
    let num = Math.floor(seedrandom(point[0] + point[1] + 0.5)() * 100);
    console.log(num)
	if (num % 2 == 0) return false;
	else return true;
}

// CHeck to see whether a given point is inside land or in water
export function isInside(point, width) {
	if (displayRadial) {
		let SIZE = width;
		// The point has to be normalized to be between -1.0 and +1.0
		let pt = [1.5 * (p[0]/SIZE - 0.5), 1.5 * (p[1]/SIZE - 0.5)];
		return generateRadialMap(pt);
	}
	else return generateRandomMap(point);
}

// Gernerates a circular map using overlapping sine waves (ensue black magic)
// Center point of a voronoi cell
export function generateRadialMap(point) {
// 	srand (p[0] + p[1] + 0.5);
// 	bumps = getRandomNumber(6) 
	
// 	std::random_device rd;  //Will be used to obtain a seed for the random number engine
// 	std::mt19937 gen(rd()); //Standard mersenne_twister_engine seeded with rd()
// 	std::uniform_real_distribution<> dist(0, 2*PI);
// 	double dipAngle = dist(gen); // random between 0 and 2PI
// 	double startAngle = dist(gen); // random between 0 and 2PI
	
// 	double dipWidth = ((double)(rand()%5)/10) + 0.2; // random between 0.2 and 0.7
// 	double angle = atan(p[1]/p[0]);
// 	double length = 0.5 * (std::max(std::abs(p[0]), std::abs(p[1]))) + pointLength(p);
// 	double r1 = 0.5 + 0.40*sin(startAngle + bumps*angle + cos((bumps + 3) * angle));
// 	double r2 = 0.7 - 0.20*sin(startAngle + bumps*angle - sin((bumps + 2) * angle));
	
// 	if (std::abs(angle - dipAngle) < dipWidth or std::abs(angle - dipAngle + 2*PI) < dipWidth or std::abs(angle - dipAngle - 2*PI) < dipWidth) {
// 		r1 = r2 = 0.2;
// 	}
	
// 	bool isInside = (length < r1 or (length > r1 * ISLAND_FACTOR && length < r2));
// 	return isInside;
}