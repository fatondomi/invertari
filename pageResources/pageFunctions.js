
// Global Variables
var mysql = require("mysql");
var currentGroup = "t\xEB_gjitha";
var currentArticle = 1;
var loadingArticles = false;
var loadingGroups = false;
var articleGroupsIn = [];


function isAlphanumeric(str) {
	var code, i, len;
  
	for (i = 0, len = str.length; i < len; i++) {
	  code = str.charCodeAt(i);
	  if (!(code > 47 && code < 58) && // numeric (0-9)
		  !(code > 64 && code < 91) && // upper alpha (A-Z)
		  !(code > 96 && code < 123)) { // lower alpha (a-z)
		console.log(code);
		return false;
	  }
	}
	return true;
};





function showArticles(group){
	loadingArticles = true;

	var previosDivs = document.querySelectorAll(".articleDivs");
	
	if(previosDivs.length >= 1) {previosDivs.forEach((element) => {element.remove();});}

	var dbConnection = mysql.createConnection(
		{
		host : "localhost",
		user : "root",
		password : "Domi1211%",
		database : "invertari"
		}
	);

	dbConnection.connect( 
		(err) => {
			if (err) {console.log(err.stack);}
		}
	);

	//drawing all the divs for the articles present in the db
	dbConnection.query( "select * from " + group + ";", 
	    (err, rows, fields) => {
	        if(err) {console.log("An error query ocurred ", err);}
	        else {
	            for(var i=0; i<rows.length; i++){

	                var divArticle = document.createElement("div");
	                divArticle.setAttribute("class","articleDivs");
					divArticle.style.top = (400 + 500 * i) + "px";
					divArticle.addEventListener("click",divArticleClicked);

	                var idNumber = document.createElement("h2");
	                    idNumber.innerText = rows[i]["indexId"];
	                    idNumber.setAttribute("class","articleIdNumber");

	                var articleName = document.createElement("h3");
	                    articleName.innerText = rows[i]["name"];
	                    articleName.setAttribute("class","articleName");
					
					var articleImage = document.createElement("img");
						articleImage.setAttribute("src", "./pageResources/images/art" + rows[i]["indexId"] + ".jpg");
						articleImage.setAttribute("onError", "this.src='./pageResources/blank.jpg'");
						articleImage.setAttribute("class","articleImage");

	                divArticle.appendChild(idNumber);
					divArticle.appendChild(articleName);
					divArticle.appendChild(articleImage);
					document.body.appendChild(divArticle);
	            }
	            document.getElementById("goUp").style.position = "absolute";
				document.getElementById("goUp").style.top = (850 + 500 * rows.length) + "px"; 
				if(rows.length==0){
					document.getElementById("goUp").style.top = "1000px";
				}
	        }
	    }
	);

	dbConnection.end(
		()=>{loadingArticles = false;}
	);
}


function divArticleClicked() {
	showArticleInfo(this.firstChild.innerText);
}




function showGroups() {
	
	var previosGroups = document.querySelectorAll(".groupListElement");
	
	if(previosGroups.length >= 1) {previosGroups.forEach((element) => {element.remove();});}

	//  writing first group in the groups div
	var ulNode = document.getElementById("ulGroups");
	var liNode = document.createElement("li");

	liNode.innerHTML = "T\xEB gjitha";
	liNode.setAttribute("class","groupListElement");
	liNode.style.top = "25%";
	liNode.style.color = "darkred";
	liNode.style.cursor = "pointer";
	liNode.addEventListener("click",groupClicked);
	ulNode.appendChild(liNode);

	var dbConnection = mysql.createConnection(
		{
		host : "localhost",
		user : "root",
		password : "Domi1211%",
		database : "invertari"
		}
	);

	//writing the other groups which are saved in the database
	dbConnection.connect( 
	    (err) => {
	        if (err) {console.log(err.stack);}
	    }
	);

	dbConnection.query( "select * from groups;", 
	    (err, rows, fields) => {
	        if(err) {console.log("An error query ocurred ", err);}
	        else {
	            for(var i=1; i<rows.length; i++) {
				
	                //  writing groups div
	                liNode = document.createElement("li");
					liNode.innerHTML = rows[i]["groupName"];
					liNode.setAttribute("class", "groupListElement");
					liNode.style.top = (25 + i * 10) + "%";
					liNode.addEventListener("click", groupClicked);
					liNode.addEventListener("mouseover",listGroupMouseOver);
					liNode.addEventListener("mouseleave",listGroupMouseLeave);
	                document.getElementById("ulGroups").appendChild(liNode);
	            }
	        }
	    }
	);

	dbConnection.end();
}


function groupClicked() {
	
	var existingGroups = document.querySelectorAll(".groupListElement");
	
	existingGroups.forEach((element) => {element.style.color = "black";});

	this.style.color = "darkred";

	var dbGroupName = this.innerText.toLowerCase().trim().replace(/ /g,"_");

	currentGroup = dbGroupName;
	window.scroll(0,0);

	showArticles(dbGroupName);
	showArticleInfoAfter("first article");
}


function listGroupMouseOver() {
	var imagesInside = this.getElementsByTagName("img");

	if(imagesInside.length < 1) {
		var iksi = document.createElement("img");
		iksi.src = "./pageResources/images/iksi.png";
		iksi.style.position = "relative";
		iksi.style.top = "2px";
		iksi.style.left = "15px";
		iksi.style.width = "15px";
		iksi.addEventListener("click",removeListGroup);
		this.appendChild(iksi);
	}
}

function listGroupMouseLeave() {
	var imagesInside = this.getElementsByTagName("img");
	imagesInside[0].remove();
}

function removeListGroup() {

	event.stopPropagation();

	var exactGroupName = this.parentElement.innerText;
	var groupName = this.parentElement.innerText.trim().toLowerCase().replace(/ /g,"_");
	
	var dbConnection = mysql.createConnection(
		{
		host : "localhost",
		user : "root",
		password : "Domi1211%",
		database : "invertari"
		}
	);

	//writing the other groups which are saved in the database
	dbConnection.connect( 
	    (err) => {
	        if(err) {console.log(err.stack);}
	    }
	);

	dbConnection.query( "drop table " + groupName + ";", 
	    (err) => {
	        if(err) {console.log("An error query ocurred ", err);}
			else {
				dbConnection = mysql.createConnection(
					{
					host : "localhost",
					user : "root",
					password : "Domi1211%",
					database : "invertari"
					}
				);
			
				//writing the other groups which are saved in the database
				dbConnection.connect( 
					(err) => {
						if(err) {console.log(err.stack);}
					}
				);

				dbConnection.query("delete from groups where groupName='" + exactGroupName + "';",
					(err)=>{
						if(err) {console.log("An error query ocurred ", err);}
					}
				);

				dbConnection.end(()=>{

					showGroups();
					if(groupName.indexOf(currentGroup) >= 0) {
						currentGroup = "t\xEB_gjitha";
						showArticles(currentGroup);
						showArticleInfoAfter(1);
					}else{showArticleInfo(currentArticle);}
				});
			}
		}
	);

	dbConnection.end();
}


function showArticleInfo(idNumber) {
	
	//clear all previous nodes
	var controlPanelObj = document.getElementById("divControlPanel");
	while (controlPanelObj.firstChild) {
	    controlPanelObj.removeChild(controlPanelObj.firstChild);
	}


	var articles = document.getElementsByClassName("articleDivs");

	if(articles.length >= 1) {
		
		if(idNumber == "first article") {
			idNumber = articles[0].getElementsByClassName("articleIdNumber")[0].innerText;
		}

		var title = document.createElement("h2");
		title.innerHTML = "Info " + idNumber;
		title.setAttribute("class","controlPanelTitle");
		controlPanelObj.appendChild(title);

		var name = document.createElement("h2");
		name.innerHTML = "Emri";
		name.setAttribute("class","controlPanelName");
		controlPanelObj.appendChild(name);

		var nameInput = document.createElement("input");
		nameInput.setAttribute("class","controlPanelNameInput");
		controlPanelObj.appendChild(nameInput);

		var nameSave = document.createElement("img");
		nameSave.src = "./pageResources/images/flopy.png";
		nameSave.setAttribute("class","controlPanelNameSave");
		nameSave.addEventListener("click",nameSaveClicked);
		controlPanelObj.appendChild(nameSave);

		var amount = document.createElement("h2");
		amount.innerHTML = "Sasia";
		amount.setAttribute("class","controlPanelAmount");
		controlPanelObj.appendChild(amount);

		var amountInput = document.createElement("input");
		amountInput.type = "number";
		amountInput.setAttribute("class","controlPanelAmountInput");
		controlPanelObj.appendChild(amountInput);

		var amountSave = document.createElement("img");
		amountSave.src = "./pageResources/images/flopy.png";
		amountSave.setAttribute("class","controlPanelAmountSave");
		amountSave.addEventListener("click",amountSaveClicked);
		controlPanelObj.appendChild(amountSave);

		var location = document.createElement("h2");
		location.innerHTML = "Vendodhja";
		location.setAttribute("class","controlPanelLocation");
		controlPanelObj.appendChild(location);

		var locationInput = document.createElement("input");
		locationInput.type = "text";
		locationInput.setAttribute("class","controlPanelLocationInput");
		controlPanelObj.appendChild(locationInput);

		var locationSave = document.createElement("img");
		locationSave.src = "./pageResources/images/flopy.png";
		locationSave.setAttribute("class","controlPanelLocationSave");
		locationSave.addEventListener("click",locationSaveClicked);
		controlPanelObj.appendChild(locationSave);

		var groupsIn = document.createElement("h2");
		groupsIn.innerHTML = "Grupet";
		groupsIn.setAttribute("class","controlPanelGroupsIn");
		controlPanelObj.appendChild(groupsIn);

		var groupComboBox = document.createElement("select");
		groupComboBox.setAttribute("class","controlPanelComboBox");
		var groupList = document.getElementsByClassName("groupListElement");
		for(var i=0;i<groupList.length;i++){
			var selectItem = document.createElement("option");
			selectItem.innerText = groupList[i].innerText;
			groupComboBox.appendChild(selectItem);
		}
		groupComboBox.addEventListener("change",optionClicked);
		controlPanelObj.appendChild(groupComboBox);

		var groupsSave = document.createElement("img");
		groupsSave.src = "./pageResources/images/flopy.png";
		groupsSave.setAttribute("class","controlPanelGroupsSave");
		groupsSave.addEventListener("click",groupsSaveClicked);
		controlPanelObj.appendChild(groupsSave);

		// getting info from db
		var dbConnection = mysql.createConnection(
			{
			host : "localhost",
			user : "root",
			password : "Domi1211%",
			database : "invertari"
			}
		);

		dbConnection.connect( 
		    (err) => {
		        if (err) {console.log(err.stack);}
		    }
		);

		dbConnection.query( "select * from " + currentGroup + " where indexId=" + idNumber + ";", 
		    (err, rows, fields) => {
		        if(err) {console.log("An error query ocurred ", err);}
		        else {
					document.
					getElementsByClassName("controlPanelNameInput")[0].
					value = rows[0]["name"];
					document.
					getElementsByClassName("controlPanelAmountInput")[0].
					value = rows[0]["counter"];
					document.
					getElementsByClassName("controlPanelLocationInput")[0].
					value = rows[0]["location"];
		        }
		    }
		);

		dbConnection.end();

		currentArticle = idNumber;

		var groups = document.getElementsByClassName("groupListElement");
		var groupsMatrix = [];
		for(var i=0;i<groups.length;i++) {groupsMatrix.push(groups[i].innerText);}
		
		var existsMatrix = [];

		// updating info in groups
		dbConnection = mysql.createConnection(
			{
			host : "localhost",
			user : "root",
			password : "Domi1211%",
			database : "invertari"
			}
		);

		dbConnection.connect( 
		    (err) => {
		        if (err) {console.log(err.stack);}
		    }
		);

		for(var i=0;i<groupsMatrix.length;i++) {

			var groupName = groupsMatrix[i].trim().toLowerCase().replace(/ /g,"_");

			dbConnection.query( "select name from " + groupName + " where indexId=" + idNumber + ";", 
		    	(err,rows,fields) => {
					if(err) {console.log("An error query ocurred ", err);}
					else { if(rows.length>=1) {existsMatrix.push(true);} else {existsMatrix.push(false);}}
		    	}
			);
		}
		
		dbConnection.end(()=>{
			
			var groupBox = document.createElement("div");
			groupBox.setAttribute("class","controlPanelBox");

			for(var i=0;i<groupsMatrix.length;i++) {
				if(existsMatrix[i] == true) {
					var preGroup = document.createElement("pre");
					preGroup.setAttribute("class","controlPanelGroup");
					preGroup.innerText = groupsMatrix[i] + " ";
					preGroup.addEventListener("mouseover",groupMouseOver);
					preGroup.addEventListener("mouseleave",groupMouseLeave);
					groupBox.appendChild(preGroup);
				
					var spacer = document.createElement("pre");
					spacer.setAttribute("class","controlPanelGroupSpacer");
					spacer.innerText = " ";
					groupBox.appendChild(spacer);
				}
			}

			controlPanelObj.appendChild(groupBox);

			var options = document.getElementsByTagName("option");
			
			for(var i=options.length-1;i>=0;i--){
				if(existsMatrix[i]) {
					options[i].remove();
				}
			}

			var comboBox = document.getElementsByClassName("controlPanelComboBox")[0];
			comboBox.selectedIndex = -1;

			articleGroupsIn = [];
			var allGroups = document.getElementsByClassName("controlPanelGroup");
			for(var i=0;i<allGroups.length;i++) {
				articleGroupsIn.push(allGroups[i].innerText.trim().toLowerCase().replace(" ","_"));
			}
		});
	}
	else {
	
		var title = document.createElement("h2");
		title.innerHTML = "Grupi \xEBsht\xEB bosh";
		title.setAttribute("class","controlPanelTitle");
		controlPanelObj.appendChild(title);
	}
}

function optionClicked() {
	
	var optionText = this.options[this.selectedIndex].innerText;
	
	var groupBox = document.getElementsByClassName("controlPanelBox")[0];
	var newGroup = document.createElement("pre");
	newGroup.setAttribute("class","controlPanelGroup");
	newGroup.innerText = optionText + " ";
	newGroup.addEventListener("mouseover",groupMouseOver);
	newGroup.addEventListener("mouseleave",groupMouseLeave);
	groupBox.appendChild(newGroup);

	var spacer = document.createElement("pre");
	spacer.setAttribute("class","controlPanelGroupSpacer");
	spacer.innerText = " ";
	groupBox.appendChild(spacer);

	var options = document.getElementsByTagName("option");
	for(var i=0;i<options.length;i++) {
		if(options[i].innerText.indexOf(optionText) >= 0) {
			options[i].remove();
		}
	}

	this.selectedIndex = -1;
}

function nameSaveClicked() {

	// updating info in db
	var dbConnection = mysql.createConnection(
		{
		host : "localhost",
		user : "root",
		password : "Domi1211%",
		database : "invertari"
		}
	);

	dbConnection.connect( 
		(err) => {
			if (err) {console.log(err.stack);}
		}
	);

	var newValue = document.getElementsByClassName("controlPanelNameInput")[0].value;

	for(var i=0;i<articleGroupsIn.length;i++) {

		dbConnection.query( "update " + articleGroupsIn[i] + " set name = '" + newValue + "' where indexId=" + currentArticle + ";", 
			(err) => {
				if(err) {console.log("An error query ocurred ", err);}
			}
		);
	}

	dbConnection.end(()=>{showArticles(currentGroup);});
}

function amountSaveClicked() {

	// updating info in db
	var dbConnection = mysql.createConnection(
		{
		host : "localhost",
		user : "root",
		password : "Domi1211%",
		database : "invertari"
		}
	);

	dbConnection.connect( 
		(err) => {
			if (err) {console.log(err.stack);}
		}
	);
	
	var newValue = document.getElementsByClassName("controlPanelAmountInput")[0].value;

	for(var i=0;i<articleGroupsIn.length;i++) {

		dbConnection.query( "update " + articleGroupsIn[i] + " set counter = " + newValue + " where indexId=" + currentArticle + ";", 
		    (err) => {
		        if(err) {console.log("An error query ocurred ", err);}
		    }
		);
	}

	dbConnection.end();
}

function locationSaveClicked() {

	// updating info in db
	var dbConnection = mysql.createConnection(
		{
		host : "localhost",
		user : "root",
		password : "Domi1211%",
		database : "invertari"
		}
	);

	dbConnection.connect( 
		(err) => {
			if (err) {console.log(err.stack);}
		}
	);
	
	var newValue = document.getElementsByClassName("controlPanelLocationInput")[0].value;
	
	for(var i=0;i<articleGroupsIn.length;i++) {

		dbConnection.query( "update " + articleGroupsIn[i] + " set location = '" + newValue + "' where indexId=" + currentArticle + ";", 
		    (err) => {
		        if(err) {console.log("An error query ocurred ", err);}
		    }
		);
	}

	dbConnection.end();
}

function groupsSaveClicked() {

	var groups = document.getElementsByClassName("groupListElement");
	var groupsMatrix = [];
	var existsMatrix = [];

	for(var i=0;i<groups.length;i++) {
		groupsMatrix.push(groups[i].innerText.trim().toLowerCase().replace(" ","_"));
		if(articleGroupsIn.indexOf(groupsMatrix[i]) >= 0) {
			existsMatrix.push(true);
		} else {existsMatrix.push(false);}
	}

	var panelGroups = document.getElementsByClassName("controlPanelGroup");
	var panelGroupNames = [];
	
	for(var i=0;i<panelGroups.length;i++){
		panelGroupNames.push(panelGroups[i].innerText.trim().toLowerCase().replace(" ","_"));
	}
	
	var groupsToRemoveFrom = [];
	var groupsToAddTo = []; 
	
	if(panelGroupNames.indexOf("t\xEB_gjitha") < 0) {
		for(var i=0;i<existsMatrix.length;i++) {
			if(existsMatrix[i]){
				groupsToRemoveFrom.push(groupsMatrix[i].trim().toLowerCase().replace(" ","_"));
			}
		}
	}
	else {
		for(var i=0;i<existsMatrix.length;i++) {
			if(existsMatrix[i] && panelGroupNames.indexOf(groupsMatrix[i]) == -1){
				groupsToRemoveFrom.push(groupsMatrix[i].trim().toLowerCase().replace(" ","_"));
			}
		}
		
		for(var i=0;i<existsMatrix.length;i++) {
			if(!existsMatrix[i] && panelGroupNames.indexOf(groupsMatrix[i]) > -1){
				groupsToAddTo.push(groupsMatrix[i].trim().toLowerCase().replace(" ","_"));
			}
		}
	}
	
	if(groupsToAddTo.length >= 1) {
		addToGroup(groupsToAddTo);
	}
	if(groupsToRemoveFrom.length >= 1) {
		removeFromGroup(groupsToRemoveFrom);
	}
}

function showArticleInfoAfter(idNumber){
	if(loadingArticles) {
		setTimeout(()=>{showArticleInfoAfter(idNumber);},50);
	}
	else {
		showArticleInfo(idNumber);
	}
}

function groupMouseOver() {
	if(this.getElementsByTagName("img").length < 1) {
		var xImage = document.createElement("img");
		xImage.src = "./pageResources/images/iksi.png";
		xImage.style.position = "relative";
		xImage.style.top = "2px";
		xImage.style.width = "15px";
		xImage.addEventListener("click",removeGroupName);
		this.appendChild(xImage);
	}
}


function groupMouseLeave() {
	var imagesInside = this.getElementsByTagName("img");
	imagesInside[0].remove();
}


function removeGroupName() {
	var optionRemoved = this.parentElement.innerText.trim();
	var comboBox = document.getElementsByClassName("controlPanelComboBox")[0];
	
	var selectItem = document.createElement("option");
	selectItem.innerText = optionRemoved;
	comboBox.appendChild(selectItem);
	comboBox.selectedIndex = -1;

	this.parentElement.remove();
}

function addToGroup(groups) {

	var dbConnection = mysql.createConnection(
		{
		host : "localhost",
		user : "root",
		password : "Domi1211%",
		database : "invertari"
		}
	);

	dbConnection.connect( 
	    (err) => {
	        if(err) {console.log(err.stack);}
	    }
	);
					
	for(var i=0;i<groups.length;i++) {
		dbConnection.query("insert into " + groups[i] + " select * from t\xEB_gjitha where indexId=" + currentArticle + ";",
			(err)=>{
				if(err) {console.log("An error query ocurred ", err);}
			}
		);
	}
	
	dbConnection.end();
}

function removeFromGroup(groups) {

	var dbConnection = mysql.createConnection(
		{
		host : "localhost",
		user : "root",
		password : "Domi1211%",
		database : "invertari"
		}
	);

	dbConnection.connect( 
	    (err) => {
	        if(err) {console.log(err.stack);}
	    }
	);
					
	for(var i=0;i<groups.length;i++) {
		dbConnection.query("delete from " + groups[i] + " where indexId=" + currentArticle + ";",
			(err)=>{
				if(err) {console.log("An error query ocurred ", err);}
			}
		);
	}
	
	dbConnection.end(()=>{
		if(groups.indexOf("t\xEB_gjitha")>=0) {
			removeIndexGroup();
		}
		else {
			showArticles(currentGroup);
			showArticleInfoAfter("first article");
		}
	});
}

function removeIndexGroup() {
	
	var dbConnection = mysql.createConnection(
		{
		host : "localhost",
		user : "root",
		password : "Domi1211%",
		database : "invertari"
		}
	);

	dbConnection.connect( 
	    (err) => {
	        if(err) {console.log(err.stack);}
	    }
	);
	
	dbConnection.query("alter table t\xEB_gjitha drop indexId;",
		(err)=>{
			if(err) {console.log("An error query ocurred ", err);}
		}
	);

	dbConnection.end(addIndexGroup);
}

function addIndexGroup() {
	
	var dbConnection = mysql.createConnection(
		{
		host : "localhost",
		user : "root",
		password : "Domi1211%",
		database : "invertari"
		}
	);

	dbConnection.connect( 
	    (err) => {
	        if(err) {console.log(err.stack);}
	    }
	);
	
	dbConnection.query("ALTER TABLE t\xEB_gjitha ADD indexId INT UNSIGNED NOT NULL AUTO_INCREMENT First, ADD PRIMARY KEY (indexId);",
		(err)=>{
			if(err) {console.log("An error query ocurred ", err);}
		}
	);

	dbConnection.end(()=>{
		showArticles(currentGroup);
		showArticleInfoAfter("first article");
	});
}

function logoClicked() {

	var controlPanelObj = document.getElementById("divControlPanel");
	while (controlPanelObj.firstChild) {
	    controlPanelObj.removeChild(controlPanelObj.firstChild);
	}

	var groupButton = document.createElement("BUTTON");
	groupButton.setAttribute("class","addGroupButton");
	groupButton.innerHTML = "Shto grup";
	groupButton.addEventListener("click",shtoGrupClicked);
	controlPanelObj.appendChild(groupButton);

	var articleButton = document.createElement("BUTTON");
	articleButton.setAttribute("class","addArticleButton");
	articleButton.innerHTML = "Shto artikull";
	articleButton.addEventListener("click",shtoArtikullClicked);
	controlPanelObj.appendChild(articleButton);
}

function shtoGrupClicked() {

	var controlPanelObj = document.getElementById("divControlPanel");
	while(controlPanelObj.firstChild) {
	    controlPanelObj.removeChild(controlPanelObj.firstChild);
	}

	var title = document.createElement("h2");
	title.innerHTML = "Shto grupin e ri";
	title.setAttribute("class","controlPanelTitle");
	controlPanelObj.appendChild(title);

	var name = document.createElement("h2");
	name.innerHTML = "Emri";
	name.setAttribute("class","controlPanelName");
	controlPanelObj.appendChild(name);

	var nameInput = document.createElement("input");
	nameInput.value = "abc";
	nameInput.setAttribute("class","controlPanelNameInput");
	controlPanelObj.appendChild(nameInput);
	
	var saveButton = document.createElement("BUTTON");
	saveButton.innerHTML = "Ruaj t\xEB dh\xEBnat";
	saveButton.setAttribute("class","saveButton");
	saveButton.addEventListener("click",ruajTeDhenatClicked);
	controlPanelObj.appendChild(saveButton);
}

function shtoArtikullClicked() {

	var controlPanelObj = document.getElementById("divControlPanel");
	while(controlPanelObj.firstChild) {
	    controlPanelObj.removeChild(controlPanelObj.firstChild);
	}

	var title = document.createElement("h2");
	title.innerHTML = "Shto artikullin e ri";
	title.setAttribute("class","controlPanelTitle");
	controlPanelObj.appendChild(title);

	var name = document.createElement("h2");
	name.innerHTML = "Emri";
	name.setAttribute("class","controlPanelName");
	controlPanelObj.appendChild(name);

	var nameInput = document.createElement("input");
	nameInput.value = "abc";
	nameInput.setAttribute("class","controlPanelNameInput");
	controlPanelObj.appendChild(nameInput);

	var amount = document.createElement("h2");
	amount.innerHTML = "Sasia";
	amount.setAttribute("class","controlPanelAmount");
	controlPanelObj.appendChild(amount);

	var amountInput = document.createElement("input");
	amountInput.type = "number";
	amountInput.value = 123;
	amountInput.setAttribute("class","controlPanelAmountInput");
	controlPanelObj.appendChild(amountInput);

	var location = document.createElement("h2");
	location.innerHTML = "Vendodhja";
	location.setAttribute("class","controlPanelLocation");
	controlPanelObj.appendChild(location);

	var locationInput = document.createElement("input");
	locationInput.type = "text";
	locationInput.value = "abc";
	locationInput.setAttribute("class","controlPanelLocationInput");
	controlPanelObj.appendChild(locationInput);

	var saveButton = document.createElement("BUTTON");
	saveButton.innerHTML = "Ruaj t\xEB dh\xEBnat";
	saveButton.setAttribute("class","saveButton");
	saveButton.addEventListener("click",ruajTeDhenatClicked);
	controlPanelObj.appendChild(saveButton);
}

function ruajTeDhenatClicked() {
	
	var saveGroup = false;
	if(document.getElementsByClassName("controlPanelTitle")[0].innerHTML.indexOf("Shto grupin e ri") >= 0) {
		saveGroup = true;	
	}
	
	var dbConnection = mysql.createConnection(
		{
		host : "localhost",
		user : "root",
		password : "Domi1211%",
		database : "invertari"
		}
	);

	dbConnection.connect( 
	    (err) => {
	        if(err) {console.log(err.stack);}
	    }
	);
	
	if(saveGroup) {
		var groupName = document.getElementsByClassName("controlPanelNameInput")[0].value.trim();
		
		var validGroupName = groupName.toLowerCase().replace(/ /g,"_");

		dbConnection.query("create table " + validGroupName + 
			"(indexId int unsigned not null, name varchar(50) not null, counter int not null default \"1\",location varchar(50) not null default \"n\xEB laborator\");",
			(err)=>{
				if(err) {console.log("An error query ocurred ", err);}
				else {
					dbConnection = mysql.createConnection(
						{
						host : "localhost",
						user : "root",
						password : "Domi1211%",
						database : "invertari"
						}
					);
			
					dbConnection.connect( 
						(err) => {
							if(err) {console.log(err.stack);}
						}
					);
					
					dbConnection.query("insert into groups value(null,'" + groupName + "');",
						(err)=>{
							if(err) {console.log("An error query ocurred ", err);}
						}
					);

					dbConnection.end(showGroups);
				}
			}
		);
		
		dbConnection.end();
	}
	else {
		var articleName = document.getElementsByClassName("controlPanelNameInput")[0].value.trim();
		if(articleName == ""){articleName="Null";}
		var articleAmount = document.getElementsByClassName("controlPanelAmountInput")[0].value;
		if(articleAmount == ""){articleAmount=0;}
		var articleLocation = document.getElementsByClassName("controlPanelLocationInput")[0].value.trim();
		if(articleLocation == ""){articleLocation="Null";}

		dbConnection.query("insert into t\xEB_gjitha value(null,'" + articleName + "'," + articleAmount + ",'" + articleLocation + "');",
			(err)=>{
				if(err) {console.log("An error query ocurred ", err);}
			}
		);
		
		dbConnection.end(
			()=>{
				if(currentGroup.indexOf("t\xEB_gjitha") >= 0) {
					showArticles("t\xEB_gjitha");
				}
			}
		);
	}

	logoClicked();
	var controlPanelObj = document.getElementById("divControlPanel");
	
	var info = document.createElement("h2");
	if (saveGroup) {info.innerHTML = "Grupi u shtua";} 
	else { info.innerHTML = "Artikulli u shtua";}
	info.setAttribute("class","controlPanelTitle");
	controlPanelObj.appendChild(info);
}

function searchPressed() {
	var inputValue = document.getElementById("searchTextBox").value.toLowerCase();
	var articles = document.getElementsByClassName("articleDivs");
	var articleId = [];
	var articleName = [];
	
	//marrja e id-ve dhe emrave
	for(var i=0;i<articles.length;i++) {
		articleId.push(articles[i].firstChild.innerText.toLowerCase());
		articleName.push(articles[i].getElementsByClassName("articleName")[0].innerText.toLowerCase());
	}

	var success = false;

	//kerkimi i id-s se njejte
	for(var i=0;i<articleId.length;i++) {
		if(inputValue == articleId[i]) {
			articles[i].scrollIntoView();
			window.scrollBy(0,-window.innerHeight*35/100);
			success = true;
			break;
		}
	}

	//kerkimi i emrit te njejte/te pjeshem
	if(!success) {
		for(var i=0;i<articleName.length;i++) {
			if(articleName[i].indexOf(inputValue) >= 0) {
				articles[i].scrollIntoView();
				window.scrollBy(0,-window.innerHeight*35/100);
				break;
			}
		}
	}
}