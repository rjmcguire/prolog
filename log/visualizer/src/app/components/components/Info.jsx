var React = require('react');
var Classable = require('../../mixins/classable.js');
var assign = require('object-assign');

var CodeMirror = require('react-code-mirror');
var ohm = require('../../libs/ohm.min.js');

var EditorStore = require('../../stores/EditorStore.js');
var EditorActionCreators = require('../../actions/EditorActionCreators.js');

function getStateFromStores() {
  return {
    text : EditorStore.getText(),
    traceIter: EditorStore.getTraceIter(),
  };
}

var Info = React.createClass({
  mixins: [Classable],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    EditorStore.addChangeListener(this._onChange);
    // this.refs.codeMirror.editor.on('cursorActivity', this.handleCursorActivity);
  },

  componentWillUnmount: function() {
    EditorStore.removeChangeListener(this._onChange);
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    var newState = getStateFromStores();
    this.setState(newState);
  },

  propTypes: {
    // value: React.PropTypes.string.isRequired,
  },

  componentDidUpdate: function() {
  },

  onEditorTextChange: function(e) {
    EditorActionCreators.changeText(e.target.value);
  },

  render: function() {
    var classes = this.getClasses('info', {
    });

    var props = {
      lineWrapping: true,
      viewportMargin: Infinity,
      lineNumbers: true,
      onChange: this.onEditorTextChange,
      defaultValue: this.state.text,
    };

// <div className="mid"><CodeMirror ref="codeMirror" {...props}/></div>

    var info = <p>Failed to unify.</p>;
    var traceIter = this.state.traceIter;
    if (traceIter) {
      var trace = traceIter.getCurrentTrace();
      if (trace && trace.currentEnv) {
        info = <div>
            <p>goals: {JSON.stringify(trace.currentEnv.goals)}</p>
            <p>subst: {JSON.stringify(trace.currentEnv.subst)}</p>
                </div>;
      }
    }

    return (
      <div className={classes} >
        {info}
      </div>
      );
    }
});

module.exports = Info;
