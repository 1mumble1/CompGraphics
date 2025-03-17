class CheckerboardBackground
{
    constructor(ctx, size = 20) 
    {
        this.ctx = ctx;
        this.size = size;
    }

    draw(x, y, width, height) 
    {
        for (let row = 0; row < height; row += this.size) 
        {
            for (let col = 0; col < width; col += this.size) 
            {
                this.ctx.fillStyle = (col / this.size + row / this.size) % 2 === 0 ? "#bbb" : "#fff";
                this.ctx.fillRect(x + col, y + row, this.size, this.size);
            }
        }
    }
}

class ImageLoader 
{
    constructor(callback) 
    {
        this.callback = callback;
        this.input = document.getElementById("fileInput");
        this.init();
    }

    init() 
    {
        this.input.addEventListener("change", (e) => this.loadImage(e));
    }

    loadImage(event) 
    {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => 
        {
            const img = new Image();
            img.onload = () => this.callback(img, file.type.includes("png"));
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

class ImageViewer 
{
    constructor() 
    {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.bg = new CheckerboardBackground(this.ctx);
        this.image = null;
        this.isPNG = false;
        this.imgX = 0;
        this.imgY = 0;
        this.imgWidth = 0;
        this.imgHeight = 0;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.initEvents();
        this.resizeCanvas();
    }

    setImage(img, isPNG) 
    {
        this.image = img;
        this.isPNG = isPNG;
        const scale = Math.min(this.canvas.width / img.width, this.canvas.height / img.height, 1);
        this.imgWidth = img.width * scale;
        this.imgHeight = img.height * scale;
        this.imgX = (this.canvas.width - this.imgWidth) / 2;
        this.imgY = (this.canvas.height - this.imgHeight) / 2;
        this.draw();
    }

    initEvents() 
    {
        window.addEventListener("resize", () => this.resizeCanvas());
        document.addEventListener("mousedown", (e) => this.startDrag(e));
        document.addEventListener("mousemove", (e) => this.drag(e));
        document.addEventListener("mouseup", () => this.endDrag());
        document.addEventListener("mouseleave", () => this.endDrag());
    }

    resizeCanvas() 
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw();
    }

    draw() 
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.image && this.isPNG) 
        {
            this.bg.draw(this.imgX, this.imgY, this.imgWidth, this.imgHeight);
        }

        if (this.image) 
        {
            this.ctx.drawImage(this.image, this.imgX, this.imgY, this.imgWidth, this.imgHeight);
        }
    }

    startDrag(event) 
    {
        if (
            event.clientX >= this.imgX && event.clientX <= this.imgX + this.imgWidth &&
            event.clientY >= this.imgY && event.clientY <= this.imgY + this.imgHeight
        ) 
        {
            this.isDragging = true;
            this.offsetX = event.clientX - this.imgX;
            this.offsetY = event.clientY - this.imgY;
        }
    }

    drag(event) 
    {
        if (this.isDragging) 
        {
            this.imgX = event.clientX - this.offsetX;
            this.imgY = event.clientY - this.offsetY;
            this.draw();
        }
    }

    endDrag() 
    {
        this.isDragging = false;
    }
}

const viewer = new ImageViewer();
new ImageLoader((img, isPNG) => viewer.setImage(img, isPNG));