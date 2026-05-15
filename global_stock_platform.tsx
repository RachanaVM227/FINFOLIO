import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  bg:"#0B0E1A", nav:"#0F1322", card:"#131729", cardHover:"#181d30",
  border:"#1e2540", accent:"#6C63FF", accent2:"#8B83FF", accentGlow:"#6C63FF44",
  teal:"#00D4AA", tealGlow:"#00D4AA33", orange:"#FF6B35", orangeGlow:"#FF6B3533",
  gold:"#FFD166", text:"#E8EAF6", sub:"#7B82A8", muted:"#3D4466",
  success:"#00D4AA", danger:"#FF4D6D", warn:"#FFD166", surface:"#0d1020", pill:"#1a2040",
};

const INR = n => "₹"+Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const PCT = (a,b) => (((b-a)/a)*100).toFixed(2);

const GLOBAL_STOCKS = [
  {ticker:"RELIANCE",name:"Reliance Industries",exchange:"NSE",sector:"Energy",price:2810,change:1.8,mktCap:"19.2L Cr",pe:28.4,high52:3050,low52:2200,vol:"4.2M",avg:"2680",bull:true},
  {ticker:"TCS",name:"Tata Consultancy Services",exchange:"NSE",sector:"Technology",price:3920,change:0.9,mktCap:"14.3L Cr",pe:32.1,high52:4200,low52:3100,vol:"1.8M",avg:"3700",bull:true},
  {ticker:"INFY",name:"Infosys Ltd.",exchange:"NSE",sector:"Technology",price:1745,change:-0.4,mktCap:"7.2L Cr",pe:24.8,high52:2000,low52:1400,vol:"3.1M",avg:"1820",bull:false},
  {ticker:"HDFC",name:"HDFC Bank",exchange:"NSE",sector:"Finance",price:1680,change:1.2,mktCap:"12.8L Cr",pe:21.3,high52:1900,low52:1400,vol:"5.6M",avg:"1590",bull:true},
  {ticker:"ICICI",name:"ICICI Bank",exchange:"NSE",sector:"Finance",price:1120,change:2.1,mktCap:"7.9L Cr",pe:19.7,high52:1280,low52:900,vol:"7.2M",avg:"1050",bull:true},
  {ticker:"WIPRO",name:"Wipro Ltd.",exchange:"NSE",sector:"Technology",price:490,change:-1.1,mktCap:"2.6L Cr",pe:18.2,high52:620,low52:420,vol:"4.8M",avg:"530",bull:false},
  {ticker:"SBIN",name:"State Bank of India",exchange:"NSE",sector:"Finance",price:830,change:0.6,mktCap:"7.4L Cr",pe:11.8,high52:980,low52:700,vol:"9.1M",avg:"800",bull:true},
  {ticker:"HCLTECH",name:"HCL Technologies",exchange:"NSE",sector:"Technology",price:1560,change:1.5,mktCap:"4.2L Cr",pe:26.4,high52:1800,low52:1200,vol:"2.4M",avg:"1480",bull:true},
  {ticker:"AAPL",name:"Apple Inc.",exchange:"NASDAQ",sector:"Technology",price:18920,change:0.7,mktCap:"$3.1T",pe:31.2,high52:21000,low52:16500,vol:"52M",avg:"18200",bull:true},
  {ticker:"MSFT",name:"Microsoft Corp.",exchange:"NASDAQ",sector:"Technology",price:36500,change:1.1,mktCap:"$2.7T",pe:35.8,high52:41000,low52:30000,vol:"21M",avg:"35000",bull:true},
  {ticker:"GOOGL",name:"Alphabet Inc.",exchange:"NASDAQ",sector:"Technology",price:15200,change:-0.3,mktCap:"$1.9T",pe:22.4,high52:17500,low52:13000,vol:"18M",avg:"15600",bull:false},
  {ticker:"AMZN",name:"Amazon.com Inc.",exchange:"NASDAQ",sector:"Consumer",price:18400,change:2.4,mktCap:"$1.9T",pe:44.1,high52:21000,low52:16000,vol:"33M",avg:"17500",bull:true},
  {ticker:"TSLA",name:"Tesla Inc.",exchange:"NASDAQ",sector:"Technology",price:17500,change:-2.1,mktCap:"$560B",pe:68.2,high52:25000,low52:14000,vol:"88M",avg:"19200",bull:false},
  {ticker:"NVDA",name:"NVIDIA Corp.",exchange:"NASDAQ",sector:"Technology",price:96000,change:3.2,mktCap:"$2.3T",pe:52.8,high52:110000,low52:60000,vol:"41M",avg:"85000",bull:true},
  {ticker:"META",name:"Meta Platforms",exchange:"NASDAQ",sector:"Technology",price:58000,change:1.8,mktCap:"$1.5T",pe:28.4,high52:65000,low52:42000,vol:"12M",avg:"54000",bull:true},
  {ticker:"BRK.B",name:"Berkshire Hathaway",exchange:"NYSE",sector:"Finance",price:41200,change:0.4,mktCap:"$890B",pe:9.2,high52:46000,low52:36000,vol:"3M",avg:"40000",bull:true},
  {ticker:"JPM",name:"JPMorgan Chase",exchange:"NYSE",sector:"Finance",price:19800,change:0.9,mktCap:"$570B",pe:12.8,high52:22000,low52:16800,vol:"8M",avg:"19200",bull:true},
  {ticker:"HSBA",name:"HSBC Holdings",exchange:"LSE",sector:"Finance",price:680,change:0.3,mktCap:"£120B",pe:8.4,high52:780,low52:580,vol:"22M",avg:"650",bull:true},
  {ticker:"7203",name:"Toyota Motor",exchange:"TSE",sector:"Industrials",price:3120,change:1.4,mktCap:"¥51T",pe:11.2,high52:3600,low52:2400,vol:"6M",avg:"2900",bull:true},
  {ticker:"BABA",name:"Alibaba Group",exchange:"HKEX",sector:"Consumer",price:7800,change:2.2,mktCap:"HK$1.6T",pe:14.8,high52:9500,low52:6000,vol:"18M",avg:"7200",bull:true},
  {ticker:"NESN",name:"Nestlé S.A.",exchange:"EURONEXT",sector:"Consumer",price:8900,change:0.2,mktCap:"CHF240B",pe:20.1,high52:10200,low52:7800,vol:"4M",avg:"8600",bull:false},
  {ticker:"RIO",name:"Rio Tinto",exchange:"ASX",sector:"Materials",price:10400,change:-0.5,mktCap:"A$120B",pe:8.8,high52:12000,low52:9200,vol:"3M",avg:"10800",bull:false},
  {ticker:"CBA",name:"Commonwealth Bank",exchange:"ASX",sector:"Finance",price:11800,change:1.0,mktCap:"A$195B",pe:22.4,high52:13500,low52:10200,vol:"2M",avg:"11200",bull:true},
  {ticker:"ADANIENT",name:"Adani Enterprises",exchange:"NSE",sector:"Industrials",price:2890,change:2.8,mktCap:"3.3L Cr",pe:88.4,high52:3800,low52:2100,vol:"1.2M",avg:"2600",bull:true},
  {ticker:"BAJFINANCE",name:"Bajaj Finance",exchange:"NSE",sector:"Finance",price:7120,change:-0.7,mktCap:"4.3L Cr",pe:34.2,high52:8200,low52:6200,vol:"0.9M",avg:"7400",bull:false},
  {ticker:"SUNPHARMA",name:"Sun Pharmaceutical",exchange:"NSE",sector:"Healthcare",price:1620,change:1.1,mktCap:"3.9L Cr",pe:38.1,high52:1900,low52:1300,vol:"1.4M",avg:"1550",bull:true},
  {ticker:"MARUTI",name:"Maruti Suzuki",exchange:"NSE",sector:"Industrials",price:12800,change:0.8,mktCap:"3.9L Cr",pe:26.8,high52:14200,low52:10500,vol:"0.4M",avg:"12200",bull:true},
  {ticker:"NTPC",name:"NTPC Ltd.",exchange:"NSE",sector:"Utilities",price:380,change:-0.2,mktCap:"3.7L Cr",pe:16.4,high52:460,low52:320,vol:"8.2M",avg:"395",bull:false},
];

const SECTORS = ["Technology","Finance","Healthcare","Energy","Consumer","Industrials","Materials","Utilities","Real Estate","Telecom"];
const EXCHANGES = ["NSE","BSE","NASDAQ","NYSE","LSE","TSE","HKEX","EURONEXT","ASX"];

const INIT_BOUGHT = [
  {id:1,ticker:"RELIANCE",name:"Reliance Industries",exchange:"NSE",sector:"Energy",qty:5,buyPrice:2450,currentPrice:2810,date:"2024-12-01"},
  {id:2,ticker:"TCS",name:"Tata Consultancy Services",exchange:"NSE",sector:"Technology",qty:3,buyPrice:3600,currentPrice:3920,date:"2025-01-15"},
  {id:3,ticker:"AAPL",name:"Apple Inc.",exchange:"NASDAQ",sector:"Technology",qty:2,buyPrice:16500,currentPrice:18920,date:"2024-11-10"},
  {id:4,ticker:"NVDA",name:"NVIDIA Corp.",exchange:"NASDAQ",sector:"Technology",qty:1,buyPrice:72000,currentPrice:96000,date:"2025-03-01"},
  {id:5,ticker:"HDFC",name:"HDFC Bank",exchange:"NSE",sector:"Finance",qty:4,buyPrice:1500,currentPrice:1680,date:"2025-02-10"},
];

const INIT_WISHLIST = [
  {id:101,ticker:"MSFT",name:"Microsoft Corp.",exchange:"NASDAQ",sector:"Technology",targetPrice:34000,currentPrice:36500,note:"Long-term hold"},
  {id:102,ticker:"INFY",name:"Infosys Ltd.",exchange:"NSE",sector:"Technology",targetPrice:1800,currentPrice:1745,note:"Buy on dip"},
  {id:103,ticker:"TSLA",name:"Tesla Inc.",exchange:"NASDAQ",sector:"Technology",targetPrice:15000,currentPrice:17500,note:"Wait for correction"},
];

/* ── Canvas BG ── */
function CandleBG() {
  const ref = useRef(null);
  useEffect(()=>{
    const cv=ref.current; if(!cv) return;
    const ctx=cv.getContext("2d");
    let W=cv.width=cv.offsetWidth, H=cv.height=cv.offsetHeight;
    const candles=Array.from({length:30},(_,i)=>({x:(W/30)*i+12,y:H*0.3+Math.random()*H*0.4,h:20+Math.random()*70,w:9,wick:8+Math.random()*25,bull:Math.random()>0.45,speed:0.2+Math.random()*0.4,phase:Math.random()*Math.PI*2,drift:(Math.random()-0.5)*0.25}));
    let raf;
    function draw(t){
      ctx.clearRect(0,0,W,H);
      candles.forEach(c=>{
        const sy=Math.sin(t*0.001*c.speed+c.phase)*6;
        const oy=c.y+sy, col=c.bull?"#00D4AA":"#FF4D6D";
        ctx.globalAlpha=0.1; ctx.strokeStyle=col; ctx.lineWidth=1.2;
        ctx.beginPath(); ctx.moveTo(c.x+c.w/2,oy-c.h/2-c.wick); ctx.lineTo(c.x+c.w/2,oy+c.h/2+c.wick); ctx.stroke();
        ctx.fillStyle=col; ctx.fillRect(c.x,oy-c.h/2,c.w,c.h);
        c.y+=c.drift; if(c.y<H*0.1||c.y>H*0.9) c.drift*=-1;
      });
      ctx.globalAlpha=0.03; ctx.strokeStyle="#6C63FF"; ctx.lineWidth=1;
      for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(0,H/6*i);ctx.lineTo(W,H/6*i);ctx.stroke();}
      ctx.globalAlpha=1; raf=requestAnimationFrame(draw);
    }
    raf=requestAnimationFrame(draw);
    return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
}

/* ── SVG Pie Chart ── */
function PieChart({data, size=160}) {
  const total=data.reduce((a,d)=>a+d.val,0);
  let cur=0;
  const slices=data.map(d=>{
    const pct=d.val/total, start=cur, end=cur+pct*2*Math.PI;
    cur=end;
    const r=size/2-8, cx=size/2, cy=size/2;
    const x1=cx+r*Math.sin(start), y1=cy-r*Math.cos(start);
    const x2=cx+r*Math.sin(end), y2=cy-r*Math.cos(end);
    const large=pct>0.5?1:0;
    return {...d, path:`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`, pct:(pct*100).toFixed(1)};
  });
  const [hov,setHov]=useState(null);
  return (
    <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={size/2-8} fill={T.surface}/>
        {slices.map((s,i)=>(
          <path key={i} d={s.path} fill={s.color} opacity={hov===i?1:0.8} stroke={T.bg} strokeWidth="1.5"
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
            style={{cursor:"pointer",transition:"opacity .2s"}}/>
        ))}
        {hov!==null&&(
          <text x={size/2} y={size/2-6} textAnchor="middle" fill={T.text} fontSize="11" fontWeight="500">{slices[hov].name}</text>
        )}
        {hov!==null&&(
          <text x={size/2} y={size/2+10} textAnchor="middle" fill={slices[hov].color} fontSize="13" fontWeight="600">{slices[hov].pct}%</text>
        )}
        {hov===null&&<text x={size/2} y={size/2+5} textAnchor="middle" fill={T.sub} fontSize="11">Hover</text>}
      </svg>
      <div style={{flex:1,minWidth:100}}>
        {slices.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5,cursor:"pointer",opacity:hov===i?1:0.7}}
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
            <span style={{width:8,height:8,borderRadius:2,background:s.color,flexShrink:0}}/>
            <span style={{fontSize:10,color:T.sub,flex:1}}>{s.name}</span>
            <span style={{fontSize:10,color:s.color,fontWeight:500}}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SVG Line Chart ── */
function LineChart({data, color=T.teal, height=90, label=""}) {
  const W=280, H=height;
  const mn=Math.min(...data), mx=Math.max(...data), rng=mx-mn||1;
  const pts=data.map((v,i)=>[((i/(data.length-1))*W),(H-10)-((v-mn)/rng)*(H-20)]);
  const path="M"+pts.map(p=>p.join(",")).join(" L");
  const area=path+` L${W},${H} L0,${H} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{display:"block"}}>
      <defs>
        <linearGradient id={`lg${label}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#lg${label})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>i===pts.length-1&&<circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={color} stroke={T.bg} strokeWidth="1.5"/>)}
    </svg>
  );
}

/* ── Bar Chart ── */
function BarChart({data}) {
  const mx=Math.max(...data.map(d=>Math.abs(d.val)));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {data.map((d,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:10,color:T.sub,width:60,textAlign:"right",flexShrink:0}}>{d.name}</span>
          <div style={{flex:1,height:14,background:T.surface,borderRadius:4,overflow:"hidden",position:"relative"}}>
            <div style={{position:"absolute",left:d.val>=0?"50%":"auto",right:d.val<0?"50%":"auto",width:`${(Math.abs(d.val)/mx)*50}%`,height:"100%",background:d.val>=0?T.success:T.danger,borderRadius:4,transition:"width .6s ease",boxShadow:`0 0 6px ${d.val>=0?T.success:T.danger}55`}}/>
          </div>
          <span style={{fontSize:10,color:d.val>=0?T.success:T.danger,width:44,fontWeight:500}}>{d.val>=0?"+":""}{d.val.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

/* ── Sparkline ── */
function Spark({data, color}) {
  const W=64, H=24;
  const mn=Math.min(...data), mx=Math.max(...data), rng=mx-mn||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*W},${H-((v-mn)/rng)*H}`).join(" ");
  return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

/* ── Ticker Tape ── */
function TickerTape() {
  const [x,setX]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setX(p=>{const n=p-1.2;return n<-1200?0:n;}),16);return()=>clearInterval(id);},[]);
  const items=GLOBAL_STOCKS.slice(0,16);
  return (
    <div style={{overflow:"hidden",borderBottom:`1px solid ${T.border}`,background:T.surface,padding:"5px 0"}}>
      <div style={{display:"flex",gap:28,transform:`translateX(${x}px)`,whiteSpace:"nowrap"}}>
        {[...items,...items].map((s,i)=>(
          <span key={i} style={{fontSize:11,color:T.sub,display:"inline-flex",gap:6,alignItems:"center"}}>
            <span style={{color:T.accent2,fontWeight:500}}>{s.ticker}</span>
            <span style={{color:T.text}}>{INR(s.price)}</span>
            <span style={{color:s.change>=0?T.success:T.danger}}>{s.change>=0?"▲":"▼"}{Math.abs(s.change)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Modal ── */
function Modal({title, onClose, children, wide=false}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{position:"absolute",inset:0,background:"#00000099",backdropFilter:"blur(4px)"}} onClick={onClose}/>
      <div style={{position:"relative",background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:24,width:"100%",maxWidth:wide?720:520,maxHeight:"88vh",overflowY:"auto",zIndex:201,boxShadow:`0 24px 64px #00000099`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontWeight:500,fontSize:15,color:T.text}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.sub,fontSize:20,lineHeight:1}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const RAMP=["#6C63FF","#00D4AA","#FFD166","#FF6B35","#FF4D6D","#06b6d4","#a78bfa","#4ade80","#f97316","#ec4899"];
const inp={padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,background:T.surface,color:T.text,fontSize:13,width:"100%",boxSizing:"border-box"};
const btnS=(bg,col,brd)=>({display:"inline-flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:9,background:bg,color:col,border:`1px solid ${brd||bg}`,cursor:"pointer",fontSize:12,fontWeight:500,transition:"opacity .15s"});

/* ══════════════════════════════════════════════ */
export default function App() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [user,setUser]=useState({name:"",phone:""});
  const [lf,setLf]=useState({name:"",phone:""});
  const [lErr,setLErr]=useState("");
  const [tab,setTab]=useState("dashboard");
  const [bought,setBought]=useState(INIT_BOUGHT);
  const [wishlist,setWishlist]=useState(INIT_WISHLIST);
  const [toast,setToast]=useState(null);
  const [search,setSearch]=useState("");
  const [sectorF,setSectorF]=useState("All");
  const [exF,setExF]=useState("All");
  const [classF,setClassF]=useState("all");
  const [editBought,setEditBought]=useState(null);
  const [addBModal,setAddBModal]=useState(false);
  const [editWish,setEditWish]=useState(null);
  const [addWModal,setAddWModal]=useState(false);
  const [bForm,setBForm]=useState({ticker:"",name:"",exchange:"NSE",sector:"Technology",qty:"",buyPrice:"",currentPrice:"",date:""});
  const [wForm,setWForm]=useState({ticker:"",name:"",exchange:"NSE",sector:"Technology",targetPrice:"",currentPrice:"",note:""});
  const [aiInsight,setAiInsight]=useState({});
  const [loadingAI,setLoadingAI]=useState({});
  const [detailStock,setDetailStock]=useState(null);
  const [counters,setCounters]=useState({pv:0,inv:0,pnl:0});
  const [particles]=useState(()=>Array.from({length:20},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,s:Math.random()*4+1.5,op:0.1+Math.random()*0.35,d:2+Math.random()*3})));

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const totalInvested=bought.reduce((a,s)=>a+s.qty*s.buyPrice,0);
  const totalCurrent=bought.reduce((a,s)=>a+s.qty*s.currentPrice,0);
  const totalPnL=totalCurrent-totalInvested;
  const totalPct=totalInvested?((totalPnL/totalInvested)*100).toFixed(2):0;

  useEffect(()=>{
    if(!loggedIn)return;
    let st=null;
    const step=ts=>{
      if(!st)st=ts;
      const p=Math.min((ts-st)/1200,1), e=1-Math.pow(1-p,3);
      setCounters({pv:totalCurrent*e,inv:totalInvested*e,pnl:totalPnL*e});
      if(p<1)requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },[loggedIn,tab]);

  const handleLogin=()=>{
    if(!lf.name.trim()){setLErr("Enter your full name.");return;}
    if(!/^\+?[\d\s\-]{8,15}$/.test(lf.phone)){setLErr("Enter a valid phone number.");return;}
    setUser({name:lf.name.trim(),phone:lf.phone.trim()});
    setLoggedIn(true);
  };

  // BOUGHT CRUD
  const saveBought=(form,id)=>{
    if(!form.ticker||!form.qty||!form.buyPrice||!form.currentPrice||!form.date){showToast("Fill all required fields","error");return;}
    const e={...form,qty:+form.qty,buyPrice:+form.buyPrice,currentPrice:+form.currentPrice};
    if(id) setBought(p=>p.map(x=>x.id===id?{...x,...e}:x));
    else setBought(p=>[...p,{...e,id:Date.now()}]);
    setEditBought(null);setAddBModal(false);
    setBForm({ticker:"",name:"",exchange:"NSE",sector:"Technology",qty:"",buyPrice:"",currentPrice:"",date:""});
    showToast(id?"Stock updated!":"Stock added!");
  };
  const deleteBought=id=>{setBought(p=>p.filter(x=>x.id!==id));showToast("Stock removed");};
  const openEditBought=s=>{setBForm({ticker:s.ticker,name:s.name,exchange:s.exchange,sector:s.sector,qty:s.qty,buyPrice:s.buyPrice,currentPrice:s.currentPrice,date:s.date});setEditBought(s.id);};

  // WISHLIST CRUD
  const saveWish=(form,id)=>{
    if(!form.ticker||!form.targetPrice||!form.currentPrice){showToast("Fill required fields","error");return;}
    const e={...form,targetPrice:+form.targetPrice,currentPrice:+form.currentPrice};
    if(id) setWishlist(p=>p.map(x=>x.id===id?{...x,...e}:x));
    else setWishlist(p=>[...p,{...e,id:Date.now()}]);
    setEditWish(null);setAddWModal(false);
    setWForm({ticker:"",name:"",exchange:"NSE",sector:"Technology",targetPrice:"",currentPrice:"",note:""});
    showToast(id?"Wishlist updated!":"Added to wishlist!");
  };
  const deleteWish=id=>{setWishlist(p=>p.filter(x=>x.id!==id));showToast("Removed from wishlist");};
  const openEditWish=s=>{setWForm({ticker:s.ticker,name:s.name,exchange:s.exchange,sector:s.sector,targetPrice:s.targetPrice,currentPrice:s.currentPrice,note:s.note||""});setEditWish(s.id);};
  const addFromMarket=s=>{setWForm({ticker:s.ticker,name:s.name,exchange:s.exchange,sector:s.sector,targetPrice:s.price,currentPrice:s.price,note:""});setAddWModal(true);setTab("wishlist");};

  const getInsight=async(stock)=>{
    setLoadingAI(p=>({...p,[stock.id||stock.ticker]:true}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:`You are a financial analyst. Give a concise 3-section analysis for retail investors: 1) Revenue Forecast (2 sentences) 2) Risk Factors (2 sentences) 3) Verdict (1 sentence). Stock: ${stock.ticker} (${stock.name}), Exchange: ${stock.exchange}, Sector: ${stock.sector}, Buy: ₹${stock.buyPrice||stock.price}, Now: ₹${stock.currentPrice||stock.price}. Be specific, mention Indian/global market context.`}]})});
      const d=await res.json();
      setAiInsight(p=>({...p,[stock.id||stock.ticker]:d.content?.map(c=>c.text||"").join("")||"Unable to generate."}));
    }catch(e){setAiInsight(p=>({...p,[stock.id||stock.ticker]:"Error fetching insight."}));}
    setLoadingAI(p=>({...p,[stock.id||stock.ticker]:false}));
  };

  const sparkData=s=>{
    const bp=s.buyPrice||s.price, cp=s.currentPrice||s.price;
    return Array.from({length:12},(_,i)=>bp+(cp-bp)*i/11+(Math.random()-0.5)*bp*0.015);
  };

  const sectorPie=()=>{
    const sectors={};
    bought.forEach(s=>{sectors[s.sector]=(sectors[s.sector]||0)+s.qty*s.currentPrice;});
    return Object.entries(sectors).map(([name,val],i)=>({name,val,color:RAMP[i%RAMP.length]}));
  };

  const exPie=()=>{
    const ex={};
    bought.forEach(s=>{ex[s.exchange]=(ex[s.exchange]||0)+s.qty*s.currentPrice;});
    return Object.entries(ex).map(([name,val],i)=>({name,val,color:RAMP[(i+3)%RAMP.length]}));
  };

  const portfolioHistory=()=>{
    const base=totalInvested*0.9;
    return Array.from({length:14},(_,i)=>base+((totalCurrent-base)*(i/13))+(Math.random()-0.4)*totalInvested*0.03);
  };

  const filteredMarket=GLOBAL_STOCKS.filter(s=>{
    const q=search.toLowerCase();
    const mQ=!q||s.ticker.toLowerCase().includes(q)||s.name.toLowerCase().includes(q);
    const mS=sectorF==="All"||s.sector===sectorF;
    const mE=exF==="All"||s.exchange===exF;
    const mC=classF==="all"||(classF==="bull"&&s.bull)||(classF==="bear"&&!s.bull);
    return mQ&&mS&&mE&&mC;
  });

  const perfData=bought.map(s=>({name:s.ticker,val:+PCT(s.buyPrice,s.currentPrice)}));

  /* ─── NAV configs per tab ─── */
  const NAV_CONFIGS = {
    dashboard:{
      items:[{id:"dashboard",icon:"ti-layout-dashboard",label:"Dashboard"},{id:"market",icon:"ti-world",label:"Market"},{id:"bought",icon:"ti-shopping-cart",label:"Bought"},{id:"wishlist",icon:"ti-heart",label:"Wishlist"},{id:"classify",icon:"ti-chart-treemap",label:"Classify"},{id:"insights",icon:"ti-brain",label:"AI Insights"},{id:"stats",icon:"ti-chart-bar",label:"Stats"}],
      style:{background:T.nav,borderBottom:`1px solid ${T.border}`}
    },
    market:{
      items:[{id:"dashboard",icon:"ti-layout-dashboard",label:"Overview"},{id:"market",icon:"ti-world",label:"All Stocks"},{id:"classify",icon:"ti-chart-treemap",label:"Bull/Bear"}],
      style:{background:"#0a0f1e",borderBottom:`2px solid ${T.teal}44`}
    },
    bought:{
      items:[{id:"dashboard",icon:"ti-arrow-left",label:"Back"},{id:"bought",icon:"ti-shopping-cart",label:"My Holdings"},{id:"insights",icon:"ti-brain",label:"AI Insights"},{id:"stats",icon:"ti-chart-bar",label:"Performance"}],
      style:{background:"#0d1322",borderBottom:`2px solid ${T.accent}44`}
    },
    wishlist:{
      items:[{id:"dashboard",icon:"ti-arrow-left",label:"Back"},{id:"wishlist",icon:"ti-heart",label:"Watchlist"},{id:"market",icon:"ti-search",label:"Find Stocks"},{id:"classify",icon:"ti-filter",label:"Classify"}],
      style:{background:"#120d1a",borderBottom:`2px solid ${T.orange}44`}
    },
    classify:{
      items:[{id:"dashboard",icon:"ti-arrow-left",label:"Back"},{id:"classify",icon:"ti-chart-treemap",label:"Classifications"},{id:"market",icon:"ti-world",label:"All Market"}],
      style:{background:"#0a1a10",borderBottom:`2px solid ${T.success}44`}
    },
    insights:{
      items:[{id:"dashboard",icon:"ti-arrow-left",label:"Back"},{id:"insights",icon:"ti-brain",label:"AI Insights"},{id:"bought",icon:"ti-shopping-cart",label:"Holdings"},{id:"stats",icon:"ti-chart-bar",label:"Stats"}],
      style:{background:"#0d0f20",borderBottom:`2px solid ${T.accent2}44`}
    },
    stats:{
      items:[{id:"dashboard",icon:"ti-arrow-left",label:"Back"},{id:"stats",icon:"ti-chart-bar",label:"Stats"},{id:"bought",icon:"ti-shopping-cart",label:"Holdings"},{id:"insights",icon:"ti-brain",label:"Insights"}],
      style:{background:"#0f1a10",borderBottom:`2px solid ${T.gold}44`}
    },
  };

  const navCfg=NAV_CONFIGS[tab]||NAV_CONFIGS.dashboard;

  /* ─── STOCK DETAIL MODAL ─── */
  const StockDetail=({stock, isBought})=>{
    const isB=isBought&&stock.buyPrice;
    const pl=isB?(stock.currentPrice-stock.buyPrice)*stock.qty:0;
    const p=isB?PCT(stock.buyPrice,stock.currentPrice):stock.change;
    const sp=sparkData(stock);
    const fullInfo=GLOBAL_STOCKS.find(s=>s.ticker===stock.ticker)||stock;
    const key=stock.id||stock.ticker;
    return (
      <div>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:20,flexWrap:"wrap"}}>
          <div style={{width:56,height:56,borderRadius:14,background:T.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:500,color:T.accent,flexShrink:0}}>{stock.ticker.slice(0,4)}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:18,fontWeight:500,color:T.text}}>{stock.ticker}</div>
            <div style={{fontSize:13,color:T.sub,marginBottom:4}}>{stock.name}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:T.pill,color:T.sub}}>{stock.exchange}</span>
              <span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:T.pill,color:T.sub}}>{stock.sector}</span>
              {fullInfo.bull!==undefined&&<span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:fullInfo.bull?T.success+"22":T.danger+"22",color:fullInfo.bull?T.success:T.danger}}>{fullInfo.bull?"🐂 Bullish":"🐻 Bearish"}</span>}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:500,color:T.text}}>{INR(stock.currentPrice||stock.price)}</div>
            <div style={{fontSize:13,color:+p>=0?T.success:T.danger,fontWeight:500}}>{+p>=0?"+":""}{p}%</div>
          </div>
        </div>

        {/* Price chart */}
        <div style={{background:T.surface,borderRadius:12,padding:14,marginBottom:16}}>
          <div style={{fontSize:11,color:T.sub,marginBottom:6}}>Price Trend</div>
          <LineChart data={sp} color={+p>=0?T.success:T.danger} height={80} label={stock.ticker}/>
        </div>

        {/* Key metrics */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
          {[
            {l:"52W High",v:INR(fullInfo.high52||0),c:T.success},
            {l:"52W Low",v:INR(fullInfo.low52||0),c:T.danger},
            {l:"P/E Ratio",v:fullInfo.pe||"N/A",c:T.gold},
            {l:"Market Cap",v:fullInfo.mktCap||"N/A",c:T.accent2},
            {l:"Volume",v:fullInfo.vol||"N/A",c:T.sub},
            {l:"Avg Price",v:fullInfo.avg?INR(fullInfo.avg):"N/A",c:T.sub},
          ].map((m,i)=>(
            <div key={i} style={{background:T.card,borderRadius:9,padding:"10px 12px",border:`1px solid ${T.border}`}}>
              <div style={{fontSize:10,color:T.sub,marginBottom:3}}>{m.l}</div>
              <div style={{fontSize:13,fontWeight:500,color:m.c}}>{m.v}</div>
            </div>
          ))}
        </div>

        {/* If bought, show P&L */}
        {isB&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
            {[
              {l:"Bought At",v:INR(stock.buyPrice)},
              {l:"Quantity",v:stock.qty},
              {l:"Invested",v:INR(stock.buyPrice*stock.qty)},
              {l:"Current Value",v:INR(stock.currentPrice*stock.qty),c:T.accent2},
              {l:"Profit/Loss",v:(pl>=0?"+":"")+INR(pl),c:pl>=0?T.success:T.danger},
              {l:"Return",v:(+p>=0?"+":"")+p+"%",c:+p>=0?T.success:T.danger},
            ].map((m,i)=>(
              <div key={i} style={{background:pl>=0?T.success+"11":T.danger+"11",borderRadius:9,padding:"10px 12px",border:`1px solid ${pl>=0?T.success+"33":T.danger+"33"}`}}>
                <div style={{fontSize:10,color:T.sub,marginBottom:3}}>{m.l}</div>
                <div style={{fontSize:13,fontWeight:500,color:m.c||T.text}}>{m.v}</div>
              </div>
            ))}
          </div>
        )}

        {/* 52W range bar */}
        {fullInfo.high52&&<div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.sub,marginBottom:4}}><span>52W Low: {INR(fullInfo.low52)}</span><span>52W High: {INR(fullInfo.high52)}</span></div>
          <div style={{height:5,background:T.surface,borderRadius:4}}>
            <div style={{height:"100%",width:`${((( stock.currentPrice||stock.price)-fullInfo.low52)/(fullInfo.high52-fullInfo.low52))*100}%`,background:`linear-gradient(90deg,${T.danger},${T.warn},${T.success})`,borderRadius:4}}/>
          </div>
        </div>}

        {/* AI Insight */}
        <div style={{background:T.surface,borderRadius:12,padding:14,border:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:12,color:T.accent2,fontWeight:500,display:"flex",alignItems:"center",gap:4}}><i className="ti ti-brain"/>AI Analysis</div>
            <button onClick={()=>getInsight({...stock,...(isB?{}:{price:stock.price}),id:key})} disabled={loadingAI[key]} style={{...btnS(T.accent+"33",T.accent,T.accent+"55"),padding:"4px 10px",fontSize:10}}>
              <i className={`ti ${loadingAI[key]?"ti-loader-2":"ti-sparkles"}`} style={{animation:loadingAI[key]?"spin 1s linear infinite":""}}/>{loadingAI[key]?"Analyzing...":"Get Insight"}
            </button>
          </div>
          {aiInsight[key]?<div style={{fontSize:12,lineHeight:1.8,color:T.text,whiteSpace:"pre-line"}}>{aiInsight[key]}</div>
            :<div style={{fontSize:11,color:T.sub,fontStyle:"italic"}}>Click "Get Insight" for AI-powered analysis</div>}
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          {!isB&&<button onClick={()=>{addFromMarket({...stock,price:stock.price||stock.currentPrice});setDetailStock(null);}} style={{...btnS(T.orange+"33",T.orange,T.orange+"55"),flex:1,justifyContent:"center"}}><i className="ti ti-heart"/>Add to Wishlist</button>}
          {isB&&<>
            <button onClick={()=>{openEditBought(stock);setDetailStock(null);setTab("bought");}} style={{...btnS(T.accent+"33",T.accent,T.accent+"55"),flex:1,justifyContent:"center"}}><i className="ti ti-edit"/>Edit</button>
            <button onClick={()=>{deleteBought(stock.id);setDetailStock(null);}} style={{...btnS(T.danger+"22",T.danger,T.danger+"44"),flex:1,justifyContent:"center"}}><i className="ti ti-trash"/>Remove</button>
          </>}
        </div>
      </div>
    );
  };

  /* ── FORM FIELDS ── */
  const BoughtForm=({form,setForm})=>(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {[["ticker","Ticker *"],["name","Company Name"],["buyPrice","Buy Price (₹) *"],["currentPrice","Current Price (₹) *"],["qty","Quantity *"],["date","Purchase Date *"]].map(([f,pl])=>(
        <div key={f} style={{gridColumn:f==="name"?"1/-1":"auto"}}>
          <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:4}}>{pl}</label>
          <input type={f==="date"?"date":f==="qty"||f.includes("Price")?"number":"text"} placeholder={pl} value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} style={inp}/>
        </div>
      ))}
      {[["exchange","Exchange",EXCHANGES],["sector","Sector",SECTORS]].map(([f,l,opts])=>(
        <div key={f}>
          <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:4}}>{l}</label>
          <select value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} style={inp}>
            {opts.map(x=><option key={x}>{x}</option>)}
          </select>
        </div>
      ))}
    </div>
  );

  const WishForm=({form,setForm})=>(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {[["ticker","Ticker *"],["name","Company Name"],["currentPrice","Current Price (₹) *"],["targetPrice","Target Price (₹) *"]].map(([f,pl])=>(
        <div key={f} style={{gridColumn:f==="name"?"1/-1":"auto"}}>
          <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:4}}>{pl}</label>
          <input type={f.includes("Price")?"number":"text"} placeholder={pl} value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} style={inp}/>
        </div>
      ))}
      {[["exchange","Exchange",EXCHANGES],["sector","Sector",SECTORS]].map(([f,l,opts])=>(
        <div key={f}>
          <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:4}}>{l}</label>
          <select value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} style={inp}>
            {opts.map(x=><option key={x}>{x}</option>)}
          </select>
        </div>
      ))}
      <div style={{gridColumn:"1/-1"}}>
        <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:4}}>Note</label>
        <input placeholder="e.g. Buy on dip" value={form.note} onChange={e=>setWForm(p=>({...p,note:e.target.value}))} style={inp}/>
      </div>
    </div>
  );

  /* ─── LOGIN ─── */
  if(!loggedIn) return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-sans)",overflow:"hidden",position:"relative"}}>
      <CandleBG/>
      {particles.map(p=>(
        <div key={p.id} style={{position:"fixed",left:`${p.x}%`,top:`${p.y}%`,width:p.s,height:p.s,borderRadius:"50%",background:p.id%3===0?T.accent:p.id%3===1?T.teal:T.gold,opacity:p.op,animation:`fp${p.id%4} ${p.d}s ease-in-out infinite`,pointerEvents:"none"}}/>
      ))}
      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:440,padding:20}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:68,height:68,borderRadius:20,background:`linear-gradient(135deg,${T.accent},${T.teal})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:`0 0 48px ${T.accentGlow}`}}>
            <i className="ti ti-chart-candle" style={{fontSize:32,color:"#fff"}}/>
          </div>
          <div style={{fontSize:28,fontWeight:500,color:T.text,letterSpacing:1}}>Finfolio</div>
          <div style={{fontSize:12,color:T.sub,marginTop:4}}>Global Stock Market Dashboard</div>
        </div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:28}}>
          <div style={{fontSize:14,fontWeight:500,color:T.text,marginBottom:18,display:"flex",alignItems:"center",gap:6}}>
            <i className="ti ti-login" style={{color:T.accent}}/> Sign in to your Portfolio
          </div>
          {[["name","Full Name","ti-user","e.g. Arjun Mehta","text"],["phone","Phone Number","ti-phone","+91 98765 43210","tel"]].map(([f,l,ic,ph,tp])=>(
            <div key={f} style={{marginBottom:14}}>
              <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:5}}>{l}</label>
              <div style={{position:"relative"}}>
                <i className={`ti ${ic}`} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.sub,fontSize:14,pointerEvents:"none"}}/>
                <input type={tp} placeholder={ph} value={lf[f]} onChange={e=>setLf(p=>({...p,[f]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{...inp,paddingLeft:32}}/>
              </div>
            </div>
          ))}
          {lErr&&<div style={{fontSize:12,color:T.danger,padding:"8px 12px",background:T.danger+"22",borderRadius:8,border:`1px solid ${T.danger}44`,marginBottom:14}}>{lErr}</div>}
          <button onClick={handleLogin} style={{...btnS(`linear-gradient(135deg,${T.accent},${T.teal})`,"#fff","transparent"),width:"100%",justifyContent:"center",padding:"12px",fontSize:14,borderRadius:12,boxShadow:`0 8px 28px ${T.accentGlow}`}}>
            <i className="ti ti-rocket"/> Enter Dashboard
          </button>
          <div style={{marginTop:18,padding:12,background:T.surface,borderRadius:10,display:"flex",gap:14,flexWrap:"wrap"}}>
            {GLOBAL_STOCKS.slice(0,5).map(s=>(
              <span key={s.ticker} style={{fontSize:11}}>
                <span style={{color:T.accent2,fontWeight:500}}>{s.ticker}</span>
                <span style={{color:s.change>=0?T.success:T.danger,marginLeft:4}}>{s.change>=0?"▲":"▼"}{Math.abs(s.change)}%</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes fp0{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}} @keyframes fp1{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}} @keyframes fp2{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}} @keyframes fp3{0%,100%{transform:translateY(0)}50%{transform:translateY(-28px)}} input::placeholder{color:${T.sub}77}`}</style>
    </div>
  );

  /* ─── MAIN APP ─── */
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"var(--font-sans)",color:T.text}}>
      <CandleBG/>

      {toast&&<div style={{position:"fixed",top:16,right:16,zIndex:1000,padding:"10px 18px",borderRadius:10,background:toast.type==="error"?T.danger+"33":T.success+"33",color:toast.type==="error"?T.danger:T.success,fontSize:13,border:`1px solid ${toast.type==="error"?T.danger+"66":T.success+"66"}`,backdropFilter:"blur(6px)"}}><i className={`ti ${toast.type==="error"?"ti-alert-circle":"ti-circle-check"}`} style={{marginRight:6}}/>{toast.msg}</div>}

      {/* GLOBAL HEADER */}
      <div style={{position:"sticky",top:0,zIndex:50,background:T.nav,borderBottom:`1px solid ${T.border}`}}>
        <div style={{padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${T.accent},${T.teal})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 14px ${T.accentGlow}`}}>
              <i className="ti ti-chart-candle" style={{fontSize:16,color:"#fff"}}/>
            </div>
            <span style={{fontWeight:500,fontSize:16,letterSpacing:.5}}>Finfolio</span>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:T.accent+"33",color:T.accent2,border:`1px solid ${T.accent}44`}}>PRO</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:12,padding:"4px 12px",borderRadius:20,background:totalPnL>=0?T.success+"22":T.danger+"22",color:totalPnL>=0?T.success:T.danger,border:`1px solid ${totalPnL>=0?T.success+"44":T.danger+"44"}`,fontWeight:500}}>{totalPnL>=0?"+":""}{INR(totalPnL)} ({totalPct}%)</span>
            <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent},${T.teal})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:500,color:"#fff"}}>{user.name.charAt(0).toUpperCase()}</div>
            <span style={{fontSize:12,color:T.sub,display:"none"}}>{user.name.split(" ")[0]}</span>
            <button onClick={()=>setLoggedIn(false)} style={{...btnS("transparent",T.sub,T.border),padding:"5px 8px"}}><i className="ti ti-logout" style={{fontSize:13}}/></button>
          </div>
        </div>
        <TickerTape/>
        {/* DYNAMIC NAV */}
        <div style={{...navCfg.style,display:"flex",padding:"0 20px",overflowX:"auto",gap:0,transition:"background .3s"}}>
          {navCfg.items.map(n=>(
            <button key={n.id+n.label} onClick={()=>setTab(n.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"10px 14px",fontSize:12,fontWeight:tab===n.id?500:400,color:tab===n.id?T.accent:T.sub,background:"transparent",border:"none",borderBottom:tab===n.id?`2px solid ${T.accent}`:"2px solid transparent",cursor:"pointer",whiteSpace:"nowrap",transition:"color .2s"}}>
              <i className={`ti ${n.icon}`} style={{fontSize:14}}/>{n.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:20,position:"relative",zIndex:1}}>

        {/* ══ DASHBOARD ══ */}
        {tab==="dashboard"&&(
          <div>
            <div style={{marginBottom:14,fontSize:12,color:T.sub}}>
              <i className="ti ti-user" style={{marginRight:5,color:T.accent}}/>
              {user.name} · {user.phone} · <span style={{color:T.accent2}}>May 15, 2026</span>
            </div>
            {/* KPI */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:11,marginBottom:20}}>
              {[
                {l:"Portfolio Value",v:INR(counters.pv),i:"ti-wallet",c:T.accent,g:T.accentGlow},
                {l:"Total Invested",v:INR(counters.inv),i:"ti-coins",c:T.teal,g:T.tealGlow},
                {l:"Total P&L",v:(counters.pnl>=0?"+":"")+INR(counters.pnl),i:"ti-trending-up",c:totalPnL>=0?T.success:T.danger},
                {l:"Return",v:totalPct+"%",i:"ti-percentage",c:+totalPct>=0?T.success:T.danger},
                {l:"Holdings",v:bought.length,i:"ti-briefcase",c:T.gold},
                {l:"Watchlist",v:wishlist.length,i:"ti-heart",c:T.orange},
              ].map((c,i)=>(
                <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:13,padding:"13px 15px",cursor:"default",transition:"transform .2s,box-shadow .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 28px ${c.g||"#00000055"}`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
                    <i className={`ti ${c.i}`} style={{fontSize:13,color:c.c}}/><span style={{fontSize:10,color:T.sub}}>{c.l}</span>
                  </div>
                  <div style={{fontSize:17,fontWeight:500,color:c.c}}>{c.v}</div>
                </div>
              ))}
            </div>

            {/* Portfolio line chart */}
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontWeight:500,fontSize:13,color:T.text,display:"flex",alignItems:"center",gap:6}}>
                  <i className="ti ti-chart-line" style={{color:T.teal}}/>Portfolio Value Trend
                </div>
                <span style={{fontSize:11,color:T.success,background:T.success+"22",padding:"2px 8px",borderRadius:20}}>+{totalPct}% overall</span>
              </div>
              <LineChart data={portfolioHistory()} color={T.teal} height={100} label="portfolio"/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.sub,marginTop:4}}>
                <span>14 days ago</span><span>Today</span>
              </div>
            </div>

            {/* Charts row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginBottom:16}}>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontWeight:500,fontSize:13,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-chart-pie" style={{color:T.accent}}/>Sector Allocation</div>
                <PieChart data={sectorPie()} size={148}/>
              </div>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontWeight:500,fontSize:13,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-chart-donut" style={{color:T.orange}}/>Exchange Spread</div>
                <PieChart data={exPie()} size={148}/>
              </div>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontWeight:500,fontSize:13,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-chart-bar" style={{color:T.gold}}/>P&L by Holding</div>
                <BarChart data={perfData}/>
              </div>
            </div>

            {/* Top holdings & movers */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontWeight:500,fontSize:13,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-star" style={{color:T.gold}}/>My Holdings</div>
                {bought.map(s=>{
                  const pl=(s.currentPrice-s.buyPrice)*s.qty;
                  return(
                    <div key={s.id} onClick={()=>setDetailStock({...s,isBought:true})} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}44`,cursor:"pointer",borderRadius:6}}
                      onMouseEnter={e=>e.currentTarget.style.background=T.surface} onMouseLeave={e=>e.currentTarget.style.background=""}>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <div style={{width:28,height:28,borderRadius:7,background:T.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:500,color:T.accent}}>{s.ticker.slice(0,4)}</div>
                        <div><div style={{fontSize:12,fontWeight:500,color:T.text}}>{s.ticker}</div><div style={{fontSize:10,color:T.sub}}>{s.exchange}</div></div>
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <Spark data={sparkData(s)} color={pl>=0?T.success:T.danger}/>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:11,fontWeight:500,color:T.text}}>{INR(s.currentPrice)}</div>
                          <div style={{fontSize:10,color:pl>=0?T.success:T.danger}}>{pl>=0?"+":""}{PCT(s.buyPrice,s.currentPrice)}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontWeight:500,fontSize:13,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-flame" style={{color:T.orange}}/>Top Movers Today</div>
                {[...GLOBAL_STOCKS].sort((a,b)=>Math.abs(b.change)-Math.abs(a.change)).slice(0,7).map(s=>(
                  <div key={s.ticker} onClick={()=>setDetailStock({...s,currentPrice:s.price,isBought:false})} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.border}33`,cursor:"pointer",borderRadius:6}}
                    onMouseEnter={e=>e.currentTarget.style.background=T.surface} onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <div style={{display:"flex",gap:7,alignItems:"center"}}>
                      <span style={{fontSize:11,fontWeight:500,color:T.accent2}}>{s.ticker}</span>
                      <span style={{fontSize:10,color:T.sub}}>{s.exchange}</span>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:11,color:T.text}}>{INR(s.price)}</span>
                      <span style={{fontSize:11,fontWeight:500,color:s.change>=0?T.success:T.danger,padding:"1px 7px",borderRadius:20,background:s.change>=0?T.success+"22":T.danger+"22"}}>{s.change>=0?"+":""}{s.change}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ MARKET ══ */}
        {tab==="market"&&(
          <div>
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{position:"relative",flex:1,minWidth:180}}>
                <i className="ti ti-search" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.sub,fontSize:13}}/>
                <input placeholder="Search ticker or company..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,paddingLeft:30}}/>
              </div>
              <select value={sectorF} onChange={e=>setSectorF(e.target.value)} style={{...inp,width:"auto"}}>
                <option>All</option>{SECTORS.map(s=><option key={s}>{s}</option>)}
              </select>
              <select value={exF} onChange={e=>setExF(e.target.value)} style={{...inp,width:"auto"}}>
                <option>All</option>{EXCHANGES.map(e=><option key={e}>{e}</option>)}
              </select>
            </div>
            <div style={{fontSize:12,color:T.sub,marginBottom:10}}>{filteredMarket.length} stocks · click any row for full details</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{borderBottom:`1px solid ${T.border}`}}>
                    {["Ticker","Company","Exchange","Sector","Price","Change","P/E","Mkt Cap",""].map(h=>(
                      <th key={h} style={{padding:"8px 10px",textAlign:"left",color:T.sub,fontWeight:500}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredMarket.map(s=>(
                    <tr key={s.ticker} onClick={()=>setDetailStock({...s,currentPrice:s.price,isBought:false})} style={{borderBottom:`1px solid ${T.border}22`,cursor:"pointer",transition:"background .15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=T.surface} onMouseLeave={e=>e.currentTarget.style.background=""}>
                      <td style={{padding:"9px 10px",fontWeight:500,color:T.accent2}}>{s.ticker}</td>
                      <td style={{padding:"9px 10px",color:T.text}}>{s.name}</td>
                      <td style={{padding:"9px 10px",color:T.sub}}>{s.exchange}</td>
                      <td style={{padding:"9px 10px",color:T.sub}}>{s.sector}</td>
                      <td style={{padding:"9px 10px",fontWeight:500,color:T.text}}>{INR(s.price)}</td>
                      <td style={{padding:"9px 10px"}}><span style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:s.change>=0?T.success+"22":T.danger+"22",color:s.change>=0?T.success:T.danger}}>{s.change>=0?"+":""}{s.change}%</span></td>
                      <td style={{padding:"9px 10px",color:T.sub}}>{s.pe}</td>
                      <td style={{padding:"9px 10px",color:T.sub}}>{s.mktCap}</td>
                      <td style={{padding:"9px 10px"}}><button onClick={e=>{e.stopPropagation();addFromMarket(s);}} style={{...btnS(T.orange+"22",T.orange,T.orange+"44"),padding:"3px 9px",fontSize:10}}><i className="ti ti-heart"/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ BOUGHT ══ */}
        {tab==="bought"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontWeight:500,fontSize:15}}>Bought Stocks</div>
              <button onClick={()=>{setBForm({ticker:"",name:"",exchange:"NSE",sector:"Technology",qty:"",buyPrice:"",currentPrice:"",date:""});setAddBModal(true);}} style={{...btnS(T.accent+"33",T.accent,T.accent+"55")}}><i className="ti ti-plus"/>Add Stock</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
              {bought.map(s=>{
                const pl=(s.currentPrice-s.buyPrice)*s.qty, p=PCT(s.buyPrice,s.currentPrice);
                return(
                  <div key={s.id} onClick={()=>setDetailStock({...s,isBought:true})} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18,cursor:"pointer",transition:"transform .2s,box-shadow .2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 28px ${pl>=0?T.tealGlow:T.danger+"22"}`;}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{display:"flex",gap:8}}>
                        <div style={{width:36,height:36,borderRadius:9,background:T.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,color:T.accent}}>{s.ticker.slice(0,4)}</div>
                        <div><div style={{fontSize:13,fontWeight:500,color:T.text}}>{s.ticker}</div><div style={{fontSize:10,color:T.sub}}>{s.name}</div></div>
                      </div>
                      <div style={{display:"flex",gap:5}} onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>openEditBought(s)} style={{background:"none",border:"none",cursor:"pointer",color:T.accent,fontSize:13,padding:3}}><i className="ti ti-edit"/></button>
                        <button onClick={()=>deleteBought(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:T.danger,fontSize:13,padding:3}}><i className="ti ti-trash"/></button>
                      </div>
                    </div>
                    <LineChart data={sparkData(s)} color={pl>=0?T.success:T.danger} height={50} label={s.id}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                      <div><div style={{fontSize:10,color:T.sub}}>Bought</div><div style={{fontSize:12,color:T.text}}>{INR(s.buyPrice)}</div></div>
                      <div><div style={{fontSize:10,color:T.sub}}>Current</div><div style={{fontSize:12,fontWeight:500,color:T.text}}>{INR(s.currentPrice)}</div></div>
                      <div><div style={{fontSize:10,color:T.sub}}>Qty</div><div style={{fontSize:12,color:T.text}}>{s.qty}</div></div>
                    </div>
                    <div style={{marginTop:9,padding:"7px 10px",background:pl>=0?T.success+"11":T.danger+"11",borderRadius:8,border:`1px solid ${pl>=0?T.success+"33":T.danger+"33"}`,display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:11,color:T.sub}}>P&L</span>
                      <span style={{fontSize:12,fontWeight:500,color:pl>=0?T.success:T.danger}}>{pl>=0?"+":""}{INR(pl)} ({p}%)</span>
                    </div>
                    <div style={{marginTop:7,display:"flex",gap:5,flexWrap:"wrap"}}>
                      <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:T.pill,color:T.sub}}>{s.exchange}</span>
                      <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:T.pill,color:T.sub}}>{s.sector}</span>
                      <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:T.pill,color:T.sub}}>{s.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ WISHLIST ══ */}
        {tab==="wishlist"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontWeight:500,fontSize:15}}>My Watchlist</div>
              <button onClick={()=>{setWForm({ticker:"",name:"",exchange:"NSE",sector:"Technology",targetPrice:"",currentPrice:"",note:""});setAddWModal(true);}} style={{...btnS(T.orange+"33",T.orange,T.orange+"55")}}><i className="ti ti-heart"/>Add Stock</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:14}}>
              {wishlist.map(s=>{
                const reached=s.currentPrice<=s.targetPrice;
                return(
                  <div key={s.id} onClick={()=>setDetailStock({...s,isBought:false})} style={{background:T.card,border:`1px solid ${reached?T.success+"55":T.border}`,borderRadius:14,padding:18,cursor:"pointer",transition:"transform .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{display:"flex",gap:8}}>
                        <div style={{width:34,height:34,borderRadius:9,background:T.orange+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:500,color:T.orange}}>{s.ticker.slice(0,4)}</div>
                        <div><div style={{fontSize:13,fontWeight:500,color:T.text}}>{s.ticker}</div><div style={{fontSize:10,color:T.sub}}>{s.name}</div></div>
                      </div>
                      <div style={{display:"flex",gap:5}} onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>openEditWish(s)} style={{background:"none",border:"none",cursor:"pointer",color:T.accent,fontSize:13,padding:3}}><i className="ti ti-edit"/></button>
                        <button onClick={()=>deleteWish(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:T.danger,fontSize:13,padding:3}}><i className="ti ti-trash"/></button>
                      </div>
                    </div>
                    {reached&&<div style={{fontSize:10,padding:"2px 9px",borderRadius:20,background:T.success+"22",color:T.success,border:`1px solid ${T.success}44`,display:"inline-flex",gap:4,marginBottom:8}}><i className="ti ti-check"/>Target Reached!</div>}
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div><div style={{fontSize:10,color:T.sub}}>Current</div><div style={{fontSize:13,fontWeight:500,color:T.text}}>{INR(s.currentPrice)}</div></div>
                      <div><div style={{fontSize:10,color:T.sub}}>Target</div><div style={{fontSize:13,color:T.gold}}>{INR(s.targetPrice)}</div></div>
                    </div>
                    <div style={{height:4,background:T.surface,borderRadius:4,marginBottom:8}}>
                      <div style={{height:"100%",width:`${Math.min((s.targetPrice/s.currentPrice)*100,100)}%`,background:`linear-gradient(90deg,${T.accent},${T.teal})`,borderRadius:4}}/>
                    </div>
                    {s.note&&<div style={{fontSize:11,color:T.sub,fontStyle:"italic"}}><i className="ti ti-note" style={{marginRight:3}}/>{s.note}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ CLASSIFY ══ */}
        {tab==="classify"&&(
          <div>
            <div style={{fontWeight:500,fontSize:15,marginBottom:4}}>Market Classification</div>
            <div style={{fontSize:12,color:T.sub,marginBottom:16}}>Filter global stocks by Bullish 🐂 or Bearish 🐻 sentiment indicators</div>
            <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
              {[["all","All Stocks","#6C63FF"],["bull","🐂 Bullish",T.success],["bear","🐻 Bearish",T.danger]].map(([v,l,c])=>(
                <button key={v} onClick={()=>setClassF(v)} style={{padding:"8px 20px",borderRadius:24,fontSize:13,cursor:"pointer",background:classF===v?c+"33":"transparent",color:classF===v?c:T.sub,border:`1px solid ${classF===v?c:T.border}`,fontWeight:classF===v?500:400,transition:"all .2s"}}>
                  {l}
                </button>
              ))}
              <div style={{position:"relative",marginLeft:"auto"}}>
                <i className="ti ti-search" style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:T.sub,fontSize:13}}/>
                <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,paddingLeft:28,width:160}}/>
              </div>
            </div>
            {/* Summary cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
              {[
                {l:"Total Stocks",v:GLOBAL_STOCKS.length,c:T.accent},
                {l:"Bullish 🐂",v:GLOBAL_STOCKS.filter(s=>s.bull).length,c:T.success},
                {l:"Bearish 🐻",v:GLOBAL_STOCKS.filter(s=>!s.bull).length,c:T.danger},
                {l:"Bull Ratio",v:((GLOBAL_STOCKS.filter(s=>s.bull).length/GLOBAL_STOCKS.length)*100).toFixed(0)+"%",c:T.gold},
              ].map((c,i)=>(
                <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"13px 15px"}}>
                  <div style={{fontSize:11,color:T.sub,marginBottom:5}}>{c.l}</div>
                  <div style={{fontSize:20,fontWeight:500,color:c.c}}>{c.v}</div>
                </div>
              ))}
            </div>
            {/* Pie */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginBottom:20}}>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontWeight:500,fontSize:13,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-chart-pie" style={{color:T.accent}}/>Bull vs Bear Distribution</div>
                <PieChart data={[{name:"Bullish 🐂",val:GLOBAL_STOCKS.filter(s=>s.bull).length,color:T.success},{name:"Bearish 🐻",val:GLOBAL_STOCKS.filter(s=>!s.bull).length,color:T.danger}]} size={150}/>
              </div>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontWeight:500,fontSize:13,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-chart-bar" style={{color:T.gold}}/>Sentiment by Sector</div>
                <BarChart data={SECTORS.filter(sec=>GLOBAL_STOCKS.some(s=>s.sector===sec)).map(sec=>{
                  const stocks=GLOBAL_STOCKS.filter(s=>s.sector===sec);
                  const bullPct=(stocks.filter(s=>s.bull).length/stocks.length)*100-50;
                  return {name:sec,val:bullPct};
                })}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
              {filteredMarket.map(s=>(
                <div key={s.ticker} onClick={()=>setDetailStock({...s,currentPrice:s.price,isBought:false})} style={{background:T.card,border:`1px solid ${s.bull?T.success+"44":T.danger+"44"}`,borderRadius:12,padding:14,cursor:"pointer",transition:"transform .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <div style={{width:32,height:32,borderRadius:8,background:s.bull?T.success+"22":T.danger+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:500,color:s.bull?T.success:T.danger}}>{s.ticker.slice(0,4)}</div>
                      <div><div style={{fontSize:12,fontWeight:500,color:T.text}}>{s.ticker}</div><div style={{fontSize:10,color:T.sub}}>{s.exchange}</div></div>
                    </div>
                    <span style={{fontSize:16}}>{s.bull?"🐂":"🐻"}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                    <span style={{color:T.text,fontWeight:500}}>{INR(s.price)}</span>
                    <span style={{color:s.change>=0?T.success:T.danger,fontWeight:500}}>{s.change>=0?"+":""}{s.change}%</span>
                  </div>
                  <div style={{fontSize:10,color:s.bull?T.success:T.danger,marginTop:4,padding:"2px 8px",borderRadius:20,background:s.bull?T.success+"11":T.danger+"11",display:"inline-block"}}>{s.bull?"Bullish Momentum":"Bearish Pressure"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ AI INSIGHTS ══ */}
        {tab==="insights"&&(
          <div>
            <div style={{fontWeight:500,fontSize:15,marginBottom:4}}>AI Financial Insights</div>
            <div style={{fontSize:12,color:T.sub,marginBottom:18}}>Claude AI · Revenue forecasts · Risk analysis · Indian market context</div>
            {bought.map(s=>{
              const pl=(s.currentPrice-s.buyPrice)*s.qty, p=PCT(s.buyPrice,s.currentPrice);
              return(
                <div key={s.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                    <div style={{display:"flex",gap:10,alignItems:"center",cursor:"pointer"}} onClick={()=>setDetailStock({...s,isBought:true})}>
                      <div style={{width:38,height:38,borderRadius:10,background:T.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,color:T.accent}}>{s.ticker.slice(0,4)}</div>
                      <div><div style={{fontWeight:500,color:T.text,fontSize:13}}>{s.ticker} — {s.name}</div><div style={{fontSize:11,color:T.sub}}>{s.exchange} · {s.sector}</div></div>
                    </div>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:12,color:pl>=0?T.success:T.danger,fontWeight:500}}>{pl>=0?"+":""}{INR(pl)} ({p}%)</span>
                      <button onClick={()=>getInsight(s)} disabled={loadingAI[s.id]} style={{...btnS(T.accent+"33",T.accent,T.accent+"55"),padding:"5px 11px",fontSize:11}}>
                        <i className={`ti ${loadingAI[s.id]?"ti-loader-2":"ti-sparkles"}`} style={{animation:loadingAI[s.id]?"spin 1s linear infinite":""}}/>{loadingAI[s.id]?"Analyzing...":"Get Insight"}
                      </button>
                    </div>
                  </div>
                  {aiInsight[s.id]&&<div style={{marginTop:12,padding:14,background:T.surface,borderRadius:10,fontSize:12,lineHeight:1.8,whiteSpace:"pre-line",color:T.text,borderLeft:`3px solid ${T.accent}`}}>
                    <div style={{fontSize:11,color:T.accent,fontWeight:500,marginBottom:6}}><i className="ti ti-brain" style={{marginRight:4}}/>Claude AI Analysis</div>
                    {aiInsight[s.id]}
                  </div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ STATS ══ */}
        {tab==="stats"&&(
          <div>
            <div style={{fontWeight:500,fontSize:15,marginBottom:16}}>Portfolio Statistics</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
              {[
                {l:"Best Performer",v:()=>{const s=bought.reduce((a,b)=>+PCT(b.buyPrice,b.currentPrice)>+PCT(a.buyPrice,a.currentPrice)?b:a);return`${s.ticker} (+${PCT(s.buyPrice,s.currentPrice)}%)`;},c:T.success},
                {l:"Worst Performer",v:()=>{const s=bought.reduce((a,b)=>+PCT(b.buyPrice,b.currentPrice)<+PCT(a.buyPrice,a.currentPrice)?b:a);return`${s.ticker} (${PCT(s.buyPrice,s.currentPrice)}%)`;},c:T.danger},
                {l:"Avg Return",v:()=>`${(bought.reduce((a,s)=>a+((s.currentPrice-s.buyPrice)/s.buyPrice*100),0)/bought.length).toFixed(2)}%`,c:T.accent2},
                {l:"Win Rate",v:()=>`${((bought.filter(s=>s.currentPrice>s.buyPrice).length/bought.length)*100).toFixed(0)}%`,c:T.success},
                {l:"Total Invested",v:()=>INR(totalInvested),c:T.text},
                {l:"Current Value",v:()=>INR(totalCurrent),c:T.teal},
              ].map((c,i)=>(
                <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"13px 15px"}}>
                  <div style={{fontSize:11,color:T.sub,marginBottom:5}}>{c.l}</div>
                  <div style={{fontSize:14,fontWeight:500,color:c.c}}>{c.v()}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginBottom:16}}>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontWeight:500,fontSize:13,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-chart-pie" style={{color:T.accent}}/>Sector Allocation</div>
                <PieChart data={sectorPie()} size={150}/>
              </div>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontWeight:500,fontSize:13,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-chart-bar" style={{color:T.gold}}/>Individual Returns</div>
                <BarChart data={perfData}/>
              </div>
            </div>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
              <div style={{fontWeight:500,fontSize:13,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-chart-line" style={{color:T.teal}}/>Stock Performance Details</div>
              {bought.map(s=>{
                const p=+PCT(s.buyPrice,s.currentPrice), w=Math.min(Math.abs(p)*2.5,100);
                return(
                  <div key={s.id} onClick={()=>setDetailStock({...s,isBought:true})} style={{marginBottom:14,cursor:"pointer",padding:"8px",borderRadius:8,transition:"background .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=T.surface} onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                      <span style={{color:T.text,fontWeight:500}}>{s.ticker} <span style={{color:T.sub,fontWeight:400}}>{s.name}</span></span>
                      <span style={{color:p>=0?T.success:T.danger,fontWeight:500}}>{p>=0?"+":""}{p}%</span>
                    </div>
                    <div style={{height:5,background:T.surface,borderRadius:4}}>
                      <div style={{height:"100%",width:`${w}%`,background:p>=0?T.success:T.danger,borderRadius:4,boxShadow:`0 0 8px ${p>=0?T.success:T.danger}66`}}/>
                    </div>
                    <div style={{display:"flex",gap:12,marginTop:3,fontSize:10,color:T.sub}}>
                      <span>Buy: {INR(s.buyPrice)}</span><span>Now: {INR(s.currentPrice)}</span><span>Qty: {s.qty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══ STOCK DETAIL MODAL ══ */}
      {detailStock&&(
        <Modal title="Stock Details" onClose={()=>setDetailStock(null)} wide={true}>
          <StockDetail stock={detailStock} isBought={detailStock.isBought}/>
        </Modal>
      )}

      {/* BOUGHT MODALS */}
      {(addBModal||editBought)&&(
        <Modal title={editBought?"Edit Stock":"Add Bought Stock"} onClose={()=>{setAddBModal(false);setEditBought(null);}}>
          <BoughtForm form={bForm} setForm={setBForm}/>
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button onClick={()=>saveBought(bForm,editBought)} style={{...btnS(T.accent+"33",T.accent,T.accent+"55"),flex:1,justifyContent:"center"}}><i className={`ti ${editBought?"ti-check":"ti-plus"}`}/>{editBought?"Save Changes":"Add Stock"}</button>
            <button onClick={()=>{setAddBModal(false);setEditBought(null);}} style={{...btnS("transparent",T.sub,T.border)}}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* WISHLIST MODALS */}
      {(addWModal||editWish)&&(
        <Modal title={editWish?"Edit Wishlist":"Add to Wishlist"} onClose={()=>{setAddWModal(false);setEditWish(null);}}>
          <WishForm form={wForm} setForm={setWForm}/>
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button onClick={()=>saveWish(wForm,editWish)} style={{...btnS(T.orange+"33",T.orange,T.orange+"55"),flex:1,justifyContent:"center"}}><i className={`ti ${editWish?"ti-check":"ti-heart"}`}/>{editWish?"Save Changes":"Add to Watchlist"}</button>
            <button onClick={()=>{setAddWModal(false);setEditWish(null);}} style={{...btnS("transparent",T.sub,T.border)}}>Cancel</button>
          </div>
        </Modal>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input::placeholder{color:${T.sub}77} select option{background:${T.card};color:${T.text}} ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-thumb{background:${T.muted};border-radius:2px}`}</style>
    </div>
  );
}
