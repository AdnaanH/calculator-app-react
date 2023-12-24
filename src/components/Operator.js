import {ACTIONS} from '../App'

export default function Operator({dispatch, operation}) {
    return (
        <div onClick={() => dispatch({type: ACTIONS.CHOOSE_OPERATOR, payload: {operation}})}>
            {operation}
        </div>
    )
}