// src/services/mockData.ts

// Categories based on education levels
export const mockCategories = [
    {
      id: 1,
      name: "Elementary School",
      description: "Books for elementary school students (grades 1-6)",
      created_at: "2023-01-01T00:00:00.000Z",
      updated_at: "2023-01-01T00:00:00.000Z"
    },
    {
      id: 2,
      name: "High School",
      description: "Books for high school students (grades 7-12)",
      created_at: "2023-01-01T00:00:00.000Z",
      updated_at: "2023-01-01T00:00:00.000Z"
    },
    {
      id: 3,
      name: "University",
      description: "Textbooks for university students",
      created_at: "2023-01-01T00:00:00.000Z",
      updated_at: "2023-01-01T00:00:00.000Z"
    }
  ];
  
// Comprehensive book list organized by education level
export const mockProducts = [
  // Elementary School Books
  {
    id: 1,
    name: "Math Basics Grade 3",
    description: "Fundamental mathematics concepts for third-grade students covering addition, subtraction, multiplication, and basic division",
    price: 24.99,
    image_url: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=2069&auto=format&fit=crop",
    category_id: 1,
    seller_id: 1,
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-01T00:00:00.000Z",
    author: "Sarah Johnson",
    year: "2021",
    condition: "Excellent",
    seller_name: "BookWorm Learning",
    seller_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Reading Adventures Grade 1",
    description: "Beginner's reading book with illustrated stories to build reading confidence and vocabulary",
    price: 19.99,
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
    category_id: 1,
    seller_id: 1,
    created_at: "2023-01-02T00:00:00.000Z",
    updated_at: "2023-01-02T00:00:00.000Z",
    author: "Michael Roberts",
    year: "2022",
    condition: "Good",
    seller_name: "BookWorm Learning",
    seller_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Science Explorer Grade 4",
    description: "Introduction to science concepts including ecosystems, weather, and simple machines",
    price: 29.99,
    image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
    category_id: 1,
    seller_id: 2,
    created_at: "2023-01-03T00:00:00.000Z",
    updated_at: "2023-01-03T00:00:00.000Z",
    author: "Dr. Emily Wilson",
    year: "2020",
    condition: "Like New",
    seller_name: "Academic Treasures",
    seller_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Social Studies: Our Community Grade 2",
    description: "Learn about communities, geography, and basic citizenship concepts",
    price: 22.99,
    image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop",
    category_id: 1,
    seller_id: 2,
    created_at: "2023-01-04T00:00:00.000Z",
    updated_at: "2023-01-04T00:00:00.000Z",
    author: "David Thompson",
    year: "2022",
    condition: "Good",
    seller_name: "Academic Treasures",
    seller_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "English Grammar Grade 5",
    description: "Comprehensive grammar guide covering parts of speech, sentence structure, and punctuation",
    price: 26.99,
    image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop",
    category_id: 1,
    seller_id: 1,
    created_at: "2023-01-05T00:00:00.000Z",
    updated_at: "2023-01-05T00:00:00.000Z",
    author: "Jennifer Lewis",
    year: "2021",
    condition: "Good",
    seller_name: "BookWorm Learning",
    seller_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Art & Creativity Grade 6",
    description: "Explore various art forms with step-by-step instructions and art history",
    price: 34.99,
    image_url: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=2070&auto=format&fit=crop",
    category_id: 1,
    seller_id: 3,
    created_at: "2023-01-06T00:00:00.000Z",
    updated_at: "2023-01-06T00:00:00.000Z",
    author: "Maria Garcia",
    year: "2022",
    condition: "Excellent",
    seller_name: "EduBooks Plus",
    seller_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop"
  },
  
  // High School Books
  {
    id: 7,
    name: "Algebra I",
    description: "Comprehensive guide to algebraic concepts including equations, inequalities, and functions",
    price: 42.99,
    image_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop",
    category_id: 2,
    seller_id: 1,
    created_at: "2023-01-07T00:00:00.000Z",
    updated_at: "2023-01-07T00:00:00.000Z",
    author: "Robert Chen, PhD",
    year: "2020",
    condition: "Good",
    seller_name: "BookWorm Learning",
    seller_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "World Literature Grade 9",
    description: "Collection of classic literature works from around the world with analysis guides",
    price: 39.99,
    image_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2070&auto=format&fit=crop",
    category_id: 2,
    seller_id: 2,
    created_at: "2023-01-08T00:00:00.000Z",
    updated_at: "2023-01-08T00:00:00.000Z",
    author: "Elizabeth Wright",
    year: "2021",
    condition: "Like New",
    seller_name: "Academic Treasures",
    seller_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "Biology: Life Science",
    description: "Explore cells, genetics, evolution, and ecosystems with detailed diagrams and experiments",
    price: 54.99,
    image_url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2087&auto=format&fit=crop",
    category_id: 2,
    seller_id: 3,
    created_at: "2023-01-09T00:00:00.000Z",
    updated_at: "2023-01-09T00:00:00.000Z",
    author: "Dr. James Lee",
    year: "2022",
    condition: "Excellent",
    seller_name: "EduBooks Plus",
    seller_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop"
  },
  {
    id: 10,
    name: "U.S. History: The Modern Era",
    description: "Comprehensive history textbook covering American history from Reconstruction to present day",
    price: 49.99,
    image_url: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=2069&auto=format&fit=crop",
    category_id: 2,
    seller_id: 1,
    created_at: "2023-01-10T00:00:00.000Z",
    updated_at: "2023-01-10T00:00:00.000Z",
    author: "Thomas Anderson",
    year: "2021",
    condition: "Good",
    seller_name: "BookWorm Learning",
    seller_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 11,
    name: "Chemistry Principles and Applications",
    description: "Study of matter, atomic structure, chemical bonds, and reactions with laboratory exercises",
    price: 58.99,
    image_url: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=2070&auto=format&fit=crop",
    category_id: 2,
    seller_id: 2,
    created_at: "2023-01-11T00:00:00.000Z",
    updated_at: "2023-01-11T00:00:00.000Z",
    author: "Dr. Michelle Park",
    year: "2020",
    condition: "Like New",
    seller_name: "Academic Treasures",
    seller_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop"
  },
  {
    id: 12,
    name: "Geometry: Shapes and Proofs",
    description: "Textbook covering points, lines, planes, and solid figures with theorems and proofs",
    price: 46.99,
    image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    category_id: 2,
    seller_id: 3,
    created_at: "2023-01-12T00:00:00.000Z",
    updated_at: "2023-01-12T00:00:00.000Z",
    author: "William Peterson",
    year: "2021",
    condition: "Good",
    seller_name: "EduBooks Plus",
    seller_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop"
  },
  
  // University Books
  {
    id: 13,
    name: "Calculus: Early Transcendentals",
    description: "Comprehensive calculus textbook covering limits, derivatives, integrals, and applications",
    price: 129.99,
    image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    category_id: 3,
    seller_id: 1,
    created_at: "2023-01-13T00:00:00.000Z",
    updated_at: "2023-01-13T00:00:00.000Z",
    author: "James Stewart",
    year: "2019",
    condition: "Good",
    seller_name: "BookWorm Learning",
    seller_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 14,
    name: "Introduction to Psychology",
    description: "Foundational concepts in psychology including cognitive processes, development, and social behavior",
    price: 89.99,
    image_url: "https://images.unsplash.com/photo-1576094848486-dbd3d452f158?q=80&w=2000&auto=format&fit=crop",
    category_id: 3,
    seller_id: 2,
    created_at: "2023-01-14T00:00:00.000Z",
    updated_at: "2023-01-14T00:00:00.000Z",
    author: "David G. Myers",
    year: "2020",
    condition: "Like New",
    seller_name: "Academic Treasures",
    seller_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop"
  },
  {
    id: 15,
    name: "Principles of Microeconomics",
    description: "Study of economic behavior at the individual consumer, firm, and industry level",
    price: 95.99,
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    category_id: 3,
    seller_id: 3,
    created_at: "2023-01-15T00:00:00.000Z",
    updated_at: "2023-01-15T00:00:00.000Z",
    author: "N. Gregory Mankiw",
    year: "2021",
    condition: "Excellent",
    seller_name: "EduBooks Plus",
    seller_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop"
  },
  {
    id: 16,
    name: "Organic Chemistry",
    description: "Comprehensive study of carbon compounds, reactions, and laboratory techniques",
    price: 134.99,
    image_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop",
    category_id: 3,
    seller_id: 1,
    created_at: "2023-01-16T00:00:00.000Z",
    updated_at: "2023-01-16T00:00:00.000Z",
    author: "Paula Y. Bruice",
    year: "2020",
    condition: "Good",
    seller_name: "BookWorm Learning",
    seller_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 17,
    name: "Introduction to Computer Science",
    description: "Fundamentals of programming, algorithms, data structures, and computing systems",
    price: 109.99,
    image_url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop",
    category_id: 3,
    seller_id: 2,
    created_at: "2023-01-17T00:00:00.000Z",
    updated_at: "2023-01-17T00:00:00.000Z",
    author: "Robert Sedgewick",
    year: "2021",
    condition: "Like New",
    seller_name: "Academic Treasures",
    seller_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop"
  },
  {
    id: 18,
    name: "Engineering Mechanics: Statics",
    description: "Analysis of forces acting on physical systems in static equilibrium",
    price: 124.99,
    image_url: "https://images.unsplash.com/photo-1576153192621-7a3be10b356e?q=80&w=1974&auto=format&fit=crop",
    category_id: 3,
    seller_id: 3,
    created_at: "2023-01-18T00:00:00.000Z",
    updated_at: "2023-01-18T00:00:00.000Z",
    author: "Russell C. Hibbeler",
    year: "2019",
    condition: "Good",
    seller_name: "EduBooks Plus",
    seller_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop"
  },
  {
    id: 19,
    name: "Molecular Biology of the Cell",
    description: "Comprehensive textbook on cellular functions, genetics, and molecular mechanisms",
    price: 149.99,
    image_url: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?q=80&w=2025&auto=format&fit=crop",
    category_id: 3,
    seller_id: 1,
    created_at: "2023-01-19T00:00:00.000Z",
    updated_at: "2023-01-19T00:00:00.000Z",
    author: "Bruce Alberts et al.",
    year: "2020",
    condition: "Excellent",
    seller_name: "BookWorm Learning",
    seller_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 20,
    name: "Fundamentals of Nursing",
    description: "Core principles and practices of nursing care with clinical guidelines",
    price: 119.99,
    image_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop",
    category_id: 3,
    seller_id: 2,
    created_at: "2023-01-20T00:00:00.000Z",
    updated_at: "2023-01-20T00:00:00.000Z",
    author: "Patricia A. Potter",
    year: "2021",
    condition: "Like New",
    seller_name: "Academic Treasures",
    seller_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop"
  },
  {
    id: 21,
    name: "English Unlimited A1",
    description: "This book is an English book for the first year students of Secondary school. Through universally inspiring topics and activities, and with a special focus on the learning needs of Arabic speakers, this truly international course helps learners become more sensitive, more effective communicators. Teaching natural, dependable language and using authentic audio from the start, it not only brings real life into the classroom, but gives learners the skills, strategies and confidence they need to communicate confidently outside it.",
    price: 0.00,
    image_url: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=2069&auto=format&fit=crop",
    category_id: 2,
    seller_id: 1,
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-01T00:00:00.000Z",
    author: "Adrian Doff",
    year: "2003",
    condition: "Good",
    seller_name: "Jane Doe",
    seller_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop",
    multiple_images: [
      "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
    ]
  }
];
  
  export const mockUser = {
    id: 1,
    full_name: "Test User",
    username: "testuser101",
    email: "user@gmail.com",
    phone_number: "123-456-7890",
    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
    bio: 'Book enthusiast and education advocate. I believe in the power of reading to transform lives and expand horizons. Currently building my collection of textbooks across all educational levels.',
    location: 'Boston, MA',
    interests: 'Reading, Education, Science, Mathematics, Literature'
  };
  
  // Optional: Add purchase history if you want to keep that feature
  export const mockPurchaseHistory = [
    { id: 1, name: 'Math Basics Grade 3', date: '2024-02-15' },
    { id: 9, name: 'Biology: Life Science', date: '2024-01-30' },
    { id: 13, name: 'Calculus: Early Transcendentals', date: '2023-12-12' }
  ];
  
  // Mock sellers (publishers)
  export const mockSellers = [
    {
      id: 1,
      name: "Academia Publishing",
      description: "Leading educational publisher since 1985"
    },
    {
      id: 2,
      name: "Scholastic Learning",
      description: "Specialized in K-12 educational materials"
    },
    {
      id: 3,
      name: "University Press",
      description: "Publisher of high-quality academic textbooks"
    }
  ];