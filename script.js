//starter function
function init() {
	//Browser detection
	if ('Explorer' === BrowserDetect.browser && 10 >= BrowserDetect.version) {
		let header = document.querySelector('.header');
		header.removeChild(header.firstChild);
		header.appendChild(
			document.createTextNode('This browser is not supported')
		);
	}

	// start dhtml for h1
	startDHTML();

	// storage calls
	storeData();
}

//Global constants
const TEMPLATE_PREFIX = 'template_',
	FINAL_CHOICE = 'fin_',
	OPTION_PREFIX = 'opt_';

//Global variables
let parsed_obj = '',
	currEleList = [],
	dataList = new Map(),
	stack = [],
	bodyEle = document.getElementById('bodyTag'),
	url = 'data/data.json',
	http = new XMLHttpRequest();


//Global onclick function to check which radio button is clicked
//Radio button decides which dataset to select for the questions display
let radios = document.getElementsByName('radio1');
for (let i = 0, max = radios.length; i < max; i++) {
	radios[i].onclick = function () {
		console.log(this);
		switch (this.value) {
			case '0':
				url = 'data/data.json';
				break;
			case '1':
				url = 'data/data2.json';
				break;
			default:
		}

		//reset current in-memory and DOM status
		stack = [];
		removeAllChoicesFromDom(-1);

		//start over again
		http.open('get', url);
		http.onreadystatechange = httpResponse;
		http.send();
	};
}

//Header blink DHTML
function startDHTML() {
	let h1 = document.querySelector('.header');
	// let opacity = h1.
	const blink = function () {
		h1.classList.toggle('open');
		setTimeout(() => {
			blink();
		}, 10);
	};
	blink;
}

//JSON response
function httpResponse() {
	if (http.status === 200 && http.readyState === 4) {
		parsed_obj = JSON.parse(http.responseText);
		bodyEle.appendChild(
			createCard(
				TEMPLATE_PREFIX + 0,
				'',
				parsed_obj.question,
				parsed_obj.select,
				''
			)
		);
		stack.push(parsed_obj);
	}
}


//Function to store and retrieve data from local storage and cookie
//And display it in div element on screen
function storeData() {
	const keyNameLS = "visit_frequency",
		keyNameC = "last_seen",
		strToDisplay1 = "This is your ",
		strToDisplay2 = " visit. ",
		strToDisplay3 = "Last seen at ";

	let lastSeenElement = document.querySelector('.visitHistory'),
		display = "",
		visitFreq = localStorage.getItem(keyNameLS),
		lastSeen = cookies.getCookie(keyNameC);

	//Local Stoage
	if (null === visitFreq) {
		localStorage.setItem(keyNameLS, "1");
	} else {
		localStorage.setItem(keyNameLS, parseInt(visitFreq) + 1 + "");
	}
	display = strToDisplay1 + localStorage.getItem(keyNameLS) + strToDisplay2;

	//Cookie
	if (lastSeen) {
		display += strToDisplay3 + lastSeen;
	} else {
		display += "No last seen";
	}
	cookies.setCookie(keyNameC, new Date().toString());

	//Display to page
	lastSeenElement.appendChild(document.createTextNode(display));

}

function createElements(type, id, property, val) {
	let ele = document.createElement(type);
	if (id) {
		ele.id = id;
	}
	if (property == 'class') {
		ele.className = val;
	}
	return ele;
}

//Removes the cards that are not needed
function removeAllChoicesFromDom(id) {
	for (let i = currEleList.length - 1; i > id; i--) {
		let temp = document.getElementById(TEMPLATE_PREFIX + i);
		temp.parentElement.removeChild(temp);
		currEleList.pop();
		stack.pop();
	}

	//removes the final option if present separately (the card has id = FINAL_CHOICE)
	let finChoiceRemove = document.getElementById(FINAL_CHOICE);
	if (null !== finChoiceRemove) {
		finChoiceRemove.parentElement.removeChild(finChoiceRemove);
	}
}

//Removes one card
function removeChoiceFromDom() {
	let ele = document.getElementById(FINAL_CHOICE);
	if (ele) {
		ele.parentElement.removeChild(ele);
	}
}

//adds event listener on card options 
//maintains the in-memory status of the clicked objects and DOM objects
function addOptionActionListener(ele) {
	ele.addEventListener('click', function () {
		let clickedButtonID = this.id,
			buttonSplit = clickedButtonID.split('_'),
			buttonID = buttonSplit[2],
			elementID = buttonSplit[1];

		//remove additonal cards
		if (currEleList.length - elementID > 0) {
			removeAllChoicesFromDom(elementID);
		}

		//maintain the clicked option stack in memory
		stack.push(stack[stack.length - 1].select[buttonID]);

		//maintain the clicked option stack in DOM
		if (stack[stack.length - 1].question) {
			let card = createCard(
				TEMPLATE_PREFIX + currEleList.length,
				'',
				stack[stack.length - 1].question,
				stack[stack.length - 1].select,
				''
			);
			bodyEle.append(card);
		} else {
			removeChoiceFromDom();
			let card = createCard(
				FINAL_CHOICE,
				'',
				stack[stack.length - 1].select[0],
				'',
				stack[stack.length - 1].url
			);
			bodyEle.append(card);
			stack.pop();
		}
	});
}

//Creating UI custom card element
function createCard(eleName, cardTitle, cardContent, cardOptions, cardLink) {
	let element = createElements('div', eleName),
		rowEle = createElements('div', '', 'class', 'row'),
		colEle = createElements('div', '', 'class', 'col s9 offset-s2'),
		cardEle = createElements(
			'div',
			'',
			'class',
			'card z-depth-2 blue-grey lighten-5'
		),
		titleEle = createElements(
			'span',
			'',
			'class grey-text text-darken-4',
			'card-title'
		),
		titleContent = document.createTextNode(cardTitle),
		contentEle = null,
		content = document.createTextNode(cardContent),
		optionsEle = createElements('div', OPTION_PREFIX, 'class', 'card-action'),
		cardContentEle = createElements('div', '', 'class', 'card-content');



	if ('' !== cardLink && undefined !== cardLink) {
		console.log("cardlink", cardLink);
		contentEle = createElements('a');
		console.log(contentEle);
		contentEle.appendChild(content);
		contentEle.title = cardContent;
		contentEle.href = decodeURIComponent(cardLink);
		contentEle.setAttribute("target", "_blank");
	} else {
		contentEle = createElements('p', 'cardContent');
	}
	titleEle.appendChild(titleContent);
	contentEle.appendChild(content);

	//sets the number of options dynamically
	if (null !== cardOptions) {
		let optLen = cardOptions.length;
		if (optLen) {
			for (let i = 0; i < optLen; i++) {
				let opt = createElements(
					'a',
					OPTION_PREFIX + currEleList.length + '_' + i,
					'href',
					'#'
				),
					optionContent = document.createTextNode(cardOptions[i].option);
				opt.appendChild(optionContent);
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


//HTML5 validations - email
function emailValidate() {
	let domEle = document.getElementById('email'),
		inputStr = domEle.value,
		reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

	if (!reg.test(String(inputStr).toLowerCase())) {
		let label = document.querySelector('#yemail');
		label.removeChild(label.firstChild);
		label.appendChild(document.createTextNode('Invalid email'));
	}
}

//HTML5 validations - phone number
function phoneValidate() {
	let domEle = document.getElementById('email'),
		inputStr = domEle.value,
		reg = /^\d{4}-\d{3}-\d{4}$/;

	if (!reg.test(String(inputStr).toLowerCase())) {
		let label = document.querySelector('#yphone');
		label.removeChild(label.firstChild);
		label.appendChild(document.createTextNode('Invalid phone'));
	}
}

// function() {
// 	let datasetRadioELe = document.getElementsByName("radio1");
// 	for (let i = 0, len = datasetRadioELe.length; i < len; i += 1) {
// 		console.log(datasetRadioELe[i], dataURL[datasetRadioELe[i].value]);
// 		datasetRadioELe[i].addEventListener("onclick", function () {
// 			dataset = dataURL[datasetRadioELe[i].value];
// 			console.log("Here in event registration");
// 			ajax_get(dataset, function (data) {
// 				console.log("Here in AJAX callback");
// 				parsed_obj = data;
// 				bodyEle.append(createCard(TEMPLATE_PREFIX + 0, "", parsed_obj.question, parsed_obj.select)); //move to form submit action
// 				stack.push(parsed_obj);
// 			});
// 		});
// 	}
// }

// function ajax_get(url, callback) {
// 	var xmlhttp = new XMLHttpRequest();
// 	xmlhttp.onreadystatechange = function () {
// 		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
// 			console.log('responseText:' + xmlhttp.responseText);
// 			try {
// 				var data = JSON.parse(xmlhttp.responseText);
// 			} catch (err) {
// 				console.log(err.message + " in " + xmlhttp.responseText);
// 				return;
// 			}
// 			callback(data);
// 		}
// 	};
// 	xmlhttp.open("GET", url, true);
// 	xmlhttp.send();
// }

// function designPage() {
// 	let mainBodyDiv = createElements("div", "", "class", "row");
// 	bodyEle.appendChild(createHeader("RIT Study Abroad Application form"));
// 	mainBodyDiv.appendChild(createForm());
// 	bodyEle.appendChild(mainBodyDiv);
// }

// function createHeader(headText) {

// 	let headDiv = createElements("div", "", "class", "row"),
// 		headEle = createElements("h2", "", "class", "col 12"),
// 		textEle = document.createTextNode(headText);

// 	headEle.appendChild(textEle);
// 	headDiv.appendChild(headEle);
// 	return headDiv;
// }

// // function createForm() {

// // 	let formEle = createElements("form", "", "class", "col s12"),
// // 		formDiv1 = createElements("div", "", "class", "row"),
// // 		formDiv2 = createElements("div", "", "class", "row"),
// // 		formDiv3 = createElements("div", "", "class", "row"),
// // 		// formDiv4 = createElements("div", "", "class", "row"),
// // 		formDiv4_1 = createElements("div", "", "class", "swtich"),
// // 		formDiv4_2 = createElements("label"),
// // 		formDiv4_3 = createElements("input"),
// // 		formDiv4_4 = createElements("span", "", "class", "lever");

// // 	formDiv1.appendChild(createFormElement("text", "fname", "", "First Name", "John"));
// // 	formEle.appendChild(formDiv1);

// // 	formDiv2.appendChild(createFormElement("text", "lname", "", "Last Name", "Doe"));
// // 	formEle.appendChild(formDiv2);

// // 	formDiv3.appendChild(createFormElement("email", "email", "", "Email ID", "john.doe@email.com"));
// // 	formEle.appendChild(formDiv3);

// // 	formDiv4_2.appendChild(document.createTextNode("Location"));
// // 	formDiv4_3.setAttribute("type", "checkbox");
// // 	formDiv4_2.appendChild(formDiv4_3);
// // 	formDiv4_2.appendChild(formDiv4_4);
// // 	formDiv4_2.appendChild(document.createTextNode("Majors"));
// // 	formDiv4_1.appendChild(formDiv4_2);
// // 	// formDiv4.appendChild(formDiv4_1);
// // 	formEle.appendChild(formDiv4_1);

// // 	return formEle;
// // }

// function createFormElement(type, id, name, content) {

// 	let mainDiv = createElements("div", "", "class", "input-field col s6"),
// 		inputEle = document.createElement("input"),
// 		labelEle = document.createElement("label"),
// 		textEle = document.createTextNode(content);

// 	inputEle.setAttribute("type", type);
// 	inputEle.setAttribute("id", id);
// 	inputEle.setAttribute("name", name);
// 	labelEle.setAttribute("for", id);

// 	labelEle.appendChild(textEle);
// 	mainDiv.appendChild(inputEle);
// 	mainDiv.appendChild(labelEle);

// 	return mainDiv;
// }

// function setCookie(name,value,days) {
//     var expires = "";
//     if (days) {
//         var date = new Date();
//         date.setTime(date.getTime() + (days*24*60*60*1000));
//         expires = "; expires=" + date.toUTCString();
// 	}
// 	str = name + "=" + (value || "")  + expires + "; path=/";
// 	console.log(str);
//     document.cookie = str;
// }

// function setCookie(name, value, days) {
//     var d = new Date;
//     d.setTime(d.getTime() + 24*60*60*1000*days);
//     document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
// }
