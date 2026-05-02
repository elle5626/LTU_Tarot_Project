// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import {
  Zap,
  ChevronRight,
  RefreshCcw,
  Loader2,
  ShieldCheck,
  Gem,
  ExternalLink,
  X,
  CheckCircle,
  Flame,
  GraduationCap,
  Award,
} from "lucide-react";

const App = () => {
  const [stage, setStage] = useState("welcome");
  const [currentCard, setCurrentCard] = useState(0);
  const [scores, setScores] = useState({
    intuition: 0,
    skill: 0,
    market: 0,
    empathy: 0,
  });
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || "";

  const facultyData = {
    head: {
      name: "陳高生 主任",
      title: "時尚產業戰略家",
      skill: "整體造型 / 時尚美學概論",
      desc: "流設系的靈魂人物。他將帶領妳跳出『愛漂亮』的層次，進入『統治時尚』的戰略高度。",
    },
    mentors: [
      {
        field: "彩妝造型領航大師",
        desc: "專精於國際伸展台與影視特效妝容，負責磨練妳視覺輸出的精準度。",
      },
      {
        field: "美髮設計技術專家",
        desc: "擁有業界頂尖手感，負責將妳的技術耐力提升至職人天花板。",
      },
      {
        field: "醫學美容諮詢導師",
        desc: "結合科學與美學管理，將『美』轉化為理性的高產值護城河。",
      },
      {
        field: "美甲美睫藝術教練",
        desc: "在微小細節中創造極致價值，手把手輔導妳的變現能力。",
      },
    ],
  };

  const deck = [
    {
      id: 1,
      category: "intuition",
      cardName: "THE EYE OF TRUTH",
      title: "【天賦】洞察之眼",
      description: "妳看鏡子時，是在欣賞自己，還是在掃描可以改進的缺陷？",
      prompt:
        "Macro close-up of a sharp digital eye, iris reflecting a futuristic clothing line. Neon purple and acid green lighting, fashion manga style, sharp editorial lines.",
      options: [
        { text: "我連看路人都在自動優化對方的造型比例", score: 3 },
        { text: "我對色彩與材質有病態般的堅持與敏感", score: 2 },
        { text: "我喜歡被美的事物包圍，但還沒找到出口", score: 1 },
      ],
    },
    {
      id: 2,
      category: "skill",
      cardName: "THE CHROME BLADE",
      title: "【修煉】鉻金之刃",
      description: "當同學在讀書，妳在練習拿剪刀或刷具，妳覺得那是...",
      prompt:
        "Sleek professional chrome hair scissors floating in a halo of neon purple light. Minimalist, liquid metal texture, sharp focus, fashion concept art.",
      options: [
        { text: "這才是我的正業，讀書只是順便", score: 3 },
        { text: "這是通往自由的武器，我願意練到手感爆炸", score: 2 },
        { text: "這是興趣，但我渴望把它變成我的超能力", score: 1 },
      ],
    },
    {
      id: 3,
      category: "market",
      cardName: "THE GOLDEN AIRBRUSH",
      title: "【產值】金質魔杖",
      description: "美感如果不拿來變現，難道要拿來當遺產嗎？",
      prompt:
        "Close up of a hand with chrome nails holding a high-end airbrush tool, spraying golden sparkles that form luxury symbols. Acid graphics, high fashion art.",
      options: [
        { text: "我要創造出一眼就能統治市場的個人品牌", score: 3 },
        { text: "我想掌握高端技術，讓客人排隊求我變美", score: 2 },
        { text: "專業證照就是我的溢價資本，我不做廉價美學", score: 1 },
      ],
    },
    {
      id: 4,
      category: "empathy",
      cardName: "THE MIRROR OF SLAY",
      title: "【重塑】自信之源",
      description: "看到自卑的路人在妳手中變成神，妳的內心獨白是？",
      prompt:
        "Aesthetic manga illustration of a transformation scene, glowing silhouette of a stylist behind a client. Emotional sparkles, high energy, purple theme.",
      options: [
        { text: "歡迎來到我的美學聖殿，下一個是誰？", score: 3 },
        { text: "這就是我想追求的權力：定義他人的美麗", score: 2 },
        { text: "這份溫度與成就感，是其他職業給不了我的", score: 1 },
      ],
    },
    {
      id: 5,
      category: "skill",
      cardName: "THE CHEMICAL SERUM",
      title: "【科學】美力鍊金",
      description: "妳知道皮膚與化學配方的關聯，其實是種理性的浪漫嗎？",
      prompt:
        "Modern laboratory scene, luminous neon serums in glass vials reflecting fashion models. Acid green lighting, high resolution, scientific beauty aesthetic.",
      options: [
        { text: "成分與配方才是美的核心邏輯，我愛科學感", score: 3 },
        { text: "用最短時間達到最顯著效果，才是真專業", score: 2 },
        { text: "我喜歡鑽研各種質地與層次帶來的感官體驗", score: 1 },
      ],
    },
    {
      id: 6,
      category: "intuition",
      cardName: "THE DIGITAL LOOM",
      title: "【趨勢】數位織機",
      description: "AI 正在掃蕩低端美感。妳如何在這場數位風暴中生存？",
      prompt:
        "Futuristic fashion runway where clothes are woven from threads of light. Cyberpunk vibe, neon purple and lime, glitch art, high fashion manga.",
      options: [
        { text: "駕馭 AI 作為我的大腦，手感技術則是我的靈魂", score: 3 },
        { text: "我會深耕技術，AI 永遠無法取代職人的觸感", score: 2 },
        { text: "這波趨勢我一定要跟上，不能當舊時代的殘黨", score: 1 },
      ],
    },
    {
      id: 7,
      category: "market",
      cardName: "THE DEAN'S CONTRACT",
      title: "【結盟】最終契約",
      description: "現在，妳準備好將這份『偏執』化為統治未來的資產了嗎？",
      prompt:
        "A mystical admission contract glowing in sacred neon light, surrounded by professional tools. Deep obsidian and acid green, sharp focus, epic vibe.",
      options: [
        { text: "簽了！我要讓這世界看見我的審美高度", score: 3 },
        { text: "我想認識陳主任，聽聽他如何改造我的人生", score: 2 },
        { text: "我渴望被專業引導，不再只是當個愛漂亮的路人", score: 1 },
      ],
    },
  ];

  const results = {
    high: {
      title: "【時尚暴君】視覺統治者",
      prompt:
        "Masterpiece fashion tarot cover. A queen sitting on a chrome throne. Neon lime and obsidian, ultra-stylish, supreme boss aura.",
      desc: "妳的天賦屬於『降維打擊』級別。普通人的美感是消費品，妳的是統治市場的利刃。",
      career: ["品牌藝術總監", "影視御用造型師", "視覺實驗室主理人"],
      advice:
        "孩子，妳這不叫愛漂亮，這叫對視覺主權的絕對壟斷。妳需要像陳高生主任這樣的導師來磨練妳，嶺東流設系正等著把妳推上王位。",
      contractTitle: "頂尖美學主權協定",
      guarantee:
        "保證由陳高生主任與團隊親自引導，將妳的天賦化為絕對的專業溢價。",
    },
    mid: {
      title: "【美感戰神】技術派印鈔機",
      prompt:
        "Dynamic fashion manga, a girl with cybernetic gear. Electric purple and neon silver, professional workspace, intense vibe.",
      desc: "妳擁有驚人的『技術韌性』。妳就是那種靠一雙手，就能讓全世界乖乖排隊付錢的狠角色。",
      career: ["高階美甲美睫導師", "專業醫美形象顧問", "婚禮視覺專家"],
      advice:
        "聽著，妳的手感比妳的廢話更值錢。在嶺東，我們用最硬核的訓練，換取妳未來一輩子的財務自由。選擇這裡，是妳最理性的投資。",
      contractTitle: "極致技術變現條約",
      guarantee:
        "保證獲得流設系專業師資團隊輔導，將技術磨練至足以點石成金的水平。",
    },
    low: {
      title: "【氛圍神探】靈魂修護師",
      prompt:
        "Aesthetic healing fashion manga. A girl surrounded by neon vapors. Minimalist luxury, calm expensive atmosphere.",
      desc: "妳擅長捕捉『氣氛』。在這個焦慮的時代，妳的溫柔技術就是最昂貴的奢侈品。",
      career: ["皮膚健康管理專家", "頭皮理療導師", "時尚採購分析師"],
      advice:
        "美，不一定要張揚。陳高生主任常說：專業才是最好的護城河。讓我們幫妳將感性化為科學，打造別人搶不走的專業產值。",
      contractTitle: "美力情緒壟斷協議",
      guarantee:
        "保證授予專業護理與科學管理認證，讓妳的感知力轉化為高端商業價值。",
    },
  };

  const handleChoice = (score, category) => {
    setScores((prev) => ({ ...prev, [category]: prev[category] + score }));
    if (currentCard < deck.length - 1) {
      setCurrentCard((prev) => prev + 1);
      setImageUrl("");
    } else {
      setStage("result");
      setImageUrl("");
    }
  };

  const generateImage = async (prompt) => {
    if (!apiKey) return;
    setIsLoading(true);
    let retries = 0;
    const maxRetries = 3;
    const callApi = async () => {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              instances: [{ prompt }],
              parameters: { sampleCount: 1 },
            }),
          }
        );
        const result = await response.json();
        if (result.predictions?.[0]?.bytesBase64Encoded) {
          setImageUrl(
            `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`
          );
        }
      } catch (error) {
        if (retries < maxRetries) {
          retries++;
          await new Promise((res) =>
            setTimeout(res, Math.pow(2, retries) * 1000)
          );
          return callApi();
        }
      } finally {
        setIsLoading(false);
      }
    };
    await callApi();
  };

  useEffect(() => {
    if (stage === "quiz") {
      generateImage(deck[currentCard].prompt);
    } else if (stage === "result") {
      const total =
        scores.intuition + scores.skill + scores.market + scores.empathy;
      const final =
        total >= 16 ? results.high : total >= 10 ? results.mid : results.low;
      generateImage(final.prompt);
    }
  }, [stage, currentCard]);

  const finalResult = useMemo(() => {
    const total =
      scores.intuition + scores.skill + scores.market + scores.empathy;
    if (total >= 16) return results.high;
    if (total >= 10) return results.mid;
    return results.low;
  }, [scores]);

  return (
    <div style={{ backgroundColor: "#050505", minHeight: "100vh", minHeight: "100dvh" }}
      className="text-[#ccff00] font-mono overflow-x-hidden relative">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full"
          style={{ background: "rgba(204,255,0,0.05)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72 rounded-full"
          style={{ background: "rgba(123,44,191,0.1)", filter: "blur(80px)" }} />
      </div>

      {/* Main container - properly centered */}
      <div className="relative flex flex-col items-center justify-start w-full px-4 py-8" style={{ zIndex: 1 }}>
        <div className="w-full" style={{ maxWidth: "448px" }}>

          {/* ── WELCOME ── */}
          {stage === "welcome" && (
            <div className="space-y-6">
              <div className="border-4 border-[#ccff00] p-6 rounded-3xl"
                style={{ backgroundColor: "#000", boxShadow: "0 0 60px rgba(204,255,0,0.1)" }}>

                <p className="text-xs font-black tracking-widest text-white/30 uppercase mb-1">
                  Future Oracle
                </p>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-tight mb-6">
                  嶺東科大流設系<br />
                  <span className="text-white text-4xl">算出未來</span>
                </h1>

                <div className="relative rounded-2xl overflow-hidden mb-6" style={{ height: "240px" }}>
                  <img
                    src="https://images.unsplash.com/photo-1558507652-2d9626c4e67a?auto=format&fit=crop&q=80&w=800"
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(1) brightness(1.2) contrast(1.2)" }}
                    alt="LTU Fashion"
                  />
                  <div className="absolute inset-0 flex items-end p-4"
                    style={{ background: "linear-gradient(to top, #000 0%, transparent 60%)" }}>
                    <p className="text-[#ccff00] text-xs font-black tracking-wider italic leading-tight">
                      #與主任同行<br />#美力就是武器
                    </p>
                  </div>
                </div>

                <p className="text-xs text-white/50 leading-relaxed font-bold italic text-center mb-6 px-2">
                  「這不只是測驗，這是妳與職人靈魂的契約。<br />
                  妳的天賦，將由最頂尖的大師團隊磨練。」
                </p>

                <button
                  onClick={() => setStage("quiz")}
                  className="w-full flex items-center justify-center gap-3 font-black text-xl text-black rounded-full transition-all active:scale-95"
                  style={{
                    backgroundColor: "#ccff00",
                    padding: "18px 24px",
                    boxShadow: "0 0 30px rgba(204,255,0,0.3)"
                  }}>
                  啟動七階占卜 <Zap size={20} fill="currentColor" />
                </button>
              </div>
            </div>
          )}

          {/* ── QUIZ ── */}
          {stage === "quiz" && (
            <div className="border border-white/10 rounded-3xl p-5 space-y-5"
              style={{ backgroundColor: "#000" }}>

              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-[#ccff00] tracking-widest uppercase opacity-60">
                    Chapter 0{currentCard + 1}
                  </p>
                  <p className="text-sm font-black text-white italic uppercase tracking-tight">
                    {deck[currentCard].cardName}
                  </p>
                </div>
                <div className="flex gap-1">
                  {deck.map((_, i) => (
                    <div key={i} className="h-1 w-4 rounded-full transition-all"
                      style={{ backgroundColor: i <= currentCard ? "#ccff00" : "rgba(255,255,255,0.1)" }} />
                  ))}
                </div>
              </div>

              {/* Card image */}
              <div className="relative rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ aspectRatio: "3/4", backgroundColor: "#111", maxHeight: "320px" }}>
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-[#ccff00] animate-spin" />
                    <p className="text-xs font-black text-[#ccff00] tracking-widest animate-pulse">
                      召喚分鏡中...
                    </p>
                  </div>
                ) : imageUrl ? (
                  <img src={imageUrl} alt="Tarot Card"
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <Gem size={40} className="text-[#ccff00]" />
                  </div>
                )}
                <div className="absolute top-0 left-0 p-4">
                  <span className="text-xs font-black text-black px-3 py-1 inline-block"
                    style={{
                      backgroundColor: "#ccff00",
                      transform: "skewX(-10deg)",
                      borderRadius: "4px"
                    }}>
                    {deck[currentCard].title}
                  </span>
                </div>
              </div>

              {/* Question */}
              <p className="text-xs text-white/60 font-bold italic leading-relaxed text-center px-2">
                「{deck[currentCard].description}」
              </p>

              {/* Options */}
              <div className="space-y-2">
                {deck[currentCard].options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={isLoading}
                    onClick={() => handleChoice(opt.score, deck[currentCard].category)}
                    className="w-full text-left border rounded-xl font-bold text-sm text-white/70 flex items-center justify-between transition-all active:scale-95 disabled:opacity-30"
                    style={{
                      padding: "14px 16px",
                      borderColor: "rgba(255,255,255,0.1)",
                      backgroundColor: "rgba(255,255,255,0.03)"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "#ccff00";
                      e.currentTarget.style.backgroundColor = "rgba(204,255,0,0.05)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                    }}>
                    <span className="flex-1 pr-3 leading-snug">{opt.text}</span>
                    <ChevronRight size={16} className="text-[#ccff00] flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {stage === "result" && (
            <div className="space-y-5">
              <div className="border-4 border-[#ccff00] rounded-3xl p-6 space-y-6 text-center"
                style={{ backgroundColor: "#000", boxShadow: "0 0 80px rgba(204,255,0,0.2)" }}>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <Gem size={10} className="text-[#ccff00]" />
                    <span className="text-xs font-black text-white/60 tracking-widest uppercase">
                      Fate Decoded
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white italic tracking-tight uppercase leading-tight">
                    {finalResult.title}
                  </h2>
                </div>

                {/* Result image */}
                <div className="relative rounded-2xl overflow-hidden mx-auto"
                  style={{ aspectRatio: "3/4", maxWidth: "240px", backgroundColor: "#111" }}>
                  {isLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Loader2 className="w-10 h-10 text-[#ccff00] animate-spin mb-3" />
                      <p className="text-xs font-black text-[#ccff00] tracking-widest uppercase italic">
                        預見未來中...
                      </p>
                    </div>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Result" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <Gem size={48} className="text-[#ccff00]" />
                    </div>
                  )}
                </div>

                {/* Dean's advice */}
                <div className="text-left p-5 rounded-2xl border-l-4 border-[#ccff00]"
                  style={{ backgroundColor: "rgba(204,255,0,0.05)" }}>
                  <div className="flex items-center gap-2 mb-3 opacity-60">
                    <ShieldCheck size={16} className="text-[#ccff00]" />
                    <span className="text-xs font-black text-white italic uppercase tracking-wider">
                      系主任良語
                    </span>
                  </div>
                  <p className="text-sm font-black text-white italic leading-relaxed mb-3">
                    「{finalResult.advice}」
                  </p>
                  <p className="text-xs text-white/40 leading-relaxed font-bold italic">
                    {finalResult.desc}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setStage("faculty")}
                    className="w-full flex items-center justify-center gap-3 font-black text-lg text-black rounded-full transition-all active:scale-95"
                    style={{
                      backgroundColor: "#ccff00",
                      padding: "18px 24px",
                      boxShadow: "0 10px 40px rgba(204,255,0,0.3)"
                    }}>
                    認識嶺東流設團隊
                    <ChevronRight size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setStage("welcome");
                      setCurrentCard(0);
                      setImageUrl("");
                      setScores({ intuition: 0, skill: 0, market: 0, empathy: 0 });
                    }}
                    className="w-full flex items-center justify-center gap-2 text-xs font-black text-white/20 uppercase tracking-widest transition-colors"
                    style={{ padding: "12px" }}>
                    <RefreshCcw size={12} /> Rewrite Destiny
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── FACULTY ── */}
          {stage === "faculty" && (
            <div className="border-4 border-[#ccff00] rounded-3xl p-6 space-y-6"
              style={{ backgroundColor: "#000" }}>

              <div className="text-center space-y-1">
                <GraduationCap className="w-10 h-10 text-[#ccff00] mx-auto" />
                <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">
                  領航導師群
                </h2>
                <p className="text-xs font-bold text-purple-400 tracking-widest uppercase">
                  Faculty of LTU Fashion Design
                </p>
              </div>

              <div className="space-y-3">
                {/* Head */}
                <div className="p-5 rounded-2xl border-2 border-[#ccff00]"
                  style={{ backgroundColor: "rgba(204,255,0,0.08)" }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xl font-black text-[#ccff00]">{facultyData.head.name}</h4>
                      <p className="text-xs font-black text-white uppercase tracking-wider">{facultyData.head.title}</p>
                    </div>
                    <Award className="text-[#ccff00]" size={20} />
                  </div>
                  <span className="text-xs font-black text-black px-3 py-1 rounded-full inline-block mb-3 italic"
                    style={{ backgroundColor: "#ccff00" }}>
                    核心專長：{facultyData.head.skill}
                  </span>
                  <p className="text-xs text-white/70 leading-relaxed italic font-bold">
                    {facultyData.head.desc}
                  </p>
                </div>

                {/* Mentors */}
                {facultyData.mentors.map((mentor, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-white/10"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={14} className="text-purple-400" />
                      <h4 className="text-xs font-black text-white/90 uppercase tracking-wider">{mentor.field}</h4>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed italic">{mentor.desc}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setShowContract(true)}
                  className="w-full font-black text-lg text-black rounded-2xl transition-all active:scale-95"
                  style={{
                    backgroundColor: "#ccff00",
                    padding: "18px 24px",
                    boxShadow: "0 10px 30px rgba(204,255,0,0.25)"
                  }}>
                  領取妳的職人契約
                </button>
                <button
                  onClick={() => setStage("result")}
                  className="w-full font-bold text-white/20 transition-colors"
                  style={{ padding: "12px" }}>
                  返回測驗結果
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <p className="mt-12 text-xs font-black text-white/5 uppercase tracking-widest text-center">
          LTU FASHION DESIGN // THE SUPREME AESTHETIC CODE
        </p>
      </div>

      {/* ── CONTRACT MODAL ── */}
      {showContract && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ zIndex: 9999, backgroundColor: "rgba(0,0,0,0.95)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowContract(false)}>
          <div
            className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 space-y-5 overflow-hidden"
            style={{
              backgroundColor: "#0a0a0a",
              border: "3px solid #ccff00",
              boxShadow: "0 0 80px rgba(204,255,0,0.5)",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
            onClick={e => e.stopPropagation()}>

            {/* Top bar */}
            <div className="absolute top-0 left-0 w-full h-2"
              style={{ background: "linear-gradient(to right, #ccff00, #7b2cbf, transparent)" }} />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black text-[#ccff00] tracking-widest uppercase italic opacity-60 mb-1">
                  Admission Protocol
                </p>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tight leading-tight">
                  {finalResult.contractTitle}
                </h3>
              </div>
              <button onClick={() => setShowContract(false)}
                className="text-white/20 p-1" style={{ touchAction: "manipulation" }}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 py-4 border-y border-white/10">
              <div className="space-y-2">
                <p className="text-xs text-white/40 uppercase font-black italic tracking-widest">
                  被保證人 / PROTAGONIST
                </p>
                <div className="p-4 rounded-2xl border border-[#ccff00]/25 text-[#ccff00] font-black text-xl italic tracking-tight text-center"
                  style={{ backgroundColor: "rgba(204,255,0,0.1)" }}>
                  {finalResult.title}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-white/40 uppercase font-black tracking-widest italic opacity-60">
                  保證條款 / LTU ELITE GUARANTEE
                </p>
                <div className="flex gap-3 items-start">
                  <CheckCircle className="text-[#ccff00] flex-shrink-0 w-5 h-5 mt-0.5" />
                  <p className="text-sm text-white/95 leading-relaxed font-bold italic">
                    {finalResult.guarantee}
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <CheckCircle className="text-[#ccff00] flex-shrink-0 w-5 h-5 mt-0.5" />
                  <p className="text-sm text-white/95 leading-relaxed font-bold italic">
                    由陳高生主任與團隊親自領航，將妳的審美天賦轉化為不可撼動的產值護城河。
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="flex flex-col items-center gap-2 opacity-20">
                <Flame className="w-10 h-10 text-[#ccff00]" />
                <p className="text-xs font-black text-white tracking-widest uppercase">
                  嶺東流設 // 專業導航
                </p>
              </div>
              <button
                onClick={() => window.open("https://fashion.ltu.edu.tw/p/412-1018-1319.php?Lang=zh-tw", "_blank")}
                className="w-full flex items-center justify-center gap-2 font-black text-lg text-black rounded-2xl transition-all active:scale-95"
                style={{
                  backgroundColor: "white",
                  padding: "16px 24px",
                  touchAction: "manipulation"
                }}>
                前往官網尋求主任輔導 <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        body { background-color: #050505; overscroll-behavior: none; margin: 0; }
        html { scroll-behavior: smooth; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccff00; border-radius: 10px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}} />
    </div>
  );
};

export default App;
