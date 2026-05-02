import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Zap,
  ChevronRight,
  RefreshCcw,
  Loader2,
  Star,
  ShieldCheck,
  Gem,
  Quote,
  ExternalLink,
  Layers,
  X,
  CheckCircle,
  Flame,
  Heart,
  User,
  GraduationCap,
  Award,
} from "lucide-react";

const App = () => {
  // --- 狀態管理 ---
  const [stage, setStage] = useState("welcome"); // welcome, quiz, result, faculty
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
  const apiKey = "";

  // --- 實務師資陣容 (僅保留確認真人) ---
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

  // --- 七階占卜陣內容 ---
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

  // --- 核心函數 ---
  const handleChoice = (score, category) => {
    setScores((prev) => ({ ...prev, [category]: prev[category] + score }));
    if (currentCard < deck.length - 1) {
      setCurrentCard((prev) => prev + 1);
    } else {
      setStage("result");
    }
  };

  const generateImage = async (prompt) => {
    setIsLoading(true);
    let retries = 0;
    const maxRetries = 5;
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
      let final =
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
    <div className="min-h-screen bg-[#050505] text-[#ccff00] flex flex-col items-center justify-center p-6 font-mono overflow-x-hidden selection:bg-[#ccff00] selection:text-black relative">
      {/* Hyper-Acid Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ccff00]/5 rounded-full blur-[200px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7b2cbf]/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-md w-full relative">
        {stage === "welcome" && (
          <div className="space-y-12 animate-in fade-in zoom-in duration-1000">
            <div className="relative bg-black border-[6px] border-[#ccff00] p-12 rounded-[4.5rem] shadow-[0_0_120px_rgba(204,255,0,0.15)] text-center space-y-10">
              <div className="space-y-2 text-left">
                <p className="text-[10px] font-black tracking-[1em] text-white/30 uppercase">
                  Future Oracle
                </p>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                  嶺東科大流設系
                  <br />
                  <span className="text-white text-5xl drop-shadow-[0_0_20px_#ccff00]">
                    算出未來
                  </span>
                </h1>
              </div>

              <div className="relative h-72 border-2 border-white/5 rounded-[3rem] overflow-hidden bg-zinc-950 group">
                <img
                  src="https://images.unsplash.com/photo-1558507652-2d9626c4e67a?auto=format&fit=crop&q=80&w=800"
                  className="w-full h-full object-cover grayscale brightness-125 contrast-125 group-hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-8 text-left">
                  <p className="text-[#ccff00] text-xs font-black tracking-[0.5em] italic leading-tight">
                    #與主任同行
                    <br />
                    #美力就是武器
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-xs text-white/50 leading-relaxed font-bold italic px-4">
                  「這不只是測驗，這是妳與職人靈魂的契約。
                  <br />
                  妳的天賦，將由最頂尖的大師團隊磨練。」
                </p>
                <button
                  onClick={() => setStage("quiz")}
                  className="w-full py-6 bg-[#ccff00] text-black rounded-full font-black text-2xl hover:shadow-[0_0_60px_rgba(204,255,0,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                >
                  啟動七階占卜 <Zap fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === "quiz" && (
          <div className="bg-black border-2 border-white/10 rounded-[4rem] p-8 space-y-8 shadow-2xl relative overflow-hidden text-center">
            <div className="flex justify-between items-end px-4">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-[#ccff00] tracking-widest uppercase opacity-60">
                  Chapter 0{currentCard + 1}
                </span>
                <span className="text-[14px] font-black text-white italic uppercase tracking-tighter">
                  {deck[currentCard].cardName}
                </span>
              </div>
              <div className="flex gap-1.5 pb-1">
                {deck.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-4 transition-all ${
                      i <= currentCard
                        ? "bg-[#ccff00] shadow-[0_0_8px_#ccff00]"
                        : "bg-white/10"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[3/4.2] rounded-[3rem] overflow-hidden bg-zinc-950 border border-white/5 flex items-center justify-center group shadow-inner mx-auto">
              {isLoading ? (
                <div className="flex flex-col items-center gap-6">
                  <Loader2 className="w-14 h-14 text-[#ccff00] animate-spin" />
                  <p className="text-[10px] font-black text-[#ccff00] animate-pulse tracking-[0.6em]">
                    召喚分鏡中...
                  </p>
                </div>
              ) : (
                imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Tarot Card"
                    className="w-full h-full object-cover animate-in fade-in duration-1000 group-hover:scale-105 transition-transform duration-[4s]"
                  />
                )
              )}

              <div className="absolute top-0 left-0 w-full p-6 text-left">
                <h2 className="text-sm font-black bg-[#ccff00] text-black px-4 py-1.5 inline-block skew-x-[-15deg] shadow-xl uppercase italic">
                  {deck[currentCard].title}
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-xs text-center font-bold text-white/60 italic leading-relaxed px-4 min-h-[40px]">
                「{deck[currentCard].description}」
              </p>
              <div className="space-y-3">
                {deck[currentCard].options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={isLoading}
                    onClick={() =>
                      handleChoice(opt.score, deck[currentCard].category)
                    }
                    className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl font-bold text-sm text-white/70 hover:border-[#ccff00] hover:bg-[#ccff00]/5 hover:text-white transition-all flex items-center justify-between group disabled:opacity-30 active:scale-[0.98]"
                  >
                    <span className="flex-1 pr-4">{opt.text}</span>
                    <ChevronRight
                      size={16}
                      className="text-[#ccff00]/20 group-hover:text-[#ccff00] group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {stage === "result" && (
          <div className="space-y-8 animate-in zoom-in-95 duration-1000 relative">
            <div className="bg-black border-[8px] border-[#ccff00] rounded-[5rem] p-10 shadow-[0_0_150px_rgba(204,255,0,0.3)] text-center space-y-10 overflow-hidden relative">
              <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/5 rounded-full border border-white/10 mb-2">
                  <Gem size={12} className="text-[#ccff00] animate-bounce" />
                  <span className="text-[10px] font-black text-white/60 tracking-[0.5em] uppercase">
                    Fate Decoded
                  </span>
                </div>
                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-[0_0_30px_#ccff00]">
                  {finalResult.title}
                </h2>
              </div>

              <div className="relative aspect-[3/4.2] rounded-[3.5rem] overflow-hidden border-2 border-white/10 shadow-2xl group mx-auto max-w-[300px]">
                {isLoading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950">
                    <Loader2 className="w-14 h-14 text-[#ccff00] animate-spin mb-4" />
                    <p className="text-[10px] font-black text-[#ccff00] tracking-widest uppercase italic">
                      預見未來中...
                    </p>
                  </div>
                ) : (
                  imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Result Card"
                      className="w-full h-full object-cover animate-in zoom-in duration-1000 group-hover:scale-110 transition-transform duration-[6s]"
                    />
                  )
                )}
              </div>

              <div className="text-left space-y-10 relative z-10 pt-4">
                <div className="p-10 bg-[#ccff00]/5 border-l-[16px] border-[#ccff00] rounded-r-[3rem] shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-black px-6 py-2 border border-[#ccff00] text-[#ccff00] text-[10px] font-black tracking-widest uppercase">
                    系主任良語
                  </div>
                  <div className="flex items-center gap-3 mb-6 opacity-60">
                    <ShieldCheck size={24} className="text-[#ccff00]" />
                    <span className="text-xs font-black tracking-[0.2em] text-white italic uppercase">
                      Dean's Professional Insight
                    </span>
                  </div>
                  <p className="text-[15px] font-black leading-relaxed text-white italic mb-8 border-b border-white/10 pb-6 text-center">
                    「{finalResult.advice}」
                  </p>
                  <p className="text-[12px] text-white/40 leading-relaxed font-bold italic">
                    {finalResult.desc}
                  </p>
                </div>
              </div>

              <div className="pt-10 space-y-6">
                <button
                  onClick={() => setStage("faculty")}
                  className="w-full py-8 bg-[#ccff00] text-black rounded-full font-black text-2xl shadow-[0_25px_70px_rgba(204,255,0,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                >
                  認識嶺東流設團隊{" "}
                  <ChevronRight
                    size={24}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </button>
                <button
                  onClick={() => {
                    setStage("welcome");
                    setCurrentCard(0);
                    setScores({
                      intuition: 0,
                      skill: 0,
                      market: 0,
                      empathy: 0,
                    });
                  }}
                  className="text-[10px] font-black text-white/20 uppercase tracking-[1em] flex items-center justify-center gap-3 w-full hover:text-white transition-colors"
                >
                  <RefreshCcw size={14} /> Rewrite Destiny
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 師資版面 (修正版) --- */}
        {stage === "faculty" && (
          <div className="space-y-8 animate-in slide-in-from-right duration-700">
            <div className="bg-black border-[4px] border-[#ccff00] rounded-[4rem] p-8 shadow-2xl space-y-8">
              <div className="text-center space-y-2">
                <GraduationCap className="w-12 h-12 text-[#ccff00] mx-auto mb-2" />
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                  領航導師群
                </h2>
                <p className="text-[10px] font-bold text-purple-400 tracking-widest uppercase tracking-widest">
                  Faculty of LTU Fashion Design
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                {/* 陳高生主任 (置頂特別展示) */}
                <div className="p-8 bg-[#ccff00]/10 border-2 border-[#ccff00] rounded-[3rem] shadow-lg relative overflow-hidden group">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#ccff00]/10 blur-2xl rounded-full"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1 text-left">
                      <h4 className="text-2xl font-black text-[#ccff00]">
                        {facultyData.head.name}
                      </h4>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">
                        {facultyData.head.title}
                      </p>
                    </div>
                    <Award className="text-[#ccff00]" />
                  </div>
                  <p className="text-[11px] font-black text-black bg-[#ccff00] px-4 py-1.5 rounded-full inline-block mb-4 italic">
                    核心專長：{facultyData.head.skill}
                  </p>
                  <p className="text-[11px] text-white/70 leading-relaxed text-left italic font-bold">
                    {facultyData.head.desc}
                  </p>
                </div>

                {/* 其他領域大師描述 */}
                {facultyData.mentors.map((mentor, i) => (
                  <div
                    key={i}
                    className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:border-purple-500 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <ShieldCheck className="text-purple-400 group-hover:text-[#ccff00]" />
                      <h4 className="text-sm font-black text-white/90 uppercase tracking-widest">
                        {mentor.field}
                      </h4>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed text-left italic">
                      {mentor.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-6 space-y-4">
                <button
                  onClick={() => setShowContract(true)}
                  className="w-full py-6 bg-[#ccff00] text-black rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-[0_15px_40px_rgba(204,255,0,0.3)]"
                >
                  領取妳的職人契約
                </button>
                <button
                  onClick={() => setStage("result")}
                  className="w-full py-4 text-white/20 font-bold hover:text-white transition-colors"
                >
                  返回測驗結果
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 數位契約彈窗 (置於最外層) --- */}
        {showContract && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
              onClick={() => setShowContract(false)}
            ></div>
            <div className="relative w-full max-w-sm bg-[#0a0a0a] border-4 border-[#ccff00] rounded-[3.5rem] p-10 shadow-[0_0_120px_rgba(204,255,0,0.7)] space-y-8 animate-in zoom-in-95 duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-[#ccff00] via-purple-600 to-transparent"></div>

              <div className="flex justify-between items-start">
                <div className="space-y-1 text-left">
                  <p className="text-[9px] font-black text-[#ccff00] tracking-[0.3em] uppercase italic opacity-60">
                    Admission Protocol
                  </p>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                    {finalResult.contractTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setShowContract(false)}
                  className="text-white/20 hover:text-[#ccff00] transition-colors p-1.5"
                >
                  <X size={30} />
                </button>
              </div>

              <div className="space-y-6 py-8 border-y border-white/10 text-left">
                <div className="space-y-3">
                  <p className="text-[10px] text-white/40 uppercase font-black italic tracking-widest">
                    被保證人 / PROTAGONIST
                  </p>
                  <div className="p-6 bg-[#ccff00]/10 rounded-[2rem] border border-[#ccff00]/25 text-[#ccff00] font-black text-2xl italic tracking-tighter shadow-inner text-center">
                    {finalResult.title}
                  </div>
                </div>

                <div className="space-y-5">
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest italic opacity-60">
                    保證條款 / LTU ELITE GUARANTEE
                  </p>
                  <div className="flex gap-4 items-start">
                    <CheckCircle className="text-[#ccff00] shrink-0 w-6 h-6 mt-0.5 animate-pulse" />
                    <p className="text-sm text-white/95 leading-relaxed font-bold italic">
                      {finalResult.guarantee}
                    </p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <CheckCircle className="text-[#ccff00] shrink-0 w-6 h-6 mt-0.5" />
                    <p className="text-sm text-white/95 leading-relaxed font-bold italic">
                      由陳高生主任與團隊親自領航，將妳的審美天賦轉化為不可撼動的產值護城河。
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 text-center space-y-8">
                <div className="flex flex-col items-center gap-3 opacity-30 group">
                  <Flame className="w-14 h-14 text-[#ccff00]" />
                  <p className="text-[9px] font-black text-white tracking-[0.6em] uppercase leading-none">
                    嶺東流設 // 專業導航
                  </p>
                </div>
                <button
                  onClick={() =>
                    window.open(
                      "https://fashion.ltu.edu.tw/p/412-1018-1319.php?Lang=zh-tw",
                      "_blank"
                    )
                  }
                  className="w-full py-6.5 bg-white text-black rounded-3xl font-black text-xl shadow-[0_15px_45px_rgba(255,255,255,0.25)] hover:bg-[#ccff00] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  前往官網尋求主任輔導 <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccff00; border-radius: 10px; }
        body { background-color: #050505; overscroll-behavior: none; }
      `,
        }}
      />

      <footer className="mt-16 text-[10px] font-black tracking-[3.1em] text-white/5 uppercase text-center animate-pulse">
        LTU FASHION DESIGN // THE SUPREME AESTHETIC CODE
      </footer>
    </div>
  );
};

export default App;
