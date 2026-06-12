import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDiceStore } from '@/store/useDiceStore';
import { DiceSet, DiceVisualStyle } from '@/types';
import { ANIMATION_PRESETS, SOUND_EFFECTS, COLOR_PALETTES, createDefaultDiceSet, DEFAULT_DICE_SETS } from '@/utils/diceSetPresets';
import Dice3D from '@/components/Dice3D';
import { ArrowLeft, Save, RotateCcw, Volume2, Sparkles, Palette, Sun, Shuffle } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

type DiceCategory = 'planet' | 'sign' | 'house';

const CATEGORY_LABELS: Record<DiceCategory, { label: string; symbol: string }> = {
  planet: { label: '行星骰子', symbol: '☉' },
  sign: { label: '星座骰子', symbol: '♈' },
  house: { label: '宫位骰子', symbol: 'Ⅰ' },
};

const STYLE_FIELDS: (keyof DiceVisualStyle)[] = ['gradientFrom', 'gradientTo', 'borderColor', 'glowColor', 'symbolColor'];

const STYLE_LABELS: Record<keyof DiceVisualStyle, string> = {
  gradientFrom: '渐变起始',
  gradientTo: '渐变结束',
  borderColor: '边框颜色',
  glowColor: '发光颜色',
  symbolColor: '符号颜色',
};

interface DiceStyleEditorProps {
  category: DiceCategory;
  style: DiceVisualStyle;
  onChange: (style: DiceVisualStyle) => void;
  animationName: string;
  animationDuration: number;
  animationEasing: string;
  size: 'sm' | 'md' | 'lg';
  isPreviewRolling: boolean;
}

const DiceStyleEditor: React.FC<DiceStyleEditorProps> = ({
  category,
  style,
  onChange,
  animationName,
  animationDuration,
  animationEasing,
  size: _size,
  isPreviewRolling,
}) => {
  const { label, symbol } = CATEGORY_LABELS[category];

  const applyPaletteColor = (color: string, field: keyof DiceVisualStyle) => {
    onChange({ ...style, [field]: color });
  };

  return (
    <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
      <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Sun size={18} style={{ color: style.glowColor }} />
        {label}
      </h4>

      <div className="flex items-center justify-center py-6 mb-6 rounded-xl bg-black/20">
        <div className="transform hover:scale-105 transition-transform">
          <Dice3D
            symbol={symbol}
            isRolling={isPreviewRolling}
            gradientFrom={style.gradientFrom}
            gradientTo={style.gradientTo}
            borderColor={style.borderColor}
            glowColor={style.glowColor}
            symbolColor={style.symbolColor}
            size="lg"
            animationName={animationName}
            animationDuration={animationDuration}
            animationEasing={animationEasing}
          />
        </div>
      </div>

      <div className="space-y-4">
        {STYLE_FIELDS.map((field) => (
          <div key={field} className="space-y-2">
            <label className="text-sm text-indigo-300/70 font-medium">{STYLE_LABELS[field]}</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="color"
                  value={style[field]}
                  onChange={(e) => onChange({ ...style, [field]: e.target.value })}
                  className="w-full h-10 rounded-lg border border-white/10 bg-white/5 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={style[field]}
                onChange={(e) => onChange({ ...style, [field]: e.target.value })}
                className="w-24 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <label className="text-sm text-indigo-300/70 font-medium mb-2 block">快速配色</label>
        <div className="space-y-2">
          {COLOR_PALETTES.map((palette, pIdx) => (
            <div key={pIdx} className="space-y-1">
              <div className="text-xs text-indigo-400/50">{palette.name}</div>
              <div className="flex gap-2">
                {palette.colors.map((color, cIdx) => (
                  <div key={cIdx} className="flex flex-col items-center gap-1">
                    {STYLE_FIELDS.slice(0, 3).map((field, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => applyPaletteColor(color, field)}
                        title={`${palette.name} ${cIdx + 1} → ${STYLE_LABELS[field]}`}
                        className="w-6 h-6 rounded-md border border-white/20 hover:scale-110 transition-transform hover:border-white/60"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DiceSetEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { diceSets, updateDiceSet, addDiceSet } = useDiceStore();
  const { previewSound } = useSoundEffects();

  const existingSet = useMemo(() => diceSets.find((d) => d.id === id), [diceSets, id]);
  const isEditing = !!existingSet;

  const [name, setName] = useState(existingSet?.name || '');
  const [description, setDescription] = useState(existingSet?.description || '');
  const [planetStyle, setPlanetStyle] = useState<DiceVisualStyle>(existingSet?.planetStyle || createDefaultDiceSet().planetStyle);
  const [signStyle, setSignStyle] = useState<DiceVisualStyle>(existingSet?.signStyle || createDefaultDiceSet().signStyle);
  const [houseStyle, setHouseStyle] = useState<DiceVisualStyle>(existingSet?.houseStyle || createDefaultDiceSet().houseStyle);
  const [animationPresetId, setAnimationPresetId] = useState(existingSet?.animationPreset.id || ANIMATION_PRESETS[0].id);
  const [rollSoundId, setRollSoundId] = useState(existingSet?.rollSound.id || SOUND_EFFECTS[0].id);
  const [stopSoundId, setStopSoundId] = useState(existingSet?.stopSound.id || SOUND_EFFECTS[4].id);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>(existingSet?.size || 'lg');
  const [isPreviewRolling, setIsPreviewRolling] = useState(false);
  const [saved, setSaved] = useState(false);

  const animationPreset = ANIMATION_PRESETS.find((a) => a.id === animationPresetId) || ANIMATION_PRESETS[0];
  const rollSound = SOUND_EFFECTS.find((s) => s.id === rollSoundId) || SOUND_EFFECTS[0];
  const stopSound = SOUND_EFFECTS.find((s) => s.id === stopSoundId) || SOUND_EFFECTS[4];

  const triggerPreviewRoll = () => {
    setIsPreviewRolling(true);
    setTimeout(() => setIsPreviewRolling(false), animationPreset.duration + 100);
  };

  const applyPreset = (presetId: string) => {
    const presets: Record<string, DiceSet> = {};
    DEFAULT_DICE_SETS.forEach((p: DiceSet) => { presets[p.id] = p; });
    if (presets[presetId]) {
      const p = presets[presetId];
      setPlanetStyle({ ...p.planetStyle });
      setSignStyle({ ...p.signStyle });
      setHouseStyle({ ...p.houseStyle });
      setAnimationPresetId(p.animationPreset.id);
      setRollSoundId(p.rollSound.id);
      setStopSoundId(p.stopSound.id);
      setSize(p.size);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('请输入骰子套装名称');
      return;
    }

    const data = {
      name: name.trim(),
      description: description.trim(),
      planetStyle,
      signStyle,
      houseStyle,
      animationPreset,
      rollSound,
      stopSound,
      size,
    };

    if (isEditing) {
      updateDiceSet(id!, data);
    } else {
      addDiceSet(data);
    }

    setSaved(true);
    setTimeout(() => {
      void navigate('/dice-sets');
    }, 600);
  };

  const handleReset = () => {
    if (existingSet) {
      setName(existingSet.name);
      setDescription(existingSet.description);
      setPlanetStyle(existingSet.planetStyle);
      setSignStyle(existingSet.signStyle);
      setHouseStyle(existingSet.houseStyle);
      setAnimationPresetId(existingSet.animationPreset.id);
      setRollSoundId(existingSet.rollSound.id);
      setStopSoundId(existingSet.stopSound.id);
      setSize(existingSet.size);
    }
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => { void navigate('/dice-sets'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-indigo-300/80 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={20} />
            返回套装列表
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="
                flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-white/5 border border-white/10 text-indigo-300/80
                hover:bg-white/10 hover:border-white/20 hover:text-white transition-all
              "
            >
              <RotateCcw size={16} />
              重置
            </button>
            <button
              onClick={handleSave}
              disabled={saved}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white
                transition-all duration-300 transform active:scale-[0.97]
                ${saved
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 hover:from-violet-500 hover:via-purple-500 hover:to-violet-500 shadow-violet-500/30 hover:shadow-violet-500/50'
                }
                shadow-xl
              `}
            >
              <Save size={18} />
              {saved ? '已保存 ✓' : '保存套装'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Palette size={18} className="text-violet-400" />
                基本信息
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-indigo-300/70 font-medium mb-2 block">套装名称</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="给你的骰子套装起个名字"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-indigo-400/40 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm text-indigo-300/70 font-medium mb-2 block">骰子尺寸</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['sm', 'md', 'lg'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`
                          py-3 rounded-xl font-medium transition-all
                          ${size === s
                            ? 'bg-violet-600/40 border-violet-500/50 text-white border'
                            : 'bg-white/5 border border-white/10 text-indigo-300/60 hover:bg-white/10'
                          }
                        `}
                      >
                        {s === 'sm' ? '小' : s === 'md' ? '中' : '大'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm text-indigo-300/70 font-medium mb-2 block">描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="描述这个骰子套装的特色..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-indigo-400/40 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <DiceStyleEditor
                category="planet"
                style={planetStyle}
                onChange={setPlanetStyle}
                animationName={animationPreset.animationName}
                animationDuration={animationPreset.duration}
                animationEasing={animationPreset.easing}
                size={size}
                isPreviewRolling={isPreviewRolling}
              />
              <DiceStyleEditor
                category="sign"
                style={signStyle}
                onChange={setSignStyle}
                animationName={animationPreset.animationName}
                animationDuration={animationPreset.duration}
                animationEasing={animationPreset.easing}
                size={size}
                isPreviewRolling={isPreviewRolling}
              />
              <DiceStyleEditor
                category="house"
                style={houseStyle}
                onChange={setHouseStyle}
                animationName={animationPreset.animationName}
                animationDuration={animationPreset.duration}
                animationEasing={animationPreset.easing}
                size={size}
                isPreviewRolling={isPreviewRolling}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 sticky top-8">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shuffle size={18} className="text-amber-400" />
                应用预设主题
              </h4>
              <div className="space-y-2 mb-6">
                {DEFAULT_DICE_SETS.map((preset: DiceSet) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className="
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl
                      bg-white/5 border border-white/10 text-left
                      hover:bg-white/10 hover:border-violet-500/30 transition-all group
                    "
                  >
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded" style={{ background: preset.planetStyle.gradientFrom }} />
                      <div className="w-4 h-4 rounded" style={{ background: preset.signStyle.gradientFrom }} />
                      <div className="w-4 h-4 rounded" style={{ background: preset.houseStyle.gradientFrom }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{preset.name}</div>
                    </div>
                    <span className="text-indigo-400/50 text-xs group-hover:text-violet-400 transition-colors">应用</span>
                  </button>
                ))}
              </div>

              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" />
                动画效果
              </h4>
              <div className="space-y-2 mb-6">
                {ANIMATION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setAnimationPresetId(preset.id)}
                    className={`
                      w-full p-3 rounded-xl text-left transition-all
                      ${animationPresetId === preset.id
                        ? 'bg-violet-500/20 border-violet-500/40 border'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-medium">{preset.name}</span>
                      <span className="text-xs text-indigo-400/60">{preset.duration}ms</span>
                    </div>
                    <p className="text-xs text-indigo-300/50">{preset.description}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={triggerPreviewRoll}
                disabled={isPreviewRolling}
                className="
                  w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold
                  bg-gradient-to-r from-violet-600/50 via-purple-600/50 to-violet-600/50
                  hover:from-violet-500/60 hover:via-purple-500/60 hover:to-violet-500/60
                  border border-violet-500/30 text-white transition-all
                  disabled:opacity-50
                "
              >
                <Sparkles size={16} className={isPreviewRolling ? 'animate-spin' : ''} />
                预览投掷动画
              </button>
            </div>

            <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Volume2 size={18} className="text-rose-400" />
                音效设置
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-indigo-300/70 font-medium mb-2 block">投掷时音效</label>
                  <div className="space-y-2">
                    {SOUND_EFFECTS.map((sound) => (
                      <div
                        key={sound.id}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer
                          ${rollSoundId === sound.id
                            ? 'bg-violet-500/20 border-violet-500/40 border'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }
                        `}
                        onClick={() => setRollSoundId(sound.id)}
                      >
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{sound.name}</div>
                          <p className="text-xs text-indigo-300/50">{sound.description}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            previewSound(sound);
                          }}
                          className="
                            p-2 rounded-lg bg-white/10 border border-white/10
                            text-indigo-300/60 hover:text-white hover:bg-violet-500/20 hover:border-violet-500/30 transition-all
                          "
                          title="试听"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-indigo-300/70 font-medium mb-2 block">停止时音效</label>
                  <div className="space-y-2">
                    {SOUND_EFFECTS.map((sound) => (
                      <div
                        key={sound.id}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer
                          ${stopSoundId === sound.id
                            ? 'bg-violet-500/20 border-violet-500/40 border'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }
                        `}
                        onClick={() => setStopSoundId(sound.id)}
                      >
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{sound.name}</div>
                          <p className="text-xs text-indigo-300/50">{sound.description}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            previewSound(sound);
                          }}
                          className="
                            p-2 rounded-lg bg-white/10 border border-white/10
                            text-indigo-300/60 hover:text-white hover:bg-violet-500/20 hover:border-violet-500/30 transition-all
                          "
                          title="试听"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceSetEditPage;
