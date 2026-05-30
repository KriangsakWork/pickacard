import { defineField, defineType } from 'sanity';

import { slugify } from '../lib/slugify';

export default defineType({
  name: 'tarotCard',
  title: 'Tarot card',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name (EN)',
      type: 'string',
      description: 'ชื่อภาษาอังกฤษ เช่น "Page of Cups"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameTh',
      title: 'ชื่อ (ไทย)',
      type: 'string',
      description: 'ชื่อภาษาไทย เช่น "เพจถ้วย"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', slugify, maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'arcana',
      title: 'Arcana',
      type: 'string',
      options: {
        list: [
          { title: 'Major', value: 'major' },
          { title: 'Minor', value: 'minor' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'suit',
      title: 'Suit',
      type: 'string',
      description: 'ใช้ "none" สำหรับ Major Arcana',
      options: {
        list: [
          { title: 'Cups', value: 'cups' },
          { title: 'Wands', value: 'wands' },
          { title: 'Swords', value: 'swords' },
          { title: 'Pentacles', value: 'pentacles' },
          { title: 'None (Major Arcana)', value: 'none' },
        ],
      },
    }),
    defineField({
      name: 'number',
      title: 'Number',
      type: 'number',
      description:
        'Major: 0-21 · Minor: 1-14 (Ace=1, Page=11, Knight=12, Queen=13, King=14)',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'เช่น ["ความรู้สึกใหม่ๆ", "ความน่ารักในใจ"]',
    }),
    defineField({
      name: 'basicMeaning',
      title: 'Basic meaning',
      type: 'text',
      rows: 3,
      description: 'ความหมายพื้นฐาน',
    }),
    defineField({
      name: 'reversedMeaning',
      title: 'Reversed meaning',
      type: 'text',
      rows: 3,
      description: 'ความหมายไพ่กลับหัว (optional)',
    }),
  ],
  preview: {
    select: {
      title: 'nameTh',
      name: 'name',
      arcana: 'arcana',
      media: 'image',
    },
    prepare({ title, name, arcana, media }) {
      const parts = [name, arcana].filter(Boolean);
      return {
        title,
        subtitle: parts.join(' • '),
        media,
      };
    },
  },
});
