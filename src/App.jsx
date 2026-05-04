import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Calculator, FlaskConical, Languages, Lock, Plus, Trash2, Edit3, ChevronRight, Award, TrendingUp, Brain, X, Check, RotateCcw, BarChart3, ArrowLeft, LogOut, Sparkles, Camera, Globe, Landmark, Cross, Calendar, Clock, AlertCircle, Wand2, Image as ImageIcon, Tag, CheckCircle2, Circle, RefreshCw, Cloud, CloudOff } from 'lucide-react';

const SUBJECTS = {
  francais: { name: 'Français', icon: BookOpen, color: '#c8553d', accent: '#f4e4c1', isLanguage: false },
  maths: { name: 'Mathématiques', icon: Calculator, color: '#2d5a3d', accent: '#dde5b6', isLanguage: false },
  sciences: { name: 'Sciences', icon: FlaskConical, color: '#4a6fa5', accent: '#d4e0f0', isLanguage: false },
  anglais: { name: 'Anglais', icon: Languages, color: '#8b5a3c', accent: '#e8d5c4', isLanguage: true },
  allemand: { name: 'Allemand', icon: Languages, color: '#5d4e37', accent: '#e0d8c3', isLanguage: true },
  histoire: { name: 'Histoire', icon: Landmark, color: '#7a4a3a', accent: '#ead5c8', isLanguage: false },
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
      { q: "Que signifie « Auf Wiedersehen » ?", choices: ['Bonjour', 'Merci',
