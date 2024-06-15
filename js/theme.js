const themeMap = {
	dark: "light",
	light: "solar",
	solar: "dark",
};

const wikiImage = {
	dark: "../assets/657px-Wikipedia-logo_(inverse).png",
	light: "../assets/Wikipedia_logo_gold.png",
	solar: "../assets/Wikipedia_logo_red.png",
}

const theme =
	localStorage.getItem("theme") ||
	((tmp = Object.keys(themeMap)[0]), localStorage.setItem("theme", tmp), tmp);
const bodyClass = document.body.classList;
bodyClass.add(theme);

function toggleTheme() {
	const current = localStorage.getItem("theme");
	const next = themeMap[current];


	bodyClass.replace(current, next);

	const wiki = document.querySelector("#wiki");
    wiki.src = wikiImage[current];

	localStorage.setItem("theme", next);


}

document.getElementById("themeButton").onclick = toggleTheme;

const nav = document.querySelector(".navbar");
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



// jQuery(function( $ ){
//     var counter = 0;
//     $('.button').click(function() {
//       $('.sidebar').animate({width: 'toggle'}, 'slow');
//       if(counter === 0) {
//        $('.content').animate({width: 300}, 'slow');
//        counter++ ;
//       } else {
//       $('.content').animate({width: 700}, 'slow');
//       counter-- ;
//       }
//     });
//   });