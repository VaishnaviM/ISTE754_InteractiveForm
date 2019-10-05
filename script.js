// let data = '{"question":"Do you prefer cities or nature?","options":[{"cities":"Do you prefer Arabic or Spanish?","options":[{"Arabic":"Do you prefer ancient or new cities?","option":["Middle East Studies","RIT Dubai - Direct Enroll"]},{"Spanish":"Do you prefer humanities or science?","option":["Advanced Liberal Arts - Barcelona","Santiago - Health Studies"]}]},{"nature":"Do you prefer mountains or islands?","options":[{"mountains":"Do you prefer South America or Aisa?","option":["Semester in Cusco - Universidad San Ignacio Loyola","Big Cats of the Himalayas: Tracking & Conservation"]},{"islands":"Do you prefer Caribbean or South Pacific?","option":["Marine Resource Studies","Protecting the Phoenix Islands"]}]}]}';
//let data = '{"question":"Do you prefer cities or nature?","options":[{"question":"Do you prefer Araic or Spanish?","options":[{"question":"Do you prefer ancient or new cities?","option":["Middle East Studies","RIT Dubai - Direct Enroll"]},{"question":"Do you prefer humanities or science?","option":["Advanced Liberal Arts - Barcelona","Santiago - Health Studies"]}]},{"question":"Do you prefer mountains or islands?","options":[{"question":"Do you prefer South America or Aisa?","option":["Semester in Cusco - Universidad San Ignacio Loyola","Big Cats of the Himalayas: Tracking & Conservation"]},{"question":"Do you prefer Caribbean or South Pacific?","option":["Marine Resource Studies","Protecting the Phoenix Islands"]}]}]}',
const 	TEMPLATE_PREFIX = "template_",
		OPTION_PREFIX = "opt_";

let data = '{"question":"Do you prefer cities or nature?","options":[{"option":"cities","question":"Do you prefer Arabic or Spanish?","options":[{"option":"Arabic","question":"Do you prefer ancient or new cities?","options":["Middle East Studies","RIT Dubai - Direct Enroll"]},{"option":"Spanish","question":"Do you prefer humanities or science?","options":["Advanced Liberal Arts - Barcelona","Santiago - Health Studies"]}]},{"option":"nature","question":"Do you prefer mountains or islands?","options":[{"option":"mountains","question":"Do you prefer South America or Aisa?","options":["Semester in Cusco - Universidad San Ignacio Loyola","Big Cats of the Himalayas: Tracking & Conservation"]},{"option":"islands","question":"Do you prefer Caribbean or South Pacific?","options":["Marine Resource Studies","Protecting the Phoenix Islands"]}]}]}',
	parsed_obj = "",
	template = [],
	counter = 0;


function init() {
	// console.log(data);
	parseJSON();
	createElementTemplate(TEMPLATE_PREFIX, parsed_obj.question, parsed_obj.options);
}

function parseJSON() {
	parsed_obj = JSON.parse(data);
	// console.log(parsed_obj.question);
}

function createElements(type, id, property, val) {
	var ele = document.createElement(type);
	if (id) {
		ele.id = id;
	}
	if (property == "class") {
		ele.className = val;
	}
	return ele;
}

function addOptionActionListener(ele){
	ele.addEventListener("click", function(){
		var clickedButtonID = this.id;
		var elementID = clickedButtonID.split("_")[1];
		console.log("Clicked on element : " + elementID+ " "+ (template.length));
		if( elementID != template.length-1){ 
			// console.log( "remove "  + (template.length-1-elementID) + " elements");
			for(let i= template.length-1; i>elementID; i--){
				var elementToRemove = document.getElementById(TEMPLATE_PREFIX+i);
				console.log("Removed - " + TEMPLATE_PREFIX+i);
				console.log(elementToRemove);
				elementToRemove.remove();
				template.pop();
				// console.log(template.length + template);
			}
		}
		console.log("Added new");
		createElementTemplate(TEMPLATE_PREFIX, parsed_obj.question, parsed_obj.options);
	});
}

function createElementTemplate(name, question, optionList) {
	var index 	= 	template.length,
		eleName	=	name+index;
		element = 	createElements	("div", eleName),
		rowEle 	= 	createElements	("div", "", "class", "row"),
		colEle 	= 	createElements	("div", "", "class", "col s16 m6"),
		cardEle = 	createElements	("div", "", "class", "card"),
		qEle 	= 	createElements	("p", 	"question"),
		optEle 	= 	createElements	("div", OPTION_PREFIX, "class", "card-action"),
		cardContentEle = createElements("div", "", "class", "card-content");

	qEle.innerHTML = question;

	var optLen = optionList.length
	if (optLen) {
		for (let i = 0; i < optLen; i++) {
			var opt = createElements("a", OPTION_PREFIX+index+"_"+i, "href" + "#");
			opt.innerHTML = optionList[i].option;
			addOptionActionListener(opt);
			optEle.appendChild(opt);
			template[index] = eleName;
		}
	}

	console.log(template); 

	//append elements to DOM
	element.appendChild(rowEle);
	rowEle.appendChild(colEle);
	colEle.appendChild(cardEle);
	cardEle.appendChild(cardContentEle);
	cardContentEle.appendChild(qEle);
	cardContentEle.appendChild(optEle);
	document.body.appendChild(element);
}