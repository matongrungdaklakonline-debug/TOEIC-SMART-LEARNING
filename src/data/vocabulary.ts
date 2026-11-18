import type { ToeicPart, VocabEntry } from '../types/toeic';
import { BACKBONE_TOPICS, PART1_SCENE_GROUPS, PART2_GOLDEN_PHRASES } from './part1And2';
import { PART3_SITUATIONS } from './situationsPart3';
import { PART4_SITUATIONS } from './situationsPart4';
import { PART6_SITUATIONS } from './situationsPart6';
import { PART7_SITUATIONS } from './situationsPart7';

// Metadata lookup strictly for words present in the curriculum (IPA & Part of Speech for learner clarity)
const LEXICAL_META: Record<string, { ipa: string; pos: string; collocations?: string[]; note?: string }> = {
  reservation: { ipa: '/ˌrez.ərˈveɪ.ʃən/', pos: 'noun', collocations: ['make a reservation', 'confirm a reservation', 'cancel a reservation'] },
  availability: { ipa: '/əˌveɪ.ləˈbɪl.ə.ti/', pos: 'noun', collocations: ['room availability', 'check availability'] },
  vacancy: { ipa: '/ˈveɪ.kən.si/', pos: 'noun', collocations: ['no vacancy', 'job vacancy'] },
  'check-out': { ipa: '/ˈtʃek.aʊt/', pos: 'noun/verb', collocations: ['late check-out', 'check out of the hotel'] },
  'check-in': { ipa: '/ˈtʃek.ɪn/', pos: 'noun/verb', collocations: ['check in online', 'check-in counter'] },
  reschedule: { ipa: '/ˌriːˈskedʒ.uːl/', pos: 'verb', collocations: ['reschedule a meeting', 'reschedule an appointment'] },
  agenda: { ipa: '/əˈdʒen.də/', pos: 'noun', collocations: ['on the agenda', 'meeting agenda'] },
  attendee: { ipa: '/əˌtenˈdiː/', pos: 'noun', collocations: ['conference attendees'] },
  minutes: { ipa: '/ˈmɪn.ɪts/', pos: 'noun (plural)', collocations: ['take the minutes', 'meeting minutes'] },
  applicant: { ipa: '/ˈæp.lɪ.kənt/', pos: 'noun', collocations: ['qualified applicant', 'job applicant'] },
  qualification: { ipa: '/ˌkwɑː.lɪ.fɪˈkeɪ.ʃən/', pos: 'noun', collocations: ['meet the qualifications'] },
  position: { ipa: '/pəˈzɪʃ.ən/', pos: 'noun', collocations: ['apply for a position', 'offer a position'] },
  shortlist: { ipa: '/ˈʃɔːrt.lɪst/', pos: 'noun/verb', collocations: ['shortlist candidates'] },
  deadline: { ipa: '/ˈded.laɪn/', pos: 'noun', collocations: ['meet a deadline', 'extend a deadline'] },
  milestone: { ipa: '/ˈmaɪl.stoʊn/', pos: 'noun', collocations: ['project milestone', 'reach a milestone'] },
  'on schedule': { ipa: '/ɑːn ˈskedʒ.uːl/', pos: 'prepositional phrase', collocations: ['stay on schedule'] },
  delay: { ipa: '/dɪˈleɪ/', pos: 'noun/verb', collocations: ['flight delay', 'delay in delivery'] },
  delivery: { ipa: '/dɪˈlɪv.ər.i/', pos: 'noun', collocations: ['arrange delivery', 'estimated delivery', 'delivery confirmation'] },
  'tracking number': { ipa: '/ˈtræk.ɪŋ ˌnʌm.bər/', pos: 'noun phrase', collocations: ['check the tracking number'] },
  dispatch: { ipa: '/dɪˈspætʃ/', pos: 'verb/noun', collocations: ['dispatch an order'] },
  'estimated arrival': { ipa: '/ˈes.tɪ.meɪ.tɪd əˈraɪ.vəl/', pos: 'noun phrase' },
  complaint: { ipa: '/kəmˈpleɪnt/', pos: 'noun', collocations: ['file a complaint', 'handle a complaint'] },
  refund: { ipa: '/ˈriː.fʌnd/', pos: 'noun/verb', collocations: ['issue a refund', 'request a refund'] },
  compensation: { ipa: '/ˌkɑːm.pənˈseɪ.ʃən/', pos: 'noun', collocations: ['offer compensation'] },
  resolve: { ipa: '/rɪˈzɑːlv/', pos: 'verb', collocations: ['resolve an issue', 'resolve a complaint'] },
  fare: { ipa: '/fer/', pos: 'noun', collocations: ['bus fare', 'taxi fare'] },
  transfer: { ipa: '/trænsˈfɜːr/', pos: 'noun/verb', collocations: ['transfer funds', 'wire transfer'] },
  'pickup point': { ipa: '/ˈpɪk.ʌp pɔɪnt/', pos: 'noun phrase' },
  'traffic congestion': { ipa: '/ˈtræf.ɪk kənˈdʒes.tʃən/', pos: 'noun phrase' },
  departure: { ipa: '/dɪˈpɑːr.tʃər/', pos: 'noun', collocations: ['departure gate', 'departure time'] },
  arrival: { ipa: '/əˈraɪ.vəl/', pos: 'noun', collocations: ['arrival time'] },
  'boarding pass': { ipa: '/ˈbɔːr.dɪŋ pæs/', pos: 'noun phrase', collocations: ['present your boarding pass'] },
  itinerary: { ipa: '/aɪˈtɪn.ə.rer.i/', pos: 'noun', collocations: ['travel itinerary'] },
  entrée: { ipa: '/ˈɑːn.treɪ/', pos: 'noun' },
  'side dish': { ipa: '/ˈsaɪd dɪʃ/', pos: 'noun phrase' },
  bill: { ipa: '/bɪl/', pos: 'noun', collocations: ['settle the bill', 'pay the bill'] },
  account: { ipa: '/əˈkaʊnt/', pos: 'noun', collocations: ['open an account'] },
  'interest rate': { ipa: '/ˈɪn.trəst reɪt/', pos: 'noun phrase' },
  'exchange rate': { ipa: '/ɪksˈtʃeɪndʒ reɪt/', pos: 'noun phrase' },
  maintenance: { ipa: '/ˈmeɪn.tən.əns/', pos: 'noun', collocations: ['call maintenance', 'scheduled maintenance'] },
  malfunction: { ipa: '/ˌmælˈfʌŋk.ʃən/', pos: 'noun/verb' },
  report: { ipa: '/rɪˈpɔːrt/', pos: 'noun/verb', collocations: ['submit a report'] },
  replace: { ipa: '/rɪˈpleɪs/', pos: 'verb', collocations: ['replace a faulty item'] },
  policy: { ipa: '/ˈpɑː.lə.si/', pos: 'noun', collocations: ['company policy', 'insurance policy'] },
  'effective date': { ipa: '/ɪˈfek.tɪv deɪt/', pos: 'noun phrase' },
  'comply with': { ipa: '/kəmˈplaɪ wɪð/', pos: 'phrasal verb', collocations: ['comply with regulations'] },
  exception: { ipa: '/ɪkˈsep.ʃən/', pos: 'noun', collocations: ['make an exception'] },
  semester: { ipa: '/səˈmes.tər/', pos: 'noun' },
  admission: { ipa: '/ədˈmɪʃ.ən/', pos: 'noun' },
  assignment: { ipa: '/əˈsaɪn.mənt/', pos: 'noun' },
  orientation: { ipa: '/ˌɔːr.i.enˈteɪ.ʃən/', pos: 'noun', collocations: ['orientation session'] },
  shift: { ipa: '/ʃɪft/', pos: 'noun', collocations: ['work a shift', 'night shift'] },
  'leave request': { ipa: '/liːv rɪˈkwest/', pos: 'noun phrase', collocations: ['submit a leave request'] },
  payroll: { ipa: '/ˈpeɪ.roʊl/', pos: 'noun', collocations: ['on the payroll'] },
  supervisor: { ipa: '/ˈsuː.pər.vaɪ.zər/', pos: 'noun' },
  promotion: { ipa: '/prəˈmoʊ.ʃən/', pos: 'noun' },
  launch: { ipa: '/lɔːntʃ/', pos: 'verb/noun', collocations: ['launch a campaign', 'product launch'] },
  'target audience': { ipa: '/ˈtɑːr.ɡɪt ˈɔː.di.əns/', pos: 'noun phrase' },
  campaign: { ipa: '/kæmˈpeɪn/', pos: 'noun', collocations: ['launch a campaign', 'marketing campaign'] },
  negotiate: { ipa: '/nɪˈɡoʊ.ʃi.eɪt/', pos: 'verb', collocations: ['negotiate terms'] },
  renewal: { ipa: '/rɪˈnuː.əl/', pos: 'noun', collocations: ['contract renewal'] },
  'terms and conditions': { ipa: '/tɜːrmz ənd kənˈdɪʃ.ənz/', pos: 'noun phrase' },
  vendor: { ipa: '/ˈven.dər/', pos: 'noun' },
  appointment: { ipa: '/əˈpɔɪnt.mənt/', pos: 'noun', collocations: ['make an appointment'] },
  prescription: { ipa: '/prɪˈskrɪp.ʃən/', pos: 'noun' },
  dosage: { ipa: '/ˈdoʊ.sɪdʒ/', pos: 'noun' },
  coverage: { ipa: '/ˈkʌv.ər.ɪdʒ/', pos: 'noun' },
  lease: { ipa: '/liːs/', pos: 'noun/verb', collocations: ['renew a lease', 'sign a lease'] },
  tenant: { ipa: '/ˈten.ənt/', pos: 'noun' },
  landlord: { ipa: '/ˈlænd.lɔːrd/', pos: 'noun' },
  renovation: { ipa: '/ˌren.əˈveɪ.ʃən/', pos: 'noun', collocations: ['under renovation'] },
  venue: { ipa: '/ˈven.juː/', pos: 'noun' },
  register: { ipa: '/ˈredʒ.ɪ.stər/', pos: 'verb' },
  'keynote speaker': { ipa: '/ˈkiː.noʊt ˈspiː.kər/', pos: 'noun phrase' },
  attend: { ipa: '/əˈtend/', pos: 'verb', collocations: ['attend a meeting'] },
  forecast: { ipa: '/ˈfɔːr.kæst/', pos: 'noun/verb', collocations: ['weather forecast'] },
  conditions: { ipa: '/kənˈdɪʃ.ənz/', pos: 'noun (plural)', collocations: ['weather conditions'] },
  severe: { ipa: '/səˈvɪr/', pos: 'adjective' },
  postpone: { ipa: '/poʊstˈpoʊn/', pos: 'verb' },
  'software update': { ipa: '/ˈsɔːft.wer ˈʌp.deɪt/', pos: 'noun phrase' },
  'log in': { ipa: '/lɔːɡ ɪn/', pos: 'phrasal verb' },
  'system outage': { ipa: '/ˈsɪs.təm ˈaʊ.tɪdʒ/', pos: 'noun phrase' },
  troubleshoot: { ipa: '/ˈtrʌb.əl.ʃuːt/', pos: 'verb' },
  typing: { ipa: '/ˈtaɪ.pɪŋ/', pos: 'verb (V-ing)' },
  filing: { ipa: '/ˈfaɪ.lɪŋ/', pos: 'verb (V-ing)' },
  reviewing: { ipa: '/rɪˈvjuː.ɪŋ/', pos: 'verb (V-ing)' },
  'pointing at': { ipa: '/ˈpɔɪn.tɪŋ æt/', pos: 'phrasal verb' },
  photocopying: { ipa: '/ˈfoʊ.t̬oʊ.kɑː.pi.ɪŋ/', pos: 'verb (V-ing)' },
  stapling: { ipa: '/ˈsteɪ.pəl.ɪŋ/', pos: 'verb (V-ing)' },
  'reaching for': { ipa: '/ˈriː.tʃɪŋ fɔːr/', pos: 'phrasal verb' },
  holding: { ipa: '/ˈhoʊl.dɪŋ/', pos: 'verb (V-ing)' },
  'walking / strolling': { ipa: '/ˈwɔː.kɪŋ/', pos: 'verb (V-ing)' },
  crossing: { ipa: '/ˈkrɔː.sɪŋ/', pos: 'verb (V-ing)' },
  construction: { ipa: '/kənˈstrʌk.ʃən/', pos: 'noun' },
  'sweeping / cleaning': { ipa: '/ˈswiː.pɪŋ/', pos: 'verb (V-ing)' },
  parked: { ipa: '/pɑːrkt/', pos: 'adjective/V3' },
  'loading / unloading': { ipa: '/ˈloʊ.dɪŋ/', pos: 'verb (V-ing)' },
  serving: { ipa: '/ˈsɜːr.vɪŋ/', pos: 'verb (V-ing)' },
  ordering: { ipa: '/ˈɔːr.dər.ɪŋ/', pos: 'verb (V-ing)' },
  browsing: { ipa: '/ˈbraʊ.zɪŋ/', pos: 'verb (V-ing)' },
  stacking: { ipa: '/ˈstæk.ɪŋ/', pos: 'verb (V-ing)' },
  arranging: { ipa: '/əˈreɪn.dʒɪŋ/', pos: 'verb (V-ing)' },
  paying: { ipa: '/ˈpeɪ.ɪŋ/', pos: 'verb (V-ing)' },
  pouring: { ipa: '/ˈpɔːr.ɪŋ/', pos: 'verb (V-ing)' },
  boarding: { ipa: '/ˈbɔːr.dɪŋ/', pos: 'verb (V-ing)' },
  waiting: { ipa: '/ˈweɪ.tɪŋ/', pos: 'verb (V-ing)' },
  'carrying luggage': { ipa: '/ˈker.i.ɪŋ ˈlʌɡ.ɪdʒ/', pos: 'verb phrase' },
  checking: { ipa: '/ˈtʃek.ɪŋ/', pos: 'verb (V-ing)' },
  'lined up': { ipa: '/laɪnd ʌp/', pos: 'adjective/phrasal verb' },
  stacked: { ipa: '/stækt/', pos: 'adjective/V3' },
  displayed: { ipa: '/dɪˈspleɪd/', pos: 'adjective/V3' },
  'empty / unoccupied': { ipa: '/ˈemp.ti/', pos: 'adjective' },
  'under construction': { ipa: '/ˈʌn.dər kənˈstrʌk.ʃən/', pos: 'prepositional phrase' },
  'rent a car': { ipa: '/rent ə kɑːr/', pos: 'verb phrase' },
  'rental agreement': { ipa: '/ˈren.təl əˈɡriː.mənt/', pos: 'noun phrase' },
  insurance: { ipa: '/ɪnˈʃʊr.əns/', pos: 'noun' },
  deposit: { ipa: '/dɪˈpɑː.zɪt/', pos: 'noun/verb' },
  mileage: { ipa: '/ˈmaɪ.lɪdʒ/', pos: 'noun' },
  return: { ipa: '/rɪˈtɜːrn/', pos: 'verb/noun' },
  gate: { ipa: '/ɡeɪt/', pos: 'noun' },
  baggage: { ipa: '/ˈbæɡ.ɪdʒ/', pos: 'noun' },
  security: { ipa: '/səˈkjʊr.ə.ti/', pos: 'noun' },
  'key card': { ipa: '/ˈkiː kɑːrd/', pos: 'noun phrase' },
  amenities: { ipa: '/əˈmen.ə.tiz/', pos: 'noun (plural)' },
  upgrade: { ipa: '/ˈʌp.ɡreɪd/', pos: 'noun/verb' },
  charge: { ipa: '/tʃɑːrdʒ/', pos: 'noun/verb' },
  payment: { ipa: '/ˈpeɪ.mənt/', pos: 'noun', collocations: ['process a payment', 'make a payment'] },
  receipt: { ipa: '/rɪˈsiːt/', pos: 'noun' },
  'late check-out': { ipa: '/leɪt ˈtʃek.aʊt/', pos: 'noun phrase' },
  party: { ipa: '/ˈpɑːr.ti/', pos: 'noun' },
  'special request': { ipa: '/ˈspeʃ.əl rɪˈkwest/', pos: 'noun phrase' },
  confirm: { ipa: '/kənˈfɜːrm/', pos: 'verb', collocations: ['confirm attendance', 'confirm a booking'] },
  cancel: { ipa: '/ˈkæn.səl/', pos: 'verb', collocations: ['cancel a reservation'] },
  announcement: { ipa: '/əˈnaʊns.mənt/', pos: 'noun' },
  effective: { ipa: '/ɪˈfek.tɪv/', pos: 'adjective' },
  mandatory: { ipa: '/ˈmæn.də.tɔːr.i/', pos: 'adjective' },
  reminder: { ipa: '/rɪˈmaɪn.dər/', pos: 'noun' },
  update: { ipa: '/ˈʌp.deɪt/', pos: 'noun/verb', collocations: ['update a system'] },
  attention: { ipa: '/əˈten.ʃən/', pos: 'noun' },
  voicemail: { ipa: '/ˈvɔɪs.meɪl/', pos: 'noun' },
  'return the call': { ipa: '/rɪˈtɜːrn ðə kɔːl/', pos: 'verb phrase' },
  urgent: { ipa: '/ˈɜːr.dʒənt/', pos: 'adjective' },
  unavailable: { ipa: '/ˌʌn.əˈveɪ.lə.bəl/', pos: 'adjective' },
  contact: { ipa: '/ˈkɑːn.tækt/', pos: 'verb/noun' },
  regarding: { ipa: '/rɪˈɡɑːr.dɪŋ/', pos: 'preposition' },
};

function buildVocabularyBank(): VocabEntry[] {
  const map = new Map<string, VocabEntry>();

  const upsert = (params: {
    word: string;
    viMeaning: string;
    part: ToeicPart;
    situationId: string;
    topic: string;
    synonyms?: string[];
    antonyms?: string[];
    confusingPairs?: string[];
    examples?: string[];
  }) => {
    const normalized = params.word.trim().toLowerCase();
    if (!normalized || normalized === 'position') {
      // keep 'position' from HR, skip generic 'position (vị trí)' in Part 1 objects if redundant
      if (params.situationId === 'P1-05') return;
    }
    const existing = map.get(normalized);
    const meta = LEXICAL_META[normalized] ?? LEXICAL_META[params.word.trim()];
    const topicObj = BACKBONE_TOPICS.find((t) => t.name === params.topic);
    const topicCollocations = topicObj?.collocations?.filter((c) => c.toLowerCase().includes(normalized)) ?? [];

    if (existing) {
      if (!existing.relatedParts.includes(params.part)) existing.relatedParts.push(params.part);
      if (!existing.relatedSituationIds.includes(params.situationId)) existing.relatedSituationIds.push(params.situationId);
      if (!existing.viMeaning.toLowerCase().includes(params.viMeaning.toLowerCase())) {
        existing.viMeaning = `${existing.viMeaning}; ${params.viMeaning}`;
      }
      for (const s of params.synonyms ?? []) if (s && !existing.synonyms.includes(s)) existing.synonyms.push(s);
      for (const a of params.antonyms ?? []) if (a && !existing.antonyms.includes(a)) existing.antonyms.push(a);
      for (const c of params.confusingPairs ?? []) if (c && !existing.confusingPairs.includes(c)) existing.confusingPairs.push(c);
      for (const e of params.examples ?? []) if (e && !existing.examples.includes(e)) existing.examples.push(e);
    } else {
      map.set(normalized, {
        id: `VOC-${String(map.size + 1).padStart(3, '0')}`,
        word: params.word.trim(),
        ipa: meta?.ipa ?? '',
        partOfSpeech: meta?.pos ?? 'từ/cụm từ TOEIC',
        viMeaning: params.viMeaning,
        synonyms: [...(params.synonyms ?? [])],
        antonyms: [...(params.antonyms ?? [])],
        confusingPairs: [...(params.confusingPairs ?? [])],
        collocations: Array.from(new Set([...(meta?.collocations ?? []), ...topicCollocations])),
        examples: [...(params.examples ?? [])],
        viExplanation: `Thuộc nhóm chủ đề ${params.topic}. Xuất hiện trong tài liệu giáo trình chính thức.`,
        relatedParts: [params.part],
        relatedSituationIds: [params.situationId],
        backboneTopic: params.topic,
        origin: 'curriculum',
      });
    }
  };

  // Part 1
  for (const scene of PART1_SCENE_GROUPS) {
    for (const kw of scene.keywords) {
      upsert({
        word: kw.word,
        viMeaning: kw.meaning,
        part: 'part1',
        situationId: scene.id,
        topic: 'Part 1 – Photographs',
        synonyms: kw.synonyms,
        antonyms: kw.antonyms,
        confusingPairs: scene.confusingPairs.filter((p) => p.toLowerCase().includes(kw.word.split('/')[0].trim().toLowerCase())),
        examples: kw.example ? [kw.example] : [],
      });
    }
  }

  // Part 2 Golden Phrases
  for (const gp of PART2_GOLDEN_PHRASES) {
    upsert({
      word: gp.phrase,
      viMeaning: gp.meaning,
      part: 'part2',
      situationId: 'P2-02',
      topic: 'Part 2 – Question-Response',
      synonyms: gp.synonyms,
      examples: [gp.usageNote],
    });
  }

  // Part 3, 4, 6, 7
  const allSituations = [...PART3_SITUATIONS, ...PART4_SITUATIONS, ...PART6_SITUATIONS, ...PART7_SITUATIONS];
  for (const sit of allSituations) {
    for (const kw of sit.keywords) {
      upsert({
        word: kw.word,
        viMeaning: kw.meaning,
        part: sit.part,
        situationId: sit.id,
        topic: sit.backboneTopic,
        synonyms: kw.synonyms,
        antonyms: kw.antonyms,
        examples: kw.example ? [kw.example] : [],
      });
    }
  }

  return Array.from(map.values());
}

export const VOCABULARY_BANK: VocabEntry[] = buildVocabularyBank();
