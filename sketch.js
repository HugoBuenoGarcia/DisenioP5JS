/* Estilos para el lienzo de fondo */
let particles = [];
let ripple = { x: 0, y: 0, r: 0, active: false };
let hueShift = 0;

function setup() {
    const c = createCanvas(windowWidth, windowHeight);
    c.parent('bg-canvas');
    colorMode(HSL, 360, 100, 100, 1);
    noStroke();

    // Inicializa partículas
    for (let i = 0; i < 180; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            s: random(1, 3),
            a: random(0.2, 0.9),
            spd: random(0.4, 1.2),
            off: random(TWO_PI)
        });
    }
}

function draw() {
    // Fondo con gradiente animado
    hueShift = (hueShift + 0.2) % 360;
    const topColor = color((220 + hueShift) % 360, 50, 12);
    const bottomColor = color((260 + hueShift) % 360, 45, 20);
    setGradient(0, 0, width, height, topColor, bottomColor);
    // Parallax suave en base al ratón
    const parX = map(mouseX, 0, width, -12, 12);
    const parY = map(mouseY, 0, height, -8, 8);

    // Partículas que orbitan suavemente y son atraídas por el ratón
    for (let p of particles) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distSq = dx * dx + dy * dy;
        const attraction = constrain(22000 / (distSq + 1), -2, 2);
        p.x += sin(frameCount * 0.01 + p.off) * p.spd + dx * 0.0006 * attraction + parX * 0.02;
        p.y += cos(frameCount * 0.013 + p.off) * p.spd + dy * 0.0006 * attraction + parY * 0.02;

        // Envuelve bordes
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const glow = color((180 + hueShift) % 360, 80, 70, p.a);
        fill(glow);
        circle(p.x, p.y, p.s * 2.2);

        // Halo
        fill((180 + hueShift) % 360, 80, 70, p.a * 0.25);
        circle(p.x, p.y, p.s * 6);
    }

    // Onda radial al hacer click
    if (ripple.active) {
        ripple.r += 10;
        for (let t = 0; t < 3; t++) {
            const alpha = map(ripple.r, 0, width * 1.4, 0.4, 0);
            stroke((200 + hueShift) % 360, 80, 65, alpha);
            noFill();
            strokeWeight(2);
            circle(ripple.x, ripple.y, ripple.r + t * 16);
        }

        if (ripple.r > width * 1.4) {
            ripple.active = false;
            ripple.r = 0;
        }
        noStroke();
    }
}

function mouseMoved() {
    // Microactivación de halo en partículas cercanas
    for (let p of particles) {
        if (dist(mouseX, mouseY, p.x, p.y) < 60) {
            p.a = min(1, p.a + 0.02);
        } else {
            p.a = max(0.25, p.a - 0.005);
        }
    }
}

function mousePressed() {
    ripple.x = mouseX;
    ripple.y = mouseY;
    ripple.r = 0;
    ripple.active = true;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setGradient(x, y, w, h, c1, c2) {
    for (let i = 0; i <= h; i++) {
        const inter = i / h;
        const c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, y + i, x + w, y + i);
    }
    noStroke();
}