// Visualizing the ray with an arrow helper
const rayHelper = new THREE.ArrowHelper(
    new THREE.Vector3(), // Direction
    new THREE.Vector3(), // Origin
    10,                  // Length
    0xff0000             // Color
);
scene.add(rayHelper);

/* 
    mouse event
*/

// Calculate mouse coordinates relative to the canvas
const mouse = new THREE.Vector2(
    ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1,
    -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1
);
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, camera);

// Update the arrow helper
rayHelper.setDirection(raycaster.ray.direction);
rayHelper.position.copy(raycaster.ray.origin);
