# 🏢 Arbox Elevator Control System

A high-performance, fault-tolerant elevator management solution built with React and TypeScript. This system efficiently manages a fleet of 5 elevators across 10 floors, implementing advanced dispatching algorithms for optimal performance.

## 🚀 Quick Start

```bash
# Clone the repository
git clone [<your-repo-url>](https://github.com/uriyahav/arbox-elevator-fleet-manager.git)

# Install dependencies
npm install

# Start the application
npm start
```

## ✨ Features

- **Smart Dispatching**: Advanced weighted algorithm for optimal elevator assignment
- **Real-time Visualization**: Smooth animations showing elevator movements
- **Fault Tolerant**: Built-in error boundaries prevent system-wide failures
- **Configurable**: Easily adjust timing and behavior through constants
- **Responsive Design**: Works seamlessly across different screen sizes

## 🧠 Dispatch Algorithm

### Proactive Cost-Weighting System

Unlike basic "nearest elevator" approaches, our system evaluates multiple factors:

| Factor | Impact | Example |
|--------|--------|---------|
| Distance | Base cost | +3 floors = +3 cost |
| Status | MOVING: +2, ARRIVED: +4 | Idle elevators preferred |
| Direction | Moving away: +3 | Favors elevators moving toward call |
| Ground Floor | -0.5 | Slight preference for ground floor |

### Example Calculation
```javascript
// Elevator 1: 3 floors away, IDLE, at ground
// Elevator 2: 3 floors away, MOVING toward call
// Elevator 3: 5 floors away, IDLE

// Elevator 1 selected (lowest score)
const score1 = 3 + 0 - 0.5 = 2.5
const score2 = 3 + 2 = 5
const score3 = 5 + 0 = 5
```

## 🏗 System Architecture

### 1. State Management
- **Dual-Queue System**:
  - `elevatorCalls`: Tracks floor requests
  - `mainQueue`: Manages animation steps
- **Finite State Machine**:
  ```
  IDLE → MOVING → ARRIVED → IDLE
  ```

### 2. Performance Optimizations
- Debounced button presses
- Memoized components
- Efficient state updates
- Proper cleanup of effects and timeouts

## ⚙ Configuration

Customize in `src/component/Table.js`:

```javascript
const SECONDS_PER_FLOOR = 1000;  // Travel time between floors (ms)
const DOOR_CYCLE_TIME = 2000;    // Door open/close duration (ms)
```

## 🛡 Error Handling

The system includes a robust error boundary that:
- Catches and logs JavaScript errors
- Prevents UI crashes
- Provides user-friendly error messages
- Allows system restart on failure

## 🎨 UI/UX

- Clean, intuitive interface
- Smooth animations (1s per floor)
- Visual feedback for all states
- Accessible design

## 📊 Performance Metrics

- Near-instant response to user input
- Smooth animations at 60 FPS
- Efficient memory usage
- No memory leaks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
