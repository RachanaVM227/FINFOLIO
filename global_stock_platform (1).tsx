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
const fmtN = n => Number(n).toLocaleString("en-IN");

const GLOBAL_STOCKS = [
  {ticker:"RELIANCE",name:"Reliance Industries",exchange:"NSE",sector:"Energy",price:2810,change:1.8,mktCap:"19.2L Cr",pe:28.4,eps:98.9,vol:"4.2M",high52:3025,low52:2180,desc:"India's largest conglomerate with diversified interests in petrochemicals, refining, oil & gas, retail, and digital services."},
  {ticker:"TCS",name:"Tata Consultancy Services",exchange:"NSE",sector:"Technology",price:3920,change:0.9,mktCap:"14.3L Cr",pe:32.1,eps:122.1,vol:"2.1M",high52:4234,low52:3311,desc:"India's largest IT services company providing consulting, IT services, and business solutions globally."},
  {ticker:"INFY",name:"Infosys Ltd.",exchange:"NSE",sector:"Technology",price:1745,change:-0.4,mktCap:"7.3L Cr",pe:28.7,eps:60.8,vol:"5.8M",high52:1900,low52:1352,desc:"Global leader in next-generation digital services and consulting, enabling clients in 56 countries to navigate their digital transformation."},
  {ticker:"HDFC",name:"HDFC Bank",exchange:"NSE",sector:"Finance",price:1680,change:1.2,mktCap:"12.7L Cr",pe:19.4,eps:86.6,vol:"6.1M",high52:1880,low52:1363,desc:"India's largest private sector bank by assets, offering a wide range of banking and financial services."},
  {ticker:"ICICI",name:"ICICI Bank",exchange:"NSE",sector:"Finance",price:1120,change:2.1,mktCap:"7.9L Cr",pe:18.2,eps:61.5,vol:"7.3M",high52:1285,low52:920,desc:"India's second-largest private bank, providing retail, corporate, and international banking services."},
  {ticker:"WIPRO",name:"Wipro Ltd.",exchange:"NSE",sector:"Technology",price:490,change:-1.1,mktCap:"2.6L Cr",pe:22.3,eps:22.0,vol:"4.4M",high52:590,low52:410,desc:"Global IT, consulting and business process services company with operations in 66 countries."},
  {ticker:"SBIN",name:"State Bank of India",exchange:"NSE",sector:"Finance",price:830,change:0.6,mktCap:"7.4L Cr",pe:10.1,eps:82.2,vol:"8.9M",high52:910,low52:620,desc:"India's largest public sector bank with over 22,000 branches and a dominant market position."},
  {ticker:"HCLTECH",name:"HCL Technologies",exchange:"NSE",sector:"Technology",price:1560,change:1.5,mktCap:"4.2L Cr",pe:27.5,eps:56.7,vol:"3.0M",high52:1720,low52:1235,desc:"Global technology company providing IT and business services including engineering and R&D."},
  {ticker:"AAPL",name:"Apple Inc.",exchange:"NASDAQ",sector:"Technology",price:18920,change:0.7,mktCap:"$2.9T",pe:31.2,eps:606.4,vol:"68M",high52:19940,low52:14800,desc:"World's most valuable technology company known for iPhone, Mac, iPad, and services like App Store and Apple Music."},
  {ticker:"MSFT",name:"Microsoft Corp.",exchange:"NASDAQ",sector:"Technology",price:36500,change:1.1,mktCap:"$2.7T",pe:37.4,eps:976.5,vol:"22M",high52:38200,low52:30200,desc:"Global technology leader in cloud computing (Azure), productivity software (Office 365), and enterprise solutions."},
  {ticker:"GOOGL",name:"Alphabet Inc.",exchange:"NASDAQ",sector:"Technology",price:15200,change:-0.3,mktCap:"$1.9T",pe:24.8,eps:613.0,vol:"18M",high52:17100,low52:12800,desc:"Parent company of Google, YouTube, and leading AI research lab DeepMind, with dominant digital advertising."},
  {ticker:"AMZN",name:"Amazon.com Inc.",exchange:"NASDAQ",sector:"Consumer",price:18400,change:2.4,mktCap:"$1.9T",pe:42.1,eps:436.8,vol:"35M",high52:21400,low52:15200,desc:"World's largest e-commerce and cloud computing company with AWS, Prime Video, and Alexa ecosystem."},
  {ticker:"TSLA",name:"Tesla Inc.",exchange:"NASDAQ",sector:"Technology",price:17500,change:-2.1,mktCap:"$557B",pe:58.3,eps:300.2,vol:"112M",high52:29400,low52:14200,desc:"Electric vehicle and clean energy pioneer producing Model S, 3, X, Y and developing autonomous driving technology."},
  {ticker:"NVDA",name:"NVIDIA Corp.",exchange:"NASDAQ",sector:"Technology",price:96000,change:3.2,mktCap:"$2.35T",pe:68.5,eps:1401.9,vol:"41M",high52:135000,low52:68400,desc:"World leader in AI accelerator chips (H100/B200), gaming GPUs, and data center computing platforms."},
  {ticker:"META",name:"Meta Platforms",exchange:"NASDAQ",sector:"Technology",price:58000,change:1.8,mktCap:"$1.47T",pe:28.9,eps:2006.9,vol:"14M",high52:71400,low52:43200,desc:"Owner of Facebook, Instagram and WhatsApp with major investments in AI and the metaverse."},
  {ticker:"JPM",name:"JPMorgan Chase",exchange:"NYSE",sector:"Finance",price:19800,change:0.9,mktCap:"$570B",pe:12.4,eps:1596.8,vol:"9M",high52:23400,low52:17200,desc:"America's largest bank by assets offering investment banking, commercial banking, and asset management."},
  {ticker:"V",name:"Visa Inc.",exchange:"NYSE",sector:"Finance",price:23500,change:0.6,mktCap:"$483B",pe:29.7,eps:791.6,vol:"6M",high52:26100,low52:21300,desc:"World's largest payment technology company processing over 200 billion transactions annually."},
  {ticker:"HSBA",name:"HSBC Holdings",exchange:"LSE",sector:"Finance",price:680,change:0.3,mktCap:"£124B",pe:8.2,eps:82.9,vol:"33M",high52:780,low52:580,desc:"One of the world's largest banking groups with a strong presence in Asia-Pacific and Europe."},
  {ticker:"7203",name:"Toyota Motor",exchange:"TSE",sector:"Industrials",price:3120,change:1.4,mktCap:"¥44T",pe:9.8,eps:318.4,vol:"12M",high52:3980,low52:2640,desc:"World's largest automaker pioneering hybrid technology and transitioning to hydrogen and electric vehicles."},
  {ticker:"NVDA",name:"NVIDIA Corp.",exchange:"NASDAQ",sector:"Technology",price:96000,change:3.2,mktCap:"$2.35T",pe:68.5,eps:1401.9,vol:"41M",high52:135000,low52:68400,desc:"World leader in AI accelerator chips."},
  {ticker:"BABA",name:"Alibaba Group",exchange:"HKEX",sector:"Consumer",price:7800,change:2.2,mktCap:"HK$1.6T",pe:14.2,eps:549.3,vol:"28M",high52:9600,low52:5800,desc:"China's leading e-commerce and cloud computing company with Taobao, Tmall, and Alibaba Cloud."},
  {ticker:"0700",name:"Tencent Holdings",exchange:"HKEX",sector:"Technology",price:41800,change:1.3,mktCap:"HK$3.9T",pe:22.8,eps:1833.3,vol:"19M",high52:46200,low52:30400,desc:"China's largest technology conglomerate with WeChat, gaming, fintech and cloud businesses."},
  {ticker:"SAP",name:"SAP SE",exchange:"EURONEXT",sector:"Technology",price:17200,change:0.7,mktCap:"€196B",pe:48.1,eps:357.6,vol:"2M",high52:21200,low52:13400,desc:"Europe's largest software company specializing in enterprise resource planning and cloud solutions."},
  {ticker:"RIO",name:"Rio Tinto",exchange:"ASX",sector:"Materials",price:10400,change:-0.5,mktCap:"A$167B",pe:11.4,eps:912.3,vol:"4M",high52:13200,low52:9100,desc:"Global mining giant producing iron ore, copper, lithium, and aluminum — critical for energy transition."},
  {ticker:"CBA",name:"Commonwealth Bank",exchange:"ASX",sector:"Finance",price:11800,change:1.0,mktCap:"A$200B",pe:22.6,eps:522.1,vol:"3M",high52:13400,low52:9800,desc:"Australia's largest bank by market cap with leading digital banking platform and retail presence."},
];

const SECTORS = ["Technology","Finance","Healthcare","Energy","Consumer","Industrials","Materials","Utilities","Real Estate","Telecom"];
const EXCHANGES = ["NSE","BSE","NASDAQ","NYSE","LSE","TSE","HKEX","EURONEXT","ASX"];

const INIT_BOUGHT = [
  {id:1,ticker:"RELIANCE",name:"Reliance Industries",exchange:"NSE",sector:"Energy",qty:5,buyPrice:2450,currentPrice:2810,date:"2024-12-01"},
  {id:2,ticker:"TCS",name:"Tata Consultancy Services",exchange:"NSE",sector:"Technology",qty:3,buyPrice:3600,currentPrice:3920,date:"2025-01-15"},
  {id:3,ticker:"AAPL",name:"Apple Inc.",exchange:"NASDAQ",sector:"Technology",qty:2,buyPrice:16500,currentPrice:18920,date:"2024-11-10"},
  {id:4,ticker:"NVDA",name:"NVIDIA Corp.",exchange:"NASDAQ",sector:"Technology",qty:1,buyPrice:72000,currentPrice:96000,date:"2025-03-01"},
];
const INIT_WISHLIST = [
  {id:101,ticker:"MSFT",name:"Microsoft Corp.",exchange:"NASDAQ",sector:"Technology",targetPrice:34000,currentPrice:36500,note:"Long-term hold"},
  {id:102,ticker:"INFY",name:"Infosys Ltd.",exchange:"NSE",sector:"Technology",targetPrice:1800,currentPrice:1745,note:"Buy on dip"},
  {id:103,ticker:"TSLA",name:"Tesla Inc.",exchange:"NASDAQ",sector:"Technology",targetPrice:15000,currentPrice:17500,note:"Wait for correction"},
];

// ─── Canvas BG ───
function CandleBG() {
  const cv = useRef(null);
  useEffect(()=>{
    const c=cv.current; if(!c) return;
    const ctx=c.getContext("2d");
    c.width=c.offsetWidth; c.height=c.offsetHeight;
    const W=c.width, H=c.height;
    const cols=Array.from({length:22},(_,i)=>({x:(W/22)*i+16,y:H*0.25+Math.random()*H*0.5,h:18+Math.random()*70,w:9,wk:8+Math.random()*25,bull:Math.random()>.45,sp:0.15+Math.random()*0.3,ph:Math.random()*Math.PI*2,dr:(Math.random()-.5)*0.25}));
    let raf;
    function draw(t){
      ctx.clearRect(0,0,W,H);
      cols.forEach(cl=>{
        const sy=Math.sin(t*.001*cl.sp+cl.ph)*10;
        const oy=cl.y+sy;
        const col=cl.bull?"#00D4AA":"#FF4D6D";
        ctx.globalAlpha=0.09; ctx.strokeStyle=col; ctx.lineWidth=1.2;
        ctx.beginPath(); ctx.moveTo(cl.x+cl.w/2,oy-cl.h/2-cl.wk); ctx.lineTo(cl.x+cl.w/2,oy+cl.h/2+cl.wk); ctx.stroke();
        ctx.fillStyle=col; ctx.fillRect(cl.x,oy-cl.h/2,cl.w,cl.h);
        cl.y+=cl.dr; if(cl.y<H*.08||cl.y>H*.92) cl.dr*=-1;
      });
      ctx.globalAlpha=.03; ctx.strokeStyle="#6C63FF"; ctx.lineWidth=1;
      for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(0,H/6*i);ctx.lineTo(W,H/6*i);ctx.stroke();}
      ctx.globalAlpha=1;
      raf=requestAnimationFrame(draw);
    }
    raf=requestAnimationFrame(draw);
    return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={cv} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
}

// ─── SVG Pie Chart ───
function PieChart({data, size=160}) {
  const total = data.reduce((a,d)=>a+d.val,0);
  let angle = -Math.PI/2;
  const cx=size/2, cy=size/2, r=size/2-8, ri=r*0.52;
  const slices = data.map(d=>{
    const sweep=(d.val/total)*Math.PI*2;
    const start=angle, end=angle+sweep;
    angle=end;
    const lx=cx+(r+0)*Math.cos(start+sweep/2);
    const ly=cy+(r+0)*Math.sin(start+sweep/2);
    const x1=cx+r*Math.cos(start), y1=cy+r*Math.sin(start);
    const x2=cx+r*Math.cos(end), y2=cy+r*Math.sin(end);
    const ix1=cx+ri*Math.cos(start), iy1=cy+ri*Math.sin(start);
    const ix2=cx+ri*Math.cos(end), iy2=cy+ri*Math.sin(end);
    const lg=sweep>Math.PI?1:0;
    const path=`M${ix1},${iy1} L${x1},${y1} A${r},${r},0,${lg},1,${x2},${y2} L${ix2},${iy2} A${ri},${ri},0,${lg},0,${ix1},${iy1} Z`;
    return {...d,path,pct:((d.val/total)*100).toFixed(1)};
  });
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s,i)=>(
        <path key={i} d={s.path} fill={s.color} opacity={0.9}>
          <title>{s.name}: {s.pct}%</title>
        </path>
      ))}
      <circle cx={cx} cy={cy} r={ri-2} fill={T.card}/>
      <text x={cx} y={cy-6} textAnchor="middle" fill={T.text} fontSize="11" fontWeight="500">{data.length}</text>
      <text x={cx} y={cy+10} textAnchor="middle" fill={T.sub} fontSize="9">sectors</text>
    </svg>
  );
}

// ─── SVG Bar Chart ───
function BarChart({data, height=110}) {
  const W=260, H=height;
  const maxV=Math.max(...data.map(d=>Math.abs(d.val)));
  return(
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {data.map((d,i)=>{
        const bw=W/data.length-4;
        const x=i*(W/data.length)+2;
        const bh=Math.max(2,(Math.abs(d.val)/maxV)*(H-22));
        const y=H-bh-14;
        const col=d.val>=0?T.success:T.danger;
        return(
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} fill={col} opacity={0.8} rx={2}>
              <title>{d.name}: {d.val>=0?"+":""}{d.val}%</title>
            </rect>
            <text x={x+bw/2} y={H-2} textAnchor="middle" fill={T.sub} fontSize="7">{d.name.slice(0,4)}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── SVG Line Chart ───
function LineChart({data, color, height=80, showArea=true}) {
  const W=260, H=height;
  const mn=Math.min(...data), mx=Math.max(...data), rng=mx-mn||1;
  const pts=data.map((v,i)=>[((i/(data.length-1))*W),(H-4)-((v-mn)/rng)*(H-12)]);
  const d="M"+pts.map(p=>p.join(",")).join(" L");
  const area=d+` L${W},${H-4} L0,${H-4} Z`;
  return(
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {showArea&&<path d={area} fill="url(#lg)"/>}
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>i===pts.length-1&&<circle key={i} cx={p[0]} cy={p[1]} r={3} fill={color}/>)}
    </svg>
  );
}

// ─── Sparkline ───
function Spark({data,color}) {
  const W=70,H=26;
  const mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*W},${H-2-((v-mn)/rng)*(H-4)}`).join(" ");
  return(<svg width={W} height={H}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>);
}

// ─── Ticker ───
function TickerTape() {
  const [x,setX]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setX(p=>p<-880?0:p-0.8),16);return()=>clearInterval(id);},[]);
  const items=GLOBAL_STOCKS.slice(0,12);
  return(
    <div style={{overflow:"hidden",borderBottom:`1px solid ${T.border}`,background:T.nav+"cc",padding:"5px 0"}}>
      <div style={{display:"flex",gap:28,transform:`translateX(${x}px)`,whiteSpace:"nowrap"}}>
        {[...items,...items].map((s,i)=>(
          <span key={i} style={{fontSize:11,color:T.sub,display:"inline-flex",gap:6,alignItems:"center"}}>
            <span style={{color:T.accent2,fontWeight:500}}>{s.ticker}</span>
            <span style={{color:T.text}}>{INR(s.price)}</span>
            <span style={{color:s.change>=0?T.success:T.danger,fontSize:10}}>{s.change>=0?"▲":"▼"}{Math.abs(s.change)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Modal ───
function Modal({title,onClose,children,wide}) {
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{position:"absolute",inset:0,background:"#00000099",backdropFilter:"blur(4px)"}} onClick={onClose}/>
      <div style={{position:"relative",background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:24,width:"100%",maxWidth:wide?680:520,maxHeight:"88vh",overflowY:"auto",zIndex:201,boxShadow:"0 24px 80px #00000099"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontWeight:500,fontSize:15,color:T.text}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.sub,fontSize:20,lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Stock Detail Modal ───
function StockDetail({stock, onClose, onAddWish, onAddBought}) {
  const hist=Array.from({length:30},(_,i)=>stock.price*(0.88+Math.random()*.24));
  const vol=Array.from({length:14},()=>Math.floor(Math.random()*8000000+1000000));
  const isUp=stock.change>=0;
  return(
    <Modal title="" onClose={onClose} wide>
      <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:18,flexWrap:"wrap"}}>
        <div style={{width:48,height:48,borderRadius:13,background:T.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:500,color:T.accent,flexShrink:0}}>{stock.ticker.slice(0,4)}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:18,fontWeight:500,color:T.text}}>{stock.ticker}</div>
          <div style={{fontSize:12,color:T.sub}}>{stock.name} · {stock.exchange} · {stock.sector}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:22,fontWeight:500,color:T.text}}>{INR(stock.price)}</div>
          <div style={{fontSize:13,color:isUp?T.success:T.danger,fontWeight:500}}>{isUp?"▲":"▼"} {Math.abs(stock.change)}% today</div>
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <LineChart data={hist} color={isUp?T.success:T.danger} height={100}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.sub,marginTop:2}}>
          <span>30 days</span><span>Live</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        {[
          {l:"Market Cap",v:stock.mktCap},{l:"P/E Ratio",v:stock.pe},{l:"EPS",v:stock.eps},
          {l:"Volume",v:stock.vol},{l:"52W High",v:INR(stock.high52)},{l:"52W Low",v:INR(stock.low52)},
        ].map((d,i)=>(
          <div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontSize:10,color:T.sub,marginBottom:3}}>{d.l}</div>
            <div style={{fontSize:13,fontWeight:500,color:T.text}}>{d.v}</div>
          </div>
        ))}
      </div>
      <div style={{background:T.surface,borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:12,lineHeight:1.7,color:T.sub,border:`1px solid ${T.border}`}}>
        {stock.desc}
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,color:T.sub,marginBottom:6}}>52-Week Range</div>
        <div style={{height:6,background:T.surface,borderRadius:4,position:"relative"}}>
          <div style={{position:"absolute",left:`${((stock.price-stock.low52)/(stock.high52-stock.low52))*100}%`,top:-3,width:12,height:12,borderRadius:"50%",background:T.accent,transform:"translateX(-50%)",boxShadow:`0 0 8px ${T.accentGlow}`}}/>
          <div style={{height:"100%",background:`linear-gradient(90deg,${T.danger}44,${T.success}44)`,borderRadius:4}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.sub,marginTop:4}}>
          <span>{INR(stock.low52)}</span><span>{INR(stock.high52)}</span>
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>{onAddBought(stock);onClose();}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:10,background:T.accent+"33",color:T.accent,border:`1px solid ${T.accent}55`,cursor:"pointer",fontSize:13,fontWeight:500}}>
          <span>🛒</span> Add to Bought
        </button>
        <button onClick={()=>{onAddWish(stock);onClose();}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:10,background:T.orange+"22",color:T.orange,border:`1px solid ${T.orange}44`,cursor:"pointer",fontSize:13,fontWeight:500}}>
          <span>♥</span> Add to Wishlist
        </button>
      </div>
    </Modal>
  );
}

const inp={padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,background:T.surface,color:T.text,fontSize:13,width:"100%",boxSizing:"border-box"};
const btnS=(bg,col,brd)=>({display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:9,background:bg,color:col,border:`1px solid ${brd||bg}`,cursor:"pointer",fontSize:12,fontWeight:500});

// ─── NAV CONFIG per tab ───
const NAVBARS = {
  dashboard:{label:"Dashboard",icon:"📊",sub:["Overview","Performance","Allocation","Activity"]},
  market:{label:"Market",icon:"🌐",sub:["All Stocks","Top Gainers","Top Losers","Volume"]},
  bought:{label:"Portfolio",icon:"💼",sub:["Holdings","P&L View","History","Summary"]},
  wishlist:{label:"Watchlist",icon:"♥",sub:["My Watchlist","Target Alerts","Sector Watch"]},
  classify:{label:"Classify",icon:"🔱",sub:["Bullish","Bearish","Neutral","Screener"]},
  insights:{label:"AI Insights",icon:"🧠",sub:["All Stocks","Market Outlook"]},
  stats:{label:"Stats",icon:"📈",sub:["Overview","By Sector","By Exchange"]},
};

const RAMP=["#6C63FF","#00D4AA","#FFD166","#FF6B35","#FF4D6D","#4FC3F7","#AB47BC","#26A69A","#EF5350","#FFA726"];

export default function App() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [user,setUser]=useState({name:"",phone:""});
  const [loginForm,setLoginForm]=useState({name:"",phone:""});
  const [loginErr,setLoginErr]=useState("");
  const [nav,setNav]=useState("dashboard");
  const [subNav,setSubNav]=useState("Overview");
  const [bought,setBought]=useState(INIT_BOUGHT);
  const [wishlist,setWishlist]=useState(INIT_WISHLIST);
  const [toast,setToast]=useState(null);
  const [search,setSearch]=useState("");
  const [sectorF,setSectorF]=useState("All");
  const [exF,setExF]=useState("All");
  const [editBought,setEditBought]=useState(null);
  const [addBoughtModal,setAddBoughtModal]=useState(false);
  const [editWish,setEditWish]=useState(null);
  const [addWishModal,setAddWishModal]=useState(false);
  const [bForm,setBForm]=useState({ticker:"",name:"",exchange:"NSE",sector:"Technology",qty:"",buyPrice:"",currentPrice:"",date:""});
  const [wForm,setWForm]=useState({ticker:"",name:"",exchange:"NSE",sector:"Technology",targetPrice:"",currentPrice:"",note:""});
  const [aiInsight,setAiInsight]=useState({});
  const [loadingInsight,setLoadingInsight]=useState({});
  const [selectedStock,setSelectedStock]=useState(null);
  const [classifyFilter,setClassifyFilter]=useState("Bullish");
  const [counters,setCounters]=useState({pv:0,inv:0,pnl:0});
  const [particles,setParticles]=useState([]);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const totalInvested=bought.reduce((a,s)=>a+s.qty*s.buyPrice,0);
  const totalCurrent=bought.reduce((a,s)=>a+s.qty*s.currentPrice,0);
  const totalPnL=totalCurrent-totalInvested;
  const totalPct=totalInvested?((totalPnL/totalInvested)*100).toFixed(2):0;

  useEffect(()=>{ setParticles(Array.from({length:20},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,s:Math.random()*4+2,sp:0.3+Math.random()*0.7,op:0.1+Math.random()*0.4}))); },[]);

  useEffect(()=>{
    if(!loggedIn) return;
    let st=null;
    const step=ts=>{
      if(!st) st=ts;
      const p=Math.min((ts-st)/1200,1);
      const e=1-Math.pow(1-p,3);
      setCounters({pv:totalCurrent*e,inv:totalInvested*e,pnl:totalPnL*e});
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },[loggedIn,totalCurrent]);

  const changeNav=(id)=>{ setNav(id); setSubNav(Object.values(NAVBARS)[Object.keys(NAVBARS).indexOf(id)]?.sub[0]||""); };

  const handleLogin=()=>{
    if(!loginForm.name.trim()){setLoginErr("Enter your full name.");return;}
    if(!/^\+?[\d\s\-]{8,15}$/.test(loginForm.phone)){setLoginErr("Valid phone number required.");return;}
    setUser({name:loginForm.name.trim(),phone:loginForm.phone.trim()});
    setLoggedIn(true);
  };

  const saveBought=(form,id)=>{
    if(!form.ticker||!form.qty||!form.buyPrice||!form.currentPrice||!form.date){showToast("Fill all fields","error");return;}
    const e={...form,qty:+form.qty,buyPrice:+form.buyPrice,currentPrice:+form.currentPrice};
    if(id) setBought(p=>p.map(x=>x.id===id?{...x,...e}:x));
    else setBought(p=>[...p,{...e,id:Date.now()}]);
    setEditBought(null);setAddBoughtModal(false);
    setBForm({ticker:"",name:"",exchange:"NSE",sector:"Technology",qty:"",buyPrice:"",currentPrice:"",date:""});
    showToast(id?"Stock updated!":"Stock added!");
  };
  const deleteBought=id=>{setBought(p=>p.filter(x=>x.id!==id));showToast("Removed");};
  const openEditBought=s=>{setBForm({ticker:s.ticker,name:s.name,exchange:s.exchange,sector:s.sector,qty:s.qty,buyPrice:s.buyPrice,currentPrice:s.currentPrice,date:s.date});setEditBought(s.id);};

  const saveWish=(form,id)=>{
    if(!form.ticker||!form.targetPrice||!form.currentPrice){showToast("Fill required fields","error");return;}
    const e={...form,targetPrice:+form.targetPrice,currentPrice:+form.currentPrice};
    if(id) setWishlist(p=>p.map(x=>x.id===id?{...x,...e}:x));
    else setWishlist(p=>[...p,{...e,id:Date.now()}]);
    setEditWish(null);setAddWishModal(false);
    setWForm({ticker:"",name:"",exchange:"NSE",sector:"Technology",targetPrice:"",currentPrice:"",note:""});
    showToast(id?"Updated!":"Added to wishlist!");
  };
  const deleteWish=id=>{setWishlist(p=>p.filter(x=>x.id!==id));showToast("Removed from wishlist");};
  const openEditWish=s=>{setWForm({ticker:s.ticker,name:s.name,exchange:s.exchange,sector:s.sector,targetPrice:s.targetPrice,currentPrice:s.currentPrice,note:s.note||""});setEditWish(s.id);};

  const prefillBought=s=>{setBForm({ticker:s.ticker,name:s.name,exchange:s.exchange,sector:s.sector,qty:"",buyPrice:s.price,currentPrice:s.price,date:""});setAddBoughtModal(true);setNav("bought");};
  const prefillWish=s=>{setWForm({ticker:s.ticker,name:s.name,exchange:s.exchange,sector:s.sector,targetPrice:s.price,currentPrice:s.price,note:""});setAddWishModal(true);setNav("wishlist");};

  const getInsight=async(stock)=>{
    setLoadingInsight(p=>({...p,[stock.id]:true}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:`You are a financial analyst for Indian & global markets. Give 3-section analysis: 1) Revenue Forecast (2 sentences), 2) Risk Factors (2 sentences), 3) Verdict (1 sentence). Stock: ${stock.ticker} (${stock.name}), Exchange: ${stock.exchange}, Sector: ${stock.sector}, Bought: ₹${stock.buyPrice}, Now: ₹${stock.currentPrice}, Return: ${PCT(stock.buyPrice,stock.currentPrice)}%. Mention Indian market context.`}]})});
      const d=await res.json();
      setAiInsight(p=>({...p,[stock.id]:d.content?.map(c=>c.text||"").join("")||"Unable to generate."}));
    }catch(e){setAiInsight(p=>({...p,[stock.id]:"Error fetching insight."}));}
    setLoadingInsight(p=>({...p,[stock.id]:false}));
  };

  // derived data
  const filteredMarket=GLOBAL_STOCKS.filter(s=>{
    const q=search.toLowerCase();
    return(!q||s.ticker.toLowerCase().includes(q)||s.name.toLowerCase().includes(q))&&(sectorF==="All"||s.sector===sectorF)&&(exF==="All"||s.exchange===exF);
  });
  const sortedMarket = subNav==="Top Gainers"?[...filteredMarket].sort((a,b)=>b.change-a.change):subNav==="Top Losers"?[...filteredMarket].sort((a,b)=>a.change-b.change):filteredMarket;

  const sectorAlloc=SECTORS.map((s,i)=>({name:s,val:bought.filter(x=>x.sector===s).reduce((a,x)=>a+x.qty*x.currentPrice,0),color:RAMP[i]})).filter(s=>s.val>0);
  const totalAlloc=sectorAlloc.reduce((a,s)=>a+s.val,0);
  const portfolioHist=Array.from({length:20},(_,i)=>totalCurrent*(0.82+i*.009+Math.random()*.02));

  const bullish=GLOBAL_STOCKS.filter(s=>s.change>1);
  const bearish=GLOBAL_STOCKS.filter(s=>s.change<-0.5);
  const neutral=GLOBAL_STOCKS.filter(s=>s.change>=-0.5&&s.change<=1);
  const classData={Bullish:bullish,Bearish:bearish,Neutral:neutral,Screener:[...GLOBAL_STOCKS].sort((a,b)=>b.change-a.change)};

  const sparkData=s=>Array.from({length:10},(_,i)=>s.buyPrice+(s.currentPrice-s.buyPrice)*i/9+(Math.random()-.5)*s.buyPrice*.02);

  const MAIN_TABS=[
    {id:"dashboard",icon:"📊",label:"Dashboard"},
    {id:"market",icon:"🌐",label:"Market"},
    {id:"bought",icon:"💼",label:"Portfolio"},
    {id:"wishlist",icon:"♥",label:"Watchlist"},
    {id:"classify",icon:"🔱",label:"Classify"},
    {id:"insights",icon:"🧠",label:"AI Insights"},
    {id:"stats",icon:"📈",label:"Stats"},
  ];

  if(!loggedIn) return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-sans)",overflow:"hidden",position:"relative"}}>
      <CandleBG/>
      {particles.map(p=>(
        <div key={p.id} style={{position:"fixed",left:`${p.x}%`,top:`${p.y}%`,width:p.s,height:p.s,borderRadius:"50%",background:p.id%3===0?T.accent:p.id%3===1?T.teal:T.gold,opacity:p.op,animation:`fl${p.id%4} ${3+p.sp}s ease-in-out infinite`,pointerEvents:"none"}}/>
      ))}
      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:440,padding:20}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:68,height:68,borderRadius:20,background:`linear-gradient(135deg,${T.accent},${T.teal})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:`0 0 50px ${T.accentGlow}`,animation:"pulse 2s ease-in-out infinite"}}>
            <span style={{fontSize:32}}>📊</span>
          </div>
          <div style={{fontSize:28,fontWeight:500,color:T.text,letterSpacing:2}}>Finfolio</div>
          <div style={{fontSize:12,color:T.sub,marginTop:4}}>Stock Market Dashboard · Global Investor Edition</div>
        </div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:28,backdropFilter:"blur(10px)"}}>
          <div style={{fontSize:14,color:T.sub,marginBottom:18,textAlign:"center"}}>Sign in to access your portfolio</div>
          {[["name","Full Name","👤","e.g. Arjun Mehta","text"],["phone","Phone Number","📱","+91 98765 43210","text"]].map(([f,l,ic,pl,t])=>(
            <div key={f} style={{marginBottom:14}}>
              <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:5}}>{l}</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none"}}>{ic}</span>
                <input type={t} placeholder={pl} value={loginForm[f]} onChange={e=>setLoginForm(p=>({...p,[f]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{...inp,paddingLeft:32}}/>
              </div>
            </div>
          ))}
          {loginErr&&<div style={{fontSize:12,color:T.danger,padding:"8px 12px",background:T.danger+"22",borderRadius:8,marginBottom:14}}>{loginErr}</div>}
          <button onClick={handleLogin} style={{...btnS(`linear-gradient(135deg,${T.accent},${T.teal})`,"#fff","transparent"),width:"100%",justifyContent:"center",padding:"12px",fontSize:14,borderRadius:12,boxShadow:`0 6px 28px ${T.accentGlow}`}}>
            🚀 Enter Dashboard
          </button>
          <div style={{marginTop:18,padding:12,background:T.surface,borderRadius:10,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:10,color:T.sub,marginBottom:6}}>Live Preview</div>
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              {GLOBAL_STOCKS.slice(0,5).map(s=>(
                <span key={s.ticker} style={{fontSize:11}}><span style={{color:T.accent2,fontWeight:500}}>{s.ticker}</span> <span style={{color:s.change>=0?T.success:T.danger}}>{s.change>=0?"▲":"▼"}{Math.abs(s.change)}%</span></span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fl0{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}} @keyframes fl1{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}} @keyframes fl2{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}} @keyframes fl3{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes pulse{0%,100%{box-shadow:0 0 50px ${T.accentGlow}}50%{box-shadow:0 0 80px ${T.accent}88}} input::placeholder{color:${T.sub}77}`}</style>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"var(--font-sans)",color:T.text}}>
      <CandleBG/>

      {toast&&<div style={{position:"fixed",top:16,right:16,zIndex:1000,padding:"10px 18px",borderRadius:10,background:toast.type==="error"?T.danger+"33":T.success+"33",color:toast.type==="error"?T.danger:T.success,fontSize:13,border:`1px solid ${toast.type==="error"?T.danger+"55":T.success+"55"}`,backdropFilter:"blur(8px)"}}>{toast.type==="error"?"⚠️":"✓"} {toast.msg}</div>}

      {/* ── TOP HEADER ── */}
      <div style={{position:"sticky",top:0,zIndex:50,background:T.nav+"ee",backdropFilter:"blur(10px)",borderBottom:`1px solid ${T.border}`}}>
        <div style={{padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${T.accent},${T.teal})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 16px ${T.accentGlow}`,fontSize:17}}>📊</div>
            <span style={{fontWeight:500,fontSize:17,letterSpacing:.5}}>Finfolio</span>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:T.accent+"33",color:T.accent2,border:`1px solid ${T.accent}44`}}>PRO</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <div style={{fontSize:11,padding:"4px 12px",borderRadius:20,background:totalPnL>=0?T.success+"22":T.danger+"22",color:totalPnL>=0?T.success:T.danger,border:`1px solid ${totalPnL>=0?T.success+"44":T.danger+"44"}`,fontWeight:500}}>
              {totalPnL>=0?"+":""}{INR(totalPnL)} ({totalPct}%)
            </div>
            <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent},${T.teal})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:500,color:"#fff"}}>{user.name.charAt(0).toUpperCase()}</div>
            <span style={{fontSize:12,color:T.sub}}>{user.name.split(" ")[0]}</span>
            <button onClick={()=>setLoggedIn(false)} style={{...btnS("transparent",T.sub,T.border),padding:"5px 8px",fontSize:11}}>⎋ Exit</button>
          </div>
        </div>
        <TickerTape/>

        {/* ── MAIN NAV TABS ── */}
        <div style={{display:"flex",padding:"0 16px",overflowX:"auto",borderBottom:`1px solid ${T.border}44`,gap:0}}>
          {MAIN_TABS.map(n=>(
            <button key={n.id} onClick={()=>changeNav(n.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"9px 14px",fontSize:11,fontWeight:nav===n.id?500:400,color:nav===n.id?T.accent:T.sub,background:nav===n.id?T.accent+"11":"transparent",border:"none",borderBottom:nav===n.id?`2px solid ${T.accent}`:"2px solid transparent",cursor:"pointer",whiteSpace:"nowrap",transition:"all .2s",borderRadius:"4px 4px 0 0"}}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </div>

        {/* ── SUB-NAV (unique per tab) ── */}
        {NAVBARS[nav]&&(
          <div style={{display:"flex",padding:"0 16px",overflowX:"auto",background:T.surface+"88",gap:0}}>
            {(nav==="classify"?["Bullish","Bearish","Neutral","Screener"]:NAVBARS[nav].sub).map(s=>(
              <button key={s} onClick={()=>{setSubNav(s);if(nav==="classify")setClassifyFilter(s);}} style={{padding:"7px 14px",fontSize:11,color:subNav===s?T.text:T.sub,background:"transparent",border:"none",borderBottom:subNav===s?`2px solid ${T.teal}`:"2px solid transparent",cursor:"pointer",whiteSpace:"nowrap",transition:"color .15s"}}>
                {nav==="classify"&&s==="Bullish"?"🟢 ":nav==="classify"&&s==="Bearish"?"🔴 ":nav==="classify"&&s==="Neutral"?"🟡 ":""}{s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{padding:20,position:"relative",zIndex:1}}>

        {/* ══ DASHBOARD ══ */}
        {nav==="dashboard"&&(
          <div>
            {/* KPI Row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:12,marginBottom:20}}>
              {[
                {l:"Portfolio Value",v:INR(counters.pv),i:"💰",c:T.accent},
                {l:"Invested",v:INR(counters.inv),i:"📥",c:T.teal},
                {l:"P&L",v:(counters.pnl>=0?"+":"")+INR(counters.pnl),i:"📊",c:totalPnL>=0?T.success:T.danger},
                {l:"Return",v:totalPct+"%",i:"📈",c:+totalPct>=0?T.success:T.danger},
                {l:"Holdings",v:bought.length,i:"💼",c:T.gold},
                {l:"Watchlist",v:wishlist.length,i:"♥",c:T.orange},
              ].map((c,i)=>(
                <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"13px 15px",transition:"transform .2s,box-shadow .2s",cursor:"default"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 26px ${T.border}`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
                    <span style={{fontSize:14}}>{c.i}</span>
                    <span style={{fontSize:10,color:T.sub}}>{c.l}</span>
                  </div>
                  <div style={{fontSize:16,fontWeight:500,color:c.c}}>{c.v}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            {(subNav==="Overview"||subNav==="Performance"||subNav==="Allocation")&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,marginBottom:16}}>

                {/* Portfolio Line Chart */}
                {(subNav==="Overview"||subNav==="Performance")&&(
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                    <div style={{fontSize:13,fontWeight:500,color:T.text,marginBottom:4}}>📈 Portfolio Growth</div>
                    <div style={{fontSize:11,color:T.sub,marginBottom:10}}>Last 20 data points</div>
                    <LineChart data={portfolioHist} color={T.accent} height={90}/>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.sub,marginTop:4}}>
                      <span>Start: {INR(portfolioHist[0])}</span><span>Now: {INR(portfolioHist[portfolioHist.length-1])}</span>
                    </div>
                  </div>
                )}

                {/* Sector Pie */}
                {(subNav==="Overview"||subNav==="Allocation")&&(
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                    <div style={{fontSize:13,fontWeight:500,color:T.text,marginBottom:12}}>🥧 Sector Allocation</div>
                    <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                      <PieChart data={sectorAlloc.map((s,i)=>({...s,color:RAMP[i]}))} size={140}/>
                      <div style={{flex:1,minWidth:100}}>
                        {sectorAlloc.map((s,i)=>(
                          <div key={s.name} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                            <div style={{width:8,height:8,borderRadius:2,background:RAMP[i],flexShrink:0}}/>
                            <span style={{fontSize:10,color:T.sub,flex:1}}>{s.name}</span>
                            <span style={{fontSize:10,color:T.text,fontWeight:500}}>{((s.val/totalAlloc)*100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stock P&L bars */}
                {(subNav==="Overview"||subNav==="Performance")&&(
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                    <div style={{fontSize:13,fontWeight:500,color:T.text,marginBottom:10}}>📊 Stock Returns (%)</div>
                    <BarChart data={bought.map(s=>({name:s.ticker,val:+PCT(s.buyPrice,s.currentPrice)}))} height={100}/>
                    <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap"}}>
                      {bought.map(s=>{const p=+PCT(s.buyPrice,s.currentPrice);return(
                        <div key={s.id} style={{fontSize:10}}>
                          <span style={{color:T.sub}}>{s.ticker} </span>
                          <span style={{color:p>=0?T.success:T.danger}}>{p>=0?"+":""}{p}%</span>
                        </div>
                      );})}
                    </div>
                  </div>
                )}

                {/* Exchange distribution pie */}
                {(subNav==="Overview"||subNav==="Allocation")&&(
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                    <div style={{fontSize:13,fontWeight:500,color:T.text,marginBottom:12}}>🌐 Exchange Mix</div>
                    {EXCHANGES.filter(ex=>bought.some(s=>s.exchange===ex)).map((ex,i)=>{
                      const cnt=bought.filter(s=>s.exchange===ex).length;
                      return(
                        <div key={ex} style={{marginBottom:9}}>
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
                            <span style={{color:T.sub}}>{ex}</span><span style={{color:T.text}}>{cnt} stock{cnt>1?"s":""}</span>
                          </div>
                          <div style={{height:5,background:T.surface,borderRadius:4}}>
                            <div style={{height:"100%",width:`${(cnt/bought.length)*100}%`,background:RAMP[i],borderRadius:4,boxShadow:`0 0 6px ${RAMP[i]}55`}}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Activity */}
            {(subNav==="Overview"||subNav==="Activity")&&(
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontSize:13,fontWeight:500,color:T.text,marginBottom:12}}>🕐 Recent Holdings</div>
                {bought.map(s=>{
                  const pl=(s.currentPrice-s.buyPrice)*s.qty;
                  return(
                    <div key={s.id} onClick={()=>setSelectedStock(GLOBAL_STOCKS.find(g=>g.ticker===s.ticker)||{...s,mktCap:"—",pe:"—",eps:"—",vol:"—",high52:s.currentPrice*1.1,low52:s.buyPrice*0.9,desc:"A stock in your portfolio.",change:+PCT(s.buyPrice,s.currentPrice)})}
                      style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}44`,cursor:"pointer",transition:"background .15s",borderRadius:6}}
                      onMouseEnter={e=>e.currentTarget.style.background=T.surface}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{display:"flex",gap:10,alignItems:"center"}}>
                        <div style={{width:34,height:34,borderRadius:9,background:T.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,color:T.accent}}>{s.ticker.slice(0,4)}</div>
                        <div>
                          <div style={{fontSize:12,fontWeight:500,color:T.text}}>{s.ticker}</div>
                          <div style={{fontSize:10,color:T.sub}}>{s.exchange} · {s.date}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:14,alignItems:"center"}}>
                        <Spark data={sparkData(s)} color={pl>=0?T.success:T.danger}/>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:12,fontWeight:500}}>{INR(s.currentPrice)}</div>
                          <div style={{fontSize:10,color:pl>=0?T.success:T.danger}}>{pl>=0?"+":""}{INR(pl)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ MARKET ══ */}
        {nav==="market"&&(
          <div>
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
              <div style={{position:"relative",flex:1,minWidth:160}}>
                <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:13}}>🔍</span>
                <input placeholder="Search ticker or company..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,paddingLeft:30}}/>
              </div>
              <select value={sectorF} onChange={e=>setSectorF(e.target.value)} style={{...inp,width:"auto"}}>
                <option>All</option>{SECTORS.map(s=><option key={s}>{s}</option>)}
              </select>
              <select value={exF} onChange={e=>setExF(e.target.value)} style={{...inp,width:"auto"}}>
                <option>All</option>{EXCHANGES.map(e=><option key={e}>{e}</option>)}
              </select>
            </div>
            <div style={{fontSize:11,color:T.sub,marginBottom:10}}>{sortedMarket.length} stocks · click any row for full details</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{borderBottom:`1px solid ${T.border}`}}>
                    {["#","Ticker","Company","Exchange","Sector","Price (₹)","Change","Action"].map(h=>(
                      <th key={h} style={{padding:"8px 10px",textAlign:"left",color:T.sub,fontWeight:500,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedMarket.map((s,i)=>(
                    <tr key={s.ticker+i} style={{borderBottom:`1px solid ${T.border}22`,cursor:"pointer",transition:"background .13s"}}
                      onClick={()=>setSelectedStock(s)}
                      onMouseEnter={e=>e.currentTarget.style.background=T.surface}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"9px 10px",color:T.muted}}>{i+1}</td>
                      <td style={{padding:"9px 10px",fontWeight:500,color:T.accent2}}>{s.ticker}</td>
                      <td style={{padding:"9px 10px",color:T.text}}>{s.name}</td>
                      <td style={{padding:"9px 10px",color:T.sub}}>{s.exchange}</td>
                      <td style={{padding:"9px 10px",color:T.sub}}>{s.sector}</td>
                      <td style={{padding:"9px 10px",fontWeight:500}}>{INR(s.price)}</td>
                      <td style={{padding:"9px 10px"}}>
                        <span style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:s.change>=0?T.success+"22":T.danger+"22",color:s.change>=0?T.success:T.danger}}>{s.change>=0?"▲":"▼"}{Math.abs(s.change)}%</span>
                      </td>
                      <td style={{padding:"9px 10px"}} onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>prefillWish(s)} style={{...btnS(T.orange+"22",T.orange,T.orange+"44"),padding:"3px 8px",fontSize:10}}>♥</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ BOUGHT / PORTFOLIO ══ */}
        {nav==="bought"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontWeight:500,fontSize:15}}>{subNav}</div>
              <button onClick={()=>{setBForm({ticker:"",name:"",exchange:"NSE",sector:"Technology",qty:"",buyPrice:"",currentPrice:"",date:""});setAddBoughtModal(true);}} style={{...btnS(T.accent+"33",T.accent,T.accent+"55")}}>
                ＋ Add Stock
              </button>
            </div>

            {(subNav==="Holdings"||subNav==="P&L View")&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(268px,1fr))",gap:14}}>
                {bought.map(s=>{
                  const pl=(s.currentPrice-s.buyPrice)*s.qty;
                  const p=PCT(s.buyPrice,s.currentPrice);
                  return(
                    <div key={s.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18,cursor:"pointer",transition:"transform .2s,box-shadow .2s"}}
                      onClick={()=>setSelectedStock(GLOBAL_STOCKS.find(g=>g.ticker===s.ticker)||{...s,mktCap:"—",pe:"—",eps:"—",vol:"—",high52:s.currentPrice*1.1,low52:s.buyPrice*0.9,desc:"Portfolio stock.",change:+PCT(s.buyPrice,s.currentPrice)})}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 26px ${pl>=0?T.tealGlow:T.danger+"22"}`;}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <div style={{width:38,height:38,borderRadius:10,background:T.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,color:T.accent}}>{s.ticker.slice(0,4)}</div>
                          <div><div style={{fontSize:13,fontWeight:500,color:T.text}}>{s.ticker}</div><div style={{fontSize:10,color:T.sub}}>{s.name}</div></div>
                        </div>
                        <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>openEditBought(s)} style={{background:"none",border:"none",cursor:"pointer",color:T.accent,fontSize:15}}>✎</button>
                          <button onClick={()=>deleteBought(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:T.danger,fontSize:15}}>🗑</button>
                        </div>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <div><div style={{fontSize:10,color:T.sub}}>Bought</div><div style={{fontSize:12}}>{INR(s.buyPrice)}</div></div>
                        <div><div style={{fontSize:10,color:T.sub}}>Current</div><div style={{fontSize:12,fontWeight:500}}>{INR(s.currentPrice)}</div></div>
                        <div><div style={{fontSize:10,color:T.sub}}>Qty</div><div style={{fontSize:12}}>{s.qty}</div></div>
                      </div>
                      <Spark data={sparkData(s)} color={pl>=0?T.success:T.danger}/>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,padding:"8px 10px",background:pl>=0?T.success+"11":T.danger+"11",borderRadius:9,border:`1px solid ${pl>=0?T.success+"33":T.danger+"33"}`}}>
                        <span style={{fontSize:10,color:T.sub}}>P&L</span>
                        <span style={{fontSize:13,fontWeight:500,color:pl>=0?T.success:T.danger}}>{pl>=0?"+":""}{INR(pl)} ({p}%)</span>
                      </div>
                      <div style={{marginTop:8,display:"flex",gap:5,flexWrap:"wrap"}}>
                        {[s.exchange,s.sector,s.date].map(t=><span key={t} style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:T.pill,color:T.sub}}>{t}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {subNav==="Summary"&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                  <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>📊 Return Distribution</div>
                  <BarChart data={bought.map(s=>({name:s.ticker,val:+PCT(s.buyPrice,s.currentPrice)}))} height={110}/>
                </div>
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                  <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>🥧 Sector Split</div>
                  <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                    <PieChart data={sectorAlloc} size={130}/>
                    <div>{sectorAlloc.map((s,i)=><div key={s.name} style={{display:"flex",gap:6,alignItems:"center",marginBottom:5}}><div style={{width:7,height:7,borderRadius:2,background:RAMP[i]}}/><span style={{fontSize:10,color:T.sub}}>{s.name}</span><span style={{fontSize:10,color:T.text,marginLeft:"auto"}}>{((s.val/totalAlloc)*100).toFixed(0)}%</span></div>)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ WISHLIST ══ */}
        {nav==="wishlist"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontWeight:500,fontSize:15}}>{subNav}</div>
              <button onClick={()=>{setWForm({ticker:"",name:"",exchange:"NSE",sector:"Technology",targetPrice:"",currentPrice:"",note:""});setAddWishModal(true);}} style={{...btnS(T.orange+"33",T.orange,T.orange+"55")}}>
                ♥ Add Stock
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(258px,1fr))",gap:14}}>
              {wishlist.map(s=>{
                const reached=s.currentPrice<=s.targetPrice;
                return(
                  <div key={s.id} style={{background:T.card,border:`1px solid ${reached?T.success+"55":T.border}`,borderRadius:14,padding:18,cursor:"pointer",transition:"transform .2s"}}
                    onClick={()=>setSelectedStock(GLOBAL_STOCKS.find(g=>g.ticker===s.ticker)||{...s,price:s.currentPrice,change:0,mktCap:"—",pe:"—",eps:"—",vol:"—",high52:s.currentPrice*1.1,low52:s.targetPrice*0.9,desc:"Watchlist stock."})}
                    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                    onMouseLeave={e=>e.currentTarget.style.transform=""}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <div style={{width:36,height:36,borderRadius:9,background:T.orange+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,color:T.orange}}>{s.ticker.slice(0,4)}</div>
                        <div><div style={{fontSize:13,fontWeight:500}}>{s.ticker}</div><div style={{fontSize:10,color:T.sub}}>{s.name}</div></div>
                      </div>
                      <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>openEditWish(s)} style={{background:"none",border:"none",cursor:"pointer",color:T.accent,fontSize:15}}>✎</button>
                        <button onClick={()=>deleteWish(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:T.danger,fontSize:15}}>🗑</button>
                      </div>
                    </div>
                    {reached&&<div style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:T.success+"22",color:T.success,display:"inline-flex",gap:4,marginBottom:8}}>✓ Target Reached!</div>}
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div><div style={{fontSize:10,color:T.sub}}>Current</div><div style={{fontSize:13,fontWeight:500}}>{INR(s.currentPrice)}</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:10,color:T.sub}}>Target</div><div style={{fontSize:13,color:T.gold}}>{INR(s.targetPrice)}</div></div>
                    </div>
                    <div style={{height:4,background:T.surface,borderRadius:4,marginBottom:8,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min((s.targetPrice/s.currentPrice)*100,100)}%`,background:`linear-gradient(90deg,${T.accent},${T.teal})`,borderRadius:4,transition:"width .8s ease"}}/>
                    </div>
                    {s.note&&<div style={{fontSize:10,color:T.sub,fontStyle:"italic",marginBottom:6}}>📝 {s.note}</div>}
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{[s.exchange,s.sector].map(t=><span key={t} style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:T.pill,color:T.sub}}>{t}</span>)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ CLASSIFY ══ */}
        {nav==="classify"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
              {[{l:"Bullish",c:T.success,d:bullish.length,i:"🟢"},{l:"Bearish",c:T.danger,d:bearish.length,i:"🔴"},{l:"Neutral",c:T.warn,d:neutral.length,i:"🟡"}].map(x=>(
                <div key={x.l} style={{background:T.card,border:`1px solid ${classifyFilter===x.l?x.c+"66":T.border}`,borderRadius:12,padding:"12px 16px",cursor:"pointer",transition:"all .2s"}}
                  onClick={()=>{setClassifyFilter(x.l);setSubNav(x.l);}}>
                  <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:16}}>{x.i}</span>
                    <span style={{fontSize:12,fontWeight:500,color:x.c}}>{x.l}</span>
                  </div>
                  <div style={{fontSize:22,fontWeight:500,color:x.c}}>{x.d}</div>
                  <div style={{fontSize:10,color:T.sub}}>stocks</div>
                </div>
              ))}
            </div>

            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18,marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>📊 Gainers vs Losers Distribution</div>
              <BarChart data={[...bullish.slice(0,6),...bearish.slice(0,5)].map(s=>({name:s.ticker,val:s.change}))} height={100}/>
            </div>

            <div style={{fontSize:12,color:T.sub,marginBottom:10}}>
              {classifyFilter==="Screener"?"All stocks by performance":classifyFilter==="Bullish"?`${bullish.length} bullish stocks (change > +1%)`:classifyFilter==="Bearish"?`${bearish.length} bearish stocks (change < -0.5%)`:`${neutral.length} neutral stocks`}
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{borderBottom:`1px solid ${T.border}`}}>
                    {["Ticker","Company","Exchange","Price","Change","Signal",""].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",color:T.sub,fontWeight:500}}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(classData[classifyFilter]||[]).map((s,i)=>{
                    const sig=s.change>2?"Strong Buy":s.change>0.5?"Buy":s.change>-0.5?"Hold":s.change>-2?"Sell":"Strong Sell";
                    const sigCol=sig.includes("Buy")?T.success:sig==="Hold"?T.warn:T.danger;
                    return(
                      <tr key={s.ticker+i} style={{borderBottom:`1px solid ${T.border}22`,cursor:"pointer",transition:"background .13s"}}
                        onClick={()=>setSelectedStock(s)}
                        onMouseEnter={e=>e.currentTarget.style.background=T.surface}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"9px 10px",fontWeight:500,color:T.accent2}}>{s.ticker}</td>
                        <td style={{padding:"9px 10px",color:T.text}}>{s.name}</td>
                        <td style={{padding:"9px 10px",color:T.sub}}>{s.exchange}</td>
                        <td style={{padding:"9px 10px",fontWeight:500}}>{INR(s.price)}</td>
                        <td style={{padding:"9px 10px"}}>
                          <span style={{color:s.change>=0?T.success:T.danger}}>{s.change>=0?"▲":"▼"}{Math.abs(s.change)}%</span>
                        </td>
                        <td style={{padding:"9px 10px"}}>
                          <span style={{fontSize:10,padding:"2px 9px",borderRadius:20,background:sigCol+"22",color:sigCol,border:`1px solid ${sigCol}44`}}>{sig}</span>
                        </td>
                        <td style={{padding:"9px 10px"}} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>prefillBought(s)} style={{...btnS(T.accent+"22",T.accent,T.accent+"44"),padding:"3px 8px",fontSize:10}}>Buy</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ AI INSIGHTS ══ */}
        {nav==="insights"&&(
          <div>
            <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>🧠 AI Financial Insights</div>
            <div style={{fontSize:11,color:T.sub,marginBottom:16}}>Click "Get Insight" for Claude AI analysis — revenue forecast, risk assessment, and Indian market context.</div>
            {bought.map(s=>{
              const pl=(s.currentPrice-s.buyPrice)*s.qty;
              const p=PCT(s.buyPrice,s.currentPrice);
              return(
                <div key={s.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <div style={{width:40,height:40,borderRadius:10,background:T.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,color:T.accent}}>{s.ticker.slice(0,4)}</div>
                      <div><div style={{fontWeight:500,color:T.text}}>{s.ticker} — {s.name}</div><div style={{fontSize:11,color:T.sub}}>{s.exchange} · {s.sector}</div></div>
                    </div>
                    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{fontSize:12,color:pl>=0?T.success:T.danger,fontWeight:500}}>{pl>=0?"+":""}{INR(pl)} ({p}%)</span>
                      <button onClick={()=>getInsight(s)} disabled={loadingInsight[s.id]} style={{...btnS(T.accent+"33",T.accent,T.accent+"55"),fontSize:11}}>
                        <span style={{display:"inline-block",animation:loadingInsight[s.id]?"spin 1s linear infinite":""}}>{loadingInsight[s.id]?"⟳":"✦"}</span>
                        {loadingInsight[s.id]?"Analyzing...":"Get Insight"}
                      </button>
                    </div>
                  </div>
                  {aiInsight[s.id]&&(
                    <div style={{marginTop:12,padding:14,background:T.surface,borderRadius:10,fontSize:12,lineHeight:1.8,whiteSpace:"pre-line",color:T.text,borderLeft:`3px solid ${T.accent}`}}>
                      <div style={{fontSize:11,color:T.accent,fontWeight:500,marginBottom:6}}>🧠 Claude AI · Indian Market Analysis</div>
                      {aiInsight[s.id]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ STATS ══ */}
        {nav==="stats"&&(
          <div>
            <div style={{fontSize:13,fontWeight:500,marginBottom:16}}>📈 Portfolio Statistics</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:12,marginBottom:18}}>
              {[
                {l:"Best Performer",v:()=>{const s=bought.reduce((a,b)=>+PCT(b.buyPrice,b.currentPrice)>+PCT(a.buyPrice,a.currentPrice)?b:a);return`${s.ticker} (+${PCT(s.buyPrice,s.currentPrice)}%)`;},c:T.success},
                {l:"Worst Performer",v:()=>{const s=bought.reduce((a,b)=>+PCT(b.buyPrice,b.currentPrice)<+PCT(a.buyPrice,a.currentPrice)?b:a);return`${s.ticker} (${PCT(s.buyPrice,s.currentPrice)}%)`;},c:T.danger},
                {l:"Avg Return",v:()=>`${(bought.reduce((a,s)=>a+((s.currentPrice-s.buyPrice)/s.buyPrice*100),0)/bought.length).toFixed(2)}%`,c:T.accent2},
                {l:"Win Rate",v:()=>`${((bought.filter(s=>s.currentPrice>s.buyPrice).length/bought.length)*100).toFixed(0)}%`,c:T.success},
                {l:"Watchlist Items",v:()=>wishlist.length,c:T.orange},
                {l:"Total Stocks",v:()=>bought.length,c:T.text},
              ].map((c,i)=>(
                <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"13px 15px"}}>
                  <div style={{fontSize:10,color:T.sub,marginBottom:5}}>{c.l}</div>
                  <div style={{fontSize:15,fontWeight:500,color:c.c}}>{c.v()}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginBottom:14}}>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>📊 Return Bars</div>
                <BarChart data={bought.map(s=>({name:s.ticker,val:+PCT(s.buyPrice,s.currentPrice)}))} height={110}/>
              </div>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
                <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>🥧 Allocation</div>
                <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                  <PieChart data={sectorAlloc} size={130}/>
                  <div style={{flex:1}}>{sectorAlloc.map((s,i)=>(
                    <div key={s.name} style={{display:"flex",gap:5,alignItems:"center",marginBottom:5}}>
                      <div style={{width:7,height:7,borderRadius:2,background:RAMP[i]}}/>
                      <span style={{fontSize:10,color:T.sub}}>{s.name}</span>
                      <span style={{fontSize:10,color:T.text,marginLeft:"auto"}}>{((s.val/totalAlloc)*100).toFixed(0)}%</span>
                    </div>
                  ))}</div>
                </div>
              </div>
            </div>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>🏦 Individual Performance</div>
              {bought.map(s=>{
                const p=+PCT(s.buyPrice,s.currentPrice);
                return(
                  <div key={s.id} style={{marginBottom:13}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                      <span style={{color:T.text,fontWeight:500}}>{s.ticker} <span style={{color:T.sub,fontWeight:400,fontSize:11}}>{s.name}</span></span>
                      <span style={{color:p>=0?T.success:T.danger,fontWeight:500}}>{p>=0?"+":""}{p}% · {INR((s.currentPrice-s.buyPrice)*s.qty)}</span>
                    </div>
                    <div style={{height:5,background:T.surface,borderRadius:4}}>
                      <div style={{height:"100%",width:`${Math.min(Math.abs(p)*3,100)}%`,background:p>=0?T.success:T.danger,borderRadius:4,boxShadow:`0 0 8px ${p>=0?T.success:T.danger}66`}}/>
                    </div>
                    <div style={{display:"flex",gap:12,marginTop:3,fontSize:10,color:T.sub}}>
                      <span>Bought: {INR(s.buyPrice)}</span><span>Now: {INR(s.currentPrice)}</span><span>Qty: {s.qty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── STOCK DETAIL MODAL ── */}
      {selectedStock&&(
        <StockDetail stock={selectedStock} onClose={()=>setSelectedStock(null)} onAddWish={prefillWish} onAddBought={prefillBought}/>
      )}

      {/* ── BOUGHT FORM MODAL ── */}
      {(addBoughtModal||editBought)&&(
        <Modal title={editBought?"✎ Edit Stock":"＋ Add Bought Stock"} onClose={()=>{setAddBoughtModal(false);setEditBought(null);}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["ticker","Ticker"],["name","Company Name"],["buyPrice","Buy Price (₹)"],["currentPrice","Current Price (₹)"],["qty","Quantity"],["date","Purchase Date"]].map(([f,l])=>(
              <div key={f} style={{gridColumn:f==="name"?"1 / -1":"auto"}}>
                <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:4}}>{l}</label>
                <input type={f==="date"?"date":f==="qty"||f.includes("Price")?"number":"text"} placeholder={l} value={bForm[f]} onChange={e=>setBForm(p=>({...p,[f]:e.target.value}))} style={{...inp}}/>
              </div>
            ))}
            {[["exchange","Exchange",EXCHANGES],["sector","Sector",SECTORS]].map(([f,l,opts])=>(
              <div key={f}>
                <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:4}}>{l}</label>
                <select value={bForm[f]} onChange={e=>setBForm(p=>({...p,[f]:e.target.value}))} style={{...inp}}>
                  {opts.map(x=><option key={x}>{x}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,marginTop:18}}>
            <button onClick={()=>saveBought(bForm,editBought)} style={{...btnS(T.accent+"33",T.accent,T.accent+"55"),flex:1,justifyContent:"center"}}>
              {editBought?"✓ Save Changes":"＋ Add Stock"}
            </button>
            <button onClick={()=>{setAddBoughtModal(false);setEditBought(null);}} style={{...btnS("transparent",T.sub,T.border)}}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* ── WISHLIST FORM MODAL ── */}
      {(addWishModal||editWish)&&(
        <Modal title={editWish?"✎ Edit Wishlist":"♥ Add to Wishlist"} onClose={()=>{setAddWishModal(false);setEditWish(null);}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["ticker","Ticker"],["name","Company Name"],["currentPrice","Current Price (₹)"],["targetPrice","Target Price (₹)"]].map(([f,l])=>(
              <div key={f} style={{gridColumn:f==="name"?"1 / -1":"auto"}}>
                <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:4}}>{l}</label>
                <input type={f.includes("Price")?"number":"text"} placeholder={l} value={wForm[f]} onChange={e=>setWForm(p=>({...p,[f]:e.target.value}))} style={{...inp}}/>
              </div>
            ))}
            {[["exchange","Exchange",EXCHANGES],["sector","Sector",SECTORS]].map(([f,l,opts])=>(
              <div key={f}>
                <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:4}}>{l}</label>
                <select value={wForm[f]} onChange={e=>setWForm(p=>({...p,[f]:e.target.value}))} style={{...inp}}>
                  {opts.map(x=><option key={x}>{x}</option>)}
                </select>
              </div>
            ))}
            <div style={{gridColumn:"1 / -1"}}>
              <label style={{fontSize:11,color:T.sub,display:"block",marginBottom:4}}>Note (optional)</label>
              <input placeholder="e.g. Buy on dip" value={wForm.note} onChange={e=>setWForm(p=>({...p,note:e.target.value}))} style={{...inp}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:18}}>
            <button onClick={()=>saveWish(wForm,editWish)} style={{...btnS(T.orange+"33",T.orange,T.orange+"55"),flex:1,justifyContent:"center"}}>
              {editWish?"✓ Save":"♥ Add to Wishlist"}
            </button>
            <button onClick={()=>{setAddWishModal(false);setEditWish(null);}} style={{...btnS("transparent",T.sub,T.border)}}>Cancel</button>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}
        input::placeholder{color:${T.sub}77}
        select option{background:${T.card};color:${T.text}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:${T.muted};border-radius:2px}
      `}</style>
    </div>
  );
}
