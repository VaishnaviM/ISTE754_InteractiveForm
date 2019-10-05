
// let data = '{"question":"Do you prefer cities or nature?","options":[{"cities":"Do you prefer Arabic or Spanish?","options":[{"Arabic":"Do you prefer ancient or new cities?","option":["Middle East Studies","RIT Dubai - Direct Enroll"]},{"Spanish":"Do you prefer humanities or science?","option":["Advanced Liberal Arts - Barcelona","Santiago - Health Studies"]}]},{"nature":"Do you prefer mountains or islands?","options":[{"mountains":"Do you prefer South America or Aisa?","option":["Semester in Cusco - Universidad San Ignacio Loyola","Big Cats of the Himalayas: Tracking & Conservation"]},{"islands":"Do you prefer Caribbean or South Pacific?","option":["Marine Resource Studies","Protecting the Phoenix Islands"]}]}]}';
//let data = '{"question":"Do you prefer cities or nature?","options":[{"question":"Do you prefer Araic or Spanish?","options":[{"question":"Do you prefer ancient or new cities?","option":["Middle East Studies","RIT Dubai - Direct Enroll"]},{"question":"Do you prefer humanities or science?","option":["Advanced Liberal Arts - Barcelona","Santiago - Health Studies"]}]},{"question":"Do you prefer mountains or islands?","options":[{"question":"Do you prefer South America or Aisa?","option":["Semester in Cusco - Universidad San Ignacio Loyola","Big Cats of the Himalayas: Tracking & Conservation"]},{"question":"Do you prefer Caribbean or South Pacific?","option":["Marine Resource Studies","Protecting the Phoenix Islands"]}]}]}',
let data = '{"question":"Do you prefer cities or nature?","options":[{"option":"cities","question":"Do you prefer Arabic or Spanish?","options":[{"option":"Arabic","question":"Do you prefer ancient or new cities?","options":["Middle East Studies","RIT Dubai - Direct Enroll"]},{"option":"Spanish","question":"Do you prefer humanities or science?","options":["Advanced Liberal Arts - Barcelona","Santiago - Health Studies"]}]},{"option":"nature","question":"Do you prefer mountains or islands?","options":[{"option":"mountains","question":"Do you prefer South America or Aisa?","options":["Semester in Cusco - Universidad San Ignacio Loyola","Big Cats of the Himalayas: Tracking & Conservation"]},{"option":"islands","question":"Do you prefer Caribbean or South Pacific?","options":["Marine Resource Studies","Protecting the Phoenix Islands"]}]}]}',
	parsed_obj = "",
	template = [],
	counter = 0;

function init() {
	// console.log(data);
	parseJSON();
	createElement(true);
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
		createElement(true); //TODO - add logic here
	});
}

function createElementTemplate(eleName, question, optionList) {
	console.log("in");
	var element = createElements("div", eleName),
		rowEle = createElements("div", "", "class", "row"),
		colEle = createElements("div", "", "class", "col s16 m6"),
		cardEle = createElements("div", "", "class", "card"),
		cardContentEle = createElements("div", "", "class", "card-content"),
		qEle = createElements("p", "question")
		optEle = createElements("div", "opt", "class", "card-action");

	qEle.innerHTML = question;

	var optLen = optionList.length
	if (optLen) {
		console.log(optionList);
		for (let i = 0; i < optLen; i++) {
			var opt = createElements("a", "opt_"+i, "href" + "#");
			opt.innerHTML = optionList[i].option;
			addOptionActionListener(opt);
			optEle.appendChild(opt);

			template[counter] = optionList[i];
			counter++;	
		}
	}

	//append elements to DOM
	element.appendChild(rowEle);
	rowEle.appendChild(colEle);
	colEle.appendChild(cardEle);
	cardEle.appendChild(cardContentEle);
	cardContentEle.appendChild(qEle);
	cardContentEle.appendChild(optEle);
	document.body.appendChild(element);
	console.log("out");

}

function createElement(firstElement) {
	if (firstElement) {
		createElementTemplate("template", parsed_obj.question, parsed_obj.options);
	}
}

