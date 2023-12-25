import { useReducer } from "react";
import Option from "./components/Option";
import Operator from "./components/Operator";

export const ACTIONS = {
  ADD_DIGITS: 'add-digits',
  CHOOSE_OPERATOR: 'choose-operator',
  RESET: 'reset',
  DELETE_DIGITS: 'delete-digits',
  EVALUATE: 'evaluate',
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGITS:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATOR:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }

    case ACTIONS.RESET:
      return {}

    case ACTIONS.DELETE_DIGITS:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
      
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
      default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)

  if (isNaN(prev) || isNaN(current) || currentOperand === undefined || previousOperand === undefined) {
    return ""; // Handle the case where operands are undefined or NaN
  }

  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
    default:
      computation = ""
  }

  return computation.toString()
}


const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  switch (operand) {
    case null:
    case undefined:  // Handle undefined case
      return "";
    default:
      const [integer, decimal] = operand.split(".");
      if (decimal == null) return INTEGER_FORMATTER.format(integer);
      return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
  }
}



function App() {
  const [state, dispatch] = useReducer(reducer, {});

  return (
    <div className="min-h-screen bg-[#3a4764] w-full flex flex-col justify-center items-center">
      <div className="w-4/12 flex-col">
        <div className="w-full mb-6 justify-between flex items-end">
          <h1 className="text-white font-bold text-xl">calc</h1>
          <div className="flex gap-6 items-end">
            <h2 className="text-white font-bold text-base">THEME</h2>
            <div className="flex-col">
              <div className="flex gap-2 justify-between text-sm text-white font-semibold px-2 "><span>1</span><span>2</span><span>3</span></div>
              <div className="flex justify-between bg-[#182034] rounded-full py-1 px-2 gap-2"><span className="bg-[#d03f2f] rounded-full w-4 h-4 text-[#d03f2f] text-xs">•</span><span className="text-[#182034] bg-[#182034] text-xs">•</span><span className="text-[#182034] bg-[#182034] text-xs">•</span></div>
            </div>
          </div>
        </div>

        <div className="flex bg-[#182034] mb-6 p-4 rounded-md flex-col w-full gap-1 justify-end items-end ">
          <p className="text-3xl text-white font-extrabold">{formatOperand(state.previousOperand)} {state.operation}</p>
          <p className="text-3xl text-white font-extrabold">{formatOperand(state.currentOperand)}</p>
        </div>

        <div className="bg-[#182034] rounded-md w-full flex-col p-4">
          <div className="flex mb-4 mt-2 gap-4 justify-between items-center ">
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Option digit="7" dispatch={dispatch}/></div>
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Option digit="8" dispatch={dispatch}/></div>
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Option digit="9" dispatch={dispatch}/></div>
            <div className="w-3/12 bg-[#637097] flex justify-center rounded-md shadow p-1 cursor-pointer text-[#ffffff] text-2xl font-extrabold items-center" onClick={() => dispatch({ type: ACTIONS.DELETE_DIGITS })}>DEL</div>
          </div>
          <div className="flex mb-4 gap-4 justify-between items-center ">
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Option digit="4" dispatch={dispatch}/></div>
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Option digit="5" dispatch={dispatch}/></div>
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Option digit="6" dispatch={dispatch}/></div>
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Operator operation="+" dispatch={dispatch} /></div>
          </div>
          <div className="flex mb-4 gap-4 justify-between items-center ">
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Option digit="1" dispatch={dispatch}/></div>
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Option digit="2" dispatch={dispatch}/></div>
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Option digit="3" dispatch={dispatch}/></div>
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Operator operation="-" dispatch={dispatch} /></div>
          </div>
          <div className="flex mb-4 gap-4 justify-between items-center ">
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Option digit="." dispatch={dispatch}/></div>
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Option digit="0" dispatch={dispatch}/></div>
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Operator operation="/" dispatch={dispatch} /></div>
            <div className="w-3/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center"><Operator operation="x" dispatch={dispatch} /></div>
          </div>
          <div className="flex mb-2 gap-4 justify-between items-center ">
            <div className="w-6/12 bg-white flex justify-center rounded-md shadow p-1 cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center" onClick={() => dispatch({ type: ACTIONS.RESET })}>RESET</div>
            <div className="w-6/12 bg-white flex justify-center rounded-md shadow p-1  cursor-pointer text-[#444b5a] text-2xl font-extrabold items-center" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</div>
          </div>
        </div>
      </div>   
    </div>
  );
}

export default App;
