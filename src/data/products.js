export const products = [

  {
    id: 1,
    name: "Urban Travel Backpack",
    category: "Travel",

    price: 59.99,
    originalPrice: 79.99,

    image: "https://payne-demo.myshopify.com/cdn/shop/products/10_daed5f76-755e-4d9d-ac19-5afea83e4fdb_large.jpg?v=1606710616",

    images: [
      "https://payne-demo.myshopify.com/cdn/shop/products/10_daed5f76-755e-4d9d-ac19-5afea83e4fdb_large.jpg?v=1606710616",
      "images/products/bag1.png",
      "images/products/bag1-2.png"
    ],

    description: "Premium waterproof backpack perfect for travel and daily use.",

    rating: 4.5,
    reviewCount: 120,
    inStock: true,

    sizes: ["Standard"],
    colors: ["Black", "Red"],

    /* 🔥 NEW (for dynamic detail page) */
    variants: [
      {
        color: "Black",
        image: "https://payne-demo.myshopify.com/cdn/shop/products/10_daed5f76-755e-4d9d-ac19-5afea83e4fdb_large.jpg?v=1606710616",
        price: 59.99
      },
      {
        color: "Red",
        image: "images/products/bag1.png",
        price: 64.99
      }
    ]
  },

  {
    id: 2,
    name: "Laptop Backpack Pro",
    category: "Office",

    price: 69.99,
    originalPrice: 89.99,

    image: "https://payne-demo.myshopify.com/cdn/shop/products/6_f98801ee-0ade-4f30-ae76-fddd3d82cb30_large.jpg?v=1636260067",

    images: [
      "https://payne-demo.myshopify.com/cdn/shop/products/6_f98801ee-0ade-4f30-ae76-fddd3d82cb30_large.jpg?v=1636260067",
      "images/products/bag2.png",
      "images/products/bag2-2.png"
    ],

    description: "Secure laptop backpack with USB charging port.",

    rating: 4.7,
    reviewCount: 95,
    inStock: true,

    sizes: ["15 inch", "17 inch"],
    colors: ["Gray", "Black"],

    /* 🔥 NEW */
    variants: [
      {
        color: "Gray",
        image: "images/products/bag2.png",
        price: 69.99
      },
      {
        color: "Black",
        image: "images/products/bag2-2.png",
        price: 74.99
      }
    ]
  },

  {
    id: 3,
    name: "Outdoor Hiking Backpack",
    category: "Travel",
    price: 49.99,
    originalPrice: 69.99,
    image: "images/products/bag3.png",
    images: [
      "images/products/bag3.png"
    ],
    description: "Durable backpack for hiking and outdoor adventures.",
    rating: 4.3,
    reviewCount: 60,
    inStock: true,
    sizes: ["Standard"],
    colors: ["Blue"],
    variants: [
      {
        color: "Blue",
        image: "images/products/bag3.png",
        price: 49.99
      }
    ]
  },

  {
    id: 4,
    name: "Minimalist Daypack",
    category: "Casual",
    price: 39.99,
    originalPrice: 59.99,
    image: "images/products/bag4.png",
    images: [
      "images/products/bag4.png"
    ],
    description: "Lightweight and stylish daily backpack.",
    rating: 4.2,
    reviewCount: 40,
    inStock: true,
    sizes: ["Standard"],
    colors: ["Black"],
    variants: [
      {
        color: "Black",
        image: "images/products/bag4.png",
        price: 39.99
      }
    ]
  }

];

export const categories = [
  {
    id: 1,
    name: "Travel",
    image: "images/categories/travel.jpg"
  },
  {
    id: 2,
    name: "Office",
    image: "images/categories/office.jpg"
  },
  {
    id: 3,
    name: "Hiking",
    image: "images/categories/hiking.jpg"
  },
  {
    id: 4,
    name: "School",
    image: "images/categories/school.jpg"
  }
];