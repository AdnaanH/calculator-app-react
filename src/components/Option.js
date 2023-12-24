import {ACTIONS } from '../App'

export default function Option({ dispatch, digit }) {
    return (
        <div onClick={() => dispatch( { type: ACTIONS.ADD_DIGITS, payload:{digit} } )}>
            {digit}
        </div>
    )
}