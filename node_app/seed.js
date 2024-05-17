const mongoose = require('mongoose')
const Course = require('./controllers/Course')


// Example data for two courses
const courseData = [
  {
    title: "Web Development Bootcamp",
    description: "A comprehensive course covering web development fundamentals.",
    price: 49.99,
    mentor: "John Doe",
    image: "https://www.codingninjas.com/blog/wp-content/uploads/2021/08/Blog-2-2.png",
    ratings: [4.5, 4.8, 4.2],
    feedbacks: [
      
    ],
    lectures: [
      { title: "Introduction to HTML", video: "https://youtu.be/Vi9bxu-M-ag?si=q_C21255NjbIp7CP", notes: "HTML basics", assignment: "" },
      { title: "CSS Styling Techniques", video: "https://youtu.be/6mbwJ2xhgzM?si=SrIi0h8tGmwOQMDZ", notes: "Advanced CSS concepts", assignment: "" }
    ]
  },
  {
    title: "Data Science Fundamentals",
    description: "Learn the basics of data science and machine learning.",
    price: 59.99,
    mentor: "Jane Smith",
    image: "https://m.media-amazon.com/images/I/51GVzaLnNUL.jpg",
    ratings: [4.0, 4.2, 4.5],
    feedbacks: [
          ],
    lectures: [
      { title: "Introduction to Python", video: "https://youtu.be/Vi9bxu-M-ag?si=q_C21255NjbIp7CP", notes: "Python basics", assignment: "" },
      { title: "Data Visualization with Matplotlib", video: "https://youtu.be/6mbwJ2xhgzM?si=SrIi0h8tGmwOQMDZ", notes: "Creating graphs and charts", assignment: "" }
    ]
  }
,
{
    title: "Mobile App Development",
    description: "Learn how to build mobile apps for iOS and Android platforms.",
    price: 79.99,
    mentor: "Michael Johnson",
    image: "https://riseuplabs.com/wp-content/uploads/2021/07/mobile-application-development-guidelines-riseuplabs.jpg",
    ratings: [4.5, 4.7, 4.8],
    feedbacks: [
      
    ],
    lectures: [
      { title: "Introduction to Mobile Development", video: "https://youtu.be/Vi9bxu-M-ag?si=q_C21255NjbIp7CP", notes: "Overview of mobile development", assignment: "" },
      { title: "Building UI with React Native", video: "https://youtu.be/6mbwJ2xhgzM?si=SrIi0h8tGmwOQMDZ", notes: "Creating user interfaces", assignment: "" }
    ]
  },
  {
    title: "Machine Learning Masterclass",
    description: "An advanced course covering machine learning algorithms and techniques.",
    price: 99.99,
    mentor: "Emily Rodriguez",
    image: "https://file-uploads.teachablecdn.com/6f47f740899d486f975d16532cfb1aa1/ddffa162290d42809f079eca68478050",
    ratings: [4.8, 4.9, 4.7],
    feedbacks: [
    ],
    lectures: [
      { title: "Regression Analysis", video: "https://youtu.be/Vi9bxu-M-ag?si=q_C21255NjbIp7CP", notes: "Linear and logistic regression", assignment: "" },
      { title: "Neural Networks and Deep Learning", video: "https://youtu.be/6mbwJ2xhgzM?si=SrIi0h8tGmwOQMDZ", notes: "Deep learning concepts", assignment: "" }
    ]
  },
  {
    title: "Graphic Design Fundamentals",
    description: "Discover the principles and techniques of graphic design.",
    price: 49.99,
    mentor: "Sophia Lee",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAQ_wIfHeylhQrXJkn8ZSB_VQPeWuM_5qqfH7xZfbq2Q&s",
    ratings: [4.2, 4.3, 4.0],
    feedbacks: [
      
    ],
    lectures: [
      { title: "Principles of Design", video: "https://youtu.be/Vi9bxu-M-ag?si=q_C21255NjbIp7CP", notes: "Fundamental principles of design", assignment: "" },
      { title: "Typography and Layout", video: "https://youtu.be/6mbwJ2xhgzM?si=SrIi0h8tGmwOQMDZ", notes: "Creating visually appealing layouts", assignment: "" }
    ]
  }

];

async function seed() {
  await Course.deleteMany({});
  await Course.insertMany(courseData);
  console.log('Db Inserted..');
}

mongoose.connect('mongodb://127.0.0.1:27017/test',)
  .then(async () => {
    console.log('Data seeding..');
    await Course.deleteMany({})
    seed()
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));



module.exports = seed;
