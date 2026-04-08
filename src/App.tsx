/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, MouseEvent } from 'react';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  Search, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  Share2, 
  ChevronDown,
  Home,
  Grid,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  description: string;
  shades?: { name: string; color: string }[];
  sizes?: string[];
  gallery?: string[];
}

interface CartItem extends Product {
  quantity: number;
  selectedShade?: string;
  selectedSize?: string;
}

// --- Mock Data ---

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Ethereal Silk Dress',
    brand: 'Maison Pure',
    price: 480,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFeSfJGTcxFnelOtUsXAtmT9mQmQ4Q4---hhDYscptbtgM6Xw7iRc98-yTeDf9fVdiwqTOdRmlcwszRvNsjqfCuE2CAo2MujZ4Tjk-ZAkLTDYQdXcURrsWBdRDCJoXR9Akf35XcasrDrVggEedChjuPMblwQH4SJjS7cYFguokLJlSRDmv4PycOwfFkxLx0pQwKgwNBN0LV30_hjbYUFuYMK2NGtM425X4IqT1bp7Xu6Dnzn_hmLUdkWy2w0kbijVsYtFLgLTzcng',
    category: 'Women',
    description: 'A masterpiece of fluidity and form. Hand-cut from 100% heavy-weight mulberry silk, the Ethereal Dress features an asymmetric hemline and a bias-cut silhouette that dances with every movement. Designed for the modern romantic.',
    shades: [
      { name: 'Ivory Mist', color: '#faf9f4' },
      { name: 'Champagne', color: '#e5deda' },
      { name: 'Obsidian', color: '#1b1c19' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCl77APHpiMQxgZcEQ9h7yPuU4koIo6JRDDVwz5cOwDcrQZg9w9JgOf6qbJUwL1Qs3KfnK-bDM8hGLtLZZzQVnKtSnY_bB0neHajWMY8ILKobKBDMAVL4VTr1jA3-9QyKOKxyAghpcR-c21G4V4R_REjOyfiR2AdgLoX-eg76vuN4Yzlj7skXpa6ZgVv5oSItqgjbiz85UtM6N09FSK0jqu3-o0bvVye8dT4ZORvJnmFLzz-PA9x_m6aN2DSj956cFvUpExq4HKVYU',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBIy3H1WpqeD6WEHQqQ9klRQbQ9GC5bTFdfursHendDbfCIrt2Uul0g6328q8PUQb8rIV0Q0u2_fuXXtcJiWHLqp5B4FzrRB9rGeqoKSTq8o5cUd2_Q8hoBmVo1hCg6jTFC_kAHvGlxDUyH6WpDgt4Atnl0MUI0vsQTUnkYOX8Vjnc-aY0fjZkzAM3_qoEfLZXBrJldX9bCx8682-h51pxx-q7tq28-VSO-pB18wSl3hOKM9BsFtbKezAGmm3_UvzuZHr0r4SiUXfc',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnzQs93pM-aVbsUUvdtTz1lrrfig43kkaXXBtE1PTm1KIUBR-XrV9UAH-8_UDuCo-qo1GOgAL4-azQ5Lm4lqk71p04EGcIXcOwf3gVXY5UtQ3HmZKzG21lFfopx7O8VHKjlb7Uw5UkuLeI7726UFxefyFiXkJuNp0I2w-WBydIJuISO6G5STsv0XR-v_2WGc_-_jxzo0z4zf88X3kBFx0r7b-kQTHTwN7TtAeGIhMwF6ADiRqNUuoYodwRxAznTtrUVZCys82eNWs'
    ]
  },
  {
    id: '2',
    name: 'Sculpted Cashmere Knit',
    brand: 'Atelier V',
    price: 620,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxePQPpTvT8xlrTrnmfJ4QJjDiUCGX5jSru0pp_Q9ktnocmiokpbutGm2_0qHpF1M4oCM9ZA7jQkTw61sw4Ww5ItfoOBqJ11E_hfEciUSN7PgqIw3y94cOg7Q-MPJQBmG3NBg3cpD1GVDjBy4fakX_JXdvW-y3UWk4_0d2vCibIItF5Do3u9ZaqinuLuv5naTOrMSlQgeJdIoB2c78adPkmelCrZ11sGrn6QVwHjqaqd7gRABhizkXHOdPDlaVEzjtlsXxe2Sx69o',
    category: 'Women',
    description: 'A luxurious cashmere knit with a sculpted silhouette. Soft, warm, and timeless.',
    shades: [
      { name: 'Oatmeal', color: '#dcd7d0' },
      { name: 'Charcoal', color: '#4a4a4a' }
    ],
    sizes: ['S', 'M', 'L']
  },
  {
    id: '3',
    name: 'Relaxed Linen Trousers',
    brand: 'The Row Editorial',
    price: 340,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWUeT6HTvB7ORRj05kfl-rkiXTcSRMj_E8A61YT8gFebHpwnUIT6TzvSRnpaKpke-u14m-JWHPltwGGyjG-AcFHCxB7x5Hiw-JyHPqRkO3rUnlIroQMtoDrR3gosTKIEJotrOxC0Ob9Tf6hAyrA1mnKOCy9iahqXhA6kujJCC2YB97gFYo23Qowaa85gNqy2Jz6LeLt4KGT1WT3oHZlf-magFdCKvz89cw6L_cWZaQcGsYiP4G9XdXxXL4q71gS2yfYyg9YOhG06s',
    category: 'Women',
    description: 'High-end beige linen trousers paired with leather sandals in a bright gallery setting.',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: '4',
    name: 'Structured Day Tote',
    brand: 'Maison Pure',
    price: 1150,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM_Cxz9EhimiuWxsgoBeisaepMusIox85kXfa5Idr03z6bgA3LsJFPLfXYcKJ-v9ahdChgIeja9KPi9DlMpzbxWtH4AhWLq41nI3bslhI6jTJunTeiBzYAwjQY8B-Bs7sKkFcmyO66ry4eGP4Bvr-PTxAe0ZHV8fA9i11dDby2-IVxjDPpsYWO0rrRkMyX3bkpbFja80NxeiPq_Gznft1mpz96Bo-uhqFGDLZlbK98mCfYWQpowqzRUktiMO4v3XI7KVWxhpne4nc',
    category: 'Accessories',
    description: 'A luxury leather handbag in taupe sitting on an architectural concrete bench.'
  },
  {
    id: '5',
    name: 'Pleated Mid-Length Skirt',
    brand: 'Atelier V',
    price: 290,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZARpjlLZShK29CIdimcLY8SK1o0KMaFD6yA7jDDvlD6OwDWqy67-b4p5qIqogbgfoliha9rvpNd3q68Ki2Xw_0LtOugHmLY1mHl4-VY3tuVcTI4uXL4BNAA9gO_k1GTgz-rfzMdQ7l8HUwmsw0JGGpjkYrJ1FN7qMG3XERGRYVL5TC97gbNZ4q2_qRlPm98MYxv2foPJGwk0N0eJdV6fvWdy3RGdA3i7apipP7OsJvtwGZN1-1W3RLcKkAM9J3-FVThC_NXgidlM',
    category: 'Women',
    description: 'Artistic fashion photo of a pleated white skirt flowing in the wind.',
    sizes: ['S', 'M']
  },
  {
    id: '6',
    name: 'Organic Gold Hoops',
    brand: 'The Row Editorial',
    price: 185,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpyOnXCGYWsSWh_JAJQp5W0atsPx0mPVCmImuhgmcTBhgJlIx9yU_G19O9ktRzHPLYBN4BYwUVWSqIBJf8N-f0ZcmGZ1MQV2YjZ2mOU733fiysdoO-6_H_-15FTa7vRk4moQCijXnkRZoTM2CXB-lMt3FlBSLkCg3jzC7D5nbYZPO4GXxaR1rhExBs2WTEyg9kbdgEAGm095n1FnWUCQUEb9vu3-9V4zfN7_D4hesb4XLZYJ7u7PjWV7ecNMyJSWm1nwSg73nvSbY',
    category: 'Jewelry',
    description: 'Minimal portrait of a model wearing gold architectural earrings.'
  },
  {
    id: '7',
    name: 'Minimalist Wool Coat',
    brand: 'Maison Pure',
    price: 890,
    image: 'https://picsum.photos/seed/coat/800/1200',
    category: 'Women',
    description: 'A structured wool coat with clean lines and a hidden button placket. Perfect for layering.',
    shades: [
      { name: 'Camel', color: '#c19a6b' },
      { name: 'Black', color: '#000000' }
    ],
    sizes: ['S', 'M', 'L']
  },
  {
    id: '8',
    name: 'Architectural Heel Sandals',
    brand: 'Atelier V',
    price: 450,
    image: 'https://picsum.photos/seed/shoes/800/1200',
    category: 'Accessories',
    description: 'Sandals featuring a unique architectural heel and premium leather straps.',
    sizes: ['36', '37', '38', '39', '40']
  }
];

// --- Components ---

const Navbar = ({ 
  onNavigate, 
  cartCount, 
  onOpenCart,
  onOpenSearch
}: { 
  onNavigate: (page: string) => void; 
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}) => (
  <nav className="fixed top-0 w-full z-50 flex flex-col md:flex-row justify-between items-center px-8 py-6 max-w-[1920px] mx-auto bg-background/85 backdrop-blur-xl border-b border-outline-variant/30">
    <div className="hidden md:flex space-x-8">
      <button onClick={() => onNavigate('shop')} className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-on-background opacity-60 hover:opacity-100 transition-all duration-300">New Arrivals</button>
      <button onClick={() => onNavigate('shop')} className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-primary border-b border-primary pb-1">Shop</button>
      <button onClick={() => onNavigate('shop')} className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-on-background opacity-60 hover:opacity-100 transition-all duration-300">Collections</button>
    </div>
    <div className="text-3xl font-light italic font-serif text-on-background tracking-tight cursor-pointer" onClick={() => onNavigate('shop')}>
      Sweet Irene's Boutique
    </div>
    <div className="flex items-center space-x-6">
      <div className="hidden md:flex space-x-6">
        <button className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-on-background opacity-60 hover:opacity-100 transition-all duration-300">About</button>
      </div>
      <div className="flex items-center space-x-4">
        <Search className="w-5 h-5 text-primary cursor-pointer hover:opacity-70 transition-opacity" onClick={onOpenSearch} />
        <div className="relative cursor-pointer group" onClick={onOpenCart}>
          <ShoppingBag className="w-5 h-5 text-primary group-hover:opacity-70 transition-opacity" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </div>
        <User className="w-5 h-5 text-primary cursor-pointer hover:opacity-70 transition-opacity" />
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="w-full py-16 px-12 grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between items-end bg-surface-container border-t border-outline-variant/10">
    <div className="space-y-6">
      <div className="font-serif italic text-xl text-on-surface">Sweet Irene's Boutique</div>
      <p className="max-w-xs font-sans text-[10px] leading-relaxed text-on-surface/60 tracking-wider uppercase">
        Curating minimalism and architectural form for the modern atelier.
      </p>
    </div>
    <div className="flex flex-wrap gap-8 mt-12 lg:mt-0">
      {['Sustainability', 'Shipping', 'Returns', 'Contact'].map((item) => (
        <a key={item} href="#" className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-on-background/60 hover:text-on-background transition-all duration-300">{item}</a>
      ))}
    </div>
    <div className="mt-12 lg:mt-0 text-right">
      <p className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-on-background">© 2026 Sweet Irene's Boutique. All rights reserved.</p>
    </div>
  </footer>
);

const ProductCard = ({ 
  product, 
  onClick, 
  onQuickAdd,
  isFeatured = false
}: { 
  product: Product; 
  onClick: () => void;
  onQuickAdd: (e: MouseEvent, p: Product) => void;
  isFeatured?: boolean;
  key?: string | number;
}) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`group cursor-pointer relative ${isFeatured ? 'md:col-span-2' : ''}`} 
    onClick={onClick}
  >
    {product.id === '1' && (
      <div className="absolute -left-4 top-10 z-10 vertical-text font-sans text-[8px] uppercase tracking-[0.4em] text-primary bg-background py-4 px-1 border-l border-primary">
        New Arrival
      </div>
    )}
    <div className={`relative ${isFeatured ? 'aspect-[16/9]' : 'aspect-[3/4]'} overflow-hidden mb-6 bg-surface-container border border-outline-variant/10`}>
      <img 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
        src={product.image} 
        alt={product.name}
        referrerPolicy="no-referrer"
      />
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
        <button className="flex-grow bg-surface/90 backdrop-blur px-4 py-2 font-sans text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
          Quick View
        </button>
        <button 
          onClick={(e) => onQuickAdd(e, product)}
          className="bg-primary text-white p-2 hover:bg-primary-container transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="space-y-1">
      <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-primary">{product.brand}</p>
      <h2 className="font-serif text-xl font-light text-on-surface">{product.name}</h2>
      <p className="font-sans text-xs font-light tracking-widest text-on-surface/60">${product.price.toFixed(2)}</p>
    </div>
  </motion.div>
);

const ShopPage = ({ 
  onProductClick,
  onQuickAdd
}: { 
  onProductClick: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
}) => {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(2500);
  const [sortBy, setSortBy] = useState('Curated Choice');

  const categories = ['All Items', 'Women', 'Baby', 'Home & Decor', 'Accessories', 'Jewelry'];
  const brands = Array.from(new Set(PRODUCTS.map(p => p.brand)));
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const categoryMatch = activeCategory === 'All Items' || p.category === activeCategory;
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const sizeMatch = selectedSizes.length === 0 || (p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
    const priceMatch = p.price <= priceRange;
    return categoryMatch && brandMatch && sizeMatch && priceMatch;
  }).sort((a, b) => {
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Newest First') return parseInt(b.id) - parseInt(a.id);
    return 0;
  });

  return (
    <div className="pt-32 pb-24 px-8 max-w-[1440px] mx-auto">
      <header className="mb-24 relative">
        <div className="absolute -left-12 top-0 vertical-text font-sans text-[10px] uppercase tracking-[0.5em] text-outline opacity-30 hidden xl:block">
          Est. 2026 — Sweet Irene's Boutique
        </div>
        <h1 className="font-serif text-7xl md:text-9xl font-light mb-6 text-on-surface tracking-tighter leading-none">
          {activeCategory === 'All Items' ? 'The Collection' : activeCategory}
        </h1>
        <div className="flex items-center justify-center gap-6">
          <div className="h-[1px] w-12 bg-primary"></div>
          <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-primary font-medium">A dialogue between form and texture</p>
          <div className="h-[1px] w-12 bg-primary"></div>
        </div>
      </header>

      <section className="mb-12 flex justify-center space-x-4 overflow-x-auto scrollbar-hide pb-4">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-2 rounded-full border border-primary-container font-sans text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
              activeCategory === cat ? 'bg-primary text-on-primary' : 'bg-transparent text-primary hover:bg-primary-container/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      <div className="flex flex-col lg:flex-row gap-16">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-40 space-y-12">
            <div className="space-y-4">
              <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface">Brands</h3>
              <div className="space-y-3">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center group cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded-none border-outline-variant text-primary focus:ring-0" 
                    />
                    <span className="ml-3 font-sans text-xs text-on-surface/70 group-hover:text-on-surface transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <button 
                    key={size} 
                    onClick={() => toggleSize(size)}
                    className={`border py-2 font-sans text-[10px] transition-colors ${selectedSizes.includes(size) ? 'border-primary text-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface">Max Price: ${priceRange}</h3>
              <input 
                type="range" 
                min="100" 
                max="2500" 
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-primary h-1 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between font-sans text-[10px] text-on-surface/50">
                <span>$100</span>
                <span>$2,500</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setSelectedBrands([]);
                setSelectedSizes([]);
                setPriceRange(2500);
              }}
              className="text-[9px] uppercase tracking-widest text-outline hover:text-primary transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-outline-variant/20">
            <div className="flex flex-wrap gap-3 mb-4 md:mb-0">
              {selectedBrands.map(brand => (
                <span key={brand} className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 font-sans text-[9px] uppercase tracking-widest flex items-center">
                  {brand} <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => toggleBrand(brand)} />
                </span>
              ))}
              {selectedSizes.map(size => (
                <span key={size} className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 font-sans text-[9px] uppercase tracking-widest flex items-center">
                  Size: {size} <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => toggleSize(size)} />
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-on-surface/50">Sort By:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none font-sans text-[10px] uppercase tracking-[0.15em] focus:ring-0 cursor-pointer"
              >
                <option>Curated Choice</option>
                <option>Newest First</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map((p, idx) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  isFeatured={idx === 0 && activeCategory === 'All Items'}
                  onClick={() => onProductClick(p)} 
                  onQuickAdd={(e, product) => {
                    e.stopPropagation();
                    onQuickAdd(product);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-4">
              <p className="font-serif italic text-2xl opacity-40">No pieces match your selection</p>
              <button 
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedSizes([]);
                  setPriceRange(2500);
                  setActiveCategory('All Items');
                }}
                className="font-sans text-[10px] uppercase tracking-widest text-primary border-b border-primary"
              >
                Reset all filters
              </button>
            </div>
          )}

          <div className="mt-24 text-center">
            <button className="px-16 py-4 border border-primary text-primary font-sans text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500">
              Explore More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailPage = ({ 
  product, 
  onBack,
  onAddToCart
}: { 
  product: Product; 
  onBack: () => void;
  onAddToCart: (p: Product, shade: string, size: string) => void;
}) => {
  const [selectedShade, setSelectedShade] = useState(product.shades?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'S');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-24">
      <div className="px-8 mb-8">
        <button onClick={onBack} className="flex items-center text-primary hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-sans text-[10px] uppercase tracking-widest">Back to Shop</span>
        </button>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-surface-container-low overflow-hidden">
            <img className="w-full h-full object-cover" src={product.image} alt={product.name} referrerPolicy="no-referrer" />
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {product.gallery?.map((img, i) => (
              <div key={i} className="w-24 aspect-square flex-shrink-0 border border-outline-variant/30 cursor-pointer hover:border-primary transition-colors">
                <img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" src={img} alt={`${product.name} ${i}`} referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-12">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-semibold">{product.brand}</p>
            <h1 className="font-serif italic text-5xl leading-tight text-on-surface">{product.name}</h1>
            <p className="text-2xl font-serif text-primary">${product.price.toFixed(2)}</p>
          </div>

          <div className="space-y-8">
            <p className="text-sm leading-relaxed text-on-surface-variant font-sans">
              {product.description}
            </p>

            {product.shades && (
              <div className="space-y-4">
                <span className="block text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface">
                  Select Shade: <span className="text-outline font-normal">{selectedShade}</span>
                </span>
                <div className="flex gap-4">
                  {product.shades.map((shade) => (
                    <button 
                      key={shade.name}
                      onClick={() => setSelectedShade(shade.name)}
                      className={`w-8 h-8 rounded-full border border-outline-variant/30 transition-all ${selectedShade === shade.name ? 'ring-1 ring-offset-2 ring-primary' : 'hover:ring-1 ring-offset-2 ring-primary/40'}`}
                      style={{ backgroundColor: shade.color }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface">Select Size</span>
                <button className="text-[9px] uppercase tracking-[0.1em] border-b border-outline text-outline">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['XS', 'S', 'M', 'L'].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 border flex items-center justify-center text-xs transition-colors ${selectedSize === size ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant/30 hover:bg-surface-container'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => onAddToCart(product, selectedShade, selectedSize)}
              className="w-full bg-primary py-5 flex items-center justify-center gap-3 text-on-primary text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-primary-container transition-colors"
            >
              Add to Cart
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="border-t border-outline-variant/20 pt-8 space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center list-none cursor-pointer">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold">Provenance & Care</span>
                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="pt-4 text-sm text-on-surface-variant font-sans">
                Crafted in our atelier from ethically sourced materials. Dry clean only.
              </div>
            </details>
            <details className="group border-t border-outline-variant/20 pt-4">
              <summary className="flex justify-between items-center list-none cursor-pointer">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold">Delivery & Returns</span>
                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="pt-4 text-sm text-on-surface-variant font-sans">
                Complimentary worldwide shipping on orders over $1,000. 14-day boutique returns.
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <section className="mt-24 py-16 bg-surface-container-low">
        <div className="px-8 mb-10 flex items-center gap-4">
          <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
          <h3 className="font-serif italic text-2xl">The Curation</h3>
          <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
        </div>
        <div className="flex overflow-x-auto gap-6 px-8 no-scrollbar">
          {PRODUCTS.slice(1, 4).map((p) => (
            <div key={p.id} className="min-w-[280px] flex-shrink-0 group cursor-pointer">
              <div className="aspect-[2/3] bg-surface overflow-hidden relative">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={p.image} alt={p.name} referrerPolicy="no-referrer" />
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-widest text-outline">{p.category}</span>
                <h4 className="font-serif text-lg">{p.name}</h4>
                <p className="text-xs text-primary font-sans">${p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Cart Overlay ---

const CartOverlay = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[];
  onUpdateQuantity: (id: string, shade: string | undefined, size: string | undefined, delta: number) => void;
  onRemove: (id: string, shade: string | undefined, size: string | undefined) => void;
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-outline-variant/20 flex justify-between items-center">
              <h2 className="font-serif italic text-2xl">Your Bag</h2>
              <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40">
                  <ShoppingBag className="w-12 h-12 stroke-[1px]" />
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em]">Your bag is empty</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={`${item.id}-${item.selectedShade}-${item.selectedSize}-${idx}`} className="flex gap-6">
                    <div className="w-24 aspect-[3/4] bg-surface-container overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-lg leading-tight">{item.name}</h3>
                          <button onClick={() => onRemove(item.id, item.selectedShade, item.selectedSize)} className="text-on-surface/40 hover:text-error transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-sans text-[9px] uppercase tracking-widest text-outline">{item.brand}</p>
                        <div className="flex gap-2 mt-2">
                          {item.selectedShade && (
                            <span className="text-[9px] uppercase tracking-widest bg-surface-container px-2 py-0.5 border border-outline-variant/30">
                              {item.selectedShade}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-[9px] uppercase tracking-widest bg-surface-container px-2 py-0.5 border border-outline-variant/30">
                              Size: {item.selectedSize}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-outline-variant/30">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.selectedShade, item.selectedSize, -1)}
                            className="px-3 py-1 hover:bg-surface-container transition-colors"
                          >-</button>
                          <span className="px-3 py-1 font-sans text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.selectedShade, item.selectedSize, 1)}
                            className="px-3 py-1 hover:bg-surface-container transition-colors"
                          >+</button>
                        </div>
                        <p className="font-sans text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 bg-surface-container-low border-t border-outline-variant/20 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold">Subtotal</span>
                  <span className="font-serif text-2xl">${subtotal.toFixed(2)}</span>
                </div>
                <p className="font-sans text-[9px] text-on-surface/50 uppercase tracking-widest">Shipping & taxes calculated at checkout</p>
                <button className="w-full bg-primary py-5 text-on-primary text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-primary-container transition-colors shadow-lg">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Search Overlay ---

const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background z-[100] flex flex-col"
        >
          <div className="p-8 flex justify-end">
            <button onClick={onClose} className="p-4 hover:bg-surface-container rounded-full transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>
          <div className="flex-grow flex flex-col items-center justify-center px-8 max-w-4xl mx-auto w-full">
            <div className="w-full relative">
              <input 
                autoFocus
                type="text" 
                placeholder="Search our curation..." 
                className="w-full bg-transparent border-b-2 border-primary py-6 text-4xl md:text-6xl font-serif italic focus:outline-none placeholder:opacity-20"
              />
              <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 text-primary opacity-40" />
            </div>
            <div className="mt-12 w-full">
              <h3 className="font-sans text-[10px] uppercase tracking-[0.3em] text-outline mb-6">Trending Searches</h3>
              <div className="flex flex-wrap gap-4">
                {['Silk Dresses', 'Cashmere', 'Minimalist Decor', 'Architectural Jewelry'].map(term => (
                  <button key={term} className="px-6 py-2 border border-outline-variant/30 hover:border-primary font-sans text-[10px] uppercase tracking-widest transition-colors">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('shop'); // 'shop' | 'detail'
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('detail');
  };

  const handleBack = () => {
    setCurrentPage('shop');
    setSelectedProduct(null);
  };

  const addToCart = (product: Product, shade: string, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedShade === shade && 
        item.selectedSize === size
      );
      if (existing) {
        return prev.map(item => 
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedShade: shade, selectedSize: size }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, shade: string | undefined, size: string | undefined, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedShade === shade && item.selectedSize === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string, shade: string | undefined, size: string | undefined) => {
    setCart(prev => prev.filter(item => 
      !(item.id === id && item.selectedShade === shade && item.selectedSize === size)
    ));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onNavigate={setCurrentPage} 
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentPage === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShopPage 
                onProductClick={handleProductClick} 
                onQuickAdd={(p) => addToCart(p, p.shades?.[0]?.name || '', p.sizes?.[0] || 'S')} 
              />
            </motion.div>
          )}
          {currentPage === 'detail' && selectedProduct && (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductDetailPage 
                product={selectedProduct} 
                onBack={handleBack} 
                onAddToCart={addToCart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      <CartOverlay 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden flex justify-around items-center px-4 py-3 pb-safe bg-background border-t border-outline-variant/30">
        <button onClick={() => setCurrentPage('shop')} className={`flex flex-col items-center justify-center transition-colors ${currentPage === 'shop' ? 'text-primary' : 'text-on-background/40'}`}>
          <Home className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => setCurrentPage('shop')} className={`flex flex-col items-center justify-center transition-colors ${currentPage === 'shop' ? 'text-primary' : 'text-on-background/40'}`}>
          <Grid className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-widest">Shop</span>
        </button>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center justify-center text-on-background/40 relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-primary text-white text-[7px] w-3 h-3 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
          <span className="font-sans text-[10px] font-semibold uppercase tracking-widest">Bag</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-background/40">
          <User className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-widest">Account</span>
        </button>
      </nav>
    </div>
  );
}
