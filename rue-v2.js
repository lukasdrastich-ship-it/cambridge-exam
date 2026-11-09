/* V2 integration for original B2 Reading and Use of English candidate tests. */
(function(){
'use strict';
const oldTests=Array.isArray(window.RUE_TESTS)?window.RUE_TESTS.slice():[];
const v2Tests=Array.isArray(window.RUE_V2_TESTS)?window.RUE_V2_TESTS.slice():[];
const v2ById=new Map(v2Tests.map(t=>[t.id,t]));
window.RUE_TESTS=oldTests.map(t=>v2ById.get(t.id)||t);
v2Tests.forEach(t=>{if(!window.RUE_TESTS.some(x=>x.id===t.id))window.RUE_TESTS.push(t);});
if(typeof TEST_BANK!=='undefined')TEST_BANK.forEach(p=>{const t=v2ById.get(p.id);if(t)p.title=t.title;});

const originalRender=window.renderTaskBody||renderTaskBody;
function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function test(){const t=(window.RUE_TESTS||[]).find(x=>x.id===state.selectedTestId);return t&&t.v2?t:null;}
function key(part,q){return taskKey(state.currentPaper,part,q);}
function val(part,q){return answerValue(key(part,q));}
function intro(i){return '<div class="task-instructions"><strong>Reading and Use of English · Part '+(i+1)+'</strong><p>Answer the questions carefully and use the navigation below to move between questions.</p></div>';}
function split(l,r,c,i){const w=(state.splitWidths&&state.splitWidths[i])||50;return '<div class="split-task '+c+'" style="--left-width:'+w+'%"><section class="split-pane split-left" id="splitLeft">'+l+'</section><div class="split-divider" id="splitDivider" role="separator" tabindex="0"><button data-resize="less" aria-label="Narrow left column">‹</button><button data-resize="more" aria-label="Widen left column">›</button></div><section class="split-pane split-right" id="splitRight">'+r+'</section></div>';}

window.renderTaskBody=function(p,index){
 const t=test();
 if(!(p&&p.id==='rue'&&t&&[3,5,6].includes(index)))return originalRender(p,index);
 const d=t.parts[index+1],first=[1,9,17,25,31,37,43][index];
 if(index===3){
  return intro(index)+'<div class="transform-list">'+d.items.map((x,q)=>'<article class="transform-item"><strong>'+(first+q)+'</strong><p>'+esc(x.a)+'</p><b>'+esc(x.keyword)+'</b><p>'+esc(x.b)+'</p><input class="rue-gap-input" data-answer="'+key(index,q)+'" data-question="'+q+'" value="'+esc(val(index,q))+'" placeholder="Your answer"></article>').join('')+'</div>';
 }
 if(index===5){
  const left='<h2 class="lorem-title">'+esc(d.title)+'</h2><article class="reading-passage">'+d.paragraphs.map(x=>'<p>'+esc(x).replace(/\[\[(\d+)\]\]/g,(m,n)=>{const q=+n,s=val(index,q),sentence=s&&d.sentences[s.charCodeAt(0)-65];return '<button class="text-gap '+(s?'filled':'')+'" data-drop-gap="'+q+'">'+(s?esc(s+'. '+sentence):'['+(first+q)+']')+'</button>';})+'</p>').join('')+'</article>';
  const used=new Set(d.paragraphs.map((_,q)=>val(index,q)).filter(Boolean));
  const right='<div class="sentence-bank"><h3>Sentences A–G</h3>'+d.sentences.map((s,i)=>{const letter=String.fromCharCode(65+i),u=used.has(letter);return '<button class="sentence-choice '+(u?'used':'')+'" data-sentence="'+letter+'" draggable="'+(!u)+'" '+(u?'disabled':'')+'>'+letter+'. '+esc(s)+'</button>';}).join('')+'<p class="sentence-hint">Select a sentence, then click the gap where you want to insert it.</p><div class="sentence-status" aria-live="polite"></div></div>';
  return intro(index)+split(left,right,'reading-split part-six',index);
 }
 const left='<h2 class="lorem-title">'+esc(d.title)+'</h2><article class="reading-passage">'+d.sections.map(x=>'<section class="matching-section"><h3>'+esc(x[0])+'</h3><p>'+esc(x[1])+'</p></section>').join('')+'</article>';
 const right='<div class="question-scroll"><h3>Which person?</h3>'+d.questions.map((x,q)=>'<article class="mc-question"><h3><span class="number-box">'+(first+q)+'</span>'+esc(x[0])+'</h3><div class="match-options">'+['A','B','C','D','E'].map(a=>'<label class="match-option"><input type="radio" name="rue7-'+q+'" data-answer="'+key(index,q)+'" data-question="'+q+'" value="'+a+'" '+(val(index,q)===a?'checked':'')+'> '+a+'</label>').join('')+'</div></article>').join('')+'</div>';
 return intro(index)+split(left,right,'reading-split part-seven',index);
};

const originalScore=window.scoreCurrentRue||scoreCurrentRue;
function norm(v){return String(v==null?'':v).toLowerCase().trim().replace(/’/g,"'").replace(/n't\b/g,' not').replace(/can't\b/g,'cannot').replace(/[.,;:!?“”‘’()[\]{}]/g,' ').replace(/\s+/g,' ').trim();}
function p4(item,got){
 const n=norm(got),ws=n.split(/\s+/).filter(Boolean),kw=norm(item.keyword);
 if(!n||ws.length<2||ws.length>5||!ws.includes(kw))return 0;
 const a=(item.ans&&item.ans[0])||[],b=(item.ans&&item.ans[1])||[];
 const models=[];a.forEach(x=>b.forEach(y=>models.push(norm(x+' '+y))));
 if(models.includes(n))return 2;
 return a.some(x=>n.includes(norm(x)))||b.some(x=>n.includes(norm(x)))?1:0;
}
window.scoreCurrentRue=function(){
 const t=test();if(!t)return originalScore();
 const selected=papers(),paperIndex=selected.findIndex(p=>p.id==='rue');if(paperIndex<0)return null;
 let reading=0,useOfEnglish=0;const details=[],counts=[8,8,8,6,6,6,10],max=[8,8,8,12,12,12,10];
 for(let part=1;part<=7;part++){
  const d=t.parts[part];let correct=0,marks=0;
  for(let q=0;q<counts[part-1];q++){
   const got=answerValue(taskKey(paperIndex,part-1,q));
   if(part===4){const m=p4(d.items[q],got);marks+=m;if(m===2)correct++;continue;}
   let expected;
   if(part===2||part===3)expected=(d.answers[q]||'').split('|').map(norm);
   else if(part===1||part===6)expected=[norm(d.answers[q])];
   else if(part===5)expected=[norm(d.questions[q][2])];
   else expected=[norm(d.questions[q][1])];
   if(expected.includes(norm(got))){correct++;marks+=(part===5||part===6?2:1);}
  }
  details.push({part,correct,marks,max:max[part-1]});
  if([1,5,6,7].includes(part))reading+=marks;else useOfEnglish+=marks;
 }
 return {reading,useOfEnglish,total:reading+useOfEnglish,details};
};

window.runRueSelfTests=function(){
 const errors=[],counts=[8,8,8,6,6,6,10],ids=new Set();
 if(!Array.isArray(window.RUE_TESTS)||window.RUE_TESTS.length!==10)errors.push('Expected 10 tests');
 window.RUE_TESTS.forEach((t,i)=>{
  if(ids.has(t.id))errors.push('Duplicate id '+t.id);ids.add(t.id);
  for(let p=1;p<=7;p++){const d=t.parts&&t.parts[p],n=counts[p-1];if(!d){errors.push('Test '+(i+1)+' missing Part '+p);continue;}
   if(p===1&&((d.options||[]).length!==n||(d.answers||[]).length!==n))errors.push('Test '+(i+1)+' Part 1 count');
   if((p===2||p===3)&&(d.answers||[]).length!==n)errors.push('Test '+(i+1)+' Part '+p+' count');
   if(p===4&&(d.items||[]).length!==n)errors.push('Test '+(i+1)+' Part 4 count');
   if(p===5&&(d.questions||[]).length!==n)errors.push('Test '+(i+1)+' Part 5 count');
   if(p===6&&((d.answers||[]).length!==n||(d.sentences||[]).length!==7))errors.push('Test '+(i+1)+' Part 6 count');
   if(p===7&&(d.questions||[]).length!==n)errors.push('Test '+(i+1)+' Part 7 count');
  }
 });
 return {passed:errors.length===0,errors,tests:window.RUE_TESTS.length,questionsPerTest:52,readingMax:42,useOfEnglishMax:28,totalMax:70};
};
})();