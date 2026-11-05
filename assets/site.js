/* Portfolio navigation, animation lifecycle, and isolated first-party app frames. */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = window.MilesPortfolio || {paused: reducedMotion.matches};
  window.MilesPortfolio = state;

  function bind() {
    window.milesCleanup?.();
    const cleanup = [];
    const frames = new Set();
    const on = (node, type, listener, options) => {
      if (!node) return;
      node.addEventListener(type, listener, options);
      cleanup.push(() => node.removeEventListener(type, listener, options));
    };
    const route = path => {
      if (!/^\/(?:projects|apps)\/[a-z0-9-]+\/(?:[a-z0-9.-]+)?(?:\?embed=(?:app|diagram|preview))?(?:#[-a-z0-9]+)?$/.test(path)) return;
      if (window.MilesOfflineApps) window.dispatchEvent(new CustomEvent('miles:route', {detail:path}));
      else window.location.assign(path);
    };
    const menu = document.querySelector('.menu-button');
    const mobile = document.querySelector('.mobile-nav');
    const closeMenu = () => {
      if (!menu || !mobile) return;
      menu.setAttribute('aria-expanded','false'); menu.textContent='Menu +';
      mobile.classList.remove('open');
    };
    on(menu,'click',()=>{
      const open=menu.getAttribute('aria-expanded')!=='true';
      menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close −':'Menu +';
      mobile.classList.toggle('open',open);
    });
    mobile?.querySelectorAll('a').forEach(a=>on(a,'click',closeMenu));
    on(menu,'keydown',e=>{if(e.key==='Escape')closeMenu();});
    on(mobile,'keydown',e=>{if(e.key==='Escape'){closeMenu();menu.focus();}});
    const wide=window.matchMedia('(min-width: 801px)');
    on(wide,'change',e=>{if(e.matches)closeMenu();});

    const sendVisibility = frame => {
      if (!frame.dataset.loaded) return;
      frame.contentWindow?.postMessage({type:'miles:visibility',active:frame.dataset.visible==='true'&&!frame.hidden&&!document.hidden,paused:state.paused},'*');
    };
    const loadFrame = frame => {
      if (frame.dataset.loaded) return;
      const raw=frame.dataset.appSource;
      const url=new URL(raw, 'https://portfolio.invalid');
      const mode=frame.dataset.embedMode||url.searchParams.get('embed')||'app';
      frame.name='miles:workspace:'+mode;
      frame.dataset.loaded='true';
      if (window.MilesOfflineApps?.[url.pathname]) frame.srcdoc=window.MilesOfflineApps[url.pathname];
      else frame.src=raw;
    };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const frame=entry.target;
        frame.dataset.visible=String(entry.isIntersecting);
        if(entry.isIntersecting&&!frame.hidden)loadFrame(frame);
        sendVisibility(frame);
      });
    },{rootMargin:'100px',threshold:0.01}) : null;
    const observeFrame = frame => {
      frames.add(frame);
      if(observer)observer.observe(frame);
      else{frame.dataset.visible=String(!frame.hidden);if(!frame.hidden)loadFrame(frame);}
    };
    const panel=document.querySelector('.workspace-panel');
    const workspaceFrames=document.querySelector('.workspace-frames');
    const workspaceStatus=document.querySelector('[data-workspace-status]');
    const workspaceTabs=[...document.querySelectorAll('[data-workspace-view]')];
    const direct=document.querySelector('[data-workspace-direct]');
    const setWorkspace = button => {
      const key=button.dataset.workspaceView;
      let frame=workspaceFrames.querySelector(`[data-view-key="${key}"]`);
      if(!frame){
        frame=document.createElement('iframe');
        frame.className='workspace-frame';frame.dataset.workspaceFrame='';frame.dataset.viewKey=key;
        frame.dataset.appSource=button.dataset.appSource;
        frame.dataset.embedMode=new URL(button.dataset.appSource,'https://portfolio.invalid').searchParams.get('embed')||'app';
        frame.title=button.textContent.trim();frame.loading='lazy';
        frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-downloads allow-modals allow-pointer-lock');
        frame.setAttribute('allow','fullscreen; clipboard-write');frame.allowFullscreen=true;
        workspaceFrames.append(frame);observeFrame(frame);
      }
      workspaceTabs.forEach(tab=>{const selected=tab===button;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
      workspaceFrames.querySelectorAll('iframe').forEach(other=>{
        other.hidden=other!==frame;sendVisibility(other);
      });
      panel.setAttribute('aria-labelledby',button.id);
      if(direct)direct.href=window.MilesOfflineApps?'#'+button.dataset.appSource:button.dataset.appSource;
      if(workspaceStatus)workspaceStatus.textContent=frame.dataset.error||(frame.dataset.ready?'Ready to explore':'Loading '+button.textContent.trim().toLowerCase()+'…');
      loadFrame(frame);sendVisibility(frame);
    };
    const bindTabs = (buttons, activate) => buttons.forEach((button,index)=>{
      on(button,'click',()=>activate(button));
      on(button,'keydown',event=>{
        let next;
        if(event.key==='ArrowRight')next=(index+1)%buttons.length;
        if(event.key==='ArrowLeft')next=(index-1+buttons.length)%buttons.length;
        if(event.key==='Home')next=0;
        if(event.key==='End')next=buttons.length-1;
        if(next===undefined)return;
        event.preventDefault();activate(buttons[next]);buttons[next].focus();
      });
    });
    bindTabs(workspaceTabs,setWorkspace);
    const heroButtons=[...document.querySelectorAll('[data-hero-project]')];
    const heroPanel=document.querySelector('.hero-project-panel');
    const heroFrame=heroPanel?.querySelector('iframe');
    bindTabs(heroButtons,button=>{
      heroButtons.forEach(tab=>{const selected=tab===button;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
      heroPanel.setAttribute('aria-labelledby',button.id);
      heroFrame.contentWindow?.postMessage({type:'miles:visibility',active:false,paused:true},'*');
      delete heroFrame.dataset.loaded;delete heroFrame.dataset.ready;
      heroFrame.dataset.appSource=button.dataset.appSource;
      heroFrame.title=button.textContent.trim()+' animated preview';
      const open=document.querySelector('[data-hero-open]');
      open.href=window.MilesOfflineApps?'#'+button.dataset.projectHref:button.dataset.projectHref;
      open.setAttribute('aria-label','Explore '+button.textContent.trim()+' inside this website');
      loadFrame(heroFrame);
    });

    on(window,'message',event=>{
      const frame=[...frames].find(f=>f.contentWindow===event.source);
      if(!frame||!event.data||typeof event.data.type!=='string')return;
      if(event.data.type==='miles:ready'){
        frame.dataset.ready='true';delete frame.dataset.error;sendVisibility(frame);
        if(frame.matches('[data-workspace-frame]')&&!frame.hidden&&workspaceStatus)workspaceStatus.textContent='Ready to explore';
      }else if(event.data.type==='miles:error'){
        frame.dataset.error=String(event.data.message).slice(0,240);
        if(!frame.hidden&&workspaceStatus)workspaceStatus.textContent=frame.dataset.error;
      }else if(event.data.type==='miles:navigate'){
        const path=event.data.path;
        if(typeof path!=='string')return;
        const button=workspaceTabs.find(tab=>tab.dataset.appSource===path);
        if(button)setWorkspace(button);else route(path);
      }
    });
    const refreshMotion = () => {
      document.querySelectorAll('[data-motion-toggle]').forEach(button=>{
        button.setAttribute('aria-pressed',String(state.paused));
        button.innerHTML=state.paused
          ?'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>Play previews'
          :'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>Pause previews';
      });
      frames.forEach(sendVisibility);
    };
    document.querySelectorAll('[data-motion-toggle]').forEach(button=>on(button,'click',()=>{state.paused=!state.paused;refreshMotion();}));
    on(reducedMotion,'change',e=>{state.paused=e.matches;refreshMotion();});
    on(document,'visibilitychange',()=>frames.forEach(sendVisibility));
    const expand=document.querySelector('[data-expand-workspace]');
    on(expand,'click',async()=>{
      try{
        if(document.fullscreenElement)await document.exitFullscreen();
        else if(panel.requestFullscreen)await panel.requestFullscreen();
        else if(workspaceStatus)workspaceStatus.textContent='Use Full workspace for a larger view.';
      }catch{if(workspaceStatus)workspaceStatus.textContent='Use Full workspace for a larger view.';}
    });
    on(document,'fullscreenchange',()=>{
      if(expand)expand.innerHTML=document.fullscreenElement?'Exit expanded view <span class="arrow" aria-hidden="true">↙</span>':'Expand view <span class="arrow" aria-hidden="true">↗</span>';
    });
    const filters=[...document.querySelectorAll('[data-filter]')];
    filters.forEach(button=>on(button,'click',()=>{
      filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      let count=0;
      document.querySelectorAll('[data-category]').forEach(card=>{
        card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;
        if(!card.hidden)count++;
        card.querySelectorAll('iframe').forEach(frame=>{
          if(card.hidden)frame.dataset.visible='false';
          sendVisibility(frame);
        });
      });
      const status=document.querySelector('#filter-status');
      if(status)status.textContent=`${count} ${count===1?'project':'projects'} shown`;
    }));
    document.querySelectorAll('[data-preview-frame],[data-workspace-frame]').forEach(observeFrame);
    refreshMotion();
    window.milesCleanup=()=>{
      frames.forEach(frame=>frame.contentWindow?.postMessage({type:'miles:visibility',active:false,paused:true},'*'));
      observer?.disconnect();cleanup.forEach(fn=>fn());window.milesCleanup=null;
    };
  }
  window.milesBind=bind;
  bind();
})();
