// ===== STICKMAN 3D: three.js helpers, the character rig and the post pipeline. =====
// Run `npm i three@0.169.0` in the film folder first. 3D renders about 8 times slower than 2D.
// It must still look like the flat 2D style: flat colours, soft light, rim, purple dusk palette.
import * as T from 'three';
export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const lerp=(a,b,t)=>a+(b-a)*t;
export const ease=t=>{t=clamp(t);return t*t*(3-2*t)};
export const seg=(t,a,b)=>clamp((t-a)/(b-a));
export function kf(t,k){if(t<=k[0][0])return k[0][1];for(let i=1;i<k.length;i++)if(t<k[i][0])return lerp(k[i-1][1],k[i][1],ease((t-k[i-1][0])/(k[i][0]-k[i-1][0])));return k[k.length-1][1]}
export function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
export const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
export const rimU={col:{value:new T.Color('#ffc496')},k:{value:.16}};
export function mat(c,o={}){const noR=o.rim===0;o=Object.assign({},o);delete o.rim;const m=new T.MeshStandardMaterial(Object.assign({color:c,roughness:.72,metalness:0},o));
 if(!noR)m.onBeforeCompile=s=>{s.uniforms.rimC=rimU.col;s.uniforms.rimK=rimU.k;s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nuniform vec3 rimC;uniform float rimK;').replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\nfloat rimF=pow(1.0-clamp(dot(normalize(vViewPosition),normal),0.,1.),3.5);totalEmissiveRadiance+=rimC*rimF*rimK;')};
 return m}
export function mesh(g,m,sh=true){const o=new T.Mesh(g,m);o.castShadow=sh;o.receiveShadow=true;return o}
const UP=V(0,1,0);
function setLimb(o,a,b,L){o.position.copy(a).add(b).multiplyScalar(.5);const d=b.clone().sub(a),l=d.length()||1e-4;o.quaternion.setFromUnitVectors(UP,d.divideScalar(l));o.scale.y=l/L}
export function ik3(a,t,l1,l2,pole){let dv=t.clone().sub(a),d=dv.length();const over=Math.max(0,d-(l1+l2-.002));d=clamp(d,Math.abs(l1-l2)+.01,l1+l2-.002);const dir=dv.normalize(),x=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-x*x)),pp=pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();return {e:a.clone().add(dir.clone().multiplyScalar(x)).add(pp.multiplyScalar(h)),h:a.clone().add(dir.clone().multiplyScalar(d)),over}}
export const THIGH=.33,SHIN=.33,SPINE=.52,UA=.27,FA=.26,HR=.23,STAND=.72,ANK=.07;
export const HERO={skin:'#F8E9CC',cloth:'#FF6B5E',hood:'#E4493F',face:'#1c1a2b',leg:'#2C2A49',shoe:'#17141F'};
export const FRIEND={skin:'#17141F',cloth:'#F6B73C',hood:'#D9962A',face:'#FFFFFF',leg:'#3A2F55',shoe:'#17141F'};
export const WOMAN={skin:'#E9C6A0',cloth:'#2DB2AE',hood:'#187E86',face:'#1c1a2b',leg:'#2C2A49',shoe:'#17141F',bun:'#3A2030'};
export class Person{
 constructor(sc,c){this.c=c;const g=this.g=new T.Group();sc.add(g);const cl=mat(c.cloth),hd=mat(c.hood),lg=mat(c.leg),sk=mat(c.skin,{roughness:.6}),sh=mat(c.shoe),ink=new T.MeshBasicMaterial({color:c.face});
  const cap=(r,L,m)=>{const o=mesh(new T.CapsuleGeometry(r,L,6,14),m);g.add(o);return o};this.torso=mesh(new T.CapsuleGeometry(.215,.3,8,20),cl);g.add(this.torso);this.hoodM=mesh(new T.TorusGeometry(.13,.062,10,24),hd);g.add(this.hoodM);this.back=mesh(new T.SphereGeometry(.16,16,12),hd);g.add(this.back);
  this.limbs={};for(const k of ['l','r']){const L=this.limbs[k]={th:cap(.088,THIGH,lg),sh:cap(.07,SHIN,lg),ua:cap(.07,UA,cl),fa:cap(.058,FA,cl),shoe:mesh(new T.CapsuleGeometry(.058,.16,4,10),sh),fist:mesh(new T.SphereGeometry(.066,14,12),sk)};g.add(L.shoe,L.fist)}
  const H=this.head=new T.Group();g.add(H);H.add(mesh(new T.SphereGeometry(HR,32,24),sk));this.eyes=[];this.brows=[];const eG=new T.SphereGeometry(1,12,10),bG=new T.CapsuleGeometry(.0085,.058,3,6);
  for(const s of [-1,1]){const e=new T.Mesh(eG,ink);e.rotation.y=s*.38;H.add(e);this.eyes.push(e);const b=new T.Mesh(bG,ink);b.position.z=.2;b.rotation.y=s*.4;H.add(b);this.brows.push(b)}
  this.mouth=new T.Mesh(new T.BufferGeometry(),ink);H.add(this.mouth);if(c.bun){const b=mesh(new T.SphereGeometry(.1,14,12),mat(c.bun));b.position.set(0,.2,-.13);H.add(b)}}
 // p: pos yaw lean breath feet{l,r} hands{l,r} pole{l,r} hand{l:'fist'} hy hp hr face{mouth,brow,sad,blink,look,lookY}
 pose(p){const yaw=p.yaw,lean=p.lean||0,F=V(Math.sin(yaw),0,Math.cos(yaw)),S=V(Math.cos(yaw),0,-Math.sin(yaw)),P=V(...p.pos),U=UP.clone().multiplyScalar(Math.cos(lean)).add(F.clone().multiplyScalar(Math.sin(lean))).normalize(),Fd=F.clone().sub(U.clone().multiplyScalar(F.dot(U))).normalize(),Sd=U.clone().cross(Fd).normalize(),C=P.clone().add(U.clone().multiplyScalar(SPINE)),q=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(Sd,U,Fd)),br=Math.sin(p.breath||0)*.006;
  this.torso.position.copy(P).add(U.clone().multiplyScalar(.24));this.torso.quaternion.copy(q);this.torso.scale.set(1.24,1+br,.9);const nk=C.clone().add(U.clone().multiplyScalar(.05));this.hoodM.position.copy(nk).add(Fd.clone().multiplyScalar(-.01));this.hoodM.quaternion.copy(q).multiply(new T.Quaternion().setFromEuler(new T.Euler(Math.PI/2-.2,0,0)));this.back.position.copy(nk).add(Fd.clone().multiplyScalar(-.1)).add(U.clone().multiplyScalar(-.03));this.back.scale.set(1.15,.8,.7);this.back.quaternion.copy(q);
  const out={};for(const k of ['l','r']){const s=k=='l'?1:-1,L=this.limbs[k],hip=P.clone().add(Sd.clone().multiplyScalar(s*.115)),ft=V(...p.feet[k]),ki=ik3(hip,ft,THIGH,SHIN,F.clone().add(V(0,.1,0)));setLimb(L.th,hip,ki.e,THIGH);setLimb(L.sh,ki.e,ki.h,SHIN);L.shoe.position.copy(ft).add(V(Math.sin(yaw)*.06,-.012,Math.cos(yaw)*.06));L.shoe.quaternion.setFromUnitVectors(UP,V(Math.sin(yaw),0,Math.cos(yaw)));
   const sh=C.clone().add(U.clone().multiplyScalar(-.07)).add(Sd.clone().multiplyScalar(s*.255)),ht=p.hands?.[k]?V(...p.hands[k]):sh.clone().add(U.clone().multiplyScalar(-.5)).add(Sd.clone().multiplyScalar(s*.05)).add(Fd.clone().multiplyScalar(.03)),pole=p.pole?.[k]?V(...p.pole[k]):Fd.clone().multiplyScalar(-1).add(Sd.clone().multiplyScalar(s*.5)).add(U.clone().multiplyScalar(-.25)),ar=ik3(sh,ht,UA,FA,pole);setLimb(L.ua,sh,ar.e,UA);setLimb(L.fa,ar.e,ar.h,FA);L.fist.visible=p.hand?.[k]=='fist';L.fist.position.copy(ar.h).add(ar.h.clone().sub(ar.e).normalize().multiplyScalar(.035));out[k]={hand:ar.h,elbow:ar.e,over:ar.over,foot:ft}}
  this.head.position.copy(C).add(U.clone().multiplyScalar(.07+HR-.02));this.head.quaternion.copy(q).multiply(new T.Quaternion().setFromEuler(new T.Euler(p.hp||0,p.hy||0,p.hr||0,'YXZ')));const f=p.face||{},bl=f.blink||0,lx=(f.look||0)*.03,ly=(f.lookY||0)*.018;
  this.eyes.forEach((e,i)=>{const s=i?1:-1;e.position.set(s*.085+lx,.035+ly,.214);e.scale.set(.019,lerp(.034,.004,bl),.008)});this.brows.forEach((b,i)=>{const s=i?1:-1;b.position.y=.115+(f.brow||0)*.022+ly;b.position.x=s*.085+lx;b.rotation.z=Math.PI/2+s*(f.sad||0)*.3});
  const m=f.mouth||0,mw=.07,c=(x,y)=>{const v=V(x+lx,y,0);v.z=Math.sqrt(Math.max(.001,.0545-x*x-y*y));return v},cv=new T.QuadraticBezierCurve3(c(-mw,-.095+m*.022),c(0,-.095-m*.055),c(mw,-.095+m*.022));this.mouth.geometry.dispose();this.mouth.geometry=new T.TubeGeometry(cv,8,.0085,6,false);return out}}
// foot-locked gait along a line. s = distance walked, L = stride.
export function gait(s,L){const p=s/L,n=Math.floor(p),u=p-n,st=(n+.5)*L,a=(n-.5)*L,b=(n+1.5)*L,sx=lerp(a,b,ease(u)),lift=Math.sin(u*Math.PI)*.1,even=n%2==0,pl=[st,0],pr=[sx,lift];return{l:even?pl:pr,r:even?pr:pl,bob:Math.abs(Math.sin(u*Math.PI))*.018,n}}
export const texture=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t};
// post: bloom from bright lights, depth of field, tone map, vignette, grain, soft grade
export function makePost(R,W=1920,H=1080){const dt=new T.DepthTexture(W,H,T.UnsignedIntType),rt=new T.WebGLRenderTarget(W,H,{samples:4,type:T.HalfFloatType,depthTexture:dt,colorSpace:T.LinearSRGBColorSpace}),qs=new T.Scene(),qc=new T.OrthographicCamera(-1,1,1,-1,0,1),qm=new T.Mesh(new T.PlaneGeometry(2,2));qs.add(qm);
 const vs='varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}',bW=W/3|0,bH=H/3|0,bA=new T.WebGLRenderTarget(bW,bH,{type:T.HalfFloatType}),bB=new T.WebGLRenderTarget(bW,bH,{type:T.HalfFloatType});
 const brM=new T.ShaderMaterial({vertexShader:vs,uniforms:{t:{value:rt.texture}},fragmentShader:'uniform sampler2D t;varying vec2 v;void main(){vec3 c=texture2D(t,v).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(1.25,2.4,l),1.);}'}),blM=new T.ShaderMaterial({vertexShader:vs,uniforms:{t:{value:null},d:{value:new T.Vector2()}},fragmentShader:'uniform sampler2D t;uniform vec2 d;varying vec2 v;void main(){vec3 c=texture2D(t,v).rgb*.227;for(float i=1.;i<5.;i++){float w=.1945*exp(-(i-1.)*(i-1.)/5.);c+=(texture2D(t,v+d*i*1.4).rgb+texture2D(t,v-d*i*1.4).rgb)*w;}gl_FragColor=vec4(c,1.);}'});
 const P={c:{value:rt.texture},dp:{value:dt},bl:{value:bA.texture},focus:{value:3},ap:{value:0},near:{value:.05},far:{value:60},fade:{value:0},time:{value:0}};
 const coM=new T.ShaderMaterial({vertexShader:vs,uniforms:P,depthTest:false,depthWrite:false,fragmentShader:`uniform sampler2D c,dp,bl;uniform float focus,ap,near,far,fade,time;varying vec2 v;
float lz(vec2 u){float d=texture2D(dp,u).x*2.-1.;return 2.*near*far/(far+near-d*(far-near));}
vec3 aces(vec3 x){return clamp(x*(2.51*x+.03)/(x*(2.43*x+.59)+.14),0.,1.);}
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){float z=lz(v);float coc=clamp(abs(z-focus)/max(z,.1)*ap,0.,1.);vec2 px=vec2(1./1920.,1./1080.);vec3 s=texture2D(c,v).rgb;float n=1.;
 if(coc>.02){float R=coc*22.;for(float i=1.;i<=18.;i++){float a=i*2.39996,r=sqrt(i/18.)*R;vec2 o=vec2(cos(a),sin(a))*r*px;float zz=lz(v+o);float k=zz<z-.05?clamp(abs(zz-focus)/max(zz,.1)*ap*1.6,0.,1.):1.;s+=texture2D(c,v+o).rgb*k;n+=k;}s/=n;}
 vec3 col=s+texture2D(bl,v).rgb*.55;col=aces(col*.92);col=pow(col,vec3(1./2.2));vec2 q=v-.5;float vg=smoothstep(.34,.86,length(q*vec2(1.,.82)));col*=1.-vg*.52;col+=(h(v*vec2(1920.,1080.)+time)-.5)*.03;col*=1.-fade;gl_FragColor=vec4(col,1.);}`});
 return {P,render(sc,cam){R.setRenderTarget(rt);R.clear();R.render(sc,cam);qm.material=brM;R.setRenderTarget(bB);R.render(qs,qc);for(let i=0;i<2;i++){blM.uniforms.t.value=bB.texture;blM.uniforms.d.value.set(1/bW,0);qm.material=blM;R.setRenderTarget(bA);R.render(qs,qc);blM.uniforms.t.value=bA.texture;blM.uniforms.d.value.set(0,1/bH);R.setRenderTarget(bB);R.render(qs,qc)}blM.uniforms.t.value=bB.texture;blM.uniforms.d.value.set(.5/bW,0);R.setRenderTarget(bA);R.render(qs,qc);qm.material=coM;R.setRenderTarget(null);R.render(qs,qc)}}}
export function makeRenderer(){const R=new T.WebGLRenderer({canvas:document.getElementById('c'),antialias:false,preserveDrawingBuffer:true});R.setSize(1920,1080,false);R.setPixelRatio(1);R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;R.toneMapping=T.NoToneMapping;R.outputColorSpace=T.LinearSRGBColorSpace;return R}
