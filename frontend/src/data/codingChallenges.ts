export type CodingChallenge = {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  functionName: string;
  tags: string[];
  testCases: { id: string; args: any[]; expected: any; hint?: string }[];
  constraints: string[];
};

export const codingChallenges: CodingChallenge[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Return indices of the two numbers such that they add up to a target.',
    functionName: 'twoSum',
    starterCode: `function twoSum(nums, target) {
  // nums: number[], target: number
  // return [i, j] such that nums[i] + nums[j] === target
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}
`,
    tags: ['arrays', 'hashmap'],
    constraints: [
      '1 <= nums.length <= 10^4',
      'Only one valid answer exists',
      'Return indices in any order'
    ],
    testCases: [
      { id: 'a', args: [[2,7,11,15], 9], expected: [0,1] },
      { id: 'b', args: [[3,2,4], 6], expected: [1,2] },
      { id: 'c', args: [[3,3], 6], expected: [0,1] }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    description: 'Given a string containing (), {}, [], determine if it is valid.',
    functionName: 'isValid',
    starterCode: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else {
      const top = stack.pop();
      if (top !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}
`,
    tags: ['stack', 'strings'],
    constraints: [
      '1 <= s.length <= 10^4',
      'String contains only parentheses characters'
    ],
    testCases: [
      { id: 'a', args: ['()'], expected: true },
      { id: 'b', args: ['()[]{}'], expected: true },
      { id: 'c', args: ['(]'], expected: false },
      { id: 'd', args: ['{[]}'], expected: true }
    ]
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Hard',
    description: 'Find the length of the longest substring without repeating characters.',
    functionName: 'lengthOfLongestSubstring',
    starterCode: `function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (seen.has(ch) && seen.get(ch) >= left) {
      left = seen.get(ch) + 1;
    }
    seen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
`,
    tags: ['sliding-window', 'hashmap'],
    constraints: ['0 <= s.length <= 10^5'],
    testCases: [
      { id: 'a', args: ['abcabcbb'], expected: 3 },
      { id: 'b', args: ['bbbbb'], expected: 1 },
      { id: 'c', args: ['pwwkew'], expected: 3 },
      { id: 'd', args: [''], expected: 0 }
    ]
  }
];
