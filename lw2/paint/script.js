class DrawingApp
{
    constructor()
    {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.colorInput = document.getElementById("colorPicker");
        this.newCanvasButton = document.getElementById("newButton");
        this.isDrawing = false;
        this.lineWidth = 5;
        this.currentColor = "#000000";
        this.image = null;

        this.initEvents();
        this.resizeCanvas();
    }

    initEvents()
    {
        this.newCanvasButton.addEventListener("click", () => this.createNewCanvas());
        this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
        this.canvas.addEventListener("mousemove", (e) => this.draw(e));
        this.canvas.addEventListener("mouseup", () => this.stopDrawing());
        //this.canvas.addEventListener("mouseleave", () => this.stopDrawing());
        this.colorInput.addEventListener("input", (e) => this.changeColor(e));
    }

    resizeCanvas() 
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // отрываться не должно
    startDrawing(event)
    {
        this.isDrawing = true;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineCap = "round";
        this.ctx.moveTo(event.clientX, event.clientY);
    }

    draw(event)
    {
        if (!this.isDrawing) return;
        this.ctx.lineTo(event.clientX, event.clientY);
        this.ctx.stroke();
    }

    stopDrawing()
    {
        this.isDrawing = false;
    }

    changeColor(event)
    {
        this.currentColor = event.target.value;
    }

    setImage(img)
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.image = img;
        const scale = Math.min(this.canvas.width / img.width, this.canvas.height / img.height, 1);
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        const imgX = (this.canvas.width - imgWidth) / 2;
        const imgY = (this.canvas.height - imgHeight) / 2;
        this.ctx.drawImage(this.image, imgX, imgY, imgWidth, imgHeight);
    }

    createNewCanvas()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.image = null;
    }

    saveImage()
    {
        const link = document.createElement("a");
        link.download = `picture.png`;
        link.href = this.canvas.toDataURL(`image/png`);
        link.click();
    }
}

class FileHandler
{
    constructor(drawingApp)
    {
        this.drawingApp = drawingApp;
        this.fileInput = document.getElementById("fileInput");
        this.saveButton = document.getElementById("saveButton");
        this.initEvents();
    }

    initEvents()
    {
        this.fileInput.addEventListener("change", (e) => this.loadImage(e));
        this.saveButton.addEventListener("click", () => this.saveImage());
    }

    loadImage(event)
    {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => this.drawingApp.setImage(img);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    saveImage()
    {
        this.drawingApp.saveImage();
    }
}

const drawingApp = new DrawingApp();
const fileHandler = new FileHandler(drawingApp);