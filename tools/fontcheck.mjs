import { launch, connect, goto, evalJs } from './cdp.mjs'
const { proc, wsUrl } = await launch()
const cdp = await connect(wsUrl)
await goto(cdp, 'http://localhost:5173/__measure.html')
const out = await evalJs(cdp, `JSON.stringify((()=>{
  const mk=(fam,w,size,text,ls)=>{const e=document.createElement('span');
    e.style.cssText='font-family:'+fam+';font-weight:'+w+';font-size:'+size+'px;white-space:pre;display:inline-block;letter-spacing:'+(ls||0)+'px';
    e.textContent=text;document.body.appendChild(e);const r=e.getBoundingClientRect();e.remove();
    return {fam,w,width:+r.width.toFixed(2),height:+r.height.toFixed(2)};};
  const loaded=[...document.fonts].map(f=>f.family+'/'+f.weight+'/'+f.status);
  return {loaded, tests:[
    mk('Bossa',400,100,'Hamburgefonstiv'),
    mk('Bossa',500,100,'Hamburgefonstiv'),
    mk('Arial',400,100,'Hamburgefonstiv'),
    mk('Bossa',500,90,"L'excellence dans"),
    mk('Bossa',400,90,"L'excellence dans"),
    mk('Bossa',300,90,"L'excellence dans"),
    mk('Bossa',700,90,"L'excellence dans"),
    mk('Bossa',900,90,"L'excellence dans"),
  ]};})())`)
console.log(JSON.stringify(JSON.parse(out), null, 1))
cdp.close(); proc.kill()
