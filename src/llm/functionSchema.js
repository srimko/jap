export const functionSchema = {
  name: 'segmentJapanese',
  description:
    'Segmenter une phrase japonaise et retourner la lecture, la traduction et le découpage',
  parameters: {
    type: 'object',
    properties: {
      kanji: { type: 'string' },
      hiragana: { type: 'string' },
      romaji: { type: 'string' },
      translation: { type: 'string' },
      split: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            kanji: { type: 'string' },
            hiragana: { type: 'string' },
            romaji: { type: 'string' },
            translation: { type: 'string' },
            parts: {
              type: 'array',
              description: 'Découpage du mot par kanji ou unité avec lecture et prononciation',
              items: {
                type: 'object',
                properties: {
                  kanji: { type: 'string' },
                  hiragana: { type: 'string' },
                  romaji_syllables: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Découpe syllabique rōmaji de ce kanji',
                  },
                  pronunciation_units: {
                    type: 'array',
                    description:
                      'Correspondance caractère par caractère entre kanji, hiragana et rōmaji',
                    items: {
                      type: 'object',
                      properties: {
                        kanji: { type: 'string' },
                        hiragana: { type: 'string' },
                        romaji: { type: 'string' },
                      },
                      required: ['kanji', 'hiragana', 'romaji'],
                    },
                  },
                },
                required: ['kanji', 'hiragana', 'romaji_syllables', 'pronunciation_units'],
              },
            },
          },
          required: ['kanji', 'hiragana', 'romaji', 'translation', 'parts'],
        },
      },
    },
    required: ['kanji', 'hiragana', 'romaji', 'translation', 'split'],
  },
}
