import j from"type-flag";import N from"tty";import B,{breakpoints as P}from"terminal-columns";const S=t=>t.replace(/[-_ ](\w)/g,(e,r)=>r.toUpperCase()),q=t=>t.replace(/\B([A-Z])/g,"-$1").toLowerCase(),I={"> 80":[{width:"content-width",paddingLeft:2,paddingRight:8},{width:"auto"}],"> 40":[{width:"auto",paddingLeft:2,paddingRight:8,preprocess:t=>t.trim()},{width:"100%",paddingLeft:2,paddingBottom:1}],"> 0":{stdoutColumns:1e3,columns:[{width:"content-width",paddingLeft:2,paddingRight:8},{width:"content-width"}]}};function R(t){let e=!1;const n=Object.keys(t).sort((a,i)=>a.localeCompare(i)).map(a=>{const i=t[a],s="alias"in i;return s&&(e=!0),{name:a,flag:i,flagFormatted:`--${q(a)}`,aliasesEnabled:e,aliasFormatted:s?`-${i.alias}`:void 0}}).map(a=>(a.aliasesEnabled=e,[{type:"flagName",data:a},{type:"flagDescription",data:a}]));return{type:"table",data:{tableData:n,tableBreakpoints:I}}}const C=t=>!t||(t.version??(t.help?t.help.version:void 0)),x=t=>{const e="parent"in t&&t.parent?.name;return(e?`${e} `:"")+t.name};function D(t){const e=[];t.name&&e.push(x(t));const r=C(t)??("parent"in t&&C(t.parent));if(r&&e.push(`v${r}`),e.length!==0)return{id:"name",type:"text",data:`${e.join(" ")}
`}}function L(t){const{help:e}=t;if(!(!e||!e.description))return{id:"description",type:"text",data:`${e.description}
`}}function T(t){const e=t.help||{};if("usage"in e)return e.usage?{id:"usage",type:"section",data:{title:"Usage:",body:Array.isArray(e.usage)?e.usage.join(`
`):e.usage}}:void 0;if(t.name){const r=[],n=[x(t)];if(t.flags&&Object.keys(t.flags).length>0&&n.push("[flags...]"),t.parameters&&t.parameters.length>0){const{parameters:a}=t,i=a.indexOf("--"),s=i>-1&&a.slice(i+1).some(o=>o.startsWith("<"));n.push(a.map(o=>o!=="--"?o:s?"--":"[--]").join(" "))}if(n.length>1&&r.push(n.join(" ")),"commands"in t&&t.commands?.length&&r.push(`${t.name} <command>`),r.length>0)return{id:"usage",type:"section",data:{title:"Usage:",body:r.join(`
`)}}}}function _(t){if(!("commands"in t)||!t.commands?.length)return;const e=t.commands.map(n=>[n.options.name,n.options.help?n.options.help.description:""]);return{id:"commands",type:"section",data:{title:"Commands:",body:{type:"table",data:{tableData:e,tableOptions:[{width:"content-width",paddingLeft:2,paddingRight:8}]}},indentBody:0}}}function k(t){if(!(!t.flags||Object.keys(t.flags).length===0))return{id:"flags",type:"section",data:{title:"Flags:",body:R(t.flags),indentBody:0}}}function F(t){const{help:e}=t;if(!e||!e.examples||e.examples.length===0)return;let{examples:r}=e;if(Array.isArray(r)&&(r=r.join(`
`)),r)return{id:"examples",type:"section",data:{title:"Examples:",body:r}}}function H(t){if(!("alias"in t)||!t.alias)return;const{alias:e}=t,r=Array.isArray(e)?e.join(", "):e;return{id:"aliases",type:"section",data:{title:"Aliases:",body:r}}}const U=t=>[D,L,T,_,k,F,H].map(e=>e(t)).filter(Boolean),J=N.WriteStream.prototype.hasColors();class M{text(e){return e}bold(e){return J?`\x1B[1m${e}\x1B[22m`:e.toLocaleUpperCase()}indentText({text:e,spaces:r}){return e.replace(/^/gm," ".repeat(r))}heading(e){return this.bold(e)}section({title:e,body:r,indentBody:n=2}){return`${(e?`${this.heading(e)}
`:"")+(r?this.indentText({text:this.render(r),spaces:n}):"")}
`}table({tableData:e,tableOptions:r,tableBreakpoints:n}){return B(e.map(a=>a.map(i=>this.render(i))),n?P(n):r)}flagParameter(e){return e===Boolean?"":e===String?"<string>":e===Number?"<number>":Array.isArray(e)?this.flagParameter(e[0]):"<value>"}flagOperator(e){return" "}flagName(e){const{flag:r,flagFormatted:n,aliasesEnabled:a,aliasFormatted:i}=e;let s="";if(i?s+=`${i}, `:a&&(s+="    "),s+=n,"placeholder"in r&&typeof r.placeholder=="string")s+=`${this.flagOperator(e)}${r.placeholder}`;else{const o=this.flagParameter("type"in r?r.type:r);o&&(s+=`${this.flagOperator(e)}${o}`)}return s}flagDefault(e){return JSON.stringify(e)}flagDescription({flag:e}){let r="description"in e?e.description??"":"";if("default"in e){let{default:n}=e;typeof n=="function"&&(n=n()),n&&(r+=` (default: ${this.flagDefault(n)})`)}return r}render(e){if(typeof e=="string")return e;if(Array.isArray(e))return e.map(r=>this.render(r)).join(`
`);if("type"in e&&this[e.type]){const r=this[e.type];if(typeof r=="function")return r.call(this,e.data)}throw new Error(`Invalid node type: ${JSON.stringify(e)}`)}}const y=/^[\w.-]+$/,{stringify:d}=JSON,V=/[|\\{}()[\]^$+*?.]/;function w(t){const e=[];let r,n;for(const a of t){if(n)throw new Error(`Invalid parameter: Spread parameter ${d(n)} must be last`);const i=a[0],s=a[a.length-1];let o;if(i==="<"&&s===">"&&(o=!0,r))throw new Error(`Invalid parameter: Required parameter ${d(a)} cannot come after optional parameter ${d(r)}`);if(i==="["&&s==="]"&&(o=!1,r=a),o===void 0)throw new Error(`Invalid parameter: ${d(a)}. Must be wrapped in <> (required parameter) or [] (optional parameter)`);let l=a.slice(1,-1);const f=l.slice(-3)==="...";f&&(n=a,l=l.slice(0,-3));const p=l.match(V);if(p)throw new Error(`Invalid parameter: ${d(a)}. Invalid character found ${d(p[0])}`);e.push({name:l,required:o,spread:f})}return e}function b(t,e,r,n){for(let a=0;a<e.length;a+=1){const{name:i,required:s,spread:o}=e[a],l=S(i);if(l in t)throw new Error(`Invalid parameter: ${d(i)} is used more than once.`);const f=o?r.slice(a):r[a];if(o&&(a=e.length),s&&(!f||o&&f.length===0))return console.error(`Error: Missing required parameter ${d(i)}
`),n(),process.exit(1);t[l]=f}}function W(t){return t===void 0||t!==!1}function A(t,e,r,n){const a={...e.flags},i=e.version;i&&(a.version={type:Boolean,description:"Show version"});const{help:s}=e,o=W(s);o&&!("help"in a)&&(a.help={type:Boolean,alias:"h",description:"Show help"});const l=j(a,n),f=()=>{console.log(e.version)};if(i&&l.flags.version===!0)return f(),process.exit(0);const p=new M,O=o&&s?.render?s.render:c=>p.render(c),u=c=>{const m=U({...e,...c?{help:c}:{},flags:a});console.log(O(m,p))};if(o&&l.flags.help===!0)return u(),process.exit(0);if(e.parameters){let{parameters:c}=e,m=l._;const g=c.indexOf("--"),v=c.slice(g+1),h=Object.create(null);if(g>-1&&v.length>0){c=c.slice(0,g);const E=l._["--"];m=m.slice(0,-E.length||void 0),b(h,w(c),m,u),b(h,w(v),E,u)}else b(h,w(c),m,u);Object.assign(l._,h)}const $={...l,showVersion:f,showHelp:u};return typeof r=="function"&&r($),{command:t,...$}}function Z(t,e){const r=new Map;for(const n of e){const a=[n.options.name],{alias:i}=n.options;i&&(Array.isArray(i)?a.push(...i):a.push(i));for(const s of a){if(r.has(s))throw new Error(`Duplicate command name found: ${d(s)}`);r.set(s,n)}}return r.get(t)}function z(t,e,r=process.argv.slice(2)){if(!t)throw new Error("Options is required");if("name"in t&&(!t.name||!y.test(t.name)))throw new Error(`Invalid script name: ${d(t.name)}`);const n=r[0];if(t.commands&&y.test(n)){const a=Z(n,t.commands);if(a)return A(a.options.name,{...a.options,parent:t},a.callback,r.slice(1))}return A(void 0,t,e,r)}function G(t,e){if(!t)throw new Error("Command options are required");const{name:r}=t;if(t.name===void 0)throw new Error("Command name is required");if(!y.test(r))throw new Error(`Invalid command name ${JSON.stringify(r)}. Command names must be one word.`);return{options:t,callback:e}}export{z as cli,G as command};