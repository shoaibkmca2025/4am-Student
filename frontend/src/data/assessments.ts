export interface Question {
  id: number;
  type?: 'multiple-choice' | 'code-challenge' | 'text-input';
  question: string;
  options?: string[];
  correct?: number;
  correctAnswer?: string;
  codeSnippet?: string;
  explanation?: string;
}

export const ASSESSMENT_QUESTIONS: Record<number, Question[]> = {
  1: [ // Python Basics (MCQ)
    { id: 1, type: 'multiple-choice', question: "What is the output of print(2 ** 3)?", options: ["6", "8", "9", "12"], correct: 1 },
    { id: 2, type: 'multiple-choice', question: "Which keyword is used to define a function in Python?", options: ["func", "def", "function", "define"], correct: 1 },
    { id: 3, type: 'multiple-choice', question: "What data type is the object below? L = [1, 23, 'hello', 1]", options: ["List", "Dictionary", "Tuple", "Array"], correct: 0 },
    { id: 4, type: 'multiple-choice', question: "How do you insert COMMENTS in Python code?", options: ["/* This is a comment */", "// This is a comment", "# This is a comment", "<!-- This is a comment -->"], correct: 2 },
    { id: 5, type: 'multiple-choice', question: "Which method can be used to return a string in upper case letters?", options: ["upperCase()", "uppercase()", "upper()", "toUpper()"], correct: 2 }
  ],
  2: [ // React Fundamentals (MCQ)
    { id: 1, type: 'multiple-choice', question: "What is the correct command to create a new React project?", options: ["npm create-react-app my-app", "npx create-react-app my-app", "npm create-react-app", "npx create-new-react-app"], correct: 1 },
    { id: 2, type: 'multiple-choice', question: "Which hook is used to handle side effects in functional components?", options: ["useState", "useEffect", "useContext", "useReducer"], correct: 1 },
    { id: 3, type: 'multiple-choice', question: "What is the default port for the webpack development server?", options: ["3000", "8080", "3306", "5000"], correct: 0 },
    { id: 4, type: 'multiple-choice', question: "How do you pass data to a child component?", options: ["State", "Props", "Context", "Redux"], correct: 1 },
    { id: 5, type: 'multiple-choice', question: "What is JSX?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"], correct: 0 }
  ],
  3: [ // Node.js & Express (MCQ)
    { id: 1, type: 'multiple-choice', question: "Which core module is used for file operations in Node.js?", options: ["fs", "http", "path", "os"], correct: 0 },
    { id: 2, type: 'multiple-choice', question: "What does 'npm' stand for?", options: ["Node Project Manager", "Node Package Manager", "New Project Manager", "Node Program Manager"], correct: 1 },
    { id: 3, type: 'multiple-choice', question: "Which framework is commonly used with Node.js for building web APIs?", options: ["Django", "Flask", "Express", "Spring"], correct: 2 },
    { id: 4, type: 'multiple-choice', question: "How do you import a module in Node.js (CommonJS)?", options: ["import module from 'module'", "require('module')", "include 'module'", "using module"], correct: 1 },
    { id: 5, type: 'multiple-choice', question: "Which event is emitted when an unhandled exception occurs?", options: ["error", "exception", "uncaughtException", "fail"], correct: 2 }
  ],
  4: [ // JavaScript Advanced (MCQ)
    { id: 1, type: 'multiple-choice', question: "What is a closure?", options: ["A function inside another function that has access to the outer function's variables", "A function that is closed for modification", "A method to close a browser window", "A variable that cannot be changed"], correct: 0 },
    { id: 2, type: 'multiple-choice', question: "What is the output of '2' + 2?", options: ["4", "22", "NaN", "Error"], correct: 1 },
    { id: 3, type: 'multiple-choice', question: "Which keyword is used to declare a variable that cannot be reassigned?", options: ["var", "let", "const", "static"], correct: 2 },
    { id: 4, type: 'multiple-choice', question: "What does 'this' refer to in an arrow function?", options: ["The global object", "The function itself", "The object that invoked it", "The lexically enclosing context"], correct: 3 },
    { id: 5, type: 'multiple-choice', question: "What is a Promise in JavaScript?", options: ["A guarantee that code will run", "An object representing the eventual completion or failure of an asynchronous operation", "A function that runs immediately", "A strict mode feature"], correct: 1 }
  ],
  5: [ // CSS Grid & Flexbox (MCQ)
    { id: 1, type: 'multiple-choice', question: "Which property is used to define a flex container?", options: ["display: grid", "display: flex", "display: block", "position: absolute"], correct: 1 },
    { id: 2, type: 'multiple-choice', question: "How do you center an item horizontally and vertically in Flexbox?", options: ["justify-content: center; align-items: center;", "text-align: center; vertical-align: middle;", "margin: auto;", "position: center;"], correct: 0 },
    { id: 3, type: 'multiple-choice', question: "Which property controls the direction of flex items?", options: ["flex-flow", "flex-direction", "flex-wrap", "justify-content"], correct: 1 },
    { id: 4, type: 'multiple-choice', question: "What is the gap property used for?", options: ["Adding space between grid/flex items", "Adding padding to the container", "Adding margin to the body", "Creating a gap in the border"], correct: 0 },
    { id: 5, type: 'multiple-choice', question: "Which value of 'display' turns an element into a grid container?", options: ["flex", "block", "grid", "inline-grid"], correct: 2 }
  ],
  6: [ // SQL Fundamentals (MCQ)
    { id: 1, type: 'multiple-choice', question: "Which SQL statement is used to extract data from a database?", options: ["GET", "OPEN", "SELECT", "EXTRACT"], correct: 2 },
    { id: 2, type: 'multiple-choice', question: "Which SQL clause is used to filter records?", options: ["WHERE", "FILTER", "HAVING", "GROUP BY"], correct: 0 },
    { id: 3, type: 'multiple-choice', question: "Which keyword is used to sort the result-set?", options: ["ORDER BY", "SORT BY", "GROUP BY", "ALIGN"], correct: 0 },
    { id: 4, type: 'multiple-choice', question: "How do you insert a new record into the 'Users' table?", options: ["ADD INTO Users...", "INSERT INTO Users...", "UPDATE Users...", "CREATE Users..."], correct: 1 },
    { id: 5, type: 'multiple-choice', question: "What does SQL stand for?", options: ["Structured Question Language", "Structured Query Language", "Strong Question Language", "Structured Query List"], correct: 1 }
  ],
  7: [ // Communication 101 (MCQ)
    { id: 1, type: 'multiple-choice', question: "What is active listening?", options: ["Listening while doing something else", "Fully concentrating on what is being said rather than just hearing the message", "Listening only to the important parts", "Interrupting to ask questions"], correct: 1 },
    { id: 2, type: 'multiple-choice', question: "Which of these is a form of non-verbal communication?", options: ["Email", "Phone call", "Body language", "Text message"], correct: 2 },
    { id: 3, type: 'multiple-choice', question: "When giving feedback, it is best to be:", options: ["Vague and general", "Specific and constructive", "Harsh and critical", "Silent"], correct: 1 },
    { id: 4, type: 'multiple-choice', question: "What is the 7-38-55 rule?", options: ["A rule for time management", "A rule about communication elements (Words, Tone, Body Language)", "A rule for salary negotiation", "A rule for team size"], correct: 1 },
    { id: 5, type: 'multiple-choice', question: "Which is a barrier to effective communication?", options: ["Clarity", "Active listening", "Noise/Distractions", "Feedback"], correct: 2 }
  ],
  8: [ // Teamwork & Collaboration (MCQ)
    { id: 1, type: 'multiple-choice', question: "What is a key benefit of teamwork?", options: ["More arguments", "Slower decision making", "Diverse perspectives and ideas", "Less work for everyone"], correct: 2 },
    { id: 2, type: 'multiple-choice', question: "What is the best way to handle conflict in a team?", options: ["Ignore it", "Address it openly and respectfully", "Complain to the manager", "Quit the team"], correct: 1 },
    { id: 3, type: 'multiple-choice', question: "What does 'psychological safety' mean in a team?", options: ["Safety from physical harm", "Feeling safe to take risks and be vulnerable without fear of punishment", "Mental health benefits", "Security clearance"], correct: 1 },
    { id: 4, type: 'multiple-choice', question: "Which tool is commonly used for team collaboration?", options: ["Notepad", "Slack/Teams", "Calculator", "Paint"], correct: 1 },
    { id: 5, type: 'multiple-choice', question: "What is a 'stand-up' meeting?", options: ["A meeting where everyone must stand", "A short daily update meeting", "A comedy show", "A meeting about posture"], correct: 1 }
  ],
  9: [ // Problem Solving (MCQ)
    { id: 1, type: 'multiple-choice', question: "What is the first step in the problem-solving process?", options: ["Implement a solution", "Define the problem", "Brainstorm ideas", "Evaluate results"], correct: 1 },
    { id: 2, type: 'multiple-choice', question: "What is 'Root Cause Analysis'?", options: ["Finding the person to blame", "Identifying the underlying cause of a problem", "Analyzing tree roots", "Solving math problems"], correct: 1 },
    { id: 3, type: 'multiple-choice', question: "What is the '5 Whys' technique used for?", options: ["Asking questions until someone gets annoyed", "Drilling down to the root cause of a problem", "Interviewing candidates", "Teaching children"], correct: 1 },
    { id: 4, type: 'multiple-choice', question: "Which mindset helps in problem solving?", options: ["Fixed mindset", "Growth mindset", "Negative mindset", "Closed mindset"], correct: 1 },
    { id: 5, type: 'multiple-choice', question: "What should you do after implementing a solution?", options: ["Forget about it", "Monitor and evaluate the results", "Create a new problem", "Celebrate immediately"], correct: 1 }
  ],
  10: [ // Coding Challenge: JavaScript Algorithms
    { 
      id: 1, 
      type: 'code-challenge', 
      question: "Write a function that checks if a string is a palindrome.",
      codeSnippet: "function isPalindrome(str) {\n  // Your code here\n  return false;\n}",
      explanation: "A palindrome reads the same forwards and backwards. Example: 'racecar'."
    },
    { 
      id: 2, 
      type: 'code-challenge', 
      question: "Write a function to return the nth Fibonacci number.",
      codeSnippet: "function fibonacci(n) {\n  // Your code here\n  return 0;\n}",
      explanation: "The Fibonacci sequence starts with 0 and 1, and the next number is the sum of the previous two."
    },
    {
      id: 3,
      type: 'code-challenge',
      question: "Write a function to reverse a string without using built-in reverse() method.",
      codeSnippet: "function reverseString(str) {\n  // Your code here\n  return '';\n}",
      explanation: "Iterate through the string from end to start or use recursion."
    }
  ],
  11: [ // System Design (Text Input)
    {
      id: 1,
      type: 'text-input',
      question: "Describe how you would design a URL shortening service like Bit.ly.",
      correctAnswer: "Key points: Unique ID generation (Base62), Database schema (long_url, short_code), Redirect mechanism (301/302), Scalability (Caching, Load Balancing).",
      explanation: "Focus on high availability and low latency read operations."
    },
    {
      id: 2,
      type: 'text-input',
      question: "How would you handle user authentication in a distributed system?",
      correctAnswer: "JWT (Stateless) vs Sessions (Stateful). OAuth2/OIDC for third-party login. Secure storage of tokens.",
      explanation: "Discuss trade-offs between stateless and stateful auth."
    }
  ],
  12: [ // Git & Version Control (MCQ)
    { id: 1, type: 'multiple-choice', question: "Which command is used to stage changes in Git?", options: ["git commit", "git push", "git add", "git stage"], correct: 2 },
    { id: 2, type: 'multiple-choice', question: "What does 'git pull' do?", options: ["Uploads changes to remote", "Fetches and merges changes from remote", "Creates a new branch", "Deletes a branch"], correct: 1 },
    { id: 3, type: 'multiple-choice', question: "Which command checks the status of files in the repository?", options: ["git log", "git status", "git diff", "git check"], correct: 1 },
    { id: 4, type: 'multiple-choice', question: "How do you create a new branch?", options: ["git checkout -b <branch>", "git branch <branch>", "git create <branch>", "git new <branch>"], correct: 0 },
    { id: 5, type: 'multiple-choice', question: "What is a merge conflict?", options: ["When two branches have the same name", "When Git cannot automatically resolve differences in code", "When a push is rejected", "When a commit is lost"], correct: 1 }
  ],
  13: [ // TypeScript Basics (MCQ)
    { id: 1, type: 'multiple-choice', question: "What is TypeScript?", options: ["A new programming language", "A superset of JavaScript with static typing", "A database", "A framework"], correct: 1 },
    { id: 2, type: 'multiple-choice', question: "How do you define an interface in TypeScript?", options: ["struct Person {}", "interface Person {}", "type Person {}", "class Person {}"], correct: 1 },
    { id: 3, type: 'multiple-choice', question: "Which symbol is used for optional properties?", options: ["!", "?", "*", "&"], correct: 1 },
    { id: 4, type: 'multiple-choice', question: "What is the 'any' type?", options: ["A type that allows any value", "A type for strings only", "A type for numbers only", "A type for functions"], correct: 0 },
    { id: 5, type: 'multiple-choice', question: "How do you compile TypeScript to JavaScript?", options: ["node file.ts", "tsc file.ts", "npm start", "java file.ts"], correct: 1 }
  ],
  14: [ // Cloud Computing Fundamentals (MCQ)
    { id: 1, type: 'multiple-choice', question: "What does IaaS stand for?", options: ["Internet as a Service", "Infrastructure as a Service", "Integration as a Service", "Identity as a Service"], correct: 1 },
    { id: 2, type: 'multiple-choice', question: "Which is a popular cloud provider?", options: ["AWS", "NPM", "Git", "MySQL"], correct: 0 },
    { id: 3, type: 'multiple-choice', question: "What is scalability in cloud computing?", options: ["The ability to increase or decrease resources as needed", "The cost of the service", "The speed of the internet", "The security level"], correct: 0 },
    { id: 4, type: 'multiple-choice', question: "What is a 'Region' in cloud terms?", options: ["A specific geographic location with data centers", "A programming language", "A type of database", "A user role"], correct: 0 },
    { id: 5, type: 'multiple-choice', question: "What is Serverless computing?", options: ["Computing without computers", "Running code without managing servers", "Using only local servers", "A deprecated technology"], correct: 1 }
  ],
  15: [ // Time Management (MCQ)
    { id: 1, type: 'multiple-choice', question: "What is the Pomodoro Technique?", options: ["A pasta recipe", "A time management method using 25-minute intervals", "A software tool", "A leadership style"], correct: 1 },
    { id: 2, type: 'multiple-choice', question: "What is the Eisenhower Matrix used for?", options: ["Prioritizing tasks based on urgency and importance", "Calculating taxes", "Scheduling meetings", "Tracking expenses"], correct: 0 },
    { id: 3, type: 'multiple-choice', question: "Which is a sign of poor time management?", options: ["Setting goals", "Procrastination", "Delegating tasks", "Taking breaks"], correct: 1 },
    { id: 4, type: 'multiple-choice', question: "What does 'Eat the Frog' mean?", options: ["Have a healthy breakfast", "Do the most difficult task first", "Avoid difficult tasks", "Take a long lunch"], correct: 1 },
    { id: 5, type: 'multiple-choice', question: "Why is multitasking often ineffective?", options: ["It saves too much time", "It reduces focus and quality of work", "It is impossible", "It is rude"], correct: 1 }
  ],
  16: [ // Leadership Essentials (MCQ)
    { id: 1, type: 'multiple-choice', question: "What is the primary role of a leader?", options: ["To give orders", "To inspire and guide a team towards a goal", "To do all the work", "To be popular"], correct: 1 },
    { id: 2, type: 'multiple-choice', question: "What is 'Servant Leadership'?", options: ["Leaders serve their own interests", "Leaders prioritize the needs of their team", "Leaders are servants", "Leaders have no authority"], correct: 1 },
    { id: 3, type: 'multiple-choice', question: "Which is a key leadership skill?", options: ["Micromanagement", "Empathy", "Arrogance", "Secrecy"], correct: 1 },
    { id: 4, type: 'multiple-choice', question: "How should a leader handle failure?", options: ["Blame others", "Learn from it and encourage the team", "Hide it", "Quit"], correct: 1 },
    { id: 5, type: 'multiple-choice', question: "What is delegation?", options: ["Assigning responsibility and authority to others", "Doing everything yourself", "Ignoring tasks", "Firing employees"], correct: 0 }
  ],
  17: [ // Data Structures: Arrays & Linked Lists (Code)
    { 
      id: 1, 
      type: 'code-challenge', 
      question: "Write a function to reverse a Linked List.",
      codeSnippet: "function reverseList(head) {\n  // Your code here\n  return null;\n}",
      explanation: "Iterate through the list, changing the 'next' pointer of each node to point to the previous node."
    },
    { 
      id: 2, 
      type: 'code-challenge', 
      question: "Write a function to find the maximum element in an array.",
      codeSnippet: "function findMax(arr) {\n  // Your code here\n  return 0;\n}",
      explanation: "Iterate through the array and keep track of the largest number found so far."
    }
  ],
  18: [ // API Design Principles (Text)
    {
      id: 1,
      type: 'text-input',
      question: "Explain the difference between REST and GraphQL.",
      correctAnswer: "REST uses standard HTTP methods and multiple endpoints. GraphQL uses a single endpoint and allows clients to request exactly the data they need.",
      explanation: "Focus on over-fetching/under-fetching and architectural styles."
    },
    {
      id: 2,
      type: 'text-input',
      question: "What is idempotency in API design?",
      correctAnswer: "An operation that can be applied multiple times without changing the result beyond the initial application (e.g., DELETE, PUT).",
      explanation: "Crucial for reliable distributed systems."
    }
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
  { id: 1, title: 'Python Basics', category: 'Technical', duration: '30 mins', questions: 5, difficulty: 'Easy', color: 'blue' },
  { id: 2, title: 'React Fundamentals', category: 'Technical', duration: '45 mins', questions: 5, difficulty: 'Medium', color: 'sky' },
  { id: 3, title: 'Node.js & Express', category: 'Technical', duration: '60 mins', questions: 5, difficulty: 'Hard', color: 'emerald' },
  { id: 4, title: 'JavaScript Advanced', category: 'Technical', duration: '50 mins', questions: 5, difficulty: 'Hard', color: 'yellow' },
  { id: 5, title: 'CSS Grid & Flexbox', category: 'Technical', duration: '30 mins', questions: 5, difficulty: 'Medium', color: 'pink' },
  { id: 6, title: 'SQL Fundamentals', category: 'Technical', duration: '40 mins', questions: 5, difficulty: 'Medium', color: 'orange' },
  { id: 7, title: 'Communication 101', category: 'Soft Skills', duration: '20 mins', questions: 5, difficulty: 'Easy', color: 'indigo' },
  { id: 8, title: 'Teamwork & Collaboration', category: 'Soft Skills', duration: '25 mins', questions: 5, difficulty: 'Medium', color: 'teal' },
  { id: 9, title: 'Problem Solving', category: 'Soft Skills', duration: '45 mins', questions: 5, difficulty: 'Hard', color: 'red' },
  { id: 10, title: 'JS Algorithms', category: 'Coding', duration: '60 mins', questions: 3, difficulty: 'Hard', color: 'violet' },
  { id: 11, title: 'System Design', category: 'Architecture', duration: '45 mins', questions: 2, difficulty: 'Medium', color: 'slate' },
  { id: 12, title: 'Git & Version Control', category: 'Technical', duration: '30 mins', questions: 5, difficulty: 'Medium', color: 'gray' },
  { id: 13, title: 'TypeScript Basics', category: 'Technical', duration: '40 mins', questions: 5, difficulty: 'Medium', color: 'blue' },
  { id: 14, title: 'Cloud Computing', category: 'Technical', duration: '50 mins', questions: 5, difficulty: 'Hard', color: 'cyan' },
  { id: 15, title: 'Time Management', category: 'Soft Skills', duration: '20 mins', questions: 5, difficulty: 'Easy', color: 'green' },
  { id: 16, title: 'Leadership Essentials', category: 'Soft Skills', duration: '30 mins', questions: 5, difficulty: 'Medium', color: 'purple' },
  { id: 17, title: 'Data Structures', category: 'Coding', duration: '60 mins', questions: 2, difficulty: 'Hard', color: 'rose' },
  { id: 18, title: 'API Design', category: 'Architecture', duration: '45 mins', questions: 2, difficulty: 'Medium', color: 'amber' }
];