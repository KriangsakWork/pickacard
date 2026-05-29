import { defineArrayMember, defineField, defineType } from 'sanity';

// Singleton: only one document should ever exist. Enforced via the structure
// tool (fixed documentId) and document actions in sanity.config.js.
export default defineType({
  name: 'homepagePicks',
  title: 'Homepage Picks',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'ของแนะนำประจำเดือน',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      description: 'สินค้าแนะนำหน้าแรก (สูงสุด 6 รายการ)',
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'updatedMonth',
      title: 'Updated month',
      type: 'string',
      description: 'เช่น "2026-01"',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'updatedMonth' },
    prepare({ title, subtitle }) {
      return { title: title || 'Homepage Picks', subtitle };
    },
  },
});
