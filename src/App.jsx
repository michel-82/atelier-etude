import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Calculator, FlaskConical, Languages, Lock, Plus, Trash2, Edit3, ChevronRight, Award, TrendingUp, Brain, X, Check, RotateCcw, BarChart3, ArrowLeft, LogOut, Sparkles, Camera, Globe, Landmark, Cross, Calendar, Clock, AlertCircle, Wand2, Image as ImageIcon, Tag } from 'lucide-react';

const SUBJECTS = {
  francais: { name: 'Français', icon: BookOpen, color: '#c8553d', accent: '#f4e4c1', isLanguage: false },
  maths: { name: 'Mathématiques', icon: Calculator, color: '#2d5a3d', accent: '#dde5b6', isLanguage: false },
  sciences: { name: 'Sciences', icon: FlaskConical, color: '#4a6fa5', accent: '#d4e0f0', isLanguage: false },
  anglais: { name: 'Anglais', icon: Languages, color: '#8b5a3c', accent: '#e8d5c4', isLanguage: true },
  allemand: { name: 'Allemand', icon: Languages, color: '#5d4e37', accent: '#e0d8c3', isLanguage: true },
  histoire: { name: 'Histoire', icon: Landmark, colohr: '#7a4ha3a', accent: '#ead5c8', isLanguage: false },
  geographie: { name: 'Géographie', icon: Globe, color: '#3d6b8a', accent: '#cfdde8', isLanguage: false },
  religion: { name: 'Religion', icon: Cross, color: '#6b4a7a', accent: '#dccfe5', isLanguage: false },
};

const LANGUAGE_CATEGORIES = {
  vocabulaire: { name: 'Vocabulaire', emoji: '📖' },
  grammaire: { name: 'Grammaire', emoji: '📐' },
  conjugaison: { name: 'Conjugaison', emoji: '⏳' },
  tout: { name: 'Tout mélangé', emoji: '🎯' },
};

const DEFAULT_CONTENT = {
  francais: {
    quizzes: [{ id: 'fr-q1', title: 'Les classes grammaticales', questions: [
      { q: "Dans la phrase « Le chat dort paisiblement », quel est l'adverbe ?", choices: ['Le', 'chat', 'dort', 'paisiblement'], answer: 3 },
      { q: "Quel mot est un adjectif qualificatif ?", choices: ['rapidement', 'magnifique', 'manger', 'avec'], answer: 1 },
      { q: "« Nous » est un pronom...", choices: ['démonstratif', 'possessif', 'personnel', 'relatif'], answer: 2 },
    ]}],
    flashcards: [
      { id: 'fr-f1', front: 'Synonyme de « rapide »', back: 'Véloce, prompt, vif' },
      { id: 'fr-f2', front: 'Définition d\'une métaphore', back: 'Figure de style qui établit une comparaison sans utiliser de mot de comparaison' },
    ]
  },
  maths: {
    quizzes: [{ id: 'ma-q1', title: 'Calcul et fractions', questions: [
      { q: "Combien font 3/4 + 1/2 ?", choices: ['4/6', '5/4', '4/4', '1'], answer: 1 },
      { q: "Quel est 15% de 80 ?", choices: ['8', '12', '15', '20'], answer: 1 },
      { q: "(-3) × (-4) = ?", choices: ['-12', '-7', '12', '7'], answer: 2 },
    ]}],
    flashcards: [
      { id: 'ma-f1', front: 'Théorème de Pythagore', back: 'Dans un triangle rectangle : a² + b² = c² (où c est l\'hypoténuse)' },
      { id: 'ma-f2', front: 'Aire d\'un cercle', back: 'A = π × r² (r = rayon)' },
    ]
  },
  sciences: { quizzes: [], flashcards: [] },
  anglais: {
    quizzes: [
      { id: 'an-q1', title: 'Vocabulaire - La maison', category: 'vocabulaire', questions: [
        { q: "Comment dit-on « cuisine » en anglais ?", choices: ['bedroom', 'kitchen', 'bathroom', 'garden'], answer: 1 },
        { q: "Que signifie « stairs » ?", choices: ['les escaliers', 'la salle', 'le toit', 'le sol'], answer: 0 },
      ]},
      { id: 'an-q2', title: 'Present Simple vs Continuous', category: 'grammaire', questions: [
        { q: "« She ___ tennis every Sunday »", choices: ['plays', 'is playing', 'play', 'playing'], answer: 0 },
        { q: "« Look! It ___ »", choices: ['rains', 'is raining', 'rain', 'rained'], answer: 1 },
      ]},
      { id: 'an-q3', title: 'Verbes irréguliers', category: 'conjugaison', questions: [
        { q: "Prétérit de « to go » ?", choices: ['goed', 'went', 'gone', 'going'], answer: 1 },
        { q: "Participe passé de « to see » ?", choices: ['saw', 'seed', 'seen', 'sawn'], answer: 2 },
      ]},
    ],
    flashcards: [
      { id: 'an-f1', front: 'To go - prétérit / participe passé', back: 'went / gone', category: 'conjugaison' },
      { id: 'an-f2', front: 'Traduire : « J\'ai 13 ans »', back: 'I am 13 years old', category: 'vocabulaire' },
    ]
  },
  allemand: {
    quizzes: [{ id: 'al-q1', title: 'Salutations', category: 'vocabulaire', questions: [
      { q: "Comment dit-on « Bonjour » (formel) ?", choices: ['Hallo', 'Guten Tag', 'Tschüss', 'Danke'], answer: 1 },
      { q: "Que signifie « Auf Wiedersehen » ?", choices: ['Bonjour', 'Merci', 'Au revoir', 'Pardon'], answer: 2 },
    ]}],
    flashcards: [
      { id: 'al-f1', front: 'Bonjour (formel)', back: 'Guten Tag', category: 'vocabulaire' },
      { id: 'al-f2', front: 'Les 4 cas en allemand', back: 'Nominativ, Akkusativ, Dativ, Genitiv', category: 'grammaire' },
      { id: 'al-f3', front: 'Conjugaison de "sein" (être) au présent', back: 'ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie sind', category: 'conjugaison' },
    ]
  },
  histoire: { quizzes: [], flashcards: [] },
  geographie: { quizzes: [], flashcards: [] },
  religion: { quizzes: [], flashcards: [] },
};

const STORAGE_KEYS = { CONTENT: 'study-app-content-v3', STATS: 'study-app-stats', PIN: 'study-app-pin', ASSIGNMENTS: 'study-app-assignments', FAMILY_CODE: 'study-app-family-code' };

const safeGet = async (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const safeSet = async (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error(e); }
};

const cloudGet = async (code, fallback) => { if (!code) return fallback; try { const r = await fetch('/api/devoirs?code=' + encodeURIComponent(code)); if (!r.ok) return fallback; const d = await r.json(); return d.assignments || fallback; } catch { return fallback; } };
const cloudSet = async (code, assignments) => { if (!code) return false; try { const r = await fetch('/api/devoirs?code=' + encodeURIComponent(code), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assignments }) }); return r.ok; } catch { return false; } };

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
};
const formatDateShort = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '';

export default function App() {
  const [view, setView] = useState('home');
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeFlashcards, setActiveFlashcards] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [stats, setStats] = useState({ totalQuizzes: 0, correctAnswers: 0, totalAnswers: 0, bySubject: {}, history: [] });
  const [assignments, setAssignments] = useState([]);
  const [familyCode, setFamilyCode] = useState('');
  const [parentMode, setParentMode] = useState(false);
  const [pinSet, setPinSet] = useState(false);
  const [loading, setLoading] = useState(true); const [showFamilyMenu, setShowFamilyMenu] = useState(false);

  useEffect(() => {
    (async () => {
      const savedContent = await safeGet(STORAGE_KEYS.CONTENT, DEFAULT_CONTENT);
      const merged = { ...DEFAULT_CONTENT, ...savedContent };
      Object.keys(SUBJECTS).forEach(k => { if (!merged[k]) merged[k] = { quizzes: [], flashcards: [] }; });
      const savedStats = await safeGet(STORAGE_KEYS.STATS, { totalQuizzes: 0, correctAnswers: 0, totalAnswers: 0, bySubject: {}, history: [] });
      const savedPin = await safeGet(STORAGE_KEYS.PIN, null);
      const savedAssignments = await safeGet(STORAGE_KEYS.ASSIGNMENTS, []);
      setContent(merged); setStats(savedStats); setPinSet(!!savedPin); setAssignments(savedAssignments); setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const code = localStorage.getItem(STORAGE_KEYS.FAMILY_CODE) || '';
    setFamilyCode(code);
    const refresh = async () => { if (!code) return; const remote = await cloudGet(code, null); if (remote && remote.length > 0) { setAssignments(remote); safeSet(STORAGE_KEYS.ASSIGNMENTS, remote); } };
    refresh();
    const onVis = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const updateContent = async (c) => { setContent(c); await safeSet(STORAGE_KEYS.CONTENT, c); };
  const updateStats = async (s) => { setStats(s); await safeSet(STORAGE_KEYS.STATS, s); };
  const updateAssignments = async (a) => { setAssignments(a); await safeSet(STORAGE_KEYS.ASSIGNMENTS, a); if (familyCode) cloudSet(familyCode, a); };

  if (loading) return <div style={{ minHeight: '100vh', background: '#faf6ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontSize: '1.5rem', color: '#3a2e26' }}>Chargement...</div>;

  const goHome = () => { setView('home'); setActiveSubject(null); setActiveQuiz(null); setActiveFlashcards(null); setActiveAssignment(null); };

  return (
    <div style={{ minHeight: '100vh', background: '#faf6ef', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: '#3a2e26' }}>
      <FontImports />
      <BackgroundDecor />
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250, 246, 239, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(58, 46, 38, 0.08)' }}>
        <div className="max-w-6xl" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #c8553d, #8b3a26)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={20} color="#faf6ef" /></div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.02em' }}>L'Atelier d'Étude</div>
          </button>
          {parentMode ? <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}><button onClick={() => setShowFamilyMenu(true)} className="parent-badge" title="Code famille">⚙️</button><button onClick={() => setParentMode(false)} className="parent-badge active"><LogOut size={14} /> Mode parent</button></div> : <button onClick={() => setView('parent-login')} className="parent-badge"><Lock size={14} /> Mode parent</button>}
        </div>
      </header>
      <main className="max-w-6xl" style={{ padding: '2rem 1.25rem', position: 'relative', zIndex: 1 }}>
        {view === 'home' && <HomeView stats={stats} content={content} assignments={assignments} onSelectSubject={(s) => { setActiveSubject(s); setView('subject'); }} onStats={() => setView('stats')} onAssignments={() => setView('assignments')} parentMode={parentMode} onOpenAssignment={(a) => { setActiveAssignment(a); setView('assignment'); }} />}
        {view === 'subject' && activeSubject && <SubjectView subject={activeSubject} content={content[activeSubject]} parentMode={parentMode} onBack={() => { setView('home'); setActiveSubject(null); }} onStartQuiz={(q) => { setActiveQuiz(q); setView('quiz'); }} onStartFlashcards={(s) => { setActiveFlashcards(s); setView('flashcards'); }} onUpdateContent={(u) => updateContent({ ...content, [activeSubject]: u })} />}
        {view === 'quiz' && activeQuiz && <QuizView quiz={activeQuiz} subject={activeSubject || activeAssignment?.subject} onFinish={async (correct, total) => {
          const sk = activeSubject || activeAssignment?.subject;
          const ns = { ...stats };
          ns.totalQuizzes += 1; ns.correctAnswers += correct; ns.totalAnswers += total;
          ns.bySubject[sk] = ns.bySubject[sk] || { quizzes: 0, correct: 0, total: 0 };
          ns.bySubject[sk].quizzes += 1; ns.bySubject[sk].correct += correct; ns.bySubject[sk].total += total;
          ns.history.push({ date: new Date().toISOString(), subject: sk, quizTitle: activeQuiz.title, correct, total });
          if (ns.history.length > 50) ns.history = ns.history.slice(-50);
          await updateStats(ns);
        }} onBack={() => { if (activeAssignment) { setView('assignment'); setActiveQuiz(null); } else { setView('subject'); setActiveQuiz(null); } }} />}
        {view === 'flashcards' && activeFlashcards && <FlashcardsView cards={activeFlashcards} subject={activeSubject} onBack={() => { setView('subject'); setActiveFlashcards(null); }} />}
        {view === 'stats' && <StatsView stats={stats} onBack={() => setView('home')} />}
        {view === 'assignments' && <AssignmentsView assignments={assignments} parentMode={parentMode} onBack={() => setView('home')} onOpen={(a) => { setActiveAssignment(a); setView('assignment'); }} onUpdateAssignments={updateAssignments} />}
        {view === 'assignment' && activeAssignment && <AssignmentView assignment={activeAssignment} onUpdateAssignments={updateAssignments} assignments={assignments} parentMode={parentMode} onBack={() => { setView('assignments'); setActiveAssignment(null); }} onStartQuiz={(q) => { setActiveQuiz(q); setView('quiz'); }} onDelete={async () => { const na = assignments.filter(a => a.id !== activeAssignment.id); await updateAssignments(na); setView('assignments'); setActiveAssignment(null); }} />}
        {view === 'parent-login' && <ParentLogin pinSet={pinSet} onSuccess={() => { setParentMode(true); setView('home'); }} onBack={() => setView('home')} onSetPin={async (p) => { await safeSet(STORAGE_KEYS.PIN, p); setPinSet(true); setParentMode(true); setView('home'); }} />}
              </main>
        {parentMode && showFamilyMenu && (<div onClick={() => setShowFamilyMenu(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(58, 46, 38, 0.4)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}><div onClick={(e) => e.stopPropagation()} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px', width: '100%' }}><div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.25rem' }}>Code famille</div><span style={{ color: '#6b5544', fontWeight: 600 }}>Code famille:</span><input value={familyCode} onChange={(e) => setFamilyCode(e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 12))} placeholder="ex: martin2026" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '0.4rem 0.6rem', fontSize: '0.85rem', width: '140px' }} /><button onClick={async () => { if (familyCode.length < 4) { alert('Code famille: 4 \u00e0 12 caract\u00e8res'); return; } localStorage.setItem(STORAGE_KEYS.FAMILY_CODE, familyCode); const remote = await cloudGet(familyCode, null); if (remote && remote.length > 0) { setAssignments(remote); safeSet(STORAGE_KEYS.ASSIGNMENTS, remote); alert('Code famille enregistr\u00e9 ! ' + remote.length + ' devoir(s) charg\u00e9(s) depuis le cloud.'); } else if (assignments.length > 0) { await cloudSet(familyCode, assignments); alert('Code famille enregistr\u00e9 ! Devoirs locaux pouss\u00e9s sur le cloud.'); } else { alert('Code famille enregistr\u00e9.'); } }} style={{ background: '#c8553d', color: 'white', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Enregistrer</button></div></div>)}
        <Styles />
    </div>
  );
}

function HomeView({ stats, content, assignments, onSelectSubject, onStats, onAssignments, parentMode, onOpenAssignment }) {
  const accuracy = stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0;
  const upcoming = assignments.filter(a => { const d = daysUntil(a.dueDate); return d !== null && d >= 0 && d <= 7; }).sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate)).slice(0, 3);
  return (
    <div className="fade-in">
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8b6f47', marginBottom: '0.75rem', fontWeight: 600 }}>✦ Bienvenue</div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Apprendre,<br /><span style={{ fontStyle: 'italic', color: '#c8553d' }}>jour après jour</span>.</h1>
        <p style={{ fontSize: '1.05rem', color: '#6b5544', maxWidth: '540px', lineHeight: 1.6 }}>{parentMode ? "Mode parent activé. Ajoutez des devoirs en photographiant les leçons." : "Choisis un devoir à préparer ou révise une matière."}</p>
      </section>
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={22} /> Devoirs à venir</h2>
          <button onClick={onAssignments} className="link-btn">Tout voir <ChevronRight size={14} /></button>
        </div>
        {upcoming.length === 0 ? <div className="empty-state">{parentMode ? 'Aucun devoir programmé. Allez dans « Tout voir » pour photographier une leçon.' : 'Aucun devoir prévu cette semaine.'}</div> : (
          <div className="content-list">
            {upcoming.map(a => {
              const subj = SUBJECTS[a.subject]; const Icon = subj?.icon || BookOpen; const days = daysUntil(a.dueDate);
              return (
                <button key={a.id} onClick={() => onOpenAssignment(a)} className="assignment-card" style={{ '--accent': subj?.color || '#3a2e26' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: subj?.accent || '#f4e4c1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: subj?.color || '#3a2e26', flexShrink: 0 }}><Icon size={20} /></div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div className="content-title">{a.title}</div>
                    <div className="content-meta">{subj?.name} · {a.quiz ? `${a.quiz.questions.length} questions` : 'Quiz à générer'}</div>
                  </div>
                  <div className={`due-badge ${days <= 1 ? 'urgent' : ''}`}><Clock size={13} />{days === 0 ? "Aujourd'hui" : days === 1 ? 'Demain' : `Dans ${days} j`}</div>
                </button>
              );
            })}
          </div>
        )}
      </section>
      <section className="stats-summary">
        <button onClick={onStats} className="stat-card"><div className="stat-icon-wrap" style={{ background: '#fce8d8' }}><Award size={20} color="#c8553d" /></div><div><div className="stat-value">{stats.totalQuizzes}</div><div className="stat-label">Quiz complétés</div></div></button>
        <button onClick={onStats} className="stat-card"><div className="stat-icon-wrap" style={{ background: '#dde5b6' }}><TrendingUp size={20} color="#2d5a3d" /></div><div><div className="stat-value">{accuracy}%</div><div className="stat-label">Réussite</div></div></button>
        <button onClick={onStats} className="stat-card"><div className="stat-icon-wrap" style={{ background: '#d4e0f0' }}><BarChart3 size={20} color="#4a6fa5" /></div><div><div className="stat-value">{stats.correctAnswers}</div><div className="stat-label">Bonnes réponses</div></div></button>
      </section>
      <section style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Toutes les matières</h2>
        <div className="subjects-grid">
          {Object.entries(SUBJECTS).map(([key, subj]) => {
            const Icon = subj.icon; const c = content[key] || { quizzes: [], flashcards: [] };
            return (
              <button key={key} onClick={() => onSelectSubject(key)} className="subject-card" style={{ '--accent': subj.color, '--accent-bg': subj.accent }}>
                <div className="subject-icon"><Icon size={24} /></div>
                <div className="subject-name">{subj.name}</div>
                <div className="subject-meta"><span>{c.quizzes.length} quiz · {c.flashcards.length} cartes</span>{subj.isLanguage && <span className="lang-tag"><Tag size={10} /> par catégorie</span>}</div>
                <ChevronRight size={18} className="subject-arrow" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SubjectView({ subject, content, parentMode, onBack, onStartQuiz, onStartFlashcards, onUpdateContent }) {
  const subj = SUBJECTS[subject]; const Icon = subj.icon;
  const [editing, setEditing] = useState(null);
  const [activeCategory, setActiveCategory] = useState('tout');
  const isLanguage = subj.isLanguage;
  const filteredQuizzes = isLanguage && activeCategory !== 'tout' ? content.quizzes.filter(q => q.category === activeCategory) : content.quizzes;
  const filteredFlashcards = isLanguage && activeCategory !== 'tout' ? content.flashcards.filter(f => f.category === activeCategory) : content.flashcards;
  const deleteQuiz = (id) => { if (confirm('Supprimer ce quiz ?')) onUpdateContent({ ...content, quizzes: content.quizzes.filter(q => q.id !== id) }); };
  const deleteFlashcard = (id) => { if (confirm('Supprimer cette flashcard ?')) onUpdateContent({ ...content, flashcards: content.flashcards.filter(f => f.id !== id) }); };

  return (
    <div className="fade-in">
      <button onClick={onBack} className="back-btn"><ArrowLeft size={16} /> Retour</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: subj.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: subj.color }}><Icon size={32} /></div>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>{subj.name}</h1>
          <div style={{ color: '#8b6f47', marginTop: '0.25rem' }}>{content.quizzes.length} quiz · {content.flashcards.length} flashcards</div>
        </div>
      </div>
      {isLanguage && (
        <div className="category-selector">
          <div style={{ fontSize: '0.85rem', color: '#8b6f47', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Que veux-tu travailler ?</div>
          <div className="category-tabs">
            {Object.entries(LANGUAGE_CATEGORIES).map(([key, cat]) => {
              const count = key === 'tout' ? content.quizzes.length + content.flashcards.length : content.quizzes.filter(q => q.category === key).length + content.flashcards.filter(f => f.category === key).length;
              return <button key={key} onClick={() => setActiveCategory(key)} className={`category-tab ${activeCategory === key ? 'active' : ''}`} style={{ '--accent': subj.color }}><span style={{ fontSize: '1.1rem' }}>{cat.emoji}</span><span>{cat.name}</span><span className="category-count">{count}</span></button>;
            })}
          </div>
        </div>
      )}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 600 }}>Quiz {isLanguage && activeCategory !== 'tout' && <span style={{ fontSize: '1rem', color: '#8b6f47', fontWeight: 400 }}>({LANGUAGE_CATEGORIES[activeCategory].name})</span>}</h2>
          {parentMode && <button onClick={() => setEditing({ type: 'quiz', data: null })} className="add-btn" style={{ background: subj.color }}><Plus size={16} /> Nouveau quiz</button>}
        </div>
        {filteredQuizzes.length === 0 ? <div className="empty-state">{isLanguage && activeCategory !== 'tout' ? `Aucun quiz de ${LANGUAGE_CATEGORIES[activeCategory].name.toLowerCase()}${parentMode ? '. Ajoutez-en un !' : '.'}` : `Aucun quiz${parentMode ? '. Ajoutez-en un !' : '.'}`}</div> : (
          <div className="content-list">
            {filteredQuizzes.map(qz => (
              <div key={qz.id} className="content-item">
                <button onClick={() => onStartQuiz(qz)} className="content-main">
                  <div className="content-title">{qz.title}{qz.category && isLanguage && <span className="cat-badge" style={{ background: subj.accent, color: subj.color }}>{LANGUAGE_CATEGORIES[qz.category]?.emoji} {LANGUAGE_CATEGORIES[qz.category]?.name}</span>}</div>
                  <div className="content-meta">{qz.questions.length} question{qz.questions.length > 1 ? 's' : ''}</div>
                </button>
                {parentMode && <div className="content-actions"><button onClick={() => setEditing({ type: 'quiz', data: qz })} className="icon-btn"><Edit3 size={15} /></button><button onClick={() => deleteQuiz(qz.id)} className="icon-btn danger"><Trash2 size={15} /></button></div>}
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 600 }}>Flashcards</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {filteredFlashcards.length > 0 && <button onClick={() => onStartFlashcards(filteredFlashcards)} className="add-btn" style={{ background: '#3a2e26' }}><Brain size={16} /> Réviser</button>}
            {parentMode && <button onClick={() => setEditing({ type: 'flashcard', data: null })} className="add-btn" style={{ background: subj.color }}><Plus size={16} /> Nouvelle carte</button>}
          </div>
        </div>
        {filteredFlashcards.length === 0 ? <div className="empty-state">Aucune flashcard{parentMode ? '. Ajoutez-en une !' : '.'}</div> : (
          <div className="flashcard-grid">
            {filteredFlashcards.map(fc => (
              <div key={fc.id} className="flashcard-preview">
                {fc.category && isLanguage && <div className="cat-badge-mini" style={{ background: subj.accent, color: subj.color }}>{LANGUAGE_CATEGORIES[fc.category]?.emoji}</div>}
                <div className="flashcard-front-text">{fc.front}</div>
                <div className="flashcard-back-text">→ {fc.back}</div>
                {parentMode && <div className="flashcard-actions"><button onClick={() => setEditing({ type: 'flashcard', data: fc })} className="icon-btn"><Edit3 size={14} /></button><button onClick={() => deleteFlashcard(fc.id)} className="icon-btn danger"><Trash2 size={14} /></button></div>}
              </div>
            ))}
          </div>
        )}
      </section>
      {editing && <EditorModal editing={editing} subject={subject} content={content} onClose={() => setEditing(null)} onSave={(u) => { onUpdateContent(u); setEditing(null); }} />}
    </div>
  );
}

function QuizView({ quiz, subject, onFinish, onBack }) {
  const subj = SUBJECTS[subject] || SUBJECTS.francais;
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const question = quiz.questions[currentQ];
  const isLast = currentQ === quiz.questions.length - 1;
  const handleAnswer = (idx) => { if (answered) return; setSelectedAnswer(idx); setAnswered(true); if (idx === question.answer) setScore(score + 1); };
  const handleNext = () => { if (isLast) { setFinished(true); if (!hasReported) { onFinish(score, quiz.questions.length); setHasReported(true); } } else { setCurrentQ(currentQ + 1); setSelectedAnswer(null); setAnswered(false); } };
  const restart = () => { setCurrentQ(0); setSelectedAnswer(null); setAnswered(false); setScore(0); setFinished(false); setHasReported(false); };

  if (finished) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    const msg = pct === 100 ? 'Parfait ! Bravo 🎉' : pct >= 75 ? 'Excellent travail !' : pct >= 50 ? 'Bien joué, continue !' : 'Allez, encore un effort !';
    return (
      <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{pct === 100 ? '🏆' : pct >= 75 ? '⭐' : pct >= 50 ? '👍' : '💪'}</div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{msg}</h2>
        <div style={{ fontSize: '1.25rem', color: '#6b5544', marginBottom: '2rem' }}>Tu as obtenu <strong style={{ color: subj.color }}>{score} / {quiz.questions.length}</strong> ({pct}%)</div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={restart} className="primary-btn"><RotateCcw size={16} /> Recommencer</button>
          <button onClick={onBack} className="secondary-btn">Retour</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button onClick={onBack} className="back-btn"><ArrowLeft size={16} /> Quitter</button>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#8b6f47', fontWeight: 600 }}><span>{quiz.title}</span><span>Question {currentQ + 1} / {quiz.questions.length}</span></div>
        <div style={{ height: '6px', background: 'rgba(58, 46, 38, 0.08)', borderRadius: '3px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${((currentQ + 1) / quiz.questions.length) * 100}%`, background: subj.color, transition: 'width 0.4s ease' }} /></div>
      </div>
      <div className="quiz-card">
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 500, marginBottom: '1.75rem', lineHeight: 1.3 }}>{question.q}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.choices.map((choice, idx) => {
            let cn = 'quiz-choice';
            if (answered) { if (idx === question.answer) cn += ' correct'; else if (idx === selectedAnswer) cn += ' incorrect'; else cn += ' faded'; }
            else if (idx === selectedAnswer) cn += ' selected';
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} className={cn} disabled={answered}>
                <span className="choice-letter">{String.fromCharCode(65 + idx)}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{choice}</span>
                {answered && idx === question.answer && <Check size={20} />}
                {answered && idx === selectedAnswer && idx !== question.answer && <X size={20} />}
              </button>
            );
          })}
        </div>
        {answered && <button onClick={handleNext} className="primary-btn" style={{ marginTop: '1.75rem', width: '100%', background: subj.color, justifyContent: 'center' }}>{isLast ? 'Voir le score' : 'Question suivante'} <ChevronRight size={18} /></button>}
      </div>
    </div>
  );
}

function FlashcardsView({ cards, subject, onBack }) {
  const subj = SUBJECTS[subject];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const next = () => { setFlipped(false); setIdx((idx + 1) % cards.length); };
  const prev = () => { setFlipped(false); setIdx((idx - 1 + cards.length) % cards.length); };
  return (
    <div className="fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button onClick={onBack} className="back-btn"><ArrowLeft size={16} /> Retour</button>
      <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#8b6f47', fontWeight: 600, fontSize: '0.9rem' }}>Carte {idx + 1} / {cards.length} — {flipped ? 'Réponse' : 'Question'}</div>
      <div onClick={() => setFlipped(!flipped)} className={`flashcard-big ${flipped ? 'flipped' : ''}`} style={{ '--accent': subj.color }}>
        <div className="flashcard-inner">
          <div className="flashcard-side flashcard-front">
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: subj.color, fontWeight: 700, marginBottom: '1rem' }}>Question</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 500, textAlign: 'center', lineHeight: 1.4 }}>{cards[idx].front}</div>
            <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#8b6f47' }}>Touche pour retourner</div>
          </div>
          <div className="flashcard-side flashcard-back">
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#faf6ef', opacity: 0.7, fontWeight: 700, marginBottom: '1rem' }}>Réponse</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.2rem, 2.8vw, 1.6rem)', fontWeight: 500, textAlign: 'center', lineHeight: 1.4, color: '#faf6ef' }}>{cards[idx].back}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={prev} className="secondary-btn">← Précédent</button>
        <button onClick={() => setFlipped(!flipped)} className="primary-btn" style={{ background: subj.color }}>{flipped ? 'Voir question' : 'Voir réponse'}</button>
        <button onClick={next} className="secondary-btn">Suivant →</button>
      </div>
    </div>
  );
}

function StatsView({ stats, onBack }) {
  const accuracy = stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0;
  return (
    <div className="fade-in">
      <button onClick={onBack} className="back-btn"><ArrowLeft size={16} /> Retour</button>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '2rem' }}>Mes progrès</h1>
      <div className="stats-grid">
        <div className="stat-block"><div className="stat-block-label">Quiz complétés</div><div className="stat-block-value">{stats.totalQuizzes}</div></div>
        <div className="stat-block"><div className="stat-block-label">Bonnes réponses</div><div className="stat-block-value">{stats.correctAnswers}<span style={{ fontSize: '1.1rem', color: '#8b6f47', fontWeight: 400 }}> / {stats.totalAnswers}</span></div></div>
        <div className="stat-block"><div className="stat-block-label">Taux de réussite</div><div className="stat-block-value" style={{ color: accuracy >= 75 ? '#2d5a3d' : accuracy >= 50 ? '#c8553d' : '#8b6f47' }}>{accuracy}%</div></div>
      </div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 600, margin: '2.5rem 0 1rem' }}>Par matière</h2>
      <div className="content-list">
        {Object.entries(SUBJECTS).map(([key, subj]) => {
          const s = stats.bySubject[key]; const acc = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0; const Icon = subj.icon;
          return (
            <div key={key} className="content-item" style={{ cursor: 'default' }}>
              <div className="content-main" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'default', padding: '1rem 1.25rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: subj.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: subj.color, flexShrink: 0 }}><Icon size={18} /></div>
                <div style={{ flex: 1 }}><div className="content-title">{subj.name}</div><div className="content-meta">{s ? `${s.quizzes} quiz · ${s.correct}/${s.total} bonnes réponses` : 'Aucune session'}</div></div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 600, color: subj.color }}>{s && s.total > 0 ? `${acc}%` : '—'}</div>
              </div>
            </div>
          );
        })}
      </div>
      {stats.history.length > 0 && (
        <>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 600, margin: '2.5rem 0 1rem' }}>Historique récent</h2>
          <div className="content-list">
            {[...stats.history].reverse().slice(0, 10).map((h, i) => {
              const subj = SUBJECTS[h.subject] || SUBJECTS.francais; const date = new Date(h.date); const pct = Math.round((h.correct / h.total) * 100);
              return (
                <div key={i} className="content-item" style={{ cursor: 'default' }}>
                  <div className="content-main" style={{ cursor: 'default', padding: '1rem 1.25rem' }}>
                    <div className="content-title">{h.quizTitle}</div>
                    <div className="content-meta">{subj.name} · {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: pct >= 75 ? '#2d5a3d' : pct >= 50 ? '#c8553d' : '#8b6f47', fontSize: '1.1rem', padding: '0 1.25rem' }}>{h.correct}/{h.total}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function ParentLogin({ pinSet, onSuccess, onBack, onSetPin }) {
  const [pin, setPin] = useState(''); const [confirmPin, setConfirmPin] = useState(''); const [error, setError] = useState(''); const [savedPin, setSavedPin] = useState(null);
  useEffect(() => { safeGet(STORAGE_KEYS.PIN, null).then(setSavedPin); }, []);
  const handleSubmit = () => {
    setError('');
    if (!pinSet) { if (pin.length < 4) { setError('Le code doit faire au moins 4 chiffres'); return; } if (pin !== confirmPin) { setError('Les deux codes ne correspondent pas'); return; } onSetPin(pin); }
    else { if (pin === savedPin) onSuccess(); else setError('Code incorrect'); }
  };
  return (
    <div className="fade-in" style={{ maxWidth: '420px', margin: '3rem auto' }}>
      <button onClick={onBack} className="back-btn"><ArrowLeft size={16} /> Retour</button>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 4px 30px rgba(58, 46, 38, 0.06)', border: '1px solid rgba(58, 46, 38, 0.06)' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #c8553d, #8b3a26)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}><Lock size={24} color="#faf6ef" /></div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{pinSet ? 'Mode parent' : 'Créer un code parent'}</h2>
        <p style={{ color: '#6b5544', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{pinSet ? 'Saisissez votre code pour gérer le contenu et les devoirs.' : 'Choisissez un code à 4+ chiffres pour protéger l\'accès au mode parent.'}</p>
        <input type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="Code parent" className="text-input" inputMode="numeric" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
        {!pinSet && <input type="password" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))} placeholder="Confirmer le code" className="text-input" inputMode="numeric" style={{ marginTop: '0.75rem' }} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />}
        {error && <div style={{ color: '#c8553d', fontSize: '0.9rem', marginTop: '0.75rem' }}>{error}</div>}
        <button onClick={handleSubmit} className="primary-btn" style={{ width: '100%', marginTop: '1.25rem', justifyContent: 'center' }}>{pinSet ? 'Déverrouiller' : 'Créer le code'}</button>
      </div>
    </div>
  );
}

function EditorModal({ editing, subject, content, onClose, onSave }) {
  const subj = SUBJECTS[subject]; const isLanguage = subj.isLanguage; const isQuiz = editing.type === 'quiz';
  const [quizTitle, setQuizTitle] = useState(editing.data?.title || '');
  const [questions, setQuestions] = useState(editing.data?.questions ? editing.data.questions.map(q => ({ ...q, choices: [...q.choices] })) : [{ q: '', choices: ['', '', '', ''], answer: 0 }]);
  const [front, setFront] = useState(editing.data?.front || '');
  const [back, setBack] = useState(editing.data?.back || '');
  const [category, setCategory] = useState(editing.data?.category || (isLanguage ? 'vocabulaire' : null));

  const saveQuiz = () => {
    if (!quizTitle.trim()) { alert('Donnez un titre au quiz'); return; }
    const validQs = questions.filter(q => q.q.trim() && q.choices.every(c => c.trim()));
    if (validQs.length === 0) { alert('Ajoutez au moins une question complète'); return; }
    const id = editing.data?.id || `${subject}-q-${Date.now()}`;
    const newQuiz = { id, title: quizTitle.trim(), questions: validQs };
    if (isLanguage) newQuiz.category = category;
    onSave({ ...content, quizzes: editing.data ? content.quizzes.map(q => q.id === id ? newQuiz : q) : [...content.quizzes, newQuiz] });
  };
  const saveFlashcard = () => {
    if (!front.trim() || !back.trim()) { alert('Remplissez les deux faces'); return; }
    const id = editing.data?.id || `${subject}-f-${Date.now()}`;
    const newCard = { id, front: front.trim(), back: back.trim() };
    if (isLanguage) newCard.category = category;
    onSave({ ...content, flashcards: editing.data ? content.flashcards.map(f => f.id === id ? newCard : f) : [...content.flashcards, newCard] });
  };
  const updateQuestion = (i, field, val) => { const nq = [...questions]; nq[i] = { ...nq[i], [field]: val }; setQuestions(nq); };
  const updateChoice = (qi, ci, val) => { const nq = [...questions]; nq[qi].choices[ci] = val; setQuestions(nq); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' }}>{isQuiz ? (editing.data ? 'Modifier le quiz' : 'Nouveau quiz') : (editing.data ? 'Modifier la flashcard' : 'Nouvelle flashcard')}</h2>
          <button onClick={onClose} className="icon-btn"><X size={20} /></button>
        </div>
        <div className="modal-body">
          {isLanguage && (
            <>
              <label className="field-label">Catégorie</label>
              <div className="cat-selector">
                {Object.entries(LANGUAGE_CATEGORIES).filter(([k]) => k !== 'tout').map(([key, cat]) => (
                  <button key={key} onClick={() => setCategory(key)} className={`cat-pick ${category === key ? 'active' : ''}`} style={{ '--accent': subj.color }}><span>{cat.emoji}</span> {cat.name}</button>
                ))}
              </div>
            </>
          )}
          {isQuiz ? (
            <>
              <label className="field-label" style={{ marginTop: isLanguage ? '1rem' : 0 }}>Titre du quiz</label>
              <input value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} className="text-input" placeholder="Ex: Conjugaison du présent" />
              <div style={{ marginTop: '1.5rem' }}>
                {questions.map((q, qi) => (
                  <div key={qi} className="question-editor">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: subj.color }}>Question {qi + 1}</div>
                      {questions.length > 1 && <button onClick={() => setQuestions(questions.filter((_, i) => i !== qi))} className="icon-btn danger"><Trash2 size={14} /></button>}
                    </div>
                    <input value={q.q} onChange={(e) => updateQuestion(qi, 'q', e.target.value)} className="text-input" placeholder="Énoncé de la question" />
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.choices.map((c, ci) => (
                        <div key={ci} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button onClick={() => updateQuestion(qi, 'answer', ci)} className={`answer-radio ${q.answer === ci ? 'active' : ''}`} title="Bonne réponse">{q.answer === ci && <Check size={14} />}</button>
                          <input value={c} onChange={(e) => updateChoice(qi, ci, e.target.value)} className="text-input" placeholder={`Choix ${String.fromCharCode(65 + ci)}`} style={{ flex: 1 }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#8b6f47', marginTop: '0.5rem' }}>Cliquez sur la pastille pour marquer la bonne réponse</div>
                  </div>
                ))}
                <button onClick={() => setQuestions([...questions, { q: '', choices: ['', '', '', ''], answer: 0 }])} className="secondary-btn" style={{ width: '100%', justifyContent: 'center' }}><Plus size={16} /> Ajouter une question</button>
              </div>
            </>
          ) : (
            <>
              <label className="field-label" style={{ marginTop: isLanguage ? '1rem' : 0 }}>Face avant (question)</label>
              <textarea value={front} onChange={(e) => setFront(e.target.value)} className="text-input" rows={3} placeholder="Ex: Conjugaison de « être » au présent" />
              <label className="field-label" style={{ marginTop: '1rem' }}>Face arrière (réponse)</label>
              <textarea value={back} onChange={(e) => setBack(e.target.value)} className="text-input" rows={4} placeholder="Ex: je suis, tu es, il est..." />
            </>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="secondary-btn">Annuler</button>
          <button onClick={isQuiz ? saveQuiz : saveFlashcard} className="primary-btn" style={{ background: subj.color }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

function AssignmentsView({ assignments, parentMode, onBack, onOpen, onUpdateAssignments }) {
  const [showCreator, setShowCreator] = useState(false);
  const sorted = [...assignments].sort((a, b) => { if (!a.dueDate) return 1; if (!b.dueDate) return -1; return new Date(a.dueDate) - new Date(b.dueDate); });
  const upcoming = sorted.filter(a => { const d = daysUntil(a.dueDate); return d === null || d >= 0; });
  const past = sorted.filter(a => { const d = daysUntil(a.dueDate); return d !== null && d < 0; });
  return (
    <div className="fade-in">
      <button onClick={onBack} className="back-btn"><ArrowLeft size={16} /> Retour</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '0.25rem' }}>Mes devoirs</h1>
          <div style={{ color: '#8b6f47' }}>{assignments.length} devoir{assignments.length > 1 ? 's' : ''} au total</div>
        </div>
        {parentMode && <button onClick={() => setShowCreator(true)} className="primary-btn"><Camera size={16} /> Nouveau devoir</button>}
      </div>
      {assignments.length === 0 ? (
        <div className="empty-state" style={{ padding: '3rem 1.5rem' }}>
          <Camera size={36} style={{ margin: '0 auto 1rem', display: 'block', color: '#8b6f47' }} />
          <div style={{ fontSize: '1.1rem', fontFamily: 'Fraunces, serif', fontWeight: 600, marginBottom: '0.5rem' }}>Aucun devoir pour le moment</div>
          <div style={{ fontSize: '0.95rem' }}>{parentMode ? 'Cliquez sur « Nouveau devoir » pour photographier une leçon et générer un quiz automatiquement.' : 'Demandez à votre parent d\'ajouter un devoir.'}</div>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && <section style={{ marginBottom: '2rem' }}><h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.85rem' }}>À venir</h2><div className="content-list">{upcoming.map(a => <AssignmentRow key={a.id} a={a} onOpen={onOpen} />)}</div></section>}
          {past.length > 0 && <section><h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.85rem', color: '#8b6f47' }}>Terminés / Passés</h2><div className="content-list" style={{ opacity: 0.7 }}>{past.map(a => <AssignmentRow key={a.id} a={a} onOpen={onOpen} />)}</div></section>}
        </>
      )}
      {showCreator && <AssignmentCreator onClose={() => setShowCreator(false)} onCreate={async (newA) => { await onUpdateAssignments([...assignments, newA]); setShowCreator(false); onOpen(newA); }} />}
    </div>
  );
}

function AssignmentRow({ a, onOpen }) {
  const subj = SUBJECTS[a.subject]; const Icon = subj?.icon || BookOpen; const days = daysUntil(a.dueDate);
  return (
    <button onClick={() => onOpen(a)} className="assignment-card" style={{ '--accent': subj?.color || '#3a2e26' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: subj?.accent || '#f4e4c1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: subj?.color || '#3a2e26', flexShrink: 0 }}><Icon size={20} /></div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div className="content-title">{a.title}{a.category && SUBJECTS[a.subject]?.isLanguage && <span className="cat-badge" style={{ background: subj.accent, color: subj.color }}>{LANGUAGE_CATEGORIES[a.category]?.emoji} {LANGUAGE_CATEGORIES[a.category]?.name}</span>}</div>
        <div className="content-meta">{subj?.name} · {a.quiz ? `${a.quiz.questions.length} questions` : 'Quiz à générer'}{a.dueDate && ` · ${formatDateShort(a.dueDate)}`}</div>
      </div>
      {a.dueDate && <div className={`due-badge ${days !== null && days <= 1 && days >= 0 ? 'urgent' : ''} ${days !== null && days < 0 ? 'past' : ''}`}><Clock size={13} />{days === 0 ? "Aujourd'hui" : days === 1 ? 'Demain' : days < 0 ? `Il y a ${Math.abs(days)} j` : `Dans ${days} j`}</div>}
    </button>
  );
}

function AssignmentCreator({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('francais');
  const [category, setCategory] = useState('tout');
  const [dueDate, setDueDate] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [imagesData, setImagesData] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const MAX_PHOTOS = 8;
  const [extraNotes, setExtraNotes] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const isLanguage = SUBJECTS[subject]?.isLanguage;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const remaining = MAX_PHOTOS - imagePreviews.length;
    if (remaining <= 0) { setError('Maximum ' + MAX_PHOTOS + ' photos par devoir.'); e.target.value = ''; return; }
    const toRead = files.slice(0, remaining).filter(f => f.type.startsWith('image/'));
    if (toRead.length === 0) { setError('Veuillez sélectionner des images.'); e.target.value = ''; return; }
    setError('');
    Promise.all(toRead.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (ev) => { const dataUrl = ev.target.result; resolve({ dataUrl, data: dataUrl.split(',')[1], mediaType: file.type }); };
      reader.readAsDataURL(file);
    }))).then(results => {
      setImagePreviews(prev => [...prev, ...results.map(r => r.dataUrl)]);
      setImagesData(prev => [...prev, ...results.map(r => ({ data: r.data, mediaType: r.mediaType }))]);
      if (files.length > remaining) setError('Seules les ' + remaining + ' premières photos ont été ajoutées (max ' + MAX_PHOTOS + ').');
    });
    e.target.value = '';
  };
  const removeImageAt = (idx) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    setImagesData(prev => prev.filter((_, i) => i !== idx));
  };

  const generateQuiz = async () => {
    setGenerating(true); setError(''); setStep(3);
    const subjectName = SUBJECTS[subject].name;
    let categoryInstruction = '';
    if (isLanguage && category !== 'tout') {
      const catName = LANGUAGE_CATEGORIES[category].name.toLowerCase();
      categoryInstruction = `IMPORTANT : concentre-toi UNIQUEMENT sur la ${catName}. Ne crée que des questions de ${catName}, pas d'autres types.`;
    } else if (isLanguage && category === 'tout') {
      categoryInstruction = `Mélange différents types de questions : vocabulaire, grammaire et conjugaison.`;
    }
    const prompt = `Tu es un professeur de collège qui crée un quiz de révision pour un élève (11-14 ans) en ${subjectName}.

Sujet du devoir : "${title}"
${extraNotes ? `Notes du parent : ${extraNotes}` : ''}
${categoryInstruction}

Analyse attentivement l'image fournie (qui montre la leçon, l'exercice ou le sujet à étudier) et crée exactement ${numQuestions} questions à choix multiples (QCM) qui aideront l'élève à maîtriser ce contenu.

Règles strictes :
- Chaque question doit avoir exactement 4 choix de réponse
- Une seule bonne réponse par question
- Les questions doivent être progressives (du plus simple au plus complexe)
- Les distracteurs (mauvaises réponses) doivent être plausibles mais clairement incorrects
- Adapte le vocabulaire au niveau collège
- Couvre les points clés de la leçon visible sur l'image

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après, sans backticks markdown. Format exact :
{
  "title": "Titre court du quiz",
  "questions": [
    { "q": "Énoncé", "choices": ["A", "B", "C", "D"], "answer": 0 }
  ]
}

Le champ "answer" est l'index (0, 1, 2 ou 3) de la bonne réponse.`;
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 2000,
          messages: [{ role: "user", content: [
            ...imagesData.map(img => ({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.data } })),
            { type: "text", text: prompt }
          ]}]
        })
      });
      if (!response.ok) throw new Error(`Erreur API : ${response.status}`);
      const data = await response.json();
      const text = data.content.map(i => i.text || "").join("\n").trim();
      const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(clean);
      if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) throw new Error('Format de réponse invalide');
      const validQuestions = parsed.questions.filter(q => q.q && Array.isArray(q.choices) && q.choices.length === 4 && typeof q.answer === 'number' && q.answer >= 0 && q.answer <= 3);
      if (validQuestions.length === 0) throw new Error('Aucune question valide générée');
      setGeneratedQuiz({ id: `quiz-${Date.now()}`, title: parsed.title || title, questions: validQuestions });
      setStep(4);
    } catch (err) {
      console.error(err);
      setError(`Impossible de générer le quiz : ${err.message}. Vérifiez que l'image est lisible et réessayez.`);
      setStep(2);
    } finally { setGenerating(false); }
  };

  const finalize = () => {
    onCreate({
      id: `assignment-${Date.now()}`,
      title, subject,
      category: isLanguage ? category : null,
      dueDate: dueDate || null,
      imagePreviews, notes: extraNotes,
      quiz: generatedQuiz,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="modal-overlay" onClick={step === 3 ? null : onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' }}>Nouveau devoir</h2>
            <div style={{ fontSize: '0.85rem', color: '#8b6f47', marginTop: '0.2rem' }}>Étape {step} sur 4</div>
          </div>
          {step !== 3 && <button onClick={onClose} className="icon-btn"><X size={20} /></button>}
        </div>
        <div className="modal-body">
          {step === 1 && (
            <div>
              <label className="field-label">Titre du devoir *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="text-input" placeholder="Ex: Contrôle de conjugaison, Chapitre 3..." autoFocus />
              <label className="field-label" style={{ marginTop: '1rem' }}>Matière *</label>
              <div className="subject-picker">
                {Object.entries(SUBJECTS).map(([key, subj]) => {
                  const Icon = subj.icon;
                  return <button key={key} onClick={() => { setSubject(key); if (!subj.isLanguage) setCategory('tout'); }} className={`subject-pick ${subject === key ? 'active' : ''}`} style={{ '--accent': subj.color, '--accent-bg': subj.accent }}><Icon size={16} /> {subj.name}</button>;
                })}
              </div>
              {isLanguage && (
                <>
                  <label className="field-label" style={{ marginTop: '1rem' }}>Type d'exercice *</label>
                  <div className="cat-selector">
                    {Object.entries(LANGUAGE_CATEGORIES).map(([key, cat]) => (
                      <button key={key} onClick={() => setCategory(key)} className={`cat-pick ${category === key ? 'active' : ''}`} style={{ '--accent': SUBJECTS[subject].color }}><span>{cat.emoji}</span> {cat.name}</button>
                    ))}
                  </div>
                </>
              )}
              <label className="field-label" style={{ marginTop: '1rem' }}>Date à rendre (optionnel)</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="text-input" min={new Date().toISOString().split('T')[0]} />
              <label className="field-label" style={{ marginTop: '1rem' }}>Nombre de questions du quiz</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[5, 10, 15, 20, 25].map(n => <button key={n} onClick={() => setNumQuestions(n)} className={`num-pick ${numQuestions === n ? 'active' : ''}`}>{n}</button>)}<input type="number" min="1" max="50" value={numQuestions} onChange={(e) => setNumQuestions(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))} className="text-input" style={{ width: '5rem', padding: '0.5rem', textAlign: 'center' }} />
              </div>
              <label className="field-label" style={{ marginTop: '1rem' }}>Notes pour l'IA (optionnel)</label>
              <textarea value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)} className="text-input" rows={2} placeholder="Ex: Insister sur les verbes irréguliers, niveau 5e..." />
            </div>
          )}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: '1rem', fontSize: '0.95rem', color: '#6b5544', lineHeight: 1.5 }}>Photographiez la leçon, le cours ou le sujet à étudier. L'IA va lire le contenu et générer automatiquement {numQuestions} questions adaptées{isLanguage && category !== 'tout' ? ` en ${LANGUAGE_CATEGORIES[category].name.toLowerCase()}` : ''}.</div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} style={{ display: 'none' }} />
              {imagePreviews.length === 0 ? (
                <button onClick={() => fileInputRef.current?.click()} className="photo-uploader">
                  <Camera size={36} />
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.15rem', fontWeight: 600, marginTop: '0.5rem' }}>Prendre des photos</div>
                  <div style={{ fontSize: '0.85rem', color: '#8b6f47', marginTop: '0.25rem' }}>ou choisir depuis la galerie (jusqu'à {MAX_PHOTOS})</div>
                </button>
              ) : (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {imagePreviews.map((src, i) => (
                      <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e8ddd0' }}>
                        <img src={src} alt={'Photo ' + (i+1)} style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />
                        <button onClick={() => removeImageAt(i)} aria-label="Supprimer cette photo" style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(58,46,38,0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}><X size={14} /></button>
                        <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(58,46,38,0.75)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>{i+1}</div>
                      </div>
                    ))}
                  </div>
                  {imagePreviews.length < MAX_PHOTOS && (
                    <button onClick={() => fileInputRef.current?.click()} className="secondary-btn"><Plus size={14} /> Ajouter une photo ({imagePreviews.length}/{MAX_PHOTOS})</button>
                  )}
                </div>
              )}
              {error && <div className="error-msg"><AlertCircle size={14} /> {error}</div>}
            </div>
          )}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div className="loading-spinner"><Wand2 size={36} /></div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 600, marginTop: '1.25rem', marginBottom: '0.5rem' }}>L'IA analyse la leçon...</h3>
              <div style={{ color: '#6b5544', fontSize: '0.95rem' }}>Génération de {numQuestions} questions adaptées au contenu. Cela prend environ 15-30 secondes.</div>
            </div>
          )}
          {step === 4 && generatedQuiz && (
            <div>
              <div className="success-banner"><Check size={18} /> Quiz généré ! Vérifiez le contenu avant de valider.</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 600, margin: '1rem 0 0.75rem' }}>{generatedQuiz.title}</div>
              {generatedQuiz.questions.map((q, qi) => (
                <div key={qi} className="question-preview">
                  <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{qi + 1}. {q.q}</div>
                  {q.choices.map((c, ci) => (
                    <div key={ci} className={`choice-preview ${ci === q.answer ? 'correct' : ''}`}>
                      <span className="choice-letter-mini">{String.fromCharCode(65 + ci)}</span>
                      <span style={{ flex: 1 }}>{c}</span>
                      {ci === q.answer && <Check size={14} />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          {step === 1 && (<><button onClick={onClose} className="secondary-btn">Annuler</button><button onClick={() => setStep(2)} disabled={!title.trim()} className="primary-btn" style={{ opacity: title.trim() ? 1 : 0.5 }}>Continuer <ChevronRight size={16} /></button></>)}
          {step === 2 && (<><button onClick={() => setStep(1)} className="secondary-btn">Retour</button><button onClick={generateQuiz} disabled={imagesData.length === 0 || generating} className="primary-btn" style={{ opacity: imagesData.length > 0 ? 1 : 0.5 }}><Wand2 size={16} /> Générer le quiz</button></>)}
          {step === 4 && (<><button onClick={() => { setStep(2); setGeneratedQuiz(null); }} className="secondary-btn"><RotateCcw size={14} /> Régénérer</button><button onClick={finalize} className="primary-btn"><Check size={16} /> Valider le devoir</button></>)}
        </div>
      </div>
    </div>
  );
}

function AssignmentView({ assignment, parentMode, onBack, onStartQuiz, onDelete, onUpdateAssignments, assignments }) {
  const subj = SUBJECTS[assignment.subject]; const Icon = subj?.icon || BookOpen; const days = daysUntil(assignment.dueDate);
  const [showImage, setShowImage] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const allPhotos = Array.isArray(assignment.imagePreviews) && assignment.imagePreviews.length > 0
    ? assignment.imagePreviews
    : (assignment.imagePreview ? [assignment.imagePreview] : []);
  return (
    <div className="fade-in">
      <button onClick={onBack} className="back-btn"><ArrowLeft size={16} /> Retour aux devoirs</button>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: subj?.accent || '#f4e4c1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: subj?.color || '#3a2e26', flexShrink: 0 }}><Icon size={28} /></div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{assignment.title}</h1>
          <div style={{ color: '#8b6f47', marginTop: '0.4rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.9rem' }}>
            <span>{subj?.name}</span>
            {assignment.category && subj?.isLanguage && <span className="cat-badge" style={{ background: subj.accent, color: subj.color }}>{LANGUAGE_CATEGORIES[assignment.category]?.emoji} {LANGUAGE_CATEGORIES[assignment.category]?.name}</span>}
            {assignment.dueDate && <span className={`due-badge ${days !== null && days <= 1 && days >= 0 ? 'urgent' : ''} ${days !== null && days < 0 ? 'past' : ''}`}><Calendar size={13} /> {formatDateShort(assignment.dueDate)}</span>}
          </div>
        </div>
      </div>
      {allPhotos.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          {allPhotos.length === 1 ? (
            <button onClick={() => { setLightboxIdx(0); setShowImage(true); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '100%' }}>
              <img src={allPhotos[0]} alt="Leçon" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '14px', border: '1px solid rgba(58, 46, 38, 0.08)' }} />
              <div style={{ fontSize: '0.85rem', color: '#8b6f47', marginTop: '0.5rem', textAlign: 'center' }}>Touche pour voir en grand</div>
            </button>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem' }}>
                {allPhotos.map((src, i) => (
                  <button key={i} onClick={() => { setLightboxIdx(i); setShowImage(true); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={src} alt={'Leçon ' + (i+1)} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block', border: '1px solid rgba(58, 46, 38, 0.08)' }} />
                    <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(58,46,38,0.75)', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px' }}>{i+1}/{allPhotos.length}</div>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#8b6f47', marginTop: '0.5rem', textAlign: 'center' }}>Touche une photo pour la voir en grand</div>
            </>
          )}
        </div>
      )}
      {assignment.notes && (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(58, 46, 38, 0.06)' }}>
          <div style={{ fontSize: '0.8rem', color: '#8b6f47', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>Notes</div>
          <div style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{assignment.notes}</div>
        </div>
      )}
      {assignment.quiz && (
        <div style={{ background: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(58, 46, 38, 0.06)' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.4rem' }}>{assignment.quiz.title}</h2>
          <div style={{ color: '#8b6f47', fontSize: '0.95rem', marginBottom: '1.25rem' }}>{assignment.quiz.questions.length} questions générées par IA pour t'entraîner</div>
          <button onClick={() => onStartQuiz(assignment.quiz)} className="primary-btn" style={{ background: subj?.color, width: '100%', justifyContent: 'center' }}><Brain size={18} /> Commencer le quiz</button>
        </div>
      )}
      {!parentMode && !assignment.done && (<div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}><button onClick={() => { const next = assignments.map(a => a.id === assignment.id ? { ...a, done: true, doneAt: new Date().toISOString() } : a); onUpdateAssignments(next); }} style={{ background: '#2d5a3d', color: '#faf6ef', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><Check size={16} /> J'ai fait ce devoir</button></div>)} {!parentMode && assignment.done && (<div style={{ marginTop: '2rem', padding: '0.75rem 1rem', background: '#dde5b6', color: '#2d5a3d', borderRadius: '10px', fontWeight: 600, textAlign: 'center' }}>Devoir marqué comme fait</div>)} {parentMode && (        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => { const next = assignments.map(a => a.id === assignment.id ? { ...a, done: !a.done, doneAt: !a.done ? new Date().toISOString() : null } : a); onUpdateAssignments(next); }} style={{ background: assignment.done ? '#dde5b6' : '#2d5a3d', color: assignment.done ? '#2d5a3d' : '#faf6ef', border: 'none', padding: '0.6rem 1rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><Check size={14} /> {assignment.done ? 'Marqué fait — Annuler' : 'Marquer comme fait'}</button><button onClick={() => { if (confirm('Supprimer ce devoir ?')) onDelete(); }} className="danger-btn"><Trash2 size={14} /> Supprimer ce devoir</button>
        </div>
      )}
      {showImage && allPhotos.length > 0 && (
        <div className="modal-overlay" onClick={() => setShowImage(false)} style={{ padding: '1rem', flexDirection: 'column' }}>
          <img src={allPhotos[lightboxIdx]} alt={'Leçon ' + (lightboxIdx+1)} style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '12px' }} onClick={(e) => e.stopPropagation()} />
          {allPhotos.length > 1 && (
            <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', background: 'rgba(58,46,38,0.85)', padding: '0.5rem 1rem', borderRadius: '999px' }}>
              <button onClick={() => setLightboxIdx((lightboxIdx - 1 + allPhotos.length) % allPhotos.length)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.25rem 0.5rem', fontSize: '1.25rem' }}>‹</button>
              <span style={{ color: '#fff', fontSize: '0.9rem' }}>{lightboxIdx + 1} / {allPhotos.length}</span>
              <button onClick={() => setLightboxIdx((lightboxIdx + 1) % allPhotos.length)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.25rem 0.5rem', fontSize: '1.25rem' }}>›</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FontImports() { return <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');`}</style>; }

function BackgroundDecor() {
  return (
    <>
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200, 85, 61, 0.08), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-150px', left: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45, 90, 61, 0.06), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
    </>
  );
}

function Styles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { margin: 0; }
      .max-w-6xl { max-width: 72rem; margin-left: auto; margin-right: auto; }
      .fade-in { animation: fadeIn 0.4s ease; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .parent-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.9rem; border-radius: 999px; background: rgba(58, 46, 38, 0.06); border: 1px solid rgba(58, 46, 38, 0.1); font-size: 0.85rem; font-weight: 600; cursor: pointer; color: #3a2e26; transition: all 0.2s; font-family: inherit; }
      .parent-badge:hover { background: rgba(58, 46, 38, 0.1); }
      .parent-badge.active { background: #c8553d; color: #faf6ef; border-color: #c8553d; }
      .stats-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; margin-top: 1rem; }
      .stat-card { display: flex; align-items: center; gap: 0.85rem; padding: 1.1rem 1.25rem; background: #fff; border-radius: 16px; border: 1px solid rgba(58, 46, 38, 0.06); cursor: pointer; transition: all 0.2s; text-align: left; font-family: inherit; }
      .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(58, 46, 38, 0.08); }
      .stat-icon-wrap { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .stat-value { font-family: 'Fraunces', serif; font-size: 1.6rem; font-weight: 600; line-height: 1; }
      .stat-label { font-size: 0.82rem; color: #8b6f47; margin-top: 0.2rem; }
      .subjects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
      .subject-card { position: relative; padding: 1.5rem; background: #fff; border-radius: 18px; border: 1px solid rgba(58, 46, 38, 0.06); cursor: pointer; transition: all 0.3s; text-align: left; font-family: inherit; overflow: hidden; }
      .subject-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 0.4s; }
      .subject-card:hover { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(58, 46, 38, 0.1); }
      .subject-card:hover::before { transform: scaleX(1); }
      .subject-icon { width: 48px; height: 48px; border-radius: 13px; background: var(--accent-bg); color: var(--accent); display: flex; align-items: center; justify-content: center; margin-bottom: 0.85rem; }
      .subject-name { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 0.25rem; }
      .subject-meta { font-size: 0.82rem; color: #8b6f47; display: flex; flex-direction: column; gap: 0.3rem; }
      .lang-tag { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.72rem; color: var(--accent); font-weight: 600; }
      .subject-arrow { position: absolute; top: 1.5rem; right: 1.5rem; color: var(--accent); opacity: 0.5; transition: all 0.3s; }
      .subject-card:hover .subject-arrow { opacity: 1; transform: translateX(4px); }
      .back-btn { display: inline-flex; align-items: center; gap: 0.4rem; background: none; border: none; cursor: pointer; font-size: 0.9rem; color: #8b6f47; font-weight: 600; margin-bottom: 1.5rem; padding: 0.4rem 0; font-family: inherit; transition: color 0.2s; }
      .back-btn:hover { color: #3a2e26; }
      .add-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.55rem 0.95rem; border-radius: 10px; border: none; color: #faf6ef; font-weight: 600; cursor: pointer; font-size: 0.85rem; font-family: inherit; transition: opacity 0.2s; }
      .add-btn:hover { opacity: 0.9; }
      .link-btn { display: inline-flex; align-items: center; gap: 0.2rem; background: none; border: none; cursor: pointer; color: #c8553d; font-weight: 600; font-size: 0.9rem; font-family: inherit; padding: 0.3rem 0; }
      .empty-state { padding: 1.75rem; text-align: center; color: #8b6f47; background: #fff; border-radius: 14px; border: 1px dashed rgba(58, 46, 38, 0.15); font-size: 0.95rem; }
      .content-list { display: flex; flex-direction: column; gap: 0.6rem; }
      .content-item { display: flex; align-items: center; background: #fff; border-radius: 14px; border: 1px solid rgba(58, 46, 38, 0.06); transition: all 0.2s; overflow: hidden; }
      .content-item:hover { border-color: rgba(58, 46, 38, 0.15); transform: translateX(2px); }
      .content-main { flex: 1; padding: 1rem 1.25rem; cursor: pointer; background: none; border: none; text-align: left; font-family: inherit; color: inherit; }
      .content-title { font-weight: 600; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
      .content-meta { font-size: 0.82rem; color: #8b6f47; margin-top: 0.15rem; }
      .content-actions { display: flex; gap: 0.25rem; padding-right: 0.75rem; }
      .icon-btn { width: 32px; height: 32px; border-radius: 8px; border: none; background: rgba(58, 46, 38, 0.06); cursor: pointer; display: flex; align-items: center; justify-content: center; color: #3a2e26; transition: all 0.2s; }
      .icon-btn:hover { background: rgba(58, 46, 38, 0.12); }
      .icon-btn.danger:hover { background: rgba(200, 85, 61, 0.15); color: #c8553d; }
      .flashcard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.85rem; }
      .flashcard-preview { position: relative; padding: 1.1rem 1.25rem; background: #fff; border-radius: 14px; border: 1px solid rgba(58, 46, 38, 0.06); }
      .flashcard-front-text { font-weight: 600; margin-bottom: 0.4rem; padding-right: 1.5rem; }
      .flashcard-back-text { font-size: 0.88rem; color: #6b5544; line-height: 1.4; }
      .flashcard-actions { position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.25rem; opacity: 0; transition: opacity 0.2s; }
      .flashcard-preview:hover .flashcard-actions { opacity: 1; }
      .quiz-card { background: #fff; border-radius: 22px; padding: 1.75rem; border: 1px solid rgba(58, 46, 38, 0.06); box-shadow: 0 8px 30px rgba(58, 46, 38, 0.04); }
      .quiz-choice { display: flex; align-items: center; gap: 0.85rem; padding: 1rem 1.1rem; border-radius: 12px; background: #faf6ef; border: 2px solid transparent; cursor: pointer; font-size: 1rem; font-family: inherit; text-align: left; transition: all 0.2s; color: #3a2e26; width: 100%; }
      .quiz-choice:hover:not(:disabled) { background: #f4e4c1; transform: translateX(3px); }
      .quiz-choice.selected { border-color: #c8553d; background: #fce8d8; }
      .quiz-choice.correct { background: #dde5b6; border-color: #2d5a3d; color: #2d5a3d; }
      .quiz-choice.incorrect { background: #fce8d8; border-color: #c8553d; color: #c8553d; }
      .quiz-choice.faded { opacity: 0.4; }
      .quiz-choice:disabled { cursor: default; }
      .choice-letter { width: 30px; height: 30px; border-radius: 8px; background: rgba(58, 46, 38, 0.08); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; }
      .quiz-choice.correct .choice-letter { background: #2d5a3d; color: #faf6ef; }
      .quiz-choice.incorrect .choice-letter { background: #c8553d; color: #faf6ef; }
      .primary-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.4rem; border-radius: 11px; border: none; background: #3a2e26; color: #faf6ef; font-weight: 600; cursor: pointer; font-size: 0.95rem; font-family: inherit; transition: all 0.2s; }
      .primary-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(58, 46, 38, 0.2); }
      .primary-btn:disabled { cursor: not-allowed; }
      .secondary-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.4rem; border-radius: 11px; background: #fff; color: #3a2e26; font-weight: 600; cursor: pointer; font-size: 0.95rem; font-family: inherit; border: 1px solid rgba(58, 46, 38, 0.15); transition: all 0.2s; }
      .secondary-btn:hover { background: rgba(58, 46, 38, 0.04); }
      .danger-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.1rem; border-radius: 10px; background: rgba(200, 85, 61, 0.08); color: #c8553d; font-weight: 600; cursor: pointer; font-size: 0.9rem; font-family: inherit; border: 1px solid rgba(200, 85, 61, 0.2); transition: all 0.2s; }
      .danger-btn:hover { background: rgba(200, 85, 61, 0.15); }
      .flashcard-big { width: 100%; height: 340px; perspective: 1500px; cursor: pointer; margin-top: 1rem; }
      .flashcard-inner { position: relative; width: 100%; height: 100%; transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
      .flashcard-big.flipped .flashcard-inner { transform: rotateY(180deg); }
      .flashcard-side { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem; border-radius: 22px; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      .flashcard-front { background: #fff; border: 1px solid rgba(58, 46, 38, 0.06); box-shadow: 0 10px 40px rgba(58, 46, 38, 0.06); }
      .flashcard-back { background: var(--accent); transform: rotateY(180deg); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
      .stat-block { background: #fff; border-radius: 18px; padding: 1.5rem; border: 1px solid rgba(58, 46, 38, 0.06); }
      .stat-block-label { font-size: 0.85rem; color: #8b6f47; margin-bottom: 0.5rem; font-weight: 600; }
      .stat-block-value { font-family: 'Fraunces', serif; font-size: 2.5rem; font-weight: 600; line-height: 1; letter-spacing: -0.02em; }
      .text-input { width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid rgba(58, 46, 38, 0.15); background: #faf6ef; font-size: 0.95rem; font-family: inherit; color: #3a2e26; outline: none; transition: all 0.2s; }
      .text-input:focus { border-color: #c8553d; background: #fff; }
      textarea.text-input { resize: vertical; min-height: 70px; }
      .field-label { display: block; font-size: 0.85rem; font-weight: 600; color: #6b5544; margin-bottom: 0.4rem; }
      .modal-overlay { position: fixed; inset: 0; background: rgba(58, 46, 38, 0.4); backdrop-filter: blur(8px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s ease; }
      .modal { background: #faf6ef; border-radius: 20px; max-width: 600px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .modal-header { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(58, 46, 38, 0.08); }
      .modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
      .modal-footer { padding: 1rem 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end; border-top: 1px solid rgba(58, 46, 38, 0.08); }
      .question-editor { background: #fff; border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem; border: 1px solid rgba(58, 46, 38, 0.06); }
      .answer-radio { width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(58, 46, 38, 0.2); background: #faf6ef; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; color: transparent; }
      .answer-radio.active { background: #2d5a3d; border-color: #2d5a3d; color: #faf6ef; }
      .assignment-card { display: flex; align-items: center; gap: 0.9rem; padding: 1rem 1.1rem; background: #fff; border-radius: 14px; border: 1px solid rgba(58, 46, 38, 0.06); cursor: pointer; transition: all 0.2s; font-family: inherit; width: 100%; text-align: left; position: relative; overflow: hidden; }
      .assignment-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--accent); }
      .assignment-card:hover { transform: translateX(3px); box-shadow: 0 6px 20px rgba(58, 46, 38, 0.06); }
      .due-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.35rem 0.7rem; border-radius: 999px; background: rgba(58, 46, 38, 0.06); font-size: 0.78rem; font-weight: 600; color: #6b5544; flex-shrink: 0; white-space: nowrap; }
      .due-badge.urgent { background: rgba(200, 85, 61, 0.15); color: #c8553d; }
      .due-badge.past { background: rgba(58, 46, 38, 0.04); color: #8b6f47; opacity: 0.7; }
      .category-selector { background: #fff; border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; border: 1px solid rgba(58, 46, 38, 0.06); }
      .category-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
      .category-tab { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.55rem 0.9rem; border-radius: 10px; background: #faf6ef; border: 2px solid transparent; cursor: pointer; font-size: 0.88rem; font-weight: 600; color: #3a2e26; font-family: inherit; transition: all 0.2s; }
      .category-tab:hover { background: rgba(58, 46, 38, 0.06); }
      .category-tab.active { background: var(--accent); color: #faf6ef; border-color: var(--accent); }
      .category-count { background: rgba(255, 255, 255, 0.25); padding: 0.1rem 0.45rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
      .category-tab:not(.active) .category-count { background: rgba(58, 46, 38, 0.08); }
      .cat-badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.18rem 0.55rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; }
      .cat-badge-mini { position: absolute; top: 0.6rem; right: 0.6rem; padding: 0.15rem 0.45rem; border-radius: 999px; font-size: 0.85rem; }
      .cat-selector { display: flex; gap: 0.5rem; flex-wrap: wrap; }
      .cat-pick { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.85rem; border-radius: 10px; background: #fff; border: 1.5px solid rgba(58, 46, 38, 0.12); cursor: pointer; font-size: 0.88rem; font-weight: 600; font-family: inherit; color: #3a2e26; transition: all 0.2s; }
      .cat-pick:hover { border-color: var(--accent); }
      .cat-pick.active { background: var(--accent); color: #faf6ef; border-color: var(--accent); }
      .subject-picker { display: flex; gap: 0.4rem; flex-wrap: wrap; }
      .subject-pick { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.5rem 0.8rem; border-radius: 9px; background: #fff; border: 1.5px solid rgba(58, 46, 38, 0.12); cursor: pointer; font-size: 0.85rem; font-weight: 600; font-family: inherit; color: #3a2e26; transition: all 0.2s; }
      .subject-pick:hover { border-color: var(--accent); }
      .subject-pick.active { background: var(--accent-bg); border-color: var(--accent); color: var(--accent); }
      .num-pick { padding: 0.55rem 1rem; border-radius: 10px; background: #fff; border: 1.5px solid rgba(58, 46, 38, 0.12); cursor: pointer; font-weight: 600; font-family: inherit; color: #3a2e26; min-width: 50px; transition: all 0.2s; }
      .num-pick:hover { border-color: #c8553d; }
      .num-pick.active { background: #c8553d; color: #faf6ef; border-color: #c8553d; }
      .photo-uploader { width: 100%; padding: 3rem 1rem; border-radius: 14px; background: #fff; border: 2px dashed rgba(58, 46, 38, 0.2); cursor: pointer; display: flex; flex-direction: column; align-items: center; color: #c8553d; font-family: inherit; transition: all 0.2s; }
      .photo-uploader:hover { background: #fce8d8; border-color: #c8553d; }
      .photo-preview { background: #fff; border-radius: 14px; padding: 0.75rem; border: 1px solid rgba(58, 46, 38, 0.08); text-align: center; }
      .photo-preview img { width: 100%; max-height: 280px; object-fit: contain; border-radius: 10px; }
      .error-msg { display: flex; align-items: center; gap: 0.4rem; margin-top: 1rem; padding: 0.75rem 1rem; background: rgba(200, 85, 61, 0.1); color: #c8553d; border-radius: 10px; font-size: 0.9rem; }
      .loading-spinner { display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #c8553d, #8b3a26); color: #faf6ef; animation: spin 2s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .success-banner { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: #dde5b6; color: #2d5a3d; border-radius: 10px; font-weight: 600; font-size: 0.9rem; }
      .question-preview { background: #fff; border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem; border: 1px solid rgba(58, 46, 38, 0.06); }
      .choice-preview { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.75rem; margin-top: 0.4rem; border-radius: 8px; background: #faf6ef; font-size: 0.92rem; }
      .choice-preview.correct { background: #dde5b6; color: #2d5a3d; font-weight: 600; }
      .choice-letter-mini { width: 22px; height: 22px; border-radius: 6px; background: rgba(58, 46, 38, 0.1); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; }
      .choice-preview.correct .choice-letter-mini { background: #2d5a3d; color: #faf6ef; }
      @media (max-width: 600px) { .quiz-card { padding: 1.25rem; } .modal { max-height: 95vh; } .subject-picker { flex-direction: column; } .subject-pick { width: 100%; } }
    `}</style>
  );
}
