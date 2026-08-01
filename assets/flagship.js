(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.page-progress span');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const railLinks = [...document.querySelectorAll('[data-rail-link]')];
  const stageNodes = [...document.querySelectorAll('[data-stage-node]')];
  const connectors = [...document.querySelectorAll('[data-connector]')];
  const stageIndex = document.querySelector('[data-stage-index]');
  const stageState = document.querySelector('[data-stage-state]');
  const stageTitle = document.querySelector('[data-stage-title]');
  const stageDescription = document.querySelector('[data-stage-description]');
  const chapterIndex = document.querySelector('[data-chapter-index]');
  const chapterState = document.querySelector('[data-chapter-state]');
  const stageRule = document.querySelector('.stage-rule span');

  const descriptions = {
    '01':'Hold the human, the work, and the proof in the same operating picture.',
    '02':'Systems judgment begins with proximity to real consequences.',
    '03':'Orient, structure, translate, verify, and leave recourse.',
    '04':'A claim opens onto its exact proof object and its boundary.',
    '05':'Translate job titles into recurring responsibilities and evidence burdens.',
    '06':'The environment changed; the operating responsibility repeated.',
    '07':'Apply the practice where customers, operators, and systems must stay aligned.'
  };

  const updateChrome = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const ratio = max > 0 ? scrollY / max : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;
    header?.classList.toggle('scrolled', scrollY > 24);
  };
  addEventListener('scroll', updateChrome, {passive:true});
  updateChrome();

  navToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(Boolean(open)));
    navToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded','false');
    navToggle?.setAttribute('aria-label','Open navigation menu');
  }));

  let activeScene = null;
  const activateScene = scene => {
    if (!scene || scene === activeScene) return;
    activeScene = scene;
    const index = scene.dataset.sceneIndex || '01';
    const state = scene.dataset.sceneState || '';
    const title = scene.dataset.sceneTitle || '';
    const active = new Set((scene.dataset.sceneActive || '').split(',').filter(Boolean));
    scenes.forEach(s => s.classList.toggle('scene-active', s === scene));
    railLinks.forEach(link => link.classList.toggle('active', link.dataset.railLink === index));
    stageNodes.forEach(node => node.classList.toggle('active', active.has(node.dataset.stageNode)));
    connectors.forEach(path => {
      const ends = (path.dataset.connector || '').split(',');
      path.classList.toggle('active', ends.every(end => active.has(end)));
    });
    [stageIndex, chapterIndex].forEach(el => { if (el) el.textContent = `${index.padStart(2,'0')} / 07`; });
    [stageState, chapterState].forEach(el => { if (el) el.textContent = state; });
    if (stageTitle) stageTitle.textContent = title;
    if (stageDescription) stageDescription.textContent = descriptions[index] || '';
    if (stageRule) stageRule.style.width = `${(Number(index) / 7) * 100}%`;
  };

  const findActiveScene = () => {
    if (!scenes.length) return;
    const anchor = innerHeight * 0.42;
    let best = scenes[0];
    let bestDistance = Infinity;
    for (const scene of scenes) {
      const rect = scene.getBoundingClientRect();
      const target = Math.min(Math.max(anchor, rect.top), rect.bottom);
      const distance = Math.abs(target - anchor) + (rect.bottom < 0 || rect.top > innerHeight ? 10000 : 0);
      if (distance < bestDistance) { bestDistance = distance; best = scene; }
    }
    activateScene(best);
  };
  addEventListener('scroll', findActiveScene, {passive:true});
  addEventListener('resize', findActiveScene);
  findActiveScene();

  const canvas = document.querySelector('[data-world-canvas]');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d', {alpha:true});
    let width = 0, height = 0, dpr = 1, points = [], raf = 0, pointerX = .7, pointerY = .42;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count = Math.min(85, Math.max(38, Math.floor(width / 20)));
      points = Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.09,vy:(Math.random()-.5)*.06,r:Math.random()*1.15+.25,phase:Math.random()*Math.PI*2}));
    };
    const draw = t => {
      ctx.clearRect(0,0,width,height);
      const gx = width*pointerX, gy = height*pointerY;
      for (const p of points) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = width+20; if (p.x > width+20) p.x = -20;
        if (p.y < -20) p.y = height+20; if (p.y > height+20) p.y = -20;
      }
      ctx.lineWidth = .55;
      for (let i=0;i<points.length;i++) {
        const a=points[i];
        const pd=Math.hypot(a.x-gx,a.y-gy);
        if (pd<260) {ctx.strokeStyle=`rgba(125,228,255,${(1-pd/260)*.13})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(gx,gy);ctx.stroke();}
        for(let j=i+1;j<points.length;j++){const b=points[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<110){ctx.strokeStyle=`rgba(125,228,255,${(1-d/110)*.065})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}
        const pulse=.55+.45*Math.sin(t*.0005+a.phase);ctx.fillStyle=`rgba(190,235,255,${.22*pulse})`;ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();
      }
      raf=requestAnimationFrame(draw);
    };
    canvas.addEventListener('pointermove', e => {const r=canvas.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width;pointerY=(e.clientY-r.top)/r.height;});
    addEventListener('resize', resize); resize(); raf=requestAnimationFrame(draw);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else raf=requestAnimationFrame(draw);});
  }

  if (!reduceMotion && innerWidth > 720) {
    const reveal = [...document.querySelectorAll('.practice-sequence article,.feature-case,.secondary-case,.wide-case,.proof-roadmap article,.trajectory-line article,.library-case')];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([{opacity:0,transform:'translateY(30px)'},{opacity:1,transform:'translateY(0)'}],{duration:720,easing:'cubic-bezier(.2,.75,.2,1)',fill:'both'});
      observer.unobserve(entry.target);
    }),{threshold:.08});
    reveal.forEach(el => observer.observe(el));
  }
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => print()));
})();
