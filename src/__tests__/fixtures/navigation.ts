import type { Navigation } from '@/types';

export default {
  pages: {
    denominator_behind_at_shyly_er: {
      key: 'denominator_behind_at_shyly_er',
      name: 'Denominator behind at shyly er',
      level: 0,
      link: 'denominator-behind-at-shyly-er.html',
    },
    capital_vol: {
      key: 'capital_vol',
      name: 'Capital vol',
      level: 0,
      link: 'capital-vol.html',
      childPageKeys: ['bronze_gah_whenever'],
    },
    bronze_gah_whenever: {
      key: 'bronze_gah_whenever',
      name: 'Bronze gah whenever',
      level: 1,
      link: 'bronze-gah-whenever.html',
      parentKey: 'capital_vol',
      childPageKeys: ['nor_oblong_thanks_pigpen_hydrate'],
    },
    nor_oblong_thanks_pigpen_hydrate: {
      key: 'nor_oblong_thanks_pigpen_hydrate',
      name: 'Nor oblong thanks pigpen hydrate',
      level: 2,
      link: 'nor-oblong-thanks-pigpen-hydrate.html',
      parentKey: 'bronze_gah_whenever',
      childPageKeys: ['through_definitive_whoever_epitomize_martyr'],
    },
    through_definitive_whoever_epitomize_martyr: {
      key: 'through_definitive_whoever_epitomize_martyr',
      name: 'Through definitive whoever epitomize martyr',
      level: 3,
      link: 'through-definitive-whoever-epitomize-martyr.html',
      parentKey: 'nor_oblong_thanks_pigpen_hydrate',
      childPageKeys: ['millet_justly_royal'],
    },
    millet_justly_royal: {
      key: 'millet_justly_royal',
      name: 'Millet justly royal',
      level: 4,
      link: 'millet-justly-royal.html',
      parentKey: 'through_definitive_whoever_epitomize_martyr',
      childPageKeys: ['besides_madly'],
    },
    besides_madly: {
      key: 'besides_madly',
      name: 'Besides madly',
      level: 5,
      link: 'besides-madly.html',
      parentKey: 'millet_justly_royal',
    },
  },
  rootLevelKeys: ['denominator_behind_at_shyly_er', 'capital_vol'],
} as Navigation;
