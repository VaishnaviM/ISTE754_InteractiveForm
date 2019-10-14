const TEMPLATE_PREFIX = "template_",
	FINAL_CHOICE = "fin_",
	OPTION_PREFIX = "opt_";

let data = '{"question":"Do you prefer cities or nature?","select":[{"option":"cities","question":"Do you prefer Arabic or Spanish or Hindi?","select":[{"option":"Arabic","question":"Do you prefer ancient or new cities?","select":[{"option":"ancient","select":["Middle East Studies"]},{"option":"New cities","select":["RIT Dubai - Direct Enroll"]}]},{"option":"Hindi","question":"Do you prefer Mumbai or Delhi?","select":[{"option":"Mumbai","select":["IIT Powai"]},{"option":"Delhi","select":["IIT Delhi"]}]},{"option":"Spanish","question":"Do you prefer humanities or science?","select":[{"option":"humanities","select":["Advanced Liberal Arts - Barcelona"]},{"option":"science","select":["Santiago - Health Studies"]}]}]},{"option":"nature","question":"Do you prefer mountains or islands?","select":[{"option":"mountains","question":"Do you prefer South America or Aisa?","select":[{"option":"South America","select":["Semester in Cusco - Universidad San Ignacio Loyola"]},{"option":"Aisa","select":["Big Cats of the Himalayas: Tracking & Conservation"]}]},{"option":"islands","question":"Do you prefer Caribbean or South Pacific?","select":[{"option":"Caribbean","select":["Marine Resource Studies"]},{"option":"South Pacific","select":["Protecting the Phoenix Islands"]}]}]}]}',
	data1 = '{"question":"Do you prefer cities or nature?","options":[{"option":"cities","question":"Do you prefer Arabic or Spanish or Hindi?","options":[{"option":"Arabic","question":"Do you prefer ancient or new cities?","options":[{"option":"ancient","options":["Middle East Studies"]},{"option":"New cities","options":["RIT Dubai - Direct Enroll"]}]},{"option":"Hindi","question":"Do you prefer Mumbai or Delhi?","options":[{"option":"Mumbai","options":["IIT Powai"]},{"option":"Delhi","options":["IIT Delhi"]}]},{"option":"Spanish","question":"Do you prefer humanities or science?","options":[{"option":"humanities","options":["Advanced Liberal Arts - Barcelona"]},{"option":"science","options":["Santiago - Health Studies"]}]}]},{"option":"nature","question":"Do you prefer mountains or islands?","options":[{"option":"mountains","question":"Do you prefer South America or Aisa?","options":[{"option":"South America","options":["Semester in Cusco - Universidad San Ignacio Loyola"]},{"option":"Aisa","options":["Big Cats of the Himalayas: Tracking & Conservation"]}]},{"option":"islands","question":"Do you prefer Caribbean or South Pacific?","options":[{"option":"Caribbean","options":["Marine Resource Studies"]},{"option":"South Pacific","options":["Protecting the Phoenix Islands"]}]}]}]}',
	parsed_obj = "",
	currEleList = [],
	dataList = new Map(),
	stack = [],
	bodyEle = document.getElementById("bodyTag");


function init() {
	designPage();
	parsed_obj = JSON.parse(data);
	bodyEle.append(createCardTemplate(TEMPLATE_PREFIX + 0, "", parsed_obj.question, parsed_obj.select)); //move to form submit action
	stack.push(parsed_obj);
}

function designPage(){

	let mainBodyDiv = createElements("div", "", "class", "row");
	bodyEle.appendChild(createHeader("RIT Study Abroad Application form"));
	mainBodyDiv.appendChild(createForm());
	bodyEle.appendChild(mainBodyDiv);
}

function createHeader(headText){

	let headDiv = createElements("div", "", "class", "row"),
		headEle = createElements("h2", "", "class", "col 12"),
		textEle = document.createTextNode(headText);

	headEle.appendChild(textEle);
	headDiv.appendChild(headEle);
	return headDiv;
}

function createForm(){

	let formEle = createElements("form", "", "class", "col s12"),
		formDiv1 = createElements("div", "", "class", "row");	

	formDiv1.appendChild(createFormElement("text", "fname", "", "First Name", "John"));
	formDiv1.appendChild(createFormElement("text", "lname", "", "Last Name", "Doe"));
	formEle.appendChild(formDiv1);
	return formEle;
}

function createFormElement(type, id, name, content, placeholder){

	let mainDiv = createElements("div", "", "class", "input-field col s6"),
		inputEle = document.createElement( "input" ),
		labelEle = document.createElement( "label" ),
		textEle = document.createTextNode(content);

		inputEle.setAttribute( "id", id );
		inputEle.setAttribute( "type", type );
		inputEle.setAttribute( "name", name );
		labelEle.setAttribute( "for", id );
		
		labelEle.appendChild(textEle);
		mainDiv.appendChild(inputEle);
		mainDiv.appendChild(labelEle);
	
	return mainDiv;
}

function createElements(type, id, property, val) {
	let ele = document.createElement(type);
	if (id) {
		ele.id = id;
	}
	if (property == "class") {
		ele.className = val;
	}
	return ele;
}

function removeChoiceFromDom() {
	let ele = document.getElementById(FINAL_CHOICE);
	if (ele) {
		ele.remove();
	}
}

function addOptionActionListener(ele) {
	ele.addEventListener("click", function () {
		let clickedButtonID = this.id,
		 buttonSplit = clickedButtonID.split("_"),
		 buttonID = buttonSplit[2],
		 elementID = buttonSplit[1];

		//Computing lengths of 2 arrays dynamically, as their lengths are being dynamically manipulated
		if (currEleList.length - elementID > 0) {
			removeChoiceFromDom();
			for (let i = currEleList.length - 1; i > elementID; i--) {
				document.getElementById(TEMPLATE_PREFIX + i).remove();
				currEleList.pop();
				stack.pop();
			} 
		}

		stack.push(stack[stack.length - 1].select[buttonID]);

		if (stack[stack.length - 1].question) {
			let card = createCardTemplate((TEMPLATE_PREFIX + currEleList.length), "", stack[stack.length - 1].question, stack[stack.length - 1].select);
			bodyEle.append(card);
		} else {
			removeChoiceFromDom();
			let card = createCardTemplate(FINAL_CHOICE, "", stack[stack.length - 1].select[0], "");
			bodyEle.append(card);
			stack.pop();
		}
	});
}

function createCardTemplate(eleName, cardTitle, cardContent, cardOptions) {
	let element = createElements("div", eleName),
		rowEle = createElements("div", "", "class", "row"),
		colEle = createElements("div", "", "class", "col s16 m6"),
		cardEle = createElements("div", "", "class", "card"),
		titleEle = createElements("span", "", "class", "card-title")
		contentEle = createElements("p", "cardContent"),
		optionsEle = createElements("div", OPTION_PREFIX, "class", "card-action"),
		cardContentEle = createElements("div", "", "class", "card-content");

		titleEle.innerHTML = cardTitle;
		contentEle.innerHTML = cardContent;


	if (null !== cardOptions) {
		let optLen = cardOptions.length;
		if (optLen) {
			for (let i = 0; i < optLen; i++) {
				let opt = createElements("a", OPTION_PREFIX + currEleList.length + "_" + i, "href", "#");
				opt.innerHTML = cardOptions[i].option;
				addOptionActionListener(opt);
				optionsEle.appendChild(opt);

			}
			currEleList.push(eleName);
		}
	}

	//append elements to DOM
	element.appendChild(rowEle);
	rowEle.appendChild(colEle);
	colEle.appendChild(cardEle);
	cardEle.appendChild(cardContentEle);
	cardContentEle.appendChild(titleEle);
	cardContentEle.appendChild(contentEle);
	cardContentEle.appendChild(optionsEle);

	return element;
}