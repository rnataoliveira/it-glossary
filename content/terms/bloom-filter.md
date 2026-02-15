---
title: "Bloom Filter"
letter: "B"
categories:
  - "architecture"
  - "data"
shortDefinition: "A space-efficient probabilistic data structure that can quickly test whether an element is definitely not in a set or possibly in a set."
---

## Why does it exist?

Checking membership in a large set is a common operation -- does this username already exist? Has this URL been crawled? Is this IP on a blocklist? With millions or billions of entries, storing the full set in memory or querying a database for every check is either too expensive or too slow.

Bloom filters offer a trade-off: they use a fraction of the memory a full set would require and answer membership queries in constant time. The catch is that they can produce false positives ("this element might be in the set") but never false negatives ("this element is definitely not in the set"). For many use cases, this is an excellent deal -- you use the Bloom filter to avoid expensive lookups for items that are definitely absent, and only perform the full check when the filter says "maybe."

## Practical example of use

A web crawler maintains a set of billions of visited URLs. Before adding a new URL to the crawl queue, it needs to check if the URL has already been visited. Storing all URLs in a hash set would consume hundreds of gigabytes of memory. Instead, a Bloom filter uses just a few gigabytes and answers "definitely not visited" or "possibly visited" in microseconds. When the filter says "not visited," the crawler queues the URL. When it says "possibly visited," the crawler checks the actual database -- but this expensive check only happens for the small percentage of false positives.

```python
import hashlib
from bitarray import bitarray


class BloomFilter:
    def __init__(self, size: int, num_hashes: int):
        """
        Args:
            size: Number of bits in the bit array.
            num_hashes: Number of hash functions to use.
        """
        self.size = size
        self.num_hashes = num_hashes
        self.bit_array = bitarray(size)
        self.bit_array.setall(0)

    def _hashes(self, item: str) -> list[int]:
        """Generate multiple hash positions using double hashing."""
        h1 = int(hashlib.sha256(item.encode()).hexdigest(), 16)
        h2 = int(hashlib.md5(item.encode()).hexdigest(), 16)
        return [(h1 + i * h2) % self.size for i in range(self.num_hashes)]

    def add(self, item: str) -> None:
        """Add an item to the Bloom filter."""
        for pos in self._hashes(item):
            self.bit_array[pos] = 1

    def might_contain(self, item: str) -> bool:
        """
        Check if an item might be in the set.
        Returns False  -> definitely not in the set.
        Returns True   -> possibly in the set (may be a false positive).
        """
        return all(self.bit_array[pos] for pos in self._hashes(item))


# Usage
bf = BloomFilter(size=1_000_000, num_hashes=7)

# Add visited URLs
bf.add("https://example.com/page-1")
bf.add("https://example.com/page-2")

# Check new URLs before crawling
url = "https://example.com/page-3"
if not bf.might_contain(url):
    print(f"Definitely new, queue for crawling: {url}")
else:
    print(f"Possibly visited, check database: {url}")
```

## When to use

- You need to test set membership for a very large dataset and memory is a constraint.
- False positives are acceptable but false negatives are not (e.g., cache lookup avoidance, spam filtering, duplicate detection).
- You want to reduce expensive disk or network lookups by quickly filtering out items that are definitely absent.
- Databases like Cassandra and HBase use Bloom filters internally to avoid unnecessary disk reads for non-existent keys.

## When to avoid

- You need exact membership testing with zero false positives -- use a hash set or database instead.
- You need to delete elements from the set (standard Bloom filters do not support deletion; use a Counting Bloom Filter for that).
- The set is small enough to fit comfortably in a regular hash set, making the probabilistic trade-off unnecessary.
- You need to enumerate or iterate over the elements in the set -- Bloom filters only answer "is this in the set?"

## Trade-offs

- **Memory efficiency vs. false positives**: A smaller bit array uses less memory but increases the false positive rate. The relationship is tunable: more bits and more hash functions reduce false positives.
- **Speed vs. precision**: Bloom filter lookups are O(k) where k is the number of hash functions (effectively constant), but they sacrifice certainty for speed.
- **Simplicity vs. mutability**: The basic Bloom filter is extremely simple, but it does not support deletions. Variants like Counting Bloom Filters or Cuckoo Filters add this capability at the cost of more memory and complexity.

## Common small mistakes

- Choosing too few bits or too few hash functions for the expected number of elements, leading to an unacceptably high false positive rate.
- Treating "might contain" as "definitely contains" and skipping the confirmation check against the authoritative data source.
- Forgetting that Bloom filters cannot be resized -- if the dataset grows beyond the original capacity, the false positive rate degrades and you must rebuild with a larger filter.
- Using non-independent hash functions, which clusters the bit positions and increases false positives beyond the theoretical rate.
- Not calculating the optimal size and number of hash functions using the formulas: `m = -(n * ln(p)) / (ln(2))^2` and `k = (m/n) * ln(2)` where n is expected elements and p is desired false positive rate.
