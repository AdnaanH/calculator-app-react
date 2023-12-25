import {ACTIONS} from '../App'

export default function Operator({dispatch, operation}) {
    return (
        <div w-full items-center flex justify-center onClick={() => dispatch({type: ACTIONS.CHOOSE_OPERATOR, payload: {operation}})}>
            {operation}
        </div>
    )
}