---
title: "State"
letter: "S"
categories:
  - "design-patterns"
shortDefinition: "A behavioral pattern that allows an object to alter its behavior when its internal state changes, appearing to change its class."
---

## Why does it exist?

Objects that have multiple states often implement them with large `if/else` or `switch` blocks that check the current state before every operation. As states and transitions multiply, these blocks become unmaintainable. State moves each state's behavior into its own class. The context object delegates behavior to the current state object, and transitions simply replace one state object with another, keeping each state's logic isolated and the context lean.

## Practical example of use

A traffic light that behaves differently depending on whether it is red, yellow, or green, with automatic transitions.

```ts
interface TrafficLightState {
  handle(light: TrafficLight): void;
  getColor(): string;
}

class RedState implements TrafficLightState {
  getColor() { return "Red"; }
  handle(light: TrafficLight) { light.setState(new GreenState()); }
}

class GreenState implements TrafficLightState {
  getColor() { return "Green"; }
  handle(light: TrafficLight) { light.setState(new YellowState()); }
}

class YellowState implements TrafficLightState {
  getColor() { return "Yellow"; }
  handle(light: TrafficLight) { light.setState(new RedState()); }
}

class TrafficLight {
  private state: TrafficLightState = new RedState();

  setState(state: TrafficLightState) { this.state = state; }
  tick() {
    console.log(`Current: ${this.state.getColor()}`);
    this.state.handle(this);
  }
}

const light = new TrafficLight();
light.tick(); // Red → transitions to Green
light.tick(); // Green → transitions to Yellow
light.tick(); // Yellow → transitions to Red
```

## When to use

- When an object's behavior changes significantly depending on its state and there are many states
- When state-specific behavior is scattered in large conditional blocks throughout the class
- When the transitions between states are complex and need to be made explicit
- When you want to add new states without changing existing state classes or the context

## When to avoid

- When there are only two or three states with simple transitions — an `if/else` is clearer
- When state transitions are simple and linear — a state machine library or enum with a transition table is more expressive
- When the state classes end up so simple that they add classes without reducing complexity

## Trade-offs

- **Explicit state vs. class proliferation**: Each state is a separate, isolated class with its own logic, but a system with many states produces many classes.
- **Open/Closed compliance vs. transition visibility**: Adding a new state requires only a new class; removing or changing transitions requires finding and updating the relevant state classes.
- **Encapsulation vs. context coupling**: State classes often need to call methods on the context to trigger transitions, creating a bidirectional dependency.

## Common small mistakes

- Putting transition logic in the context instead of the state classes, partially defeating the purpose of the pattern
- Creating state classes that reference each other directly, tightly coupling them instead of going through the context
- Not handling all valid events in every state — missing transitions can leave the context in an unexpected state
- Forgetting to initialize the context with an initial state, causing null pointer errors on the first event
