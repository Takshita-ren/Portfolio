/**
 * ATTACK ON TITAN - SHINGEKI NO TAKSHITA PORTFOLIO ENGINE
 * 3D Engine, Procedural Colossal Titan, Shiganshina District,
 * Character Model (Takshita Joshi), ODM Flight Physics, and Audio Synthesizer.
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
      // White noise buffer for wind
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
      const targetGain = Math.min(0.25, 0.04 + speed * 0.18);
      this.windGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }

    // Titan Lightning / Blast Sound
    playLightningBoom() {
      if (!this.ctx || !this.enabled) return;
      const t = this.ctx.currentTime;

      // Sub-bass impact
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 1.2);

      oscGain.gain.setValueAtTime(0.7, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 2.0);

      // Noise explosion crunch
      const bufferSize = this.ctx.sampleRate * 1.5;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const out = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) out[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.4));

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(100, t + 1.5);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
    }

    // ODM Gas Blast (Pffffffffsh!)
    playGasBurst() {
      if (!this.ctx || !this.enabled) return;
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.6;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const out = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) out[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.2));

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.Q.setValueAtTime(3.0, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
    }

    // Grapple Cable Fire & Clank
    playGrappleLaunch() {
      if (!this.ctx || !this.enabled) return;
      const t = this.ctx.currentTime;

      // Metallic hook ping
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200, t);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.15);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    }

    // Heroic landing clank
    playLanding() {
      if (!this.ctx || !this.enabled) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);

      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    }
  }

  const sound = new SoundEngine();

  // =========================================================================
  // 2. PROCEDURAL TEXTURE GENERATORS (Anime Cel-Shading Aesthetics)
  // =========================================================================
  function createTitanMuscleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep crimson base
    ctx.fillStyle = '#8a1818';
    ctx.fillRect(0, 0, 512, 512);

    // Striated sinews and muscle fibers
    for (let y = 0; y < 512; y += 4) {
      const alpha = 0.35 + Math.random() * 0.45;
      const isSinew = Math.random() > 0.85;
      ctx.fillStyle = isSinew ? `rgba(235, 215, 185, ${alpha})` : `rgba(180, 40, 40, ${alpha})`;
      ctx.fillRect(0, y, 512, 2.5);
    }

    // Longitudinal fascia bands
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

    // Stone brick patterns
    const rows = 16;
    const rowH = 512 / rows;
    for (let r = 0; r < rows; r++) {
      const cols = 8;
      const colW = 512 / cols;
      const offset = (r % 2) * (colW / 2);
      for (let c = -1; c < cols + 1; c++) {
        const x = c * colW + offset;
        const y = r * rowH;
        // Brick variations
        const shade = 100 + Math.floor(Math.random() * 45);
        ctx.fillStyle = `rgb(${shade}, ${shade - 4}, ${shade - 10})`;
        ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);
      }
    }

    // Weathering & moss accents
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

  function createRoofTileTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#9c3d28'; // Red terracotta
    ctx.fillRect(0, 0, 256, 256);

    for (let y = 0; y < 256; y += 16) {
      ctx.fillStyle = 'rgba(50, 15, 10, 0.45)';
      ctx.fillRect(0, y, 256, 3);
      for (let x = 0; x < 256; x += 16) {
        ctx.fillStyle = (x + y) % 32 === 0 ? 'rgba(255, 120, 80, 0.2)' : 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(x, y + 3, 15, 13);
      }
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

    // Shield background
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
  // 3. MAIN GAME & 3D APPLICATION STATE
  // =========================================================================
  const app = {
    container: null,
    canvas: null,
    renderer: null,
    scene: null,
    camera: null,
    clock: null,

    // Visual elements
    titanGroup: null,
    wallGroup: null,
    districtGroup: null,
    characterGroup: null,
    breachBlocks: [],
    steamParticles: null,
    debrisParticles: null,
    grappleCables: [],

    // Sectors / Locations
    sectors: [
      {
        name: 'SHIGANSHINA PLAZA',
        cameraPos: [0, 4.2, 11],
        cameraLook: [0, 2.5, 0],
        charPos: [0, 0, 0],
        charRotY: 0,
        dialogue: "Wall Maria may have fallen, but our code will breach all barriers. Ready to fly? Press [↑] or [W] to launch ODM gear!"
      },
      {
        name: 'SKILLS CLOCKTOWER',
        cameraPos: [-14, 29.5, -28],
        cameraLook: [-14, 27.5, -38],
        charPos: [-14, 26.2, -38],
        charRotY: Math.PI,
        dialogue: "Atop the district tower, our technical arsenal is forged: Advanced Python, system architectures, and deep computational foundations."
      },
      {
        name: 'PROJECTS RAMPART',
        cameraPos: [18, 54, 4],
        cameraLook: [8, 51, -12],
        charPos: [8, 50, -12],
        charRotY: -Math.PI / 3,
        dialogue: "From the ramparts of Wall Maria, explore active missions and deployed applications built to conquer complex problems."
      },
      {
        name: 'ACCOLADES CAMP',
        cameraPos: [26, 3.8, -42],
        cameraLook: [26, 1.8, -50],
        charPos: [26, 0, -50],
        charRotY: Math.PI * 0.75,
        dialogue: "Scout Expedition Camp: Commendations, academic distinctions, and hackathon victories achieved in the line of duty."
      },
      {
        name: 'SCOUT DISPATCH / CONTACT',
        cameraPos: [-22, 4.5, 2],
        cameraLook: [-22, 2.0, -8],
        charPos: [-22, 0, -8],
        charRotY: -Math.PI * 0.25,
        dialogue: "Establish direct communication. Fire a green smoke signal to collaborate on high-impact software missions."
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

    // Cinematic opening state
    cinematic: {
      active: true,
      time: 0,
      totalDuration: 13.0,
      breached: false,
      flyThroughTriggered: false
    },

    // Camera free-roam mode
    freeCamera: false,
    mouse: { x: 0, y: 0, isDown: false, prevX: 0, prevY: 0 },
    orbitAngles: { yaw: 0, pitch: 0 }
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

    // Convert sectors coords to Vector3
    app.sectors.forEach(s => {
      s.cameraPos = new THREE.Vector3(s.cameraPos[0], s.cameraPos[1], s.cameraPos[2]);
      s.cameraLook = new THREE.Vector3(s.cameraLook[0], s.cameraLook[1], s.cameraLook[2]);
      s.charPos = new THREE.Vector3(s.charPos[0], s.charPos[1], s.charPos[2]);
    });

    // Scene & Fog
    app.scene = new THREE.Scene();
    app.scene.background = new THREE.Color(0xb8c9d4); // Anime sky blue-grey
    app.scene.fog = new THREE.FogExp2(0xb8c9d4, 0.007);

    // Camera
    app.camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1500);

    // Initial cinematic camera position (high angle looking at Colossal Titan face over Wall Maria)
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
    const hemiLight = new THREE.HemisphereLight(0xfff6e5, 0x444d47, 0.7);
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

    // Secondary rim light for dramatic anime silhouette
    const rimLight = new THREE.DirectionalLight(0xa62424, 0.6); // Titan crimson rim
    rimLight.position.set(-80, 50, -80);
    app.scene.add(rimLight);

    // Build the World
    buildSkyAndGround();
    buildColossalTitan();
    buildWallMaria();
    buildShiganshinaDistrict();
    buildCharacterTakshita();
    initParticleSystems();
    setupEventListeners();

    // Start title card
    setTimeout(() => {
      document.getElementById('cinematic-title-card').classList.add('show');
    }, 600);
  }

  // =========================================================================
  // 5. SKY & GROUND GENERATION
  // =========================================================================
  function buildSkyAndGround() {
    // Sky Dome
    const skyGeo = new THREE.SphereGeometry(700, 32, 15);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x93b7be,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    app.scene.add(sky);

    // Distant mountain silhouettes
    const mountainGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const dist = 380 + Math.random() * 80;
      const height = 90 + Math.random() * 80;
      const width = 110 + Math.random() * 60;
      const mGeo = new THREE.ConeGeometry(width, height, 5);
      const mMat = new THREE.MeshLambertMaterial({ color: 0x566e74 });
      const mMesh = new THREE.Mesh(mGeo, mMat);
      mMesh.position.set(Math.cos(angle) * dist, height / 2 - 20, Math.sin(angle) * dist);
      mountainGroup.add(mMesh);
    }
    app.scene.add(mountainGroup);

    // Ground Plane with Cobblestone tint
    const groundGeo = new THREE.PlaneGeometry(800, 800, 40, 40);
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
  // 6. PROCEDURAL COLOSSAL TITAN (60m Tall)
  // =========================================================================
  function buildColossalTitan() {
    app.titanGroup = new THREE.Group();
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

    // 1. Titan Head / Skull (Located high above Wall Maria at y ~ 64)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 64, -20);

    // Cranium
    const skullGeo = new THREE.BoxGeometry(7, 8, 8);
    const skull = new THREE.Mesh(skullGeo, titanMat);
    skull.position.y = 1;
    headGroup.add(skull);

    // Exposed Jaw & Teeth (Iconic AoT Colossal Titan grin)
    const jawGeo = new THREE.BoxGeometry(6.2, 4.2, 7.5);
    const jaw = new THREE.Mesh(jawGeo, titanMat);
    jaw.position.set(0, -2.8, 1);
    headGroup.add(jaw);

    // Teeth row
    const teethGeo = new THREE.BoxGeometry(5.2, 1.2, 1.2);
    const teeth = new THREE.Mesh(teethGeo, boneMat);
    teeth.position.set(0, -1.8, 4.4);
    headGroup.add(teeth);

    // Sinew cheek tendons
    const tendonL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4), boneMat);
    tendonL.position.set(-2.8, -2, 3.2);
    tendonL.rotation.z = 0.2;
    const tendonR = tendonL.clone();
    tendonR.position.x = 2.8;
    tendonR.rotation.z = -0.2;
    headGroup.add(tendonL, tendonR);

    // Glowing hollow eyes
    const eyeGeo = new THREE.SphereGeometry(0.7, 12, 12);
    const eyeL = new THREE.Mesh(eyeGeo, eyeGlowMat);
    eyeL.position.set(-1.8, 1.2, 4.0);
    const eyeR = eyeL.clone();
    eyeR.position.x = 1.8;
    headGroup.add(eyeL, eyeR);

    // Brow ridge
    const browGeo = new THREE.BoxGeometry(6, 1.4, 2);
    const brow = new THREE.Mesh(browGeo, titanMat);
    brow.position.set(0, 2.2, 4.1);
    headGroup.add(brow);

    app.titanGroup.add(headGroup);

    // 2. Colossal Muscular Neck & Torso
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 46, -24);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(4.5, 5.5, 8, 12);
    const neck = new THREE.Mesh(neckGeo, titanMat);
    neck.position.y = 12;
    torsoGroup.add(neck);

    // Upper Torso / Pectorals
    const chestGeo = new THREE.BoxGeometry(22, 14, 12);
    const chest = new THREE.Mesh(chestGeo, titanMat);
    chest.position.y = 3;
    torsoGroup.add(chest);

    // Pectoral Muscle Plates
    const pecGeo = new THREE.BoxGeometry(8.5, 6, 2.5);
    const pecL = new THREE.Mesh(pecGeo, titanMat);
    pecL.position.set(-4.8, 4.5, 6.2);
    const pecR = pecL.clone();
    pecR.position.x = 4.8;
    torsoGroup.add(pecL, pecR);

    // 8-pack Abdominal Musculature
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 2; col++) {
        const abGeo = new THREE.BoxGeometry(4.0, 2.8, 1.8);
        const ab = new THREE.Mesh(abGeo, titanMat);
        const xPos = col === 0 ? -2.4 : 2.4;
        const yPos = 0.5 - row * 3.2;
        ab.position.set(xPos, yPos, 6.0);
        torsoGroup.add(ab);
      }
    }

    // Rib cage sinew lateral ridges
    for (let r = 0; r < 5; r++) {
      const ribL = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 9), boneMat);
      ribL.position.set(-9.5, 3 - r * 2.2, 1);
      const ribR = ribL.clone();
      ribR.position.x = 9.5;
      torsoGroup.add(ribL, ribR);
    }

    // Lower Torso / Pelvis
    const pelvisGeo = new THREE.BoxGeometry(16, 12, 10);
    const pelvis = new THREE.Mesh(pelvisGeo, titanMat);
    pelvis.position.y = -10;
    torsoGroup.add(pelvis);

    app.titanGroup.add(torsoGroup);

    // 3. Gigantic Arms Gripping Wall Maria!
    // Left Shoulder & Arm
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(6, 12, 12), titanMat);
    shoulderL.position.set(-14, 52, -22);
    app.titanGroup.add(shoulderL);

    const armL = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 3.8, 18, 12), titanMat);
    armL.position.set(-17, 44, -12);
    armL.rotation.x = Math.PI / 4;
    armL.rotation.z = 0.3;
    app.titanGroup.add(armL);

    // Left Giant Hand resting on the crest of Wall Maria (y ~ 50)
    const handL = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 8), titanMat);
    handL.position.set(-17, 51.5, 0);
    app.titanGroup.add(handL);

    // Right Shoulder & Arm
    const shoulderR = shoulderL.clone();
    shoulderR.position.x = 14;
    app.titanGroup.add(shoulderR);

    const armR = armL.clone();
    armR.position.x = 17;
    armR.rotation.z = -0.3;
    app.titanGroup.add(armR);

    // Right Giant Hand resting on Wall Maria
    const handR = handL.clone();
    handR.position.x = 17;
    app.titanGroup.add(handR);

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

    // Wall Maria is positioned at z = 0, separating the exterior from Shiganshina (z < 0)
    const wallHeight = 50;
    const wallThickness = 14;

    // Left Wall Section (Solid)
    const leftWallGeo = new THREE.BoxGeometry(120, wallHeight, wallThickness);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-75, wallHeight / 2, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    app.wallGroup.add(leftWall);

    // Right Wall Section (Solid)
    const rightWall = leftWall.clone();
    rightWall.position.x = 75;
    app.wallGroup.add(rightWall);

    // Upper Archway above the gate (intact top walkway)
    const archGeo = new THREE.BoxGeometry(32, 16, wallThickness);
    const arch = new THREE.Mesh(archGeo, wallMat);
    arch.position.set(0, wallHeight - 8, 0);
    arch.castShadow = true;
    arch.receiveShadow = true;
    app.wallGroup.add(arch);

    // Wall Battlements & Walkway Crenellations
    for (let x = -130; x <= 130; x += 6) {
      if (Math.abs(x) < 14) continue; // Skip breach zone
      const crenel = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3, 2), wallMat);
      crenel.position.set(x, wallHeight + 1.5, wallThickness / 2 - 1);
      app.wallGroup.add(crenel);
      const crenelBack = crenel.clone();
      crenelBack.position.z = -wallThickness / 2 + 1;
      app.wallGroup.add(crenelBack);
    }

    // Garrison Cannons atop Wall Maria
    for (let x of [-45, -25, 25, 45]) {
      const cannonBase = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 3), ironMat);
      cannonBase.position.set(x, wallHeight + 0.9, 0);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 5, 8), ironMat);
      barrel.rotation.x = Math.PI / 2.2;
      barrel.position.set(x, wallHeight + 2.2, 1.8);
      app.wallGroup.add(cannonBase, barrel);
    }

    // FRACTURABLE BREACH GATE (Constructed of 70+ physics debris blocks)
    // The gate area: x from -14 to 14, y from 0 to 34, z = 0
    const gateGroup = new THREE.Group();
    gateGroup.name = 'breachGate';

    const numCols = 7;
    const numRows = 10;
    const blockW = 28 / numCols;
    const blockH = 34 / numRows;
    const blockD = wallThickness;

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const isWood = (r < 7 && c > 1 && c < 5); // Central wooden gate doors
        const blockGeo = new THREE.BoxGeometry(
          blockW * (0.88 + Math.random() * 0.2),
          blockH * (0.88 + Math.random() * 0.2),
          blockD * (0.85 + Math.random() * 0.25)
        );
        const block = new THREE.Mesh(blockGeo, isWood ? gateWoodMat : wallMat);
        const xPos = -14 + c * blockW + blockW / 2;
        const yPos = r * blockH + blockH / 2;
        const zPos = 0;

        block.position.set(xPos, yPos, zPos);
        block.castShadow = true;
        block.receiveShadow = true;

        // Custom physics properties for breach explosion
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
  // 8. SHIGANSHINA DISTRICT (Buildings, Streets, Skills Clock Tower)
  // =========================================================================
  function buildShiganshinaDistrict() {
    app.districtGroup = new THREE.Group();

    const roofTex = createRoofTileTexture();
    roofTex.repeat.set(2, 2);

    const plasterMat = new THREE.MeshStandardMaterial({
      color: 0xdfd8ca, // Bavarian cream stucco
      roughness: 0.9
    });

    const timberMat = new THREE.MeshStandardMaterial({
      color: 0x3d2716, // Dark wood beams
      roughness: 0.7
    });

    const roofMat = new THREE.MeshStandardMaterial({
      map: roofTex,
      color: 0xa8412b,
      roughness: 0.8
    });

    // Helper to generate a Germanic timber-framed house
    function createHouse(w, h, d, x, z, rotY = 0) {
      const house = new THREE.Group();
      house.position.set(x, 0, z);
      house.rotation.y = rotY;

      // Base stone foundation
      const baseH = 2.5;
      const base = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, baseH, d + 0.4), timberMat);
      base.position.y = baseH / 2;
      house.add(base);

      // Main stucco body
      const bodyH = h - baseH;
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, bodyH, d), plasterMat);
      body.position.y = baseH + bodyH / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      house.add(body);

      // Timber-frame cross beams (Anime aesthetic)
      const beamFront = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.4, 0.2), timberMat);
      beamFront.position.set(0, baseH + bodyH * 0.5, d / 2 + 0.1);
      house.add(beamFront);

      // Pitched roof (gabled)
      const roofH = 5 + Math.random() * 3;
      const roofGeo = new THREE.ConeGeometry(Math.max(w, d) * 0.75, roofH, 4);
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = h + roofH / 2 - 0.5;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      house.add(roof);

      // Chimney
      const chim = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4, 1.2), timberMat);
      chim.position.set(w * 0.25, h + roofH * 0.5, 0);
      house.add(chim);

      return house;
    }

    // Street rows on both sides of central Shiganshina boulevard (z: -10 to -90)
    // Left side residential blocks
    for (let z = -15; z >= -85; z -= 14) {
      const h1 = createHouse(9, 12, 10, -18, z, 0.1);
      const h2 = createHouse(8, 14, 11, -30, z - 2, -0.15);
      app.districtGroup.add(h1, h2);
    }

    // Right side residential blocks
    for (let z = -15; z >= -85; z -= 14) {
      const h1 = createHouse(10, 13, 10, 18, z, -0.1);
      const h2 = createHouse(8, 11, 12, 31, z + 2, 0.2);
      app.districtGroup.add(h1, h2);
    }

    // Transverse streets & alleys
    for (let x of [-45, 45]) {
      for (let z = -25; z >= -75; z -= 20) {
        app.districtGroup.add(createHouse(11, 15, 14, x, z, Math.PI / 2));
      }
    }

    // Cobblestone Central Boulevard path accent
    const streetGeo = new THREE.PlaneGeometry(16, 95);
    const streetMat = new THREE.MeshLambertMaterial({ color: 0x403b34 });
    const street = new THREE.Mesh(streetGeo, streetMat);
    street.rotation.x = -Math.PI / 2;
    street.position.set(0, 0.05, -50);
    street.receiveShadow = true;
    app.districtGroup.add(street);

    // =======================================================================
    // THE SKILLS CLOCK TOWER (Sector 1 Location)
    // Position: x = -14, z = -38 (Towering medieval stone clocktower)
    // =======================================================================
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-14, 0, -38);

    const towerStoneMat = new THREE.MeshStandardMaterial({
      color: 0x6e685f,
      roughness: 0.8
    });

    const towerSpireMat = new THREE.MeshStandardMaterial({
      color: 0x2e4f45, // Aged copper / slate green
      metalness: 0.3,
      roughness: 0.4
    });

    const clockGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2
    });

    // Tier 1: Lower Tower Base (h: 14)
    const tBase = new THREE.Mesh(new THREE.BoxGeometry(10, 14, 10), towerStoneMat);
    tBase.position.y = 7;
    tBase.castShadow = true;
    tBase.receiveShadow = true;
    towerGroup.add(tBase);

    // Tier 2: Mid Tower Shaft (h: 12)
    const tMid = new THREE.Mesh(new THREE.BoxGeometry(8.5, 12, 8.5), towerStoneMat);
    tMid.position.y = 19;
    tMid.castShadow = true;
    towerGroup.add(tMid);

    // Tier 3: Clock Face Chamber (h: 6, y: 24 to 30)
    const tClock = new THREE.Mesh(new THREE.BoxGeometry(9.2, 6, 9.2), towerStoneMat);
    tClock.position.y = 25;
    tClock.castShadow = true;
    towerGroup.add(tClock);

    // 4 Ornate Clock Faces
    for (let side = 0; side < 4; side++) {
      const clockDisc = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.3, 16), clockGoldMat);
      clockDisc.rotation.x = Math.PI / 2;
      const angle = side * (Math.PI / 2);
      clockDisc.position.set(Math.sin(angle) * 4.7, 25, Math.cos(angle) * 4.7);
      clockDisc.rotation.y = angle;
      towerGroup.add(clockDisc);
    }

    // Observation Roof Platform (Landing Zone for Takshita, y = 26.2 to 28)
    const tPlatform = new THREE.Mesh(new THREE.BoxGeometry(11, 1.2, 11), towerStoneMat);
    tPlatform.position.y = 28.5;
    tPlatform.receiveShadow = true;
    towerGroup.add(tPlatform);

    // Platform Railings / Crenels
    for (let i = -5; i <= 5; i += 2.5) {
      const railF = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.8, 0.4), towerStoneMat);
      railF.position.set(i, 29.8, 5.2);
      const railB = railF.clone();
      railB.position.z = -5.2;
      towerGroup.add(railF, railB);
    }

    // Majestic Gothic Spire
    const spireGeo = new THREE.ConeGeometry(5, 16, 8);
    const spire = new THREE.Mesh(spireGeo, towerSpireMat);
    spire.position.y = 37;
    spire.castShadow = true;
    towerGroup.add(spire);

    // Banner of the Scout Regiment flying high
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 8), clockGoldMat);
    flagPole.position.set(0, 47, 0);
    const flagGeo = new THREE.PlaneGeometry(4, 2.5);
    const flagMat = new THREE.MeshBasicMaterial({
      map: createWingsEmblemTexture(),
      side: THREE.DoubleSide
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(2, 48.5, 0);
    towerGroup.add(flagPole, flag);

    app.districtGroup.add(towerGroup);

    // Street details: Wooden crates, barrels, streetlamps
    for (let i = 0; i < 12; i++) {
      const crate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), timberMat);
      const zSide = -10 - Math.random() * 60;
      const xSide = (Math.random() > 0.5 ? 1 : -1) * (7 + Math.random() * 4);
      crate.position.set(xSide, 0.8, zSide);
      crate.rotation.y = Math.random() * Math.PI;
      app.districtGroup.add(crate);
    }

    app.scene.add(app.districtGroup);
  }

  // =========================================================================
  // 9. TAKSHITA JOSHI 3D CHARACTER MODEL (Female Scout, ODM Gear, Cape)
  // =========================================================================
  function buildCharacterTakshita() {
    app.characterGroup = new THREE.Group();
    app.characterGroup.position.set(0, 0, 0);

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfdecdb, // Fair complexion
      roughness: 0.6
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1f1610, // Dark brown/black voluminous curly hair
      roughness: 0.8
    });

    const jacketMat = new THREE.MeshStandardMaterial({
      color: 0x9e6c43, // Scout camel/tan cropped jacket
      roughness: 0.7
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee, // White scout shirt
      roughness: 0.6
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0xededed, // White riding breeches
      roughness: 0.7
    });

    const leatherHarnessMat = new THREE.MeshStandardMaterial({
      color: 0x331c10, // Dark leather combat harness straps
      roughness: 0.5
    });

    const bootsMat = new THREE.MeshStandardMaterial({
      color: 0x2e190e, // Knee-high dark brown riding boots
      roughness: 0.4
    });

    const capeMat = new THREE.MeshStandardMaterial({
      color: 0x1d472c, // Survey Corps emerald green cape
      roughness: 0.65,
      side: THREE.DoubleSide
    });

    const odmSteelMat = new THREE.MeshStandardMaterial({
      color: 0xa8b2ba, // Polished steel gas canisters & blade sheaths
      metalness: 0.85,
      roughness: 0.25
    });

    const odmBrassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Brass nozzles & wire spools
      metalness: 0.7,
      roughness: 0.3
    });

    // 1. Head & Curly Hair
    const headGroup = new THREE.Group();
    headGroup.position.y = 2.45;

    // Face
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), skinMat);
    face.scale.set(0.9, 1.1, 0.95);
    headGroup.add(face);

    // Anime Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a2e22 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), eyeMat);
    eyeL.position.set(-0.13, 0.05, 0.34);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.13;
    headGroup.add(eyeL, eyeR);

    // Voluminous Curly Hair (Cluster of curly ringlets framing her face and crown)
    const hairGroup = new THREE.Group();
    const curlGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const curlPositions = [
      // Top crown volume
      [0, 0.38, -0.05], [0.22, 0.32, 0.05], [-0.22, 0.32, 0.05],
      [0.15, 0.36, -0.18], [-0.15, 0.36, -0.18],
      // Side curls framing face
      [-0.35, 0.05, 0.12], [-0.38, -0.15, 0.08], [-0.34, -0.32, -0.02],
      [0.35, 0.05, 0.12], [0.38, -0.15, 0.08], [0.34, -0.32, -0.02],
      // Back curly curls
      [0, 0.15, -0.36], [0.24, 0.0, -0.34], [-0.24, 0.0, -0.34],
      [0, -0.18, -0.38], [0.18, -0.28, -0.32], [-0.18, -0.28, -0.32]
    ];

    curlPositions.forEach(pos => {
      const curl = new THREE.Mesh(curlGeo, hairMat);
      curl.position.set(pos[0], pos[1], pos[2]);
      curl.scale.set(1 + Math.random() * 0.25, 1 + Math.random() * 0.25, 1 + Math.random() * 0.25);
      hairGroup.add(curl);
    });
    headGroup.add(hairGroup);
    app.characterGroup.add(headGroup);

    // 2. Torso & Scout Jacket
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 1.7;

    // White shirt base
    const shirt = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.9, 12), shirtMat);
    torsoGroup.add(shirt);

    // Cropped Scout Jacket (Stops above waist)
    const jacket = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 0.55, 12), jacketMat);
    jacket.position.y = 0.2;
    torsoGroup.add(jacket);

    // Collar
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 0.18, 12), jacketMat);
    collar.position.y = 0.52;
    torsoGroup.add(collar);

    // Harness Straps across chest (X-strap)
    const strap1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.75, 0.72), leatherHarnessMat);
    strap1.rotation.y = Math.PI / 4;
    strap1.position.y = 0.1;
    const strap2 = strap1.clone();
    strap2.rotation.y = -Math.PI / 4;
    torsoGroup.add(strap1, strap2);

    // Waist Harness belt
    const waistBelt = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.12, 12), leatherHarnessMat);
    waistBelt.position.y = -0.35;
    torsoGroup.add(waistBelt);

    app.characterGroup.add(torsoGroup);

    // 3. Legs & Riding Boots
    const legsGroup = new THREE.Group();
    legsGroup.position.y = 0.85;

    // White breeches (Upper thighs)
    const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.65, 8), pantsMat);
    thighL.position.set(-0.2, 0.12, 0);
    const thighR = thighL.clone();
    thighR.position.x = 0.2;

    // Thigh holster leather straps
    const thighStrapL = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 8), leatherHarnessMat);
    thighStrapL.position.set(-0.2, 0.18, 0);
    const thighStrapR = thighStrapL.clone();
    thighStrapR.position.x = 0.2;

    // Knee-high Scout Combat Boots
    const bootL = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.8, 8), bootsMat);
    bootL.position.set(-0.2, -0.45, 0);
    const bootR = bootL.clone();
    bootR.position.x = 0.2;

    // Boot feet
    const footL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.45), bootsMat);
    footL.position.set(-0.2, -0.8, 0.1);
    const footR = footL.clone();
    footR.position.x = 0.2;

    legsGroup.add(thighL, thighR, thighStrapL, thighStrapR, bootL, bootR, footL, footR);
    app.characterGroup.add(legsGroup);

    // 4. Arms & ODM Grip Triggers
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.7, 8), jacketMat);
    armL.position.set(-0.48, 1.7, 0);
    armL.rotation.z = 0.15;

    const armR = armL.clone();
    armR.position.x = 0.48;
    armR.rotation.z = -0.15;

    // Hand ODM control grips
    const gripL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.15), odmSteelMat);
    gripL.position.set(-0.55, 1.3, 0.15);
    const gripR = gripL.clone();
    gripR.position.x = 0.55;

    // Snap blades in hand
    const bladeGeo = new THREE.BoxGeometry(0.04, 0.08, 1.1);
    const bladeL = new THREE.Mesh(bladeGeo, odmSteelMat);
    bladeL.position.set(-0.55, 1.3, 0.65);
    const bladeR = bladeL.clone();
    bladeR.position.x = 0.55;

    app.characterGroup.add(armL, armR, gripL, gripR, bladeL, bladeR);

    // 5. OMNI-DIRECTIONAL MOBILITY (ODM) GEAR
    const odmGroup = new THREE.Group();
    odmGroup.position.set(0, 1.35, 0);

    // Left Gas Canister Tank (Twin Cylinders)
    const gasTankL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.95, 10), odmSteelMat);
    gasTankL.rotation.x = Math.PI / 2;
    gasTankL.position.set(-0.48, -0.1, 0);

    // Blade Sheath Box (under canister)
    const sheathL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.95), odmSteelMat);
    sheathL.position.set(-0.48, -0.28, 0);

    // Right Gas Canister & Blade Sheath
    const gasTankR = gasTankL.clone();
    gasTankR.position.x = 0.48;
    const sheathR = sheathL.clone();
    sheathR.position.x = 0.48;

    // Back Propulsion Turbine & Dual Wire Spool Winches
    const turbine = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.35, 12), odmBrassMat);
    turbine.rotation.x = Math.PI / 2;
    turbine.position.set(0, -0.05, -0.38);

    const wireSpoolL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.16, 8), odmBrassMat);
    wireSpoolL.position.set(-0.25, -0.05, -0.36);
    const wireSpoolR = wireSpoolL.clone();
    wireSpoolR.position.x = 0.25;

    odmGroup.add(gasTankL, sheathL, gasTankR, sheathR, turbine, wireSpoolL, wireSpoolR);
    app.characterGroup.add(odmGroup);

    // 6. Iconic Green Scout Cape with Wings of Freedom
    const capeGeo = new THREE.PlaneGeometry(0.85, 1.4, 6, 8);
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.position.set(0, 1.7, -0.32);
    cape.rotation.x = 0.15;
    cape.name = 'scoutCape';
    app.characterGroup.add(cape);

    app.scene.add(app.characterGroup);
  }

  // =========================================================================
  // 10. PARTICLE SYSTEMS (Titan Steam & Breach Debris)
  // =========================================================================
  function initParticleSystems() {
    // 1. Titan Billowing Steam Particles
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
        z: (Math.random() - 0.5) * 0.12,
        life: Math.random() * 1.0
      });
    }

    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

    // Particle texture
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
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    app.steamParticles = new THREE.Points(steamGeo, steamMat);
    app.steamParticles.userData = { velocities: steamVelocities };
    app.scene.add(app.steamParticles);

    // 2. Wall Breach Dust & Rubble Particles
    const debrisCount = 200;
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
        z: -Math.random() * 2.2, // Flies through toward district
        active: false,
        size: 3 + Math.random() * 10
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
  // 11. TRIGGER TITAN BREACH & CINEMATIC SEQUENCE
  // =========================================================================
  function triggerWallBreach() {
    if (app.cinematic.breached) return;
    app.cinematic.breached = true;

    // Flash & Camera Shake
    const flash = document.getElementById('flash-overlay');
    flash.style.opacity = '1';
    setTimeout(() => { flash.style.opacity = '0'; }, 180);

    const shake = document.getElementById('shake-overlay');
    shake.style.opacity = '1';
    setTimeout(() => { shake.style.opacity = '0'; }, 1200);

    // Audio Boom
    sound.playLightningBoom();

    // Explode Wall Maria fracture blocks
    app.breachBlocks.forEach(block => {
      block.userData.isFractured = true;
      // High-velocity outward blast into Shiganshina
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

    // Activate dust cloud
    app.debrisParticles.material.opacity = 0.85;
    app.debrisParticles.userData.active = true;
  }

  // =========================================================================
  // 12. ODM GEAR LAUNCH & SECTOR TRANSITION
  // =========================================================================
  function goToSector(sectorIndex) {
    if (app.isTransitioning) return;
    if (sectorIndex < 0 || sectorIndex >= app.sectors.length) return;
    if (sectorIndex === app.currentSector && !app.cinematic.active) return;

    sound.init(); // Initialize audio context on user interaction
    sound.playGasBurst();
    sound.playGrappleLaunch();

    const fromSector = app.sectors[app.currentSector];
    const toSector = app.sectors[sectorIndex];

    app.isTransitioning = true;
    app.transitionProgress = 0;
    app.currentSector = sectorIndex;

    // Start positions
    app.flightStartPos.copy(app.characterGroup.position);
    app.flightTargetPos.copy(toSector.charPos);

    app.flightStartCamPos.copy(app.camera.position);
    app.flightTargetCamPos.copy(toSector.cameraPos);

    app.flightStartCamLook.copy(fromSector.cameraLook);
    app.flightTargetCamLook.copy(toSector.cameraLook);

    // Visual indicators
    document.body.classList.add('speed-lines-active');

    // Update UI HUD
    document.querySelectorAll('.nav-sector-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.sector) === sectorIndex);
    });

    document.querySelectorAll('.dossier-card').forEach(card => {
      card.classList.remove('active');
    });

    document.getElementById('loc-name-display').textContent = toSector.name;

    // Create 3D grapple cables firing from Takshita's ODM gear to target destination
    createGrappleCables(app.flightStartPos, app.flightTargetPos);

    // Dialogue update
    const dialogueEl = document.getElementById('dialogue-content');
    dialogueEl.textContent = toSector.dialogue;
    document.getElementById('character-dialogue').classList.add('show');
  }

  function createGrappleCables(start, end) {
    // Remove old cables
    app.grappleCables.forEach(cable => app.scene.remove(cable));
    app.grappleCables = [];

    const cableMat = new THREE.LineBasicMaterial({
      color: 0xe0e6ed,
      linewidth: 2
    });

    // Left cable anchor
    const cableGeoL = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(start.x - 0.45, start.y + 1.2, start.z),
      new THREE.Vector3(end.x - 2, end.y + 6, end.z)
    ]);
    const cableL = new THREE.Line(cableGeoL, cableMat);

    // Right cable anchor
    const cableGeoR = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(start.x + 0.45, start.y + 1.2, start.z),
      new THREE.Vector3(end.x + 2, end.y + 6, end.z)
    ]);
    const cableR = new THREE.Line(cableGeoR, cableMat);

    app.grappleCables.push(cableL, cableR);
    app.scene.add(cableL, cableR);
  }

  // =========================================================================
  // 13. CINEMATIC SKIP & REPLAY CONTROLS
  // =========================================================================
  function completeCinematicToShiganshina() {
    app.cinematic.active = false;
    document.body.classList.remove('cinematic-active');
    document.getElementById('cinematic-title-card').classList.remove('show');
    document.getElementById('skip-intro-btn').style.display = 'none';
    document.getElementById('hud-root').classList.add('visible');
    document.getElementById('character-dialogue').classList.add('show');

    // Place camera directly at Takshita in Shiganshina Plaza
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
    app.cinematic.flyThroughTriggered = false;

    // Reset fractured blocks
    app.breachBlocks.forEach(block => {
      block.userData.isFractured = false;
      block.position.copy(block.userData.origPos);
      block.rotation.copy(block.userData.origRot);
    });

    // Reset UI
    document.body.classList.add('cinematic-active');
    document.getElementById('hud-root').classList.remove('visible');
    document.getElementById('character-dialogue').classList.remove('show');
    document.getElementById('skip-intro-btn').style.display = 'flex';
    document.querySelectorAll('.dossier-card').forEach(c => c.classList.remove('active'));

    document.getElementById('cinematic-title-card').classList.add('show');

    // Reset camera to Titan vista
    app.camera.position.set(0, 72, 85);
    app.camera.lookAt(0, 68, -10);
  }

  // =========================================================================
  // 14. EVENT LISTENERS & USER INPUT (Arrow Keys, Buttons, Free Orbit)
  // =========================================================================
  function setupEventListeners() {
    // Window Resize
    window.addEventListener('resize', () => {
      app.camera.aspect = window.innerWidth / window.innerHeight;
      app.camera.updateProjectionMatrix();
      app.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Keyboard navigation: [↑ / W] = Next Sector, [↓ / S] = Prev Sector
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (app.cinematic.active) {
          completeCinematicToShiganshina();
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
      } else if (e.key === 'r' || e.key === 'R') {
        replayCinematic();
      } else if (e.key === 'c' || e.key === 'C') {
        app.freeCamera = !app.freeCamera;
      } else if (e.key === 'm' || e.key === 'M') {
        sound.toggle();
      }
    });

    // Action button
    document.getElementById('odm-action-btn').addEventListener('click', () => {
      if (app.cinematic.active) {
        completeCinematicToShiganshina();
      } else {
        const next = (app.currentSector + 1) % app.sectors.length;
        goToSector(next);
      }
    });

    // Sector Nav Menu buttons
    document.querySelectorAll('.nav-sector-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sector = parseInt(btn.dataset.sector);
        if (app.cinematic.active) completeCinematicToShiganshina();
        goToSector(sector);
      });
    });

    // Skip intro button
    document.getElementById('skip-intro-btn').addEventListener('click', () => {
      completeCinematicToShiganshina();
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

    // Mouse drag for Free-Look Orbit Camera
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
  // 15. MAIN ANIMATION LOOP
  // =========================================================================
  function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(app.clock.getDelta(), 0.1);
    const time = app.clock.getElapsedTime();

    // 1. Billowing Titan Steam particles
    if (app.steamParticles) {
      const pos = app.steamParticles.geometry.attributes.position.array;
      const vels = app.steamParticles.userData.velocities;
      for (let i = 0; i < vels.length; i++) {
        pos[i * 3] += vels[i].x;
        pos[i * 3 + 1] += vels[i].y;
        pos[i * 3 + 2] += vels[i].z;

        // Reset particle when too high
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
        // Track 1: Travel down the Colossal Titan's enormous body to Wall Maria
        const p = t / 4.0;
        app.camera.position.x = Math.sin(p * 0.4) * 8;
        app.camera.position.y = THREE.MathUtils.lerp(72, 52, p);
        app.camera.position.z = THREE.MathUtils.lerp(85, 38, p);
        app.camera.lookAt(0, THREE.MathUtils.lerp(66, 32, p), -15);
      } else if (t < 5.2) {
        // Track 2: Arrive at Wall Maria, Titan prepares to strike
        const p = (t - 4.0) / 1.2;
        app.camera.position.set(0, THREE.MathUtils.lerp(52, 28, p), THREE.MathUtils.lerp(38, 26, p));
        app.camera.lookAt(0, 16, 0);

        // Titan Breach Trigger at t = 4.8s
        if (t > 4.6 && !app.cinematic.breached) {
          triggerWallBreach();
        }
      } else if (t < 9.0) {
        // Track 3: Fly through the breach hole into Shiganshina District!
        const p = (t - 5.2) / 3.8;
        // Smooth dramatic cubic bezier swoop through the fractured opening at z = 0
        app.camera.position.x = Math.sin(p * Math.PI) * 4;
        app.camera.position.y = THREE.MathUtils.lerp(28, 6, p);
        app.camera.position.z = THREE.MathUtils.lerp(26, -10, p);
        app.camera.lookAt(0, THREE.MathUtils.lerp(16, 2, p), THREE.MathUtils.lerp(0, -35, p));
      } else if (t < 13.0) {
        // Track 4: Settle at Takshita Joshi in Shiganshina Plaza
        const p = (t - 9.0) / 4.0;
        const targetCam = app.sectors[0].cameraPos;
        const targetLook = app.sectors[0].cameraLook;
        app.camera.position.lerp(targetCam, 0.06);
        app.camera.lookAt(targetLook);

        if (p > 0.85) {
          completeCinematicToShiganshina();
        }
      }
    }

    // 4. Update Fractured Wall Debris Physics
    if (app.cinematic.breached) {
      app.breachBlocks.forEach(block => {
        if (!block.userData.isFractured) return;
        const d = block.userData;
        // Apply gravity & velocity
        d.vel.y -= 0.015; // Gravity
        block.position.add(d.vel);

        // Ground collision
        if (block.position.y < block.geometry.parameters.height / 2) {
          block.position.y = block.geometry.parameters.height / 2;
          d.vel.set(0, 0, 0); // Settle
        }

        // Tumble rotation
        block.rotation.x += d.rotVel.x;
        block.rotation.y += d.rotVel.y;
        block.rotation.z += d.rotVel.z;
      });

      // Update Dust Cloud Particles
      if (app.debrisParticles.userData.active) {
        const pos = app.debrisParticles.geometry.attributes.position.array;
        const vels = app.debrisParticles.userData.velocities;
        for (let i = 0; i < vels.length; i++) {
          pos[i * 3] += vels[i].x;
          pos[i * 3 + 1] += vels[i].y;
          pos[i * 3 + 2] += vels[i].z;
          vels[i].y -= 0.008; // Gravity
        }
        app.debrisParticles.geometry.attributes.position.needsUpdate = true;
        app.debrisParticles.material.opacity = Math.max(0, app.debrisParticles.material.opacity - 0.0015);
      }
    }

    // 5. ODM Gear Flight Transition between Sectors
    if (app.isTransitioning) {
      app.transitionProgress += delta / app.transitionDuration;
      const p = Math.min(1.0, app.transitionProgress);

      // Smooth EaseInOutCubic curve
      const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      // Arc curve: Takshita vaults high into the air with pendulum swing physics
      const arcHeight = 18;
      const currentPos = new THREE.Vector3().lerpVectors(app.flightStartPos, app.flightTargetPos, ease);
      currentPos.y += Math.sin(p * Math.PI) * arcHeight;
      app.characterGroup.position.copy(currentPos);

      // Character leans into the forward momentum
      const dir = new THREE.Vector3().subVectors(app.flightTargetPos, app.flightStartPos).normalize();
      app.characterGroup.rotation.y = Math.atan2(dir.x, dir.z);
      app.characterGroup.rotation.x = Math.sin(p * Math.PI) * 0.45; // Aerodynamic tuck

      // Dynamic Camera Tracking (Third-person follow behind Takshita)
      const currentCamPos = new THREE.Vector3().lerpVectors(app.flightStartCamPos, app.flightTargetCamPos, ease);
      currentCamPos.y += Math.sin(p * Math.PI) * (arcHeight * 0.7);
      app.camera.position.copy(currentCamPos);

      const currentLook = new THREE.Vector3().lerpVectors(app.flightStartCamLook, app.flightTargetCamLook, ease);
      app.camera.lookAt(currentLook);

      // Wind sound modulation
      sound.setFlightWind(Math.sin(p * Math.PI));

      // Arrival at destination
      if (p >= 1.0) {
        app.isTransitioning = false;
        document.body.classList.remove('speed-lines-active');
        sound.playLanding();
        sound.setFlightWind(0);

        // Reset character pose
        app.characterGroup.rotation.x = 0;
        app.characterGroup.rotation.y = app.sectors[app.currentSector].charRotY;

        // Clean up cables
        app.grappleCables.forEach(c => app.scene.remove(c));
        app.grappleCables = [];

        // Open sector dossier card
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
    // Check if Three.js is ready
    if (typeof THREE !== 'undefined') {
      initThree();
      animate();
    } else {
      // Fallback loader if CDN took a split second
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
