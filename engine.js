'use strict';
/* LIMIT BREAK - local, deterministic plan engine. No remote APIs. */
const LB_KEY='limitbreak_engine_v2';
let lb;try{lb=JSON.parse(localStorage.getItem(LB_KEY))||{}}catch{lb={}};
lb={accent:lb.accent||'violet',split:lb.split||'adaptive',sessions:lb.sessions||4,level:lb.level||'intermediate',equipment:lb.equipment||'all',foodStyle:lb.foodStyle||'all',avoid:lb.avoid||'',plans:lb.plans||{},workoutPlan:lb.workoutPlan||null,restDay:lb.restDay||0,footballDay:6, ...lb};
function lbSave(){localStorage.setItem(LB_KEY,JSON.stringify(lb))}
const ACCENTS={violet:['#b8a2ff','#321f69'],blue:['#408bff','#102d66'],neon:['#d0ff57','#344c08'],orange:['#ff993b','#62300c'],pink:['#ff6caa','#5b1735'],mint:['#4fe1bb','#0d5140']};
function applyAccent(){const col=ACCENTS[lb.accent]||ACCENTS.violet;document.documentElement.style.setProperty('--accent',col[0]);document.documentElement.style.setProperty('--accentDim',col[1]);document.querySelector('meta[name="theme-color"]')?.setAttribute('content','#0b0b10')}
applyAccent();
// All reference values are approximate per portion, not a certified or branded nutritional database.
// row: id | category | dish | kcal | protein | carbs | fat | dietary flags | indicative ingredients
const FOOD_ROWS=`a01|Desayuno|Yogur griego, avena y frutos rojos|450|32|52|12|veg|yogur griego, avena, frutos rojos, nueces
a02|Desayuno|Tostadas de huevo y aguacate|480|23|44|22|veg|pan integral, huevo, aguacate, tomate
a03|Desayuno|Porridge de avena, plátano y leche|500|23|75|12|veg|avena, leche, plátano, crema de cacahuete
a04|Desayuno|Skyr con granola y fruta|390|30|55|5|veg|skyr, granola, fruta
a05|Desayuno|Revuelto con pan integral y fruta|435|29|42|16|veg|huevos, claras, pan integral, mandarina
a06|Desayuno|Tostada de hummus y tomate|440|18|62|13|vegan|pan integral, hummus, tomate, fruta
a07|Desayuno|Batido de yogur, avena y plátano|520|31|70|13|veg|yogur, leche, avena, plátano
a08|Desayuno|Pancakes caseros de avena y huevo|510|29|61|17|veg|avena, huevo, plátano, yogur
c01|Comida|Pollo con arroz y verduras|690|51|81|16|omni|pollo, arroz, calabacín, aceite de oliva
c02|Comida|Pasta integral con atún y tomate|670|45|90|14|pesc|pasta integral, atún, tomate, aceite de oliva
c03|Comida|Bowl de garbanzos, quinoa y verduras|695|28|102|19|vegan|garbanzos, quinoa, verduras, aceite de oliva
c04|Comida|Pavo con patata asada y ensalada|625|49|70|15|omni|pavo, patata, lechuga, aceite de oliva
c05|Comida|Tofu, arroz y verduras salteadas|710|34|95|22|vegan|tofu, arroz, brócoli, salsa de soja
c06|Comida|Lentejas con arroz y verduras|660|27|107|13|vegan|lentejas, arroz, zanahoria, cebolla
c07|Comida|Salmón con couscous y verduras|735|45|75|28|pesc|salmón, couscous, espárragos
c08|Comida|Burrito bowl de pollo y alubias|720|52|81|19|omni|pollo, alubias, arroz, pimiento
c09|Comida|Wok de ternera y fideos|755|45|91|24|omni|ternera, fideos, verduras
c10|Comida|Ensalada templada de pasta y mozzarella|675|30|79|25|veg|pasta, mozzarella, tomates, rúcula
c11|Comida|Arroz con gambas y guisantes|645|43|85|15|pesc|arroz, gambas, guisantes, aceite de oliva
c12|Comida|Hamburguesa casera con patatas al horno|760|43|78|30|omni|pan, carne magra, patata, lechuga
n01|Cena|Merluza con patata y judías verdes|570|43|60|16|pesc|merluza, patata, judías verdes
n02|Cena|Tortilla de verduras y tostadas|555|32|47|26|veg|huevos, espinacas, pan integral, tomate
n03|Cena|Tofu con boniato y brócoli|625|33|69|24|vegan|tofu, boniato, brócoli, aceite de oliva
n04|Cena|Pollo a la plancha con ensalada y pan|590|55|46|19|omni|pollo, ensalada, pan, aceite de oliva
n05|Cena|Salmón con arroz y calabacín|690|44|65|28|pesc|salmón, arroz, calabacín
n06|Cena|Pita integral de falafel y verduras|620|24|77|23|vegan|pan pita, falafel, verduras, tahini
n07|Cena|Ensalada de atún, garbanzos y huevo|610|46|48|25|pesc|atún, garbanzos, huevo, lechuga
n08|Cena|Pavo salteado con quinoa|625|51|66|16|omni|pavo, quinoa, zanahoria, brócoli
n09|Cena|Crema de verduras y quesadilla de queso|580|24|64|24|veg|calabaza, verduras, tortilla, queso
n10|Cena|Pasta con lentejas y tomate|640|29|103|13|vegan|pasta, lentejas, tomate
s01|Snack|Skyr con nueces y manzana|290|22|31|9|veg|skyr, nueces, manzana
s02|Snack|Fruta, yogur natural y almendras|310|16|36|13|veg|fruta, yogur, almendras
s03|Snack|Hummus, palitos de zanahoria y crackers|290|10|39|11|vegan|hummus, zanahoria, crackers
s04|Snack|Sándwich pequeño de pavo|330|25|36|9|omni|pan integral, pavo, tomate
s05|Snack|Plátano y crema de cacahuete|260|6|34|12|vegan|plátano, crema de cacahuete
s06|Snack|Queso fresco batido con miel y fruta|260|22|34|3|veg|queso fresco batido, miel, fruta
s07|Snack|Edamame y fruta|275|16|35|7|vegan|edamame, fruta
s08|Snack|Tostada de atún y tomate|305|23|31|10|pesc|pan integral, atún, tomate`;
const FOOD=FOOD_ROWS.split('\n').map(r=>{const [id,slot,name,kcal,protein,carbs,fat,tag,ingredients]=r.split('|');return {id,slot,name,kcal:+kcal,protein:+protein,carbs:+carbs,fat:+fat,tag,ingredients:ingredients.split(', ')}});
const EXERCISE_ROWS=`Pecho|Press de pecho en máquina|Máquina guiada|Empuje horizontal|Mantén escápulas estables y controla la bajada
Pecho|Press banca con barra|Barra|Empuje horizontal|Pies apoyados y recorrido controlado
Pecho|Press inclinado con mancuernas|Mancuernas|Empuje inclinado|No rebotes en la zona baja
Pecho|Press inclinado Hammer Strength|Máquina guiada|Empuje inclinado|Ajusta el asiento al pecho
Pecho|Aperturas en contractor|Máquina guiada|Aislamiento pecho|Flexión ligera de codo
Pecho|Cruce de poleas|Polea|Aislamiento pecho|Recorrido sin balanceo
Pecho|Flexiones|Peso corporal|Empuje horizontal|Cuerpo alineado
Espalda|Jalón al pecho|Polea|Tirón vertical|Lleva los codos hacia las costillas
Espalda|Remo sentado en polea|Polea|Tirón horizontal|Evita tirar con la espalda baja
Espalda|Remo con pecho apoyado|Máquina guiada|Tirón horizontal|Mantén el torso apoyado
Espalda|Remo con mancuerna|Mancuernas|Tirón horizontal|Evita rotar el torso
Espalda|Dominadas asistidas|Máquina guiada|Tirón vertical|Controla el descenso
Espalda|Dominadas|Peso corporal|Tirón vertical|Trabaja en rango controlado
Espalda|Pullover en polea|Polea|Extensión hombro|Brazos casi estirados
Espalda|Remo T-Bar|Máquina guiada|Tirón horizontal|Recorrido sin impulso
Espalda|Jalón agarre neutro|Polea|Tirón vertical|Agarre cómodo
Hombros|Press militar sentado|Mancuernas|Empuje vertical|No arquees excesivamente la espalda
Hombros|Press hombros en máquina|Máquina guiada|Empuje vertical|Ajusta altura del asiento
Hombros|Elevaciones laterales|Mancuernas|Aislamiento lateral|Sin encoger los hombros
Hombros|Elevaciones laterales en polea|Polea|Aislamiento lateral|Controla fase excéntrica
Hombros|Pájaros en máquina|Máquina guiada|Deltoides posterior|No eleves hombros
Hombros|Face pulls|Polea|Retracción escapular|Lleva las manos hacia el rostro
Bíceps|Curl bíceps con mancuernas|Mancuernas|Flexión codo|Codos quietos
Bíceps|Curl en máquina predicador|Máquina guiada|Flexión codo|No bloquees con golpe
Bíceps|Curl de bíceps en polea|Polea|Flexión codo|Sin balanceo
Bíceps|Curl martillo|Mancuernas|Flexión codo|Muñeca neutra
Tríceps|Extensión tríceps en polea|Polea|Extensión codo|Codos fijos
Tríceps|Extensión sobre cabeza en cuerda|Polea|Extensión codo|No fuerces el hombro
Tríceps|Fondos asistidos|Máquina guiada|Empuje|Recorrido cómodo
Tríceps|Press francés con mancuernas|Mancuernas|Extensión codo|Controla bajada
Cuádriceps|Prensa de piernas|Máquina guiada|Empuje piernas|No despegues la pelvis
Cuádriceps|Sentadilla con barra|Barra|Sentadilla|Desciende con control
Cuádriceps|Sentadilla en multipower|Máquina guiada|Sentadilla|Coloca pies para un recorrido cómodo
Cuádriceps|Hack squat|Máquina guiada|Sentadilla|Ajusta el rango a movilidad
Cuádriceps|Extensión de cuádriceps|Máquina guiada|Extensión rodilla|Evita rebotes
Cuádriceps|Sentadilla goblet|Mancuernas|Sentadilla|Tronco firme
Cuádriceps|Zancadas con mancuernas|Mancuernas|Unilateral|Rodilla alineada con pie
Cuádriceps|Split squat búlgaro|Mancuernas|Unilateral|Controla equilibrio
Isquios|Curl femoral sentado|Máquina guiada|Flexión rodilla|Regula respaldo
Isquios|Curl femoral tumbado|Máquina guiada|Flexión rodilla|Cadera estable
Isquios|Peso muerto rumano|Barra|Bisagra cadera|Espalda neutra
Isquios|Peso muerto rumano con mancuernas|Mancuernas|Bisagra cadera|Recorrido desde cadera
Isquios|Curl femoral unilateral|Máquina guiada|Flexión rodilla|Evita compensaciones
Glúteos|Hip thrust en máquina|Máquina guiada|Extensión cadera|Mantén costillas alineadas
Glúteos|Hip thrust con barra|Barra|Extensión cadera|Empuja con talones
Glúteos|Abductores en máquina|Máquina guiada|Abducción cadera|Movimiento controlado
Glúteos|Patada de glúteo en polea|Polea|Extensión cadera|No arquees lumbar
Glúteos|Step-up con mancuerna|Mancuernas|Unilateral|Apoya todo el pie
Gemelos|Elevaciones de gemelos de pie|Máquina guiada|Flexión plantar|Pausa en arriba y abajo
Gemelos|Gemelos sentado|Máquina guiada|Flexión plantar|Controla recorrido
Core|Plancha frontal|Peso corporal|Estabilidad|Respira y mantén alineación
Core|Crunch en polea|Polea|Flexión tronco|No tires con brazos
Core|Crunch en máquina|Máquina guiada|Flexión tronco|No fuerces cuello
Core|Elevaciones de rodillas|Peso corporal|Core|Evita balanceo
Core|Pallof press|Polea|Antirrotación|Resiste la rotación
Core|Dead bug|Peso corporal|Core|Zona lumbar estable
Funcional|Farmer walk|Mancuernas|Carga transportada|Camina con tronco firme
Funcional|Kettlebell swing|Kettlebell|Bisagra explosiva|Usa cadera, no hombros
Funcional|Remo en ergómetro|Cardio|Resistencia|Prioriza técnica
Funcional|Bicicleta estática|Cardio|Resistencia|Ajusta intensidad
Funcional|Trineo de empuje|Funcional|Tracción|Postura estable y progresiva
Funcional|Trabajo de movilidad de cadera|Peso corporal|Movilidad|Sin dolor
Funcional|Caminata en cinta|Cardio|Resistencia|Controla ritmo`;
const EXERCISES=EXERCISE_ROWS.split('\n').map((r,i)=>{let [muscle,name,equipment,movement,tip]=r.split('|');return{id:i+1,muscle,name,equipment,movement,tip}});
const STYLES={full:[['Pecho','Espalda','Cuádriceps','Isquios','Hombros','Core']],upper:[['Pecho','Espalda','Hombros','Bíceps','Tríceps'],['Cuádriceps','Isquios','Glúteos','Gemelos','Core']],ppl:[['Pecho','Hombros','Tríceps'],['Espalda','Bíceps','Hombros'],['Cuádriceps','Isquios','Glúteos','Gemelos','Core']],weider:[['Pecho','Tríceps'],['Espalda','Bíceps'],['Cuádriceps','Isquios','Glúteos'],['Hombros','Core']],strength:[['Cuádriceps','Pecho','Espalda','Core'],['Isquios','Glúteos','Hombros','Espalda'],['Pecho','Cuádriceps','Bíceps','Tríceps']],functional:[['Funcional','Core','Cuádriceps','Espalda'],['Funcional','Glúteos','Core','Pecho']],hybrid:[['Pecho','Espalda','Hombros'],['Cuádriceps','Isquios','Glúteos','Core'],['Funcional','Core','Espalda'],['Pecho','Espalda','Bíceps','Tríceps']]};
const splitNames={adaptive:'Recomendación flexible',full:'Full body',upper:'Upper / Lower',ppl:'Push / Pull / Legs',weider:'Por grupos musculares',strength:'Fuerza',functional:'Funcional',hybrid:'Híbrida gimnasio + fútbol'};
function actualSplit(){return lb.split==='adaptive'?(lb.sessions<=2?'full':lb.sessions===3?'full':'upper'):lb.split}
function filteredExercises(muscle){let es=EXERCISES.filter(e=>e.muscle===muscle&&(lb.equipment==='all'||e.equipment===lb.equipment||e.equipment==='Peso corporal'));return es.length?es:EXERCISES.filter(e=>e.muscle===muscle)}
function priorExercise(name){return [...data.workouts].filter(w=>w.type==='gym').sort((a,b)=>b.date.localeCompare(a.date)).flatMap(w=>w.exercises||[]).find(e=>e.name===name)}
function planWorkout(force=0){let split=actualSplit(),blocks=STYLES[split]||STYLES.full;let completed=data.workouts.filter(w=>w.type==='gym').sort((a,b)=>a.date.localeCompare(b.date));let week=completed.filter(thisWeek),n=week.length;let idx=force||n%blocks.length;const lastMuscles=new Set();(week.slice(-1)[0]?.exercises||[]).forEach(e=>{let x=EXERCISES.find(y=>y.name===e.name);if(x)lastMuscles.add(x.muscle)});if(force===0&&n&&blocks.length>1&&blocks[idx].filter(m=>lastMuscles.has(m)).length>2)idx=(idx+1)%blocks.length;
let groups=blocks[idx],exercises=[];groups.forEach((m,j)=>{let choices=filteredExercises(m);if(!choices.length)return;let selected=choices[(n+j+(idx*2))%choices.length];let prev=priorExercise(selected.name);exercises.push({name:selected.name,muscle:m,sets:lb.level==='beginner'?2:3,reps:split==='strength'?'5-8':split==='functional'?'10-15':'8-12',weight:prev?num(prev.weight):null,tip:selected.tip,alternatives:choices.filter(x=>x.id!==selected.id).slice(0,3).map(x=>x.name)})});return{split,title:splitNames[split]+' · '+(idx+1),exercises,when:today(),footballWarning:(new Date().getDay()===5||new Date().getDay()===6)&&exercises.some(e=>['Cuádriceps','Isquios','Glúteos'].includes(e.muscle)),index:idx,groups}}
function escLB(x){return esc(x)}
function planWidget(){let p=lb.workoutPlan||planWorkout(),week=data.workouts.filter(thisWeek);let volume={};week.filter(w=>w.type==='gym').forEach(w=>(w.exercises||[]).forEach(e=>{const m=EXERCISES.find(z=>z.name.toLowerCase()===String(e.name).toLowerCase())?.muscle||'Otros';volume[m]=(volume[m]||0)+num(e.sets)}));return `<section class="card spotlight"><div class="section-head"><div><p class="eyebrow">TRAINING ENGINE · SIN IA</p><h2>Tu siguiente entrenamiento</h2></div><span class="tag">${escLB(splitNames[p.split]||p.split)}</span></div><p class="sub">Propuesta basada en tu modalidad, disponibilidad e historial registrado.</p>${p.footballWarning?'<div class="note" style="margin:12px 0">⚽ Tienes fútbol el sábado: evita piernas intensas si te notas fatigado. Puedes cambiar esta propuesta.</div>':''}<div class="stack" style="margin-top:12px">${p.exercises.map((e,i)=>`<div class="item"><div><strong>${i+1}. ${escLB(e.name)}</strong><small>${e.muscle} · ${e.sets} × ${e.reps} · ${e.weight!==null?'Último: '+fmt(e.weight)+' kg':'Sin peso previo'}</small><small>${escLB(e.tip)}</small><small>Alternativas: ${e.alternatives.map(escLB).join(' · ')||'Consulta la biblioteca'}</small></div></div>`).join('')}</div><div class="hero-actions"><button class="btn" onclick="lbStartWorkout()">Entrenar esta propuesta</button><button class="btn ghost" onclick="lb.workoutPlan=planWorkout((p.index+1)%((STYLES[p.split]||STYLES.full).length));lbSave();render()">Otra propuesta ↻</button></div><p class="hint" style="margin-top:11px">La selección es orientativa: adapta cargas, técnica, dolor y recuperación. El equipamiento concreto debe confirmarse en tu Fitness Park.</p></section><div class="card" style="margin-top:13px"><h3>Volumen registrado esta semana</h3><p class="sub">Series por grupo muscular, cuando el ejercicio coincide con la biblioteca.</p><div class="tag-cloud" style="margin-top:12px">${Object.entries(volume).length?Object.entries(volume).map(([k,v])=>`<span class="tag">${escLB(k)} · ${v} series</span>`).join(''):'<span class="sub">Sin sesiones registradas esta semana</span>'}</div></div>`}
function lbStartWorkout(){const p=lb.workoutPlan||planWorkout();openWorkout('gym');exerciseDraft=p.exercises.map(e=>({name:e.name,sets:e.sets,reps:parseInt(e.reps.split('-')[0],10),weight:e.weight||0,rpe:7}));$('#f_title').value=p.title;drawExercises()}
// Diet filters intentionally conservative. Ingredient exclusion is text matching, not allergy-safe.
function eligible(food){if(lb.foodStyle==='vegan'&&food.tag!=='vegan')return false;if(lb.foodStyle==='veg'&&!['veg','vegan'].includes(food.tag))return false;if(lb.foodStyle==='pesc'&&food.tag==='omni')return false;const ban=lb.avoid.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);return !ban.some(x=>(food.ingredients.join(' ')+' '+food.name).toLowerCase().includes(x))}
function foodPlan(date=today(),seed=0){const goals=macros()||{kcal:2100,protein:125,carbs:245,fat:66};const slots=['Desayuno','Comida','Cena','Snack'],splits=[.24,.34,.30,.12],all=[];for(let i=0;i<slots.length;i++){let pool=FOOD.filter(f=>f.slot===slots[i]&&eligible(f));if(!pool.length)return {error:'No hay recetas compatibles con tus filtros. Reduce las exclusiones o cambia el tipo de dieta.'};const target=goals.kcal*splits[i];let ranking=pool.map(f=>{let scale=Math.min(1.45,Math.max(.75,target/f.kcal));return{f,scale,score:Math.abs(f.kcal*scale-target)+Math.abs(f.protein*scale-goals.protein*splits[i])*3}}).sort((a,b)=>a.score-b.score);let pick=ranking[(seed+i*3)%Math.min(5,ranking.length)];all.push({...pick.f,scale:pick.scale,scaled:{kcal:Math.round(pick.f.kcal*pick.scale),protein:Math.round(pick.f.protein*pick.scale),carbs:Math.round(pick.f.carbs*pick.scale),fat:Math.round(pick.f.fat*pick.scale)}})}let total={kcal:0,protein:0,carbs:0,fat:0};all.forEach(x=>Object.keys(total).forEach(k=>total[k]+=x.scaled[k]));return {date,items:all,total,target:goals}}
function createMealPlan(){let date=$('#lbMealDate')?.value||mealDay;let existing=lb.plans[date],seed=existing?.seed===undefined?0:existing.seed+1;let p=foodPlan(date,seed);if(p.error)return toast(p.error);lb.plans[date]={...p,seed};lbSave();render();toast('Menú generado y guardado')}
function lbLogPlan(){let p=lb.plans[mealDay];if(!p)return toast('Primero genera un menú');if(!confirm('¿Añadir las 4 comidas propuestas a tu registro diario? Evita duplicarlas si ya las has anotado.'))return;p.items.forEach(x=>data.meals.push({id:uid(),date:mealDay,type:x.slot,name:x.name+' (propuesta)',...x.scaled,free:false}));save();render();toast('Comidas añadidas a tu registro')}
function grocery(){let p=lb.plans[mealDay];if(!p)return;let ing=[...new Set(p.items.flatMap(x=>x.ingredients))].sort();modal('Lista de la compra',`<p class="sub">Ingredientes orientativos para el menú del ${escLB(mealDay)}. Ajusta cantidades a tus porciones y etiquetas.</p><div class="stack" style="margin-top:14px">${ing.map(x=>`<label class="grocery"><input type="checkbox"> ${escLB(x)}</label>`).join('')}</div><button class="btn full" style="margin-top:15px" onclick="navigator.clipboard?.writeText(${JSON.stringify(ing.join('\n'))}).then(()=>toast('Lista copiada')).catch(()=>toast('Copia no disponible'))">Copiar lista</button>`)}
function plannerNutritionView(){let p=lb.plans[mealDay],m=macros();return `<section class="card spotlight" style="margin-bottom:16px"><p class="eyebrow">FUEL ENGINE · MENÚ AUTOMÁTICO</p><h2 style="margin:7px 0">Qué comer según tus macros</h2><p class="sub">Generamos 4 comidas variadas con porciones aproximadas. Se usan datos de ejemplo por plato; no son valores certificados ni se garantiza alcanzar exactamente cada macro.</p><div class="hero-actions"><button class="btn" onclick="createMealPlan()">${p?'↻ Proponer otro menú':'✦ Crear menú del día'}</button><button class="btn ghost" onclick="nav('settings')">Editar objetivos y filtros</button></div>${!m?'<p class="hint" style="margin-top:10px">Configura tus datos en Mi perfil para calcular objetivos propios. Mientras tanto se usa un ejemplo de 2100 kcal.</p>':''}</section>${p?`<div class="card" style="margin-bottom:15px"><div class="section-head" style="margin:0"><h2>Tu menú para ${escLB(mealDay)}</h2><span class="tag">${fmt(p.total.kcal)} kcal aprox.</span></div><div class="breakdown">${[['protein','Proteínas'],['carbs','Carbos'],['fat','Grasas']].map(([k,l])=>`<div><b>${fmt(p.total[k])}g</b><span>${l}</span></div>`).join('')}</div><div class="stack" style="margin-top:14px">${p.items.map(x=>`<div class="item"><div><small>${escLB(x.slot)} · Porción × ${x.scale.toFixed(2)}</small><strong>${escLB(x.name)}</strong><small>${fmt(x.scaled.kcal)} kcal · P ${x.scaled.protein}g / C ${x.scaled.carbs}g / G ${x.scaled.fat}g</small><small>${x.ingredients.map(escLB).join(', ')}</small></div></div>`).join('')}</div><div class="hero-actions"><button class="btn" onclick="lbLogPlan()">Añadir menú a mi diario</button><button class="btn ghost" onclick="grocery()">Lista de la compra</button></div><p class="hint" style="margin-top:12px">Advertencia: las porciones se escalan matemáticamente a partir de platos ilustrativos; comprueba cantidades, valores reales y posibles alérgenos. Evita usar estos filtros como garantía frente a alergias.</p></div>`:''}`}
function lbLibrary(){let q=(lb.search||'').toLowerCase(),muscle=lb.muscle||'all',list=EXERCISES.filter(e=>(muscle==='all'||e.muscle===muscle)&&(e.name+' '+e.equipment).toLowerCase().includes(q));return `<div class="card" style="margin-top:14px"><div class="section-head" style="margin-top:0"><h2>Biblioteca · ${EXERCISES.length} ejercicios</h2><span class="tag">Fitness Park y más</span></div><div class="form-grid"><div class="field"><label>Buscar ejercicio</label><input placeholder="Ej. prensa, jalón, press" value="${escLB(lb.search||'')}" oninput="lb.search=this.value;lbSave();lbRefreshLibrary()"></div><div class="field"><label>Grupo muscular</label><select onchange="lb.muscle=this.value;lbSave();lbRefreshLibrary()"><option value="all">Todos</option>${[...new Set(EXERCISES.map(e=>e.muscle))].map(x=>`<option ${x===lb.muscle?'selected':''}>${x}</option>`).join('')}</select></div></div><div id="libraryList" class="library-list">${lbLibraryItems(list)}</div><p class="hint">Máquinas de referencia, sin inventario confirmado de tu centro. Puedes registrar pesos desde la propuesta de entrenamiento.</p></div>`}
function lbLibraryItems(list){return list.slice(0,80).map(x=>`<details class="library-exercise"><summary><strong>${escLB(x.name)}</strong><small>${escLB(x.muscle)} · ${escLB(x.equipment)}</small></summary><p class="sub">${escLB(x.tip)}</p><p class="hint">Movimiento: ${escLB(x.movement)}</p></details>`).join('')||empty('🔍','No hay coincidencias')}
function lbRefreshLibrary(){let root=$('#libraryList');if(root)root.innerHTML=lbLibraryItems(EXERCISES.filter(e=>(lb.muscle==='all'||!lb.muscle||e.muscle===lb.muscle)&&(e.name+' '+e.equipment).toLowerCase().includes((lb.search||'').toLowerCase())))}
function configPanel(){return `<div class="card" style="margin-top:15px"><h2>Planificador de entrenamiento</h2><p class="sub" style="margin:6px 0 14px">Elige el tipo de rutina o deja que se recomiende según tus días. Sábado reservado para fútbol.</p><div class="form-grid"><div class="field"><label>Tipo de rutina</label><select id="lbSplit">${Object.keys(splitNames).map(k=>`<option value="${k}" ${k===lb.split?'selected':''}>${splitNames[k]}</option>`).join('')}</select></div><div class="field"><label>Días de gimnasio por semana</label><select id="lbDays">${[2,3,4,5,6].map(x=>`<option value="${x}" ${x===lb.sessions?'selected':''}>${x} días</option>`).join('')}</select></div><div class="field"><label>Experiencia</label><select id="lbLevel">${[['beginner','Principiante'],['intermediate','Intermedio'],['advanced','Avanzado']].map(([k,v])=>`<option value="${k}" ${k===lb.level?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label>Material habitual</label><select id="lbEquipment">${[['all','Todo el gimnasio'],['Máquina guiada','Máquinas'],['Polea','Poleas'],['Mancuernas','Mancuernas'],['Barra','Barra'],['Peso corporal','Sin material']].map(([k,v])=>`<option value="${k}" ${k===lb.equipment?'selected':''}>${v}</option>`).join('')}</select></div></div><button class="btn" style="margin-top:14px" onclick="saveLbTraining()">Guardar y generar rutina</button></div><div class="card" style="margin-top:15px"><h2>Preferencias de alimentación</h2><div class="form-grid" style="margin-top:12px"><div class="field"><label>Tipo de alimentación</label><select id="lbFoodStyle">${[['all','Omnívora'],['pesc','Pescetariana'],['veg','Vegetariana'],['vegan','Vegana']].map(([k,v])=>`<option value="${k}" ${lb.foodStyle===k?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label>Ingredientes que no quieres (separados por coma)</label><input id="lbAvoid" value="${escLB(lb.avoid)}" placeholder="Ej. atún, nueces"></div></div><button class="btn ghost" style="margin-top:14px" onclick="saveLbNutrition()">Guardar preferencias</button><p class="hint" style="margin-top:10px">Filtro por texto: no apto para gestionar alergias o intolerancias graves. Comprueba siempre ingredientes y trazas.</p></div><div class="card" style="margin-top:15px"><h2>Color de la aplicación</h2><p class="sub" style="margin:6px 0 12px">Base siempre negra. Cambia los acentos, botones y detalles.</p><div class="color-row">${Object.entries(ACCENTS).map(([k,v])=>`<button class="color-swatch ${k===lb.accent?'chosen':''}" style="--swatch:${v[0]}" onclick="setLbAccent('${k}')" aria-label="Color ${k}" title="${k}"><span></span>${{violet:'Violeta',blue:'Azul',neon:'Neón',orange:'Naranja',pink:'Rosa',mint:'Menta'}[k]}</button>`).join('')}</div></div>`}
function saveLbTraining(){lb.split=$('#lbSplit').value;lb.sessions=num($('#lbDays').value);lb.level=$('#lbLevel').value;lb.equipment=$('#lbEquipment').value;lb.workoutPlan=planWorkout();lbSave();render();toast('Rutina recalculada')}
function saveLbNutrition(){lb.foodStyle=$('#lbFoodStyle').value;lb.avoid=$('#lbAvoid').value;lbSave();render();toast('Preferencias guardadas')}
function setLbAccent(k){lb.accent=k;lbSave();applyAccent();render();toast('Color actualizado')}
const baseWorkoutsView=workoutsView;workoutsView=function(){return header('Training Arc','Rutinas que se proponen, se adaptan y se registran.')+planWidget()+lbLibrary()+`<div class="section-head"><h2>Registro de sesiones</h2><button class="btn ghost small" onclick="openWorkout('football')">⚽ Fútbol</button></div>`+baseWorkoutsView().replace(/^.*?(?=<div class="hero">)/s,'')};
const baseNutritionView=nutritionView;nutritionView=function(){return header('Fuel Up','Menús sugeridos según energía, macros y preferencias.')+`<div class="field" style="max-width:200px;margin-bottom:12px"><label>Fecha del menú</label><input type="date" value="${mealDay}" onchange="mealDay=this.value;render()"></div>`+plannerNutritionView()+baseNutritionView().replace(/^.*?(?=<div class="hero">)/s,'')};
const baseSettingsView=settingsView;settingsView=function(){return baseSettingsView()+configPanel()};
const baseHomeView=homeView;homeView=function(){return baseHomeView()+`<div class="section-head"><h2>Tu siguiente paso</h2></div><div class="grid2"><div class="card"><p class="eyebrow">ENTRENA</p><h3 style="margin:10px 0">Plan basado en tu semana</h3><p class="sub">${escLB((lb.workoutPlan||planWorkout()).title)} · Fútbol los sábados</p><button class="btn small" style="margin-top:12px" onclick="nav('workouts')">Ver propuesta</button></div><div class="card"><p class="eyebrow">NUTRICIÓN</p><h3 style="margin:10px 0">Generar menú según macros</h3><p class="sub">Recetas, porciones orientativas y lista de la compra.</p><button class="btn small" style="margin-top:12px" onclick="nav('nutrition')">Proponer menú</button></div></div>`};
const baseCoachView=coachView;coachView=function(){return header('Plan y ajustes','Configura tu objetivo y personaliza LIMIT BREAK.')+configPanel()+`<div class="section-head"><h2>Tu consulta local</h2></div>`+baseCoachView().replace(/^.*?(?=<div class="note")/s,'')};
// Fix existing graph/chart colors dynamically without modifying user stored history.
const originalChart=chart;chart=function(series,label){return originalChart(series,label).replace(/#ccff5e/g,'var(--accent)')};
window.lbStartWorkout=lbStartWorkout;window.createMealPlan=createMealPlan;window.lbLogPlan=lbLogPlan;window.grocery=grocery;window.lbRefreshLibrary=lbRefreshLibrary;window.saveLbTraining=saveLbTraining;window.saveLbNutrition=saveLbNutrition;window.setLbAccent=setLbAccent;
// Preserve previous user data as-is. Existing local storage key intentionally unchanged.
render();
