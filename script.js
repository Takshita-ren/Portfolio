/**
 * ATTACK ON TITAN - TAKSHITA JOSHI INTERACTIVE 3D PORTFOLIO
 * Integrated with User Uploaded Backgrounds & Visual References.
 * Features: Cinematic Colossal Titan Breach, 3 Real-World Portfolio Locations,
 * Scout Avatar (Takshita Joshi), ODM Flight Traversal, and Procedural Web Audio Engine.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. PROCEDURAL SOUND SYNTHESIZER (Web Audio API)
  // =========================================================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.windGain = null;
      this.windNode = null;
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.initWindAmbience();
      } catch (e) {
        console.warn('Web Audio not supported:', e);
      }
    }

    toggle() {
      if (!this.ctx) this.init();
      this.enabled = !this.enabled;
      if (this.ctx) {
        if (this.enabled) {
          if (this.ctx.state === 'suspended') this.ctx.resume();
          if (this.windGain) this.windGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        } else {
          if (this.windGain) this.windGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        }
      }
      return this.enabled;
    }

    initWindAmbience() {
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);
      whiteNoise.start();
    }

    setFlightWind(speed) {
      if (!this.ctx || !this.windGain || !this.enabled) return;
      const targetGain = Math.min(0.24, 0.04 + speed * 0.18);
      this.windGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }

    // Titan Lightning & Wall Breach Explosion
    playLightningBoom() {
      if (!this.ctx || !this.enabled) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 1.2);

      oscGain.gain.setValueAtTime(0.65, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 2.0);

      // Noise explosion crunch
      const bufferSize = this.ctx.sampleRate * 1.5;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const out = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        out[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.4));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(100, t + 1.5);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.75, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
    }

    // ODM Gas Burst (Pffsssshhhh)
    playGasBurst() {
      if (!this.ctx || !this.enabled) return;
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.6;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const out = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        out[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.2));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.Q.setValueAtTime(3.0, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
    }

    // Grapple Hook Fire & Anchor Clank
    playGrappleLaunch() {
      if (!this.ctx || !this.enabled) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200, t);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.15);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    }

    // Landing sound
    playLanding() {
      if (!this.ctx || !this.enabled) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);

      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    }
  }

  const sound = new SoundEngine();

  // =========================================================================
  // 2. PROCEDURAL TEXTURE GENERATORS (Cel-Shaded Materials)
  // =========================================================================
  function createTitanMuscleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#8a1818';
    ctx.fillRect(0, 0, 512, 512);

    for (let y = 0; y < 512; y += 4) {
      const alpha = 0.35 + Math.random() * 0.45;
      const isSinew = Math.random() > 0.85;
      ctx.fillStyle = isSinew ? `rgba(235, 215, 185, ${alpha})` : `rgba(180, 40, 40, ${alpha})`;
      ctx.fillRect(0, y, 512, 2.5);
    }

    for (let x = 0; x < 512; x += 48) {
      ctx.fillStyle = 'rgba(240, 220, 190, 0.22)';
      ctx.fillRect(x + Math.sin(x) * 4, 0, 12, 512);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  function createStoneWallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#6b665e';
    ctx.fillRect(0, 0, 512, 512);

    const rows = 16;
    const rowH = 512 / rows;
    for (let r = 0; r < rows; r++) {
      const cols = 8;
      const colW = 512 / cols;
      const offset = (r % 2) * (colW / 2);
      for (let c = -1; c < cols + 1; c++) {
        const x = c * colW + offset;
        const y = r * rowH;
        const shade = 100 + Math.floor(Math.random() * 45);
        ctx.fillStyle = `rgb(${shade}, ${shade - 4}, ${shade - 10})`;
        ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);
      }
    }

    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = 'rgba(40, 55, 35, 0.15)';
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, 10 + Math.random() * 25, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  function createWingsEmblemTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1c2820';
    ctx.beginPath();
    ctx.moveTo(128, 20);
    ctx.lineTo(210, 50);
    ctx.lineTo(195, 180);
    ctx.lineTo(128, 235);
    ctx.lineTo(61, 180);
    ctx.lineTo(46, 50);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Blue wing
    ctx.fillStyle = '#225588';
    ctx.beginPath();
    ctx.moveTo(125, 60);
    ctx.bezierCurveTo(90, 80, 60, 120, 80, 170);
    ctx.bezierCurveTo(100, 140, 115, 110, 125, 90);
    ctx.closePath();
    ctx.fill();

    // White wing
    ctx.fillStyle = '#f0e6d6';
    ctx.beginPath();
    ctx.moveTo(131, 60);
    ctx.bezierCurveTo(166, 80, 196, 120, 176, 170);
    ctx.bezierCurveTo(156, 140, 141, 110, 131, 90);
    ctx.closePath();
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  // =========================================================================
  // 3. APPLICATION STATE & 3 REAL-WORLD LOCATIONS
  // =========================================================================
  const app = {
    container: null,
    canvas: null,
    renderer: null,
    scene: null,
    camera: null,
    clock: null,

    // Visual Groups
    titanGroup: null,
    wallGroup: null,
    districtGroup: null,
    characterGroup: null,
    environmentBackdrops: [],
    breachBlocks: [],
    steamParticles: null,
    debrisParticles: null,
    grappleCables: [],

    // 3 REAL-WORLD LOCATIONS
    sectors: [
      {
        id: 0,
        name: '01 / INTRODUCTION',
        bgImage: 'assets/scout_overlook_district.jpg',
        cameraPos: [0.0, 2.0, 4.8],
        cameraLook: [-0.6, 1.8, -1.0],
        charPos: [-1.8, 0, 0.0],
        charRotY: 0.25,
        dialogue: "Welcome to my portfolio. Press [↑] or [W] to travel between locations using ODM gear."
      },
      {
        id: 1,
        name: '02 / SKILLS & EXPERIENCE',
        bgImage: 'assets/wall_panoramic.jpg',
        cameraPos: [-60.0, 28.0, -53.0],
        cameraLook: [-60.6, 27.8, -59.0],
        charPos: [-62.0, 26.0, -58.0],
        charRotY: 0.35,
        dialogue: "Skills & Experience: Python development, content creation reaching 100K+ monthly views, and video editing with millions of views."
      },
      {
        id: 2,
        name: '03 / CONTACT',
        bgImage: 'assets/shiganshina_aerial.jpg',
        cameraPos: [50.0, 50.0, -73.0],
        cameraLook: [49.4, 49.8, -79.0],
        charPos: [48.0, 48.0, -78.0],
        charRotY: -0.2,
        dialogue: "Let's connect! Email me directly at takshita.qc@gmail.com, or visit my GitHub & LinkedIn profiles."
      }
    ],

    currentSector: 0,
    isTransitioning: false,
    transitionProgress: 0,
    transitionDuration: 2.2,
    flightStartPos: null,
    flightTargetPos: null,
    flightStartCamPos: null,
    flightTargetCamPos: null,
    flightStartCamLook: null,
    flightTargetCamLook: null,

    // Cinematic Opening Sequence
    cinematic: {
      active: true,
      time: 0,
      totalDuration: 13.0,
      breached: false
    },

    // Camera free-roam mode
    freeCamera: false,
    mouse: { x: 0, y: 0, isDown: false, prevX: 0, prevY: 0 }
  };

  // =========================================================================
  // 4. THREE.JS INITIALIZATION
  // =========================================================================
  function initThree() {
    app.container = document.getElementById('canvas-container');
    app.canvas = document.getElementById('three-canvas');
    app.clock = new THREE.Clock();

    app.flightStartPos = new THREE.Vector3();
    app.flightTargetPos = new THREE.Vector3();
    app.flightStartCamPos = new THREE.Vector3();
    app.flightTargetCamPos = new THREE.Vector3();
    app.flightStartCamLook = new THREE.Vector3();
    app.flightTargetCamLook = new THREE.Vector3();

    // Convert sectors coordinates to THREE.Vector3
    app.sectors.forEach(s => {
      s.cameraPos = new THREE.Vector3(s.cameraPos[0], s.cameraPos[1], s.cameraPos[2]);
      s.cameraLook = new THREE.Vector3(s.cameraLook[0], s.cameraLook[1], s.cameraLook[2]);
      s.charPos = new THREE.Vector3(s.charPos[0], s.charPos[1], s.charPos[2]);
    });

    // Scene & Fog
    app.scene = new THREE.Scene();
    app.scene.background = new THREE.Color(0xb8c9d4);
    app.scene.fog = new THREE.FogExp2(0xb8c9d4, 0.005);

    // Camera
    app.camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.1, 1500);

    // Initial cinematic camera position (high angle looking at Colossal Titan)
    app.camera.position.set(0, 72, 85);
    app.camera.lookAt(0, 68, -10);

    // Renderer
    app.renderer = new THREE.WebGLRenderer({
      canvas: app.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    app.renderer.setSize(window.innerWidth, window.innerHeight);
    app.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    app.renderer.shadowMap.enabled = true;
    app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xfff6e5, 0x444d47, 0.75);
    app.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffecd2, 1.4);
    sunLight.position.set(120, 180, 100);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 400;
    sunLight.shadow.camera.left = -120;
    sunLight.shadow.camera.right = 120;
    sunLight.shadow.camera.top = 120;
    sunLight.shadow.camera.bottom = -120;
    app.scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xa62424, 0.5);
    rimLight.position.set(-80, 50, -80);
    app.scene.add(rimLight);

    // Build the World & Load User-Uploaded Background References
    buildSkyAndGround();
    buildColossalTitanWithBackdrop();
    buildWallMaria();
    buildLocationEnvironments();
    buildCharacterTakshita();
    initParticleSystems();
    setupEventListeners();

    // Show initial title card
    setTimeout(() => {
      document.getElementById('cinematic-title-card').classList.add('show');
    }, 600);
  }

  // =========================================================================
  // 5. SKY & GROUND GENERATION
  // =========================================================================
  function buildSkyAndGround() {
    const skyGeo = new THREE.SphereGeometry(700, 32, 15);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x93b7be,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    app.scene.add(sky);

    // Ground Plane with Cobblestone tint
    const groundGeo = new THREE.PlaneGeometry(800, 800, 20, 20);
    const groundMat = new THREE.MeshLambertMaterial({
      color: 0x524b42,
      roughness: 0.9
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    app.scene.add(ground);
  }

  // =========================================================================
  // 6. COLOSSAL TITAN (INTEGRATING USER'S COLOSSAL TITAN IMAGE)
  // =========================================================================
  function buildColossalTitanWithBackdrop() {
    app.titanGroup = new THREE.Group();

    // Cinematic Backdrop Billboard for the Opening Shot using user's colossal titan image
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/colossal_titan.jpg', (tex) => {
      tex.generateMipmaps = true;
      const titanBackdropGeo = new THREE.PlaneGeometry(110, 62);
      const titanBackdropMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.95,
        depthWrite: false
      });
      const titanBackdrop = new THREE.Mesh(titanBackdropGeo, titanBackdropMat);
      titanBackdrop.position.set(0, 68, -42);
      app.titanGroup.add(titanBackdrop);
    });

    const muscleTex = createTitanMuscleTexture();
    muscleTex.repeat.set(4, 4);

    const titanMat = new THREE.MeshStandardMaterial({
      map: muscleTex,
      color: 0xb52a2a,
      roughness: 0.65,
      metalness: 0.08
    });

    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xf2ebd9,
      roughness: 0.5
    });

    const eyeGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff3b30
    });

    // 3D Titan Skull & Torso (Foreground to blend with the backdrop)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 64, -20);

    const skullGeo = new THREE.BoxGeometry(7, 8, 8);
    const skull = new THREE.Mesh(skullGeo, titanMat);
    skull.position.y = 1;
    headGroup.add(skull);

    // Exposed Jaw & Teeth
    const jawGeo = new THREE.BoxGeometry(6.2, 4.2, 7.5);
    const jaw = new THREE.Mesh(jawGeo, titanMat);
    jaw.position.set(0, -2.8, 1);
    headGroup.add(jaw);

    const teethGeo = new THREE.BoxGeometry(5.2, 1.2, 1.2);
    const teeth = new THREE.Mesh(teethGeo, boneMat);
    teeth.position.set(0, -1.8, 4.4);
    headGroup.add(teeth);

    const eyeGeo = new THREE.SphereGeometry(0.7, 12, 12);
    const eyeL = new THREE.Mesh(eyeGeo, eyeGlowMat);
    eyeL.position.set(-1.8, 1.2, 4.0);
    const eyeR = eyeL.clone();
    eyeR.position.x = 1.8;
    headGroup.add(eyeL, eyeR);

    app.titanGroup.add(headGroup);

    // Torso
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 46, -24);
    const chest = new THREE.Mesh(new THREE.BoxGeometry(22, 14, 12), titanMat);
    chest.position.y = 3;
    torsoGroup.add(chest);

    // Left & Right Giant Hands resting on Wall Maria
    const handL = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 8), titanMat);
    handL.position.set(-17, 51.5, 0);
    const handR = handL.clone();
    handR.position.x = 17;
    app.titanGroup.add(handL, handR);

    app.titanGroup.add(torsoGroup);
    app.scene.add(app.titanGroup);
  }

  // =========================================================================
  // 7. WALL MARIA (50m High) & FRACTURABLE GATE BREACH
  // =========================================================================
  function buildWallMaria() {
    app.wallGroup = new THREE.Group();
    const wallTex = createStoneWallTexture();
    wallTex.repeat.set(6, 8);

    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTex,
      color: 0x827d73,
      roughness: 0.85
    });

    const gateWoodMat = new THREE.MeshStandardMaterial({
      color: 0x422917,
      roughness: 0.7
    });

    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x242424,
      metalness: 0.7,
      roughness: 0.3
    });

    const wallHeight = 50;
    const wallThickness = 14;

    // Solid Wall Sections
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(120, wallHeight, wallThickness), wallMat);
    leftWall.position.set(-75, wallHeight / 2, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;

    const rightWall = leftWall.clone();
    rightWall.position.x = 75;

    const arch = new THREE.Mesh(new THREE.BoxGeometry(32, 16, wallThickness), wallMat);
    arch.position.set(0, wallHeight - 8, 0);

    app.wallGroup.add(leftWall, rightWall, arch);

    // Wall Battlements & Cannons
    for (let x of [-45, -25, 25, 45]) {
      const cannonBase = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 3), ironMat);
      cannonBase.position.set(x, wallHeight + 0.9, 0);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 5, 8), ironMat);
      barrel.rotation.x = Math.PI / 2.2;
      barrel.position.set(x, wallHeight + 2.2, 1.8);
      app.wallGroup.add(cannonBase, barrel);
    }

    // Fracturable Gate Debris Blocks (70+ blocks for realistic breach)
    const gateGroup = new THREE.Group();
    const numCols = 7;
    const numRows = 10;
    const blockW = 28 / numCols;
    const blockH = 34 / numRows;

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const isWood = (r < 7 && c > 1 && c < 5);
        const blockGeo = new THREE.BoxGeometry(
          blockW * (0.88 + Math.random() * 0.2),
          blockH * (0.88 + Math.random() * 0.2),
          wallThickness * (0.85 + Math.random() * 0.25)
        );
        const block = new THREE.Mesh(blockGeo, isWood ? gateWoodMat : wallMat);
        block.position.set(-14 + c * blockW + blockW / 2, r * blockH + blockH / 2, 0);
        block.castShadow = true;
        block.receiveShadow = true;

        block.userData = {
          origPos: block.position.clone(),
          origRot: block.rotation.clone(),
          isFractured: false,
          vel: new THREE.Vector3(),
          rotVel: new THREE.Vector3()
        };

        app.breachBlocks.push(block);
        gateGroup.add(block);
      }
    }

    app.wallGroup.add(gateGroup);
    app.scene.add(app.wallGroup);
  }

  // =========================================================================
  // 8. 3 REAL-WORLD LOCATIONS (INTEGRATING USER'S UPLOADED IMAGES)
  // =========================================================================
  function buildLocationEnvironments() {
    app.districtGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    const wallTex = createStoneWallTexture();
    const wallStoneMat = new THREE.MeshStandardMaterial({
      map: wallTex,
      color: 0x7c776e,
      roughness: 0.85
    });

    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.8,
      roughness: 0.25
    });

    const woodPlankMat = new THREE.MeshStandardMaterial({
      color: 0x3d2716,
      roughness: 0.7
    });

    // Helper: Build Wall Platform with Railway Rails (Iconic AoT Wall top)
    function buildWallPlatformWithRails(x, y, z, width, length, rotY = 0) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.y = rotY;

      // Stone walking surface
      const platform = new THREE.Mesh(new THREE.BoxGeometry(width, 2.5, length), wallStoneMat);
      platform.position.y = -1.25;
      platform.receiveShadow = true;
      group.add(platform);

      // Wooden Railroad Sleepers (Ties)
      for (let pz = -length / 2 + 1.5; pz <= length / 2 - 1.5; pz += 1.8) {
        const sleeper = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 0.45), woodPlankMat);
        sleeper.position.set(0, 0.1, pz);
        group.add(sleeper);
      }

      // Twin Steel Railway Rails
      for (let railX of [-1.2, 1.2]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, length), ironMat);
        rail.position.set(railX, 0.28, 0);
        group.add(rail);
      }

      return group;
    }

    // -----------------------------------------------------------------------
    // LOCATION 01: INTRODUCTION
    // Reference image: assets/scout_overlook_district.jpg
    // High stone wall rampart overlooking Shiganshina district roofs!
    // -----------------------------------------------------------------------
    const loc1Group = new THREE.Group();
    loc1Group.position.set(0, 0, 0);

    // Wall platform with railway tracks
    const loc1Platform = buildWallPlatformWithRails(0, 0, 0, 18, 30, 0);
    loc1Group.add(loc1Platform);

    // High-Resolution 3D Backdrop using user's scout_overlook_district.jpg
    textureLoader.load('assets/scout_overlook_district.jpg', (tex) => {
      tex.generateMipmaps = true;
      const backdropGeo = new THREE.PlaneGeometry(42, 24);
      const backdropMat = new THREE.MeshBasicMaterial({
        map: tex,
        depthWrite: false
      });
      const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
      backdrop.position.set(0, 8.5, -20);
      loc1Group.add(backdrop);
    });

    app.districtGroup.add(loc1Group);

    // -----------------------------------------------------------------------
    // LOCATION 02: SKILLS & EXPERIENCE
    // Reference image: assets/wall_panoramic.jpg
    // Panoramic curved wall rampart with railway rails looking over the horizon!
    // -----------------------------------------------------------------------
    const loc2Group = new THREE.Group();
    loc2Group.position.set(-60, 26, -58);

    const loc2Platform = buildWallPlatformWithRails(0, 0, 0, 20, 36, Math.PI / 6);
    loc2Group.add(loc2Platform);

    // High-Resolution 3D Backdrop using user's wall_panoramic.jpg
    textureLoader.load('assets/wall_panoramic.jpg', (tex) => {
      tex.generateMipmaps = true;
      const backdropGeo = new THREE.PlaneGeometry(54, 30);
      const backdropMat = new THREE.MeshBasicMaterial({
        map: tex,
        depthWrite: false
      });
      const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
      backdrop.position.set(-4, 10, -22);
      backdrop.rotation.y = Math.PI / 12;
      loc2Group.add(backdrop);
    });

    app.districtGroup.add(loc2Group);

    // -----------------------------------------------------------------------
    // LOCATION 03: CONTACT
    // Reference image: assets/shiganshina_aerial.jpg & concentric_walls.jpg
    // Breathtaking aerial vantage point high above Paradis Island!
    // -----------------------------------------------------------------------
    const loc3Group = new THREE.Group();
    loc3Group.position.set(50, 48, -78);

    const loc3Platform = buildWallPlatformWithRails(0, 0, 0, 22, 28, -Math.PI / 8);
    loc3Group.add(loc3Platform);

    // High-Resolution 3D Backdrop using user's shiganshina_aerial.jpg
    textureLoader.load('assets/shiganshina_aerial.jpg', (tex) => {
      tex.generateMipmaps = true;
      const backdropGeo = new THREE.PlaneGeometry(36, 44);
      const backdropMat = new THREE.MeshBasicMaterial({
        map: tex,
        depthWrite: false
      });
      const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
      backdrop.position.set(0, 12, -22);
      loc3Group.add(backdrop);
    });

    // Secondary wide concentric walls backdrop in the distance
    textureLoader.load('assets/concentric_walls.jpg', (tex) => {
      tex.generateMipmaps = true;
      const skyGeo = new THREE.PlaneGeometry(80, 52);
      const skyMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      });
      const skyBackdrop = new THREE.Mesh(skyGeo, skyMat);
      skyBackdrop.position.set(15, 20, -50);
      loc3Group.add(skyBackdrop);
    });

    app.districtGroup.add(loc3Group);
    app.scene.add(app.districtGroup);
  }

  // =========================================================================
  // 9. TAKSHITA JOSHI 3D CHARACTER AVATAR (Visible at Every Location)
  // =========================================================================
  function buildCharacterTakshita() {
    app.characterGroup = new THREE.Group();
    // Placed in Location 1 initially
    const s0 = app.sectors[0];
    app.characterGroup.position.copy(s0.charPos);
    app.characterGroup.rotation.y = s0.charRotY;

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfdecdb,
      roughness: 0.6
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1f1610,
      roughness: 0.8
    });

    const jacketMat = new THREE.MeshStandardMaterial({
      color: 0x9e6c43, // Scout camel/tan cropped jacket
      roughness: 0.7
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.6
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0xededed,
      roughness: 0.7
    });

    const leatherHarnessMat = new THREE.MeshStandardMaterial({
      color: 0x331c10,
      roughness: 0.5
    });

    const bootsMat = new THREE.MeshStandardMaterial({
      color: 0x2e190e,
      roughness: 0.4
    });

    const capeMat = new THREE.MeshStandardMaterial({
      color: 0x1d472c, // Emerald green Survey Corps cape
      roughness: 0.65,
      side: THREE.DoubleSide
    });

    const odmSteelMat = new THREE.MeshStandardMaterial({
      color: 0xa8b2ba,
      metalness: 0.85,
      roughness: 0.25
    });

    const odmBrassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.7,
      roughness: 0.3
    });

    // 1. Head & Voluminous Curly Hair
    const headGroup = new THREE.Group();
    headGroup.position.y = 2.45;

    const face = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), skinMat);
    face.scale.set(0.9, 1.1, 0.95);
    headGroup.add(face);

    // Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a2e22 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), eyeMat);
    eyeL.position.set(-0.13, 0.05, 0.34);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.13;
    headGroup.add(eyeL, eyeR);

    // Voluminous Curly Hair ringlets
    const hairGroup = new THREE.Group();
    const curlGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const curlPositions = [
      [0, 0.38, -0.05], [0.22, 0.32, 0.05], [-0.22, 0.32, 0.05],
      [0.15, 0.36, -0.18], [-0.15, 0.36, -0.18],
      [-0.35, 0.05, 0.12], [-0.38, -0.15, 0.08], [-0.34, -0.32, -0.02],
      [0.35, 0.05, 0.12], [0.38, -0.15, 0.08], [0.34, -0.32, -0.02],
      [0, 0.15, -0.36], [0.24, 0.0, -0.34], [-0.24, 0.0, -0.34],
      [0, -0.18, -0.38], [0.18, -0.28, -0.32], [-0.18, -0.28, -0.32]
    ];

    curlPositions.forEach(pos => {
      const curl = new THREE.Mesh(curlGeo, hairMat);
      curl.position.set(pos[0], pos[1], pos[2]);
      curl.scale.set(1.15, 1.15, 1.15);
      hairGroup.add(curl);
    });
    headGroup.add(hairGroup);
    app.characterGroup.add(headGroup);

    // 2. Torso, Cropped Jacket & Combat Harness
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 1.7;

    const shirt = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.9, 12), shirtMat);
    torsoGroup.add(shirt);

    const jacket = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 0.55, 12), jacketMat);
    jacket.position.y = 0.2;
    torsoGroup.add(jacket);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 0.18, 12), jacketMat);
    collar.position.y = 0.52;
    torsoGroup.add(collar);

    // Harness Straps crossing chest (X-strap)
    const strap1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.75, 0.72), leatherHarnessMat);
    strap1.rotation.y = Math.PI / 4;
    strap1.position.y = 0.1;
    const strap2 = strap1.clone();
    strap2.rotation.y = -Math.PI / 4;
    torsoGroup.add(strap1, strap2);

    const waistBelt = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.12, 12), leatherHarnessMat);
    waistBelt.position.y = -0.35;
    torsoGroup.add(waistBelt);

    app.characterGroup.add(torsoGroup);

    // 3. Legs & Riding Combat Boots
    const legsGroup = new THREE.Group();
    legsGroup.position.y = 0.85;

    const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.65, 8), pantsMat);
    thighL.position.set(-0.2, 0.12, 0);
    const thighR = thighL.clone();
    thighR.position.x = 0.2;

    const thighStrapL = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 8), leatherHarnessMat);
    thighStrapL.position.set(-0.2, 0.18, 0);
    const thighStrapR = thighStrapL.clone();
    thighStrapR.position.x = 0.2;

    const bootL = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.8, 8), bootsMat);
    bootL.position.set(-0.2, -0.45, 0);
    const bootR = bootL.clone();
    bootR.position.x = 0.2;

    const footL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.45), bootsMat);
    footL.position.set(-0.2, -0.8, 0.1);
    const footR = footL.clone();
    footR.position.x = 0.2;

    legsGroup.add(thighL, thighR, thighStrapL, thighStrapR, bootL, bootR, footL, footR);
    app.characterGroup.add(legsGroup);

    // 4. Arms & ODM Control Grips
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.7, 8), jacketMat);
    armL.position.set(-0.48, 1.7, 0);
    armL.rotation.z = 0.15;
    const armR = armL.clone();
    armR.position.x = 0.48;
    armR.rotation.z = -0.15;

    const gripL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.15), odmSteelMat);
    gripL.position.set(-0.55, 1.3, 0.15);
    const gripR = gripL.clone();
    gripR.position.x = 0.55;

    const bladeGeo = new THREE.BoxGeometry(0.04, 0.08, 1.1);
    const bladeL = new THREE.Mesh(bladeGeo, odmSteelMat);
    bladeL.position.set(-0.55, 1.3, 0.65);
    const bladeR = bladeL.clone();
    bladeR.position.x = 0.55;

    app.characterGroup.add(armL, armR, gripL, gripR, bladeL, bladeR);

    // 5. Omni-Directional Mobility (ODM) Gear
    const odmGroup = new THREE.Group();
    odmGroup.position.set(0, 1.35, 0);

    const gasTankL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.95, 10), odmSteelMat);
    gasTankL.rotation.x = Math.PI / 2;
    gasTankL.position.set(-0.48, -0.1, 0);

    const sheathL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.95), odmSteelMat);
    sheathL.position.set(-0.48, -0.28, 0);

    const gasTankR = gasTankL.clone();
    gasTankR.position.x = 0.48;
    const sheathR = sheathL.clone();
    sheathR.position.x = 0.48;

    const turbine = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.35, 12), odmBrassMat);
    turbine.rotation.x = Math.PI / 2;
    turbine.position.set(0, -0.05, -0.38);

    const wireSpoolL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.16, 8), odmBrassMat);
    wireSpoolL.position.set(-0.25, -0.05, -0.36);
    const wireSpoolR = wireSpoolL.clone();
    wireSpoolR.position.x = 0.25;

    odmGroup.add(gasTankL, sheathL, gasTankR, sheathR, turbine, wireSpoolL, wireSpoolR);
    app.characterGroup.add(odmGroup);

    // 6. Green Scout Cape with Wings of Freedom
    const capeGeo = new THREE.PlaneGeometry(0.85, 1.4, 6, 8);
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.position.set(0, 1.7, -0.32);
    cape.rotation.x = 0.15;
    cape.name = 'scoutCape';
    app.characterGroup.add(cape);

    app.scene.add(app.characterGroup);
  }

  // =========================================================================
  // 10. PARTICLE SYSTEMS (Billowing Steam & Breach Debris)
  // =========================================================================
  function initParticleSystems() {
    const steamCount = 180;
    const steamGeo = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamCount * 3);
    const steamVelocities = [];

    for (let i = 0; i < steamCount; i++) {
      steamPositions[i * 3] = (Math.random() - 0.5) * 16;
      steamPositions[i * 3 + 1] = 54 + Math.random() * 26;
      steamPositions[i * 3 + 2] = -24 + (Math.random() - 0.5) * 12;

      steamVelocities.push({
        x: (Math.random() - 0.5) * 0.12,
        y: 0.25 + Math.random() * 0.45,
        z: (Math.random() - 0.5) * 0.12
      });
    }

    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,0.7)');
    grad.addColorStop(0.5, 'rgba(230,230,230,0.3)');
    grad.addColorStop(1, 'rgba(200,200,200,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const pTex = new THREE.CanvasTexture(canvas);

    const steamMat = new THREE.PointsMaterial({
      size: 14,
      map: pTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });

    app.steamParticles = new THREE.Points(steamGeo, steamMat);
    app.steamParticles.userData = { velocities: steamVelocities };
    app.scene.add(app.steamParticles);

    // Wall Breach Dust Particles
    const debrisCount = 180;
    const debrisGeo = new THREE.BufferGeometry();
    const debrisPos = new Float32Array(debrisCount * 3);
    const debrisVels = [];

    for (let i = 0; i < debrisCount; i++) {
      debrisPos[i * 3] = 0;
      debrisPos[i * 3 + 1] = 16;
      debrisPos[i * 3 + 2] = 0;
      debrisVels.push({
        x: (Math.random() - 0.5) * 1.4,
        y: Math.random() * 1.8,
        z: -Math.random() * 2.2
      });
    }

    debrisGeo.setAttribute('position', new THREE.BufferAttribute(debrisPos, 3));
    const debrisMat = new THREE.PointsMaterial({
      size: 12,
      map: pTex,
      color: 0x9c9384,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });

    app.debrisParticles = new THREE.Points(debrisGeo, debrisMat);
    app.debrisParticles.userData = { velocities: debrisVels, active: false };
    app.scene.add(app.debrisParticles);
  }

  // =========================================================================
  // 11. TITAN BREACH SEQUENCE
  // =========================================================================
  function triggerWallBreach() {
    if (app.cinematic.breached) return;
    app.cinematic.breached = true;

    // Flash & Shake
    const flash = document.getElementById('flash-overlay');
    flash.style.opacity = '1';
    setTimeout(() => { flash.style.opacity = '0'; }, 180);

    const shake = document.getElementById('shake-overlay');
    shake.style.opacity = '1';
    setTimeout(() => { shake.style.opacity = '0'; }, 1200);

    sound.playLightningBoom();

    // Fracturing Wall Blocks
    app.breachBlocks.forEach(block => {
      block.userData.isFractured = true;
      block.userData.vel.set(
        (Math.random() - 0.5) * 0.9,
        0.3 + Math.random() * 0.9,
        -0.8 - Math.random() * 1.4
      );
      block.userData.rotVel.set(
        (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 0.25
      );
    });

    app.debrisParticles.material.opacity = 0.85;
    app.debrisParticles.userData.active = true;
  }

  // =========================================================================
  // 12. ODM GEAR TRAVEL TRANSITIONS (BETWEEN 3 LOCATIONS)
  // =========================================================================
  function goToSector(sectorIndex) {
    if (app.isTransitioning) return;
    if (sectorIndex < 0 || sectorIndex >= app.sectors.length) return;
    if (sectorIndex === app.currentSector && !app.cinematic.active) return;

    sound.init();
    sound.playGasBurst();
    sound.playGrappleLaunch();

    const fromSector = app.sectors[app.currentSector];
    const toSector = app.sectors[sectorIndex];

    app.isTransitioning = true;
    app.transitionProgress = 0;
    app.currentSector = sectorIndex;

    // Start & Target positions
    app.flightStartPos.copy(app.characterGroup.position);
    app.flightTargetPos.copy(toSector.charPos);

    app.flightStartCamPos.copy(app.camera.position);
    app.flightTargetCamPos.copy(toSector.cameraPos);

    app.flightStartCamLook.copy(fromSector.cameraLook);
    app.flightTargetCamLook.copy(toSector.cameraLook);

    document.body.classList.add('speed-lines-active');

    // Update UI HUD
    document.querySelectorAll('.nav-sector-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.sector) === sectorIndex);
    });

    document.querySelectorAll('.dossier-card').forEach(card => {
      card.classList.remove('active');
    });

    document.getElementById('loc-name-display').textContent = toSector.name;

    // Create 3D grapple cables
    createGrappleCables(app.flightStartPos, app.flightTargetPos);

    // Dialogue update
    const dialogueEl = document.getElementById('dialogue-content');
    dialogueEl.textContent = toSector.dialogue;
    document.getElementById('character-dialogue').classList.add('show');
  }

  function createGrappleCables(start, end) {
    app.grappleCables.forEach(c => app.scene.remove(c));
    app.grappleCables = [];

    const cableMat = new THREE.LineBasicMaterial({
      color: 0xe0e6ed,
      linewidth: 2
    });

    const cableGeoL = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(start.x - 0.45, start.y + 1.2, start.z),
      new THREE.Vector3(end.x - 2, end.y + 5, end.z)
    ]);
    const cableL = new THREE.Line(cableGeoL, cableMat);

    const cableGeoR = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(start.x + 0.45, start.y + 1.2, start.z),
      new THREE.Vector3(end.x + 2, end.y + 5, end.z)
    ]);
    const cableR = new THREE.Line(cableGeoR, cableMat);

    app.grappleCables.push(cableL, cableR);
    app.scene.add(cableL, cableR);
  }

  // =========================================================================
  // 13. SKIP & REPLAY CINEMATIC
  // =========================================================================
  function completeCinematicToLocation1() {
    app.cinematic.active = false;
    document.body.classList.remove('cinematic-active');
    document.getElementById('cinematic-title-card').classList.remove('show');
    document.getElementById('skip-intro-btn').style.display = 'none';
    document.getElementById('hud-root').classList.add('visible');
    document.getElementById('character-dialogue').classList.add('show');

    // Place avatar and camera at Location 1 (Introduction)
    const s0 = app.sectors[0];
    app.characterGroup.position.copy(s0.charPos);
    app.characterGroup.rotation.y = s0.charRotY;
    app.camera.position.copy(s0.cameraPos);
    app.camera.lookAt(s0.cameraLook);

    document.getElementById('dossier-sector-0').classList.add('active');
  }

  function replayCinematic() {
    app.cinematic.active = true;
    app.cinematic.time = 0;
    app.cinematic.breached = false;

    // Reset fractured blocks
    app.breachBlocks.forEach(block => {
      block.userData.isFractured = false;
      block.position.copy(block.userData.origPos);
      block.rotation.copy(block.userData.origRot);
    });

    document.body.classList.add('cinematic-active');
    document.getElementById('hud-root').classList.remove('visible');
    document.getElementById('character-dialogue').classList.remove('show');
    document.getElementById('skip-intro-btn').style.display = 'flex';
    document.querySelectorAll('.dossier-card').forEach(c => c.classList.remove('active'));

    document.getElementById('cinematic-title-card').classList.add('show');

    app.camera.position.set(0, 72, 85);
    app.camera.lookAt(0, 68, -10);
  }

  // =========================================================================
  // 14. EVENT LISTENERS (Keyboards, Buttons, Free-Orbit)
  // =========================================================================
  function setupEventListeners() {
    window.addEventListener('resize', () => {
      app.camera.aspect = window.innerWidth / window.innerHeight;
      app.camera.updateProjectionMatrix();
      app.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Keyboard controls: [↑ / W] = Next Location, [↓ / S] = Prev Location
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (app.cinematic.active) {
          completeCinematicToLocation1();
        } else {
          const next = (app.currentSector + 1) % app.sectors.length;
          goToSector(next);
        }
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (!app.cinematic.active) {
          const prev = (app.currentSector - 1 + app.sectors.length) % app.sectors.length;
          goToSector(prev);
        }
      } else if (e.key === '1') {
        goToSector(0);
      } else if (e.key === '2') {
        goToSector(1);
      } else if (e.key === '3') {
        goToSector(2);
      } else if (e.key === 'r' || e.key === 'R') {
        replayCinematic();
      } else if (e.key === 'c' || e.key === 'C') {
        app.freeCamera = !app.freeCamera;
      } else if (e.key === 'm' || e.key === 'M') {
        sound.toggle();
      }
    });

    // Action button (Center bottom)
    document.getElementById('odm-action-btn').addEventListener('click', () => {
      if (app.cinematic.active) {
        completeCinematicToLocation1();
      } else {
        const next = (app.currentSector + 1) % app.sectors.length;
        goToSector(next);
      }
    });

    // Navigation buttons
    document.querySelectorAll('.nav-sector-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sector = parseInt(btn.dataset.sector);
        if (app.cinematic.active) completeCinematicToLocation1();
        goToSector(sector);
      });
    });

    // Skip button
    document.getElementById('skip-intro-btn').addEventListener('click', () => {
      completeCinematicToLocation1();
    });

    // Audio toggle
    document.getElementById('audio-toggle-btn').addEventListener('click', () => {
      const active = sound.toggle();
      const btn = document.getElementById('audio-toggle-btn');
      btn.style.opacity = active ? '1' : '0.5';
    });

    // Free camera toggle
    document.getElementById('camera-mode-btn').addEventListener('click', () => {
      app.freeCamera = !app.freeCamera;
      const btn = document.getElementById('camera-mode-btn');
      btn.style.borderColor = app.freeCamera ? '#d4af37' : 'rgba(212,175,55,0.45)';
    });

    // Replay button
    document.getElementById('replay-btn').addEventListener('click', () => {
      replayCinematic();
    });

    // Mouse drag for Free-Look Orbit
    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('#hud-root') || e.target.closest('.dossier-card')) return;
      app.mouse.isDown = true;
      app.mouse.prevX = e.clientX;
      app.mouse.prevY = e.clientY;
    });

    window.addEventListener('mouseup', () => { app.mouse.isDown = false; });

    window.addEventListener('mousemove', (e) => {
      if (!app.mouse.isDown || !app.freeCamera) return;
      const deltaX = e.clientX - app.mouse.prevX;
      const deltaY = e.clientY - app.mouse.prevY;
      app.mouse.prevX = e.clientX;
      app.mouse.prevY = e.clientY;

      app.camera.rotation.y -= deltaX * 0.005;
      app.camera.rotation.x -= deltaY * 0.005;
    });
  }

  // =========================================================================
  // 15. MAIN ANIMATION & RENDER LOOP
  // =========================================================================
  function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(app.clock.getDelta(), 0.1);
    const time = app.clock.getElapsedTime();

    // 1. Steam Particles
    if (app.steamParticles) {
      const pos = app.steamParticles.geometry.attributes.position.array;
      const vels = app.steamParticles.userData.velocities;
      for (let i = 0; i < vels.length; i++) {
        pos[i * 3] += vels[i].x;
        pos[i * 3 + 1] += vels[i].y;
        pos[i * 3 + 2] += vels[i].z;

        if (pos[i * 3 + 1] > 95) {
          pos[i * 3] = (Math.random() - 0.5) * 16;
          pos[i * 3 + 1] = 54 + Math.random() * 8;
          pos[i * 3 + 2] = -24 + (Math.random() - 0.5) * 12;
        }
      }
      app.steamParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 2. Scout Green Cape Flapping Physics
    const cape = app.characterGroup.getObjectByName('scoutCape');
    if (cape) {
      const flapIntensity = app.isTransitioning ? 0.35 : 0.08;
      const flapSpeed = app.isTransitioning ? 24 : 6;
      cape.rotation.x = 0.18 + Math.sin(time * flapSpeed) * flapIntensity;
    }

    // 3. Opening Cinematic Choreography
    if (app.cinematic.active) {
      app.cinematic.time += delta;
      const t = app.cinematic.time;

      if (t < 4.0) {
        // Track 1: Travel down the Colossal Titan's enormous body
        const p = t / 4.0;
        app.camera.position.x = Math.sin(p * 0.4) * 8;
        app.camera.position.y = THREE.MathUtils.lerp(72, 52, p);
        app.camera.position.z = THREE.MathUtils.lerp(85, 38, p);
        app.camera.lookAt(0, THREE.MathUtils.lerp(66, 32, p), -15);
      } else if (t < 5.2) {
        // Track 2: Wall Maria gate focus & strike trigger
        const p = (t - 4.0) / 1.2;
        app.camera.position.set(0, THREE.MathUtils.lerp(52, 28, p), THREE.MathUtils.lerp(38, 26, p));
        app.camera.lookAt(0, 16, 0);

        if (t > 4.6 && !app.cinematic.breached) {
          triggerWallBreach();
        }
      } else if (t < 9.0) {
        // Track 3: Fly through the breach hole into Location 1
        const p = (t - 5.2) / 3.8;
        app.camera.position.x = Math.sin(p * Math.PI) * 4;
        app.camera.position.y = THREE.MathUtils.lerp(28, 4.5, p);
        app.camera.position.z = THREE.MathUtils.lerp(26, 8, p);
        app.camera.lookAt(-0.6, THREE.MathUtils.lerp(16, 1.8, p), THREE.MathUtils.lerp(0, -1, p));
      } else if (t < 13.0) {
        // Track 4: Smoothly settle at Location 1 beside Takshita
        const p = (t - 9.0) / 4.0;
        const targetCam = app.sectors[0].cameraPos;
        const targetLook = app.sectors[0].cameraLook;
        app.camera.position.lerp(targetCam, 0.06);
        app.camera.lookAt(targetLook);

        if (p > 0.85) {
          completeCinematicToLocation1();
        }
      }
    }

    // 4. Update Fractured Wall Debris Physics
    if (app.cinematic.breached) {
      app.breachBlocks.forEach(block => {
        if (!block.userData.isFractured) return;
        const d = block.userData;
        d.vel.y -= 0.015;
        block.position.add(d.vel);

        if (block.position.y < block.geometry.parameters.height / 2) {
          block.position.y = block.geometry.parameters.height / 2;
          d.vel.set(0, 0, 0);
        }

        block.rotation.x += d.rotVel.x;
        block.rotation.y += d.rotVel.y;
        block.rotation.z += d.rotVel.z;
      });

      if (app.debrisParticles.userData.active) {
        const pos = app.debrisParticles.geometry.attributes.position.array;
        const vels = app.debrisParticles.userData.velocities;
        for (let i = 0; i < vels.length; i++) {
          pos[i * 3] += vels[i].x;
          pos[i * 3 + 1] += vels[i].y;
          pos[i * 3 + 2] += vels[i].z;
          vels[i].y -= 0.008;
        }
        app.debrisParticles.geometry.attributes.position.needsUpdate = true;
        app.debrisParticles.material.opacity = Math.max(0, app.debrisParticles.material.opacity - 0.0015);
      }
    }

    // 5. ODM Gear Flight Transition between Locations
    if (app.isTransitioning) {
      app.transitionProgress += delta / app.transitionDuration;
      const p = Math.min(1.0, app.transitionProgress);

      const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      // Arc curve: High vault with pendulum swing physics
      const arcHeight = 16;
      const currentPos = new THREE.Vector3().lerpVectors(app.flightStartPos, app.flightTargetPos, ease);
      currentPos.y += Math.sin(p * Math.PI) * arcHeight;
      app.characterGroup.position.copy(currentPos);

      // Avatar leans into momentum
      const dir = new THREE.Vector3().subVectors(app.flightTargetPos, app.flightStartPos).normalize();
      app.characterGroup.rotation.y = Math.atan2(dir.x, dir.z);
      app.characterGroup.rotation.x = Math.sin(p * Math.PI) * 0.42;

      // Dynamic Camera Tracking behind Takshita
      const currentCamPos = new THREE.Vector3().lerpVectors(app.flightStartCamPos, app.flightTargetCamPos, ease);
      currentCamPos.y += Math.sin(p * Math.PI) * (arcHeight * 0.7);
      app.camera.position.copy(currentCamPos);

      const currentLook = new THREE.Vector3().lerpVectors(app.flightStartCamLook, app.flightTargetCamLook, ease);
      app.camera.lookAt(currentLook);

      sound.setFlightWind(Math.sin(p * Math.PI));

      // Arrival at destination
      if (p >= 1.0) {
        app.isTransitioning = false;
        document.body.classList.remove('speed-lines-active');
        sound.playLanding();
        sound.setFlightWind(0);

        // Reset character orientation to rest pose at this location
        app.characterGroup.rotation.x = 0;
        app.characterGroup.rotation.y = app.sectors[app.currentSector].charRotY;

        app.grappleCables.forEach(c => app.scene.remove(c));
        app.grappleCables = [];

        // Display the corresponding location panel beside the avatar
        const cardId = `dossier-sector-${app.currentSector}`;
        const card = document.getElementById(cardId);
        if (card) card.classList.add('active');
      }
    }

    // Render Scene
    app.renderer.render(app.scene, app.camera);
  }

  // =========================================================================
  // 16. BOOTSTRAP APPLICATION
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
      initThree();
      animate();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
      script.onload = () => {
        initThree();
        animate();
      };
      document.head.appendChild(script);
    }
  });

})();
