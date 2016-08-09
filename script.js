// Script: Bead View
// Developer: Gage Coates
// Date: 8/7/16
// Description: A small application that allows the easy placement of assorted beads on digital jewellery

// application
var application = new Application();

// gets called once the html is loaded
function Initialize() {
	application.Initialize();
}

// application class
function Application () {
	// canvas
	this.canvas;
	this.ctx;
	this.scale;
	// html
	this.selection;
	this.mirror;
	// jewellery
	this.beads = [];
	this.jewellery = new Jewellery();
	
	this.Render = function () {
		var self = this;
		var jewellery = self.jewellery;
		self.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		self.ctx.save();
		self.ctx.translate(self.canvas.width/2,self.canvas.height/2);
		
		// render string
		self.ctx.beginPath();
		self.ctx.arc(0,0,jewellery.radius * self.scale,0,Math.PI*2);
		self.ctx.strokeStyle = jewellery.color;
		self.ctx.lineWidth = jewellery.stringWidth * self.scale;
		self.ctx.stroke();
		
		// info
		self.ctx.fillStyle = 'white';
		self.ctx.font = '30px Arial';
		self.ctx.textAlign = 'center';
		self.ctx.fillText(self.jewellery.radius * 2 + '" across; ' + Math.ceil(self.jewellery.Circumference()) + '" needed',0,0);
		
		// render bead array onto circle
		var length = 0;
		self.ctx.rotate(Math.PI/2);
		jewellery.beads.forEach(function (bead) {
			length += (bead.radius*2 * self.mirror);
			if (length < self.jewellery.Circumference()) {
				self.ctx.rotate(bead.radius / jewellery.radius);
				var offset = (2 * Math.PI)/self.mirror;
				for (var theta = 0; theta < 2 * Math.PI; theta += offset) {
					self.ctx.drawImage(bead.texture, 0,0,bead.texture.width,bead.texture.height,Math.round((jewellery.radius - (bead.radius*(bead.texture.width/bead.texture.height))) * self.scale),Math.round(-bead.radius * self.scale),Math.round((bead.radius*(bead.texture.width/bead.texture.height))*2 * self.scale),Math.round(bead.radius*2*self.scale));
					self.ctx.rotate(offset);
				}
				self.ctx.rotate(offset);
				self.ctx.rotate(bead.radius / jewellery.radius);
			}
		});
		self.ctx.restore();
	}
	this.Resize = function () {
		this.canvas.height = window.innerHeight- 16;
		this.canvas.width = window.innerHeight- 16;
	}
	this.Initialize = function () {
		var self = this;
		// canvas
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.Resize();
		
		// mirroring
		var mirror = document.getElementById('mirror');
		mirror.onmousemove = function () {
			self.mirror = parseInt(mirror.value);
			self.Render();
		}
		mirror.onmousemove();
		
		// bead selection
		this.selection = document.getElementById('selection');
		
		// bead removal
		var remove = document.getElementById('remove');
		remove.onclick = function () {
			self.jewellery.beads.pop();
			self.Render();
		}
		
		// jewellery radius
		var radius = document.getElementById('radius');
		radius.onmousemove = function () {
			self.jewellery.radius = parseFloat(radius.value);
			self.scale = (0.4 * parseInt(self.canvas.width))/self.jewellery.radius;
			self.Render();
		}
		radius.onmousemove();
		// default bead set
		self.beads.push(new Bead('square',1/8));
		self.beads.push(new Bead('black square',1/8));
		self.beads.push(new Bead('purple square',1/8));
		self.beads.push(new Bead('red square',1/8));
		self.beads.push(new Bead('orange square',1/8));
		self.beads.push(new Bead('yellow square',1/8));
		self.beads.push(new Bead('green square',1/8));
		self.beads.push(new Bead('cyan square',1/8));
		self.beads.push(new Bead('blue square',1/8));
		
		self.beads.push(new Bead('round',1/8));
		self.beads.push(new Bead('black round',1/8));
		self.beads.push(new Bead('purple round',1/8));
		self.beads.push(new Bead('red round',1/8));
		self.beads.push(new Bead('orange round',1/8));
		self.beads.push(new Bead('yellow round',1/8));
		self.beads.push(new Bead('green round',1/8));
		self.beads.push(new Bead('cyan round',1/8));
		self.beads.push(new Bead('blue round',1/8));
		
		self.beads.push(new Bead('short',3/32));
		self.beads.push(new Bead('black short',3/32));
		self.beads.push(new Bead('purple short',3/32));
		self.beads.push(new Bead('red short',3/32));
		self.beads.push(new Bead('orange short',3/32));
		self.beads.push(new Bead('yellow short',3/32));
		self.beads.push(new Bead('green short',3/32));
		self.beads.push(new Bead('cyan short',3/32));
		self.beads.push(new Bead('blue short',3/32));
		
		var loaded = 0;
		self.beads.forEach(function (bead) {
			bead.texture.onload = function () {
				loaded++;
				if (loaded >= self.beads.length) {
					// display once all textures are loaded
					self.Render();
				}
			}
			var src = 'beads/' + bead.name + '.png';
			// fill selection
			var li = document.createElement('LI');
			var div = document.createElement('DIV');
			div.className = 'bead';
			div.onmousedown = function () {
				self.jewellery.beads.push(bead);
				self.Render();
			}
			var p = document.createElement('P');
			p.innerHTML = bead.name;
			
			var img = document.createElement('IMG');
			img.className = 'thumbnail';
			img.src = src;
			var radius = document.createElement('INPUT');
			radius.type = 'range';
			radius.min = 1/16;
			radius.max = 1/4;
			radius.step = 1/32;
			radius.value = 1/8;
			radius.onmousemove = function () {
				bead.radius = parseFloat(radius.value);
				self.Render();
			}
			
			//div.appendChild(p);
			div.appendChild(img);
			li.appendChild(div);
			li.appendChild(radius);
			self.selection.appendChild(li);
			
			// load texture
			bead.LoadTexture(src);
			self.beads.push(bead);
		});
	}
}

function Jewellery (radius) {
	this.radius = radius ? radius : 1.5; // inches
	this.color = 'silver';
	this.stringWidth = 1/32;
	this.beads = [];
	this.Circumference = function () {
		return 2 * Math.PI * this.radius;
	}
}
function Bead (name,radius) {
	this.name = name;
	this.radius = radius; // inches
	this.color = 'white';
	this.texture = new Image();
	this.LoadTexture = function (src) {
		this.texture.src = src;
	}
}