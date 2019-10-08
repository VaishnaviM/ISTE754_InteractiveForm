const TEMPLATE_PREFIX = "template_",
	FINAL_CHOICE = "fin_",
	OPTION_PREFIX = "opt_";

let data = '{"question":"Do you prefer cities or nature?","options":[{"option":"cities","question":"Do you prefer Arabic or Spanish?","options":[{"option":"Arabic","question":"Do you prefer ancient or new cities?","options":[{"option":"ancient","options":["Middle East Studies"]},{"option":"New cities","options":["RIT Dubai - Direct Enroll"]}]},{"option":"Spanish","question":"Do you prefer humanities or science?","options":[{"option":"humanities","options":["Advanced Liberal Arts - Barcelona"]},{"option":"science","options":["Santiago - Health Studies"]}]}]},{"option":"nature","question":"Do you prefer mountains or islands?","options":[{"option":"mountains","question":"Do you prefer South America or Aisa?","options":[{"option":"South America","options":["Semester in Cusco - Universidad San Ignacio Loyola"]},{"option":"Aisa","options":["Big Cats of the Himalayas: Tracking & Conservation"]}]},{"option":"islands","question":"Do you prefer Caribbean or South Pacific?","options":[{"option":"Caribbean","options":["Marine Resource Studies"]},{"option":"South Pacific","options":["Protecting the Phoenix Islands"]}]}]}]}',
	data1 = '{"question":"Do you prefer cities or nature?","options":[{"option":"cities","question":"Do you prefer Arabic or Spanish or Hindi?","options":[{"option":"Arabic","question":"Do you prefer ancient or new cities?","options":[{"option":"ancient","options":["Middle East Studies"]},{"option":"New cities","options":["RIT Dubai - Direct Enroll"]}]},{"option":"Hindi","question":"Do you prefer Mumbai or Delhi?","options":[{"option":"Mumbai","options":["IIT Powai"]},{"option":"Delhi","options":["IIT Delhi"]}]},{"option":"Spanish","question":"Do you prefer humanities or science?","options":[{"option":"humanities","options":["Advanced Liberal Arts - Barcelona"]},{"option":"science","options":["Santiago - Health Studies"]}]}]},{"option":"nature","question":"Do you prefer mountains or islands?","options":[{"option":"mountains","question":"Do you prefer South America or Aisa?","options":[{"option":"South America","options":["Semester in Cusco - Universidad San Ignacio Loyola"]},{"option":"Aisa","options":["Big Cats of the Himalayas: Tracking & Conservation"]}]},{"option":"islands","question":"Do you prefer Caribbean or South Pacific?","options":[{"option":"Caribbean","options":["Marine Resource Studies"]},{"option":"South Pacific","options":["Protecting the Phoenix Islands"]}]}]}]}',
	parsed_obj = "",
	currEleList = [],
	dataList = new Map(),
	stack = [];


function init() {
	parsed_obj = JSON.parse(data1);
	createElementTemplate(TEMPLATE_PREFIX + 0, parsed_obj.question, parsed_obj.options);
	stack.push(parsed_obj);
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

function addToStack() {

}

function removeChoiceFromDom() {
	let ele = document.getElementById(FINAL_CHOICE);
	if (ele) {
		ele.remove();
	}
}

function addOptionActionListener(ele) {
	ele.addEventListener("click", function () {
		var clickedButtonID = this.id,
		 buttonSplit = clickedButtonID.split("_"),
		 buttonID = buttonSplit[2],
		 elementID = buttonSplit[1];

		//Computing lengths of 2 arrays dynamically, as their lengths are being dynamically manipulated
		// console.log(elementID, index);
		if (currEleList.length - elementID > 0) {
			removeChoiceFromDom();
			for (let i = currEleList.length - 1; i > elementID; i--) {
				document.getElementById(TEMPLATE_PREFIX + i).remove();
				currEleList.pop();
				stack.pop();
			} //recursive function to remove from stack
		}

		stack.push(stack[stack.length - 1].options[buttonID]);

		if (stack[stack.length - 1].question) {
			console.log("creating", TEMPLATE_PREFIX + (currEleList.length-1));
			createElementTemplate((TEMPLATE_PREFIX + currEleList.length), stack[stack.length - 1].question, stack[stack.length - 1].options);
		} else {
			removeChoiceFromDom();
			createElementTemplate(FINAL_CHOICE, stack[stack.length - 1].options[0], "");
			stack.pop();
		}
	});
}

function createElementTemplate(eleName, question, optionList) {
	var element = createElements("div", eleName),
		rowEle = createElements("div", "", "class", "row"),
		colEle = createElements("div", "", "class", "col s16 m6"),
		cardEle = createElements("div", "", "class", "card"),
		qEle = createElements("p", "question"),
		optEle = createElements("div", OPTION_PREFIX, "class", "card-action"),
		cardContentEle = createElements("div", "", "class", "card-content");

	qEle.innerHTML = question;

	var optLen = optionList.length;
	if (optLen) {
		for (let i = 0; i < optLen; i++) {
			var opt = createElements("a", OPTION_PREFIX + currEleList.length + "_" + i, "href", "#");
			opt.innerHTML = optionList[i].option;
			addOptionActionListener(opt);
			optEle.appendChild(opt);

		}
		currEleList.push(eleName);
	}

	//append elements to DOM
	element.appendChild(rowEle);
	rowEle.appendChild(colEle);
	colEle.appendChild(cardEle);
	cardEle.appendChild(cardContentEle);
	cardContentEle.appendChild(qEle);
	cardContentEle.appendChild(optEle);
	document.body.appendChild(element);
}