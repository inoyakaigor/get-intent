window.ee = new EventEmitter();

var App = React.createClass({
	getInitialState: function() {
		return {
			repos: [],
			lastRep: null
		};
	},
	componentDidMount: function() {
		if (!this.state.repos.length) this.getRepos();
		window.ee.addListener('repos.add' , function(repos) {
			var nextRepos = this.state.repos.concat(repos);
			this.setState({
				repos: nextRepos,
				lastRep: nextRepos[nextRepos.length-1].id
			});
		}.bind(this));

		window.ee.addListener('repos.get' , function() {
			this.getRepos();
		}.bind(this));
	},
	componentWillUnmount: function() {
		window.ee.removeListener('repos.add');
		window.ee.removeListener('repos.get');
	},
	getRepos: function () {
		var lastRep = this.state.lastRep;
	  var url = "https://api.github.com/repositories";

	  if (lastRep) url += "?since=" + lastRep;
	  ajax(url).then(
	    resolve,
	    error => console.warn(error)
	  )
	},
	render: function() {
		if (this.state.repos.length === 0) {
			return (
				<img src="http://mtddom.ru/bitrix/templates/mtddom/images/loading.gif" className="loading" />
			);
		} else {
			var repos = this.state.repos;
			var reposTemplate = repos.map(function(item, index) {
				return (
						<Repo key={index} item={item}/>
				)
			});
			return (
				<div>
					{reposTemplate}
				</div>
			);
		}
	}
});

ReactDOM.render(
	<App />,
	document.querySelector('#root')
);

var Repo = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
	  return nextProps.item.id !== this.props.item.id;
	},
	render: function() {
		return (
			<div className="repo">
				<Owner owner={this.props.item.owner} /> / <LinkRepo data={this.props.item} />
			</div>
		)
	}
});

var Owner = React.createClass({
	render: function() {
		var owner = this.props.owner;
		return (
			<a href={"https://github.com/" + owner.login}><img className="avatar" src={owner.avatar_url} />{owner.login}</a>
		)
	}
});

var LinkRepo = React.createClass({
	render: function() {
		var data = this.props.data;
		return (
			<a href={data.html_url}>{data.name}</a>
		)
	}
});