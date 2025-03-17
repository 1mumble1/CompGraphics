class HouseElement
{
    constructor(x, y, width, height, color)
    {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {}
}

// хвататться только за область дома
// трансформации

class HouseBody extends HouseElement
{
    draw(ctx) 
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        var interval = this.width / 10;
        for (let i = 0; i < this.height; i += interval)
        {
            ctx.beginPath();
            ctx.strokeStyle = "#000000";
            ctx.moveTo(this.x, this.y + i);
            ctx.lineTo(this.x + this.width, this.y + i);
            ctx.stroke();
        }
    }
}

class HouseRoof extends HouseElement
{
    draw(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y - this.height);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.fill();
        ctx.closePath();
    }
}

class HouseTube extends HouseElement
{
    draw(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - this.height);
        ctx.lineTo(this.x + this.width, this.y - this.height);
        ctx.lineTo(this.x + this.width, this.y + 50);
        ctx.lineTo(this.x, this.y);
        ctx.fill();
        ctx.closePath();
    }
}

class HouseWindow extends HouseElement
{
    constructor(x, y, width, height, color, colorFrame, boldFrame)
    {
        super(x, y, width, height, color);
        this.colorFrame = colorFrame;
        this.boldFrame = boldFrame;
    }

    draw(ctx)
    {
        ctx.fillStyle = this.colorFrame;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + this.boldFrame, this.y + this.boldFrame, this.width - this.boldFrame * 2, this.height - this.boldFrame * 2);
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.boldFrame);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height - this.boldFrame);
        ctx.moveTo(this.x + this.boldFrame, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width - this.boldFrame, this.y + this.height / 2);
        ctx.stroke();
        ctx.closePath();
    }
}

class HouseFenceElement extends HouseElement
{
    draw(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y + this.height * 0.1, this.width, this.height * 0.9);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height * 0.1);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.1);
        ctx.fill();
        ctx.closePath();
    }
}

class HouseFence extends HouseElement
{
    constructor(x, y, width, height, color, countOfElements)
    {
        super(x, y, width, height, color);
        this.fenceElements = [];
        this.init(countOfElements);
    }

    init(countOfElements)
    {
        let widthElement = this.width / countOfElements;
        for (let i = 0; i < countOfElements; i++)
        {
            this.fenceElements.push(new HouseFenceElement(this.x + widthElement * i, this.y, widthElement, this.height, this.color));
        }
    }

    draw(ctx)
    {
        this.fenceElements.forEach((element) =>
        {
            element.draw(ctx);
        });
    }
}

class HouseDoor extends HouseElement
{
    constructor(x, y, width, height, color, colorHandle)
    {
        super(x, y, width, height, color);
        this.colorHandle = colorHandle;
    }
    draw(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.colorHandle;
        ctx.fillRect(this.x + this.width * 0.9, this.y + this.height / 2, this.width * 0.05, this.height * 0.05);
    }
}

class App
{
    constructor()
    {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.house = [];
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.initEvents();
        this.draw();
    }

    initEvents()
    {
        this.canvas.addEventListener("mousedown", (e) => 
        {
            const mouseX = e.clientX - this.offsetX;
            const mouseY = e.clientY - this.offsetY;
                this.isDragging = true;
                this.startX = e.clientX - this.offsetX;
                this.startY = e.clientY - this.offsetY;
        });

        this.canvas.addEventListener("mousemove", (e) => 
        {
            if (this.isDragging) {
                this.offsetX = e.clientX - this.startX;
                this.offsetY = e.clientY - this.startY;
                this.draw();
            }
        });

        this.canvas.addEventListener("mouseup", () => 
        {
            this.isDragging = false;
        });
    }

    draw()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);

        // отдельная сущность дома
        this.house = [
            new HouseBody(400, 400, 400, 400, "#8B4513"),
            new HouseRoof(400, 400, 400, 200, "#660000"),
            new HouseTube(700, 300, 50, 50, "#333333"),
            new HouseWindow(500, 500, 200, 200, "#00ccff", "#660000", 20),
            new HouseFence(0, 600, 400, 200, "#770000", 15),
            new HouseFence(800, 600, 400, 200, "#770000", 15),
            new HouseDoor(800, 600, 100, 200, "#663300", "#ffcc00")
        ];
        this.house.forEach((element) => element.draw(this.ctx));
        this.ctx.restore();
    }
}

const app = new App();