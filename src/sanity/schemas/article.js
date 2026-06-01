import { defineArrayMember, defineField, defineType } from 'sanity';

import { slugify } from '../lib/slugify';

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'สรุปย่อ (สูงสุด 200 ตัวอักษร)',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'คำอธิบายรูปสำหรับ SEO / accessibility',
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      description: 'เนื้อหา rich text (heading, bold, italic, list, link, รูปแทรก)',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      description: 'วันเวลาเผยแพร่ (ตั้งเวลาล่วงหน้าได้)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Pick Mystic',
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related products',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      description: 'สินค้าแนะนำในบทความ (สูงสุด 3 — desktop โชว์ครบ, mobile สุ่มโชว์ 1)',
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'productsHeading',
      title: 'Products section heading',
      type: 'string',
      description:
        'ข้อความหัวเรื่องเหนือกล่องสินค้า เช่น "ของแนะนำสำหรับคุณ" (ถ้าไม่กรอก จะใช้ค่าเริ่มต้น)',
    }),
    defineField({
      name: 'relatedPickTopic',
      title: 'Related Pick a Card topic',
      type: 'reference',
      to: [{ type: 'pickTopic' }],
      description:
        'เชื่อมบทความกับหัวข้อ Pick a Card (ถ้าไม่เลือก ระบบจะ auto-match จาก category เดียวกัน)',
    }),
    defineField({
      name: 'relatedCards',
      title: 'Related tarot cards',
      type: 'array',
      of: [{ type: 'string' }],
      description: "slug ไพ่ที่เกี่ยวข้อง เช่น 'the-moon'",
      options: { layout: 'tags' },
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
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'OG image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      description: 'บทความเด่นโชว์หน้าแรก',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Oldest',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      publishedAt: 'publishedAt',
      category: 'category.title',
    },
    prepare({ title, media, publishedAt, category }) {
      const date = publishedAt
        ? new Date(publishedAt).toISOString().slice(0, 10)
        : 'ไม่ได้ตั้งวันเผยแพร่';
      const subtitle = category ? `${category} · ${date}` : date;
      return { title, media, subtitle };
    },
  },
});
