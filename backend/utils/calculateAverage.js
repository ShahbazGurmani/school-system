function calculateAverage(grades) {
  if (!grades.length) return 0;
  const total = grades.reduce((sum, grade) => sum + grade.score, 0);
  return total / grades.length;
}

module.exports = calculateAverage; 