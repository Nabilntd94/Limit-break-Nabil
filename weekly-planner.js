'use strict';
/* LIMIT BREAK 3.2 — personal weekly gym planner, computed entirely on device.
   Training guidance only; not a clinical prescription. */
const LBW_DAY=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const LBW_PREFERRED={2:[1,4],3:[1,3,5],4:[1,2,4,5],5:[1,2,3,4,5],6:[1,2,3,4,5,0]};
function lbwMonday(d=new Date()) {const a=new Date(d.getFullYear(),d.getMonth(),d.getDate());a.setDate(a.getDate()-(a.getDay()+6)%7);return a}
function lbwISO(d){const year=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${year}-${m}-${day}`}
function lbwDate(week,day){const a=new Date(week+'T12:00:00');a.setDate(a.getDate()+(day+6)%7);return lbwISO(a)}
function lbwSplit(){return actualSplit()}
function lbwBlocks(){const split=lbwSplit();let blocks=lb3Blocks().filter(x=>x.length);if(split==='full')return [['Pecho','Espalda','Cuádriceps','Hombros','Core'],['Espalda','Isquios','Glúteos','Pecho','Core'],['Cuádriceps','Pecho','Espalda','Hombros','Core']];return blocks.length?blocks:[['Pecho','Espalda','Cuádriceps','Core']]}
function lbwPickExercises(groups,sessionNum,seed){
  const chosen=[]; const set=new Set();const level=lb.level;const preferred=lb.equipment;
  let target=groups.length<=1?4:groups.length===2?5:Math.min(7,Math.max(5,groups.length+1));
  const sequence=[...groups];let cursor=0;
  while(sequence.length<target && cursor<target*3){sequence.push(groups[cursor%groups.length]);cursor++}
  for(let i=0;i<sequence.length;i++){
    const muscle=sequence[i];let pool=EXERCISES.filter(e=>e.muscle===muscle&&!set.has(e.name));
    let appropriate=pool.filter(e=>preferred==='all'||e.equipment===preferred||e.equipment==='Peso corporal');
    if(appropriate.length)pool=appropriate;
    if(!pool.length)continue;
    const choice=pool[(seed+sessionNum*3+i*5)%pool.length];set.add(choice.name);
    const prev=priorExercise(choice.name);
    const isStrength=lb3.goal==='strength',sets=level==='beginner'?2:isStrength?4:3;
    chosen.push({name:choice.name,muscle,sets,reps:isStrength?6:lb3.goal==='football'?12:10,weight:prev?Number(prev.weight)||0:0,tip:choice.tip||''});
  }
  return chosen;
}
function lbwGenerate(){
  const week=lbwISO(lbwMonday());const days=LBW_PREFERRED[Number(lb.sessions)]||LBW_PREFERRED[4];const blocks=lbwBlocks();
  let assignment=days.map((day,index)=>({id:`${week}-${day}`,day,date:lbwDate(week,day),groups:blocks[index%blocks.length].slice(),title:`${(lbwSplit()==='full'?'Full Body':lbwSplit()==='ppl'?['Push','Pull','Legs'][index%3]:lbwSplit()==='upper'?['Torso','Piernas'][index%2]:lbwSplit()==='weider'?'Por músculos':lbwSplit()==='hybrid'?'Híbrida':'Entrenamiento')} · ${index+1}`,index}));
  // When possible avoid scheduling the heaviest lower-body session immediately before Saturday football.
  if(days.length>=3){let fri=assignment.findIndex(a=>a.day===5);if(fri>=0&&assignment[fri].groups.some(x=>['Cuádriceps','Isquios'].includes(x))){let j=assignment.findIndex(a=>a.day!==5&&!a.groups.some(x=>['Cuádriceps','Isquios'].includes(x)));if(j>=0){const gs=assignment[fri].groups;assignment[fri].groups=assignment[j].groups;assignment[j].groups=gs}}}
  assignment=assignment.map((a,i)=>({...a,exercises:lbwPickExercises(a.groups,i,Number(lb3.planSeed)||0)}));
  lb3.weekPlan={week,split:lbwSplit(),days:assignment,createdAt:new Date().toISOString(),sessions:Number(lb.sessions),goal:lb3.goal};
  lb3.selectedWeekSession=null;lb3Save();return lb3.weekPlan;
}
function lbwGetPlan(){const week=lbwISO(lbwMonday());if(!lb3.weekPlan||lb3.weekPlan.week!==week||!Array.isArray(lb3.weekPlan.days))return lbwGenerate();return lb3.weekPlan}
function lbwSessionStatus(s){const w=data.workouts.find(w=>w.type==='gym'&&w.weekPlanId===s.id);return w?{title:w.planStatus==='completed'?'Completada':w.planStatus==='partial'?'Parcial':w.planStatus==='skipped'?'No realizada':'Adaptada',done:true}:null}
function lbwOpenSession(id){const p=lbwGetPlan(),s=p.days.find(x=>x.id===id);if(!s)return;lb3.selectedWeekSession=s.id;lb3.workout={title:s.title,groups:s.groups,exercises:s.exercises};lb3.editing=s.exercises.map(e=>({...e}));lb3Save();render();const el=document.getElementById('lb3Date');if(el)el.value=today();toast('Sesión cargada: edita máquinas, pesos y repeticiones antes de guardarla')}
function lbwUpdatePlan(){lbwSyncPrefs();lbwGenerate();lbwOpenFirst();toast('Semana creada a partir de tus preferencias')}
function lbwSyncPrefs(){for(const k of ['lb3Split','lb3Days','lb3Muscles','lb3Goal','lb3Level','lb3Equipment'])if(!document.getElementById(k))return false;lb.split=$('#lb3Split').value;lb.sessions=Number($('#lb3Days').value);lb3.muscles=Number($('#lb3Muscles').value);lb3.goal=$('#lb3Goal').value;lb.level=$('#lb3Level').value;lb.equipment=$('#lb3Equipment').value;lb3.planSeed=0;return true}
function lbwOpenFirst(){const p=lbwGetPlan();const upcoming=p.days.find(x=>x.date>=today()&&!lbwSessionStatus(x))||p.days.find(x=>!lbwSessionStatus(x))||p.days[0];if(upcoming)lbwOpenSession(upcoming.id);else render()}
function lbwRegenerate(){if(!confirm('¿Generar una semana alternativa? Se conservarán tus entrenamientos registrados, pero cambiarán los ejercicios de las sesiones aún no realizadas.'))return;lb3.planSeed+=1;lbwGenerate();lbwOpenFirst()}
function lbwCard(){const p=lbwGetPlan(),saved=p.days.filter(x=>lbwSessionStatus(x)).length;const rows=[];
  for(let d=1;d<=7;d++){
    const wd=d%7,daydate=lbwDate(p.week,wd),session=p.days.find(s=>s.day===wd),sport=wd===6,rest=!session&&!sport;
    if(session){const st=lbwSessionStatus(session);rows.push(`<div class="lbw-row ${lb3.selectedWeekSession===session.id?'lbw-selected':''}"><div class="lbw-date"><b>${LBW_DAY[wd]}</b><small>${daydate.slice(8)}</small></div><div class="lbw-main"><strong>${esc(session.title)}</strong><small>${esc(session.groups.join(' · '))} · ${session.exercises.length} ejercicios${st?' · '+st.title:''}</small></div><button class="btn ghost small" onclick="lbwOpenSession('${session.id}')">${st?'Ver / repetir':'Ver rutina'}</button></div>`)}
    else rows.push(`<div class="lbw-row"><div class="lbw-date"><b>${LBW_DAY[wd]}</b><small>${daydate.slice(8)}</small></div><div class="lbw-main"><strong>${sport?'⚽ Fútbol':'Descanso / recuperación'}</strong><small>${sport?'Sábado fijo: regístralo si juegas, sin calorías descontadas automáticamente':'Movilidad opcional; recupera antes de la siguiente sesión'}</small></div></div>`);
  }
  return `<section class="lb3-card" id="lbwCalendar"><div class="section-head"><div><p class="eyebrow">PLAN AUTOMÁTICO · ESTA SEMANA</p><h2>Tu semana de entrenamiento</h2></div><span class="lb3-tag">${saved}/${p.days.length} registradas</span></div><p class="lb3-muted">Generado con tus días de gimnasio, modalidad, nivel, objetivo y equipo. El sábado es fútbol; pulsa cualquier sesión para cargar todos sus ejercicios editables.</p><div class="lb3-actions"><button class="btn" onclick="lbwUpdatePlan()">✦ Generar mi semana según preferencias</button><button class="btn ghost" onclick="lbwRegenerate()">↻ Otra semana de ejercicios</button></div><div class="lbw-days">${rows.join('')}</div><p class="lb3-mini">Plan orientativo; descansa o cambia un ejercicio si hay fatiga o molestias. El fútbol puede alterar la recuperación y no determina por sí solo cuántos kg perderás.</p></section>`
}
// Place weekly planning after preference fields, before the editable single-session panel.
const lbwOriginalWorkoutForm=lb3WorkoutForm;
lb3WorkoutForm=function(){const original=lbwOriginalWorkoutForm();const at=original.indexOf('<section class="lb3-card"><div class="section-head"><h2>Propuesta editable del día');return at>=0?original.slice(0,at)+lbwCard()+original.slice(at):lbwCard()+original};
const lbwOriginalSetTraining=lb3SetTraining;
lb3SetTraining=function(){lbwSyncPrefs();lbwGenerate();lbwOpenFirst();toast('Rutina semanal generada y guardada')};
window.lb3SetTraining=lb3SetTraining;
const lbwOriginalSaveWorkout=lb3SaveWorkout;
lb3SaveWorkout=function(){const before=data.workouts.length;const selected=lb3.selectedWeekSession;lbwOriginalSaveWorkout();if(data.workouts.length>before && selected){const w=data.workouts[data.workouts.length-1];if(w&&w.type==='gym'){w.weekPlanId=selected;save();render();}}};
window.lb3SaveWorkout=lb3SaveWorkout;
// Start with the first scheduled session, while preserving any selection from the current week.
if(!lb3.selectedWeekSession){const p=lbwGetPlan(),s=p.days.find(x=>x.date>=today()&&!lbwSessionStatus(x))||p.days[0];if(s){lb3.selectedWeekSession=s.id;lb3.workout={title:s.title,groups:s.groups,exercises:s.exercises};lb3.editing=s.exercises.map(e=>({...e}));lb3Save()}}
window.lbwGenerate=lbwGenerate;window.lbwUpdatePlan=lbwUpdatePlan;window.lbwOpenSession=lbwOpenSession;window.lbwRegenerate=lbwRegenerate;
