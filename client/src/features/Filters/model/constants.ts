export const categoryOptions = [
  { value: '', label: 'Все категории' },
  { value: 'concert', label: 'Концерты' },
  { value: 'theater', label: 'Театр' },
  { value: 'exhibition', label: 'Выставки' },
  { value: 'sport', label: 'Спорт' },
] as const;

export const subcategoriesMap: Record<string, string[]> = {
  concert: ['рок', 'поп', 'классика', 'джаз'],
  theater: ['драма', 'комедия', 'мюзикл'],
  exhibition: ['искусство', 'наука', 'технологии'],
  sport: ['футбол', 'баскетбол', 'теннис'],
};
