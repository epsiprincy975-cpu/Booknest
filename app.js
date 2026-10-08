const categoryBooks = {
  'College Books': ['Engineering Mathematics', 'Programming Fundamentals', 'Business Management', 'Medical Essentials', 'Civil Engineering Guide', 'Accounting Principles', 'Modern Economics', 'Law for Students', 'English Communication', 'Exam Success Handbook'],
  'Devotion Books': ['Daily Devotion', 'The Prayer Journal', 'Path of Peace', 'Songs of Faith', 'Grace Every Morning', 'Sacred Reflections', 'Hope and Healing', 'The Wisdom Within', 'Light for the Soul', 'Faithful Living'],
  'Science Books': ['The Cosmos Explained', 'Biology of Life', 'The Physics Journey', 'Chemistry Made Clear', 'Wonders of Space', 'Earth and Environment', 'Human Body Atlas', 'Science of Tomorrow', 'The Quantum World', 'Nature’s Secrets'],
  'Technology Books': ['Web Development Guide', 'Python for Beginners', 'Artificial Intelligence', 'Cyber Security Basics', 'Cloud Computing', 'Data Science Handbook', 'Mobile App Design', 'The Coding Mindset', 'Robotics and Innovation', 'Future of Technology'],
  'Beauty Books': ['The Beauty Edit', 'Natural Skin Care', 'Hair Care Handbook', 'Makeup Made Easy', 'Glow from Within', 'The Self-Care Guide', 'Style and Confidence', 'Beauty Rituals', 'Everyday Wellness', 'Your Radiant Life'],
  'Story Books': ['The Silent Garden', 'Moonlight Letters', 'The Hidden Door', 'A Summer Promise', 'The Last Train Home', 'Whispers in the Rain', 'The Paper Boat', 'Starlight Stories', 'The Lost Map', 'A Thousand Tomorrows'],
  'Kids Books': ['The Brave Little Fox', 'My First Space Book', 'Rainbow Adventures', 'The Magic Pencil', 'Tales Before Bed', 'Dino Day Out', 'The Friendly Dragon', 'Little Explorer', 'Animal Friends', 'The Tiny Treasure'],
  'Psychology Books': ['The Human Mind', 'Thinking Clearly', 'Emotional Intelligence', 'Understanding Behaviour', 'The Power of Habits', 'Mind and Memory', 'Psychology of Happiness', 'Finding Focus', 'The Listening Mind', 'Better Relationships']
};

const coverImages = [
  '1544947950-fa07a98d237f',
  '1512820790803-83ca734da794',
  '1495640388908-05fa85288e61',
  '1516979187457-637abb4f9353',
  '1495446815901-a7297e633e8d',
  '1543002588-bfa74002ed7e',
  '1524995997946-a1c2e315a42f',
  '1481627834876-b7833e8f5570',
  '1507842217343-583bb7270b66',
  '1511108690759-009324a90311'
];

const books = Object.entries(categoryBooks).flatMap(
  ([cat, titles], categoryIndex) =>
    titles.map((title, index) => ({
      id: categoryIndex * 10 + index + 1,
      title,
      author: 'BookNest Collection',
      price: 299 + ((index * 2 + categoryIndex) % 8) * 75,
      cat,
      img: `https://images.unsplash.com/photo-${
        coverImages[(index + categoryIndex * 2) % coverImages.length]
      }?auto=format&fit=crop&w=600&q=85`
    }))
);

const get = key => JSON.parse(localStorage.getItem(key) || '[]');
const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const formatPrice = value =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);

function nav() {
  return `
    <div class="top">✨ Free shipping on orders over ₹999</div>

    <header class="wrap">
      <nav class="nav">
        <a class="brand" href="index.html">📖 Book<span>Nest</span></a>

        <div class="links">
          <a href="books.html">Books</a>
          <a href="category.html">Categories</a>
          <a href="orders.html">My orders</a>
        </div>

        <div class="actions">
          <a href="wishlist.html">♡ <span class="badge" id="wish-count">0</span></a>
          <a href="cart.html">Cart <span class="badge" id="cart-count">0</span></a>
        </div>
      </nav>
    </header>
  `;
}

function footer() {
  return `
    <footer class="footer">
      <div class="wrap">
        <div>
          <strong class="brand" style="color:white">📖 Book<span>Nest</span></strong>
          <p>Stories for every shelf and every season.</p>
        </div>

        <p>© 2026 BookNest · Thoughtfully selected books.</p>
      </div>
    </footer>
  `;
}

function bookCard(book) {
  return `
    <article class="card">
      <button class="heart" data-wish="${book.id}" aria-label="Save book">♡</button>

      <a href="detail.html?id=${book.id}">
        <img src="${book.img}" alt="${book.title} book cover">

        <div class="card-body">
          <span class="muted">${book.cat}</span>
          <h3>${book.title}</h3>
          <div class="author">${book.author}</div>
          <div class="price">${formatPrice(book.price)}</div>
        </div>
      </a>
    </article>
  `;
}

function renderShell() {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="ambient" aria-hidden="true">
      <i></i><i></i><i></i>
      <b>✦</b><b>✧</b><b>✦</b>
      <em>📖</em><em>📘</em>
    </div>`
  );

  document.getElementById('site-header').innerHTML = nav();
  document.getElementById('site-footer').innerHTML = footer();
  updateCounts();
}

function updateCounts() {
  const cartTotal = get('cart').reduce(
    (total, item) => total + item.qty,
    0
  );

  const wishTotal = get('wishlist').length;

  document.querySelectorAll('#cart-count').forEach(
    element => element.textContent = cartTotal
  );

  document.querySelectorAll('#wish-count').forEach(
    element => element.textContent = wishTotal
  );
}

function addWish(id) {
  let wishes = get('wishlist');

  wishes = wishes.includes(id)
    ? wishes.filter(item => item !== id)
    : [...wishes, id];

  set('wishlist', wishes);
  updateCounts();
}

function addCart(id, qty = 1) {
  const cart = get('cart');
  const item = cart.find(entry => entry.id === id);

  if (item) {
    item.qty += qty;
  } else {
    cart.push({ id, qty });
  }

  set('cart', cart);
  updateCounts();
}

document.addEventListener('click', event => {
  const heart = event.target.closest('[data-wish]');

  if (heart) {
    addWish(+heart.dataset.wish);
    heart.classList.toggle('saved');
  }

  const add = event.target.closest('[data-add]');

  if (add) {
    addCart(+add.dataset.add, +add.dataset.qty || 1);
    add.textContent = 'Added to cart';
  }
});