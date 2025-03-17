class Letter
{
    constructor(x, y, color, width, phaseOffset)
    {
        this.x = x;
        this.y = y;
        this.baseY = y; // Базовое положение
        this.color = color;
        this.width = width;
        this.velocity = 0;
        this.gravity = 0.5;
        this.jumpStrength = -12;
        this.isJumping = false;
        this.phaseOffset = phaseOffset; // Индивидуальная фаза
    }

    update(time)
    {
        let phaseTime = time + this.phaseOffset;
        // sin убрать, через delay
        if (!this.isJumping && Math.sin(phaseTime) > 0.7)
        {
            this.velocity = this.jumpStrength;
            this.isJumping = true;
        }
        
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        if (this.y >= this.baseY)
        {
            this.y = this.baseY;
            this.velocity = 0;
            this.isJumping = false;
        }
    }

    draw(ctx, lineWidth) {}
}

// код физики от кода рисования отделить

class LetterC extends Letter
{
    draw(ctx, lineWidth)
    {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, Math.PI / 4, Math.PI * 7 / 4, false);
        ctx.stroke();
    }
}

class LetterM extends Letter
{
    constructor(x, y, color, width, height, phaseOffset)
    {
        super(x, y, color, width, phaseOffset);
        this.height = height;
    }

    draw(ctx, lineWidth)
    {
        // трансформации на холсте
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height + lineWidth / 2);
        ctx.lineTo(this.x, this.y + lineWidth * 1.5);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height - lineWidth / 2);
        ctx.lineTo(this.x + this.width, this.y + lineWidth * 1.5);
        ctx.lineTo(this.x + this.width, this.y + this.height + lineWidth / 2);
        ctx.stroke();
    }
}

class LetterF extends Letter
{
    constructor(x, y, color, width, height, phaseOffset)
    {
        super(x, y, color, width, phaseOffset);
        this.height = height;
    }

    draw(ctx, lineWidth)
    {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2, false);
        ctx.moveTo(this.x, this.y - lineWidth / 2);
        ctx.lineTo(this.x, this.y + this.height + lineWidth / 2);
        ctx.stroke();
    }
}

class App
{
    constructor()
    {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.lineWidth = 20;

        this.letters = [
            new LetterC(250, 300, "#000000", 50, 0),
            new LetterM(350, 250, "#aaaaaa", 75, 100, 1),
            new LetterF(525, 250, "#123456", 75, 100, 2)
        ];

        this.startTime = performance.now();
        this.animate();
    }

    animate()
    {
        requestAnimationFrame(() => this.animate());
        let time = (performance.now() - this.startTime); // Время для анимации

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineWidth = this.lineWidth;
        
        this.letters.forEach(letter =>
        {
            letter.update(time);
            letter.draw(this.ctx, this.lineWidth);
        });
    }
}

const app = new App();