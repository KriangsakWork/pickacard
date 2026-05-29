import { defineField, defineType } from 'sanity';

import { slugify } from '../lib/slugify';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'ชื่อหมวด เช่น "ความรัก", "การงาน"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', slugify, maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji เช่น "💕"',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'ลำดับการแสดงผล (น้อยมาก่อน)',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', icon: 'icon' },
    prepare({ title, subtitle, icon }) {
      return {
        title: icon ? `${icon} ${title}` : title,
        subtitle,
      };
    },
  },
});
