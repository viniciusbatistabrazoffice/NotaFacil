const STAGE_LABELS = {
  cutting: 'Corte',
  sewing: 'Costura',
  finishing: 'Acabamento',
  packaging: 'Embalagem',
  done: 'Concluído',
};

const STAGE_VARIANTS = {
  cutting: 'amber',
  sewing: 'blue',
  finishing: 'purple',
  packaging: 'slate',
  done: 'green',
};

export const PRODUCTION_STAGE_OPTIONS = Object.entries(STAGE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export function getStageLabel(stage) {
  return STAGE_LABELS[stage] ?? stage;
}

export function getStageVariant(stage) {
  return STAGE_VARIANTS[stage] ?? 'slate';
}
