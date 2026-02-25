export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export const ASSESSMENT_QUESTIONS: Record<number, Question[]> = {
  1: [ // Python Basics
    { id: 1, question: "What is the output of print(2 ** 3)?", options: ["6", "8", "9", "12"], correct: 1 },
    { id: 2, question: "Which keyword is used to define a function in Python?", options: ["func", "def", "function", "define"], correct: 1 },
    { id: 3, question: "What data type is the object below? L = [1, 23, 'hello', 1]", options: ["List", "Dictionary", "Tuple", "Array"], correct: 0 },
    { id: 4, question: "How do you insert COMMENTS in Python code?", options: ["/* This is a comment */", "// This is a comment", "# This is a comment", "<!-- This is a comment -->"], correct: 2 },
    { id: 5, question: "Which method can be used to return a string in upper case letters?", options: ["upperCase()", "uppercase()", "upper()", "toUpper()"], correct: 2 }
  ],
  2: [ // React Fundamentals
    { id: 1, question: "What is the correct command to create a new React project?", options: ["npm create-react-app my-app", "npx create-react-app my-app", "npm create-react-app", "npx create-new-react-app"], correct: 1 },
    { id: 2, question: "Which hook is used to handle side effects in functional components?", options: ["useState", "useEffect", "useContext", "useReducer"], correct: 1 },
    { id: 3, question: "What is the default port for the webpack development server?", options: ["3000", "8080", "3306", "5000"], correct: 0 },
    { id: 4, question: "How do you pass data to a child component?", options: ["State", "Props", "Context", "Redux"], correct: 1 },
    { id: 5, question: "What is JSX?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"], correct: 0 }
  ],
  3: [ // Node.js & Express
    { id: 1, question: "Which core module is used for file operations in Node.js?", options: ["fs", "http", "path", "os"], correct: 0 },
    { id: 2, question: "What does 'npm' stand for?", options: ["Node Project Manager", "Node Package Manager", "New Project Manager", "Node Program Manager"], correct: 1 },
    { id: 3, question: "Which framework is commonly used with Node.js for building web APIs?", options: ["Django", "Flask", "Express", "Spring"], correct: 2 },
    { id: 4, question: "How do you import a module in Node.js (CommonJS)?", options: ["import module from 'module'", "require('module')", "include 'module'", "using module"], correct: 1 },
    { id: 5, question: "Which event is emitted when an unhandled exception occurs?", options: ["error", "exception", "uncaughtException", "fail"], correct: 2 }
  ],
  4: [ // JavaScript Advanced
    { id: 1, question: "What is a closure?", options: ["A function inside another function that has access to the outer function's variables", "A function that is closed for modification", "A method to close a browser window", "A variable that cannot be changed"], correct: 0 },
    { id: 2, question: "What is the output of '2' + 2?", options: ["4", "22", "NaN", "Error"], correct: 1 },
    { id: 3, question: "Which keyword is used to declare a variable that cannot be reassigned?", options: ["var", "let", "const", "static"], correct: 2 },
    { id: 4, question: "What does 'this' refer to in an arrow function?", options: ["The global object", "The function itself", "The object that invoked it", "The lexically enclosing context"], correct: 3 },
    { id: 5, question: "What is a Promise in JavaScript?", options: ["A guarantee that code will run", "An object representing the eventual completion or failure of an asynchronous operation", "A function that runs immediately", "A strict mode feature"], correct: 1 }
  ],
  5: [ // CSS Grid & Flexbox
    { id: 1, question: "Which property is used to define a flex container?", options: ["display: grid", "display: flex", "display: block", "position: absolute"], correct: 1 },
    { id: 2, question: "How do you center an item horizontally and vertically in Flexbox?", options: ["justify-content: center; align-items: center;", "text-align: center; vertical-align: middle;", "margin: auto;", "position: center;"], correct: 0 },
    { id: 3, question: "Which property controls the direction of flex items?", options: ["flex-flow", "flex-direction", "flex-wrap", "justify-content"], correct: 1 },
    { id: 4, question: "What is the gap property used for?", options: ["Adding space between grid/flex items", "Adding padding to the container", "Adding margin to the body", "Creating a gap in the border"], correct: 0 },
    { id: 5, question: "Which value of 'display' turns an element into a grid container?", options: ["flex", "block", "grid", "inline-grid"], correct: 2 }
  ],
  6: [ // SQL Fundamentals
    { id: 1, question: "Which SQL statement is used to extract data from a database?", options: ["GET", "OPEN", "SELECT", "EXTRACT"], correct: 2 },
    { id: 2, question: "Which SQL clause is used to filter records?", options: ["WHERE", "FILTER", "HAVING", "GROUP BY"], correct: 0 },
    { id: 3, question: "Which keyword is used to sort the result-set?", options: ["ORDER BY", "SORT BY", "GROUP BY", "ALIGN"], correct: 0 },
    { id: 4, question: "How do you insert a new record into the 'Users' table?", options: ["ADD INTO Users...", "INSERT INTO Users...", "UPDATE Users...", "CREATE Users..."], correct: 1 },
    { id: 5, question: "What does SQL stand for?", options: ["Structured Question Language", "Structured Query Language", "Strong Question Language", "Structured Query List"], correct: 1 }
  ],
  7: [ // Communication 101
    { id: 1, question: "What is active listening?", options: ["Listening while doing something else", "Fully concentrating on what is being said rather than just hearing the message", "Listening only to the important parts", "Interrupting to ask questions"], correct: 1 },
    { id: 2, question: "Which of these is a form of non-verbal communication?", options: ["Email", "Phone call", "Body language", "Text message"], correct: 2 },
    { id: 3, question: "When giving feedback, it is best to be:", options: ["Vague and general", "Specific and constructive", "Harsh and critical", "Silent"], correct: 1 },
    { id: 4, question: "What is the 7-38-55 rule?", options: ["A rule for time management", "A rule about communication elements (Words, Tone, Body Language)", "A rule for salary negotiation", "A rule for team size"], correct: 1 },
    { id: 5, question: "Which is a barrier to effective communication?", options: ["Clarity", "Active listening", "Noise/Distractions", "Feedback"], correct: 2 }
  ],
  8: [ // Teamwork & Collaboration
    { id: 1, question: "What is a key benefit of teamwork?", options: ["More arguments", "Slower decision making", "Diverse perspectives and ideas", "Less work for everyone"], correct: 2 },
    { id: 2, question: "What is the best way to handle conflict in a team?", options: ["Ignore it", "Address it openly and respectfully", "Complain to the manager", "Quit the team"], correct: 1 },
    { id: 3, question: "What does 'psychological safety' mean in a team?", options: ["Safety from physical harm", "Feeling safe to take risks and be vulnerable without fear of punishment", "Mental health benefits", "Security clearance"], correct: 1 },
    { id: 4, question: "Which tool is commonly used for team collaboration?", options: ["Notepad", "Slack/Teams", "Calculator", "Paint"], correct: 1 },
    { id: 5, question: "What is a 'stand-up' meeting?", options: ["A meeting where everyone must stand", "A short daily update meeting", "A comedy show", "A meeting about posture"], correct: 1 }
  ],
  9: [ // Problem Solving
    { id: 1, question: "What is the first step in the problem-solving process?", options: ["Implement a solution", "Define the problem", "Brainstorm ideas", "Evaluate results"], correct: 1 },
    { id: 2, question: "What is 'Root Cause Analysis'?", options: ["Finding the person to blame", "Identifying the underlying cause of a problem", "Analyzing tree roots", "Solving math problems"], correct: 1 },
    { id: 3, question: "What is the '5 Whys' technique used for?", options: ["Asking questions until someone gets annoyed", "Drilling down to the root cause of a problem", "Interviewing candidates", "Teaching children"], correct: 1 },
    { id: 4, question: "Which mindset helps in problem solving?", options: ["Fixed mindset", "Growth mindset", "Negative mindset", "Closed mindset"], correct: 1 },
    { id: 5, question: "What should you do after implementing a solution?", options: ["Forget about it", "Monitor and evaluate the results", "Create a new problem", "Celebrate immediately"], correct: 1 }
  ]
};

export interface TestMetadata {
  id: number;
  title: string;
  category: string;
  duration: string;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  color: string;
}

export const TESTS_METADATA: TestMetadata[] = [
  {
    id: 1,
    title: 'Python Basics',
    category: 'Technical',
    duration: '30 mins',
    questions: 20,
    difficulty: 'Easy',
    color: 'blue'
  },
  {
    id: 2,
    title: 'React Fundamentals',
    category: 'Technical',
    duration: '45 mins',
    questions: 30,
    difficulty: 'Medium',
    color: 'sky'
  },
  {
    id: 3,
    title: 'Node.js & Express',
    category: 'Technical',
    duration: '60 mins',
    questions: 40,
    difficulty: 'Hard',
    color: 'emerald'
  },
  {
    id: 4,
    title: 'JavaScript Advanced',
    category: 'Technical',
    duration: '50 mins',
    questions: 35,
    difficulty: 'Hard',
    color: 'yellow'
  },
  {
    id: 5,
    title: 'CSS Grid & Flexbox',
    category: 'Technical',
    duration: '30 mins',
    questions: 25,
    difficulty: 'Medium',
    color: 'pink'
  },
  {
    id: 6,
    title: 'SQL Fundamentals',
    category: 'Technical',
    duration: '40 mins',
    questions: 25,
    difficulty: 'Medium',
    color: 'orange'
  },
  {
    id: 7,
    title: 'Communication 101',
    category: 'Soft Skills',
    duration: '20 mins',
    questions: 15,
    difficulty: 'Easy',
    color: 'indigo'
  },
  {
    id: 8,
    title: 'Teamwork & Collaboration',
    category: 'Soft Skills',
    duration: '25 mins',
    questions: 20,
    difficulty: 'Medium',
    color: 'teal'
  },
  {
    id: 9,
    title: 'Problem Solving',
    category: 'Soft Skills',
    duration: '45 mins',
    questions: 10,
    difficulty: 'Hard',
    color: 'red'
  }
];
