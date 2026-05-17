// ============================================
// HOME PAGE JS - Tab filtering + navigation
// ============================================

function scrollToTopics() {
  document.getElementById('topics-section').scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
  document.querySelector('.nav-menu').classList.toggle('open');
}

// Tab filtering
document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const topicCards = document.querySelectorAll('.topic-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // เปลี่ยน active tab
      tabButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const category = this.getAttribute('data-category');

      // กรองการ์ด
      topicCards.forEach(card => {
        if (category === 'all') {
          card.classList.remove('hidden');
        } else {
          if (card.getAttribute('data-category') === category) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
    });
  });

  // ป้องกันการคลิกที่การ์ด disabled
  document.querySelectorAll('.topic-card.disabled').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
    });
  });
});
