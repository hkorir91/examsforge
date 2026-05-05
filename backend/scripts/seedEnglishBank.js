/**
 * ExamsForge by SmartSchool Digital
 * scripts/seedEnglishBank.js
 *
 * Seeds the QuestionBank with 100 Grade 10 English questions.
 * Sourced from: KLB Topical Revision Booklet, QS Exam, Opener Term 2 2026.
 *
 * Usage:
 *   cd backend
 *   node scripts/seedEnglishBank.js
 *
 * Safe to run multiple times — checks for duplicates before inserting.
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/examsforge';

// ── Inline schema (self-contained — no external model needed) ─────────────────
const questionBankSchema = new mongoose.Schema(
  {
    grade:             { type: String, required: true, enum: ['Grade 10', 'Grade 11', 'Grade 12'] },
    subject:           { type: String, required: true },
    strand:            { type: String, required: true },
    subStrand:         { type: String, required: true },
    questionType:      { type: String, required: true, enum: ['short_answer', 'structured', 'long_answer', 'calculation', 'essay'] },
    difficulty:        { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
    marks:             { type: Number, required: true },
    questionText:      { type: String, required: true },
    answerGuide:       { type: String, required: true },
    tags:              [{ type: String }],
    learningObjective: { type: String },
  },
  { timestamps: true }
);

const QuestionBank = mongoose.models.QuestionBank || mongoose.model('QuestionBank', questionBankSchema);
// ─────────────────────────────────────────────────────────────────────────────

const englishQuestions = [

  // ══════════════════════════════════════════════════════════════════
  // GRAMMAR IN USE — NOUNS, PRONOUNS, DETERMINERS
  // ══════════════════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Nouns — Count and Non-count',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Classify the underlined nouns in the sentences below, stating the type of noun and giving a reason:\n(a) The committee met on Friday to discuss the new policy.\n(b) Nairobi is the capital of Kenya.\n(c) I need some advice about the situation.\n(d) The flock of birds flew over the valley.\n(e) Her happiness was evident to everyone in the room.',
    answerGuide: '(a) committee — collective noun (group of people acting as one unit). (b) Nairobi — proper noun (specific name of a place). (c) advice — non-count/mass noun (cannot be pluralised). (d) flock — collective noun (group of birds). (e) happiness — abstract noun (names a feeling/quality). Award 1 mark each for correct type + reason.',
    tags: ['nouns', 'classification', 'collective', 'abstract', 'proper'],
    learningObjective: 'Classify different types of nouns and explain their use in sentences',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Nouns — Common and Proper',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'Fill in the blanks with the most appropriate word from the options provided:\n(i) ______________ students who study consistently tend to perform well in examinations. (Each / The / A)\n(ii) The award was given to ______________ — the team that had worked hardest all year. (them / they / their)\n(iii) Is there ______________ milk left in the container on the kitchen shelf? (some / any / many)',
    answerGuide: '(i) The — 1 mark. (ii) them — 1 mark. (iii) any — 1 mark. Accept "some" for (iii) if learner justifies it as an affirmative context.',
    tags: ['determiners', 'articles', 'quantifiers', 'fill-gap'],
    learningObjective: 'Use articles, determiners and quantifiers correctly in sentences',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Pronouns — Personal, Reflexive, Emphatic, Reciprocal',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Identify and name the pronoun type in each of the following sentences:\n(a) The students helped each other during the revision.\n(b) I myself witnessed the accident at the roundabout.\n(c) Who left the door open?\n(d) The book that I borrowed is extremely interesting.\n(e) Those are the items we ordered online.',
    answerGuide: '(a) each other — reciprocal pronoun. (b) myself — emphatic pronoun (emphasises "I"). (c) Who — interrogative pronoun. (d) that — relative pronoun. (e) Those — demonstrative pronoun. Award 1 mark each for correct identification.',
    tags: ['pronouns', 'reciprocal', 'emphatic', 'interrogative', 'relative', 'demonstrative'],
    learningObjective: 'Identify and classify different types of pronouns in context',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Pronouns — Personal, Reflexive, Emphatic, Reciprocal',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Explain the difference between a reflexive pronoun and an emphatic pronoun. Write ONE original example sentence for each to illustrate the difference.',
    answerGuide: 'Reflexive pronoun: used when the subject and object are the same person — the pronoun refers back to the subject e.g. "She hurt herself when she fell." Emphatic pronoun: used to emphasise the subject — it can be removed without changing the meaning e.g. "I myself cooked the entire meal." Award 2 marks for each correct explanation + example.',
    tags: ['pronouns', 'reflexive', 'emphatic', 'distinction'],
    learningObjective: 'Distinguish between reflexive and emphatic pronouns with correct usage',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Determiners',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    questionText: 'Distinguish between a determiner and a pronoun. Using the word "this" as an example, write TWO sentences — one showing "this" as a determiner and one showing "this" as a pronoun. Explain the difference.',
    answerGuide: 'A determiner precedes a noun to modify it e.g. "This book is interesting" — "this" modifies "book". A pronoun replaces a noun e.g. "This is interesting" — "this" replaces a previously mentioned noun/idea. Award 1 mark for definition of determiner, 1 mark for definition of pronoun, 1 mark for correct example sentences.',
    tags: ['determiners', 'pronouns', 'distinction', 'word-class'],
    learningObjective: 'Distinguish between determiners and pronouns and use each correctly',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Pronouns — Personal, Reflexive, Emphatic, Reciprocal',
    questionType: 'short_answer', difficulty: 'easy', marks: 5,
    questionText: 'Fill in the blanks with the correct pronoun from the options in brackets:\n(i) It was _________ (him/he) and not _________ (she/her) who broke into the teacher\'s locker.\n(ii) Madam Janet gave my sister and _________ (I/me) a lift to school.\n(iii) Charles and __________ (I/me) have not been here.\n(iv) Evans handed the book to __________ (her/she).\n(v) Wachiuri likes studying more than _________ (he/him).',
    answerGuide: '(i) him / her. (ii) me. (iii) I. (iv) her. (v) him. Award 1 mark each. Note: (v) "him" because it means "more than he/him does" — object pronoun after implied verb.',
    tags: ['pronouns', 'personal', 'case', 'subject', 'object', 'fill-gap'],
    learningObjective: 'Use subject and object personal pronouns correctly in sentences',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Pronouns — Personal, Reflexive, Emphatic, Reciprocal',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    questionText: 'Underline the words "which" and "whose" ONLY where they are used as INTERROGATIVE pronouns:\n(i) Which have they chosen?\n(ii) That is the school which I attended years ago.\n(iii) The girl whose painting won a prize is my sister.\n(iv) Whose do you admire most?',
    answerGuide: '(i) "Which" — interrogative (correct, underline). (ii) "which" — relative pronoun (do NOT underline). (iii) "whose" — relative pronoun (do NOT underline). (iv) "Whose" — interrogative (correct, underline). Award 1 mark for correctly identifying (i) and (iv), 1 mark for NOT underlining (ii) and (iii).',
    tags: ['pronouns', 'interrogative', 'relative', 'which', 'whose'],
    learningObjective: 'Distinguish interrogative pronouns from relative pronouns',
  },

  // ── TENSE & VERB FORMS ──────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Verbs, Tense and Aspect',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Rewrite each sentence using the tense indicated in brackets. Do not alter the meaning.\n(i) The students are writing their examinations. (Simple Past)\n(ii) She has lived in Mombasa for ten years. (Simple Present)\n(iii) The farmers will harvest the maize next month. (Past Perfect)\n(iv) The teacher is explaining the concept very clearly. (Future Continuous)\n(v) By the time we arrived, the match had already begun. (Simple Future)',
    answerGuide: '(i) The students wrote their examinations. (ii) She lives in Mombasa. (iii) The farmers had harvested the maize. (iv) The teacher will be explaining the concept very clearly. (v) By the time we arrive, the match will have already begun. Award 1 mark each for correct tense with no other changes to meaning.',
    tags: ['tense', 'verbs', 'rewrite', 'aspect', 'past', 'present', 'future'],
    learningObjective: 'Transform sentences between different tenses correctly',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Verbs, Tense and Aspect',
    questionType: 'structured', difficulty: 'hard', marks: 6,
    questionText: 'Change the following sentences from direct to reported speech OR from reported to direct speech as instructed:\n(i) "We will finish the project before the deadline," said the manager. (Change to reported speech.)\n(ii) "Have you submitted your assignment?" the teacher asked Kamau. (Change to reported speech.)\n(iii) The doctor told the patient that he should rest for at least two weeks. (Change to direct speech.)\n(iv) Grace asked whether anyone had seen her notebook. (Change to direct speech.)\n(v) The Principal announced that the school would close on Friday owing to maintenance work. (Change to direct speech.)\n(vi) "Do not enter the laboratory without protective gear," the technician warned us. (Change to reported speech.)',
    answerGuide: '(i) The manager said that they would finish the project before the deadline. (ii) The teacher asked Kamau if/whether he had submitted his assignment. (iii) "You should rest for at least two weeks," the doctor told the patient. (iv) "Has anyone seen my notebook?" Grace asked. (v) "The school will close on Friday owing to maintenance work," the Principal announced. (vi) The technician warned us not to/that we should not enter the laboratory without protective gear. Award 1 mark each.',
    tags: ['reported-speech', 'direct-speech', 'verbs', 'backshift', 'tense'],
    learningObjective: 'Convert between direct and reported speech with correct tense backshift and pronoun changes',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Verbs, Tense and Aspect',
    questionType: 'short_answer', difficulty: 'easy', marks: 4,
    questionText: 'Choose the correct form of the verb in brackets to complete each sentence:\n(i) Each of the contestants ________ (was/were) given a number.\n(ii) Neither the principal nor the teachers ________ (has/have) arrived yet.\n(iii) The committee ________ (meets/meet) every first Monday of the month.\n(iv) News ________ (travel/travels) fast in the age of social media.',
    answerGuide: '(i) was — "each" is singular. (ii) have — with "neither...nor", verb agrees with the noun closest to it ("teachers"). (iii) meets — collective noun used as a single unit. (iv) travels — "news" is uncountable, takes singular verb. Award 1 mark each.',
    tags: ['subject-verb-agreement', 'verbs', 'collective-nouns', 'indefinite-pronouns'],
    learningObjective: 'Apply subject-verb agreement rules with collective nouns, indefinite pronouns and correlative conjunctions',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Verbs, Tense and Aspect',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Rewrite the following sentences by changing from active to passive voice or passive to active voice as indicated:\n(i) The engineer designed the new bridge. (Change to passive.)\n(ii) The report has been submitted by the secretary. (Change to active.)\n(iii) The government is building more schools in rural areas. (Change to passive.)\n(iv) The award was presented to the best student by the governor. (Change to active.)',
    answerGuide: '(i) The new bridge was designed by the engineer. (ii) The secretary has submitted the report. (iii) More schools are being built in rural areas by the government. (iv) The governor presented the award to the best student. Award 1 mark each.',
    tags: ['active-voice', 'passive-voice', 'verbs', 'transformation'],
    learningObjective: 'Transform sentences between active and passive voice correctly',
  },

  // ── ADJECTIVES & PREPOSITIONS ──────────────────────────────────

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Adjectives — Descriptive, Comparative, Superlative',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'Choose the correct word from the brackets and write it in the space provided:\n(i) Climate change will greatly ______________ the agricultural sector. (affect / effect)\n(ii) The scientist refused to ______________ the results that did not support her hypothesis. (accept / except)\n(iii) She gave me useful ______________ about preparing for the university interview. (advice / advise)',
    answerGuide: '(i) affect — verb meaning to have an impact on. (ii) accept — verb meaning to receive or agree to. (iii) advice — noun (the verb form is "advise"). Award 1 mark each.',
    tags: ['homophones', 'confused-words', 'affect-effect', 'accept-except', 'advice-advise'],
    learningObjective: 'Use commonly confused homophones and paronyms correctly in context',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Adjectives — Descriptive, Comparative, Superlative',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'Complete each sentence by filling in the blank with the correct word from the brackets:\n(i) Take a deep ________________ (breath/breathe)\n(ii) Try not to __________________ (loose/lose) your temper.\n(iii) People ought to keep ____________ (quiet/quite) when they have nothing useful to say.',
    answerGuide: '(i) breath — noun (the verb is "breathe"). (ii) lose — verb meaning to be deprived of. (iii) quiet — adjective meaning silent. Award 1 mark each.',
    tags: ['homophones', 'confused-words', 'breath-breathe', 'loose-lose', 'quiet-quite'],
    learningObjective: 'Distinguish between commonly confused words and use them correctly',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Adjectives and Prepositions',
    questionType: 'short_answer', difficulty: 'easy', marks: 5,
    questionText: 'Fill in the blank with the correct particle (up, out, off, down, into, on, away) to complete the phrasal verb. Use each particle only once:\n(i) The fire brigade managed to put ________ the fire before it spread further.\n(ii) She could not put ________ the meeting any longer; a decision had to be made.\n(iii) The police are looking ________ the cause of the accident on Thika Road.\n(iv) He broke ________ tears when he heard the sad news.\n(v) The company was set ________ in 1998 by two university graduates.',
    answerGuide: '(i) out — put out = extinguish. (ii) off — put off = postpone. (iii) into — looking into = investigating. (iv) down — broke down = became emotional. (v) up — set up = established. Award 1 mark each.',
    tags: ['phrasal-verbs', 'particles', 'prepositions', 'vocabulary'],
    learningObjective: 'Complete phrasal verbs with the correct particle in context',
  },

  // ── SPELLING, AFFIXES, ABBREVIATIONS ──────────────────────────

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Mechanics of Writing: Spelling and Commonly Confused Words',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'Identify the correctly spelled word from each group and use it to construct a sentence:\n(i) Necessary / necessary\n(ii) Occurrence / occurrence\n(iii) Proffesor / professor',
    answerGuide: '(i) "Necessary" (capital or lowercase — both the same word; looking for correct spelling) — one "c" and two "s"s: n-e-c-e-s-s-a-r-y. (ii) "Occurrence" — double "c" and double "r": o-c-c-u-r-r-e-n-c-e. (iii) "professor" — one "f" and two "s"s. Award 1 mark each for identifying correct spelling and constructing an appropriate sentence.',
    tags: ['spelling', 'commonly-misspelt', 'sentence-construction'],
    learningObjective: 'Identify correctly spelled words and use them in sentences',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Mechanics of Writing: Abbreviations and Acronyms',
    questionType: 'short_answer', difficulty: 'easy', marks: 4,
    questionText: 'Explain the difference between an abbreviation, an acronym, and an initialism. Give ONE example of each type.',
    answerGuide: 'Abbreviation: a shortened form of a word/phrase e.g. "Dr." for Doctor, "etc." for etcetera. Acronym: letters from initials that form a pronounceable word e.g. NASA, UNEP, AIDS. Initialism: letters from initials that are pronounced individually e.g. BBC, WHO, KRA. Award 1 mark for each correct definition and 1 mark for a valid example (total: 1 mark definition + 1 example × 3 = but award up to 4 total). Accept any valid examples.',
    tags: ['abbreviations', 'acronyms', 'initialisms', 'writing-mechanics'],
    learningObjective: 'Distinguish between abbreviations, acronyms and initialisms and use them correctly',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Mechanics of Writing: Abbreviations and Acronyms',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'Write the full meaning of each acronym below and use it in a sentence:\n(i) UNEP\n(ii) WHO\n(iii) NASA',
    answerGuide: '(i) UNEP — United Nations Environment Programme. (ii) WHO — World Health Organisation. (iii) NASA — National Aeronautics and Space Administration. Award 1 mark each for correct expansion. Sentence construction need not be marked separately unless the question specifies it.',
    tags: ['acronyms', 'full-forms', 'environmental', 'international-organisations'],
    learningObjective: 'Identify and expand common acronyms used in academic and professional contexts',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Mechanics of Writing: Spelling and Commonly Confused Words',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'Provide a word that has a different vowel sound but rhymes with the word given. An example has been provided.\nExample: Stock → stork\n(i) cot →\n(ii) Order →\n(iii) Pot →',
    answerGuide: '(i) cot → caught / court / core (the /ɒ/ sound vs /ɔ:/ sound). (ii) order → alder / older / shoulder (variations accepted). (iii) pot → port / pore / paw / pause. Award 1 mark each for any phonologically valid minimal pair with correct vowel sound change. Accept any reasonable answer.',
    tags: ['pronunciation', 'vowel-sounds', 'minimal-pairs', 'rhyme'],
    learningObjective: 'Identify and produce minimal pairs with contrasting vowel sounds',
  },

  // ── SENTENCE FLUENCY & PUNCTUATION ────────────────────────────

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Sentence Fluency: Comma Splices and Run-on Sentences',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Each sentence below contains a comma splice or run-on error. Rewrite each one correctly using the method indicated in brackets:\n(i) The sun was shining brightly, the birds were singing in the trees. [Use a coordinating conjunction]\n(ii) The cat sat on the mat it looked very comfortable and sleepy. [Use a period]\n(iii) She studied all night, she failed the test because she did not manage her time well. [Use a semicolon]\n(iv) We arrived late, the show had already started without us. [Use a conjunctive adverb]\n(v) The meeting was long and tedious the speaker droned on about irrelevant topics. [Use a subordinating conjunction]',
    answerGuide: '(i) The sun was shining brightly, and the birds were singing in the trees. (ii) The cat sat on the mat. It looked very comfortable and sleepy. (iii) She studied all night; she failed the test because she did not manage her time well. (iv) We arrived late; however, the show had already started without us. (v) Although the speaker droned on about irrelevant topics, the meeting was long and tedious. (Accept equivalent valid corrections.) Award 1 mark each.',
    tags: ['comma-splice', 'run-on', 'sentence-correction', 'conjunctions', 'punctuation'],
    learningObjective: 'Identify and correct comma splices and run-on sentences using appropriate methods',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Sentence Fluency: Comma Splices and Run-on Sentences',
    questionType: 'long_answer', difficulty: 'hard', marks: 8,
    questionText: 'Rewrite the following paragraph, correcting ALL sentence errors (comma splices and run-ons) and improving the overall fluency:\n"Climate change is a major global issue, it affects millions of people every year the temperatures are rising sea levels are going up extreme weather events are becoming more frequent scientists warn that we must act urgently, governments are slow to respond, ordinary citizens can make a difference."',
    answerGuide: 'Climate change is a major global issue that affects millions of people every year. Temperatures are rising, sea levels are going up, and extreme weather events are becoming more frequent. Scientists warn that we must act urgently; however, governments are slow to respond. Nevertheless, ordinary citizens can make a difference. Award marks as follows: 2 marks for identifying all comma splices, 2 marks for identifying run-on sentences, 2 marks for correct use of punctuation/conjunctions, 2 marks for overall fluency and coherence.',
    tags: ['comma-splice', 'run-on', 'paragraph-correction', 'fluency', 'climate-change'],
    learningObjective: 'Rewrite a paragraph to eliminate all sentence boundary errors and improve fluency',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Sentence Fluency: Comma Splices and Run-on Sentences',
    questionType: 'structured', difficulty: 'medium', marks: 2,
    questionText: 'Write correct sentences using each of the following conjunctive adverbs:\n(i) However\n(ii) Moreover',
    answerGuide: '(i) Any grammatically correct sentence using "however" as a conjunctive adverb with correct punctuation e.g. "The weather was terrible; however, the match continued." (ii) Any grammatically correct sentence using "moreover" e.g. "The school has excellent teachers; moreover, the facilities are modern." Award 1 mark each for correct usage and punctuation (semicolon or full stop before the conjunctive adverb).',
    tags: ['conjunctive-adverbs', 'however', 'moreover', 'sentence-construction'],
    learningObjective: 'Use conjunctive adverbs correctly with appropriate punctuation',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Mechanics of Writing: Punctuation and Capitalisation',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    questionText: 'Punctuate the following sentences correctly and rewrite them in full:\n(i) the headteacher announced that mr odhiambo had won the national teacher of the year award\n(ii) however the committee decided to postpone the event until january 2027\n(iii) the package contained the following items pens pencils rulers erasers and a geometry set',
    answerGuide: '(i) The headteacher announced that Mr Odhiambo had won the National Teacher of the Year Award. (ii) However, the committee decided to postpone the event until January 2027. (iii) The package contained the following items: pens, pencils, rulers, erasers and a geometry set. Award 1 mark each for complete correct punctuation including capitals, commas, and colon.',
    tags: ['punctuation', 'capitalisation', 'commas', 'colon', 'rewrite'],
    learningObjective: 'Apply correct punctuation and capitalisation rules in sentence rewriting',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Mechanics of Writing: Punctuation and Capitalisation',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    questionText: 'Join the following sentences correctly using appropriate coordinating conjunctions:\n(i) He was willing to help. The application form came in too late.\n(ii) Mbula rushed home. She found the party still going on.',
    answerGuide: '(i) He was willing to help, but the application form came in too late. (ii) Mbula rushed home, yet/but she found the party still going on. Award 1 mark each for correct conjunction and punctuation (comma before the conjunction).',
    tags: ['conjunctions', 'coordinating', 'FANBOYS', 'joining-sentences'],
    learningObjective: 'Join sentences using appropriate coordinating conjunctions with correct punctuation',
  },

  // ── PHRASES ────────────────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Determiners and Phrases',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'In the sentences below, identify and underline the complete noun phrase and briefly describe its constituents:\n(i) An exciting journey through the dense forest\n(ii) The tall mountains with snow-capped peaks\n(iii) Several carefully selected learners from our school\n(iv) A very challenging exam set by the board\n(v) My old leather satchel with brass buckles',
    answerGuide: '(i) "An exciting journey through the dense forest" — determiner (An) + adjective (exciting) + head noun (journey) + prepositional phrase (through the dense forest). (ii) "The tall mountains with snow-capped peaks" — determiner + adjective + head noun + post-modifier. (iii) Determiner (Several) + adverb + adjective + head noun + post-modifier. (iv) Determiner + adverb + adjective + head noun + post-modifier (past participial). (v) Possessive det + adjectives + head noun + post-modifier. Award 1 mark each for correctly identifying the full NP and its key constituents.',
    tags: ['noun-phrases', 'constituents', 'determiners', 'pre-modifiers', 'post-modifiers'],
    learningObjective: 'Identify noun phrases and analyse their constituents in sentences',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Phrases',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Identify and underline the verb phrase in each sentence below, then state the main verb and any auxiliaries:\n(i) She has been studying since early morning.\n(ii) They might have left before we arrived.\n(iii) The committee should make a final decision today.\n(iv) He was not listening carefully during the presentation.\n(v) We could have finished the project if we had planned better.',
    answerGuide: '(i) has been studying — aux: has been, main verb: studying (present perfect continuous). (ii) might have left — modal: might, aux: have, main verb: left. (iii) should make — modal: should, main verb: make. (iv) was not listening — aux: was, main verb: listening (past continuous). (v) could have finished — modal: could, aux: have, main verb: finished. Award 1 mark each for correctly identifying all elements of the VP.',
    tags: ['verb-phrases', 'auxiliaries', 'modal-verbs', 'tense', 'aspect'],
    learningObjective: 'Identify verb phrases and analyse the function of main verbs and auxiliaries',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Phrases: Prepositional Phrases',
    questionType: 'short_answer', difficulty: 'easy', marks: 2,
    questionText: 'Fill in the gaps with expressions that make the highlighted nouns countable:\n(i) There are ___________ books on the shelf that we can borrow for the project.\n(ii) We need _________________ information before we write the report.',
    answerGuide: '(i) any number/quantifier: "several / a few / many / three / some" — award 1 mark for any appropriate quantifier that makes the noun countable. (ii) any appropriate expression: "a piece of / some / a lot of / sufficient / further" — award 1 mark for any appropriate expression. Note: the question tests understanding that "books" is count and "information" is non-count.',
    tags: ['countable-nouns', 'uncountable-nouns', 'quantifiers', 'determiners'],
    learningObjective: 'Use appropriate quantifiers with countable and uncountable nouns',
  },

  // ── CLAUSES ────────────────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Relative Pronouns',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Identify whether each relative clause below is DEFINING (D) or NON-DEFINING (ND). Write D or ND and explain your choice:\n(i) The elder who shared the traditional stories is highly respected.\n(ii) My grandmother, who is a respected storyteller, taught me many traditions.\n(iii) The artifacts that represent our history are kept in the museum.\n(iv) The festival, which takes place annually, celebrates our heritage.\n(v) The book that she borrowed from the library was about climate change.',
    answerGuide: '(i) D — no commas; the clause identifies which elder. (ii) ND — set off by commas; adds extra information about grandmother (already identified). (iii) D — no commas; identifies which artifacts. (iv) ND — set off by commas; adds extra info about the festival. (v) D — no commas; identifies which book. Award 1 mark each for correct label + brief reason.',
    tags: ['relative-clauses', 'defining', 'non-defining', 'commas', 'relative-pronouns'],
    learningObjective: 'Distinguish between defining and non-defining relative clauses and use commas correctly',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Clauses: Relative and Adverbial',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Underline and identify the adverbial clause in each sentence below, stating the type of clause and the subordinating conjunction:\n(a) When the ceremony began, everyone fell silent.\n(b) She felt proud because her cultural dance was well received.\n(c) They will attend the festival if the weather permits.\n(d) Although it was raining heavily, the match continued.\n(e) She studied hard so that she could pass her examinations.',
    answerGuide: '(a) "When the ceremony began" — clause of time, conjunction: when. (b) "because her cultural dance was well received" — clause of reason, conjunction: because. (c) "if the weather permits" — clause of condition, conjunction: if. (d) "Although it was raining heavily" — clause of contrast, conjunction: although. (e) "so that she could pass her examinations" — clause of purpose, conjunction: so that. Award 1 mark each for correctly underlined clause + type + conjunction.',
    tags: ['adverbial-clauses', 'subordinating-conjunctions', 'clauses-of-time', 'reason', 'condition', 'contrast', 'purpose'],
    learningObjective: 'Identify and classify adverbial clauses by type and subordinating conjunction',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Clauses: Relative and Adverbial',
    questionType: 'structured', difficulty: 'hard', marks: 5,
    questionText: 'Combine each pair of sentences into ONE sentence using either a relative clause or an adverbial clause as instructed:\n(a) The man is very wise. He leads our community. [Use a relative clause]\n(b) The rain was heavy. The game was cancelled. [Use an adverbial clause of reason]\n(c) She practises every day. She wants to become a professional athlete. [Use an adverbial clause of purpose]\n(d) My history teacher is very dedicated. She marks our work every evening. [Use a non-defining relative clause]\n(e) They arrived at the stadium. The match had already started. [Use an adverbial clause of time]',
    answerGuide: '(a) The man who leads our community is very wise. (b) The game was cancelled because the rain was heavy. (c) She practises every day so that she can become a professional athlete. (d) My history teacher, who marks our work every evening, is very dedicated. (e) When they arrived at the stadium, the match had already started. / By the time they arrived at the stadium, the match had already started. Award 1 mark each. Accept reasonable alternatives.',
    tags: ['sentence-combination', 'relative-clauses', 'adverbial-clauses', 'complex-sentences'],
    learningObjective: 'Combine sentences using relative and adverbial clauses to create complex sentences',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Sentences — Types and Structures',
    questionType: 'long_answer', difficulty: 'hard', marks: 10,
    questionText: 'A student wrote the following paragraph. Identify and correct ALL grammatical errors (word class errors, comma splices, run-on sentences). Rewrite the corrected version:\n"The committee has decided to review there policies regarding environmental issues, this was long overdue every member agrees that the new regulations must be implement quickly however some of the member\'s are not happy with the new proposals they feel that it is to strict and may affect they\'s businesses."',
    answerGuide: 'Errors: "there" → "their" (possessive determiner); comma splice after "issues," → full stop or semicolon; run-on "overdue every member" → "overdue. Every member"; "must be implement" → "must be implemented"; "however" needs semicolon before it; "member\'s" → "members" (plural not possessive); run-on "proposals they" → "proposals. They"; "to strict" → "too strict"; "they\'s" → "their". Corrected: "The committee has decided to review their policies regarding environmental issues. This was long overdue. Every member agrees that the new regulations must be implemented quickly; however, some of the members are not happy with the new proposals. They feel that it is too strict and may affect their businesses." Award 1 mark per error correctly identified and fixed.',
    tags: ['error-correction', 'grammar', 'comma-splice', 'run-on', 'word-class', 'homophone'],
    learningObjective: 'Identify and correct a range of grammatical errors in a paragraph',
  },

  // ── SYNONYMS & ANTONYMS ────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Adjectives — Descriptive, Comparative, Superlative',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'Write a SYNONYM for each of the following words as used in English:\n(i) eloquent\n(ii) frugal\n(iii) turbulent',
    answerGuide: '(i) eloquent: articulate / fluent / expressive / persuasive. (ii) frugal: thrifty / economical / careful / sparing. (iii) turbulent: chaotic / stormy / unstable / disorderly. Award 1 mark each for any appropriate synonym.',
    tags: ['synonyms', 'vocabulary', 'word-meaning'],
    learningObjective: 'Identify synonyms for academic vocabulary used in context',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Adjectives — Descriptive, Comparative, Superlative',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'Write an ANTONYM for each of the following words:\n(i) transparent\n(ii) diligent\n(iii) lenient',
    answerGuide: '(i) transparent: opaque / dark / cloudy. (ii) diligent: lazy / negligent / careless / idle. (iii) lenient: strict / harsh / severe / rigid. Award 1 mark each for any appropriate antonym.',
    tags: ['antonyms', 'vocabulary', 'opposites'],
    learningObjective: 'Identify antonyms for academic vocabulary',
  },

  // ══════════════════════════════════════════════════════════════════
  // READING — COMPREHENSION
  // ══════════════════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Intensive Reading: Comprehension',
    questionType: 'structured', difficulty: 'medium', marks: 20,
    questionText: 'Read the following passage carefully and then answer the questions that follow.\n\nThe courtroom was packed. Every wooden bench was occupied, and a ring of standing spectators pressed against the walls as if held there by the weight of the moment. At the centre of it all sat Dr. Miriam Ochieng, her hands folded neatly on the table before her, her face bearing the composed expression of a woman who had long since made her peace with whatever was to come.\n\nDr. Ochieng had been a medical officer at Kericho District Hospital for eleven years. In that time, she had seen the full spectrum of human suffering: children born too soon, farmers mangled by machinery, women who had walked twenty kilometres for a consultation. She had always believed that medicine was not merely a profession but a calling — a covenant between the healer and the vulnerable.\n\nThree years ago, however, something changed. A consignment of anti-malarial drugs arrived bearing the correct labels, the correct serial numbers, but carrying a quiet, invisible defect: the dosage of the active compound was thirty percent below the registered level. In the weeks that followed, forty-seven patients who had been treated with those drugs deteriorated. Eleven of them died.\n\nDr. Ochieng had made the connection early. She had cross-referenced patient files, consulted colleagues, and sent a detailed report to the Ministry of Health and to the pharmaceutical company that supplied the drugs. The response from both offices was identical in substance: her findings were "under review." She waited six months. Nothing happened.\n\nColleagues warned her. The hospital administrator called her into his office on three separate occasions. A senior official from the Ministry visited and, over tea, spoke gently of careers that had flourished through patience and discretion. Dr. Ochieng listened carefully, and then she went to the press.\n\nThe story broke with the force of a thunderclap. Investigations were launched. The pharmaceutical company\'s local director resigned. A parliamentary committee convened. But none of that stopped the charges filed against Dr. Ochieng herself — charges of "causing public panic" and "sharing confidential medical information without authorisation."\n\nSeated in the courtroom, she was asked by the prosecutor whether she regretted her decision. "I regret," she said quietly, "that eleven people died before I spoke. I do not regret the speaking."\n\nThe gallery erupted. Outside, a young nurse leaned against the wall and wept — not from grief, but from recognition of something she had not known she was missing.\n\nQuestions:\n1. What was the atmosphere in the courtroom at the beginning of the passage? Use evidence from the text to support your answer. (3 marks)\n2. How does the writer convey the range of Dr. Ochieng\'s experience as a medical officer? Refer to the passage. (3 marks)\n3. Describe in your own words the problem that Dr. Ochieng discovered with the anti-malarial drugs. (3 marks)\n4. What pressures were placed on Dr. Ochieng to keep silent? Give THREE examples from the passage. (3 marks)\n5. What does the phrase "with the force of a thunderclap" tell you about the impact of the published story? (2 marks)\n6. Explain the irony in the charges brought against Dr. Ochieng after she went to the press. (2 marks)\n7. Comment on the significance of the young nurse\'s reaction at the end of the passage. (2 marks)\n8. Explain the meaning of: (a) a covenant (paragraph 2) (b) discretion (paragraph 5) (2 marks)',
    answerGuide: '1. The atmosphere was tense/charged — evidence: "packed", "every bench was occupied", "ring of standing spectators pressed against the walls as if held there by the weight of the moment" (3 marks: 1 for identifying atmosphere + 2 for evidence). 2. Through listing specific types of suffering: "children born too soon, farmers mangled by machinery, women who had walked twenty kilometres" — each example shows breadth across age/profession/gender (3 marks). 3. The drugs appeared normal but had insufficient active ingredient (30% below required level); patients treated with them did not recover as expected; eleven died (3 marks in own words). 4. Any 3: colleagues warned her; hospital administrator called her to office three times; senior Ministry official told her careers flourish through "patience and discretion" (3 marks). 5. The story had a sudden, dramatic and powerful impact — it caused immediate widespread reaction (investigations, resignation, parliamentary committee) (2 marks). 6. Irony: she exposed a cover-up that was causing deaths yet was charged with "causing public panic" — the very act of protecting public health led to her prosecution (2 marks). 7. The nurse wept from "recognition" — she had been suppressing similar feelings of conflict about staying silent; the reaction shows Dr. Ochieng gave voice to others\' unexpressed moral distress (2 marks). 8. (a) covenant: a solemn binding promise/agreement (1 mark). (b) discretion: the quality of keeping quiet/not sharing sensitive information (1 mark).',
    tags: ['comprehension', 'atmosphere', 'inference', 'irony', 'characterisation', 'vocabulary', 'healthcare', 'Kericho'],
    learningObjective: 'Answer comprehension questions testing literal retrieval, inference, figurative language and vocabulary in context',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Intensive Reading: Comprehension',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'Read the passage below about career choices (a passage about choosing a career is provided).\n\nChoosing a career is one of the most important decisions in a person\'s life. It is not something to be done sooner or later without careful thought. Students should take time to think about their interests, skills, and goals. A good career choice can bring peace of mind and a strong sense of purpose.\n\nWhen selecting a career, it is important to look at the pros and cons of different options. Some careers require hard work and dedication, while others demand creativity, communication, and teamwork. Making lists, asking questions, and doing research can help students understand different careers inside and out.\n\nCareer selection also involves planning for the future and being ready for ups and downs. Students must study day and night to reach their goals. Success does not come by chance, but through effort, patience, and determination.\n\nQuestions:\n(a) Why is choosing a career an important decision? (1 mark)\n(b) What should students think about when selecting a career? (1 mark)\n(c) What does the text mean by "pros and cons" of different careers? (1 mark)\n(d) The phrase "pros and cons" is a binomial expression. Write THREE other binomial expressions from the passage. (3 marks)\n(e) What does the text say about success and hard work? (1 mark)\n(f) Explain the meaning of: (i) dedication (ii) ups and downs (iii) confident (3 marks)',
    answerGuide: '(a) It is important because it affects peace of mind, sense of purpose, and future happiness/stability. (b) Their interests, skills, goals, strengths and weaknesses. (c) The advantages and disadvantages of different career options. (d) Any three: sooner or later / day and night / trial and error / inside and out / here and there (accept any correct binomial pairs). (e) Success does not come by chance but through effort, patience and determination — studying consistently is necessary. (f) (i) dedication — commitment and hard work; (ii) ups and downs — difficulties and successes/good and bad times; (iii) confident — sure/certain about oneself and the future. Award marks as specified.',
    tags: ['comprehension', 'careers', 'binomial-expressions', 'vocabulary', 'retrieval'],
    learningObjective: 'Answer comprehension questions testing retrieval, inference, vocabulary and language features',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Intensive Reading: Comprehension',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Read the passage below and answer the questions that follow.\n\nThe late afternoon sun cast long shadows across the rolling hills outside Kilgoris. A group of young boys were herding cattle back towards their manyattas. Among them was Lemayan, known for his keen observation. As they rounded a bend, he stopped abruptly, pointing towards a cluster of trees. Tangled in a wait-a-bit bush was a bird unlike anything they had ever seen — its feathers a brilliant electric blue, contrasting sharply with patches of yellow and black. Lemayan carefully freed the bird. "We should take it to Mama Nasha," he suggested. The village elder examined the bird gently. "This is not one of our birds. This one has travelled far." Days later, the bird soared free. Mama Nasha smiled. "Sometimes life brings us beautiful surprises, reminding us that the world is much bigger than we imagine. It is our duty to care for all living things."\n\n(i) Who is the intended audience of this passage? Give evidence from the text. (2 marks)\n(ii) What is the author\'s purpose in writing this passage? (2 marks)',
    answerGuide: '(i) Young readers/learners — evidence: the story features young boys as characters, uses simple accessible language, and teaches a moral lesson suitable for young people. (ii) To entertain and to teach/instil a moral lesson — that we should care for living things, appreciate the world\'s diversity, and respond with kindness to the unexpected. Award 1 mark for identification + 1 mark for evidence each.',
    tags: ['critical-reading', 'audience', 'purpose', 'Kilgoris', 'Maasai', 'moral'],
    learningObjective: 'Identify intended audience and authorial purpose in a narrative text',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Intensive Reading: Comprehension',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Refer to the Kilgoris passage (Lemayan and the bird). Answer the following:\n(iii) Describe the author\'s attitude towards the theme of caring for living things. What words or phrases reveal this attitude? (2 marks)\n(iv) Explain the message conveyed by Mama Nasha\'s final words. What life lesson do they communicate? (2 marks)',
    answerGuide: '(iii) The author\'s attitude is positive/respectful/affirming — revealed by words like "carefully freed the bird", "examined gently", the resolution of the bird soaring free, and Mama Nasha\'s warm smile. (iv) Mama Nasha teaches that the world is larger and more diverse than we know; we should respond to differences with care and openness rather than indifference. Award 1 mark for attitude identification + 1 mark for textual evidence each.',
    tags: ['critical-reading', 'attitude', 'tone', 'theme', 'moral-lesson', 'Kilgoris'],
    learningObjective: 'Analyse authorial attitude and extract life lessons from narrative texts',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Intensive Reading: Comprehension',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Read the passage about the Kilgoris market (the air in Kilgoris market buzzed...) and answer:\n(i) What is the main theme of the passage? Support your answer with evidence from the text. (2 marks)\n(ii) Identify TWO examples of expressive reading elements that Juma would have used in his storytelling, and explain how each element enriches his performance. (2 marks)',
    answerGuide: '(i) The main theme is the importance of cultural heritage and storytelling — evidence: Juma carries "tales passed down through generations"; Mama Zawadi\'s reaction "You remind us of who we are"; she challenges the tourists who disrupt. (ii) Any two from: pace (he would slow down for dramatic effect), pitch (varying voice for different characters), volume (softening for suspense, raising for climax), intonation (rising for questions, falling for conclusions), pausing for effect. Award 1 mark each for element + explanation.',
    tags: ['comprehension', 'cultural-heritage', 'storytelling', 'oral-literature', 'Kilgoris-market'],
    learningObjective: 'Identify themes and analyse expressive reading techniques in literary passages',
  },

  // ── SUMMARY WRITING ────────────────────────────────────────────

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Study Skills',
    questionType: 'long_answer', difficulty: 'hard', marks: 10,
    questionText: 'Read the following passage carefully. In not more than 80 words, summarise the challenges that face young people growing up in urban areas today. Use your own words as far as possible.\n\nModern cities offer young people a dazzling array of opportunities: universities, employment, cultural exposure and social connection. Yet beneath the bright surface, urban life confronts adolescents and young adults with a distinct set of pressures. Perhaps the most pervasive challenge is economic. In cities like Nairobi, Lagos and Accra, the cost of basic necessities has risen sharply while entry-level wages remain low. Young people find themselves trapped in a cycle of precarious employment. Alongside economic hardship, urban youth are exposed to elevated levels of violence and crime. Poorly planned neighbourhoods and weak community structures create environments in which gangs thrive. The explosion of social media has introduced psychological difficulty — young urban dwellers are bombarded with curated images of success, fuelling anxiety and diminished self-worth. Finally, rapid urbanisation has eroded traditional support structures. Extended family networks and cultural ceremonies that once anchored young people\'s sense of identity have weakened. Many young urban residents feel isolated, navigating complex modern life without adequate guidance.',
    answerGuide: 'Award marks as follows: Content (6 marks): 1 mark each for identifying: (1) economic hardship/low wages; (2) precarious/informal employment; (3) violence and crime/gang environment; (4) social media pressure/anxiety/mental health; (5) erosion of traditional support/family networks; (6) isolation/lack of guidance. Language (2 marks): own words, clear expression. Organisation (1 mark): coherent, logical summary. Mechanics (1 mark): correct punctuation, no errors. Penalise 2 marks if over 80 words (count carefully). Do NOT award marks for lifted sentences.',
    tags: ['summary-writing', 'urban-youth', 'challenges', 'Nairobi', 'own-words', '80-words'],
    learningObjective: 'Write a focused summary within a word limit using own words',
  },

  // ══════════════════════════════════════════════════════════════════
  // WRITING — FUNCTIONAL AND CREATIVE
  // ══════════════════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Formal Letters — Complaint, Request, Inquiry',
    questionType: 'essay', difficulty: 'hard', marks: 20,
    questionText: 'Write a formal letter of complaint to the Manager of a sports equipment store, complaining about a defective football you purchased last week. Your letter should:\n(i) Follow full formal letter format (your address, date, recipient\'s address, salutation, body, sign-off)\n(ii) Clearly describe the defect\n(iii) State the impact of the defect\n(iv) Request specific action (replacement or refund)\n(v) Use appropriate formal tone throughout\n\nYour composition will be marked on: Content (8 marks), Organisation/Format (6 marks), Language (4 marks), Mechanics (2 marks).',
    answerGuide: 'Content (8): complaint clearly stated (2), defect described specifically (2), impact explained (2), clear reasonable request (2). Format (6): correct sender address (1), date (1), recipient address (1), formal salutation (1), correct sign-off "Yours sincerely" — only if name used (1), paragraphed body (1). Language (4): formal register throughout (2), varied vocabulary (1), sentence variety (1). Mechanics (2): spelling (1), punctuation (1). Deduct up to 2 marks for informal language. Accept either British or American format consistently applied.',
    tags: ['formal-letter', 'complaint', 'letter-writing', 'format', 'functional-writing'],
    learningObjective: 'Write a correctly formatted formal letter of complaint using appropriate tone and structure',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Formal Letters — Complaint, Request, Inquiry',
    questionType: 'essay', difficulty: 'hard', marks: 20,
    questionText: 'You are a Grade 10 student at Thika High School. Write a formal letter to the County Director of Education, expressing concern about the lack of sports facilities in your school. Your letter should:\n(i) Follow full formal letter format\n(ii) Clearly state the problem and its extent\n(iii) Explain the impact on learners\n(iv) Make specific, reasonable requests\nWrite approximately 300–350 words.\n\nYour writing will be marked on: Content (8 marks), Organisation (6 marks), Language (4 marks), Mechanics (2 marks).',
    answerGuide: 'Content (8): problem stated clearly (2), extent/evidence described (2), impact on learners (2), specific requests (2). Organisation (6): full letter format with all components (3), logical paragraphing (2), appropriate length (1). Language (4): formal register (2), varied sentence structures (1), appropriate vocabulary (1). Mechanics (2): spelling (1), punctuation (1). Award up to 20 marks.',
    tags: ['formal-letter', 'request', 'school', 'sports', 'County-Director', 'Thika'],
    learningObjective: 'Write a formal letter of request to an authority using appropriate format and persuasive content',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Formal Letters — Complaint, Request, Inquiry',
    questionType: 'essay', difficulty: 'hard', marks: 20,
    questionText: 'Write a formal letter of inquiry to the Admissions Officer of a Sports Academy, requesting information about: membership requirements, training schedules, fees, and the application process. Use full formal letter format. Write approximately 250–300 words.\n\nYour writing will be marked on: Content (8), Format (6), Language (4), Mechanics (2).',
    answerGuide: 'Content (8): all four areas of inquiry addressed (2 each). Format (6): correct addresses, date, salutation, paragraphed body, correct sign-off (1 each). Language (4): formal, polite tone (2); appropriate vocabulary and sentence variety (2). Mechanics (2). Award up to 20 marks.',
    tags: ['formal-letter', 'inquiry', 'sports-academy', 'functional-writing'],
    learningObjective: 'Write a formal letter of inquiry requesting specific information using correct format',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Meetings — Notice, Agenda and Minutes',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Write a notice for a meeting of the Grade 10 Environmental Club to be held in Room 8 at 2:30 PM next Tuesday. The meeting will discuss plans to clean up the school compound and plant trees.',
    answerGuide: 'Award marks: Heading — "NOTICE OF MEETING" (1 mark). Name of organisation (1 mark). Date, time, venue clearly stated (1 mark). Purpose/agenda items mentioned (1 mark). Signature of secretary/chairperson and date of notice (1 mark). Deduct marks for missing components. Accept reasonable formats.',
    tags: ['notice', 'meeting-documents', 'functional-writing', 'environmental-club'],
    learningObjective: 'Write a correctly formatted meeting notice with all essential elements',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Meetings — Notice, Agenda and Minutes',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Prepare a meeting agenda for the Grade 10 Environmental Club meeting (in Room 8, Tuesday, 2:30 PM) that will discuss: clean-up activities and tree planting.',
    answerGuide: 'Award marks: Title — "AGENDA" (1 mark). Standard opening items: apologies, minutes of previous meeting (1 mark). Main agenda items clearly listed and numbered (1 mark). Any other business (A.O.B.) item (1 mark). Date of next meeting as last item (1 mark). Accept reasonable format.',
    tags: ['agenda', 'meeting-documents', 'functional-writing', 'environmental-club'],
    learningObjective: 'Draft a correctly structured meeting agenda with standard items in correct order',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Meetings — Notice, Agenda and Minutes',
    questionType: 'structured', difficulty: 'medium', marks: 10,
    questionText: 'Write the minutes of the Grade 10 Environmental Club meeting based on the following summary:\nThe meeting was chaired by the class teacher, Mrs Wangari. Present were 18 members. The secretary was James Njoroge. Members discussed three clean-up activities. Resolutions: (i) Each class takes responsibility for one section. (ii) Tree planting on the last Friday of the month. (iii) A fundraising drive to be launched. Next meeting: following Tuesday. Meeting ended at 3:45 PM.',
    answerGuide: 'Award marks: Heading — "MINUTES OF MEETING" with name of body (1). Date, time, venue, chairperson, attendance/apologies (2). Previous minutes confirmation (1). Main discussion points recorded in formal past tense/passive (2). Resolutions clearly numbered and recorded (2). Date of next meeting and time of closure (1). Signed by secretary (1). Total 10 marks. Deduct for informal language or wrong tense.',
    tags: ['minutes', 'meeting-documents', 'functional-writing', 'Mrs-Wangari', 'environmental-club'],
    learningObjective: 'Write formal meeting minutes from a summary, using appropriate format and language',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Memos',
    questionType: 'structured', difficulty: 'medium', marks: 8,
    questionText: 'You are the Secretary of Thika High School Environmental Club. Write a MEMO to all club members about a tree-planting day next Saturday at the school shamba. The memo should include: purpose, date, venue, reporting time, and what members should bring. Use correct memo format.',
    answerGuide: 'Memo format (3): TO, FROM, DATE, SUBJECT headings correctly labelled (0.5 each). Content (4): purpose stated (1), date and venue (1), reporting time (1), items to bring (1). Language (1): clear, concise, professional. Award up to 8 marks. Note: memos do not have a salutation or sign-off like letters — deduct 1 mark if letter format used.',
    tags: ['memo', 'functional-writing', 'format', 'environmental-club', 'Thika'],
    learningObjective: 'Write a correctly formatted memo with all required components and concise professional language',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Creative Writing: Narrative and Descriptive Essays',
    questionType: 'essay', difficulty: 'hard', marks: 20,
    questionText: 'Write a story beginning with:\n"My first day in Grade 10 felt like stepping into a brand-new world…"\n\nYour composition should be 300–400 words. It will be marked on:\nContent (8 marks) — ideas, development, relevance\nOrganisation (4 marks) — clear structure, paragraphing, beginning/middle/end\nLanguage (6 marks) — vocabulary, sentence variety, narrative techniques\nMechanics (2 marks) — spelling, punctuation, grammar',
    answerGuide: 'Content (8): creative, relevant narrative that develops the opening meaningfully (ideas, characters, events); mark on quality of content not length. Organisation (4): clear beginning introducing setting/character, developed middle with events, satisfying ending; paragraphed. Language (6): varied vocabulary beyond basic (2), narrative techniques — figurative language, dialogue, description (2), sentence variety — short for impact, long for flow (2). Mechanics (2): spelling (1), punctuation (1). Total 20 marks.',
    tags: ['narrative', 'creative-writing', 'composition', 'Grade-10', 'story-beginning'],
    learningObjective: 'Write a creative narrative composition with effective use of narrative techniques',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Creative Writing: Argumentative and Expository Essays',
    questionType: 'essay', difficulty: 'hard', marks: 20,
    questionText: 'Write a speech arguing FOR OR AGAINST the following motion:\n"Social media does more harm than good to young people in Kenya."\n\nYour speech should be 300–400 words and addressed to a school debate audience. It will be marked on:\nContent (8): clear argument, supporting points, evidence\nOrganisation (4): speech format (salutation, introduction, body, conclusion), logical flow\nLanguage (6): persuasive devices, vocabulary, rhetorical questions\nMechanics (2): spelling, punctuation, grammar',
    answerGuide: 'Content (8): clear position stated (2), at least 3 supported arguments (2 each up to 6). Organisation (4): correct speech salutation "Honourable chairperson, fellow debaters..." (1), introduction with motion stated (1), paragraphed arguments (1), strong conclusion (1). Language (6): persuasive techniques — rhetorical questions, repetition, statistics (2), varied vocabulary (2), sentence variety (2). Mechanics (2). Award up to 20 marks.',
    tags: ['argumentative', 'debate', 'speech', 'social-media', 'Kenya', 'persuasive'],
    learningObjective: 'Write a persuasive debate speech using appropriate format, structure and persuasive language',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Paragraphing Skills',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Write an effective topic sentence for each of the following paragraph topics. Your topic sentence should introduce the main idea clearly and invite the reader to continue:\n(i) The importance of reading books\n(ii) Challenges facing young people in Kenya today\n(iii) The role of technology in modern education',
    answerGuide: 'Award marks based on: clarity of main idea (1 mark each), appropriate scope — not too broad or narrow (0.5 each), engagement — the sentence should invite further reading (0.5 each). Examples: (i) "Books are not merely collections of words on a page; they are windows into other worlds that expand our understanding of ourselves and humanity." (ii) "Young Kenyans today face a complex web of challenges that previous generations could scarcely have imagined." (iii) "Technology has fundamentally transformed the learning experience, making education more accessible, interactive and personalised than ever before." Award 1–2 marks per topic sentence based on quality.',
    tags: ['paragraphing', 'topic-sentences', 'writing-skills', 'organisation'],
    learningObjective: 'Write effective topic sentences that clearly introduce a paragraph\'s main idea',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Paragraphing Skills',
    questionType: 'long_answer', difficulty: 'medium', marks: 12,
    questionText: 'Write a well-organised paragraph (10–12 sentences) on ONE of the following topics:\n(a) The importance of preserving cultural heritage in a rapidly changing world.\n(b) How technology has changed the way young people communicate.\n\nYour paragraph must include:\n(i) At least ONE noun phrase (underline it)\n(ii) At least ONE verb phrase (underline it)\n(iii) ONE relative clause (underline it)\n(iv) ONE adverbial clause (underline it)',
    answerGuide: 'Content (4): clear topic sentence, well-developed supporting sentences, concluding sentence — relevant to topic. Language use (4): varied vocabulary (2), varied sentence structures (2). Grammar features (4): noun phrase correctly identified (1), verb phrase correctly identified (1), relative clause correctly used and identified (1), adverbial clause correctly used and identified (1). Award up to 12 marks.',
    tags: ['paragraphing', 'grammar-in-writing', 'cultural-heritage', 'technology', 'sentence-structures'],
    learningObjective: 'Write a coherent paragraph demonstrating correct use of key grammatical structures',
  },

  // ══════════════════════════════════════════════════════════════════
  // LISTENING AND SPEAKING
  // ══════════════════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Speaking: Etiquette and Telephone Conversations',
    questionType: 'structured', difficulty: 'easy', marks: 5,
    questionText: 'Read the telephone conversation below and answer the questions that follow.\n\nReceptionist: Good morning, Kilgoris Grand Hotel, Jane speaking. How may I assist you today?\nCaller (Mr. Kamau): Good morning, my name is John Kamau, and I have a reservation for two nights starting this Friday.\nReceptionist: Thank you for calling, Mr. Kamau. Just a moment while I retrieve your booking information.\nCaller: I was wondering if it would be possible to request a room with a garden view?\nReceptionist: We do have rooms with a garden view available. I will do my best to assign you one. Is there anything else I can help you with?\n\n(i) Identify THREE examples of polite language used in the conversation. (3 marks)\n(ii) Explain the role of etiquette in a telephone conversation. (2 marks)',
    answerGuide: '(i) Any 3: "Good morning" (greeting), "How may I assist you today?" (polite offer), "Thank you for calling, Mr. Kamau" (acknowledgement by name), "Just a moment while I retrieve your booking" (polite hold), "I will do my best to assign you one" (polite commitment), "Is there anything else I can help you with?" (polite closure). Award 1 mark each. (ii) Etiquette ensures both parties feel respected and valued; it creates a professional image; it ensures clear and efficient communication; it makes interactions pleasant and productive. Award 1 mark per valid point up to 2.',
    tags: ['etiquette', 'telephone', 'polite-language', 'listening-and-speaking', 'Kilgoris'],
    learningObjective: 'Identify polite language in telephone conversations and explain the role of etiquette',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Speaking: Etiquette and Telephone Conversations',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Describe the expected etiquette behaviour in EACH of the following situations:\n(a) Checking in at a hotel (at least TWO behaviours)\n(b) Making a purchase at the market (at least TWO behaviours)\n(c) Answering a professional phone call (at least TWO behaviours)',
    answerGuide: '(a) Hotel: greet staff first; give name clearly; wait patiently; speak calmly and politely; have documents ready; thank staff. (b) Market: greet the seller; negotiate respectfully; not to handle goods unnecessarily; accept prices or negotiate politely; say thank you after purchase. (c) Phone call: answer promptly; state name/organisation; listen attentively; speak clearly; avoid interrupting; conclude professionally. Award 1 mark per valid behaviour, up to 2 per situation = 6 marks maximum, award 5.',
    tags: ['etiquette', 'hotel', 'market', 'telephone', 'social-contexts'],
    learningObjective: 'Demonstrate knowledge of appropriate etiquette in different social and professional contexts',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Conversational Skills: Meetings and Debates',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'Identify TWO expressions you would use for EACH of the following in a conversation:\n(i) To introduce a conversation\n(ii) To give a point during a conversation\n(iii) To introduce an example',
    answerGuide: '(i) Introducing: "By the way..."; "I was thinking about..."; "Have you heard about..."; "I wanted to mention..."; "Could I bring something up?" (ii) Giving a point: "I think that..."; "In my view..."; "My point is that..."; "As I see it..."; "What I mean is..." (iii) Introducing example: "For example,"; "For instance,"; "To illustrate,"; "A case in point is"; "Take, for example,...". Award 1 mark per section for any 2 correct expressions.',
    tags: ['conversational-skills', 'discourse-markers', 'expressions', 'politeness'],
    learningObjective: 'Use appropriate discourse markers to introduce topics, give points and provide examples in conversation',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Speaking Fluency: Pronunciation and Enunciation',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Explain how word stress can change the meaning of a word. Illustrate with FOUR examples of words that are stressed differently depending on whether they are used as nouns or verbs. (Use the pattern: NOUN = stress on 1st syllable, VERB = stress on 2nd syllable)',
    answerGuide: 'Explanation (1 mark): stress shifts forward (to 1st syllable) for nouns and back (to 2nd syllable) for verbs. Examples (3 marks, any 3 of the following, 1 mark each): REcord (noun) / reCORD (verb); PREsent (noun) / preSENT (verb); PERmit (noun) / perMIT (verb); OBject (noun) / obJECT (verb); INcrease (noun) / inCREASE (verb); PROduce (noun) / proDUCE (verb).',
    tags: ['word-stress', 'pronunciation', 'noun-verb-pairs', 'phonology'],
    learningObjective: 'Demonstrate how word stress distinguishes between noun and verb forms of the same word',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Speaking Fluency: Pronunciation and Enunciation',
    questionType: 'short_answer', difficulty: 'medium', marks: 4,
    questionText: '(a) Identify the odd one out in terms of the underlined sound in each group of words and explain why:\n(i) br̲ead, h̲ead, l̲ead (verb), r̲ead (past tense)\n(ii) c̲ough, th̲ough, r̲ough, eno̲ugh\n\n(b) Mark the stress on the following words by placing an apostrophe (ˈ) before the stressed syllable:\n(i) pho-tog-ra-phy\n(ii) e-co-nom-ic',
    answerGuide: '(a)(i) "lead (verb)" is the odd one out — it has the vowel sound /iːd/ while "bread", "head" and "read (past)" all have /ɛd/. (a)(ii) "though" is the odd one out — it has the /əʊ/ sound while "cough", "rough" and "enough" all have /ʌf/ sound. (b)(i) phoˈtography — stress on second syllable "tog". (b)(ii) ecoˈnomic — stress on third syllable "nom". Award 1 mark each.',
    tags: ['pronunciation', 'vowel-sounds', 'word-stress', 'odd-one-out', 'phonology'],
    learningObjective: 'Identify irregular vowel sounds and mark word stress in multi-syllabic words',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Conversational Skills: Meetings and Debates',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    questionText: 'For each situation below, write an appropriate response using the register indicated in brackets:\n(i) You have accidentally bumped into a stranger at a shopping centre. (Formal apology)\n(ii) You need to excuse yourself from a business meeting to take an urgent call. (Formal)\n(iii) A friend texts you asking if you can help them move furniture this weekend. (Informal refusal)',
    answerGuide: '(i) Any formal apology: "I sincerely apologise — I should have been more careful. Are you alright?" or similar. Key features: formal vocabulary, direct apology, concern for other. (ii) Any formal excuse: "Please excuse me for a moment — I need to take an urgent call. I\'ll return shortly." Key features: request permission, brief explanation, assurance of return. (iii) Any informal refusal: "Sorry mate, can\'t make it this weekend — got other plans. Maybe next time?" Key features: informal tone, honest reason, friendly close. Award 1 mark each for appropriate register and content.',
    tags: ['register', 'formal', 'informal', 'apology', 'refusal', 'situations'],
    learningObjective: 'Use appropriate register (formal and informal) in different social and professional situations',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Critical Listening: Facts and Opinions',
    questionType: 'structured', difficulty: 'medium', marks: 3,
    questionText: 'Explain the meaning of each of the following idiomatic expressions as they might be used in everyday speech. Then use each in a sentence of your own:\n(i) bite the bullet\n(ii) burn the midnight oil\n(iii) the ball is in your court',
    answerGuide: '(i) bite the bullet: to endure a painful or difficult situation with courage and without complaint e.g. "The student decided to bite the bullet and sit the repeat exam." (ii) burn the midnight oil: to work or study very late into the night e.g. "She burned the midnight oil to finish her assignment before the deadline." (iii) the ball is in your court: it is now your turn to take action or make a decision e.g. "I\'ve submitted my application; the ball is now in their court." Award 1 mark each for correct meaning + appropriate sentence.',
    tags: ['idioms', 'idiomatic-expressions', 'vocabulary', 'figurative-language'],
    learningObjective: 'Interpret common idiomatic expressions and use them correctly in context',
  },

  // ══════════════════════════════════════════════════════════════════
  // LITERATURE — POETRY
  // ══════════════════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Literature',
    subStrand: 'Poetry Analysis',
    questionType: 'structured', difficulty: 'medium', marks: 25,
    questionText: 'Read the following poem carefully and then answer ALL the questions that follow.\n\nTHE LAST FARMER\nBy A. Wanjiku Ndegwa\n\nHe does not check the weather on a screen;\nHe reads it in the language of the clouds,\nThe way a cow stands still before the rain,\nThe particular silence of November afternoons.\n\nHis hands are a record no archive holds:\nTwenty seasons pressed into the palms,\nCallus on callus, the layered autobiography\nOf a man who answered the earth\'s repeated question.\n\nThe sons are gone to the city. They send money.\nIt is not the same as staying.\nHe knows the difference.\n\nEach furrow he opens is a sentence\nIn a language only the soil remembers.\nHe is not afraid of being the last speaker.\n\nAt dusk he walks the boundary of his shamba,\nTouching the fence posts like a man counting his blessings,\nOr perhaps — his losses.\n\nHe plants still.\nNot because he believes the harvest will be great,\nBut because silence, like soil,\nMust be broken to be useful.\n\n1. What is the poem about? Write a brief prose statement of the poem\'s subject matter. (2 marks)\n2. What does the poet mean by "He reads it in the language of the clouds"? What does this tell us about the farmer? (3 marks)\n3. Explain the phrase "Twenty seasons pressed into the palms". What does it suggest about the farmer\'s life? (3 marks)\n4. Comment on the effect of the short stanza: "The sons are gone to the city. They send money. / It is not the same as staying." Why might the poet have chosen to write it this way? (4 marks)\n5. Identify and explain ONE figure of speech in the line "Each furrow he opens is a sentence." (3 marks)\n6. What is the mood of the poem? Use evidence from at least TWO stanzas to support your answer. (4 marks)\n7. Examine the use of contrast in the poem. Identify at least TWO contrasts and explain their significance. (4 marks)\n8. What is the theme of the poem? Discuss how the poet develops this theme through specific images and language choices. (2 marks)',
    answerGuide: '1. The poem is about an elderly farmer who continues to farm alone after his sons have left for the city. It explores themes of tradition, isolation, perseverance and the value of indigenous knowledge. (2 marks — 1 for subject, 1 for theme). 2. The phrase means the farmer understands natural signs — animal behaviour, cloud patterns, seasonal silences — without technology. It tells us he has deep traditional ecological knowledge passed down through generations. (3 marks: meaning 1, implication 2). 3. "Twenty seasons" = many years of farming; "pressed into the palms" = the physical evidence — calluses, scars — that farming has literally shaped his body. It suggests a life of hard, continuous labour and dedication to the land. (3 marks). 4. The short stanza creates a sense of isolation and emotional weight through brevity. The very short sentences mirror the bluntness of the situation. "They send money" is juxtaposed with "It is not the same as staying" — the poet suggests that money cannot replace presence, love or continuity. The brevity makes this the emotional heart of the poem. (4 marks). 5. Metaphor: "Each furrow he opens is a sentence" — the furrow (a physical groove in soil) is compared to a sentence (a unit of language). This suggests farming is a form of communication, of writing in the language of the earth. It also implies the farmer is one of the last "speakers" of this language. (3 marks: figure identified 1, explanation 2). 6. Mood is melancholic/quietly defiant — stanza 3: "The sons are gone to the city...It is not the same as staying" (loss and loneliness); stanza 5: "Touching the fence posts...counting his blessings, Or perhaps — his losses" (contemplation, sadness). Accept any two relevant stanzas. (4 marks: mood identified 1, two stanza references 3). 7. Contrasts: traditional knowledge vs modern technology ("does not check the weather on a screen" vs "reads it in the language of the clouds"); presence vs absence (farmer on shamba vs sons gone to city); continuity vs change (he plants still vs harvest may not come). Significance: the contrasts highlight what is being lost as Kenya modernises. (4 marks: 2 contrasts × 2 each). 8. Theme: the passing of traditional knowledge/ways of life; perseverance in the face of change and loss. Developed through: the metaphor of language ("language only the soil remembers", "last speaker"), images of the body (calloused hands), and the defiant final lines about breaking silence. (2 marks).',
    tags: ['poetry', 'The-Last-Farmer', 'Wanjiku-Ndegwa', 'metaphor', 'theme', 'mood', 'contrast', 'figure-of-speech', 'farming'],
    learningObjective: 'Analyse poetry through comprehension, figurative language, mood, theme and structural choices',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Literature',
    subStrand: 'Literary Devices and Techniques',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'From "The Last Farmer" poem:\n(a) Identify ONE example of personification and explain its effect. (2 marks)\n(b) Explain how the final stanza ("He plants still...") serves as a fitting conclusion to the poem. (2 marks)',
    answerGuide: '(a) "the earth\'s repeated question" — the earth is personified as asking a question that the farmer answers (through farming). Effect: it elevates farming to a dialogue, suggests the land is alive and communicates with those who tend it. Accept other valid examples from the poem with clear explanation. (b) The final stanza resolves the tension of the poem — after establishing isolation and loss, the farmer\'s continued planting becomes an act of defiance and hope. "Silence, like soil, must be broken to be useful" brings together the poem\'s two main metaphors (language/silence and soil/farming) in a statement that validates persistence even without guaranteed reward. Award 2 marks each for identification + developed explanation.',
    tags: ['poetry', 'personification', 'conclusion', 'figurative-language', 'The-Last-Farmer'],
    learningObjective: 'Identify and analyse literary devices in poetry and evaluate structural choices',
  },

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Literature',
    subStrand: 'Poetry Analysis',
    questionType: 'structured', difficulty: 'easy', marks: 2,
    questionText: 'From "The Last Farmer":\n(a) What is the poem about? Write a brief prose statement of the poem\'s subject matter in TWO sentences. (2 marks)',
    answerGuide: 'The poem is about an elderly farmer who continues to work his land alone after his sons have migrated to the city. It explores themes of perseverance, the erosion of traditional farming knowledge, and the quiet dignity of those who choose to remain connected to the land. Award 1 mark for identifying the subject (lonely farmer/migration) and 1 mark for identifying a theme.',
    tags: ['poetry', 'subject', 'theme', 'The-Last-Farmer'],
    learningObjective: 'Identify the subject matter and main theme of a poem',
  },

  // ══════════════════════════════════════════════════════════════════
  // GRAMMAR IN USE — ADDITIONAL BATCH 2
  // ══════════════════════════════════════════════════════════════════

  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Nouns — Count and Non-count',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'Write FIVE original sentences, each containing a different type of noun. Underline the noun and label its type: (i) common noun (ii) proper noun (iii) abstract noun (iv) collective noun (v) non-count noun.',
    answerGuide: 'Award 1 mark for each sentence with correct type, underlined and labelled. Accept Kenyan context. (i) common: "The teacher marked our books." (ii) proper: "Nairobi is a vibrant city." (iii) abstract: "Her courage inspired everyone." (iv) collective: "A flock of flamingos flew over Lake Nakuru." (v) non-count: "She gave me advice about my studies."',
    tags: ['nouns', 'types', 'sentence-writing'], learningObjective: 'Write sentences demonstrating knowledge of different noun types',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Adjectives — Descriptive, Comparative, Superlative',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Correct the adjective order in the following sentences. Rewrite each sentence correctly:\n(i) She wore a silk beautiful blue dress.\n(ii) He drives an old Italian red sports car.\n(iii) The young tired Kenyan athletes rested.\n(iv) They bought a wooden large square table.\n(v) She carried a leather expensive small handbag.',
    answerGuide: 'Adjective order: Opinion→Size→Age→Shape→Colour→Origin→Material. (i) beautiful blue silk dress. (ii) old red Italian sports car. (iii) tired young Kenyan athletes. (iv) large square wooden table. (v) expensive small leather handbag. Award 1 mark each.',
    tags: ['adjective-order', 'correction'], learningObjective: 'Place adjectives in the correct order within noun phrases',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Adjectives — Descriptive, Comparative, Superlative',
    questionType: 'short_answer', difficulty: 'easy', marks: 6,
    questionText: 'Write the comparative and superlative forms:\n(i) good (ii) far (iii) careful (iv) bad (v) little (vi) modern',
    answerGuide: '(i) better/best. (ii) farther/farthest or further/furthest. (iii) more careful/most careful. (iv) worse/worst. (v) less/least. (vi) more modern/most modern. Award 1 mark each for both forms correct.',
    tags: ['comparatives', 'superlatives', 'irregular', 'adjectives'], learningObjective: 'Form comparative and superlative forms of regular and irregular adjectives',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Word Classes: Prepositions — Place, Time, Direction',
    questionType: 'short_answer', difficulty: 'easy', marks: 5,
    questionText: 'Fill in the blanks with the correct preposition (at, in, on, by, for, since, during, between):\n(i) The match starts ________ 3:00 PM.\n(ii) She has been studying ________ 6 o\'clock.\n(iii) He sat ________ John and Mary.\n(iv) The students revised ________ the holidays.\n(v) We have not eaten ________ this morning.',
    answerGuide: '(i) at. (ii) since. (iii) between. (iv) during. (v) since. Award 1 mark each.',
    tags: ['prepositions', 'time', 'place', 'fill-gap'], learningObjective: 'Use prepositions of time and place correctly',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Relative Clauses',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Combine each pair using an appropriate relative pronoun (who, which, whose, where, when):\n(i) The woman is a doctor. She won the award.\n(ii) The book is very informative. I bought it last week.\n(iii) I visited the hospital. My mother works there.\n(iv) The student passed all exams. Her father is a teacher.\n(v) I remember the day. I first went to Nairobi on that day.',
    answerGuide: '(i) The woman who won the award is a doctor. (ii) The book that/which I bought last week is very informative. (iii) I visited the hospital where my mother works. (iv) The student whose father is a teacher passed all exams. (v) I remember the day when I first went to Nairobi. Award 1 mark each.',
    tags: ['relative-clauses', 'sentence-combination', 'who', 'which', 'whose', 'where', 'when'], learningObjective: 'Combine sentences using appropriate relative pronouns',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Sentences — Types and Structures',
    questionType: 'short_answer', difficulty: 'medium', marks: 4,
    questionText: 'Identify the sentence type (simple, compound, complex, compound-complex):\n(i) The rain fell heavily.\n(ii) The teacher explained and students listened attentively.\n(iii) Although she was tired, she continued to study.\n(iv) She had prepared well, and because she was confident, she passed.',
    answerGuide: '(i) Simple. (ii) Compound. (iii) Complex. (iv) Compound-complex. Award 1 mark each.',
    tags: ['sentence-types', 'simple', 'compound', 'complex', 'identification'], learningObjective: 'Identify sentence types based on clause structure',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Mechanics of Writing: Spelling and Commonly Confused Words',
    questionType: 'short_answer', difficulty: 'easy', marks: 6,
    questionText: 'Apply the correct spelling rule:\n(i) hope + -ing\n(ii) study + -ed\n(iii) plan + -er\n(iv) happy + -ness\n(v) mis- + spell\n(vi) climate + -ic',
    answerGuide: '(i) hoping. (ii) studied. (iii) planner. (iv) happiness. (v) misspell. (vi) climatic. Award 1 mark each.',
    tags: ['spelling', 'affixes', 'spelling-rules'], learningObjective: 'Apply spelling rules when adding affixes',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Clause Patterns',
    questionType: 'structured', difficulty: 'hard', marks: 5,
    questionText: 'Rewrite each sentence using the clause type in brackets:\n(i) She went to the market. She needed vegetables. [purpose]\n(ii) He failed. He had studied hard. [contrast]\n(iii) The crowd cheered. The runner crossed. [time]\n(iv) You water the plants. They grow. [condition]\n(v) She was appointed prefect. She is responsible. [reason]',
    answerGuide: '(i) She went to the market so that she could get vegetables. (ii) Although he had studied hard, he failed. (iii) When the runner crossed, the crowd cheered. (iv) If you water the plants, they will grow. (v) She was appointed prefect because she is responsible. Award 1 mark each.',
    tags: ['clause-patterns', 'adverbial-clauses', 'purpose', 'contrast', 'time', 'condition', 'reason'], learningObjective: 'Transform sentences to incorporate specified clause patterns',
  },

  // ── MORE READING ───────────────────────────────────────────────
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Reading Fluency: Scanning',
    questionType: 'short_answer', difficulty: 'easy', marks: 4,
    questionText: 'Explain the difference between skimming and scanning. Give ONE situation where you would use each strategy.',
    answerGuide: 'Skimming: reading quickly for general idea/gist — e.g. skimming a newspaper to see if relevant. Scanning: moving eyes rapidly to find specific information — e.g. scanning a timetable for a bus time. Award 1 mark for definition + 1 mark for example each.',
    tags: ['skimming', 'scanning', 'reading-strategies'], learningObjective: 'Distinguish between skimming and scanning and apply appropriately',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Extensive Reading: Reference Materials',
    questionType: 'short_answer', difficulty: 'easy', marks: 4,
    questionText: 'Explain the importance of reference materials in academic study. Name FOUR types and state how each helps a learner.',
    answerGuide: 'Any four: Dictionary (word meanings/pronunciation), Thesaurus (synonyms to improve vocabulary), Encyclopaedia (background research information), Atlas (geographical data/maps), Textbook index (locate specific topics quickly), Online databases (current/wide-ranging information). Award 1 mark each for type + valid explanation.',
    tags: ['reference-materials', 'dictionary', 'thesaurus', 'research'], learningObjective: 'Identify and use different reference materials in academic research',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Intensive Reading: Comprehension',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'Read the passage and answer questions.\n\nIn Kisumu County, the Lake Victoria fishing industry has long been the backbone of the local economy. Thousands of fishermen wake before dawn each day launching boats onto the vast lake in search of tilapia and Nile perch. However, the industry has faced significant challenges. Invasive species, overfishing, and water hyacinth have drastically reduced fish stocks. Many fishermen return with empty nets. In response, the County Government launched a programme promoting fish farming, training over two thousand farmers in aquaculture techniques.\n\n(a) State the main economic activity described. (1 mark)\n(b) Identify THREE challenges facing the fishing industry. (3 marks)\n(c) What solution has the County Government proposed? (1 mark)\n(d) Explain the meaning of "invasive species". (1 mark)',
    answerGuide: '(a) Fishing/Lake Victoria fishing industry. (b) Invasive species; overfishing; water hyacinth. (c) Fish farming/aquaculture — training farmers. (d) Foreign organisms that harm the existing ecosystem. Award as specified.',
    tags: ['comprehension', 'Lake-Victoria', 'Kisumu', 'fishing', 'aquaculture'], learningObjective: 'Answer comprehension questions testing retrieval and vocabulary',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Intensive Reading: Comprehension',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'Read the passage and answer questions.\n\nEvery year millions of young Kenyans sit national examinations that will determine their futures. Examination fever sets in weeks before — not merely anxiety but a full-spectrum shutdown of normal life. Friendships are paused. Sleep becomes a luxury. Yet research shows that sacrificing rest for more study hours is counterproductive. A brain deprived of sleep consolidates memories poorly and is prone to panic. The most effective examination strategy, paradoxically, may be to study less — but more efficiently.\n\n(a) What is the main idea of the passage? (2 marks)\n(b) What does "examination fever" mean? (2 marks)\n(c) Identify ONE language technique and explain its effect. (2 marks)',
    answerGuide: '(a) Sacrificing sleep to study more is counterproductive; efficient study with adequate rest is more effective. (b) Intense anxiety and total disruption to normal life caused by approaching exams — metaphor comparing stress to an illness. (c) Metaphor "examination fever"; Listing "friendships paused...sleep a luxury"; Paradox "study less — more efficiently." Award 2 marks each.',
    tags: ['comprehension', 'examinations', 'sleep', 'language-features', 'metaphor'], learningObjective: 'Identify main ideas and analyse language techniques in informational texts',
  },

  // ── MORE WRITING ───────────────────────────────────────────────
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Formal Letters — Complaint, Request, Inquiry',
    questionType: 'short_answer', difficulty: 'easy', marks: 3,
    questionText: 'State FIVE things that must be included in the body of a formal letter of complaint.',
    answerGuide: 'Any five: clear statement of what was purchased/when; specific description of the defect; evidence/reference number; impact/inconvenience caused; specific request (replacement/refund); deadline for response; threat of further action. Award 1 mark each.',
    tags: ['complaint-letter', 'body', 'content'], learningObjective: 'Identify essential content of a formal complaint letter',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Meetings — Notice, Agenda and Minutes',
    questionType: 'short_answer', difficulty: 'easy', marks: 5,
    questionText: 'Explain the purpose of meeting minutes and identify FIVE pieces of information that must be recorded.',
    answerGuide: 'Purpose: official written record of decisions, actions and attendance providing accountability and reference. Five items: (1) Name of organisation. (2) Date, time, venue. (3) Attendance and apologies. (4) Discussion summary per agenda item. (5) Decisions/resolutions. Also accept: chairperson, secretary, time of closure, next meeting date. Award 1 mark for purpose + 1 each for any 4 items.',
    tags: ['minutes', 'meeting-documents', 'purpose', 'content'], learningObjective: 'State purpose of minutes and identify essential information to record',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Creative Writing: Narrative and Descriptive Essays',
    questionType: 'essay', difficulty: 'hard', marks: 20,
    questionText: 'Write a descriptive composition about ONE of the following:\n(a) A busy Kenyan market on a Saturday morning\n(b) Sunrise over a Kenyan landscape\n\n300–350 words. Marked on: Content (8) — sensory details, atmosphere; Organisation (4); Language (6) — descriptive/figurative; Mechanics (2).',
    answerGuide: 'Content (8): sensory details — sight/sound/smell/touch (2), vivid atmosphere (2), specific Kenyan details (2), coherent overall picture (2). Organisation (4): opening setting scene (1), developed middle (2), ending (1). Language (6): figurative language (2), varied vocabulary (2), sentence variety (2). Mechanics (2).',
    tags: ['descriptive', 'market', 'Kenya', 'sensory', 'figurative'], learningObjective: 'Write a vivid descriptive composition using sensory details and figurative language',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Paragraphing Skills',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'Rewrite the paragraph improving coherence with appropriate connectors. Fix any errors.\n\n"The internet has changed education. Students access information. Teachers use technology. Some students have no smartphones. Schools in rural areas lack internet. The government should invest in ICT. Students in cities have advantages. Every learner deserves equal opportunities."',
    answerGuide: 'Rewritten paragraph should use connectors: "however", "furthermore", "in addition", "therefore", "on the other hand", "nonetheless". Logical flow: internet benefits → challenges → solution → conclusion. Award: connectors used appropriately (2), logical flow (2), grammatical correctness (1), clear topic sentence (1).',
    tags: ['paragraphing', 'connectors', 'coherence', 'rewriting'], learningObjective: 'Improve paragraph coherence through connectors and logical organisation',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Diary and Journal Entries',
    questionType: 'essay', difficulty: 'medium', marks: 15,
    questionText: 'Write a diary entry about a significant experience at school recently. Include date, greeting, detail, feelings and reflection. Write 200–250 words.\n\nMarked on: Content (6), Organisation (3), Language (4), Mechanics (2)',
    answerGuide: 'Content (6): clear event described (3), feelings and reflection (3). Organisation (3): format with date and "Dear Diary" (1), logical structure (1), closing thought (1). Language (4): first-person maintained (1), varied vocab (1), expressive (1), sentence variety (1). Mechanics (2).',
    tags: ['diary', 'personal-writing', 'first-person', 'reflection'], learningObjective: 'Write a correctly formatted personal diary entry',
  },

  // ── MORE LISTENING AND SPEAKING ────────────────────────────────
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Critical Listening',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Define "critical listening" and distinguish it from ordinary listening. Explain THREE key skills a critical listener must develop.',
    answerGuide: 'Critical listening: active, analytical listening evaluating the speaker\'s message — identifying purpose, bias and logic. Ordinary: passive reception. Three skills (1 each): identifying speaker\'s purpose; evaluating evidence; distinguishing fact from opinion. Also accept: recognising bias, noting context, non-verbal cues. Award 2 marks for definitions + 1 each for skills.',
    tags: ['critical-listening', 'skills', 'fact-opinion', 'purpose'], learningObjective: 'Define critical listening and identify skills for analytical listening',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Interactive Listening',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Explain FOUR turn-taking strategies used in workplace meetings and discussions.',
    answerGuide: 'Any four: (1) Listen without interrupting. (2) Use verbal signals "Could I add...?" (3) Non-verbal signals — lean forward. (4) Acknowledge previous speaker "Building on what X said..." (5) Keep contributions concise. (6) Paraphrase to confirm before adding. Award 1 mark each.',
    tags: ['turn-taking', 'meetings', 'interactive-listening'], learningObjective: 'Apply turn-taking strategies in formal discussions',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Selective Listening: Filtering and Extracting Information',
    questionType: 'structured', difficulty: 'easy', marks: 4,
    questionText: 'Explain the difference between "extensive listening" and "intensive listening". Give a specific example of each.',
    answerGuide: 'Extensive: listening to wide material for general understanding and enjoyment — e.g. listening to a radio programme about current events. Intensive: focused detailed listening for specific information — e.g. listening to a speech and recording all key points about climate change. Award 2 marks each for correct definition + valid example.',
    tags: ['extensive-listening', 'intensive-listening', 'distinction'], learningObjective: 'Distinguish between extensive and intensive listening with examples',
  },

  // ── MORE LITERATURE ────────────────────────────────────────────
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Literature',
    subStrand: 'Literary Devices and Techniques',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'Identify and explain the literary device in each extract. State its effect:\n(i) "The morning sun crept over the hills like a shy animal peering round a corner."\n(ii) "The city never sleeps — it pulses and breathes and groans."\n(iii) "His words were a knife — sharp, precise, and cutting."',
    answerGuide: '(i) Simile — "like a shy animal." Effect: creates gentle, tentative image of dawn; makes sunrise seem alive. (ii) Personification — city given human qualities. Effect: makes city seem alive and overwhelming. (iii) Metaphor — words compared to knife directly. Effect: vivid image of precision and pain; implies both intelligence and cruelty. Award 2 marks each: device (1) + effect (1).',
    tags: ['simile', 'personification', 'metaphor', 'effect', 'literary-devices'], learningObjective: 'Identify literary devices and explain their effect on the reader',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Literature',
    subStrand: 'Oral Literature',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'Explain the importance of oral literature in Kenyan cultural life. Discuss THREE types and explain the cultural function of each.',
    answerGuide: 'Importance: preserves cultural values, history and identity; entertainment and education; transmits moral lessons. Three types (2 marks each): (1) Folktales/proverbs — teach moral lessons and cultural values. (2) Songs — used in ceremonies (weddings, funerals) to mark life events. (3) Riddles — sharpen critical thinking, introduce children to cultural knowledge. Award 2 marks per type: definition (1) + function (1).',
    tags: ['oral-literature', 'folktales', 'songs', 'riddles', 'cultural-heritage', 'Kenya'], learningObjective: 'Explain the cultural significance of oral literature types',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Literature',
    subStrand: 'Literary Devices and Techniques',
    questionType: 'short_answer', difficulty: 'easy', marks: 4,
    questionText: 'Define each literary device and give ONE example:\n(a) Alliteration\n(b) Onomatopoeia\n(c) Irony\n(d) Symbol',
    answerGuide: '(a) Alliteration: repetition of consonant sounds e.g. "She sells seashells." (b) Onomatopoeia: word sounds like what it describes e.g. "The bees buzzed." (c) Irony: actual meaning opposite to expected e.g. "The fire station burned down." (d) Symbol: object representing something beyond literal meaning e.g. dove = peace. Award 1 mark each.',
    tags: ['alliteration', 'onomatopoeia', 'irony', 'symbolism', 'definitions'], learningObjective: 'Define common literary devices with examples',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Literature',
    subStrand: 'Poetry Analysis',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Explain the difference between the "mood" of a poem and the "tone" of a poem. How are they different? Give a brief example of each from "The Last Farmer".',
    answerGuide: 'Mood: emotional atmosphere created in the reader — how the poem makes reader feel. "The Last Farmer" creates quiet melancholy and dignified sadness. Tone: poet\'s attitude towards subject — how poet expresses feeling. In "The Last Farmer" tone is respectful, admiring and gently mournful. Difference: mood = effect on reader; tone = speaker\'s/poet\'s attitude. Award 2 marks each for correct definition with textual example.',
    tags: ['mood', 'tone', 'poetry', 'distinction', 'The-Last-Farmer'], learningObjective: 'Distinguish between mood and tone in poetry',
  },


  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Phrases',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Identify and underline the adjective phrase in each sentence. Explain what noun it modifies:\n(i) The student, tired after the long examination, slept immediately.\n(ii) She wore a dress suitable for the formal occasion.\n(iii) The teacher, very pleased with the results, congratulated the class.\n(iv) A journey dangerous but necessary awaited him.',
    answerGuide: '(i) "tired after the long examination" — modifies "student". (ii) "suitable for the formal occasion" — modifies "dress". (iii) "very pleased with the results" — modifies "teacher". (iv) "dangerous but necessary" — modifies "journey". Award 1 mark each for correctly identifying the adjective phrase and the noun it modifies.',
    tags: ['adjective-phrases', 'phrases', 'post-modification'], learningObjective: 'Identify adjective phrases and the nouns they modify',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Phrases',
    questionType: 'short_answer', difficulty: 'easy', marks: 5,
    questionText: 'Expand each simple sentence by adding an appropriate prepositional phrase in the space indicated:\n(i) The students gathered ________ for the assembly. [place]\n(ii) She submitted her assignment ________ . [time]\n(iii) The athlete trained ________ every morning. [place]\n(iv) He spoke ________ during the debate. [manner/place]\n(v) The letter was delivered ________ . [time]',
    answerGuide: 'Accept any grammatically correct, contextually appropriate prepositional phrase for each. Examples: (i) in the school hall / on the field. (ii) before the deadline / on time. (iii) at the stadium / near the school. (iv) in front of the panel / with great confidence. (v) in the morning / by Friday. Award 1 mark each for any correct prepositional phrase.',
    tags: ['prepositional-phrases', 'phrases', 'expansion'], learningObjective: 'Expand sentences by adding appropriate prepositional phrases',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Clause Patterns',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Describe the qualities of effective minutes of a meeting. What language style should be used when writing minutes?\n(Also) Explain FIVE clause patterns (SV, SVO, SVA, SVC, SVOO) with an original example sentence for each.',
    answerGuide: 'Clause patterns: SV (subject+verb): "The children slept." SVO (subject+verb+object): "The teacher marked the scripts." SVA (subject+verb+adverbial): "The meeting took place in Room 8." SVC (subject+verb+complement): "She became a doctor." SVOO (subject+verb+indirect object+direct object): "The principal gave students medals." Award 1 mark each. Minutes language: formal, past tense, passive voice, third person, concise, no personal opinions.',
    tags: ['clause-patterns', 'SV', 'SVO', 'SVA', 'SVC', 'SVOO'], learningObjective: 'Identify and use the five basic clause patterns in English',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Relative Clauses',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Rewrite each sentence adding a DEFINING relative clause to give more information about the underlined noun:\n(i) The woman is my aunt. [she won a national award]\n(ii) The car broke down on the highway. [my father bought it]\n(iii) The school produces top students. [I attended it]\n(iv) The day was unforgettable. [we graduated on that day]',
    answerGuide: '(i) The woman who won a national award is my aunt. (ii) The car that/which my father bought broke down on the highway. (iii) The school that/which I attended produces top students. (iv) The day when we graduated was unforgettable. Award 1 mark each for correct relative pronoun and grammatical sentence.',
    tags: ['defining-relative-clauses', 'relative-pronouns', 'sentence-expansion'], learningObjective: 'Add defining relative clauses to expand noun phrases',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Grammar in Use',
    subStrand: 'Mechanics of Writing: Abbreviations and Acronyms',
    questionType: 'short_answer', difficulty: 'easy', marks: 4,
    questionText: 'Write the full form of each abbreviation or acronym below. Then write ONE sentence using it correctly:\n(i) KCSE\n(ii) KNEC\n(iii) ICT\n(iv) MOU',
    answerGuide: '(i) Kenya Certificate of Secondary Education. (ii) Kenya National Examinations Council. (iii) Information and Communications Technology. (iv) Memorandum of Understanding. Award 0.5 marks for full form + 0.5 marks for appropriate sentence, per item (total 4).',
    tags: ['acronyms', 'Kenyan-context', 'KCSE', 'KNEC', 'ICT'], learningObjective: 'Expand Kenyan education-related acronyms and use them in sentences',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Reading Fluency: Previewing',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Explain the SQ4R study technique. Describe each step and explain how it helps understanding when studying a Geography chapter on Climate Change.',
    answerGuide: 'S — Survey: skim headings, images, summary to get overview (e.g. note "Effects on Agriculture" heading). Q — Question: turn headings into questions (e.g. "How does climate change affect Kenyan farms?"). R — Read: read carefully to answer questions, take notes. R — Reflect: connect new information to what you already know about Kenya\'s climate. R — Recite: explain key points in own words without looking. R — Review: revisit notes after 24 hours to consolidate. Award 1 mark per step with valid Climate Change application (up to 5).',
    tags: ['SQ4R', 'study-skills', 'reading-strategy', 'climate-change'], learningObjective: 'Apply the SQ4R reading strategy to a subject-specific text',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Critical/Close Reading',
    questionType: 'structured', difficulty: 'hard', marks: 5,
    questionText: 'Read the extract and answer the questions.\n\n"Every phone in the room was face-down. Not because anyone had been asked — but because the conversation had finally become more interesting than the screen. The school counsellor had been speaking for forty minutes about the gap between the Kenya most young people see on social media and the Kenya that actually exists. One learner raised her hand. \'But sir,\' she said, \'whose version is real?\'"\n\n(a) What technique does the writer use in "every phone was face-down"? Explain its significance. (2 marks)\n(b) What does the learner\'s question reveal about her? (2 marks)\n(c) Identify the theme of this extract and support with one piece of evidence. (1 mark)',
    answerGuide: '(a) Irony/contrast — phones face-down voluntarily signals genuine engagement; the writer uses the phone detail to show that real conversation can still compete with technology. (2 marks) (b) She is perceptive and critically aware — she questions reality rather than accepting information at face value; shows intellectual maturity and social awareness. (2 marks) (c) Theme: technology vs reality / the danger of social media misrepresentation. Evidence: "the gap between the Kenya most young people see on social media and the Kenya that actually exists." (1 mark)',
    tags: ['close-reading', 'irony', 'theme', 'inference', 'social-media', 'Kenya'], learningObjective: 'Identify literary techniques, make inferences and identify themes in short prose extracts',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Reading',
    subStrand: 'Extensive Reading',
    questionType: 'structured', difficulty: 'easy', marks: 4,
    questionText: 'Explain FOUR benefits of extensive reading for a Grade 10 learner.',
    answerGuide: 'Any four: (1) Builds vocabulary — exposure to many words in context. (2) Improves comprehension — regular reading develops ability to understand complex texts. (3) Enhances writing skills — learners absorb sentence structures, style and organisation. (4) Broadens general knowledge — reading widely expands world knowledge. (5) Improves spelling and grammar naturally through exposure. (6) Develops critical thinking — encountering different perspectives in texts. Award 1 mark each.',
    tags: ['extensive-reading', 'benefits', 'vocabulary', 'comprehension'], learningObjective: 'Explain the benefits of extensive reading for language development',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Memos',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'State FIVE structural differences between a formal letter and a memo.',
    answerGuide: 'Any five: (1) Letter has full addresses; memo has TO/FROM/DATE/SUBJECT headings only. (2) Letter has "Dear Mr/Ms..." salutation; memo has none. (3) Letter has "Yours sincerely/faithfully" sign-off; memo has none. (4) Memo uses concise bullet-style language; letter uses full paragraphs. (5) Letter identifies sender and recipient through addresses; memo uses job title/department. (6) Memos are internal documents; formal letters are external. Award 1 mark each.',
    tags: ['memo', 'formal-letter', 'difference', 'format', 'structure'], learningObjective: 'Distinguish between the format of a memo and a formal letter',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Creative Writing: Argumentative and Expository Essays',
    questionType: 'essay', difficulty: 'hard', marks: 20,
    questionText: 'Write an expository article for your school magazine on: THE IMPORTANCE OF CAREER PLANNING FOR YOUNG KENYANS IN GRADE 10.\n\nYour article should: have a clear title and introduction; develop at least FOUR main points; use Kenyan examples; have a strong conclusion. Write 300–400 words.\n\nMarked on: Content (8), Organisation (4), Language (6), Mechanics (2)',
    answerGuide: 'Content (8): clear understanding of career planning (2), at least four valid points developed — e.g. self-awareness, research, setting goals, seeking guidance (4), Kenyan context/examples (2). Organisation (4): title (1), introduction (1), paragraphed body (1), conclusion (1). Language (6): expository tone (2), vocabulary (2), discourse markers (2). Mechanics (2).',
    tags: ['expository', 'careers', 'article', 'magazine', 'Kenya'], learningObjective: 'Write an expository article presenting ideas in a clear organised structure',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Critical Listening',
    questionType: 'structured', difficulty: 'medium', marks: 4,
    questionText: 'Explain FOUR common barriers to effective listening and suggest how each can be overcome.',
    answerGuide: 'Any four (1 mark each, 0.5 for barrier + 0.5 for solution): (1) Environmental noise — find a quieter location; sit closer to speaker. (2) Personal distractions / wandering mind — focus intentionally; note key words. (3) Prejudice/bias about speaker — suspend judgement; focus on content. (4) Language difficulty — request repetition; ask for clarification. (5) Information overload — note main points only; use abbreviations. (6) Emotional state — take a moment to calm before listening sessions.',
    tags: ['barriers-to-listening', 'critical-listening', 'distractions', 'overcoming-barriers'], learningObjective: 'Identify barriers to effective listening and strategies to overcome them',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Listening and Speaking',
    subStrand: 'Speaking Fluency: Public Speaking',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Explain the importance of correct intonation in oral communication. What are the intonation patterns for:\n(i) Statements\n(ii) Yes/No questions\n(iii) Wh- questions\n(iv) Lists\n(v) Exclamations',
    answerGuide: 'Importance of intonation (1 mark): conveys meaning beyond words — changes attitude, emphasis and even the meaning of a sentence. Patterns (1 mark each): (i) Statements — falling intonation (voice drops at end). (ii) Yes/No questions — rising intonation (voice rises at end). (iii) Wh- questions — falling intonation. (iv) Lists — rising on each item, falling on the final item. (v) Exclamations — falling with wide pitch range.',
    tags: ['intonation', 'pronunciation', 'public-speaking', 'rising', 'falling'], learningObjective: 'Identify and apply intonation patterns for different sentence types',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Literature',
    subStrand: 'Prose Analysis',
    questionType: 'structured', difficulty: 'medium', marks: 6,
    questionText: 'Explain the following narrative techniques and give ONE example of how each could be used in a Kenyan story:\n(i) Flashback (2 marks)\n(ii) Foreshadowing (2 marks)\n(iii) Dialogue (2 marks)',
    answerGuide: '(i) Flashback: narrative moves back to a past event. Example: character at Kenyatta National Hospital remembers growing up in Nyeri — explains why she became a nurse. (ii) Foreshadowing: earlier hints that prepare reader for later events. Example: farmer notices wilting crops despite rain — foreshadows discovery of soil disease. (iii) Dialogue: conversation between characters reveals personality and advances plot. Example: two Grade 10 students discussing career paths reveals different ambitions. Award 2 marks each: definition (1) + Kenyan example (1).',
    tags: ['narrative-techniques', 'flashback', 'foreshadowing', 'dialogue', 'prose'], learningObjective: 'Define and apply narrative techniques in Kenyan story contexts',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Literature',
    subStrand: 'Poetry Analysis',
    questionType: 'structured', difficulty: 'hard', marks: 6,
    questionText: 'Read the short poem and answer the questions below.\n\nTHE MARKET WOMAN\nShe rises before the sun,\nher back a question mark\ncurved under the weight\nof what she carries and what she does not say.\nAt the roadside she arranges mangoes\nlike small bright promises.\nBy noon she has sold\nthe morning.\n\n(a) Identify and explain ONE figure of speech in the poem. (2 marks)\n(b) What is the mood of the poem? Support with evidence. (2 marks)\n(c) What do you think the poet means by "she has sold the morning"? (2 marks)',
    answerGuide: '(a) Metaphor — "her back a question mark" compares her bent posture to a question mark; suggests she carries unspoken burdens and unresolved struggles. OR Metaphor — "mangoes like small bright promises" (simile) — suggests hope and the fragility of her income. (b) Mood: quiet, dignified melancholy — evidence: "what she does not say" (suppressed suffering), "rises before the sun" (toil), back "curved under the weight". (c) "Sold the morning" means she has traded her effort, time and early hours for money — by noon the productive part of her day is gone; implies the toll of informal trade on her time and body. Award 2 marks each.',
    tags: ['poetry', 'metaphor', 'mood', 'women', 'market', 'Kenya', 'figure-of-speech'], learningObjective: 'Analyse a short poem for figurative language, mood and meaning',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Literature',
    subStrand: 'Drama Analysis',
    questionType: 'structured', difficulty: 'medium', marks: 5,
    questionText: 'Explain FIVE ways in which a playwright uses dramatic techniques to engage the audience in a play.',
    answerGuide: 'Any five: (1) Dramatic irony — audience knows something characters do not, creating tension. (2) Soliloquy — character speaks thoughts aloud, giving audience insight into mind. (3) Conflict — disagreement between characters creates tension and drives plot. (4) Dramatic climax — high-tension moment where conflict peaks. (5) Foreshadowing — hints of future events create suspense. (6) Setting/stage directions — create atmosphere and context. (7) Dialogue — reveals character and advances plot. Award 1 mark each.',
    tags: ['drama', 'dramatic-irony', 'soliloquy', 'conflict', 'climax', 'dramatic-techniques'], learningObjective: 'Identify and explain dramatic techniques used by playwrights to engage audiences',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Functional Writing: Formal Letters — Complaint, Request, Inquiry',
    questionType: 'essay', difficulty: 'hard', marks: 20,
    questionText: 'Write a formal letter to a well-known Kenyan sports personality, requesting their appearance at your school sports day as a guest of honour. Your letter should:\n(i) Follow full formal letter format\n(ii) Introduce your school\n(iii) Describe the event\n(iv) State why you chose this person\n(v) Make a clear, polite request\nWrite approximately 250–300 words.\n\nMarked on: Content (8), Format (6), Language (4), Mechanics (2)',
    answerGuide: 'Content (8): school introduction (2), clear event description including date/theme (2), reason for choosing this personality (2), clear polite request (2). Format (6): sender address (1), date (1), recipient address (1), salutation (1), paragraphed body (1), "Yours sincerely" + signature (1). Language (4): formal register maintained (2), appropriate vocabulary and sentence variety (2). Mechanics (2).',
    tags: ['formal-letter', 'request', 'sports', 'Kenyan-sports', 'guest-of-honour'], learningObjective: 'Write a persuasive formal letter of request to a public figure',
  },
  {
    grade: 'Grade 10', subject: 'English',
    strand: 'Writing',
    subStrand: 'Paragraphing Skills',
    questionType: 'structured', difficulty: 'easy', marks: 5,
    questionText: 'Write ONE effective topic sentence for each paragraph topic below. Then write TWO supporting sentences for ONE of them:\n(i) The importance of reading books\n(ii) Challenges facing young people in Kenya\n(iii) The role of technology in modern education',
    answerGuide: 'Topic sentences — assess clarity of main idea, appropriate scope, engagement. Examples: (i) "Books are windows into other worlds that expand our understanding of humanity." (ii) "Young Kenyans today face a complex web of challenges that previous generations could scarcely have imagined." (iii) "Technology has fundamentally transformed the learning experience." Award 1 mark each for quality topic sentence (3 marks). Supporting sentences (2 marks): two sentences that develop the topic sentence with evidence/explanation, not merely repeat it. Deduct if sentences are too vague or off-topic.',
    tags: ['topic-sentences', 'paragraphing', 'supporting-sentences', 'organisation'], learningObjective: 'Write effective topic sentences and develop them with supporting sentences',
  },


];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check how many English questions already exist to avoid duplicates
    const existing = await QuestionBank.countDocuments({ subject: 'English', grade: 'Grade 10' });
    if (existing > 0) {
      console.log(`⚠️  Found ${existing} existing Grade 10 English questions.`);
      console.log('   To re-seed, first delete them from MongoDB Atlas, then run this script again.');
      console.log('   Or uncomment the deleteMany line below in the script.');
      // await QuestionBank.deleteMany({ subject: 'English', grade: 'Grade 10' });
    }

    const inserted = await QuestionBank.insertMany(englishQuestions);
    console.log(`\n✅ Inserted ${inserted.length} English questions into question bank`);

    const breakdown = {};
    inserted.forEach(q => {
      const key = `${q.strand}`;
      breakdown[key] = (breakdown[key] || 0) + 1;
    });

    console.log('\nBreakdown by Strand:');
    Object.entries(breakdown).forEach(([k, v]) => console.log(`  ${k}: ${v} questions`));

    const total = await QuestionBank.countDocuments({ subject: 'English', grade: 'Grade 10' });
    console.log(`\nTotal Grade 10 English questions in bank: ${total}`);
    console.log('\nDone! Run GET /api/exams/bank/stats to verify.');

  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
