import React, { useState, useEffect } from 'react';
import { useDiceStore } from '@/store/useDiceStore';
import { getPlanetByName, getSignByName, getHouseByNumber, formatDateShort, getTodayDateString } from '@/utils/diceData';
import Dice3D from '@/components/Dice3D';
import { Calendar, Flame, Trophy, Clock, Sparkles, Star, Palette, Hash, ChevronDown, ChevronUp } from 'lucide-react';

const DailyPage: React.FC = () => {
  const {
    dailyFortunes,
    checkInToday,
    isTodayCheckedIn,
    getDailyCheckInStats,
    getTodayFortune,
  } = useDiceStore();

  const [showAnimation, setShowAnimation] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const todayChecked = isTodayCheckedIn();
  const todayFortune = getTodayFortune();
  const stats = getDailyCheckInStats();

  const handleCheckIn = () => {
    if (todayChecked) return;

    setIsRevealing(true);
    setTimeout(() => {
      checkInToday();
      setShowAnimation(true);
      setIsRevealing(false);
      setTimeout(() => setShowAnimation(false), 2000);
    }, 1500);
  };

  const toggleExpand = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const today = new Date();
  const todayStr = getTodayDateString();

  return (
    <div className="relative z-10 min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-violet-300 via-amber-200 to-violet-300 bg-clip-text text-transparent">
              每日一骰
            </span>
          </h2>
          <p className="text-indigo-300/70 max-w-xl mx-auto">
            每日开启专属运势，获取今日关键词与建议，连续打卡解锁更多能量。
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 mx-auto mb-2">
              <Flame className="text-orange-400" size={20} />
            </div>
            <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
            <div className="text-xs text-indigo-300/60">连续打卡</div>
          </div>

          <div className="p-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 mx-auto mb-2">
              <Trophy className="text-amber-400" size={20} />
            </div>
            <div className="text-2xl font-bold text-white">{stats.longestStreak}</div>
            <div className="text-xs text-indigo-300/60">最长连续</div>
          </div>

          <div className="p-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-500/20 mx-auto mb-2">
              <Calendar className="text-violet-400" size={20} />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalCheckIns}</div>
            <div className="text-xs text-indigo-300/60">累计签到</div>
          </div>

          <div className="p-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 mx-auto mb-2">
              <Clock className="text-emerald-400" size={20} />
            </div>
            <div className="text-2xl font-bold text-white">
              {todayChecked ? '✓' : '-'}
            </div>
            <div className="text-xs text-indigo-300/60">今日签到</div>
          </div>
        </div>

        <div className="mb-8">
          {todayFortune ? (
            <div className="relative p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 overflow-hidden">
              {showAnimation && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-2xl animate-ping"
                      style={{
                        left: `${10 + (i % 4) * 25}%`,
                        top: `${20 + Math.floor(i / 4) * 30}%`,
                        animationDelay: `${i * 100}ms`,
                        animationDuration: '1.5s',
                      }}
                    >
                      ✨
                    </div>
                  ))}
                </div>
              )}

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 mb-4">
                  <Calendar size={16} className="text-violet-300" />
                  <span className="text-violet-200 text-sm font-medium">
                    {today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                  </span>
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">
                  <span
                    className="bg-gradient-to-r from-amber-300 via-violet-300 to-amber-300 bg-clip-text text-transparent"
                    style={{ textShadow: '0 0 40px rgba(167, 139, 250, 0.3)' }}
                  >
                    {todayFortune.keyword}
                  </span>
                </h3>
                <p className="text-indigo-300/70 text-lg">今日运势关键词</p>
              </div>

              <div className="flex justify-center mb-6">
                <div className="flex -space-x-4">
                  {(() => {
                    const planet = getPlanetByName(todayFortune.planet);
                    const sign = getSignByName(todayFortune.sign);
                    const house = getHouseByNumber(todayFortune.house);
                    return (
                      <>
                        {planet && (
                          <div className="transform hover:scale-110 transition-transform z-30">
                            <Dice3D
                              symbol={planet.symbol}
                              isRolling={false}
                              gradientFrom="#f59e0b"
                              gradientTo="#ea580c"
                              borderColor="#fbbf24"
                              size="md"
                            />
                          </div>
                        )}
                        {sign && (
                          <div className="transform hover:scale-110 transition-transform z-20">
                            <Dice3D
                              symbol={sign.symbol}
                              isRolling={false}
                              gradientFrom="#8b5cf6"
                              gradientTo="#7c3aed"
                              borderColor="#a78bfa"
                              size="md"
                            />
                          </div>
                        )}
                        {house && (
                          <div className="transform hover:scale-110 transition-transform z-10">
                            <Dice3D
                              symbol={house.number.toString()}
                              isRolling={false}
                              gradientFrom="#3b82f6"
                              gradientTo="#0891b2"
                              borderColor="#60a5fa"
                              size="md"
                            />
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-xs text-indigo-300/60 mb-1">行星</div>
                  <div className="text-white font-semibold">{todayFortune.planet}</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-xs text-indigo-300/60 mb-1">星座</div>
                  <div className="text-white font-semibold">{todayFortune.sign}</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-xs text-indigo-300/60 mb-1">宫位</div>
                  <div className="text-white font-semibold">{todayFortune.house}宫</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <div className="text-sm font-medium text-white mb-1">今日建议</div>
                    <p className="text-indigo-200/80 text-sm leading-relaxed">
                      {todayFortune.advice}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star size={16} className="text-amber-400" />
                    <span className="text-xs text-indigo-300/60">幸运指数</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-300">{todayFortune.luckyIndex}%</div>
                </div>

                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Palette size={16} className="text-rose-400" />
                    <span className="text-xs text-indigo-300/60">幸运色</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: todayFortune.luckyColor }}
                    />
                    <span className="text-white font-medium text-sm">
                      {todayFortune.luckyColor}
                    </span>
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Hash size={16} className="text-cyan-400" />
                    <span className="text-xs text-indigo-300/60">幸运数字</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-300">{todayFortune.luckyNumber}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                  <Calendar size={16} className="text-indigo-300/60" />
                  <span className="text-indigo-300/70 text-sm">
                    {today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">今日运势尚未揭晓</h3>
                <p className="text-indigo-300/60 max-w-md mx-auto">
                  点击下方按钮，投掷今日的占星骰子，获取专属于你的运势关键词与建议。
                </p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="flex -space-x-4 opacity-30">
                  <Dice3D
                    symbol="?"
                    isRolling={isRevealing}
                    gradientFrom="#f59e0b"
                    gradientTo="#ea580c"
                    borderColor="#fbbf24"
                    size="lg"
                  />
                  <Dice3D
                    symbol="?"
                    isRolling={isRevealing}
                    delay={100}
                    gradientFrom="#8b5cf6"
                    gradientTo="#7c3aed"
                    borderColor="#a78bfa"
                    size="lg"
                  />
                  <Dice3D
                    symbol="?"
                    isRolling={isRevealing}
                    delay={200}
                    gradientFrom="#3b82f6"
                    gradientTo="#0891b2"
                    borderColor="#60a5fa"
                    size="lg"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleCheckIn}
                  disabled={isRevealing}
                  className="
                    relative px-12 py-5 rounded-2xl text-xl font-bold text-white
                    bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600
                    hover:from-violet-500 hover:via-purple-500 hover:to-violet-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300 transform active:scale-[0.97]
                    shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50
                    overflow-hidden group
                  "
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isRevealing ? (
                      <>
                        <Sparkles className="animate-pulse" size={24} />
                        运势揭晓中...
                      </>
                    ) : (
                      <>
                        <Sparkles size={24} />
                        每日一骰
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar size={20} className="text-violet-400" />
              历史记录
            </h3>
            <span className="text-sm text-indigo-300/60">
              共 {dailyFortunes.length} 天
            </span>
          </div>

          {dailyFortunes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white/5 border border-white/10">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Calendar size={28} className="text-indigo-400/50" />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">暂无签到记录</h4>
              <p className="text-indigo-300/60 text-sm max-w-sm">
                开始你的每日一骰之旅，每天记录属于你的专属运势。
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dailyFortunes.map((fortune) => {
                const isExpanded = expandedDate === fortune.date;
                const isToday = fortune.date === todayStr;
                const planet = getPlanetByName(fortune.planet);
                const sign = getSignByName(fortune.sign);
                const house = getHouseByNumber(fortune.house);

                return (
                  <div
                    key={fortune.id}
                    className={`
                      relative rounded-2xl backdrop-blur-md border transition-all duration-300 cursor-pointer
                      ${isExpanded ? 'bg-white/10 border-violet-500/30' : 'bg-white/5 border-white/10 hover:border-violet-500/20 hover:bg-white/[0.07]'}
                    `}
                    onClick={() => toggleExpand(fortune.date)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{
                              background: `linear-gradient(135deg, ${fortune.luckyColor}30 0%, ${fortune.luckyColor}10 100%)`,
                              boxShadow: `inset 0 0 20px ${fortune.luckyColor}15`,
                            }}
                          >
                            {planet?.symbol || '✨'}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-white font-medium">
                                {formatDateShort(fortune.timestamp)}
                              </span>
                              {isToday && (
                                <span className="px-2 py-0.5 rounded-full text-xs bg-violet-500/30 text-violet-200 border border-violet-500/30">
                                  今天
                                </span>
                              )}
                            </div>
                            <div className="text-amber-300 text-sm font-medium">
                              {fortune.keyword}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <div className="text-xs text-indigo-300/60 mb-0.5">幸运指数</div>
                            <div className="text-white font-semibold">{fortune.luckyIndex}%</div>
                          </div>
                          <div className="text-white/50">
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-white/10 pt-4">
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-xs text-indigo-300/60 mb-1">行星</div>
                            <div className="text-white font-semibold">{fortune.planet}</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-xs text-indigo-300/60 mb-1">星座</div>
                            <div className="text-white font-semibold">{fortune.sign}</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-xs text-indigo-300/60 mb-1">宫位</div>
                            <div className="text-white font-semibold">{fortune.house}宫</div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20">
                          <div className="flex items-start gap-2">
                            <Sparkles className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
                            <p className="text-indigo-200/80 text-sm leading-relaxed">
                              {fortune.advice}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
                            <Palette size={16} className="text-rose-400" />
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded-full border border-white/20"
                                style={{ backgroundColor: fortune.luckyColor }}
                              />
                              <span className="text-xs text-indigo-300/70">幸运色</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
                            <Hash size={16} className="text-cyan-400" />
                            <span className="text-white font-bold">{fortune.luckyNumber}</span>
                            <span className="text-xs text-indigo-300/70">幸运数字</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-violet-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyPage;
