const codingChallenges = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Return indices of the two numbers such that they add up to a target.',
    functionName: 'twoSum',
    starterCode: `function twoSum(nums, target) {
  // TODO: return indices [i, j] where nums[i] + nums[j] === target
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
      { id: 'a', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { id: 'b', args: [[3, 2, 4], 6], expected: [1, 2] },
      { id: 'c', args: [[3, 3], 6], expected: [0, 1] }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    description: 'Given a string containing (), {}, [], determine if it is valid.',
    functionName: 'isValid',
    starterCode: `function isValid(s) {
  // TODO: return true if brackets are balanced
  return false;
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
  // TODO: return length of longest substring without repeating characters
  return 0;
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

export default codingChallenges;
