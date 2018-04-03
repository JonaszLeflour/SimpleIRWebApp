//------- Send positional data (X, Y, Z + Rotation(Z)) to the Seller - PlayCanvast -------

var serverIR = "imretest.eastus.cloudapp.azure.com";
var port = "3000";
var cursorData = {X:100.0, Y:100.0, Rot:0.0}

var appID;

var canvas = document.getElementById('mapCanvas');
var ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var mapBackGround = new Image();
var imgLoaded = false;
mapBackGround.onload = function () {imgLoaded = true;}
mapBackGround.src = 'ressources/img/E1602_minimap_02.jpg';

function normalized2DToVr(x, y){
	scaleX = -100;
	scaleY = 1000;
	transformX = 0;
	transformY = 1200;
	
	x = (x-0.5) * 2;
	y = (y-0.5) * 2;
	
	
	X = scaleX * y + transformX;
	Y = scaleY * x + transformY;
	
	return [X, Y];
}

//ok for canvas ~= 890x943
function vrToNormalized2D(X,Y,Z=0){
	scaleX = -0.03;
	scaleY = 0.034;
	transformX = 0.427;
	transformY = 0.508;
	
	x = scaleX * Y + transformX;
	y = scaleY * X + transformY;
	
	return [x, y]
}

function updateCursor(vrData){
	cursorPos = vrToNormalized2D(vrData.X,vrData.Y);
	
	scaling=1;
	if(ctx.canvas.height > ctx.canvas.width){scaling=ctx.canvas.width;}else{scaling=ctx.canvas.height;}
	
	cursorData.X = cursorPos[0] * scaling;
	cursorData.Y = cursorPos[1] * scaling;
	cursorData.Rot = (vrData.RotZ)-180;
}



function draw(){
	var ctx = canvas.getContext("2d");
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ratio = mapBackGround.width / mapBackGround.height;
	width = ctx.canvas.width;
	height = width / ratio;
	if (height > ctx.canvas.height) {
		height = ctx.canvas.height;
		width = height * ratio;
	}
	//quick fix for small width:
	if(ctx.canvas.height > ctx.canvas.width * (1/ratio)){
		ctx.canvas.height = ctx.canvas.width * (1/ratio);
	}
	
	if(imgLoaded){
		ctx.drawImage(mapBackGround,0,0,width,height);
	}
	ctx.fillStyle="#FFFFFF";
	ctx.strokeStyle="#000000";
	ctx.lineWidth=5;
	ctx.beginPath();
	ctx.arc(cursorData.X,cursorData.Y,25,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath()
	ctx.arc(cursorData.X,cursorData.Y,50,cursorData.Rot,cursorData.Rot + 0.5*Math.PI);
	ctx.stroke();
	ctx.closePath();
}

//revieve data
//update position with vr info every second
window.setInterval(function(){
	if(typeof(appID) == "undefined"){
		return;
	}
	var data = {appid: appID}
	/*$.get( "http://"+serverIR+":"+port+"/client-infos", data, function(vrData){updateCursor(vrData);});*/
	$.ajax({
		url: "http://"+serverIR+":"+port+"/get-client-infos",
		type: "POST",
		crossDomain: true,
		data: data,
		dataType: "json",
		success: function(vrData){updateCursor(vrData);}
	});
	draw();
	/*$.ajax({
		type: "GET",
		url: "http://"+serverIR+":"+port+"/client-infos",
		data: data,
		dataType: "JSON",
		success : function(vrData){updateCursor(vrData);draw();}
	});*/
	
	
	/*$.get( "http://"+serverIR+":"+port+"/client-infos", function( vrData ) {
			//console.log(vrData);
			updateCursor(vrData);
			
		});
		draw();*/
}, 1000);



function teleport(event){
	var canvasRect = canvas.getBoundingClientRect();
	relativeX = (event.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left);
	relativeY = (event.clientY - canvasRect.top) / (canvasRect.top - canvasRect.bottom);
	
	//piano : X= -1.376, Y= -1.06, Z= 0.863 //image -> X=300, Y=1000
	//balcony : X=-0.887, Y=9.404, Z=0.851  //image -> X=1000, Y=900
	//
	//img size X=Y=2048
	
	vrPosXY = normalized2DToVr(relativeX,relativeY);
	
	var data = {
		command: "Teleport", // this is the variable to check in unreal when getting the command from server
        x: vrPosXY[0],
        y: vrPosXY[1],
        z: 10,
        rotation: cursorData.Rot,
		appid: appID
    };
	$.ajax({
		type: "POST",
		url: "http://"+serverIR+":"+port+"/seller",
		data: data,
		dataType: "JSON"
	});
}

canvas.addEventListener('click', teleport);



function getVRAppsAddresses(){
	$.get( "http://"+serverIR+":"+port+"/clients-list", function( data ) {
			
			var vrDropdownList = document.getElementById("vrDropdownList");
			
			//appID = data[0];
			//document.getElementById("iplist").innerHTML = data;
			
			for(let appNumber of data){
				let option = document.createElement("option");
				option.text = appNumber;
				option.setAttribute("value", appNumber);
				vrDropdownList.add(option);
			}
			console.log(appID);
		});
}
getVRAppsAddresses();

function setAppID(){
	var vrDropdownList = document.getElementById("vrDropdownList");
	appID = vrDropdownList.options[vrDropdownList.selectedIndex].value;
}
document.getElementById("vrDropdownListSubmit").addEventListener('click', setAppID);



function changeStyle(){
	optionSelector1 = document.getElementById("options_floor");
	optionSelector2 = document.getElementById("options_wall");
	optionSelector3 = document.getElementById("options_kitchenbench");
	optionSelector4 = document.getElementById("options_kitchenfront");
	
	var options = ""+optionSelector1.options[optionSelector1.selectedIndex].value+","
		+ optionSelector2.options[optionSelector2.selectedIndex].value+","
		+ optionSelector3.options[optionSelector3.selectedIndex].value+","
		+ optionSelector4.options[optionSelector4.selectedIndex].value
	
	
	var data = {
		command: "ChangeStyle",
		options: options,
		appid: JSON.strinify(appID)
	}
	console.log(data);
	$.ajax({
		type: "POST",
		url: "http://"+serverIR+":"+port+"/seller",
		data: data,
		dataType: "JSON"
	});
}

interiorSubmitButton = document.getElementById("interiorOptionsSubmit");
interiorSubmitButton.addEventListener('click',changeStyle);







