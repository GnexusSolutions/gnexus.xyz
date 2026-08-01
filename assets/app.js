(async () => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const host = document.querySelector('#world-story[data-fragments]');
  if (host) {
    const names = host.dataset.fragments.split(',').map(x => x.trim()).filter(Boolean);
    try {
      const fragments = await Promise.all(names.map(async name => {
        const response = await fetch(`content/${name}.html`);
        if (!response.ok) throw new Error(`${name}: ${response.status}`);
        return response.text();
      }));
      host.innerHTML = fragments.join('');
    } catch (error) {
      host.innerHTML = `<section class="chapter"><p class="eyebrow">Portfolio loading boundary</p><h2>The supporting chapters could not be loaded.</h2><p class="chapter-intro">Open the <a href="resume.html">professional profile</a> or contact <a href="mailto:cymaticswilliams@pm.me">cymaticswilliams@pm.me</a>.</p></section>`;
      console.error(error);
    }
  }

  const progress = document.querySelector('.page-progress span');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const railLinks = [...document.querySelectorAll('[data-rail-link]')];
  const stageIndex = document.querySelector('.stage-index');
  const stageState = document.querySelector('.stage-state');
  const stageLabel = document.querySelector('.stage-label');
  const stageTitle = document.querySelector('.stage-copy h3');
  const stageNodes = [...document.querySelectorAll('[data-stage-node]')];
  const stageRule = document.querySelector('.stage-rule span');

  const setProgress = () => {
    if (!progress) return;
    const height = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${height > 0 ? (scrollY / height) * 100 : 0}%`;
  };
  addEventListener('scroll', setProgress, {passive:true});
  setProgress();

  navToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded','false');
  }));

  const activateScene = scene => {
    if (!scene) return;
    scenes.forEach(s => s.classList.toggle('scene-active', s === scene));
    const index = scene.dataset.sceneIndex || '00';
    const active = (scene.dataset.sceneActive || '').split(',').filter(Boolean);
    if (stageIndex) stageIndex.textContent = `${index.padStart(2,'0')} / 06`;
    if (stageState) stageState.textContent = scene.dataset.sceneState || '';
    if (stageLabel) stageLabel.textContent = scene.dataset.sceneLabel || '';
    if (stageTitle) stageTitle.textContent = scene.dataset.sceneTitle || '';
    stageNodes.forEach(node => node.classList.toggle('active', active.includes(node.dataset.stageNode)));
    if (stageRule) stageRule.style.width = `${Math.max(18,(Number(index)/6)*100)}%`;
    railLinks.forEach(link => link.classList.toggle('active', link.dataset.railLink === index));
  };

  if (scenes.length) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(x => x.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (visible) activateScene(visible.target);
    }, {rootMargin:'-24% 0px -46% 0px',threshold:[0,.15,.35,.6]});
    scenes.forEach(scene => observer.observe(scene));
    activateScene(scenes[0]);
  }

  const filters = [...document.querySelectorAll('[data-filter]')];
  const capabilityRows = [...document.querySelectorAll('.capability-ledger article')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.classList.toggle('active', b === button));
    const filter = button.dataset.filter;
    capabilityRows.forEach(row => row.hidden = filter !== 'all' && !row.dataset.fit.split(' ').includes(filter));
  }));

  if (!reduceMotion) {
    const hero = document.querySelector('.hero-system');
    hero?.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX-rect.left)/rect.width-.5;
      const y = (event.clientY-rect.top)/rect.height-.5;
      hero.querySelector('.system-frame').style.transform = `perspective(1100px) rotateY(${x*3.5}deg) rotateX(${-y*3.5}deg)`;
    });
    hero?.addEventListener('pointerleave', () => hero.querySelector('.system-frame').style.transform='');
    const reveal = [...document.querySelectorAll('.feature-case,.secondary-case,.trajectory-era,.capability-ledger article,.evidence-row')];
    reveal.forEach(el => el.style.opacity='0');
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});
      revealObserver.unobserve(entry.target);
    }),{threshold:.08});
    reveal.forEach(el => revealObserver.observe(el));
  }
})();
