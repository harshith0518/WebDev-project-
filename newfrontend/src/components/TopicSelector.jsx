// src/components/TopicSelector.jsx
import React from 'react';
import Select from 'react-select';

const allTopics = [
  'Greedy', 'DP', 'Graphs', 'Trees', 'Math', 'Sorting',
  'Geometry', 'Strings', 'Backtracking', 'Bit Manipulation', 'Binary Search',
];

const topicOptions = allTopics.map((topic) => ({ value: topic, label: topic }));

const TopicSelector = ({ selectedTopics, onChange }) => {
  const handleChange = (selectedOptions) => {
    const topicsString = selectedOptions.map(opt => opt.value).join(', ');
    onChange(topicsString);
  };

  return (
    <div className="mt-4">
      <label className="text-sm font-semibold text-yellow-300 block mb-1">Preferred Topics</label>
      <Select
        isMulti
        options={topicOptions}
        placeholder="Search & select topics..."
        className="text-black"
        onChange={handleChange}
        defaultValue={selectedTopics.split(', ').map(t => ({ value: t, label: t }))}
      />
    </div>
  );
};

export default TopicSelector;
