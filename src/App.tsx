// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Zap, ChevronRight, RefreshCcw, Loader2, Star, ShieldCheck, Gem, Quote, ExternalLink, Layers, X, CheckCircle, Flame, Heart, User, GraduationCap, Award } from 'lucide-react';

const App = () => {
  // --- 狀態管理 ---
  const [stage, setStage] = useState('welcome'); // welcome, quiz, result, faculty
  const [currentCard, setCurrentCard] = useState(0);
  const [scores, setScores] = useState({ intuition: 0, skill: 0, market: 0, empathy: 0 });
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContract, setShowContract] = useState(false);
 const apiKey = process.env.REACT_APP_GEMINI_KEY || ""; 

  // --- 師資陣容 (陳高生主任核心) ---
  const facultyData = {
    head: { 
      name: "陳高生 主任", 
      title: "時尚產業戰略家 / 嶺東流設靈魂人物", 
      skill: "整體造型設計 / 時尚品牌戰略", 
      desc: "主任將教妳如何把『愛美』這件小事，運作成『壟斷市場產值』的大事。在他的輔導下，妳的審美將具備商業統治力。" 
    },
    mentors: [
      { field: "彩妝造型領航群", desc: "專精國際伸展台與影視視覺輸出，負責磨練妳的專業精準度。" },
      { field: "美髮設計大師團", desc: "擁有業界頂尖手感，負責將妳的技術耐力提升至職人天花板。" },
      { field: "醫學美容管理組", desc: "結合科學與美學，將變美這件事轉化為理性的高產值護城河。" },
      { field: "藝術美甲美睫組", desc: "在毫釐之間創造價值，手把手輔導妳的變現與創業能力。" }
    ]
  };

  // --- 七階占卜陣 (甜酷風格 Prompt) ---
  const deck = [
    {
      id: 1,
      category: 'intuition',
      cardName: "THE EYE OF TRUTH",
      title: "【天賦】洞察之眼",
      description: "妳看鏡子時，是在欣賞自己，還是在掃描可以改進的缺陷？",
      prompt: "High-end fashion manga, close-up of a girl's eye, iris reflecting a futuristic clothing line. Sweet and cool aesthetic, soft pink gradients mixed with charcoal gray, sharp editorial lines, high resolution.",
      options: [
        { text: "我連看路人都在自動優化對方的造型比例", score: 3 },
        { text: "我對色彩與材質有病態般的堅持與敏感", score: 2 },
        { text: "我喜歡被美的事物包圍，但還沒找到出口", score: 1 }
      ]
    },
    {
      id: 2,
      category: 'skill',
      cardName: "THE CHROME BLADE",
      title: "【修煉】鉻金之刃",
      description: "當同學在讀書，妳在練習拿剪刀或刷具，妳覺得那是...",
      prompt: "Single pair of professional hair scissors, liquid metal texture. Soft pink neon glow against a dark ash gray background. High fashion manga style, elegant and sharp.",
      options: [
        { text: "這才是我的正業，讀書只是順便", score: 3 },
        { text: "這是通往自由的武器，我願意練到手感爆炸", score: 2 },
        { text: "這是興趣，但我渴望把它變成我的超能力", score: 1 }
      ]
    },
    {
      id: 3,
      category: 'market',
      cardName: "THE GOLDEN AIRBRUSH",
      title: "【產值】金質魔杖",
      description: "美感如果不拿來變現，難道要拿來當遺產嗎？",
      prompt: "A hand with metallic pink nails holding a chrome airbrush, spraying rose gold sparkles. Sweet-cool palette, dark gray tones with vibrant pink accents, fashion concept art.",
      options: [
        { text: "我要創造出一眼就能統治市場的個人品牌", score: 3 },
        { text: "我想掌握高端技術，讓客人排隊求我變美", score: 2 },
        { text: "專業證照就是我的溢價資本，不做廉價美學", score: 1 }
      ]
    },
    {
      id: 4,
      category: 'empathy',
      cardName: "THE MIRROR OF SLAY",
      title: "【重塑】自信之源",
      description: "看到自卑的路人在妳手中變成神，妳的內心獨白是？",
      prompt: "Emotional manga scene, a stylist transforming a client. Soft pink light beams, charcoal gray shadows, transformation magic, stylish and heartwarming.",
      options: [
        { text: "歡迎來到我的美學聖殿，下一個是誰？", score: 3 },
        { text: "這就是我想追求的權力：定義他人的美麗", score: 2 },
        { text: "這份溫度與成就感，是其他職業給不了我的", score: 1 }
      ]
    },
    {
      id: 5,
      category: 'skill',
      cardName: "THE CHEMICAL SERUM",
      title: "【科學】美力鍊金",
      description: "妳知道皮膚與化學配方的關聯，其實是種理性的浪漫嗎？",
      prompt: "Modern beauty lab, pink luminous serums in glass vials. Dark gray lab aesthetic, neon highlights, scientific fashion art, high resolution.",
      options: [
        { text: "成分與配方才是美的核心邏輯，我愛科學感", score: 3 },
        { text: "用最短時間達到最顯著效果，才是真專業", score: 2 },
        { text: "我喜歡鑽研各種質地與層次帶來的感官體驗", score: 1 }
      ]
    },
    {
      id: 6,
      category: 'intuition',
      cardName: "THE DIGITAL LOOM",
      title: "【趨勢】數位織機",
      description: "AI 正在掃蕩低端美感。妳如何在這場數位風暴中生存？",
      prompt: "Cyberpunk runway, holographic pink threads weaving a gray dress. Glitch art, futuristic fashion manga, cool grey and sweet pink palette.",
      options: [
        { text: "駕馭 AI 作為我的大腦，手感技術則是我的靈魂", score: 3 },
        { text: "我會深耕技術，AI 永遠無法取代職人的觸感", score: 2 },
        { text: "這波趨勢我一定要跟上，不能當舊時代的殘黨", score: 1 }
      ]
    },
    {
      id: 7,
      category: 'market',
      cardName: "THE DEAN'S CONTRACT",
      title: "【結盟】最終契約",
      description: "現在，妳準備好將這份『偏執』化為統治未來的資產了嗎？",
      prompt: "A contract glowing with rose pink light, surrounded by professional tools on a dark velvet surface. Sweet and cool aesthetic, elegant but edgy.",
      options: [
        { text: "簽了！我要讓這世界看見我的審美高度", score: 3 },
        { text: "我想認識陳主任，聽聽他如何改造我的人生", score: 2 },
        { text: "我渴望被專業引導，不再只是當個愛漂亮的路人", score: 1 }
      ]
    }
  ];

  const results = {
    high: {
      title: "【時尚暴君】視覺主理人",
      prompt: "Masterpiece fashion tarot cover. A queen sitting on a chrome throne. Rose pink and obsidian gray theme, ultra-stylish boss aura.",
      desc: "妳的天賦屬於『降維打擊』級別。普通人的美感是消費品，妳的是統治市場的核武。",
      career: ["時尚品牌藝術總監", "影視御用造型師", "視覺實驗室主理人"],
      advice: "孩子，妳這不叫愛漂亮，這叫對視覺主權的絕對壟斷。陳高生主任常說：沒有技術支撐的美感只是泡沫。進來領取妳的皇冠，我們一起讓這平庸的世界跪在妳的色票前。",
      contractTitle: "頂尖美學主權協定",
      guarantee: "保證由陳高生主任團隊引導，將妳的審美天賦轉化為具備絕對溢價的專業權力。"
    },
    mid: {
      title: "【美感戰神】技術派印鈔機",
      prompt: "Dynamic fashion manga, girl with cybernetic gear. Electric pink and neon silver-gray, intense vibe, stylish workspace.",
      desc: "妳擁有驚人的『技術韌性』。妳就是那種靠一雙手，就能讓全世界乖乖排隊付錢的狠角色。",
      career: ["高階美甲美睫師", "專業醫美導師", "婚禮視覺顧問"],
      advice: "聽著，妳的手感比妳的廢話更值錢。在嶺東流設，我們把妳的興趣磨成沒人能模仿的護城河。陳主任已經幫妳看好路了，進來練技術，然後去優雅地數鈔票吧。",
      contractTitle: "極致技術變現條約",
      guarantee: "保證授予流設系硬核實力，讓妳在美學產業中擁有點石成金的生存底氣。"
    },
    low: {
      title: "【氛圍神探】靈魂修護師",
      prompt: "Aesthetic healing fashion manga. Soft pink vapors, dark gray accents, minimalist luxury, calm aura.",
      desc: "妳擅長捕捉『氣氛』。在這個焦慮的時代，妳的溫柔技術就是最昂貴的奢侈品。",
      career: ["皮膚管理專家", "頭皮健康導師", "時尚採購分析師"],
      advice: "美，不一定要張揚。陳主任常提醒：細膩才是壟斷市場的殺手鐧。讓嶺東流設的專業科學輔導妳，把妳的溫柔雕琢成別人搶不走的商業產值。這是最聰明的投資。",
      contractTitle: "美力情緒壟斷協議",
      guarantee: "保證授予科學美學認證，讓妳的感官直覺轉化為高端商業管理水平。"
    }
  };

  // --- 核心函數 ---
 const handleChoice = (score: number, category: string) => {
    setScores(prev => ({ ...prev, [category]: prev[category] + score }));
    if (currentCard < deck.length - 1) {
      setCurrentCard(prev => prev + 1);
    } else {
      setStage('result');
    }
  };

  const generateImage = async (prompt) => {
  setIsLoading(true);
  setImageUrl('');
  let retries = 0;
  const maxRetries = 3;
  
  const callApi = async () => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
          })
        }
      );
      const result = await response.json();
      const parts = result.candidates?.[0]?.content?.parts;
      const imgPart = parts?.find((p) => p.inlineData);
      if (imgPart) {
        setImageUrl(`data:image/png;base64,${imgPart.inlineData.data}`);
      }
    } catch (error) {
      if (retries < maxRetries) {
        retries++;
        await new Promise(res => setTimeout(res, Math.pow(2, retries) * 1000));
        return callApi();
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  await callApi();
};
   
  useEffect(() => {
    if (stage === 'quiz') {
      generateImage(deck[currentCard].prompt);
    } else if (stage === 'result') {
      const total = scores.intuition + scores.skill + scores.market + scores.empathy;
      let final = total >= 16 ? results.high : total >= 10 ? results.mid : results.low;
      generateImage(final.prompt);
    }
  }, [stage, currentCard]);

  const finalResult = useMemo(() => {
    const total = scores.intuition + scores.skill + scores.market + scores.empathy;
    if (total >= 16) return results.high;
    if (total >= 10) return results.mid;
    return results.low;
  }, [scores]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#8e8e8e] flex flex-col items-center justify-center p-6 font-sans overflow-x-hidden selection:bg-[#ff85a2] selection:text-white">
      
      {/* Sweet-Cool Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_#2c2c2c_0%,_#1a1a1a_60%)]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ff85a2]/5 rounded-full blur-[200px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8e8e8e]/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-md w-full relative mx-auto">
        
        {stage === 'welcome' && (
          <div className="space-y-12 animate-in fade-in zoom-in duration-1000">
            <div className="relative bg-[#1a1a1a] border-[4px] border-[#ff85a2]/30 p-12 rounded-[4rem] shadow-[0_0_80px_rgba(255,133,162,0.1)] text-center space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black tracking-[0.8em] text-[#ff85a2]/60 uppercase">Future Oracle</p>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">
                  嶺東科大流設系<br/>
                  <span className="bg-gradient-to-r from-[#ff85a2] to-[#ff4d6d] bg-clip-text text-transparent text-5xl">算出未來</span>
                </h1>
              </div>

              <div className="relative h-72 border-2 border-white/5 rounded-[3rem] overflow-hidden bg-[#2c2c2c] group">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-8 text-left">
                  <p className="text-[#ff85a2] text-xs font-black tracking-[0.4em] italic leading-tight">#甜酷態度<br/>#專業本能</p>
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-xs text-[#8e8e8e] leading-relaxed font-bold italic px-4">
                  「這不只是測驗，這是妳與大師主任的契約。<br/>妳的甜酷感，將由最頂尖的團隊親自磨練。」
                </p>
                <button 
                  onClick={() => setStage('quiz')}
                  className="w-full py-6 bg-[#ff85a2] text-white rounded-full font-black text-2xl hover:bg-[#ff4d6d] hover:shadow-[0_0_50px_rgba(255,133,162,0.4)] transition-all flex items-center justify-center gap-4"
                >
                  啟動七階占卜 <Zap fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'quiz' && (
          <div className="bg-[#1a1a1a] border-2 border-white/5 rounded-[4rem] p-8 space-y-8 shadow-2xl relative overflow-hidden text-center">
            <div className="flex justify-between items-end px-4">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-[#ff85a2] tracking-widest uppercase italic opacity-60">Step 0{currentCard + 1}</span>
                <span className="text-[14px] font-black text-white italic uppercase tracking-tighter">{deck[currentCard].cardName}</span>
              </div>
              <div className="flex gap-1 pb-1">
                {deck.map((_, i) => (
                  <div key={i} className={`h-1 w-4 transition-all ${i <= currentCard ? 'bg-[#ff85a2]' : 'bg-white/5'}`}></div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[3/4.2] rounded-[3rem] overflow-hidden bg-[#2c2c2c] border border-white/5 flex items-center justify-center group mx-auto">
              {isLoading ? (
                <div className="flex flex-col items-center gap-6">
                  <Loader2 className="w-14 h-14 text-[#ff85a2] animate-spin" />
                  <p className="text-[10px] font-black text-[#ff85a2] animate-pulse tracking-[0.4em]">召喚分鏡中...</p>
                </div>
              ) : (
                imageUrl && <img src={imageUrl} alt="Manga Scenario" className="w-full h-full object-cover animate-in fade-in duration-1000 group-hover:scale-105 transition-transform duration-[4s]" />
              )}
              
              <div className="absolute top-0 left-0 w-full p-6 text-left">
                <h2 className="text-sm font-black bg-[#ff85a2] text-white px-4 py-1.5 inline-block skew-x-[-15deg] shadow-xl italic uppercase">
                   {deck[currentCard].title}
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-xs text-center font-bold text-[#8e8e8e] italic leading-relaxed px-4 min-h-[40px]">
                「{deck[currentCard].description}」
              </p>
              <div className="space-y-3">
                {deck[currentCard].options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={isLoading}
                    onClick={() => handleChoice(opt.score, deck[currentCard].category)}
                    className="w-full p-5 text-left bg-[#2c2c2c] border border-white/5 rounded-2xl font-bold text-sm text-[#8e8e8e] hover:border-[#ff85a2] hover:text-white transition-all flex items-center justify-between group disabled:opacity-30"
                  >
                    <span className="flex-1 pr-4">{opt.text}</span>
                    <ChevronRight size={16} className="text-[#ff85a2]/30 group-hover:text-[#ff85a2] transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {stage === 'result' && (
          <div className="space-y-8 animate-in zoom-in-95 duration-1000 relative">
            <div className="bg-[#1a1a1a] border-[4px] border-[#ff85a2]/40 rounded-[5rem] p-10 shadow-2xl text-center space-y-10 overflow-hidden relative">
              <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#ff85a2]/10 rounded-full border border-[#ff85a2]/20 mb-2">
                    <Gem size={12} className="text-[#ff85a2] animate-bounce" />
                    <span className="text-[10px] font-black text-[#ff85a2] tracking-[0.5em] uppercase">Fate Decoded</span>
                </div>
                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                    {finalResult.title}
                </h2>
              </div>

              <div className="relative aspect-[3/4.2] rounded-[3.5rem] overflow-hidden border-2 border-white/10 shadow-2xl group mx-auto max-w-[300px] bg-[#2c2c2c]">
                {isLoading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-14 h-14 text-[#ff85a2] animate-spin" />
                    <p className="text-[10px] font-black text-[#ff85a2] tracking-widest uppercase">渲染未來中...</p>
                  </div>
                ) : (
                  imageUrl && <img src={imageUrl} alt="Result Card" className="w-full h-full object-cover animate-in zoom-in duration-1000" />
                )}
              </div>

              <div className="text-left space-y-10 relative z-10 pt-4">
                <div className="p-10 bg-[#2c2c2c] border-l-[12px] border-[#ff85a2] rounded-r-[3rem] shadow-inner relative">
                  <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-[#1a1a1a] px-6 py-2 border border-[#ff85a2]/30 text-[#ff85a2] text-[10px] font-black tracking-widest uppercase">系主任判詞</div>
                  <div className="flex items-center gap-3 mb-6 opacity-60">
                    <ShieldCheck size={24} className="text-[#ff85a2]" />
                    <span className="text-xs font-black tracking-[0.2em] text-white italic uppercase">Dean's Professional Insight</span>
                  </div>
                  <p className="text-[15px] font-black leading-relaxed text-white italic mb-8 border-b border-white/10 pb-6 text-center">
                    「{finalResult.advice}」
                  </p>
                  <p className="text-[12px] text-[#8e8e8e] leading-relaxed font-bold italic">
                     {finalResult.desc}
                  </p>
                </div>
              </div>

              <div className="pt-10 space-y-6">
                <button 
                  onClick={() => setStage('faculty')}
                  className="w-full py-8 bg-[#ff85a2] text-white rounded-full font-black text-2xl shadow-[0_20px_50px_rgba(255,133,162,0.2)] hover:bg-[#ff4d6d] transition-all flex items-center justify-center gap-4 group"
                >
                  認識領航大師群 <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <button onClick={() => { setStage('welcome'); setCurrentCard(0); setScores({ intuition: 0, skill: 0, market: 0, empathy: 0 }); }} className="text-[10px] font-black text-[#8e8e8e]/40 uppercase tracking-[0.8em] flex items-center justify-center gap-3 w-full hover:text-[#ff85a2] transition-colors">
                  <RefreshCcw size={14} /> Rewrite Destiny
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'faculty' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-700">
             <div className="bg-[#1a1a1a] border-[4px] border-[#ff85a2]/30 rounded-[4.5rem] p-8 shadow-2xl space-y-8">
                <div className="text-center space-y-2">
                    <GraduationCap className="w-12 h-12 text-[#ff85a2] mx-auto mb-2" />
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">領航導師群</h2>
                    <p className="text-[10px] font-bold text-[#8e8e8e] tracking-widest uppercase">The Elite Faculty of LTU Fashion</p>
                </div>

                <div className="grid grid-cols-1 gap-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                    {/* 陳高生主任 */}
                    <div className="p-8 bg-[#ff85a2]/5 border-2 border-[#ff85a2]/20 rounded-[3rem] shadow-lg relative group">
                        <div className="flex justify-between items-start mb-4 text-left">
                            <div className="space-y-1">
                                <h4 className="text-2xl font-black text-[#ff85a2]">{facultyData.head.name}</h4>
                                <p className="text-[10px] font-black text-[#8e8e8e] uppercase tracking-widest">{facultyData.head.title}</p>
                            </div>
                            <Award className="text-[#ff85a2]" />
                        </div>
                        <p className="text-[11px] font-black text-white bg-[#ff85a2]/40 px-4 py-1.5 rounded-full inline-block mb-4 italic text-left">
                            核心專長：{facultyData.head.skill}
                        </p>
                        <p className="text-[11px] text-[#8e8e8e] leading-relaxed text-left italic font-bold">
                            {facultyData.head.desc}
                        </p>
                    </div>

                    {facultyData.mentors.map((mentor, i) => (
                        <div key={i} className="p-6 bg-[#2c2c2c] border border-white/5 rounded-3xl group hover:border-[#ff85a2]/30 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <ShieldCheck className="text-[#ff85a2]/40 group-hover:text-[#ff85a2]" />
                                <h4 className="text-sm font-black text-white/90 uppercase tracking-widest text-left">{mentor.field}</h4>
                            </div>
                            <p className="text-[10px] text-[#8e8e8e] leading-relaxed text-left italic">
                                {mentor.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="pt-6 space-y-4">
                    <button 
                        onClick={() => setShowContract(true)}
                        className="w-full py-7 bg-[#ff85a2] text-white rounded-[2.5rem] font-black text-xl hover:bg-[#ff4d6d] shadow-lg"
                    >
                        領取妳的職人契約
                    </button>
                    <button onClick={() => setStage('result')} className="w-full py-2 text-[#8e8e8e]/40 font-bold hover:text-white transition-colors">
                         返回測驗結果
                    </button>
                </div>
             </div>
          </div>
        )}

        {/* --- 甜酷風契約彈窗 --- */}
        {showContract && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowContract(false)}></div>
            <div className="relative w-full max-w-sm bg-[#1a1a1a] border-[4px] border-[#ff85a2]/60 rounded-[3.5rem] p-10 shadow-[0_0_120px_rgba(255,133,162,0.3)] space-y-8 animate-in zoom-in-95 duration-500 overflow-hidden text-left">
              <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-[#ff85a2] to-transparent"></div>
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-[#ff85a2] tracking-[0.3em] uppercase italic opacity-60 text-left">Admission Protocol</p>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none text-left">{finalResult.contractTitle}</h3>
                </div>
                <button onClick={() => setShowContract(false)} className="text-white/20 hover:text-[#ff85a2] transition-colors p-1.5">
                  <X size={30} />
                </button>
              </div>

              <div className="space-y-6 py-8 border-y border-white/5">
                <div className="space-y-3">
                  <p className="text-[10px] text-[#8e8e8e] uppercase font-black italic tracking-widest text-left">被保證人 / THE PROTAGONIST</p>
                  <div className="p-6 bg-[#ff85a2]/5 rounded-[2rem] border border-[#ff85a2]/20 text-[#ff85a2] font-black text-2xl italic tracking-tighter shadow-inner text-center">
                    {finalResult.title}
                  </div>
                </div>
                
                <div className="space-y-5 text-left">
                  <p className="text-[10px] text-[#8e8e8e] uppercase font-black tracking-widest italic opacity-60">保證條款 / LTU ELITE GUARANTEE</p>
                  <div className="flex gap-4 items-start">
                    <CheckCircle className="text-[#ff85a2] shrink-0 w-6 h-6 mt-0.5 animate-pulse" />
                    <p className="text-sm text-white/95 leading-relaxed font-bold italic">
                      {finalResult.guarantee}
                    </p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <CheckCircle className="text-[#ff85a2] shrink-0 w-6 h-6 mt-0.5" />
                    <p className="text-sm text-white/95 leading-relaxed font-bold italic">
                      由陳高生主任親自導航，將妳的審美天賦轉化為不可撼動的產值護城河。
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 text-center space-y-8">
                <div className="flex flex-col items-center gap-3 opacity-30 group">
                    <Flame className="w-14 h-14 text-[#ff85a2]" />
                    <p className="text-[9px] font-black text-[#8e8e8e] tracking-[0.6em] uppercase leading-none">嶺東流設 // 甜酷未來</p>
                </div>
                <button 
                  onClick={() => window.open('https://fashion.ltu.edu.tw/p/412-1018-1319.php?Lang=zh-tw', '_blank')}
                  className="w-full py-6.5 bg-white text-black rounded-3xl font-black text-xl shadow-xl hover:bg-[#ff85a2] hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  前往官網與主任會面 <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ff85a2; border-radius: 10px; }
        body { background-color: #1a1a1a; overscroll-behavior: none; }
      `}} />

      <footer className="mt-16 text-[10px] font-black tracking-[3em] text-white/5 uppercase text-center animate-pulse">
        LTU FASHION DESIGN // SWEET COOL REVOLUTION
      </footer>
    </div>
  );
};

export default App;
