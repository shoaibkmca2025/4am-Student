import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Assessment questions data from data/assessments.ts
const assessmentData = [
  {
    title: 'Python Basics',
    category: 'Technical',
    duration: 30,
    difficulty: 'Easy',
    questions: [
      { question: 'What is the output of print(2 ** 3)?', options: ['6', '8', '9', '12'], correctIndex: 1 },
      { question: 'Which keyword is used to define a function in Python?', options: ['func', 'def', 'function', 'define'], correctIndex: 1 },
      { question: 'What data type is the object below? L = [1, 23, \'hello\', 1]', options: ['List', 'Dictionary', 'Tuple', 'Array'], correctIndex: 0 },
      { question: 'How do you insert COMMENTS in Python code?', options: ['/* This is a comment */', '// This is a comment', '# This is a comment', '<!-- This is a comment -->'], correctIndex: 2 },
      { question: 'Which method can be used to return a string in upper case letters?', options: ['upperCase()', 'uppercase()', 'upper()', 'toUpper()'], correctIndex: 2 },
    ],
  },
  {
    title: 'React Fundamentals',
    category: 'Technical',
    duration: 45,
    difficulty: 'Medium',
    questions: [
      { question: 'What is the correct command to create a new React project?', options: ['npm create-react-app my-app', 'npx create-react-app my-app', 'npm create-react-app', 'npx create-new-react-app'], correctIndex: 1 },
      { question: 'Which hook is used to handle side effects in functional components?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correctIndex: 1 },
      { question: 'What is the default port for the webpack development server?', options: ['3000', '8080', '3306', '5000'], correctIndex: 0 },
      { question: 'How do you pass data to a child component?', options: ['State', 'Props', 'Context', 'Redux'], correctIndex: 1 },
      { question: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'], correctIndex: 0 },
    ],
  },
  {
    title: 'Node.js & Express',
    category: 'Technical',
    duration: 60,
    difficulty: 'Hard',
    questions: [
      { question: 'Which core module is used for file operations in Node.js?', options: ['fs', 'http', 'path', 'os'], correctIndex: 0 },
      { question: "What does 'npm' stand for?", options: ['Node Project Manager', 'Node Package Manager', 'New Project Manager', 'Node Program Manager'], correctIndex: 1 },
      { question: 'Which framework is commonly used with Node.js for building web APIs?', options: ['Django', 'Flask', 'Express', 'Spring'], correctIndex: 2 },
      { question: "How do you import a module in Node.js (CommonJS)?", options: ["import module from 'module'", "require('module')", "include 'module'", 'using module'], correctIndex: 1 },
      { question: 'Which event is emitted when an unhandled exception occurs?', options: ['error', 'exception', 'uncaughtException', 'fail'], correctIndex: 2 },
    ],
  },
  {
    title: 'JavaScript Advanced',
    category: 'Technical',
    duration: 50,
    difficulty: 'Hard',
    questions: [
      { question: 'What is a closure?', options: ["A function inside another function that has access to the outer function's variables", 'A function that is closed for modification', 'A method to close a browser window', 'A variable that cannot be changed'], correctIndex: 0 },
      { question: "What is the output of '2' + 2?", options: ['4', '22', 'NaN', 'Error'], correctIndex: 1 },
      { question: 'Which keyword is used to declare a variable that cannot be reassigned?', options: ['var', 'let', 'const', 'static'], correctIndex: 2 },
      { question: "What does 'this' refer to in an arrow function?", options: ['The global object', 'The function itself', 'The object that invoked it', 'The lexically enclosing context'], correctIndex: 3 },
      { question: 'What is a Promise in JavaScript?', options: ['A guarantee that code will run', 'An object representing the eventual completion or failure of an asynchronous operation', 'A function that runs immediately', 'A strict mode feature'], correctIndex: 1 },
    ],
  },
  {
    title: 'CSS Grid & Flexbox',
    category: 'Technical',
    duration: 30,
    difficulty: 'Medium',
    questions: [
      { question: 'Which property is used to define a flex container?', options: ['display: grid', 'display: flex', 'display: block', 'position: absolute'], correctIndex: 1 },
      { question: 'How do you center an item horizontally and vertically in Flexbox?', options: ['justify-content: center; align-items: center;', 'text-align: center; vertical-align: middle;', 'margin: auto;', 'position: center;'], correctIndex: 0 },
      { question: 'Which property controls the direction of flex items?', options: ['flex-flow', 'flex-direction', 'flex-wrap', 'justify-content'], correctIndex: 1 },
      { question: 'What is the gap property used for?', options: ['Adding space between grid/flex items', 'Adding padding to the container', 'Adding margin to the body', 'Creating a gap in the border'], correctIndex: 0 },
      { question: "Which value of 'display' turns an element into a grid container?", options: ['flex', 'block', 'grid', 'inline-grid'], correctIndex: 2 },
    ],
  },
  {
    title: 'SQL Fundamentals',
    category: 'Technical',
    duration: 40,
    difficulty: 'Medium',
    questions: [
      { question: 'Which SQL statement is used to extract data from a database?', options: ['GET', 'OPEN', 'SELECT', 'EXTRACT'], correctIndex: 2 },
      { question: 'Which SQL clause is used to filter records?', options: ['WHERE', 'FILTER', 'HAVING', 'GROUP BY'], correctIndex: 0 },
      { question: 'Which keyword is used to sort the result-set?', options: ['ORDER BY', 'SORT BY', 'GROUP BY', 'ALIGN'], correctIndex: 0 },
      { question: "How do you insert a new record into the 'Users' table?", options: ['ADD INTO Users...', 'INSERT INTO Users...', 'UPDATE Users...', 'CREATE Users...'], correctIndex: 1 },
      { question: 'What does SQL stand for?', options: ['Structured Question Language', 'Structured Query Language', 'Strong Question Language', 'Structured Query List'], correctIndex: 1 },
    ],
  },
  {
    title: 'Communication 101',
    category: 'Soft Skills',
    duration: 20,
    difficulty: 'Easy',
    questions: [
      { question: 'What is active listening?', options: ['Listening while doing something else', 'Fully concentrating on what is being said rather than just hearing the message', 'Listening only to the important parts', 'Interrupting to ask questions'], correctIndex: 1 },
      { question: 'Which of these is a form of non-verbal communication?', options: ['Email', 'Phone call', 'Body language', 'Text message'], correctIndex: 2 },
      { question: 'When giving feedback, it is best to be:', options: ['Vague and general', 'Specific and constructive', 'Harsh and critical', 'Silent'], correctIndex: 1 },
      { question: 'What is the 7-38-55 rule?', options: ['A rule for time management', 'A rule about communication elements (Words, Tone, Body Language)', 'A rule for salary negotiation', 'A rule for team size'], correctIndex: 1 },
      { question: 'Which is a barrier to effective communication?', options: ['Clarity', 'Active listening', 'Noise/Distractions', 'Feedback'], correctIndex: 2 },
    ],
  },
  {
    title: 'Teamwork & Collaboration',
    category: 'Soft Skills',
    duration: 25,
    difficulty: 'Medium',
    questions: [
      { question: 'What is a key benefit of teamwork?', options: ['More arguments', 'Slower decision making', 'Diverse perspectives and ideas', 'Less work for everyone'], correctIndex: 2 },
      { question: 'What is the best way to handle conflict in a team?', options: ['Ignore it', 'Address it openly and respectfully', 'Complain to the manager', 'Quit the team'], correctIndex: 1 },
      { question: "What does 'psychological safety' mean in a team?", options: ['Safety from physical harm', 'Feeling safe to take risks and be vulnerable without fear of punishment', 'Mental health benefits', 'Security clearance'], correctIndex: 1 },
      { question: 'Which tool is commonly used for team collaboration?', options: ['Notepad', 'Slack/Teams', 'Calculator', 'Paint'], correctIndex: 1 },
      { question: "What is a 'stand-up' meeting?", options: ['A meeting where everyone must stand', 'A short daily update meeting', 'A comedy show', 'A meeting about posture'], correctIndex: 1 },
    ],
  },
  {
    title: 'Problem Solving',
    category: 'Soft Skills',
    duration: 45,
    difficulty: 'Hard',
    questions: [
      { question: 'What is the first step in the problem-solving process?', options: ['Implement a solution', 'Define the problem', 'Brainstorm ideas', 'Evaluate results'], correctIndex: 1 },
      { question: "What is 'Root Cause Analysis'?", options: ['Finding the person to blame', 'Identifying the underlying cause of a problem', 'Analyzing tree roots', 'Solving math problems'], correctIndex: 1 },
      { question: "What is the '5 Whys' technique used for?", options: ['Asking questions until someone gets annoyed', 'Drilling down to the root cause of a problem', 'Interviewing candidates', 'Teaching children'], correctIndex: 1 },
      { question: 'Which mindset helps in problem solving?', options: ['Fixed mindset', 'Growth mindset', 'Negative mindset', 'Closed mindset'], correctIndex: 1 },
      { question: 'What should you do after implementing a solution?', options: ['Forget about it', 'Monitor and evaluate the results', 'Create a new problem', 'Celebrate immediately'], correctIndex: 1 },
    ],
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  for (const assessment of assessmentData) {
    const { questions, ...assessmentMeta } = assessment;

    const created = await prisma.assessment.create({
      data: {
        ...assessmentMeta,
        questions: {
          create: questions.map((q, index) => ({
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            order: index + 1,
          })),
        },
      },
    });

    console.log(`✅ Created assessment: ${created.title} (${created.id})`);
  }

  console.log('✅ Seed completed!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
