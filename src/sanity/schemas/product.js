import { defineField, defineType } from 'sanity';

import { slugify } from '../lib/slugify';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'ชื่อสินค้า',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', slugify, maxLength: 96 },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'ราคาเริ่มต้น',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'THB',
    }),
    defineField({
      name: 'shopeeUrl',
      title: 'Shopee URL',
      type: 'url',
      description: 'Affiliate link',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'ไพ่', value: 'ไพ่' },
          { title: 'หิน', value: 'หิน' },
          { title: 'เทียน', value: 'เทียน' },
          { title: 'เครื่องราง', value: 'เครื่องราง' },
          { title: 'หนังสือ', value: 'หนังสือ' },
          { title: 'อื่นๆ', value: 'อื่นๆ' },
        ],
      },
    }),
    defineField({
      name: 'tarotCards',
      title: 'Related tarot cards',
      type: 'array',
      of: [{ type: 'string' }],
      description: "slug ของไพ่ที่เกี่ยวข้อง เช่น 'the-moon', 'the-star'",
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description: 'ลำดับความสำคัญ (มากมาก่อน)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      price: 'price',
      currency: 'currency',
      category: 'category',
    },
    prepare({ title, media, price, currency, category }) {
      const parts = [];
      if (price != null) parts.push(`${price} ${currency || 'THB'}`);
      if (category) parts.push(category);
      return { title, media, subtitle: parts.join(' · ') };
    },
  },
});
