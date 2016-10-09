import React from 'react';

/**
 * A debounced input field that triggers a change event to the
 * given function after a specific amount of inactivity.
 * That allows the input to detect when the user stops typing.
 *
 * This component accepts all properties an <input /> accepts
 * except for `defaultValue`.
 * You can provide an initial value with the `value` property.
 * You must provide a change handler with the `onChange` property.
 */
export default class DebouncedInput extends React.Component {

    /**
     * Creates a new DebouncedInput
     *
     * @param  {object}  props  Component properties
     */
    constructor(props) {
        super(props);

        this.state = {
            // Timeout ID
            tid: void 0,

            // Value of the input
            value: props.value || ''
        };
    }

    /**
     * Render the component
     */
    render() {
        const props = this.props;
        const { value } = this.state;

        return <input type="text"
                        className="form-control"
                        {...props}
                        value={value}
                        onChange={ this.changeTerm.bind(this) } />;
    }

    /**
     * Invoked when the user changes the input field's value
     *
     * @param  {object}  event  UI event
     */
    changeTerm(event) {
        const { value } = event.target;
        const { tid } = this.state;

        if( tid )
            clearTimeout(tid);

        this.setState({
            value,
            tid: setTimeout( this.emitChange.bind(this), 300)
        });
    }

    /**
     * Emits a change event with the term
     */
    emitChange() {
        const { value } = this.state;
        const { onChange } = this.props;

        this.setState({ tid: void 0 });

        onChange(value);
    }

    /**
     * Determines if the component should be rerendered
     *
     * @param  {object}  nextProps  Next properties
     * @param  {object}  nextState  Next state
     * @return  {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        const keys = Object.keys(nextProps);
        const { value } = this.state;

        // We only consider the search term from the state
        if( value !== nextState.value )
            return true;

        // We render if anything in the properties changed

        // > Different number of properties
        if( keys.length !== Object.keys(this.props).length )
            return true;

        // > Different properties
        const changed = keys.some( key => nextProps[key] !== this.props[key] );

        if( changed )
            return true;

        return false;
    }

    /**
     * Invoked when the component will be removed from the DOM.
     * Makes sure the timeout is cancelled
     */
    componentWillUnmount() {
        const { tid } = this.state;

        window.clearTimeout(tid);
    }
}

/**
 * Component properties
 */
DebouncedInput.propTypes = {
    /*
     * Change handler invoked after the user stops typing.
     * Will be invoked with the text.
     */
    onChange: React.PropTypes.func.isRequired,

    /*
     * Initial value
     */
    value: React.PropTypes.string
};
