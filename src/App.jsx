import { useState, useRef } from "react";

const KURIKULUM = {
  1: ["Bilangan Cacah","Operasi Hitung","Pola","Pengukuran","Bangun Datar","Data"],
  2: ["Bilangan Cacah","Operasi Hitung","Pengukuran","Bangun Datar & Ruang","Data"],
  3: ["Bilangan Cacah","Operasi Hitung","Kelipatan & Faktor","Pecahan & Desimal","Pengukuran","Bangun Datar & Ruang","Data"],
  4: ["Bilangan Cacah Besar","Operasi Hitung","Pembagian & Strategi Hitung","Pecahan & Desimal","Pengukuran","Bangun Datar & Ruang","Data & Statistik","Bilangan Bulat"],
  5: ["Bilangan Cacah Besar","Operasi Hitung","Operasi Campuran","Pecahan & Desimal","Pengukuran","Bangun Datar & Ruang","Data & Statistik","Perbandingan & Skala","Waktu & Kecepatan","Bilangan Bulat","Peluang"],
  6: ["Bilangan & Operasi Lanjutan","Pecahan, Desimal & Persen","Operasi Campuran","Pengukuran","Bangun Datar & Ruang","Data & Statistik","Perbandingan & Skala","Kecepatan","Bilangan Bulat","Peluang","Problem Solving"],
};
const FASE = {1:"Fase A",2:"Fase A",3:"Fase B",4:"Fase B",5:"Fase C",6:"Fase C"};
const JUMLAH_OPTIONS = {Mudah:[10],Sedang:[10,20],Sulit:[10,20,25]};
const LEVEL_COLOR = {
  Mudah:{bg:"#10B981",text:"#065F46"},
  Sedang:{bg:"#F59E0B",text:"#78350F"},
  Sulit:{bg:"#EF4444",text:"#991B1B"},
};

function HomeBtn({onHome}){
  return(
    <button onClick={onHome} style={{position:"fixed",top:14,left:14,zIndex:200,background:"rgba(255,255,255,0.93)",border:"none",borderRadius:12,padding:"7px 14px",cursor:"pointer",fontWeight:800,fontSize:13,color:"#4B5563",boxShadow:"0 2px 12px rgba(0,0,0,0.14)",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
      🏠 Home
    </button>
  );
}

function ProgressBar({current,total}){
  const pct=Math.round((current/total)*100);
  return(
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:12,color:"#6B7280",fontWeight:700}}>Progress Belajar</span>
        <span style={{fontSize:12,color:"#7C3AED",fontWeight:800}}>Soal {current} dari {total}</span>
      </div>
      <div style={{background:"#E9D5FF",borderRadius:99,height:9,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#7C3AED,#EC4899)",borderRadius:99,transition:"width 0.5s ease"}}/>
      </div>
    </div>
  );
}

function StarPop({show}){
  if(!show)return null;
  return(
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:999}}>
      {["⭐","🌟","✨","🎉","💫","⭐","🌟","✨","🎉","💫","⭐","🌟","✨","🎉"].map((_,i)=>(
        <div key={i} style={{position:"absolute",left:`${12+Math.random()*76}%`,top:`${5+Math.random()*45}%`,fontSize:26,animation:"popStar 1.1s ease-out forwards",animationDelay:`${i*0.07}s`,opacity:0}}>
          {["⭐","🌟","✨","🎉","💫"][i%5]}
        </div>
      ))}
    </div>
  );
}

const Card=({children,style={}})=>(
  <div style={{background:"#fff",borderRadius:22,padding:"22px 22px",boxShadow:"0 6px 28px rgba(124,58,237,0.09)",marginBottom:14,...style}}>
    {children}
  </div>
);

const Btn=({children,onClick,style={},disabled=false})=>(
  <button onClick={onClick} disabled={disabled}
    style={{border:"none",borderRadius:14,padding:"13px 20px",fontSize:15,fontWeight:800,fontFamily:"inherit",cursor:disabled?"default":"pointer",transition:"all .18s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:disabled?.6:1,...style}}
    onMouseEnter={e=>{if(!disabled)e.currentTarget.style.transform="translateY(-2px)";}}
    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}
    onMouseDown={e=>{if(!disabled)e.currentTarget.style.transform="scale(0.97)";}}
    onMouseUp={e=>{if(!disabled)e.currentTarget.style.transform="translateY(-2px)";}}
  >{children}</button>
);

export default function App(){
  const [page,setPage]=useState("cover");
  const [name,setName]=useState("");
  const [kelas,setKelas]=useState(1);
  const [tema,setTema]=useState(KURIKULUM[1][0]);
  const [level,setLevel]=useState("Mudah");
  const [jumlah,setJumlah]=useState(10);
  const [questions,setQuestions]=useState([]);
  const [idx,setIdx]=useState(0);
  const [picked,setPicked]=useState(null);
  const [confirmed,setConfirmed]=useState(false);
  const [showExpl,setShowExpl]=useState(false);
  const [showPrevExpl,setShowPrevExpl]=useState(false);
  const [prevSkipped,setPrevSkipped]=useState(false);
  const [score,setScore]=useState(0);
  const [loading,setLoading]=useState(false);
  const [loadMsg,setLoadMsg]=useState("");
  const [error,setError]=useState(null);
  const [stars,setStars]=useState(false);
  const nameRef=useRef();

  const q=questions[idx]||null;
  const isCorrect=confirmed&&q&&picked===q.jawaban;
  const isWrong=confirmed&&q&&picked!==q.jawaban;
  const isLast=idx===questions.length-1;
  const lc=LEVEL_COLOR[level];
  const pct=questions.length>0?Math.round((score/questions.length)*100):0;

  function changeKelas(k){setKelas(k);setTema(KURIKULUM[k][0]);}
  function changeLevel(l){setLevel(l);setJumlah(JUMLAH_OPTIONS[l][0]);}

  function resetQ(newIdx,skipped=false){
    setIdx(newIdx);setPicked(null);setConfirmed(false);
    setShowExpl(false);setShowPrevExpl(false);setPrevSkipped(skipped);
  }

  async function generate(seed=""){
    setLoading(true);setError(null);
    const msgs=["Menyiapkan soal seru... 🎨","AI lagi berpikir keras... 🤖","Hampir selesai! ⚡","Sedikit lagi! 🌟"];
    let mi=0;setLoadMsg(msgs[0]);
    const iv=setInterval(()=>{mi=(mi+1)%msgs.length;setLoadMsg(msgs[mi]);},1900);
    const seedNote=seed?`\nVariasi ${seed} — soal harus unik, tidak mengulang.`:"";
    const prompt=`Kamu adalah guru matematika SD Indonesia.
Buat TEPAT ${jumlah} soal pilihan ganda untuk:
- Nama siswa: ${name}
- Kelas: ${kelas} SD (${FASE[kelas]})
- Tema: ${tema}
- Level: ${level}
- Kurikulum Merdeka Indonesia

ATURAN KETAT:
1. Soal HARUS sesuai tema "${tema}" kelas ${kelas} SD — jangan keluar dari tema.
2. Bahasa Indonesia sederhana, cocok anak kelas ${kelas} SD.
3. Pilihan A, B, C — hanya 1 benar.
4. ${level==="Mudah"?"Distraktor jelas, soal singkat langsung.":level==="Sedang"?"Distraktor agak mirip, beberapa soal berupa cerita pendek.":"Distraktor mirip/menjebak, beberapa soal cerita kontekstual panjang."}
5. Pembahasan: langkah penyelesaian + kenapa jawaban benar + kenapa lainnya salah.${seedNote}

Balas HANYA JSON valid tanpa teks lain:
{"soal":[{"nomor":1,"pertanyaan":"...","pilihan":{"A":"...","B":"...","C":"..."},"jawaban":"A","pembahasan":"..."}]}`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4096,messages:[{role:"user",content:prompt}]})
      });
      const data=await res.json();
      const txt=(data.content||[]).map(b=>b.text||"").join("");
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      clearInterval(iv);setLoading(false);
      return parsed.soal||[];
    }catch(e){
      clearInterval(iv);setLoading(false);
      setError("Gagal membuat soal. Cek koneksi internet, lalu coba lagi 😊");
      return[];
    }
  }

  async function startGame(){
    if(!name.trim()){nameRef.current?.focus();return;}
    const soal=await generate();
    if(soal.length>0){setQuestions(soal);resetQ(0);setScore(0);setPage("question");}
  }

  async function regen(){
    const soal=await generate(Date.now().toString());
    if(soal.length>0){setQuestions(soal);resetQ(0);setScore(0);setPage("question");}
  }

  function choose(opt){
    if(confirmed)return;
    setPicked(opt);setConfirmed(true);
    if(opt===questions[idx].jawaban){
      setScore(s=>s+1);
      setStars(true);setTimeout(()=>setStars(false),1400);
    }
  }

  // Lanjut soal TANPA pembahasan
  function handleLanjutDirect(){
    const skipped=!showExpl;
    if(isLast){setPage("results");return;}
    resetQ(idx+1,skipped);
  }

  // Lanjut dari dalam pembahasan
  function handleLanjutFromExpl(){
    if(isLast){setPage("results");return;}
    resetQ(idx+1,false);
  }

  function handleCobаLagi(){
    setPicked(null);setConfirmed(false);setShowExpl(false);
  }

  function goHome(){
    setPage("cover");setQuestions([]);setScore(0);resetQ(0);
  }

  /* ── LOADING ── */
  if(loading)return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#4F46E5,#7C3AED,#A855F7)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif",padding:24}}>
      <div style={{textAlign:"center",color:"#fff"}}>
        <div style={{fontSize:78,animation:"spin 2s linear infinite",display:"inline-block"}}>🤖</div>
        <p style={{fontFamily:"'Fredoka One',cursive",fontSize:22,margin:"20px 0 6px"}}>{loadMsg}</p>
        <p style={{opacity:.72,fontSize:14,fontWeight:700,margin:"0 0 24px"}}>Claude AI sedang meracik soal khusus untukmu!</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          {[0,1,2].map(i=><div key={i} style={{width:13,height:13,borderRadius:"50%",background:"#FFD700",animation:`bnc 1s ease-in-out ${i*.2}s infinite`}}/>)}
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');@keyframes spin{to{transform:rotate(360deg)}}@keyframes bnc{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
    </div>
  );

  return(
    <div style={{fontFamily:"'Nunito',sans-serif",minHeight:"100vh",background:"#F5F3FF",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes popStar{0%{opacity:0;transform:scale(0) translateY(0)}55%{opacity:1;transform:scale(1.5) translateY(-28px)}100%{opacity:0;transform:scale(.9) translateY(-65px)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @keyframes floatN{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-18px) rotate(4deg)}}
        .ani{animation:slideUp .38s ease-out both}
      `}</style>
      <StarPop show={stars}/>

      {/* ═══ COVER ═══ */}
      {page==="cover"&&(
  <div style={{
    minHeight:"100vh",
    background:"linear-gradient(135deg,#3730A3,#7C3AED 55%,#EC4899)",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
    padding:"28px 20px",
    position:"relative",
    overflow:"hidden"
  }}>

    {/* dekor angka background */}
    {[["1","6%","12%","0s"],["÷","88%","18%","1.3s"],["+","10%","66%","0.7s"],["2","82%","62%","1.9s"],["=","46%","84%","1s"],["×","55%","9%","1.6s"]].map(([n,l,t,d])=>(
      <div key={n+l} style={{
        position:"absolute",
        left:l,
        top:t,
        fontSize:54,
        fontWeight:900,
        color:"rgba(255,255,255,0.08)",
        fontFamily:"'Fredoka One',cursive",
        animation:`floatN 6s ease-in-out ${d} infinite`,
        pointerEvents:"none"
      }}>{n}</div>
    ))}

    {/* CONTENT */}
    <div className="ani" style={{
      textAlign:"center",
      maxWidth:460,
      width:"100%",
      display:"flex",
      flexDirection:"column",
      alignItems:"center"
    }}>

      {/* IKON SEMPOA (SUDAH DIPERBAIKI) */}
     <div style={{
  fontSize:110,
  marginBottom:20,          // ⬅️ tambah jarak ke bawah
  transform:"translateY(-10px)", // ⬅️ naikkan lagi
  filter:"drop-shadow(0 6px 18px rgba(0,0,0,0.35))"
}}>
  🧮
</div>

      {/* JUDUL */}
      <h1 style={{
        color:"#fff",
        fontSize:32,
        fontWeight:900,
        fontFamily:"'Fredoka One',cursive",
        margin:"20px 0 6px",
        lineHeight:1.2,
        textShadow:"0 2px 10px rgba(0,0,0,0.2)"
      }}>
        Digital Playbook<br/>Matematika
      </h1>

      <p style={{
        color:"rgba(255,255,255,0.82)",
        fontSize:16,
        fontWeight:700,
        marginBottom:32
      }}>
        🎮 Belajar Seru & Interaktif!
      </p>

      {/* FORM */}
      <div style={{
        background:"rgba(255,255,255,0.14)",
        backdropFilter:"blur(14px)",
        borderRadius:24,
        padding:28,
        width:"100%"
      }}>
        {name&&(
          <p style={{
            color:"#FFD700",
            fontWeight:900,
            fontSize:19,
            margin:"0 0 12px",
            fontFamily:"'Fredoka One',cursive"
          }}>
            Halo, {name}! 👋
          </p>
        )}

        <label style={{
          color:"rgba(255,255,255,0.9)",
          fontWeight:800,
          fontSize:13,
          display:"block",
          textAlign:"left",
          marginBottom:8
        }}>
          ✏️ Nama Kamu
        </label>

        <input
          ref={nameRef}
          type="text"
          placeholder="Tulis nama kamu di sini..."
          value={name}
          onChange={e=>setName(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&name.trim()&&setPage("params")}
          style={{
            width:"100%",
            boxSizing:"border-box",
            padding:"11px 14px",
            borderRadius:12,
            border:"none",
            fontSize:15,
            fontFamily:"inherit",
            background:"rgba(255,255,255,0.96)",
            color:"#1F2937",
            outline:"none",
            marginBottom:18
          }}
        />

        <Btn
          onClick={()=>name.trim()?setPage("params"):nameRef.current?.focus()}
          style={{
            background:"#FFD700",
            color:"#1F0080",
            width:"100%",
            fontSize:17,
            boxShadow:"0 4px 22px rgba(255,215,0,0.45)"
          }}
        >
          ▶ Mulai Belajar
        </Btn>
      </div>

      <p style={{
        color:"rgba(255,255,255,0.45)",
        fontSize:11,
        marginTop:22
      }}>
        Kurikulum Merdeka · SD Kelas 1–6 · Ditenagai Claude AI
      </p>

    </div>
  </div>
)}

      {/* ═══ PARAMETER ═══ */}
      {page==="params"&&(
        <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#4F46E5,#7C3AED)",padding:"74px 18px 40px"}}>
          <HomeBtn onHome={goHome}/>
          <div style={{maxWidth:520,margin:"0 auto"}}>
            <div className="ani" style={{textAlign:"center",marginBottom:22}}>
              <p style={{color:"rgba(255,255,255,0.78)",fontWeight:700,fontSize:15,margin:"0 0 4px"}}>Halo, <strong style={{color:"#FFD700"}}>{name}</strong>! 👋</p>
              <h2 style={{color:"#fff",fontFamily:"'Fredoka One',cursive",fontSize:24,margin:0}}>⚙️ Atur Parameter Belajar</h2>
            </div>

            <Card>
              {/* Kelas */}
              <div style={{marginBottom:20}}>
                <label style={{fontWeight:800,fontSize:13,color:"#6B21A8",display:"block",marginBottom:10}}>📚 Pilih Kelas</label>
                <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:7}}>
                  {[1,2,3,4,5,6].map(k=>(
                    <button key={k} onClick={()=>changeKelas(k)} style={{border:"none",borderRadius:12,padding:"10px 4px",fontSize:16,fontWeight:900,fontFamily:"inherit",cursor:"pointer",background:kelas===k?"#7C3AED":"#F3F0FF",color:kelas===k?"#fff":"#7C3AED",boxShadow:kelas===k?"0 4px 14px rgba(124,58,237,0.38)":"none",transition:"all .18s"}}>
                      {k}
                    </button>
                  ))}
                </div>
                <p style={{fontSize:11,color:"#9CA3AF",margin:"7px 0 0",fontWeight:700}}>{FASE[kelas]} · Kurikulum Merdeka</p>
              </div>

              {/* Tema */}
              <div style={{marginBottom:20}}>
                <label style={{fontWeight:800,fontSize:13,color:"#6B21A8",display:"block",marginBottom:8}}>🎯 Pilih Tema Materi</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {KURIKULUM[kelas].map(t=>(
                    <button key={t} onClick={()=>setTema(t)} style={{border:"none",borderRadius:99,padding:"7px 14px",fontSize:12,fontWeight:800,fontFamily:"inherit",cursor:"pointer",background:tema===t?"#7C3AED":"#F3F0FF",color:tema===t?"#fff":"#6B21A8",transition:"all .18s",boxShadow:tema===t?"0 3px 10px rgba(124,58,237,0.32)":"none"}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div style={{marginBottom:20}}>
                <label style={{fontWeight:800,fontSize:13,color:"#6B21A8",display:"block",marginBottom:8}}>🎮 Level Kesulitan</label>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {["Mudah","Sedang","Sulit"].map(l=>(
                    <button key={l} onClick={()=>changeLevel(l)} style={{border:"none",borderRadius:14,padding:"11px 6px",fontSize:13,fontWeight:800,fontFamily:"inherit",cursor:"pointer",background:level===l?LEVEL_COLOR[l].bg:"#F9FAFB",color:level===l?"#fff":"#6B7280",transition:"all .18s",boxShadow:level===l?"0 4px 14px rgba(0,0,0,0.2)":"none"}}>
                      {l==="Mudah"?"😊 Mudah":l==="Sedang"?"🤔 Sedang":"🔥 Sulit"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jumlah */}
              <div>
                <label style={{fontWeight:800,fontSize:13,color:"#6B21A8",display:"block",marginBottom:8}}>📝 Jumlah Soal</label>
                <div style={{display:"flex",gap:8}}>
                  {JUMLAH_OPTIONS[level].map(n=>(
                    <button key={n} onClick={()=>setJumlah(n)} style={{flex:1,border:"none",borderRadius:14,padding:"12px 4px",fontSize:16,fontWeight:900,fontFamily:"inherit",cursor:"pointer",background:jumlah===n?"#7C3AED":"#F3F0FF",color:jumlah===n?"#fff":"#7C3AED",transition:"all .18s",boxShadow:jumlah===n?"0 4px 14px rgba(124,58,237,0.35)":"none"}}>
                      {n} Soal
                    </button>
                  ))}
                </div>
                <p style={{fontSize:11,color:"#9CA3AF",margin:"7px 0 0",fontWeight:700}}>
                  {level==="Mudah"?"Mudah → otomatis 10 soal":level==="Sedang"?"Sedang → pilihan 10 atau 20 soal":"Sulit → pilihan 10, 20, atau 25 soal"}
                </p>
              </div>
            </Card>

            <div style={{background:"rgba(255,255,255,0.13)",borderRadius:16,padding:"12px 18px",marginBottom:16,textAlign:"center"}}>
              <p style={{color:"#fff",margin:0,fontSize:14,fontWeight:800}}>Kelas {kelas} SD · {tema} · {level} · {jumlah} Soal</p>
            </div>

            {error&&<p style={{color:"#FCA5A5",textAlign:"center",fontWeight:800,marginBottom:14,fontSize:14}}>{error}</p>}

            <Btn onClick={startGame} style={{background:"#FFD700",color:"#1F0080",width:"100%",fontSize:18,boxShadow:"0 4px 24px rgba(255,215,0,0.45)"}}>
              🚀 Mulai Soal!
            </Btn>
          </div>
        </div>
      )}

      {/* ═══ QUESTION ═══ */}
      {page==="question"&&q&&(
        <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#4F46E5,#7C3AED 60%,#A855F7)",padding:"66px 18px 36px"}}>
          <HomeBtn onHome={goHome}/>
          <div style={{maxWidth:540,margin:"0 auto"}}>

            {/* top bar */}
            <div style={{background:"rgba(255,255,255,0.13)",backdropFilter:"blur(8px)",borderRadius:18,padding:"10px 18px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#fff",fontWeight:800,fontSize:13}}>👤 {name}</span>
              <span style={{color:"#FFD700",fontWeight:900,fontSize:14}}>⭐ {score} poin</span>
            </div>

            {/* Banner pembahasan sebelumnya */}
            {prevSkipped&&idx>0&&!showPrevExpl&&(
              <div style={{background:"rgba(255,255,255,0.16)",borderRadius:14,padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                <span style={{color:"rgba(255,255,255,0.9)",fontSize:13,fontWeight:700,flex:1}}>
                  💡 Mau lihat pembahasan soal {idx}?
                </span>
                <button onClick={()=>setShowPrevExpl(true)}
                  style={{background:"rgba(255,255,255,0.25)",border:"none",borderRadius:10,padding:"6px 13px",color:"#fff",fontSize:12,fontWeight:900,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                  📖 Lihat
                </button>
              </div>
            )}

            {/* Pembahasan soal sebelumnya */}
            {showPrevExpl&&idx>0&&(
              <Card style={{background:"#EFF6FF",border:"2px solid #93C5FD",marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <h4 style={{color:"#1E40AF",fontFamily:"'Fredoka One',cursive",fontSize:15,margin:0}}>📖 Pembahasan Soal {idx} (Sebelumnya)</h4>
                  <button onClick={()=>setShowPrevExpl(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#93C5FD",padding:0}}>✕</button>
                </div>
                <div style={{background:"#DBEAFE",borderRadius:10,padding:"9px 13px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{background:"#1D4ED8",color:"#fff",borderRadius:8,padding:"2px 10px",fontWeight:900,fontSize:12}}>✓</span>
                  <strong style={{color:"#1E3A8A",fontSize:13}}>{questions[idx-1].jawaban}. {questions[idx-1].pilihan[questions[idx-1].jawaban]}</strong>
                </div>
                <p style={{color:"#1E40AF",fontSize:13,fontWeight:600,lineHeight:1.7,margin:0,whiteSpace:"pre-line"}}>{questions[idx-1].pembahasan}</p>
              </Card>
            )}

            {/* Soal card */}
            <Card>
              <ProgressBar current={idx+1} total={questions.length}/>
              <div style={{background:"linear-gradient(135deg,#7C3AED,#EC4899)",borderRadius:16,padding:"18px 20px",marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",borderRadius:99,padding:"3px 12px",fontSize:12,fontWeight:900}}>SOAL {idx+1} / {questions.length}</span>
                  <span style={{background:lc.bg,color:"#fff",borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:800}}>
                    {level==="Mudah"?"😊":level==="Sedang"?"🤔":"🔥"} {level}
                  </span>
                </div>
                <p style={{color:"#fff",fontSize:16,fontWeight:700,margin:0,lineHeight:1.65}}>{q.pertanyaan}</p>
              </div>

              {["A","B","C"].map((opt,oi)=>{
                let bg="#F3F0FF",col="#4C1D95",bdr="2px solid #DDD6FE",icon=null;
                if(confirmed){
                  if(opt===q.jawaban){bg="#D1FAE5";col="#065F46";bdr="2px solid #10B981";icon="✅";}
                  else if(opt===picked){bg="#FEE2E2";col="#991B1B";bdr="2px solid #EF4444";icon="❌";}
                  else{bg="#F9FAFB";col="#9CA3AF";bdr="2px solid #E5E7EB";}
                }else if(picked===opt){bg="#7C3AED";col="#fff";bdr="2px solid #7C3AED";}
                return(
                  <button key={opt} onClick={()=>choose(opt)} disabled={confirmed}
                    style={{width:"100%",border:bdr,borderRadius:14,padding:"13px 16px",fontSize:15,fontWeight:700,fontFamily:"inherit",cursor:confirmed?"default":"pointer",background:bg,color:col,textAlign:"left",marginBottom:9,display:"flex",alignItems:"center",gap:12,transition:"all .2s",animation:`slideUp .3s ease-out ${oi*.1}s both`}}>
                    <span style={{background:confirmed?(opt===q.jawaban?"#10B981":opt===picked?"#EF4444":"#E5E7EB"):(picked===opt?"rgba(255,255,255,0.25)":"#DDD6FE"),color:confirmed?(opt===q.jawaban?"#fff":opt===picked?"#fff":"#9CA3AF"):(picked===opt?"#fff":"#7C3AED"),borderRadius:8,padding:"3px 10px",fontWeight:900,fontSize:13,minWidth:28,textAlign:"center"}}>
                      {opt}
                    </span>
                    <span style={{flex:1}}>{q.pilihan[opt]}</span>
                    {icon&&<span style={{fontSize:18,marginLeft:"auto"}}>{icon}</span>}
                  </button>
                );
              })}

              {!confirmed&&<p style={{textAlign:"center",color:"#9CA3AF",fontSize:13,fontWeight:700,marginTop:6}}>👆 Pilih salah satu jawaban di atas</p>}
            </Card>

            {/* ═══ FEEDBACK BENAR ═══ */}
            {confirmed&&isCorrect&&(
              <Card style={{background:"linear-gradient(135deg,#D1FAE5,#A7F3D0)",border:"2px solid #10B981"}}>
                <div style={{textAlign:"center",marginBottom:16}}>
                  <div style={{fontSize:50,marginBottom:6}}>🚀</div>
                  <h3 style={{color:"#065F46",fontFamily:"'Fredoka One',cursive",fontSize:22,margin:"0 0 4px"}}>Kamu Hebat!</h3>
                  <p style={{color:"#047857",fontWeight:700,margin:0,fontSize:14}}>Jawaban benar! +1 poin ⭐</p>
                </div>

                {/* === 2 TOMBOL INDEPENDEN === */}
                <div style={{display:"flex",gap:10,marginBottom:10}}>
                  <Btn onClick={handleLanjutDirect}
                    style={{background:"#10B981",color:"#fff",flex:1,boxShadow:"0 4px 16px rgba(16,185,129,0.38)"}}>
                    {isLast?"📊 Lihat Hasil":"➡ Lanjut Soal"}
                  </Btn>
                  <Btn onClick={()=>setShowExpl(v=>!v)}
                    style={{background:"#fff",color:"#065F46",border:"2px solid #10B981",flex:1}}>
                    📖 {showExpl?"Tutup Pembahasan":"Lihat Pembahasan"}
                  </Btn>
                </div>
                <p style={{fontSize:11,color:"#047857",textAlign:"center",margin:0,fontWeight:700}}>
                  Kamu bebas lanjut langsung atau baca pembahasan dulu 🙂
                </p>
              </Card>
            )}

            {/* ═══ FEEDBACK SALAH ═══ */}
            {confirmed&&isWrong&&(
              <Card style={{background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",border:"2px solid #F59E0B"}}>
                <div style={{textAlign:"center",marginBottom:16}}>
                  <div style={{fontSize:50,marginBottom:6}}>😊</div>
                  <h3 style={{color:"#78350F",fontFamily:"'Fredoka One',cursive",fontSize:22,margin:"0 0 4px"}}>Tenang, Coba Lagi ya!</h3>
                  <p style={{color:"#92400E",fontWeight:700,margin:0,fontSize:14}}>Kamu pasti bisa! Semangat! 💪</p>
                </div>
                <div style={{display:"flex",gap:10,marginBottom:showExpl?12:0}}>
                  <Btn onClick={handleCobаLagi}
                    style={{background:"#fff",color:"#78350F",border:"2px solid #F59E0B",flex:1}}>
                    🔄 Coba Lagi
                  </Btn>
                  <Btn onClick={()=>setShowExpl(v=>!v)}
                    style={{background:"#F59E0B",color:"#fff",flex:1}}>
                    📖 {showExpl?"Tutup":"Lihat Pembahasan"}
                  </Btn>
                </div>
              </Card>
            )}

            {/* ═══ PEMBAHASAN (current) ═══ */}
            {confirmed&&showExpl&&(
              <Card style={{background:"#EFF6FF",border:"2px solid #93C5FD"}}>
                <h4 style={{color:"#1E40AF",fontFamily:"'Fredoka One',cursive",fontSize:17,margin:"0 0 12px",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:22}}>📖</span> Pembahasan Soal {idx+1}
                </h4>
                <div style={{background:"#DBEAFE",borderRadius:12,padding:"9px 13px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{background:"#1D4ED8",color:"#fff",borderRadius:8,padding:"2px 10px",fontWeight:900,fontSize:12}}>✓ Benar</span>
                  <strong style={{color:"#1E3A8A",fontSize:14}}>{q.jawaban}. {q.pilihan[q.jawaban]}</strong>
                </div>
                <p style={{color:"#1E40AF",fontSize:14,fontWeight:600,lineHeight:1.75,margin:"0 0 16px",whiteSpace:"pre-line"}}>{q.pembahasan}</p>

                {/* Tombol lanjut di dalam pembahasan */}
                <Btn onClick={handleLanjutFromExpl}
                  style={{background:"#1D4ED8",color:"#fff",width:"100%"}}>
                  {isLast?"📊 Lihat Hasil →":"➡ Lanjut Soal →"}
                </Btn>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ═══ RESULTS ═══ */}
      {page==="results"&&(
        <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#4F46E5,#7C3AED,#EC4899)",padding:"72px 18px 40px",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <HomeBtn onHome={goHome}/>
          <div style={{maxWidth:500,width:"100%"}}>
            <div className="ani" style={{textAlign:"center",marginBottom:22}}>
              <div style={{fontSize:80,animation:"pulse 1.5s ease-in-out infinite"}}>{pct>=80?"🏆":"📚"}</div>
              <h2 style={{color:"#fff",fontFamily:"'Fredoka One',cursive",fontSize:28,margin:"10px 0 4px"}}>Hasil Belajarmu!</h2>
              <p style={{color:"rgba(255,255,255,0.78)",fontWeight:700,margin:0,fontSize:14}}>{name} · Kelas {kelas} SD · {tema}</p>
            </div>

            <Card>
              {/* Score ring */}
              <div style={{position:"relative",width:160,height:160,margin:"0 auto 24px"}}>
                <svg viewBox="0 0 160 160" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}>
                  <circle cx="80" cy="80" r="68" fill="none" stroke="#E9D5FF" strokeWidth="13"/>
                  <circle cx="80" cy="80" r="68" fill="none"
                    stroke={pct>=80?"#10B981":"#F59E0B"} strokeWidth="13"
                    strokeDasharray={`${2*Math.PI*68*pct/100} ${2*Math.PI*68}`}
                    strokeLinecap="round" transform="rotate(-90 80 80)"
                    style={{transition:"stroke-dasharray 1.5s ease"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:32,fontWeight:900,color:pct>=80?"#065F46":"#78350F",fontFamily:"'Fredoka One',cursive"}}>{pct}%</span>
                  <span style={{fontSize:13,color:"#6B7280",fontWeight:700}}>{score}/{questions.length} benar</span>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
                {[{l:"Benar",v:score,bg:"#D1FAE5",col:"#10B981"},{l:"Salah",v:questions.length-score,bg:"#FEE2E2",col:"#EF4444"},{l:"Total",v:questions.length,bg:"#EDE9FE",col:"#7C3AED"}].map(s=>(
                  <div key={s.l} style={{background:s.bg,borderRadius:14,padding:"13px 8px",textAlign:"center"}}>
                    <p style={{margin:"0 0 3px",fontSize:24,fontWeight:900,color:s.col,fontFamily:"'Fredoka One',cursive"}}>{s.v}</p>
                    <p style={{margin:0,fontSize:11,color:s.col,fontWeight:800}}>{s.l}</p>
                  </div>
                ))}
              </div>

              <div style={{background:pct>=80?"linear-gradient(135deg,#D1FAE5,#A7F3D0)":"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:16,padding:20,marginBottom:20}}>
                <p style={{fontFamily:"'Fredoka One',cursive",fontSize:19,color:pct>=80?"#065F46":"#78350F",margin:"0 0 6px"}}>
                  {pct>=80?"🌟 Hebat! Pertahankan Prestasimu!":"💪 Semangat ya! Kamu Pasti Bisa!"}
                </p>
                <p style={{color:pct>=80?"#047857":"#92400E",fontWeight:700,margin:0,fontSize:13,lineHeight:1.6}}>
                  {pct>=80
                    ?"Kamu luar biasa! Lanjut ke materi berikutnya dan terus berprestasi! 🚀"
                    :"Coba ulangi materinya agar lebih paham. Kamu pasti bisa lebih baik! 💡"}
                </p>
              </div>

              <div style={{display:"flex",gap:10}}>
                <Btn onClick={regen} style={{background:"#7C3AED",color:"#fff",flex:1,boxShadow:"0 4px 16px rgba(124,58,237,0.38)"}}>
                  🔄 Buat Soal Berbeda
                </Btn>
                <Btn onClick={()=>setPage("params")} style={{background:"#F3F0FF",color:"#7C3AED",flex:1}}>
                  ⚙️ Parameter Baru
                </Btn>
              </div>
            </Card>

            <Btn onClick={goHome} style={{background:"rgba(255,255,255,0.14)",color:"#fff",width:"100%",border:"2px solid rgba(255,255,255,0.28)",fontSize:15,marginTop:4}}>
              🏠 Kembali ke Home
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
