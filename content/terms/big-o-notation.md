---
title: "Big O Notation"
letter: "B"
categories:
  - "architecture"
  - "performance"
shortDefinition: "A mathematical notation that describes the upper bound of an algorithm's time or space complexity as input size grows."
---

## Why does it exist?

When choosing between algorithms, developers need a way to compare their efficiency that is independent of hardware, language, or implementation details. Big O notation provides exactly that — a standardized way to express how an algorithm's resource consumption (time or memory) scales as the input size grows. It strips away constants and lower-order terms to focus on the dominant growth factor, making it possible to predict whether an algorithm will hold up when the dataset goes from 1,000 rows to 10 million.

## Practical example of use

A developer is building a search feature for an e-commerce catalog with 2 million products. The initial implementation iterates through every product to find matches — O(n) per query. Profiling shows that under load, search latency exceeds acceptable thresholds. By switching to a pre-built search index backed by a hash map for exact matches (O(1) average lookup) or a balanced tree for range queries (O(log n)), the developer reduces per-query time from milliseconds that scale linearly with catalog size to near-constant time, regardless of how many products are added.

## When to use

- When comparing two or more algorithms that solve the same problem to decide which scales better
- When estimating whether a solution will meet performance requirements as data grows by orders of magnitude
- When communicating performance characteristics in design documents, code reviews, or technical interviews
- When identifying bottlenecks — recognizing that a nested loop over two collections is O(n * m) helps pinpoint why a feature slows down with larger inputs

## When to avoid

- When the input size is small and fixed — the constant factors Big O ignores can matter more than the growth rate for datasets of a few hundred items
- When micro-optimizing code where profiling shows the actual bottleneck is I/O, network latency, or cache behavior rather than algorithmic complexity
- When using Big O as the sole decision criterion, ignoring practical factors like code readability, implementation time, and real-world data distribution

## Trade-offs

- **Time complexity vs. Space complexity**: Algorithms with better time complexity often use more memory (e.g., hash tables achieve O(1) lookup but consume more space than sorted arrays with O(log n) binary search)
- **Worst-case clarity vs. Average-case relevance**: Big O describes the upper bound, which provides a safety guarantee, but average-case or amortized analysis often reflects real-world performance more accurately (e.g., quicksort is O(n^2) worst case but O(n log n) average)
- **Simplicity of analysis vs. Real performance**: Big O drops constants and lower-order terms for clarity, but in practice an O(n) algorithm with a large constant can be slower than an O(n log n) algorithm for realistic input sizes

## Common small mistakes

- Assuming O(1) means "fast" — it means constant time, but that constant could be large (e.g., a hash function that takes 10ms per call)
- Ignoring the space complexity of a solution and only analyzing time, leading to out-of-memory errors in production
- Treating Big O as an exact performance prediction rather than an asymptotic growth description — it tells you how performance scales, not the absolute execution time
- Overlooking hidden loops inside library calls — calling `.contains()` on an unsorted list inside a loop turns an apparent O(n) algorithm into O(n^2)
