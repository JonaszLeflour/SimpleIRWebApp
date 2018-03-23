//------- Send positional data (X, Y, Z + Rotation(Z)) to the Seller - PlayCanvast -------

var serverIR = "imretest.eastus.cloudapp.azure.com";
var port = "3000";
var cursorData = {X:100.0, Y:100.0, Rot:0.0}



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
	$.get( "http://"+serverIR+":"+port+"/client-infos", function( vrData ) {
			//console.log(vrData);
			updateCursor(vrData);
			
		});
		draw();
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
        rotation: cursorData.Rot
    };
	$.ajax({
		type: "POST",
		url: "http://"+serverIR+":"+port+"/seller",
		data: data,
		dataType: "JSON"
	});
}

canvas.addEventListener('click', teleport);



function changeStyle(){
	optionSelector1 = document.getElementById("options1");
	optionSelector2 = document.getElementById("options2");
	optionSelector3 = document.getElementById("options3");
	optionSelector4 = document.getElementById("options4");
	
	var options = ""+optionSelector1.options[optionSelector1.selectedIndex].value+","
		+ optionSelector2.options[optionSelector2.selectedIndex].value+","
		+ optionSelector3.options[optionSelector3.selectedIndex].value+","
		+ optionSelector4.options[optionSelector4.selectedIndex].value
	
	
	var data = {
		command: "ChangeStyle",
		options: options
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


// update code called every frame
/*Sfasaf.prototype.update = function(dt) {
    if(currentDelay === 0 ) {
        currentDelay = Date.now();
    }
    
    var self = this;
    
    if(Date.now() > delay + currentDelay) {
        console.log('run script');
        
        currentDelay = 0;
        
        $.get( "http://"+serverIR+":"+port+"/client-infos", function( data ) { //"http://localhost:3000/client-infos" https://aqueous-plateau-58732.herokuapp.com/client-infos
          console.log(data);
            var quat = new pc.Quat().setFromEulerAngles(0, (data.RotZ)-180, 0);
            
            self.entity.setPosition(-(data.Y), 0, data.X);
            self.entity.setRotation(quat.invert());
        });
    }
};*/


//------- On Click mouse to teleport VR character (Send data to Client UE4) -------



// initialize code called once per entity


/*ClickTeleport.prototype.initialize = function() {
    
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
};*/



/*PickerFramebuffer.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            app.mouse.on(pc.input.EVENT_MOUSEDOWN, this.onSelect, this);
        },*/




/*ClickTeleport.prototype.onMouseDown = function (event) {
    
    console.log(event);
    
    // If the left mouse button is pressed, change the cube color to red
    if (event.button === pc.MOUSEBUTTON_LEFT) {
        // this.entity.model.meshInstances[0].material = this.redMaterial.resource;
        console.log('clicked this');
        
        // this whole object will be returned when polling commands from unreal

         var data = {
            command: "Teleport", // this is the variable to check in unreal when getting the command from server
            x: this.x,
            y: this.y,
            z: this.z,
            rotation: this.rotation
        };
        
        $.ajax({
            type: "POST",
            url: "http://"+serverIR+":"+port+"/seller",
            data: data,
            dataType: "JSON" 
        });
    }
};*/