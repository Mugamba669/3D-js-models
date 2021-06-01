class JDroidFx {
    constructor({loader,canvaSelector,currentTime,durationTime,}){
        this.audio = new Audio();
        this.settings = {
            loader: document.querySelector(loader),
            canvaSelector:canvaSelector,
            currentTime:document.querySelector(currentTime),
            durationTime: document.querySelector(durationTime)
    };

    this.defaults = {
            frames:0.8,
            audioLoop:false,
            volume:0.20,
            balance: 0,
            visualColor:"#1B0B75"
};
    // return defaults;
// Web Audio Api
        // window.AudioContext = window.AudioContext || -webkitAudioContext;
        this.audioCtx = new AudioContext();
        var canvas = document.querySelector(this.settings.canvaSelector);
        var context = canvas.getContext("2d"); // using part of the canvas Api
        this.analyser = this.audioCtx.createAnalyser();
        this.gain = this.audioCtx.createGain();
        this.bassBoost = this.audioCtx.createGain();
        this.crystalBoost = this.audioCtx.createGain();
        this.source = this.audioCtx.createMediaElementSource(this.audio);
        this.crystal = this.audioCtx.createBiquadFilter();
        this.bass = this.audioCtx.createBiquadFilter();
        this.panner = this.audioCtx.createStereoPanner();
        this.treble = this.audioCtx.createBiquadFilter();
        this.frequencyDomain = new Uint8Array(this.analyser.frequencyBinCount);
        this.byteSize = this.analyser.frequencyBinCount;
        // audio volume
        this.audio.volume = this.defaults.volume;//volume
// volume control

// function to load music
        this.loadTrack = (e) => {
            var file = e.currentTarget.files[0];
            this.audio.src = URL.createObjectURL(file);
            // this.audio.play();
        }
        // function to maniplate audio
        this.audioTuner = function(){
            try{
            this.panner.pan.value = this.defaults.balance;
            this.bassTuner(this.source,this.audioCtx.destination);
            this.trebleTuner(this.source,this.audioCtx.destination);
            if(this.defaults.audioCrystaliser){
                this.crystaliser();
            }
            this.analyser.fftSize = 1024;
            this.analyser.minDecibels = -70;
            this.analyser.maxDecibels = -10;
        }catch(e){
            alert(e);
        }
        }.bind(this);
// bassBoast
     // compute bass Decibels
        this.bassTuner = function(source,dest){
            // console.log(this.bass)
            this.bass.type = 'lowpass';
            this.bass.frequency.value = 55;
            this.bass.gain.value = 10;
        //    this.bassBoost();
            source.connect(this.panner);
            this.panner.connect(this.bass);
            this.bass.connect(this.analyser);
            this.analyser.connect(dest);
        }.bind(this);

        // compute treble Decibels
        this.trebleTuner = function(source,dest){
            this.treble.type = 'bandpass';
            this.treble.frequency.value = 2000;
            source.connect(this.treble);
            this.treble.connect(this.analyser);
            this.analyser.connect(dest);

        }.bind(this);
        this.crystaliser = function(){
            this.crystal.type = 'highpass';
            this.crystal.frequency.setValueAtTime(2000,this.audioCtx.currentTime);
            this.crystalBoost.gain.setValueAtTime(1.5,this.audioCtx.currentTime);
            this.source.connect(this.panner);
            this.panner.connect(this.crystal)
            this.crystal.connect(this.crystalBoost);
            this.crystalBoost.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);
        }.bind(this);

        // timing function
        this.timeUpdate =function(){
            var sec = parseInt(this.audio.currentTime % 60);
            var min = parseInt((this.audio.currentTime / 60) % 60);

            var sc = parseInt(this.audio.duration % 60);
            var mn = parseInt((this.audio.duration / 60) % 60);

            sec < 10 ? this.settings.currentTime.textContent = min+":"+ "0"+sec: this.settings.currentTime.textContent = min+":"+sec;
            sc < 10 ? this.settings.durationTime.textContent = mn+":"+"0"+sc :this.settings.durationTime.textContent = mn+":"+sc;
        }.bind(this);
        // audio visualizer
        this.audioVisualizer = function(){
            window.requestAnimationFrame(this.audioVisualizer);
            this.analyser.getByteFrequencyData(this.frequencyDomain);
            context.clearRect(0,0,canvas.width,canvas.height);
            context.fillStyle = this.defaults.visualColor;
            for (let i = 0; i < this.byteSize; i++) {
                var element = this.frequencyDomain[i] / 200;
                var barWidth = 2;
                var barX = i * 3;
                var height = canvas.height * element;
                var barHeight = canvas.height - height - 1;
                context.fillRect(barX,barHeight,barWidth,height);
            }
        }.bind(this);

        this.audioSpectrum = function(){
            window.requestAnimationFrame(this.audioSpectrum)
            this.analyser.getByteTimeDomainData(this.frequencyDomain);
            context.clearRect(0,0,canvas.width,canvas.height);
            context.fillStyle = this.defaults.visualColor;
            for (let i = 0; i < this.byteSize; i++) {
                var element = this.frequencyDomain[i] / 200;
                var specX = 2;
                var height = canvas.height * element;
                var specHeight = canvas.height - height - 1;
                context.fillRect(i * specX,specHeight,2,2);
            }
        }.bind(this);

// get audio balance
        this.audioBalance = function(){
        }.bind(this);
    }


    // JdroidFx Methods
    getAudio(){
        console.log(this.audioCtx);
        this.settings.loader.onchange = this.loadTrack;
        this.audio.onplaying = this.audioTuner;
        this.audio.ontimeupdate = this.timeUpdate;
    }
    getTrackerUpdate(selector){
       var sliderTrack = document.querySelector(selector);

     setInterval(() => {
        sliderTrack.value = this.audio.currentTime;
        sliderTrack.max = this.audio.duration;
     },500);
     sliderTrack.onchange = function(){
        this.audio.currentTime = sliderTrack.value ;

     }.bind(this);

    }
    getControlButtons({play,pause,next,prev}){
        var controls = {
                play:document.querySelector(play),
                pause:document.querySelector(pause),
                next:document.querySelector(next),
                prev:document.querySelector(prev)
        };
        this.audio.playing ? this.audio.play() : this.audio.pause();
        controls.play.onclick = function(){
            this.audio.play();
            this.audioCtx.resume();
        }.bind(this);

        controls.pause.onclick = function(){
            this.audio.pause();
        }.bind(this);


    }
    getDefaults(){
        return this.defaults;
    }

getAudioBassBoost({
    bassBoostSelector
}){
    var bassSelector = document.querySelector(bassBoostSelector);
    var that = this;
    bassSelector.onchange = function(){
        if(this.checked){
            // alert(this.checked)
            that.bassBoost.gain.value = 3;
            that.bass.connect(that.bassBoost)
            that.bassBoost.connect(that.analyser);
        }else{
            // alert(this.checked)
            that.bassBoost.gain.value = 0;
            that.bass.disconnect(that.bassBoost)
            that.bassBoost.disconnect(that.analyser);
        }
    }
}

getCrystalizer({crystalizer}){
    var that = this;
    var crystals = document.querySelector(crystalizer);
    crystals.onchange = function(){
        switch(this.checked){
            case true:
            // alert(this.checked)
            that.crystaliser();
            break;

            default:
                // alert(this.checked)
            that.crystal.type = 'highpass';
                that.crystal.frequency.setValueAtTime(0,that.audioCtx.currentTime);
                that.source.disconnect(that.crystal);
                that.crystal.disconnect(that.analyser);
                that.analyser.disconnect(that.audioCtx.destination);
                break;
        }
    }
}

getFrameRate({
    frameRateSelector
}){
    var frameRate = document.querySelector(frameRateSelector);
    var label = document.querySelector("#tt");
    var that = this;
    frameRate.onchange = function(){
        that.analyser.smoothingTimeConstant = this.value;
        label.textContent = (this.value);
    }
}
getAudioVisuals({
    options
}){
    var that = this;
    var visuals = document.querySelector(options);
    visuals.addEventListener("change",function(){

        switch (this.value) {
            case "bars":
                that.audioVisualizer();
                // alert(this.value)
                break;

            case "spectrum":
                that.audioSpectrum();
                // alert(this.value)
                break;

            default:
                alert("No visualiser selected");
                console.warn("No visualiser selected");
                break;
        }
    },false);
    }
    getVolume({vol}){
        console.log(this.defaults.volume);
        var that = this;
        document.querySelector(vol).addEventListener("change",function(e){
                that.audio.volume = this.value;
        },false);
    }
    getAudioBalance({panner}){
        console.log(this.panner);
        var that = this;
        document.querySelector(panner).onchange = function(e){
            that.panner.pan.setValueAtTime(this.value,that.audioCtx.currentTime);
        }
    }
    getColorPicker({canvas,image}){
        var image = document.querySelector(image);
        var url = "./default.png";
        image.src = url;
        var canvas = document.querySelector(canvas);
        var ctx = canvas.getContext("2d");
        // image.onload = function(){

        // }
        image.onload = function(e){
            image.width = canvas.width;
            image.height = canvas.height;
            ctx.drawImage(image,0,0,image.width,image.height);
            var x= 115,y =126,a=92,b=112;
            // alert(e);
            // if(e.offsetX){
            //     a = e.offsetX;
            //     b = e.offsetY;
            //     alert(a);
            //     alert(b);
            // }
            var pixel = ctx.getImageData(x,y,1,1).data;
            var pl = ctx.getImageData(a,b,1,1).data;
            var color1 = "rgba("+pl[0]+","+pl[1]+","+pl[2]+")";
            var color2 = "rgba("+pixel[0]+","+pixel[1]+","+pixel[2]+")";
            var bgColor = "-webkit-radial-gradient(circle,"+color1+","+color2+")";
            document.querySelector("body").style.background = bgColor;
        }
    }
};

export{ JDroidFx  };
