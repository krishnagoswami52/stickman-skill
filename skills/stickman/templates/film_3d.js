// STARTER FILM (3D). A working 6 s skeleton: dusk room, one hero walking to a table. Replace the action.
// Keep it close to the flat 2D look: plain colours, one warm lamp, rim light, purple dusk behind.
import * as T from 'three';
import {clamp,lerp,ease,seg,kf,rng,V,mat,mesh,rimU,Person,gait,texture,makeRenderer,makePost,HERO,HR,ANK} from './lib3d.js';
const FPS=30,DUR=6,W=1920,H=1080,CUTF=[0,105,180];
const R=makeRenderer(),post=makePost(R),sc=new T.Scene();sc.background=new T.Color('#0b0713');const cam=new T.PerspectiveCamera(35,W/H,.05,60);
const RX=6,RZ=4,RH=3.5;
const sky=new T.Mesh(new T.PlaneGeometry(26,9),new T.MeshBasicMaterial({map:texture(1024,512,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h*.9);g.addColorStop(0,'#3F3480');g.addColorStop(.45,'#7A56A0');g.addColorStop(.72,'#C96BB0');g.addColorStop(.88,'#FF8F7A');g.addColorStop(1,'#FFC66E');x.fillStyle=g;x.fillRect(0,0,w,h);const r=rng(3);let p=0;x.fillStyle='#4A2F6E';while(p<w){const b=30+r()*80,c=100+r()*200;x.fillRect(p,h-c,b,c);p+=b}})}));sky.position.set(1,3,-10);sc.add(sky);
const fl=new T.Mesh(new T.PlaneGeometry(RX*2,RZ*2),new T.MeshStandardMaterial({color:'#5A3F66',roughness:.45}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;sc.add(fl);
const wall=new T.Mesh(new T.PlaneGeometry(RX*2,RH),new T.MeshStandardMaterial({roughness:.85,alphaTest:.5,map:texture(1200,350,(x,w,h)=>{x.fillStyle='#55326B';x.fillRect(0,0,w,h);const wy=h*(1-1.15/RH);x.fillStyle='#2F9A98';x.fillRect(0,wy,w,h-wy);x.fillStyle='#237F80';x.fillRect(0,wy,w,7);x.globalCompositeOperation='destination-out';x.fillRect(650,35,500,200)})}));wall.position.set(0,RH/2,-RZ);sc.add(wall);
const wood=mat('#8A4A3A'),metal=mat('#2A2436',{roughness:.4,metalness:.4});const top=mesh(new T.CylinderGeometry(.5,.5,.04,44),wood);top.position.set(1.6,.76,0);const st=mesh(new T.CylinderGeometry(.035,.035,.74,12),metal);st.position.set(1.6,.37,0);sc.add(top,st);
const lamp=new T.SpotLight('#FFC98E',7,9,1.06,.72,1.5);lamp.position.set(1,2.6,.3);lamp.target.position.set(1,0,.3);lamp.castShadow=true;lamp.shadow.mapSize.set(1024,1024);lamp.shadow.bias=-.0008;sc.add(lamp,lamp.target);
sc.add(new T.HemisphereLight('#B9A4E6','#6A5070',2.1));const dusk=new T.DirectionalLight('#FFA884',.9);dusk.position.set(3,3,-8);sc.add(dusk);
const hero=new Person(sc,HERO),x0=-3,x1=.95,STR=.72;
const xAt=t=>lerp(x0,x1,ease(seg(t,.6,4.6)));
window.renderAt=t=>{t=clamp(t,0,DUR-1/60);const f=Math.round(t*FPS),s=f>=CUTF[1]?1:0,u=(f-CUTF[s])/(CUTF[s+1]-CUTF[s]),x=xAt(t),g=gait(x-x0,STR),z=0,m=x>x0&&x<x1?1:0,yaw=Math.PI/2;
 const ft=k=>m?[x0+g[k][0],ANK+g[k][1],z+(k=='l'?-.115:.115)]:[x+(k=='l'?.02:-.02),ANK,z+(k=='l'?-.13:.13)];
 const o=hero.pose({pos:[x,.72-g.bob*m,z],yaw,lean:.03,breath:t*2,feet:{l:ft('l'),r:ft('r')},hy:kf(t,[[0,0],[4.8,0],[5.2,.3]]),hp:.04,face:{mouth:.6,brow:.2,blink:(t>2.2&&t<2.36)?1:0}});
 const c=s==0?{p:[lerp(-1.9,-.9,ease(u)),1.5,4.2],l:[x*.4,1,0],fov:46,focus:4.4,ap:.14}:{p:[x+1.1,1.25,1.7],l:[x,1.3,0],fov:30,focus:2,ap:.6};
 cam.fov=c.fov;cam.position.set(...c.p);cam.lookAt(...c.l);cam.updateProjectionMatrix();Object.assign(post.P.focus,{value:c.focus});post.P.ap.value=c.ap;post.P.time.value=f*.137%17;post.P.fade.value=Math.max(1-seg(t,0,.5),seg(t,DUR-.6,DUR-.03));post.render(sc,cam);
 return {t,f,sh:s,people:{},contacts:[],sym:0}};
window.CUTF=CUTF;window.DUR=DUR;window.EVENTS=[];window.PLANTS={};window.READY=true;
