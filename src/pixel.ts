import { mouseObj } from "./interface/interface"
import { imageToBase64 } from "./lib/bast64"

export async function main() {
    const canves = document.createElement("canvas")
    canves.width = innerWidth
    canves.height = innerHeight
    const img = document.createElement('img')
    const ctx = canves.getContext('2d')
    const imge64 = await imageToBase64('./angler.png')
    img.id = "cni"
    img.src = `${imge64}`
    await document.getElementById("app")?.appendChild(img)
    await document.getElementById("app")?.appendChild(canves)


    class Perticle {
        x: number
        y: number
        size: number
        effect: Effect
        vx: number
        vy: number
        originX: number
        originY: number
        color: string
        ease: number
        dx:number
        dy:number
        distance:number
        force:number
        angle:number
        fricktion:number
        constructor(effect: Effect, x: number, y: number, color: string) {
            this.effect = effect
            this.x = Math.random() * this.effect.width
            this.y = Math.random() * this.effect.height
            this.size = 2
            this.originX = Math.floor(x)
            this.originY = Math.floor(y)
            this.vx = 0
            this.vy = 0
            this.color = color
            this.ease = .3
            this.dx = 0
            this.dy = 0
            this.distance = 0
            this.angle = 0
            this.fricktion =.90
        }
        draw(context: CanvasRenderingContext2D) {
            context.fillRect(this.x, this.y, this.size, this.size)
            context.fillStyle = this.color
        }
        update() {
            this.dx = this.effect.mouse.x - this.x
            this.dy = this.effect.mouse.y - this.y
            this.distance = this.dx * this.dx  + this.dy * this.dy
            this.force = -this.effect.mouse.redius/this.distance
            if (this.distance<this.effect.mouse.redius) {
                this.angle = Math.atan2(this.dy,this.dx)
                this.vx += this.force * Math.cos(this.angle)
                this.vy += this.force * Math.sin(this.angle)
            }
            this.x += (this.vx*=this.fricktion) + (this.originX - this.x) * this.ease
            this.y += (this.vy*=this.fricktion) + (this.originY - this.y) * this.ease
            
        }
    }
    
    class Effect {
        width: number
        height: number
        perticleArr: Perticle[]
        centerX: number
        centery: number
        x: number
        y: number
        gap: number
        mouse: mouseObj
        constructor(width: number, height: number) {
            this.width = width
            this.height = height
            this.perticleArr = []
            this.centerX = this.width * .5
            this.centery = this.height * .5
            this.x = this.centerX - img.width * .5
            this.y = this.centery - img.height * .5
            this.gap = 2
            this.mouse = {
                redius: 3000,
                x: undefined,
                y: undefined
            }
            window.addEventListener('mousemove',e=>{
                this.mouse.x = e.x
                this.mouse.y = e.y
                
            })

        }

        async init(context: CanvasRenderingContext2D) {
            await context.drawImage(img, this.x, this.y)
            const pixels = await context.getImageData(0, 0, canves.width, canves.height).data
            for (let y = 0; y < this.height; y += this.gap) {
                for (let x = 0; x < this.width; x += this.gap) {
                    const index = (y * this.width + x) * 4
                    const red = pixels[index]
                    const green = pixels[index + 1]
                    const blue = pixels[index + 2]
                    const alpha = pixels[index + 3]
                    const color = `rgb(${red},${green},${blue})`
                    if (alpha > 0) {
                        this.perticleArr.push(new Perticle(this, x, y, color))
                    }

                }

            }
            console.log(this.perticleArr);

        }
        draw(context: CanvasRenderingContext2D) {
            this.perticleArr.forEach(e => e.draw(context))
        }
        update() {
            this.perticleArr.forEach(e => e.update())
        }
    }
    const pr = new Effect(canves.width, canves.height)
    await pr.init(ctx)

    function animate() {
        ctx.clearRect(0, 0, canves.width, canves.height)
        pr.draw(ctx)
        pr.update()
        requestAnimationFrame(animate)
    }
    animate()
}