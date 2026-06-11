import React, { useState, useMemo } from 'react';
import {
  Search,
  Globe,
  Star,
  Sun,
  Moon,
  Home,
  Flame,
  Zap,
  Link2,
  X,
  BookOpen,
  Plus,
  Minus,
  ArrowRight,
} from 'lucide-react';
import {
  KnowledgeCategory,
  KnowledgePlanet,
  KnowledgeSign,
  KnowledgeHouse,
  Element,
  Modality,
  PlanetSignCombo,
  PlanetHouseCombo,
  SignHouseCombo,
} from '@/types';
import {
  KNOWLEDGE_PLANETS,
  KNOWLEDGE_SIGNS,
  KNOWLEDGE_HOUSES,
  ELEMENTS,
  MODALITIES,
  PLANET_SIGN_COMBOS,
  PLANET_HOUSE_COMBOS,
  SIGN_HOUSE_COMBOS,
  searchKnowledge,
  getKnowledgePlanet,
  getKnowledgeSign,
  getKnowledgeHouse,
  getElement,
  getModality,
} from '@/utils/knowledgeBase';

type DetailItem =
  | { type: 'planet'; data: KnowledgePlanet }
  | { type: 'sign'; data: KnowledgeSign }
  | { type: 'house'; data: KnowledgeHouse }
  | { type: 'element'; data: Element }
  | { type: 'modality'; data: Modality }
  | { type: 'planetSign'; data: PlanetSignCombo }
  | { type: 'planetHouse'; data: PlanetHouseCombo }
  | { type: 'signHouse'; data: SignHouseCombo };

const KnowledgeBasePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    planets: true,
    signs: true,
    houses: true,
    elements: true,
    modalities: true,
    combos: true,
  });

  const categories = [
    { id: 'all', label: '全部', icon: BookOpen },
    { id: 'planets', label: '行星', icon: Sun },
    { id: 'signs', label: '星座', icon: Star },
    { id: 'houses', label: '宫位', icon: Home },
    { id: 'elements', label: '元素', icon: Flame },
    { id: 'modalities', label: '三方性', icon: Zap },
    { id: 'combos', label: '组合解读', icon: Link2 },
  ];

  const filteredData = useMemo(() => {
    if (searchQuery.trim()) {
      return searchKnowledge(searchQuery);
    }

    const category = activeCategory;
    return {
      planets: category === 'all' || category === 'planets' ? KNOWLEDGE_PLANETS : [],
      signs: category === 'all' || category === 'signs' ? KNOWLEDGE_SIGNS : [],
      houses: category === 'all' || category === 'houses' ? KNOWLEDGE_HOUSES : [],
      elements: category === 'all' || category === 'elements' ? ELEMENTS : [],
      modalities: category === 'all' || category === 'modalities' ? MODALITIES : [],
    };
  }, [activeCategory, searchQuery]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navigateTo = (type: string, name: string | number) => {
    let item: DetailItem | null = null;

    if (type === 'planet') {
      const data = getKnowledgePlanet(name as string);
      if (data) item = { type: 'planet', data };
    } else if (type === 'sign') {
      const data = getKnowledgeSign(name as string);
      if (data) item = { type: 'sign', data };
    } else if (type === 'house') {
      const data = getKnowledgeHouse(name as number);
      if (data) item = { type: 'house', data };
    } else if (type === 'element') {
      const data = getElement(name as string);
      if (data) item = { type: 'element', data };
    } else if (type === 'modality') {
      const data = getModality(name as string);
      if (data) item = { type: 'modality', data };
    }

    if (item) {
      setDetailItem(item);
    }
  };

  const Tag: React.FC<{
    label: string;
    type: string;
    name: string | number;
    color?: string;
  }> = ({ label, type, name, color }) => (
    <button
      onClick={() => navigateTo(type, name)}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all hover:scale-105 ${
        color
          ? 'text-white hover:opacity-90'
          : 'bg-violet-500/20 text-violet-200 hover:bg-violet-500/30'
      }`}
      style={color ? { backgroundColor: `${color}40`, color } : {}}
    >
      <Link2 size={10} />
      {label}
    </button>
  );

  const renderDetail = () => {
    if (!detailItem) return null;

    const { type, data } = detailItem;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-indigo-900/95 to-purple-900/95 border border-violet-500/30 shadow-2xl">
          <button
            onClick={() => setDetailItem(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            {type === 'planet' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center text-4xl border border-amber-500/30"
                    style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}
                  >
                    {data.symbol}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{data.name}</h2>
                    <p className="text-amber-300 text-sm">行星 · Planet</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-indigo-200 leading-relaxed">{data.meaning}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe size={18} className="text-amber-400" />
                      <span className="text-white font-medium">骰子含义</span>
                    </div>
                    <p className="text-indigo-200 text-sm leading-relaxed">{data.inDice}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h4 className="text-white font-medium mb-2">核心关键词</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.keywords.map((k, i) => (
                          <span key={i} className="px-2 py-1 rounded-lg bg-violet-500/20 text-violet-200 text-xs">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h4 className="text-white font-medium mb-2">掌管领域</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.domain.map((d, i) => (
                          <span key={i} className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-200 text-xs">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <h4 className="text-emerald-300 font-medium mb-2">正面特质</h4>
                      <ul className="space-y-1">
                        {data.positive.map((p, i) => (
                          <li key={i} className="text-emerald-200 text-sm flex items-center gap-2">
                            <Plus size={12} /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                      <h4 className="text-rose-300 font-medium mb-2">负面特质</h4>
                      <ul className="space-y-1">
                        {data.negative.map((n, i) => (
                          <li key={i} className="text-rose-200 text-sm flex items-center gap-2">
                            <Minus size={12} /> {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {(data.relatedSigns.length > 0 || data.relatedHouses.length > 0) && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h4 className="text-white font-medium mb-3">关联阅读</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.relatedSigns.map((s, i) => (
                          <Tag key={i} label={s} type="sign" name={s} />
                        ))}
                        {data.relatedHouses.map((h, i) => (
                          <Tag key={i} label={`第${h}宫`} type="house" name={h} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {type === 'sign' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border"
                    style={{
                      background: `linear-gradient(135deg, ${getElement(data.element)?.color}30, transparent)`,
                      borderColor: `${getElement(data.element)?.color}40`,
                      textShadow: `0 0 20px ${getElement(data.element)?.color}50`,
                    }}
                  >
                    {data.symbol}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{data.name}</h2>
                    <div className="flex items-center gap-2">
                      <Tag label={`${data.element}象`} type="element" name={data.element} color={getElement(data.element)?.color} />
                      <Tag label={data.modality} type="modality" name={data.modality} color={getModality(data.modality)?.color} />
                      <span className="text-indigo-400 text-sm">星座 · Sign</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-indigo-200 leading-relaxed">{data.meaning}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe size={18} className="text-amber-400" />
                      <span className="text-white font-medium">骰子含义</span>
                    </div>
                    <p className="text-indigo-200 text-sm leading-relaxed">{data.inDice}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h4 className="text-white font-medium mb-2">核心关键词</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.keywords.map((k, i) => (
                          <span key={i} className="px-2 py-1 rounded-lg bg-violet-500/20 text-violet-200 text-xs">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h4 className="text-white font-medium mb-2">性格特质</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.traits.map((t, i) => (
                          <span key={i} className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-200 text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <h4 className="text-emerald-300 font-medium mb-2">正面特质</h4>
                      <ul className="space-y-1">
                        {data.positive.map((p, i) => (
                          <li key={i} className="text-emerald-200 text-sm flex items-center gap-2">
                            <Plus size={12} /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                      <h4 className="text-rose-300 font-medium mb-2">负面特质</h4>
                      <ul className="space-y-1">
                        {data.negative.map((n, i) => (
                          <li key={i} className="text-rose-200 text-sm flex items-center gap-2">
                            <Minus size={12} /> {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-3">关联阅读</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag label={data.ruler} type="planet" name={data.ruler} />
                      {data.relatedPlanets.map((p, i) => (
                        <Tag key={i} label={p} type="planet" name={p} />
                      ))}
                      <Tag label={`${data.element}象`} type="element" name={data.element} color={getElement(data.element)?.color} />
                      <Tag label={data.modality} type="modality" name={data.modality} color={getModality(data.modality)?.color} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {type === 'house' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center text-4xl border border-violet-500/30">
                    <Moon size={32} className="text-violet-300" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{data.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-violet-400 text-sm">宫位 · House · 第{data.number}宫</span>
                      <Tag label={data.ruler} type="planet" name={data.ruler} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-indigo-200 leading-relaxed">{data.meaning}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe size={18} className="text-amber-400" />
                      <span className="text-white font-medium">骰子含义</span>
                    </div>
                    <p className="text-indigo-200 text-sm leading-relaxed">{data.inDice}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h4 className="text-white font-medium mb-2">核心关键词</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.keywords.map((k, i) => (
                          <span key={i} className="px-2 py-1 rounded-lg bg-violet-500/20 text-violet-200 text-xs">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h4 className="text-white font-medium mb-2">掌管领域</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.domain.map((d, i) => (
                          <span key={i} className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-200 text-xs">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <h4 className="text-emerald-300 font-medium mb-2">正面表现</h4>
                      <ul className="space-y-1">
                        {data.positive.map((p, i) => (
                          <li key={i} className="text-emerald-200 text-sm flex items-center gap-2">
                            <Plus size={12} /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                      <h4 className="text-rose-300 font-medium mb-2">负面表现</h4>
                      <ul className="space-y-1">
                        {data.negative.map((n, i) => (
                          <li key={i} className="text-rose-200 text-sm flex items-center gap-2">
                            <Minus size={12} /> {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-3">关联阅读</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag label={data.ruler} type="planet" name={data.ruler} />
                      {data.relatedSigns.map((s, i) => (
                        <Tag key={i} label={s} type="sign" name={s} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {type === 'element' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border"
                    style={{
                      background: `linear-gradient(135deg, ${data.color}30, transparent)`,
                      borderColor: `${data.color}40`,
                    }}
                  >
                    {data.symbol}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{data.name}元素</h2>
                    <p className="text-sm" style={{ color: data.color }}>元素 · Element</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-indigo-200 leading-relaxed">{data.meaning}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-2">核心特质</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.traits.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-lg text-xs"
                          style={{ backgroundColor: `${data.color}20`, color: data.color }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <h4 className="text-emerald-300 font-medium mb-2">正面特质</h4>
                      <ul className="space-y-1">
                        {data.positive.map((p, i) => (
                          <li key={i} className="text-emerald-200 text-sm flex items-center gap-2">
                            <Plus size={12} /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                      <h4 className="text-rose-300 font-medium mb-2">负面特质</h4>
                      <ul className="space-y-1">
                        {data.negative.map((n, i) => (
                          <li key={i} className="text-rose-200 text-sm flex items-center gap-2">
                            <Minus size={12} /> {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-3">所属星座</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.signs.map((s, i) => (
                        <Tag key={i} label={s} type="sign" name={s} color={data.color} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {type === 'modality' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border"
                    style={{
                      background: `linear-gradient(135deg, ${data.color}30, transparent)`,
                      borderColor: `${data.color}40`,
                    }}
                  >
                    {data.symbol}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{data.name}型</h2>
                    <p className="text-sm" style={{ color: data.color }}>三方性 · Modality</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-indigo-200 leading-relaxed">{data.meaning}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-2">核心特质</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.traits.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-lg text-xs"
                          style={{ backgroundColor: `${data.color}20`, color: data.color }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <h4 className="text-emerald-300 font-medium mb-2">正面特质</h4>
                      <ul className="space-y-1">
                        {data.positive.map((p, i) => (
                          <li key={i} className="text-emerald-200 text-sm flex items-center gap-2">
                            <Plus size={12} /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                      <h4 className="text-rose-300 font-medium mb-2">负面特质</h4>
                      <ul className="space-y-1">
                        {data.negative.map((n, i) => (
                          <li key={i} className="text-rose-200 text-sm flex items-center gap-2">
                            <Minus size={12} /> {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-3">所属星座</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.signs.map((s, i) => (
                        <Tag key={i} label={s} type="sign" name={s} color={data.color} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {type === 'planetSign' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-amber-500/30 flex items-center justify-center text-3xl border border-violet-500/30">
                    <Link2 size={32} className="text-violet-300" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {data.planet} × {data.sign}
                    </h2>
                    <p className="text-violet-400 text-sm">行星 × 星座 · 组合解读</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-indigo-200 leading-relaxed">{data.meaning}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-3">关键主题</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.keyThemes.map((t, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-200 text-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-3">关联阅读</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag label={data.planet} type="planet" name={data.planet} />
                      <Tag label={data.sign} type="sign" name={data.sign} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {type === 'planetHouse' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-violet-500/30 flex items-center justify-center text-3xl border border-amber-500/30">
                    <Link2 size={32} className="text-amber-300" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {data.planet} × 第{data.house}宫
                    </h2>
                    <p className="text-amber-400 text-sm">行星 × 宫位 · 组合解读</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-indigo-200 leading-relaxed">{data.meaning}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-3">关键主题</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.keyThemes.map((t, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-200 text-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-3">关联阅读</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag label={data.planet} type="planet" name={data.planet} />
                      <Tag label={`第${data.house}宫`} type="house" name={data.house} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {type === 'signHouse' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-violet-500/30 flex items-center justify-center text-3xl border border-emerald-500/30">
                    <Link2 size={32} className="text-emerald-300" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {data.sign} × 第{data.house}宫
                    </h2>
                    <p className="text-emerald-400 text-sm">星座 × 宫位 · 组合解读</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-indigo-200 leading-relaxed">{data.meaning}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-3">关键主题</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.keyThemes.map((t, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-200 text-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-3">关联阅读</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag label={data.sign} type="sign" name={data.sign} />
                      <Tag label={`第${data.house}宫`} type="house" name={data.house} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (
    title: string,
    key: string,
    icon: React.ReactNode,
    items: Array<{ name: string; symbol?: string; meaning: string; onClick: () => void; badge?: string; badgeColor?: string }>,
    emptyText: string
  ) => {
    if (activeCategory !== 'all' && activeCategory !== key) return null;
    if (searchQuery && items.length === 0) return null;

    return (
      <div className="mb-8">
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between mb-4 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-300 group-hover:bg-violet-500/30 transition-colors">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <span className="text-sm text-indigo-400">({items.length})</span>
          </div>
          {expandedSections[key] ? (
            <Minus size={20} className="text-indigo-400" />
          ) : (
            <Plus size={20} className="text-indigo-400" />
          )}
        </button>

        {expandedSections[key] && (
          <>
            {items.length === 0 ? (
              <div className="text-center py-8 text-indigo-400/60">{emptyText}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="group relative p-5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {item.symbol && (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-amber-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            {item.symbol}
                          </div>
                        )}
                        <div>
                          <h4 className="text-white font-semibold group-hover:text-violet-200 transition-colors">
                            {item.name}
                          </h4>
                          {item.badge && (
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${item.badgeColor}20`, color: item.badgeColor }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-indigo-300/70 text-sm line-clamp-2">{item.meaning}</p>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-violet-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-4rem)] py-8 px-4">
      {renderDetail()}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-violet-300 via-amber-200 to-violet-300 bg-clip-text text-transparent">
              占星骰子知识库
            </span>
          </h2>
          <p className="text-indigo-300/70 max-w-xl mx-auto">
            全面了解行星、星座、宫位、元素、三方性的详细含义，掌握组合解读技巧，深入理解占星骰子的奥秘。
          </p>
        </div>

        <div className="relative mb-8">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
          <input
            type="text"
            placeholder="搜索占星知识：行星、星座、宫位、关键词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-indigo-400/50 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={16} className="text-indigo-400" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as KnowledgeCategory);
                  setSearchQuery('');
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
                  ${isActive
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 text-indigo-300 hover:bg-white/10 hover:text-white border border-white/10'
                  }
                `}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {searchQuery && (
          <div className="mb-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <p className="text-violet-200 text-sm">
              搜索 "<span className="font-medium">{searchQuery}</span>" 的结果：
              共 {Object.values(filteredData).flat().length} 条
            </p>
          </div>
        )}

        {renderSection(
          '行星',
          'planets',
          <Sun size={20} />,
          filteredData.planets.map((p) => ({
            name: p.name,
            symbol: p.symbol,
            meaning: p.meaning,
            onClick: () => setDetailItem({ type: 'planet', data: p }),
          })),
          '暂无匹配的行星'
        )}

        {renderSection(
          '星座',
          'signs',
          <Star size={20} />,
          filteredData.signs.map((s) => ({
            name: s.name,
            symbol: s.symbol,
            meaning: s.meaning,
            badge: `${s.element}·${s.modality}`,
            badgeColor: getElement(s.element)?.color,
            onClick: () => setDetailItem({ type: 'sign', data: s }),
          })),
          '暂无匹配的星座'
        )}

        {renderSection(
          '宫位',
          'houses',
          <Home size={20} />,
          filteredData.houses.map((h) => ({
            name: h.name,
            symbol: `${h.number}`,
            meaning: h.meaning,
            onClick: () => setDetailItem({ type: 'house', data: h }),
          })),
          '暂无匹配的宫位'
        )}

        {renderSection(
          '元素',
          'elements',
          <Flame size={20} />,
          filteredData.elements.map((e) => ({
            name: `${e.name}元素`,
            symbol: e.symbol,
            meaning: e.meaning,
            badgeColor: e.color,
            onClick: () => setDetailItem({ type: 'element', data: e }),
          })),
          '暂无匹配的元素'
        )}

        {renderSection(
          '三方性',
          'modalities',
          <Zap size={20} />,
          filteredData.modalities.map((m) => ({
            name: `${m.name}型`,
            symbol: m.symbol,
            meaning: m.meaning,
            badgeColor: m.color,
            onClick: () => setDetailItem({ type: 'modality', data: m }),
          })),
          '暂无匹配的三方性'
        )}

        {(activeCategory === 'all' || activeCategory === 'combos') && (
          <div className="mb-8">
            <button
              onClick={() => toggleSection('combos')}
              className="w-full flex items-center justify-between mb-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-300 group-hover:bg-violet-500/30 transition-colors">
                  <Link2 size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">组合解读</h3>
                <span className="text-sm text-indigo-400">
                  ({PLANET_SIGN_COMBOS.length + PLANET_HOUSE_COMBOS.length + SIGN_HOUSE_COMBOS.length})
                </span>
              </div>
              {expandedSections['combos'] ? (
                <Minus size={20} className="text-indigo-400" />
              ) : (
                <Plus size={20} className="text-indigo-400" />
              )}
            </button>

            {expandedSections['combos'] && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Sun size={16} className="text-amber-400" />
                    行星 × 星座
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PLANET_SIGN_COMBOS.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setDetailItem({ type: 'planetSign', data: c })}
                        className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-white/10 transition-all text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{c.planet} × {c.sign}</span>
                          <ArrowRight size={14} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-indigo-300/70 text-xs line-clamp-1">{c.meaning}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Home size={16} className="text-violet-400" />
                    行星 × 宫位
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PLANET_HOUSE_COMBOS.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setDetailItem({ type: 'planetHouse', data: c })}
                        className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-white/10 transition-all text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{c.planet} × 第{c.house}宫</span>
                          <ArrowRight size={14} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-indigo-300/70 text-xs line-clamp-1">{c.meaning}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Star size={16} className="text-emerald-400" />
                    星座 × 宫位
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {SIGN_HOUSE_COMBOS.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setDetailItem({ type: 'signHouse', data: c })}
                        className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-all text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{c.sign} × 第{c.house}宫</span>
                          <ArrowRight size={14} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-indigo-300/70 text-xs line-clamp-1">{c.meaning}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {searchQuery && Object.values(filteredData).flat().length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-indigo-400/50" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">未找到相关内容</h4>
            <p className="text-indigo-300/60 text-sm">尝试使用其他关键词搜索，或浏览分类浏览完整知识库</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
