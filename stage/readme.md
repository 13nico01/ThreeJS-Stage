# 3D Stage and Physics Simulation

This project showcases a 3D scene built using **Three.js** and **Cannon-es**. The scene includes a realistic stage model with dynamic lighting, interactive elements, and physics-based interactions.

## Features

- **Stage Model**: A detailed 3D stage loaded from a GLTF model.
- **Dynamic Lighting**: Includes ambient light, spotlights, and colorful disco lights that animate dynamically.
- **Physics Simulation**: Uses Cannon-es for realistic physics interactions.
- **Interactive Elements**: Certain objects can be clicked to enable dynamic physics behavior.

## Technologies Used

- **Three.js**: For rendering the 3D scene and managing models, lights, and materials.
- **Cannon-es**: For simulating real-world physics, including gravity and collisions.
- **Ionic Framework**: Provides the base structure for the Angular component.
- **GLTFLoader**: For loading 3D models in GLTF format.
- **OrbitControls**: Enables camera controls like rotation and zoom.

## How It Works

1. The 3D stage model (`stage01.glb`) is loaded and rendered using Three.js.
2. Physics simulation is added to selected objects using Cannon-es.
3. Lights are animated to simulate a dynamic environment, including spinning disco lights.
4. Users can interact with specific elements (like the truss) by clicking on them to enable physics.

## Running the Project

1. Clone this repository:
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   ```
2. Navigate to the project directory:
   ```bash
   cd <your-repo-name>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   ionic serve
   ```

## What You Will See

- A large stage with realistic textures and lighting.
- A rotating set of disco lights above the stage.
- Physics-enabled objects that can fall and interact with the ground.
- Dynamic lighting effects that change over time.

## Assets Used

- **Stage Model**: `stage01.glb` (GLTF format)
- **Textures**: Includes wood, ground, and normal maps.
- **Skybox**: Cube map for environmental reflections.

## Dependencies

- `three`
- `cannon-es`
- `@ionic/angular`
- `three/examples/jsm/loaders/GLTFLoader`
- `three/examples/jsm/controls/OrbitControls`

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.

