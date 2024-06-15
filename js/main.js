import GeoJSON from "../ol/format/GeoJSON.js";
import Map from "../ol/Map.js";
import VectorLayer from "../ol/layer/Vector.js";
import VectorSource from "../ol/source/Vector.js";
import View from "../ol/View.js";
import countryList from "./nations.js";
import Style from "../ol/style/Style.js";
import Fill from "../ol/style/Fill.js";
import { Projection } from "../ol/proj.js";
import { none } from "../ol/centerconstraint.js";

let target = 10;
let currCountry;
let isGuessed = 2;
const total = 238;
let point = 0;

document.addEventListener("DOMContentLoaded", () => {
	let card = showCard();
	document.body.append(card);
});

//const endgameCard = document.getElementById('endgame-card');
//const endgameMessage = document.getElementById('endgame-message');

const firstTryStyle = new Style({
	fill: new Fill({ color: [0, 204, 0, 1] }),
});

const secondTryStyle = new Style({
	fill: new Fill({ color: [255, 255, 0, 1] }),
});

const thirdTryStyle = new Style({
	fill: new Fill({ color: [255, 188, 31, 1] }),
});

const wrongGuessStyle = new Style({
	fill: new Fill({ color: [218, 0, 8, 1] }),
});

let FtryNumber = 0;
let StryNumber = 0;
let TtryNumber = 0;
let WtryNumber = 0;

const FTry = document.querySelector("#numberCorrect");
const STry = document.querySelector("#number2Try");
const TTry = document.querySelector("#number3Try");
const WTry = document.querySelector("#numberWrong");

FTry.innerHTML = FtryNumber;
STry.innerHTML = StryNumber;
TTry.innerHTML = TtryNumber;
WTry.innerHTML = WtryNumber;

const vectorLayer = new VectorLayer({
	background: "#887ce700",
	source: new VectorSource({
		url: "https://r2.datahub.io/clvyjaryy0000la0cxieg4o8o/master/raw/data/countries.geojson",
		format: new GeoJSON(),
	}),
	style: {
		"fill-color": ["string", ["get", "COLOR"], "#FFFFFF"],
	},
});

const map = new Map({
	layers: [vectorLayer],
	target: "map",
	view: new View({
		center: [0, 0],
		zoom: 2,
	}),
});

const featureOverlay = new VectorLayer({
	source: new VectorSource(),
	map: map,
	style: {
		"stroke-color": "rgba(100, 0, 3, 1)",
		"stroke-width": 2,
	},
});

let highlight;
const displayFeatureInfo = function (pixel) {
	const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
		return feature;
	});

	if (feature !== highlight) {
		if (highlight) {
			featureOverlay.getSource().removeFeature(highlight);
		}
		if (feature) {
			featureOverlay.getSource().addFeature(feature);
		}
		highlight = feature;
	}
};

map.on("pointermove", function (evt) {
	if (evt.dragging) {
		return;
	}
	const pixel = map.getEventPixel(evt.originalEvent);
	displayFeatureInfo(pixel);
});

map.on("click", function (evt) {
	displayFeatureInfo(evt.pixel);
	let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
		return feature;
	});
	if (!feature) {
	} else {
		if (feature?.get("ADMIN") === currCountry) {
			isGuessed = 1;

			switch (trial) {
				case 1:
					feature?.setStyle([thirdTryStyle]);
					point += 1 / 3;
					updatePoint();
					TtryNumber++;
					TTry.innerHTML = TtryNumber;
					break;

				case 2:
					feature?.setStyle([secondTryStyle]);
					point += 2 / 3;
					updatePoint();
					StryNumber++;
					STry.innerHTML = StryNumber;
					break;

				case 3:
					feature?.setStyle([firstTryStyle]);
					point += 1;
					updatePoint();
					FtryNumber++;
					FTry.innerHTML = FtryNumber;
					break;
			}
			changeCountry();
			buildOnDiv();
		} else {
			trial--;
			if (trial == 0) {
				highlightCountry(currCountry, [wrongGuessStyle]);
				updatePoint();
				WtryNumber++;
				WTry.innerHTML = WtryNumber;
				changeCountry();
				buildOnDiv();
			}
		}
	}
});

//? Potrebbe essere inutile
// function getFromAPI(url, callback) {
// 	var obj;
// 	fetch(url)
// 		.then((res) => res.json())
// 		.then((data) => (obj = data))
// 		.then(() => callback(obj))
// 		.catch((e) => {
// 			console.log(e);
// 		});
// }

// getFromAPI(
// 	"../onlyNameNation.json",
// 	getData
// );

// function getData(arrOfObjs) {
// 	console.log(arrOfObjs);
// 	console.log(arrOfObjs.country[1]);
// 	buildOnDiv();
// }

function buildOnDiv() {
	let flag = document.getElementById("flag");

	flag.src =
		"https://flagcdn.com/w320/" +
		countryList.country[seqNotOrdered[counter]].ISO2.toLowerCase() +
		".png";

	let stateName = document.getElementById("stateName");
	stateName.innerHTML = currCountry;
	let cou = document.getElementById("counter");
	cou.textContent = `${counter + 1}/${target}`;
}

function shuffle(arrayOrdered) {
	let SeqNotOrdered = arrayOrdered;
	for (let index = arrayOrdered.length - 1; index > 0; index--) {
		let j = Math.floor(Math.random() * (index + 1));
		let temp = SeqNotOrdered[j];
		SeqNotOrdered[j] = SeqNotOrdered[index];
		SeqNotOrdered[index] = temp;
	}
	return SeqNotOrdered;
}

let seqOrdered = [];
let seqNotOrdered = [];
for (let i = 0; i < 238; i++) {
	seqOrdered[i] = i;
}
seqNotOrdered = shuffle(seqOrdered);
let trial = 3;
let counter = 0;

//* 2 -> default
//* 1 -> wrong
//* 0 -> true

//? trial = 3
currCountry = countryList.country[seqNotOrdered[counter]].Name;
console.log(currCountry);

buildOnDiv();
console.log(counter);
updatePoint();

//colorCountry(currCountry, [wrongGuessStyle]); // Replace 'Null Island' with the desired country name

function changeCountry() {
	trial = 3;
	isGuessed = 2;
	counter++;
	if (counter === target) {
		let card = showEndCard();
	document.body.append(card);
	} else {
		let cou = document.getElementById("counter");
		cou.textContent = `${counter}/${target}`;
		currCountry = countryList.country[seqNotOrdered[counter]].Name;
		console.log(currCountry);
	}
}

async function highlightCountry(countryName, style) {
	// Check if features are already loaded
	if (vectorLayer.getSource().getState() === "ready") {
		applyStyleToCountry(countryName, style);
	} else {
		// Wait for features to be loaded
		await new Promise((resolve) => {
			vectorLayer.getSource().once("change", (event) => {
				if (event.target.getState() === "ready") {
					resolve();
				}
			});
		});

		// Apply style after features are loaded
		applyStyleToCountry(countryName, style);
	}
}

function applyStyleToCountry(countryName, style) {
	vectorLayer
		.getSource()
		.getFeatures()
		.forEach((feature) => {
			if (feature.get("ADMIN") === countryName) {
				feature.setStyle(style);
				map.getView().fit(feature.getGeometry().getExtent(), {
					duration: 1000,
					maxZoom: 5,
				});
			}
		});
}

function updatePoint() {
	let pointHTML = document.getElementById("point");
	pointHTML.textContent = `${((100 * point) / (counter + 1)).toFixed(0)}%`;
}

const showEndCard = () => {
	let cardDiv = document.createElement("div");
	let cardTitle = document.createElement("div");
	let cardContent = document.createElement("div");
	let cardFooter = document.createElement("div");

	let title = document.createElement("h2");
	title.innerHTML = "Game Ended";
	let par = document.createElement("p");
	par.innerHTML =
		`Congrats! <br>
		First Try guess ${FtryNumber} <br>
		Second Try guess ${StryNumber} <br>
		Third Try guess ${TtryNumber} <br>
		Wrong guess ${WtryNumber} <br>
		Point: ${((100 * point) / (counter + 1)).toFixed(0)}%

		
		`
	let buttonFull = document.createElement("button");
	buttonFull.innerHTML = "RESTART";
	
	

	cardTitle.classList.add("cardTitle");
	cardContent.classList.add("cardContent");
	cardFooter.classList.add("cardFooter");

	cardDiv.append(cardTitle);
	cardDiv.append(cardContent);
	cardDiv.append(cardFooter);

	cardTitle.append(title);
	cardContent.append(par);
	cardFooter.append(buttonFull);
	

	cardDiv.classList.add("cardDiv");


	buttonFull.addEventListener("click", () => {
		location.reload();
	} )
	

	return cardDiv;
};

const showCard = () => {
	let cardDiv = document.createElement("div");
	let cardTitle = document.createElement("div");
	let cardContent = document.createElement("div");
	let cardFooter = document.createElement("div");

	let title = document.createElement("h2");
	title.innerHTML = "Game Version";
	let par = document.createElement("p");
	par.innerHTML =
		`Choose the game version: <br>
		<br>
		Full version with 238 country <br>
		Demo version with 10 country`
	let buttonFull = document.createElement("button");
	buttonFull.innerHTML = "FULL";
	
	let buttonDemo = document.createElement("button");
	buttonDemo.innerHTML = "DEMO";

	cardTitle.classList.add("cardTitle");
	cardContent.classList.add("cardContent");
	cardFooter.classList.add("cardFooter");

	cardDiv.append(cardTitle);
	cardDiv.append(cardContent);
	cardDiv.append(cardFooter);

	cardTitle.append(title);
	cardContent.append(par);
	cardFooter.append(buttonFull);
	cardFooter.append(buttonDemo);

	cardDiv.classList.add("cardDiv");


	buttonFull.addEventListener("click", () => {
		target = 238;
		cardDiv.style.display = "none";
		console.log(target)
	} )
	buttonDemo.addEventListener("click", () => {
		target = 10;
		cardDiv.style.display = "none";
		console.log(target);
	} )

	return cardDiv;
};

const themeMap = {
	dark: "light",
	light: "solar",
	solar: "dark",
};

const theme =
	localStorage.getItem("theme") ||
	((tmp = Object.keys(themeMap)[0]), localStorage.setItem("theme", tmp), tmp);
const bodyClass = document.body.classList;
bodyClass.add(theme);

function toggleTheme() {
	const current = localStorage.getItem("theme");
	const next = themeMap[current];

	bodyClass.replace(current, next);
	localStorage.setItem("theme", next);
}

document.getElementById("themeButton").onclick = toggleTheme;

const nav = document.querySelector(".navbarNBS");
const main = document.querySelector("main");


nav.addEventListener("mouseover", () => {
	if (nav.classList.contains("rientra")) {
		nav.classList.remove("rientra");
	}
	nav.classList.add("esci");
	if(main.classList.contains("rientra-margine")) {
        main.classList.remove("rientra-margine");

    }
	main.classList.add("esci-margine");
});

nav.addEventListener("mouseout", () => {
	if (nav.classList.contains("esci")) {
        nav.classList.remove("esci");
	
    }
	nav.classList.add("rientra");
    
    if(main.classList.contains("esci-margine")) {
        main.classList.remove("esci-margine");

    }

		main.classList.add("rientra-margine");
});

let country = [
	"ad",
	"ae",
	"af",
	"ag",
	"ai",
	"al",
	"am",
	"ao",
	"aq",
	"ar",
	"as",
	"at",
	"au",
	"aw",
	"ax",
	"az",
	"ba",
	"bb",
	"bd",
	"be",
	"bf",
	"bg",
	"bh",
	"bi",
	"bj",
	"bl",
	"bm",
	"bn",
	"bo",
	"bq",
	"br",
	"bs",
	"bt",
	"bv",
	"bw",
	"by",
	"bz",
	"ca",
	"cc",
	"cd",

	"cf",
	"cg",
	"ch",
	"ci",
	"ck",
	"cl",
	"cm",
	"cn",
	"co",
	"cr",
	"cu",
	"cv",
	"cw",
	"cx",
	"cy",
	"cz",
	"de",
	"dj",
	"dk",
	"dm",
	"do",
	"dz",
	"ec",
	"ee",
	"eg",
	"eh",
	"er",
	"es",
	"et",
	"fi",
	"fj",
	"fk",
	"fm",
	"fo",
	"fr",
	"ga",
	"gb",
	"gd",
	"ge",
	"gf",
	"gg",
	"gh",
	"gi",
	"gl",
	"gm",
	"gn",
	"gp",
	"gq",
	"gr",
	"gs",
	"gt",
	"gu",
	"gw",
	"gy",
	"hk",
	"hm",
	"hn",
	"hr",
	"ht",
	"hu",
	"id",
	"ie",
	"il",
	"im",
	"in",
	"io",
	"iq",
	"ir",
	"is",
	"it",
	"jm",
	"jo",
	"jp",
	"ke",
	"kg",
	"kh",
	"ki",
	"km",
	"kn",
	"kp",
	"kr",
	"kw",
	"ky",
	"kz",
	"la",
	"lb",
	"lc",
	"li",
	"lk",
	"lr",
	"ls",
	"lt",
	"lu",
	"lv",
	"ly",
	"ma",
	"mc",
	"md",
	"me",
	"mf",
	"mg",
	"mh",
	"mk",
	"ml",
	"mm",
	"mn",
	"mo",
	"mp",
	"mq",
	"mr",
	"ms",
	"mt",
	"mu",
	"mv",
	"mw",
	"mx",
	"my",
	"mz",
	"na",
	"nc",
	"ne",
	"nf",
	"ng",
	"ni",
	"nl",
	"no",
	"np",
	"nr",
	"nu",
	"nz",
	"om",
	"pa",
	"pe",
	"pf",
	"pg",
	"ph",
	"pk",
	"pl",
	"pm",
	"pn",
	"pr",
	"ps",
	"pt",
	"pw",
	"py",
	"qa",
	"re",
	"ro",
	"rs",
	"ru",
	"rw",
	"sa",
	"sb",
	"sc",
	"sd",
	"se",
	"sg",
	"sh",
	"si",
	"sj",
	"sk",
	"sl",
	"sm",
	"sn",
	"so",
	"sr",
	"ss",
	"st",
	"sv",
	"sx",
	"sy",
	"sz",
	"tc",
	"td",
	"tf",
	"tg",
	"th",
	"tj",
	"tk",
	"tl",
	"tm",
	"tn",
	"to",
	"tr",
	"tt",
	"tv",
	"tw",
	"tz",
	"ua",
	"ug",
	"us",
	"uy",
	"uz",
	"va",
	"vc",
	"ve",
	"vg",
	"vi",
	"vn",
	"vu",
	"wf",
	"ws",
	"xk",
	"ye",
	"yt",
	"za",
	"zm",
	"zw",
];





const selectCountry = () => {
	let r = Math.floor(Math.random() * 247);
	return `https://flagcdn.com/${country[r]}.svg`;
};


const selectCountryOutline = () => {
	let r = Math.floor(Math.random() * 247);
	return `../assets/all/${country[r]}/vector.svg`;
};



const outlineNav = document.querySelector("#outlineNav");
outlineNav.src = selectCountryOutline();

const flagNav = document.querySelector("#flagNav");
flagNav.src = selectCountry();
