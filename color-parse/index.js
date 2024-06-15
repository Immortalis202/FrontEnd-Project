/**
 * @module color-parse
 */

export default parse

/**
 * Base hues
 * http://dev.w3.org/csswg/css-color/#typedef-named-hue
 */
//FIXME: use external hue detector
var baseHues = {
	red: 0,
	orange: 60,
	yellow: 120,
	green: 180,
	blue: 240,
	purple: 300
}

/**
 * Parse color from the string passed
 *
 * @return {Object} A space indicator `space`, an array `values` and `alpha`
 */
function parse(cstr) {
	var m, parts = [], alpha = 1, space

	//numeric case
	if (typeof cstr === 'number') {
		return { space: 'rgb', values: [cstr >>> 16, (cstr & 0x00ff00) >>> 8, cstr & 0x0000ff], alpha: 1 }
	}
	if (typeof cstr === 'number') return { space: 'rgb', values: [cstr >>> 16, (cstr & 0x00ff00) >>> 8, cstr & 0x0000ff], alpha: 1 }

	cstr = String(cstr).toLowerCase();

	//keyword
	if (names[cstr]) {
		parts = names[cstr].slice()
		space = 'rgb'
	}

	//reserved words
	else if (cstr === 'transparent') {
		alpha = 0
		space = 'rgb'
		parts = [0, 0, 0]
	}

	//hex
	else if (cstr[0] === '#') {
		var base = cstr.slice(1)
		var size = base.length
		var isShort = size <= 4
		alpha = 1

		if (isShort) {
			parts = [
				parseInt(base[0] + base[0], 16),
				parseInt(base[1] + base[1], 16),
				parseInt(base[2] + base[2], 16)
			]
			if (size === 4) {
				alpha = parseInt(base[3] + base[3], 16) / 255
			}
		}
		else {
			parts = [
				parseInt(base[0] + base[1], 16),
				parseInt(base[2] + base[3], 16),
				parseInt(base[4] + base[5], 16)
			]
			if (size === 8) {
				alpha = parseInt(base[6] + base[7], 16) / 255
			}
		}

		if (!parts[0]) parts[0] = 0
		if (!parts[1]) parts[1] = 0
		if (!parts[2]) parts[2] = 0

		space = 'rgb'
	}

	// color space
	else if (m = /^((?:rgba?|hs[lvb]a?|hwba?|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms|oklch|oklab|color))\s*\(([^\)]*)\)/.exec(cstr)) {
		var name = m[1]
		space = name.replace(/a$/, '')
		var dims = space === 'cmyk' ? 4 : space === 'gray' ? 1 : 3
		parts = m[2].trim().split(/\s*[,\/]\s*|\s+/)

		// color(srgb-linear x x x) -> srgb-linear(x x x)
		if (space === 'color') space = parts.shift()

		parts = parts.map(function (x, i) {
			//<percentage>
			if (x[x.length - 1] === '%') {
				x = parseFloat(x) / 100
				// alpha -> 0..1
				if (i === 3) return x
				// rgb -> 0..255
				if (space === 'rgb') return x * 255
				// hsl, hwb H -> 0..100
				if (space[0] === 'h') return x * 100
				// lch, lab L -> 0..100
				if (space[0] === 'l' && !i) return x * 100
				// lab A B -> -125..125
				if (space === 'lab') return x * 125
				// lch C -> 0..150, H -> 0..360
				if (space === 'lch') return i < 2 ? x * 150 : x * 360
				// oklch/oklab L -> 0..1
				if (space[0] === 'o' && !i) return x
				// oklab A B -> -0.4..0.4
				if (space === 'oklab') return x * 0.4
				// oklch C -> 0..0.4, H -> 0..360
				if (space === 'oklch') return i < 2 ? x * 0.4 : x * 360
				// color(xxx) -> 0..1
				return x
			}

			//hue
			if (space[i] === 'h' || (i === 2 && space[space.length - 1] === 'h')) {
				//<base-hue>
				if (baseHues[x] !== undefined) return baseHues[x]
				//<deg>
				if (x.endsWith('deg')) return parseFloat(x)
				//<turn>
				if (x.endsWith('turn')) return parseFloat(x) * 360
				if (x.endsWith('grad')) return parseFloat(x) * 360 / 400
				if (x.endsWith('rad')) return parseFloat(x) * 180 / Math.PI
			}
			if (x === 'none') return 0
			return parseFloat(x)
		});

		alpha = parts.length > dims ? parts.pop() : 1
	}

	//named channels case
	else if (/[0-9](?:\s|\/|,)/.test(cstr)) {
		parts = cstr.match(/([0-9]+)/g).map(function (value) {
			return parseFloat(value)
		})

		space = cstr.match(/([a-z])/ig)?.join('')?.toLowerCase() || 'rgb'
	}

	return {
		space,
		values: parts,
		alpha
	}
}


let names = {
	
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};
