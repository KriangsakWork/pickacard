import { defineArrayMember, defineField, defineType } from 'sanity';

const cardItem = defineArrayMember({
  name: 'pickCard',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({
      name: 'cardRef',
      title: 'Tarot card',
      type: 'reference',
      to: [{ type: 'tarotCard' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      description: 'เช่น "ความรู้สึกตอนนี้", "สิ่งที่ทำให้ลังเล", "สิ่งที่กำลังจะเกิด"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'meaning',
      title: 'Meaning',
      type: 'array',
      description: 'คำทำนายเฉพาะใบนี้ในบริบทนี้',
      of: [defineArrayMember({ type: 'block' })],
    }),
  ],
  preview: {
    select: {
      title: 'position',
      cardName: 'cardRef.nameTh',
      media: 'cardRef.image',
    },
    prepare({ title, cardName, media }) {
      return {
        title: title || 'Card',
        subtitle: cardName,
        media,
      };
    },
  },
});

const resultItem = defineArrayMember({
  name: 'pickResult',
  title: 'Result',
  type: 'object',
  fields: [
    defineField({
      name: 'resultTitle',
      title: 'Result title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'cards',
      title: 'Cards (3 ใบ)',
      type: 'array',
      of: [cardItem],
      validation: (Rule) => Rule.required().min(3).max(3),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      description: 'สรุปคำทำนายรวม',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'advice',
      title: 'Advice',
      type: 'text',
      rows: 3,
      description: 'คำแนะนำจากจักรวาล',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related products',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
    }),
  ],
  preview: {
    select: {
      title: 'resultTitle',
      subtitle: 'subtitle',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Result',
        subtitle,
      };
    },
  },
});

export default defineType({
  name: 'pickTopic',
  title: 'Pick a Card topic',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'เช่น "เขาคิดยังไงกับคุณ"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'พิมพ์ภาษาอังกฤษเท่านั้น เช่น how-he-thinks (จะกลายเป็น URL: /pick/how-he-thinks)',
      options: { maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const current = value?.current;
          if (!current) return true;
          return /^[a-z0-9-]+$/.test(current)
            ? true
            : 'slug ต้องเป็นภาษาอังกฤษพิมพ์เล็กและขีดกลางเท่านั้น';
        }),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 2,
      description: 'โชว์ในหน้า /pick list',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      description: 'โชว์ badge "แนะนำ"',
      initialValue: false,
    }),
    defineField({
      name: 'results',
      title: 'Results (4 ผลลัพธ์ ตามเลข 1-4)',
      type: 'array',
      of: [resultItem],
      validation: (Rule) => Rule.required().min(4).max(4),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta title',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'ogImage',
          title: 'OG image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
      media: 'coverImage',
    },
  },
});
