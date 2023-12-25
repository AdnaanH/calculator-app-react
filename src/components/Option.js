import {ACTIONS } from '../App'

export default function Option({ dispatch, digit }) {
    return (
        <div className='w-full items-center flex justify-center' onClick={() => dispatch( { type: ACTIONS.ADD_DIGITS, payload:{digit} } )}>
            {digit}
        </div>
    )
}