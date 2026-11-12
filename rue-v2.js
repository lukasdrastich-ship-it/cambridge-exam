/* V2 integration for original B2 First Reading and Use of English candidate tests. */
(function(){
'use strict';
const oldTests=Array.isArray(window.RUE_TESTS)?window.RUE_TESTS.slice():[];
const v2Tests=Array.isArray(window.RUE_V2_TESTS)?window.RUE_V2_TESTS.slice():[];
const byId=new Map(v2Tests.map(t=>[t.id,t]));
window.RUE_TESTS=oldTests.map(t=>byId.get(t.id)||t);
v2Tests.forEach(t=>{if(!window.RUE_TESTS.some(x=>x.id===t.id))window.RUE_TESTS.push(t);});
if(typeof TEST_BANK!=='undefined')TEST_BANK.forEach(p=>{const t=byId.get(p.id);if(t)p.title=t.title;});
const originalRender=renderTaskBody,originalScore=scoreCurrentRue;
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const current=()=>{const t=(window.RUE_TESTS||[]).find(x=>x.id===state.selectedTestId);return t&&t.v2?t:null;};
const normalise=s=>String(s==null?'':s).toLowerCase().replace(/[’‘]/g,"'").replace(/won't/g,'will not').replace(/can't/g,'cannot').replace(/n't/g,' not').replace(/\b([a-z]+)'ll\b/g,'$1 will').replace(/\b([a-z]+)'ve\b/g,'$1 have').replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
const first=[1,9,17,25,31,37,43];
function split(left,right,index,cls){const w=(state.splitWidths&&state.splitWidths[index])||50;return '<div class="split-task '+cls+'" style="--left-width:'+w+'%"><section class="split-pane split-left">'+left+'</section><div class="split-divider" id="splitDivider" role="separator" tabindex="0"><button data-resize="less">‹</button><button data-resize="more">›</button></div><section class="split-pane split-right">'+right+'</section></div>';}
function intro(i){return '<div class="task-instructions"><strong>Reading and Use of English · Part '+(i+1)+'</strong><p>Answer the questions carefully and use the navigation below to move between questions.</p></div>';}
renderTaskBody=function(p,index){
 const t=current();if(!(p&&p.id==='rue'&&t&&[3,5,6].includes(index)))return originalRender(p,index);
 const d=t.parts[index+1],pi=papers().findIndex(x=>x.id==='rue'),key=q=>taskKey(pi,index,q),val=q=>answerValue(key(q));
 if(index===3)return intro(index)+'<div class="transform-list">'+d.items.map((x,q)=>'<article class="transform-item"><strong>'+(first[index]+q)+'</strong><p>'+esc(x.a)+'</p><p><b>'+esc(x.keyword)+'</b></p><p>'+esc(x.b)+'</p><input class="rue-gap-input" data-answer="'+key(q)+'" data-question="'+q+'" value="'+esc(val(q))+'" placeholder="Your answer"></article>').join('')+'</div>';
 if(index===5){
  const left='<h2 class="lorem-title">'+esc(d.title)+'</h2><article class="reading-passage">'+d.paragraphs.map(x=>'<p>'+esc(x).replace(/\[\[(\d+)\]\]/g,(m,n)=>{const q=+n,a=val(q),s=a&&d.sentences[a.charCodeAt(0)-65];return '<button class="text-gap '+(a?'filled':'')+'" data-drop-gap="'+q+'">'+(a?esc(a+'. '+s):'['+(first[index]+q)+']')+'</button>';})+'</p>').join('')+'</article>';
  const used=new Set(Array.from({length:6},(_,q)=>val(q)).filter(Boolean));
  const right='<div class="sentence-bank"><h3>Sentences A–G</h3>'+d.sentences.map((s,i)=>{const a=String.fromCharCode(65+i),u=used.has(a);return '<button class="sentence-choice '+(u?'used':'')+'" data-sentence="'+a+'" draggable="'+(!u)+'" '+(u?'disabled':'')+'>'+a+'. '+esc(s)+'</button>';}).join('')+'</div>';
  return intro(index)+split(left,right,index,'part-six');
 }
 const left='<h2 class="lorem-title">'+esc(d.title)+'</h2>'+d.sections.map(s=>'<section class="matching-section"><h3>'+esc(s[0])+'</h3><p>'+esc(s[1])+'</p></section>').join('');
 const right='<div class="question-scroll">'+d.questions.map((q,i)=>'<article class="mc-question"><h3><span class="number-box">'+(first[index]+i)+'</span>'+esc(q[0])+'</h3><div class="match-options">'+['A','B','C','D','E'].map(a=>'<label><input type="radio" name="rue7-'+i+'" data-answer="'+key(i)+'" data-question="'+i+'" value="'+a+'" '+(val(i)===a?'checked':'')+'> '+a+'</label>').join('')+'</div></article>').join('')+'</div>';
 return intro(index)+split(left,right,index,'part-seven');
};
function scoreP4(item,got){const n=normalise(got),w=n?n.split(' '):[],kw=normalise(item.keyword);if(!n||w.length<2||w.length>5||!w.includes(kw))return 0;const a=(item.ans||[[],[]])[0].map(normalise),b=(item.ans||[[],[]])[1].map(normalise);if(a.some(x=>b.some(y=>n===x+' '+y)))return 2;const whole=v=>(' '+n+' ').includes(' '+v+' ');return a.some(whole)||b.some(whole)?1:0;}
function modelAnswer(item){return item.answer||((((item.ans||[[]])[0]||[])[0]||'')+' '+(((item.ans||[[],[]])[1]||[])[0]||'')).trim();}
scoreCurrentRue=function(){
 const t=current();if(!t)return originalScore();const pi=papers().findIndex(p=>p.id==='rue');if(pi<0)return null;
 const counts=[8,8,8,6,6,6,10],maxima=[8,8,8,12,12,12,10];let reading=0,use=0,details=[],questions=[];
 for(let part=1;part<=7;part++){const d=t.parts[part],rows=[],max=maxima[part-1];let marks=0,correct=0;
  for(let q=0;q<counts[part-1];q++){const raw=answerValue(taskKey(pi,part-1,q)),got=String(raw||'').trim();let accepted=[],correctAnswer='',earned=0,status='wrong';
   if(part===4){earned=scoreP4(d.items[q],got);correctAnswer=modelAnswer(d.items[q]);accepted=[correctAnswer];status=!got?'not answered':earned===2?'correct':earned===1?'partly correct':'wrong';}
   else{if(part===2||part===3)accepted=String(d.answers[q]||'').split('|');else if(part===1||part===6)accepted=[d.answers[q]];else if(part===5)accepted=[d.questions[q][2]];else accepted=[d.questions[q][1]];correctAnswer=accepted.join(' / ');const ok=accepted.map(normalise).includes(normalise(got));const per=(part===5||part===6)?2:1;earned=ok?per:0;status=!got?'not answered':ok?'correct':'wrong';}
   if(status==='correct')correct++;marks+=earned;const sentence=part===6&&got&&/^[A-G]$/.test(got)?d.sentences[got.charCodeAt(0)-65]:'';rows.push({question:first[part-1]+q,candidate:got,correctAnswer,accepted,marks:earned,maxMarks:(part===4||part===5||part===6)?2:1,status,sentence});
  }details.push({part,correct,marks,max});questions.push(rows);if([1,5,6,7].includes(part))reading+=marks;else use+=marks;
 }return {reading,useOfEnglish:use,total:reading+use,details,questions};
};
function reviewHTML(score){return '<div class="rue-review">'+score.questions.map((rows,i)=>{const d=score.details[i];return '<section class="review-part"><h2>Part '+(i+1)+': '+d.marks+'/'+d.max+'</h2>'+rows.map(r=>'<div class="review-row '+r.status+'"><b>'+r.question+' · '+r.marks+'/'+r.maxMarks+'</b><span class="review-status">'+(r.status==='correct'?'✓':r.status==='partly correct'?'△':r.status==='not answered'?'—':'✗')+'</span><div><strong>'+({correct:'Correct','partly correct':'Partly correct',wrong:'Wrong','not answered':'Not answered'})[r.status]+'</strong><br>Your answer: '+esc(r.candidate||'—')+'<br>Correct answer: '+esc(r.correctAnswer)+(r.sentence?'<br>Sentence: '+esc(r.sentence):'')+'</div></div>').join('')+'</section>';}).join('')+'</div>';}
const originalRecord=recordCompletedSession;
recordCompletedSession=function(){originalRecord();if(state.history&&state.history[0]&&state.history[0].scores)persistProgress();};
renderComplete=function(){recordCompletedSession();const score=scoreCurrentRue();const report=score?'<div class="choice"><span class="symbol green">✓</span><span><strong>Reading: '+score.reading+' / 42</strong><small>Parts 1, 5, 6 and 7</small><strong>Use of English: '+score.useOfEnglish+' / 28</strong><small>Parts 2, 3 and 4</small><strong>Total: '+score.total+' / 70</strong></span></div>':'<div class="note">Answers have been saved.</div>';frame('Practice complete','You have reached the end of your selected papers.',report+'<div class="note">This is a practice raw-mark result for original candidate material, not an official Cambridge English Scale score.</div>','<div class="actions"><button class="primary" id="reviewAnswers">Review answers</button><button class="secondary" id="again">Back to summary</button><button class="secondary" id="home">Back to start</button></div>');const show=()=>{frame('Review answers','Check every answer and the marks awarded.',reviewHTML(score),'<div class="actions"><button class="secondary" id="reviewBack">Back</button></div>');document.getElementById('reviewBack').onclick=renderComplete;};document.getElementById('reviewAnswers').onclick=show;document.getElementById('again').onclick=()=>{state.currentPaper=0;state.remaining=0;renderSummary(modes.find(m=>m.id===state.mode));};document.getElementById('home').onclick=renderHome;};
window.runRueSelfTests=function(){const errors=[],counts=[8,8,8,6,6,6,10],seen=new Set();if((window.RUE_TESTS||[]).length!==10)errors.push('Expected 10 tests');(window.RUE_TESTS||[]).forEach(t=>{if(seen.has(t.id))errors.push('Duplicate '+t.id);seen.add(t.id);for(let p=1;p<=7;p++){const d=t.parts&&t.parts[p],n=counts[p-1];if(!d){errors.push(t.id+' missing Part '+p);continue;}if(p===1&&((d.options||[]).length!==8||(d.answers||[]).length!==8))errors.push(t.id+' Part 1 count');if((p===2||p===3)&&(d.answers||[]).length!==n)errors.push(t.id+' Part '+p+' count');if(p===4&&(d.items||[]).length!==6)errors.push(t.id+' Part 4 count');if(p===5&&(d.questions||[]).length!==6)errors.push(t.id+' Part 5 count');if(p===6&&((d.answers||[]).length!==6||(d.sentences||[]).length!==7))errors.push(t.id+' Part 6 count');if(p===7&&(d.questions||[]).length!==10)errors.push(t.id+' Part 7 count');}});return {passed:!errors.length,errors,tests:(window.RUE_TESTS||[]).length,questionsPerTest:52,readingMax:42,useOfEnglishMax:28,totalMax:70};};
})();