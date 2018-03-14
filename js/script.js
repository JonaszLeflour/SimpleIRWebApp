//------- Send positional data (X, Y, Z + Rotation(Z)) to the Seller - PlayCanvast -------

var serverIR = "52.234.227.182";
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



function updateCursor(vrData){
	cursorData.X = -(data.Y);
	cursorData.Y = data.X;
	cursorData.Rot = (data.RotZ)-180;
}



function draw(){
	var ctx = canvas.getContext("2d");
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	if(imgLoaded){
		ctx.drawImage(mapBackGround,0,0);
		ctx.drawImage(mapBackGround, 0, 0, 
			mapBackGround.width, mapBackGround.height,
            0, 0, canvas.width, canvas.height);
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
	/*$.get( "http://"+serverIR+":"+port+"/client-infos", function( vrData ) {
			console.log(vrData);
			updateCursor(vrData);
			
		});*/
		draw();
}, 1000);


function teleport(event){
	var data = {
		command: "Teleport", // this is the variable to check in unreal when getting the command from server
        x: event.clientX,
        y: 0,
        z: event.clientY,
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