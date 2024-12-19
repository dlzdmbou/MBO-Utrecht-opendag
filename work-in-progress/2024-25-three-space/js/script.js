import * as THREE from 'three';
import * as highscoreManager from './highscoreManager.js';

// Game variables
let score = 0;
let misses = -1;
let gameActive = false;
let gameTotalTimer = 5;
let gameTimerRate = 1000;
let clock;
// Accumulator for time += deltatime
let time = 0;

// Get DOM element 🔥
const container = document.getElementById("ThreeJS");

// Setup a renderer and add to DOM element
const renderer = new THREE.WebGLRenderer();
renderer.setSize(1280 / 2, 768 / 2);
container.innerHTML = '';
container.appendChild(renderer.domElement);
// Handle Clicks
container.addEventListener("click", (event) => playerShoot(event));

// Setup Three.js scene to render
const scene = new THREE.Scene();

// Setup a camera from where to render
const camera = new THREE.PerspectiveCamera(90, renderer.domElement.getBoundingClientRect().width / renderer.domElement.getBoundingClientRect().height, 0.1, 1000);
camera.position.z = 25;

// Loaders
const textureLoader = new THREE.TextureLoader();
const textures = [];
textures.push(textureLoader.load('../img/textures/companion-cube.webp'));
textures.push(textureLoader.load('../img/textures/ai-metal-bars-dark.webp'));
// Texture setup general
textures.forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
});
textures[1].repeat.set(2, 1);

// Target object
const targetGeometry = new THREE.BoxGeometry(3, 3, 3);
const targetMaterial = new THREE.MeshPhongMaterial({ color: 0xEEEEEE, map: textures[0], opacity: 1, transparent: true });
const target = new THREE.Mesh(targetGeometry, targetMaterial);
const targetLight = new THREE.PointLight(0x00FF00, 2500, 0, 2);
targetLight.castShadow = true
target.add(targetLight);
target.castShadow = true;
target.visible = false;

scene.add(target);

// World
// wall front, wall sides, wall floor, wall roof
const world = new THREE.Group();
const worldMaterial = new THREE.MeshPhongMaterial({ color: 0xCCCCCC, map: textures[1], side: THREE.DoubleSide });
const worldMaterial2 = new THREE.MeshPhongMaterial({ color: 0xCCCCCC, side: THREE.DoubleSide });
let worldGeometry = new THREE.PlaneGeometry(120, 50, 2, 1);
let worldPart = new THREE.Mesh(worldGeometry, worldMaterial);
worldPart.position.set(0, 4, -60);
world.add(worldPart);

worldGeometry = new THREE.PlaneGeometry(55, 50, 2, 1);
worldPart = new THREE.Mesh(worldGeometry, worldMaterial);
worldPart.rotateY(90);
worldPart.position.set(60, 0, -20);
world.add(worldPart);

worldGeometry = new THREE.PlaneGeometry(55, 50, 2, 1);
worldPart = new THREE.Mesh(worldGeometry, worldMaterial);
worldPart.rotateY(-90);
worldPart.position.set(-60, 0, -20);
world.add(worldPart);

worldGeometry = new THREE.PlaneGeometry(400, 200, 2, 1);
worldPart = new THREE.Mesh(worldGeometry, worldMaterial2);
worldPart.position.set(0, -50, 0);
worldPart.rotation.set(90, 0, 0);
world.add(worldPart);

worldGeometry = new THREE.PlaneGeometry(400, 400, 2, 1);
worldPart = new THREE.Mesh(worldGeometry, worldMaterial2);
worldPart.position.set(0, 30, 0);
worldPart.rotateX(90);
world.add(worldPart);

scene.add(world);

// Lights
const light = new THREE.PointLight(0xFFFFFF, 2000, 0, 2);
light.position.set(0, 10, -10);
scene.add(light);

const lightCenter = new THREE.PointLight(0xFFFFFF, 2000, 0, 2);
lightCenter.position.set(0, 10, 50);
scene.add(lightCenter);

const lightLeft = new THREE.PointLight(0xFF0000, 1000, 0, 2);
lightLeft.position.set(-70, 0, -10);
scene.add(lightLeft);

const lightRight = new THREE.PointLight(0x0000FF, 2000, 0, 2);
lightRight.position.set(70, 0, -10);
scene.add(lightRight);

document.getElementById("btnStart").addEventListener("click", function (event) {
    document.getElementById("gameInterface").classList.add("hidden");
    startGame();
});

document.getElementById("btnEnd").addEventListener("click", function (event) {
    document.getElementById("gameEnd").classList.add("hidden");
    document.getElementById("gameStart").classList.remove("hidden");
})

window.addEventListener("resize", () => {
    const canvasBounds = renderer.domElement.getBoundingClientRect();
    camera.aspect = canvasBounds.width / canvasBounds.height;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasBounds.width, canvasBounds.height);
});

function startGame() {    
    //reset score etc in case of restart
    score = 0;
    misses = 0;
    gameTotalTimer = 5;
    gameTimerRate = 1000;
    
    target.visible = true;
    target.position.set(0, 0, 0);
    target.rotation.set(0, 0, 0);

    updateUI();

    gameActive = true;
    popConfetti(false, 50);

    clearInterval(clock);
    clock = setInterval(gameClock, gameTimerRate+200);
}

function gameClock() {
    if (gameActive) {
        gameTotalTimer--;
        updateUI();
        randomizeTargetPosition();
    }
    if (gameTotalTimer <= 0) {
        endGame();
    }
}

function updateUI() {
    let total = score + misses; // Total number of attempts
    let acc = total > 0 ? (score / total) * 100 : 0; // Prevent division by zero
    acc = acc.toFixed(2);
    let antiAcc = 100 - acc;
    antiAcc = antiAcc.toFixed(2);

    // Calculate totalScore influenced by accuracy
    let totalScore = total > 0 ? score * (acc / 100) ** 2 : 0; // Accuracy affects total score exponentially
    totalScore = Math.round((totalScore.toFixed(2)) * 100);

    document.getElementById("timer").innerHTML = gameTotalTimer;
    document.getElementById("accuracy").innerHTML = `${misses} (${antiAcc} %)`;
    document.getElementById("score").innerHTML = `${score} (${acc} %)`;
    document.getElementById("totalScore").innerHTML = totalScore;
}

function gameEndScreen() {
    document.getElementById("gameInterface").classList.remove("hidden");
    document.getElementById("gameStart").classList.add("hidden");
    document.getElementById("gameEnd").classList.remove("hidden");

    let playerName = document.getElementById("playerName").value;
    if (playerName === '') {
        playerName = '???';
    }

    let total = score + misses; // Total number of attempts
    let acc = total > 0 ? (score / total) * 100 : 0; // Prevent division by zero
    acc = acc.toFixed(2);
    // Calculate totalScore influenced by accuracy
    let totalScore = total > 0 ? score * (acc / 100) ** 2 : 0; // Accuracy affects total score exponentially
    totalScore = Math.round((totalScore.toFixed(2)) * 100);

    document.getElementById("gameOverText").innerHTML = `
        <hr/>
        <h3>Your total score is ✨ ${totalScore}</h3>
        <p>You hit 👌 ${score} targets, you missed 👎 ${misses}.</p>
        <p>This gives you a  ${acc} % accuracy score multiplier.</p>
        <hr/>
    `;

    if (highscoreManager.qualifiesForHighscore(score, misses, acc, totalScore) && total > 0) {
        console.log('This score qualifies for the highscore list!');
        // addHighscore(playerName, score, misses, accuracyRating, totalScore)
        highscoreManager.addHighscore(playerName, score, misses, acc, totalScore);
        console.log(highscoreManager.getHighscoreList());
        let html = `        
        <h3>🤩 Congratulations ${playerName}!</h3>
        <p>This seems to be a highscore! You can check the rankings on the leaderboard!</p>
        `;
        document.getElementById("gameOverText").innerHTML += html;
    } else {
        console.log('This score does not qualify.');
    }

}

function endGame() {
    gameActive = false;

    clearInterval(clock);

    target.visible = false;

    // Stop handling clicks
    container.removeEventListener("click", playerShoot);

    popConfetti(true, 100);
    gameEndScreen();
}

function popConfetti(nrdm, amount) {
    // Confetti particle effect
    const positions = [];
    for (let i = 0; i < amount; i++) {
        positions.push({
            x: (Math.random() - 0.5) * 50,
            y: (Math.random() - 0.5) * 30,
            z: (Math.random() - 0.5) * 10
        });
    }
    positions.forEach((pos, index) => {
        if (nrdm) {
            // random colors
            const randomColor = Math.random() * 0xffffff; // Generate a random color
            createSparkle(pos, randomColor);
        } else {
            // modulo even / odd
            if (index % 2 === 0) {
                // even indices
                createSparkle(pos, 0x0000FF);
            } else {
                // odd indices
                createSparkle(pos, 0x00FFFF);
            }
        }
    });
}

function playerShoot(event) {
    if (!gameActive) return;

    // Get canvas bounds
    const canvasBounds = renderer.domElement.getBoundingClientRect();

    // Calculate mouse coordinates relative to the canvas
    const mouse = new THREE.Vector2(
        ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1,
        -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(target);
    const intersectsWorld = raycaster.intersectObject(world);
    if (intersects.length > 0) {
        score++;
        gameTimerRate -= 100;
        randomizeTargetPosition();
        createSparkle(intersects[0].point, 0xffff00);
        setTimeout(function () {
            createSparkle(intersects[0].point, 0xffff00);
        }, 100)
        clearInterval(clock);
        clock = setInterval(gameClock, gameTimerRate);
    } else {
        misses++;
        gameTimerRate += 150;
        if (intersectsWorld.length > 0) {
            createSparkle(intersectsWorld[0].point, 0xff0000);
        }
        setTimeout(function () {
            createSparkle(raycaster.ray.origin, 0xff1100);
        }, 300);
        clearInterval(clock);
        clock = setInterval(gameClock, gameTimerRate);
    }
    updateUI();
}

// Randomize Target Position
function randomizeTargetPosition() {
    createSparkle(target.position, 0x0000ff);
    target.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 10
    );
    setTimeout(function () {
        createSparkle(target.position, 0x00ffff);
    }, 200);

}

// Basic particle system
function createSparkle(position, color) {
    const particleGroup = new THREE.Group(); // Group to hold particles

    for (let i = 0; i < 20; i++) { // Create 20 small cubes
        const particleGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        //const particleMaterial = new THREE.MeshBasicMaterial({ color: color });
        const particleMaterial = new THREE.MeshBasicMaterial({ color: color, blending: THREE.AdditiveBlending });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);

        // Randomize particle initial position within a small radius
        particle.position.set(
            position.x + (Math.random() - 0.5) * 2,
            position.y + (Math.random() - 0.5) * 2,
            position.z + (Math.random() - 0.5) * 2
        );

        // Randomize velocity for scatter effect
        particle.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5
        );

        particleGroup.add(particle);
    }

    scene.add(particleGroup);

    // Animate the particles
    const duration = 0.5; // Lifetime in seconds
    const fadeOutSpeed = 1 / duration;
    let elapsedTime = 0;

    function animateParticles(deltaTime) {
        elapsedTime += deltaTime;

        if (elapsedTime >= duration) {
            scene.remove(particleGroup); // Remove particles after duration
            return;
        }

        particleGroup.children.forEach(particle => {
            // Update position
            particle.position.add(particle.userData.velocity);

            // Fade out
            particle.material.opacity = Math.max(1 - elapsedTime * fadeOutSpeed, 0);
            particle.material.transparent = true;
        });

        // Keep animating while particles exist
        requestAnimationFrame(() => animateParticles(deltaTime));
    }

    animateParticles(0.016); // Approximate frame delta for 60 FPS
}


// Animation loop
function animate(deltaTime) {
    if (gameActive) {
        target.rotateX(0.001 * (gameTimerRate / 1000));
        target.rotateY(0.001 * (gameTimerRate / 1000));
        target.rotateZ(0.001 * (gameTimerRate / 1000));

        // Update time for hover effect
        time += deltaTime;

        // Apply hover effect to camera
        camera.position.x = Math.sin((deltaTime / 1000) + 2); // Horizontal oscillation
        camera.position.y = Math.cos((deltaTime / 1000) + 2); // Vertical oscillation
        camera.lookAt(0, 0, 0); // Ensure the camera remains focused on the center of the scene
    }

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);


//startGame();