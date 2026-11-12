const fs=require('fs'),vm=require('vm'),path=require('path');
const ctx={window:{}};vm.createContext(ctx);
const files=['rue-b2-01.js','rue-b2-02.js','rue-b2-03.js','rue-b2-04.js','rue-b2-05.js'];
let errs=[];
files.forEach(f=>{try{vm.runInContext(fs.readFileSync(path.join(__dirname,'..','data',f),'utf8'),ctx,{filename:f})}catch(e){errs.push(f+': '+e.message)}});
const T=ctx.window.RUE_V2_TESTS||[];
const wc=s=>String(s).trim().split(/\s+/).filter(Boolean).length;
const norm=s=>String(s).toLowerCase().replace(/[’‘]/g,"'").replace(/won't/g,'will not').replace(/can't/g,'cannot').replace(/n't/g,' not').replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
const ids=new Set();
T.forEach(t=>{
 const id=t.id; if(ids.has(id))errs.push('dup '+id); ids.add(id);
 const p=t.parts; let words=0;
 const chk=(c,m)=>{if(!c)errs.push(id+': '+m)};
 // P1
 chk(p[1].options.length===8&&p[1].answers.length===8,'p1 counts');
 for(let i=0;i<8;i++){chk(p[1].text.includes('[['+i+']]'),'p1 marker '+i);chk(p[1].options[i].length===4,'p1 opt len '+i);chk('ABCD'.includes(p[1].answers[i]),'p1 ans '+i)}
 words+=wc(p[1].text);
 // P2
 chk(p[2].answers.length===8,'p2 counts');for(let i=0;i<8;i++)chk(p[2].text.includes('[['+i+']]'),'p2 marker '+i);words+=wc(p[2].text);
 // P3
 chk(p[3].words.length===8&&p[3].answers.length===8,'p3 counts');for(let i=0;i<8;i++){chk(p[3].text.includes('[['+i+']]'),'p3 marker '+i);chk(p[3].words[i][0]===p[3].answers[i],'p3 ans mismatch '+i)}words+=wc(p[3].text);
 // P4
 chk(p[4].items.length===6,'p4 count');
 p[4].items.forEach((x,i)=>{
  const w=norm(x.answer).split(' ');chk(w.length>=2&&w.length<=5,'p4 words '+i+' '+x.answer);
  chk(w.includes(x.keyword.toLowerCase()),'p4 keyword '+i+' '+x.answer);
  const h1=x.ans[0].map(norm),h2=x.ans[1].map(norm);
  chk(h1.some(a=>h2.some(b=>a+' '+b===norm(x.answer))),'p4 halves '+i+' '+x.answer);
  chk(!x.b.toLowerCase().includes(norm(x.answer)),'p4 b leaks answer '+i);
  chk(x.b.includes('______'),'p4 gap '+i);
  words+=wc(x.a)+wc(x.b);
 });
 // P5
 const t5=p[5].text;chk(t5.split('\n').length>=4&&t5.split('\n').length<=7,'p5 paragraphs '+t5.split('\n').length);chk(p[5].questions.length===6,'p5 qcount');
 p[5].questions.forEach((q,i)=>{chk(q[1].length===4,'p5 opts '+i);chk('ABCD'.includes(q[2]),'p5 ans '+i);
   const lens=q[1].map(o=>o.length);const ci=q[2].charCodeAt(0)-65;if(lens[ci]===Math.max(...lens)&&lens.filter(l=>l===lens[ci]).length===1)errs.push(id+': p5 q'+i+' correct is longest (info)')});
 words+=wc(t5)+p[5].questions.reduce((a,q)=>a+wc(q[0])+q[1].reduce((b,o)=>b+wc(o),0),0);
 const w5=wc(t5);
 // P6
 const t6=p[6].paragraphs.join(' ');chk(p[6].paragraphs.length>=5&&p[6].paragraphs.length<=9,'p6 paragraphs '+p[6].paragraphs.length);
 for(let i=0;i<6;i++)chk(t6.includes('[['+i+']]'),'p6 marker '+i);
 chk(p[6].sentences.length===7&&p[6].answers.length===6,'p6 counts');
 chk(new Set(p[6].answers).size===6,'p6 dup answers');
 words+=wc(t6)+p[6].sentences.reduce((a,s)=>a+wc(s),0);
 const w6=wc(t6);
 // P7
 chk(p[7].sections.length===5&&p[7].questions.length===10,'p7 counts');
 const used=new Set(p[7].questions.map(q=>q[1]));chk(used.size===5,'p7 not all sections used');
 p[7].questions.forEach((q,i)=>chk('ABCDE'.includes(q[1]),'p7 ans '+i));
 words+=p[7].sections.reduce((a,s)=>a+wc(s[1]),0)+p[7].questions.reduce((a,q)=>a+wc(q[0]),0);
 const w7=p[7].sections.reduce((a,s)=>a+wc(s[1]),0);
 // straight apostrophes
 const dump=JSON.stringify(p);if(/\\"/.test(dump))errs.push(id+': straight double quote in text');
 console.log(id,'total words ~',words,'| P5',w5,'P6',w6,'P7',w7,'| P1',wc(p[1].text),'P2',wc(p[2].text),'P3',wc(p[3].text),'| P1 longest option',Math.max(...p[1].options.flat().map(s=>s.length)));
});
console.log('tests loaded:',T.length);
console.log(errs.length?errs.join('\n'):'NO ERRORS');