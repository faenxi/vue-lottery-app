import{E as g,G as h,o as l,b as d,I as p,a as m,d as k,c as v,u as y,f as S,aJ as w,n as b,B as _}from"./index-B6Gl6rbD.js";var x=`
    .p-progressspinner {
        position: relative;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        display: inline-block;
    }

    .p-progressspinner::before {
        content: '';
        display: block;
        padding-top: 100%;
    }

    .p-progressspinner-spin {
        height: 100%;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: p-progressspinner-rotate 2s linear infinite;
    }

    .p-progressspinner-circle {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: 0;
        stroke: dt('progressspinner.colorOne');
        animation:
            p-progressspinner-dash 1.5s ease-in-out infinite,
            p-progressspinner-color 6s ease-in-out infinite;
        stroke-linecap: round;
    }

    @keyframes p-progressspinner-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes p-progressspinner-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
    @keyframes p-progressspinner-color {
        100%,
        0% {
            stroke: dt('progressspinner.color.one');
        }
        40% {
            stroke: dt('progressspinner.color.two');
        }
        66% {
            stroke: dt('progressspinner.color.three');
        }
        80%,
        90% {
            stroke: dt('progressspinner.color.four');
        }
    }
`,B={root:"p-progressspinner",spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},$=g.extend({name:"progressspinner",style:x,classes:B}),A={name:"BaseProgressSpinner",extends:h,props:{strokeWidth:{type:String,default:"2"},fill:{type:String,default:"none"},animationDuration:{type:String,default:"2s"}},style:$,provide:function(){return{$pcProgressSpinner:this,$parentInstance:this}}},f={name:"ProgressSpinner",extends:A,inheritAttrs:!1,computed:{svgStyle:function(){return{"animation-duration":this.animationDuration}}}},P=["fill","stroke-width"];function I(n,s,t,i,c,a){return l(),d("div",p({class:n.cx("root"),role:"progressbar"},n.ptmi("root")),[(l(),d("svg",p({class:n.cx("spin"),viewBox:"25 25 50 50",style:a.svgStyle},n.ptm("spin")),[m("circle",p({class:n.cx("circle"),cx:"50",cy:"50",r:"20",fill:n.fill,"stroke-width":n.strokeWidth,strokeMiterlimit:"10"},n.ptm("circle")),null,16,P)],16))],16)}f.render=I;const M=k({__name:"AppSpinner",setup(n){return(s,t)=>(l(),v(y(f),{"stroke-width":"4","aria-label":"Loading",class:"app-spinner"}))}}),E=S(M,[["__scopeId","data-v-c9e9b500"]]),W=3,N=w("winners",()=>{const n=b([]),s=_(()=>n.value.length>=W);function t(e){return e.filter(r=>!n.value.some(o=>o.id===r.id))}function i(e){return!s.value&&t(e).length>0}function c(e){if(!i(e))return;const r=t(e),o=r[Math.floor(Math.random()*r.length)];o&&n.value.push(o)}function a(e){n.value=n.value.filter(r=>r.id!==e)}function u(e){n.value=n.value.map(r=>r.id===e.id?e:r)}return{winners:n,isFull:s,canDraw:i,draw:c,remove:a,update:u}});export{E as A,N as u};
