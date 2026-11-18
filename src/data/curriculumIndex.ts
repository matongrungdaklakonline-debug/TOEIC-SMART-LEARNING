import { BACKBONE_TOPICS, PART1_SCENE_GROUPS, PART2_QUESTION_TYPES, PRIORITY_COLLOCATIONS, SIX_WEEK_ROADMAP } from './part1And2';
import { PART3_SITUATIONS } from './situationsPart3';
import { PART4_SITUATIONS } from './situationsPart4';
import { PART6_SITUATIONS } from './situationsPart6';
import { PART7_SITUATIONS } from './situationsPart7';
import { VOCABULARY_BANK } from './vocabulary';
import type { SituationItem } from '../types/toeic';

export const ALL_220_SITUATIONS: SituationItem[] = [
  ...PART3_SITUATIONS,
  ...PART4_SITUATIONS,
  ...PART6_SITUATIONS,
  ...PART7_SITUATIONS,
];

export const SITUATION_BY_ID: Record<string, SituationItem> = Object.fromEntries(
  ALL_220_SITUATIONS.map((s) => [s.id, s])
);

export const CURRICULUM_STATS = {
  part1SceneGroups: PART1_SCENE_GROUPS.length,
  part2QuestionTypes: PART2_QUESTION_TYPES.length,
  part3Situations: PART3_SITUATIONS.length,
  part4Situations: PART4_SITUATIONS.length,
  part6Situations: PART6_SITUATIONS.length,
  part7Situations: PART7_SITUATIONS.length,
  total220Situations: ALL_220_SITUATIONS.length,
  totalVocabulary: VOCABULARY_BANK.length,
  backboneTopicsCount: BACKBONE_TOPICS.length,
  roadmapWeeks: SIX_WEEK_ROADMAP.length,
  priorityCollocations: PRIORITY_COLLOCATIONS.length,
  hasPart5Curriculum: false,
};
