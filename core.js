// import { reduce } from './reducer.js'
export default function html([first, ...strings], ...values) {
    return values
        .reduce((acc, cur) => acc.concat(cur, strings.shift()), [first])
        .filter(x => (x && x !== true) || x === 0)
        .join('');
}

export function createStore(reducer) {
    let state = reducer();
    const roots = new Map();

    function render() {
        for (const [root, compoment] of roots) {
            const ouput = compoment();
            root.innerHTML = ouput;
        }
    }
    return {
        attach(compoment, root) {
            roots.set(root, compoment);
            render();
        },
        connect(selector = (state) => state) {
            return (compoment) =>
                (props, ...args) =>
                    compoment(Object.assign({}, props, selector(state), args));
        },
        dispatch(action, ...args) {
            state = reducer(state, action, ...args);
            render();
        },
    };
}
