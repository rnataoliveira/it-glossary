---
title: "Facade"
letter: "F"
categories:
  - "design-patterns"
shortDefinition: "A structural pattern that provides a simplified interface to a complex subsystem, hiding its internal complexity from clients."
---

## Why does it exist?

Complex subsystems have many classes and dependencies. Forcing every client to understand and orchestrate all of them creates tight coupling and duplication. A Facade provides a higher-level interface that covers the most common use cases, hiding the subsystem's internal workings. Clients can use the facade for the happy path and reach into the subsystem directly only when they need advanced control.

## Practical example of use

A video conversion library has classes for codecs, audio processing, bitrate management, and container formats. Clients that just want to convert a file do not need to understand all of that.

```ts
class VideoFile { constructor(public path: string) {} }
class CodecFactory { static extract(file: VideoFile) { return "mp4codec"; } }
class AudioMixer { mix(codec: string) { return `mixed:${codec}`; } }
class VideoConverter {
  convert(file: VideoFile, format: string) { return `${file.path}.${format}`; }
}

class VideoConversionFacade {
  convert(filePath: string, targetFormat: string): string {
    const file = new VideoFile(filePath);
    const codec = CodecFactory.extract(file);
    const mixer = new AudioMixer();
    mixer.mix(codec);
    const converter = new VideoConverter();
    return converter.convert(file, targetFormat);
  }
}

// Client only uses the facade
const facade = new VideoConversionFacade();
const result = facade.convert("movie.avi", "mp4");
```

## When to use

- When you want to provide a simple interface to a complex subsystem
- When there are many dependencies between clients and the implementation classes of an abstraction
- When you want to layer a subsystem — lower layers use the subsystem directly; upper layers use the facade
- When onboarding new team members who should not need to understand the full subsystem to do simple tasks

## When to avoid

- When the facade becomes the only way to use the subsystem and blocks legitimate advanced use cases
- When the facade is so thin it adds no real simplification, just another layer of calls
- When clients need so much fine-grained control that a facade would require exposing most of the subsystem anyway

## Trade-offs

- **Simplicity for clients vs. hidden behavior**: The facade makes common tasks easy but can obscure what is happening internally, making debugging harder.
- **Reduced coupling vs. single point of change**: Clients are decoupled from the subsystem, but the facade becomes a choke point when subsystem internals change.
- **Convenience vs. completeness**: The facade covers common use cases but may not expose all the subsystem's capabilities, forcing workarounds for advanced scenarios.

## Common small mistakes

- Letting the Facade accumulate business logic, turning it into a God Object
- Making the Facade the only access point, preventing clients from using the subsystem directly when needed
- Confusing Facade with Adapter — Facade simplifies a subsystem; Adapter converts one interface into another
- Not updating the Facade when the underlying subsystem changes, causing it to expose outdated behavior or fail silently
