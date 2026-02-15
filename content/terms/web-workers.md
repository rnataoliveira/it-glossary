---
title: "Web Workers"
letter: "W"
categories:
  - "frontend"
  - "performance"
shortDefinition: "A browser API that runs JavaScript in a background thread, keeping CPU-intensive tasks off the main thread to prevent the UI from freezing."
---

## Why does it exist?

JavaScript in the browser runs on a single main thread that is responsible for everything: executing application logic, handling user input, rendering the page, and running animations. When a CPU-intensive task like image processing, data parsing, or complex calculations runs on this thread, it blocks everything else, causing the UI to freeze and making the application feel unresponsive. Web Workers solve this by providing a separate thread where heavy computation can run without interfering with the user interface.

The main thread and the worker communicate through a message-passing API. The main thread sends data to the worker via `postMessage`, the worker processes it, and sends the result back. This model avoids shared memory concurrency issues (no race conditions or locks) while giving the application the ability to leverage multi-core processors for parallel work.

## Practical example of use

An image editing application needs to apply a blur filter to a large image. Running the pixel manipulation on the main thread would freeze the UI for several seconds. Instead, the application offloads the work to a Web Worker:

```javascript
// main.js
const worker = new Worker("worker.js");
worker.postMessage({ pixels: imageData, filter: "blur" });
worker.onmessage = (e) => {
  renderCanvas(e.data.result);
};

// worker.js
self.onmessage = (e) => {
  const { pixels, filter } = e.data;
  const result = applyFilter(pixels, filter); // CPU-heavy work
  self.postMessage({ result });
};
```

The main thread remains responsive while the worker crunches pixels in the background. The user can continue interacting with the UI, and once the worker finishes, the main thread receives the processed image data and renders it to the canvas.

## When to use

- When performing CPU-intensive tasks like image processing, video encoding, data parsing, or complex mathematical computations that would block the main thread.
- When you need to maintain a responsive UI during heavy background processing, such as syntax highlighting large documents or running client-side search indexing.
- When processing large datasets (CSV parsing, JSON transformation) that take more than a few milliseconds and would cause visible jank.
- When you want to run periodic background tasks (polling, data synchronization) without affecting animation frame rates.

## When to avoid

- When the task is lightweight and completes in a few milliseconds, because the overhead of serializing data, transferring it to the worker, and deserializing the result outweighs the benefit.
- When the task requires direct DOM access, as Web Workers cannot read or manipulate the DOM and must communicate through messages.
- When the data being transferred is very large and the serialization cost of `postMessage` would negate the threading benefit (consider `Transferable` objects in this case).
- When the application runs in environments that do not support Web Workers, though modern browser support is nearly universal.

## Trade-offs

- **Main thread freedom vs. communication overhead**: Offloading work to a worker keeps the UI responsive, but every piece of data must be serialized, transferred, and deserialized, which adds latency and memory cost.
- **Parallelism vs. complexity**: Web Workers enable parallel execution, but the message-passing model requires more code and careful coordination compared to running everything synchronously on the main thread.
- **Isolation vs. limited capabilities**: Workers run in an isolated context with no access to the DOM, `window`, or `document`, which means any results must be sent back to the main thread for rendering.

## Common small mistakes

- Sending large objects via `postMessage` without using `Transferable` objects (like `ArrayBuffer`), which causes the data to be copied instead of moved, doubling memory usage.
- Creating a new worker for every task instead of reusing a single worker instance, which wastes resources on repeated initialization.
- Not handling worker errors with `worker.onerror`, leaving failures silent and difficult to debug.
- Trying to access the DOM from within the worker, which will throw an error since `document` and `window` are not available in the worker context.
- Forgetting to terminate workers with `worker.terminate()` when they are no longer needed, leaving idle threads consuming memory.
