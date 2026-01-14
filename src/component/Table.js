import React, { useState, useEffect, useCallback } from 'react';
import './Table.css';
import ElevatorButton from './ElevatorButtons';
import ElevatorIcon from './ElevatorIcon';
import { calculateElevatorCost } from '../utils/elevatorManager';

const INITIAL_ELEVATORS = Array(5).fill(null).map((_, index) => ({
  id: index,
  floor: 0,
  free: true,
  status: 'IDLE',
  color: "black"
}));

/**
 * BEST PRACTICE: Moving Table definition outside to prevent 
 * unmounting/blinking during state updates.
 */
function ElevatorTable({ elevators, buttons, addCallToQueue, floorLabel }) {
  return (
    <table>
      <tbody>
        {Array(10).fill().map((_, i) => {
          const floor = 9 - i;
          return (
            <tr key={floor}>
              <td className="floorLabel">{floorLabel(floor)}</td>
              {elevators.map((el, col) => (
                <td className="cell" key={col}>
                  {el.floor === floor && <ElevatorIcon color={el.color} />}
                </td>
              ))}
              <td className="callButton">
                <ElevatorButton floor={floor} text={buttons[floor]} handleElevatorCall={addCallToQueue} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Table() {
  const [elevatorCalls, updateElevatorCalls] = useState([]);
  const [mainQueue, updateMainQueue] = useState([]);
  const [buttons, updateButtons] = useState(Array(10).fill('Call'));
  const [elevators, updateElevators] = useState(INITIAL_ELEVATORS);

  const SECONDS_PER_FLOOR = 1000;
  const DOOR_CYCLE_TIME = 2000;

  // 1. ARRIVAL EFFECT: Includes Cleanup to prevent memory leaks
  useEffect(() => {
    const timers = [];
    elevators.forEach((ele, idx) => {
      if (ele.status === 'ARRIVED') {
        const timer = setTimeout(() => {
          updateElevatorStatus(idx, 'IDLE', true);
          updateButtons(prev => prev.map((txt, i) => i === ele.floor ? 'Call' : txt));
        }, DOOR_CYCLE_TIME);
        timers.push(timer);
      }
    });
    return () => timers.forEach(t => clearTimeout(t));
  }, [elevators]);

  // 2. MOVEMENT ANIMATION: Handled via Step-Buffer
  useEffect(() => {
    let active = true;
    const processQueue = async () => {
      if (mainQueue.length === 0 || !active) return;
      const curr = mainQueue[0];
      
      await new Promise(res => setTimeout(res, 200));
      if (!active) return;

      updateElevators(prev => prev.map((ele, i) => 
        i === curr.num ? { ...ele, floor: curr.floor } : ele
      ));
      updateMainQueue(prev => prev.slice(1));
    };
    processQueue();
    return () => { active = false; };
  }, [mainQueue]);

  // 3. DISPATCHER: Efficiently maps pending calls to free elevators
  useEffect(() => {
    const freeElevator = elevators.find(ele => ele.free);
    if (elevatorCalls.length > 0 && freeElevator) {
      const nextFloor = elevatorCalls[0];
      updateElevatorCalls(prev => prev.slice(1));
      calculateOptimalElevator(nextFloor);
    }
  }, [elevatorCalls, elevators]);

  const calculateOptimalElevator = (targetFloor) => {
    let elevatorIndex = null;
    let minScore = Infinity;

    elevators.forEach((ele, i) => {
      if (ele.free) {
        const score = calculateElevatorCost(ele, targetFloor, elevators);
        if (score < minScore) {
          minScore = score;
          elevatorIndex = i;
        }
      }
    });

    if (elevatorIndex !== null) {
      const currentFloor = elevators[elevatorIndex].floor;
      const distance = Math.abs(targetFloor - currentFloor);

      handleCountdown(targetFloor, distance);

      const steps = Array(distance).fill().map((_, i) => ({
        num: elevatorIndex,
        floor: currentFloor < targetFloor ? currentFloor + i + 1 : currentFloor - i - 1
      }));
      updateMainQueue(prev => [...prev, ...steps]);

      updateElevatorStatus(elevatorIndex, 'MOVING', false);

      setTimeout(() => {
        new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3').play().catch(() => {});
        updateButtons(prev => prev.map((txt, i) => i === targetFloor ? 'Arrived' : txt));
        updateElevatorStatus(elevatorIndex, 'ARRIVED', false);
      }, distance * SECONDS_PER_FLOOR);
    }
  };

  const updateElevatorStatus = (index, status, isFree) => {
    updateElevators(prev => prev.map((e, i) => 
      i === index ? { 
        ...e, 
        status, 
        free: isFree, 
        color: status === 'ARRIVED' ? "#2ecc71" : status === 'MOVING' ? "#e74c3c" : "black" 
      } : e
    ));
  };

  const handleCountdown = (floor, distance) => {
    if (distance === 0) {
      updateButtons(prev => prev.map((txt, i) => i === floor ? 'Waiting' : txt));
      return;
    }
    let timeLeft = distance;
    const timer = setInterval(() => {
      timeLeft -= 1;
      updateButtons(prev => prev.map((txt, i) => i === floor ? (timeLeft > 0 ? `${timeLeft} sec` : 'Arrived') : txt));
      if (timeLeft <= 0) clearInterval(timer);
    }, 1000);
  };

  const floorLabel = (f) => f === 0 ? 'Ground Floor' : f === 1 ? '1st' : `${f}th`;

  // 4. CALL DEDUPLICATION: Prevents button spamming/double queueing
  const addCallToQueue = (floor) => {
    if (buttons[floor] !== 'Call') return;
    if (elevatorCalls.includes(floor)) return;
    updateElevatorCalls(prev => [...prev, floor]);
  };

  return (
    <div className="building-container">
      <ElevatorTable 
        elevators={elevators} 
        buttons={buttons} 
        addCallToQueue={addCallToQueue} 
        floorLabel={floorLabel}
      />
    </div>
  );
}