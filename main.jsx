import React, { useState, useMemo, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import {
  Users, Dumbbell, TrendingUp, CalendarDays, Search, ChevronLeft, Plus, Check,
  Star, Sparkles, X, ChevronDown, ChevronUp, RefreshCw, Calendar,
  Mail, FileText, Play, BarChart2, Edit3, Lock, LogOut, Shield,
  ChevronRight, Wifi, WifiOff,
} from "lucide-react";

// ── Palette ───────────────────────────────────────────────────────────────────
const PLATE = {
  red: "#C8102E", blue: "#0057B7", yellow: "#E8A100",
  green: "#1B7F4D", ink: "#171A1F", chalk: "#F5F4F0",
  purple: "#7C3AED",
};
const MUSCLE_COLORS = {
  Legs: PLATE.red, Back: PLATE.blue, Chest: PLATE.yellow,
  Shoulders: PLATE.green, Core: "#6B7280", "Full body": PLATE.ink,
};
const PATTERN_COLORS = {
  Push: "#7C3AED", Pull: "#0891B2", Hinge: "#B45309",
  Squat: "#DC2626", Carry: "#059669", Core: "#6B7280",
};
const AVATAR_COLORS = [
  PLATE.red, PLATE.blue, PLATE.yellow, PLATE.green,
  "#7C3AED", "#0891B2", "#B45309", "#DC2626",
  "#059669", "#6B7280", "#9333EA", "#0369A1",
];

// ── Clients ───────────────────────────────────────────────────────────────────
const CLIENTS = [
  { id:1,  name:"Kumar",     goal:"Strength",       note:"Deadlift-focused. Eyeing a 160 kg pull by Q3.",          email:"kumar@email.com",    pin:"1111" },
  { id:2,  name:"Joy",       goal:"Fat loss",        note:"High energy. Responds well to circuit-style finishers.", email:"joy@email.com",      pin:"2222" },
  { id:3,  name:"Christian", goal:"Muscle gain",     note:"Intermediate lifter. Focus on progressive overload.",    email:"christian@email.com",pin:"3333" },
  { id:4,  name:"Ruoqing",   goal:"Recomposition",   note:"Prefers morning sessions. Strong lower body.",           email:"ruoqing@email.com",  pin:"4444" },
  { id:5,  name:"Yvonne",    goal:"General fitness", note:"Prefers Peak360 venue. Consistent attendance.",          email:"yvonne@email.com",   pin:"5555" },
  { id:6,  name:"Jack",      goal:"Strength",        note:"Competitive mindset. Track PRs each session.",           email:"jack@email.com",     pin:"6666" },
  { id:7,  name:"Rajit",     goal:"General fitness", note:"Busy schedule — sessions must start and end on time.",   email:"rajit@email.com",    pin:"7777" },
  { id:8,  name:"Wan Ping",  goal:"Fat loss",        note:"Low impact preferred. Check in on knee comfort.",        email:"wanping@email.com",  pin:"8888" },
  { id:9,  name:"Jing Wen",  goal:"Fat loss",        note:"Knee niggle — avoid deep lunges.",                       email:"jingwen@email.com",  pin:"9999" },
  { id:10, name:"Yew Tuan",  goal:"Muscle gain",     note:"New client. Assess baseline strength in first 2 sessions.", email:"yewtuan@email.com", pin:"1010" },
  { id:11, name:"Ben",       goal:"Muscle gain",     note:"Prefers evening sessions. Responds well to volume work.", email:"ben@email.com",      pin:"1100" },
  { id:12, name:"Joann",     goal:"General fitness", note:"Jing Wen's mother. Gentle approach, mobility focus.",    email:"joann@email.com",    pin:"1212" },
];
const TRAINER_PIN = "0000";

// ── Exercises ─────────────────────────────────────────────────────────────────
const BASE_EXERCISES = [
  { name:"Barbell Back Squat",    group:"Legs",      pattern:"Squat", equipment:"Barbell",    bilateral:true,  difficulty:"Intermediate", cues:"Brace before descent. Hip crease below knee. Drive knees out." },
  { name:"Conventional Deadlift", group:"Full body", pattern:"Hinge", equipment:"Barbell",    bilateral:true,  difficulty:"Intermediate", cues:"Bar over midfoot. Take the slack. Push the floor away." },
  { name:"Romanian Deadlift",     group:"Legs",      pattern:"Hinge", equipment:"Barbell",    bilateral:true,  difficulty:"Beginner",     cues:"Soft knees, hinge at hips. Bar close. Stop at hamstring stretch." },
  { name:"Bench Press",           group:"Chest",     pattern:"Push",  equipment:"Barbell",    bilateral:true,  difficulty:"Intermediate", cues:"Blades pinned. Touch lower chest. Leg drive." },
  { name:"Overhead Press",        group:"Shoulders", pattern:"Push",  equipment:"Barbell",    bilateral:true,  difficulty:"Intermediate", cues:"Glutes tight, ribs down. Bar straight up." },
  { name:"Pull-Up",               group:"Back",      pattern:"Pull",  equipment:"Bodyweight", bilateral:true,  difficulty:"Intermediate", cues:"Full hang. Chest to bar. Control descent." },
  { name:"Barbell Row",           group:"Back",      pattern:"Pull",  equipment:"Barbell",    bilateral:true,  difficulty:"Intermediate", cues:"Torso near parallel. Pull to lower ribs. No bounce." },
  { name:"Bulgarian Split Squat", group:"Legs",      pattern:"Squat", equipment:"Dumbbell",   bilateral:false, difficulty:"Intermediate", cues:"Front foot forward. Drop straight down. Drive through heel." },
  { name:"Dumbbell Lateral Raise",group:"Shoulders", pattern:"Push",  equipment:"Dumbbell",   bilateral:true,  difficulty:"Beginner",     cues:"Slight lean. Lead with elbows. Stop at shoulder height." },
  { name:"Plank",                 group:"Core",      pattern:"Core",  equipment:"Bodyweight", bilateral:true,  difficulty:"Beginner",     cues:"Glutes squeezed. Push floor away through forearms." },
  { name:"Hip Thrust",            group:"Legs",      pattern:"Hinge", equipment:"Barbell",    bilateral:true,  difficulty:"Beginner",     cues:"Chin tucked. Full lockout. Squeeze 1 s at top." },
  { name:"Lat Pulldown",          group:"Back",      pattern:"Pull",  equipment:"Machine",    bilateral:true,  difficulty:"Beginner",     cues:"Elbows to back pockets. Slight lean back." },
  { name:"Goblet Squat",          group:"Legs",      pattern:"Squat", equipment:"Kettlebell", bilateral:true,  difficulty:"Beginner",     cues:"Elbows inside knees. Great for teaching depth." },
  { name:"Farmer's Carry",        group:"Full body", pattern:"Carry", equipment:"Dumbbell",   bilateral:true,  difficulty:"Beginner",     cues:"Tall posture. Ribs over hips. Short quick steps." },
];

// ── Schedule seed (June 2025 week + slots for July/Aug) ───────────────────────
function buildSchedule() {
  const schedule = {};
  // Week of June 15-21
  const june = {
    "2025-06-15":[{time:"6:30 PM",status:"booked",client:"Yvonne"},{time:"7:30 PM",status:"booked",client:"Ben"},{time:"8:30 PM",status:"open"}],
    "2025-06-16":[{time:"6:30 PM",status:"open"},{time:"7:30 PM",status:"open"},{time:"8:30 PM",status:"blocked"}],
    "2025-06-17":[{time:"6:30 PM",status:"booked",client:"Yvonne"},{time:"7:30 PM",status:"open"},{time:"8:30 PM",status:"open"}],
    "2025-06-18":[{time:"6:30 PM",status:"open"},{time:"7:30 PM",status:"booked",client:"Kumar"},{time:"8:30 PM",status:"open"}],
    "2025-06-19":[{time:"6:30 PM",status:"blocked"},{time:"7:30 PM",status:"open"},{time:"8:30 PM",status:"open"}],
    "2025-06-20":[{time:"9:00 AM",status:"booked",client:"Jing Wen"},{time:"10:00 AM",status:"open"},{time:"11:00 AM",status:"booked",client:"Joann"},{time:"2:00 PM",status:"open"},{time:"3:00 PM",status:"open"}],
    "2025-06-21":[{time:"9:00 AM",status:"open"},{time:"10:00 AM",status:"booked",client:"Kumar"},{time:"11:00 AM",status:"open"}],
  };
  Object.assign(schedule, june);

  // Generate July & August with scattered open slots
  const slotTemplates = {
    1:[{time:"7:30 PM",status:"open"},{time:"8:30 PM",status:"open"}],
    2:[{time:"7:00 PM",status:"open"}],
    3:[{time:"6:30 PM",status:"open"},{time:"7:30 PM",status:"open"}],
    4:[{time:"7:30 PM",status:"open"},{time:"8:30 PM",status:"open"}],
    5:[{time:"7:00 PM",status:"open"}],
    6:[{time:"9:00 AM",status:"open"},{time:"10:00 AM",status:"open"},{time:"11:00 AM",status:"open"},{time:"2:00 PM",status:"open"}],
    0:[{time:"9:00 AM",status:"open"},{time:"10:00 AM",status:"open"},{time:"11:00 AM",status:"open"}],
  };
  for (let m=6; m<=7; m++) {
    const daysInMonth = m===6?30:31;
    for (let d=22; d<=daysInMonth; d++) {
      const key = `2025-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const dow = new Date(2025,m,d).getDay();
      if (slotTemplates[dow]) schedule[key] = slotTemplates[dow].map(s=>({...s}));
    }
  }
  for (let d=1; d<=31; d++) {
    const key = `2025-08-${String(d).padStart(2,"0")}`;
    const dow = new Date(2025,7,d).getDay();
    if (slotTemplates[dow]) schedule[key] = slotTemplates[dow].map(s=>({...s}));
  }
  return schedule;
}
const INITIAL_SCHEDULE = buildSchedule();

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (dateStr) => {
  const [y,m,d] = dateStr.split("-").map(Number);
  return new Date(y,m-1,d);
};
const isoDate = (date) => {
  const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,"0"), d=String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
};
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function buildGCalUrl(dateStr, time, clientName) {
  const date = dateStr.replace(/-/g,"");
  const [t,period] = time.split(" ");
  let [h,mn] = t.split(":").map(Number);
  if (period==="PM"&&h!==12) h+=12;
  if (period==="AM"&&h===12) h=0;
  const pad = n=>String(n).padStart(2,"0");
  const start=`${date}T${pad(h)}${pad(mn)}00`;
  const end=`${date}T${pad(h+1)}${pad(mn)}00`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`PT Session – ${clientName}`)}&dates=${start}/${end}&details=${encodeURIComponent("Personal training session with Coach Sam")}`;
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
const Avatar = ({ client, size=10 }) => (
  <div className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
    style={{ backgroundColor: AVATAR_COLORS[(client.id-1)%AVATAR_COLORS.length], fontSize: size>8?"14px":"11px", width:`${size*4}px`, height:`${size*4}px` }}>
    {client.name.charAt(0)}
  </div>
);
const GroupTag = ({ group }) => (
  <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor:MUSCLE_COLORS[group]||"#6B7280" }}>{group}</span>
);
const PatternTag = ({ pattern }) => (
  <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor:PATTERN_COLORS[pattern]||"#6B7280" }}>{pattern}</span>
);
const DiffBadge = ({ level }) => {
  const c={Beginner:"#059669",Intermediate:"#D97706",Advanced:"#DC2626"};
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ color:c[level],borderColor:c[level] }}>{level}</span>;
};
const SectionTitle = ({ children }) => (
  <h2 className="text-xl font-bold tracking-tight mb-3" style={{ color:PLATE.ink }}>{children}</h2>
);

// ── AI helpers ────────────────────────────────────────────────────────────────
async function callClaude(prompt, system="") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "claude-sonnet-4-6", max_tokens: 1000,
        ...(system ? { system } : {}),
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const d = await res.json();
    return d.content.map(i => i.text || "").join("");
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchAIEnrichment(name) {
  const raw = await callClaude(
    `For the exercise "${name}", respond ONLY with valid JSON (no markdown, no backticks) in this exact shape:
{"primaryMuscles":[],"secondaryMuscles":[],"repRanges":{"strength":"","hypertrophy":"","endurance":""},"scienceTip":"","contraindications":"","progression":"","regression":""}`
  );
  // Robust parse: strip any accidental markdown fences
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Attempt to extract JSON from response
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse AI response");
  }
}

async function generateProgressReport(client, sessionLogs) {
  const sessions = sessionLogs[client.id] || [];
  // Use all sessions but label recent ones clearly
  const recent = sessions.slice(-6).reverse();
  const sessionSummary = recent.length
    ? recent.map(s => `${s.date}: ${s.exercises.map(e => `${e.name} – ${e.sets.map(st => `${st.reps}×${st.weight}kg`).join(", ")}`).join("; ")}`).join("\n")
    : "No sessions logged yet — write an encouraging onboarding-style report based on their goal.";
  const prompt = `You are a personal trainer writing a bi-weekly progress report.
Client: ${client.name}, Goal: ${client.goal}
Total sessions logged: ${sessions.length}
Trainer note: ${client.note}
Recent session logs:
${sessionSummary}

Write a warm, professional bi-weekly progress report in flowing prose (under 220 words, plain text only, no markdown, no bullet points, no headers):
Cover: brief overall summary, training highlights or observations, two specific focus areas for the next 2 weeks, and a motivational closing line. 
If no sessions are logged yet, write an encouraging welcome report focused on their goal and what to expect.`;
  return callClaude(prompt, "You are a professional personal trainer writing concise, evidence-informed, motivating progress reports in plain prose.");
}

// ── Network Status Hook ───────────────────────────────────────────────────────
function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  React.useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return online;
}

// ── PIN Login Screen ──────────────────────────────────────────────────────────
function PinLogin({ onLogin }) {
  const [selected, setSelected] = useState("trainer");
  const [pin, setPin]           = useState("");
  const [error, setError]       = useState("");

  const allOptions = [
    { id:"trainer", label:"Coach Sam", subtitle:"Trainer access", pin:TRAINER_PIN },
    ...CLIENTS.map(c=>({ id:`client-${c.id}`, label:c.name, subtitle:c.goal, pin:c.pin })),
  ];

  const handleLogin = () => {
    const opt = allOptions.find(o=>o.id===selected);
    if (!opt) return;
    if (pin===opt.pin) {
      setError("");
      if (selected==="trainer") onLogin({role:"trainer"});
      else {
        const client = CLIENTS.find(c=>`client-${c.id}`===selected);
        onLogin({role:"client", client});
      }
    } else {
      setError("Incorrect PIN. Try again.");
      setPin("");
    }
  };

  const handleKey = (k) => {
    if (k==="del") { setPin(p=>p.slice(0,-1)); setError(""); }
    else if (pin.length<4) { const np=pin+k; setPin(np); setError(""); if(np.length===4) setTimeout(()=>{ const opt=allOptions.find(o=>o.id===selected); if(opt&&np===opt.pin){setError("");if(selected==="trainer")onLogin({role:"trainer"});else{const cl=CLIENTS.find(c=>`client-${c.id}`===selected);onLogin({role:"client",client:cl});}}else{setError("Incorrect PIN.");setPin("");} },150); }
  };

  const sel = allOptions.find(o=>o.id===selected);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{backgroundColor:PLATE.ink}}>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{backgroundColor:PLATE.red}}>
            <Dumbbell size={32} color="white"/>
          </div>
          <h1 className="text-2xl font-extrabold text-white">FormForge PT</h1>
          <p className="text-sm text-white/60 mt-1">Select your profile to continue</p>
        </div>

        {/* Profile selector */}
        <div className="bg-white/10 rounded-2xl p-1 mb-6 max-h-48 overflow-y-auto">
          {allOptions.map(opt=>(
            <button key={opt.id} onClick={()=>{setSelected(opt.id);setPin("");setError("");}}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
              style={{backgroundColor:selected===opt.id?"white":"transparent"}}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{backgroundColor:opt.id==="trainer"?PLATE.red:AVATAR_COLORS[(allOptions.findIndex(o=>o.id===opt.id)-1+AVATAR_COLORS.length)%AVATAR_COLORS.length]}}>
                {opt.id==="trainer"?<Shield size={14}/>:opt.label.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{color:selected===opt.id?PLATE.ink:"white"}}>{opt.label}</p>
                <p className="text-xs truncate" style={{color:selected===opt.id?"#6B7280":"white/60"}}>{opt.subtitle}</p>
              </div>
              {selected===opt.id && <Check size={14} color={PLATE.green}/>}
            </button>
          ))}
        </div>

        {/* PIN display */}
        <div className="mb-4">
          <p className="text-center text-xs text-white/60 mb-3 uppercase tracking-widest">
            {sel?.label} PIN
          </p>
          <div className="flex justify-center gap-3 mb-2">
            {[0,1,2,3].map(i=>(
              <div key={i} className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold text-white"
                style={{borderColor:pin.length>i?PLATE.red:"rgba(255,255,255,0.3)",backgroundColor:pin.length>i?"rgba(200,16,46,0.2)":"transparent"}}>
                {pin.length>i?"●":""}
              </div>
            ))}
          </div>
          {error && <p className="text-center text-xs text-red-400 mt-2">{error}</p>}
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["1","2","3","4","5","6","7","8","9","","0","del"].map((k,i)=>(
            <button key={i} onClick={()=>k&&handleKey(k)} disabled={!k}
              className="h-14 rounded-2xl text-lg font-bold transition-all active:scale-95"
              style={{backgroundColor:k==="del"?"rgba(255,255,255,0.1)":k?"rgba(255,255,255,0.15)":"transparent",color:"white",opacity:k?1:0}}>
              {k==="del"?"⌫":k}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-white/40">Demo PINs — Trainer: 0000 · Clients: 1111–1212</p>
      </div>
    </div>
  );
}

// ── Session Logger ────────────────────────────────────────────────────────────
function SessionLoggerModal({ client, onSave, onClose }) {
  const [sessionExs, setSessionExs] = useState([]);
  const [search, setSearch]         = useState("");
  const [saved, setSaved]           = useState(false);
  const today = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"});

  const add = (ex) => { if(sessionExs.find(e=>e.name===ex.name)) return; setSessionExs(p=>[...p,{name:ex.name,sets:[{reps:"",weight:""}]}]); };
  const addSet = (n) => setSessionExs(p=>p.map(e=>e.name===n?{...e,sets:[...e.sets,{reps:"",weight:""}]}:e));
  const removeSet = (n,i) => setSessionExs(p=>p.map(e=>e.name===n?{...e,sets:e.sets.filter((_,j)=>j!==i)}:e));
  const updSet = (n,i,f,v) => setSessionExs(p=>p.map(e=>e.name===n?{...e,sets:e.sets.map((s,j)=>j===i?{...s,[f]:v}:s)}:e));
  const removeEx = (n) => setSessionExs(p=>p.filter(e=>e.name!==n));

  const handleSave = () => {
    if (!sessionExs.length) return;
    onSave(client.id,{id:`s${Date.now()}`,date:today,exercises:sessionExs.map(e=>({name:e.name,sets:e.sets.map(s=>({reps:Number(s.reps)||0,weight:Number(s.weight)||0}))}))});
    setSaved(true); setTimeout(onClose,1200);
  };

  const filtered = BASE_EXERCISES.filter(e=>e.name.toLowerCase().includes(search.toLowerCase()));
  const inp = "rounded-lg border border-gray-200 bg-gray-50 py-1 px-2 text-xs focus:outline-none text-center w-full";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-md flex flex-col" style={{height:"92vh"}}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div><p className="font-bold text-base" style={{color:PLATE.ink}}>Log session — {client.name}</p><p className="text-xs text-gray-400">{today}</p></div>
          <button onClick={onClose}><X size={20} color="#9CA3AF"/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {sessionExs.map(ex=>(
            <div key={ex.name} className="rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <p className="font-bold text-sm" style={{color:PLATE.ink}}>{ex.name}</p>
                <button onClick={()=>removeEx(ex.name)}><X size={14} color="#9CA3AF"/></button>
              </div>
              <div className="p-3 space-y-2">
                <div className="grid grid-cols-3 gap-1.5 mb-1">
                  {["SET","REPS","KG"].map(h=><p key={h} className="text-[10px] font-bold text-gray-400 text-center">{h}</p>)}
                </div>
                {ex.sets.map((s,i)=>(
                  <div key={i} className="grid grid-cols-3 gap-1.5 items-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-bold text-gray-400">{i+1}</span>
                      {ex.sets.length>1&&<button onClick={()=>removeSet(ex.name,i)}><X size={10} color="#D1D5DB"/></button>}
                    </div>
                    <input className={inp} type="number" placeholder="—" value={s.reps} onChange={ev=>updSet(ex.name,i,"reps",ev.target.value)}/>
                    <input className={inp} type="number" placeholder="—" value={s.weight} onChange={ev=>updSet(ex.name,i,"weight",ev.target.value)}/>
                  </div>
                ))}
                <button onClick={()=>addSet(ex.name)} className="w-full text-xs font-semibold py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-400 mt-1">+ add set</button>
              </div>
            </div>
          ))}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Add exercises</p>
            <div className="relative mb-2"><Search size={13} className="absolute left-3 top-2.5 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm focus:outline-none"/></div>
            {filtered.map(ex=>(
              <div key={ex.name} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div><p className="text-sm font-semibold" style={{color:PLATE.ink}}>{ex.name}</p><p className="text-xs text-gray-400">{ex.equipment}</p></div>
                <button onClick={()=>add(ex)} className="rounded-xl px-3 py-1 text-xs font-bold text-white" style={{backgroundColor:sessionExs.find(e=>e.name===ex.name)?PLATE.green:PLATE.ink}}>
                  {sessionExs.find(e=>e.name===ex.name)?<Check size={13}/>:<Plus size={13}/>}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-100">
          {saved
            ? <div className="w-full rounded-xl py-3 text-sm font-bold text-white text-center flex items-center justify-center gap-2" style={{backgroundColor:PLATE.green}}><Check size={16}/> Session saved!</div>
            : <button onClick={handleSave} disabled={!sessionExs.length} className="w-full rounded-xl py-3 text-sm font-bold text-white flex items-center justify-center gap-2" style={{backgroundColor:sessionExs.length?PLATE.red:"#9CA3AF"}}>
                <Play size={15}/> Save session ({sessionExs.length} exercises)
              </button>}
        </div>
      </div>
    </div>
  );
}

// ── Progress Report Modal ─────────────────────────────────────────────────────
function ReportModal({ client, sessionLogs, onClose }) {
  const [report, setReport]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [errMsg, setErrMsg]   = useState("");
  const online = useOnlineStatus();

  const generate = async () => {
    if (!online) { setErrMsg("No internet connection. Connect and try again."); return; }
    setLoading(true); setErrMsg("");
    try {
      const t = await generateProgressReport(client, sessionLogs);
      setReport(t); setDone(true);
    } catch (e) {
      setErrMsg(e.name === "AbortError" ? "Request timed out — tap retry." : "Could not generate report. Check connection and try again.");
    } finally { setLoading(false); }
  };

  const emailBody = encodeURIComponent(`Hi ${client.name},\n\nHere is your bi-weekly progress report:\n\n${report}\n\nKeep up the great work!\nCoach Sam`);
  const emailLink = `mailto:${client.email}?subject=${encodeURIComponent(`Your Progress Report – ${client.name}`)}&body=${emailBody}`;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-md flex flex-col" style={{height:"85vh"}}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div><p className="font-bold text-base" style={{color:PLATE.ink}}>Bi-weekly report</p><p className="text-xs text-gray-400">{client.name} · {client.goal}</p></div>
          <button onClick={onClose}><X size={20} color="#9CA3AF"/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {!done&&!loading&&(
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor:"#F3E8FF"}}><Sparkles size={28} color={PLATE.purple}/></div>
              <p className="font-bold text-lg" style={{color:PLATE.ink}}>Generate AI report</p>
              <p className="text-sm text-gray-500 max-w-xs">Claude will write a personalised bi-weekly progress report for {client.name} based on their training data and notes.</p>
              {!online && <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-2"><WifiOff size={13} color={PLATE.red}/><p className="text-xs text-red-600">No internet connection</p></div>}
              {errMsg && <p className="text-xs text-red-500 max-w-xs">{errMsg}</p>}
              <button onClick={generate} disabled={!online} className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white mt-2" style={{backgroundColor:online?PLATE.purple:"#9CA3AF"}}><Sparkles size={15}/> Generate report</button>
            </div>
          )}
          {loading&&<div className="flex flex-col items-center justify-center h-full gap-3"><div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full"/><p className="text-sm text-gray-500">Writing {client.name}'s report…</p><p className="text-xs text-gray-400">This takes about 10–15 seconds</p></div>}
          {done&&(
            <div className="space-y-4">
              <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
                <div className="flex items-center gap-2 mb-3"><Sparkles size={14} color={PLATE.purple}/><p className="text-xs font-bold text-purple-700 uppercase tracking-wide">AI-generated · {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</p></div>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{report}</p>
              </div>
              <div className="flex gap-2">
                <a href={emailLink} className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white" style={{backgroundColor:PLATE.blue}}><Mail size={15}/> Email to {client.name.split(" ")[0]}</a>
                <button onClick={generate} disabled={loading} className="rounded-xl px-4 py-3 border border-gray-200 text-gray-500"><RefreshCw size={14}/></button>
              </div>
              <p className="text-xs text-gray-400 text-center">Email opens your mail app with the report pre-filled.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Progression View ──────────────────────────────────────────────────────────
function ProgressionView({ client, sessionLogs }) {
  const logs = sessionLogs[client.id]||[];
  const [selEx, setSelEx] = useState(null);
  const allEx = [...new Set(logs.flatMap(s=>s.exercises.map(e=>e.name)))];
  const progData = useMemo(()=>{
    if(!selEx) return [];
    return logs.filter(s=>s.exercises.find(e=>e.name===selEx)).map(s=>{
      const ex=s.exercises.find(e=>e.name===selEx);
      return {date:s.date,maxWeight:Math.max(...ex.sets.map(st=>st.weight)),totalVol:ex.sets.reduce((a,st)=>a+(st.reps*st.weight),0)};
    });
  },[selEx,logs]);

  if (!logs.length) return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-gray-100">
      <BarChart2 size={32} color="#D1D5DB" className="mx-auto mb-2"/>
      <p className="text-sm text-gray-500">No sessions logged yet.</p>
    </div>
  );
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold" style={{color:PLATE.ink}}>Training progression</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {allEx.map(n=>(
          <button key={n} onClick={()=>setSelEx(n===selEx?null:n)}
            className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border whitespace-nowrap"
            style={selEx===n?{backgroundColor:PLATE.ink,color:"white",borderColor:"transparent"}:{backgroundColor:"white",color:"#374151",borderColor:"#E5E7EB"}}>
            {n}
          </button>
        ))}
      </div>
      {selEx&&progData.length>0&&(
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 mb-3">{selEx} — top weight</p>
          <div style={{width:"100%",height:150}}><ResponsiveContainer><BarChart data={progData} margin={{top:4,right:4,left:-24,bottom:0}}><CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/><XAxis dataKey="date" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip formatter={v=>`${v} kg`}/><Bar dataKey="maxWeight" name="Top weight" fill={PLATE.blue} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
          <p className="text-xs font-bold text-gray-500 mt-4 mb-3">Volume per session</p>
          <div style={{width:"100%",height:130}}><ResponsiveContainer><LineChart data={progData} margin={{top:4,right:4,left:-24,bottom:0}}><CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/><XAxis dataKey="date" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip formatter={v=>`${v} kg`}/><Line type="monotone" dataKey="totalVol" name="Volume" stroke={PLATE.red} strokeWidth={2.5} dot={{r:4}}/></LineChart></ResponsiveContainer></div>
        </div>
      )}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-2">Session history</p>
      {[...logs].reverse().map(s=>(
        <div key={s.id} className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-bold mb-2" style={{color:PLATE.ink}}>{s.date}</p>
          {s.exercises.map(e=>(
            <div key={e.name} className="mb-1.5 last:mb-0">
              <p className="text-xs font-semibold text-gray-600">{e.name}</p>
              <p className="text-xs text-gray-400">{e.sets.map(st=>`${st.reps}×${st.weight}kg`).join(" · ")}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Client Profile (shared between trainer & client views) ────────────────────
function ClientProfile({ client, onBack, sessionLogs, onAddLog, isTrainer }) {
  const [activeTab, setActiveTab] = useState("training");
  const [showLogger, setShowLogger] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const tabs = isTrainer
    ? [{id:"training",label:"Training"},{id:"report",label:"AI Report"}]
    : [{id:"training",label:"My Training"},{id:"report",label:"My Report"}];

  return (
    <div className="space-y-4">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold" style={{color:PLATE.blue}}>
          <ChevronLeft size={16}/> {isTrainer?"All clients":"Back"}
        </button>
      )}
      <div className="rounded-2xl p-5 text-white" style={{backgroundColor:PLATE.ink}}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">{client.name}</h1>
            <p className="text-sm opacity-80 mt-1">{client.goal}</p>
          </div>
          {isTrainer && (
            <button onClick={()=>setShowLogger(true)} className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold bg-white/15 text-white">
              <Play size={12}/> Log session
            </button>
          )}
        </div>
        <p className="text-xs mt-3 bg-white/10 rounded-lg p-2">📝 {client.note}</p>
      </div>

      <div className="flex rounded-xl bg-gray-200 p-1">
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            className="flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors"
            style={activeTab===t.id?{backgroundColor:"white",color:PLATE.ink}:{color:"#6B7280"}}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab==="training" && <ProgressionView client={client} sessionLogs={sessionLogs}/>}
      {activeTab==="report" && (
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{backgroundColor:"#F3E8FF"}}><FileText size={26} color={PLATE.purple}/></div>
          <p className="font-bold" style={{color:PLATE.ink}}>Bi-weekly AI progress report</p>
          <p className="text-sm text-gray-500">Generate a personalised report based on training history and notes.</p>
          <button onClick={()=>setShowReport(true)} className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white w-full justify-center" style={{backgroundColor:PLATE.purple}}><Sparkles size={15}/> Generate & send report</button>
        </div>
      )}

      {showLogger && <SessionLoggerModal client={client} onSave={onAddLog} onClose={()=>setShowLogger(false)}/>}
      {showReport && <ReportModal client={client} sessionLogs={sessionLogs} onClose={()=>setShowReport(false)}/>}
    </div>
  );
}

// ── Trainer: Master Clients Tab ───────────────────────────────────────────────
function TrainerClients({ sessionLogs, onAddLog }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");

  if (selected) return <ClientProfile client={selected} onBack={()=>setSelected(null)} sessionLogs={sessionLogs} onAddLog={onAddLog} isTrainer/>;

  const filtered = CLIENTS.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.goal.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3">
      <SectionTitle>All clients ({CLIENTS.length})</SectionTitle>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-gray-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients…"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none"/>
      </div>
      {filtered.map(c=>{
        const logs = sessionLogs[c.id]||[];
        return (
          <button key={c.id} onClick={()=>setSelected(c)}
            className="w-full text-left rounded-2xl bg-white p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-3">
              <Avatar client={c} size={10}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bold" style={{color:PLATE.ink}}>{c.name}</p>
                  <p className="text-[10px] text-gray-400">{logs.length} session{logs.length!==1?"s":""} logged</p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{c.goal}</p>
              </div>
              <ChevronRight size={16} color="#D1D5DB"/>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Schedule with Daily / Weekly / Monthly views ──────────────────────────────
function Schedule({ userRole, currentClient, onAddLog }) {
  const [schedule, setSchedule]   = useState(INITIAL_SCHEDULE);
  const [calView, setCalView]     = useState("weekly");
  const [activeDate, setActiveDate] = useState(new Date(2025,5,20)); // single source of truth
  const [syncing, setSyncing]     = useState(false);
  const [syncDone, setSyncDone]   = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showLogger, setShowLogger] = useState(null);
  const [manualForm, setManualForm] = useState({date:"",time:"",client:""});
  const online = useOnlineStatus();
  const isTrainer = userRole==="trainer";

  const book = (dateStr, time) => {
    if (!currentClient) return;
    setSchedule(prev=>{
      const slots = prev[dateStr]||[];
      return {...prev,[dateStr]:slots.map(s=>s.time===time&&s.status==="open"?{...s,status:"booked",client:currentClient.name}:s)};
    });
  };

  const handleSync = () => { setSyncing(true); setTimeout(()=>{ setSyncing(false); setSyncDone(true); setTimeout(()=>setSyncDone(false),2500); },1800); };

  const handleManualAdd = () => {
    if(!manualForm.date||!manualForm.time||!manualForm.client) return;
    setSchedule(prev=>{
      const slots=prev[manualForm.date]||[];
      const exists=slots.find(s=>s.time===manualForm.time);
      if(exists) return {...prev,[manualForm.date]:slots.map(s=>s.time===manualForm.time?{...s,status:"booked",client:manualForm.client}:s)};
      return {...prev,[manualForm.date]:[...slots,{time:manualForm.time,status:"booked",client:manualForm.client}].sort((a,b)=>a.time.localeCompare(b.time))};
    });
    setShowManual(false); setManualForm({date:"",time:"",client:""});
  };

  // ── Daily view ──
  const DayView = ({ dateStr }) => {
    const slots = schedule[dateStr]||[];
    const d = fmt(dateStr);
    return (
      <div className="space-y-2">
        <p className="text-sm font-bold text-gray-500">{DAY_NAMES[d.getDay()]}, {d.getDate()} {MONTH_NAMES[d.getMonth()]} {d.getFullYear()}</p>
        {slots.length===0 && <div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-gray-100"><p className="text-sm text-gray-400">No slots on this day.</p></div>}
        {slots.map(s=>{
          if(!isTrainer&&s.status==="blocked") return null;
          const isOpen=s.status==="open", isBooked=s.status==="booked";
          const myBooking = !isTrainer && isBooked && s.client===currentClient?.name;
          const takenByOther = !isTrainer && isBooked && s.client!==currentClient?.name;
          const clientObj = isTrainer&&isBooked?CLIENTS.find(c=>c.name===s.client):null;
          return (
            <div key={s.time} className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm" style={{color:PLATE.ink}}>{s.time}</p>
                  <p className="text-xs text-gray-500">
                    {isTrainer?(isBooked?`Booked — ${s.client}`:isOpen?"Available":"Blocked"):
                      myBooking?"Your session ✓":takenByOther?"Unavailable":isOpen?"Available":"Blocked"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isTrainer&&isBooked&&clientObj&&<button onClick={()=>setShowLogger(clientObj)} className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-white" style={{backgroundColor:PLATE.red}}><Play size={11}/> Log</button>}
                  {isTrainer&&isBooked&&<a href={buildGCalUrl(dateStr,s.time,s.client)} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold border border-blue-200 text-blue-600"><Calendar size={11}/> GCal</a>}
                  {!isTrainer&&isOpen&&<button onClick={()=>book(dateStr,s.time)} className="rounded-xl px-4 py-2 text-xs font-bold text-white" style={{backgroundColor:PLATE.green}}>Book</button>}
                  {myBooking&&<span className="flex items-center gap-1 text-xs font-bold" style={{color:PLATE.green}}><Check size={14}/> Confirmed</span>}
                  {isTrainer&&!isBooked&&<span className="w-3 h-3 rounded-full" style={{backgroundColor:isOpen?PLATE.green:"#9CA3AF"}}/>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ── Weekly view ──
  const getWeekDates = (anchor) => {
    const dow = anchor.getDay();
    const mon = new Date(anchor); mon.setDate(anchor.getDate()-(dow===0?6:dow-1));
    return Array.from({length:7},(_,i)=>{ const d=new Date(mon); d.setDate(mon.getDate()+i); return d; });
  };
  const weekDates = getWeekDates(activeDate);

  const WeekView = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <button onClick={()=>{ const d=new Date(activeDate); d.setDate(d.getDate()-7); setActiveDate(d); }}><ChevronLeft size={18}/></button>
        <p className="text-xs font-bold text-gray-500">{weekDates[0].getDate()} {MONTH_NAMES[weekDates[0].getMonth()]} – {weekDates[6].getDate()} {MONTH_NAMES[weekDates[6].getMonth()]}</p>
        <button onClick={()=>{ const d=new Date(activeDate); d.setDate(d.getDate()+7); setActiveDate(d); }}><ChevronRight size={18}/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDates.map(d=>{
          const ds=isoDate(d); const slots=schedule[ds]||[];
          const hasOpen=slots.some(s=>s.status==="open");
          const isSelected=isoDate(d)===isoDate(activeDate);
          return (
            <button key={ds} onClick={()=>setActiveDate(d)}
              className="flex flex-col items-center py-2 rounded-xl border transition-all"
              style={{backgroundColor:isSelected?PLATE.ink:"white",borderColor:isSelected?"transparent":"#E5E7EB"}}>
              <p className="text-[10px] font-semibold" style={{color:isSelected?"rgba(255,255,255,0.6)":"#9CA3AF"}}>{DAY_NAMES[d.getDay()]}</p>
              <p className="text-sm font-extrabold mt-0.5" style={{color:isSelected?"white":PLATE.ink}}>{d.getDate()}</p>
              {hasOpen&&<div className="w-1.5 h-1.5 rounded-full mt-1" style={{backgroundColor:isSelected?"white":PLATE.green}}/>}
            </button>
          );
        })}
      </div>
      <DayView dateStr={isoDate(activeDate)}/>
    </div>
  );

  // ── Monthly view ──
  const getMonthDates = (anchor) => {
    const first=new Date(anchor.getFullYear(),anchor.getMonth(),1);
    const last=new Date(anchor.getFullYear(),anchor.getMonth()+1,0);
    const startDow=first.getDay()===0?6:first.getDay()-1;
    const days=[];
    for(let i=0;i<startDow;i++) days.push(null);
    for(let d=1;d<=last.getDate();d++) days.push(new Date(anchor.getFullYear(),anchor.getMonth(),d));
    return days;
  };

  const MonthView = () => {
    const days = getMonthDates(activeDate);
    const [dayDetail, setDayDetail] = useState(null);
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-1">
          <button onClick={()=>{ const d=new Date(activeDate); d.setMonth(d.getMonth()-1); setActiveDate(d); }}><ChevronLeft size={18}/></button>
          <p className="text-sm font-bold" style={{color:PLATE.ink}}>{MONTH_NAMES[activeDate.getMonth()]} {activeDate.getFullYear()}</p>
          <button onClick={()=>{ const d=new Date(activeDate); d.setMonth(d.getMonth()+1); setActiveDate(d); }}><ChevronRight size={18}/></button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 mb-2">
          {["M","T","W","T","F","S","S"].map((d,i)=><p key={i} className="text-[10px] font-bold text-gray-400 text-center py-1">{d}</p>)}
          {days.map((d,i)=>{
            if(!d) return <div key={`e${i}`}/>;
            const ds=isoDate(d);
            const slots=schedule[ds]||[];
            const openCount=slots.filter(s=>s.status==="open").length;
            const bookedCount=slots.filter(s=>s.status==="booked").length;
            const isToday=ds==="2025-06-20";
            const isSel=dayDetail&&isoDate(dayDetail)===ds;
            return (
              <button key={ds} onClick={()=>setDayDetail(isSel?null:d)}
                className="rounded-lg py-1.5 flex flex-col items-center transition-all border"
                style={{backgroundColor:isSel?PLATE.ink:isToday?"#FEF3C7":"white",borderColor:isToday?PLATE.yellow:isSel?"transparent":"#F3F4F6"}}>
                <p className="text-xs font-bold" style={{color:isSel?"white":isToday?PLATE.yellow:PLATE.ink}}>{d.getDate()}</p>
                {openCount>0&&<div className="w-1 h-1 rounded-full mt-0.5" style={{backgroundColor:isSel?"white":PLATE.green}}/>}
                {bookedCount>0&&<div className="w-1 h-1 rounded-full mt-0.5" style={{backgroundColor:isSel?"rgba(255,255,255,0.6)":PLATE.red}}/>}
              </button>
            );
          })}
        </div>
        <div className="flex gap-3 text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{backgroundColor:PLATE.green}}/> Open</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{backgroundColor:PLATE.red}}/> Booked</span>
        </div>
        {dayDetail&&<DayView dateStr={isoDate(dayDetail)}/>}
        {!dayDetail&&<div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-gray-100"><p className="text-sm text-gray-400">Tap a date to see available slots.</p></div>}
      </div>
    );
  };

  const inp = "w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm focus:outline-none";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SectionTitle>Schedule</SectionTitle>
        {isTrainer&&(
          <div className="flex gap-2">
            <button onClick={()=>setShowManual(true)} className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold border border-gray-200 text-gray-700 bg-white"><Edit3 size={12}/> Manual</button>
            <button onClick={handleSync} disabled={syncing} className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-white" style={{backgroundColor:syncDone?PLATE.green:PLATE.blue}}>
              {syncing?<><span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"/> Syncing…</>:syncDone?<><Check size={12}/> Synced!</>:<><RefreshCw size={12}/> Sync GCal</>}
            </button>
          </div>
        )}
      </div>

      {!isTrainer&&(
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2 flex items-start gap-2">
          <Calendar size={14} color={PLATE.blue} className="mt-0.5 flex-shrink-0"/>
          <p className="text-xs text-blue-700">Book sessions in advance — only open slots are available to you. Tap a slot to reserve it.</p>
        </div>
      )}

      {/* View toggle */}
      <div className="flex rounded-xl bg-gray-200 p-1">
        {["daily","weekly","monthly"].map(v=>(
          <button key={v} onClick={()=>setCalView(v)}
            className="flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition-colors"
            style={calView===v?{backgroundColor:"white",color:PLATE.ink}:{color:"#6B7280"}}>
            {v}
          </button>
        ))}
      </div>

      {calView==="daily"&&(
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button onClick={()=>{ const d=new Date(activeDate); d.setDate(d.getDate()-1); setActiveDate(d); }}><ChevronLeft size={18}/></button>
            <p className="text-xs font-bold text-gray-500">{DAY_NAMES[activeDate.getDay()]}, {activeDate.getDate()} {MONTH_NAMES[activeDate.getMonth()]}</p>
            <button onClick={()=>{ const d=new Date(activeDate); d.setDate(d.getDate()+1); setActiveDate(d); }}><ChevronRight size={18}/></button>
          </div>
          <DayView dateStr={isoDate(activeDate)}/>
        </div>
      )}
      {calView==="weekly"&&<WeekView/>}
      {calView==="monthly"&&<MonthView/>}

      {/* Manual booking modal */}
      {showManual&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={()=>setShowManual(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-md p-5 space-y-3" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between"><p className="font-bold text-lg" style={{color:PLATE.ink}}>Add booking</p><button onClick={()=>setShowManual(false)}><X size={20} color="#9CA3AF"/></button></div>
            <input className={inp} type="date" value={manualForm.date} onChange={e=>setManualForm(p=>({...p,date:e.target.value}))}/>
            <input className={inp} placeholder="Time e.g. 9:00 AM" value={manualForm.time} onChange={e=>setManualForm(p=>({...p,time:e.target.value}))}/>
            <select className={inp} value={manualForm.client} onChange={e=>setManualForm(p=>({...p,client:e.target.value}))}>
              <option value="">Select client…</option>
              {CLIENTS.map(c=><option key={c.id}>{c.name}</option>)}
            </select>
            <button onClick={handleManualAdd} disabled={!manualForm.date||!manualForm.time||!manualForm.client}
              className="w-full rounded-xl py-3 text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{backgroundColor:manualForm.date&&manualForm.time&&manualForm.client?PLATE.ink:"#9CA3AF"}}>
              <Plus size={15}/> Add booking
            </button>
            <p className="text-xs text-gray-400 text-center">After adding, tap Sync GCal to push to Google Calendar.</p>
          </div>
        </div>
      )}
      {showLogger&&<SessionLoggerModal client={showLogger} onSave={onAddLog} onClose={()=>setShowLogger(null)}/>}
    </div>
  );
}

// ── Exercise Card ─────────────────────────────────────────────────────────────
function ExerciseCard({ exercise, isFav, onToggleFav }) {
  const [expanded, setExpanded] = useState(false);
  const [aiData, setAiData]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const online = useOnlineStatus();

  const handleEnrich = async () => {
    if (aiData) { setExpanded(v => !v); return; }
    if (!online) { setError("No internet connection. Connect and try again."); return; }
    setLoading(true); setError(null);
    try {
      const r = await fetchAIEnrichment(exercise.name);
      setAiData(r); setExpanded(true);
    } catch (e) {
      setError(e.name === "AbortError" ? "Request timed out. Try again." : "AI enrichment failed. Tap to retry.");
    } finally { setLoading(false); }
  };
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0"><p className="font-bold leading-snug" style={{color:PLATE.ink}}>{exercise.name}</p><p className="text-xs text-gray-400 mt-0.5">{exercise.equipment} · {exercise.bilateral?"Bilateral":"Unilateral"}</p></div>
          <button onClick={()=>onToggleFav(exercise.name)} className="p-1"><Star size={16} fill={isFav?PLATE.yellow:"none"} stroke={isFav?PLATE.yellow:"#9CA3AF"}/></button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2"><GroupTag group={exercise.group}/><PatternTag pattern={exercise.pattern}/><DiffBadge level={exercise.difficulty}/></div>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exercise.cues}</p>
        <div className="flex gap-2 mt-3">
          <button onClick={handleEnrich} disabled={loading} className="flex-1 flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold text-white" style={{backgroundColor:loading?"#9CA3AF":PLATE.purple}}>
            {loading?<><span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"/> Enriching…</>:<><Sparkles size={13}/>{aiData?"View AI insights":"Enrich with AI"}</>}
          </button>
          {aiData&&<button onClick={()=>setExpanded(v=>!v)} className="rounded-xl px-3 border border-gray-200 text-gray-500">{expanded?<ChevronUp size={14}/>:<ChevronDown size={14}/>}</button>}
        </div>
        {error&&<p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
      {expanded&&aiData&&(
        <div className="border-t border-gray-100 bg-purple-50 p-4 space-y-3">
          <div className="flex items-center gap-1.5"><Sparkles size={13} color={PLATE.purple}/><p className="text-xs font-bold text-purple-700 uppercase tracking-wide">AI Science Insights</p></div>
          <div className="grid grid-cols-2 gap-2">
            <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Primary</p>{aiData.primaryMuscles.map(m=><p key={m} className="text-xs text-gray-700 font-medium">{m}</p>)}</div>
            <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Secondary</p>{aiData.secondaryMuscles.map(m=><p key={m} className="text-xs text-gray-700">{m}</p>)}</div>
          </div>
          <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Rep Ranges</p>{Object.entries(aiData.repRanges).map(([g,r])=><div key={g} className="flex justify-between text-xs py-0.5"><span className="font-semibold capitalize text-gray-600">{g}</span><span className="text-gray-500">{r}</span></div>)}</div>
          <div className="rounded-xl bg-purple-100 p-3"><p className="text-[10px] font-bold text-purple-600 uppercase mb-1">Research note</p><p className="text-xs text-purple-900 leading-relaxed">{aiData.scienceTip}</p></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-green-50 p-2"><p className="text-[10px] font-bold text-green-600 uppercase mb-1">Progress to</p><p className="text-xs text-green-900">{aiData.progression}</p></div>
            <div className="rounded-xl bg-blue-50 p-2"><p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Regress to</p><p className="text-xs text-blue-900">{aiData.regression}</p></div>
          </div>
          <div className="rounded-xl bg-red-50 p-2"><p className="text-[10px] font-bold text-red-500 uppercase mb-1">Contraindications</p><p className="text-xs text-red-900">{aiData.contraindications}</p></div>
        </div>
      )}
    </div>
  );
}

// ── Library ───────────────────────────────────────────────────────────────────
function Library({ exercises, setExercises }) {
  const [q,setQ]=useState(""); const [group,setGroup]=useState("All"); const [pattern,setPattern]=useState("All"); const [diff,setDiff]=useState("All");
  const [showFavs,setShowFavs]=useState(false); const [favs,setFavs]=useState(new Set(["Conventional Deadlift","Barbell Back Squat"]));
  const [showAdd,setShowAdd]=useState(false);
  const toggleFav=n=>setFavs(p=>{const s=new Set(p);s.has(n)?s.delete(n):s.add(n);return s;});
  const filtered=useMemo(()=>{
    let l=exercises;
    if(showFavs)l=l.filter(e=>favs.has(e.name));
    if(group!=="All")l=l.filter(e=>e.group===group);
    if(pattern!=="All")l=l.filter(e=>e.pattern===pattern);
    if(diff!=="All")l=l.filter(e=>e.difficulty===diff);
    if(q)l=l.filter(e=>e.name.toLowerCase().includes(q.toLowerCase())||e.equipment.toLowerCase().includes(q.toLowerCase()));
    return l;
  },[exercises,q,group,pattern,diff,showFavs,favs]);
  const FR=({options,value,onChange})=>(
    <div className="flex gap-1.5 overflow-x-auto pb-1">{options.map(o=><button key={o} onClick={()=>onChange(o)} className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold border whitespace-nowrap" style={value===o?{backgroundColor:PLATE.ink,color:"white",borderColor:"transparent"}:{backgroundColor:"white",color:"#374151",borderColor:"#E5E7EB"}}>{o}</button>)}</div>
  );
  const AddModal=({onClose})=>{
    const [form,setForm]=useState({name:"",group:"Legs",pattern:"Squat",equipment:"Barbell",bilateral:true,difficulty:"Beginner",cues:""});
    const s=(k,v)=>setForm(p=>({...p,[k]:v}));
    const sel="w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm focus:outline-none";
    return(
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
        <div className="bg-white rounded-t-3xl w-full max-w-md p-5 space-y-3 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
          <div className="flex items-center justify-between"><p className="font-bold text-lg" style={{color:PLATE.ink}}>Add custom exercise</p><button onClick={onClose}><X size={20} color="#9CA3AF"/></button></div>
          <input className={sel} placeholder="Exercise name *" value={form.name} onChange={e=>s("name",e.target.value)}/>
          <div className="grid grid-cols-2 gap-2">
            <select className={sel} value={form.group} onChange={e=>s("group",e.target.value)}>{Object.keys(MUSCLE_COLORS).map(g=><option key={g}>{g}</option>)}</select>
            <select className={sel} value={form.pattern} onChange={e=>s("pattern",e.target.value)}>{Object.keys(PATTERN_COLORS).map(p=><option key={p}>{p}</option>)}</select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select className={sel} value={form.equipment} onChange={e=>s("equipment",e.target.value)}>{["Barbell","Dumbbell","Kettlebell","Machine","Bodyweight","Cable","Resistance Band"].map(e=><option key={e}>{e}</option>)}</select>
            <select className={sel} value={form.difficulty} onChange={e=>s("difficulty",e.target.value)}>{["Beginner","Intermediate","Advanced"].map(d=><option key={d}>{d}</option>)}</select>
          </div>
          <textarea className={sel+" resize-none"} rows={3} placeholder="Coaching cues" value={form.cues} onChange={e=>s("cues",e.target.value)}/>
          <button onClick={()=>{if(form.name.trim()){setExercises(p=>[{...form,custom:true},...p]);onClose();}}} className="w-full rounded-xl py-3 text-sm font-bold text-white" style={{backgroundColor:form.name.trim()?PLATE.ink:"#9CA3AF"}}>Add to library</button>
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><SectionTitle>Exercise library</SectionTitle><button onClick={()=>setShowAdd(true)} className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-white" style={{backgroundColor:PLATE.ink}}><Plus size={13}/> Add</button></div>
      <div className="relative"><Search size={16} className="absolute left-3 top-3 text-gray-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none"/></div>
      <button onClick={()=>setShowFavs(v=>!v)} className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border" style={showFavs?{backgroundColor:PLATE.yellow,color:"white",borderColor:"transparent"}:{backgroundColor:"white",color:"#374151",borderColor:"#E5E7EB"}}><Star size={12} fill={showFavs?"white":"none"}/> Favourites ({favs.size})</button>
      <FR options={["All",...Object.keys(MUSCLE_COLORS)]} value={group} onChange={setGroup}/>
      <FR options={["All",...Object.keys(PATTERN_COLORS)]} value={pattern} onChange={setPattern}/>
      <FR options={["All","Beginner","Intermediate","Advanced"]} value={diff} onChange={setDiff}/>
      <p className="text-xs text-gray-400">{filtered.length} exercise{filtered.length!==1?"s":""}</p>
      {filtered.map(e=><ExerciseCard key={e.name} exercise={e} isFav={favs.has(e.name)} onToggleFav={toggleFav}/>)}
      {!filtered.length&&<p className="text-sm text-gray-500 text-center py-6">No exercises match.</p>}
      {showAdd&&<AddModal onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}

// ── Trainer Dashboard ─────────────────────────────────────────────────────────
function TrainerDashboard({ goTo, sessionLogs }) {
  const todaySlots = INITIAL_SCHEDULE["2025-06-20"]||[];
  const todayBooked = todaySlots.filter(s=>s.status==="booked");
  const totalLogged = Object.values(sessionLogs).reduce((a,v)=>a+v.length,0);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 text-white" style={{backgroundColor:PLATE.ink}}>
        <p className="text-sm opacity-70 uppercase tracking-widest">Friday, 20 June 2025</p>
        <h1 className="text-2xl font-extrabold mt-1">Morning, Coach Sam 💪</h1>
        <p className="mt-2 text-sm opacity-90">{todayBooked.length} sessions today · {CLIENTS.length} active clients</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          {label:"Active clients",   value:CLIENTS.length,  color:PLATE.blue,   tab:"clients"},
          {label:"Sessions logged",  value:totalLogged,     color:PLATE.purple, tab:"clients"},
          {label:"Today's bookings", value:todayBooked.length, color:PLATE.red, tab:"schedule"},
          {label:"Open slots today", value:todaySlots.filter(s=>s.status==="open").length, color:PLATE.green, tab:"schedule"},
        ].map(card=>(
          <button key={card.label} onClick={()=>goTo(card.tab)}
            className="rounded-2xl bg-white p-4 text-left shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <p className="text-3xl font-extrabold" style={{color:card.color}}>{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-bold mb-2" style={{color:PLATE.ink}}>Today's sessions</p>
        {todayBooked.length===0&&<p className="text-sm text-gray-400">No sessions booked today.</p>}
        {todayBooked.map(s=>(
          <div key={s.time} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2">
              {CLIENTS.find(c=>c.name===s.client)&&<Avatar client={CLIENTS.find(c=>c.name===s.client)} size={7}/>}
              <p className="text-sm font-semibold" style={{color:PLATE.ink}}>{s.client}</p>
            </div>
            <p className="text-xs text-gray-500">{s.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Client Home (client-role dashboard) ───────────────────────────────────────
function ClientHome({ client, sessionLogs, onAddLog }) {
  const [showProfile, setShowProfile] = useState(false);
  if (showProfile) return <ClientProfile client={client} onBack={()=>setShowProfile(false)} sessionLogs={sessionLogs} onAddLog={onAddLog} isTrainer={false}/>;
  const logs = sessionLogs[client.id]||[];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 text-white" style={{backgroundColor:PLATE.ink}}>
        <p className="text-sm opacity-70 uppercase tracking-widest">Welcome back</p>
        <h1 className="text-2xl font-extrabold mt-1">Hi, {client.name.split(" ")[0]}! 👋</h1>
        <p className="mt-2 text-sm opacity-90">{client.goal}</p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <p className="text-3xl font-extrabold" style={{color:PLATE.green}}>{logs.length}</p>
        <p className="text-xs text-gray-500 mt-1">Sessions logged with Coach Sam</p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-bold mb-1" style={{color:PLATE.ink}}>Trainer's note</p>
        <p className="text-sm text-gray-600">{client.note}</p>
      </div>
      <button onClick={()=>setShowProfile(true)} className="w-full rounded-2xl bg-white p-4 shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-transform">
        <div className="flex items-center gap-3"><Avatar client={client} size={9}/><div><p className="font-bold text-sm" style={{color:PLATE.ink}}>My training profile</p><p className="text-xs text-gray-400">Progress, reports & history</p></div></div>
        <ChevronRight size={16} color="#D1D5DB"/>
      </button>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────
export default function PTTrainerApp() {
  const [auth, setAuth]           = useState(null);
  const [tab, setTab]             = useState("dashboard");
  const [exercises, setExercises] = useState(BASE_EXERCISES);
  const [sessionLogs, setSessionLogs] = useState(Object.fromEntries(CLIENTS.map(c=>[c.id,[]])));
  const online = useOnlineStatus();

  const addLog = useCallback((clientId, log) => {
    setSessionLogs(prev=>({...prev,[clientId]:[...(prev[clientId]||[]),log]}));
  },[]);

  const goTo = (t) => setTab(t);

  if (!auth) return <PinLogin onLogin={setAuth}/>;

  const isTrainer = auth.role==="trainer";

  const trainerTabs = [
    {id:"dashboard",label:"Home",    icon:TrendingUp},
    {id:"clients",  label:"Clients", icon:Users},
    {id:"library",  label:"Library", icon:Dumbbell},
    {id:"schedule", label:"Schedule",icon:CalendarDays},
  ];
  const clientTabs = [
    {id:"dashboard",label:"Home",    icon:TrendingUp},
    {id:"schedule", label:"Book",    icon:CalendarDays},
    {id:"library",  label:"Library", icon:Dumbbell},
  ];
  const tabs = isTrainer ? trainerTabs : clientTabs;

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor:PLATE.chalk,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between max-w-md mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{backgroundColor:PLATE.red}}><Dumbbell size={14} color="white"/></div>
          <p className="text-sm font-extrabold" style={{color:PLATE.ink}}>FormForge PT</p>
        </div>
        <div className="flex items-center gap-2">
          {!online && <div className="flex items-center gap-1 rounded-full px-2 py-1 bg-red-50 border border-red-100"><WifiOff size={10} color={PLATE.red}/><span className="text-[10px] font-semibold text-red-500">Offline</span></div>}
          <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold" style={{backgroundColor:isTrainer?"#FEF3C7":"#DBEAFE",color:isTrainer?PLATE.yellow:PLATE.blue}}>
            {isTrainer?<Shield size={11}/>:<Lock size={11}/>}
            {isTrainer?"Trainer":auth.client?.name.split(" ")[0]}
          </div>
          <button onClick={()=>{setAuth(null);setTab("dashboard");}} className="rounded-full p-1.5 bg-gray-100"><LogOut size={13} color="#6B7280"/></button>
        </div>
      </div>

      <div className="flex-1 max-w-md w-full mx-auto px-4 pt-5 pb-24">
        {isTrainer?(
          <>
            {tab==="dashboard"&&<TrainerDashboard goTo={goTo} sessionLogs={sessionLogs}/>}
            {tab==="clients"&&<TrainerClients sessionLogs={sessionLogs} onAddLog={addLog}/>}
            {tab==="library"&&<Library exercises={exercises} setExercises={setExercises}/>}
            {tab==="schedule"&&<Schedule userRole="trainer" onAddLog={addLog}/>}
          </>
        ):(
          <>
            {tab==="dashboard"&&<ClientHome client={auth.client} sessionLogs={sessionLogs} onAddLog={addLog}/>}
            {tab==="schedule"&&<Schedule userRole="client" currentClient={auth.client} onAddLog={addLog}/>}
            {tab==="library"&&<Library exercises={exercises} setExercises={setExercises}/>}
          </>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="max-w-md mx-auto flex">
          {tabs.map(t=>{
            const Icon=t.icon; const active=tab===t.id;
            return (
              <button key={t.id} onClick={()=>goTo(t.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2.5"
                style={{color:active?PLATE.red:"#9CA3AF"}}>
                <Icon size={20} strokeWidth={active?2.5:2}/>
                <span className="text-[10px] font-semibold">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
