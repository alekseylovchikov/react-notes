var Note = React.createClass({
	render() {
		var style = {
			backgroundColor: this.props.color
		};
		return (
			<div className="note grid-item" style={style}>
                <span className="delete" onClick={this.props.onDelete}>x</span>
				{this.props.children}
			</div>
		);
	}
});

var NoteEditor = React.createClass({
	getInitialState() {
	    return {
	        text: ''  
	    };
	},

    handleChange() {
        this.setState({
            text: this.refs.noteText.value
        });
    },

    handleNoteAdd() {
        let colors = ['#16a085', '#27ae60', '#2980b9', '#2c3e50', '#f39c12'];
        let randomColor = colors[Math.floor((Math.random() * colors.length - 1) + 1)];
        var newNote = {
            text: this.state.text,
            color: randomColor,
            id: Date.now()
        };

        if (this.state.text !== '') {
            this.props.onNoteAdd(newNote);
            this.setState({
                text: ''
            });
        }
    },

	render() {
		return (
			<div className="note-editor">
				<textarea
					placeholder="Enter your note..."
                    rows={5}
                    ref="noteText"
                    value={this.state.text}
                    onChange={this.handleChange}
                />
				<button className="add-btn" onClick={this.handleNoteAdd}>ADD</button>
			</div>
		);
	}
});

var NotesGrid = React.createClass({
	componentDidMount() {
		this.msnry = new Masonry(this.refs.notesGrid, {
  			itemSelector: '.grid-item',
			gutter: 10,
			isFitWidth: true
		});
	},

    componentDidUpdate(prevProps) {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

	render() {
        var onNoteDelete = this.props.onNoteDelete;
		return (
			<div className="notes-grid" ref="notesGrid">
				{this.props.notes.map(function(note) {
					return (
                        <Note
                            key={note.id}
                            color={note.color}
                            onDelete={onNoteDelete.bind(null, note)}
                        >
                            {note.text}
                        </Note>
                    );
				})}
			</div>
		);
	}
});

var App = React.createClass({
	getInitialState() {
	    return {
	        notes: []
	    };
	},

    componentDidMount() {
        var localNotes = JSON.parse(localStorage.getItem('notes'));

        if (localNotes) {
            this.setState({
                notes: localNotes
            });
        }
    },

    componentDidUpdate() {
        this._updateLocalStorage();
    },

    handleDeleteNote(note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter((el) => {
            return el.id !== noteId;
        });
        this.setState({
            notes: newNotes
        });
    },

    handleAddNote(note) {
        var newNotes = this.state.notes.slice();
        newNotes.unshift(note);
        this.setState({
            notes: newNotes
        });
    },

	render() {
		return (
			<div className="notes-app">
				<NoteEditor onNoteAdd={this.handleAddNote} />
				<NotesGrid notes={this.state.notes} onNoteDelete={this.handleDeleteNote} />
			</div>
		);
	},

    _updateLocalStorage() {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    }
});

ReactDOM.render(<App />, document.getElementById('app'));