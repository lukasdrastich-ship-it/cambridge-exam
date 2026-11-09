#!/usr/bin/env node
const fs=require('fs');
const vm=require('vm');
const path=require('path');

const files=['data/rue-b2-01.js','data/rue-b2-02.js','data/rue-b2-03.js','data/rue-b2-04.js','data/rue-b2-05.js'];
const sandbox={window:{}};
vm.createContext(sandbox);
const errors=[],warnings=[],ids=new Set();
const counts=[8,8,8,6,6,6,10];

for(const file of files){
 if(!fs.existsSync(file)){warnings.push('Missing (not checked): '+file);continue;}
 try{vm.runInContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file});}
 catch(err){errors.push(file+': '+err.message);}
}
const tests=sandbox.window.RUE_V2_TESTS||[];
for(const test of tests){
 if(ids.has(test.id))errors.push('Duplicate id: '+test.id);
 ids.add(test.id);
 for(let p=1;p<=7;p++){
  const d=test.parts&&test.parts[p],n=counts[p-1];
  if(!d){errors.push(test.id+' missing Part '+p);continue;}
  if(p===1&&((d.options||[]).length!==n||(d.answers||[]).length!==n))errors.push(test.id+' Part 1 count');
  if((p===2||p===3)&&(d.answers||[]).length!==n)errors.push(test.id+' Part '+p+' count');
  if(p===4){
   if((d.items||[]).length!==n)errors.push(test.id+' Part 4 count');
   (d.items||[]).forEach((x,i)=>{
    const words=String(x.answer||'').trim().split(/\s+/).filter(Boolean);
    if(words.length<2||words.length>5)errors.push(test.id+' Part 4 item '+(i+1)+' answer must contain 2–5 words');
    if(!String(x.answer||'').toUpperCase().includes(String(x.keyword||'').toUpperCase()))errors.push(test.id+' Part 4 item '+(i+1)+' answer does not contain key word');
   });
  }
  if(p===5&&(d.questions||[]).length!==n)errors.push(test.id+' Part 5 count');
  if(p===6){
   if((d.answers||[]).length!==n||(d.sentences||[]).length!==7)errors.push(test.id+' Part 6 count');
   const markers=new Set((d.paragraphs||[]).flatMap(x=>Array.from(String(x).matchAll(/\[\[(\d+)\]\]/g),m=>+m[1])));
   for(let i=0;i<6;i++)if(!markers.has(i))errors.push(test.id+' Part 6 missing [['+i+']]');
   (d.answers||[]).forEach((x,i)=>{if(!/^[A-G]$/.test(x))errors.push(test.id+' Part 6 answer '+(i+1)+' is not A–G');});
  }
  if(p===7){
   if((d.questions||[]).length!==n)errors.push(test.id+' Part 7 count');
   (d.questions||[]).forEach((x,i)=>{if(!/^[A-E]$/.test(x[1]))errors.push(test.id+' Part 7 answer '+(i+1)+' is not A–E');});
  }
 }
}
function scan(value,where){
 if(typeof value==='string'&&value.includes("'"))errors.push(where+' contains a straight apostrophe in string content');
 else if(Array.isArray(value))value.forEach((x,i)=>scan(x,where+'['+i+']'));
 else if(value&&typeof value==='object')Object.entries(value).forEach(([k,v])=>scan(v,where+'.'+k));
}
tests.forEach(t=>scan(t,t.id));
warnings.forEach(x=>console.warn('WARN:',x));
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('OK: '+tests.length+' V2 tests checked; counts 8,8,8,6,6,6,10; no duplicate ids.');
