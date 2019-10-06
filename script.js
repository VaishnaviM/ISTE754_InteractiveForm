// let data = '{"question":"Do you prefer cities or nature?","options":[{"cities":"Do you prefer Arabic or Spanish?","options":[{"Arabic":"Do you prefer ancient or new cities?","option":["Middle East Studies","RIT Dubai - Direct Enroll"]},{"Spanish":"Do you prefer humanities or science?","option":["Advanced Liberal Arts - Barcelona","Santiago - Health Studies"]}]},{"nature":"Do you prefer mountains or islands?","options":[{"mountains":"Do you prefer South America or Aisa?","option":["Semester in Cusco - Universidad San Ignacio Loyola","Big Cats of the Himalayas: Tracking & Conservation"]},{"islands":"Do you prefer Caribbean or South Pacific?","option":["Marine Resource Studies","Protecting the Phoenix Islands"]}]}]}';
//let data = '{"question":"Do you prefer cities or nature?","options":[{"question":"Do you prefer Araic or Spanish?","options":[{"question":"Do you prefer ancient or new cities?","option":["Middle East Studies","RIT Dubai - Direct Enroll"]},{"question":"Do you prefer humanities or science?","option":["Advanced Liberal Arts - Barcelona","Santiago - Health Studies"]}]},{"question":"Do you prefer mountains or islands?","options":[{"question":"Do you prefer South America or Aisa?","option":["Semester in Cusco - Universidad San Ignacio Loyola","Big Cats of the Himalayas: Tracking & Conservation"]},{"question":"Do you prefer Caribbean or South Pacific?","option":["Marine Resource Studies","Protecting the Phoenix Islands"]}]}]}',
const TEMPLATE_PREFIX = "template_",
	OPTION_PREFIX = "opt_";

let data = '{"question":"Do you prefer cities or nature?","options":[{"option":"cities","question":"Do you prefer Arabic or Spanish?","options":[{"option":"Arabic","question":"Do you prefer ancient or new cities?","options":[{"option":"ancient","options":["Middle East Studies"]},{"option":"New cities","options":["RIT Dubai - Direct Enroll"]}]},{"option":"Spanish","question":"Do you prefer humanities or science?","options":[{"option":"humanities","options":["Advanced Liberal Arts - Barcelona"]},{"option":"science","options":["Santiago - Health Studies"]}]}]},{"option":"nature","question":"Do you prefer mountains or islands?","options":[{"option":"mountains","question":"Do you prefer South America or Aisa?","options":[{"option":"South America","options":["Semester in Cusco - Universidad San Ignacio Loyola"]},{"option":"Aisa","options":["Big Cats of the Himalayas: Tracking & Conservation"]}]},{"option":"islands","question":"Do you prefer Caribbean or South Pacific?","options":[{"option":"Caribbean","options":["Marine Resource Studies"]},{"option":"South Pacific","options":["Protecting the Phoenix Islands"]}]}]}]}',
	parsed_obj = "",
	currEleList = [],
	dataList = new Map(),
	stack = [];


function init() {
	parseJSON();
}

function parseJSON() {
	parsed_obj = JSON.parse(data);
	createElementTemplate(TEMPLATE_PREFIX, parsed_obj.question, parsed_obj.options);
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

function addOptionActionListener(ele) {
	ele.addEventListener("click", function () {
		var clickedButtonID = this.id;
		var elementID = clickedButtonID.split("_")[1];
		console.log("Clicked on element : " + elementID + " " + (currEleList.length));
		if (elementID != currEleList.length - 1) {
			for (let i = currEleList.length - 1; i > elementID; i--) {
				document.getElementById(TEMPLATE_PREFIX + i).remove();
				console.log("Removed - " + TEMPLATE_PREFIX + i);
				currEleList.pop();
				stack.pop();
				// console.log(template.length + template);
			}
		}

		console.log("This is ", this.textContent);
		if(0 === stack.length){
			for (let i=0; i<parsed_obj.options.length; i++){
				if(this.textContent === parsed_obj.options[i].option){
					stack[stack.length]= parsed_obj.options[i];
					break;
				}
			}
		}
		else{	
			// console.log("Here2.1 ", stack[stack.length-1].question);	
			for (let i=0; i<stack[stack.length-1].options.length; i++){
				console.log("Loop matching: ", stack[stack.length-1]);
				if(this.textContent === stack[stack.length-1].options[i].option){
					console.log("Inside matched values ", stack[stack.length-1].options[i], stack[stack.length-1].options[i].question);
					stack[stack.length]= stack[stack.length-1].options[i]; //lookup opt in context
					console.log("Here " + stack[stack.length-1].options + this.textContent);
					break;
				}
			}
		}
		if(stack[stack.length-1].question){
			createElementTemplate(TEMPLATE_PREFIX, stack[stack.length-1].question, stack[stack.length-1].options);
			console.log("printing stack " + stack.length, stack[stack.length-1].options);
		}else{
			console.log("Your selected choice is " + stack[stack.length-1].options[0] );z
		}
		// stack[stack.length]= {opt:this.textContent, context:stack[stack.length-1].context.options}; //lookup opt in context
	});
}

function createElementTemplate(name, question, optionList) {
	var index = currEleList.length,
		eleName = name + index;
	element = createElements("div", eleName),
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
			var opt = createElements("a", OPTION_PREFIX + index + "_" + i, "href" + "#");
			opt.innerHTML = optionList[i].option;
			addOptionActionListener(opt);
			optEle.appendChild(opt);
			currEleList[index] = eleName;
		}
	}

	// console.log(currEleList);

	//append elements to DOM
	element.appendChild(rowEle);
	rowEle.appendChild(colEle);
	colEle.appendChild(cardEle);
	cardEle.appendChild(cardContentEle);
	cardContentEle.appendChild(qEle);
	cardContentEle.appendChild(optEle);
	document.body.appendChild(element);
}