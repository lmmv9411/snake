export class eventosTouch {
    constructor() {
        this.xDown = null;
        this.yDown = null;
    }

    handleTouchStart(e) {
        this.xDown = e.touches[0].clientX;
        this.yDown = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        e.preventDefault();

        if (!this.xDown || !this.yDown) {
            return;
        }

        let xUp = e.touches[0].clientX;
        let yUp = e.touches[0].clientY;

        let xDiff = xUp - this.xDown;
        let yDiff = yUp - this.yDown;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            //mas significativo
            if (xUp > this.xDown) {
                return "ArrowRight";
            } else {
                //izquierda
                return "ArrowLeft";
            }
        } else {
            if (yUp > this.yDown) {
                return "ArrowDown";
            } else {
                //arriba
                return "ArrowUp";
            }
        }

    }


    corregirDireccion(cabeza, mycanvas) {
        if (cabeza.x > cabeza.y) {
            //horizontal
            if (cabeza.x > mycanvas.width / 2) {
                return [-1, 0];
            } else {
                return [1, 0];
            }
        } else {
            //vertical
            if (cabeza.y > mycanvas.height / 2) {
                return [0, -1];
            } else {
                return [0, 1];
            }
        }
    }
}