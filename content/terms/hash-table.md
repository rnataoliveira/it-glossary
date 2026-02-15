---
title: "Hash Table"
letter: "H"
categories:
  - "architecture"
shortDefinition: "A data structure that maps keys to values using a hash function, providing average-case constant-time lookups, insertions, and deletions."
---

## Why does it exist?

Searching for a value in an unsorted list takes O(n) time -- you may need to check every element. A sorted array improves this to O(log n) with binary search, but insertions and deletions require shifting elements. What if you need both fast lookups and fast modifications?

Hash tables solve this by computing an index directly from the key using a hash function. Instead of searching through elements, you calculate where the value should be stored and go straight there. This gives O(1) average-case time complexity for lookups, insertions, and deletions. Hash tables are so fundamental that they are built into nearly every programming language: JavaScript objects and Maps, Python dictionaries, Java HashMaps, Go maps, and Ruby hashes are all hash table implementations.

## Practical example of use

Suppose you need to count word frequencies in a document. Without a hash table, you would search a list for each word on every occurrence -- O(n) per lookup. With a hash table, each lookup and insertion is O(1) on average.

Here is a simple hash table implementation to illustrate how it works under the hood:

```typescript
class HashTable<V> {
  private buckets: Array<Array<[string, V]>>;
  private size: number;
  private count: number;

  constructor(size = 64) {
    this.size = size;
    this.count = 0;
    this.buckets = new Array(size).fill(null).map(() => []);
  }

  // Simple hash function: sum char codes and modulo bucket count
  private hash(key: string): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) {
      total = (total * 31 + key.charCodeAt(i)) % this.size;
    }
    return total;
  }

  set(key: string, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    // Check if key already exists in this bucket
    for (const entry of bucket) {
      if (entry[0] === key) {
        entry[1] = value; // update existing
        return;
      }
    }

    bucket.push([key, value]);
    this.count++;

    // Resize if load factor exceeds 0.75
    if (this.count / this.size > 0.75) {
      this.resize();
    }
  }

  get(key: string): V | undefined {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (const entry of bucket) {
      if (entry[0] === key) {
        return entry[1];
      }
    }
    return undefined;
  }

  delete(key: string): boolean {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.count--;
        return true;
      }
    }
    return false;
  }

  private resize(): void {
    const oldBuckets = this.buckets;
    this.size *= 2;
    this.count = 0;
    this.buckets = new Array(this.size).fill(null).map(() => []);

    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.set(key, value);
      }
    }
  }
}

// Usage: word frequency counter
const wordCount = new HashTable<number>();
const words = "the cat sat on the mat the cat".split(" ");

for (const word of words) {
  const current = wordCount.get(word) || 0;
  wordCount.set(word, current + 1);
}

console.log(wordCount.get("the")); // 3
console.log(wordCount.get("cat")); // 2
console.log(wordCount.get("dog")); // undefined
```

## When to use

- You need fast key-value lookups: caches, configuration stores, symbol tables, indexes.
- Counting occurrences (frequency maps, histograms).
- Deduplication: checking whether an element has been seen before.
- Implementing sets, where you only need to know if a key exists (the value is irrelevant).

## When to avoid

- You need ordered data or range queries (e.g., "all keys between A and M") -- use a balanced binary search tree or sorted array instead.
- Memory is extremely constrained and the overhead of buckets and load factor management is prohibitive.
- You need worst-case O(1) guarantees -- hash table worst case is O(n) when all keys collide into one bucket (though this is rare with good hash functions).
- Your keys are not easily hashable or defining equality is ambiguous.

## Trade-offs

- **Speed vs. memory**: Hash tables use more memory than arrays due to empty buckets and load factor headroom (typically 25-50% of slots are empty at any time).
- **Average vs. worst case**: O(1) average-case operations assume a good hash function and reasonable load factor. Worst case with many collisions degrades to O(n).
- **Simplicity vs. ordering**: Hash tables are simple and fast, but do not maintain insertion order or sorted order (though linked hash maps in some languages preserve insertion order).

## Common small mistakes

- Using mutable objects as keys -- if the object changes after insertion, its hash changes and the entry becomes unretrievable.
- Choosing a poor hash function that clusters keys into a few buckets, turning O(1) lookups into O(n).
- Forgetting to resize the table as the load factor grows, causing excessive collisions and degraded performance.
- Assuming hash tables maintain insertion order in languages where they do not (order depends on the language and implementation).
- Confusing hash tables with hash maps, hash sets, and dictionaries -- these are all hash-table-based structures with slightly different interfaces.
