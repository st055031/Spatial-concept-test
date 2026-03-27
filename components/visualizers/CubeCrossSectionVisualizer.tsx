import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Layers, Info, Rotate3d, CheckCircle2 } from 'lucide-react';

export default function CubeCrossSectionVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPlane, setShowPlane] = useState(true);
  const [showSection, setShowSection] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  const controlsRef = useRef<OrbitControls | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);
  const sectionRef = useRef<THREE.Group | null>(null);
  
  const stateRef = useRef({ showPlane, showSection, autoRotate });

  useEffect(() => {
    stateRef.current = { showPlane, showSection, autoRotate };
    
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate;
    if (planeRef.current) planeRef.current.visible = showPlane;
    if (sectionRef.current) sectionRef.current.visible = showSection;
  }, [showPlane, showSection, autoRotate]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    // 💡 修改 1：將原本的 0xdbeafe 改為純白色 0xffffff
    scene.background = new THREE.Color(0xffffff); 

    const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100);
    camera.position.set(5, 5, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = stateRef.current.autoRotate;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-10, 0, -10);
    scene.add(fillLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. 建立正方體邊框
    const size = 3;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x334155, // slate-700
      linewidth: 2
    });
    const cubeLines = new THREE.LineSegments(edges, lineMaterial);
    mainGroup.add(cubeLines);

    // 2. 建立標籤
    const labels = [
      { text: 'A', pos: [-1.5, 1.5, 1.5] },
      { text: 'B', pos: [1.5, 1.5, 1.5] },
      { text: 'C', pos: [-1.5, -1.5, 1.5] },
      { text: 'D', pos: [1.5, -1.5, 1.5] },
      { text: 'E', pos: [-1.5, 1.5, -1.5] },
      { text: 'F', pos: [1.5, 1.5, -1.5] },
      { text: 'G', pos: [-1.5, -1.5, -1.5] },
      { text: 'H', pos: [1.5, -1.5, -1.5] }
    ];

    const createLabel = (text: string, position: number[]) => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext('2d');
      if (context) {
        context.font = 'Bold 36px Arial';
        context.fillStyle = '#64748b'; // slate-500
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 32, 32);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      
      const offset = 0.4;
      sprite.position.set(
        position[0] + Math.sign(position[0]) * offset,
        position[1] + Math.sign(position[1]) * offset,
        position[2] + Math.sign(position[2]) * offset
      );
      sprite.scale.set(1.5, 1.5, 1.5);
      return sprite;
    };

    labels.forEach(label => {
      mainGroup.add(createLabel(label.text, label.pos));
    });

    // 3. 建立中點 (AE, EF, CD)
    const midpoints = [
      { pos: new THREE.Vector3(-1.5, 1.5, 0), name: 'AE_mid' },
      { pos: new THREE.Vector3(0, 1.5, -1.5), name: 'EF_mid' },
      { pos: new THREE.Vector3(0, -1.5, 1.5), name: 'CD_mid' },
    ];

    const pointGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const pointMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x991b1b, // red-800
      roughness: 0.3,
      metalness: 0.2
    });

    midpoints.forEach(p => {
      const sphere = new THREE.Mesh(pointGeometry, pointMaterial);
      sphere.position.copy(p.pos);
      mainGroup.add(sphere);
    });

    // 4. 建立截面形狀 (正六邊形)
    const sectionGroup = new THREE.Group();
    sectionGroup.visible = stateRef.current.showSection;
    sectionRef.current = sectionGroup;
    mainGroup.add(sectionGroup);

    const hexVertices = [
      new THREE.Vector3(-1.5, 1.5, 0),    // AE 中點
      new THREE.Vector3(0, 1.5, -1.5),    // EF 中點
      new THREE.Vector3(1.5, 0, -1.5),    // FG 中點 (推導出)
      new THREE.Vector3(1.5, -1.5, 0),    // GH 中點 (推導出)
      new THREE.Vector3(0, -1.5, 1.5),    // CD 中點
      new THREE.Vector3(-1.5, 0, 1.5),    // AC 中點 (推導出)
    ];

    // 繪製六邊形外框
    const hexGeometry = new THREE.BufferGeometry().setFromPoints([...hexVertices, hexVertices[0]]);
    const hexMaterial = new THREE.LineBasicMaterial({ 
      color: 0x047857, // emerald-700
      linewidth: 3 
    });
    const hexLine = new THREE.Line(hexGeometry, hexMaterial);
    sectionGroup.add(hexLine);

    // 繪製六邊形內部半透明面
    const hexShape = new THREE.Shape();
    hexShape.moveTo(hexVertices[0].x, hexVertices[0].y); // 投影到 2D 簡化處理
    // 這裡為了簡單，我們直接用自訂幾何體建立面
    
    // 計算中心點
    const center = new THREE.Vector3(0,0,0);
    
    // 建立三角扇形
    const faceGeometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    
    vertices.push(center.x, center.y, center.z);
    hexVertices.forEach(v => vertices.push(v.x, v.y, v.z));
    
    for(let i=1; i<=6; i++) {
      indices.push(0, i, i === 6 ? 1 : i+1);
    }
    
    faceGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    faceGeometry.setIndex(indices);
    faceGeometry.computeVertexNormals();

    const faceMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x10b981, // emerald-500
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    
    const hexMesh = new THREE.Mesh(faceGeometry, faceMaterial);
    sectionGroup.add(hexMesh);

    // 5. 建立切割平面 (無限大平面示意)
    const planeGeom = new THREE.PlaneGeometry(15, 15);
    const planeMat = new THREE.MeshBasicMaterial({ 
      color: 0x3b82f6, // blue-500
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const clippingPlane = new THREE.Mesh(planeGeom, planeMat);
    
    // 計算平面的法向量與旋轉
    // 平面通過 AE(mid), EF(mid), CD(mid)
    const v1 = new THREE.Vector3().subVectors(midpoints[1].pos, midpoints[0].pos);
    const v2 = new THREE.Vector3().subVectors(midpoints[2].pos, midpoints[0].pos);
    const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();
    
    // 設定平面的旋轉以對齊法向量
    const lookAtPoint = new THREE.Vector3().addVectors(center, normal);
    clippingPlane.lookAt(lookAtPoint);
    clippingPlane.visible = stateRef.current.showPlane;
    planeRef.current = clippingPlane;
    
    mainGroup.add(clippingPlane);

    // 動畫迴圈
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex w-full h-full bg-slate-50 overflow-hidden font-sans text-slate-800">
      <div className="w-80 bg-slate-50 border-r border-slate-200 h-full flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0">
        <div className="p-6 overflow-y-auto flex-1 hide-scrollbar">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="text-slate-400" size={18} />
            <span className="text-xs font-bold text-slate-500 tracking-wider">顯示控制</span>
          </div>

          <div className="space-y-4 mb-8">
            <button 
              onClick={() => setShowPlane(!showPlane)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                showPlane ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${showPlane ? 'bg-blue-500' : 'bg-slate-300'}`} />
                <span className="font-bold text-sm">切割平面</span>
              </div>
              <CheckCircle2 size={18} className={showPlane ? 'opacity-100' : 'opacity-0'} />
            </button>

            <button 
              onClick={() => setShowSection(!showSection)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                showSection ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${showSection ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className="font-bold text-sm">截面區域</span>
              </div>
              <CheckCircle2 size={18} className={showSection ? 'opacity-100' : 'opacity-0'} />
            </button>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Info className="text-blue-400" size={16} />
                <span className="text-xs font-bold text-slate-400 tracking-wider">幾何解析</span>
              </div>
              
              <div className="mb-6">
                <div className="text-sm font-medium text-slate-300 mb-4">通過稜邊中點：</div>
                <div className="space-y-3 pl-1">
                  <div className="flex items-center gap-3 text-sm font-bold tracking-wide">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    AE 中點
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold tracking-wide">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    EF 中點
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold tracking-wide">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    CD 中點
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700/50">
                <div className="text-[10px] font-bold text-blue-400 tracking-widest mb-2">截面形狀</div>
                <div className="text-3xl font-black text-emerald-400 tracking-tight">正六邊形</div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono uppercase">Regular Hexagon</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 💡 修改 2：將 bg-gradient-to-br from-slate-50 to-slate-200/50 改為 bg-white */}
      <div className="flex-1 relative bg-white">
        <div ref={containerRef} className="absolute inset-0 cursor-move" />
        
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full text-sm font-bold text-slate-700 shadow-lg border border-slate-200/50 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            <div className="relative flex items-center justify-center">
              {autoRotate ? (
                <>
                  <Rotate3d size={18} className="text-blue-600 animate-spin-slow" />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur animate-pulse" />
                </>
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              )}
            </div>
            {autoRotate ? '停止旋轉' : '開始旋轉'}
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-slate-200/50 backdrop-blur-sm px-6 py-2.5 rounded-full text-[10px] font-bold text-slate-500 tracking-[0.2em] shadow-sm border border-slate-300/30">
            拖 拽 旋 轉 • 滾 軸 縮 放
          </div>
        </div>
      </div>
    </div>
  );
}
