export const random_hex_color_code = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};


export function getRandomNumber(max) {
	return Math.floor(Math.random() * Math.floor(max + 1));
}
