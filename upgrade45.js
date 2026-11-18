/* LIMIT BREAK 4.5 - Fitness Park La Maquinista personalized offline extensions */
'use strict';
(function(){
 const origAction=action, origTraining=training, origSettings=settings, origPool=choosePool, origArt=exerciseArt;
 const available=['Máquina guiada','Mancuernas','Barra','Polea','Peso corporal'];
 db.gym45=db.gym45||{club:'Fitness Park La Maquinista',enabled:[...available],favIds:[],blockedIds:[]};
 db.personal45=db.personal45||[];
 db.photos45=db.photos45||{};
 db.live45=db.live45||null;
 let timerEnd=0,timerId=null;
 function syncCustom(){
  for(const x of db.personal45){if(!EXERCISES.some(e=>e.id===x.id))EXERCISES.push(x)}
 }
 syncCustom();
 function enabled(e){return db.gym45.enabled.some(x=>e.equipment===x)||e.equipment==='Otra'}
 choosePool=function(muscle,equipment){
   const pool=origPool(muscle,equipment).filter(x=>enabled(x)&&!db.gym45.blockedIds.includes(x.id));
   const favs=new Set(db.gym45.favIds);
   return pool.map((x,i)=>({x,i})).sort((a,b)=>Number(favs.has(b.x.id))-Number(favs.has(a.x.id))||a.i-b.i).map(z=>z.x);
 };
 exerciseArt=function(ex){
   const id=ex.exerciseId||ex.id;
   const photo=db.photos45[id];
   return photo?`<img src="${photo}" alt="Foto personalizada de ${esc(ex.name)}" loading="lazy">`:origArt(ex);
 };
 function tabBar(){return `<button data-train-tab="mygym" class="${trainingTab==='mygym'?'active':''}">Mi Fitness Park</button>`}
 training=function(){
   if(trainingTab!=='mygym'){
     return origTraining().replace(/<div class="tabs">[\s\S]*?<\/div>/,m=>m.replace('</div>',tabBar()+'</div>'));
   }
   trainingTab='week';
   const base=origTraining();
   trainingTab='mygym';
   const match=base.match(/<div class="tabs">[\s\S]*?<\/div>/);
   if(!match)return gymPanel();
   const end=base.indexOf(match[0])+match[0].length;
   return base.slice(0,end).replace(/<\/div>$/,tabBar()+'</div>')+gymPanel();
 };
 function gymPanel(){const g=db.gym45;return `<div class="card"><p class="eyebrow">MI GIMNASIO / BARCELONA</p><h2>Fitness Park La Maquinista</h2><p class="sub">Selecciona únicamente el material disponible en tu club. No se incluyen Burning Park ni Cycle Park.</p><form id="gym45Form"><div class="field" style="margin-top:18px"><span class="label">Equipamiento disponible</span><div class="checkboxes">${available.map(k=>`<label class="check"><input name="gymEquip45" type="checkbox" value="${esc(k)}" ${g.enabled.includes(k)?'checked':''}>${esc(k)}</label>`).join('')}</div></div><div class="actions"><button class="btn" type="submit">Guardar mi gimnasio</button></div></form><div class="divider"></div>${headline('Mi biblioteca personal',`${db.personal45.length} ejercicios añadidos · ${g.favIds.length} favoritos · ${g.blockedIds.length} excluidos`,'new-custom45','+ Nuevo ejercicio')}<p class="hint">En la pestaña Ejercicios puedes marcar favoritos, excluir ejercicios y ponerles tus propias fotos. Se guarda solo en este dispositivo.</p><div class="list">${db.personal45.map(x=>`<div class="exercise"><div class="exercise-art">${exerciseArt(x)}</div><div class="exercise-meta"><h4>${esc(x.name)}</h4><p>${esc(x.muscle)} · ${esc(x.equipment)}</p></div><div class="exercise-actions"><button data-action="edit-custom45" data-id="${esc(x.id)}">Editar</button></div></div>`).join('')}</div></div>`}
 const priorLibrary=libraryPanel;
 libraryPanel=function(){let html=priorLibrary();return html.replaceAll('data-action="library-detail"', 'data-action="library-detail"').replace(/<div class="exercise-actions"><button data-action="library-detail" data-exercise="(.*?)">Ver técnica<\/button><\/div>/g,(_,id)=>{
  const fav=db.gym45.favIds.includes(id),ban=db.gym45.blockedIds.includes(id);
  return `<div class="exercise-actions"><button data-action="library-detail" data-exercise="${id}">Ver técnica</button><button data-action="toggle-fav45" data-id="${id}">${fav?'★ Favorito':'☆ Favorito'}</button><button data-action="toggle-block45" data-id="${id}">${ban?'✓ Habilitar':'⊘ Excluir'}</button><button data-action="photo-exercise45" data-id="${id}">📷 Foto</button></div>`;
 }).replace('<div class="flow"', '<div class="actions"><button class="btn outline sm" data-action="new-custom45">+ Añadir ejercicio</button></div><div class="flow"')}
 const priorSessionCard=sessionCard;
 sessionCard=function(s){return priorSessionCard(s).replace('data-action="start-session"','data-action="live-open45"') .replace('✓ Registrar esta sesión','▶ Entrenar en directo') + (selectedDay===s.day?`<div class="actions" style="padding:0 18px 18px"><button class="btn outline sm" data-action="start-session" data-day="${s.day}">Registrar sesión sin modo directo</button></div>`:'')}
 settings=function(){const old=origSettings();return old+`<div class="card section"><p class="eyebrow">CONTROL PERSONAL</p><h2>Configuración avanzada</h2><p class="sub">Sin usuarios, servidor ni suscripciones. Tus cambios no se sincronizan automáticamente entre dispositivos.</p><div class="actions"><button class="btn" data-action="open-gym45">⚙ Mi Fitness Park</button><button class="btn outline" data-action="new-custom45">+ Añadir ejercicio</button><button class="btn outline" data-action="training">Ver mis rutinas</button></div></div>`}
 function customModal(id){const found=db.personal45.find(x=>x.id===id),x=found||{name:'',muscle:'Pecho',equipment:'Máquina guiada',movement:'',tip:''};
   modal(found?'Editar ejercicio personal':'Nuevo ejercicio personal',`<form id="custom45Form" data-id="${esc(id||'')}"><div class="fields">${fld('custName45','Nombre',x.name,'text','required')}${sel('custMuscle45','Músculo',MUSCLES.map(t=>[t,t]),x.muscle)}${sel('custEquip45','Modalidad',available.map(t=>[t,t]),x.equipment)}${fld('custMove45','Tipo de movimiento',x.movement)}<div class="field wide">${fld('custTip45','Consejo técnico breve',x.tip)}</div></div><div class="actions"><button class="btn" type="submit">Guardar ejercicio</button>${found?`<button class="btn outline" type="button" data-action="delete-custom45" data-id="${esc(id)}">Eliminar</button>`:''}</div><p class="hint">Puedes subir una fotografía propia desde la biblioteca después de guardar.</p></form>`)
 }
 function photoModal45(id){const e=EXERCISES.find(x=>x.id===id);if(!e)return;modal('Foto del ejercicio',`<form id="photo45Form" data-id="${esc(id)}"><p class="sub">${esc(e.name)} · fotografía tomada por ti o con permiso de uso. Se guarda en tu navegador, no en GitHub.</p><div class="field" style="margin-top:16px"><label for="exerciseFile45">Foto (máximo 12 MB)</label><input id="exerciseFile45" type="file" accept="image/*" required></div><div class="actions"><button class="btn" type="submit">Guardar foto</button>${db.photos45[id]?`<button type="button" class="btn outline" data-action="remove-photo45" data-id="${esc(id)}">Quitar foto</button>`:''}</div></form>`)}
 async function saveImage45(file,id){if(!file||file.size>12*1024*1024)throw new Error('Selecciona una foto de hasta 12 MB');const url=URL.createObjectURL(file);try{let im=new Image();await new Promise((yes,no)=>{im.onload=yes;im.onerror=no;im.src=url});let ratio=Math.min(1,750/Math.max(im.width,im.height));let c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*ratio));c.height=Math.max(1,Math.round(im.height*ratio));c.getContext('2d').drawImage(im,0,0,c.width,c.height);let prev=db.photos45[id];db.photos45[id]=c.toDataURL('image/jpeg',.65);if(!persist()){if(prev)db.photos45[id]=prev;else delete db.photos45[id];throw Error('Sin espacio: exporta tus datos o reduce las fotos')}closeModal();render();toast('Foto personalizada guardada')}finally{URL.revokeObjectURL(url)}}
 function initLive(day){const s=getSession(day);if(!s)return;let saved=db.live45;if(!saved||saved.day!==day||!saved.items?.length){saved={day,date:localDay(),startedAt:new Date().toISOString(),items:s.exercises.map(e=>({id:e.id,exerciseId:e.exerciseId,name:e.name,sets:Array.from({length:Math.max(1,Math.min(10,n(e.sets)||4))},()=>({reps:parseInt(e.reps)||10,kg:n(e.weight),done:false}))})),notes:'',energy:3};db.live45=saved;persist()}showLive()}
 function showLive(){const v=db.live45;if(!v)return;const done=v.items.reduce((t,e)=>t+e.sets.filter(s=>s.done).length,0),total=v.items.reduce((t,e)=>t+e.sets.length,0);
  modal('Entrenamiento en directo',`<div class="live-summary"><span class="badge">${DAY[v.day]} · Fitness Park La Maquinista</span><strong>${done}/${total} series registradas</strong><button class="btn outline sm" data-action="rest-start45">⏱ Descanso 90 s</button><span id="rest45"></span></div><div class="list">${v.items.map((e,i)=>`<div class="live-exercise"><h3>${i+1}. ${esc(e.name)}</h3><div class="live-series">${e.sets.map((s,j)=>`<div class="live-line ${s.done?'completed':''}"><span>Serie ${j+1}</span><label>Kg<input type="number" data-live-i="${i}" data-live-j="${j}" data-live-field="kg" min="0" step="0.5" value="${n(s.kg)}"></label><label>Reps<input type="number" data-live-i="${i}" data-live-j="${j}" data-live-field="reps" min="0" max="100" value="${n(s.reps)}"></label><button type="button" class="btn sm ${s.done?'outline':''}" data-action="live-toggle45" data-i="${i}" data-j="${j}">${s.done?'✓ Hecha':'Hecho'}</button></div>`).join('')}</div></div>`).join('')}</div><div class="field"><label for="energy45">Energía (1 a 5)</label><select id="energy45" data-live-meta="energy">${[1,2,3,4,5].map(k=>`<option value="${k}" ${v.energy==k?'selected':''}>${k} / 5</option>`).join('')}</select></div><div class="field"><label for="liveNotes45">Notas y molestias</label><textarea id="liveNotes45" data-live-meta="notes" rows="2">${esc(v.notes||'')}</textarea></div><div class="actions"><button class="btn" data-action="live-finish45">✓ Terminar y guardar</button><button class="btn outline" data-action="live-discard45">Descartar sesión</button></div><p class="hint">Las series se guardan durante el entrenamiento en este dispositivo. No se sincronizan entre iPhone y ordenador.</p>`);
  if(timerEnd>Date.now())updateTimer()}
 function updateTimer(){clearInterval(timerId);const tick=()=>{const el=document.getElementById('rest45');if(!el){clearInterval(timerId);return}let left=Math.max(0,Math.ceil((timerEnd-Date.now())/1000));el.textContent=left?`Descanso: ${left} s`:'Descanso terminado';if(!left)clearInterval(timerId)};tick();timerId=setInterval(tick,1000)}
 function finishLive(){let v=db.live45;if(!v)return;const completed=v.items.flatMap(e=>e.sets).filter(s=>s.done).length;if(!completed){toast('Marca al menos una serie como realizada');return}const s=getSession(v.day);db.logs.push({id:uid(),type:'gym',date:v.date,title:s?.title||'Entreno Fitness Park',minutes:Math.max(1,Math.round((Date.now()-Date.parse(v.startedAt))/60000)),status:'completed',notes:v.notes||'',energy:v.energy,exercises:v.items.map(e=>({exerciseId:e.exerciseId,name:e.name,sets:e.sets.map(x=>({...x}))}))});db.live45=null;persist();closeModal();render();toast('Entrenamiento y series guardados')}
 action=function(name,el){let id=el.dataset.id;switch(name){
  case'open-gym45':page='training';trainingTab='mygym';render();break;
  case'new-custom45':customModal('');break;
  case'edit-custom45':customModal(id);break;
  case'delete-custom45':if(confirm('Eliminar este ejercicio personal de la biblioteca?')){db.personal45=db.personal45.filter(x=>x.id!==id);let idx=EXERCISES.findIndex(x=>x.id===id);if(idx>=0)EXERCISES.splice(idx,1);delete db.photos45[id];persist();closeModal();render()}break;
  case'toggle-fav45':db.gym45.favIds=db.gym45.favIds.includes(id)?db.gym45.favIds.filter(x=>x!==id):[...db.gym45.favIds,id];persist();render();break;
  case'toggle-block45':db.gym45.blockedIds=db.gym45.blockedIds.includes(id)?db.gym45.blockedIds.filter(x=>x!==id):[...db.gym45.blockedIds,id];persist();render();break;
  case'photo-exercise45':photoModal45(id);break;
  case'remove-photo45':delete db.photos45[id];persist();closeModal();render();toast('Foto quitada');break;
  case'live-open45':initLive(Number(el.dataset.day));break;
  case'live-toggle45':{let item=db.live45?.items[Number(el.dataset.i)]?.sets[Number(el.dataset.j)];if(item){item.done=!item.done;persist();showLive()}break}
  case'rest-start45':timerEnd=Date.now()+90000;updateTimer();break;
  case'live-finish45':finishLive();break;
  case'live-discard45':if(confirm('¿Descartar esta sesión sin guardar en el historial?')){db.live45=null;persist();closeModal();render()}break;
  default:origAction(name,el)
 }};
 document.addEventListener('input',e=>{let input=e.target;if(input.dataset.liveMeta&&db.live45){db.live45[input.dataset.liveMeta]=input.dataset.liveMeta==='energy'?n(input.value):input.value;persist()}if(input.dataset.liveI!==undefined&&db.live45){const set=db.live45.items[Number(input.dataset.liveI)]?.sets[Number(input.dataset.liveJ)];if(set){set[input.dataset.liveField]=n(input.value);persist()}}});
 document.addEventListener('change',e=>{if(e.target.dataset.liveMeta&&db.live45){db.live45[e.target.dataset.liveMeta]=e.target.dataset.liveMeta==='energy'?n(e.target.value):e.target.value;persist()}});
 document.addEventListener('submit',e=>{if(e.target.id==='gym45Form'){e.preventDefault();let items=[...e.target.querySelectorAll('[name="gymEquip45"]:checked')].map(x=>x.value);if(!items.length){toast('Selecciona al menos un tipo de material');return}db.gym45.enabled=items;persist();render();toast('Material guardado para La Maquinista')}else if(e.target.id==='custom45Form'){e.preventDefault();let f=e.target,id=f.dataset.id;let x={id:id||'custom45-'+uid(),name:document.getElementById('custName45').value.trim(),muscle:document.getElementById('custMuscle45').value,equipment:document.getElementById('custEquip45').value,movement:document.getElementById('custMove45').value.trim(),tip:document.getElementById('custTip45').value.trim()};if(!x.name)return;let k=db.personal45.findIndex(y=>y.id===id);if(k>=0){db.personal45[k]=x;let t=EXERCISES.findIndex(y=>y.id===id);if(t>=0)EXERCISES[t]=x}else{db.personal45.push(x);EXERCISES.push(x)}persist();closeModal();render();toast('Ejercicio personal guardado')}else if(e.target.id==='photo45Form'){e.preventDefault();saveImage45(document.getElementById('exerciseFile45').files[0],e.target.dataset.id).catch(err=>toast(err.message))}},true);
 // Restore newly introduced local options after import, without changing the existing data key.
 if(db.live45?.items?.length)toast('Tienes un entrenamiento sin terminar: ábrelo desde su día en Entrenos');
 render();
})();
